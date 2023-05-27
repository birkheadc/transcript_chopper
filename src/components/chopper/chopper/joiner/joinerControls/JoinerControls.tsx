import * as React from 'react';
import './JoinerControls.css'

interface JoinerControlsProps {
  currentSection: number,
  numSections: number,
  handleBack: () => void,
  handleNext: () => void
}

/**
* Controls for navigating the joiner component.
* @param {number} props.currentSection The current working selection.
* @param {number} props.numSections The total number of sections.
* @param {() => void} props.handleBack The function to call when pressing the back button.
* @param {() => void} props.handleNext The function to call when pressing the next button.
* @returns {JSX.Element | null}
*/
function JoinerControls(props: JoinerControlsProps): JSX.Element | null {
  return (
    <div className='joiner-controls'>
      <button disabled={props.currentSection <= 0} onClick={props.handleBack}>Back</button>
      <span>{props.currentSection + 1} / {props.numSections}</span>
      <button onClick={props.handleNext}>{props.currentSection >= props.numSections - 1 ? 'Finish' : 'Next'}</button>
    </div>
  );
}

export default JoinerControls;