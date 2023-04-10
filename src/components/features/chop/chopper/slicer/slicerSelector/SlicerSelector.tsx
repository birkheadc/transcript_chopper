import * as React from 'react';
import './SlicerSelector.css'
import Range from '../../../../../../types/range/range';
import { start } from 'repl';

interface SlicerSelectorProps {
  currentSection: Range | undefined,
  updateCurrentSection: (selection: Range | undefined) => void
}

/**
* The component that allows the user to click and drag to select a portion of the audio file.
* @param {Range | undefined} props.currentSection The currently selected section, expressed as a ratio from 0.0 to 1.0.
* @param {(selection: Range) => void} props.updateCurrentSection The function this component calls when updating the selected section.
* @returns {JSX.Element | null}
*/
function SlicerSelector(props: SlicerSelectorProps): JSX.Element | null {

  let isDragging: boolean = false;

  React.useEffect(() => { 
    const canvas = document.querySelector('canvas#slicer-selector-canvas') as HTMLCanvasElement;
    if (canvas == null) return;
    const canvasContext = canvas.getContext('2d');
    if (canvasContext == null) return;

    let from: number = 0;
    let to: number = 0;
  
    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true;
      from = (event.clientX - canvas.getBoundingClientRect().left) / (canvas.getBoundingClientRect().width / canvas.width) / canvas.width;
      to = (event.clientX - canvas.getBoundingClientRect().left) / (canvas.getBoundingClientRect().width / canvas.width) / canvas.width;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (isDragging === false) return;

      to = (event.clientX - canvas.getBoundingClientRect().left) / (canvas.getBoundingClientRect().width / canvas.width) / canvas.width;
      props.updateCurrentSection({ from: from, to: to});
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (isDragging === false) return;

      isDragging = false;
      to = (event.clientX - canvas.getBoundingClientRect().left) / (canvas.getBoundingClientRect().width / canvas.width) / canvas.width;
      if (from === to) {
        props.updateCurrentSection(undefined);
        return;
      }
      props.updateCurrentSection({ from: from, to: to });
    }

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
    }
  }, []);

  React.useEffect(() => {
    const canvas = document.querySelector('canvas#slicer-selector-canvas') as HTMLCanvasElement;
    if (canvas == null) return;
    const canvasContext = canvas.getContext('2d');
    if (canvasContext == null) return;

    if (props.currentSection == null) {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillRect(props.currentSection.from * canvas.width, 0, props.currentSection.to * canvas.width - props.currentSection.from * canvas.width, canvas.height);
  }, [ props.currentSection ]);

  return (
    <canvas height={200} id='slicer-selector-canvas'></canvas>
  );
}

export default SlicerSelector;