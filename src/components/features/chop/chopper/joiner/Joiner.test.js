import * as React from 'react';
import Joiner from './Joiner'
import { fireEvent, render, screen } from '@testing-library/react';

function getProps(transcript = '') {
  return {
    originalFile: {
      audioFile: new File(["mock_file"], "mock_file.txt", { type: "text/plain" }),
      transcript: transcript
    },
    sections: [{ from: 0.1, to: 0.2 }, { from: 0.3, to: 0.4 }]
  }
}

function renderJoiner(props) {
  render(<Joiner originalFile={props.originalFile} sections={props.sections} />);
}

function getTextarea() {
  const textarea = screen.getByLabelText('Text');
  return textarea;
}

function getButtons() {
  const labels = ['Play Audio', 'Trim', 'Reset'];
  const buttons = {};
  for (let i = 0; i < labels.length; i++) {
    const button = screen.getByRole('button', { name: labels[i] });
    buttons[labels[i]] = button;
  }

  return buttons;
}

describe('Joiner', () => {
  it('renders without crashing', () => {
    renderJoiner(getProps());
  });

  it('contains Play Audio, Trim, and Rest buttons', () => {
    renderJoiner(getProps());
    getButtons();
  });

  it('displays the full transcript in the textarea element when first rendered', () => {
    const transcript = 'This is the transcript';
    renderJoiner(getProps(transcript));
    const textarea = getTextarea();
    expect(textarea.value).toBe(transcript);
  });

  it('trims textarea to only contain highlighted text when trim button is pressed', () => {
    const transcript = 'This is a test';
    renderJoiner(getProps(transcript));
    const textarea = getTextarea();
    textarea.setSelectionRange(0, 5);
    const buttons = getButtons();
    fireEvent.click(buttons.Trim);
    expect(textarea.value).toBe(transcript.substring(0, 5));
  });

  it('resets textarea to original transcript when reset button is pressed', () => {
    const originalTranscript = 'This is the original text.';
    const newTranscript = 'This is the new text.';

    renderJoiner(getProps(originalTranscript));

    const textarea = getTextarea();
    expect(textarea.value).toBe(originalTranscript);

    fireEvent.change(textarea, { target: { value: newTranscript } });
    expect(textarea.value).toBe(newTranscript);

    const buttons = getButtons();
    fireEvent.click(buttons.Reset);
    expect(textarea.value).toBe(originalTranscript);
  });
});