import Range from "../range/range";

export default interface StubAudioPair {
  stub: string,
  audio: Blob,
  range?: Range
}