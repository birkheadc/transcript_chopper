import * as React from 'react';
import './WelcomeBanner.css'
import { NavLink } from 'react-router-dom';
import WelcomeExample from './welcomeExample/WelcomeExample';

interface WelcomeBannerProps {

}

/**
*
* @returns {JSX.Element | null}
*/
function WelcomeBanner(props: WelcomeBannerProps): JSX.Element | null {
  return (
    <div className='welcome-banner-wrapper'>
      <h1>Audio Flashcard Wizard</h1>
      <WelcomeExample />
      <div className='welcome-banner-call-to-action-wrapper'>
        <p>
          Automatically generate dozens of language-learning flash cards from audio and text.
          Everything runs in your browser.
          No registration required.
        </p>
        <NavLink to='/'>Get Started Now</NavLink>
      </div>
    </div>
  );
}

export default WelcomeBanner;