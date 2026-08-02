const provinces = [
    {
      id: 1,
      name: "Tehran",
      cities: [
        "Tehran",
        "Karaj",
        "Shemiranat",
        "Varamin",
        "Damavand"
      ]
    },
    {
      id: 2,
      name: "Fars",
      cities: [
        "Shiraz",
        "Marvdasht",
        "Jahrom",
        "Fasa",
        "Lar"
      ]
    },
    {
      id: 3,
      name: "Isfahan",
      cities: [
        "Isfahan",
        "Kashan",
        "Najafabad",
        "Shahin Shahr",
        "Mobarakeh"
      ]
    },
    {
      id: 4,
      name: "East Azerbaijan",
      cities: [
        "Tabriz",
        "Maragheh",
        "Marand",
        "Ahar",
        "Bonab"
      ]
    },
    {
      id: 5,
      name: "Razavi Khorasan",
      cities: [
        "Mashhad",
        "Neyshabur",
        "Sabzevar",
        "Torbat Heydariyeh",
        "Chenaran"
      ]
    }
  ];
  
  const flights = [
    {
      id: 1,
      originProvince: "Tehran",
      originCity: "Tehran",
      destinationProvince: "Fars",
      destinationCity: "Shiraz",
      flightType: "VIP",
      departureTime: "08:30",
      date: "2026-08-15",
      price: 1450000
    },
    {
      id: 2,
      originProvince: "Tehran",
      originCity: "Tehran",
      destinationProvince: "Razavi Khorasan",
      destinationCity: "Mashhad",
      flightType: "Business",
      departureTime: "06:30",
      date: "2026-08-15",
      price: 980000
    },
    {
      id: 3,
      originProvince: "Tehran",
      originCity: "Karaj",
      destinationProvince: "East Azerbaijan",
      destinationCity: "Tabriz",
      flightType: "Economy",
      departureTime: "11:20",
      date: "2026-08-17",
      price: 620000
    },
    {
      id: 4,
      originProvince: "Fars",
      originCity: "Shiraz",
      destinationProvince: "Tehran",
      destinationCity: "Tehran",
      flightType: "VIP",
      departureTime: "14:10",
      date: "2026-08-17",
      price: 1680000
    },
    {
      id: 5,
      originProvince: "Isfahan",
      originCity: "Isfahan",
      destinationProvince: "East Azerbaijan",
      destinationCity: "Tabriz",
      flightType: "Economy",
      departureTime: "17:40",
      date: "2026-08-21",
      price: 540000
    },
    {
      id: 6,
      originProvince: "Razavi Khorasan",
      originCity: "Mashhad",
      destinationProvince: "Tehran",
      destinationCity: "Tehran",
      flightType: "Business",
      departureTime: "20:15",
      date: "2026-08-21",
      price: 1120000
    },
    {
      id: 7,
      originProvince: "East Azerbaijan",
      originCity: "Tabriz",
      destinationProvince: "Fars",
      destinationCity: "Shiraz",
      flightType: "VIP",
      departureTime: "22:50",
      date: "2026-08-25",
      price: 2100000
    },
    {
      id: 8,
      originProvince: "Tehran",
      originCity: "Shemiranat",
      destinationProvince: "Isfahan",
      destinationCity: "Kashan",
      flightType: "Economy",
      departureTime: "08:45",
      date: "2026-08-25",
      price: 380000
    },
    {
      id: 9,
      originProvince: "Fars",
      originCity: "Marvdasht",
      destinationProvince: "Razavi Khorasan",
      destinationCity: "Neyshabur",
      flightType: "Business",
      departureTime: "06:30",
      date: "2026-09-02",
      price: 1290000
    },
    {
      id: 10,
      originProvince: "Isfahan",
      originCity: "Najafabad",
      destinationProvince: "Tehran",
      destinationCity: "Varamin",
      flightType: "Economy",
      departureTime: "11:20",
      date: "2026-09-02",
      price: 420000
    },
    {
      id: 11,
      originProvince: "Tehran",
      originCity: "Damavand",
      destinationProvince: "East Azerbaijan",
      destinationCity: "Maragheh",
      flightType: "Business",
      departureTime: "14:10",
      date: "2026-08-15",
      price: 875000
    },
    {
      id: 12,
      originProvince: "Razavi Khorasan",
      originCity: "Sabzevar",
      destinationProvince: "Isfahan",
      destinationCity: "Isfahan",
      flightType: "VIP",
      departureTime: "17:40",
      date: "2026-08-17",
      price: 1950000
    },
    {
      id: 13,
      originProvince: "East Azerbaijan",
      originCity: "Marand",
      destinationProvince: "Tehran",
      destinationCity: "Karaj",
      flightType: "Economy",
      departureTime: "20:15",
      date: "2026-08-21",
      price: 510000
    },
    {
      id: 14,
      originProvince: "Fars",
      originCity: "Jahrom",
      destinationProvince: "East Azerbaijan",
      destinationCity: "Ahar",
      flightType: "Business",
      departureTime: "08:30",
      date: "2026-08-25",
      price: 1420000
    },
    {
      id: 15,
      originProvince: "Isfahan",
      originCity: "Shahin Shahr",
      destinationProvince: "Fars",
      destinationCity: "Fasa",
      flightType: "Economy",
      departureTime: "22:50",
      date: "2026-09-02",
      price: 290000
    },
    {
      id: 16,
      originProvince: "Tehran",
      originCity: "Tehran",
      destinationProvince: "Isfahan",
      destinationCity: "Isfahan",
      flightType: "VIP",
      departureTime: "06:30",
      date: "2026-08-15",
      price: 780000
    },
    {
      id: 17,
      originProvince: "Razavi Khorasan",
      originCity: "Torbat Heydariyeh",
      destinationProvince: "Fars",
      destinationCity: "Lar",
      flightType: "Economy",
      departureTime: "11:20",
      date: "2026-08-17",
      price: 1180000
    },
    {
      id: 18,
      originProvince: "East Azerbaijan",
      originCity: "Bonab",
      destinationProvince: "Razavi Khorasan",
      destinationCity: "Chenaran",
      flightType: "Business",
      departureTime: "14:10",
      date: "2026-08-21",
      price: 1560000
    },
    {
      id: 19,
      originProvince: "Fars",
      originCity: "Shiraz",
      destinationProvince: "Isfahan",
      destinationCity: "Mobarakeh",
      flightType: "VIP",
      departureTime: "17:40",
      date: "2026-08-25",
      price: 920000
    },
    {
      id: 20,
      originProvince: "Tehran",
      originCity: "Varamin",
      destinationProvince: "Razavi Khorasan",
      destinationCity: "Mashhad",
      flightType: "Economy",
      departureTime: "08:45",
      date: "2026-09-02",
      price: 740000
    },
    {
      id: 21,
      originProvince: "Isfahan",
      originCity: "Kashan",
      destinationProvince: "East Azerbaijan",
      destinationCity: "Tabriz",
      flightType: "Business",
      departureTime: "20:15",
      date: "2026-08-15",
      price: 1050000
    },
    {
      id: 22,
      originProvince: "Razavi Khorasan",
      originCity: "Mashhad",
      destinationProvince: "Fars",
      destinationCity: "Shiraz",
      flightType: "VIP",
      departureTime: "22:50",
      date: "2026-08-17",
      price: 2350000
    },
    {
      id: 23,
      originProvince: "East Azerbaijan",
      originCity: "Tabriz",
      destinationProvince: "Tehran",
      destinationCity: "Tehran",
      flightType: "Economy",
      departureTime: "06:30",
      date: "2026-08-21",
      price: 580000
    },
    {
      id: 24,
      originProvince: "Fars",
      originCity: "Lar",
      destinationProvince: "Tehran",
      destinationCity: "Shemiranat",
      flightType: "Business",
      departureTime: "11:20",
      date: "2026-08-25",
      price: 1340000
    },
    {
      id: 25,
      originProvince: "Isfahan",
      originCity: "Isfahan",
      destinationProvince: "Razavi Khorasan",
      destinationCity: "Sabzevar",
      flightType: "Economy",
      departureTime: "14:10",
      date: "2026-09-02",
      price: 860000
    },
    {
      id: 26,
      originProvince: "Tehran",
      originCity: "Karaj",
      destinationProvince: "Fars",
      destinationCity: "Marvdasht",
      flightType: "VIP",
      departureTime: "17:40",
      date: "2026-08-15",
      price: 1720000
    },
    {
      id: 27,
      originProvince: "Razavi Khorasan",
      originCity: "Neyshabur",
      destinationProvince: "East Azerbaijan",
      destinationCity: "Marand",
      flightType: "Business",
      departureTime: "08:30",
      date: "2026-08-17",
      price: 1490000
    },
    {
      id: 28,
      originProvince: "East Azerbaijan",
      originCity: "Ahar",
      destinationProvince: "Isfahan",
      destinationCity: "Shahin Shahr",
      flightType: "Economy",
      departureTime: "20:15",
      date: "2026-08-21",
      price: 670000
    },
    {
      id: 29,
      originProvince: "Fars",
      originCity: "Fasa",
      destinationProvince: "Razavi Khorasan",
      destinationCity: "Torbat Heydariyeh",
      flightType: "VIP",
      departureTime: "22:50",
      date: "2026-08-25",
      price: 2580000
    },
    {
      id: 30,
      originProvince: "Isfahan",
      originCity: "Mobarakeh",
      destinationProvince: "Tehran",
      destinationCity: "Damavand",
      flightType: "Economy",
      departureTime: "08:45",
      date: "2026-09-02",
      price: 350000
    },
    {
      id: 31,
      originProvince: "Tehran",
      originCity: "Tehran",
      destinationProvince: "East Azerbaijan",
      destinationCity: "Bonab",
      flightType: "Business",
      departureTime: "11:20",
      date: "2026-08-15",
      price: 910000
    },
    {
      id: 32,
      originProvince: "Razavi Khorasan",
      originCity: "Chenaran",
      destinationProvince: "Isfahan",
      destinationCity: "Najafabad",
      flightType: "VIP",
      departureTime: "06:30",
      date: "2026-08-21",
      price: 1880000
    },
    {
      id: 33,
      originProvince: "East Azerbaijan",
      originCity: "Maragheh",
      destinationProvince: "Fars",
      destinationCity: "Jahrom",
      flightType: "Economy",
      departureTime: "14:10",
      date: "2026-08-25",
      price: 990000
    },
    {
      id: 34,
      originProvince: "Fars",
      originCity: "Shiraz",
      destinationProvince: "Razavi Khorasan",
      destinationCity: "Mashhad",
      flightType: "Business",
      departureTime: "17:40",
      date: "2026-09-02",
      price: 1610000
    },
    {
      id: 35,
      originProvince: "Isfahan",
      originCity: "Kashan",
      destinationProvince: "Tehran",
      destinationCity: "Tehran",
      flightType: "Economy",
      departureTime: "20:15",
      date: "2026-08-17",
      price: 250000
    }
  ];

