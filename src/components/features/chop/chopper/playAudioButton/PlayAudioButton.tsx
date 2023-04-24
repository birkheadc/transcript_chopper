import * as React from 'react';
import './PlayAudioButton.css'
import { chopAudio } from '../../../../../shared/chopAudio/chopAudio';
import Range from '../../../../../types/range/range';

interface PlayAudioButtonProps {
  file: File | undefined,
  range: Range | undefined,
  autoplay: boolean
}

/**
* A button component that works with the page's <audio> element to play/pause audio in a specific range. Can also autoplay on mount.
* @param {File | undefined} props.file The audio file to play.
* @param {Range | undefined} props.range The start and end times of the range to play.
* @param {boolean} props.autoplay Whether to autoplay on mount or not.
* @returns {JSX.Element | null}
*/
function PlayAudioButton(props: PlayAudioButtonProps): JSX.Element | null {

  const AUDIO_ID = 'play-button-audio';

  const [isPlaying, setPlaying] = React.useState<boolean>(false);

  function getAudioElement(): HTMLAudioElement | null {
    return document.querySelector(`audio#${AUDIO_ID}`) as HTMLAudioElement;
  }

  React.useEffect(function stopAudioOnUnmount() {
    return(() => {
      const audio = getAudioElement();
      if (audio == null) return;
      audio.pause();
    });
  }, []);

  React.useEffect(function autoplay() {
    if (props.autoplay === false) return;
    if (props.file == null) return;

    const audio = getAudioElement();
    if (audio == null) return;

    handleClick();

  }, [ props.autoplay, props.range ]);

  React.useEffect(function addOnEndedEventListener() {
    const audio = getAudioElement();
    if (audio == null) return;
    const onEndedListener = () => {
      setPlaying(false);
    }
    audio.addEventListener('ended', onEndedListener);
    return (() => {
      audio.removeEventListener('ended', onEndedListener);
    });
  }, []);

  React.useEffect(function togglePlaying() {
    const audio = getAudioElement();
    if (audio == null) return;

    if (isPlaying === true) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleClick = async () => {
    if (isPlaying === true) {
      setPlaying(false);
      return;
    }
    if (props.file == null) return;

    const audio = getAudioElement();
    if (audio == null) return;

    let choppedAudio: Blob;
    chopAudio(props.file, props.range ?? { from: 0.0, to: 0.0})
      .then((blob: Blob | null) => {
        if (blob == null) return;
        audio.src = URL.createObjectURL(blob);
        setPlaying(true);
      })
    // chopAudio(props.file, [props.range ?? { from: 0.0, to: 0.0}])
    //   .then(array => {
    //     if (array == null || array.length < 1) return;
    //     choppedAudio = array[0];
    //     audio.src = URL.createObjectURL(choppedAudio);
    //     setPlaying(true);
    //   });
  }

  return (
    <button className='play-audio-button' disabled={(props.range == null || props.file == null) && !isPlaying} onClick={handleClick}>{isPlaying ? 'Pause' : 'Play'}</button>
  );
}

export default PlayAudioButton;