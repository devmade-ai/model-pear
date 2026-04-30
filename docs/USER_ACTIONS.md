# User Actions Required

> **Purpose**: Track manual actions the user needs to perform outside the codebase (external dashboards, credentials, configuration, etc.)
> **Last Updated**: April 2026

This file documents any manual steps that require user intervention. AI assistants should add detailed instructions here when tasks cannot be completed programmatically.

---

## Pending Actions

### Approve build scripts (esbuild, svelte-preprocess)
**Added**: April 28, 2026
**Priority**: Low
**Context**: pnpm v10 ignores postinstall build scripts by default for security. Two transitive dependencies — `esbuild@0.21.5` and `svelte-preprocess@5.1.4` — emit a warning on every `pnpm install` that their build scripts were skipped. Builds work fine in this state; the warning is cosmetic. To silence it, approve them once.

#### Steps:
1. From the repository root, run:
   ```
   pnpm approve-builds
   ```
2. In the interactive list, select `esbuild` and `svelte-preprocess` (and any others you want to allow).
3. Commit the resulting `package.json` change (an `onlyBuiltDependencies` entry is recorded there).

#### Verification:
- Re-run `pnpm install`. The "Ignored build scripts" warning should be gone.

#### Notes:
- This is purely a developer-experience cleanup. The app builds and runs correctly without it.
- The repo root already lists `sharp` under `pnpm.onlyBuiltDependencies` for the icon-generation script.

---

### DaisyUI migration audit — browser-bound visual checks (N1-N6)
**Added**: April 30, 2026
**Priority**: Medium
**Context**: The DaisyUI migration audit (Phase K + Phase L) found and fixed every code-side issue (M1: tokenised print border, M2: Tailwind `rounded-*` aliased onto DaisyUI radius tokens, M3: global `prefers-reduced-motion` rule). Six remaining checks require a real browser — token-gap visual sweep, theme reactivity, first-paint flash, forced-colors mode, prefers-reduced-motion behaviour, print preview. Run them once on `main` after these branches land, or against the deployed Vercel preview.

#### Steps:

Run `pnpm dev` (or open the deployed preview), then walk through each check:

1. **N1 — Token-gap visual sweep**
   - Open every route: `/`, `/pricing`, `/structuring`, `/structuring/[1..6]`.
   - On each, toggle theme via the burger menu and confirm: every surface, border, badge, button, input, table cell, and chart series visibly recolours. Look for any element that stays the same colour across the flip — that's a hardcoded-colour leak we missed.
   - Cover the comparison modal, debug pill, install modal, update banner, sensitivity panel, projections panel.

2. **N2 — Theme reactivity smoke test**
   - With DevTools open, toggle the theme 5× rapidly. Watch the Console: no errors. Watch the chart canvases: every series re-colours within ~200ms (BaseChart fires `chart.updateOptions({ theme: { mode } })` on the `theme:change` event).
   - Confirm `<html>` has BOTH `class="dark"` and `data-theme="dim"` after toggling to dark, and neither/`data-theme="emerald"` after toggling to light.

3. **N3 — First-paint flash (FOUC) check**
   - In DevTools → Network, throttle to "Slow 3G". Reload `/` with the system theme set to dark. The pre-paint script in `app.html` should set theme BEFORE first paint; you should NOT see a light flash before the dark theme applies.
   - Repeat with system theme set to light — no dark flash on reload.

4. **N4 — Forced-colors (Windows High Contrast) mode**
   - In Chrome DevTools: Rendering panel → "Emulate CSS forced-colors: active".
   - Navigate every route. Confirm: text is readable, focus rings visible, buttons distinguishable from backgrounds, charts still convey data (even if colours flatten to system palette).
   - We don't override forced-colors anywhere — DaisyUI handles its own components. This check verifies our custom surfaces don't break the OS contrast contract.

5. **N5 — prefers-reduced-motion behaviour**
   - In Chrome DevTools: Rendering panel → "Emulate CSS prefers-reduced-motion: reduce".
   - Reload the page. Hover over buttons, toggle theme, open/close the comparison modal, expand/collapse projection panels. Every transition should be instantaneous (no fade, no slide, no rotate). If anything still animates, the M3 universal selector missed it — file a bug.
   - Switch back to "no-preference"; transitions should resume normally.

6. **N6 — Print preview**
   - On `/structuring/1` (or any model page), populate inputs and click "Calculate".
   - Open print preview (Cmd/Ctrl+P).
   - Confirm: navigation/buttons/footer hidden; page background pure white; text pure black; tables have visible borders (M1 made these tokenised — `var(--border) solid var(--color-base-content)`); status badges retain their backgrounds; charts render in print-safe colours; no orphaned modals/overlays.

#### Verification:
- All six checks pass without surfacing visible regressions.
- If any check fails, file a follow-up issue with the route, the action taken, and a screenshot.

#### Notes:
- These are one-off post-merge checks for the DaisyUI migration audit. They don't need to repeat unless DaisyUI is upgraded again or the theme system is touched.
- For headless verification, Playwright with `--browser=chromium --media=print` could automate N6, and `prefers-reduced-motion` / `forced-colors` can be set per-test via `page.emulateMedia()` — but the visual-judgement checks (N1, N3) are easier to do by eye.

---

## Completed Actions

*Actions move here once completed, with date and any relevant notes.*

---

## Template for New Actions

When adding a new action, use this format:

```markdown
### [Action Title]
**Added**: [Date]
**Priority**: [High/Medium/Low]
**Context**: [Why this action is needed]

#### Steps:
1. Step one
2. Step two
3. Step three

#### Verification:
- How to confirm the action was completed successfully

#### Notes:
- Any additional context or considerations
```
