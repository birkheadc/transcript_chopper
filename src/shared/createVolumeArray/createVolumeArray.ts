export default async function createVolumeArray(audio: File | Blob, chunkSize: number): Promise<number[]> {
  try {
    const audioContext = new AudioContext();
    const buffer = await audio.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const float32Array = audioBuffer.getChannelData(0);
    
    const array: number[] = [];

    let i = 0;
    const length = float32Array.length;
    while (i < length) {
      array.push(
        float32Array.slice(i, i += chunkSize).reduce(function (total, value) {
          return Math.max(total, Math.abs(value));
        })
      );
    }

    return array;
  } catch {
    console.log('Error creating volume array.');
    return [];
  }
}