# AI Mistakes Log

> **Purpose**: Track AI assistant mistakes and learnings so they are not repeated across sessions.
> **Last Updated**: February 2026

When an AI assistant makes a mistake during a session, document it here so future sessions can avoid the same error.

---

## Format

```
### [Short description of mistake]
**Date**: YYYY-MM-DD
**Impact**: low | medium | high
**What happened**: Brief description of the error
**Root cause**: Why it happened
**Prevention**: What to do differently next time
```

---

## Entries

### Ran multiple validation tiers without pausing for direction
**Date**: 2026-04-29
**Impact**: medium
**What happened**: During a "double-check the branch" sweep with explicit per-tier pause-and-confirm rules from the user, ran four sub-tiers back-to-back, fixed drift inline, committed and pushed — all without surfacing decision points. The user couldn't redirect any of them.
**Root cause**: Treated "the work" as the unit of progress instead of "the decision". Trigger framework in CLAUDE.md mandates pausing after each pass for `fix`/`skip`/`stop`; ignored that for the validation pass framing.
**Prevention**: One trigger / phase item / sub-tier per turn. Report findings, then stop. Do not auto-advance even when a phase has no findings — the user's response is the gate, not the absence of findings. Push to remote requires explicit authorization scoped to the change being pushed.

### Tried to widen an exception to preserve custom code
**Date**: 2026-04-29
**Impact**: medium
**What happened**: Audit (B2) found hardcoded colors in DebugPill.svelte that violated the branch's "themes are the brand, no custom colours" rule. Proposed three options including (c) "widen the documented exception to cover the rgba shadows too." User pushback was sharp ("are you seriously telling me it's better to widen an exception specifically around keeping custom code instead of using framework tokens?").
**Root cause**: Defaulted to the path of least change instead of evaluating against the branch's actual stated rule. Failed to ask: "is the custom code even needed?" — which it wasn't.
**Prevention**: When a finding violates a stated project rule, fix the violation, don't expand the rule's exception list. Always ask "is the custom shit even needed?" before defending it.

### Grep scoped to one extension misses the same problem in other file types
**Date**: 2026-04-29
**Impact**: low
**What happened**: B2 audit grep targeted `*.svelte` only. Reported PASS clean. B5's reading of `app.html` then surfaced 6 hardcoded colors there, plus a re-grep of `app.css` print block found 6 more. Same problem class, different file types.
**Root cause**: Picked the dominant file type for the codebase but treated the audit as exhaustive.
**Prevention**: For "no X anywhere" audits, grep across all relevant file extensions in one pass: `*.svelte` + `*.ts` + `*.css` + `*.html` + config files. State the file types covered in the audit report.

### `pnpm build` green ≠ SSR works; check actual route HTTP response
**Date**: 2026-04-29
**Impact**: high
**What happened**: Tier 2.x mechanical checks (build, lint, manifest) all passed. Tier 3.5 (SSR shape — curl every route in production preview) caught all 9 routes returning 500 with `ReferenceError: window is not defined` in `UpdateBanner.svelte` onDestroy.
**Root cause**: `adapter-static` builds a SPA fallback (`/200.html`) that doesn't fully render every route at build time, so SSR execution bugs slip through `pnpm build`. Svelte 4's `onDestroy` runs during SSR teardown — without a `typeof window` guard, `window.__pwa.setUpdateBannerCallback(null)` throws on the server.
**Prevention**: For Svelte components that touch `window`/`document` in any lifecycle hook (especially `onDestroy`), always guard with `typeof window === 'undefined' && return`. The svelte 4 footgun: `onMount` is client-only, but `onDestroy` IS called during SSR teardown. Validate by curling actual production routes, not just by checking that the build script exits 0.

### Svelte 4 `$:` tracks lexical reads at the top level only — not closures
**Date**: 2026-04-29
**Impact**: high
**What happened**: All 6 chart components used `$: options = makeOptions(themeKey);` where `makeOptions` read prop data via closure. Svelte's compile-time dependency analysis only tracked `themeKey`, so when data props changed (without a theme flip), `options` was never recomputed and BaseChart kept the stale chart options. Bug only manifested on data-prop updates between theme flips — masked by HMR / page reloads / theme toggle during dev.
**Root cause**: Pattern was extracted to satisfy an earlier svelte-check error about comma-operator unused-LHS. The function-call pattern silenced the check but inadvertently broke reactivity. No one caught it because the workflow always involved theme toggle / reload.
**Prevention**: For Svelte 4 reactive blocks where the right-hand side is a function call, every reactive dependency MUST appear in the call expression itself (not inside the function body). Pattern: `$: result = compute(dep1, dep2, dep3);` even if `compute` reads them via closure — Svelte tracks lexical reads on the RHS, not closure captures.

