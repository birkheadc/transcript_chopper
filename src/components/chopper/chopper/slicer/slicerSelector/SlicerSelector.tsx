import * as React from 'react';
import './SlicerSelector.css';
import Range from '../../../../../types/interfaces/range/range';
import SlicerCanvasDetails from '../../../../../types/interfaces/slicerCanvasDetails/slicerCanvasDetails';

interface SlicerSelectorProps {
  length: number,
  details: SlicerCanvasDetails,
  currentSection: Range | undefined,
  updateCurrentSection: (selection: Range | undefined) => void
}

/**
* The component that allows the user to click and drag to select a portion of the audio file.
* @param {number} props.length How long the volume array is.
* @param {SlicerCanvasDetails} props.details The specs defining the size of the canvas
* @param {Range | undefined} props.currentSection The currently selected section, expressed as a ratio from 0.0 to 1.0.
* @param {(selection: Range) => void} props.updateCurrentSection The function this component calls when updating the selected section.
* @returns {JSX.Element | null}
*/
function SlicerSelector(props: SlicerSelectorProps): JSX.Element | null {

  let isDragging: boolean = false;

  React.useEffect(function addDragEventListeners() { 
    const container = getSlicerSelectorWrapper();
    if (container == null) return;

    let from: number = 0;
    let to: number = 0;
  
    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true;
      from = calculateCurrentMousePositionOverDiv(container, event);
      to = calculateCurrentMousePositionOverDiv(container, event);
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (isDragging === false) return;
      to = calculateCurrentMousePositionOverDiv(container, event);
      props.updateCurrentSection({ from, to });
    }

    const handleMouseLeave = (event: MouseEvent) => {
      if (isDragging === false) return;
      isDragging = false;
      to = Math.min(1.0, Math.max(0.0, calculateCurrentMousePositionOverDiv(container, event)));
      if (from === to) {
        props.updateCurrentSection(undefined);
        return;
      }
      props.updateCurrentSection({ from, to });
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (isDragging === false) return; 
      isDragging = false;
      to = Math.min(1.0, Math.max(0.0, calculateCurrentMousePositionOverDiv(container, event)));
      if (from === to) {
        props.updateCurrentSection(undefined);
        return;
      }
      props.updateCurrentSection({ from, to });
    }

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
  }, []);

  return (
    <div id='slicer-selector-wrapper'>
      <div id='slicer-selector-div' style={getSelectorDivStyle(props.currentSection)}></div>
    </div>
  );
}

export default SlicerSelector;

// Helpers

function getSelectorDivStyle(currentSection: Range | undefined): React.CSSProperties {
  if (currentSection == null) {
    return { opacity: 0.0 }
  }
  const left = `${Math.min(currentSection.from, currentSection.to) * 100}%`;
  const right = `${100 - Math.max(currentSection.from, currentSection.to) * 100}%`;
  return {
    opacity: 'var(--opac-slicer-selector)',
    left,
    right
  };
}

function getSlicerSelectorWrapper(): HTMLDivElement | null {
  return document.querySelector('div#slicer-selector-wrapper') as HTMLDivElement
}

function getDivLeftOffsetFromEvent(div: HTMLDivElement, event: PointerEvent | MouseEvent) {
  return event.clientX - div.getBoundingClientRect().left;
}

function getDivWidth(div: HTMLDivElement) {
  return div.getBoundingClientRect().width;
}

function calculateCurrentMousePositionOverDiv(div: HTMLDivElement, event: PointerEvent | MouseEvent) {
  return (getDivLeftOffsetFromEvent(div, event)) / getDivWidth(div)
}