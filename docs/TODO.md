# TODO

> Lower priority items and improvements to capture between sessions

---

## High Priority: Infrastructure

### Major-version dependency upgrade epic
**Priority**: High
**Effort**: Large
**Surfaced by**: branch self-review post-validation item 5 (`a973c07`, April 2026)

`pnpm audit` reports **16 remaining vulnerabilities** after closing 14 via in-major bumps. All 16 are pinned by major-version-locked deps and require coordinated bumps:

- `svelte` 4 → 5 — runes migration; biggest single change
- `vite` 5 → 8 — transitively closes 5 advisories (`rollup`, `esbuild`, `picomatch`, `minimatch`, `serialize-javascript`)
- `@sveltejs/vite-plugin-svelte` 3 → 7 — required to pair with Svelte 5 / Vite 8
- `@sveltejs/kit` 2.58 → next major (when published) — for the cookie advisory
- `vitest` 1 → 4 + `@vitest/coverage-v8` 1 → 4 — usually upgraded together
- `svelte-check` 3 → 4 — pairs with Svelte 5
- `apexcharts` 3 → 5 — independent
- `typescript` 5 → 6 — independent (ts 5→6 is more conservative than 4→5)
- `zod` 3 → 4 — independent (calculator package only; no runtime usage today)

**Why epic, not chunk**: each bump touches the public API or runtime semantics in ways that require coordinated component updates. Svelte 4 → 5 in particular requires migrating reactive primitives (`$:` declarations) to runes. Best done as a dedicated branch with E2E + visual-regression coverage in place first.

**Verification surface**: after each bump, the existing `pnpm test` + `pnpm -r check` + `pnpm build` + `pnpm lint` flow should catch most regressions. Real risk is in the chart components (ApexCharts 3 → 5 has theme API changes), the chart-reactivity pattern (Svelte 4's `$:` lexical-dep tracking is replaced by runes' `$state` / `$derived`), and the test suite (Vitest 1 → 4 has config-format changes).

---

## Medium Priority: Feature Ideas

### Recommendation Summary for Compare Mode
**Priority**: Medium
**Effort**: Medium

**Problem**: The tool calculates many metrics but doesn't tell users which option IS the best value. Users must interpret results themselves.

**Current state**: Compare Mode shows differences but doesn't highlight which option is optimal overall. The Wizard recommends a *model* but not a specific *configuration*.

**Proposed solution**: Add a "Recommendation Summary" section to Compare Mode that:
1. Lets users weight their priorities (e.g., "tax efficiency matters more than cash flow timing")
2. Calculates a weighted score for each compared option
3. Highlights the recommended option with clear rationale
4. Shows which dimensions each option wins on

**Example UI**:
```
┌─────────────────────────────────────────────────────┐
│ RECOMMENDATION SUMMARY                              │
├─────────────────────────────────────────────────────┤
│ Based on your priorities:                           │
│   Tax Efficiency: ●●●●○ (High)                     │
│   Cash Flow: ●●○○○ (Low)                           │
│   Developer Profit: ●●●○○ (Medium)                 │
│                                                     │
│ ✓ RECOMMENDED: Option B (Licence Model at 12%)     │
│                                                     │
│ Why: Best combined tax position (+R45,000),         │
│ acceptable developer margin (within target range).  │
│                                                     │
│ Option A wins on: Developer Profit                  │
│ Option B wins on: Tax Efficiency, Client Benefit    │
└─────────────────────────────────────────────────────┘
```

**Why this helps**:
- Transforms the tool from "calculator" to "advisor"
- Reduces cognitive load for users interpreting multiple metrics
- Aligns with tool goal: "find the best deal for both parties"

---

### Accounting Treatment Comparison in Compare Mode
**Priority**: Low
**Effort**: Small

**Problem**: Individual results show accounting treatment details (recognition timing, journal entries), but Compare Mode doesn't extract these for side-by-side comparison.

**Current state**: Comparison view shows financial metrics, tax, compliance, and long-term value - but accounting treatment is only visible by loading each option individually.

**Proposed solution**: Add an "Accounting Treatment" section to the comparison table showing:
- Developer: Revenue recognition timing (point-in-time vs over-time)
- Developer: Asset recognition (yes/no)
- Buyer: Amount capitalised vs expensed
- Buyer: Amortisation period

