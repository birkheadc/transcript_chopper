import Card from "./card";

export default interface Deck {
  originalAudioFile: File,
  cards: Card[]
}