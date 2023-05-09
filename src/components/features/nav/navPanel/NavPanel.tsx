import * as React from 'react';
import './NavPanel.css';
import { NavLink } from 'react-router-dom';

interface NavPanelProps {
  isOpen: boolean
}
/**
 * 
 * @param {boolean} props.isOpen Sets whether or not to display the panel
 * @returns {JSX.Element | null}
 */
function NavPanel(props: NavPanelProps): JSX.Element | null {
  return (
    <div className={'nav-panel-click-box nav-panel ' + (props.isOpen ? 'shown' : 'hidden')}>
      <ul>
        <li>
          <NavLink className={'nav-panel-click-box'} tabIndex={props.isOpen ? 0 : -1} to={ '/welcome '}>Home</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default NavPanel;