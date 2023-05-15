import * as React from 'react';
import './PlayAudioButton.css'
import Range from '../../../../../types/range/range';
import PartialPlayAudioButton from './enabledPlayAudioButton/PartialPlayAudioButton';
import SimplePlayAudioButton from './simplePlayAudioButton/SimplePlayAudioButton';

interface PlayAudioButtonProps {
  audio: Blob | null,
  range: Range | undefined,
  autoplay: boolean,
  hotkey: boolean
}

/**
* A button component that works with the page's <audio> element to play/pause audio in a specific range. Can also autoplay on mount.
* @param {Blob | null} props.audio The audio file to play.
* @param {Range | undefined} props.range The start and end times of the range to play.
* @param {boolean} props.autoplay Whether to autoplay on mount or not.
* @param {boolean} props.hotkey Whether to allow control of button via hotkey.
* @returns {JSX.Element | null}
*/

function PlayAudioButton(props: PlayAudioButtonProps): JSX.Element | null {

  const audioElement = getAudioElement();
  if (audioElement == null) return <button className='play-audio-button' disabled={true} >Play</button>;


  React.useEffect(function setAudioUrlAndAutoplayIfEnabled() {
    if (props.audio == null) return;
    audioElement.src = URL.createObjectURL(props.audio);
    if (props.autoplay === false) return;
    const canplaythroughListener = () => {
      audioElement.play();
      audioElement.removeEventListener('canplaythrough', canplaythroughListener);
    }
    audioElement.addEventListener('canplaythrough', canplaythroughListener);
    return (() => {
      audioElement.removeEventListener('canplaythrough', canplaythroughListener);
    })
  }, [ props.audio, props.autoplay ]);

  
  if (props.range == null || (props.range.from === 0.0 && props.range.to === 1.0)) return <SimplePlayAudioButton audioElement={audioElement} autoplay={props.autoplay} hotkey={props.hotkey} />
  return <PartialPlayAudioButton audioElement={audioElement} range={props.range} hotkey={props.hotkey} />
}

export default PlayAudioButton;

const AUDIO_ID = 'play-button-audio';

function getAudioElement(): HTMLAudioElement | null {
  return document.querySelector(`audio#${AUDIO_ID}`) as HTMLAudioElement;
}