**Why low priority**: Users can already see accounting treatment in individual results. Compare Mode covers the most impactful metrics. This would be a nice-to-have for detailed accounting analysis.

---

## PWA

- [ ] Browser-verify the auto-on-launch update loop on a deployed HTTPS instance: deploy → revisit installed app → silent launch-apply reload picks up the new version; flip "Automatic updates" OFF → same scenario shows the UpdateBanner instead; "Check for updates" surfaces each typed result (up-to-date toast, update-available → banner). Pairs with the existing Phase F–I browser sweep in SESSION_NOTES.
- [ ] Optional launch-apply "Updating…" affordance — the launch reload is currently silent (sub-second on warm cache, before any interaction). If it proves noticeable on slow devices/networks, add a brief indicator per the glow-props spec's "behind the app's brief 'Updating…' affordance" wording.

## Low Priority: Naming

- [ ] Rename `intercompany` model category to `transactions` — the category id was set when the tool was scoped to intercompany transactions only; current scope is "any client (related or unrelated)" and the category name no longer reflects reality. Touches the model registry and any branching on `category === 'intercompany'`.

## PWA pattern audit — 2026-08-03

Repo-side findings from a fleet-wide audit of every devmade-ai PWA against the
glow-props implementation patterns. The pattern-side learnings are already folded
back into those docs, so **fetch the current pattern before starting any item**:

```bash
curl -sf "https://devmade-ai.github.io/glow-props/patterns/PWA_SYSTEM.md"
curl -sf "https://devmade-ai.github.io/glow-props/patterns/PWA_ICON_CACHE_BUST.md"
```

Line references were accurate at audit time. Severity-ordered.

