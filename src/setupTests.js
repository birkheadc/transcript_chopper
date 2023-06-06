import 'jest-canvas-mock';
import '@testing-library/jest-dom';
import createVolumeArray from './__mocks__/helpers/createVolumeArray/createVolumeArray';

const pointerEventCtorProps = ['clientX', 'clientY', 'pointerType'];
class PointerEventFake extends Event {
  constructor(type, props) {
    super(type, props);
    pointerEventCtorProps.forEach((prop) => {
      if (props[prop] != null) {
        this[prop] = props[prop];
      }
    });
  }
}

// Mock a number of functions that don't work in the test environment
global.PointerEvent = PointerEventFake;
global.URL.createObjectURL = jest.fn(() => '#');
global.window.prompt = jest.fn(() => Math.random().toString());
HTMLAudioElement.prototype.pause = jest.fn(() => {});

// Mock the function of createVolumeArray, since it relies on AudioContext, which is not available in the test environment
// The first call will return a bad volume array so that failing may be tested
// Further calls return a volume array for the example audio snippet from 'Kokoro'
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