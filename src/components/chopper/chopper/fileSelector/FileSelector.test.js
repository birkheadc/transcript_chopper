import * as React from 'react';
import FileSelector from './FileSelector'
import { render, screen } from '@testing-library/react';

describe('FileSelector', () => {
  it('enables continue button when audio file selected', () => {
    const props = getPropsWithAudioFile();
    renderFileSelector(props);
    const button = getContinueButton();
    expect(button).not.toBeDisabled();
  });

  it('disables continue button when no audio file selected', () => {
    const props = getPropsWithoutAudioFile();
    renderFileSelector(props);
    const button = getContinueButton();
    expect(button).toBeDisabled();
  });

  it('calls props.updateOriginalFile when file input changes', () => {
    // Todo
  });

  it('calls props.handleContinue when continue button is clicked', () => {
    // Todo
  });
});

// Helpers

const defaultProps = {
  updateOriginalFile: () => {},
  originalFile: {
    audioFile: undefined,
    transcript: ''
  },
  handleContinue: () => {}
}

function getPropsWithAudioFile() {
  const props = {...defaultProps};
  props.originalFile = {
    audioFile: new File(["Hello, world!"], "hello.txt", { type: "text/plain" }),
    transcript: ''
  };
  return props;
}

function getPropsWithoutAudioFile() {
  return defaultProps;
}

function renderFileSelector(props) {
  render(
    <FileSelector
      updateOriginalFile={props.updateOriginalFile}
      originalFile={props.originalFile}
      handleContinue={props.handleContinue}
    />
  );
}

function getContinueButton() {
  return screen.getByRole('button', { name: /continue/i });
}