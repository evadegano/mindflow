// Creativity playlist
const audioArrayCreativity = document.querySelectorAll("#creativity-playlist audio");
let indexCreativity = 0;

// play track
document.querySelector("#creativity-playlist .uil-play").addEventListener("click",function () {
  audioArrayCreativity[indexCreativity].play();
  document.querySelector("#creativity-playlist .uil-play").classList.replace("active", "inactive");
  document.querySelector("#creativity-playlist .uil-pause").classList.replace("inactive", "active");
});

// play the next tracks
audioArrayCreativity.forEach((audio) => {
  audio.volume = 0.5;
  audio.addEventListener('ended', (event) => {
      // si bouton shuffle actif
      if (document.querySelector("#creativity-playlist .uil-shuffle").classList.contains("active")) {
        indexCreativity = Math.trunc(Math.random() * audioArrayCreativity.length);
      }
      // si bouton shuffle inactif
      else {
        // quand le dernier morceau est joué
        if (indexCreativity === audioArrayCreativity.length - 1) {
          // si bouton repeat actif
          if (document.querySelector("#creativity-playlist .uil-repeat").classList.contains("active")) {
            indexCreativity = 0;
          // si bouton repeat inactif
          } else {
            return
          }
        // sinon le morceau suivant est joué
        } else {
            indexCreativity += 1; 
        }
      }
      audioArrayCreativity[indexCreativity].play();
  })
})

// pause
document.querySelector("#creativity-playlist .uil-pause").addEventListener("click",function () {
  audioArrayCreativity[indexCreativity].pause();
  document.querySelector("#creativity-playlist .uil-pause").classList.replace("active", "inactive");
  document.querySelector("#creativity-playlist .uil-play").classList.replace("inactive", "active");
});

// skip forward
document.querySelector("#creativity-playlist .uil-skip-forward").addEventListener("click",function () {
  audioArrayCreativity[indexCreativity].pause();
  if(indexCreativity === audioArrayCreativity.length - 1) {
    indexCreativity = 0;
  } else {
    indexCreativity += 1; 
  }
  audioArrayCreativity[indexCreativity].play();
});

// step backward
document.querySelector("#creativity-playlist .uil-step-backward").addEventListener("click",function () {
  audioArrayCreativity[indexCreativity].pause();
  if(indexCreativity === 0) {
    indexCreativity = audioArrayCreativity.length - 1;
  } else {
    indexCreativity -= 1; 
  }
  audioArrayCreativity[indexCreativity].play();
});

// shuffle
document.querySelector("#creativity-playlist .uil-shuffle").addEventListener("click",function () {
  document.querySelector("#creativity-playlist .uil-shuffle").classList.toggle("active");
  indexCreativity = Math.trunc(Math.random() * audioArrayCreativity.length);
});

// repeat 
document.querySelector("#creativity-playlist .uil-repeat").addEventListener("click",function () {
  document.querySelector("#creativity-playlist .uil-repeat").classList.toggle("active");
});

// switch player
document.querySelector("#player-menu__item2").addEventListener("click",function () {
  audioArrayCreativity[indexCreativity].pause();
  document.querySelector("#creativity-playlist .uil-pause").classList.replace("active", "inactive");
  document.querySelector("#creativity-playlist .uil-play").classList.replace("inactive", "active");
});

// display track infos
audioArrayCreativity.forEach((audio) => {
  let trackName = audio.parentElement.querySelector(".track-name").textContent;
  let trackArtist = audio.parentElement.querySelector(".track-artist").textContent;
  
  audio.addEventListener("play",function () {
    document.querySelector("#creativity-playlist .track-name-displayed").textContent = `${trackName}`;
    document.querySelector("#creativity-playlist .track-artist-displayed").textContent = `${trackArtist}`;
  })
})

// Problem solving playlist

const audioArrayPS = document.querySelectorAll("#problem-solving-playlist audio");
let indexPS = 0;

// play track
document.querySelector("#problem-solving-playlist .uil-play").addEventListener("click",function () {
  audioArrayPS[indexPS].play();
  document.querySelector("#problem-solving-playlist .uil-play").classList.replace("active", "inactive");
  document.querySelector("#problem-solving-playlist .uil-pause").classList.replace("inactive", "active");
});

// play the next tracks
audioArrayPS.forEach((audio) => {
  audio.volume = 0.5;
  audio.addEventListener('ended', (event) => {
      // si bouton shuffle actif
      if (document.querySelector("#problem-solving-playlist .uil-shuffle").classList.contains("active")) {
        indexPS = Math.trunc(Math.random() * audioArrayPS.length);
      }
      // si bouton shuffle inactif
      else {
        // quand le dernier morceau est joué
        if (indexPS === audioArrayPS.length - 1) {
          // si bouton repeat actif
          if (document.querySelector("#problem-solving-playlist .uil-repeat").classList.contains("active")) {
            indexPS = 0;
          // si bouton repeat inactif
          } else {
            return
          }
        // sinon le morceau suivant est joué
        } else {
            indexPS += 1; 
        }
      }
      audioArrayPS[indexPS].play();
  })
})

// pause
document.querySelector("#problem-solving-playlist .uil-pause").addEventListener("click",function () {
  audioArrayPS[indexPS].pause();
  document.querySelector("#problem-solving-playlist .uil-pause").classList.replace("active", "inactive");
  document.querySelector("#problem-solving-playlist .uil-play").classList.replace("inactive", "active");
});

// skip forward
document.querySelector("#problem-solving-playlist .uil-skip-forward").addEventListener("click",function () {
  audioArrayPS[indexPS].pause();
  if(indexPS === audioArrayPS.length - 1) {
    indexPS = 0;
  } else {
    indexPS += 1; 
  }
  audioArrayPS[indexPS].play();
});

// step backward
document.querySelector("#problem-solving-playlist .uil-step-backward").addEventListener("click",function () {
  audioArrayPS[indexPS].pause();
  if(indexPS === 0) {
    indexPS = audioArrayPS.length - 1;
  } else {
    indexPS -= 1; 
  }
  audioArrayPS[indexPS].play();
});

// shuffle
document.querySelector("#problem-solving-playlist .uil-shuffle").addEventListener("click",function () {
  document.querySelector("#problem-solving-playlist .uil-shuffle").classList.toggle("active");
  indexPS = Math.trunc(Math.random() * audioArrayPS.length);
});

// repeat 
document.querySelector("#problem-solving-playlist .uil-repeat").addEventListener("click",function () {
  document.querySelector("#problem-solving-playlist .uil-repeat").classList.toggle("active");
});

// switch player
document.querySelector("#player-menu__item1").addEventListener("click",function () {
  audioArrayPS[indexPS].pause();
  document.querySelector("#problem-solving-playlist .uil-pause").classList.replace("active", "inactive");
  document.querySelector("#problem-solving-playlist .uil-play").classList.replace("inactive", "active");
});

// display track infos
audioArrayPS.forEach((audio) => {
  let trackName = audio.parentElement.querySelector(".track-name").textContent;
  let trackArtist = audio.parentElement.querySelector(".track-artist").textContent;
  
  audio.addEventListener("play",function () {
    document.querySelector("#problem-solving-playlist .track-name-displayed").textContent = `${trackName}`;
    document.querySelector("#problem-solving-playlist .track-artist-displayed").textContent = `${trackArtist}`;
  })
})