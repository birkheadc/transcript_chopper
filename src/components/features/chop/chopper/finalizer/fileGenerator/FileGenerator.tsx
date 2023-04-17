import * as React from 'react';
import './FileGenerator.css'
import StubRangePair from '../../../../../../types/stubRangePair/stubRangePair';
import generateFinalFile from '../../../../../../shared/generateFinalFile/generateFinalFile';

interface FileGeneratorProps {
  originalAudioFile: File | undefined,
  pairs: StubRangePair[],
  format: string,
  namingScheme: string
}

/**
* The component that creates and serves the final files.
* @param {File} props.originalAudioFile The original audio file to chop.
* @param {Range[]} props.pairs The sections of the audio to split, and their respective strings.
* @param {string} props.format The format the user selected to receive their files as.
* @param {string} props.namingScheme How to name the files.
* @returns {JSX.Element | null}
*/
function FileGenerator(props: FileGeneratorProps): JSX.Element | null {

  const [isWorking, setWorking] = React.useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | undefined>(undefined);

  function arePropsValid(): boolean {
    if (props.originalAudioFile == null) return false;
    if (props.pairs.length < 1) return false;
    if (props.format === '') return false;
    if (props.namingScheme === '') return false;

    return true;
  }

  React.useEffect(() => {
    if (arePropsValid() === false) return;
    (async function createDownloadLink() {
      setWorking(true);
      try {
        const file: Blob = await generateFinalFile();
        setDownloadUrl(URL.createObjectURL(file));
      } catch {
        console.log('Error creating final file.');
      }
      setWorking(false);
    })();

  }, [ props.originalAudioFile, props.pairs, props.format, props.namingScheme ]);

  function renderBody(): JSX.Element | null {
    if (isWorking) return <p>Generating download link...</p>
    if (downloadUrl == null) return null;
    return <a download='file.zip' href={downloadUrl}>Download</a>
  }

  return (
    <div className='file-generator-wrapper'>
      {renderBody()}
    </div>
  );
}

export default FileGenerator;