import * as React from 'react';
import './SlicerSelector.css';
import Range from '../../../../../../types/range/range';
import SlicerCanvasDetails from '../../../../../../types/slicerCanvasDetails/slicerCanvasDetails';

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

  React.useEffect(function addPointerDragEventListeners() { 
    const container = document.querySelector('div#slicer-selector-wrapper') as HTMLDivElement;
    if (container == null) return;

    let from: number = 0;
    let to: number = 0;
  
    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true;
      from = (event.clientX - container.getBoundingClientRect().left) / (container.getBoundingClientRect().width / container.clientWidth) / container.clientWidth;
      to = (event.clientX - container.getBoundingClientRect().left) / (container.getBoundingClientRect().width / container.clientWidth) / container.clientWidth;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (isDragging === false) return;

      to = (event.clientX - container.getBoundingClientRect().left) / (container.getBoundingClientRect().width / container.clientWidth) / container.clientWidth;
      props.updateCurrentSection({ from, to });
    }

    const handleMouseLeave = (event: MouseEvent) => {
      if (isDragging === false) return;

      isDragging = false;
      to = Math.min(1.0, Math.max(0.0, (event.clientX - container.getBoundingClientRect().left) / (container.getBoundingClientRect().width / container.clientWidth) / container.clientWidth));
      if (from === to) {
        props.updateCurrentSection(undefined);
        return;
      }
      props.updateCurrentSection({ from, to });
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (isDragging === false) return; 

      isDragging = false;
      to = Math.min(1.0, Math.max(0.0, (event.clientX - container.getBoundingClientRect().left) / (container.getBoundingClientRect().width / container.clientWidth) / container.clientWidth));
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

function getSelectorDivStyle(currentSection: Range | undefined): React.CSSProperties {
  if (currentSection == null) {
    return { opacity: 0.0 }
  }
  const left = `${Math.min(currentSection.from, currentSection.to) * 100}%`;
  const right = `${100 - Math.max(currentSection.from, currentSection.to) * 100}%`;
  return {
    opacity: 0.3,
    left,
    right
  };
}

function getCanvasId(index: number): string {
  return `slicer-selector-canvas-${index}`;
}

function clearSlicerSelectorCanvases(numCanvases: number) {
  for (let i = 0; i < numCanvases; i++) {
    const canvas = document.querySelector(`canvas#${getCanvasId(i)}`) as HTMLCanvasElement;
    if (canvas == null) continue;
    const canvasContext = canvas.getContext('2d');
    if (canvasContext == null) continue;

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function highlightSelectionInSelectorCanvases(selection: Range, numCanvases: number) {
  const container = document.querySelector('div#slicer-selector-wrapper') as HTMLDivElement;
  if (container == null) return;
  const width = container.clientWidth;
  // const insetInPixels = { left: }
}