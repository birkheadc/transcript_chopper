import * as React from 'react';
import './FlashcardFormatter.css'
import StubAudioPair from '../../../../types/interfaces/stubRangePair/stubAudioPair';
import Deck from '../../../../types/interfaces/deck/deck';
import options from './options/options';
import FinalizeSelector from '../finalizer/finalizeSelector/FinalizeSelector';
import FlashcardEditor from './flashcardEditor/FlashcardEditor';
import { FlashcardFileFormat } from '../../../../types/enums/formats/finalFileFormat';
import DeckGenerator from './deckGenerator/DeckGenerator';
import Card from '../../../../types/interfaces/deck/card';

interface FlashcardFormatterProps {
  originalAudioFile: File | undefined,
  pairs: StubAudioPair[]
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

  React.useEffect(function buildBasicDeckFromDataIfStandardFormatSelected() {
    if (format !== FlashcardFileFormat.StandardZip) return;

    const cards: Card[] = Array.from(props.pairs, pair => ({ transcript: pair.stub, audio: pair.audio, extras: [] }));
    setDeck({ originalAudioFile: props.originalAudioFile, cards: cards });
  }, [ props.originalAudioFile, props.pairs, format ]);

  const handleUpdateCards = (cards: Card[]) => {
    if (props.originalAudioFile == null) return;
    if (cards.length < 1) setDeck(undefined);
    else setDeck({ originalAudioFile: props.originalAudioFile, cards: cards });
  }

  function renderBody(): JSX.Element | null {
    if (format === FlashcardFileFormat.Null) {
      return <FinalizeSelector label={'Deck Style'} options ={options.FORMATS} current={format} change={(n: number) => setFormat(n)}/>
    }
    if (format === FlashcardFileFormat.StandardZip) return null;
    return <FlashcardEditor originalAudioFile={props.originalAudioFile} pairs={props.pairs} updateCards={handleUpdateCards} />
  }

  function renderDownloadLink(): JSX.Element | null {
    if (deck == null) return null;
    return <DeckGenerator deck={deck} format={format} />
  }

  return (
    <div className='flashcard-formatter-wrapper'>
      <h2>How would you like your flashcards?</h2>
      {renderBody()}
      {renderDownloadLink()}
    </div>
  );
}

export default FlashcardFormatter;