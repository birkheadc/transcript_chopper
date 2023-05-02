# Transcript Chopper
An application that assists the user in breaking down an audio file and its accompanying transcript into smaller pairs, especially for use in creating SRS cards for language learning.

This project is open to help in the form of issues, comments or pull requests.

## Development and Deployment
The application is configured to be deployable to a subdirectory (i.e. `www.example.com/this-app`). It took some time to figure out how to do this, but the end result is simple.

I deploy with Docker, using the Dockerfile in the root directory. The Dockerfile creates a single environment variable `PUBLIC_PATH`; this defines the subdirectory on the server that the application will be hosted on. If deploying to the root directory, the variable can be omitted; it defaults to `/`.

In the developer environment, I simply omit the variable, which causes everything to be run in the root directory (i.e. `localhost:3000`).

`PUBLIC_PATH` is only used in two places by the application.
  - `webpack.config.js` uses it to define the `output.publicPath`, so that the bundled application knows where to find its assets.
  - `src/app/App.tsx` uses it to set the `basename` of the main `<BrowserRouter>`, so that the application knows how to parse the url and navigate.

In both cases, the variable is searched for with `const PUBLIC_PATH = process.env.PUBLIC_PATH || '/'`, defaulting to `/` if no environment variable is set.

When deploying, make sure to configure the subdirectory on the server to be the same as `PUBLIC_PATH`. If using nginx as a reverse-proxy as I do, this can be done with something like this:

```
http {
  server {
    listen 80;
    location /PUBLIC_PATH/ {
      proxy_pass http://DOCKER_SERVICE_NAME:80/;
    }
  }
}
```

Note: the leading and trailing slashes on `location` and the trailing slash on `proxy_pass` are necessary for the proxy to work correctly.

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

At the moment, exporting as an anki deck (`.apkg`) file is not implemented. Instead, choosing Anki Deck as the format option will create a `deck.txt` file which is in a semicolon-separated-value format, and a folder with the audio snippets. The user can add the cards to their deck by going to File -> Import in Anki and selecting the `deck.txt`, then moving the audio files into Anki's `collection.media` folder.

I am open to any help in directly creating an Anki `.apkg` file with the data, if anyone with more knowledge in Anki's code base is interested.