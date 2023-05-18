import * as React from 'react';
import './WelcomeBanner.css'
import { NavLink } from 'react-router-dom';
import audioImage from '../../../../assets/images/audio_image.png';


interface WelcomeBannerProps {

}

/**
*
* @returns {JSX.Element | null}
*/
function WelcomeBanner(props: WelcomeBannerProps): JSX.Element | null {
  return (
    <div className='welcome-banner-wrapper' id='welcome-banner'>
      <h1>Audio Flashcard Wizard</h1>
      <img className='welcome-banner-image' src={audioImage}></img>
      <div className='welcome-banner-call-to-action-wrapper'>
        <p>
          Automatically generate language-learning flash cards from audio and text.
          All in your browser. No registration or downloads required.
        </p>
        <NavLink to='/'>Get Started Now</NavLink>
      </div>
    </div>
  );
}

export default WelcomeBanner;