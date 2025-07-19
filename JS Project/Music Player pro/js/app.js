const musics = [
    {id:1 , name: "Zir Barfa (Canis)" , imagesrc: "./images/1.jpg" , audiosrc: "./music/Canis - Barfa.mp3" },
    {id:2 , name: "Man Delam Nemikhat Vali (Shayea)" , imagesrc: "./images/2.jpg" , audiosrc: "./music/2.mp3" },
    {id:3 , name: "Shoma Shenidin Ma Didimo (Shayea)" , imagesrc: "./images/3.webp" , audiosrc: "./music/3.mp3" },
    {id:4 , name: "Too Cheshami (Hoomaan)" , imagesrc: "./images/4.jpg" , audiosrc: "./music/4.mp3" },
    {id:5 , name: "Gahgaahi (The Don)" , imagesrc: "./images/5.jpg" , audiosrc: "./music/5.mp3" },
    {id:6 , name: "Doroughe (Mahyar)" , imagesrc: "./images/6.jpg" , audiosrc: "./music/6.mp3" }
]

const music_list_container = document.querySelector(".music_list_container");
const music_player = document.querySelector("audio");
const pre_10sec = document.querySelector(".pre_10sec");
const pre_music = document.querySelector(".pre_music");
const play_pause = document.querySelector(".play_pause");
const next_music = document.querySelector(".next_music");
const next_10sec = document.querySelector(".next_10sec");
const now_music_img = document.querySelector(".now_music_img");
const now_music_name = document.querySelector(".now_music_name");
const progress_range = document.querySelector(".progress_range");
const volume_range = document.querySelector(".volume_range");
let whatmusic = 1;


musics.forEach(music => {
    const music_list_item = document.createElement("div");
    music_list_item.classList.add("music_list_item");
    music_list_item.innerHTML = `
    <img src="${music.imagesrc}" alt="" width="150px">
    <p>${music.name}</p>
    `;
    music_list_item.addEventListener("click", () => {
        now_music_img.src = music.imagesrc;
        now_music_name.innerHTML = music.name;
        music_player.src = music.audiosrc;
        music_player.play();
        music_player.currentTime = 0;
        progress_range.value = 0;
        whatmusic = music.id;
    })
    music_list_container.appendChild(music_list_item);
})


music_player.addEventListener("timeupdate", () => {
    progress_range.value = (music_player.currentTime / music_player.duration) * 100;
})

progress_range.addEventListener("change", () => {
    music_player.currentTime = (progress_range.value / 100) * music_player.duration;
})

volume_range.addEventListener("change", () => {
    music_player.volume = volume_range.value / 100;
})


play_pause.addEventListener("click", () => {
    if (music_player.paused) {
        music_player.play();
    } else {
        music_player.pause();
    }
})

pre_10sec.addEventListener("click", () => {
    music_player.currentTime -= 10;
})

next_10sec.addEventListener("click", () => {
    music_player.currentTime += 10;
})

next_music.addEventListener("click", () => {
    whatmusic++;
    if (whatmusic > musics.length) {
        whatmusic = 1;
    }
    music_player.src = musics[whatmusic - 1].audiosrc;
    now_music_name.innerHTML = musics[whatmusic - 1].name;
    now_music_img.src = musics[whatmusic - 1].imagesrc;
    music_player.play();
})

pre_music.addEventListener("click", () => {
    whatmusic--;
    if (whatmusic < 1) {
        whatmusic = musics.length;
    }
    music_player.src = musics[whatmusic - 1].audiosrc;
    now_music_name.innerHTML = musics[whatmusic - 1].name;
    now_music_img.src = musics[whatmusic - 1].imagesrc;
    music_player.play();
})