const settingsBtn = document.querySelector(".uil-setting");
const addInput = document.querySelector("#add-input");
const collapseMenu = document.querySelectorAll(".collapsible-menu");


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
settingsBtn.addEventListener("click", () => {
  const toggleLinks = document.querySelector("#toggle-links");

  if (toggleLinks.style.display === "none") {
    toggleLinks.style.display = "block";
  } else {
    toggleLinks.style.display = "none";
  }
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

// display form options
function showOptions() {
  return
}

// change greeting message
function switchGreetingMsg(hour) {
  const greetingMsg = document.querySelector("#greeting-msg");

  switch(true) {
    case hour > 4 && hour < 13:
      greetingMsg.textContent = "Good morning";
      break;
    case hour < 18:
      greetingMsg.textContent = "Good afternoon";
      break;
    case hour < 23:
      greetingMsg.textContent = "Good evening";
      break;
    default:
      greetingMsg.textContent = "Good night" ;
      break;
  }
}