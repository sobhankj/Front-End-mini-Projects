const cities = [
  "Tehran",
  "Karaj",
  "Shiraz",
  "Mashhad",
  "Tabriz",
  "Isfahan",
  "Rasht",
  "Qom",
  "Yazd",
  "Ahvaz",
  "Kerman",
  "Bandar Abbas",
];

const weatherTypes = ["sunny", "windy", "cloudy", "rainy", "snowy"];

const weatherMeta = {
  sunny: {
    label: "Sunny",
    icon: "☀️",
    theme: "theme-sunny",
    moods: ["Perfect Day", "Bright & Clear", "Golden Skies"],
  },
  windy: {
    label: "Windy",
    icon: "💨",
    theme: "theme-cloudy",
    moods: ["Breezy Vibes", "Fresh Air", "Windy Rush"],
  },
  cloudy: {
    label: "Cloudy",
    icon: "☁️",
    theme: "theme-cloudy",
    moods: ["Soft Skies", "Calm & Grey", "Cozy Clouds"],
  },
  rainy: {
    label: "Rainy",
    icon: "🌧️",
    theme: "theme-rainy",
    moods: ["Rainy Mood", "Fresh Rain", "Umbrella Day"],
  },
  snowy: {
    label: "Snowy",
    icon: "❄️",
    theme: "theme-snowy",
    moods: ["Winter Calm", "Snowy Magic", "Chilly Soft"],
  },
};

const airQualityOptions = ["Good", "Moderate", "Fair", "Poor"];

const tipsByWeather = {
  sunny: "Perfect weather for a walk outside. Stay hydrated and enjoy the sunshine.",
  windy: "Hold onto your hat today. A light jacket will help against the breeze.",
  cloudy: "Soft light and cool air — great for a calm stroll without strong sun.",
  rainy: "Don't forget your umbrella. Roads may be slippery, so take it easy.",
  snowy: "Dress warmly in layers. Watch for icy sidewalks when you head out.",
};

const recentSearches = [];
const MAX_RECENT = 3;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[randomInt(0, list.length - 1)];
}

function createCityWeather(cityName, forcedType) {
  const type = forcedType || pick(weatherTypes);
  const meta = weatherMeta[type];

  return {
    name: cityName,
    temperature: randomInt(0, 25),
    condition: type,
    conditionLabel: meta.label,
    icon: meta.icon,
    theme: meta.theme,
    humidity: randomInt(20, 95),
    windSpeed: randomInt(3, 40),
    airQuality: pick(airQualityOptions),
    mood: pick(meta.moods),
    tip: tipsByWeather[type],
  };
}

const fixedCityWeather = {
  Tehran: "sunny",
  Shiraz: "windy",
  Mashhad: "cloudy",
  Tabriz: "rainy",
  Isfahan: "snowy",
};

const weatherData = {};
cities.forEach(function (city) {
  const forcedType = fixedCityWeather[city] || null;
  weatherData[city.toLowerCase()] = createCityWeather(city, forcedType);
});

const appBody = document.getElementById("appBody");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const searchForm = document.getElementById("searchForm");
const searchError = document.getElementById("searchError");
const locationName = document.getElementById("locationName");
const weatherIcon = document.getElementById("weatherIcon");
const temperatureValue = document.getElementById("temperatureValue");
const condition = document.getElementById("condition");
const currentWeather = document.getElementById("currentWeather");
const humidityValue = document.getElementById("humidityValue");
const windValue = document.getElementById("windValue");
const airQualityValue = document.getElementById("airQualityValue");
const moodValue = document.getElementById("moodValue");
const tipContent = document.getElementById("tipContent");
const popularCities = document.getElementById("popularCities");
const emptyState = document.getElementById("emptyState");
const recentSearchesSection = document.getElementById("recentSearchesSection");
const recentSearchesList = document.getElementById("recentSearches");

function findCityWeather(cityName) {
  const key = cityName.trim().toLowerCase();
  return weatherData[key] || null;
}

function setTheme(themeClass) {
  appBody.classList.remove(
    "theme-sunny",
    "theme-cloudy",
    "theme-rainy",
    "theme-snowy",
    "theme-night"
  );
  appBody.classList.add(themeClass);
}

