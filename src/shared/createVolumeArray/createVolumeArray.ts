import { VolumeArray } from "../../types/volumeArray/volumeArray";

const VOLUME_MAX_LENGTH = 50000;
const MIN_CHUNK_SIZE = 1;

function determineChunkSize(channelDataLength: number): number {
  return Math.max(Math.ceil(channelDataLength / VOLUME_MAX_LENGTH), MIN_CHUNK_SIZE);
}

export default async function createVolumeArray(audio: File | Blob): Promise<VolumeArray> {
  try {
    const audioContext = new AudioContext();
    const buffer = await audio.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const float32Array = audioBuffer.getChannelData(0);
    
    const array: number[] = [];
    let min: number = float32Array[0];
    let max: number = float32Array[0];
    let i = 0;
    const length = float32Array.length;

    const chunkSize = determineChunkSize(length);

    while (i < length) {
      const slice = float32Array.slice(i, i += chunkSize);

      let sum = 0;
      for (let ii = 0; ii < slice.length; ii++) sum += slice[ii];

      const value = sum / slice.length;

      array.push(value);
      if (value > max) max = value;
      if (value < min) min = value;
    }

    const output = {
      volume: array,
      max: max,
      min: min,
      chunkSize: chunkSize,
      duration: audioBuffer.duration
    }

    console.log('Created Volume Array.');
    console.log(output);

    return output;
  } catch {
    console.log('Error creating volume array.');
    return {
      volume: [],
      max: 0,
      min: 0,
      chunkSize: 1,
      duration: 0
    };
  }
}