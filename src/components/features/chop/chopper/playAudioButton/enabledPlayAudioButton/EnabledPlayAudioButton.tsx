import * as React from 'react';
import './EnabledPlayAudioButton.css'
import Range from '../../../../../../types/range/range';

interface EnabledPlayAudioButtonProps {
  audio: HTMLAudioElement,
  range: Range | undefined,
  autoplay: boolean,
  hotkey: boolean
}

/**
* // The actual button that is rendered when PlayAudioButton decides that the button should be active (namely, when the audio element is found on the page)
* @param {HTMLAudioElement} props.audio The audio element to control with this button.
* @param {Range | undefined} props.range The range (as a ratio from 0.0 ~ 1.0) of the audio to play. Defaults to playing the entire file if undefined.
* @param {boolean} props.autoplay Whether to autoplay when the component mounts or the range changes.
* @param {boolean} props.hotkey Whether to register this button to be used by pressing the `P` key.
* @returns {JSX.Element | null}
*/
function EnabledPlayAudioButton(props: EnabledPlayAudioButtonProps): JSX.Element | null {

  // How often in ms to check if playback has reached endTime. Turn down for more precision.
  // ontimeupdate of audio element does not call often enough
  const CHECK_PLAYBACK_INTERVAL_MS = 30;

  // Need to keep a ref to the playbackInterval so it can be cleared when stopping audio early
  const playbackInterval = React.useRef<ReturnType<typeof setInterval>>();

  const [isPlaying, setPlaying] = React.useState<boolean>(false);

  // The logic here is admittedly convoluted. It has to keep track of `isPlaying` state in this component while also keeping track of what the <audio> element is doing.
  // First, `handleClick` is called when the user presses play, OR when `props.autoplay` is true and `props.range` changes.
  // `handleClick` then calls `playAudio` or `stopAudio`, which run some checks on the state of this component and what the <audio> element is doing.
  // if the checks are good, the function continues.
  // `playAudio` sets the `currentTime` of the <audio> element, and sets up an interval to check if the audio element's `currentTime` has exceeded the current range
  // An interval is needed here because a timeout is too imprecise and the audio element's `ontimeupdate` is not called often enough
  // `stopAudio` removes this interval. The interval also removes itself when end time is reached
  // Finally, there are listeners on the audio element that call `setPlaying` on this component,
  // so this component's state does not change until the audio actually plays or pauses

  const handleClick = () => {
    isPlaying ? stopAudio(props.audio) : playAudio(props.audio);
  }

  function playAudio (audio: HTMLAudioElement) {
    if (audio.paused && !isPlaying) {
      if (props.range != null) {
        const startTime = Math.min(props.range.from, props.range.to) * audio.duration;
        const endTime = Math.max(props.range.from, props.range.to) * audio.duration;

        audio.currentTime = startTime;

        const interval = setInterval(() => {
          if (audio.currentTime >= endTime) {
            audio.pause();
            clearInterval(interval);
          }
        }, CHECK_PLAYBACK_INTERVAL_MS);
        playbackInterval.current = interval;
      }

      audio.play();
    }
  }
  
  function stopAudio(audio: HTMLAudioElement) {
    if (!audio.paused && isPlaying) {
      if (playbackInterval) clearInterval(playbackInterval.current);
      audio.pause();
    }
  }

  React.useEffect(function addPausePlayingListeners() {

    const pauseListener = () => {
      setPlaying(false);
      props.audio.currentTime = 0;
    }

    const playingListener = () => {
      setPlaying(true);
    }
    
    props.audio.addEventListener('pause', pauseListener);
    props.audio.addEventListener('playing', playingListener);
    return (() => {
      props.audio.removeEventListener('pause', pauseListener);
      props.audio.removeEventListener('playing', playingListener);
    });
  }, []);

  React.useEffect(function addPKeyListener() {
    if (props.hotkey === false) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'p' && props.range != null) {
        handleClick();
      };
    }
    window.addEventListener('keypress', listener);
    return (() => {
      window.removeEventListener('keypress', listener);
    });
  }, [ isPlaying, props.range ]);

  React.useEffect(function stopAudioOnUnmount() {
    return(() => {
      props.audio.pause();
    });
  }, []);

  React.useEffect(function autoplay() {
    if (props.autoplay === false) return;
    handleClick();
  }, [ props.autoplay, props.range ]);

  return (
    <button
    className='play-audio-button'
    onClick={handleClick}
    >
      {isPlaying ? 'Pause' : 'Play'}{props.hotkey ? ' (P)' : ''}
    </button>
  );
}

export default EnabledPlayAudioButton;