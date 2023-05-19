import * as React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline'
import { NavBarState } from '../../../types/enums/navBarState/navBarState';

interface NavbarProps {
  handleToggleNavPanel: () => void,
  isOpen: boolean
}
/**
 * The navbar at the top of the screen.
 * @param {Function} props.handleToggleNavPanel The function to call when pressing the toggle-nav-panel button
 * @param {boolean} props.isOpen Determines whether the nav is shown or not.
 * @returns {JSX.Element | null}
 */
function Navbar(props: NavbarProps): JSX.Element | null {

  return (
    <div className={ 'nav-bar '  + (props.isOpen ? 'open' : 'closed')}>
      <div className='nav-bar-inner-wrapper'>
        <button aria-label='toggle-nav' className='nav-panel-click-box nav-bar-button' onClick={props.handleToggleNavPanel} >
          <Bars3Icon className='icon' />
        </button>
        <NavLink tabIndex={props.isOpen ? 0 : -1} to="/">Get Started</NavLink>
      </div>
    </div>
    
  );
}

export default Navbar;