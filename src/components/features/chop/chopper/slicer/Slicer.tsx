import * as React from 'react';
import './Slicer.css'
import AudioWithTranscript from '../../../../../types/audioWithTranscript/audioWithTranscript';
import SlicerImage from './slicerImage/SlicerImage';
import SlicerSectionRecorder from './slicerSectionRecorder/SlicerSectionRecorder';
import AutomaticSlicer from './automaticSlicer/AutomaticSlicer';
import PlayAudioButton from '../playAudioButton/PlayAudioButton';
import createVolumeArray from '../../../../../shared/createVolumeArray/createVolumeArray';
import { VolumeArray } from '../../../../../types/volumeArray/volumeArray';
import Range from '../../../../../types/range/range';
import SlicerSelector from './slicerSelector/SlicerSelector';
import SlicerImageTimeRuler from './slicerImageTimeRuler/SlicerImageTimeRuler';

interface SlicerProps {
  originalFile: AudioWithTranscript,
  handleUpdateSections: (sections: Range[]) => void,
  handleContinue: () => void
}

/**
* The component that the user interacts with to select where and how to break up the audio file.
* @param {AudioWithTranscript} props.originalFile The audio file and transcript that is to be chopped.
* @param {(sections: Range[]) => void} props.handleUpdateSections The function to call when done selecting, just before continuing.
* @param {() => void} props.handleContinue The function to call when finished.
* @returns {JSX.Element | null}
*/
function Slicer(props: SlicerProps): JSX.Element | null {

  const [volumeArray, setVolumeArray] = React.useState<VolumeArray>({ volume: [], max: 0, min: 0, chunkSize: 1, duration: 0});
  const [isWorking, setWorking] = React.useState<boolean>(false);
  const [sections, setSections] = React.useState<Range[]>([]);
  const [currentSection, setCurrentSection] = React.useState<Range | undefined>(undefined);
  const [isCurrentAdded, setCurrentAdded] = React.useState<boolean>(false);

  React.useEffect(function addKeyboardListener() {
    const listener = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'a':
          addCurrentSelection();
          break;
        case 'r':
          removeCurrentSelection();
          break;
        case 'f':
          finishSelecting();
          break;
        default:
          break;
      }
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
      
      const volume: VolumeArray = await createVolumeArray(props.originalFile.audioFile);
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
    setCurrentAdded(false);
  }

  const finishSelecting = () => {
    if (sections.length < 1) return;
    props.handleUpdateSections(sections);
    props.handleContinue();
  }

  const handleUpdateCurrentSection = (section: Range | undefined) => {
    setCurrentSection(section);
    setCurrentAdded(false);
  }

  const selectSection = (index: number) => {
    setCurrentSection({...sections[index]});
    setCurrentAdded(true);
  }

  function calculateCanvasWidth(): number {
    const canvas = document.querySelector('canvas#slicer-selector-canvas') as HTMLCanvasElement;
    if (canvas == null) return 0;
    return canvas.getBoundingClientRect().width;
  }

  return (
    <div className='slicer-wrapper'>
      <h2>Choose which slices of the audio you would like to use.</h2>
      <div className='slicer-canvas-wrapper'>
        
        { isWorking ? <p>Generating audio image...</p> : 
          <>
            <SlicerImageTimeRuler duration={volumeArray.duration} />
            <div className='slicer-canvas-inner-wrapper'>
              <SlicerImage volumeArray={volumeArray} />
              <SlicerSelector currentSection={currentSection} updateCurrentSection={handleUpdateCurrentSection} />
              <SlicerSectionRecorder canvasWidth={calculateCanvasWidth()} sections={sections} select={selectSection} />
            </div>
          </>
        }
      </div>
      
      <p>Highlight a section, then press `Play` to listen to it, or `Add` to create a section.</p>

      <div className='slicer-controls-wrapper'>
        <div>
          {/* <button disabled={currentSection == null} onClick={playCurrentSelection}>Play</button> */}
          <PlayAudioButton autoplay={false} file={props.originalFile.audioFile} hotkey={true} range={currentSection} />
          <button disabled={currentSection == null || isCurrentAdded} onClick={addCurrentSelection}>Add (A)</button>
          <button disabled={!isCurrentAdded} onClick={removeCurrentSelection}>Remove (R)</button>
        </div>
        <div>
          <button disabled={sections.length < 1} onClick={finishSelecting}>Finish (F)</button>
        </div>
      </div>
      <AutomaticSlicer volumeArray={volumeArray} setSections={setSections} />
    </div>
  );
}

export default Slicer;