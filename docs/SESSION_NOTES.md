# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (March 3, 2026)

**Last completed**: Comprehensive documentation and code comments audit + fixes

**Status**: All documentation synced with actual code; stale references removed; decision comments added

### What was done this session

1. **CLAUDE.md — Fixed 15 stale .js file references**: The "Three Modules" and "Advanced Features" sections referenced pre-TypeScript `.js` files that no longer exist (e.g., `models/intercompany/structure-selector.js`). Replaced all with actual Svelte/TS component paths.
2. **CLAUDE.md — Fixed model filenames**: Architecture section listed `costPlus.ts`, `licenceRoyalties.ts` etc. Actual filenames are `model-1-cost-plus.ts`, `model-2-licence.ts` etc. Also added missing `projections/` and `sensitivity/` directories to the file tree.
3. **CLAUDE.md — Added 4 missing docs to documentation table**: `DISCOVERY_FINDINGS.md`, `DISCOVERY_FRAMEWORK.md`, `NEGOTIATION_MODE.md`, `UI_UX_GUIDE.md` exist but weren't listed.
4. **CLAUDE.md — Fixed stale references**: Removed `EXTRACTION_PLAYBOOK.md` reference (file doesn't exist). Updated Troubleshooting section (removed ES6/pub-sub references, added Svelte-relevant advice).
5. **BUSINESS_GUIDE.md — Synced variant names for Models 3, 4, 5, 6**: Variant names in the tables were completely different from the code. Updated all to match `packages/calculator/src/models/` VARIANTS definitions.
6. **README.md — Fixed variant counts**: Model 3 said "7 + Required Provisions", Model 4 said "7 + Standard Provisions". Both are actually 8 (3A-3H, 4A-4H).
7. **Model-use-cases — Removed 6 stale concept file links**: All 6 docs linked to `model_N_*_concept.md` files that don't exist. Removed dead links. Fixed variant count headers for Models 3 and 4.
8. **Code comments — Added decision documentation to 3 files**: `model-6-saas.ts` (why simpler than Models 1-2), `pricing/+page.svelte` (equilibrium pricing formula + 40% heuristic), `structuring/[model]/+page.svelte` (progressive disclosure + modelConfigs rationale).
9. **Created `/docs/working/` directory**: Referenced in CLAUDE.md but didn't exist.

### Known remaining issue

- **Model 3 model-use-cases doc**: Variant headings for 3D-3G describe different concepts than the code variants (e.g., doc says "Joint Venture Entity" for 3F but code says "Buy-In Arrangement"). The doc's business analysis is thorough and valuable, but the variant names/concepts diverged from the code. This requires a larger decision: update the code variant names to match the docs, or rewrite the doc business analysis. Flagged for a future session.

### Key Files Changed

- `CLAUDE.md` — File references, model filenames, documentation table, troubleshooting, dates
- `docs/BUSINESS_GUIDE.md` — Variant names for Models 3, 4, 5, 6
- `docs/README.md` — Variant counts for Models 3, 4
- `docs/model-use-cases/*.md` (all 6) — Removed stale concept file links, fixed variant counts
- `packages/calculator/src/models/model-6-saas.ts` — Decision documentation comments
- `apps/web/src/routes/pricing/+page.svelte` — Decision documentation comments
- `apps/web/src/routes/structuring/[model]/+page.svelte` — Decision documentation comments
- `docs/working/.gitkeep` — New directory

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
