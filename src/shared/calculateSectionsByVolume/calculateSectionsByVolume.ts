import Range from "../../types/range/range";
import { VolumeArray } from "../../types/volumeArray/volumeArray";

/**
 * Attempts to automatically separate an audio file, represented by that files's volume array, into sections based on white space.
 * @param {VolumeArray} volumeArray The volume array representing the audio file.
 * @param {number} sensitivity The user-supplied parameter to determine how sensitive the algorithm should be when judging whitespace and meaningful audio.
 * @param {number} sectionLength How long the sections should generally be. A larger value should result in longer sections.
 * @returns {Range[]} A Range[] representing what the algorithm decided were sections of meaningful audio.
 */
export default function calculateSectionsByVolume(volumeArray: VolumeArray, sensitivity: number, sectionLength: number): Range[] {
  const threshold = calculateThreshold(volumeArray.max, volumeArray.min, sensitivity);
  // Track index of elements that mark a turning point, where the audio passes the threshold between whitespace and important audio.
  const points: number[] = [];

  let previousValue: number = volumeArray.min;
  
  for (let i = 0; i < volumeArray.volume.length; i++) {
    const value = volumeArray.volume[i];
    if (isThresholdBetweenTwoNumbers(threshold, previousValue, value) === true) {
      points.push(i / volumeArray.volume.length);
    }
    previousValue = value;
  }


  // If there are an odd number of points, add the end of the track as a final point.
  if (points.length % 2 !== 0) {
    points.push(1.0);
  }

  const sections: Range[] = breakPointsIntoSections(points, sectionLength);
  return sections;
}

/**
 * Calculates where the threshold between white space and meaningful audio will be determined.
 * @param {number} max The loudest volume the audio reaches.
 * @param {number} min The lowest volume the audio reaches.
 * @param {number} sensitivity The sensitivity parameter determined by the user to tweak this function's output.
 * @returns A number to be used as the threshold in further calculations.
 */
function calculateThreshold(max: number, min: number, sensitivity: number): number {
  const distance = max - min;
  const offset = distance * (sensitivity / 100);
  return convertParameter(min + offset);
}

/**
 * Checks 2 consecutive frames to determine whether the threshold is being crossed.
 * @param {number} threshold The threshold between white space and meaningful audio.
 * @param {number} valueA The first frame's volume.
 * @param {number} valueB The second frame's volume.
 * @returns Whether the 2 frames cross the threshold.
 */
function isThresholdBetweenTwoNumbers(threshold: number, valueA: number, valueB: number): boolean {
  // Todo: There might be some bad edge cases if a string of numbers equal / near the threshold occurs.
  // Also, this can probably be made faster somehow.
  if (valueA <= threshold) {
    return (valueB > threshold);
  } else /* valueA > threshold */ {
    return (valueB <= threshold);
  }
}

/**
 * Breaks the series of boundary points into from-to pairs.
 * @param {number[]} points The points where the audio volume crosses the threshold between white space and meaningful audio.
 * @param {number} sectionLength The parameter supplied by the user to determine how much whitespace to allow in a section of audio.
 */
function breakPointsIntoSections(points: number[], sectionLength: number): Range[] {
  if (points.length < 2) return [];

  const maxWhiteSpace = calculateMaxWhiteSpace(sectionLength);

  const sections: Range[] = [];
  let i = 2;
  let currentFrom = points[0];
  let currentTo = points[1];
  while (i < points.length) {
    if (points[i] - currentTo < maxWhiteSpace) {
      currentTo = points[i+1];
      i = i + 2;
      if (i >= points.length) {
        sections.push({ from: currentFrom, to: currentTo});
      }
    } else {
      sections.push({from: currentFrom, to: currentTo});
      currentFrom = points[i];
      currentTo = points[i+1];
      i = i + 2;
    }
  }
  return sections;
}

/**
 * Calculates a value to represent how long of a whitespace is needed to separate two sections.
 * @param {number} sectionLength 
 */
function calculateMaxWhiteSpace(sectionLength: number): number {
  return convertParameter(sectionLength) / 100;
}

/**
 * Converts the 0 - 100 parameter supplied by the user to the right scale for the algorithm.
 * @param {number} value The number to convert.
 * @returns {number} The value scaled correctly. 
 */
function convertParameter(value: number): number {
  // Todo: This function needs more thought.
  return value / 10;
}