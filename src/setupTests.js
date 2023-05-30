import 'jest-canvas-mock';
import '@testing-library/jest-dom';
import createVolumeArray from './__mocks__/helpers/createVolumeArray/createVolumeArray';

const pointerEventCtorProps = ['clientX', 'clientY', 'pointerType'];
export default class PointerEventFake extends Event {
  constructor(type, props) {
    super(type, props);
    pointerEventCtorProps.forEach((prop) => {
      if (props[prop] != null) {
        this[prop] = props[prop];
      }
    });
  }
}

// URL.createObjectURL does not exist in the test environment, so it is mocked.
global.URL.createObjectURL = jest.fn(() => '#');
global.PointerEvent = PointerEventFake;

// Mock the function of createVolumeArray, since AudioContext is not available in the test environment
const mockVolumeArray = createVolumeArray();
jest.mock('./helpers/createVolumeArray/createVolumeArray', () => {
  return {
  __esModule: true,
  default: jest
    .fn()
    .mockReturnValueOnce(Promise.resolve(undefined))
    .mockReturnValue(Promise.resolve(mockVolumeArray))
  }
});