/* --------------------------------------------------------------------------
   Province & city select boxes
   -------------------------------------------------------------------------- */

const originProvinceSelect = document.getElementById("origin-province");
const originCitySelect = document.getElementById("origin-city");
const destinationProvinceSelect = document.getElementById("destination-province");
const destinationCitySelect = document.getElementById("destination-city");

function clearSelect(selectEl, placeholderText) {
  selectEl.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = placeholderText;
  selectEl.appendChild(placeholder);
}

function populateProvinces(selectEl) {
  provinces.forEach((province) => {
    const option = document.createElement("option");
    option.value = province.name;
    option.textContent = province.name;
    selectEl.appendChild(option);
  });
}

function populateCities(selectEl, provinceName, placeholderText) {
  clearSelect(selectEl, placeholderText);

  const province = provinces.find((item) => item.name === provinceName);
  if (!province) {
    selectEl.disabled = true;
    return;
  }

  province.cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    selectEl.appendChild(option);
  });

  selectEl.disabled = false;
}

populateProvinces(originProvinceSelect);
populateProvinces(destinationProvinceSelect);

originProvinceSelect.addEventListener("change", () => {
  populateCities(
    originCitySelect,
    originProvinceSelect.value,
    "Select origin city"
  );
  syncFavoriteStar();
});

