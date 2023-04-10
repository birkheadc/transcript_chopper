import * as React from 'react';
import './SlicerSectionRecorder.css'
import Range from '../../../../../../types/range/range';

interface SlicerSectionRecorderProps {
  sections: Range[],
  canvasWidth: number,
  select: (index: number) => void
}

/**
* The component that creates a button for each section passed to it, which visually represents the range of that section, and can be clicked to reselect that section.
* @param {Range[]} props.sections The current group of selected sections.
* @param {number} props.canvasWidth The width of the SlicerImage canvas, used to calculate where to draw the buttons and how long to make them.
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
        left: props.canvasWidth * section.from + 'px', right: props.canvasWidth - (props.canvasWidth * section.to) + 'px'
      }}>
        <button className='slicer-section-button' data-index={index} onClick={handleSelect}></button>
      </div>
    )}
      </div>
    </div>
  );
}

export default SlicerSectionRecorder;