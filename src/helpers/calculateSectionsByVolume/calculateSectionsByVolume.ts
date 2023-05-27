import Range from "../../types/interfaces/range/range";
import { VolumeArray } from "../../types/interfaces/volumeArray/volumeArray";

const MIN_WHITE_SPACE_IN_SECONDS = 0.1;
const MAX_WHITE_SPACE_IN_SECONDS = 1.0;

/**
 * Attempts to automatically separate an audio file, represented by that files's volume array, into sections based on white space.
 * @param {VolumeArray} volumeArray The volume array representing the audio file.
 * @param {number} sensitivity The user-supplied parameter to determine how sensitive the algorithm should be when judging whitespace and meaningful audio.
 * @param {number} sectionLength How long the sections should generally be. A larger value should result in longer sections.
 * @returns {Range[]} A Range[] representing what the algorithm decided were sections of meaningful audio.
 */
export default function calculateSectionsByVolume(volumeArray: VolumeArray, sensitivity: number, sectionLength: number): Range[] {
  const thresholdVolume = calculateThreshold(volumeArray.max, sensitivity);
  const maxWhiteSpace = calculateMaxWhiteSpace(volumeArray, sectionLength);

  const sections = calculateSections(volumeArray, thresholdVolume, maxWhiteSpace);
  return sections;
}

/**
 * Iterates over the volume array, deciding where to break up the sections based on the threshold volume and maximum white space allowed in a section
 * @param {VolumeArray} volumeArray The volume array to work on.
 * @param {number} thresholdVolume How high the amplitude must be to no longer be considered white space.
 * @param {number} maxWhiteSpace How long a string of white space can be before a counting as a section break
 * @returns {Range[]} The calculated sections
 */
function calculateSections(volumeArray: VolumeArray, thresholdVolume: number, maxWhiteSpace: number): Range[] {
  const sections: Range[] = [];
  let isWhitespace = true;
  let from = 0.0;
  let to = 0.0;
  let lastNonWhitespace = 0.0;

  for (let i = 0; i < volumeArray.volume.length; i++) {
    const currentVolume = volumeArray.volume[i];
    const currentPosition = i / (volumeArray.volume.length - 1);
    if (isWhitespace) {
      if (currentVolume >= thresholdVolume) {
        isWhitespace = false;
        from = currentPosition;
        lastNonWhitespace = currentPosition;
      }
    } else {
      if (currentVolume >= thresholdVolume) {
        lastNonWhitespace = currentPosition;
      } else {
        if (currentPosition - lastNonWhitespace >= maxWhiteSpace) {
          isWhitespace = true;
          to = currentPosition;
          sections.push({ from, to: lastNonWhitespace });
        }
      }
    }
  }

  if (!isWhitespace) {
    to = 1.0;
    sections.push({ from, to });
  }

  return sections;
} 

/**
 * Calculates where the threshold between white space and meaningful audio will be determined.
 * @param {number} max The loudest volume the audio reaches.
 * @param {number} sensitivity The sensitivity parameter determined by the user to tweak this function's output.
 * @returns A number to be used as the threshold in further calculations.
 */
function calculateThreshold(max: number, sensitivity: number): number {
  const distance = (max / 2);
  const threshold = distance * (sensitivity / 100);
  return threshold;
}

/**
 * Calculates a value to represent how long of a whitespace is needed to separate two sections.
 * @param {VolumeArray} volumeArray The volume array being worked on.
 * @param {number} sectionLength The value given by the user to represent relative section length.
 */
function calculateMaxWhiteSpace(volumeArray: VolumeArray, sectionLength: number): number {
  const minWhiteSpace = MIN_WHITE_SPACE_IN_SECONDS / volumeArray.duration;
  const maxWhiteSpace = MAX_WHITE_SPACE_IN_SECONDS / volumeArray.duration;

  const modifiedMax = (maxWhiteSpace - minWhiteSpace) * (sectionLength / 100) + minWhiteSpace;

  return Math.max(minWhiteSpace, modifiedMax);
}