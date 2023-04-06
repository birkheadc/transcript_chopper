import * as React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';

interface NavbarProps {
  handleToggleNavPanel: () => void
}
/**
 * 
 * @param {} props.handleToggleNavPanel The function to call when pressing the toggle-nav-pane button
 * @returns {JSX.Element | null}
 */
function Navbar(props: NavbarProps): JSX.Element | null {
  
  return (
    <div className='nav-bar'>
      <ul className='nav-bar'>
        <li>
          <button onClick={props.handleToggleNavPanel} >+</button>
        </li>
      </ul>
      <ul>
        <li>
          <NavLink to="/">Get Started</NavLink>
        </li>
      </ul>
    </div>
    
  );
}

export default Navbar;