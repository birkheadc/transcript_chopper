import * as React from 'react';
import './Slicer.css'
import AudioWithTranscript from '../../../../../types/audioWithTranscript/audioWithTranscript';
import SlicerImage from './slicerImage/SlicerImage';
import SlicerSelector from './slicerSelector/SlicerSelector';
import Range from '../../../../../types/range/range';
import SlicerSectionRecorder from './slicerSectionRecorder/SlicerSectionRecorder';
import AutomaticSlicer from './automaticSlicer/AutomaticSlicer';
import PlayAudioButton from '../playAudioButton/PlayAudioButton';
import createVolumeArray from '../../../../../shared/createVolumeArray/createVolumeArray';

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

  const CHUNK_SIZE = 100;

  const [volumeArray, setVolumeArray] = React.useState<number[]>([]);
  const [isWorking, setWorking] = React.useState<boolean>(false);
  const [sections, setSections] = React.useState<Range[]>([]);
  const [currentSection, setCurrentSection] = React.useState<Range | undefined>(undefined);
  const [isCurrentAdded, setCurrentAdded] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async function caluculateAndSetVolumeArray() {
      if (props.originalFile.audioFile == null) return;
      setWorking(true);
      
      const array: number[] = await createVolumeArray(props.originalFile.audioFile, CHUNK_SIZE);
      setVolumeArray(array);

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
    console.log('Removing current section...');
    console.log('Current section: ', currentSection);
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
            <SlicerImage volumeArray={volumeArray} chunkSize={CHUNK_SIZE} />
            <SlicerSelector currentSection={currentSection} updateCurrentSection={handleUpdateCurrentSection} />
            <SlicerSectionRecorder canvasWidth={calculateCanvasWidth()} sections={sections} select={selectSection} />
          </>
        }
      </div>
      
      <p>Highlight a section, then press `Play` to listen to it, or `Add` to create a section.</p>

      <div className='slicer-controls-wrapper'>
        <div>
          {/* <button disabled={currentSection == null} onClick={playCurrentSelection}>Play</button> */}
          <PlayAudioButton autoplay={false} file={props.originalFile.audioFile} range={currentSection} />
          <button disabled={currentSection == null || isCurrentAdded} onClick={addCurrentSelection}>Add</button>
          <button disabled={!isCurrentAdded} onClick={removeCurrentSelection}>Remove</button>
        </div>
        <div>
          <button disabled={sections.length < 1} onClick={finishSelecting}>Finish</button>
        </div>
      </div>
      <AutomaticSlicer originalAudio={props.originalFile.audioFile} setSections={setSections} />
    </div>
  );
}

export default Slicer;