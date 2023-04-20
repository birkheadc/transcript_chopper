import * as React from 'react';
import ClozeEditor from './ClozeEditor'
import { fireEvent, getByText, render, screen } from '@testing-library/react';
import { FinalFileNamingScheme } from '../../../../../../types/formats/finalFileNamingScheme';

function getButtons() {
  const BUTTON_LABELS = [
    'Play Audio',
    'Cloze',
    'Reset',
    'Back',
    'Next'
  ]
  const buttons = {};
  BUTTON_LABELS.forEach(label => {
   buttons[label] = screen.getByRole('button', { name: label }); 
  });
  return buttons;
}

function getTextArea() {
  return screen.getByLabelText('Text');
}

function getNStubRangePairs(n) {
  const pairs = [];
  for (let i = 0; i < n; i++) {
    const pair = {
      stub: `This is stub number ${i + 1}`,
      range: { from: i / n, to: (i+1) / n}
    };
    pairs.push(pair);
  }
  return pairs;
}

function getProps(numPairs) {
  
  return {
    originalAudioFile: new File([''], 'file.file'),
    pairs: getNStubRangePairs(numPairs),
    namingScheme: FinalFileNamingScheme.UUID
  }
}

function renderClozeEditor(props) {
  render(<ClozeEditor originalAudioFile={props.originalAudioFile} pairs={props.pairs} namingScheme={props.namingScheme} />);
}

describe('ClozeEditor', () => {
  it('renders without crashing', () => {
    renderClozeEditor(getProps(3));
  });

  it('displays all the necessary buttons', () => {
    renderClozeEditor(getProps(3));
    getButtons();
  });

  it('contains span showing current / total pairs', () => {
    renderClozeEditor(getProps(3));
    screen.getByText('1 / 3');
  });

  it('changes progress text when pressing back / next buttons', () => {
    renderClozeEditor(getProps(3));
    const buttons = getButtons();
    screen.getByText('1 / 3');

    fireEvent.click(buttons['Next']);
    screen.getByText('2 / 3');

    fireEvent.click(buttons['Next']);
    screen.getByText('3 / 3');

    fireEvent.click(buttons['Back']);
    screen.getByText('2 / 3');
  });

  it('disables back button when on first pair', () => {
    renderClozeEditor(getProps(3));
    const buttons = getButtons();
    expect(buttons['Back']).toBeDisabled();
  });

  it('changes Next button to Finish button when on last pair', () => {
    renderClozeEditor(getProps(3));
    const buttons = getButtons();
    let finishButton = screen.queryByRole('button', { name: 'Finish' });
    expect(finishButton).toBeNull();

    fireEvent.click(buttons['Next']);
    fireEvent.click(buttons['Next']);

    const nextButton = screen.queryByRole('button', { name: 'Next' });
    finishButton = screen.queryByRole('button', { name: 'Finish' });
    expect(nextButton).toBeNull();
    expect(finishButton).not.toBeNull();
  });

  it('properly clozes selection when pressing Cloze', () => {
    renderClozeEditor(getProps(3));
    const textarea = getTextArea();
    const originalText = textarea.value;
    textarea.setSelectionRange(0, 5);
    const buttons = getButtons();
    fireEvent.click(buttons['Cloze']);

    expect(textarea.value).toBe('{{c1::' + originalText.substring(0, 5) + '}}' + originalText.substring(5));
  });

  it('properly resets content when pressing Reset', () => {
    renderClozeEditor(getProps(3));
    const textarea = getTextArea();
    const originalText = textarea.value;
    const newText = textarea.value;
    fireEvent.change(textarea, { target: { value: newText}});

    expect(textarea.value).toBe(newText);

    const buttons = getButtons();
    fireEvent.click(buttons['Reset']);
    expect(textarea.value).toBe(originalText);
  });

  it('attempts to generate a download link when pressing Finish', () => {
    renderClozeEditor(getProps(3));
    const buttons = getButtons();

    fireEvent.click(buttons['Next']);
    fireEvent.click(buttons['Next']);
    const finishButton = screen.getByRole('button', { name: 'Finish' });
    fireEvent.click(finishButton);

    screen.getByText('Generating download link...');
  });
});