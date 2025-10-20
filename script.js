//carousel infinite scroll
// referenz fuer infinite scroll https://www.youtube.com/watch?v=0kgmTspy0g4

const carousel = document.getElementById('carousel');

let gescrolltePixel = 0;
const gesamteHoehe = 3600;
const schwelle = 100; 

window.scrollTo(0, 110);

window.addEventListener("scroll", function(){
    gescrolltePixel = window.scrollY;
    if(window.scrollY < 0 + schwelle) {
        window.scrollTo(0, gesamteHoehe + schwelle);

    } else if (window.scrollY > gesamteHoehe + schwelle) {
        window.scrollTo(0, this.window.scrollY % gesamteHoehe);

    } else {
        carousel.style.setProperty('--rotateScroller', window.scrollY / 10 + "deg");       
    }
});

// background infinite
const scrollContainer = document.querySelectorAll(".bg");

window.addEventListener("scroll", function() {
  scrollContainer.forEach(function(scrollAlle) {
    scrollAlle.style.setProperty('--rotateBg', - window.scrollY / 18 + 'vw');
  });
});


// problem: funktioniert nur bei aktivem hover, nicht bei passiven
const naviTextSwitch = document.querySelectorAll(".naviText");

naviTextSwitch.forEach(function(naviTextAlle){
    naviTextAlle.addEventListener("mouseover", function(){
        this.classList.remove("inactive");
        this.classList.add("active");
    })
    
    naviTextAlle.addEventListener("mouseout", function(){
        this.classList.remove("active");
        this.classList.add("inactive");
    })
})

const myCursor = document.querySelector(".cursor");

window.addEventListener("mousemove", function(e){
    let posX = e.clientX;
    let posY = e.clientY;

    // mit delay
    myCursor.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 80, fill: "forwards"})

})


// audio player
const audio = document.getElementById('audio');
const muteButton = document.getElementById('mute-button');

const baselineVolume = 0.04;
const maxVolume = 0.12;
const scrollSpeedFactor = 0.003;
const beforeScroll = 1;
let scrollSpeed = 0;
let lastScrollY = window.scrollY;

if (beforeScroll === 1) {
  audio.volume = baselineVolume;
}

// Load mute state from localStorage
const savedMuteState = localStorage.getItem('audioMuted');
if (savedMuteState === 'true') {
  audio.muted = true;
  muteButton.textContent = 'muted';
} else {
  audio.muted = false;
  muteButton.textContent = 'playing';
}

// Load saved timestamp and apply it once audio is ready
const savedTime = localStorage.getItem('audioTime');
audio.addEventListener('loadedmetadata', () => {
  if (savedTime) {
    audio.currentTime = parseFloat(savedTime);
  }
});

// Save current time every second
setInterval(() => {
  if (!audio.paused) {
    localStorage.setItem('audioTime', audio.currentTime);
  }
}, 1000);

muteButton.addEventListener('click', () => {
  audio.muted = !audio.muted;
  localStorage.setItem('audioMuted', audio.muted);
  muteButton.textContent = audio.muted ? 'muted' : 'playing';
});

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'm') {
    audio.muted = !audio.muted;
    localStorage.setItem('audioMuted', audio.muted);
    muteButton.textContent = audio.muted ? 'muted' : 'playing';
  }
});

function updateScrollSpeed() {
  const currentScrollY = window.scrollY;
  scrollSpeed = Math.abs(currentScrollY - lastScrollY);
  lastScrollY = currentScrollY;
  requestAnimationFrame(updateScrollSpeed);
}

updateScrollSpeed();

window.addEventListener('scroll', () => {
  if (!audio.muted) {
    const adjustedVolume = Math.min(
      maxVolume,
      baselineVolume + scrollSpeed * scrollSpeedFactor
    );
    audio.volume = adjustedVolume;
    muteButton.textContent = "playing";
  }
});

