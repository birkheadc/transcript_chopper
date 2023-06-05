import * as React from 'react';
import Joiner from './Joiner'
import { fireEvent, render, screen } from '@testing-library/react';

const BUTTONS = [
  'trim',
  'reset',
  'back'
]

describe('Joiner', () => {
  it('renders without crashing', () => {
    const props = getPropsWithAudioFileAndTranscript();
    renderJoiner(props);
  });

  it('displays BUTTONS and next|finish button', () => {
    const props = getPropsWithAudioFileAndTranscript();
    renderJoiner(props);

    getButtons();
  });

  it('displays {current} / {total} sections, and updates {current} when click next', () => {
    const numSections = 3;
    const props = getPropsWithAudioFileAndTranscript();
    props.sections = getNSections(numSections);
    renderJoiner(props);

    getCurrentTotalSectionsDisplay(1, numSections);
    
    const buttons = getButtons();
    fireEvent.click(buttons.next);

    getCurrentTotalSectionsDisplay(2, numSections);
  });

  it('fills the textarea with the full original transcript when mounting', () => {
    const numSections = 3;
    const props = getPropsWithAudioFileAndTranscript();
    props.sections = getNSections(numSections);
    renderJoiner(props);

    const textarea = getTextarea();
    expect(textarea).toHaveTextContent(exampleTranscript);
  });

  it('re-fills the textarea with the full original transcript after editing, then going to next section', () => {
    const numSections = 3;
    const props = getPropsWithAudioFileAndTranscript();
    props.sections = getNSections(numSections);
    renderJoiner(props);

    const textarea = getTextarea();
    expect(textarea).toHaveTextContent(exampleTranscript);

    const newValue = 'edited';

    fireEvent.change(textarea, { target: { value: newValue }});
    expect(textarea).toHaveTextContent(newValue);

    const buttons = getButtons();
    fireEvent.click(buttons.next);

    expect(textarea).toHaveTextContent(exampleTranscript);
  });

  it('disables back button when editing first section, enables when press next', () => {
    const numSections = 3;
    const props = getPropsWithAudioFileAndTranscript();
    props.sections = getNSections(numSections);
    renderJoiner(props);

    const buttons = getButtons();
    expect(buttons.back).toBeDisabled();

    fireEvent.click(buttons.next);
    expect(buttons.back).toBeEnabled();
  });

  it('changes next button to finish on last section', () => {
    const numSections = 3;
    const props = getPropsWithAudioFileAndTranscript();
    props.sections = getNSections(numSections);
    renderJoiner(props);

    const buttons = getButtons();
    expect(buttons.next).toHaveTextContent(/next/i);
    expect(buttons.next).not.toHaveTextContent(/finish/i);

    for (let i = 1; i < numSections; i++) {
      fireEvent.click(buttons.next);
    }

    expect(buttons.next).toHaveTextContent(/finish/i);
    expect(buttons.next).not.toHaveTextContent(/next/i);
  });

  it('replaces text in textarea with selected text when press trim button', () => {
    const numSections = 3;
    const props = getPropsWithAudioFileAndTranscript();
    props.sections = getNSections(numSections);
    renderJoiner(props);

    const textarea = getTextarea();
    expect(textarea).toHaveTextContent(exampleTranscript);

    const i = 0, j = 10;
    simulateSelectTextareaFromIToJ(textarea, i, j);
    
    const buttons = getButtons();
    fireEvent.click(buttons.trim);

    expect(textarea).toHaveTextContent(exampleTranscript.substring(i, j));
  });

  it('resets the textarea to original transcript when press reset button', () => {
    const numSections = 3;
    const props = getPropsWithAudioFileAndTranscript();
    props.sections = getNSections(numSections);
    renderJoiner(props);

    const textarea = getTextarea();
    expect(textarea).toHaveTextContent(exampleTranscript);

    const newValue = 'edited';
    fireEvent.change(textarea, { target: { value: newValue }});
    expect(textarea).toHaveTextContent(newValue);

    const buttons = getButtons();
    fireEvent.click(buttons.reset);
    
    expect(textarea).toHaveTextContent(exampleTranscript);
  });

  it('reloads edited text when press back to return to previous section', () => {
    const numSections = 3;
    const props = getPropsWithAudioFileAndTranscript();
    props.sections = getNSections(numSections);
    renderJoiner(props);

    const textarea = getTextarea();
    expect(textarea).toHaveTextContent(exampleTranscript);

    const newValue = 'edited';
    fireEvent.change(textarea, { target: { value: newValue }});
    expect(textarea).toHaveTextContent(newValue);

    const buttons = getButtons();
    fireEvent.click(buttons.next);

    expect(textarea).toHaveTextContent(exampleTranscript);
    
    fireEvent.click(buttons.back);

    expect(textarea).toHaveTextContent(newValue);
  });

  it('calls handleSetPairs when pressing finish button', () => {
    const numSections = 3;
    const props = getPropsWithAudioFileAndTranscript();
    props.sections = getNSections(numSections);
    renderJoiner(props);

    expect(props.handleSetPairs).not.toHaveBeenCalled();

    const buttons = getButtons();
    for (let i = 0; i < numSections; i++) {
      fireEvent.click(buttons.next);
    }
    
    expect(props.handleSetPairs).toHaveBeenCalled();
  });

});

// Helpers

function renderJoiner(props) {
  render(<Joiner {...props} />);
}

const exampleTranscript = 'わたくしはその人を常に先生と呼んでいた。だからここでもただ先生と書くだけで本名は打ち明けない。これは世間をはばかる遠慮というよりも、その方が私にとって自然だからである。私はその人の記憶を呼び起すごとに、すぐ「先生」といいたくなる。筆をとっても心持は同じ事である。よそよそしいかしらもじなどはとても使う気にならない。私が先生と知り合いになったのはかまくらである。その時私はまだ若々しい書生であった。暑中休暇を利用して海水浴に行った友達からぜひ来いというはがきを受け取ったので、';

const defaultProps = {
  originalFile: {
    audioFile: undefined,
    transcript: ''
  },
  sections: [],
  handleSetPairs: jest.fn((pairs) => {}),
};

function getPropsWithAudioFileAndTranscript() {
  const props = {...defaultProps};
  defaultProps.originalFile = {
    audioFile: new File([""], "audio.wav", { type: 'audio/wav' }),
    transcript: exampleTranscript
  };
  return props;
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

function getNSections(n) {
  const sections = [];
  for (let i = 0; i < n; i++) {
    sections.push(new Blob([''], { type: 'audio/wav' }));
  }
  return sections;
}

function getTextarea() {
  return screen.getByLabelText('Text');
}

function simulateSelectTextareaFromIToJ(textarea, i, j) {
  textarea.setSelectionRange(i, j);
}