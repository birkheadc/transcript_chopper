import * as React from 'react';
import './SlicerControls.css';
import AudioPlayer from '../../audioPlayer/AudioPlayer';
import Range from '../../../../../types/interfaces/range/range';

interface SlicerControlsProps {
  audioFile: File | undefined,
  currentSection: Range | undefined,
  isRemoveButtonEnabled: boolean,
  handleClickAdd: () => void,
  handleClickRemove: () => void
  isFinishButtonEnabled: boolean,
  handleClickFinish: () => void
}
/**
 * Controls for navigating the Slicer component.
 * @param {File | undefined} props.audioFile The audio file to be played by the Audio Player.
 * @param {Range | undefined} props.currentSection The currently selected section.
 * @param {() => void} props.handleClickAdd The function to call when clicking the add button.
 * @param {() => void} props.handleClickRemove The function to call when clicking the remove button.
 * @param {boolean} props.isFinishButtonEnabled Whether the finish button is currently enabled.
 * @param {() => void} props.handleClickFinsih The function to call when clicking the finish button.
 * @returns {JSX.Element | null}
 */
function SlicerControls(props: SlicerControlsProps): JSX.Element | null {
  return (
    <div className='slicer-controls-wrapper'>
      <p>Highlight a section, then press `Play` to listen to it, or `Add` to create a section.</p>
      <div className='slicer-controls-inner-wrapper'>
        <div>
          <AudioPlayer audio={props.audioFile} range={props.currentSection} autoplay={false} hotkey={true} />
          <button disabled={props.currentSection == null || props.isRemoveButtonEnabled} onClick={props.handleClickAdd}>Add (A)</button>
          <button disabled={!props.isRemoveButtonEnabled} onClick={props.handleClickRemove}>Remove (R)</button>
        </div>
        <div>
          <button disabled={!props.isFinishButtonEnabled} onClick={props.handleClickFinish}>Finish (F)</button>
        </div>
      </div>
    </div>
  );
}

export default SlicerControls;