import * as React from 'react';
import './FileSelector.css'
import AudioWithTranscript from '../../../../../types/audioWithTranscript/audioWithTranscript';

interface FileSelectorProps {
  updateOriginalFile: (newFile: AudioWithTranscript) => void,
  originalFile: AudioWithTranscript,
  handleContinue: () => void
}

/**
* Handles selection of the audio file and transcript for processing.
* @returns {JSX.Element | null}
*/
function FileSelector(props: FileSelectorProps): JSX.Element | null {

  const handleUpdate = (event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => {
    const newFile: AudioWithTranscript = {...props.originalFile};
    newFile[event.currentTarget.id] = event.currentTarget.value;
    props.updateOriginalFile(newFile);
  }

  return (
    <div className='file-selector-wrapper'>
      <div className='inline-label-input-wrapper file-selector-audio-wrapper'>
        <label htmlFor='audioFile'>Audio File</label>
        <input id='audioFile' onChange={handleUpdate} type='file' value={props.originalFile.audioFile}></input>
      </div>
      <div className='inline-label-input-wrapper file-selector-transcript-wrapper'>
        <label htmlFor='transcript'>Transcript</label>
        <textarea id='transcript' onChange={handleUpdate} value={props.originalFile.transcript}></textarea>
      </div>
      <button disabled={props.originalFile.audioFile === '' || props.originalFile.transcript === ''} onClick={props.handleContinue} type='button'>Continue</button>
    </div>
  );
}

export default FileSelector;