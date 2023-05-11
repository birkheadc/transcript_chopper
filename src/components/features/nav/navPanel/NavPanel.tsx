import * as React from 'react';
import './NavPanel.css';
import { HashLink } from 'react-router-hash-link';
import { NavLink } from 'react-router-dom';

interface NavPanelProps {
  isOpen: boolean,
  handleClick: () => void
}
/**
 * The nav panel that the user can open and close.
 * @param {boolean} props.isOpen Sets whether or not to display the panel
 * @param {() => void} props.handleClick Function to call when clicking a link, likely to close the nav panel even if no navigation happens.
 * @returns {JSX.Element | null}
 */
function NavPanel(props: NavPanelProps): JSX.Element | null {

  const handleClick = () => {
    props.handleClick();
  }

  return (
    <div className={'nav-panel-click-box nav-panel ' + (props.isOpen ? 'shown' : 'hidden')}>
      <div className='nav-panel-inner-wrapper'>
        <ul className='nav-panel-list'>
          <li>
            <HashLink className='nav-panel-click-box' onClick={handleClick} smooth tabIndex={props.isOpen ? 0 : -1} to='/welcome#welcome-banner'>Home</HashLink>
          </li>
          <li>
            <HashLink className='nav-panel-click-box' onClick={handleClick} smooth tabIndex={props.isOpen ? 0 : -1} to='/welcome#welcome-page-about' >About</HashLink>
          </li>
          <li>
            <HashLink className='nav-panel-click-box' onClick={handleClick} smooth tabIndex={props.isOpen ? 0 : -1} to='/welcome#welcome-page-faq' >FAQ</HashLink>
          </li>
          <li>
            <HashLink className='nav-panel-click-box' onClick={handleClick} smooth tabIndex={props.isOpen ? 0 : -1} to='/welcome#welcome-page-contribute' >Contribute</HashLink>
          </li>
        </ul>
        <ul className='nav-panel-list'>
          
        </ul>
      </div>
    </div>
  );
}

export default NavPanel;