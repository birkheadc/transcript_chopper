import * as React from 'react';
import './FlashcardTextbox.css'
import PlayAudioButton from '../../../playAudioButton/PlayAudioButton';
import Card from '../../../../../../../types/deck/card';
import Range from '../../../../../../../types/range/range';

interface FlashcardTextboxProps {
  audioFile: File | undefined,
  range: Range,
  updateTranscript: (newText: string) => void,
  value: string,
  reset: () => void
}

/**
*
* @returns {JSX.Element | null}
*/
function FlashcardTextbox(props: FlashcardTextboxProps): JSX.Element | null {

  const updateCard = () => {

  }
  
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
        <PlayAudioButton autoplay={false} hotkey={false} range={props.range} />
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