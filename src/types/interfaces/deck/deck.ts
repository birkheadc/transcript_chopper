import Card from "./card";

export default interface Deck {
  originalAudioFile: File | undefined,
  cards: Card[]
}