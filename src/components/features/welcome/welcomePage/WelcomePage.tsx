import * as React from 'react';
import './WelcomePage.css';
import { Bars3Icon } from '@heroicons/react/24/outline';
import WelcomeBanner from './welcomeBanner/WelcomeBanner';

interface WelcomePageProps {

}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
function WelcomePage(props: WelcomePageProps): JSX.Element | null {
  return (
    <>
      <WelcomeBanner />
      <div className='welcome-page-wrapper'>
        <main>
          <section className='welcome-page-section' id='welcome-page-about'>
            <h2>What is this?</h2>
            <div className='welcome-page-section-body'>
              <div className='welcome-page-section-text'>
                <p>Audio Flashcard Wizard is an open-source web application that runs in your browser.</p>
                <p>At the most basic level, it helps you split an audio file (usually of someone talking), and text (usually the transcript of that audio), into smaller files.</p>
                <p>If that's all you want, you can then simply download those new files and be on your way.</p>
                <p>But the intended use of the application is to reformat that data so that in can be easily imported into a flashcard program (I personally use <a href='https://apps.ankiweb.net/'>Anki</a>) for language study.</p>
              </div>
            </div>
          </section>
          <section className='welcome-page-section'>
            <h2>How does it work?</h2>
            <div className='welcome-page-section-body'>
              <div className='welcome-page-section-text'>
                <p>The app is designed to be easy to use. Simply follow the prompts through each step.</p>
                <p>Basically, there are 4 steps:</p>
                <ol>
                  <li>Choose your audio file, and provide the full transcript if you have it</li>
                  <li>Decide where to make the cuts in the audio</li>
                  <li>Tell the application what parts of the text cover those cuts</li>
                  <li>Choose how to download your files</li>
                </ol>
                <p>For more advanced use, there is a demo <a>here</a>, or a tutorial <a>here</a>.</p>
              </div>
            </div>
          </section>
          
        </main>
      </div>
    </>
  );
}

export default WelcomePage;