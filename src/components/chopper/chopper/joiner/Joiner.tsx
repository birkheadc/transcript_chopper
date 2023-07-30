import * as React from 'react';
import './Joiner.css'
import AudioWithTranscript from '../../../../types/interfaces/audioWithTranscript/audioWithTranscript';
import StubAudioPair from '../../../../types/interfaces/stubRangePair/stubAudioPair';
import JoinerControls from './joinerControls/JoinerControls';
import JoinerTextEditor from './joinerTextEditor/JoinerTextEditor';
import Range from '../../../../types/interfaces/range/range';

interface JoinerProps {
  originalFile: AudioWithTranscript,
  sections: {audio: Blob, range: Range}[],
  handleSetPairs: (pairs: StubAudioPair[]) => void,
}

/**
* The combiner that the user interacts with to join transcript stubs to their respective audio snippets.
* @param {AudioWithTranscript} props.originalFile The original audio file and transcript.
* @param {Blob[]} props.sections The sections of the audio to split.
* @param {(pairs: StubAudioPair[]) => void} props.handleSetPairs The function to call to set pairs when finished.
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
          audio: props.sections[i].audio,
          range: props.sections[i].range
        });
      }
      setPairs(newPairs);
  }, [props.originalFile, props.sections]);

  const handleBack = () => {
    if (currentSection <= 0) return;
    setCurrentSection(c => c - 1);
  }

  const handleNext = () => {
    if (currentSection >= pairs.length - 1) {
      finish();
      return;
    }
    const newStubs = trimNextStubToRemoveUpToCurrentStubText(pairs, currentSection);
    setPairs(newStubs);
    setCurrentSection(c => c + 1);
  }

  function finish() {
    props.handleSetPairs(pairs);
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

  const handleDelete = () => {
    if (pairs.length < 2) {
      alert("You can't delete the last section!");
      return;
    }
    const newPairs = [...pairs];
    newPairs.splice(currentSection, 1);
    setPairs(newPairs);
    if (currentSection >= newPairs.length) {
      setCurrentSection(newPairs.length - 1);
    }
  }

  const handleUpdateStub = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const newStubs = [...pairs];
    newStubs[currentSection].stub = event.currentTarget.value;
    setPairs(newStubs);
  }

  function renderBody(): JSX.Element {
    return (pairs == null || pairs.length < 1) ? <p>There's nothing to join!</p> :
      <>
        <h2>Match each audio slice to its section of the text.</h2>
        <p>Select the correct text for this audio snippet and press `Trim` to remove everything else. Press `Reset` to reset. You may also simply edit as you see fit.</p>
        <JoinerTextEditor
          handleTrim={handleTrim}
          handleReset={handleReset}
          handleDelete={handleDelete}
          handleUpdateStub={handleUpdateStub}
          currentAudio={pairs[currentSection].audio}
          currentText={pairs[currentSection].stub}
        />
        <JoinerControls currentSection={currentSection} numSections={pairs.length} handleBack={handleBack} handleNext={handleNext} />
      </>
  }

  return (
    <div className='joiner-wrapper'>
      {renderBody()}
    </div>
  );
}

export default Joiner;

function trimNextStubToRemoveUpToCurrentStubText(pairs: StubAudioPair[], currentSection: number): StubAudioPair[] {
  const newStubs = [...pairs];
  newStubs[currentSection + 1].stub = trimTextToRemoveAllBeforeOrAfterSelection(
    newStubs[currentSection + 1].stub,
    pairs[currentSection].stub,
    doPairsOverlap(pairs[currentSection], pairs[currentSection + 1]));
  return newStubs;
}

function trimTextToRemoveAllBeforeOrAfterSelection(text: string, selection: string, cutBefore: boolean): string {
  const index = text.indexOf(selection);
  if (index < 0) return text;
  if (cutBefore) return text.substring(index);
  return text.substring(index + selection.length);
}

function doPairsOverlap(a: StubAudioPair, b: StubAudioPair): boolean {
  // If range data is not included assume overlap since no (easy) way to check
  if (a.range == null || b.range == null) return false;
  return a.range.from <= b.range.to && a.range.to >= b.range.from
}