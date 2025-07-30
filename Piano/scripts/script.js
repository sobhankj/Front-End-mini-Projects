const pianoKeys = document.querySelectorAll(".key");
const audio = document.querySelector("audio");
const volumeInput = document.querySelector(".volume-slider input");
const keysCheckbox = document.querySelector(".keys-checkbox input");
const allValidKeys = [];

pianoKeys.forEach(function (key) {
  allValidKeys.push(key.dataset.key);
});

function playNote(key) {
  const audioNewSrc = `./tunes/${key}.wav`;
  audio.src = audioNewSrc;
  audio.play();

  const mainKey = document.querySelector(`[data-key="${key}"]`);
  mainKey.classList.add("active");

  setTimeout(function () {
    mainKey.classList.remove("active");
  }, 150);
}

function pressKey(event) {
  if (allValidKeys.includes(event.key)) {
    playNote(event.key);
  }
}

function setVolume(event) {
  audio.volume = event.target.value;
}

function showOrHideKeys() {
  pianoKeys.forEach(function (key) {
    key.classList.toggle("hide");
  });
}

document.addEventListener("keydown", pressKey);
volumeInput.addEventListener("change", setVolume);
keysCheckbox.addEventListener("click", showOrHideKeys);
