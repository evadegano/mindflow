const pomodoroBtn = document.querySelector("#pomodoro--btn");
const pomodoroMins = document.querySelector("#pomodoro--mins");
const pomodoroSecs = document.querySelector("#pomodoro--secs");
const pomodoroRing = document.querySelector("#pomodoro--progress-ring");
const pomodoroContainer = document.querySelector("#pomodoro-container");


class PomodoroTimer {
  constructor() {
    this.duration = 25 * 60;
    this.timeElapsed = 0;
    this.status = "inactive";
    this.ringLength = 753.6776733398438;
    this.progress = this.ringLength / this.duration;
    this.intervalId = null;
  }

  getSecs() {
    let secs = this.timeElapsed % 60;

    if (secs < 10) {
      secs = "0" + secs;
    }
    
    return secs;
  }

  getMins() {
    let mins = Math.floor(this.timeElapsed / 60);

    if (mins < 10) {
      mins = "0" + mins;
    }

    return mins;
  }

  init(timeElapsed, pomodoroStatus, callback) {
    this.timeElapsed = timeElapsed;
    this.status = pomodoroStatus;
    this.progress = this.ringLength / this.duration;

    pomodoroRing.style.strokeDasharray = this.ringLength + " " + this.ringLength;
    pomodoroRing.style.strokeDashoffset = this.ringLength - this.timeElapsed * this.progress;

    if (this.status === "inactive") {
      pomodoroBtn.classList.add("start");
      pomodoroBtn.textContent = "start";
    } else {
      pomodoroBtn.classList.add("stop");
      pomodoroBtn.textContent = "stop";
      this.start(callback);
    }
  }

  start(callback) {
    this.status = "active";
    localStorage.setItem("pomodoroStatus", this.status);
    
    pomodoroBtn.className = "stop";
    pomodoroBtn.textContent = "stop";

    this.intervalId = setInterval(() => {
      if (this.timeElapsed === this.duration) {
        this.stop();
        this.reset();
      } else {
        this.timeElapsed++;
        localStorage.setItem("timeElapsed", this.timeElapsed);

        pomodoroRing.style.strokeDashoffset -= this.progress;
      }

      if (callback) {
        callback();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
  }

  reset() {
    this.timeElapsed = 0;
    this.status = "inactive"
    localStorage.setItem("timeElapsed", this.timeElapsed);
    localStorage.setItem("pomodoroStatus", this.status);

    pomodoroRing.style.strokeDashoffset = this.ringLength;
    pomodoroBtn.className = "start";
    pomodoroBtn.textContent = "start";
  }
}