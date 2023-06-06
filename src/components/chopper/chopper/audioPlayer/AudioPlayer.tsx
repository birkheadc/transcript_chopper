import * as React from 'react';
import './AudioPlayer.css';
import Range from '../../../../types/interfaces/range/range';

interface AudioPlayerProps {
  audio: Blob | undefined,
  range: Range | undefined,
  autoplay: boolean,
  hotkey: boolean
}
/**
 * The component that other components can use to play audio.
 * @param {Blob | null} props.audio The audio file to play.
 * @param {Range} props.range The section of the audio to play.
 * @param {boolean} props.autoplay Whether to autoplay or not.
 * @param {boolean} props.hotkey Whether the button should be activatable with the 'P' key.
 * @returns {JSX.Element | null}
 */
function AudioPlayer(props: AudioPlayerProps): JSX.Element | null {

  // Keep a reference to the interval so it is not lost when rerendering
  const playbackInterval = React.useRef<ReturnType<typeof setInterval>>();

  const [isAudioElementReady, setAudioElementReady] = React.useState<boolean>(false);
  const [isPlaying, setPlaying] = React.useState<boolean>(false);

  React.useEffect(function clearPlaybackIntervalOnUnmount() {
    return (() => {
      if (playbackInterval) clearInterval(playbackInterval.current);
    });
  }, []);

  // Adds a listener to the audio element that changes `isAudioElementReady` to true when it can playthrough
  React.useEffect(function addCanplaythroughListener() {
    const audioElement = getAudioElement();
    if (audioElement == null) return;

    const canplaythroughListener = () => {
      setAudioElementReady(true);
      audioElement.removeEventListener('canplaythrough', canplaythroughListener);
    }
    audioElement.addEventListener('canplaythrough', canplaythroughListener);

    return (() => {
      audioElement.removeEventListener('canplaythrough', canplaythroughListener);
      audioElement.pause();
    })
  }, []);

  // Adds listeners to the audio element that allow it to change `isPlaying`
  React.useEffect(function addPlayAndPauseListeners() {
    const audioElement = getAudioElement();
    if (audioElement == null) return;

    const playListener = () => {
      setPlaying(true);
    }

    const pauseListener = () => {
      setPlaying(false);
      if (playbackInterval) clearInterval(playbackInterval.current);
    }

    audioElement.addEventListener('play', playListener);
    audioElement.addEventListener('pause', pauseListener);

    return (() => {
      audioElement.removeEventListener('play', playListener);
      audioElement.removeEventListener('pause', pauseListener);
    })
  }, []);

  React.useEffect(function autoplayIfEnabled() {
    const audioElement = getAudioElement();
    if (audioElement == null) return;

    audioElement.autoplay = props.autoplay;
  }, [ props.autoplay ]);

  // Adds a listener to the window to allow activating the button with the 'P' key if enabled in props
  React.useEffect(function setPKeyListener() {
    if (props.hotkey === false) return;

    const audioElement = getAudioElement();
    if (audioElement == null) return;

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'p') handleClick();
    }
    window.addEventListener('keypress', listener);

    return (() => {
      window.removeEventListener('keypress', listener);
    });
  }, [ props.hotkey, isPlaying ]);

  // Changes the audio element's src when the respective prop is changed
  React.useEffect(function setAudioSource() {
    if (props.audio == null) return;
    const source = URL.createObjectURL(props.audio);
    setAudioElementSource(source);
  }, [ props.audio ]);

  // Called when the button (or hotkey) is pressed
  const handleClick = () => {
    isPlaying ? stopAudio() : playAudio();
  }

  // Starts playing the audio manually if it is not already
  function playAudio() {
    if (isAudioElementReady === false) return;

    const audioElement = getAudioElement();
    if (audioElement == null) return;

    if (audioElement.paused && !isPlaying) {
      const startTime = (props.range ? Math.min(props.range.from, props.range.to) : 0.0) * audioElement.duration;
      const endTime = (props.range ? Math.max(props.range.from, props.range.to) : 1.0) * audioElement.duration;
      
      audioElement.currentTime = startTime;

      if (endTime < audioElement.duration) {
        const interval = startEndplaybackCheckInterval(audioElement, endTime);
        playbackInterval.current = interval;
      }

      audioElement.play();
    }
  }

  // Stops the audio manually if it is not already
  function stopAudio() {
    const audioElement = getAudioElement();
    if (audioElement == null) return;
    if (!audioElement.paused && isPlaying) {
      audioElement.pause();
    }
  }

  if (isAudioElementReady === false) {
    return (
      <button className='play-audio-button' disabled>Play</button>
    );
  }

  return (
    <button className='play-audio-button' onClick={handleClick}>{isPlaying ? 'Pause' : 'Play'}{props.hotkey ? ' (P)' : ''}</button>
  );
}

export default AudioPlayer;

const AUDIO_PLAYER_ID = 'audio-player';
/**
 * Helper function for ensuring each part of the component correctly finds the same audio element.
 * @returns {HTMLAudioElement | null}
 */
function getAudioElement(): HTMLAudioElement | null {
  return document.querySelector(`audio#${AUDIO_PLAYER_ID}`) as HTMLAudioElement;
}

/**
 * Helper function for finding the page's audio element, pausing the audio, waiting for the audio to pause, then setting the audio element's source.
 * @param {string} source The new source for the audio element.
 * @returns {void}
 */
async function setAudioElementSource(source: string) {
  const audioElement = getAudioElement();
  if (audioElement == null) return;
  await pauseAudioAndWait(audioElement);
  audioElement.src = source;
}

/**
 * Helper function which allows waiting for the audio element to truly be paused before continuing.
 * TODO: May have an issue with the event listener being stuck to the element if the event never fires somehow,
 * possibly by the user quickly moving away from the page or rerendering the component between pressing pause
 * and the event firing
 * @param {HTMLAudioElement} audioElement The audio element to pause.
 * @returns {Promise<void>}
 */
async function pauseAudioAndWait(audioElement: HTMLAudioElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (audioElement.paused === true) resolve();
    const listener = () => {
      audioElement.removeEventListener('pause', listener)
      resolve();
    }
    audioElement.addEventListener('pause', listener);
    audioElement.pause();
  })
}

// Helper function for creating the interval that will periodically check if the audio should end early
// based on props.range
// A timeout does not work because it is not possible to guaruntee the start of the timeout aligning with the
// start of the audio playback
// The `timeupdate` event on HTMLAudioElement is also not precise enough -- it fires as infrequently as every 200ms
const CHECK_PLAYBACK_INTERVAL_MS = 30;
/**
 * Helper function for creating the interval that will periodically check if the audio should end early
 * based on props.range.
 * A timeout does not work because it is not possible to guarantee the start of the timeout aligning with the
 * start of the audio playback.
 * The `timeupdate` event on HTMLAudioElement is also not precise enough -- it fires as infrequently as every 200ms.
 * @param {HTMLAudioElement} audioElement The audio element that is playing.
 * @param {number} endTime The time of the audio, in seconds, to end playback.
 * @returns {ReturnType<typeof setInterval>}
 */
function startEndplaybackCheckInterval(audioElement: HTMLAudioElement, endTime: number): ReturnType<typeof setInterval> {
  const interval = setInterval(() => {
    if (audioElement.currentTime >= endTime) {
      clearInterval(interval);
      if (!audioElement.paused) audioElement.pause();
    }
  }, CHECK_PLAYBACK_INTERVAL_MS)
  return interval;
}