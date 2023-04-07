import * as React from 'react';
import MainNav from './MainNav'
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const renderMainNav = () => {
  return render(
    <MemoryRouter>
      <MainNav />
    </MemoryRouter>
  );
}

describe('MainNav', () => {
  it('contains a nav-bar and nav-panel', () => {
    const {container} = renderMainNav();
    expect(container.querySelector('.nav-bar')).not.toBe(null);
    expect(container.querySelector('.nav-panel')).not.toBe(null);
  });

  it('toggles nav panel when toggle panel button is pressed', () => {
    const {container} = renderMainNav();
    expect(container.querySelector('.nav-panel.shown')).toBe(null);
    expect(container.querySelector('.nav-panel.hidden')).not.toBe(null);

    const button = screen.getByRole('button', {
      name: 'toggle-nav'
    });
    fireEvent.click(button);

    expect(container.querySelector('.nav-panel.shown')).not.toBe(null);
    expect(container.querySelector('.nav-panel.hidden')).toBe(null);
  });

  it('hides nav-bar upon scrolling down, shows upon scrolling up', async () => {
    const {container} = renderMainNav();

    expect(container.querySelector('.nav-bar.shown')).not.toBe(null);
    expect(container.querySelector('.nav-bar.hidden')).toBe(null);

    fireEvent.scroll(window, { target: { scrollY: 10 } });

    expect(container.querySelector('.nav-bar.shown')).toBe(null);
    expect(container.querySelector('.nav-bar.hidden')).not.toBe(null);

    fireEvent.scroll(window, { target: { scrollY: -10 } });

    expect(container.querySelector('.nav-bar.shown')).not.toBe(null);
    expect(container.querySelector('.nav-bar.hidden')).toBe(null);
  });

  it('hides nav-panel when scrolling', () => {
    const {container} = renderMainNav();

    expect(container.querySelector('.nav-panel.shown')).toBe(null);
    expect(container.querySelector('.nav-panel.hidden')).not.toBe(null);

    const button = screen.getByRole('button', {
      name: 'toggle-nav'
    });
    fireEvent.click(button);

    expect(container.querySelector('.nav-panel.shown')).not.toBe(null);
    expect(container.querySelector('.nav-panel.hidden')).toBe(null);

    fireEvent.scroll(window, { target: { scrollY: 10 } });

    expect(container.querySelector('.nav-panel.shown')).toBe(null);
    expect(container.querySelector('.nav-panel.hidden')).not.toBe(null);
  });

  it('hides nav-panel when clicking outside nav-panel', () => {
    const {container} = renderMainNav();

    expect(container.querySelector('.nav-panel.shown')).toBe(null);
    expect(container.querySelector('.nav-panel.hidden')).not.toBe(null);

    const button = screen.getByRole('button', {
      name: 'toggle-nav'
    });
    fireEvent.click(button);

    expect(container.querySelector('.nav-panel.shown')).not.toBe(null);
    expect(container.querySelector('.nav-panel.hidden')).toBe(null);

    fireEvent.click(document.body);

    expect(container.querySelector('.nav-panel.shown')).toBe(null);
    expect(container.querySelector('.nav-panel.hidden')).not.toBe(null);
  });
});