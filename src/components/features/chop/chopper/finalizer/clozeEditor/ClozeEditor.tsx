import * as React from 'react';
import './ClozeEditor.css'
import FileGenerator from '../fileGenerator/FileGenerator';
import StubRangePair from '../../../../../../types/stubRangePair/stubRangePair';
import { FinalFileNamingScheme } from '../../../../../../types/formats/finalFileNamingScheme';
import { FinalFileFormat } from '../../../../../../types/formats/finalFileFormat';

interface ClozeEditorProps {
  originalAudioFile: File | undefined,
  pairs: StubRangePair[],
  namingScheme: FinalFileNamingScheme
}

/**
* The component that the user interacts with to create fill-in-the-blank style flash cards.
* @param {File} props.originalAudioFile The original audio file to chop.
* @param {Range[]} props.pairs The sections of the audio to split, and their respective strings.
* @param {FinalFileNamingScheme} props.namingScheme How to name the files.
* @returns {JSX.Element | null}
*/
function ClozeEditor(props: ClozeEditorProps): JSX.Element | null {

  const [newPairs, setNewPairs] = React.useState<StubRangePair[]>([]);

  function renderFileGenerator(): JSX.Element | null {
    if (newPairs.length < props.pairs.length) {
      return null;
    }
    return <FileGenerator originalAudioFile={props.originalAudioFile} pairs={newPairs} format={FinalFileFormat.ClozedAnkiCard} namingScheme={props.namingScheme} />
  }

  return (
    <div className='cloze-editor-wrapper'>
      ClozeEditor
      {renderFileGenerator()}
    </div>
  );
}

export default ClozeEditor;