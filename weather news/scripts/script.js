const API_KEY = "d4e2ab39b2aa887f4b1cc4e615cec2d7";
const URL = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=${API_KEY}`;

const searchButton = document.querySelector("#searchButton");
const cityElem = document.querySelector(".city");
const temperatureElem = document.querySelector(".temperature");
const descriptionElem = document.querySelector(".description");
const humidityElem = document.querySelector(".humidity");
const windElem = document.querySelector(".wind");

searchButton.addEventListener("click" , () => {
    const city = search.value;
    const url = URL.replace("{city name}" , city);
    fetch(url)
    .then(response => response.json())
    .then(data => {
        cityElem.innerHTML = data.name;
        temperatureElem.innerHTML = data.main.temp;
        descriptionElem.innerHTML = data.weather[0].description;
        humidityElem.innerHTML = data.main.humidity;
        windElem.innerHTML = data.wind.speed;
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
});

