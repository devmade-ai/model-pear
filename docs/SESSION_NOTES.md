# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (April 28, 2026)

**Last completed**: Theme migration to DaisyUI + PWA system + burger menu rebuild + audit-driven hardening

**Status**: Branch `claude/create-model-pear-todos-2ixM4` carries the full migration. Build green. Chunks 1, 2, 3 (a-i/ii/iii, b, c, d-prep/migrate/strip, e, f, g, g+, audit), 4, 5, 6 all committed and pushed. Chunk 7 (EVENT_BUS decision) remains pending.

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

### Architecture additions / new modules

- `apps/web/src/lib/theme.ts` — runtime theme management, exposes `window.__theme`
- `apps/web/src/lib/pwa.ts` — service-worker / install / update management, exposes `window.__pwa`
- `apps/web/src/lib/utils/trackListener.ts` — shared listener-collector helper used by `pwa.ts` and `+layout.svelte`
- `apps/web/src/lib/components/UpdateBanner.svelte` — PWA update prompt
- `apps/web/src/lib/components/InstallModal.svelte` — per-browser manual install instructions
- `apps/web/src/app.d.ts` — global Window / Navigator augmentation for the runtime singletons

### Bundle impact

| | Before | After (latest) |
|---|---|---|
| `app.css` source | 516 lines | 200 lines |
| Production CSS | 137.7 kB | 102 kB |
| Layout JS chunk | n/a | 30 kB |

### Visual regressions accepted

DaisyUI's `dim` and `emerald` themes now drive every colour. Prior dark palette (`#1B1B1B` / `#2D68FF` / `#FFFFFF`) is gone; chart series colours, badge colours, and brand accents all shift to whatever the active DaisyUI theme provides. This was the explicit "themes are the brand" decision — surfaced in commit `cb32a93`.

### Open follow-ups for next session

1. **Chunk 7 — EVENT_BUS decision.** Audit whether the app has cross-module unrelated reactions, service-layer pub/sub needs, or typed-payload requirements. If yes, implement per glow-props pattern. If no, document as N/A in `CLAUDE.md` under a "Not Applicable Patterns" section.
2. **Visual verification in a browser.** Build is green and every audit grep is clean, but no pages have been rendered in a real browser this session. Each chart, the burger menu disclosure, the install modal, and the update banner all need a manual smoke test in dark + light themes. The intermediate-state regression between commits `99a0c3f` and `6a29608` is documented but not retroactively fixable.
3. **Tests.** No tests added for `$lib/theme`, `$lib/pwa`, the burger menu, or PWA components. CLAUDE.md's testing rules treat infra as optional, but these are critical paths for every user.
4. **Manual `pnpm approve-builds`.** See `docs/USER_ACTIONS.md`.

### Pattern items still intentionally omitted

- **DebugPill SOURCE_COLORS** (boot/pwa/render/auth/db/form/engine) keep fixed hex codes; documented in `DebugPill.svelte` as "functional log-filter labels in a dev-only tool, not brand colours." Categories that map cleanly (`global` → error, `api` → primary) use DaisyUI tokens.
- **App-level error boundary.** Svelte 4 has no built-in error boundary; SvelteKit's `+error.svelte` only handles navigation errors. The DebugPill captures global `error` events as a partial substitute.

### Removal note (carried forward)

The debug system is alpha-only. When alpha ends, remove: `debugLog.ts`, `clipboardUtils.ts`, `DebugPill.svelte`, `#debug-root` + inline `<script>` + inline pill in `app.html`, dynamic import in `+layout.svelte`. The z-80 layer becomes unused.

### Known remaining issue (carried forward from prior session)

- **Model 3 model-use-cases doc**: Variant headings for 3D-3G describe different concepts than the code variants (e.g., doc says "Joint Venture Entity" for 3F but code says "Buy-In Arrangement"). Flagged for a future session.

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
    ├── src/
    │   ├── app.css               # @plugin daisyui + @theme + base + print CSS (200 lines)
    │   ├── app.d.ts              # Global Window / Navigator augmentation
    │   ├── app.html              # Pre-paint theme bootstrap + early beforeinstallprompt capture
    │   ├── lib/
    │   │   ├── components/       # Svelte components + charts + UpdateBanner + InstallModal
    │   │   ├── config/           # Input fields + wizard config
    │   │   ├── stores/           # Svelte stores (comparison)
    │   │   ├── utils/            # Formatting utilities + trackListener
    │   │   ├── theme.ts          # Runtime theme management (window.__theme)
    │   │   ├── pwa.ts            # Service-worker + install + update (window.__pwa)
    │   │   ├── debugLog.ts       # Alpha-only in-memory debug log
    │   │   └── clipboardUtils.ts # Three-tier clipboard fallback
    │   └── routes/
    │       ├── +layout.svelte    # Header + burger disclosure + UpdateBanner + InstallModal
    │       ├── +page.svelte      # Home page
    │       ├── pricing/          # Pricing calculator (5 models)
    │       └── structuring/      # Transaction tool routes
    ├── tests/e2e/                # Playwright E2E tests
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
