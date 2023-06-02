import * as React from 'react';
import Chopper from './Chopper'
import { render } from '@testing-library/react';

describe('Chopper', () => {
  it('renders without crashing', () => {
    renderChopper();
  });
});

// Helpers

function renderChopper() {
  render(<Chopper />);
}