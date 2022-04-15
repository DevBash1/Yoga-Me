// Handles all the lesson videos

let _ = require("elect");
let lessons = Object.values(require("level"));
let db = require("db");
let speak = require("speak");
let calendar = require("calendar");

let songs = ["1.mp3", "2.mp3"];
let downloaded = [];
let index = 0;
let path = "/Assets/songs/";

function run() {
    download(path + songs[index])
}

function download(url) {
    let d = new DownloadJS(url);

    // onFinish is called when download has finished
    d.onFinish = function() {
        if (d.getFileLink()) {
            downloaded.push(d.getFileLink());
        }
        if (index != 2) {
            index++;
            run();
        }
    }
    d.start();
}

// Pre Download songs
run();

function setLessons() {
    // Setup Lessons
    let menuTab = _("#menuTab").this();
    menuTab.innerHTML = "";
    let i = 1;
    let unlocked = db.query("SELECT id,level FROM levels ORDER BY id DESC").level;
    let badvideos = [3, 5, 10];
    for (lesson of lessons) {
        let icon = unlocked.includes(i) ? "/Assets/icons/icon.png" : "/Assets/icons/lock.png";
        let video = badvideos.includes(i) ? "/Assets/videos/lessons/1.mp4" : `/Assets/videos/lessons/${i}.mp4`;
        let play = unlocked.includes(i) ? `openLesson(${i})` : "lessonLocked()";
        let template = `<div id="lesson" style="background:${lesson["color"]}" onclick="${play}">
                            <video src="${video}" control="false"></video>
                            <h1>${lesson["name"]}</h1>
                            <span>${lesson["time"]}</span>
                            <div>${lesson["type"]}</div>
                            <img src="${icon}" style="background:${lesson["color"]}">
                        </div>`
        menuTab.innerHTML += template;
        i++;
    }
}

let loop;
let time = 0;
let lesson = 1;

let player = _("#player").this()
let song = new Audio()

function openLesson(id) {
    let lyrics = require("lyrics");
    let lessonLyric = lyrics[id];
    time = 0;
    lesson = id;

    _("#player").attr("src").set("/Assets/videos/lessons/" + id + ".mp4");

    _("#player").on("click", function() {})

    if (!lessonLyric) {
        return
    }

    loop = setInterval(function() {
        time++;
        _("#time").html(time);

        if (lessonLyric[time]) {
            // console.log(time)
            let obj = lessonLyric[time];
            if (obj["type"] == "text") {
                speak.say(obj["text"])
                _("#time").attr("style").set("background:#10ad7e;");
            } else if (obj["type"] == "action") {
                _("#time").attr("style").set("background:yellow;");
                try {
                    eval(obj["action"])
                } catch (e) {}
            }
        } else {
            _("#time").attr("style").set("background:white;");
        }
    }, 1000)
}

function endLesson() {
    stopLesson();

    let d = new Date();
    let date = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;

    let result = db.query(`SELECT * FROM levels WHERE date = '${date}'`);
    if (db.length != 0) {
        if (!result.completed[0] && result.level[0] == lesson) {
            modal("Congrats", "You have completed today's lesson 🥳🥳🥳.\nSee you tomorrow {fname}.", function() {
                goBack();
            });
            db.query(`UPDATE levels SET completed = 'true' WHERE id = '${result.id[0]}'`);
            console.log(db.result);
        } else {
            modal("Congrats", "You did it again {fname}, nice job!", function() {
                goBack();
            });
        }
    } else {
        modal("Congrats", "You did it again {fname}, nice job!", function() {
            goBack();
        });
    }

    // Update Lessons Level Info
    setLessons();
    // Update calendar
    calendar.run();
}

function play() {
    player.play();
}

function pause() {
    player.pause();
}

function goto(second) {
    player.currentTime = second;
}

function stopLesson() {
    clearInterval(loop);
    time = 0;
    stopSong();
    volume(1);
    speak.stop();
}

function playSong(id) {
    song.loop = true;
    song.src = downloaded[id];
    song.play();
}

function stopSong() {
    song.pause();
}

function volume(number) {
    song.volume = number;
}

module.exports = {
    setLessons,
    openLesson,
    stopLesson
}
