# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (February 13, 2026)

**Last completed**: CLAUDE.md restructure - merged engineering standards template with existing project context

**Status**: CLAUDE.md updated with merged content

### What was done this session

1. **Compared existing CLAUDE.md against proposed engineering standards template** - Identified gaps, overlaps, and conflicts
2. **Merged CLAUDE.md** - Combined both files into a single cohesive document:
   - Added HARD RULES section (code organization limits, decision documentation, UX rules, security, cleanup, quality checks)
   - Preserved AI SESSION MANAGEMENT (checklists, session notes, compact prep)
   - Added COMMUNICATION STYLE, TESTING, PROHIBITIONS sections
   - Added PROJECT-SPECIFIC CONFIGURATION with filled-in values (TypeScript, SvelteKit, pnpm, etc.)
   - Added explicit WORKFLOW (7 steps)
   - Preserved all project domain context (models, formulas, tax rules, benchmarks, troubleshooting)
   - Fixed stale "keep vanilla JS" instruction (now references TypeScript/SvelteKit)
   - Added Tailwind exception to "no inline CSS" rule
   - Updated decision documentation example to use project-relevant TypeScript/IRR code
   - Updated "Last Updated" to February 2026

### Key Files Changed

- `CLAUDE.md` - Complete restructure merging engineering standards with project context

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
