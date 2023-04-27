import JSZip from "jszip";
import { FinalFileFormat } from "../../types/formats/finalFileFormat";
import { FinalFileNamingScheme } from "../../types/formats/finalFileNamingScheme";
import StubRangePair from "../../types/stubRangePair/stubRangePair";
import Range from "../../types/range/range";
import { v4 as uuidv4 } from 'uuid';
import ankiReadme from '../../assets/anki/anki_readme.txt';
import { chopAudio } from "../chopAudio/chopAudio";

function addAnkiReadmeToZip(zip: JSZip): JSZip {
  const readmeBlob = new Blob([ankiReadme], { type: 'text/plain' });
  zip.file('README.txt', readmeBlob);
  return zip;
}

function areArgumentsValid(originalAudioFile: File | undefined, pairs: StubRangePair[], format: FinalFileFormat, namingScheme: FinalFileNamingScheme): boolean {
  if (originalAudioFile == null) return false;
  if (pairs.length < 1) return false;
  if (format === FinalFileFormat.Null) return false;
  if (namingScheme === FinalFileNamingScheme.Null) return false;

  return true;
}

async function buildData(originalAudioFile: File, pairs: StubRangePair[]): Promise<FinalFileData | null> {
  const audioSections: Range[] = [];
  const textSections: string[] = [];
  pairs.map(pair => {
    audioSections.push(pair.range);
    textSections.push(pair.stub);
  });
  const audioBlobs = await buildAudioBlobs(originalAudioFile!, audioSections);
  if (audioBlobs == null) return null;

  return { audioBlobs: audioBlobs, strings: textSections };
}

async function buildAudioBlobs(originalAudioFile: File, ranges: Range[]): Promise<Blob[] | null> {
  return await chopAudio(originalAudioFile, ranges);
}

function buildTextBlobs(stubs: string[]): Blob[] {
  const blobs: Blob[] = [];
  for (let i = 0; i < stubs.length; i++) {
    blobs.push(new Blob([stubs[i]], { type: 'text/plain'}));
  }
  return blobs;
}

function generateFileName(totalFiles: number, currentFile: number, namingScheme: FinalFileNamingScheme): string {
  switch (namingScheme) {
    case FinalFileNamingScheme.UUID:
      return uuidv4();
    case FinalFileNamingScheme.Timestamp:
      const iterator = currentFile.toString().padStart(totalFiles.toString().length, '0');
      const timestamp = new Date(Date.now()).toString().substring(0, 24);
      return `${timestamp}_${iterator}`;
    case FinalFileNamingScheme.Iterator:
      return currentFile.toString().padStart(totalFiles.toString().length, '0');
    case FinalFileNamingScheme.Null:
      throw new Error('Naming Scheme was set to Null, it was probably not selected properly.');
  }
}

async function readTextBlobsIntoStringArray(textBlobs: Blob[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const strings: string[] = [];
    let count = 0;

    function readNextFile() {
      if (count < textBlobs.length) {
        reader.onload = () => {
          if (reader.result) {
            const text = reader.result.toString();
            strings.push(text);
            count++;
            readNextFile();
          } else {
            reject('Failed to read file contents');
          }
        };
        reader.onerror = () => {
          reject(reader.error);
        };
        reader.readAsText(textBlobs[count]);
      } else {
        resolve(strings);
      }
    }
    readNextFile();
  });
}

async function addDataToZip(zip: JSZip, data: FinalFileData, format: FinalFileFormat, namingScheme: FinalFileNamingScheme): Promise<JSZip> {
  
  switch (format) {
    case FinalFileFormat.BasicZip:
    case FinalFileFormat.DumpZip:
    case FinalFileFormat.InterleavedZip:
      return await addDataToZipSimpleFileFormat(zip, data, format, namingScheme);

    case FinalFileFormat.StandardAnkiCard:
    case FinalFileFormat.ClozedAnkiCard:
      return await addDataToZipAnkiDeckAndAudioFiles(zip, data, format, namingScheme);

    case FinalFileFormat.AnkiAPKG:
      return await addDataToZipAPKGFormat(zip, data, format, namingScheme);
    
    case FinalFileFormat.Null:
      throw new Error('File Format was set to Null, it was probably not selected properly.');
  }
}

async function addDataToZipSimpleFileFormat(zip: JSZip, data: FinalFileData, format: FinalFileFormat, namingScheme: FinalFileNamingScheme): Promise<JSZip> {
  
  const textBlobs = buildTextBlobs(data.strings);
  
  for (let i = 0; i < data.audioBlobs.length; i++) {
    const audioBlob = data.audioBlobs[i];
    const textBlob = textBlobs[i];
    const fileName = generateFileName(data.audioBlobs.length, i, namingScheme);

    switch (format) {
      case FinalFileFormat.BasicZip:
        zip.file('audio/' + fileName + '.wav', audioBlob);
        zip.file('text/' + fileName + '.txt', textBlob);
        break;

      case FinalFileFormat.DumpZip:
        zip.file(fileName + '.wav', audioBlob);
        zip.file(fileName + '.txt', textBlob);
        break;

      case FinalFileFormat.InterleavedZip:
        zip.file(fileName + '/audio.wav', audioBlob);
        zip.file(fileName + '/text.txt', textBlob);
        break;
    }
  }

  return zip;
}

async function addDataToZipAnkiDeckAndAudioFiles(zip: JSZip, data: FinalFileData, format: FinalFileFormat, namingScheme: FinalFileNamingScheme): Promise<JSZip> {
  let fullText = '';

  for (let i = 0; i < data.audioBlobs.length; i++) {
    const audioBlob = data.audioBlobs[i];
    const text = data.strings[i];
    const fileName = generateFileName(data.audioBlobs.length, i, namingScheme);
  
    zip.file('audio/' + fileName + '.wav', audioBlob);
    fullText = fullText + text + ';[sound:' + fileName + '.wav]\n';
  }

  zip.file('deck.txt', new Blob([fullText], { type: 'text/plain' }));
  return zip;
}

async function addDataToZipAPKGFormat(zip: JSZip, data: FinalFileData, format: FinalFileFormat, namingScheme: FinalFileNamingScheme): Promise<JSZip> {
  // Todo
  throw new Error('APKG format not yet implemented.');
}

export default async function generateFinalFile(originalAudioFile: File | undefined, pairs: StubRangePair[], format: FinalFileFormat, namingScheme: FinalFileNamingScheme): Promise<Blob | null> {
  if (areArgumentsValid(originalAudioFile, pairs, format, namingScheme) === false) return null;
  
  let zip = new JSZip();

  if (format === FinalFileFormat.StandardAnkiCard || format === FinalFileFormat.ClozedAnkiCard) {
    zip = addAnkiReadmeToZip(zip);
  }

  const blobs = await buildData(originalAudioFile!, pairs);
  if (blobs == null) return null;

  zip = await addDataToZip(zip, blobs, format, namingScheme);

  return await zip.generateAsync({ type: 'blob'});
}

interface FinalFileData {
  audioBlobs: Blob[],
  strings: string[]
}