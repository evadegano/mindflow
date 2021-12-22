const curvedSection = document.querySelector(".row-container.curved-bg");
const rocketImg = document.querySelector("#rocket-img");
const totalScrollHeight = curvedSection.getBoundingClientRect().y;

let vpWidth = window.innerWidth;
let progressRatio = vpWidth / totalScrollHeight;
rocketImg.style.left = "0px";
rocketImg.style.top = "0px";


window.addEventListener("resize", () => {
  // update viewport width
  vpWidth = window.innerWidth;
})

window.addEventListener('scroll', () => {
  let scrollY = window.scrollY;

  updateImgPos(scrollY);
})


function updateImgPos(scrollY) {
  let progress = scrollY * progressRatio;
  let normalizedProgress = progress / vpWidth * 1.2;

  let startPoint = {
    x: 0,
    y: 0
  };
  let midPoint = {
    x: (vpWidth - rocketImg.width) / 2,
    y: 300,
  };
  let endPoint = {
    x: vpWidth - rocketImg.width,
    y: 0
  };
  
  rocketImg.style.left = `${progress}px`;
  rocketImg.style.top = `-${(1 - normalizedProgress) ** 2 * startPoint.y + 2 * (1 - normalizedProgress) * normalizedProgress * midPoint.y + normalizedProgress * normalizedProgress * endPoint.y}px`;
  console.log(rocketImg.style.top)

  // how to update rotation 
  // SVG passes center of screen
} 