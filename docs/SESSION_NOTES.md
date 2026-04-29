# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (April 29, 2026)

**Last completed**: Theme migration to DaisyUI + PWA system + burger menu rebuild + audit-driven hardening + branch self-review **Phases A–E complete** (mechanical, audit-grep, module read-through, commit hygiene, doc cross-check)

**Status**: Branch `claude/create-model-pear-todos-2ixM4` carries the full migration plus a comprehensive validation pass. Build green, lint exits 0, tests 301/301, all 9 routes return 200. Chunks 1-7 + Phases A-E done; Phases F-I (browser / a11y / deployed-PWA / Lighthouse) and Phase J (tests) remain as `[USER ACTION]` / `[USER DECISION]`.

### What was done this session

Substantial chain — see `git log claude/create-model-pear-todos-2ixM4 --oneline` for the full picture. Major buckets:

1. **Documentation alignment (Chunks 1-2)** — restructured root `CLAUDE.md` to glow-props canonical layout (Principles / Communication / Code Standards / Triggers / 48-trigger version with 8 group tables); deleted `docs/HISTORY.md` per the cross-fleet "git log is the changelog" decision; cleaned completed items out of `docs/TODO.md`.
2. **Tailwind v3 → v4 upgrade (Chunk 3a-i/ii/iii)** — toolchain swap (`@tailwindcss/postcss`, `@import "tailwindcss"`), border-color flip audit (zero remediation needed), JS config inlined into CSS-first `@theme {…}` and `tailwind.config.js` deleted. `@apply` chains forced to `@utility` declarations because v4 broke the v3 cascade pattern.
3. **DaisyUI v5 + dual-layer theming (Chunk 3b)** — `@plugin "daisyui"` with `emerald --default` + `dim --prefersdark`, `@custom-variant dark`, base-layer `color-scheme` rules.
4. **Path B custom-purge (Chunks 3c, 3d-prep/migrate/strip, 3g+)** — bridged legacy CSS vars to DaisyUI tokens, then atomically migrated 24 component files to DaisyUI semantic classes (`bg-base-100`, `text-base-content`, etc.) via sed + targeted Edits, then stripped the bridge. Subsequently purged ALL custom colours per the user's "themes are the brand" rule: dropped `--color-model-1..6`, migrated ~80 hardcoded Tailwind utilities (`text-green-400` → `text-success`, etc.), and migrated 16 chart hex codes to live DaisyUI tokens via a new `getThemeColor()` helper.
5. **app.html bootstrap + theme module (Chunks 3e, 3f)** — pre-paint inline script reads localStorage / `prefers-color-scheme` / defaults dark and sets BOTH `.dark` class and `data-theme="dim|emerald"` on `<html>` before paint. Single dynamic `<meta name="theme-color">` tag updated by both the bootstrap script and `applyTheme()`. Theme module at `apps/web/src/lib/theme.ts` exposes `applyTheme`, `isDark`, `toggle`, `dispose`, `themeRev` store, and `getThemeColor()` with OKLCH→rgb probe-element resolution. Cross-tab sync via `storage` event, OS-pref tracking via `matchMedia`. HMR-safe via `window.__themeAttached` guard.
6. **ApexCharts theme integration (Chunk 3g)** — `BaseChart.svelte` listens for the `theme:change` event and calls `chart.updateOptions({ theme: { mode } })`. Each per-chart component reads colours from CSS vars via `getThemeColor()` with a `themeKey` reactive variable so options re-evaluate on theme flip.
7. **Burger menu rebuild (Chunk 4)** — Disclosure pattern with `aria-haspopup="menu"`, `aria-controls`, `aria-expanded`, `aria-label` flip; 44px touch target; full keyboard navigation (Esc / ArrowUp / ArrowDown / Home / End / Tab-trap); focus management via `tick() + requestAnimationFrame`; click-outside via z-40 backdrop with `cursor-pointer`; body scroll lock with `scrollbarGutter: stable`; theme toggle wired to `window.__theme.toggle()`; hidden install slot for Chunk 5; Save-as-PDF for Chunk 6; HMR-safe `track()` cleanup.
8. **PWA system (Chunk 5)** — `vite-plugin-pwa` + `workbox-window`, `registerType: 'prompt'`, `navigateFallback: '/200.html'` aligned with adapter-static SPA fallback. Early `beforeinstallprompt` capture in `app.html`. PWA module at `apps/web/src/lib/pwa.ts` with browser detection (Chrome/Edge/Brave/Safari/Firefox), per-browser install instructions, `triggerInstall` with native-prompt-or-manual-modal handoff, `idle | pending` update state machine, hourly `registration.update()` poll for Safari, `controllerchange` reload throttle via `sessionStorage`, HMR-safe via `__pwaModuleAttached` guard, exposes `window.__pwa`. `UpdateBanner.svelte` (z-70, safe-area-inset-bottom, `role="alert"`, retry-on-failure, 15s post-update timeout) and `InstallModal.svelte` (z-60 backdrop / z-80 modal, focus-trapped, escape/backdrop close) mounted from `+layout.svelte`.
9. **Print CSS / DOWNLOAD_PDF (Chunk 6)** — Save-as-PDF wired to `window.print()` in the burger menu (Chunk 4). `@media print` block in `app.css` overrides DaisyUI tokens at the `:root, [data-theme=emerald], [data-theme=dim]` specificity layer so both legacy and DaisyUI utilities resolve to print-friendly values. Comprehensive selectors: hides nav/header/footer/buttons, full-width tables, page-break-avoid for `section`/`.card`, print-only utility, etc.
10. **Audit-driven hardening (multiple wrap rounds)** — bug trigger surfaced 8 issues; errors trigger surfaced 6 actionable issues; wrap trigger surfaced 15 items including state-machine refactor, ErrorEvent dispatch for SW registration failures, listener-tracker DRY into `$lib/utils/trackListener.ts`, global Window types in `apps/web/src/app.d.ts`, DebugPill SW-getRegistration timer cleanup.
11. **Branch self-review Phases A–E** — 30 items across 5 phases produced ~25 commits. Real bugs caught: SSR 500 in onDestroy (`3d0faf3`), theme-color meta-tag ordering bug breaking first-paint chrome (`554f494`), 12 buttons missing `.btn` base class (`d3b26c3`), all 6 chart components had a `$:`-reactivity bug where data props weren't tracked deps (`d8a5f99`). Cleanup: 62 a11y label warnings paired (`da323a4`), full ESLint flat config + 58 findings closed (`d343c86` / `fffb98d`), all hardcoded colours purged from `DebugPill.svelte` / `app.html` / `app.css` print block (`7d3fa0e` / `3479a57`), 26 broken-alpha Tailwind classes (`text-base-content/70/60` → `/60`) (`7ee5573`), 3 timer leaks (`d458762`), `debugLog.ts` HMR teardown added (`610ea5c`), `bodyScrollLock` extracted with reference counting and applied to `InstallModal` too (`0e86fd0`), `WindowEventMap['theme:change']` typed via `app.d.ts` augmentation + type-aware `track()` overloads (`1711078`), local `PWAGlobals` dups dropped (`2d5a377`). Documentation refreshed: AI_MISTAKES.md populated with 5 lessons (`97072bc`), README + ARCHITECTURE updated for v4 / DaisyUI / PWA / ESLint reality (`8e7cf0e` / `660645f`), USER_ACTIONS date corrected (`e9caf7e`), CLAUDE.md `window.__pwa` table fixed (`25f1f48`).

