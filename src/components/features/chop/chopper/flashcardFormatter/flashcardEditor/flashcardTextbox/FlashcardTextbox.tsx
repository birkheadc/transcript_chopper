import * as React from 'react';
import './FlashcardTextbox.css'
import Range from '../../../../../../../types/range/range';
import AudioPlayer from '../../../audioPlayer/AudioPlayer';

interface FlashcardTextboxProps {
  audioFile: Blob,
  updateTranscript: (newText: string) => void,
  value: string,
  reset: () => void
}

/**
*
* @returns {JSX.Element | null}
*/
function FlashcardTextbox(props: FlashcardTextboxProps): JSX.Element | null {
  
  const handleCloze = () => {
    const textarea = document.querySelector('textarea#transcript-textarea') as HTMLTextAreaElement;
    if (textarea == null) return;

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