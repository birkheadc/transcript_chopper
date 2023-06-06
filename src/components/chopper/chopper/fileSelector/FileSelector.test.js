import * as React from 'react';
import FileSelector from './FileSelector'
import { fireEvent, render, screen } from '@testing-library/react';

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

  it('calls props.updateOriginalFile once on mount', () => {
    const props = getPropsWithoutAudioFile();
    renderFileSelector(props);

    expect(props.updateOriginalFile).toHaveBeenCalledTimes(1);
  });

  it('calls props.updateOriginalFile when file input changes', () => {
    const props = getPropsWithoutAudioFile();
    renderFileSelector(props);
    const input = getFileInput();

    expect(props.updateOriginalFile).toHaveBeenCalledTimes(1);
    fireEvent.change(input, new File(['contents'], 'file.wav', { type: 'audio/wav' }));
    expect(props.updateOriginalFile).toHaveBeenCalledTimes(2);
  });

  it('calls props.handleContinue when continue button is clicked', () => {
    const props = getPropsWithAudioFile();
    renderFileSelector(props);
    const button = getContinueButton();

    expect(props.handleContinue).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(props.handleContinue).toHaveBeenCalled();
  });
});

// Helpers

const defaultProps = {
  updateOriginalFile: jest.fn(() => {}),
  originalFile: {
    audioFile: undefined,
    transcript: ''
  },
  handleContinue: jest.fn(() => {})
}

function getPropsWithAudioFile() {
  return {
    updateOriginalFile: jest.fn(() => {}),
    originalFile: {
      audioFile: new File(["Hello, world!"], "hello.txt", { type: "text/plain" }),
      transcript: ''
    },
    handleContinue: jest.fn(() => {})
  };
}

function getPropsWithoutAudioFile() {
  return {
    updateOriginalFile: jest.fn(() => {}),
    originalFile: {
      audioFile: undefined,
      transcript: ''
    },
    handleContinue: jest.fn(() => {})
  };
}

function renderFileSelector(props) {
  render(<FileSelector {...props} />);
}

function getContinueButton() {
  return screen.getByRole('button', { name: /continue/i });
}

function getFileInput() {
  return screen.getByLabelText(/audio file/i);
}