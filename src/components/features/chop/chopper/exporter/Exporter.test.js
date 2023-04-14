import * as React from 'react';
import Exporter from './Exporter'
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

async function queryDownloadLink() {
  return await waitFor(() => {
    screen.queryByRole('link', { textContent: 'Download' })
  }) ?? null;
}

function getButtons() {
  const BUTTON_NAMES = ['Zip File'];
  const buttons = {};
  for (let i = 0; i < BUTTON_NAMES.length; i++) {
    const button = screen.getByRole('button', { name: BUTTON_NAMES[i] });
    buttons[BUTTON_NAMES[i]] = button;
  }
  return buttons;
}

function getProps(isFile, isPairs) {
  return {
    originalAudioFile: isFile ? new File(["mock_file"], "mock_file.txt", { type: "text/plain" }) : undefined,
    pairs: []
  }
}

function renderExporter(props) {
  return render(<Exporter originalAudioFile={props.originalAudioFile} pairs={props.pairs} />)
}

describe('Exporter', () => {
  it('renders without crashing', () => {
    renderExporter(getProps(false, false));
  });

  it('contains buttons in BUTTON_NAMES', () => {
    renderExporter(getProps(false, false));
    const buttons = getButtons();
  });

  it('DOES NOT provide download link after clicking zip button if originalAudioFile is undefined', async () => {
    renderExporter(getProps(false, false));
    const buttons = getButtons();
    fireEvent.click(buttons['Zip File']);
    await waitFor(() => {
      const link = screen.queryByText('Download');
      expect(link).toBeNull();
    })
  });

  it('DOES provide download link after clicking zip button if originalAudioFile is defined', async () => {
        renderExporter(getProps(true, false));
    const buttons = getButtons();
    fireEvent.click(buttons['Zip File']);
    await waitFor(() => {
      const link = screen.queryByRole('link', { textContent: 'Download' });
      expect(link).not.toBeNull();
    });
  });
});