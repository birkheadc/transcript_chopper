import * as React from 'react';
import './Chopper.css'
import AudioWithTranscript from '../../../../types/audioWithTranscript/audioWithTranscript';
import FileSelector from './fileSelector/FileSelector';
import Slicer from './slicer/Slicer';
import Joiner from './joiner/Joiner';
import Range from '../../../../types/range/range';
import StubRangePair from '../../../../types/stubRangePair/stubRangePair';
import Finalizer from './finalizer/Finalizer';
import FlashcardFormatter from './flashcardFormatter/FlashcardFormatter';

interface ChopperProps {

}

/**
* The component that the user interacts with to split an audio file / transcript into multiple smaller files and transcripts.
* @returns {JSX.Element | null}
*/
function Chopper(props: ChopperProps): JSX.Element | null {

  const [step, setStep] = React.useState<number>(0);
  const [originalFile, setOriginalFile] = React.useState<AudioWithTranscript>({ audioFile: undefined, transcript: '' });
  const [sections, setSections] = React.useState<Range[]>([]);
  const [pairs, setPairs] = React.useState<StubRangePair[]>([]);

  const handleUpdateOriginalFile = (file: AudioWithTranscript) => {
    setOriginalFile(file);
  }

  const goBack = () => {
    if (step < 1) return;
    goToStep(step - 1);
  }

  const startOver = () => {
    setOriginalFile({
      audioFile: undefined,
      transcript: ''
    });
    goToStep(0);
  }

  const goToStep = (step: number) => {
    setStep(step);
  }

  function displayCurrentStep(): JSX.Element | null {
    switch (step) {
      case 0:
        return <FileSelector handleContinue={() => goToStep(1)} updateOriginalFile={handleUpdateOriginalFile} originalFile={originalFile} />
    
      case 1:
        return <Slicer handleContinue={() => goToStep(2)} handleUpdateSections={setSections} originalFile={originalFile} />

      case 2:
        return <Joiner handleContinue={() => goToStep(3)} handleSetPairs={setPairs} originalFile={originalFile} sections={sections} />

      case 3:
        return <Finalizer handleFlashcardFormat={() => goToStep(4)} originalAudioFile={originalFile.audioFile} pairs={pairs} />

      case 4:
        return <FlashcardFormatter originalAudioFile={originalFile.audioFile} pairs={pairs} />

      default:
        return null;
    }
  }

  return (
    <div className='chopper-wrapper'>
      <div className='chopper-body'>
        <audio id='audio-player'></audio>
        {displayCurrentStep()}
      </div>
      <div className='chopper-footer'>
        <button disabled={step < 1} onClick={goBack}>Go Back</button>
        <button onClick={startOver}>Start Over</button>
      </div>
    </div>
  );
}

export default Chopper;