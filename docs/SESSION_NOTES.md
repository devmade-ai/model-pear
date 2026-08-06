# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (July 21, 2026 — branch `claude/projects-missing-analytics-vla4ja`)

**Worked on**: fleet-standard PWA update policy (**auto-on-launch**, per gp-props `PWA_SYSTEM.md` → "Update Application Policy"). Epic: `pwa-auto-update`.

### Accomplished

1. **Launch-apply in `apps/web/src/lib/pwa.ts`.** In `onRegisteredSW`, a SW already `waiting` when registration first resolves is applied silently: `applyUpdate()` (skipWaiting) → the existing `controllerchange` listener reloads exactly once. Gated on the persisted preference + a 30s post-apply sessionStorage suppression (`__pwaUpdateAppliedAt`, stamped by `markUpdateApplied()` inside `applyUpdate()` for both the user-clicked and launch paths). Launch-apply ONLY — an update that installs mid-session still arms the UpdateBanner and never auto-reloads (Model Pear holds calculator inputs in memory).
   - `launchPhase` / `launchApplying` flags gate `onNeedRefresh` + `maybeEmitUpdateBanner()` so the banner can't flash during the sub-second apply window; `endLaunchPhase()` releases an armed-but-not-applied update to the normal banner path (toggle OFF, apply failed, registration error).
   - Failure fallbacks: `applyUpdate()` rejection → re-arm banner; 15s watchdog (`LAUNCH_APPLY_TIMEOUT_MS`) for a skipWaiting that resolves but never reloads → re-arm banner. Watchdog + hourly poll cleanups now share `timerCleanups` (renamed from `intervalCleanups`) drained on HMR dispose.
2. **"Automatic updates" preference** — `isAutoUpdateEnabled()` / `setAutoUpdateEnabled()` on `window.__pwa`. localStorage key `pwaAutoUpdate` (bare camelCase matching the theme module's `darkMode`; inline try/catch like theme.ts — repo has no safeStorage wrapper), absent = ON (fleet default), only literal `'false'` disables. `setAutoUpdateEnabled` returns the READ-BACK effective value so a blocked localStorage can't leave the UI toggle lying.
3. **"Check for updates"** — `checkForUpdates()` on `window.__pwa`: `registration.update()` + 1500ms settle → fleet-canonical `PWACheckForUpdatesResult` = `'no-sw' | 'up-to-date' | 'update-available' | 'error'` (type in `app.d.ts`). An explicit check overrides the "Later" suppression and re-emits the banner when an update is found. `swRegistration` is now stored module-level for this.
4. **Burger menu UI (`+layout.svelte`)** — two new items after the install slot: "Check for updates" (menuitem button; closes menu, transient feedback toast) and "Automatic updates" (DaisyUI `.toggle` checkbox in a `.menu` label row, `role="menuitemcheckbox"` + `aria-checked`, helper copy "Updates apply automatically when the app opens", stays open like the theme toggle). Both carry `data-menu-item` so the existing arrow-key nav picks them up.
5. **Check-result toast** — DaisyUI `.toast.toast-center.toast-bottom z-[70]` + `.alert.alert-soft` in the layout (checking spinner / up-to-date / no-sw / error copy). `toast-center` deliberately, so it can never overlap the UpdateBanner's `toast-end` container; `'update-available'` shows NO toast — the UpdateBanner is the feedback for that outcome. Auto-dismiss 4s, timer cleared in the layout's onMount cleanup.
6. **Types** — `app.d.ts`: `PWACheckForUpdatesResult` + the three new `PWAGlobals` methods.
7. **Docs** — CLAUDE.md Frontend-stack PWA bullet rewritten for the policy; `window.__pwa` runtime-singletons row extended; TODO.md gained the browser-bound verification item.

### Decisions

- **UpdateBanner untouched.** Mid-session behaviour is unchanged by the fleet contract; the banner's state machine models exactly one thing ("a new SW is waiting") and was not overloaded with check-result statuses.
- **No "Updating…" overlay for launch-apply.** The launch reload is sub-second on a warm cache and fires before any interaction; the contract's reuse-the-existing-single-reload instruction was followed instead of adding a flash overlay. Tracked in TODO if it proves noticeable on slow devices.
- **`registerType: 'prompt'` retained** in `vite.config.ts` — it is the mechanism that exposes the waiting worker; the policy is behaviour on top (per the spec, never raw `autoUpdate`, never tap-only prompt).

### Current state

Working. **Validation: theme-hex 11/11, svelte-check 0 errors / 0 warnings, eslint clean, calculator 301/301, web 6/6, `pnpm build` green.** Branch pushed; not merged.

### Key context for next session

- Runtime verification of the launch-apply loop (deploy → revisit → silent reload; toggle OFF → banner instead) needs a real browser on a deployed HTTPS instance — folded into the existing browser-bound backlog (TODO.md "PWA" section + the carried-over Phase F–I / Phase N items below).
- No unit tests were added for `$lib/pwa` — the web vitest config is node-env only (no jsdom, and `virtual:pwa-register` would need aliasing); PWA/theme/menu test coverage remains the deferred Phase J item.

---

## Carried-over open follow-ups (from the April–May 2026 migration sessions; see git log for full history)

1. **Branch self-review Phases F–I (browser + deployed)** — visual walkthrough dim + emerald, JS-disabled fallback, a11y/keyboard/SR sweep, PWA install + update + offline on deployed HTTPS, Save-as-PDF preview, Lighthouse, Vercel preview.
2. **DaisyUI migration audit Phase N (browser-bound)** — six visual checks; step-by-step in `docs/USER_ACTIONS.md`.
3. **Phase J — tests** for `$lib/theme`, `$lib/pwa`, burger menu, PWA components (optional unit + Playwright E2E; not yet authorised).
4. **Major-version dependency upgrade epic** — 16 remaining `pnpm audit` findings need svelte 4→5 / vite 5→8 etc.; see `docs/TODO.md`.
5. **Manual `pnpm approve-builds`** — see `docs/USER_ACTIONS.md`.

### Removal note (carried forward)

The debug system is alpha-only. When alpha ends, remove: `debugLog.ts`, `clipboardUtils.ts`, `DebugPill.svelte`, `#debug-root` + inline `<script>` + inline pill in `app.html`, dynamic import in `+layout.svelte`. The z-80 layer becomes unused.

---

For project architecture, file structure, and build commands, see `CLAUDE.md`. Backlog items live in `docs/TODO.md`.
