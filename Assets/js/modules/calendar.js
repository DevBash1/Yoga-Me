let db = require("Assets/js/modules/db.js");
let lessons = require("level");

let lengthOfMonths = {
    "Jan": 31,
    "Feb": 28,
    "Mar": 31,
    "Apr": 30,
    "May": 31,
    "Jun": 30,
    "Jul": 31,
    "Aug": 31,
    "Sep": 30,
    "Oct": 31,
    "Nov": 30,
    "Dec": 31
}

function getDateStart() {
    let d = new Date();
    d.setDate(1);

    let year = d.getFullYear()
    let month = d.getMonth();
    let day = d.getDay();

    let ld = new Date();
    if (month != 1) {
        ld.setMonth(month - 1)
    } else {
        ld.setFullYear(year - 1);
        ld.setMonth(12);
    }
    let lastDate = Object.values(lengthOfMonths)[ld.getMonth()]
    ld.setDate(lastDate);
    let lday = ld.getDay();

    return {
        date: ((ld.getDate() - lday) + 1),
        lastDate
    }
}

function run() {

    let days = document.querySelectorAll("table td");

    let start = getDateStart()["date"];

    let thisMonthEnd = Object.values(lengthOfMonths)[(new Date()).getMonth()];
    let lastMonthEnd = getDateStart()["lastDate"];

    let stops = [lastMonthEnd, thisMonthEnd];

    let d = new Date();
    let today = d.getDate();
    let thisMonth = d.getMonth();
    let thisYear = d.getFullYear();

    let i = 0;

    for (day of days) {
        day.innerHTML = start;
        if (stops.length == 2 || stops.length == 0) {
            day.style.color = "darkslategrey";
        }

        let data = db.query(`SELECT * FROM levels WHERE date = '${start}-${thisMonth}-${thisYear}'`);
        if(db.length != 0 && stops.length == 1){
            if(data.completed[0]){
                day.style.backgroundColor = lessons[data["level"]]["color"];
            }else{
                day.style.backgroundColor = "brown";
                day.style.color = "darkred";
            }
            day.setAttribute("onclick","openLesson("+data.level[0]+")");
        }

        if (stops.length == 1 && start == today) {
            day.style.backgroundColor = "#040312";
            day.style.color = "white";
            if(data.completed[0]){
                day.style.backgroundColor = lessons[data["level"]]["color"];
            }
        }

        if (start == stops[i]) {
            start = 1;
            stops.splice(0, 1);
        } else {
            start++;
        }
    }

}
module.exports = {
    run
}
