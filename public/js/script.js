const settingsBtn = document.querySelector(".uil-setting");
const collapseMenus = document.querySelectorAll(".collapsible-menu");
const goalContainers = document.querySelectorAll(".goal-container");
const addGoalForms = document.querySelectorAll(".add-goal-form");
const addGoalInputs = document.querySelectorAll(".add-goal-form .add-input");
const taskFormsContainers = document.querySelectorAll(".task-forms-container");
const addTaskInput = document.querySelector("#add-task-form .add-input");
const addTaskOptions = document.querySelector("#add-task-form .options");
const addTaskForm = document.querySelector("#add-task-form");
const toggleMenu = document.querySelector("#toggle-menu");
const pageSwitchBtn = document.querySelector("#page-toggle input")
const breathContainer = document.querySelector("#breath-container");
const playerMenuItem1 = document.querySelector("#player-menu__item1");
const playerMenuItem2 = document.querySelector("#player-menu__item2");
const breathBubble = document.querySelector("#breath-bubble");
const pomodoroTimer = new PomodoroTimer();
let pageMode, timeElapsed, pomodoroStatus;


function init() {
  updateLocalStorage();
  updatePageContent();
}

// update data contained in the local storage
function updateLocalStorage() {
  localStorage.setItem("pomodoroStatus", "inactive");
  localStorage.setItem("timeElapsed", 0);
  localStorage.setItem("pageMode", "focus");

  // init localStorage if necessary
  if (!localStorage.getItem("pomodoroStatus")) {
    localStorage.setItem("pomodoroStatus", "inactive");
  }

  if (!localStorage.getItem("timeElapsed")) {
    localStorage.setItem("timeElapsed", 0);
  }

  if (!localStorage.getItem("pageMode")) {
    localStorage.setItem("pageMode", "focus");
  } 

  timeElapsed = localStorage.getItem("timeElapsed");
  pomodoroStatus = localStorage.getItem("pomodoroStatus");
  pageMode = localStorage.getItem("pageMode");
}

// update text content on page's DOM elements
function updatePageContent() {
  // get today's full date
  const todayFullDate = new Date();

  // add today's date
  const dateToday = document.querySelector("#date-today");
  dateToday.textContent = todayFullDate.toDateString();

  // change greeting message
  switchGreetingMsg(todayFullDate.getHours());

  // display blocks depending on the page's mode
  if (pageMode === "focus") {
    pomodoroContainer.classList.toggle("active");
    pomodoroTimer.init(timeElapsed, pomodoroStatus);
    pageSwitchBtn.checked = false;
  } else {
    breathContainer.classList.toggle("active");
    pageSwitchBtn.checked = true;
  }
}

// change greeting message depending on the time of the day
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

// toggle the settings menu
const toggleLinks = document.querySelector("#toggle-links");
settingsBtn.addEventListener("click", () => {
  toggleLinks.classList.toggle('active');
})

// toggle dropdown menus
collapseMenus.forEach(menu => {
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

// display edit task options on click
taskFormsContainers.forEach((container) => {
  container.querySelector(".task-form .task-container .task .edit-icons .uil-pen").addEventListener("click", () => {
    container.querySelector(".task-form").classList.add("inactive");
    container.querySelector(".edit-task-form").classList.add("active");
  })
})

// display edit goal options on click
goalContainers.forEach((container) => {
  container.querySelector(".goal .edit-icons .uil-pen").addEventListener("click", () => {
    container.querySelector(".goal").classList.add("inactive");
    container.querySelector(".edit-goal-form").classList.add("active");
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

  // hide task edit menu
  taskFormsContainers.forEach((container) => {
    if (!container.contains(event.target)) {
      container.querySelector(".task-form").classList.remove("inactive");
      container.querySelector(".edit-task-form").classList.remove("active");
    }
  })

  // hide goal edit menu
  goalContainers.forEach((container) => {
    if (!container.contains(event.target)) {
      container.querySelector(".goal").classList.remove("inactive");
      container.querySelector(".edit-goal-form").classList.remove("active");
    }
  })  
})

pageSwitchBtn.addEventListener("click", () => {
  if (pageMode === "focus") {
    pageMode = "relax";
    localStorage.setItem("pageMode", pageMode);
    
    pomodoroContainer.classList.toggle("active");
    breathContainer.classList.toggle("active");
    breathContainer.querySelector("#breath-text").textContent = "breath in";
  } else {
    pageMode = "focus";
    localStorage.setItem("pageMode", pageMode);
    
    pomodoroContainer.classList.toggle("active");
    breathContainer.classList.toggle("active");
    pomodoroTimer.init(timeElapsed, pomodoroStatus);
  }
})

// change breath bubble text on iteration
breathBubble.addEventListener("animationiteration", () => {
  let iterationCount = 0;
  iterationCount++;

  if (iterationCount % 2 === 0) {
    breathContainer.querySelector("#breath-text").textContent = "breath in";
  } else {
    breathContainer.querySelector("#breath-text").textContent = "breath out";
  }
  
})

const playerMenuBg = document.querySelector("#player-menu-bg");
const playerWidget = document.querySelector("#player-widget");
const blueCircle = document.querySelector("#blue-circle");
const yellowCircle = document.querySelector("#yellow-circle");


// start and stop pomodoro timer
pomodoroBtn.addEventListener("click", () => {
  if (pomodoroBtn.className === "start") {
    pomodoroTimer.start();
  } else {
    pomodoroTimer.stop();
    pomodoroTimer.reset();
  }
})

init();