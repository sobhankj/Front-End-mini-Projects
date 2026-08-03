/**
 * Error Tracking System — mistyped keys, categories, timeline, weakness.
 */

export class ErrorTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.mistypedKeys = {};
    this.categories = {
      wrongCharacter: 0,
      missingCharacter: 0,
      extraCharacter: 0
    };
    this.timeline = []; // { second, errors }
    this._lastTyped = "";
    this._lastCursorErrors = 0;
    this.totalMistakes = 0;
  }

  /**
   * Diff previous typed vs next typed against the target text.
   */
  observe({ targetText, typed, elapsedSec }) {
    const prev = this._lastTyped;
    const next = typed;

    // Backspace shrinks string — no new mistype event
    if (next.length < prev.length) {
      this._lastTyped = next;
      return this.getSnapshot();
    }

    // New characters appended
    if (next.length > prev.length) {
      for (let i = prev.length; i < next.length; i += 1) {
        const expected = targetText[i];
        const actual = next[i];

        if (expected === undefined) {
          this.categories.extraCharacter += 1;
          this._bumpKey(actual);
          this._bumpTimeline(elapsedSec);
          this.totalMistakes += 1;
          continue;
        }

        if (actual !== expected) {
          this.categories.wrongCharacter += 1;
          this._bumpKey(expected);
          this._bumpTimeline(elapsedSec);
          this.totalMistakes += 1;
        }
      }
    }

    // Missing characters: cursor behind unfinished target at finish is handled in finalize
    this._lastTyped = next;
    return this.getSnapshot();
  }

  finalize({ targetText, typed, elapsedSec }) {
    // Count missing characters (never typed at end)
    const missing = Math.max(0, targetText.length - typed.length);
    if (missing > 0) {
      this.categories.missingCharacter += missing;
      this.totalMistakes += missing;
      for (let i = typed.length; i < targetText.length; i += 1) {
        this._bumpKey(targetText[i]);
      }
      this._bumpTimeline(elapsedSec, missing);
    }
    return this.getSnapshot();
  }

  _bumpKey(char) {
    if (!char || char === " ") {
      const key = char === " " ? "␣" : char;
      this.mistypedKeys[key] = (this.mistypedKeys[key] || 0) + 1;
      return;
    }
    const key = char.toLowerCase();
    this.mistypedKeys[key] = (this.mistypedKeys[key] || 0) + 1;
  }

  _bumpTimeline(second, count = 1) {
    const sec = Math.max(0, Math.floor(second || 0));
    const existing = this.timeline.find((t) => t.second === sec);
    if (existing) {
      existing.errors += count;
    } else {
      this.timeline.push({ second: sec, errors: count });
    }
  }

  getMostMistyped(limit = 5) {
    return Object.entries(this.mistypedKeys)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key, count]) => ({ key, count }));
  }

  getWeaknessAnalysis(accuracySamples = []) {
    const top = this.getMostMistyped(1)[0];
    let accuracyTrend = "stable";
    if (accuracySamples.length >= 2) {
      const first = accuracySamples[0];
      const last = accuracySamples[accuracySamples.length - 1];
      if (last - first > 2) accuracyTrend = "improving";
      else if (first - last > 2) accuracyTrend = "declining";
    }

    return {
      mostProblematicKey: top ? top.key : "—",
      mostProblematicCount: top ? top.count : 0,
      totalMistakes: this.totalMistakes,
      accuracyTrend
    };
  }

  getSnapshot() {
    return {
      mistypedKeys: { ...this.mistypedKeys },
      categories: { ...this.categories },
      timeline: this.timeline.map((t) => ({ ...t })),
      mostMistyped: this.getMostMistyped(),
      totalMistakes: this.totalMistakes
    };
  }
}