destinationProvinceSelect.addEventListener("change", () => {
  populateCities(
    destinationCitySelect,
    destinationProvinceSelect.value,
    "Select destination city"
  );
  syncFavoriteStar();
});

originCitySelect.addEventListener("change", syncFavoriteStar);
destinationCitySelect.addEventListener("change", syncFavoriteStar);

/* --------------------------------------------------------------------------
   Favorite routes
   -------------------------------------------------------------------------- */

const favoriteToggle = document.getElementById("favorite-toggle");
const favoriteToggleStar = favoriteToggle.querySelector(".favorite-toggle__star");
const favoriteToggleText = favoriteToggle.querySelector(".favorite-toggle__text");
const favoritesSection = document.getElementById("favorites");
const favoriteList = document.getElementById("favorite-list");

const favoriteRoutes = [];

function getSelectedRoute() {
  return {
    originProvince: originProvinceSelect.value,
    originCity: originCitySelect.value,
    destinationProvince: destinationProvinceSelect.value,
    destinationCity: destinationCitySelect.value,
  };
}

function isRouteComplete(route) {
  return Boolean(
    route.originProvince &&
      route.originCity &&
      route.destinationProvince &&
      route.destinationCity
  );
}

function isSameRoute(a, b) {
  return (
    a.originProvince === b.originProvince &&
    a.originCity === b.originCity &&
    a.destinationProvince === b.destinationProvince &&
    a.destinationCity === b.destinationCity
  );
}

