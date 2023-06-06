import JSZip from "jszip";
import { BasicFileFormat, FlashcardFileFormat } from "../../types/enums/formats/finalFileFormat";
import { FinalFileNamingScheme } from "../../types/enums/formats/finalFileNamingScheme";
import StubAudioPair from "../../types/interfaces/stubRangePair/stubAudioPair";
import { v4 as uuidv4 } from 'uuid';
import ankiReadme from '../../assets/anki/anki_readme.txt';
import Deck from "../../types/interfaces/deck/deck";
import Card from "../../types/interfaces/deck/card";

async function generateBasicZipFile(pairs: StubAudioPair[], format: BasicFileFormat, namingScheme: FinalFileNamingScheme): Promise<Blob | null> {
  if (areArgumentsValid(pairs, format, namingScheme) === false) return null;
  let zip = new JSZip();

  const blobs = await buildData(pairs);
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
      return await createZipfileFromDeck(deck);

    case FlashcardFileFormat.APKG:
      return await createAPKGFileFromDeck(deck);
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

async function createAPKGFileFromDeck(deck: Deck): Promise<Blob | null> {
  // TODO Implement APKG formatting
  throw new Error('Not yet implemented.');
}



//////////////////////

function addAnkiReadmeToZip(zip: JSZip): JSZip {
  const readmeBlob = new Blob([ankiReadme], { type: 'text/plain' });
  zip.file('README.txt', readmeBlob);
  return zip;
}

async function addDeckDataToZip(deck: Deck, zip: JSZip) {
  let deckText = '';
  for (let i = 0; i < deck.cards.length; i++) {
    const fileName = generateFileName(deck.cards.length, i, FinalFileNamingScheme.UUID) + '.wav';
    const deckLine = getDecklineFromCardAndAudioFilename(deck.cards[i], fileName);
    zip.file('audio/' + fileName, deck.cards[i].audio);
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

function areArgumentsValid(pairs: StubAudioPair[], format: BasicFileFormat, namingScheme: FinalFileNamingScheme): boolean {
  if (pairs.length < 1) return false;
  if (format === BasicFileFormat.Null) return false;
  if (namingScheme === FinalFileNamingScheme.Null) return false;

  return true;
}

async function buildData(pairs: StubAudioPair[]): Promise<FinalFileData | null> {
  const audioSections: Blob[] = [];
  const textSections: string[] = [];
  pairs.map(pair => {
    audioSections.push(pair.audio);
    textSections.push(pair.stub);
  });

  return { audioBlobs: audioSections, strings: textSections };
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