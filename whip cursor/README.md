# WHIP Cursor

Original browser-based physics whip cursor built from first principles.

**Stack:** Vite · TypeScript · Canvas 2D · Web Audio (no React in the sim/render path)

## Architecture

```
Mouse Input → Pointer Tracker → Velocity/Accel Analysis
    → Physics Engine → Whip State → Renderer → Canvas
```

UI controls mutate a central `ConfigStore`. Physics and rendering read configuration; they are never driven by DOM state updates on every pointer event.

| Module | Role |
|--------|------|
| `src/input/PointerTracker.ts` | Lightweight pointer buffer (velocity, accel, direction, energy) |
| `src/physics/*` | Fixed-timestep Verlet chain + distance constraints |
| `src/render/*` | DPI-aware canvas, tapered leather spline, debug overlay |
| `src/crack/*` | Multi-signal crack detection + synthesized audio |
| `src/ui/SettingsPanel.ts` | Presets & live settings |
| `src/config/*` | Defaults, presets, typed config |

## Develop

```bash
npm install
npm run dev
npm test
npm run build
```

## Physics notes

- Fixed timestep ≈ **120 Hz**; render follows display refresh (60 / 120 / 144 Hz).
- Accumulated Δt is **clamped** after tab suspension so the whip does not explode.
- Mass falls along a configurable curve (handle heavy → tip light).
- Iterative distance constraints (~4 by default) keep segment length stable.
- Crack requires tip energy + direction change — not mouse speed alone.

## Accessibility & devices

- Respects `prefers-reduced-motion: reduce` (physics/audio minimized; cursor usable).
- Coarse-pointer / touch-only devices get a non-whip fallback.
- Native cursor remains the input source; overlay uses `pointer-events: none`.
- Settings panel restores a normal cursor for controls.

## Manual test checklist

1. Slow movement  
2. Fast horizontal / vertical  
3. Sudden reversal & circular motion  
4. Stop → natural settle  
5. Tab switch / resize  
6. High-DPI  
7. Reduced-motion preference  
8. Crack on deliberate flicks (not spam)

## License

Original implementation for this project. Do not copy proprietary assets or source from other whip-cursor products.
