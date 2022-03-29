#!/usr/bin/env node

// Dependencies
const unzipper = require('unzipper');
const fs = require('fs'); 
const path = require('path');
const prompt = require('prompts');
const yargs = require('yargs');
const { spawn } = require("child_process");
const { hideBin } = require('yargs/helpers')

// Declare CLI arguments
const arguments = yargs(hideBin(process.argv))
    .option('noprompts', {
        alias: 'y',
        type: 'boolean',
        description: 'Options will automatically be set to defaults if not provided through args'
    })
    .option('debug', {
        alias: 'd',
        type: 'boolean',
        description: 'Run in debug mode'
    })
    .command('framerate [fps]', 'Set a defined framerate (fps)', (yargs) => {
        return yargs
          .positional('fps', {
            describe: 'Number of frames per second',
            default: null
          })
    })
    .parse()

// Variable declaring
var fps = arguments.framerate
var debug = arguments.d

console.log(arguments.framerate)

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}


// This code block handles command line arguments and prompts
if(!arguments.noprompts) (async () => {
    if (fps == null){
        let fpsprompt = await prompt({
            type: 'number',
            name: 'value',
            message: 'What will be the video\'s FPS',
        });

        fps = fpsprompt.value
    }

    console.log(`Your video will be exported at ${fps} frames per second`)

    unpack()
})(); else unpack()

function unpack(){
    if(debug == true) console.log('\x1b[33m%s\x1b[0m', "\nWARNING: Debug mode has been enabled, performance may seem affected on lower end devices.")
    console.log("\nCleaning up...")

    // this chunk of code cleans up the /tmp directory for future use :P
    const directory = 'work/tmp/extractedProject';

    fs.readdir(directory, (err, files) => {
        if (err) throw err;
    
        for (const file of files) {
        fs.unlinkSync(path.join(directory, file), err => {
            if (err) throw err;
        });
        }
    });

    console.log("Unpacking SB3...")

    // unzip sb3 file

    fs.createReadStream('work/projects/project.sb3')
        .pipe(unzipper.Extract({ path: 'work/tmp/extractedProject/' }))
        .on('close', function () {
            console.log("\nFinished unpacking!\n")
            extractframes()
        });
}

function extractframes(){
    console.log("\nParsing main Project file, this may take long depending on your computer specs and project size...\n")
    let object1 = JSON.parse(fs.readFileSync("work/tmp/extractedProject/project.json"));
    console.log("Parsing finished!")

    console.log("\nExtracting video frames... (will take a long time!)")

    fs.rmSync("work/tmp/frames", { recursive: true, force: true });
    fs.mkdirSync("work/tmp/frames/")

    const extractframe = spawn("ffmpeg", ["-i \"work/projects/video.mp4\"", `-r ${fps} \"work/tmp/frames/frame-%04d.png\"`], { shell: true })

    if(debug == true){
        extractframe.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
          
        extractframe.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    }

    extractframe.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    
    extractframe.on("close", code => {
        console.log(`child process exited with code ${code}`);
        console.log("\nVideo frames successfully extracted!")
        parseimages()
    });
}

function parseimages(){
    console.log("Parsing images for json prep")
    const directoryPath = path.join(__dirname, 'work/tmp/frames');
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to list image files: ' + err);
        } 
        //listing all files using forEach
        let images = (fs.readdirSync(directoryPath))

        if(debug == true) console.log(files) 
    });
}