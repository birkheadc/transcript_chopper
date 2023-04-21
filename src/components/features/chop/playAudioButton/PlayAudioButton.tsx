import * as React from 'react';
import './PlayAudioButton.css'
import Range from '../../../../types/range/range';

interface PlayAudioButtonProps {
  file: File | undefined,
  range: Range | undefined
}

/**
*
* @returns {JSX.Element | null}
*/
function PlayAudioButton(props: PlayAudioButtonProps): JSX.Element | null {

  const AUDIO_ID = 'play-button-audio';

  const [isPlaying, setPlaying] = React.useState<boolean>(false);
  const [startTime, setStartTime] = React.useState<number>(0);

  let timeUpdateListener: EventListener;

  function getAudioElement(): HTMLAudioElement | null {
    return document.querySelector(`audio#${AUDIO_ID}`) as HTMLAudioElement;
  }
  
  React.useEffect(function addOnEndedEventListener() {
    const audio = getAudioElement();
    if (audio == null) return;
    const listener = () => {
      setPlaying(false);
    }
    audio.addEventListener('onended', listener);
    return (() => removeEventListener('onended', listener));
  }, []);

  React.useEffect(function setAudioPlayerSrc() {
    if (props.file == null) return;
    const audio = getAudioElement();
    if (audio == null) return;
    audio.src = URL.createObjectURL(props.file);
  }, [props.file])

  React.useEffect(function togglePlaying() {
    const audio = getAudioElement();
    if (audio == null) return;
    if (isPlaying === true) {
      audio.currentTime = startTime;
      audio.play();
    } else {
      audio.pause();
      if (timeUpdateListener) audio.removeEventListener('timeupdate', timeUpdateListener);
    }
  }, [isPlaying])

  function setAudioStartAndEndTimes(audio: HTMLAudioElement, range: Range) {
    const duration = audio.duration;
    const start = duration * Math.min(range.from, range.to);
    const end = duration * Math.max(range.from, range.to);
    setStartTime(start);

    if (timeUpdateListener) audio.removeEventListener('timeupdate', timeUpdateListener);
    timeUpdateListener = () => {
      if (audio.currentTime >= end) {
        audio.removeEventListener('timeupdate', timeUpdateListener);
        setPlaying(false);
      }
    }
    audio.addEventListener('timeupdate', timeUpdateListener)
  }

  const handleClick = () => {
    if (isPlaying) setPlaying(false);
    else {
      const audio = document.querySelector(`audio#${AUDIO_ID}`) as HTMLAudioElement;
      if (audio != null) setAudioStartAndEndTimes(audio, props.range ?? { from: 0.0, to: 1.0 });
      setPlaying(true);
    }
  }

  function renderAudioElement(): JSX.Element | null {
    if (props.file == null) return null;
    return (
      <audio
        id={AUDIO_ID}
        autoPlay={false}
        controls={false}
        src={URL.createObjectURL(props.file)}
        onEnded={() => setPlaying(false)}
      >
      </audio>
    );
  }

  return (
    <>
      {/* {renderAudioElement()} */}
      <button className='play-audio-button' disabled={(props.range == null || props.file == null) && !isPlaying} onClick={handleClick}>{isPlaying ? 'Pause' : 'Play'}</button>
    </>
  );
}

export default PlayAudioButton;