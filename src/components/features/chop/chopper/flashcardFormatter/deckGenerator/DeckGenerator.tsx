import * as React from 'react';
import './DeckGenerator.css'
import Deck from '../../../../../../types/deck/deck';
import generateFinalFile from '../../../../../../shared/generateFinalFile/generateFinalFile';
import { FlashcardFileFormat } from '../../../../../../types/formats/finalFileFormat';

interface DeckGeneratorProps {
  deck: Deck
  format: FlashcardFileFormat
}

/**
* The component that generates the final zip file and renders a link to download it.
* @param {Deck} props.deck The deck to generate.
* @param {FlashcardFileFormat} props.format The format to create the deck in.
* @returns {JSX.Element | null}
*/
function DeckGenerator(props: DeckGeneratorProps): JSX.Element | null {

  const [isWorking, setWorking] = React.useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

  const FILE_NAME = 'audio_flashcard_wizard_files.zip';

  React.useEffect(function generateDownloadUrl() {
    if (props.deck.cards.length < 1) return;
    (async function createDownloadLink() {
      setWorking(true);
      try {
        const blob: Blob | null = await generateFinalFile.generateFilesFromDeck(props.deck, props.format);
        if (blob == null) return;
        setDownloadUrl(URL.createObjectURL(blob));
      } catch {
        console.log('Error creating file.');
      }

      setWorking(false);
    })();
  }, [ props.deck, props.format ]);

  function renderBody(): JSX.Element | null {
    if (isWorking) return <p>Generating download link...</p>
    if (downloadUrl == null) return <p>Error: Could not generate files.</p>;
    return <a download={FILE_NAME} href={downloadUrl}>Download</a>
  }

  return (
    <div className='file-generator-wrapper'>
      {renderBody()}
    </div>
  );
}

export default DeckGenerator;