import * as React from 'react';
import './FileGenerator.css'
import StubAudioPair from '../../../../../types/interfaces/stubRangePair/stubAudioPair';
import generateFinalFile from '../../../../../helpers/generateFinalFile/generateFinalFile';
import { BasicFileFormat } from '../../../../../types/enums/formats/finalFileFormat';
import { FinalFileNamingScheme } from '../../../../../types/enums/formats/finalFileNamingScheme';

interface FileGeneratorProps {
  pairs: StubAudioPair[],
  format: BasicFileFormat,
  namingScheme: FinalFileNamingScheme
}

/**
* The component that creates and serves the final files.
* @param {Range[]} props.pairs The sections of the audio to split, and their respective strings.
* @param {BasicFileFormat} props.format The format the user selected to receive their files as.
* @param {FinalFileNamingScheme} props.namingScheme How to name the files.
* @returns {JSX.Element | null}
*/
function FileGenerator(props: FileGeneratorProps): JSX.Element | null {

  const [isWorking, setWorking] = React.useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | undefined>(undefined);

  function arePropsValid(): boolean {
    if (props.pairs.length < 1) return false;
    if (props.format === BasicFileFormat.Null) return false;
    if (props.namingScheme === FinalFileNamingScheme.Null) return false;

    return true;
  }

  React.useEffect(() => {
    if (arePropsValid() === false) return;
    (async function createDownloadLink() {  
      setWorking(true);
      try {
        const blob: Blob | null = await generateFinalFile.generateBasicZipFile(props.pairs, props.format, props.namingScheme);
        if (blob == null) throw new Error('Final file generated null');
        setDownloadUrl(URL.createObjectURL(blob));
      } catch {
        console.log('Error creating final file.');
      }
      setWorking(false);
    })();

  }, [ props.pairs, props.format, props.namingScheme ]);

  function renderBody(): JSX.Element | null {
    if (isWorking) return <p>Generating download link...</p>
    if (downloadUrl == null) return <p>Error: Could not generate files.</p>;
    return <a download={getFileName(props.format)} href={downloadUrl}>Download</a>
  }

  return (
    <div className='file-generator-wrapper'>
      {renderBody()}
    </div>
  );
}

export default FileGenerator;

// Helpers

function getFileName(format: BasicFileFormat): string {
  return 'audio_flashcard_wizard_files.zip';
}