Steps to import into Anki:

1. Copy the files in `/audio` directly into Anki's `collection.media` folder.

  - From Anki's docs (https://docs.ankiweb.net/files.html):

    On Windows, the latest Anki versions store your Anki files in your appdata folder.
    You can access it by opening the file manager, and typing %APPDATA%\Anki2 in the location field.
    Older versions of Anki stored your Anki files in a folder called Anki in your Documents folder.

    On Mac computers, recent Anki versions store all their files in the ~/Library/Application Support/Anki2 folder.
    The Library folder is hidden by default, but can be revealed in Finder by holding down the option key while clicking on the Go menu.
    If you're on an older Anki version, your Anki files will be in your Documents/Anki folder.

    On Linux, recent Anki versions store your data in ~/.local/share/Anki2, or $XDG_DATA_HOME/Anki2 if you have set a custom data path.
    Older versions of Anki stored your files in ~/Documents/Anki or ~/Anki.

2. In Anki, go to File -> Import. Select `deck.txt`.

  - All of the default options should be fine as is, but you may wish to modify them to suit your study methods.
    `deck.txt` puts the text of the card in field 1, and the link to the audio file in field 2. Keep this in mind when choosing where to map which field.

3. After importing, you can safely delete this folder; Anki will keep its own copies of the contents.