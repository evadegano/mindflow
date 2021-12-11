const settingsBtn = document.querySelector(".uil-setting");
const addInput = document.querySelector("#add-input");
const collapseMenu = document.querySelectorAll(".collapsible-menu");
const addGoalForms = document.querySelectorAll(".add-goal-form");
const addGoalInputs = document.querySelectorAll(".add-goal-form .add-input");
const addTaskInput = document.querySelector("#add-task-form .add-input");
const addTaskOptions = document.querySelector("#add-task-form .options");
const addTaskForm = document.querySelector("#add-task-form");
const toggleMenu = document.querySelector("#toggle-menu");

const pomodoroStartBtn = document.querySelector("#pomodoro--start-btn");
const pomodoroMins = document.querySelector("#pomodoro--mins");
const pomodoroSecs = document.querySelector("#pomodoro--secs");
const pomodoroRing = document.querySelector("#pomodoro--progress-ring");
const ringLength = pomodoroRing.getTotalLength();
const duration = 10;
const progress = ringLength / duration;

window.addEventListener("load", () => {
  // get today's full date
  const todayFullDate = new Date();

  // add today's date
  const dateToday = document.querySelector("#date-today");
  dateToday.textContent = todayFullDate.toDateString();

  // change greeting message
  switchGreetingMsg(todayFullDate.getHours());
})

// toggle the settings menu
const toggleLinks = document.querySelector("#toggle-links");
settingsBtn.addEventListener("click", () => {
  toggleLinks.classList.toggle('active');
})

// toggle dropdown menus
collapseMenu.forEach(menu => {
  const collapseBtn = menu.querySelector(".collapsible-btn");
  const collapseContent = menu.querySelector(".collapsible-content");

  collapseBtn.addEventListener("click", () => {
    if (collapseContent.style.display === "none") {
      collapseContent.style.display = "block";
      collapseBtn.classList.remove("uil-angle-right");
      collapseBtn.classList.add("uil-angle-down");
    } else {
      collapseContent.style.display = "none";
      collapseBtn.classList.remove("uil-angle-down");
      collapseBtn.classList.add("uil-angle-right");
    }
  })
})

// display new task options on focus
addTaskInput.addEventListener("focus", () => {
  addTaskOptions.classList.add("active");
  addTaskInput.classList.add("active");
})

// display new goal options on focus
addGoalForms.forEach((form) => {
  form.querySelector(".add-input").addEventListener("focus", () => {
    form.querySelector(".options").classList.add("active");
  })
})

document.addEventListener("click", event => {
  // hide task options
  if (!addTaskForm.contains(event.target)) {
    addTaskOptions.classList.remove("active");
    addTaskInput.classList.remove("active");
    addTaskInput.value = "";
  }

  // hide goal options
  addGoalForms.forEach((form) => {
    if (!form.contains(event.target)) {
      form.querySelector(".options").classList.remove("active");
    }
  })

  // hide settings menu
  if (!toggleMenu.contains(event.target)) {
    toggleLinks.classList.remove("active");
  }
})

// change greeting message
function switchGreetingMsg(hour) {
  const greetingMsg = document.querySelector("#greeting-msg");

  switch(true) {
    case hour > 4 && hour < 13:
      greetingMsg.textContent = "Good morning,";
      break;
    case hour < 18:
      greetingMsg.textContent = "Good afternoon,";
      break;
    case hour < 23:
      greetingMsg.textContent = "Good evening,";
      break;
    default:
      greetingMsg.textContent = "Good night," ;
      break;
  }
}

// pomodoro timer
pomodoroRing.style.strokeDasharray = ringLength + " " + ringLength;
pomodoroRing.style.strokeDashoffset = ringLength;

pomodoroStartBtn.addEventListener("click", () => {
  let steps = 0;
  let pomodoroTimer = setInterval(pomodoroProgress, 1000);
  
  function pomodoroProgress() {
    if (steps === duration) {
      clearInterval(pomodoroTimer);
      pomodoroRing.style.strokeDashoffset = ringLength;
      pomodoroMins.textContent = "00";
      pomodoroSecs.textContent = "00";
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
})