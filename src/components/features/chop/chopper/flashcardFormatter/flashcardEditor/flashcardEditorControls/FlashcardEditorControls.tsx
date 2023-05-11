import * as React from 'react';
import './FlashcardEditorControls.css'

interface FlashcardEditorControlsProps {
  back: () => void,
  next: () => void,
  current: number,
  total: number,
  addField: () => void
}

/**
* Used to control the FlashcardEditor component.
* @param {() => void} props.back The function to call to return to the previous text.
* @param {() => void} props.next The function to call to go to the next text, or to indicate finishing the last text.
* @param {number} props.current The current text's index.
* @param {number} props.total The total number of texts.
* @param {() => void} props.addField The function to call to add a new extra field.
* @returns {JSX.Element | null}
*/
function FlashcardEditorControls(props: FlashcardEditorControlsProps): JSX.Element | null {
  return (
    <div className='flashcard-controls'>
      <button onClick={props.addField}>Add Extra Field</button>
      <div>
        <button disabled={props.current === 0} onClick={props.back}>Back</button>
        <span>{props.current + 1} / {props.total}</span>
        <button onClick={props.next}>{props.current + 1 === props.total ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
}

export default FlashcardEditorControls;