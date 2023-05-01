import * as React from 'react';
import './FinalizeSelector.css'

interface FinalizeSelectorProps {
  label: string,
  options: { label: string, value: number, hint: string }[],
  current: number,
  change: (value: number) => void
}

/**
* The <select> elements for selecting either Format or Naming Scheme of the final output.
* @param {string} props.label The label text for the select.
* @param {{ label: string, value: number, hint: string}[]} props.options The options for this select.
* @param {number} props.current The currently selected option.
* @param {(value: number) => void} props.change The function to call when changing the option.
* @returns {JSX.Element | null}
*/
function FinalizeSelector(props: FinalizeSelectorProps): JSX.Element | null {

  // Todo: Create a custom selector, instead of a <select>, that accepts hover functionality to show a tooltip containing the option's hint text.

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.change(parseInt(event.currentTarget.value));
  }

  const handleMouseOver = () => {
    
  }

  return (
    <div className='inline-label-input-wrapper'>
      <label htmlFor={props.label + '-select'}>{props.label}</label>
      <select id={props.label + '-select'} onChange={handleChange} value={props.current}>
      {props.options.map(
        option =>
        <option key={option.value} onMouseOver={handleMouseOver} value={option.value}>{option.label}</option>
      )}
    </select>
    </div>
    
  );
}

export default FinalizeSelector;