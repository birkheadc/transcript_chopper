import * as React from 'react';
import Slicer from './Slicer'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

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

async function renderSlicer(props) {
  render(<Slicer originalFile={props.originalFile}/>);
  await waitFor(() => {
    const text = screen.getByText('Generating audio image...');
    expect(text).not.toBeNull();
  });
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
  canvas.getBoundingClientRect = jest.fn(() => ({
    width: 100,
    left: 0
  }));
  fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
  fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
  fireEvent.pointerUp(canvas, { clientX: 20, clientY: 20 });
}

function findAllSectionButtons() {
  return screen.queryAllByRole('button', { name: 'section-select' });
}

describe('Slicer', () => {
  it('renders without crashing', async () => {
    await renderSlicer(getProps());
  });

  it('disables all buttons when first rendered', async () => {
    await renderSlicer(getProps());
    const buttons = getButtons();
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(true, true, true, true));
  });

  it('enables play and add buttons when a selection is made', async () => {
    await renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, false, true, true));
  });

  it('removes current selection when add button is pressed', async () => {
    await renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();
    fireEvent.click(buttons.Add);
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(true, true, true, false));
  });

  it('creates a selection when add button is pressed', async () => {
    await renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();

    let sectionButtons = findAllSectionButtons();
    expect(sectionButtons.length).toBeLessThan(1);
    fireEvent.click(buttons.Add);

    sectionButtons = findAllSectionButtons();
    expect(sectionButtons.length).toBe(1);
  });

  it('enables play and remove buttons when a previously created section is selected, but disables add button', async () => {
    await renderSlicer(getProps());
    const buttons = getButtons();
    simulateSelectSection();
    fireEvent.click(buttons['Add']);

    const sectionButtons = findAllSectionButtons();
    fireEvent.click(sectionButtons[0]);

    expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, true, false, false));
  });

  it('disables finish button when the only created section is removed', async () => {
    await renderSlicer(getProps());
    let buttons = getButtons();
    simulateSelectSection();
    fireEvent.click(buttons.Add);
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(true, true, true, false));

    let sectionButtons = findAllSectionButtons();
    fireEvent.click(sectionButtons[0]);
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, true, false, false));

    fireEvent.click(buttons.Remove);

    sectionButtons = findAllSectionButtons();
    expect(sectionButtons.length).toBe(0);

    buttons = getButtons();
    expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, false, true, true));
  });
});