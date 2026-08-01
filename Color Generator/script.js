const genBtn = document.querySelector("#generateBtn");
const gradBtn = document.querySelector("#gradientBtn");
const moodSelect = document.querySelector("#moodSelect");

const unlockedIcon = `
  <svg class="lock__icon lock__icon--open" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" stroke-width="1.5" />
    <path d="M7 9V6.5C7 4.57 8.57 3 10.5 3C11.9 3 13.1 3.84 13.66 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <circle cx="10" cy="13" r="1.25" fill="currentColor" />
  </svg>
`;

const lockedIcon = `
  <svg class="lock__icon lock__icon--closed" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" stroke-width="1.5" />
    <path d="M7 9V6.5C7 4.57 8.57 3 10.5 3S14 4.57 14 6.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <circle cx="10" cy="13" r="1.25" fill="currentColor" />
  </svg>
`;

const hexArticles = document.querySelectorAll(".hex");
const lockButtons = document.querySelectorAll(".lock");
const gradientCard = document.querySelector(".gradient-card");
const gradientPreview = document.querySelector("#gradientPreview");
const gradientCode = document.querySelector("#gradientCode code");
const MAX_SELECTED = 2;

/* ============================================================
   Mood → RGB channel recipes
   Each mood maps to one or more [R, G, B] ranges based on
   common color psychology / palette conventions.
   ============================================================ */
const MOOD_RECIPES = {
  // Full spectrum — no bias
  random: [
    { r: [0, 255], g: [0, 255], b: [0, 255] },
  ],

  // Warmth, energy, passion — reds / oranges / ambers
  warm: [
    { r: [200, 255], g: [80, 170], b: [0, 70] },   // orange-red
    { r: [180, 255], g: [120, 200], b: [20, 80] },  // amber-gold
    { r: [160, 230], g: [40, 100], b: [20, 60] },   // deep warm red
  ],

  // Calm, distance, ice — blues / cool cyans
  cold: [
    { r: [40, 120], g: [120, 200], b: [200, 255] }, // ice blue
    { r: [60, 140], g: [80, 160], b: [180, 255] },  // cool blue
    { r: [80, 150], g: [160, 230], b: [200, 255] }, // frosty cyan
  ],

  // Water, depth, trust — teals / sea blues
  ocean: [
    { r: [0, 60], g: [100, 180], b: [160, 230] },   // deep sea
    { r: [0, 80], g: [150, 220], b: [180, 255] },   // turquoise
    { r: [20, 90], g: [80, 150], b: [140, 210] },   // navy teal
  ],

  // Growth, earth, calm — greens / olive / moss
  nature: [
    { r: [30, 100], g: [120, 200], b: [40, 100] },  // leaf green
    { r: [60, 130], g: [100, 170], b: [30, 80] },   // olive / moss
    { r: [90, 150], g: [140, 200], b: [60, 110] },  // soft meadow
  ],

  // Dusk romance — orange, coral, rose, violet
  sunset: [
    { r: [220, 255], g: [90, 160], b: [30, 80] },   // sunset orange
    { r: [230, 255], g: [80, 140], b: [100, 170] }, // coral rose
    { r: [140, 200], g: [50, 100], b: [140, 210] }, // dusk violet
    { r: [200, 255], g: [150, 210], b: [40, 90] },  // golden hour
  ],

  // Neon night / tech — magenta, cyan, electric purple
  cyberpunk: [
    { r: [200, 255], g: [0, 60], b: [180, 255] },   // hot magenta
    { r: [0, 50], g: [220, 255], b: [200, 255] },   // electric cyan
    { r: [120, 200], g: [0, 80], b: [200, 255] },   // neon purple
    { r: [0, 80], g: [255, 255], b: [100, 180] },  // acid green-cyan
  ],

  // Soft, gentle — high lightness, low contrast
  pastel: [
    { r: [200, 255], g: [180, 240], b: [190, 245] }, // soft blush/lilac
    { r: [180, 240], g: [210, 255], b: [200, 245] }, // mint pastel
    { r: [210, 255], g: [200, 245], b: [160, 220] }, // peach pastel
    { r: [190, 240], g: [190, 235], b: [220, 255] }, // baby blue pastel
  ],

  // Elegance / wealth — gold, burgundy, champagne, deep navy
  luxury: [
    { r: [180, 230], g: [140, 190], b: [40, 100] },  // gold
    { r: [100, 160], g: [20, 60], b: [40, 80] },     // burgundy
    { r: [200, 240], g: [180, 220], b: [140, 190] }, // champagne
    { r: [10, 50], g: [20, 60], b: [70, 130] },      // deep navy
  ],

  // Nightlife energy — extreme channel contrast, high saturation
  neon: [
    { r: [230, 255], g: [0, 40], b: [180, 255] },   // neon pink
    { r: [0, 40], g: [230, 255], b: [40, 120] },    // neon green
    { r: [0, 50], g: [200, 255], b: [230, 255] },   // neon cyan
    { r: [230, 255], g: [220, 255], b: [0, 50] },   // neon yellow
    { r: [80, 160], g: [0, 40], b: [230, 255] },    // neon violet
  ],
};

