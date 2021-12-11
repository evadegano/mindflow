const pomodoroBtn = document.querySelector("#pomodoro--btn");
const pomodoroMins = document.querySelector("#pomodoro--mins");
const pomodoroSecs = document.querySelector("#pomodoro--secs");
const pomodoroRing = document.querySelector("#pomodoro--progress-ring");
const ringLength = pomodoroRing.getTotalLength();
const duration = 10;
const progress = ringLength / duration;
let pomodoroTimer;

pomodoroRing.style.strokeDasharray = ringLength + " " + ringLength;
pomodoroRing.style.strokeDashoffset = ringLength;

// init localStorage if necessary
if (!localStorage.getItem("timeElapsed")) {
  localStorage.setItem("timeElapsed", 0);
  localStorage.setItem("pomodoroStatus", "inactive");
  var timeElapsed = 0;
  var pomodoroStatus = "inactive";
} else {
  var timeElapsed = localStorage.getItem("timeElapsed");
  var timeElapsed = localStorage.getItem("pomodoroStatus");
}

window.addEventListener("load", () =>)

// dynamically display mins, secs, pomodoroRing.style.strokeDashoffset

pomodoroBtn.addEventListener("click", () => {
  if (pomodoroBtn.className === "start") {
    pomodoroStart();
  } else {
    pomodoroStop(pomodoroTimer);
  }
})

function pomodoroStart() {
  pomodoroTimer = setInterval(pomodoroProgress, 1000);
  pomodoroBtn.className = "stop";
  pomodoroBtn.textContent = "stop";
  
  function pomodoroProgress() {
    if (timeElapsed === duration) {
      pomodoroStop(pomodoroTimer);
    } else {
      pomodoroRing.style.strokeDashoffset -= progress;
      timeElapsed++;
      let mins = Math.floor(timeElapsed / 60);
      let secs = timeElapsed % 60;

      if (mins < 10) {
        mins = "0" + mins;
      }

      if (secs < 10) {
        secs = "0" + secs;
      }

      pomodoroMins.textContent = mins;
      pomodoroSecs.textContent = secs;
    }
  }
}

function pomodoroStop(timerId) {
  pomodoroRing.style.strokeDashoffset = ringLength;
  pomodoroMins.textContent = "00";
  pomodoroSecs.textContent = "00";
  clearInterval(timerId);
  timeElapsed = 0;
  pomodoroBtn.className = "start";
  pomodoroBtn.textContent = "start";
}