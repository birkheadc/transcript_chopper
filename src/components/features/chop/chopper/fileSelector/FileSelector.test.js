import * as React from 'react';
import FileSelector from './FileSelector'
import { render, screen } from '@testing-library/react';

function getProps(isFileGood, isTranscriptGood) {
  return {
    updateOriginalFile: () => {},
    originalFile: {
      audioFile: isFileGood ? new File(["Hello, world!"], "hello.txt", { type: "text/plain" }) : undefined,
      transcript: isTranscriptGood ? 'good' : ''
    },
    handleContinue: () => {}
  }
}

function renderFileSelector(props) {
  render(<FileSelector updateOriginalFile={props.updateOriginalFile} originalFile={props.originalFile} handleContinue={props.handleContinue} />);
}

function getContinueButton() {
  return screen.queryByText('Continue');
}

describe('FileSelector', () => {
  it('disables continue button when no audio file selected and no transcript supplied', () => {
    const props = getProps(false, false);
    renderFileSelector(props);
    const button = getContinueButton();
    expect(button).not.toBe(null);
    expect(button).toBeDisabled();
  });

  it('disables continue button when no audio file selected', () => {
    const props = getProps(false, true);
    renderFileSelector(props);
    const button = getContinueButton();
    expect(button).not.toBe(null);
    expect(button).toBeDisabled();
  });

  it('disables continue button when no transcript is supplied', () => {
    const props = getProps(true, false);
    renderFileSelector(props);
    const button = getContinueButton();
    expect(button).not.toBe(null);
    expect(button).toBeDisabled();
  });

  it('enables continue button when audio file selected and transcript supplied', () => {
    const props = getProps(true, true);
    renderFileSelector(props);
    const button = getContinueButton();
    expect(button).not.toBe(null);
    expect(button).not.toBeDisabled();
  });
});