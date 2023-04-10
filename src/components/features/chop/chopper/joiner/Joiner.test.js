import * as React from 'react';
import Joiner from './Joiner'
import { render } from '@testing-library/react';

function renderJoiner() {
  render(<Joiner />);
}

describe('Joiner', () => {
  it('renders without crashing', () => {
    renderJoiner();
  });
});