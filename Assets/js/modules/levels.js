// Handles the Yoga Levels

let db = require("db");
let levels = require("level");
let lesson = require("lessons");
let _ = require("elect");

function setLevel() {
    // Create Levels Based On User Details
    let females = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let males = [1, 2, 3, 4, 6, 7, 8, 9, 10];

    db.query("SELECT * FROM levels");

    if (!db.error && db.length != 0) {
        // Levels have been created
        // Get Level for today

        let d = new Date();
        let date = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;

        db.query(`SELECT id,level,completed FROM levels WHERE date = '${date}'`);
        let doneToday = db.result.completed[0];
        if (db.length != 0) {
            // Level Already Created for Today
            // Retrieve Level
            let level = levels[db.result.level[0]];

            db.query("SELECT * FROM levels WHERE completed = true");
            let stage = (db.length + 1);
            if(doneToday){
                stage = (stage-1);
            }

            db.query("SELECT * FROM levels");
            let day = db.length;

            createInfo(day, stage, level)
        } else {
            // Create Level
            let id = 1;

            db.query("SELECT * FROM levels WHERE ORDER BY id DESC LIMIT 1");
            if (db.length != 0 && !db.result.completed[0]) {
                id = db.result.level[0];

                db.query("SELECT * FROM levels");
                let day = db.length;

                // Add Last unfinished Lesson for Today
                db.query(`INSERT INTO levels VALUES('${id}','${date}','false')`)

                db.query("SELECT * FROM levels WHERE completed = true");
                let stage = (db.length + 1);

                let level = levels[id];
                createInfo(day, stage, level);
            } else {
                db.query("SELECT * FROM levels WHERE completed = true");
                id = (db.length + 1);
                let stage = id;
                if (id > 9) {
                    id = 1;
                }

                let gender = db.query("SELECT gender FROM user");
                if (gender == "male") {
                    id = males[id];
                } else {
                    id = females[id];
                }

                db.query(`INSERT INTO levels VALUES('${id}','${date}','false')`);

                db.query("SELECT * FROM levels");
                let day = db.length;

                let level = levels[id];
                createInfo(day, stage, level);
            }
        }
    } else {
        // First Level
        let d = new Date();
        let date = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;

        db.query(`INSERT INTO levels VALUES('1','${date}','false')`);

        let level = levels["1"];
        createInfo(1, 1, level);
    }

    // Refress Lesson Menu
    lesson.setLessons();
}

function createInfo(day, level, obj) {
    let difficulty = obj["difficulty"];
    let info = obj["info"];
    let parts = obj["parts"];
    let lesson = db.query("SELECT * FROM levels ORDER BY id DESC LIMIT 1").level[0];

    createGraph(parts);

    _("#lesson_stats").html(`<p>Difficulty<span>${difficulty}</span></p><p>Day<span>${day}</span></p>`);
    _("#lesson_text").html(info);
    _("#medal span").html(level);
    _("#lesson_info").attr("onclick").set(`openLesson(${lesson})`);

    _("#user_infos p").at(1).html("Level " + level);
    _("#user_infos p").at(2).html("Day " + day);
}

function createGraph(parts) {
    // Create The Body Part Image Graph
    _(".body_part").hide();

    for (part of parts) {
        try {
            _("#body_" + part).show();
        } catch (e) {}
    }
}

module.exports = {
    setLevel,
    createGraph
}
