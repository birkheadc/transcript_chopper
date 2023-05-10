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
* // TODO
* @returns {JSX.Element | null}
*/
function EnabledPlayAudioButton(props: EnabledPlayAudioButtonProps): JSX.Element | null {

  // How often in ms to check if playback has reached endTime. Turn down for more precision.
  // ontimeupdate of audio element does not call often enough
  const CHECK_PLAYBACK_INTERVAL_MS = 30;

  const [isPlaying, setPlaying] = React.useState<boolean>(false);

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
      }

      audio.play();
    }
  }
  
  function stopAudio(audio: HTMLAudioElement) {
    if (!audio.paused && isPlaying) {
      audio.pause();
    }
  }

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