import * as React from 'react';
import Slicer from './Slicer'
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// Play button is ignored because it is part of the AudioPlayer component,
// which is not tested here
// (It's currently not tested at all, unless I've forgotten to remove this line. Please kindly remove this line if that is the case.)
const BUTTONS = [
  'add',
  'remove',
  'finish'
]

describe('Slicer', () => {
  it('renders without crashing', async () => {
    await renderSlicerAsync(defaultProps);
  });

  it('fails to process audio if audiofile undefined', async () => {
    await renderSlicerAsync(defaultProps);
    screen.getByText(/audio failed to process/i);
  });

  // The first time a not-null audiofile is passed as a prop,
  // the test is set up to return a bad volume array. (see setupTests.js)
  // Subsequent tests will return a default, good volume array.
  it('fails to process audio if creation of volume array fails', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);
    await waitFor(() => {
      screen.getByText(/audio failed to process/i);
    })
  });

  it('displays BUTTONS', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);
    await getButtonsAsync();
  });

  it('initially disabled all buttons', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);
    const buttons = await getButtonsAsync();

    expectButtonsEnabled(buttons, {
      add: false,
      remove: false,
      finish: false
    });
  });

  it('displays canvas(es) representing the audio graph', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);

    const canvases = await getCanvasesAsync();
    
    expect(canvases).not.toBeNull();
    expect(canvases).not.toHaveLength(0);
  });

  it('enables add button when a selection is made', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);
    const buttons = await getButtonsAsync();

    emulateSelectSection();

    expectButtonsEnabled(buttons, {
      add: true,
      remove: false,
      finish: false
    });
  });

  it('enables finish button when a selection is added', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);
    const buttons = await getButtonsAsync();

    emulateSelectSection();
    fireEvent.click(buttons.add);

    expectButtonsEnabled(buttons, {
      add: false,
      remove: false,
      finish: true
    });
  });

  it('enables remove button when a previously added section is selected', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);
    const buttons = await getButtonsAsync();

    emulateSelectSection();
    fireEvent.click(buttons.add);

    const sectionButtons = findAllSectionButtons();
    fireEvent.click(sectionButtons[0]);

    expectButtonsEnabled(buttons, {
      add: false,
      remove: true,
      finish: true
    });
  });

  it('removes the section when the section button is selected and remove is clicked', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);
    const buttons = await getButtonsAsync();

    emulateSelectSection();
    fireEvent.click(buttons.add);

    let sectionButtons = findAllSectionButtons();
    expect(sectionButtons).toHaveLength(1);
    fireEvent.click(sectionButtons[0]);

    fireEvent.click(buttons.remove);

    sectionButtons = findAllSectionButtons();

    expect(sectionButtons).toHaveLength(0);
  });

  it('disables finish button when all sections are removed', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);
    const buttons = await getButtonsAsync();

    emulateSelectSection();
    fireEvent.click(buttons.add);

    expectButtonsEnabled(buttons, {
      add: false,
      remove: false,
      finish: true
    });

    let sectionButtons = findAllSectionButtons();
    fireEvent.click(sectionButtons[0]);

    fireEvent.click(buttons.remove);

    expectButtonsEnabled(buttons, {
      add: true,
      remove: false,
      finish: false
    });
  });

  it('toggles the automatic slicer when the trigger is pressed', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);

    const automaticSlicerTrigger = getAutomaticSlicerTrigger();

    expect(automaticSlicerTrigger).toHaveClass('is-closed');
    expect(automaticSlicerTrigger).not.toHaveClass('is-open');

    fireEvent.click(automaticSlicerTrigger);

    await waitFor(() => {
      expect(automaticSlicerTrigger).toHaveClass('is-open');
      expect(automaticSlicerTrigger).not.toHaveClass('is-closed');
    });

    fireEvent.click(automaticSlicerTrigger);

    await waitFor(() => {
      expect(automaticSlicerTrigger).toHaveClass('is-closed');
      expect(automaticSlicerTrigger).not.toHaveClass('is-open');
    });
  });

  it('automatically generates sections when the automatic slicer slice button is pressed', async () => {
    const props = getPropsWithAudioFile();
    await renderSlicerAsync(props);

    let sectionButtons = findAllSectionButtons();
    expect(sectionButtons).toHaveLength(0);

    const automaticSlicerTrigger = getAutomaticSlicerTrigger();

    expect(automaticSlicerTrigger).toHaveClass('is-closed');
    expect(automaticSlicerTrigger).not.toHaveClass('is-open');

    fireEvent.click(automaticSlicerTrigger);

    await waitFor(() => {
      expect(automaticSlicerTrigger).toHaveClass('is-open');
      expect(automaticSlicerTrigger).not.toHaveClass('is-closed');
    });

    const sliceButton = getAutomaticSliceButton();
    fireEvent.click(sliceButton);

    sectionButtons = findAllSectionButtons();
    expect(sectionButtons).not.toHaveLength(0);
  });
});

