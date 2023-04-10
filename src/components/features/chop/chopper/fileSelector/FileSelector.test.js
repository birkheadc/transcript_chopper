import * as React from 'react';
import FileSelector from './FileSelector'
import { render, screen } from '@testing-library/react';

describe('FileSelector', () => {
  it('disables continue button when no audio file selected and no transcript supplied', () => {
    const props = {
      updateOriginalFile: () => {},
      originalFile: {
        audioFile: undefined,
        transcript: ''
      },
      handleContinue: () => {}
    }
    render(<FileSelector updateOriginalFile={props.updateOriginalFile} originalFile={props.originalFile} handleContinue={props.handleContinue} />);
    const button = screen.queryByText('Continue');
    expect(button).not.toBe(null);
    expect(button).toBeDisabled();
  });

  it('disables continue button when no audio file selected', () => {
    const props = {
      updateOriginalFile: () => {},
      originalFile: {
        audioFile: undefined,
        transcript: 'test'
      },
      handleContinue: () => {}
    }
    render(<FileSelector updateOriginalFile={props.updateOriginalFile} originalFile={props.originalFile} handleContinue={props.handleContinue} />);
    const button = screen.queryByText('Continue');
    expect(button).not.toBe(null);
    expect(button).toBeDisabled();
  });

  it('disables continue button when no transcript is supplied', () => {
    const props = {
      updateOriginalFile: () => {},
      originalFile: {
        audioFile: new File(["Hello, world!"], "hello.txt", { type: "text/plain" }),
        transcript: ''
      },
      handleContinue: () => {}
    }
    render(<FileSelector updateOriginalFile={props.updateOriginalFile} originalFile={props.originalFile} handleContinue={props.handleContinue} />);
    const button = screen.queryByText('Continue');
    expect(button).not.toBe(null);
    expect(button).toBeDisabled();
  });

  it('enables continue button when audio file selected and transcript supplied', () => {
    const props = {
      updateOriginalFile: () => {},
      originalFile: {
        audioFile: new File(["Hello, world!"], "hello.txt", { type: "text/plain" }),
        transcript: 'test'
      },
      handleContinue: () => {}
    }
    render(<FileSelector updateOriginalFile={props.updateOriginalFile} originalFile={props.originalFile} handleContinue={props.handleContinue} />);
    const button = screen.queryByText('Continue');
    expect(button).not.toBe(null);
    expect(button).not.toBeDisabled();
  });
});