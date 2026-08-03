/**
 * Session Recorder — persist completed tests and user preferences.
 */

const SESSIONS_KEY = "tap_sessions";
const PREFS_KEY = "tap_preferences";

export function getPerformanceBadge(wpm) {
  if (wpm >= 90) return "Speed Demon";
  if (wpm >= 70) return "Fast Typer";
  if (wpm >= 50) return "Skilled";
  if (wpm >= 30) return "Improving";
  return "Beginner";
}

export function loadSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function persist(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function saveSession(session) {
  const sessions = loadSessions();
  sessions.unshift(session);
  // Keep a reasonable history
  persist(sessions.slice(0, 100));
  return session;
}

export function deleteSession(id) {
  const sessions = loadSessions().filter((s) => s.id !== id);
  persist(sessions);
  return sessions;
}

export function clearSessions() {
  persist([]);
}

export function createSession(payload) {
  return {
    id: `ses_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    duration: payload.duration,
    wpm: payload.wpm,
    peakWpm: payload.peakWpm,
    accuracy: payload.accuracy,
    totalKeys: payload.totalKeys,
    errors: payload.errors,
    difficulty: payload.difficulty,
    language: payload.language,
    mode: payload.mode,
    badge: getPerformanceBadge(payload.wpm)
  };
}

export function loadPreferences() {
  const defaults = {
    theme: "dark",
    language: "en",
    difficulty: "medium",
    mode: "time",
    durationSec: 60,
    wordCount: 50
  };

  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function savePreferences(prefs) {
  const current = loadPreferences();
  const next = { ...current, ...prefs };
  localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  return next;
}

export function formatSessionDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function compareTrend(currentWpm, previousWpm) {
  if (previousWpm == null) return { label: "→ Same", dir: "same" };
  if (currentWpm > previousWpm) return { label: "↑ Improved", dir: "up" };
  if (currentWpm < previousWpm) return { label: "↓ Decreased", dir: "down" };
  return { label: "→ Same", dir: "same" };
}
