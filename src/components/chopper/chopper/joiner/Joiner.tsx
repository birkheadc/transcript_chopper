import * as React from 'react';
import './Joiner.css'
import AudioWithTranscript from '../../../../types/interfaces/audioWithTranscript/audioWithTranscript';
import StubAudioPair from '../../../../types/interfaces/stubRangePair/stubRangePair';
import AudioPlayer from '../audioPlayer/AudioPlayer';
import JoinerControls from './joinerControls/JoinerControls';
import JoinerTextEditor from './joinerTextEditor/JoinerTextEditor';

interface JoinerProps {
  originalFile: AudioWithTranscript,
  sections: Blob[],
  handleSetPairs: (pairs: StubAudioPair[]) => void,
  handleContinue: () => void
}

/**
* The combiner that the user interacts with to join transcript stubs to their respective audio snippets.
* @param {number} props.audioDuration The duration of the audio file.
* @param {AudioWithTranscript} props.originalFile The original audio file and transcript.
* @param {Range[]} props.sections The sections of the audio to split.
* @param {() => void} props.handleContinue The function to call when the user is finished.
* @returns {JSX.Element | null}
*/
function Joiner(props: JoinerProps): JSX.Element | null {

  const [currentSection, setCurrentSection] = React.useState<number>(0);
  const [pairs, setPairs] = React.useState<StubAudioPair[]>([]);

  React.useEffect(function initializeStubs() {
    const newPairs: StubAudioPair[] = [];
      for (let i = 0; i < props.sections.length; i++) {
        newPairs.push({
          stub: props.originalFile.transcript,
          audio: props.sections[i]
        });
      }
      setPairs(newPairs);
  }, [props.originalFile, props.sections]);

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

  function renderBody(): JSX.Element {
    return (props.sections == null) ? <p>There's nothing to join!</p> :
      <>
        <h2>Match each audio slice to its section of the text.</h2>
        <p>Select the correct text for this audio snippet and press `Trim` to remove everything else. Press `Reset` to reset. You may also simply edit as you see fit.</p>
        <JoinerTextEditor
          handleTrim={handleTrim}
          handleReset={handleReset}
          handleUpdateStub={handleUpdateStub}
          currentAudio={props.sections[currentSection]}
          currentText={pairs[currentSection]?.stub}
        />
        <JoinerControls currentSection={currentSection} numSections={props.sections.length} handleBack={handleBack} handleNext={handleNext} />
      </>
  }

  return (
    <div className='joiner-wrapper'>
      {renderBody()}
    </div>
  );
}

export default Joiner;