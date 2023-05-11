import * as React from 'react';
import './DeckGenerator.css'

interface DeckGeneratorProps {

}

/**
*
* @returns {JSX.Element | null}
*/
function DeckGenerator(props: DeckGeneratorProps): JSX.Element | null {
  return (
    <div className='deck-generator-wrapper'>
      Deck Generator
    </div>
  );
}

export default DeckGenerator;