import * as React from 'react';
import './ClozeTextbox.css'
import Range from '../../../../../../../types/range/range';
import PlayAudioButton from '../../../playAudioButton/PlayAudioButton';

interface ClozeTextboxProps {
  audioFile: File | undefined,
  range: Range,
  updateStub: (newValue: string) => void,
  value: string,
  reset: () => void
}

/**
*
* @returns {JSX.Element | null}
*/
function ClozeTextbox(props: ClozeTextboxProps): JSX.Element | null {

  const handleCloze = () => {
    const textarea = document.querySelector('textarea#stub-textarea') as HTMLTextAreaElement;
    if (textarea == null) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    let i = 1;
    while (textarea.value.includes('{{c' + i.toString() + '::')) {
      i++;
    }
    let cloze = '{{c' + i.toString() + '::' + textarea.value.substring(start, end) + '}}';

    const newValue = before + cloze + after;
    props.updateStub(newValue);
  }

  const handleReset = () => {
    props.reset();
  }

  const handleUpdateStub = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.updateStub(event.currentTarget.value);
  }

  return (
    <div className='joiner-input-wrapper'>
        <div>
          <PlayAudioButton autoplay={false} file={props.audioFile} range={props.range} />
          <button onClick={handleCloze}>Cloze</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <div className='inline-label-input-wrapper'>
          <label htmlFor='stub-textarea'>Text</label>
          <textarea id='stub-textarea' onChange={handleUpdateStub} value={props.value}></textarea>
        </div>
      </div>
  );
}

export default ClozeTextbox;