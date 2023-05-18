import { file } from "jszip";
import Range from "../../types/interfaces/range/range";
import { encode } from 'wav-encoder';

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

export async function chopAudio(originalAudioFile: File, sections: Range) : Promise<Blob | null>
export async function chopAudio(originalAudioFile: File, sections: Range[]) : Promise<Blob[] | null>
export async function chopAudio(originalAudioFile: File, sections: Range[] | Range): Promise<Blob[] | Blob |  null> {
  try {
    const blobs: Blob[] = [];
    const audioContext = new AudioContext();
    const url = URL.createObjectURL(originalAudioFile);

    const audioBuffer = await audioContext.decodeAudioData(await fetch(url).then(response => response.arrayBuffer()));

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

      // I have no idea why, but the samplerate is somehow messed up by the interleaving,
      // So I multiply it by the number of channels and the audio is fixed.
      const wavFile: ArrayBuffer = await encode({
        sampleRate: newBuffer.sampleRate * newBuffer.numberOfChannels,
        channelData: [interleavedSamples],
        bitDepth: 24
      });

      const blob = new Blob([wavFile], { type: 'audio/wav' });
      blobs.push(blob);
    }
    
    return Array.isArray(sections) ? blobs : blobs[0];
  } catch (error) {
    console.log('Error chopping audio.');
    return null;
  }
}