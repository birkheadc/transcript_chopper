import * as React from 'react';
import './WelcomeExample.css'

import audioImage from '../../../../../../assets/example/audio_image.png';
import textImage from '../../../../../../assets/example/text_image.png';
import outputImage from '../../../../../../assets/example/output_image.png';

interface WelcomeExampleProps {

}

/**
*
* @returns {JSX.Element | null}
*/
function WelcomeExample(props: WelcomeExampleProps): JSX.Element | null {
  return (
    <div className='welcome-example-wrapper'>
      <div>
        <img src={audioImage}></img>
      </div>
      <div>
        <img src={outputImage}></img>
      </div>
    </div>
  );
}

export default WelcomeExample;