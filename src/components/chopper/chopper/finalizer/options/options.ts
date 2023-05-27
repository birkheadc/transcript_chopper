import { BasicFileFormat } from "../../../../../types/enums/formats/finalFileFormat";
import { FinalFileNamingScheme } from "../../../../../types/enums/formats/finalFileNamingScheme";

const FORMATS: { label: string, value: BasicFileFormat, hint: string }[] = [
  {
    label: 'How would you like your files formatted?',
    value: BasicFileFormat.Null,
    hint: 'Select which format you would like to download your files as.'
  },
  {
    label: 'Basic Zip: Audio snippets in one folder, text snippets in another',
    value: BasicFileFormat.BasicZip,
    hint: ' All of your audio files will be in /audio, and all of your text will be in /text. Respective files will have the same name. (file1.wav will be the audio for file1.txt)'
  },
  {
    label: 'Dump Zip: Audio snippets and text snippets all in one folder',
    value: BasicFileFormat.DumpZip,
    hint: 'Respective files will have the same name. (file1.wav will be the audio for file1.txt)'
  },
  {
    label: 'Interleaved Zip: Audio-text pairs each in their own folder',
    value: BasicFileFormat.InterleavedZip,
    hint: 'All of your files will be separated by snippet into their own folder. (file1.wav and file1.txt will be in a folder called file1, etc.'
  }
];

const NAMES: { label: string, value: FinalFileNamingScheme, hint: string}[] = [
  {
    label: 'How would you like your files named?',
    value: FinalFileNamingScheme.Null,
    hint: 'Select how you would like your files named.'
  },
  {
    label: 'Universally Unique Identifier (Suggested)',
    value: FinalFileNamingScheme.UUID,
    hint: 'Files will be named with a uuid, which minimizes the chance of having 2 files with the same name.'
  },
  {
    label: 'Timestamp + iterator',
    value: FinalFileNamingScheme.Timestamp,
    hint: 'Files will be named with a timestamp of the current time, plus an increasing number starting from 0.'
  },
  {
    label: 'Iterator',
    value: FinalFileNamingScheme.Iterator,
    hint: 'Files will be named simply with an increasing number. i.e. 00.wav, 01.wav, etc. Not suggested if you plan on importing to Anki.'
  },
];

export default {
  FORMATS,
  NAMES
}