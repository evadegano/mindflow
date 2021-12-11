const pomodoroBtn = document.querySelector("#pomodoro--btn");
const pomodoroMins = document.querySelector("#pomodoro--mins");
const pomodoroSecs = document.querySelector("#pomodoro--secs");
const pomodoroRing = document.querySelector("#pomodoro--progress-ring");
const ringLength = pomodoroRing.getTotalLength();
const duration = 10;
const progress = ringLength / duration;

pomodoroRing.style.strokeDasharray = ringLength + " " + ringLength;
pomodoroRing.style.strokeDashoffset = ringLength;

pomodoroBtn.addEventListener("click", () => {
  if (pomodoroBtn.className === "start") {
    console.log("start")
    pomodoroStart();
  } else {
    console.log("stop")
    pomodoroStop();
  }
})

function pomodoroStart() {
  let steps = 0;
  let pomodoroTimer = setInterval(pomodoroProgress, 1000);
  pomodoroBtn.className = "stop";
  pomodoroBtn.textContent = "stop";
  
  function pomodoroProgress() {
    if (steps === duration) {
      pomodoroStop(pomodoroTimer);
    } else {
      pomodoroRing.style.strokeDashoffset -= progress;
      steps++;
      let mins = Math.floor(steps / 60);
      let secs = steps % 60;

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
  pomodoroBtn.className = "start";
  pomodoroBtn.textContent = "start";
}