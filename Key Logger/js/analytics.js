/**
 * WPM + Accuracy analytics with localStorage bestWPM persistence.
 */

const BEST_WPM_KEY = "tap_best_wpm";

export function loadBestWpm() {
  const raw = localStorage.getItem(BEST_WPM_KEY);
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function saveBestWpm(wpm) {
  const next = Math.max(0, Math.floor(wpm));
  localStorage.setItem(BEST_WPM_KEY, String(next));
  return next;
}

export function getAccuracyRating(accuracy) {
  if (accuracy >= 100) return "Perfect";
  if (accuracy >= 95) return "Excellent";
  if (accuracy >= 85) return "Good";
  if (accuracy >= 70) return "Average";
  return "Needs Improvement";
}

export class Analytics {
  constructor() {
    this.bestWpm = loadBestWpm();
    this.reset();
  }

  reset() {
    this.currentWpm = 0;
    this.peakWpm = 0;
    this.averageWpm = 0;
    this.cpm = 0;
    this.samples = [];
    this.correctCharacters = 0;
    this.incorrectCharacters = 0;
    this.totalTypedCharacters = 0;
    this.backspaces = 0;
    this.accuracy = 100;
    this.isNewBest = false;
  }

  /**
   * Update live metrics from engine snapshot.
   * WPM = (correctChars / 5) / minutesElapsed
   */
  update(snapshot) {
    this.correctCharacters = snapshot.correct;
    this.incorrectCharacters = snapshot.incorrect;
    this.totalTypedCharacters = snapshot.typed.length;
    this.backspaces = snapshot.backspaces;

    const minutes = Math.max(snapshot.elapsedSec, 1) / 60;
    const wpm = (this.correctCharacters / 5) / minutes;
    const cpm = this.correctCharacters / minutes;

    this.currentWpm = Math.max(0, Math.round(wpm));
    this.cpm = Math.max(0, Math.round(cpm));

    if (snapshot.elapsedSec >= 1 && this.currentWpm > this.peakWpm) {
      this.peakWpm = this.currentWpm;
    }

    // Sample roughly once per second for average
    const lastSampleSec = this.samples.length
      ? this.samples[this.samples.length - 1].sec
      : -1;
    if (snapshot.elapsedSec >= 1 && snapshot.elapsedSec !== lastSampleSec) {
      this.samples.push({ sec: snapshot.elapsedSec, wpm: this.currentWpm });
      const sum = this.samples.reduce((acc, s) => acc + s.wpm, 0);
      this.averageWpm = Math.round(sum / this.samples.length);
    }

    if (this.totalTypedCharacters > 0) {
      this.accuracy = (this.correctCharacters / this.totalTypedCharacters) * 100;
    } else {
      this.accuracy = 100;
    }

    this.isNewBest = false;
    return this.getSnapshot();
  }

  /**
   * Finalize session metrics and persist best WPM when beaten.
   */
  finalize(snapshot) {
    this.update(snapshot);

    // Ensure peak is at least final current
    this.peakWpm = Math.max(this.peakWpm, this.currentWpm);

    if (this.samples.length) {
      const sum = this.samples.reduce((acc, s) => acc + s.wpm, 0);
      this.averageWpm = Math.round(sum / this.samples.length);
    } else {
      this.averageWpm = this.currentWpm;
    }

    if (this.currentWpm > this.bestWpm && snapshot.elapsedSec >= 5) {
      this.bestWpm = saveBestWpm(this.currentWpm);
      this.isNewBest = true;
    }

    return this.getSnapshot();
  }

  getSnapshot() {
    return {
      currentWpm: this.currentWpm,
      averageWpm: this.averageWpm,
      peakWpm: this.peakWpm,
      bestWpm: this.bestWpm,
      cpm: this.cpm,
      accuracy: Number(this.accuracy.toFixed(1)),
      correctCharacters: this.correctCharacters,
      incorrectCharacters: this.incorrectCharacters,
      totalTypedCharacters: this.totalTypedCharacters,
      backspaces: this.backspaces,
      rating: getAccuracyRating(this.accuracy),
      isNewBest: this.isNewBest
    };
  }
}
