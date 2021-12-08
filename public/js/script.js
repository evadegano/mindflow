const settingsBtn = document.querySelector(".uil-setting");
const addInput = document.querySelector("#add-input");


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

// 


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