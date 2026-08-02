/* Climate Lab — Temperature conversion & live theme */

const inputs = {
  celsius: document.getElementById("celsius-input"),
  fahrenheit: document.getElementById("fahrenheit-input"),
  kelvin: document.getElementById("kelvin-input"),
};

const errors = {
  celsius: document.getElementById("celsius-error"),
  fahrenheit: document.getElementById("fahrenheit-error"),
  kelvin: document.getElementById("kelvin-error"),
};

const liveResult = document.getElementById("live-result");
const liveStatus = document.getElementById("live-result-status");
const resultCelsius = document.getElementById("result-celsius");
const resultFahrenheit = document.getElementById("result-fahrenheit");
const resultKelvin = document.getElementById("result-kelvin");
const thermometer = document.getElementById("thermometer");
const thermometerFill = document.getElementById("thermometer-fill");
const thermometerBulb = document.getElementById("thermometer-bulb");

const THERMO_MIN = -25;
const THERMO_MAX = 100;

/**
 * Color stops for a natural temperature gradient (°C):
 * deep cold → blue → blue/green near 0 → green nature → green/red near 25 → red → dark red ≥50
 */
const THEME_STOPS = [
  {
    t: -40,
    from: [8, 47, 73],
    mid: [12, 74, 110],
    to: [3, 105, 161],
    glow1: [56, 189, 248, 0.45],
    glow2: [186, 230, 253, 0.3],
    shadow: [3, 105, 161, 0.28],
    label: "Freezing",
    status: "cold",
  },
  {
    t: 0,
    from: [14, 116, 144],
    mid: [8, 145, 178],
    to: [34, 197, 94],
    glow1: [56, 189, 248, 0.35],
    glow2: [74, 222, 128, 0.28],
    shadow: [8, 145, 178, 0.24],
    label: "Cold",
    status: "cold",
  },
  {
    t: 12.5,
    from: [20, 83, 45],
    mid: [22, 163, 74],
    to: [74, 222, 128],
    glow1: [74, 222, 128, 0.4],
    glow2: [187, 247, 208, 0.25],
    shadow: [22, 163, 74, 0.24],
    label: "Nature",
    status: "nature",
  },
  {
    t: 25,
    from: [63, 98, 18],
    mid: [132, 204, 22],
    to: [234, 179, 8],
    glow1: [163, 230, 53, 0.35],
    glow2: [251, 191, 36, 0.3],
    shadow: [132, 204, 22, 0.22],
    label: "Mild",
    status: "nature",
  },
  {
    t: 37.5,
    from: [154, 52, 18],
    mid: [234, 88, 12],
    to: [239, 68, 68],
    glow1: [251, 146, 60, 0.4],
    glow2: [248, 113, 113, 0.3],
    shadow: [234, 88, 12, 0.26],
    label: "Warm",
    status: "hot",
  },
  {
    t: 50,
    from: [69, 10, 10],
    mid: [127, 29, 29],
    to: [185, 28, 28],
    glow1: [220, 38, 38, 0.4],
    glow2: [127, 29, 29, 0.35],
    shadow: [127, 29, 29, 0.32],
    label: "Hot",
    status: "hot",
  },
  {
    t: 100,
    from: [23, 5, 5],
    mid: [45, 8, 8],
    to: [69, 10, 10],
    glow1: [127, 29, 29, 0.45],
    glow2: [69, 10, 10, 0.4],
    shadow: [45, 8, 8, 0.4],
    label: "Extreme",
    status: "hot",
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpChannel(a, b, t) {
  return Math.round(lerp(a, b, t));
}

function mixColor(a, b, t) {
  return a.map((channel, i) => {
    const mixed = lerp(channel, b[i], t);
    // Alpha stays fractional; RGB channels are rounded
    return i === 3 ? mixed : Math.round(mixed);
  });
}

function rgb(channels) {
  const [r, g, b] = channels;
  return `rgb(${r}, ${g}, ${b})`;
}

function rgba(channels) {
  const [r, g, b, a] = channels;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "";
  const rounded = Math.round(value * 100) / 100;
  return String(rounded);
}

function parseTemperature(raw) {
  const trimmed = String(raw).trim().replace(",", ".");
  if (trimmed === "" || trimmed === "-" || trimmed === "." || trimmed === "-.") {
    return { empty: true };
  }

  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return { invalid: true };
  }

  return { value };
}

function setFieldError(unit, isError) {
  const input = inputs[unit];
  const errorEl = errors[unit];

  input.classList.toggle("input-error", isError);
  input.setAttribute("aria-invalid", isError ? "true" : "false");

  if (errorEl) {
    errorEl.hidden = !isError;
  }
}

function clearFieldErrors() {
  Object.keys(inputs).forEach((unit) => setFieldError(unit, false));
}

function getThemeForCelsius(celsius) {
  const temp = clamp(celsius, THEME_STOPS[0].t, THEME_STOPS[THEME_STOPS.length - 1].t);

  let start = THEME_STOPS[0];
  let end = THEME_STOPS[THEME_STOPS.length - 1];

  for (let i = 0; i < THEME_STOPS.length - 1; i += 1) {
    if (temp >= THEME_STOPS[i].t && temp <= THEME_STOPS[i + 1].t) {
      start = THEME_STOPS[i];
      end = THEME_STOPS[i + 1];
      break;
    }
  }

  const span = end.t - start.t || 1;
  const t = (temp - start.t) / span;

  return {
    from: mixColor(start.from, end.from, t),
    mid: mixColor(start.mid, end.mid, t),
    to: mixColor(start.to, end.to, t),
    glow1: mixColor(start.glow1, end.glow1, t),
    glow2: mixColor(start.glow2, end.glow2, t),
    shadow: mixColor(start.shadow, end.shadow, t),
    label: t < 0.5 ? start.label : end.label,
    status: t < 0.5 ? start.status : end.status,
  };
}

function darkenRgb(channels, amount) {
  return channels.map((channel) => Math.round(channel * (1 - amount)));
}

function applyLiveTheme(celsius) {
  const theme = getThemeForCelsius(celsius);

  liveResult.style.setProperty("--result-from", rgb(theme.from));
  liveResult.style.setProperty("--result-mid", rgb(theme.mid));
  liveResult.style.setProperty("--result-to", rgb(theme.to));
  liveResult.style.setProperty("--result-glow-1", rgba(theme.glow1));
  liveResult.style.setProperty("--result-glow-2", rgba(theme.glow2));
  liveResult.style.setProperty("--result-shadow", rgba(theme.shadow));
  liveResult.dataset.status = theme.status;
  liveStatus.textContent = `Live conversion · ${theme.label}`;
}

function updateThermometer(celsius) {
  const theme = getThemeForCelsius(celsius);
  const fillPercent =
    (clamp(celsius, THERMO_MIN, THERMO_MAX) - THERMO_MIN) /
    (THERMO_MAX - THERMO_MIN) *
    100;

  const liquid = theme.mid;
  const liquidDeep = darkenRgb(theme.to, 0.15);

  thermometerFill.style.height = `${fillPercent}%`;
  thermometerFill.style.setProperty("--fill-color", rgb(liquid));
  thermometerFill.style.setProperty("--fill-color-deep", rgb(liquidDeep));

  thermometerBulb.style.setProperty("--bulb-color", rgb(liquid));
  thermometerBulb.style.setProperty("--bulb-color-deep", rgb(liquidDeep));

  thermometer.setAttribute(
    "aria-label",
    `Thermometer showing ${formatNumber(celsius)} degrees Celsius`
  );
}

function updateLiveResult(celsius, fahrenheit, kelvin) {
  resultCelsius.textContent = formatNumber(celsius);
  resultFahrenheit.textContent = formatNumber(fahrenheit);
  resultKelvin.textContent = formatNumber(kelvin);
  applyLiveTheme(celsius);
  updateThermometer(celsius);
}

function convertFromCelsius(celsius) {
  return {
    celsius,
    fahrenheit: (celsius * 9) / 5 + 32,
    kelvin: celsius + 273.15,
  };
}

function convertFromFahrenheit(fahrenheit) {
  const celsius = ((fahrenheit - 32) * 5) / 9;
  return convertFromCelsius(celsius);
}

function convertFromKelvin(kelvin) {
  const celsius = kelvin - 273.15;
  return convertFromCelsius(celsius);
}

function onTemperatureChange(source) {
  const parsed = parseTemperature(inputs[source].value);

  if (parsed.empty) {
    setFieldError(source, false);
    return;
  }

  if (parsed.invalid) {
    setFieldError(source, true);
    return;
  }

  if (source === "kelvin" && parsed.value < 0) {
    setFieldError(source, true);
    return;
  }

  clearFieldErrors();

  let temps;
  if (source === "celsius") {
    temps = convertFromCelsius(parsed.value);
  } else if (source === "fahrenheit") {
    temps = convertFromFahrenheit(parsed.value);
  } else {
    temps = convertFromKelvin(parsed.value);
  }

  if (source !== "celsius") {
    inputs.celsius.value = formatNumber(temps.celsius);
  }
  if (source !== "fahrenheit") {
    inputs.fahrenheit.value = formatNumber(temps.fahrenheit);
  }
  if (source !== "kelvin") {
    inputs.kelvin.value = formatNumber(temps.kelvin);
  }

  updateLiveResult(temps.celsius, temps.fahrenheit, temps.kelvin);
}

function setCompareFieldError(input, errorEl, isError) {
  input.classList.toggle("input-error", isError);
  if (isError) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
  if (errorEl) {
    errorEl.hidden = !isError;
  }
}

function startComparison() {
  const tempAInput = document.getElementById("temp-a-input");
  const tempBInput = document.getElementById("temp-b-input");
  const tempAError = document.getElementById("temp-a-error");
  const tempBError = document.getElementById("temp-b-error");
  const resultText = document.getElementById("comparison-result-text");

  const parsedA = parseTemperature(tempAInput.value);
  const parsedB = parseTemperature(tempBInput.value);

  const aInvalid = parsedA.empty || parsedA.invalid;
  const bInvalid = parsedB.empty || parsedB.invalid;

  setCompareFieldError(tempAInput, tempAError, aInvalid);
  setCompareFieldError(tempBInput, tempBError, bInvalid);

  if (aInvalid || bInvalid) {
    resultText.textContent = "Please enter valid numbers for both temperatures.";
    return;
  }

  // Keep inputs in their normal style after a successful compare
  setCompareFieldError(tempAInput, tempAError, false);
  setCompareFieldError(tempBInput, tempBError, false);

  const tempA = parsedA.value;
  const tempB = parsedB.value;
  const diff = Math.round(Math.abs(tempB - tempA) * 100) / 100;

  // Always keep the same sentence shape so the result panel look stays consistent
  if (diff === 0) {
    resultText.textContent = "Temperature A and Temperature B are equal.";
  } else if (tempB > tempA) {
    resultText.textContent = `Temperature B is ${formatNumber(diff)}°C hotter than Temperature A.`;
  } else {
    resultText.textContent = `Temperature B is ${formatNumber(diff)}°C colder than Temperature A.`;
  }
}

// Expose for inline onchange / oninput / onclick handlers
window.onTemperatureChange = onTemperatureChange;
window.startComparison = startComparison;

// Initial theme for the placeholder live values (25°C)
applyLiveTheme(25);
updateThermometer(25);
