import * as React from 'react';
import './Slicer.css'
import AudioWithTranscript from '../../../../../types/audioWithTranscript/audioWithTranscript';
import SlicerImage from './slicerImage/SlicerImage';
import SlicerSelector from './slicerSelector/SlicerSelector';
import Range from '../../../../../types/range/range';
import playAudio from '../../../../../shared/playAudio/playAudio';
import SlicerSectionRecorder from './slicerSectionRecorder/SlicerSectionRecorder';

interface SlicerProps {
  originalFile: AudioWithTranscript,
  handleContinue: () => void
}

/**
* The component that the user interacts with to select where and how to break up the audio file.
* @param {AudioWithTranscript} props.originalFile The audio file and transcript that is to be chopped.
* @param {() => void} props.handleContinue The function to call when finished.
* @returns {JSX.Element | null}
*/
function Slicer(props: SlicerProps): JSX.Element | null {

  const [sections, setSections] = React.useState<Range[]>([]);
  const [currentSection, setCurrentSection] = React.useState<Range | undefined>(undefined);
  const [isCurrentAdded, setCurrentAdded] = React.useState<boolean>(false);

  const playCurrentSelection = () => {
    playAudio(props.originalFile.audioFile, currentSection);
  }

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
      <div className='slicer-canvas-wrapper'>
        <SlicerImage audioFile={props.originalFile.audioFile} />
        <SlicerSelector currentSection={currentSection} updateCurrentSection={handleUpdateCurrentSection} />
        <SlicerSectionRecorder canvasWidth={calculateCanvasWidth()} sections={sections} select={selectSection} />
      </div>
      
      <p>Highlight a section, then press `Play` to listen to it, or `Add` to create a section.</p>

      <div className='slicer-controls-wrapper'>
        <div>
          <button disabled={currentSection == null} onClick={playCurrentSelection}>Play</button>
          <button disabled={currentSection == null || isCurrentAdded} onClick={addCurrentSelection}>Add</button>
          <button disabled={!isCurrentAdded} onClick={removeCurrentSelection}>Remove</button>
        </div>
        <div>
          <button disabled={sections.length < 1} onClick={finishSelecting}>Finish</button>
        </div>
      </div>
    </div>
  );
}

export default Slicer;