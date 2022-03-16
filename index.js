const unzipper = require('unzipper');

const { spawn } = require("child_process");

var prompt = require('prompts');

const fs = require('fs'); 
const path = require('path');

var fps

(async () => {
    const response = await prompt({
      type: 'number',
      name: 'value',
      message: 'What will be the video\'s FPS',
    });
  
    fps = response.value
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

        console.log(files)  
    });
}