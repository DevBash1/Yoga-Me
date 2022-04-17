// Handles Text to Speech

let db = require("db");
let voices = require("voices");

let speak = new SpeechSynthesisUtterance();
let speech;
let last = null;

if ('speechSynthesis'in window) {
    // Speech Synthesis supported
    speech = window.speechSynthesis;
}

function say(word) {
    word = parseText(word)
    type(word)
    voice(word)
}

function talk(word) {
    word = parseText(word)
    if ('speechSynthesis' in window) {
        // Speech Synthesis supported
        speak.volume = 1;
        // From 0 to 1
        speak.rate = 0.6;
        // From 0.1 to 10
        speak.pitch = 1.1;
        // From 0 to 2
        speak.lang = 'en-US';

        speak.text = word;
        speech.speak(speak);
    }
}

let waiting = [];
let player = new Audio();

function voice(word) {
    if (true) {
        if (!player.paused) {
            if (voices.getVoice(word)) {
                waiting.push(word);
            }
        } else {
            if (voices.getVoice(word)) {
                player.src = voices.getVoice(word);
                player.play();
            }else{
                talk(word);
            }
            player.onended = function() {
                if (waiting.length != 0) {
                    let next = waiting[0];
                    waiting.splice(0, 1);
                    voice(next);
                }
            }
            player.onerror = function(){
                talk(word);
                player.pause();
            }
        }
    }
}

function parseText(text) {
    let name = db.query("SELECT name FROM user").name[0];
    let fname = name.split(" ")[0];
    let lname = name.split(" ")[1] || name.split(" ")[0];
    return text.replaceAll("{name}", name).replaceAll("{fname}", fname).replaceAll("{lname}", lname);
}

function loadVoice() {
    if ('speechSynthesis'in window) {// Speech Synthesis supported
    } else {
        return false;
    }

    speak = new SpeechSynthesisUtterance();
    // speak.voice = speechSynthesis.getVoices()[10];
    speak.volume = 0;
    // From 0 to 1
    speak.rate = 0.6;
    // From 0.1 to 10
    speak.pitch = 1.1;
    // From 0 to 2
    speak.lang = 'en-US';

    let speech = window.speechSynthesis;
    speak.text = "";
    speech.speak(speak);
}

function canSpeak() {
    if ('speechSynthesis'in window) {
        // Speech Synthesis supported
        return true;
    } else {
        // Speech Synthesis Not Supported
        return false;
    }
}

let words = []
let writing = false
let index = 0;
let length = 0;

function type(word) {
    word = parseText(word)
    words.push(word);
    if (!writing) {
        typing()
    }
}

function typing() {
    let elem = _("#word").this();

    if (!writing) {
        elem.innerHTML = "";
        elem.style.display = "block";
    }

    if (words.length != 0) {
        writing = true;
        let typer = setInterval(function() {
            if (words.length != 0) {
                if (words[0].length != length) {
                    elem.style.display = "block";
                    elem.innerHTML += words[0].charAt(length);
                    length++;
                    if (elem.innerText.length > 120) {
                        elem.innerHTML = elem.innerHTML.substring(1);
                    }
                } else {
                    words.splice(0, 1);
                    length = 0;
                    if (words.length == 0) {
                        setTimeout(function() {
                            clear()
                        }, 5000)
                        let repeat = setInterval(function() {
                            if (elem.innerText.length == 0) {
                                elem.style.display = "none";
                                elem.innerText = "";
                                clearInterval(repeat);
                            }
                        }, 1000)
                    } else {
                        elem.innerText = "";
                    }
                }
            } else {
                clearInterval(typer);
                writing = false;
            }
        }, 100)
    }
}

function clear() {
    let elem = _("#word").this();
    let cleaner = setInterval(function() {
        if (elem.innerText.length != 0) {
            if (words.length == 0 && !writing) {
                elem.innerText = elem.innerText.substring(0, elem.innerText.length - 1);
            } else {
                clearInterval(cleaner)
            }
        } else {
            clearInterval(cleaner)
        }
    }, 50)
}

function sayAll(array) {
    array.forEach(function(item) {
        say(item);
    })
}

function typeAll(array) {
    array.forEach(function(item) {
        type(item);
    })
}

function stop() {
    try {
        responsiveVoice.cancel();
    } catch (e) {}
    speech.cancel();
    words = []
    length = 0;
    writing = false;
    clear()
    let elem = _("#word").this();
    elem.style.display = "none";
}

module.exports = {
    say,
    canSpeak,
    speech,
    talk,
    type,
    loadVoice,
    typeAll,
    sayAll,
    stop
}
