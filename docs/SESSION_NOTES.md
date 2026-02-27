# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (February 27, 2026)

**Last completed**: Migrated from GitHub Pages to Vercel deployment

**Status**: GitHub Pages workflow and artifacts removed, Vercel config added, all docs updated

### What was done this session

1. **Reviewed external glow-props CLAUDE.md** — Adopted AI_MISTAKES.md and cross-reference patterns
2. **Migrated hosting from GitHub Pages to Vercel**:
   - Deleted `.github/workflows/deploy.yml` (GitHub Actions deploy workflow)
   - Deleted `.nojekyll` (GitHub Pages artifact)
   - Updated `svelte.config.js` — removed `paths.base: '/model-pear'`, changed fallback from `404.html` to `200.html`
   - Added `vercel.json` at repo root (build command, output directory, SPA rewrites)
   - Updated all docs referencing GitHub Pages (CLAUDE.md, ARCHITECTURE.md, README.md)
3. **Note**: `{base}` imports from `$app/paths` kept in Svelte files — SvelteKit best practice, resolves to `''` with no base path configured

### Key Files Changed

- `.github/workflows/deploy.yml` — Deleted
- `.nojekyll` — Deleted
- `vercel.json` — New file (Vercel deployment config)
- `apps/web/svelte.config.js` — Removed GitHub Pages base path and 404 fallback
- `CLAUDE.md` — Hosting changed to Vercel, file tree updated, troubleshooting updated
- `docs/ARCHITECTURE.md` — Hosting references updated
- `docs/README.md` — Hosting reference updated

### Vercel Setup Required

To complete the migration, connect the repo in the Vercel dashboard:
1. Import the `devmade-ai/model-pear` repo in Vercel
2. Vercel will auto-detect the config from `vercel.json`
3. Auto-deploys on push to `main`

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
