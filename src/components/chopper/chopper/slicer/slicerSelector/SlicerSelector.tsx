import * as React from 'react';
import './SlicerSelector.css';
import Range from '../../../../../types/interfaces/range/range';
import SlicerCanvasDetails from '../../../../../types/interfaces/slicerCanvasDetails/slicerCanvasDetails';

enum DragState {
  NONE,
  LEFT,
  RIGHT
}

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

  const [dragState, setDragState] = React.useState<DragState>(DragState.NONE);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const leftBorderRef = React.useRef<HTMLDivElement>(null);
  const rightBorderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(function addDragStartListener() {
    const listener = (event: PointerEvent) => {   
      // Prevent Default prevents the browser from trying to drag the element. Chrome is especially annoying in this regard.
      event.preventDefault();
      const mousePosition = calculateCurrentMousePositionOverDiv(containerRef.current!, event);
      if (event.target === leftBorderRef.current) {
        setDragState(DragState.LEFT);
      } else if (event.target === rightBorderRef.current) {
        setDragState(DragState.RIGHT);
      }
      else {
        props.updateCurrentSection({ from: mousePosition, to: mousePosition });
        setDragState(DragState.RIGHT);
      }
    }
    containerRef.current?.addEventListener('pointerdown', listener);
    return (() => {
      containerRef.current?.removeEventListener('pointerdown', listener);
    })
  }, []);

  React.useEffect(function addDragEventListener() {
    const listener = (event: PointerEvent) => {
      if (dragState === DragState.NONE) return;
      const mousePosition = calculateCurrentMousePositionOverDiv(containerRef.current!, event);
      if (dragState === DragState.LEFT) {
        props.updateCurrentSection({ from: mousePosition, to: Math.max(props.currentSection?.from ?? 0, props.currentSection?.to ?? 0) });
      }
      if (dragState === DragState.RIGHT) {
        props.updateCurrentSection({ from: Math.min(props.currentSection?.from ?? 0, props.currentSection?.to ?? 0), to: mousePosition });
      }
    }
    containerRef.current?.addEventListener('pointermove', listener);
    return (() => {
      containerRef.current?.removeEventListener('pointermove', listener);
    })
  }, [ dragState ])

  React.useEffect(function addLeaveListener() {
    const listener = () => {
      setDragState(DragState.NONE);
    }
    containerRef.current?.addEventListener('mouseleave', listener);
    return (() => {
      containerRef.current?.removeEventListener('mouseleave', listener);
    })
  }, []);

  React.useEffect(function addDragStopListener() {
    const listener = () => {
      setDragState(DragState.NONE);
    }
    containerRef.current?.addEventListener('pointerup', listener);
    return (() => {
      containerRef.current?.removeEventListener('pointerup', listener);
    })
  }, []);

  return (
    <div ref={containerRef} id='slicer-selector-wrapper'>
      <div className='slicer-selection-marker-wrapper' style={getSelectorDivStyle(props.currentSection)}>
        <div ref={leftBorderRef} id='slicer-selection-marker-left'></div>
        <div id='slicer-selection-marker-body'></div>
        <div ref={rightBorderRef} id='slicer-selection-marker-right'></div>
      </div>
    </div>
  );
}

export default SlicerSelector;

// Helpers

function getDivLeftOffsetFromEvent(div: HTMLDivElement, event: PointerEvent | MouseEvent) {
  return event.clientX - div.getBoundingClientRect().left;
}

function getDivWidth(div: HTMLDivElement) {
  return div.getBoundingClientRect().width;
}

function calculateCurrentMousePositionOverDiv(div: HTMLDivElement, event: PointerEvent | MouseEvent) {
  return (getDivLeftOffsetFromEvent(div, event)) / getDivWidth(div)
}

function getSelectorDivStyle(currentSection: Range | undefined): React.CSSProperties {
  if (currentSection == null) {
    return { opacity: 0 }
  }
  const left = `${Math.min(currentSection.from, currentSection.to) * 100}%`;
  const right = `${100 - Math.max(currentSection.from, currentSection.to) * 100}%`;
  return {
    left,
    right
  };
}