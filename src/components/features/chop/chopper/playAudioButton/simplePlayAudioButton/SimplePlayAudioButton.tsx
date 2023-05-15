import * as React from 'react';
import './SimplePlayAudioButton.css'

interface SimplePlayAudioButtonProps {
  audioElement: HTMLAudioElement,
  autoplay: boolean,
  hotkey: boolean
}

/**
* // The actual button that is rendered when PlayAudioButton decides that the button should be active (namely, when the audio element is found on the page), and when range is set to full.
* @param {HTMLAudioElement} props.audioElement The audio element to control with this button.
* @param {boolean} props.autoplay Whether to autoplay when the component mounts or the range changes.
* @param {boolean} props.hotkey Whether to register this button to be used by pressing the `P` key.
* @returns {JSX.Element | null}
*/
function SimplePlayAudioButton(props: SimplePlayAudioButtonProps): JSX.Element | null {

  const [isPlaying, setPlaying] = React.useState<boolean>(false);

  React.useEffect(function addPausePlayingListeners() {

    const pauseListener = () => {
      setPlaying(false);
      props.audioElement.currentTime = 0;
    }

    const playingListener = () => {
      setPlaying(true);
    }
    
    props.audioElement.addEventListener('pause', pauseListener);
    props.audioElement.addEventListener('playing', playingListener);
    return (() => {
      props.audioElement.removeEventListener('pause', pauseListener);
      props.audioElement.removeEventListener('playing', playingListener);
    });
  }, []);

  React.useEffect(function addPKeyListener() {
    if (props.hotkey === false) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'p') {
        handleClick();
      };
    }
    window.addEventListener('keypress', listener);
    return (() => {
      window.removeEventListener('keypress', listener);
    });
  }, [ isPlaying ]);

  React.useEffect(function stopAudioOnUnmount() {
    return(() => {
      props.audioElement.pause();
    });
  }, []);

  React.useEffect(function autoplayIfEnabled() {
    if (props.autoplay === false) return;
    console.log('autoplay');
  }, [ props.audioElement, props.autoplay ]);

  const handleClick = () => {
    isPlaying ? stopAudio(props.audioElement) : playAudio(props.audioElement);
  }

  function playAudio (audio: HTMLAudioElement) {
    if (audio.paused && !isPlaying) {
      audio.play();
    }
  }
  
  function stopAudio(audio: HTMLAudioElement) {
    if (!audio.paused && isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  return (
    <button
    className='play-audio-button'
    onClick={handleClick}
    >
      {isPlaying ? 'Pause' : 'Play'}{props.hotkey ? ' (P)' : ''}
    </button>
  );
}

export default SimplePlayAudioButton;