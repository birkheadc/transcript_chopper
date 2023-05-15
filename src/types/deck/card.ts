import Range from "../range/range";

export default interface Card {
  transcript: string,
  audio: Blob,
  extras: string[]
}