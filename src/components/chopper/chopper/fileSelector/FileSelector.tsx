import * as React from 'react';
import './FileSelector.css'
import AudioWithTranscript from '../../../../types/interfaces/audioWithTranscript/audioWithTranscript';
import extractTextFromPlainTextFile from '../../../../helpers/extractTextFromPlainTextFile/extractTextFromPlainTextFile';

interface FileSelectorProps {
  updateOriginalFile: (newFile: AudioWithTranscript | null) => void,
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

  React.useEffect(function resetOnMount() {
    props.updateOriginalFile(null);
  }, []);

  const handleUpdateTranscript = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const newFile: AudioWithTranscript = {...props.originalFile};
    newFile.transcript = event.currentTarget.value;
    props.updateOriginalFile(newFile);
  }

  const handleUpdateAudioFile = (event: React.FormEvent<HTMLInputElement>) => {
    const newFile = {...props.originalFile};
    newFile.audioFile = event.currentTarget.files ? event.currentTarget.files[0] : undefined
    props.updateOriginalFile(newFile);
  }

  const handleUpdateTextFile = async (event: React.FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    event.currentTarget.value = '';
    if (file == null) return;
    const newFile = {...props.originalFile};
    newFile.transcript = await extractTextFromPlainTextFile(file);
    props.updateOriginalFile(newFile);
  }

  return (
    <div className='file-selector-wrapper'>
      <h2>Select your audio file and transcript.</h2>
      <p>Select the audio file on your PC. Currently, only .wav and .mp3 are supported.</p>
      <p>If you have a full transcript of the audio, you can upload or paste it below to speed up editing later.</p>
      <div className='inline-label-input-wrapper file-selector-audio-wrapper'>
        <label htmlFor='audioFile'>Audio File</label>
        <input accept='audio/wav, audio/mp3' id='audioFile' onChange={handleUpdateAudioFile} type='file'></input>
      </div>
      <div className='inline-label-input-wrapper file-selector-audio-wrapper'>
        <label htmlFor='audioFile'>Upload Text</label>
        <input accept='text/plain' id='textFile' onChange={handleUpdateTextFile} type='file'></input>
      </div>
      <span>or simply type / paste it here</span>
      <div className='inline-label-input-wrapper file-selector-transcript-wrapper'>
        <label htmlFor='transcript'>Transcript</label>
        <textarea id='transcript' onChange={handleUpdateTranscript} value={props.originalFile.transcript}></textarea>
      </div>
      <button disabled={props.originalFile.audioFile == null} onClick={props.handleContinue} type='button'>Continue</button>
    </div>
  );
}

export default FileSelector;