# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (April 10, 2026)

**Last completed**: Aligned CLAUDE.md glow-props implementation patterns

**Status**: CLAUDE.md stale "Shared conventions with glow-props" AI Note replaced; standard Implementation Patterns section and prohibition added

### What was done this session

1. **Replaced stale AI Note** (~line 215): Removed "Shared conventions with glow-props" block referencing "suggested implementations". Replaced with canonical "Implementation patterns — always fetch from glow-props" note pointing to `docs/implementations/` in glow-props repo.
2. **Added "Implementation Patterns (Source of Truth)" section**: Standard section from glow-props CLAUDE.md with fetch instructions (GitHub Pages URL, GitHub API URL, listing command) and rules.
3. **Added prohibition**: "Create local copies of implementation pattern files in any repo — always fetch from glow-props"
4. **Verified**: No references to "suggested implementations in glow-props CLAUDE.md" remain.

### Known remaining issue

- **Model 3 model-use-cases doc**: Variant headings for 3D-3G describe different concepts than the code variants (e.g., doc says "Joint Venture Entity" for 3F but code says "Buy-In Arrangement"). Flagged for a future session.

### Key Files Changed

- `CLAUDE.md` — Replaced stale AI Note, added Implementation Patterns section, added prohibition

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
