import * as React from 'react';
import './SlicerImage.css'

interface SlicerImageProps {
  volumeArray: number[],
  chunkSize: number
}

/**
* The component that displays the sound graph of the original audio file.
* @returns {JSX.Element | null}
*/
function SlicerImage(props: SlicerImageProps): JSX.Element | null {

  const MARGIN = 5;
  // const CHUNK_SIZE = 100;
  const PIXEL_WIDTH = 980;
  const SECONDS_PER_PIXEL_WIDTH = 30;

  React.useEffect(function drawVolumeArrayToCanvas() {
    if (props.volumeArray.length < 1) return;
    const canvas = document.querySelector('canvas#slicer-image-canvas') as HTMLCanvasElement;
    if (canvas == null) return;
    const canvasContext = canvas.getContext('2d');
    if (canvasContext == null) return;

    const { height } = canvas;
    const centerHeight = Math.ceil(height / 2);
    const scaleFactor = (height - MARGIN * 2) / 2;

    canvas.width = Math.ceil(props.volumeArray.length + MARGIN * 2);
    // Todo: calculate this
    const pixelWidth = Math.max(1.0, 0.0) * PIXEL_WIDTH;
    document.documentElement.style.setProperty('--canvas-width', `${pixelWidth}px`);

    for (let index in props.volumeArray) {
      canvasContext.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--clr-black');
      canvasContext.beginPath();
      canvasContext.moveTo(MARGIN + Number(index), centerHeight - props.volumeArray[index] * scaleFactor);
      canvasContext.lineTo(MARGIN + Number(index), centerHeight + props.volumeArray[index] * scaleFactor);
      canvasContext.stroke();
    }
  }, [ props.volumeArray ]);

  return (
      <canvas height={200} id='slicer-image-canvas'></canvas>
  );
}

export default SlicerImage;