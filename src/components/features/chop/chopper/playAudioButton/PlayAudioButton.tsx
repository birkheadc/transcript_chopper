import * as React from 'react';
import './PlayAudioButton.css'
import { chopAudio } from '../../../../../shared/chopAudio/chopAudio';
import Range from '../../../../../types/range/range';

interface PlayAudioButtonProps {
  file: File | undefined,
  range: Range | undefined,
  autoplay: boolean,
  hotkey: boolean
}

/**
* A button component that works with the page's <audio> element to play/pause audio in a specific range. Can also autoplay on mount.
* @param {File | undefined} props.file The audio file to play.
* @param {Range | undefined} props.range The start and end times of the range to play.
* @param {boolean} props.autoplay Whether to autoplay on mount or not.
* @param {boolean} props.hotkey Whether to allow control of button via hotkey.
* @returns {JSX.Element | null}
*/
function PlayAudioButton(props: PlayAudioButtonProps): JSX.Element | null {

  const stopPlaybackTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setPlaying] = React.useState<boolean>(false);

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
  }, [ isPlaying, props.file, props.range ]);

  React.useEffect(function setAudioUrl() {
    const audio = getAudioElement();
    if (audio == null || props.file == null) return;
    audio.src = URL.createObjectURL(props.file);
  }, []);

  React.useEffect(function stopAudioOnUnmount() {
    return(() => {
      const audio = getAudioElement();
      if (audio != null) audio.pause();
    });
  }, []);

  React.useEffect(function autoplay() {
    if (props.autoplay === false) return;
    if (props.file == null) return;
    handleClick();
  }, [ props.autoplay, props.range ]);

  React.useEffect(function addOnEndedEventListener() {
    const audio = getAudioElement();
    if (audio == null) return;

    const pauseListener = () => {
      if (stopPlaybackTimeout.current != null) clearTimeout(stopPlaybackTimeout.current);
      setPlaying(false);
    }

    const playingListener = () => {
      setPlaying(true);
    }
    
    audio.addEventListener('pause', pauseListener);
    audio.addEventListener('playing', playingListener);
    return (() => {
      audio.removeEventListener('pause', pauseListener);
      audio.removeEventListener('playing', playingListener);
    });
  }, []);

  const handleClick = async () => {
    const audio = getAudioElement();
    if (audio == null) return;
    isPlaying ? stopAudio(audio) : playAudio(audio);
    // if (isPlaying === true) {
    //   setPlaying(false);
    //   return;
    // }
    // if (props.file == null) return;

    // const audio = getAudioElement();
    // if (audio == null) return;

    // chopAudio(props.file, props.range ?? { from: 0.0, to: 1.0})
    //   .then((blob: Blob | null) => {
    //     if (blob == null) return;
    //     audio.src = URL.createObjectURL(blob);
    //     setPlaying(true);
    //   });
  }

  function playAudio (audio: HTMLAudioElement) {
    if (audio.paused && !isPlaying) {
      let startTime = 0.0;
      let endTime = audio.duration;

      if (props.range != null) {
        startTime = Math.min(props.range.from, props.range.to) * audio.duration;
        endTime = Math.max(props.range.from, props.range.to) * audio.duration;
      }

      audio.currentTime = startTime;
      stopPlaybackTimeout.current = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, (endTime - startTime) * 1000);

      audio.play();
    }
  }
  
  function stopAudio(audio: HTMLAudioElement) {
    if (!audio.paused && isPlaying) {
      console.log('stop.');
      audio.pause();
      audio.currentTime = 0;
    }
  }

  return (
    <button
    className='play-audio-button'
    disabled={(props.range == null || props.file == null) && !isPlaying}
    onClick={handleClick}
    >
      {isPlaying ? 'Pause' : 'Play'}{props.hotkey ? ' (P)' : ''}
    </button>
  );
}

export default PlayAudioButton;

const AUDIO_ID = 'play-button-audio';

function getAudioElement(): HTMLAudioElement | null {
  return document.querySelector(`audio#${AUDIO_ID}`) as HTMLAudioElement;
}