import { file } from "jszip";
import Range from "../../types/range/range";
import playAudio from "../playAudio/playAudio";
import { encode } from 'wav-encoder';


function getFileName(numSections: number, currentSection: number): string {
  if (numSections < 1) return 'audio.wav';
  return 'audio_' + currentSection.toString().padStart(numSections.toString().length, '0') + '.wav';
}

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


export default async function chopAudio(originalAudioFile: File, sections: Range[]): Promise<File[] |  null> {
  try {
    const files: File[] = [];
    const audioContext = new AudioContext();
    const url = URL.createObjectURL(originalAudioFile);

    const audioBuffer = await audioContext.decodeAudioData(await fetch(url).then(response => response.arrayBuffer()));
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
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

      const file = new File([wavFile], getFileName(sections.length, i), { type: 'audio/wav' });
      files.push(file);
    }
    
    return files;
  } catch (error) {
    console.log('Error chopping audio.');
    return null;
  }
}