// Helpers

const defaultProps = {
  originalFile: {
    audioFile: undefined,
    transcript: ''
  },
  handleUpdateSections: () => {}
};

function getPropsWithAudioFile() {
  const props = {...defaultProps};
  props.originalFile = {
    audioFile: new File([""], "audio.wav", { type: 'audio/wav' }),
    transcript: ''
  }
  return props;
}

// Rendering the slicer must be waited for because the component runs some calculations that update its own state after mounting,
// (and react-testing-library hates it if you don't wait for that to happen)
async function renderSlicerAsync(props) {
  await waitFor(() => {
    render(
      <Slicer
        originalFile={props.originalFile}
        handleUpdateSections={props.handleUpdateSections}
      />
    );
  });
}

async function getButtonsAsync() {
  const buttons = {};
  for await (const element of BUTTONS) {
    const regex = new RegExp(element, 'i');
    await waitFor(() => {
      const button = screen.getByRole('button', { name: regex });
      buttons[element] = button;
    });
  }
  return buttons;
}

function expectButtonsEnabled(buttons, enabled) {
  BUTTONS.forEach(element => {
    enabled[element] ? expect(buttons[element]).toBeEnabled() : expect(buttons[element]).toBeDisabled();
  });
}

async function getCanvasesAsync() {
  const canvases = await screen.findAllByTestId('slicer-image-canvas');
  return canvases;
  
}

function emulateSelectSection() {
  const container = document.querySelector('div#slicer-selector-wrapper');
  expect(container).toBeInTheDocument();
  fireEvent.pointerDown(container, { clientX: 10, clientY: 10 });
  fireEvent.pointerMove(container, { clientX: 20, clientY: 20 });
  fireEvent.pointerUp(container, { clientX: 20, clientY: 20 });
container
}

function findAllSectionButtons() {
  return screen.queryAllByRole('button', { name: 'section-select' });
}

function getAutomaticSlicerTrigger() {
  return screen.getByRole('button', { name: /automatic slicer/i });
}

function getAutomaticSliceButton() {
  return screen.queryByTestId('automatic-slice-button');
}

// function getProps() {
//   const wavBlob = new Blob([new Uint8Array(44)], { type: 'audio/wav' });
//   const wavFile = new File([wavBlob], 'empty.wav', { type: 'audio/wav' });
//   return {
//     originalFile: {
//       audioFile: wavFile,
//       transcript: 'empty'
//     }
//   }
// }

// async function renderSlicer(props) {
//   render(<Slicer originalFile={props.originalFile}/>);
//   await waitFor(() => {
//     const text = screen.getByText('Generating audio image...');
//     expect(text).not.toBeNull();
//   });
// }

// function getButtonLabels() {
//   return ['Play', 'Add', 'Remove', 'Finish'];
// }

// function getButtons() {
//   const labels = getButtonLabels();
//   const buttons = {};
//   for (let i = 0; i < labels.length; i++) {
//     const regex = new RegExp(labels[i], 'i');
//     buttons[labels[i]] = screen.getByRole('button', { name: regex });

//   }
//   return buttons;
// }

