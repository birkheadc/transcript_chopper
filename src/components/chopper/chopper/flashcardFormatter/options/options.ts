import { FlashcardFileFormat } from "../../../../../types/enums/formats/finalFileFormat"

const FORMATS: { label: string, value: number, hint: string }[] = [
  {
    label: 'How would you like to create your cards?',
    value: FlashcardFileFormat.Null,
    hint: 'Not yet implemented'
  },
  {
    label: 'Basic Cards Zip: Two fields; one with text, other with link to audio',
    value: FlashcardFileFormat.StandardZip,
    hint: 'Not yet implemented'
  },
  {
    label: 'Custom Cards Zipped: Open the editor which allows Cloze editing and adding extra fields',
    value: FlashcardFileFormat.CustomZip,
    hint: 'Not yet implemented'
  },
  // TODO: Uncomment this section if/when APKG formatting is worked out
  // {
  //   label: 'Custom APKG: Open the editor which allows Cloze editing and adding extra fields, download in APKG format for Anki',
  //   value: FlashcardFileFormat.APKG,
  //   hint: 'Not yet implemented'
  // }
]

export default {
  FORMATS
}