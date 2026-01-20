# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (January 20, 2026)

**Last completed**: Discovery session for the tool itself

**Status**: Ready to design "Negotiation Mode" and audit UI

### What was done this session

1. **Created DISCOVERY_FRAMEWORK.md** - Methodology for conducting discovery sessions
2. **Applied Discovery Framework to this tool** - Completed Session 1 (Quick Discovery)
3. **Documented findings** - Created DISCOVERY_FINDINGS.md with all insights
4. **Updated TODO.md** - Added high-priority action items from discovery

### Key Discovery Insight

> **Actual use case**: Tech-sales person guiding a non-technical exec + finance exec through options in a live session to reach agreement faster

This is different from "back-office analyst running complex scenarios alone."

### Design Principles (from discovery)

1. **Client in the room** - Every screen explainable in 10 seconds
2. **Neutral ground first** - Industry standards as defaults
3. **Show both sides** - "What you get / what they get" always visible
4. **Progressive complexity** - Simple first, details on demand
5. **Compare to decide** - Easy save/compare/choose flow

### Next Steps

1. Design the ideal "Negotiation Mode" flow (5-minute walkthrough)
2. Audit current UI against design principles
3. Create specific fix list from audit

### Key Files

- [DISCOVERY_FRAMEWORK.md](./DISCOVERY_FRAMEWORK.md) - The methodology
- [DISCOVERY_FINDINGS.md](./DISCOVERY_FINDINGS.md) - Findings for this tool

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
