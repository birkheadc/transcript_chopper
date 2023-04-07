import * as React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('app', () => {
  it('renders', () => {
    render(<App />);
  })
});