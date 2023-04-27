# Transcript Chopper
An application that assists the user in breaking down an audio file and its accompanying transcript into smaller pairs, especially for use in creating SRS cards for language learning.

## The Code
The application is entirely React/TypeScript and runs in the user's browser.

The `Chopper` component is the main component that the user interacts with to generate their files. It is broken down into many sub-components that handle each step of the process:

  - `FileSelector`
  - `Slicer`
  - `Joiner`
  - `Finalizer`

I am not very good at naming things.

### FileSelector
The `FileSelector` simply prompts the user to supply an audio file and a transcript.

The transcript is not strictly necessary, though the subsequent sub-components will use the transcript as the default values in their text fields, making editing a bit easier.

The audio file is necessary, no editing can be done without it.

### Slicer
The `Slicer` component aids the user in splitting the audio file into smaller subsections. There is also an automatic mode for splitting based on white space in the track.

### Joiner
The `Joiner` prompts the user to match the audio sections they made in the `Slicer` component with their respective transcripts.

If the user supplied a transcript in the `FileSelector`, they can simply highlight the relevant section and press Trim to select it.

### Finalizer
The `Finalizer` lets the user select how they want their files, what format to provide them and how to name them.

It also optionally lets the user open a `ClozeEditor` to create Anki cards with Clozed (fill-in-the-blank) fields.