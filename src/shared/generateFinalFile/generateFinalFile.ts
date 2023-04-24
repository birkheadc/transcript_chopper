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

async function buildBlobs(originalAudioFile: File, pairs: StubRangePair[]): Promise<{ audioBlobs: Blob[], textBlobs: Blob[] } | null> {
  const audioSections: Range[] = [];
  const textSections: string[] = [];
  pairs.map(pair => {
    audioSections.push(pair.range);
    textSections.push(pair.stub);
  });
  const audioBlobs = await buildAudioBlobs(originalAudioFile!, audioSections);
  if (audioBlobs == null) return null;
  const textBlobs = buildTextBlobs(textSections);

  return { audioBlobs, textBlobs };
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

async function addBlobsToZip(zip: JSZip, blobs: { audioBlobs: Blob[], textBlobs: Blob[] }, format: FinalFileFormat, namingScheme: FinalFileNamingScheme): Promise<JSZip> {
  // Hold my beer I'm going in.

  // Read all text blobs into strings ahead of time if required.
  let ankiText = '';
  let strings: string[] = [];
  if (format === FinalFileFormat.StandardAnkiCard || format === FinalFileFormat.ClozedAnkiCard) {
    strings = await readTextBlobsIntoStringArray(blobs.textBlobs);
  }

  for (let i = 0; i < blobs.audioBlobs.length; i++) {
    const audioBlob = blobs.audioBlobs[i];
    const textBlob = blobs.textBlobs[i];
    const fileName = generateFileName(blobs.audioBlobs.length, i, namingScheme);

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
        zip.file(fileName + 'audio.wav', audioBlob);
        zip.file(fileName + 'text.txt', textBlob);
        break;

      case FinalFileFormat.StandardAnkiCard:
      case FinalFileFormat.ClozedAnkiCard:
        const text = strings[i];
        zip.file('audio/' + fileName + '.wav', audioBlob);
        ankiText = ankiText + text + ';[sound:' + fileName + '.wav]\n';
        break;

      case FinalFileFormat.Null:
        throw new Error('File Format was set to Null, it was probably not selected properly.');
      
    }
  }

  if (format === FinalFileFormat.StandardAnkiCard || format === FinalFileFormat.ClozedAnkiCard) {
    zip.file('deck.txt', new Blob([ankiText], { type: 'text/plain' }));
  }

  return zip;
}

export default async function generateFinalFile(originalAudioFile: File | undefined, pairs: StubRangePair[], format: FinalFileFormat, namingScheme: FinalFileNamingScheme): Promise<Blob | null> {
  if (areArgumentsValid(originalAudioFile, pairs, format, namingScheme) === false) return null;
  
  let zip = new JSZip();

  if (format === FinalFileFormat.StandardAnkiCard || format === FinalFileFormat.ClozedAnkiCard) {
    zip = addAnkiReadmeToZip(zip);
  }

  const blobs = await buildBlobs(originalAudioFile!, pairs);
  if (blobs == null) return null;

  zip = await addBlobsToZip(zip, blobs, format, namingScheme);

  return await zip.generateAsync({ type: 'blob'});
}