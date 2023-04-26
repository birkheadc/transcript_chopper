import { VolumeArray } from "../../types/volumeArray/volumeArray";

export default async function createVolumeArray(audio: File | Blob, chunkSize: number): Promise<VolumeArray> {
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
    while (i < length) {
      const value = (
        float32Array.slice(i, i += chunkSize).reduce(function (total, value) {
          return Math.max(total, Math.abs(value));
        })
      );
      array.push(value);
      if (value > max) max = value;
      if (value < min) min = value;
    }

    return {
      volume: array,
      max: max,
      min: min,
      chunkSize: chunkSize
    };
  } catch {
    console.log('Error creating volume array.');
    return {
      volume: [],
      max: 0,
      min: 0,
      chunkSize: chunkSize
    };
  }
}