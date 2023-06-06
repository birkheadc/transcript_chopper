import * as React from 'react';
import './JoinerTextEditor.css'
import AudioPlayer from '../../audioPlayer/AudioPlayer';

interface JoinerTextEditorProps {
  handleTrim: () => void,
  handleReset: () => void,
  handleDelete: () => void,
  handleUpdateStub: (event: React.FormEvent<HTMLTextAreaElement>) => void,
  currentAudio: Blob,
  currentText: string
}

/**
* The text editor for joining audio and text stubs.
* @param {() => void} props.handleTrim The function to call when pressing the trim button.
* @param {() => void} props.handleReset The function to call when pressing the reset button.
* @param {() => void} props.handleDelete The function to call when pressing the delete button.
* @param {(React.FormEvent<HTMLTextAreaElement>) => void} props.handleUpdateStub The function to call when updating the current text.
* @param {Blob} props.currentAudio The current audio file for the audio player component to play.
* @param {string} props.currentText The current value of the textarea element.
* @returns {JSX.Element | null}
*/
function JoinerTextEditor(props: JoinerTextEditorProps): JSX.Element | null {
  return (
    <div className='joiner-editor-wrapper'>
      <div className='joiner-editor-controls'>
        <AudioPlayer audio={props.currentAudio} range={{ from: 0.0, to: 1.0 }} autoplay={true} hotkey={false} />
        <button onClick={props.handleTrim}>Trim</button>
        <button onClick={props.handleReset}>Reset</button>
        <button onClick={props.handleDelete}>Delete</button>
      </div>
      <div className='inline-label-input-wrapper joiner-editor-textbox-wrapper'>
        <label htmlFor='stub-textarea'>Text</label>
        <textarea id='stub-textarea' onChange={props.handleUpdateStub} value={props.currentText}></textarea>
      </div>
    </div>
  );
}

export default JoinerTextEditor;