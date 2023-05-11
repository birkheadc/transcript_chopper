import Range from "../range/range";

export default interface Card {
  transcript: string,
  range: Range,
  extras: string[]
}