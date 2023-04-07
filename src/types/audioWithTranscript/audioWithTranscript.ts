export default interface AudioWithTranscript {
  audioFile: string,
  transcript: string,
  [key: string]: string
}