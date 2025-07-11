let Genres = [
    ["Rock",
        ["Bohemian Rhapsody", "./images/1.jpg"],
        ["Stairway to Heaven", "./images/2.jpg"],
        ["Hotel California", "./images/3.jpg"],
        ["Smells Like Teen Spirit", "./images/4.jpg"]
    ],

    ["Pop",
        ["Billie Jean", "./images/5.jpg"],
        ["Shake It Off", "./images/6.jpg"],
        ["Bad Romance", "./images/7.jpg"],
        ["Blinding Lights", "./images/8.jpg"]
    ],

    ["HipHop",
        ["Lose Yourself", "./images/9.jpg"],
        ["Juicy", "./images/10.jpg"],
        ["Sicko Mode", "./images/11.jpg"],
        ["God’s Plan", "./images/12.jpg"]
    ],

    ["Jazz",
        ["Take Five", "./images/13.jpg"],
        ["What a Wonderful World", "./images/14.jpg"],
        ["So What", "./images/15.jpg"],
        ["Feeling Good", "./images/16.jpg"]
    ]
]

let genres_selectBox = document.createElement("select");
genres_selectBox.className = "genre_select";
let name_genre = "";
for (let i = 0; i < Genres.length; i++) {
    let genre_option = document.createElement("option");
    name_genre = Genres[i][0];
    genre_option.value = name_genre;
    genre_option.innerHTML = name_genre;
    genres_selectBox.append(genre_option);
}
genres_selectBox.my_attr = Genres[0];

let musics_selectBox = document.createElement("select");
musics_selectBox.className = "music_select";
let name_music = "";

for (let i = 1; i < Genres[0].length; i++) {
    let music_option = document.createElement("option");
    name_music = Genres[0][i][0];
    music_option.value = name_music;
    music_option.innerHTML = name_music;
    musics_selectBox.append(music_option);
}

let container = document.querySelector(".musics_container");
container.append(genres_selectBox);
container.append(musics_selectBox);

genres_selectBox.addEventListener("change" , function() {
    let name_genre = genres_selectBox.value;
    let array_genre = Genres.find(function(genre) {
        return genre[0] === name_genre;
    });
    document.body.style.backgroundImage = `url(${array_genre[1][1]})`;
    for (let i = 0; i < musics_selectBox.length; i++) {
        let music_name = array_genre[i+1][0];
        musics_selectBox[i].value = music_name;
        musics_selectBox[i].innerHTML = music_name;
    }
    musics_selectBox[0].selected = true;
    genres_selectBox.my_attr = array_genre;
});

musics_selectBox.addEventListener("change" , function() {
    let name_music = musics_selectBox.value;
    let genre_Array = genres_selectBox.my_attr;
    let music_info = genre_Array.find(function (music) {
        return music[0] === name_music;
    });
    document.body.style.backgroundImage = `url(${music_info[1]})`;
});