let cites_weather = {
    tehran : ["25" , "6" , "sunny"],
    tabriz : ["10" , "2" , "windspeed"],
    shiraz : ["16" , "20" , "cloudy"],
    esfehan : ["20" , "5" , "sun"]
}

let search_button = document.querySelector(".button");
let search_input = document.querySelector("#weather_input");
let image = document.querySelector(".image");
let title = document.querySelector("h2");
let humidity = document.querySelector(".humidity");
let temp = document.querySelector(".temp");

search_button.addEventListener("click" , function () {
    let user_input = search_input.value;
    let info = cites_weather[user_input];
    if (info === undefined) {
        search_input.value = "";
        search_input.placeholder = "enter correct city!";
    } else {
        title.innerHTML = `${user_input}, Iran`;
        humidity.innerHTML = `humidity: ${info[1]}%`;
        temp.innerHTML = `${info[0]}c`;
        image.setAttribute("src" , `./images/${info[2]}.png`);
    }
});