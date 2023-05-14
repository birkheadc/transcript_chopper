import JSZip from "jszip";
import { BasicFileFormat, FlashcardFileFormat } from "../../types/formats/finalFileFormat";
import { FinalFileNamingScheme } from "../../types/formats/finalFileNamingScheme";
import StubRangePair from "../../types/stubRangePair/stubRangePair";
import Range from "../../types/range/range";
import { v4 as uuidv4 } from 'uuid';
import ankiReadme from '../../assets/anki/anki_readme.txt';
import { chopAudio } from "../chopAudio/chopAudio";
import Deck from "../../types/deck/deck";
import Card from "../../types/deck/card";

async function generateBasicZipFile(originalAudioFile: File | undefined, pairs: StubRangePair[], format: BasicFileFormat, namingScheme: FinalFileNamingScheme): Promise<Blob | null> {
  if (areArgumentsValid(originalAudioFile, pairs, format, namingScheme) === false) return null;
  let zip = new JSZip();

  const blobs = await buildData(originalAudioFile!, pairs);
  if (blobs == null) return null;

  zip = await addDataToZip(zip, blobs, format, namingScheme);

  return await zip.generateAsync({ type: 'blob'});
}

async function generateFilesFromDeck(deck: Deck, format: FlashcardFileFormat): Promise<Blob | null> {
  switch (format) {

    case FlashcardFileFormat.Null:
      throw new Error('Format not selected.');

    case FlashcardFileFormat.StandardZip:
    case FlashcardFileFormat.CustomZip:
      return createZipfileFromDeck(deck);

    case FlashcardFileFormat.APKG:
      return createAPKGFileFromDeck(deck);
  }
}

export default {
  generateBasicZipFile,
  generateFilesFromDeck
}

async function createZipfileFromDeck(deck: Deck): Promise<Blob | null> {
  let zip = new JSZip();
  addAnkiReadmeToZip(zip);
  await addDeckDataToZip(deck, zip);
  return await zip.generateAsync({ type: 'blob' });
}

function createAPKGFileFromDeck(deck: Deck): Blob | null {
  // TODO
  throw new Error('Not yet implemented.');
}



//////////////////////

function addAnkiReadmeToZip(zip: JSZip): JSZip {
  const readmeBlob = new Blob([ankiReadme], { type: 'text/plain' });
  zip.file('README.txt', readmeBlob);
  return zip;
}

async function addDeckDataToZip(deck: Deck, zip: JSZip) {
  const audioBlobs = await chopAudio(deck.originalAudioFile, Array.from(deck.cards, card => card.range))
  if (audioBlobs == null || audioBlobs.length < 1) return;
  let deckText = '';
  for (let i = 0; i < audioBlobs.length; i++) {
    const fileName = generateFileName(audioBlobs.length, i, FinalFileNamingScheme.UUID) + '.wav';
    const audio = audioBlobs[i];
    const deckLine = getDecklineFromCardAndAudioFilename(deck.cards[i], fileName);
    zip.file('audio/' + fileName, audio);
    deckText = deckText + deckLine;
  }

  zip.file('deck.txt', deckText)
}

function getDecklineFromCardAndAudioFilename(card: Card, fileName: string): string {
  const SEPARATOR = ';'

  let line: string = '';

  line += `${card.transcript}`;
  line += `${SEPARATOR}[sound:${fileName}]`;
  for (let i = 0; i < card.extras.length; i++) {
    line += `${SEPARATOR}${card.extras[i]}`;
  }
  
  return line + '\n';
}

function areArgumentsValid(originalAudioFile: File | undefined, pairs: StubRangePair[], format: BasicFileFormat, namingScheme: FinalFileNamingScheme): boolean {
  if (originalAudioFile == null) return false;
  if (pairs.length < 1) return false;
  if (format === BasicFileFormat.Null) return false;
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

async function addDataToZip(zip: JSZip, data: FinalFileData, format: BasicFileFormat, namingScheme: FinalFileNamingScheme): Promise<JSZip> {
  if (format === BasicFileFormat.Null) throw new Error('File Format was set to Null, it was probably not selected properly.');
  return await addDataToZipSimpleFileFormat(zip, data, format, namingScheme);
}

async function addDataToZipSimpleFileFormat(zip: JSZip, data: FinalFileData, format: BasicFileFormat, namingScheme: FinalFileNamingScheme): Promise<JSZip> {
  
  const textBlobs = buildTextBlobs(data.strings);
  
  for (let i = 0; i < data.audioBlobs.length; i++) {
    const audioBlob = data.audioBlobs[i];
    const textBlob = textBlobs[i];
    const fileName = generateFileName(data.audioBlobs.length, i, namingScheme);

    switch (format) {
      case BasicFileFormat.BasicZip:
        zip.file('audio/' + fileName + '.wav', audioBlob);
        zip.file('text/' + fileName + '.txt', textBlob);
        break;

      case BasicFileFormat.DumpZip:
        zip.file(fileName + '.wav', audioBlob);
        zip.file(fileName + '.txt', textBlob);
        break;

      case BasicFileFormat.InterleavedZip:
        zip.file(fileName + '/audio.wav', audioBlob);
        zip.file(fileName + '/text.txt', textBlob);
        break;
    }
  }

  return zip;
}

interface FinalFileData {
  audioBlobs: Blob[],
  strings: string[]
}