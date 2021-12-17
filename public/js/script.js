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
const pomodoroContainer = document.querySelector("#pomodoro-container");
const breathContainer = document.querySelector("#breath-container");
const breathBubble = document.querySelector("#breath-bubble");
let timeElapsed, pomodoroStatus, pageMode;
let iterationCount = 0;

// enlever window onload
window.addEventListener("load", () => {
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

  // get today's full date
  const todayFullDate = new Date();

  // add today's date
  const dateToday = document.querySelector("#date-today");
  dateToday.textContent = todayFullDate.toDateString();

  // change greeting message
  switchGreetingMsg(todayFullDate.getHours());

  if (pageMode === "focus") {
    pomodoroContainer.classList.toggle("active");
    updatePomodoro(timeElapsed, pomodoroStatus);
    pageSwitchBtn.checked = false;
  } else {
    breathContainer.classList.toggle("active");
    pageSwitchBtn.checked = true;
  }
  
})

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

pageSwitchBtn.addEventListener("click", () => {
  if (pageMode === "focus") {
    localStorage.setItem("pageMode", "relax");
    pageMode = "relax";
    pomodoroContainer.classList.toggle("active");
    breathContainer.classList.toggle("active");
    iterationCount = 0;
    breathContainer.querySelector("#breath-text").textContent = "breath in";
  } else {
    localStorage.setItem("pageMode", "focus");
    pageMode = "focus";
    pomodoroContainer.classList.toggle("active");
    breathContainer.classList.toggle("active");
    updatePomodoro(timeElapsed, pomodoroStatus);
  }
})

// change breathe bubble text on iteration
breathBubble.addEventListener("animationiteration", () => {
  iterationCount++;

  if (iterationCount % 2 === 0) {
    breathContainer.querySelector("#breath-text").textContent = "breath in";
  } else {
    breathContainer.querySelector("#breath-text").textContent = "breath out";
  }
  
})

// Player widget
const audioArray = document.querySelectorAll("audio");
let index = 0;

// play track
document.querySelector(".uil-play").addEventListener("click",function () {
  audioArray[index].play();
  document.querySelector(".uil-play").classList.replace("active", "inactive");
  document.querySelector(".uil-pause").classList.replace("inactive", "active");
});

// play the next tracks
audioArray.forEach((audio) => {
  audio.addEventListener('ended', (event) => {
      // si bouton shuffle actif
      if (document.querySelector(".uil-shuffle").classList.contains("active")) {
        index = Math.trunc(Math.random() * audioArray.length);
      }
      // si bouton shuffle inactif
      else {
        // quand le dernier morceau est joué
        if (index === audioArray.length - 1) {
          // si bouton repeat actif
          if (document.querySelector(".uil-repeat").classList.contains("active")) {
            index = 0;
          // si bouton repeat inactif
          } else {
            return
          }
        // sinon le morceau suivant est joué
        } else {
            index += 1; 
        }
      }
      audioArray[index].play();
  })
})

// pause
document.querySelector(".uil-pause").addEventListener("click",function () {
  audioArray[index].pause();
  document.querySelector(".uil-pause").classList.replace("active", "inactive");
  document.querySelector(".uil-play").classList.replace("inactive", "active");
});

// skip forward
document.querySelector(".uil-skip-forward").addEventListener("click",function () {
  audioArray[index].pause();
  if(index === audioArray.length - 1) {
    index = 0;
  } else {
    index += 1; 
  }
  audioArray[index].play();
});

// step backward
document.querySelector(".uil-step-backward").addEventListener("click",function () {
  audioArray[index].pause();
  if(index === 0) {
    index = audioArray.length - 1;
  } else {
    index -= 1; 
  }
  audioArray[index].play();
});

// shuffle
document.querySelector(".uil-shuffle").addEventListener("click",function () {
  document.querySelector(".uil-shuffle").classList.toggle("active");
  index = Math.trunc(Math.random() * audioArray.length);
});

// repeat 
document.querySelector(".uil-repeat").addEventListener("click",function () {
  document.querySelector(".uil-repeat").classList.toggle("active");
});