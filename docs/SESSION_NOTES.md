# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (April 10, 2026)

**Last completed**: Added "Save as PDF" buttons to pricing and structuring calculators

**Status**: Both calculator pages now have `window.print()` triggers; existing print CSS handles layout

### What was done this session

1. **Added "Save as PDF" button to structuring calculator** (`apps/web/src/routes/structuring/[model]/+page.svelte`): Placed in the existing action bar alongside "Save Option" and "Save As..." buttons.
2. **Added "Save as PDF" button to pricing calculator** (`apps/web/src/routes/pricing/+page.svelte`): Added to the results section header, right-aligned next to the "Results" heading.
3. Both buttons call `window.print()` and use the `no-print` CSS class so they auto-hide during print preview.
4. Existing `@media print` CSS in `app.css` already handles white background, hidden nav/buttons, page break control, and table borders.

### Known remaining issue

- **Model 3 model-use-cases doc**: Variant headings for 3D-3G describe different concepts than the code variants (e.g., doc says "Joint Venture Entity" for 3F but code says "Buy-In Arrangement"). Flagged for a future session.

### Key Files Changed

- `apps/web/src/routes/structuring/[model]/+page.svelte` — Added "Save as PDF" button to action bar
- `apps/web/src/routes/pricing/+page.svelte` — Added "Save as PDF" button to results header
- `docs/HISTORY.md` — Added changelog entry

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
