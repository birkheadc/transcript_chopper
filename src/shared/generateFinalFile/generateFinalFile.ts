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

async function addBlobsToZip(zip: JSZip, blobs: { audioBlobs: Blob[], textBlobs: Blob[] }, format: FinalFileFormat, namingScheme: FinalFileNamingScheme): Promise<JSZip> {
  // Todo
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