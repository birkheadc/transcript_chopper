import * as React from 'react';
import Exporter from './Exporter'
import { render } from '@testing-library/react';

function renderExporter() {
  return render(<Exporter />)
}

describe('Exporter', () => {
  it('renders without crashing', () => {
    renderExporter();
  });
});