import * as React from 'react';
import './MainNav.css';
import Navbar from '../navbar/Navbar';
import NavPanel from '../navPanel/NavPanel';

interface MainNavProps {

}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
function MainNav(props: MainNavProps): JSX.Element | null {

  const [isNavPanelOpen, setNavPanelOpen] = React.useState<boolean>(false);

  const handleToggleNavPanel = () => {
    setNavPanelOpen((isOpen) => !isOpen);
  }
  
  return (
    <nav>
      <Navbar handleToggleNavPanel={handleToggleNavPanel} />
      <NavPanel isOpen={isNavPanelOpen} />
    </nav>
  );
}

export default MainNav;