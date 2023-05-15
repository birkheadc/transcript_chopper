import * as React from 'react';
import './FlashcardEditor.css'
import StubRangePair from '../../../../../../types/stubRangePair/stubRangePair';
import Card from '../../../../../../types/deck/card';
import FlashcardTextbox from './flashcardTextbox/FlashcardTextbox';
import FlashcardExtraTextbox from './flashcardExtraTextbox/FlashcardExtraTextbox';
import FlashcardEditorControls from './flashcardEditorControls/FlashcardEditorControls';
import DeckGenerator from '../deckGenerator/DeckGenerator';
import { FlashcardFileFormat } from '../../../../../../types/formats/finalFileFormat';

interface FlashcardEditorProps {
  originalAudioFile: File | undefined,
  pairs: StubRangePair[],
  format: FlashcardFileFormat,
  updateCards: (cards: Card[]) => void
}

/**
* The editor the user interacts with to create custom flashcards from their data.
* @param {File} props.originalAudioFile The original audio file to chop.
* @param {Range[]} props.pairs The sections of the audio to split, and their respective strings.
* @param {FlashcardFileFormat} props.format The format to eventually generate the deck in.
* @param {(cards: Card[]) => void} props.updateCards The function to call when finished editing.
* @returns {JSX.Element | null}
*/
function FlashcardEditor(props: FlashcardEditorProps): JSX.Element | null {

  const [isFinished, setFinished] = React.useState<boolean>(false);
  const [current, setCurrent] = React.useState<number>(0);
  const [extras, setExtras] = React.useState<string[]>([]);
  const [cards, setCards] = React.useState<Card[]>([]);

  React.useEffect(function initializeCards() {
    let newCards: Card[] = [];
    for (let i = 0; i < props.pairs.length; i++) {
      const card: Card = { transcript: props.pairs[i].stub, audio: props.pairs[i].audio, extras: [] };
      newCards.push(card);
    }
    setCards(newCards);
  }, [ props.pairs ]);

  React.useEffect(function handleFinished() {
    if (isFinished === true) props.updateCards(cards);
    else props.updateCards([]);
  }, [ isFinished ]);

  const handleBack = () => {
    setCurrent(current => current - 1);
    setFinished(false);
  }

  const handleNext = () => {
    if (current + 1 < props.pairs.length) {
      setCurrent(current => current + 1);
    }
    else {
      setFinished(true);
    }
  }

  const resetCurrentSelected = () => {

    // TODO

    // const newNewPairs = [...newPairs];
    // newNewPairs[current].stub = props.pairs[current].stub;
    // setNewPairs(newNewPairs);
    // setFinished(false);
  }

  const updateCurrentSelectedTranscript = (newValue: string) => {
    const newCards = [...cards];

    const newCard = newCards[current];
    newCard.transcript = newValue;

    setCards(newCards);
  }

  const updateCurrentSelectedExtra = (index: number, newValue: string) => {
    const newCards = [...cards];

    const newCard = newCards[current];
    newCard.extras[index] = newValue;

    setCards(newCards);
  }

  const addExtraField = () => {
    const name = prompt('Name of new field');
    if (name == null) return;

    const newCards = [...cards];
    for (let i = 0; i < cards.length; i++) {
      newCards[i].extras.push('');
    }
    setCards(newCards);

    const newExtras = [...extras];
    newExtras.push(name);
    setExtras(newExtras);
  }

  const deleteExtraField = (index: number) => {
    const newCards = [...cards];
    for (let i = 0; i < cards.length; i++) {
      newCards[i].extras.splice(index, 1);
    }
    setCards(newCards);

    const newExtras = [...extras];
    newExtras.splice(index, 1);
    setExtras(newExtras);
  }

  function renderEditor(): JSX.Element | null {
    if (cards.length < 1) return null;
    return (
      <>
      <FlashcardTextbox audioFile={cards[current].audio} updateTranscript={updateCurrentSelectedTranscript} value={cards[current].transcript} reset={resetCurrentSelected} />
      {extras.map(
        (extra, index) =>
        <FlashcardExtraTextbox key={index} index={index} fieldName={extra} value={cards[current].extras[index]} update={updateCurrentSelectedExtra} delete={deleteExtraField} />
      )}
      <FlashcardEditorControls back={handleBack} next={handleNext} current={current} total={props.pairs.length} addField={addExtraField} />
      </>
    );
  }

  return (
    <div className='flashcard-editor-wrapper'>
      <h3>Flashcard Editor</h3>
      <div className='flashcard-editor-explanation'>
        <p>You can edit the text field, use the Cloze button to create Cloze (fill-in-the-blank) sections, or use the Add/Remove Extra Field buttons to create extra fields.</p>
        <p>When Cloze editing, it is not advisable to create overlapping Cloze fields; this tends to break the card when importing.</p>
      </div>
      {renderEditor()}
    </div>
  );
}

export default FlashcardEditor;