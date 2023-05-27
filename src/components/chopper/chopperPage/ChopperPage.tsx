import * as React from 'react';
import './ChopperPage.css';
import Chopper from '../chopper/Chopper';

interface ChopperPageProps {

}
/**
 * The page that displays the main component of the app.
 * @returns {JSX.Element | null}
 */
function ChopperPage(props: ChopperPageProps): JSX.Element | null {
  return (
    <main>
      <div className='chop-page-wrapper'>
        <div className='chop-page-inner-wrapper'>
          <h1>Audio Flashcard Wizard</h1>
          <Chopper />
        </div>
      </div>
    </main>
  );
}

export default ChopperPage;