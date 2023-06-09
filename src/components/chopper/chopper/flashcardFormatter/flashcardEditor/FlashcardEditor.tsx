import * as React from 'react';
import './FlashcardEditor.css'
import StubAudioPair from '../../../../../types/interfaces/stubRangePair/stubAudioPair';
import Card from '../../../../../types/interfaces/deck/card';
import FlashcardTextbox from './flashcardTextbox/FlashcardTextbox';
import FlashcardExtraTextbox from './flashcardExtraTextbox/FlashcardExtraTextbox';
import FlashcardEditorControls from './flashcardEditorControls/FlashcardEditorControls';
import { FlashcardFileFormat } from '../../../../../types/enums/formats/finalFileFormat';

interface FlashcardEditorProps {
  originalAudioFile: File | undefined,
  pairs: StubAudioPair[],
  updateCards: (cards: Card[]) => void,
}

/**
* The editor the user interacts with to create custom flashcards from their data.
* @param {File} props.originalAudioFile The original audio file to chop.
* @param {Range[]} props.pairs The sections of the audio to split, and their respective strings.
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
    if (current + 1 < cards.length) {
      setCurrent(current => current + 1);
    }
    else {
      setFinished(true);
    }
  }

  const resetCurrentSelected = () => {
    const originalText: string = props.pairs[current].stub;
    const newCards = [...cards];
    const newCard = newCards[current];
    newCard.transcript = originalText;
    setCards(newCards);
  }

  const updateCurrentSelectedTranscript = (newValue: string) => {
    const newCards = [...cards];

    const newCard = newCards[current];
    newCard.transcript = newValue;

    setCards(newCards);
  }

  const deleteCurrentCard = () => {
    if (cards.length < 2) {
      alert("You can't delete the last card!");
      return;
    }
    const newCards = [...cards];
    newCards.splice(current, 1);
    setCards(newCards);
    if (current >= newCards.length) {
      setCurrent(newCards.length - 1);
    }
    setFinished(false);
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
    return (cards.length < 1) ? null :
    <>
      <FlashcardTextbox audioFile={cards[current].audio} handleDeleteSection={deleteCurrentCard} updateTranscript={updateCurrentSelectedTranscript} value={cards[current].transcript} reset={resetCurrentSelected} />
      <div id='flashcard-extra-textbox-container' data-testid='flashcard-extra-textbox-container'>
      {extras.map(
        (extra, index) =>
        <FlashcardExtraTextbox key={index} index={index} fieldName={extra} value={cards[current].extras[index]} update={updateCurrentSelectedExtra} delete={deleteExtraField} />
      )}
      </div>
      <FlashcardEditorControls back={handleBack} next={handleNext} current={current} total={cards.length} addField={addExtraField} />
    </>
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