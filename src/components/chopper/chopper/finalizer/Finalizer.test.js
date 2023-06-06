import * as React from 'react';
import Finalizer from './Finalizer'
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

describe('Finalizer', () => {
  it('renders without crashing', () => {
    const props = getPropsWithPairs();
    renderFinalizer(props);
  });

  it('renders two buttons, just-the-files and formatted-into-flashcards', () => {
    const props = getPropsWithPairs();
    renderFinalizer(props);
    getButtons();
  });

  it('shows a file-format and naming-scheme selector after press just-the-files', () => {
    const props = getPropsWithPairs();
    renderFinalizer(props);
    getButtons();

    const buttons = getButtons();
    fireEvent.click(buttons.justFiles);

    getSelects();
  });

  it('fails to generate download link after selecting a file format and naming scheme, when no pairs provided', async () => {
    const props = getPropsWithNoPairs();
    renderFinalizer(props);
    getButtons();

    const buttons = getButtons();
    fireEvent.click(buttons.justFiles);

    const selects = getSelects();

    fireEvent.change(selects.fileFormat, { target: { value: 1 }});
    fireEvent.change(selects.namingScheme, { target: { value: 1 } });

    await getDownloadFailedError();
  });

  it('generates a download link after selecting a file format and naming scheme', async () => {
    const props = getPropsWithPairs();
    renderFinalizer(props);
    getButtons();

    const buttons = getButtons();
    fireEvent.click(buttons.justFiles);

    const selects = getSelects();

    fireEvent.change(selects.fileFormat, { target: { value: 1 }});
    fireEvent.change(selects.namingScheme, { target: { value: 1 } });

    await getDownloadLink();
  });

  it('calls handleSelectFlashcardFormat when press formatted-into-flashcards button', () => {
    const props = getPropsWithPairs();
    renderFinalizer(props);
    const buttons = getButtons();

    expect(props.handleSelectFlashcardFormat).not.toHaveBeenCalled();
    fireEvent.click(buttons.flashcard);
    expect(props.handleSelectFlashcardFormat).toHaveBeenCalled();
  });
});

function getPropsWithNoPairs() {
  return {
    pairs: [],
    handleSelectFlashcardFormat: jest.fn(() => {})
  }
}

function getPropsWithPairs() {
  return {
    pairs: [ { stub: '', audio: new Blob([''], { type: 'audio/wav' })} ],
    handleSelectFlashcardFormat: jest.fn(() => {})
  }
}

function renderFinalizer(props) {
  render(<Finalizer {...props} />);
}

function getButtons() {
  const justFiles = screen.getByRole('button', { name: /just the files/i});
  const flashcard = screen.getByRole('button', { name: /formatted into flashcards/i});
  return {
    justFiles,
    flashcard
  };
}

function getSelects() {
  const fileFormat = screen.getByLabelText(/file format/i);
  const namingScheme = screen.getByLabelText(/naming scheme/i);
  return {
    fileFormat,
    namingScheme
  };
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

// function getButtons() {
//   return {
//     justTheFiles: screen.getByRole('button', { name: /just the files/i }),
//     flashcardFormat: screen.getByRole('button', { name: /Formatted Into Flashcards/i })
//   }
// }

// function getSelects() {
//   return {
//     fileFormat: screen.getByLabelText('File Format'),
//     namingScheme: screen.getByLabelText('Naming Scheme')
//   }
// }

// function getProps() {
//   return {
//     originalAudioFile: new File([''], ''),
//     pairs: [{
//       stub: 'Stub 1',
//       audio: new Blob([''])
//     }, {
//       stub: 'Stub 2',
//       range: new Blob([''])
//     }]
//   }
// }

// function renderFinalizer(props) {
//   render(<Finalizer originalAudioFile={props.originalAudioFile} pairs={props.pairs} />);
// }

// describe('Finalizer', () => {
//   it('renders without crashing', () => {
//     renderFinalizer(getProps());
//   });

//   it('renders two buttons, one for just the files, one for flashcard format', () => {
//     renderFinalizer(getProps());
//     getButtons();
//   });

//   it('does not contain selects for file-format and naming-scheme before pressing JUST_THE_FILES button', () => {
//     renderFinalizer(getProps());
//     const fileFormatSelect = screen.queryByLabelText('File Format');
//     const namingSchemeSelect = screen.queryByLabelText('Naming Scheme');
//     expect(fileFormatSelect).toBeNull();
//     expect(namingSchemeSelect).toBeNull();
//   });

//   it('contains a select for file-format and naming-scheme after pressing JUST_THE_FILES button', () => {
//     renderFinalizer(getProps());
//     const buttons = getButtons();
//     fireEvent.click(buttons.justTheFiles);
//     getSelects();
//   });

//   it('attempts to create a download link after selecting file-format and naming-scheme', () => {
//     renderFinalizer(getProps());
//     const buttons = getButtons();
//     fireEvent.click(buttons.justTheFiles);
//     const selects = getSelects();
//     const value = 1;
//     fireEvent.change(selects.fileFormat, { target: { value: value }});
//     fireEvent.change(selects.namingScheme, { target: { value: value }});
//     expect(selects.fileFormat.value).toBe(value.toString());
//     expect(selects.namingScheme.value).toBe(value.toString());
    
//     screen.getByText('Generating download link...');
//   });
// });