/**
 * App orchestrator — wires Typing Engine, Analytics, Errors, Sessions to the UI.
 */

import { TypingEngine, EngineStatus } from "./typing-engine.js";
import { Analytics } from "./analytics.js";
import { ErrorTracker } from "./error-tracker.js";
import {
  loadPreferences,
  savePreferences,
  saveSession,
  createSession,
  loadSessions,
  deleteSession,
  formatSessionDate,
  compareTrend,
  getPerformanceBadge
} from "./session-manager.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const prefs = loadPreferences();
const analytics = new Analytics();
const errors = new ErrorTracker();
const accuracyHistory = [];

let lastUiSecond = -1;
let celebrationTimer = null;

const engine = new TypingEngine({
  onChange: handleEngineChange,
  onTick: handleEngineTick,
  onFinish: handleEngineFinish
});

function init() {
  engine.configure(prefs);
  bindControls();
  bindTypingSurface();
  applyPreferencesToUi(prefs);
  renderAll(engine.getSnapshot(), analytics.getSnapshot(), errors.getSnapshot());
  renderSessions();
  updateModePanels();
}

function bindControls() {
  $$("[data-pref]").forEach((el) => {
    el.addEventListener("change", () => {
      const key = el.dataset.pref;
      let value = el.type === "radio" || el.tagName === "SELECT" ? el.value : el.value;

      if (key === "durationSec" || key === "wordCount") {
        value = Number(value);
      }

      const next = savePreferences({ [key]: value });
      Object.assign(prefs, next);

      if (["difficulty", "language", "mode", "durationSec", "wordCount"].includes(key)) {
        if (key === "mode") updateModePanels();
        softReconfigure();
      }
    });
  });

  $("#btn-start")?.addEventListener("click", () => {
    focusTyping();
    if (engine.status === EngineStatus.IDLE) {
      // Waiting for first key — nudge focus
      setStatusLabel("Ready — start typing");
    } else if (engine.status === EngineStatus.PAUSED) {
      engine.resume();
      focusTyping();
    } else if (engine.status === EngineStatus.FINISHED) {
      softReconfigure();
      focusTyping();
    }
  });

  $("#btn-pause")?.addEventListener("click", () => {
    if (engine.status === EngineStatus.RUNNING) engine.pause();
    else if (engine.status === EngineStatus.PAUSED) {
      engine.resume();
      focusTyping();
    }
  });

  $("#btn-restart")?.addEventListener("click", () => {
    softReconfigure();
    focusTyping();
  });

  $("#btn-retry")?.addEventListener("click", () => {
    closeResultModal();
    softReconfigure();
    focusTyping();
  });

  $("#btn-new-test")?.addEventListener("click", () => {
    closeResultModal();
    softReconfigure();
    focusTyping();
  });

  $("#btn-view-sessions")?.addEventListener("click", () => {
    closeResultModal();
    document.getElementById("sessions")?.scrollIntoView({ behavior: "smooth" });
  });

  $("#session-filter")?.addEventListener("change", renderSessions);
  $("#session-sort")?.addEventListener("change", renderSessions);

  $("#sessions-list")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-delete-session]");
    if (!btn) return;
    deleteSession(btn.dataset.deleteSession);
    renderSessions();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") return;
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || tag === "BUTTON") {
      // Allow typing surface specifically
      if (!e.target.classList.contains("typing-surface")) return;
    }

    if ($("#result-modal")?.classList.contains("is-open")) return;

    const handled = engine.handleKey(e.key, e);
    if (handled) e.preventDefault();
  });
}

function bindTypingSurface() {
  const surface = $("#typing-surface");
  if (!surface) return;
  surface.addEventListener("click", focusTyping);
}

function focusTyping() {
  $("#typing-surface")?.focus();
}

function softReconfigure() {
  analytics.reset();
  errors.reset();
  accuracyHistory.length = 0;
  lastUiSecond = -1;
  engine.configure({
    difficulty: prefs.difficulty,
    language: prefs.language,
    mode: prefs.mode,
    durationSec: prefs.durationSec,
    wordCount: prefs.wordCount
  });
  hideCelebration();
  $("#best-card")?.classList.remove("is-record");
}

function updateModePanels() {
  const mode = prefs.mode;
  $("#time-options")?.classList.toggle("is-hidden", mode !== "time");
  $("#word-options")?.classList.toggle("is-hidden", mode !== "words");
}

