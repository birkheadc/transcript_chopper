import * as React from 'react';
import './FlashcardExtraTextbox.css'

interface FlashcardExtraTextboxProps {
  index: number,
  fieldName: string,
  value: string,
  update: (index: number, newValue: string) => void,
  delete: (index: number) => void
}

/**
* The textbox used by the flashcard editor to modify the value of an extra field.
* @param {number} props.index The index of this extra textbox.
* @param {string} props.fieldName The name of this extra textbox.
* @param {string} props.value The current text value of the textarea.
* @param {(number, string) => void} props.update The function to call when updating the text.
* @param {(number) => void} props.delete The function to call when pressing the delete button.
* @returns {JSX.Element | null}
*/
function FlashcardExtraTextbox(props: FlashcardExtraTextboxProps): JSX.Element | null {

  const handleDelete = () => {
    props.delete(props.index);
  }

  const handleUpdate = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.update(props.index, event.currentTarget.value);
  }

  return (
    <div className='flashcard-extra-textbox-wrapper'>
      <button onClick={handleDelete}>X</button>
      <div className='inline-label-input-wrapper'>
        <label htmlFor={getTextareaId(props.index)}>{props.fieldName}</label>
        <textarea id={getTextareaId(props.index)} onChange={handleUpdate} data-testid='flashcard-extra-textbox' value={props.value}></textarea>
      </div>
    </div>
  );
}

export default FlashcardExtraTextbox;

function getTextareaId(index: number): string {
  return `extra-textarea-${index}`;
}