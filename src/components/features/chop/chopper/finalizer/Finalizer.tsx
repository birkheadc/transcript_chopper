import * as React from 'react';
import './Finalizer.css'
import FinalizeSelector from './finalizeSelector/FinalizeSelector';
import StubRangePair from '../../../../../types/stubRangePair/stubRangePair';
import ClozeEditor from './clozeEditor/ClozeEditor';
import FileGenerator from './fileGenerator/FileGenerator';
import { FinalFileFormat } from '../../../../../types/formats/finalFileFormat';
import { FinalFileNamingScheme } from '../../../../../types/formats/finalFileNamingScheme';
import options from './options/options';

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
  const FORMAT_OPTIONS: { label: string, value: FinalFileFormat, hint: string }[] = options.FORMATS;

  const NAME_OPTIONS: { label: string, value: FinalFileNamingScheme, hint: string}[] = options.NAMES;

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