// Dependencies
const unzipper = require('unzipper');
const spawn = require("child_process");
const yargs = require('yargs');
const fs = require('fs'); 
const path = require('path');
const prompt = require('prompts');

// Variable declaring
var fps = 30
var debug = false

// Declare CLI arguments
const argv = yargs
  .command('--no-prompts', 'Completely disables command line prompts and falls back to default values or command line arguments', {
    noprompts: {
      description: 'the year to check for',
      alias: '-y',
      type: 'number'
    }
  })
  .option('time', {
    alias: 't',
    description: 'Tell the present Time',
    type: 'boolean'
  })
  .help()
  .alias('help', 'h').argv;

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}


// This code block handles command line arguments and prompts
(async () => {
    switch (myArgs[0]) {
        case 'insult':
          console.log(myArgs[1], 'smells quite badly.');
          break;
        default:
          console.log('Sorry, that is not something I know how to do.');
    }
    let fpsprompt = await prompt({
      type: 'number',
      name: 'value',
      message: 'What will be the video\'s FPS',
    });

    fps = fpsprompt.value

    let debugprompt = await prompt({
        type: 'text',
        name: 'value',
        message: 'Do you want to enable optional debugging fetures? (y/N)',
    });

    if(debugprompt.value == "y"){
        debug = true
        console.log('\x1b[33m%s\x1b[0m', "\nWARNING: Debug mode has been enabled, performance may seem affected on lower end devices.")
        await sleep(4000);
    }

    unpack()
})();

function unpack(){
    console.log("Cleaning up...")

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