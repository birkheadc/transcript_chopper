import 'jest-canvas-mock';
import '@testing-library/jest-dom';

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