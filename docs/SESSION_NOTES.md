# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (March 23, 2026)

**Last completed**: Fixed stale product name references and orphaned compliance comment

**Status**: All documentation synced with actual code; stale name references fixed

### What was done this session

1. **CALCULATIONS.md — Fixed stale product name**: Title and conclusion referenced "Pricing Equilibrium Calculator" (old name). Updated to "Software Transaction Structuring Tool".
2. **UI_UX_GUIDE.md — Fixed stale product name**: Title and intro referenced "Pricing Equilibrium Calculator". Updated to "Software Transaction Structuring Tool".
3. **HISTORY.md — Fixed stale product name**: Intro referenced "Revenue Model Calculator". Updated to "Software Transaction Structuring Tool".
4. **calculator/src/index.ts — Cleaned up orphaned compliance comment**: Lines 285-289 had a "COMPLIANCE (to be implemented)" section with a commented-out export to a non-existent `compliance/transfer-pricing.js` module. Transfer pricing is fully implemented inline in each model's calculate function. Replaced misleading comment with accurate description.

### Known remaining issue

- **Model 3 model-use-cases doc**: Variant headings for 3D-3G describe different concepts than the code variants (e.g., doc says "Joint Venture Entity" for 3F but code says "Buy-In Arrangement"). The doc's business analysis is thorough and valuable, but the variant names/concepts diverged from the code. This requires a larger decision: update the code variant names to match the docs, or rewrite the doc business analysis. Flagged for a future session.

### Key Files Changed

- `docs/CALCULATIONS.md` — Fixed stale product name (was "Pricing Equilibrium Calculator")
- `docs/UI_UX_GUIDE.md` — Fixed stale product name (was "Pricing Equilibrium Calculator")
- `docs/HISTORY.md` — Fixed stale product name (was "Revenue Model Calculator")
- `packages/calculator/src/index.ts` — Replaced orphaned compliance module comment with accurate TP description

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
