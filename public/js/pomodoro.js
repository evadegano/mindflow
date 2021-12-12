const pomodoroBtn = document.querySelector("#pomodoro--btn");
const pomodoroMins = document.querySelector("#pomodoro--mins");
const pomodoroSecs = document.querySelector("#pomodoro--secs");
const pomodoroRing = document.querySelector("#pomodoro--progress-ring");
const duration = 25 * 60;
let ringLength, pomodoroTimer;



// update pomodoro timer's content
function updatePomodoro(timeElapsed, pomodoroStatus) {
  ringLength = pomodoroRing.getTotalLength();
  const progress = ringLength / duration;
  pomodoroRing.style.strokeDasharray = ringLength + " " + ringLength;
  pomodoroRing.style.strokeDashoffset = ringLength - timeElapsed * progress;

  if (pomodoroStatus === "inactive") {
    pomodoroBtn.classList.add("start");
    pomodoroBtn.textContent = "start";
    pomodoroMins.textContent = "00";
    pomodoroSecs.textContent = "00";
  } else {
    pomodoroBtn.classList.add("stop");
    pomodoroBtn.textContent = "stop";

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

      pomodoroStart(timeElapsed, progress);
  }
}

// start pomodoro timer
function pomodoroStart(timeElapsed, progress) {
  localStorage.setItem("pomodoroStatus", "active");
  let pomodoroTimer = setInterval(pomodoroProgress, 1000);
  pomodoroBtn.className = "stop";
  pomodoroBtn.textContent = "stop";
  
  function pomodoroProgress() {
    if (timeElapsed === duration) {
      pomodoroStop(pomodoroTimer);
    } else {
      pomodoroRing.style.strokeDashoffset -= progress;
      timeElapsed++;
      localStorage.setItem("timeElapsed", timeElapsed);
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

// stop and reset pomodoro timer
function pomodoroStop(timerId) {
  pomodoroRing.style.strokeDashoffset = ringLength;
  pomodoroMins.textContent = "00";
  pomodoroSecs.textContent = "00";
  clearInterval(timerId);
  timeElapsed = 0;
  localStorage.setItem("timeElapsed", timeElapsed);
  localStorage.setItem("pomodoroStatus", "inactive");
  pomodoroBtn.className = "start";
  pomodoroBtn.textContent = "start";
}

// pomodoro timer interation
pomodoroBtn.addEventListener("click", () => {
  if (pomodoroBtn.className === "start") {
    pomodoroStart();
  } else {
    pomodoroStop(pomodoroTimer);
  }
})