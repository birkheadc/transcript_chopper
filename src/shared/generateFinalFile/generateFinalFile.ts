import JSZip from "jszip";
import { promises as fs } from 'fs';
import { FinalFileFormat } from "../../types/formats/finalFileFormat";
import { FinalFileNamingScheme } from "../../types/formats/finalFileNamingScheme";
import StubRangePair from "../../types/stubRangePair/stubRangePair";
import Range from "../../types/range/range";
import chopAudio from "../chopAudio/chopAudio";

async function getAnkiReadme(): Promise<string> {
  const readmePath = 'assets/anki/anki_readme.txt';
  const contents = await fs.readFile(readmePath, { encoding: 'utf-8'});
  return contents;
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
  // Todo
}

async function readTextBlobsIntoStringArray(textBlobs: Blob[]): Promise<string[]> {
  // Todo
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
        zip.file('/audio/' + fileName + '.wav', audioBlob);
        zip.file('/text/' + fileName + '.txt', textBlob);
        break;

      case FinalFileFormat.DumpZip:
        zip.file(fileName + '.wav', audioBlob);
        zip.file(fileName + '.txt', textBlob);
        break;

      case FinalFileFormat.InterleavedZip:
        zip.file('/' + fileName + '/audio.wav', audioBlob);
        zip.file('/' + fileName + '/text.txt', textBlob);
        break;

      case FinalFileFormat.StandardAnkiCard:
      case FinalFileFormat.ClozedAnkiCard:
        const text = strings[i];
        zip.file('/audio/' + fileName + '.wav', audioBlob);
        ankiText = ankiText + '[sound:' + fileName + '.wav];' + strings[i] + '\n';
        break;

      case FinalFileFormat.Null:
        throw new Error('File Format was set to Null, it was probably not selected properly.');
      
    }
  }

  return zip;
}

export default async function generateFinalFile(originalAudioFile: File | undefined, pairs: StubRangePair[], format: FinalFileFormat, namingScheme: FinalFileNamingScheme): Promise<Blob | null> {
  if (areArgumentsValid(originalAudioFile, pairs, format, namingScheme) === false) return null;
  
  let zip = new JSZip();

  if (format === FinalFileFormat.StandardAnkiCard || format === FinalFileFormat.ClozedAnkiCard) {
    zip.file('README.txt', getAnkiReadme());
  }

  const blobs = await buildBlobs(originalAudioFile!, pairs);
  if (blobs == null) return null;

  zip = await addBlobsToZip(zip, blobs, format, namingScheme);

  return await zip.generateAsync({ type: 'blob'});
}