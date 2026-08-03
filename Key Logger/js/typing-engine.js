/**
 * Typing Test Engine — core state machine and input handling.
 */

import { getPassage } from "../data/texts.js";

export const EngineStatus = Object.freeze({
  IDLE: "idle",
  RUNNING: "running",
  PAUSED: "paused",
  FINISHED: "finished"
});

export class TypingEngine {
  constructor(options = {}) {
    this.onChange = options.onChange || (() => {});
    this.onTick = options.onTick || (() => {});
    this.onFinish = options.onFinish || (() => {});

    this.difficulty = "medium";
    this.language = "en";
    this.mode = "time"; // time | words
    this.durationSec = 60;
    this.wordCount = 50;

    this.reset({ reloadText: true });
  }

  reset({ reloadText = true } = {}) {
    this._clearTimers();

    if (reloadText) {
      this.targetText = this._loadText();
    }

    this.status = EngineStatus.IDLE;
    this.typed = "";
    this.cursor = 0;
    this.startedAt = null;
    this.pausedAt = null;
    this.pausedTotalMs = 0;
    this.elapsedSec = 0;
    this.remainingSec = this.mode === "time" ? this.durationSec : null;
    this.finishedAt = null;
    this.backspaces = 0;
    this.totalKeystrokes = 0;

    this.onChange(this.getSnapshot());
  }

  configure(prefs = {}) {
    if (prefs.difficulty) this.difficulty = prefs.difficulty;
    if (prefs.language) this.language = prefs.language;
    if (prefs.mode) this.mode = prefs.mode;
    if (prefs.durationSec) this.durationSec = Number(prefs.durationSec);
    if (prefs.wordCount) this.wordCount = Number(prefs.wordCount);

    this.reset({ reloadText: true });
  }

  _loadText() {
    return getPassage({
      language: this.language,
      difficulty: this.difficulty,
      wordCount: this.mode === "words" ? this.wordCount : null
    });
  }

  getSnapshot() {
    const correct = this._countCorrect();
    const incorrect = this._countIncorrect();
    const progress = this.targetText.length
      ? Math.min(100, (this.cursor / this.targetText.length) * 100)
      : 0;

    return {
      status: this.status,
      targetText: this.targetText,
      typed: this.typed,
      cursor: this.cursor,
      correct,
      incorrect,
      backspaces: this.backspaces,
      totalKeystrokes: this.totalKeystrokes,
      progress,
      elapsedSec: this.elapsedSec,
      remainingSec: this.remainingSec,
      difficulty: this.difficulty,
      language: this.language,
      mode: this.mode,
      durationSec: this.durationSec,
      wordCount: this.wordCount,
      isRtl: this.language === "fa"
    };
  }

  _countCorrect() {
    let n = 0;
    const len = Math.min(this.typed.length, this.targetText.length);
    for (let i = 0; i < len; i += 1) {
      if (this.typed[i] === this.targetText[i]) n += 1;
    }
    return n;
  }

  _countIncorrect() {
    let n = 0;
    const len = Math.min(this.typed.length, this.targetText.length);
    for (let i = 0; i < len; i += 1) {
      if (this.typed[i] !== this.targetText[i]) n += 1;
    }
    // Extra characters beyond target
    if (this.typed.length > this.targetText.length) {
      n += this.typed.length - this.targetText.length;
    }
    return n;
  }

  getElapsedMs() {
    if (!this.startedAt) return 0;
    const now = this.status === EngineStatus.PAUSED && this.pausedAt
      ? this.pausedAt
      : Date.now();
    return Math.max(0, now - this.startedAt - this.pausedTotalMs);
  }

  start() {
    if (this.status === EngineStatus.RUNNING) return;
    if (this.status === EngineStatus.FINISHED) {
      this.reset({ reloadText: true });
    }

    if (this.status === EngineStatus.PAUSED) {
      this.resume();
      return;
    }

    this.status = EngineStatus.RUNNING;
    this.startedAt = Date.now();
    this.pausedAt = null;
    this.pausedTotalMs = 0;
    this._startTimers();
    this.onChange(this.getSnapshot());
  }

  pause() {
    if (this.status !== EngineStatus.RUNNING) return;
    this.status = EngineStatus.PAUSED;
    this.pausedAt = Date.now();
    this._clearTimers();
    this.onChange(this.getSnapshot());
  }

  resume() {
    if (this.status !== EngineStatus.PAUSED) return;
    this.pausedTotalMs += Date.now() - this.pausedAt;
    this.pausedAt = null;
    this.status = EngineStatus.RUNNING;
    this._startTimers();
    this.onChange(this.getSnapshot());
  }

  restart() {
    this.reset({ reloadText: true });
  }

  finish(reason = "completed") {
    if (this.status === EngineStatus.FINISHED) return;
    this._clearTimers();
    this.status = EngineStatus.FINISHED;
    this.finishedAt = Date.now();
    this.elapsedSec = Math.max(1, Math.round(this.getElapsedMs() / 1000));
    if (this.mode === "time") {
      this.remainingSec = Math.max(0, this.durationSec - this.elapsedSec);
    }
    const snapshot = this.getSnapshot();
    this.onChange(snapshot);
    this.onFinish({ ...snapshot, reason });
  }

  handleKey(key, event) {
    if (this.status === EngineStatus.FINISHED) return false;
    if (this.status === EngineStatus.PAUSED) return false;

    // Ignore modifier shortcuts
    if (event && (event.ctrlKey || event.metaKey || event.altKey)) return false;

    if (key === "Escape") {
      this.pause();
      return true;
    }

    if (key === "Backspace") {
      if (!this.typed.length) return true;
      if (this.status === EngineStatus.IDLE) return true;
      this.typed = this.typed.slice(0, -1);
      this.cursor = this.typed.length;
      this.backspaces += 1;
      this.totalKeystrokes += 1;
      this.onChange(this.getSnapshot());
      return true;
    }

    // Printable character (including space)
    if (key.length !== 1) return false;

    if (this.status === EngineStatus.IDLE) {
      this.start();
    }

    // Cap extras lightly — still allow tracking extra chars as errors
    if (this.typed.length >= this.targetText.length + 20) {
      return true;
    }

    this.typed += key;
    this.cursor = Math.min(this.typed.length, this.targetText.length);
    this.totalKeystrokes += 1;
    this.onChange(this.getSnapshot());

    if (this.typed.length >= this.targetText.length) {
      this.finish(this.mode === "words" ? "words-complete" : "text-complete");
    }

    return true;
  }

  _startTimers() {
    this._clearTimers();
    this._tickTimer = setInterval(() => {
      const elapsedMs = this.getElapsedMs();
      this.elapsedSec = Math.floor(elapsedMs / 1000);

      if (this.mode === "time") {
        this.remainingSec = Math.max(0, this.durationSec - this.elapsedSec);
        this.onTick(this.getSnapshot());
        if (this.remainingSec <= 0) {
          this.finish("time-up");
        }
      } else {
        this.onTick(this.getSnapshot());
      }
    }, 250);
  }

  _clearTimers() {
    if (this._tickTimer) {
      clearInterval(this._tickTimer);
      this._tickTimer = null;
    }
  }
}
