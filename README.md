# scratchvideo
Export MP4 files to scratch (SB3) projects 'cuz why not?

## Status

Scratchvideo is a WIP and thus not finished. If you want to keep track of its development you can check out progress on [video](https://github.com/IvanikuV2/scratchvideo/issues/1) and [audio](https://github.com/IvanikuV2/scratchvideo/issues/2) support.

## Installation

Scratchvideo will have a proper binary release when it's finished, but for now you have to run it with [Node.js](https://nodejs.org)

### Running with Node.js

[Download a zip of the master branch](https://github.com/IvanikuV2/scratchvideo/archive/refs/heads/master.zip) and extract it into whatever folder you prefer, once Node.js is installed. Open said folder in a terminal window (PowerShell, Gnome Terminal, etc).

Now you'll need to install the dependencies with npm (Don't worry, they won't touch your system), just run the following command:
```bash
npm install
```

That's all! Now you're ready to run scratchvideo. If the dependency install process failed, feel free to [open an issue](https://github.com/IvanikuV2/scratchvideo/issues). To run scratchvideo, just run the following command:
```bash
node index.js
```

## Usage

All you have to do is to is to put your video in `work/projects/video.mp4` and, optionally, a project to put the video on in `work/projects/project.sb3` (this is just a placeholder. Soon, this will be done through CLI arguments/prompts)

## Contributing
All types of pull requests are welcome. From code improvements or refactors, and minor changes.

Please make sure to update the readme.md file as well if your PR includes a new feature.

## License
[MIT](https://choosealicense.com/licenses/mit/) (Just like in Scratch!)
