# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (January 20, 2026)

**Last completed**: All Negotiation Mode UI changes implemented

**Status**: P1, P2, and P3 complete

### What was done this session

1. **Created DISCOVERY_FRAMEWORK.md** - Methodology for conducting discovery sessions
2. **Applied Discovery Framework to this tool** - Completed Session 1 (Quick Discovery)
3. **Documented findings** - Created DISCOVERY_FINDINGS.md with all insights
4. **Designed Negotiation Mode** - Created NEGOTIATION_MODE.md with:
   - 5-minute walkthrough script
   - Screen-by-screen requirements
   - Feature visibility matrix
5. **Audited current UI** - Compared against 5 design principles, documented gaps
6. **Implemented UI changes**:
   - Added `benchmark` and `essential` fields to InputFieldConfig
   - Added "Industry Standard" badges to key input fields
   - Grouped inputs into Essential/Advanced sections (collapsible)
   - Collapsed Sensitivity/Projections into "Advanced Analysis" section
   - Collapsed Transfer Pricing by default
   - Added one-click "Save Option" with auto-generated names
   - Added saved options count in action bar
7. **Enhanced Comparison View**:
   - Added "Quick Summary" section showing best-for insights per option
   - Added ★ winner indicators on best values in comparison table
   - Enhanced green highlighting for winning metrics

### Key Discovery Insight

> **Actual use case**: Tech-sales person guiding a non-technical exec + finance exec through options in a live session to reach agreement faster

### All Planned Work Complete

All Priority 1, 2, and 3 items from the Negotiation Mode audit have been implemented.

**Completed refinement**: Fixed TransferPricingResults nested card styling by adding `minimal` prop.

**Industry standards as defaults**: Verified that all default values match industry benchmarks:
- `markupPercentage: 10` (within Industry: 5-15%)
- `corporateTaxRate: 27` (matches SA: 27%)
- `usefulLife: 5` (within Typical: 3-10 years)
- `contractLengthMonths: 36` (within Typical: 12-36 months)

### Key Files Changed

- `apps/web/src/lib/config/inputFields.ts` - Added benchmark/essential props
- `apps/web/src/lib/components/InputField.svelte` - Display benchmark badges
- `apps/web/src/lib/components/ComparisonView.svelte` - Summary + winner indicators
- `apps/web/src/routes/structuring/[model]/+page.svelte` - Major UI refactor

### Key Documentation

- [DISCOVERY_FRAMEWORK.md](./DISCOVERY_FRAMEWORK.md) - The methodology
- [DISCOVERY_FINDINGS.md](./DISCOVERY_FINDINGS.md) - Findings for this tool
- [NEGOTIATION_MODE.md](./NEGOTIATION_MODE.md) - Design and UI audit

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
