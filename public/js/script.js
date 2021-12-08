const settingsBtn = document.querySelector(".uil-setting");
const newTaskInput = document.querySelector("#new-task-input");


// toggle the settings menu
settingsBtn.addEventListener("click", () => {
  const toggleLinks = document.querySelector("#toggle-links");

  if (toggleLinks.style.display === "none") {
    toggleLinks.style.display = "block";
  } else {
    toggleLinks.style.display = "none";
  }
})
