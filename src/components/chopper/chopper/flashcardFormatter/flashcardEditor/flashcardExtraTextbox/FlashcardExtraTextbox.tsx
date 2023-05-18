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
* Allows the user to modify the value of an extra field.
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
        <textarea id={getTextareaId(props.index)} onChange={handleUpdate} value={props.value}></textarea>
      </div>
    </div>
  );
}

export default FlashcardExtraTextbox;

function getTextareaId(index: number): string {
  return `extra-textarea-${index}`;
}