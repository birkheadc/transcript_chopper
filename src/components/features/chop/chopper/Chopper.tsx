import * as React from 'react';
import './Chopper.css'
import AudioWithTranscript from '../../../../types/audioWithTranscript/audioWithTranscript';
import FileSelector from './fileSelector/FileSelector';
import { start } from 'repl';
import Slicer from './slicer/Slicer';
import Joiner from './joiner/Joiner';
import Range from '../../../../types/range/range';

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
        return <FileSelector handleContinue={() => goToStep(1)} updateOriginalFile={(file: AudioWithTranscript) => setOriginalFile(file)} originalFile={originalFile} />
    
      case 1:
        return <Slicer handleContinue={() => goToStep(2)} handleUpdateSections={(sections: Range[]) => setSections(sections)} originalFile={originalFile} />

      case 2:
        return <Joiner originalFile={originalFile} sections={sections} />
      case 3:
        return (
          <>
            <div>TEST</div>
            <div>TEST</div>
            <div>TEST</div>
            <div>TEST</div>
            <div>TEST</div>
            <div>TEST</div>
            <div>TEST</div>
            <div>TEST</div>
            <div>TEST</div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className='chopper-wrapper'>
      <div className='chopper-body'>
        {displayCurrentStep()}
      </div>
      <div className='chopper-footer'>
        <button onClick={startOver}>Start Over</button>
      </div>
    </div>
  );
}

export default Chopper;