import * as React from 'react';
import './Exporter.css'
import Range from '../../../../../types/range/range';
import JSZip from 'jszip';
import { render } from 'react-dom';

interface ExporterProps {
  originalAudioFile: File,
  sections: Range[]
}

/**
* The component that the user interacts with to choose what format to receive their new file(s) in.
* @param {File} props.originalAudioFile The original audio file to chop.
* @param {Range[]} props.sections The sections of the audio to split.
* @returns {JSX.Element | null}
*/
function Exporter(props: ExporterProps): JSX.Element | null {

  const [downloadLink, setDownloadLink] = React.useState<JSX.Element | undefined>(undefined);
  const [working, setWorking] = React.useState<boolean>(false);

  const handleZipFile = () => {
    setWorking(true);
    const zip = new JSZip();

    zip.file("A.txt", "A\n");
    zip.file("B.txt", "B\n");
    zip.file("Hello.txt", "Hello there.\n");
    zip.file("General.txt", "General Kenobi...\n");

    zip.generateAsync({ type: 'blob' }).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = <a download={'files.zip'} href={url}>Download</a>
      setDownloadLink(link);
    }).then(() => setWorking(false));
  }

  const handleAnkiDeckFile = () => {
    alert('Sorry, Anki Deck exporting is not yet implemented!');
  }

  function renderContents(): JSX.Element {
    if (working) {
      return (
        <p>Generating your files now, please wait...</p>
      );
    }
  
    if (downloadLink == null) {
      return (
        <>
          <p>You're almost done! Now you just need to select how to format your return data.</p>
          <ul>
            <li><button onClick={handleZipFile}>Zip File</button></li>
            <li><button onClick={handleAnkiDeckFile} disabled={true}>Anki Deck</button></li>
          </ul>
        </>
      );
    }
    
    return (
      <>
        <p>Your files are ready!</p>
        {downloadLink}
      </>
    );
  }

  return (
    <div className='exporter-wrapper'>
      {renderContents()}
    </div>
  );
  
}

export default Exporter;