import * as React from 'react';
import './AutomaticSlicer.css';
import Range from '../../../../../../types/range/range';

interface AutomaticSlicerProps {
  originalAudio: File | undefined,
  setSections: (sections: Range[]) => void
}
/**
 * Subcomponent that analyzes an audio file and returns the sections that it understands as speech.
 * @param {File | undefined} props.originalAudio The audio file to analyze.
 * @param {(sections: Range[]) => void} props.setSections The function to call when returning the sections.
 * @returns {JSX.Element | null}
 */
function AutomaticSlicer(props: AutomaticSlicerProps): JSX.Element | null {

  const [volumeSensitivity, setVolumeSensitivity] = React.useState<number>(50);
  const [pauseLength, setPauseLength] = React.useState<number>(50);

  const handleSlice = () => {
    console.log('Analyzing...');
    console.table({ 'file': props.originalAudio, volumeSensitivity, pauseLength});
    // Create algorithm
  }

  const handleVolumeSensitivityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeSensitivity(parseInt(event.currentTarget.value));
  }

  const handlePauseLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPauseLength(parseInt(event.currentTarget.value));
  }

  // Todo: Make this whole box collapsable (and collapsed to start) (probably a <Collapsable /> element could be made)
  return (
    <div className='automatic-slicer-wrapper'>
      <h3>Automatically Slice (work-in-progress)</h3>
      <p>
        Attempts to automatically slice audio based on white space. Works better the cleaner the audio is.
        Tweak the sliders below depending on the audio file. <span className='warning'>Will overwrite any current sections.</span>
      </p>
      <p>
        Volume Sensitivity determines how to judge the difference between words and white space. Turn up for audio with a lot of background noise.
      </p>
      <p>
        Pause Length determines how long of a pause is needed between slices. Turn up for a few long sections, turn down for many shorter sections.
      </p>
      <div className='automatic-slicer-controls'>
        <div className='inline-label-input-wrapper'>
          <label>Volume Sensitivity</label>
          <input id='volumeSensitivityInput' onChange={handleVolumeSensitivityChange} type='range' value={volumeSensitivity}></input>
        </div>
        <div className='inline-label-input-wrapper'>
          <label>Pause Length</label>
          <input id='pauseLengthInput' onChange={handlePauseLengthChange} type='range' value={pauseLength}></input>
        </div>
        <button onClick={handleSlice}>Slice</button>
      </div>
    </div>
  );
}

export default AutomaticSlicer;