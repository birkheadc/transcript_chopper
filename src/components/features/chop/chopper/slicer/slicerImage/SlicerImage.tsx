import * as React from 'react';
import './SlicerImage.css'
import { VolumeArray } from '../../../../../../types/volumeArray/volumeArray';

interface SlicerImageProps {
  volumeArray: VolumeArray,
}

/**
* The component that displays the sound graph of the original audio file.
* @param {VolumeArray} props.volumeArray The volume array for the audio file.
* @param {Range | undefined} props.currentSection The currently selected section, expressed as a ratio from 0.0 to 1.0.
* @param {(selection: Range) => void} props.updateCurrentSection The function this component calls when updating the selected section.
* @returns {JSX.Element | null}
*/
function SlicerImage(props: SlicerImageProps): JSX.Element | null {

  const MARGIN = 5;

  const [width, setWidth] = React.useState<number>(0);

  React.useEffect(function drawVolumeArrayToCanvas() {
    if (props.volumeArray.volume.length < 1) return;
    const canvas = document.querySelector('canvas#slicer-image-canvas') as HTMLCanvasElement;
    if (canvas == null) return;
    const canvasContext = canvas.getContext('2d');
    if (canvasContext == null) return;

    const { height } = canvas;
    const centerHeight = Math.ceil(height / 2);
    const scaleFactor = (height - MARGIN * 2) / (props.volumeArray.max * 2);

    const width = Math.ceil(props.volumeArray.volume.length + MARGIN * 2);
    canvas.width = width;
    const selectorCanvas = document.querySelector('canvas#slicer-selector-canvas') as HTMLCanvasElement;
    if (selectorCanvas != null) selectorCanvas.width = width;

    const pixelWidth = Math.max(600, (width / 500) * props.volumeArray.chunkSize);
    document.documentElement.style.setProperty('--canvas-width', `${pixelWidth}px`);

    for (let index in props.volumeArray.volume) {
      canvasContext.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--clr-black');
      canvasContext.beginPath();
      canvasContext.moveTo(MARGIN + Number(index), centerHeight - props.volumeArray.volume[index] * scaleFactor);
      canvasContext.lineTo(MARGIN + Number(index), centerHeight + props.volumeArray.volume[index] * scaleFactor);
      canvasContext.stroke();
    }
  }, [ props.volumeArray ]);

  return (
    <canvas height={200} id='slicer-image-canvas'></canvas>
  );
}

export default SlicerImage;