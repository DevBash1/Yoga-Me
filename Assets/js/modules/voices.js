let DownloadJS = require("download");
let lyrics = require("lyrics");
let storage = require("store")

let store = {};

if(storage.has("voices")){
    store = JSON.parse(storage.get("voices"));
}

function wordToUrl(word) {
    return `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${encodeURIComponent(word)}&lang=en-GB&engine=g1&name=&pitch=0.5&rate=0.5&volume=1&key=5fF9jjsQ&gender=female`
}

function downloadVoice(url) {
    let d = new DownloadJS(url);
    d.useProxy()
    // onFinish is called when download has finished
    d.onFinish = function() {
        if (d.getFileLink()) {
            store[url] = d.getFileLink();
            storage.set("voices",JSON.stringify(store));
        }
    }
    d.start();
}

function parseText(text) {
    let name = db.query("SELECT name FROM user").name[0];
    let fname = name.split(" ")[0];
    let lname = name.split(" ")[1] || name.split(" ")[0];
    return text.replaceAll("{name}", name).replaceAll("{fname}", fname).replaceAll("{lname}", lname);
}

function downloadLyrics() {
    storage.set("voices","{}");
    downloadVoice(wordToUrl(parseText("Today's Exercise will improve the green area of your body as shown in the diagram.")));
    Object.keys(lyrics).forEach(function(lesson){
        let voices = lyrics[lesson];
        Object.keys(lyrics[lesson]).forEach(function(i){
            let obj = voices[i];
            if(obj.type == "text"){
                downloadVoice(wordToUrl(parseText(obj.text)));
            }
        })
    })
}

function getVoice(text) {
    let url = wordToUrl(parseText(text));
    return store[url];
}


module.exports = {
    downloadLyrics,
    getVoice,
}