function findFavoriteIndex(route) {
  return favoriteRoutes.findIndex((item) => isSameRoute(item, route));
}

function setFavoriteToggleActive(isActive) {
  favoriteToggle.classList.toggle("is-active", isActive);
  favoriteToggle.setAttribute("aria-pressed", String(isActive));
  favoriteToggleStar.textContent = isActive ? "★" : "☆";
  favoriteToggleText.textContent = isActive
    ? "Saved as favorite"
    : "Save route as favorite";
}

function syncFavoriteStar() {
  const route = getSelectedRoute();

  if (!isRouteComplete(route)) {
    setFavoriteToggleActive(false);
    return;
  }

  setFavoriteToggleActive(findFavoriteIndex(route) !== -1);
}

function updateFavoritesSectionVisibility() {
  const hasFavorites = favoriteRoutes.length > 0;
  favoritesSection.classList.toggle("is-hidden", !hasFavorites);
  favoritesSection.hidden = !hasFavorites;
}

function createFavoriteChip(route) {
  const item = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "favorite-chip";
  button.dataset.originProvince = route.originProvince;
  button.dataset.originCity = route.originCity;
  button.dataset.destinationProvince = route.destinationProvince;
  button.dataset.destinationCity = route.destinationCity;

  button.innerHTML = `
    <span class="favorite-chip__star" aria-hidden="true">★</span>
    <span class="favorite-chip__route">
      <span class="favorite-chip__origin">${route.originCity}</span>
      <span class="favorite-chip__arrow" aria-hidden="true">→</span>
      <span class="favorite-chip__destination">${route.destinationCity}</span>
    </span>
  `;

  button.addEventListener("click", () => {
    applyFavoriteRoute(route);
  });

  item.appendChild(button);
  return item;
}

function renderFavoriteRoutes() {
  favoriteList.innerHTML = "";

  favoriteRoutes.forEach((route) => {
    favoriteList.appendChild(createFavoriteChip(route));
  });

  updateFavoritesSectionVisibility();
  syncFavoriteStar();
}

