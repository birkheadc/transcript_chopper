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
        <h1>Transcript Chopper</h1>
        <Chopper />
      </div>
    </main>
  );
}

export default ChopPage;