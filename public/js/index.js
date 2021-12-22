const rocketImg = document.querySelector("#rocket-img");
const rocketPathSvg = document.querySelector("#rocket-path-svg");
const rocketPath = document.querySelector("#rocket-path").getAttribute("d");

function init() {
  drawSvgPath();
}

// use on load and on window resize
function drawSvgPath() {
  let width = rocketPathSvg.width.animVal.value;
  console.log("width:", width)
  rocketPath = `M0 100 l${width/2} -200 ${width} 0`;
}

function updateImgPos(scrollY) {
  // get viewport width

  // get height from top to start of curved section

  // calc progress: width / height

  // update img x pos accordningly

  // how to update rotation 
}

init();