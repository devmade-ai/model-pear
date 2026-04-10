# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (April 10, 2026)

**Last completed**: Debug system — in-memory logging + floating debug pill

**Status**: Debug system fully implemented following glow-props DEBUG_SYSTEM.md pattern. Build passes, 301 tests pass.

### What was done this session

1. **Fetched DEBUG_SYSTEM.md pattern** from glow-props repo (source of truth)
2. **Created `debugLog.ts`** (`apps/web/src/lib/debugLog.ts`): Circular buffer (200 entries), exported types (`DebugSource`, `DebugSeverity`, `MAX_ENTRIES`), shared `formatDebugTimestamp()`, pub/sub with immediate delivery, console interception (error/warn), global error capture, report generation with URL redaction, HMR guard, pre-framework error bridge with inline listener cleanup. All browser side-effects wrapped in `typeof window` guard for SSR safety.
3. **Created `clipboardUtils.ts`** (`apps/web/src/lib/clipboardUtils.ts`): Three-tier clipboard fallback (ClipboardItem Blob → writeText → textarea execCommand)
4. **Created `DebugPill.svelte`** (`apps/web/src/lib/components/DebugPill.svelte`): Floating pill with inline styles (not Tailwind), 3 tabs (Log with structured details, Environment, PWA Diagnostics with stale-run cancellation), mounted in separate `#debug-root` outside SvelteKit tree for crash isolation. Logs boot confirmation on mount.
5. **Updated `app.html`**: Added `#debug-root` div, pre-framework inline `<script>` with `window.__debugPushError()`, 20-second loading timeout, named listener references for cleanup
6. **Updated `+layout.svelte`**: Dynamic import of DebugPill (SSR-safe), stores pill reference, cleanup on unmount via `$destroy()`
7. **Verified**: Build passes, 301 tests pass, `debugLog.ts` confirmed absent from SSR bundle

### Key Files Changed

- `apps/web/src/lib/debugLog.ts` — Debug log module (new)
- `apps/web/src/lib/clipboardUtils.ts` — Clipboard utility (new)
- `apps/web/src/lib/components/DebugPill.svelte` — Debug pill component (new)
- `apps/web/src/app.html` — Added #debug-root and inline pre-framework pill
- `apps/web/src/routes/+layout.svelte` — Mount DebugPill into #debug-root

### Known remaining issue

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
└── apps/web/                     # SvelteKit 2.x frontend
    ├── src/
    │   ├── lib/
    │   │   ├── components/       # Svelte components + charts
    │   │   ├── config/           # Input fields + wizard config
    │   │   ├── stores/           # Svelte stores (comparison)
    │   │   └── utils/            # Formatting utilities
    │   └── routes/
    │       ├── +page.svelte      # Home page
    │       ├── pricing/          # Pricing calculator (5 models)
    │       └── structuring/      # Transaction tool routes
    ├── tests/e2e/                # Playwright E2E tests
    └── static/                   # Static assets
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
