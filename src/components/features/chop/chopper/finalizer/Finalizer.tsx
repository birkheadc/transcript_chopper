import * as React from 'react';
import './Finalizer.css'
import FinalizeSelector from './finalizeSelector/FinalizeSelector';
import StubRangePair from '../../../../../types/stubRangePair/stubRangePair';
import ClozeEditor from './clozeEditor/ClozeEditor';
import FileGenerator from './fileGenerator/FileGenerator';
import { FinalFileFormat } from '../../../../../types/formats/finalFileFormat';
import { FinalFileNamingScheme } from '../../../../../types/formats/finalFileNamingScheme';
import options from './options/options';
import { render } from 'react-dom';

interface FinalizerProps {
  originalAudioFile: File | undefined,
  pairs: StubRangePair[],
  handleFlashcardFormat: () => void
}

/**
* The component that the user interacts with to choose how to download their files.
* @param {File} props.originalAudioFile The original audio file to chop.
* @param {Range[]} props.pairs The sections of the audio to split, and their respective strings.
* @param {() => void} props.handleFlashcardFormat The function to call to move on to flashcard formatting.
* @returns {JSX.Element | null}
*/
function Finalizer(props: FinalizerProps): JSX.Element | null {

  const FORMAT_OPTIONS: { label: string, value: FinalFileFormat, hint: string }[] = options.FORMATS;
  const NAME_OPTIONS: { label: string, value: FinalFileNamingScheme, hint: string}[] = options.NAMES;

  const [isSelectorsVisible, setSelectorsVisible] = React.useState<boolean>(false);
  const [format, setFormat] = React.useState<FinalFileFormat>(FinalFileFormat.Null);
  const [namingScheme, setNamingScheme] = React.useState<FinalFileNamingScheme>(FinalFileNamingScheme.Null);

  function renderSelectors(): JSX.Element | null {
    if (isSelectorsVisible === false) return null;
    return (
      <>
        <FinalizeSelector label='File Format' change={setFormat} current={format} options={FORMAT_OPTIONS}/>
        <FinalizeSelector label='Naming Scheme' change={setNamingScheme} current={namingScheme} options={NAME_OPTIONS} />
      </>
    ); 
  }

  function renderSubcomponent(): JSX.Element | null {
    if (format === FinalFileFormat.Null || namingScheme === FinalFileNamingScheme.Null) {
      return null;
    }
    return <FileGenerator originalAudioFile={props.originalAudioFile} pairs={props.pairs} format={format} namingScheme={namingScheme} />
  }

  return (
    <div className='finalizer-wrapper'>
      <div className='finalize-selectors'>
        <h2>Almost done. How would you like your files?</h2>
        <div className='finalizer-buttons-wrapper'>
          <button onClick={() => setSelectorsVisible(true)}>Just the Files</button>
          <button onClick={props.handleFlashcardFormat}>Formatted Into Flashcards</button>
        </div>
        {renderSelectors()}
      </div>
      {renderSubcomponent()}
    </div>
  );
}

export default Finalizer;