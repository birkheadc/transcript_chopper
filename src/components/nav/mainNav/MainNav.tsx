import * as React from 'react';
import { useLocation } from 'react-router-dom';
import './MainNav.css';
import Navbar from '../navbar/Navbar';
import NavPanel from '../navPanel/NavPanel';

const SCROLL_CLOSE_DISTANCE = 30;

interface MainNavProps {

}
/**
 * The main navigation wrapper used by the site, mostly handles opening, closing, hiding, and showing of child navigation components.
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

  React.useEffect(function addClickListener() {
    const clickListener = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        if (event.target.classList.contains('nav-panel-click-box') === false) {
          setNavPanelOpen(false);
        }
      }
    }
    window.addEventListener('click', clickListener);
    return (() => {
      window.removeEventListener('click', clickListener);
    })
  }, []);

  React.useEffect(function closeNavPanelOnNavigate() {
    setNavPanelOpen(false);
  }, [ pathname ]);

  React.useEffect(function handleChangeInScrollPosition() {
    const handleScroll = () => {
      if (window.scrollY < scrollPosition) {
        setNavBarOpen(true);
      } else if (window.scrollY > scrollPosition && window.scrollY >= SCROLL_CLOSE_DISTANCE) {
        setNavBarOpen(false);
      }
      setNavPanelOpen(false);
      setScrollPosition(window.scrollY);
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [ scrollPosition ]);
  
  return (
    <nav>
      <Navbar isOpen={isNavBarOpen} handleToggleNavPanel={handleToggleNavPanel} />
      <NavPanel isOpen={isNavPanelOpen} handleClick={() => setNavPanelOpen(false)}/>
    </nav>
  );
}

export default MainNav;