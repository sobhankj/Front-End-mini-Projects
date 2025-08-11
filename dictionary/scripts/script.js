const URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

const audioElem = document.querySelector("#audio");
const searchEl = document.querySelector("#search");
const searchButtonEl = document.querySelector("#searchButton");
const wordEl = document.querySelector(".word");
const typeEl = document.querySelector(".type_word");
const pronounceEl = document.querySelector(".pronounce_word");
const meaningEl = document.querySelector(".meaning_word");
const imageEl = document.querySelector(".image");

searchButtonEl.addEventListener("click" , () => {
    const word = searchEl.value;
    const url = `${URL}/${word}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        wordEl.innerHTML = data[0].word;
        typeEl.innerHTML = data[0].meanings[0].partOfSpeech;
        pronounceEl.innerHTML = data[0].phonetics[1].text;
        meaningEl.innerHTML = data[0].meanings[0].definitions[0].definition;
        audioElem.src = data[0].phonetics[0].audio;
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
});

imageEl.addEventListener("click" , () => {
    audioElem.play();
});