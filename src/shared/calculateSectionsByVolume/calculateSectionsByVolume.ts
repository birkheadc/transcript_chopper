import Range from "../../types/range/range";
import { VolumeArray } from "../../types/volumeArray/volumeArray";

const PADDING_IN_SECONDS = 0.1;

/**
 * Attempts to automatically separate an audio file, represented by that files's volume array, into sections based on white space.
 * @param {VolumeArray} volumeArray The volume array representing the audio file.
 * @param {number} sensitivity The user-supplied parameter to determine how sensitive the algorithm should be when judging whitespace and meaningful audio.
 * @param {number} sectionLength How long the sections should generally be. A larger value should result in longer sections.
 * @returns {Range[]} A Range[] representing what the algorithm decided were sections of meaningful audio.
 */
export default function calculateSectionsByVolume(volumeArray: VolumeArray, sensitivity: number, sectionLength: number): Range[] {
  const threshold = calculateThreshold(volumeArray.max, volumeArray.min, sensitivity);
  const fuzzyArray = volumeArray;
  // const fuzzyArray = convertVolumeArrayToRoundedArray(volumeArray);

  // Tracks turning points, where the audio passes the threshold between whitespace and important audio,
  // as a float representing the point in time (0.0 is start of track, 1.0 is end of track).
  const points: number[] = [];

  let previousValue: number = fuzzyArray.min;
  
  for (let i = 0; i < fuzzyArray.volume.length; i++) {
    const value = fuzzyArray.volume[i];
    if (isThresholdBetweenTwoNumbers(threshold, previousValue, value) === true) {
      points.push(i / (fuzzyArray.volume.length - 1));
    }
    previousValue = value;
  }


  // If there are an odd number of points, add the end of the track as a final point.
  if (points.length % 2 !== 0) {
    points.push(fuzzyArray.volume[fuzzyArray.volume.length - 1]);
  }

  console.log('Calculating Sections...');
  console.log(`Found ${points.length} points that cross the threshold.`);

  const sections: Range[] = breakPointsIntoSections(fuzzyArray, points, sectionLength);
  console.log(`Broke into ${sections.length} sections based on length of white space between point pairs`);
  console.log(sections);
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
  console.log('Calculating threshold...');
  console.log(`Sensitivity: ${sensitivity}`);
  const distance = (max / 2) - 0;
  const offset = distance * (sensitivity / 100);
  const threshold = offset + 0;
  console.log(`Threshold: ${threshold}`);
  return threshold;
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
function breakPointsIntoSections(volumeArray: VolumeArray, points: number[], sectionLength: number): Range[] {
  if (points.length < 2) return [];

  const padding = PADDING_IN_SECONDS / volumeArray.duration;

  if (points.length === 2) return [
    {from: Math.max(points[0] - padding, 0.0), to: Math.min(points[1] + padding, 1.0)}
  ]

  const maxWhiteSpace = calculateMaxWhiteSpace(volumeArray, sectionLength);

  const sections: Range[] = [];
  let i = 2;
  let currentFrom = points[0];
  let currentTo = points[1];
  while (i < points.length) {
    if (points[i] - currentTo < maxWhiteSpace) {
      currentTo = points[i+1];
      i = i + 2;
      if (i >= points.length) {
        sections.push({ from: Math.max(currentFrom - padding, 0.0), to: Math.min(currentTo + padding, 1.0) });
      }
    } else {
      sections.push({ from: Math.max(currentFrom - padding, 0.0), to: Math.min(currentTo + padding, 1.0) });
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
function calculateMaxWhiteSpace(volumeArray: VolumeArray, sectionLength: number): number {
  const MIN_WHITE_SPACE_IN_SECONDS = 0.1;
  const MAX_WHITE_SPACE_IN_SECONDS = 5.0;
  const minWhiteSpace = MIN_WHITE_SPACE_IN_SECONDS / volumeArray.duration;
  const maxWhiteSpace = MAX_WHITE_SPACE_IN_SECONDS / volumeArray.duration;

  const modifiedMax = (maxWhiteSpace - minWhiteSpace) * (sectionLength / 100) + minWhiteSpace;

  return Math.max(minWhiteSpace, modifiedMax);
}

function convertVolumeArrayToRoundedArray(volumeArray: VolumeArray): VolumeArray {
  const ROUND_RADIUS: number = 0;

  const newVolume: number[] = [];

  let sum = 0;
  let count = 0;

  // Handle first edge of array first
  for (let i = 0; i < ROUND_RADIUS; i++) {
    sum = 0;
    count = 0;
    for (let j = Math.max(0, i - ROUND_RADIUS); j <= Math.min(i + ROUND_RADIUS, volumeArray.volume.length - 1); j++) {
      sum += volumeArray.volume[j];
      count++;
    }

    newVolume.push(sum / count);
  }
  
  // Handle body of array
  sum = 0;
  for (let i = 0; i < ROUND_RADIUS * 2 + 1; i++) {
    sum += volumeArray.volume[i];
  }

  for (let i = ROUND_RADIUS; i < volumeArray.volume.length - ROUND_RADIUS; i++) {
    newVolume.push(sum / ROUND_RADIUS * 2 + 1);
    sum -= volumeArray.volume[i - ROUND_RADIUS];
    sum += volumeArray.volume[i + ROUND_RADIUS + 1];
  }

  // Handle the other edge of array
  for (let i = volumeArray.volume.length - 1; i > (volumeArray.volume.length - 1) - ROUND_RADIUS; i--) {
    sum = 0;
    count = 0;
    for (let j = Math.max(0, i - ROUND_RADIUS); j <= Math.min(i + ROUND_RADIUS, volumeArray.volume.length - 1); j++) {
      sum += volumeArray.volume[j];
      count++;
    }

    newVolume.push(sum / count);
  }

  return {
    volume: newVolume,
    max: volumeArray.max,
    min: volumeArray.min,
    duration: volumeArray.duration,
    chunkSize: volumeArray.chunkSize
  }
}