// function getIsDisabledObject(isPlayDisabled, isAddDisabled, isRemoveDisabled, isFinishDisabled) {
//   return {
//     Play: isPlayDisabled,
//     Add: isAddDisabled,
//     Remove: isRemoveDisabled,
//     Finish: isFinishDisabled
//   }
// }

// function expectButtonsToBeDisabled(buttons, isDisabled) {
//   const labels = getButtonLabels();
//   for (let i = 0; i < labels.length; i++) {
//     isDisabled[labels[i]] ? expect(buttons[labels[i]]).toBeDisabled : expect(buttons[labels[i]]).not.toBeDisabled();
//   }
// }

// function simulateSelectSection() {
//   // Todo: This does not work anymore after refactoring the Slicer.
//   // Need to provide the component with some kind of mocked audio file or there will be 0 canvases
//   // and hence no way to simulate selecting. Most of the behavior is therefore untestable atm.
//   const canvas = document.querySelector('canvas#slicer-selector-canvas');
//   expect(canvas).not.toBeNull();
//   canvas.getBoundingClientRect = jest.fn(() => ({
//     width: 100,
//     left: 0
//   }));
//   fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
//   fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
//   fireEvent.pointerUp(canvas, { clientX: 20, clientY: 20 });
// }

// function findAllSectionButtons() {
//   return screen.queryAllByRole('button', { name: 'section-select' });
// }

// describe('Slicer', () => {
//   it('renders without crashing', async () => {
//     await renderSlicer(getProps());
//   });

//   // These tests will not work unless I can figure out a good way to mock an audio file.

//   // it('disables all buttons when first rendered, except play button', async () => {
//   //   await renderSlicer(getProps());
//   //   const buttons = getButtons();
//   //   expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, true, true, true));
//   // });

//   // The rest of these tests will not work until `simulateSelectSection` is fixed

//   // it('enables play and add buttons when a selection is made', async () => {
//   //   await renderSlicer(getProps());
//   //   const buttons = getButtons();
//   //   simulateSelectSection();
//   //   expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, false, true, true));
//   // });

//   // it('removes current selection when add button is pressed', async () => {
//   //   await renderSlicer(getProps());
//   //   const buttons = getButtons();
//   //   simulateSelectSection();
//   //   fireEvent.click(buttons.Add);
//   //   expectButtonsToBeDisabled(buttons, getIsDisabledObject(true, true, true, false));
//   // });

//   // it('creates a selection when add button is pressed', async () => {
//   //   await renderSlicer(getProps());
//   //   const buttons = getButtons();
//   //   simulateSelectSection();

//   //   let sectionButtons = findAllSectionButtons();
//   //   expect(sectionButtons.length).toBeLessThan(1);
//   //   fireEvent.click(buttons.Add);

//   //   sectionButtons = findAllSectionButtons();
//   //   expect(sectionButtons.length).toBe(1);
//   // });

//   // it('enables play and remove buttons when a previously created section is selected, but disables add button', async () => {
//   //   await renderSlicer(getProps());
//   //   const buttons = getButtons();
//   //   simulateSelectSection();
//   //   fireEvent.click(buttons['Add']);

//   //   const sectionButtons = findAllSectionButtons();
//   //   fireEvent.click(sectionButtons[0]);

//   //   expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, true, false, false));
//   // });

//   // it('disables finish button when the only created section is removed', async () => {
//   //   await renderSlicer(getProps());
//   //   let buttons = getButtons();
//   //   simulateSelectSection();
//   //   fireEvent.click(buttons.Add);
//   //   expectButtonsToBeDisabled(buttons, getIsDisabledObject(true, true, true, false));

//   //   let sectionButtons = findAllSectionButtons();
//   //   fireEvent.click(sectionButtons[0]);
//   //   expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, true, false, false));

//   //   fireEvent.click(buttons.Remove);

//   //   sectionButtons = findAllSectionButtons();
//   //   expect(sectionButtons.length).toBe(0);

//   //   buttons = getButtons();
//   //   expectButtonsToBeDisabled(buttons, getIsDisabledObject(false, false, true, true));
//   // });
// });