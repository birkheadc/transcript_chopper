import * as React from 'react';
import './FlashcardFormatter.css'
import StubRangePair from '../../../../../types/stubRangePair/stubRangePair';
import Deck from '../../../../../types/deck/deck';
import options from './options/options';
import FinalizeSelector from '../finalizer/finalizeSelector/FinalizeSelector';
import FlashcardEditor from './flashcardEditor/FlashcardEditor';
import FileGenerator from '../finalizer/fileGenerator/FileGenerator';
import { FinalFileFormat } from '../../../../../types/formats/finalFileFormat';
import { FinalFileNamingScheme } from '../../../../../types/formats/finalFileNamingScheme';
import DeckGenerator from './deckGenerator/DeckGenerator';

interface FlashcardFormatterProps {
  originalAudioFile: File | undefined,
  pairs: StubRangePair[],
}

/**
* The component that assists the user in creating flashcard-formatted files out of their data.
* @param {File} props.originalAudioFile The original audio file to chop.
* @param {Range[]} props.pairs The sections of the audio to split, and their respective strings.
* @returns {JSX.Element | null}
*/
function FlashcardFormatter(props: FlashcardFormatterProps): JSX.Element | null {

  const [format, setFormat] = React.useState<number>(0);
  const [deck, setDeck] = React.useState<Deck | undefined>(undefined);

  function renderSelector(): JSX.Element | null {
    if (format !== 0) return null;
    return <FinalizeSelector label={'Deck Style'} options={options.FORMATS} current={format} change={(n: number) => setFormat(n)}/>
  }

  function renderEditor(): JSX.Element | null {
    if (format !== 2) return null;
    return <FlashcardEditor originalAudioFile={props.originalAudioFile} pairs={props.pairs} />
  }

  function renderFileGenerator(): JSX.Element | null {
    if (format === 1) return <FileGenerator originalAudioFile={props.originalAudioFile} pairs={props.pairs} format={FinalFileFormat.StandardAnkiCard} namingScheme={FinalFileNamingScheme.UUID} />
    if (format === 2 && deck != null) return <DeckGenerator />
    return null;
  }

  return (
    <div className='flashcard-formatter-wrapper'>
      <h2>How would you like your flashcards?</h2>
      {renderSelector()}
      {renderEditor()}
      {renderFileGenerator()}
    </div>
  );
}

export default FlashcardFormatter;