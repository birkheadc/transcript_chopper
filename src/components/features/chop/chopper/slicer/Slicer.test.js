import * as React from 'react';
import Slicer from './Slicer'
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

function getProps() {
  const wavBlob = new Blob([new Uint8Array(44)], { type: 'audio/wav' });
  const wavFile = new File([wavBlob], 'empty.wav', { type: 'audio/wav' });
  return {
    originalFile: {
      audioFile: wavFile,
      transcript: 'empty'
    }
  }
}

function renderSlicer(props) {
  return render(<Slicer originalFile={props.originalFile}/>);
}

function getButtons() {
  const buttons = {
    play: screen.queryByRole('button', { name: 'Play' }),
    add: screen.queryByRole('button', { name: 'Add' }),
    remove: screen.queryByRole('button', { name: 'Remove' }),
    finish: screen.queryByRole('button', { name: 'Finish' })
  };
  expect(buttons.play).not.toBe(null);
  expect(buttons.add).not.toBe(null);
  expect(buttons.remove).not.toBe(null);
  expect(buttons.finish).not.toBe(null);
  return buttons;
}

function getIsDisabledObject(isPlayDisabled, isAddDisabled, isRemoveDisabled, isFinishDisabled) {
  return {
    play: isPlayDisabled,
    add: isAddDisabled,
    remove: isRemoveDisabled,
    finish: isFinishDisabled
  }
}

function expectButtonsToBeDisabled(buttons, isDisabled) {
  isDisabled.play ? expect(buttons.play).toBeDisabled() : expect(buttons.play).not.toBeDisabled();
  isDisabled.add ? expect(buttons.add).toBeDisabled() : expect(buttons.add).not.toBeDisabled();
  isDisabled.remove ? expect(buttons.remove).toBeDisabled() : expect(buttons.remove).not.toBeDisabled();
  isDisabled.finish ? expect(buttons.finish).toBeDisabled() : expect(buttons.finish).not.toBeDisabled();
}

function simulateSelectSection() {
  const canvas = document.querySelector('canvas#slicer-selector-canvas');
  expect(canvas).not.toBe(null);
  
  fireEvent.pointerDown(canvas, { offsetX: 10, offsetY: 10 });
  fireEvent.pointerMove(canvas, { offsetX: 20, offsetY: 10 });
  fireEvent.pointerUp(canvas);
}

function findAllSectionButtons() {
  return document.querySelectorAll('button.slicer-section-button');
}

describe('Slicer', () => {
  it('renders without crashing', () => {
    renderSlicer(getProps());
  });

  it('disables all buttons when first rendered', () => {
    renderSlicer(getProps());
    const buttons = getButtons();
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(true, true, true, true));
  });

  it('enables play and add buttons when a selection is made', () => {
    renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, false, true, true));
  });

  it('removes current selection when add button is pressed', () => {
    renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();
    fireEvent.click(buttons.add);
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(true, true, true, false));
  });

  it('creates a selection when add button is pressed', () => {
    renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();

    expect(findAllSectionButtons().length).toBeLessThan(1);
    fireEvent.click(buttons.add);
    expect(findAllSectionButtons().length).toBe(1);
  });

  it('enables play and remove buttons when a previously created section is selected, but disables add button', () => {
    renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();
    fireEvent.click(buttons.add);

    const sectionButtons = findAllSectionButtons();
    fireEvent.click(sectionButtons[0]);

    expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, true, false, false));
  });

  it('disables finish button when the only created section is removed', async () => {
    renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();
    fireEvent.click(buttons.add);
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(true, true, true, false));

    fireEvent.click(findAllSectionButtons()[0]);
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, true, false, false));

    fireEvent.click(buttons.remove);

    // Todo: Why doesn't this work?
  });
});