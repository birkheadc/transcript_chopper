import * as React from 'react';
import { useLocation } from 'react-router-dom';
import './MainNav.css';
import Navbar from '../navbar/Navbar';
import NavPanel from '../navPanel/NavPanel';
import { NavBarState } from '../../../types/enums/navBarState/navBarState';
import { Socket } from 'dgram';

const SCROLL_CLOSE_DISTANCE = 30;

interface MainNavProps {

}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
function MainNav(props: MainNavProps): JSX.Element | null {

  const { pathname } = useLocation();

  const [scrollPosition, setScrollPosition] = React.useState<number>(0);

  const [isNavBarOpen, setNavBarOpen] = React.useState<boolean>(true);
  const [isNavPanelOpen, setNavPanelOpen] = React.useState<boolean>(false);

  const handleToggleNavPanel = () => {
    setNavPanelOpen((isOpen) => !isOpen);
  }

  React.useEffect(function closeNavPanelOnNavigate() {
    setNavPanelOpen(false);
  }, [ pathname ]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < scrollPosition) {
        setNavBarOpen(true);
      } else if (window.scrollY > scrollPosition && window.scrollY >= SCROLL_CLOSE_DISTANCE) {
        setNavBarOpen(false);
      }
      setNavPanelOpen(false);
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
  }, [ scrollPosition ]);
  
  return (
    <nav>
      <Navbar handleToggleNavPanel={handleToggleNavPanel} isOpen={isNavBarOpen} />
      <NavPanel isOpen={isNavPanelOpen} handleClick={() => setNavPanelOpen(false)}/>
    </nav>
  );
}

export default MainNav;