import { file } from "jszip";
import Range from "../../types/range/range";

  async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as Array Buffer"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  function interleaveChannels(audioBuffer: AudioBuffer): Int16Array {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numberOfChannels;
    const interleaved = new Int16Array(length);

    for (let i = 0; i < audioBuffer.length; i++) {
      for (let j = 0; j < numberOfChannels; j++) {
        interleaved[i * numberOfChannels + j] = audioBuffer.getChannelData(j)[i] * 0x7fff;
      }
    }

    return interleaved;
  }

  export default async function chopAudio(originalAudioFile: File, sections: Range[]): Promise<File[] | null> {
    try {
      const audioContext = new AudioContext();
      const audioBuffer = await readFileAsArrayBuffer(originalAudioFile)

      const sourceNode = audioContext.createBufferSource();
      const audioBufferSource = await audioContext.decodeAudioData(audioBuffer);
      sourceNode.buffer = audioBufferSource;

      const files = [];
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const start = audioBufferSource.duration * Math.min(section.from, section.to);
        const end = audioBufferSource.duration * Math.max(section.from, section.to);
        const duration = end - start;

        const trimmedBuffer = audioContext.createBuffer(
          audioBufferSource.numberOfChannels,
          duration * audioBufferSource.sampleRate,
          audioBufferSource.sampleRate
        );

        for (let j = 0; j < audioBufferSource.numberOfChannels; j++) {
          const channelData = audioBufferSource.getChannelData(j);
          const trimmedChannelData = new Float32Array(duration * audioBufferSource.sampleRate);

          for (let k = 0; k < trimmedChannelData.length; k++) {
            trimmedChannelData[k] = channelData[k + start * audioBufferSource.sampleRate]
          }

          trimmedBuffer.copyFromChannel(trimmedChannelData, j);
        }

        const interleavedChannels = interleaveChannels(trimmedBuffer);

        const blob = new Blob([interleavedChannels], { type: originalAudioFile.type });
        const trimmedFile = new File([blob], 'file.mp3', { type: originalAudioFile.type });
        files.push(trimmedFile);
      }

      return files;

    } catch(error) {
      console.log("Error attempting to chop audio file: ", error);
      return null;
    }
  }