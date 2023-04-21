import * as React from 'react';
import './Joiner.css'
import AudioWithTranscript from '../../../../../types/audioWithTranscript/audioWithTranscript';
import Range from '../../../../../types/range/range';
import StubRangePair from '../../../../../types/stubRangePair/stubRangePair';
import PlayAudioButton from '../../playAudioButton/PlayAudioButton';

interface JoinerProps {
  originalFile: AudioWithTranscript,
  sections: Range[],
  handleSetPairs: (pairs: StubRangePair[]) => void,
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
  const [pairs, setPairs] = React.useState<StubRangePair[]>([]);

  React.useEffect(function initializeStubs() {
    const newPairs: StubRangePair[] = [];
      for (let i = 0; i < props.sections.length; i++) {
        newPairs.push({
          stub: props.originalFile.transcript,
          range: props.sections[i]
        });
      }
      setPairs(newPairs);
  }, [props.originalFile, props.sections]);

  React.useEffect(function playAudioWhenSectionChanges() {
    // Todo
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
    props.handleSetPairs(pairs);
    props.handleContinue();
  }

  const handleTrim = () => {
    const textarea = document.querySelector('textarea#stub-textarea') as HTMLTextAreaElement;
    if (textarea == null) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selection = textarea.value.substring(start, end);

    const newPairs = [...pairs];    
    newPairs[currentSection].stub = selection.toString();
    setPairs(newPairs);
  }

  const handleReset = () => {
    const newPairs = [...pairs];    
    newPairs[currentSection].stub = props.originalFile.transcript;
    setPairs(newPairs);
  }

  const handleUpdateStub = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const newStubs = [...pairs];
    newStubs[currentSection].stub = event.currentTarget.value;
    setPairs(newStubs);
  }

  return (
    <div className='joiner-wrapper'>
      <h2>Match each audio slice to its section of the text.</h2>
      <p>Select the correct text for this audio snippet and press `Trim` to remove everything else. Press `Reset` to reset. You may also simply edit as you see fit.</p>
      <div className='joiner-input-wrapper'>
        <div>
          <PlayAudioButton autoplay={true} file={props.originalFile.audioFile} range={props.sections[currentSection]}/>
          <button onClick={handleTrim}>Trim</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <div className='inline-label-input-wrapper'>
          <label htmlFor='stub-textarea'>Text</label>
          <textarea id='stub-textarea' onChange={handleUpdateStub} value={pairs[currentSection]?.stub}></textarea>
        </div>
      </div>
      <div className='joiner-controls'>
        <button disabled={currentSection <= 0} onClick={handleBack}>Back</button>
        <span>{currentSection + 1} / {props.sections.length}</span>
        <button onClick={handleNext}>{currentSection >= props.sections.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
}

export default Joiner;