**The service-worker fault found by this audit is already fixed** (PR #119):
`navigateFallback: '/200.html'` named a URL workbox never precached — Kit globs
`.svelte-kit/output/client` (no HTML) while adapter-static writes `200.html`
afterwards — so `createHandlerBoundToURL` threw and the navigation route was never
registered. Verified in Chromium: an offline deep link failed with
`ERR_INTERNET_DISCONNECTED` before and returns the shell (HTTP 200) after.
Precaching itself worked in both cases. The items below are what remains.

1. [ ] **Consider `@vite-pwa/sveltekit`.** It globs the adapter's *real* output,
   which removes the root cause that the current `additionalManifestEntries` entry
   compensates for. Deliberately kept out of the hotfix. The same build-order
   mismatch is why no HTML is precached at all here.
2. [ ] **`controllerchange` reloads unconditionally** (`pwa.ts:464-475`) — there is
   only a 5s throttle and no apply latch anywhere. Real harm, and it defeats this
   repo's own stated rationale at `pwa.ts:10-13` ("Model Pear holds calculator inputs
   in memory; a reload loses them"): a user mid-calculation in tab A loses their
   inputs when tab B launch-applies an update. Add the latch and set it in
   `applyUpdate()` and on the launch-apply path.
3. [ ] **`launchPhase` has no terminal timeout** (`pwa.ts:70`). If `register()` never
   settles — neither `onRegisteredSW` nor `onRegisterError`, a known Safari
   behaviour — the flag stays `true` and `maybeEmitUpdateBanner()` suppresses the
   banner for the entire session. `launchApplying` has a 15s watchdog; the phase flag
   does not.
4. [ ] **Google Fonts are loaded from the CDN with no runtime route**
   (`app.html:123-125`), so an installed PWA falls back to system fonts offline.
5. [ ] **PWA_ICON_CACHE_BUST is unimplemented** — no `?v=` anywhere. Note the
   glow-props `transformIndexHtml` approach **cannot be ported as-is**: vite-plugin-pwa's
   HTML pipeline never runs under SvelteKit (the client build has no HTML entry), so
   `app.html` has to be rewritten from a custom plugin. Also `icon-1024.png` is
   declared `purpose: 'maskable'` but generated as a plain render with no full-bleed
   flatten and no safe-zone inset.
6. [ ] **No PWA tests.** `vitest.config.ts` has no `virtual:pwa-register` alias and
   the launch-apply here is a *custom* implementation (a phase flag rather than the
   pattern's time window), which makes this the fleet instance that most needs them —
   an unwanted reload is the riskiest behaviour in the app.
7. [ ] **`onNeedRefresh` returns without recording the update inside the suppression
   window** (`pwa.ts:500`); no shared in-flight promise in `checkForUpdates`;
   `'no-sw'` is returned in dev where `devOptions.enabled: false` means no worker was
   built, and rendered as "Update checks aren't available in this browser" — simply
   false. Branch on `import.meta.env.DEV`.
8. [ ] **Install flow:** the inline capture has no attach guard, no durable flag and
   no named handler, and the module attaches a *second* `beforeinstallprompt`
   listener so both handlers overwrite the same slot; `detectBrowser()` has no
   `isIOS` branch at all, so iOS Chrome/Firefox users are told to "click the install
   icon in the address bar"; no iPadOS test; `EdgiOS` unhandled.
9. [ ] **`vercel.json` has no cache headers** and its SPA rewrite is not scoped away
   from `_app/` (the SvelteKit equivalent of `assets/`), so a deleted chunk returns
   HTML under a JS MIME type.
10. [ ] **PWA lifecycle events never reach the debug store** — `debugLog.ts:10` has a
    `'pwa'` category the PWA module never uses; `onRegisterError` reaches the pill only
    by re-dispatching a synthetic `ErrorEvent`, and `onOfflineReady` is a no-op that
    produces no toast.
11. [ ] **Correct the glow-props record.** That repo's tracking matrix lists this one
    as PWA_SYSTEM "Missing / no vite-plugin-pwa" and ICON_CACHE_BUST "N/A (no PWA)" —
    both false. Its portfolio `meta.json` also records the stack as "TypeScript,
    React, Vite" when this is **SvelteKit**. The neighbouring "no DaisyUI",
    "`class="dark"` hardcoded" and "BURGER_MENU still `p-2`" claims are stale too.

**Promoted into the fleet pattern from this repo:** the entire SvelteKit variant
section — the build-order hazard, `transformIndexHtml` never running, the SSR
import-safety rule, the Svelte-4 `onDestroy`-runs-during-SSR footgun — plus the
finding that `navigateFallback` defaults to `index.html` (so MPAs must pass `null`
rather than omit it), that `updateServiceWorker`'s argument has been inert since
0.13.2, launch-apply as an explicit phase flag rather than a wall-clock window, and
the bounded watchdog on a stuck apply.


## Public visibility — 2026-08-04 fleet audit

Findings from the fleet-wide public-visibility audit against
[`DISCOVERABILITY.md`](https://devmade-ai.github.io/glow-props/patterns/discoverability/).
**Fetch that pattern before starting** — it gained a SvelteKit variant because of
this repo. Verified against the deployed origin
(`https://model-pear-web.vercel.app/`) on 2026-08-04, not only read from source.

1. [ ] **The four `<svelte:head>` titles never reach a file.** The routes are not
   prerendered, so the head content exists only after hydration — a crawler and
   an unfurler both get the fallback shell. `<svelte:head>` is worthless for
   discoverability unless the route is prerendered, so
   `export const prerender = true` on the routes that should be findable comes
   **first**; every other item here depends on it.
2. [ ] **No Open Graph, no Twitter tags, no card image.** A pasted link renders
   as a bare URL. Needs the full tag set plus a 1200×630 card.
3. [ ] **No `robots.txt`.** `GET /robots.txt` returns **200 with HTML** — the
   file doesn't exist and the fallback answers for it. Add a real one that allows
   the crawl and names the sitemap.
4. [ ] **`GET /sitemap.xml` has the same problem** — 200, HTML, no sitemap.
   With `adapter-static` and prerendered routes, generating one is cheap.
5. [ ] **No canonical.** The `*.vercel.app` alias and every preview alias serve
   byte-identical pages with nothing electing a winner.
6. [ ] **Soft 404s.** A nonexistent path returns **200** with the app shell.
7. [ ] **Almost no crawlable body text** (measured: 91 characters in the served
   document). Resolved by item 1 for the prerendered routes.
8. [ ] **No structured data.** `WebApplication` is the right node type here
   (Step 5 of the pattern).
9. [ ] **No tripwire**, so every item above is invisible to the gate.
