import Range from "../../types/range/range";

/**
 * 
 * @param {File} file The audio file to play.
 * @param {Range} range When to start and stop playing, as a ration between 0.0 and 1.0.
 * @returns {Promise<void>}
 */
export default async function playAudio(file: File | undefined, range: Range | undefined): Promise<void> {
  // Todo: Possible refactor
  if (file == null) return;
  const audioContext = new AudioContext();
  const audioElement = document.createElement('audio');
  audioElement.src = URL.createObjectURL(file);
  audioContext.createMediaElementSource(audioElement);
  try {
    const audioBuffer = await audioContext.decodeAudioData(await fetch(audioElement.src).then(response => response.arrayBuffer()));
    
    let startTime = range ? Math.min(range.from, range.to) : 0.0;
    let endTime = range ? Math.max(range.from, range.to) : 1.0;

    const startFrame = Math.floor(startTime * audioBuffer.duration * audioBuffer.sampleRate);
    const endFrame = Math.floor(endTime * audioBuffer.duration *  audioBuffer.sampleRate);

    const newBuffer = audioContext.createBuffer(audioBuffer.numberOfChannels, endFrame - startFrame, audioBuffer.sampleRate);

    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      const channelData = audioBuffer.getChannelData(i);
      const newChannelData = newBuffer.getChannelData(i);
      newChannelData.set(channelData.subarray(startFrame, endFrame));
    }

    const audioBufferSource = audioContext.createBufferSource();
    audioBufferSource.buffer = newBuffer;
    audioBufferSource.connect(audioContext.destination);
    audioBufferSource.start(0);
  }
  catch (error) {
    console.log('Error attempting to play audio: ', error);
  }

  
}