function applyPreferencesToUi(p) {
  $$(`[data-pref="difficulty"]`).forEach((el) => {
    el.checked = el.value === p.difficulty;
  });
  $$(`[data-pref="language"]`).forEach((el) => {
    el.checked = el.value === p.language;
  });
  $$(`[data-pref="mode"]`).forEach((el) => {
    el.checked = el.value === p.mode;
  });
  $$(`[data-pref="durationSec"]`).forEach((el) => {
    el.checked = Number(el.value) === Number(p.durationSec);
  });
  $$(`[data-pref="wordCount"]`).forEach((el) => {
    el.checked = Number(el.value) === Number(p.wordCount);
  });
}

function handleEngineChange(snapshot) {
  const prevTypedLen = errors._lastTyped.length;
  errors.observe({
    targetText: snapshot.targetText,
    typed: snapshot.typed,
    elapsedSec: snapshot.elapsedSec
  });

  // Detect new wrong char for live feedback already handled in observe
  if (snapshot.typed.length !== prevTypedLen || snapshot.status !== EngineStatus.IDLE) {
    analytics.update(snapshot);
  }

  renderAll(snapshot, analytics.getSnapshot(), errors.getSnapshot());
}

function handleEngineTick(snapshot) {
  const metrics = analytics.update(snapshot);
  if (snapshot.elapsedSec !== lastUiSecond) {
    lastUiSecond = snapshot.elapsedSec;
    accuracyHistory.push(metrics.accuracy);
  }
  renderMetrics(metrics);
  renderTimer(snapshot);
  renderProgress(snapshot);
  renderStatus(snapshot);
  renderErrorPanels(errors.getSnapshot(), metrics);
}

function handleEngineFinish(snapshot) {
  const finalErrors = errors.finalize({
    targetText: snapshot.targetText,
    typed: snapshot.typed,
    elapsedSec: snapshot.elapsedSec
  });
  const finalMetrics = analytics.finalize(snapshot);

  const session = createSession({
    duration: snapshot.elapsedSec,
    wpm: finalMetrics.currentWpm,
    peakWpm: finalMetrics.peakWpm,
    accuracy: finalMetrics.accuracy,
    totalKeys: snapshot.totalKeystrokes,
    errors: finalErrors.totalMistakes,
    difficulty: snapshot.difficulty,
    language: snapshot.language,
    mode: snapshot.mode
  });
  saveSession(session);
  renderSessions();

  renderAll(snapshot, finalMetrics, finalErrors);
  openResultModal(snapshot, finalMetrics, session);

  if (finalMetrics.isNewBest) {
    showCelebration(finalMetrics.bestWpm);
    $("#best-card")?.classList.add("is-record");
  }
}

function renderAll(snapshot, metrics, errorSnap) {
  renderPrompt(snapshot);
  renderMetrics(metrics);
  renderTimer(snapshot);
  renderProgress(snapshot);
  renderStatus(snapshot);
  renderLiveStrip(snapshot, metrics);
  renderErrorPanels(errorSnap, metrics);
  renderPauseButton(snapshot);
}

function renderPrompt(snapshot) {
  const el = $("#prompt-text");
  if (!el) return;

  el.classList.toggle("prompt-text--rtl", snapshot.isRtl);
  el.dir = snapshot.isRtl ? "rtl" : "ltr";
  el.lang = snapshot.language;

  const chars = [];
  const target = snapshot.targetText;
  const typed = snapshot.typed;

  for (let i = 0; i < target.length; i += 1) {
    let cls = "char";
    if (target[i] === " ") cls += " char--space";
    if (i < typed.length) {
      cls += typed[i] === target[i] ? " char--correct" : " char--incorrect";
    } else if (i === typed.length) {
      cls += " char--current";
    }
    chars.push(`<span class="${cls}">${escapeHtml(target[i])}</span>`);
  }

  // Extra typed beyond target
  for (let i = target.length; i < typed.length; i += 1) {
    chars.push(`<span class="char char--incorrect">${escapeHtml(typed[i])}</span>`);
  }

  el.innerHTML = chars.join("");
}

