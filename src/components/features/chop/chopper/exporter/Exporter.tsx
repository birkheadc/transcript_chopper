import * as React from 'react';
import './Exporter.css'
import Range from '../../../../../types/range/range';
import JSZip from 'jszip';
import { render } from 'react-dom';
import chopAudio from '../../../../../shared/chopAudio/chopAudio';
import StubRangePair from '../../../../../types/stubRangePair/stubRangePair';

interface ExporterProps {
  originalAudioFile: File | undefined,
  pairs: StubRangePair[]
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

  const handleZipFile = async () => {
    setWorking(true);
    const zip = new JSZip();

    if (props.originalAudioFile != null) {
      const sections: Range[] = props.pairs.map(pair => pair.range);
      const audioFiles = await chopAudio(props.originalAudioFile, sections);
      if (audioFiles != null) {
        for (let i = 0; i < audioFiles.length; i++) {
          zip.file(audioFiles[i].name, audioFiles[i]);
        }
      }
    }

    for (let i = 0; i < props.pairs.length; i++) {
      const stub = props.pairs[i].stub;
      zip.file("text_" + i.toString().padStart(props.pairs.length.toString().length, '0') + '.txt', stub);
    }

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