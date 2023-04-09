import * as React from 'react';
import './SlicerImage.css'

interface SlicerImageProps {
  audioFile: File
}

/**
*
* @returns {JSX.Element | null}
*/
function SlicerImage(props: SlicerImageProps): JSX.Element | null {

  const MARGIN = 10;
  const CHUNK_SIZE = 50;

  React.useEffect(() => {
    // Todo: Understand and possibly refactor this, but it is working for the moment.
    const canvas = document.querySelector('canvas#slicer-image-canvas') as HTMLCanvasElement;
    if (canvas == null) return;

    const canvasContext = canvas.getContext('2d');
    if (canvasContext == null) return;

    const audioContext = new AudioContext();

    const { width, height } = canvas;
    const centerHeight = Math.ceil(height / 2);
    const scaleFactor = (height - MARGIN * 2) / 2;

    async function drawToCanvas() {
      if (canvasContext == null) return;

      const buffer = await props.audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(buffer);
      const float32Array = audioBuffer.getChannelData(0);

      const array = [];

      let i = 0;
      const length = float32Array.length;
      while (i < length) {
        array.push(
          float32Array.slice(i, i += CHUNK_SIZE).reduce(function (total, value) {
            return Math.max(total, Math.abs(value));
          })
        );
      }

      canvas.width = Math.ceil(float32Array.length / CHUNK_SIZE + MARGIN * 2);

      for (let index in array) {
        canvasContext.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--clr-black');
        canvasContext.beginPath();
        canvasContext.moveTo(MARGIN + Number(index), centerHeight - array[index] * scaleFactor);
        canvasContext.lineTo(MARGIN + Number(index), centerHeight + array[index] * scaleFactor);
        canvasContext.stroke();
      }
    }

    drawToCanvas();

  }, [props.audioFile]);

  return (
    <canvas height={200} id='slicer-image-canvas'>

    </canvas>
  );
}

export default SlicerImage;