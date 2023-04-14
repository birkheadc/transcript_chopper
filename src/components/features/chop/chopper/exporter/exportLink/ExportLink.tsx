import * as React from 'react';
import './ExportLink.css'
import StubRangePair from '../../../../../../types/stubRangePair/stubRangePair';

interface ExportLinkProps {
  originalAudioFile: File | undefined,
  pairs: StubRangePair[],
  format: 
}

/**
* @param {File} props.originalAudioFile The original audio file to chop.
* @param {Range[]} props.pairs The sections of the audio to split, and their respective strings.
* @param {} props.format The format the user has selected
* @returns {JSX.Element | null}
*/
function ExportLink(props: ExportLinkProps): JSX.Element | null {

  const [isWorking, setWorking] = React.useState<boolean>(false);

  function renderContents(): JSX.Element {
    if (isWorking) {
      return (
        <p>Generating...</p>
      );
    }
    if (props.)
  }

  return (
    <div className='export-link-wrapper'>
      {renderContents()}
    </div>
  );
}

export default ExportLink;