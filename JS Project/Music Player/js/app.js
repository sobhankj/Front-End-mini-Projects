const musics = [
    {id:1 , name: "Zir Barfa (Canis)" , imagesrc: "./images/1.jpg" , audiosrc: "./music/Canis - Barfa.mp3" },
    {id:2 , name: "Man Delam Nemikhat Vali (Shayea)" , imagesrc: "./images/2.jpg" , audiosrc: "./music/2.mp3" },
    {id:3 , name: "Shoma Shenidin Ma Didimo (Shayea)" , imagesrc: "./images/3.webp" , audiosrc: "./music/3.mp3" }
]


const music = document.querySelector("audio");
const pre_10sec = document.querySelector(".pre_10sec");
const pre_music = document.querySelector(".pre_music");
const play_pause = document.querySelector(".play_pause");
const next_music = document.querySelector(".next_music");
const next_10sec = document.querySelector(".next_10sec");
const h1 = document.querySelector("h1");
const img = document.querySelector("img");
let whatmusic = 1;


play_pause.addEventListener("click", () => {
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
})

pre_10sec.addEventListener("click", () => {
    music.currentTime -= 10;
})

next_10sec.addEventListener("click", () => {
    music.currentTime += 10;
})

next_music.addEventListener("click", () => {
    whatmusic++;
    if (whatmusic > musics.length) {
        whatmusic = 1;
    }
    music.src = musics[whatmusic - 1].audiosrc;
    h1.innerHTML = musics[whatmusic - 1].name;
    img.src = musics[whatmusic - 1].imagesrc;
    music.play();
})

pre_music.addEventListener("click", () => {
    whatmusic--;
    if (whatmusic < 1) {
        whatmusic = musics.length;
    }
    music.src = musics[whatmusic - 1].audiosrc;
    h1.innerHTML = musics[whatmusic - 1].name;
    img.src = musics[whatmusic - 1].imagesrc;
    music.play();
})