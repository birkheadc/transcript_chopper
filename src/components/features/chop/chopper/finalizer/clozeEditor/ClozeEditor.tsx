import * as React from 'react';
import './ClozeEditor.css'
import FileGenerator from '../fileGenerator/FileGenerator';
import StubRangePair from '../../../../../../types/stubRangePair/stubRangePair';
import { FinalFileNamingScheme } from '../../../../../../types/formats/finalFileNamingScheme';
import { FinalFileFormat } from '../../../../../../types/formats/finalFileFormat';
import ClozeTextbox from './clozeTextbox/ClozeTextbox';
import ClozeControls from './clozeControls/ClozeControls';

interface ClozeEditorProps {
  originalAudioFile: File | undefined,
  pairs: StubRangePair[],
  namingScheme: FinalFileNamingScheme
}

/**
* The component that the user interacts with to create fill-in-the-blank style flash cards.
* @param {File} props.originalAudioFile The original audio file to chop.
* @param {Range[]} props.pairs The sections of the audio to split, and their respective strings.
* @param {FinalFileNamingScheme} props.namingScheme How to name the files.
* @returns {JSX.Element | null}
*/
function ClozeEditor(props: ClozeEditorProps): JSX.Element | null {

  const [isFinished, setFinished] = React.useState<boolean>(false);
  const [current, setCurrent] = React.useState<number>(0);
  const [newPairs, setNewPairs] = React.useState<StubRangePair[]>([]);

  React.useEffect(function setAllNewPairsToPairs() {
    const newNewPairs: StubRangePair[] = [];
    for (let i = 0; i < props.pairs.length; i++) {
      newNewPairs.push({...props.pairs[i]});
    }
    setNewPairs(newNewPairs);
  }, [ props.pairs ]);

  const handleBack = () => {
    setCurrent(current => current - 1);
    setFinished(false);
  }

  const handleNext = () => {
    if (current + 1 < props.pairs.length) {
      setCurrent(current => current + 1);
    }
    else {
      setFinished(true);
    }
  }

  const resetCurrentlySelectedStub = () => {
    const newNewPairs = [...newPairs];
    newNewPairs[current].stub = props.pairs[current].stub;
    setNewPairs(newNewPairs);
  }

  const updateCurrentlySelectedStub = (newValue: string) => {
    const newNewPairs = [...newPairs];
    newNewPairs[current].stub = newValue;
    setNewPairs(newNewPairs);
  }

  function renderEditor(): JSX.Element | null {
    if (newPairs.length < 1) return null;
    return (
      <>
        <ClozeTextbox audioFile={props.originalAudioFile} range={props.pairs[current].range} reset={resetCurrentlySelectedStub} updateStub={updateCurrentlySelectedStub} value={newPairs[current].stub} />
        <ClozeControls back={handleBack} next={handleNext} current={current} total={props.pairs.length}/>
      </>
    );
  }

  function renderFileGenerator(): JSX.Element | null {
    if (isFinished === false) {
      return null;
    }
    return <FileGenerator originalAudioFile={props.originalAudioFile} pairs={newPairs} format={FinalFileFormat.ClozedAnkiCard} namingScheme={props.namingScheme} />
  }

  return (
    <div className='joiner-wrapper'>
      <h3>Cloze Editor</h3>
      <p>Select which parts of the text you would like to Cloze.
      You may highlight a portion of the text and press `Cloze` to Cloze it. You may create multiple Cloze sections if you wish.
      You may also simply edit the text freely.
      Press `Reset` to reset the text to the values you created in the initial edit step.
      Avoid creating multiple Cloze's within each other; This usually breaks the card format in Anki.</p>
      {renderEditor()}
      {renderFileGenerator()}
    </div>
  );
}

export default ClozeEditor;