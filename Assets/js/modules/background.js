// Background Video Changer for Signup Page 

let d = require("Assets/dist/download.js");
let _ = require("Assets/dist/elect.js");

let videos = ["web2x-challenging_03.mp4", "web2x-informative_01.mp4", "web2x-motivating_01.mp4", "web2x-nontraditional_01.mp4", "web2x-traditional_02.mp4"];
let downloaded = [];
let index = 0;
let path = "Assets/videos/";

function run() {
    download(path + videos[index])
}

function download(url) {
    let d = new DownloadJS(url);

    // onFinish is called when download has finished
    d.onFinish = function() {
        downloaded.push(d.getFileLink());
        if(index != 4){
            index++;
            run();
        }
    }
    d.start();
}

function updateVideo() {
    if(downloaded.length != 0){
        let link = pickOne(downloaded)
        _("video").at(1).attr("src").set(link)
    }
}

function pickOne(array) {
    return array[Math.floor(Math.random() * (array.length-1))]
}

setInterval(updateVideo,10000)

module.exports = {
    run
}
