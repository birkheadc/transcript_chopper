import * as React from 'react';
import './AutomaticSlicer.css';
import Range from '../../../../../types/interfaces/range/range';
import CollapsibleImplementation from '../../../../shared/collapsibleImplementation/CollapsibleImplementation';
import calculateSectionsByVolume from '../../../../../helpers/calculateSectionsByVolume/calculateSectionsByVolume';
import { VolumeArray } from '../../../../../types/interfaces/volumeArray/volumeArray';

interface AutomaticSlicerProps {
  volumeArray: VolumeArray
  setSections: (sections: Range[]) => void
}
/**
 * Subcomponent that analyzes an audio file and returns the sections that it understands as speech.
 * @param {VolumeArray} props.volumeArray The volume array of the audio file.
 * @param {(sections: Range[]) => void} props.setSections The function to call when returning the sections.
 * @returns {JSX.Element | null}
 */
function AutomaticSlicer(props: AutomaticSlicerProps): JSX.Element | null {

  const [volumeSensitivity, setVolumeSensitivity] = React.useState<number>(1);
  const [sectionLength, setSectionLength] = React.useState<number>(10);

  const handleSlice = () => {
    const sections = calculateSectionsByVolume(props.volumeArray, volumeSensitivity, sectionLength);
    props.setSections(sections);
  }

  const handleVolumeSensitivityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeSensitivity(parseInt(event.currentTarget.value));
  }

  const handleSectionLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSectionLength(parseInt(event.currentTarget.value));
  }

  // Todo: Make this whole box collapsable (and collapsed to start) (probably a <Collapsable /> element could be made)
  return (
    <div className='automatic-slicer-wrapper'>
      <CollapsibleImplementation testId='automatic-slicer' triggerTitle='Automatic Slicer'>
        <div className='automatic-slicer-inner-wrapper'>
          <p>
            Attempts to automatically slice audio based on white space. Works better the cleaner the audio is.
            Tweak the sliders below depending on the audio file. <span className='warning'>Will overwrite any current sections.</span>
          </p>
          <p>
            Volume Sensitivity determines how to judge the difference between words and white space. Turn up for audio with a lot of background noise.
          </p>
          <p>
            Section Length determines how long each section should be, combining shorter sections. Turn up for a few long sections, turn down for many shorter sections.
          </p>
          <div className='automatic-slicer-controls'>
            <div className='inline-label-input-wrapper'>
              <label htmlFor='volumeSensitivityInput'>Volume Sensitivity</label>
              <input min={1} max={99} id='volumeSensitivityInput' onChange={handleVolumeSensitivityChange} type='range' value={volumeSensitivity}></input>
            </div>
            <div className='inline-label-input-wrapper'>
              <label htmlFor='sectionLengthInput'>Section Length</label>
              <input min={0} max={100} id='sectionLengthInput' onChange={handleSectionLengthChange} type='range' value={sectionLength}></input>
            </div>
            <button data-testid={'automatic-slice-button'} onClick={handleSlice}>Slice</button>
          </div>
        </div>
        </CollapsibleImplementation>
    </div>
  );
}

export default AutomaticSlicer;