function applyFavoriteRoute(route) {
  originProvinceSelect.value = route.originProvince;
  populateCities(originCitySelect, route.originProvince, "Select origin city");
  originCitySelect.value = route.originCity;

  destinationProvinceSelect.value = route.destinationProvince;
  populateCities(
    destinationCitySelect,
    route.destinationProvince,
    "Select destination city"
  );
  destinationCitySelect.value = route.destinationCity;

  syncFavoriteStar();
  document.getElementById("search").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function handleFavoriteToggle() {
  const route = getSelectedRoute();

  if (!isRouteComplete(route)) {
    alert("Please select origin and destination province and city first.");
    setFavoriteToggleActive(false);
    return;
  }

  const existingIndex = findFavoriteIndex(route);

  if (existingIndex !== -1) {
    favoriteRoutes.splice(existingIndex, 1);
  } else {
    favoriteRoutes.push({ ...route });
  }

  renderFavoriteRoutes();
}

favoriteToggle.addEventListener("click", handleFavoriteToggle);

/* --------------------------------------------------------------------------
   Flight search
   -------------------------------------------------------------------------- */

const searchForm = document.getElementById("search-form");
const searchBtn = document.getElementById("search-btn");
const travelDateInput = document.getElementById("travel-date");
const quickDestinationInput = document.getElementById("quick-destination");
const resultsSection = document.getElementById("results");
const ticketList = document.getElementById("ticket-list");
const emptyState = document.getElementById("empty-state");
const resultsCount = document.getElementById("results-count");
const resultsFilters = document.getElementById("results-filters");

let currentFlights = [];
let activeFilter = "all";

function formatPrice(price) {
  return price.toLocaleString("en-US");
}

function getBadgeClass(flightType) {
  return `badge badge--${flightType.toLowerCase()}`;
}

function createTicketCard(flight) {
  const article = document.createElement("article");
  article.className = "ticket-card";
  article.setAttribute("role", "listitem");
  article.dataset.ticketId = flight.id;
  article.dataset.flightType = flight.flightType.toLowerCase();

  article.innerHTML = `
    <div class="ticket-card__top">
      <div class="ticket-route">
        <span class="ticket-city ticket-city--origin">${flight.originCity}</span>
        <span class="ticket-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span class="ticket-city ticket-city--destination">${flight.destinationCity}</span>
      </div>
      <span class="${getBadgeClass(flight.flightType)}">${flight.flightType}</span>
    </div>
    <div class="ticket-card__meta">
      <div class="ticket-meta-item">
        <span class="ticket-meta-label">Departure</span>
        <time class="ticket-time" datetime="${flight.date}T${flight.departureTime}">${flight.departureTime}</time>
      </div>
      <div class="ticket-meta-item ticket-meta-item--price">
        <span class="ticket-meta-label">Price</span>
        <p class="ticket-price">
          <span class="ticket-price__value">${formatPrice(flight.price)}</span>
          <span class="ticket-price__currency">Toman</span>
        </p>
      </div>
    </div>
    <button type="button" class="btn btn-secondary btn-block reserve-btn">Reserve</button>
  `;

  return article;
}

function showResultsSection() {
  resultsSection.classList.remove("is-hidden");
  resultsSection.hidden = false;
}

function renderFlights(matchedFlights) {
  ticketList.innerHTML = "";
  resultsCount.textContent = matchedFlights.length;

  if (matchedFlights.length === 0) {
    ticketList.classList.add("is-hidden");
    emptyState.classList.remove("is-hidden");
    emptyState.hidden = false;
    return;
  }

  emptyState.classList.add("is-hidden");
  emptyState.hidden = true;
  ticketList.classList.remove("is-hidden");

  matchedFlights.forEach((flight) => {
    ticketList.appendChild(createTicketCard(flight));
  });
}

function getFilteredFlights(filterType) {
  if (filterType === "all") {
    return currentFlights;
  }

  return currentFlights.filter(
    (flight) => flight.flightType.toLowerCase() === filterType
  );
}

function setActiveFilterButton(filterType) {
  const filterButtons = resultsFilters.querySelectorAll(".chip--filter");

  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === filterType);
  });
}

function applyFlightTypeFilter(filterType) {
  activeFilter = filterType;
  setActiveFilterButton(filterType);
  renderFlights(getFilteredFlights(filterType));
}

function findFlights(criteria) {
  return flights.filter(
    (flight) =>
      flight.originProvince === criteria.originProvince &&
      flight.originCity === criteria.originCity &&
      flight.destinationProvince === criteria.destinationProvince &&
      flight.destinationCity === criteria.destinationCity &&
      flight.date === criteria.date
  );
}

function findFlightsByDestination(destinationQuery) {
  const query = destinationQuery.trim().toLowerCase();

  return flights.filter(
    (flight) => flight.destinationCity.toLowerCase() === query
  );
}

