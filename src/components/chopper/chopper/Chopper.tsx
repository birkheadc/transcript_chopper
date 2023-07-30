import * as React from 'react';
import './Chopper.css'
import AudioWithTranscript from '../../../types/interfaces/audioWithTranscript/audioWithTranscript';
import FileSelector from './fileSelector/FileSelector';
import Slicer from './slicer/Slicer';
import Joiner from './joiner/Joiner';
import Range from '../../../types/interfaces/range/range';
import StubAudioPair from '../../../types/interfaces/stubRangePair/stubAudioPair';
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
  const [sections, setSections] = React.useState<{audio: Blob, range: Range}[]>([]);
  const [pairs, setPairs] = React.useState<StubAudioPair[]>([]);

  const handleUpdateOriginalFile = (file: AudioWithTranscript | null) => {
    if (file == null) setOriginalFile({ audioFile: undefined, transcript: ''})
    else setOriginalFile(file);
  }

  const handleUpdateSections = async (sections: Range[]) => {
    if (originalFile.audioFile == null) return;
    sections.sort((a, b) => a.from - b.from);
    const slices: {audio: Blob, range: Range}[] | null = await chopAudio(originalFile.audioFile, sections);
    if (slices == null) return;
    setSections(slices);
    goToStep(2);
  }

  const handleSetPairs = (pairs: StubAudioPair[]) => {
    setPairs(pairs);
    goToStep(3);
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
        return <Slicer handleUpdateSections={handleUpdateSections} originalFile={originalFile} />

      case 2:
        return <Joiner handleSetPairs={handleSetPairs} originalFile={originalFile} sections={sections} />

      case 3:
        return <Finalizer handleSelectFlashcardFormat={() => goToStep(4)} pairs={pairs} />

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