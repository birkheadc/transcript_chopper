import * as React from 'react';
import './SlicerImage.css'
import { VolumeArray } from '../../../../../types/interfaces/volumeArray/volumeArray';
import SlicerCanvasDetails from '../../../../../types/interfaces/slicerCanvasDetails/slicerCanvasDetails';

interface SlicerImageProps {
  volumeArray: VolumeArray,
  details: SlicerCanvasDetails
}

/**
* The component that displays the sound graph of the original audio file.
* @param {VolumeArray} props.volumeArray The volume array for the audio file.
* @param {SlicerCanvasDetails} props.details The details of how to draw the canvas image.
* @returns {JSX.Element | null}
*/
function SlicerImage(props: SlicerImageProps): JSX.Element | null {

  const [canvases, setCanvases] = React.useState<{ width: number, volumeArray: number[] }[]>([]);

  React.useEffect(function determineCanvases() {
    const volumeArray = props.volumeArray.volume;
    if (volumeArray.length < 1) return;

    const newCanvases: { width: number, volumeArray: number[] }[] = [];

    let i = 0;
    while (i * props.details.individualCanvasMaxWidth < volumeArray.length) {

      const width = Math.min(props.details.individualCanvasMaxWidth, volumeArray.length - (i * props.details.individualCanvasMaxWidth));

      const sliceStart = i * props.details.individualCanvasMaxWidth;
      const sliceEnd = i * props.details.individualCanvasMaxWidth + props.details.individualCanvasMaxWidth;

      const canvasWidth = width * props.details.widthMultiplier;
      const canvasVolumeArray = volumeArray.slice(sliceStart, sliceEnd);

      newCanvases.push({ width: canvasWidth, volumeArray: canvasVolumeArray });
      i++;
    }

    setDocumentCSSVariables(props.volumeArray, props.details);
    setCanvases(newCanvases);

  }, [ props.volumeArray, props.details ]);

  React.useEffect(function drawAudioChartToCanvases() {
    for (let i = 0; i < canvases.length; i++) {
      const canvasContext = getCanvasContext(i);
      if (canvasContext == null) return;

      canvasContext.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--clr-black');

      const centerHeight = Math.ceil(props.details.height / 2);
      const scaleFactor = props.details.height / (props.volumeArray.max * 2);

      canvasContext.beginPath();
      for (let j = 0; j < canvases[i].volumeArray.length; j++) {
        canvasContext.moveTo(Number(j), centerHeight - canvases[i].volumeArray[j] * scaleFactor);
        canvasContext.lineTo(Number(j), centerHeight + canvases[i].volumeArray[j] * scaleFactor);
      }
      canvasContext.stroke();
    }
  }, [ canvases ]);

  return (
    <div id='slicer-image-wrapper'>
      {canvases.map(
        (canvas, index) =>
        <canvas
          className='slicer-image-canvas'
          id={`${getCanvasId(index)}`}
          key={`slicer-image-key-${index}`}
          style={{ width: canvas.width }}
          height={props.details.height}
          width={canvas.volumeArray.length}
        >
        </canvas>
      )}
    </div>
  );
}

export default SlicerImage;

function getCanvasId(index: number): string {
  return `slicer-image-canvas-${index}`;
}

function getCanvas(canvasIndex: number): HTMLCanvasElement | null {
  const canvas = document.querySelector(`canvas#${getCanvasId(canvasIndex)}`) as HTMLCanvasElement;
  return canvas;
}

function getCanvasContext(canvasIndex: number): CanvasRenderingContext2D | null {
  const canvas = getCanvas(canvasIndex);
  if (canvas == null) return null;
  const canvasContext = canvas.getContext('2d');
  return canvasContext;
}

function setDocumentCSSVariables(volumeArray: VolumeArray, canvasDetails: SlicerCanvasDetails) {
  document.documentElement.style.setProperty('--canvas-width', `${volumeArray.volume.length * canvasDetails.widthMultiplier}px`);
  document.documentElement.style.setProperty('--canvas-height', `${canvasDetails.height}px`);
}