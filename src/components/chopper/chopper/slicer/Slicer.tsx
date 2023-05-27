import * as React from 'react';
import './Slicer.css'
import AudioWithTranscript from '../../../../types/interfaces/audioWithTranscript/audioWithTranscript';
import SlicerImage from './slicerImage/SlicerImage';
import SlicerSectionRecorder from './slicerSectionRecorder/SlicerSectionRecorder';
import AutomaticSlicer from './automaticSlicer/AutomaticSlicer';
import createVolumeArray from '../../../../helpers/createVolumeArray/createVolumeArray';
import { VolumeArray } from '../../../../types/interfaces/volumeArray/volumeArray';
import Range from '../../../../types/interfaces/range/range';
import SlicerSelector from './slicerSelector/SlicerSelector';
import SlicerImageTimeRuler from './slicerImageTimeRuler/SlicerImageTimeRuler';
import SlicerCanvasDetails from '../../../../types/interfaces/slicerCanvasDetails/slicerCanvasDetails';
import SlicerControls from './slicerControls/SlicerControls';

const CANVAS_DETAILS: SlicerCanvasDetails = {
  height: 200,
  individualCanvasMaxWidth: 10000,
  widthMultiplier: 0.4
}

interface SlicerProps {
  originalFile: AudioWithTranscript,
  handleUpdateSections: (sections: Range[]) => void,
}

/**
* The component that the user interacts with to select where and how to break up the audio file.
* @param {AudioWithTranscript} props.originalFile The audio file and transcript that is to be chopped.
* @param {(sections: Range[]) => void} props.handleUpdateSections The function to call when done selecting.
* @returns {JSX.Element | null}
*/
function Slicer(props: SlicerProps): JSX.Element | null {

  const [volumeArray, setVolumeArray] = React.useState<VolumeArray | undefined>(undefined);
  const [isWorking, setWorking] = React.useState<boolean>(false);
  const [sections, setSections] = React.useState<Range[]>([]);
  const [currentSection, setCurrentSection] = React.useState<Range | undefined>(undefined);
  const [isRemoveButtonEnabled, setRemoveButtonEnabled] = React.useState<boolean>(false);

  React.useEffect(function addKeyboardListener() {

    const functionMap: Record<string, () => void> = {
      'a': addCurrentSelection,
      'r': removeCurrentSelection,
      'f': finishSelecting
    }

    const listener = (event: KeyboardEvent) => {
      const func = functionMap[event.key];
      if (func) func();
    }

    window.addEventListener('keypress', listener);
    return (() => {
      window.removeEventListener('keypress', listener);
    })
  }, [ currentSection, sections ]);

  React.useEffect(() => {
    (async function caluculateAndSetVolumeArray() {
      if (props.originalFile.audioFile == null) return;
      setWorking(true);
      const volume: VolumeArray | undefined = await createVolumeArray(props.originalFile.audioFile);
      setVolumeArray(volume);
      setWorking(false);
    })();
  }, [ props.originalFile ]);

  const addCurrentSelection = () => {  
    if (currentSection == null) return;
    const newSections = [...sections, {...currentSection}];
    setSections(newSections);
    setCurrentSection(undefined);
  }

  const removeCurrentSelection = () => {
    if (currentSection == null) return;
    const newSections = sections.filter(section => section.to !== currentSection.to || section.from !== currentSection.from);
    setSections(newSections);
    setRemoveButtonEnabled(false);
  }

  const finishSelecting = () => {
    if (sections.length < 1) return;
    props.handleUpdateSections(sections);
  }

  const handleUpdateCurrentSection = (section: Range | undefined) => {
    setCurrentSection(section);
    setRemoveButtonEnabled(false);
  }

  const selectSection = (index: number) => {
    setCurrentSection({...sections[index]});
    setRemoveButtonEnabled(true);
  }

  function renderBody(): JSX.Element {
    if (isWorking === true) return <p className='generating-message'>Generating audio image...</p>
    if (volumeArray == null) return <p className='generating-message'>Audio failed to process.</p>
    return (
      <>
        <h2>Choose which slices of the audio you would like to use.</h2>
        <div className='slicer-canvas-wrapper'>
          <SlicerImageTimeRuler duration={volumeArray.duration} />
          <div className='slicer-canvas-inner-wrapper'>
            <SlicerImage details={CANVAS_DETAILS} volumeArray={volumeArray} />
            <SlicerSelector details={CANVAS_DETAILS} length={volumeArray.volume.length} currentSection={currentSection} updateCurrentSection={handleUpdateCurrentSection} />
            <SlicerSectionRecorder sections={sections} select={selectSection} />
          </div>
        </div>
      </>
    );
  }

  function renderControls(): JSX.Element | null {
    return (isWorking === true || volumeArray == null) ? null :
    <SlicerControls
      audioFile={props.originalFile.audioFile}
      currentSection={currentSection}
      isRemoveButtonEnabled={isRemoveButtonEnabled}
      handleClickAdd={addCurrentSelection}
      handleClickRemove={removeCurrentSelection}
      isFinishButtonEnabled={sections.length > 0}
      handleClickFinish={finishSelecting}
    />
  }

  function renderAutomaticSlicer(): JSX.Element | null {
    return (isWorking === true || volumeArray == null) ? null :
    <AutomaticSlicer volumeArray={volumeArray} setSections={setSections} />
  }

  return (
    <div className='slicer-wrapper'>
      {renderBody()}
      {renderControls()}
      {renderAutomaticSlicer()}
    </div>
  );
}

export default Slicer;