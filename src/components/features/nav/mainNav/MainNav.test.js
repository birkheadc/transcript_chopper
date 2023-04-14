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
    expect(container.querySelector('.nav-bar')).not.toBeNull();
    expect(container.querySelector('.nav-panel')).not.toBeNull();
  });

  it('toggles nav panel when toggle panel button is pressed', () => {
    const {container} = renderMainNav();
    expect(container.querySelector('.nav-panel.shown')).toBeNull();
    expect(container.querySelector('.nav-panel.hidden')).not.toBeNull();

    const button = screen.getByRole('button', {
      name: 'toggle-nav'
    });
    fireEvent.click(button);

    expect(container.querySelector('.nav-panel.shown')).not.toBeNull();
    expect(container.querySelector('.nav-panel.hidden')).toBeNull();
  });

  it('hides nav-bar upon scrolling down, shows upon scrolling up', async () => {
    const {container} = renderMainNav();

    expect(container.querySelector('.nav-bar.shown')).not.toBeNull();
    expect(container.querySelector('.nav-bar.hidden')).toBeNull();

    fireEvent.scroll(window, { target: { scrollY: 10 } });

    expect(container.querySelector('.nav-bar.shown')).toBeNull();
    expect(container.querySelector('.nav-bar.hidden')).not.toBeNull();

    fireEvent.scroll(window, { target: { scrollY: -10 } });

    expect(container.querySelector('.nav-bar.shown')).not.toBeNull();
    expect(container.querySelector('.nav-bar.hidden')).toBeNull();
  });

  it('hides nav-panel when scrolling', () => {
    const {container} = renderMainNav();

    expect(container.querySelector('.nav-panel.shown')).toBeNull();
    expect(container.querySelector('.nav-panel.hidden')).not.toBeNull();

    const button = screen.getByRole('button', {
      name: 'toggle-nav'
    });
    fireEvent.click(button);

    expect(container.querySelector('.nav-panel.shown')).not.toBeNull();
    expect(container.querySelector('.nav-panel.hidden')).toBeNull();

    fireEvent.scroll(window, { target: { scrollY: 10 } });

    expect(container.querySelector('.nav-panel.shown')).toBeNull();
    expect(container.querySelector('.nav-panel.hidden')).not.toBeNull();
  });

  it('hides nav-panel when clicking outside nav-panel', () => {
    const {container} = renderMainNav();

    expect(container.querySelector('.nav-panel.shown')).toBeNull();
    expect(container.querySelector('.nav-panel.hidden')).not.toBeNull();

    const button = screen.getByRole('button', {
      name: 'toggle-nav'
    });
    fireEvent.click(button);

    expect(container.querySelector('.nav-panel.shown')).not.toBeNull();
    expect(container.querySelector('.nav-panel.hidden')).toBeNull();

    fireEvent.click(document.body);

    expect(container.querySelector('.nav-panel.shown')).toBeNull();
    expect(container.querySelector('.nav-panel.hidden')).not.toBeNull();
  });
});