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
  const [isNavBarOpen, setNavBarOpen] = React.useState<boolean>(true);
  const [scrollPosition, setScrollPosition] = React.useState<number>(0);

  const handleToggleNavPanel = () => {
    setNavPanelOpen((isOpen) => !isOpen);
  }

  React.useEffect(() => {
    const handleScroll = () => {
      setNavPanelOpen(false);
      if (window.scrollY < scrollPosition) {
        setNavBarOpen(true);
      }
      else {
        setNavBarOpen(false);
      }
      setScrollPosition(window.scrollY);
    }

    const handleClick = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        if (event.target.classList.contains('nav-panel-click-box') === false) {
          setNavPanelOpen(false);
        }
      }
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    }
  }, [scrollPosition]);
  
  return (
    <nav>
      <Navbar isOpen={isNavBarOpen} handleToggleNavPanel={handleToggleNavPanel} />
      <NavPanel isOpen={isNavPanelOpen} />
    </nav>
  );
}

export default MainNav;