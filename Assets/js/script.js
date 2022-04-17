/************************************\
*    YOGA ME - A YOGA GUIDING APP    *
*                                    *
*            By Dev Bash             *
\************************************/

// Import Our DataBase
const db = require("db");

const lessons = require("lessons");
const voices = require("voices");

// Load Video Lessons
lessons.setLessons()

// Predownload Lesson Songs
lessons.run()

// Set Up Level
require("levels").setLevel()

// Set Up Calendar
require("calendar").run()

// Page History
backs = [0];

// Page Navigation

function gotoPage(index) {
    // Update Browser Back History
    history.pushState({}, '');

    _(".page").hide()
    try {
        slideRight(index)
        _(".page").at(index + 1).show()
        backs.push(index);
    } catch {}
}

function slideRight(index) {
    let x = window.matchMedia("(min-width: 1024px)")
    if (!x.matches) {
        anime({
            targets: '#page' + index,
            duration: 500,
            delay: 0,
            translateX: [360, 0],
            loop: false,
            easing: 'linear',
            direction: 'alternate',
        });
    }
}

function slideLeft(index) {
    let x = window.matchMedia("(min-width: 1024px)")
    if (!x.matches) {
        anime({
            targets: '#page' + index,
            duration: 500,
            delay: 0,
            translateX: [-360, 0],
            loop: false,
            easing: 'linear',
            direction: 'alternate',
        });
    }
}

// Go to previous page

function goBack() {
    if (backs.length == 1) {
        // Update Browser Back History
        history.pushState({}, '');
        return
    }

    backs.pop();
    index = backs[backs.length - 1];
    _(".page").hide()
    try {
        slideLeft(index)
        _(".page").at(index + 1).show()
    } catch {}

    // Update Browser Back History
    history.pushState({}, '');
}

// Handle Browser Back Button

window.onpopstate = function(e) {
    // Check if current page is the Signup page
    if (_(".page").at(2).this().style.display == "block") {
        if (swiper.activeIndex != 0) {
            swiper.slidePrev();
            // Update Browser Back History
            history.pushState({}, '');
            return;
        }
    } else if (_(".page").at(4).this().style.display == "block") {
        // Check if current page is lesson page
        // Stop lesson
        lessons.stopLesson();
    }
    goBack();
}

//Set Date
let date = ((new moment()).format("MMMM, D"));
_("#date").html(date);

_("#start").on("click", function() {
    db.query("SELECT * FROM user")
    if (db.length == 0) {
        spinner.start()
        setTimeout(function() {
            spinner.stop()
            gotoPage(1);
        }, 1000)
    } else {
        start();
    }
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
    }
})

_("#username").on("click", function(e) {
    e.setAttribute("contenteditable", "true");
    e.focus();
    e.innerHTML = "";
})

_("#user_name").on("click", function(e) {
    ask("Alert", "Enter New Name", function(data) {
        if (data) {
            if (data.trim() == "") {
                return;
            }
            // Update Name in DataBase
            db.query(`UPDATE user SET name = '${data}' WHERE id = 1`);

            _("#my_name").html(data.split(" ")[0]);
            e.innerHTML = data;
            greet(data.split(" ")[0]);

            // Redownload Lyrics Voices
            voices.downloadLyrics();
        }
    })
})

_("#user_profile").on("click", function() {
    let file = document.createElement("input");
    file.type = "file";
    file.multiple = "false"
    file.onchange = function() {
        let files = file.files;
        if (files.length == 0) {
            return;
        }
        let reader = new FileReader();
        reader.onloadend = function() {
            // Update profile in DataBase
            db.query(`UPDATE user SET profile = '${db.escape(reader.result)}' WHERE id = 1`)
            _("#user_profile").attr("src").set(reader.result);
            _("#profile_picture").attr("src").set(reader.result);
        }
        reader.readAsDataURL(files[0]);
    }
    file.click();
})

_("#profile").on("click", function() {
    let file = document.createElement("input");
    file.type = "file";
    file.multiple = "false"
    file.onchange = function() {
        let files = file.files;
        if (files.length == 0) {
            return;
        }
        let reader = new FileReader();
        reader.onloadend = function() {
            _("#profile").this().style.background = "white";
            _("#profile").attr("src").set(reader.result);
        }
        reader.readAsDataURL(files[0]);
    }
    file.click();
})

_("#body_diagram").on("click", function() {
    modal("Info", "The Green Area Of The body will be effected by Today's Yoga Exercise", function() {
        try {
            require("speak").say("Today's Exercise will improve the green area of your body as shown in the diagram.");
        } catch (e) {}
    });
})

function openFullscreen() {
    let elem = document.getElementsByTagName("body")[0];

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
}

function modal(title, message, afterClose) {
    let name = db.query("SELECT name FROM user").name[0];
    let fname = name.split(" ")[0];
    let lname = name.split(" ")[1] || name.split(" ")[0];

    new Attention.Alert({
        title: title,
        content: message.replaceAll("{name}", name).replaceAll("{fname}", fname).replaceAll("{lname}", lname),
        afterClose: ()=>{
            try {
                afterClose()
            } catch (e) {}
        }
    });
}

function ask(title, message, afterClose) {
    new Attention.Prompt({
        title: title,
        content: message,
        onSubmit: (c,data)=>{
            try {
                afterClose(data)
            } catch (e) {}
        }
    });
}

