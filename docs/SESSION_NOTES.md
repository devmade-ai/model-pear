# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (February 27, 2026)

**Last completed**: Fixed Vercel build — calculator exports, output directory, and vercel.json location

**Status**: All three Vercel build errors resolved; build succeeds end-to-end

### What was done this session

1. **Fixed calculator package resolution** — `@model-pear/calculator` exports pointed to `./dist/` which doesn't exist on Vercel (TypeScript not pre-compiled). Changed exports to point to `./src/*.ts` source files instead. Vite handles TypeScript natively, so no separate build step needed.
2. **Fixed Vercel output directory not found (attempt 1)** — Added `"framework": null` to root `vercel.json` to disable SvelteKit auto-detection. This had no effect because Vercel's Root Directory is set to `apps/web` in the dashboard, so the root `vercel.json` was completely ignored.
3. **Fixed Vercel output directory not found (actual fix)** — Moved `vercel.json` from repo root to `apps/web/vercel.json`. Since Vercel's Root Directory is `apps/web`, only `apps/web/vercel.json` is read. Changed `outputDirectory` from `"apps/web/build"` to `"build"` (now relative to `apps/web`). Removed `buildCommand` and `installCommand` (Vercel auto-detects pnpm and uses `package.json` build script). Kept `framework: null` and SPA rewrites.

### Key Files Changed

- `packages/calculator/package.json` — Changed `main`, `module`, `types`, `exports`, and `files` from `dist/` to `src/` paths
- `apps/web/vercel.json` — **NEW** — Moved from repo root; `framework: null`, `outputDirectory: "build"`, SPA rewrites
- `vercel.json` (root) — **DELETED** — Ignored by Vercel since Root Directory is `apps/web`
- `apps/web/svelte.config.js` — Removed redundant adapter-static options, updated comment about vercel.json location

### Verified

- All 301 calculator tests pass
- Web app builds successfully with no warnings
- 200.html fallback page generated correctly

### Important: Vercel Dashboard Config

- **Root Directory**: `apps/web` (set in Vercel dashboard, not in code)
- This means `vercel.json` must live at `apps/web/vercel.json`, not repo root
- All paths in `vercel.json` are relative to `apps/web`

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
```

---

## Future Ideas

- **Recommendation Summary** - Add weighted scoring to Compare Mode
- **Accounting Treatment Comparison** - Journal entries side-by-side in Compare Mode
- **Rename "intercompany" folders** - Rename to `transactions/` (low priority)
