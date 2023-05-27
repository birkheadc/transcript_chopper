import * as React from 'react';
import './FlashcardTextbox.css'
import AudioPlayer from '../../../audioPlayer/AudioPlayer';

interface FlashcardTextboxProps {
  audioFile: Blob,
  updateTranscript: (newText: string) => void,
  value: string,
  reset: () => void
}

/**
* The textbox used by the flashcard editor to edit the text contents of the card.
* @param {Blob} props.audioFile The audio file associated with this card.
* @param {(string) => void} props.updateTranscript The function to call when updating the text.
* @param {string} props.value The current value of the text.
* @param {() => void} props.reset The function to call when pressing the reset button.
* @returns {JSX.Element | null}
*/
function FlashcardTextbox(props: FlashcardTextboxProps): JSX.Element | null {
  
  const handleCloze = () => {
    const newValue: string | null = convertTextareaSelectionToCloze();
    if (newValue == null) return;
    props.updateTranscript(newValue);
  }

  const handleReset = () => {
    props.reset();
  }

  const handleUpdateText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.updateTranscript(event.currentTarget.value);
  }

  return (
    <div className='flashcard-textbox-wrapper'>
      <div>
        <AudioPlayer autoplay={true} hotkey={false} audio={props.audioFile} range={{ from: 0.0, to: 1.0 }} />
        <button onClick={handleCloze}>Cloze</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className='inline-label-input-wrapper'>
        <label htmlFor='transcript-textarea'>Text</label>
        <textarea id='transcript-textarea' onChange={handleUpdateText} value={props.value}></textarea>
      </div>
    </div>
  );
}

export default FlashcardTextbox;

// Helpers

function convertTextareaSelectionToCloze(): string | null {
  const textarea = document.querySelector('textarea#transcript-textarea') as HTMLTextAreaElement;
  if (textarea == null) return null;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);

  let i = 1;
  while (textarea.value.includes('{{c' + i.toString() + '::')) {
    i++;
  }
  let cloze = '{{c' + i.toString() + '::' + textarea.value.substring(start, end) + '}}';

  const newValue = before + cloze + after;
  return newValue;
}