import * as React from 'react';
import './ChopPage.css';
import Chopper from '../chopper/Chopper';

interface ChopPageProps {

}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
function ChopPage(props: ChopPageProps): JSX.Element | null {
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

export default ChopPage;