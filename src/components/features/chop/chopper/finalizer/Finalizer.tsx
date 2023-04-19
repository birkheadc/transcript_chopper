import * as React from 'react';
import './Finalizer.css'
import FinalizeSelector from './finalizeSelector/FinalizeSelector';
import StubRangePair from '../../../../../types/stubRangePair/stubRangePair';
import ClozeEditor from './clozeEditor/ClozeEditor';
import FileGenerator from './fileGenerator/FileGenerator';
import { FinalFileFormat } from '../../../../../types/formats/finalFileFormat';
import { FinalFileNamingScheme } from '../../../../../types/formats/finalFileNamingScheme';

interface FinalizerProps {
  originalAudioFile: File | undefined,
  pairs: StubRangePair[]
}

/**
* The component that the user interacts with to choose how to download their files.
* @param {File} props.originalAudioFile The original audio file to chop.
* @param {Range[]} props.pairs The sections of the audio to split, and their respective strings.
* @returns {JSX.Element | null}
*/
function Finalizer(props: FinalizerProps): JSX.Element | null {

  // Todo: Find a better home for these constants.
  const FORMAT_OPTIONS: { label: string, value: FinalFileFormat, hint: string }[] = [
    {
      label: 'How would you like your files formatted?',
      value: FinalFileFormat.Null,
      hint: 'Select which format you would like to download your files as.'
    },
    {
      label: 'Basic Zip: Audio snippets in one folder, text snippets in another',
      value: FinalFileFormat.BasicZip,
      hint: ' All of your audio files will be in /audio, and all of your text will be in /text. Respective files will have the same name. (file1.wav will be the audio for file1.txt)'
    },
    {
      label: 'Dump Zip: Audio snippets and text snippets all in one folder',
      value: FinalFileFormat.DumpZip,
      hint: 'Respective files will have the same name. (file1.wav will be the audio for file1.txt)'
    },
    {
      label: 'Interleaved Zip: Audio-text pairs each in their own folder',
      value: FinalFileFormat.InterleavedZip,
      hint: 'All of your files will be separated by snippet into their own folder. (file1.wav and file1.txt will be in a folder called file1, etc.'
    },
    {
      label: 'Standard Anki Card: Text on one side, audio on the other',
      value: FinalFileFormat.StandardAnkiCard,
      hint: 'All of your audio files will be in a folder /audio. All of your text snippets will be in a semi-colon separated text file, along with references to the audio files, so that you can import to Anki.'
    },
    {
      label: 'Clozed Anki Card: Clozed text on one side, audio on the other.',
      value: FinalFileFormat.ClozedAnkiCard,
      hint: 'For making fill-in-the-blank style Anki cards. Will open the cloze editor.'
    }
  ];

  const NAME_OPTIONS: { label: string, value: FinalFileNamingScheme, hint: string}[] = [
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

  const [format, setFormat] = React.useState<FinalFileFormat>(FinalFileFormat.Null);
  const [namingScheme, setNamingScheme] = React.useState<FinalFileNamingScheme>(FinalFileNamingScheme.Null);

  function renderSubcomponent(): JSX.Element | null {
    if (format === FinalFileFormat.Null || namingScheme === FinalFileNamingScheme.Null) {
      return null;
    }
    if (format === FinalFileFormat.ClozedAnkiCard) {
      return <ClozeEditor originalAudioFile={props.originalAudioFile} pairs={props.pairs} namingScheme={namingScheme} />
    }
    return <FileGenerator originalAudioFile={props.originalAudioFile} pairs={props.pairs} format={format} namingScheme={namingScheme} />
  }

  return (
    <div className='finalizer-wrapper'>
      <div className='finalize-selectors'>
        <h2>Almost done. How would you like your files?</h2>
        <FinalizeSelector label='File Format' change={setFormat} current={format} options={FORMAT_OPTIONS}/>
        <FinalizeSelector label='Naming Scheme' change={setNamingScheme} current={namingScheme} options={NAME_OPTIONS} />
      </div>
      {renderSubcomponent()}
    </div>
  );
}

export default Finalizer;