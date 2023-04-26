import * as React from 'react';
import FileSelector from './FileSelector'
import { render, screen } from '@testing-library/react';

function getProps(isFileGood) {
  return {
    updateOriginalFile: () => {},
    originalFile: {
      audioFile: isFileGood ? new File(["Hello, world!"], "hello.txt", { type: "text/plain" }) : undefined,
      transcript: ''
    },
    handleContinue: () => {}
  }
}

function renderFileSelector(props) {
  render(<FileSelector updateOriginalFile={props.updateOriginalFile} originalFile={props.originalFile} handleContinue={props.handleContinue} />);
}

function getContinueButton() {
  return screen.getByText('Continue');
}

describe('FileSelector', () => {
  it('disables continue button when no audio file selected', () => {
    const props = getProps(false);
    renderFileSelector(props);
    const button = getContinueButton();
    expect(button).toBeDisabled();
  });

  it('enables continue button when audio file selected', () => {
    const props = getProps(true);
    renderFileSelector(props);
    const button = getContinueButton();
    expect(button).not.toBeDisabled();
  });
});