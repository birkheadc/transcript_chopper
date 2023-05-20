import { VolumeArray } from "../../types/interfaces/volumeArray/volumeArray";

// Todo: Currently, this algorithm only uses the first channel of the audio data.
// If this becomes a problem for some users, it can be fixed later.

// Todo: This should probably be in a config file or something.
const CHUNK_SIZE = 128;

/**
 * Creates a VolumeArray object for an audio file, which is essentially just a profile of the audio,
 * containing information the application needs to process it. Returns `undefined` if there is a problem processing.
 * @param audio The audio file or blob to create the volume array for.
 * @returns {Promise<VolumeArray | undefined>}
 */
export default async function createVolumeArray(audio: File | Blob): Promise<VolumeArray | undefined> {
  try {
    const audioBuffer = await getAudioBuffer(audio);
    const float32Array = audioBuffer.getChannelData(0);
    
    const volumeArray: number[] = [];
    let minVolume: number = float32Array[0];
    let maxVolume: number = float32Array[0];

    // volumeArray lumps each frame of audio into a chunk of CHUNK_SIZE
    // Then records the average of the data for all frames in that chunk
    // Meanwhile, the largest and smallest data points are recorded in maxVolume and minVolume
    let i = 0;
    while (i < float32Array.length) {
      const slice = float32Array.slice(i, i += CHUNK_SIZE);

      let sum = 0;
      for (let ii = 0; ii < slice.length; ii++) sum += slice[ii];

      const value = sum / slice.length;

      volumeArray.push(value);
      maxVolume = Math.max(maxVolume, value);
      minVolume = Math.min(minVolume, value);
    }

    // Also included in the final VolumeArray, are
    // the CHUNK_SIZE used by this algorithm, and the duration of the full original audio.
    return {
      volume: volumeArray,
      max: maxVolume,
      min: minVolume,
      chunkSize: CHUNK_SIZE,
      duration: audioBuffer.duration
    }
  } catch {
    console.log('Error creating volume array.');
    return undefined;
  }
}

async function getAudioBuffer(audio: File | Blob): Promise<AudioBuffer> {
  const audioContext = new AudioContext();
  const buffer = await audio.arrayBuffer();
  return await audioContext.decodeAudioData(buffer);
}