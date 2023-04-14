import 'jest-canvas-mock';
import '@testing-library/jest-dom';

// URL.createObjectURL does not exist in the test environment, so it is mocked.
global.URL.createObjectURL = jest.fn(() => '#');