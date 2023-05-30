import * as React from 'react';
import Chopper from './Chopper'
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createVolumeArray from '../../../__mocks__/helpers/createVolumeArray/createVolumeArray';
// const fs = require('fs');

// const mockVolumeArray = createVolumeArray();
// jest.mock('../../../helpers/createVolumeArray/createVolumeArray', () => {
//   return {
//   __esModule: true,
//   default: jest
//     .fn()
//     .mockReturnValueOnce(Promise.resolve(undefined))
//     .mockReturnValue(Promise.resolve(mockVolumeArray))
//   }
// });

describe('Chopper', () => {
  it('renders without crashing', () => {
    renderChopper();
  });

  it('fails gracefully when given a bad audio file', async () => {
    renderChopper();
    selectAudioFile();
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });
    fireEvent.click(continueButton);
    await waitFor(() => {
      screen.getByText(/audio failed to process/i);
    });
  });

  it('generates zip files with trimmed audio and text files in requested format', async () => {
    // From start to finish, select basic zip format
    // Somehow check the output file to make sure it contains the right number of audio and text files
    // The audio files will be difficult or impossible to fully verify, but the text files can be
    // Then, write an integration test for other formats (all? or just important ones?)
    renderChopper();
    selectAudioFile();
    inputTranscript(exampleText);
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });
    fireEvent.click(continueButton);
    await automaticSlice();
  });
});

// Helpers

function renderChopper() {
  render(<Chopper />);
}

// async function getExampleAudioFileAsBlob() {
//   const path = 'src/assets/test/kokoro/kokoro01.wav';
//   return new Promise((resolve, reject) => {
//     fs.readFile(path, (error, data) => {
//       if (error) {
//         console.log('Error in fs: ', error);
//         reject();
//         return;
//       }

//       const blob = new Blob([data], { type: 'audio/wav' });
//       resolve(blob);
//     });
//   });
// }

async function selectAudioFile() {
  const file = new File([""], "audio.wav", { type: 'audio/wav' });
  const input = screen.getByLabelText(/audio file/i);
  expect(input).toBeInTheDocument();
  userEvent.upload(input, file);
  await waitFor(() => {
    expect(input.files[0]).toStrictEqual(file);
    expect(input.files.item(0)).toStrictEqual(file);
    expect(input.files).toHaveLength(1);
  });
}

const exampleText = 'わたくしはその人を常に先生と呼んでいた。だからここでもただ先生と書くだけで本名は打ち明けない。これは世間をはばかる遠慮というよりも、その方が私にとって自然だからである。私はその人の記憶を呼び起すごとに、すぐ「先生」といいたくなる。筆をとっても心持は同じ事である。よそよそしいかしらもじなどはとても使う気にならない。私が先生と知り合いになったのはかまくらである。その時私はまだ若々しい書生であった。暑中休暇を利用して海水浴に行った友達からぜひ来いというはがきを受け取ったので、';

function inputTranscript(text) {
  const input = screen.getByLabelText(/transcript/i);
  expect(input).toBeInTheDocument();
  fireEvent.change(input, { target: { value: text } });
  expect(input.value).toBe(text);
}

const badAudioBlob = new Blob([""], { type: 'audio/wav' });

async function automaticSlice() {
  // Todo: Audio slicing does not work in the jest environment, probably something to do with audio api not existing
  // Need to uh... make it work
  let automaticSlicer;
  await waitFor(() => {
    automaticSlicer = screen.getByTestId('automatic-slicer');
  });
  fireEvent.click(automaticSlicer);
}