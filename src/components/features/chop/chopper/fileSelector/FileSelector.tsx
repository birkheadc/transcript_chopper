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
* @param {(newFile: AudioWithTranscript) => void} props.updateOriginalFile The function to call when updating the audio file or transcript.
* @param {AudioWithTranscript} props.originalFile The audio file and transcript that is to be chopped.
* @param {() => void} props.handleContinue The function to call when the audio file and transcript are selected, and the user presses Continue.
* @returns {JSX.Element | null}
*/
function FileSelector(props: FileSelectorProps): JSX.Element | null {

  const handleUpdateTranscript = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const newFile: AudioWithTranscript = {...props.originalFile};
    newFile.transcript = event.currentTarget.value;
    props.updateOriginalFile(newFile);
  }

  const handleUpdateAudioFile = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files == null || event.currentTarget.files.length < 1) return;
    const newFile = {...props.originalFile};
    newFile.audioFile = event.currentTarget.files[0];
    props.updateOriginalFile(newFile);

  }

  return (
    <div className='file-selector-wrapper'>
      <div className='inline-label-input-wrapper file-selector-audio-wrapper'>
        <label htmlFor='audioFile'>Audio File</label>
        <input accept='audio/wav, audio/mp3' id='audioFile' onChange={handleUpdateAudioFile} type='file'></input>
      </div>
      <div className='inline-label-input-wrapper file-selector-transcript-wrapper'>
        <label htmlFor='transcript'>Transcript</label>
        <textarea id='transcript' onChange={handleUpdateTranscript} value={props.originalFile.transcript}></textarea>
      </div>
      <button disabled={props.originalFile.audioFile == null || props.originalFile.transcript === ''} onClick={props.handleContinue} type='button'>Continue</button>
    </div>
  );
}

export default FileSelector;