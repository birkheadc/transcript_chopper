import * as React from 'react';
import './Joiner.css'
import AudioWithTranscript from '../../../../../types/audioWithTranscript/audioWithTranscript';
import Range from '../../../../../types/range/range';
import playAudio from '../../../../../shared/playAudio/playAudio';

interface JoinerProps {
  originalFile: AudioWithTranscript,
  sections: Range[],
  handleContinue: () => void
}

/**
* The combiner that the user interacts with to join transcript stubs to their respective audio snippets.
* @param {AudioWithTranscript} props.originalFile The original audio file and transcript.
* @param {Range[]} props.sections The sections of the audio to split.
* @param {() => void} props.handleContinue The function to call when the user is finished.
* @returns {JSX.Element | null}
*/
function Joiner(props: JoinerProps): JSX.Element | null {

  const [currentSection, setCurrentSection] = React.useState<number>(0);
  const [stubs, setStubs] = React.useState<string[]>([]);

  React.useEffect(function initializeStubs() {
    const newStubs = [];
      for (let i = 0; i < props.sections.length; i++) {
        newStubs.push(props.originalFile.transcript);
      }
      setStubs(newStubs);
  }, [props.originalFile, props.sections]);

  React.useEffect(function playAudioWhenSectionChanges() {
    playAudio(props.originalFile.audioFile, props.sections[currentSection]);
  }, [ currentSection ]);

  const handleBack = () => {
    if (currentSection <= 0) return;
    setCurrentSection(c => c - 1);
  }

  const handleNext = () => {
    if (currentSection >= props.sections.length - 1) {
      finish();
      return;
    }
    setCurrentSection(c => c + 1);
  }

  function finish() {
    props.handleContinue();
  }

  const handlePlayAudio = () => {
    playAudio(props.originalFile.audioFile, props.sections[currentSection]);
  }

  const handleTrim = () => {
    const textarea = document.querySelector('textarea#stub-textarea') as HTMLTextAreaElement;
    if (textarea == null) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selection = textarea.value.substring(start, end);

    const newStubs = [...stubs];    
    newStubs[currentSection] = selection.toString();
    setStubs(newStubs);
  }

  const handleReset = () => {
    const newStubs = [...stubs];    
    newStubs[currentSection] = props.originalFile.transcript;
    setStubs(newStubs);
  }

  const handleUpdateStub = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const newStubs = [...stubs];
    newStubs[currentSection] = event.currentTarget.value;
    setStubs(newStubs);
  }

  return (
    <div className='joiner-wrapper'>
      <p>Select the correct text for this audio snippet and press `Trim` to remove everything else. Press `Reset` to reset. You may also simply edit as you see fit.</p>
      <div className='joiner-input-wrapper'>
        <div>
          <button onClick={handlePlayAudio}>Play Audio</button>
          <button onClick={handleTrim}>Trim</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <div className='inline-label-input-wrapper'>
          <label htmlFor='stub-textarea'>Text</label>
          <textarea id='stub-textarea' onChange={handleUpdateStub} value={stubs[currentSection]}></textarea>
        </div>
      </div>
      <div className='joiner-controls'>
        <button disabled={currentSection <= 0} onClick={handleBack}>Back</button>
        <button onClick={handleNext}>{currentSection >= props.sections.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
}

export default Joiner;