function escapeHtml(ch) {
  // Keep normal spaces so the prompt can wrap across lines
  if (ch === " ") return " ";
  if (ch === "&") return "&amp;";
  if (ch === "<") return "&lt;";
  if (ch === ">") return "&gt;";
  return ch;
}

function renderMetrics(metrics) {
  setText("#metric-current-wpm", metrics.currentWpm);
  setText("#metric-average-wpm", metrics.averageWpm);
  setText("#metric-peak-wpm", metrics.peakWpm);
  setText("#metric-best-wpm", metrics.bestWpm);
  setText("#metric-cpm", metrics.cpm);
  setText("#metric-accuracy", `${metrics.accuracy}%`);
  setText("#metric-correct", metrics.correctCharacters);
  setText("#metric-incorrect", metrics.incorrectCharacters);
  setText("#metric-backspaces", metrics.backspaces);
  setText("#metric-rating-live", metrics.rating);
  setText("#hero-wpm", metrics.currentWpm);
  setText("#hero-acc", `${metrics.accuracy}%`);
  setText("#hero-best", metrics.bestWpm);
  setText("#live-chars-dup", metrics.totalTypedCharacters);

  const ratingEl = $("#metric-rating-live");
  if (ratingEl) {
    ratingEl.className = `rating-panel__value rating ${ratingClass(metrics.rating)}`;
  }

  const ring = $("#accuracy-ring");
  if (ring) {
    ring.style.setProperty("--ring-progress", `${Math.min(100, metrics.accuracy)}%`);
  }

  const wpmRing = $("#wpm-ring");
  if (wpmRing) {
    const pct = metrics.bestWpm > 0
      ? Math.min(100, Math.round((metrics.currentWpm / metrics.bestWpm) * 100))
      : Math.min(100, metrics.currentWpm);
    wpmRing.style.setProperty("--ring-progress", `${pct}%`);
    setText("#wpm-ring-value", `${pct}%`);
  }

  updateRatingScale(metrics.rating);
}

function updateRatingScale(rating) {
  const order = ["Perfect", "Excellent", "Good", "Average", "Needs Improvement"];
  const idx = order.indexOf(rating);
  $$("#rating-scale li").forEach((li, i) => {
    li.classList.toggle("is-active", i === idx);
    li.classList.toggle("is-done", i < idx);
  });
}

function renderTimer(snapshot) {
  if (snapshot.mode === "time") {
    const rem = snapshot.remainingSec ?? snapshot.durationSec;
    setText("#engine-timer", formatTime(rem));
  } else {
    setText("#engine-timer", formatTime(snapshot.elapsedSec));
  }
}

