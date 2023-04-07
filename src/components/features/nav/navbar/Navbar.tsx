import * as React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline'

interface NavbarProps {
  handleToggleNavPanel: () => void,
  isOpen: boolean
}
/**
 * 
 * @param {Function} props.handleToggleNavPanel The function to call when pressing the toggle-nav-pane button
 * @param {boolean} props.isOpen Sets whether or not to display the panel
 * @returns {JSX.Element | null}
 */
function Navbar(props: NavbarProps): JSX.Element | null {
  
  return (
    <div className={'nav-bar ' + (props.isOpen ? 'shown' : 'hidden')}>
      <ul className='nav-bar'>
        <li>
          <button aria-label='toggle-nav' className='nav-panel-click-box nav-bar-button' onClick={props.handleToggleNavPanel} >
            <Bars3Icon className='icon' />
          </button>
        </li>
      </ul>
      <ul>
        <li>
          <NavLink tabIndex={props.isOpen ? 0 : -1} to="/">Get Started</NavLink>
        </li>
      </ul>
    </div>
    
  );
}

export default Navbar;