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

  function getCanvasId(index: number): string {
    return `slicer-image-canvas-${index}`;
  }

  React.useEffect(function drawAudioChartToCanvases() {
    for (let i = 0; i < canvases.length; i++) {
      const canvas = document.querySelector(`canvas#${getCanvasId(i)}`) as HTMLCanvasElement;
      if (canvas == null) return;
      const canvasContext = canvas.getContext('2d');
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

  React.useEffect(function determineCanvases() {
    const array = props.volumeArray.volume;
    if (array.length < 1) return;

    const newCanvases: { width: number, volumeArray: number[] }[] = [];

    let i = 0;
    while (i * props.details.individualCanvasMaxWidth < array.length) {

      const width = Math.min(props.details.individualCanvasMaxWidth, array.length - (i * props.details.individualCanvasMaxWidth));

      const sliceStart = i * props.details.individualCanvasMaxWidth;
      const sliceEnd = i * props.details.individualCanvasMaxWidth + props.details.individualCanvasMaxWidth;
      newCanvases.push({ width: width * props.details.widthMultiplier, volumeArray: array.slice(sliceStart, sliceEnd) });
      i++;
    }

    document.documentElement.style.setProperty('--canvas-width', `${array.length * props.details.widthMultiplier}px`);
    document.documentElement.style.setProperty('--canvas-height', `${props.details.height}px`);

    setCanvases(newCanvases);

  }, [ props.volumeArray, props.details ]);

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