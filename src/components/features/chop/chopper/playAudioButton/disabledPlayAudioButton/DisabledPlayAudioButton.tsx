import * as React from 'react';
import './DisabledPlayAudioButton.css'

interface DisabledPlayAudioButtonProps {

}

/**
*
* @returns {JSX.Element | null}
*/
function DisabledPlayAudioButton(props: DisabledPlayAudioButtonProps): JSX.Element | null {
  return (
    <button
    className='play-audio-button'
    disabled={true}
    >
      Play
    </button>
  );
} 

export default DisabledPlayAudioButton;