function getSelectedCount() {
  return document.querySelectorAll(".hex--selected").length;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toHexPair(value) {
  return value.toString(16).padStart(2, "0").toUpperCase();
}

function rgbToHex(r, g, b) {
  return `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`;
}

function pickRecipe(mood) {
  const recipes = MOOD_RECIPES[mood] || MOOD_RECIPES.random;
  return recipes[randInt(0, recipes.length - 1)];
}

/** Build one #RRGGBB from the active mood's RGB ranges */
function generateMoodColor(mood) {
  const recipe = pickRecipe(mood);
  const r = randInt(recipe.r[0], recipe.r[1]);
  const g = randInt(recipe.g[0], recipe.g[1]);
  const b = randInt(recipe.b[0], recipe.b[1]);
  return rgbToHex(r, g, b);
}

function applyColorToHex(hex, color) {
  hex.style.setProperty("--swatch", color);
  hex.setAttribute("data-color", color);

  const codeEl = hex.querySelector(".hex__code");
  if (codeEl) codeEl.textContent = color;

  const name = hex.getAttribute("data-name") || "Color";
  const locked = hex.classList.contains("hex--locked") ? ", locked" : "";
  hex.setAttribute("aria-label", `${name}, ${color}${locked}`);
}

// Select / deselect palette hex on click (max 2 selected)
hexArticles.forEach((hex) => {
  hex.addEventListener("click", () => {
    const isSelected = hex.classList.contains("hex--selected");

    if (isSelected) {
      hex.classList.remove("hex--selected");
      return;
    }

    if (getSelectedCount() >= MAX_SELECTED) return;

    hex.classList.add("hex--selected");
  });
});

// Toggle lock on lock button click
lockButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();

    const hex = btn.closest(".hex");
    const isLocked = btn.classList.contains("lock--active");

    if (isLocked) {
      btn.classList.remove("lock--active");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Lock color");
      btn.setAttribute("title", "Lock color");
      btn.innerHTML = unlockedIcon;
      hex.classList.remove("hex--locked");
    } else {
      btn.classList.add("lock--active");
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", "Unlock color");
      btn.setAttribute("title", "Unlock color");
      btn.innerHTML = lockedIcon;
      hex.classList.add("hex--locked");
    }
  });
});

// Generate mood-based colors for unlocked hexes
genBtn.addEventListener("click", () => {
  const mood = moodSelect.value;

  hexArticles.forEach((hex) => {
    if (hex.classList.contains("hex--locked")) return;
    applyColorToHex(hex, generateMoodColor(mood));
  });
});

// Create gradient from the 2 selected hexes
gradBtn.addEventListener("click", () => {
  const selected = document.querySelectorAll(".hex--selected");

  if (selected.length !== MAX_SELECTED) return;

  const color1 = selected[0].getAttribute("data-color");
  const color2 = selected[1].getAttribute("data-color");
  const name1 = selected[0].getAttribute("data-name") || color1;
  const name2 = selected[1].getAttribute("data-name") || color2;
  const gradient = `linear-gradient(135deg, ${color1}, ${color2})`;
  const gradientCss = `linear-gradient(135deg,${color1},${color2})`;

  gradientPreview.style.background = gradient;
  gradientPreview.setAttribute(
    "aria-label",
    `Gradient preview from ${name1} to ${name2}`
  );
  gradientCode.textContent = gradientCss;

  gradientCard.classList.remove("is-hidden");
  gradientCard.removeAttribute("hidden");
});
