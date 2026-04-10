# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (April 10, 2026)

**Last completed**: Z-index scale — audit and normalize to glow-props standard

**Status**: All z-index values in the codebase now follow the glow-props Z_INDEX_SCALE standard. Tailwind config extended with z-60/70/80 utilities. Build verified, 301 tests pass.

### What was done this session

1. **Fetched Z_INDEX_SCALE pattern** from glow-props repo (source of truth)
2. **Audited all z-index usage** — found 4 values across 3 files
3. **Normalized values to the standard scale**:
   - `+layout.svelte`: Sticky header `z-40` → `z-20` (layer: Sticky headers)
   - `[model]/+page.svelte`: Save Modal `z-50` → `z-60` (layer: Modal)
   - `ComparisonView.svelte`: Comparison modal `z-50` → `z-60` (layer: Modal)
   - `ComparisonView.svelte`: Sticky thead `z-10` — already correct (layer: Base content)
4. **Extended Tailwind config** with `zIndex: { 60, 70, 80 }` for named classes (avoids arbitrary `z-[60]` syntax)
5. **Verified**: Build passes, 301 tests pass

### Known remaining issue

- **Model 3 model-use-cases doc**: Variant headings for 3D-3G describe different concepts than the code variants (e.g., doc says "Joint Venture Entity" for 3F but code says "Buy-In Arrangement"). Flagged for a future session.

### Key Files Changed

- `assets/icon-source.svg` — SVG source icon (single source of truth)
- `scripts/generate-icons.mjs` — Sharp-based icon generation script with error handling
- `apps/web/static/manifest.webmanifest` — PWA manifest with icon entries
- `apps/web/static/*.png` — 5 generated icon PNGs
- `apps/web/src/app.html` — apple-touch-icon, manifest link, theme-color meta
- `package.json` — sharp devDep, generate-icons script, onlyBuiltDependencies config
- `CLAUDE.md` — Updated file structure and build commands
- `docs/ARCHITECTURE.md` — Fixed static/ nesting, updated icon file listing
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
pnpm generate-icons   # Regenerate PNGs from assets/icon-source.svg
```

---

## Future Ideas

- **Recommendation Summary** - Add weighted scoring to Compare Mode
- **Accounting Treatment Comparison** - Journal entries side-by-side in Compare Mode
- **Rename "intercompany" folders** - Rename to `transactions/` (low priority)