function handleSearch() {
  const quickDestination = quickDestinationInput.value.trim();
  let matchedFlights;
  let historyEntry;

  if (quickDestination) {
    matchedFlights = findFlightsByDestination(quickDestination);
    historyEntry = {
      type: "quick",
      originCity: "Any",
      destinationCity: quickDestination,
      quickDestination,
      date: travelDateInput.value || null,
      searchedAt: new Date(),
    };
  } else {
    const originProvince = originProvinceSelect.value;
    const originCity = originCitySelect.value;
    const destinationProvince = destinationProvinceSelect.value;
    const destinationCity = destinationCitySelect.value;
    const travelDate = travelDateInput.value;

    if (
      !originProvince ||
      !originCity ||
      !destinationProvince ||
      !destinationCity ||
      !travelDate
    ) {
      alert("Please fill origin, destination, and travel date.");
      return;
    }

    matchedFlights = findFlights({
      originProvince,
      originCity,
      destinationProvince,
      destinationCity,
      date: travelDate,
    });

    historyEntry = {
      type: "route",
      originProvince,
      originCity,
      destinationProvince,
      destinationCity,
      date: travelDate,
      searchedAt: new Date(),
    };
  }

  addToSearchHistory(historyEntry);

  currentFlights = matchedFlights;
  activeFilter = "all";
  setActiveFilterButton("all");
  showResultsSection();
  renderFlights(currentFlights);
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

resultsFilters.addEventListener("click", (event) => {
  const filterButton = event.target.closest(".chip--filter");
  if (!filterButton || !resultsFilters.contains(filterButton)) return;

  applyFlightTypeFilter(filterButton.dataset.filter);
});

searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  handleSearch();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSearch();
});

/* --------------------------------------------------------------------------
   Recent searches (max 3)
   -------------------------------------------------------------------------- */

const historySection = document.getElementById("history");
const historyList = document.getElementById("history-list");
const searchHistory = [];
const MAX_SEARCH_HISTORY = 3;

function formatSearchTime(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isSameHistoryEntry(a, b) {
  if (a.type !== b.type) return false;

  if (a.type === "quick") {
    return a.quickDestination.toLowerCase() === b.quickDestination.toLowerCase();
  }

  return (
    a.originProvince === b.originProvince &&
    a.originCity === b.originCity &&
    a.destinationProvince === b.destinationProvince &&
    a.destinationCity === b.destinationCity &&
    a.date === b.date
  );
}

function updateHistorySectionVisibility() {
  const hasHistory = searchHistory.length > 0;
  historySection.classList.toggle("is-hidden", !hasHistory);
  historySection.hidden = !hasHistory;
}

function createHistoryItem(entry, index) {
  const item = document.createElement("li");
  item.className = "history-item";
  item.dataset.historyId = String(index + 1);

  const timeLabel = formatSearchTime(entry.searchedAt);
  const dateHint = entry.date ? ` · ${entry.date}` : "";

  item.innerHTML = `
    <span class="history-item__marker" aria-hidden="true"></span>
    <button type="button" class="history-item__content glass">
      <div class="history-item__route">
        <span class="history-item__origin">${entry.originCity}</span>
        <span class="history-item__arrow" aria-hidden="true">→</span>
        <span class="history-item__destination">${entry.destinationCity}</span>
      </div>
      <time class="history-item__time" datetime="${entry.searchedAt.toISOString()}">${timeLabel}${dateHint}</time>
    </button>
  `;

  item.querySelector(".history-item__content").addEventListener("click", () => {
    applyHistoryEntry(entry);
  });

  return item;
}

function renderSearchHistory() {
  historyList.innerHTML = "";

  searchHistory.forEach((entry, index) => {
    historyList.appendChild(createHistoryItem(entry, index));
  });

  updateHistorySectionVisibility();
}

function addToSearchHistory(entry) {
  const existingIndex = searchHistory.findIndex((item) =>
    isSameHistoryEntry(item, entry)
  );

  if (existingIndex !== -1) {
    searchHistory.splice(existingIndex, 1);
  }

  searchHistory.unshift(entry);

  if (searchHistory.length > MAX_SEARCH_HISTORY) {
    searchHistory.length = MAX_SEARCH_HISTORY;
  }

  renderSearchHistory();
}

function applyHistoryEntry(entry) {
  if (entry.type === "quick") {
    quickDestinationInput.value = entry.quickDestination;
  } else {
    quickDestinationInput.value = "";
    originProvinceSelect.value = entry.originProvince;
    populateCities(originCitySelect, entry.originProvince, "Select origin city");
    originCitySelect.value = entry.originCity;

    destinationProvinceSelect.value = entry.destinationProvince;
    populateCities(
      destinationCitySelect,
      entry.destinationProvince,
      "Select destination city"
    );
    destinationCitySelect.value = entry.destinationCity;

    if (entry.date) {
      travelDateInput.value = entry.date;
    }

    syncFavoriteStar();
  }

  handleSearch();
}