// Init Signup Slide

let swiper = new Swiper('.swiper',{
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 0,
    observer: true,
    observeParents: true,
    noSwiping: true,
    noSwipingClass: 'swiper-slide'
});

// Init Quote Slide

let swiper1 = new Swiper('#quotes',{
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 0,
    observer: true,
    observeParents: true,
    rewind: true,
    noSwipingClass: 'swiper-slide',
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    }
});

function nextForm() {
    if (swiper.activeIndex == 0) {
        let username = _("#username").html();
        if (username.trim() == "Enter Name" || username.trim() == "") {
            modal("Alert", "Enter Your Name to Continue")
            return
        }
        swiper.slideNext();
    } else if (swiper.activeIndex == 1) {
        if (_(".gender.selected") == null) {
            modal("Alert", "Select Your Gender To Continue");
            return
        }
        swiper.slideNext();
    } else if (swiper.activeIndex == 2) {
        if (isNaN(_("#count").html()) || _("#count").html().trim() == "") {
            modal("Alert", "Enter Your Age To Continue");
            return
        }
        spinner.start();
        setTimeout(signup, 3000);
    }
}

function signup() {
    let username = _("#username").html();
    let gender = _(".gender.selected").this().dataset.gender;
    let profile = _("#profile").attr("src").get()
    let age = Number(_("#count").html());

    // Stop Spinner
    spinner.stop();

    db.query(`INSERT INTO user VALUES('${username}','${gender}','${db.escape(profile)}','${age}')`)
    if (db.error) {
        modal("Error", "Failed to Create Account");
    } else {
        start();
    }
}

function start() {
    spinner.start();
    let user = db.query("SELECT * FROM user LIMIT 1");

    // Set user info
    _("#profile_picture").attr("src").set(unescape(user.profile[0]))
    _("#my_name").html(user.name[0].split(" ")[0])
    _("#user_name").html(user.name[0])
    _("#user_profile").attr("src").set(unescape(user.profile[0]))

    // Greet User
    greet(user.name[0].split(" ")[0]);

    try {
        voices.downloadLyrics();
    } catch (e) {}

    setTimeout(function() {
        spinner.stop()
        gotoPage(2);

        // update backs
        backs = [2];
    }, 5000)
}

function greet(name) {
    let d = new Date();
    let hour = d.getHours();
    let greeting = "Hello, ";

    if (hour > 1 && hour < 12) {
        greeting = "Good morning, ";
    } else if (hour > 12 && hour < 17) {
        greeting = "Good Afternoon, "
    } else if (hour > 17 && hour < 23) {
        greeting = "Good Evening, "
    }
    _("#greet").html(greeting + name);
}

function selectGender(elem) {
    let genders = document.querySelectorAll(".gender");
    for (gender of genders) {
        gender.classList.remove("selected");
    }
    elem.classList.add("selected");
}

function addToAge() {
    let age = Number(_("#count").html())
    if (isNaN(age)) {
        _("#count").html(18);
        return
    }
    if (age == 100) {
        return
    }
    _("#count").html(age + 1);
}

function subtractFromAge() {
    let age = Number(_("#count").html())
    if (isNaN(age)) {
        _("#count").html(18);
        return
    }
    if (age == 6) {
        return
    }
    _("#count").html(age - 1);
}

_("#count").on("click", function(e) {
    e.setAttribute("contenteditable", "true");
    e.focus();
})

// Import and Run Background Video Changer for Signup page
require("background").run();

let spinner = {
    start: function() {
        _("#load_cov").flex();
    },
    stop: function() {
        _("#load_cov").hide();
    }
}

function openTab(evt, tab) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tab).style.display = "block";
    if (tab == "menuTab") {
        document.getElementById(tab).style.display = "flex";
    }
    evt.currentTarget.className += " active";

    let tabToName = {
        "homeTab": db.query("SELECT name FROM user").name[0].split(" ")[0],
        "menuTab": "Lessons",
        "calendarTab": "Calendar",
        "userTab": db.query("SELECT name FROM user").name[0].split(" ")[0]
    }

    _("#my_name").html(tabToName[tab] || db.query("SELECT name FROM user").name[0].split(" ")[0])
}

function lessonLocked() {
    modal("Locked", "This lesson is locked!");
}

function openLesson(id) {
    spinner.start();
    lessons.openLesson(id);
    setTimeout(function() {
        spinner.stop()
        gotoPage(3);
    }, 2000)
}

window.addEventListener('beforeinstallprompt', function(e) {
    // Prevent the mini-infobar from appearing on mobile.
    event.preventDefault();
    // Stash the event so it can be triggered later.
    window.deferredPrompt = event;
});

window.addEventListener('appinstalled', (event)=>{
    // Clear the deferredPrompt so it can be garbage collected
    window.deferredPrompt = null;
}
);

function getPWADisplayMode() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (document.referrer.startsWith('android-app://')) {
        return 'pwa';
    } else if (navigator.standalone || isStandalone) {
        return 'standalone';
    }
    return 'browser';
}

//Service Worker
let url = new URL(document.location.href)
let path = url.pathname;

if ('serviceWorker'in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js', {
            scope: path,
        }).then((reg)=>{
            // registration success
            console.log("Registration Success");
        }
        ).catch((err)=>{
            //registration failed
            console.log('Registration failed: ' + err);
        }
        );
    });
}
