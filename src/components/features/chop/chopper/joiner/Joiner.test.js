import * as React from 'react';
import Joiner from './Joiner'
import { fireEvent, render, screen } from '@testing-library/react';

function generateNSections(n) {
  const sections = [];
  const duration = 1.0 / n;
  for (let i = 0; i < n; i++) {
    sections.push({ from: i*duration, to: (i+1)*duration });
  }
  return sections;
}

function getProps(transcript, numSections) {
  return {
    originalFile: {
      audioFile: new File(["mock_file"], "mock_file.txt", { type: "text/plain" }),
      transcript: transcript
    },
    sections: generateNSections(numSections),
    handleSetPairs: (pairs) => {},
    handleContinue: () => {}
  }
}

function renderJoiner(props) {
  render(<Joiner handleContinue={props.handleContinue} handleSetPairs={props.handleSetPairs} originalFile={props.originalFile} sections={props.sections} />);
}

function getTextarea() {
  const textarea = screen.getByLabelText('Text');
  return textarea;
}

function getButtons() {
  const labels = ['Play Audio', 'Trim', 'Reset', 'Back', 'Next'];
  const buttons = {};
  for (let i = 0; i < labels.length; i++) {
    const button = screen.getByRole('button', { name: labels[i] });
    buttons[labels[i]] = button;
  }

  return buttons;
}

describe('Joiner', () => {
  it('renders without crashing', () => {
    renderJoiner(getProps('transcript', 2));
  });

  it('contains Play Audio, Trim, and Rest buttons', () => {
    renderJoiner(getProps('transcript', 2));
    getButtons();
  });

  it('displays the full transcript in the textarea element when first rendered', () => {
    const transcript = 'This is the transcript';
    renderJoiner(getProps(transcript, 2));
    const textarea = getTextarea();
    expect(textarea.value).toBe(transcript);
  });

  it('trims textarea to only contain highlighted text when trim button is pressed', () => {
    const transcript = 'This is a test';
    renderJoiner(getProps(transcript, 2));
    const textarea = getTextarea();
    textarea.setSelectionRange(0, 5);
    const buttons = getButtons();
    fireEvent.click(buttons.Trim);
    expect(textarea.value).toBe(transcript.substring(0, 5));
  });

  it('resets textarea to original transcript when reset button is pressed', () => {
    const originalTranscript = 'This is the original text.';
    const newTranscript = 'This is the new text.';

    renderJoiner(getProps(originalTranscript, 2));

    const textarea = getTextarea();
    expect(textarea.value).toBe(originalTranscript);

    fireEvent.change(textarea, { target: { value: newTranscript } });
    expect(textarea.value).toBe(newTranscript);

    const buttons = getButtons();
    fireEvent.click(buttons.Reset);
    expect(textarea.value).toBe(originalTranscript);
  });
  
  it('displays {currentSection} / {sections.length} somewhere on the page', () => {
    // Dummy props contains 2 sections by default.
    renderJoiner(getProps('transcript', 2));
    let progressText = screen.getByText('1 / 2');
    const buttons = getButtons();
    fireEvent.click(buttons.Next);
    progressText = screen.getByText('2 / 2');
  });

  it('changes from Next to Finish button on last section', () => {
    renderJoiner(getProps('transcript', 2));

    let finishButton = screen.queryByRole('button', { name: 'Finish' });
    expect(finishButton).toBeNull();

    const buttons = getButtons();
    fireEvent.click(buttons.Next);

    finishButton = screen.queryByRole('button', { name: 'Finish' });
    expect(finishButton).not.toBeNull();
  });

  it('disables back button on first section, enables on second', () => {
    renderJoiner(getProps('transcript', 2));
    const buttons = getButtons();
    expect(buttons.Back).toBeDisabled();
    fireEvent.click(buttons.Next);
    expect(buttons.Back).not.toBeDisabled();
  });
});