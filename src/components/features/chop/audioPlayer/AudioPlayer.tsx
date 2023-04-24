// Todo: I think this component can be deleted.

// import * as React from 'react';
// import Range from '../../../../types/range/range';

// export interface AudioPlayerProps {
//   file: File | undefined,
//   range: Range | undefined
// }
// /**
//  * 
//  * @param {} props
//  * @returns {JSX.Element | null}
//  */
// function AudioPlayer(props: AudioPlayerProps): JSX.Element | null {

//   function playAudioInRange(element: HTMLAudioElement, range: Range | undefined): EventListener {
//     const duration = element.duration;
//     const start = duration * Math.min(range?.from ?? 0.0, range?.to ?? 1.0);
//     const end = duration * Math.max(range?.from ?? 0.0, range?.to ?? 1.0);
//     element.currentTime = start;
//     element.play();
//     return (() => { if (element.currentTime >= end) element.pause() });
//   }

//   React.useEffect(function playAudio() {
//     const element = document.querySelector('#audio-player') as HTMLAudioElement;
//     if (element == null) return;

//     let timeUpdateListener: EventListener;

//     const loadedMetaDataListener = () => {
//       if (timeUpdateListener != null) element.removeEventListener('timeupdate', timeUpdateListener);
//       timeUpdateListener = playAudioInRange(element, props.range);
//       element.addEventListener('timeupdate', timeUpdateListener);
//     };
    
//     element.addEventListener('loadedmetadata', loadedMetaDataListener);
    
//     return (() => {
//       element.removeEventListener('loadedmetadata', loadedMetaDataListener);
//       if (timeUpdateListener != null) element.removeEventListener('timeupdate', timeUpdateListener);
//     })
//   }, [ props.file, props.range]);

//   if (props.file == null) return null;
//   return (
//     <audio id='audio-player' src={URL.createObjectURL(props.file)}></audio>
//   );
// }

// export default AudioPlayer;