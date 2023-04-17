import * as React from 'react';
import './FinalizeSelector.css'

interface FinalizeSelectorProps {
  label: string,
  options: { label: string, value: number, hint: string }[],
  current: string,
  change: (value: string) => void
}

/**
*
* @returns {JSX.Element | null}
*/
function FinalizeSelector(props: FinalizeSelectorProps): JSX.Element | null {

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.change(event.currentTarget.value);
  }

  return (
    <div className='inline-label-input-wrapper'>
      <label htmlFor={props.label + '-select'}>{props.label}</label>
      <select id={props.label + '-select'} onChange={handleChange} value={props.current}>
      {props.options.map(
        option =>
        <option key={option.value} value={option.value}>{option.label}</option>
      )}
    </select>
    </div>
    
  );
}

export default FinalizeSelector;