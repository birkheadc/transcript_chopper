import * as React from 'react';
import './Chopper.css'
import AudioWithTranscript from '../../../types/interfaces/audioWithTranscript/audioWithTranscript';
import FileSelector from './fileSelector/FileSelector';
import Slicer from './slicer/Slicer';
import Joiner from './joiner/Joiner';
import Range from '../../../types/interfaces/range/range';
import StubAudioPair from '../../../types/interfaces/stubRangePair/stubRangePair';
import Finalizer from './finalizer/Finalizer';
import FlashcardFormatter from './flashcardFormatter/FlashcardFormatter';
import { chopAudio } from '../../../helpers/chopAudio/chopAudio';

interface ChopperProps {

}

/**
* The main component of the app, which the user interacts with to split an audio file / transcript into multiple smaller files and transcripts.
* @returns {JSX.Element | null}
*/
function Chopper(props: ChopperProps): JSX.Element | null {

  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [originalFile, setOriginalFile] = React.useState<AudioWithTranscript>({ audioFile: undefined, transcript: '' });
  const [sections, setSections] = React.useState<Blob[]>([]);
  const [pairs, setPairs] = React.useState<StubAudioPair[]>([]);

  const handleUpdateOriginalFile = (file: AudioWithTranscript | null) => {
    if (file == null) setOriginalFile({ audioFile: undefined, transcript: ''})
    else setOriginalFile(file);
  }

  const handleUpdateSections = async (sections: Range[]) => {
    if (originalFile.audioFile == null) return;
    const slices: Blob[] | null = await chopAudio(originalFile.audioFile, sections);
    if (slices == null) return;
    setSections(slices);
  }

  const goBack = () => {
    if (currentStep < 1) return;
    goToStep(currentStep - 1);
  }

  const startOver = () => {
    setOriginalFile({
      audioFile: undefined,
      transcript: ''
    });
    goToStep(0);
  }

  const goToStep = (step: number) => {
    setCurrentStep(step);
  }

  function displayCurrentStep(): JSX.Element | null {
    switch (currentStep) {
      case 0:
        return <FileSelector handleContinue={() => goToStep(1)} updateOriginalFile={handleUpdateOriginalFile} originalFile={originalFile} />
    
      case 1:
        return <Slicer handleContinue={() => goToStep(2)} handleUpdateSections={handleUpdateSections} originalFile={originalFile} />

      case 2:
        return <Joiner handleContinue={() => goToStep(3)} handleSetPairs={setPairs} originalFile={originalFile} sections={sections} />

      case 3:
        return <Finalizer handleFlashcardFormat={() => goToStep(4)} pairs={pairs} />

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
        <button disabled={currentStep < 1} onClick={goBack}>Go Back</button>
        <button onClick={startOver}>Start Over</button>
      </div>
    </div>
  );
}

export default Chopper;