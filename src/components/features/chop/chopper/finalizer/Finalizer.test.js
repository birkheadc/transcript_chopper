import * as React from 'react';
import Finalizer from './Finalizer'
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FinalFileFormat } from '../../../../../types/formats/finalFileFormat';
import { FinalFileNamingScheme } from '../../../../../types/formats/finalFileNamingScheme';

function getButtons() {
  return {
    justTheFiles: screen.getByRole('button', { name: /just the files/i }),
    flashcardFormat: screen.getByRole('button', { name: /Formatted Into Flashcards/i })
  }
}

function getSelects() {
  return {
    fileFormat: screen.getByLabelText('File Format'),
    namingScheme: screen.getByLabelText('Naming Scheme')
  }
}

function getProps() {
  return {
    originalAudioFile: new File([''], ''),
    pairs: [{
      stub: 'Stub 1',
      audio: new Blob([''])
    }, {
      stub: 'Stub 2',
      range: new Blob([''])
    }]
  }
}

function renderFinalizer(props) {
  render(<Finalizer originalAudioFile={props.originalAudioFile} pairs={props.pairs} />);
}

describe('Finalizer', () => {
  it('renders without crashing', () => {
    renderFinalizer(getProps());
  });

  it('renders two buttons, one for just the files, one for flashcard format', () => {
    renderFinalizer(getProps());
    getButtons();
  });

  it('does not contain selects for file-format and naming-scheme before pressing JUST_THE_FILES button', () => {
    renderFinalizer(getProps());
    const fileFormatSelect = screen.queryByLabelText('File Format');
    const namingSchemeSelect = screen.queryByLabelText('Naming Scheme');
    expect(fileFormatSelect).toBeNull();
    expect(namingSchemeSelect).toBeNull();
  });

  it('contains a select for file-format and naming-scheme after pressing JUST_THE_FILES button', () => {
    renderFinalizer(getProps());
    const buttons = getButtons();
    fireEvent.click(buttons.justTheFiles);
    getSelects();
  });

  it('attempts to create a download link after selecting file-format and naming-scheme', () => {
    renderFinalizer(getProps());
    const buttons = getButtons();
    fireEvent.click(buttons.justTheFiles);
    const selects = getSelects();
    const value = 1;
    fireEvent.change(selects.fileFormat, { target: { value: value }});
    fireEvent.change(selects.namingScheme, { target: { value: value }});
    expect(selects.fileFormat.value).toBe(value.toString());
    expect(selects.namingScheme.value).toBe(value.toString());
    
    screen.getByText('Generating download link...');
  });
});