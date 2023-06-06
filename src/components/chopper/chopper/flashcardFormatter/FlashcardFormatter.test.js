import * as React from 'react';
import FlashcardFormatter from './FlashcardFormatter'
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

describe('FlashcardFormatter', () => {
  it('renders without crashing', () => {
    const props = getPropsWithAudioFileAndPairs();
    renderFlashcardFormatter(props);
  });

  it('renders a select for selecting deck style', () => {
    const props = getPropsWithAudioFileAndPairs();
    renderFlashcardFormatter(props);
    getSelect();
  });

  it('displays an error when attempting to generate a deck and no audio file is given', async () => {
    const props = getPropsWithoutAudioFile();
    renderFlashcardFormatter(props);
    const select = getSelect();

    fireEvent.change(select, { target: { value: 1 } });

    await getDownloadFailedError();
  });

  it('generates a download link when select basic cards zip file', async () => {
    const props = getPropsWithAudioFileAndPairs();
    renderFlashcardFormatter(props);
    const select = getSelect();

    fireEvent.change(select, { target: { value: 1 } });

    await getDownloadLink();
  });

  it('opens flashcard editor when select custom cards zip file', async () => {
    const props = getPropsWithAudioFileAndPairs();
    renderFlashcardFormatter(props);
    const select = getSelect();

    let flashCardEditorHeader = screen.queryByText(/flashcard editor/i);
    expect(flashCardEditorHeader).not.toBeInTheDocument();
    fireEvent.change(select, { target: { value: 2 } });

    flashCardEditorHeader = screen.queryByText(/flashcard editor/i);
    expect(flashCardEditorHeader).toBeInTheDocument();
  });

  
});

function getPropsWithoutAudioFile() {
  return {
    originalAudioFile: undefined,
    pairs: []
  };
}

function getPropsWithAudioFileAndPairs() {
  return {
    originalAudioFile: new File([''], 'file.wav', { type: 'audio/wav' }),
    pairs: [ { stub: '', audio: new Blob([''], { type: 'audio/wav' })} ],
  };
}

function renderFlashcardFormatter(props) {
  render(<FlashcardFormatter {...props} />);
}

function getSelect() {
  return screen.getByLabelText(/deck style/i);
}

async function getDownloadFailedError() {
  const errorText = new RegExp('could not generate files', 'i');
  await waitFor(() => {
    return screen.getByText(errorText);
  })
}

async function getDownloadLink() {
  await waitFor(() => {
    return screen.getByRole('link', { name: /download/i });
  })
}