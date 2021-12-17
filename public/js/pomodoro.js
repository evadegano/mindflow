const pomodoroBtn = document.querySelector("#pomodoro--btn");
const pomodoroMins = document.querySelector("#pomodoro--mins");
const pomodoroSecs = document.querySelector("#pomodoro--secs");
const pomodoroRing = document.querySelector("#pomodoro--progress-ring");
const pomodoroContainer = document.querySelector("#pomodoro-container");


class PomodoroTimer {
  constructor() {
    this.duration = 10;
    this.timeElapsed = 0;
    this.status = "inactive";
    this.ringLength = 932.6760864257812;
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

  init(timeElapsed, pomodoroStatus) {
    this.timeElapsed = timeElapsed;
    this.status = pomodoroStatus;
    this.progress = this.ringLength / this.duration;

    pomodoroRing.style.strokeDasharray = this.ringLength + " " + this.ringLength;
    pomodoroRing.style.strokeDashoffset = this.ringLength - this.timeElapsed * this.progress;

    if (this.status === "inactive") {
      pomodoroBtn.classList.add("start");
      pomodoroBtn.textContent = "start";
      pomodoroMins.textContent = "00";
      pomodoroSecs.textContent = "00";
    } else {
      pomodoroBtn.classList.add("stop");
      pomodoroBtn.textContent = "stop";

      let secs = this.getSecs();
      let mins = this.getMins();
      pomodoroMins.textContent = mins;
      pomodoroSecs.textContent = secs;

      this.start();
    }
  }

  start() {
    this.status = "active";
    localStorage.setItem("pomodoroStatus", this.status);
    
    pomodoroBtn.className = "stop";
    pomodoroBtn.textContent = "stop";

    this.intervalId = setInterval(this.update, 1000);
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
    pomodoroMins.textContent = "00";
    pomodoroSecs.textContent = "00";
    pomodoroBtn.className = "start";
    pomodoroBtn.textContent = "start";
  }

  update() {
    if (this.timeElapsed === this.duration) {
      console.log(this.timeElapsed)
      console.log(this.duration)
      this.stop();
      this.reset();
    } else {
      this.timeElapsed++;
      localStorage.setItem("timeElapsed", this.timeElapsed);

      pomodoroRing.style.strokeDashoffset -= this.progress;

      let secs = this.getSecs();
      let mins = this.getMins();
      pomodoroMins.textContent = mins;
      pomodoroSecs.textContent = secs;
    }
  }
}