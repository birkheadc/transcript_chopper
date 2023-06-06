import * as React from 'react';
import FlashcardEditor from './FlashcardEditor'
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const BUTTONS = [
  'cloze',
  'reset',
  'back',
  'add extra field'
]

describe('FlashcardEditor', () => {
  it('renders without crashing', () => {
    const props = getPropsWithoutAudioFileAndPairs();
    renderFlashcardEditor(props);
  });

  it('displays BUTTONS and next|finish button', () => {
    const props = getPropsWithAudioFileAndNPairs(3);
    renderFlashcardEditor(props);

    getButtons();
  });

  it('displays {current} / {total} sections, and updates {current} when click next', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    getCurrentTotalSectionsDisplay(1, numPairs);
    
    const buttons = getButtons();
    fireEvent.click(buttons.next);

    getCurrentTotalSectionsDisplay(2, numPairs);
  });

  it('fills the textarea with the trimmed text of the first pair when mounting', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const textarea = getTextarea();
    expect(textarea).toHaveTextContent(props.pairs[0].stub);
  });

  it('re-fills the textarea with the trimmed text of the next pair when click next', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const textarea = getTextarea();
    expect(textarea).toHaveTextContent(props.pairs[0].stub);

    const newValue = 'edited';

    fireEvent.change(textarea, { target: { value: newValue }});
    expect(textarea).toHaveTextContent(newValue);

    const buttons = getButtons();
    fireEvent.click(buttons.next);

    expect(textarea).toHaveTextContent(props.pairs[1].stub);
  });

  it('disables back button when editing first section, enables when press next', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const buttons = getButtons();
    expect(buttons.back).toBeDisabled();

    fireEvent.click(buttons.next);
    expect(buttons.back).toBeEnabled();
  });

  it('changes next button to finish on last section', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const buttons = getButtons();
    expect(buttons.next).toHaveTextContent(/next/i);
    expect(buttons.next).not.toHaveTextContent(/finish/i);

    for (let i = 1; i < numPairs; i++) {
      fireEvent.click(buttons.next);
    }

    expect(buttons.next).toHaveTextContent(/finish/i);
    expect(buttons.next).not.toHaveTextContent(/next/i);
  });

  it('replaces selected text in textarea with cloze formatted text when press cloze', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const textarea = getTextarea();
    const originalText = props.pairs[0].stub;
    expect(textarea).toHaveTextContent(originalText);

    const i = 0, j = 6;
    simulateSelectTextareaFromIToJ(textarea, i, j);
    
    const buttons = getButtons();
    fireEvent.click(buttons.cloze);

    const expectedText =
      originalText.substring(0, i) +
      '{{c1::' +
      originalText.substring(i, j) +
      '}}' +
      originalText.substring(j);

    expect(textarea).toHaveTextContent(expectedText);
  });

  it('properly increments the cloze index when creating multiple cloze sections', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const textarea = getTextarea();
    const originalText = props.pairs[0].stub;
    expect(textarea).toHaveTextContent(originalText);

    let i = 0, j = 3;
    simulateSelectTextareaFromIToJ(textarea, i, j);
    
    const buttons = getButtons();
    fireEvent.click(buttons.cloze);

    let expectedText = originalText;
    expectedText =
      expectedText.substring(0, i) +
      '{{c1::' +
      expectedText.substring(i, j) +
      '}}' +
      expectedText.substring(j);

    expect(textarea).toHaveTextContent(expectedText);

    i = 5, j = 8;
    simulateSelectTextareaFromIToJ(textarea, i, j);

    fireEvent.click(buttons.cloze);

    expectedText =
    expectedText.substring(0, i) +
    '{{c2::' +
    expectedText.substring(i, j) +
    '}}' +
    expectedText.substring(j);

    expect(textarea).toHaveTextContent(expectedText);
  });

  it('resets text to original trimmed text of current pair when click reset', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const originalText = props.pairs[0].stub;

    const textarea = getTextarea();
    expect(textarea).toHaveTextContent(originalText);

    const newValue = 'edited';
    fireEvent.change(textarea, { target: { value: newValue }});
    expect(textarea).toHaveTextContent(newValue);

    const buttons = getButtons();
    fireEvent.click(buttons.reset);
    
    expect(textarea).toHaveTextContent(originalText);
  });

  it('reloads edited text when press back to return to previous section', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const originalText = props.pairs[0].stub;

    const textarea = getTextarea();
    expect(textarea).toHaveTextContent(originalText);

    const editedValue = 'edited';
    fireEvent.change(textarea, { target: { value: editedValue }});
    expect(textarea).toHaveTextContent(editedValue);

    const buttons = getButtons();
    fireEvent.click(buttons.next);

    expect(textarea).toHaveTextContent(props.pairs[1].stub);

    fireEvent.click(buttons.back);

    expect(textarea).toHaveTextContent(editedValue);
  });

  it('opens a prompt when press add-extra-field', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const buttons = getButtons();

    expect(global.window.prompt).not.toHaveBeenCalled();
    fireEvent.click(buttons['add extra field']);
    expect(global.window.prompt).toHaveBeenCalled();
  });

  it('creates an extra textbox when press add-extra-field', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const buttons = getButtons();

    const container = getExtraTextboxContainer();
    expect(container.childNodes).toHaveLength(0);

    fireEvent.click(buttons['add extra field']);
    expect(container.childNodes).toHaveLength(1);

    fireEvent.click(buttons['add extra field']);
    expect(container.childNodes).toHaveLength(2);
  });

  it('removes extra textbox when press x button', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const buttons = getButtons();

    const container = getExtraTextboxContainer();
    expect(container.childNodes).toHaveLength(0);

    fireEvent.click(buttons['add extra field']);
    expect(container.childNodes).toHaveLength(1);

    const xButton = screen.getByRole('button', { name: /^x$/i });
    fireEvent.click(xButton);

    expect(container.childNodes).toHaveLength(0);
  });

  it('keeps extra textboxes when press next', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const buttons = getButtons();

    const container = getExtraTextboxContainer();
    expect(container.childNodes).toHaveLength(0);

    fireEvent.click(buttons['add extra field']);
    expect(container.childNodes).toHaveLength(1);

    fireEvent.click(buttons.next);
    expect(container.childNodes).toHaveLength(1);
  });

  it('clears extra textbox when press next, reloads edited data when press back', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const buttons = getButtons();
    const container = getExtraTextboxContainer();

    fireEvent.click(buttons['add extra field']);
    expect(container.childNodes).toHaveLength(1);

    const extraTextbox = getExtraTextboxes()[0];
    expect(extraTextbox).toHaveTextContent('');

    const editedText = 'edited';
    fireEvent.change(extraTextbox, { target: { value: editedText } });
    expect(extraTextbox).toHaveTextContent(editedText);

    fireEvent.click(buttons.next);
    expect(extraTextbox).toHaveTextContent('');

    fireEvent.click(buttons.back);
    expect(extraTextbox).toHaveTextContent(editedText);
  });

  it('calls updateCards([]) when mount', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    expect(props.updateCards).toHaveBeenCalledTimes(1);
    expect(props.updateCards).toHaveBeenLastCalledWith([]);
  });

  it('calls updateCards when press finish button', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const buttons = getButtons();
    for (let i = 0; i < numPairs; i++) {
      fireEvent.click(buttons.next);
    }
    
    expect(props.updateCards).toHaveBeenCalledTimes(2);

    // Todo: It might be possible to more specifically check what the function was called with.
    // For now, just expect the function to not be called with an empty array.
    expect(props.updateCards).not.toHaveBeenLastCalledWith([]);
  });

  it('calls updateCards([]) when press back button after press finish button', () => {
    const numPairs = 3;
    const props = getPropsWithAudioFileAndNPairs(numPairs);
    renderFlashcardEditor(props);

    const buttons = getButtons();
    for (let i = 0; i < numPairs; i++) {
      fireEvent.click(buttons.next);
    }

    fireEvent.click(buttons.back);

    expect(props.updateCards).toHaveBeenCalledTimes(3);
    expect(props.updateCards).toHaveBeenLastCalledWith([]);
  });
});

