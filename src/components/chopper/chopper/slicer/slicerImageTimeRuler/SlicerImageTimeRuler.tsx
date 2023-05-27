import * as React from 'react';
import './SlicerImageTimeRuler.css'

interface SlicerImageTimeRulerProps {
  duration: number
}

/**
* Displays a time ruler above the audio chart for checking the duration of the audio.
* @returns {JSX.Element | null}
*/
function SlicerImageTimeRuler(props: SlicerImageTimeRulerProps): JSX.Element | null {

  const breaks: number[] = Array.from({ length: Math.floor(props.duration) }, (_, index) => index + 1);

  React.useEffect(function calculateSpanWidth() {
    const width: number = 100.0 / (props.duration);
    setDocumentCSSVariable(width);
  }, [ props.duration ]);

  return (
    <div className='slicer-time-ruler-wrapper'>
      {
        breaks.map(
          n =>
          <span key={n}>{`${Math.floor(n / 60)}:${(n % 60).toString().padStart(2, '0')} |`}</span>
        )
      }
    </div>
  );
}

export default SlicerImageTimeRuler;

function setDocumentCSSVariable(spanWidth: number) {
  document.documentElement.style.setProperty('--time-ruler-span-width', `${spanWidth}%`);
}