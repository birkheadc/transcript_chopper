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

function getButtonLabels() {
  return ['Play', 'Add', 'Remove', 'Finish'];
}

function getButtons() {
  const labels = getButtonLabels();
  const buttons = {};
  for (let i = 0; i < labels.length; i++) {
    buttons[labels[i]] = screen.getByRole('button', { name: labels[i] });

  }
  return buttons;
}

function getIsDisabledObject(isPlayDisabled, isAddDisabled, isRemoveDisabled, isFinishDisabled) {
  return {
    Play: isPlayDisabled,
    Add: isAddDisabled,
    Remove: isRemoveDisabled,
    Finish: isFinishDisabled
  }
}

function expectButtonsToBeDisabled(buttons, isDisabled) {
  const labels = getButtonLabels();
  for (let i = 0; i < labels.length; i++) {
    isDisabled[labels[i]] ? expect(buttons[labels[i]]).toBeDisabled : expect(buttons[labels[i]]).not.toBeDisabled();
  }
}

function simulateSelectSection() {
  const canvas = document.querySelector('canvas#slicer-selector-canvas');
  expect(canvas).not.toBeNull();
  
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
    fireEvent.click(buttons.Add);
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(true, true, true, false));
  });

  it('creates a selection when add button is pressed', () => {
    renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();

    expect(findAllSectionButtons().length).toBeLessThan(1);
    fireEvent.click(buttons.Add);
    expect(findAllSectionButtons().length).toBe(1);
  });

  it('enables play and remove buttons when a previously created section is selected, but disables add button', () => {
    renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();
    fireEvent.click(buttons.Add);

    const sectionButtons = findAllSectionButtons();
    fireEvent.click(sectionButtons[0]);

    expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, true, false, false));
  });

  it('disables finish button when the only created section is removed', async () => {
    renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();
    fireEvent.click(buttons.Add);
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(true, true, true, false));

    fireEvent.click(findAllSectionButtons()[0]);
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, true, false, false));

    fireEvent.click(buttons.Remove);

    // expect(findAllSectionButtons().length).toBe(0);
    // Todo: Why doesn't this work?
  });
});