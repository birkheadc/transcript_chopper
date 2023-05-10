import * as React from 'react';
import './PlayAudioButton.css'
import Range from '../../../../../types/range/range';
import EnabledPlayAudioButton from './enabledPlayAudioButton/EnabledPlayAudioButton';

interface PlayAudioButtonProps {
  range: Range | undefined,
  autoplay: boolean,
  hotkey: boolean
}

/**
* A button component that works with the page's <audio> element to play/pause audio in a specific range. Can also autoplay on mount.
* @param {Range | undefined} props.range The start and end times of the range to play.
* @param {boolean} props.autoplay Whether to autoplay on mount or not.
* @param {boolean} props.hotkey Whether to allow control of button via hotkey.
* @returns {JSX.Element | null}
*/

function PlayAudioButton(props: PlayAudioButtonProps): JSX.Element | null {

  const audio = getAudioElement();
  if (audio == null) return <button className='play-audio-button' disabled={true} >Play</button>;

  return <EnabledPlayAudioButton audio={audio} range={props.range} autoplay={props.autoplay} hotkey={props.hotkey} />
}

export default PlayAudioButton;

const AUDIO_ID = 'play-button-audio';

function getAudioElement(): HTMLAudioElement | null {
  return document.querySelector(`audio#${AUDIO_ID}`) as HTMLAudioElement;
}