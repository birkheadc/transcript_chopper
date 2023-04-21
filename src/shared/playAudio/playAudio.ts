// import Range from "../../types/range/range";

// let stopCurrentAudio = () => {};


// // export default async function playAudio(blob: Blob | undefined, range: Range | undefined): Promise<void> {
// //   try {
// //     if (blob == null) return;
// //     const audioElement = document.querySelector('#audio-player') as HTMLAudioElement;
// //     console.log(audioElement);
// //   } catch (error) {
// //     console.log('Error playing audio: ', error);
// //   }
// // }

// /**
//  * 
//  * @param {File} file The audio file to play.
//  * @param {Range} range When to start and stop playing, as a ration between 0.0 and 1.0.
//  * @param {AudioContext} props.audioContext The audio context to use.
//  * @returns {Promise<void>}
//  */
// export default async function playAudio(file: File | undefined, range: Range | undefined): Promise<void> {
//   // Todo: Possible refactor
//   // Todo: A way to stop the playback
//   if (file == null) return;
//   try {
//     // removeOldAudioElements();
//     stopCurrentAudio();
    
//     const audioElement = new Audio(URL.createObjectURL(file));
//     audioElement.addEventListener('loadedmetadata', () => {
//       const duration = audioElement.duration;
//       const start = duration * (Math.min(range?.from ?? 0, range?.to ?? 1.0));
//       const end = duration * (Math.max(range?.from ?? 0, range?.to ?? 1.0));

//       audioElement.currentTime = start;

//       audioElement.addEventListener('timeupdate', (event) => {
//         if (audioElement.currentTime >= end) audioElement.pause();
//       })

//       audioElement.play();
//       stopCurrentAudio = (() => { audioElement.pause });
//     });
//   }
//   catch (error) {
//     console.log('Error attempting to play audio', error);
//     return;
//   }
// }

// function getOrCreateAudioElement(): HTMLAudioElement {
//   let element = document.querySelector('audio') as HTMLAudioElement;
//   console.log('Element: ', element);
//   if (element != null) return element;
//   return document.createElement('audio');
// }