### Architecture additions / new modules

- `apps/web/src/lib/theme.ts` — runtime theme management, exposes `window.__theme`. Resolved-token cache + idempotent `applyTheme()` added in Phase C.
- `apps/web/src/lib/pwa.ts` — service-worker / install / update management, exposes `window.__pwa`.
- `apps/web/src/lib/utils/trackListener.ts` — shared listener-collector helper. Phase C added type-aware overloads that pick up `WindowEventMap` / `DocumentEventMap` so `track(window, 'theme:change', e => e.detail.dark)` typechecks without a cast.
- `apps/web/src/lib/utils/bodyScrollLock.ts` — reference-counted scroll lock used by both the burger menu and the install modal so nested overlays compose correctly.
- `apps/web/src/lib/components/UpdateBanner.svelte` — PWA update prompt with idempotent `show()` (defends against re-emit while visible).
- `apps/web/src/lib/components/InstallModal.svelte` — per-browser manual install instructions, focus-trapped, scroll-locks the body while open.
- `apps/web/src/app.d.ts` — global Window / Navigator augmentation for the runtime singletons. Phase C added `WindowEventMap['theme:change']`, plus debug-pill / Brave / Safari-standalone fields so module bodies don't need `as any` casts.
- `apps/web/eslint.config.js` — ESLint v10 flat config (typescript-eslint + eslint-plugin-svelte). Was completely missing before this session; added in Phase A5.

### Bundle impact

| | Before | After (latest) |
|---|---|---|
| `app.css` source | 516 lines | ~190 lines |
| Production CSS | 137.7 kB | ~102 kB |
| Layout JS chunk | n/a | ~30 kB |
| Calculator tests | 301 | 301 (still green) |
| ESLint | not configured | 0 errors / 0 warnings |
| svelte-check | 27 errors / 0 warnings | 27 errors / 0 warnings (baseline pre-existing on `main` — see open follow-up) |

### Visual regressions accepted

DaisyUI's `dim` and `emerald` themes now drive every colour. Prior dark palette (`#1B1B1B` / `#2D68FF` / `#FFFFFF`) is gone; chart series colours, badge colours, and brand accents all shift to whatever the active DaisyUI theme provides. This was the explicit "themes are the brand" decision — surfaced in commit `cb32a93`.

### Open follow-ups for next session