function getPropsWithoutAudioFileAndPairs() {
  return {
    originalAudioFile: undefined,
    pairs: [],
    updateCards: jest.fn((cards) => {})
  };
}

function getPropsWithAudioFileAndNPairs(n) {
  return {
    originalAudioFile: new File([''], 'audio.wav', { type: 'audio/wav' }),
    pairs: getNStubAudioPairs(n),
    updateCards: jest.fn((cards) => {})
  };
}

function getNStubAudioPairs(n) {
  const pairs = [];
  for (let i = 0; i < n; i++) {
    const pair = {
      stub: 'mock string',
      audio: new Blob([''], { type: 'audio/wav '})
    };
    pairs.push(pair);
  }
  return pairs;
}

function renderFlashcardEditor(props) {
  render(<FlashcardEditor {...props} />);
}

function getButtons() {
  const buttons = {};
  for (const element of BUTTONS) {
    const regex = new RegExp(element, 'i');
    const button = screen.getByRole('button', { name: regex });
    buttons[element] = button;
  }
  buttons.next = getNextOrFinishButton();
  return buttons;
}

function getNextOrFinishButton() {
  return screen.getByRole('button', { name: /next|finish/i });
}

function getCurrentTotalSectionsDisplay(current, total) {
  return screen.getByText(`${current} / ${total}`);
}

function getTextarea() {
  return screen.getByLabelText('Text');
}

function simulateSelectTextareaFromIToJ(textarea, i, j) {
  textarea.setSelectionRange(i, j);
}

function getExtraTextboxContainer() {
  return screen.getByTestId('flashcard-extra-textbox-container');
}

function getExtraTextboxes() {
  return screen.getAllByTestId('flashcard-extra-textbox');
}