function formatTime(totalSec) {
  const s = Math.max(0, Number(totalSec) || 0);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function renderProgress(snapshot) {
  const pct = Math.round(snapshot.progress);
  setText("#progress-value", `${pct}%`);
  const fill = $("#progress-fill");
  if (fill) fill.style.width = `${pct}%`;
}

function renderStatus(snapshot) {
  const map = {
    [EngineStatus.IDLE]: "Ready",
    [EngineStatus.RUNNING]: "Live",
    [EngineStatus.PAUSED]: "Paused",
    [EngineStatus.FINISHED]: "Finished"
  };
  setText("#engine-status-label", map[snapshot.status] || snapshot.status);

  const badge = $("#engine-status-badge");
  if (badge) {
    badge.classList.toggle("badge--live", snapshot.status === EngineStatus.RUNNING);
    badge.classList.toggle("badge--paused", snapshot.status === EngineStatus.PAUSED);
  }

  const subtitle = `${capitalize(snapshot.difficulty)} · ${snapshot.language === "fa" ? "Persian" : "English"} · ${
    snapshot.mode === "time" ? "Time Based" : "Word Count"
  } · ${snapshot.mode === "time" ? `${snapshot.durationSec}s` : `${snapshot.wordCount} words`}`;
  setText("#engine-subtitle", subtitle);
}

function renderPauseButton(snapshot) {
  const btn = $("#btn-pause");
  if (!btn) return;
  btn.textContent = snapshot.status === EngineStatus.PAUSED ? "Resume" : "Pause";
  btn.disabled = snapshot.status === EngineStatus.IDLE || snapshot.status === EngineStatus.FINISHED;
}

function renderLiveStrip(snapshot, metrics) {
  setText("#live-wpm", metrics.currentWpm);
  setText("#live-accuracy", `${metrics.accuracy}%`);
  setText("#live-errors", errors.totalMistakes);
  setText("#live-chars", snapshot.typed.length);
  setText("#live-streak", computeStreak(snapshot));
}

function computeStreak(snapshot) {
  let streak = 0;
  for (let i = snapshot.typed.length - 1; i >= 0; i -= 1) {
    if (snapshot.typed[i] === snapshot.targetText[i]) streak += 1;
    else break;
  }
  return streak;
}

function renderErrorPanels(errorSnap, metrics) {
  const list = $("#mistyped-list");
  if (list) {
    const rows = errorSnap.mostMistyped.length
      ? errorSnap.mostMistyped
      : [];
    if (!rows.length) {
      list.innerHTML = `<li class="mistype-empty">No mistyped keys yet — keep typing.</li>`;
    } else {
      const max = rows[0].count || 1;
      list.innerHTML = rows
        .map((row, i) => {
          const pct = Math.round((row.count / max) * 100);
          const tone = i === 0 ? "mistype-item--critical" : i === 1 ? "mistype-item--high" : "";
          return `<li class="mistype-item ${tone}">
            <span class="mistype-item__key">${escapeHtml(row.key.toUpperCase())}</span>
            <div class="mistype-item__track"><i class="mistype-item__fill" style="width:${pct}%"></i></div>
            <span class="mistype-item__count">${row.count} mistakes</span>
          </li>`;
        })
        .join("");
    }
  }

  setText("#cat-wrong", errorSnap.categories.wrongCharacter);
  setText("#cat-missing", errorSnap.categories.missingCharacter);
  setText("#cat-extra", errorSnap.categories.extraCharacter);

  renderErrorTimeline(errorSnap.timeline);
  renderWeakness(errorSnap, metrics);
  renderHeatPreview(errorSnap.mostMistyped);
}

function renderErrorTimeline(timeline) {
  const marks = $("#error-timeline-marks");
  if (!marks) return;
  if (!timeline.length) {
    marks.innerHTML = "";
    return;
  }
  const maxSec = Math.max(60, ...timeline.map((t) => t.second), engine.elapsedSec || 1);
  marks.innerHTML = timeline
    .map((t) => {
      const left = Math.min(98, (t.second / maxSec) * 100);
      const strength = t.errors >= 3 ? "error-mark--strong" : t.errors === 1 ? "error-mark--soft" : "";
      return `<span class="error-mark ${strength}" style="left:${left}%" title="${t.second}s · ${t.errors} errors"></span>`;
    })
    .join("");
}

function renderWeakness(errorSnap, metrics) {
  const weak = errors.getWeaknessAnalysis(accuracyHistory);
  setText("#weak-key", weak.mostProblematicKey === "—" ? "—" : weak.mostProblematicKey.toUpperCase());
  setText("#weak-total", weak.totalMistakes);
  setText("#weak-total-display", weak.totalMistakes);
  setText("#weak-trend", capitalize(weak.accuracyTrend));
  setText("#weak-accuracy", `${metrics.accuracy}%`);
}

function renderHeatPreview(most) {
  const box = $("#error-heat-preview");
  if (!box) return;
  if (!most.length) {
    box.innerHTML = `<span class="kb-key">—</span>`;
    return;
  }
  box.innerHTML = most
    .slice(0, 8)
    .map((m, i) => {
      const heat = i === 0 ? "heat--most" : i < 3 ? "heat--frequent" : "heat--active";
      return `<span class="kb-key ${heat}">${escapeHtml(m.key.toUpperCase())}</span>`;
    })
    .join("");
}

function renderSessions() {
  const list = $("#sessions-list");
  if (!list) return;

  let sessions = loadSessions();
  const filter = $("#session-filter")?.value || "all";
  const sort = $("#session-sort")?.value || "latest";

  const now = new Date();
  sessions = sessions.filter((s) => {
    const d = new Date(s.date);
    if (filter === "today") {
      return d.toDateString() === now.toDateString();
    }
    if (filter === "week") {
      return now - d <= 7 * 24 * 60 * 60 * 1000;
    }
    if (filter === "month") {
      return now - d <= 30 * 24 * 60 * 60 * 1000;
    }
    return true;
  });

  sessions = [...sessions].sort((a, b) => {
    if (sort === "wpm") return b.wpm - a.wpm;
    if (sort === "accuracy") return b.accuracy - a.accuracy;
    if (sort === "duration") return b.duration - a.duration;
    return new Date(b.date) - new Date(a.date);
  });

  if (!sessions.length) {
    list.innerHTML = `<p class="empty-state">No sessions yet. Finish a test to build your history.</p>`;
    return;
  }

  list.innerHTML = sessions
    .map((s, index) => {
      const prev = sessions[index + 1];
      const trend = compareTrend(s.wpm, prev ? prev.wpm : null);
      const badgeClass = badgeTone(s.badge);
      return `<article class="session-card glass-card session-card--rich">
        <div class="session-card__top">
          <div>
            <time class="session-card__date">${formatSessionDate(s.date)}</time>
            <p class="session-card__meta">${capitalize(s.difficulty)} · ${s.language === "fa" ? "Persian" : "English"} · ${s.mode === "time" ? "Time" : "Words"}</p>
          </div>
          <span class="perf-badge ${badgeClass}">${s.badge}</span>
        </div>
        <div class="session-card__score">
          <span class="session-card__score-label">Session Score</span>
          <span class="session-card__score-value metric-number">${Math.round((s.wpm * 0.6) + (s.accuracy * 0.4))}</span>
        </div>
        <dl class="session-card__stats">
          <div><dt>Duration</dt><dd>${s.duration}s</dd></div>
          <div><dt>WPM</dt><dd>${s.wpm}</dd></div>
          <div><dt>Accuracy</dt><dd>${s.accuracy}%</dd></div>
          <div><dt>Keys</dt><dd>${s.totalKeys}</dd></div>
          <div><dt>Errors</dt><dd>${s.errors}</dd></div>
          <div><dt>Peak</dt><dd>${s.peakWpm}</dd></div>
        </dl>
        <div class="session-card__footer">
          <span class="trend trend--${trend.dir}">${trend.label}</span>
          <button type="button" class="btn btn--ghost btn--sm" data-delete-session="${s.id}">Delete</button>
        </div>
      </article>`;
    })
    .join("");
}

function badgeTone(badge) {
  if (badge === "Speed Demon") return "perf-badge--elite";
  if (badge === "Fast Typer") return "perf-badge--strong";
  if (badge === "Skilled") return "perf-badge--solid";
  if (badge === "Improving") return "perf-badge--rising";
  return "perf-badge--solid";
}

function openResultModal(snapshot, metrics, session) {
  const modal = $("#result-modal");
  if (!modal) return;

  setText("#result-wpm", metrics.currentWpm);
  setText("#result-peak", metrics.peakWpm);
  setText("#result-accuracy", `${metrics.accuracy}%`);
  setText("#result-duration", `${snapshot.elapsedSec}s`);
  setText("#result-keys", snapshot.totalKeystrokes);
  setText("#result-mistakes", session.errors);
  setText("#result-badge", session.badge || getPerformanceBadge(metrics.currentWpm));
  setText("#result-rating", metrics.rating);
  const ratingResult = $("#result-rating");
  if (ratingResult) {
    ratingResult.className = `rating ${ratingClass(metrics.rating)}`;
  }

  const badgeEl = $("#result-badge");
  if (badgeEl) {
    badgeEl.className = `perf-badge ${badgeTone(session.badge)}`;
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeResultModal() {
  const modal = $("#result-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function showCelebration(best) {
  const el = $("#celebration");
  if (!el) return;
  setText("#celebration-wpm", best);
  el.classList.add("is-visible");
  clearTimeout(celebrationTimer);
  celebrationTimer = setTimeout(hideCelebration, 4200);
}

function hideCelebration() {
  $("#celebration")?.classList.remove("is-visible");
}

function setStatusLabel(text) {
  setText("#engine-status-label", text);
}

function setText(sel, value) {
  const el = $(sel);
  if (el) el.textContent = String(value);
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function ratingClass(rating) {
  const map = {
    Perfect: "rating--perfect",
    Excellent: "rating--excellent",
    Good: "rating--good",
    Average: "rating--average",
    "Needs Improvement": "rating--needs"
  };
  return map[rating] || "rating--excellent";
}

// Close modal backdrop
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-close-modal]")) closeResultModal();
});

init();