function updatePopularCities(selectedCity) {
  const chips = popularCities.querySelectorAll(".city-chip");

  chips.forEach(function (chip) {
    const isSelected =
      chip.getAttribute("data-city").toLowerCase() === selectedCity.toLowerCase();
    chip.classList.toggle("is-active", isSelected);
  });

  const alreadyExists = Array.from(chips).some(function (chip) {
    return chip.getAttribute("data-city").toLowerCase() === selectedCity.toLowerCase();
  });

  if (!alreadyExists) {
    chips.forEach(function (chip) {
      chip.classList.remove("is-active");
    });

    const firstChip = chips[0];
    if (firstChip) {
      firstChip.textContent = selectedCity;
      firstChip.setAttribute("data-city", selectedCity);
      firstChip.classList.add("is-active");
    }
  }
}

function renderRecentSearches() {
  recentSearchesList.innerHTML = "";

  if (recentSearches.length === 0) {
    recentSearchesSection.hidden = true;
    return;
  }

  recentSearchesSection.hidden = false;

  recentSearches.forEach(function (cityName) {
    const li = document.createElement("li");
    li.className = "recent-item";
    li.setAttribute("data-city", cityName);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "recent-item__btn";
    btn.setAttribute("data-city", cityName);
    btn.innerHTML =
      '<span class="recent-item__icon" aria-hidden="true">🕒</span>' +
      '<span class="recent-item__name">' +
      cityName +
      "</span>" +
      '<span class="recent-item__arrow" aria-hidden="true">→</span>';

    btn.addEventListener("click", function () {
      cityInput.value = cityName;
      checkWeather(true);
    });

    li.appendChild(btn);
    recentSearchesList.appendChild(li);
  });
}

function addRecentSearch(cityName) {
  const existingIndex = recentSearches.findIndex(function (city) {
    return city.toLowerCase() === cityName.toLowerCase();
  });

  if (existingIndex !== -1) {
    recentSearches.splice(existingIndex, 1);
  }

  recentSearches.unshift(cityName);

  if (recentSearches.length > MAX_RECENT) {
    recentSearches.pop();
  }

  renderRecentSearches();
}

function showWeather(cityWeather, saveToRecent) {
  searchError.hidden = true;
  emptyState.hidden = true;
  currentWeather.hidden = false;
  document.getElementById("weatherDetails").hidden = false;
  document.getElementById("weatherTips").hidden = false;

  locationName.textContent = cityWeather.name;
  weatherIcon.textContent = cityWeather.icon;
  temperatureValue.textContent = cityWeather.temperature;
  condition.textContent = cityWeather.conditionLabel;
  currentWeather.setAttribute("data-weather-state", cityWeather.condition);

  humidityValue.textContent = cityWeather.humidity + "%";
  windValue.textContent = cityWeather.windSpeed + " km/h";
  airQualityValue.textContent = cityWeather.airQuality;
  moodValue.textContent = cityWeather.mood;
  tipContent.textContent = cityWeather.tip;

  setTheme(cityWeather.theme);
  updatePopularCities(cityWeather.name);
  cityInput.value = cityWeather.name;

  if (saveToRecent) {
    addRecentSearch(cityWeather.name);
  }
}

function showError() {
  searchError.hidden = false;
}

function checkWeather(saveToRecent) {
  const shouldSave = saveToRecent !== false;
  const cityName = cityInput.value.trim();

  if (!cityName) {
    showError();
    return;
  }

  const cityWeather = findCityWeather(cityName);

  if (!cityWeather) {
    showError();
    return;
  }

  showWeather(cityWeather, shouldSave);
}

searchBtn.onclick = function (event) {
  event.preventDefault();
  checkWeather(true);
};

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  checkWeather(true);
});

document.querySelectorAll(".city-chip, .suggestions__item").forEach(function (el) {
  el.addEventListener("click", function () {
    const city = el.getAttribute("data-city");
    cityInput.value = city;
    checkWeather(true);
  });
});

showWeather(weatherData.tehran, false);
renderRecentSearches();
