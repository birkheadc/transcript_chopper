import * as React from 'react';
import './SlicerSectionRecorder.css'
import Range from '../../../../../types/interfaces/range/range';

interface SlicerSectionRecorderProps {
  sections: Range[],
  select: (index: number) => void
}

/**
* The component that creates a button for each section passed to it, which visually represents the range of that section, and can be clicked to reselect that section.
* @param {Range[]} props.sections The current group of selected sections.
* @param {(index: number) => void} props.select The function to call when clicking on a button, passed the index of that button's section.
* @returns {JSX.Element | null}
*/
function SlicerSectionRecorder(props: SlicerSectionRecorderProps): JSX.Element | null {

  const handleSelect = (event: React.FormEvent<HTMLButtonElement>) => {
    const index = event.currentTarget.getAttribute('data-index');
    if (index == null) return;
    props.select(parseInt(index));
  }

  return (
    <div className='slicer-section-recorder-wrapper'>
      <div className='slicer-section-recorder-inner-wrapper'>
      {props.sections.map(
        (section, index) =>
        <div className='slicer-section-recorder-section' key={index} style={{
          left: 100 * Math.min(section.from, section.to) + '%',
          right: 100 - (100 * Math.max(section.from, section.to)) + '%'
        }}>
          <button aria-label='section-select' className='slicer-section-button' data-index={index} onClick={handleSelect} onFocus={handleSelect}></button>
        </div>
      )}
      </div>
    </div>
  );
}

export default SlicerSectionRecorder;