import Range from "../../types/interfaces/range/range";
import { encode } from 'wav-encoder';

/**
 * Asyncronously chops an audio file into smaller audio file(s).
 * @param originalAudioFile 
 * @param sections 
 * @returns {Promise<Blob[] | Blob | null>}
 */
export async function chopAudio(originalAudioFile: File, sections: Range) : Promise<{audio: Blob, range: Range} | null>
export async function chopAudio(originalAudioFile: File, sections: Range[]) : Promise<{audio: Blob, range: Range}[] | null>
export async function chopAudio(originalAudioFile: File, sections: Range[] | Range): Promise<{audio: Blob, range: Range}[] | {audio: Blob, range: Range} |  null> {
  try {
    const blobs: {audio: Blob, range: Range}[] = [];
    const audioContext = new AudioContext();

    // const url = URL.createObjectURL(originalAudioFile);
    // const audioBuffer = await audioContext.decodeAudioData(await fetch(url).then(response => response.arrayBuffer()));
    const buffer = await originalAudioFile.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(buffer);

    const _: Range[] = Array.isArray(sections) ? sections : [sections];
    
    for (let i = 0; i < _.length; i++) {
      const section = _[i];
      let start = Math.min(section.from, section.to);
      let end = Math.max(section.from, section.to);

      let startFrame = Math.floor(start * audioBuffer.duration * audioBuffer.sampleRate);
      let endFrame = Math.floor(end * audioBuffer.duration * audioBuffer.sampleRate);

      const newBuffer = audioContext.createBuffer(audioBuffer.numberOfChannels, endFrame - startFrame, audioBuffer.sampleRate);

      for (let j = 0; j < audioBuffer.numberOfChannels; j++) {
        const channelData = audioBuffer.getChannelData(j);
        const newChannelData = newBuffer.getChannelData(j);
        newChannelData.set(channelData.subarray(startFrame, endFrame));
      }

      const interleavedSamples = toInterleavedSamples(newBuffer);

      // I am not sure why, but the sample rate is somehow messed up by the interleaving,
      // So I multiply it by the number of channels and the audio is fixed again.
      const wavFile: ArrayBuffer = await encode({
        sampleRate: newBuffer.sampleRate * newBuffer.numberOfChannels,
        channelData: [interleavedSamples],
        bitDepth: 24
      });

      const blob = new Blob([wavFile], { type: 'audio/wav' });
      blobs.push({audio: blob, range: section});
    }
    
    return Array.isArray(sections) ? blobs : blobs[0];
  } catch (error) {
    console.log('Error chopping audio.');
    return null;
  }
}

/**
 * Interleaves the audio channels from an audio buffer and returns them in an array.
 * @param audioBuffer The audio buffer to be processed
 * @returns {Float32Array}
 */
function toInterleavedSamples(audioBuffer: AudioBuffer): Float32Array {
  const numChannels = audioBuffer.numberOfChannels;
  const numSamples = audioBuffer.length;
  const interleavedSamples = new Float32Array(numChannels * numSamples);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < numSamples; i++) {
      interleavedSamples[i * numChannels + channel] = channelData[i];
    }
  }

  return interleavedSamples;
}