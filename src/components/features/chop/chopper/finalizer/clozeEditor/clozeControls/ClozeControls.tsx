import * as React from 'react';
import './ClozeControls.css'

interface ClozeControlsProps {
  back: () => void,
  next: () => void,
  current: number,
  total: number
}

/**
* Contains the controls for navigating the cloze editor.
* @param {() => void} props.back The function to call to return to the previous text.
* @param {() => void} props.next The function to call to go to the next text, or to indicate finishing the last text.
* @param {number} props.current The current text's index.
* @param {number} props.total The total number of texts.
* @returns {JSX.Element | null}
*/
function ClozeControls(props: ClozeControlsProps): JSX.Element | null {
  return (
    <div className='joiner-controls'>
      <button disabled={props.current === 0} onClick={props.back}>Back</button>
      <span>{props.current + 1} / {props.total}</span>
      <button onClick={props.next}>{props.current + 1 === props.total ? 'Finish' : 'Next'}</button>
    </div>
  );
}

export default ClozeControls;