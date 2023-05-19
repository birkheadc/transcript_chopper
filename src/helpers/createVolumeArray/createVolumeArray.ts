import { VolumeArray } from "../../types/interfaces/volumeArray/volumeArray";

function determineChunkSize(channelDataLength: number): number {
  const VOLUME_MAX_LENGTH = 50000;
  const MIN_CHUNK_SIZE = 1;
  return 128;
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
      max = Math.max(max, value);
      min = Math.min(min, value);
    }

    const output = {
      volume: array,
      max: max,
      min: min,
      chunkSize: chunkSize,
      duration: audioBuffer.duration
    }


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