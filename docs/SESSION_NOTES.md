# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (April 10, 2026)

**Last completed**: App icons — SVG source + Sharp generation pipeline

**Status**: All app icons generated and wired up. Favicon, Apple touch icon, and PWA manifest icons working.

### What was done this session

1. **Created SVG source icon** (`assets/icon-source.svg`): White pear silhouette on primary blue (#2D68FF), `shape-rendering="geometricPrecision"`, content within 80% maskable safe zone
2. **Added `sharp` devDependency** at root level with `pnpm.onlyBuiltDependencies` config for pnpm v10
3. **Created generation script** (`scripts/generate-icons.mjs`): 400 DPI rasterisation, outputs 5 PNGs (48, 180, 192, 512, 1024) to `apps/web/static/`
4. **Created PWA manifest** (`apps/web/static/manifest.webmanifest`): 192/512 as `any`, 1024 as `maskable`
5. **Updated app.html**: Added apple-touch-icon and manifest links
6. **Added `pnpm generate-icons`** script to root package.json

### Known remaining issue

- **Model 3 model-use-cases doc**: Variant headings for 3D-3G describe different concepts than the code variants (e.g., doc says "Joint Venture Entity" for 3F but code says "Buy-In Arrangement"). Flagged for a future session.

### Key Files Changed

- `assets/icon-source.svg` — SVG source icon (single source of truth)
- `scripts/generate-icons.mjs` — Sharp-based icon generation script
- `apps/web/static/manifest.webmanifest` — PWA manifest with icon entries
- `apps/web/static/*.png` — 5 generated icon PNGs
- `apps/web/src/app.html` — Added apple-touch-icon and manifest links
- `package.json` — Added sharp devDep, generate-icons script, onlyBuiltDependencies config
- `docs/HISTORY.md` — Changelog entry
- `docs/SESSION_NOTES.md` — Updated session context

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