1. **Branch self-review Phases F-I (browser + deployed).** Phases A-E done this session. Remaining: visual walkthrough in dim + emerald, JS-disabled fallback, a11y / keyboard / SR sweep, PWA install + update + offline behaviour (deployed HTTPS), Save-as-PDF preview, Lighthouse, Vercel preview. All require a real browser or deployed instance.
2. **Phase J — Tests.** No tests added for `$lib/theme`, `$lib/pwa`, the burger menu, or PWA components. CLAUDE.md's testing rules treat infra as optional, but these are critical paths for every user. Optional unit + Playwright E2E coverage flagged but not yet authorised.
3. **27 baseline `svelte-check` errors.** Pre-existing on `main` (not introduced by this branch). Treated as `baseline` throughout Phase A. Worth a triage pass: some may be real type bugs in calculator inputs / variant typing.
4. **Manual `pnpm approve-builds`.** See `docs/USER_ACTIONS.md` — verified during Phase E that the action is still pending (`pnpm install` still emits the warning).
5. **(closed)** Model 3 use-case doc drift was fixed in this run — 3D/3E/3F sections rewritten to match the code's actual variant definitions (Usage Rights Split / Platform + Derivatives / Buy-In Arrangement) and 3G (Termination Provisions) added as a first-class variant section.
6. **Intermediate-state regression** between commits `99a0c3f` (3d-strip) and `6a29608` (3e) is documented but not retroactively fixable — the `class="dark"`-without-`data-theme` window meant DaisyUI defaulted to emerald during that span.
7. **Unaudited docs** (Phase E only covered CLAUDE.md / SESSION_NOTES / USER_ACTIONS / AI_MISTAKES / TODO / README / ARCHITECTURE). Could have similar drift to what was found in README / ARCHITECTURE: `BUSINESS_GUIDE.md`, `CALCULATIONS.md`, `NEGOTIATION_MODE.md`, `DISCOVERY_FRAMEWORK.md`, `DISCOVERY_FINDINGS.md`, `UI_UX_GUIDE.md`, `model-use-cases/*.md`.

### Pattern items still intentionally omitted

- **App-level error boundary.** Svelte 4 has no built-in error boundary; SvelteKit's `+error.svelte` only handles navigation errors. The DebugPill captures global `error` events as a partial substitute.

### Removal note (carried forward)

The debug system is alpha-only. When alpha ends, remove: `debugLog.ts`, `clipboardUtils.ts`, `DebugPill.svelte`, `#debug-root` + inline `<script>` + inline pill in `app.html`, dynamic import in `+layout.svelte`. The z-80 layer becomes unused.

### Known remaining issue (carried forward from prior session)

- _(none — Model 3 doc drift previously flagged here was closed in this session.)_

---

## Architecture Overview (TypeScript Monorepo)

```
model-pear/
├── packages/calculator/          # Pure TypeScript calculation library
│   ├── src/
│   │   ├── models/               # 6 transaction models (47 variants)
│   │   ├── projections/          # NPV, IRR, payback calculations
│   │   ├── sensitivity/          # Ranges, scenarios, Monte Carlo
│   │   └── types/                # Shared TypeScript types
│   └── tests/                    # 301 unit tests
│
└── apps/web/                     # SvelteKit 2.x frontend (Tailwind v4 + DaisyUI v5)
    ├── eslint.config.js          # ESLint v10 flat config (TS + Svelte)
    ├── src/
    │   ├── app.css               # @plugin daisyui + @theme + base + print CSS (~190 lines)
    │   ├── app.d.ts              # Global Window / Navigator augmentation (incl. WindowEventMap['theme:change'])
    │   ├── app.html              # Pre-paint theme bootstrap + early beforeinstallprompt capture
    │   ├── lib/
    │   │   ├── components/       # Svelte components + charts + UpdateBanner + InstallModal + DebugPill
    │   │   ├── config/           # Input fields + wizard config
    │   │   ├── stores/           # Svelte stores (comparison)
    │   │   ├── utils/            # Formatters + trackListener (typed) + bodyScrollLock (ref-counted)
    │   │   ├── theme.ts          # Runtime theme management (window.__theme) — token cache + idempotent applyTheme
    │   │   ├── pwa.ts            # Service-worker + install + update (window.__pwa)
    │   │   ├── debugLog.ts       # Alpha-only in-memory debug log (HMR-safe teardown)
    │   │   └── clipboardUtils.ts # Three-tier clipboard fallback
    │   └── routes/
    │       ├── +layout.svelte    # Header + burger disclosure + UpdateBanner + InstallModal
    │       ├── +page.svelte      # Home page
    │       ├── pricing/          # Pricing calculator (5 models)
    │       └── structuring/      # Transaction tool routes
    ├── tests/e2e/                # Playwright E2E (comparison/mobile/navigation/pricing/structuring)
    └── static/                   # Static assets (manifest.webmanifest is now VitePWA-generated)
```

---

## Build Commands

```bash
pnpm install          # Install dependencies
pnpm test             # Run calculator tests (301 tests)
pnpm build            # Build all packages
pnpm dev              # Start dev server (apps/web)
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:ui      # Run Playwright with UI
pnpm generate-icons   # Regenerate PNGs from assets/icon-source.svg
```

---

## Future Ideas

- **Recommendation Summary** - Add weighted scoring to Compare Mode
- **Accounting Treatment Comparison** - Journal entries side-by-side in Compare Mode
- **Rename "intercompany" folders** - Rename to `transactions/` (low priority)
