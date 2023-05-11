import * as React from 'react';
import './WelcomeExample.css'

import audioImage from '../../../../../../assets/example/audio_image.png';
import outputImage from '../../../../../../assets/example/output_image_new.png';

interface WelcomeExampleProps {

}

/**
*
* @returns {JSX.Element | null}
*/
function WelcomeExample(props: WelcomeExampleProps): JSX.Element | null {
  return (
    <div className='welcome-example-outer-wrapper'>
      <div className='welcome-example-wrapper'>
        <div className='welcome-example-input-image-wrapper'>
          <img src={audioImage}></img>
        </div>
        {/* <div className='welcome-example-output-image-wrapper'>
          <img src={outputImage}></img>
        </div> */}
      </div>
    </div>
  );
}

export default WelcomeExample;