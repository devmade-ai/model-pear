# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (March 23, 2026)

**Last completed**: Aligned CLAUDE.md with glow-props canonical conventions

**Status**: CLAUDE.md now matches glow-props structure and conventions; all docs synced

### What was done this session

1. **Fixed stale product names**: Updated "Pricing Equilibrium Calculator" in CALCULATIONS.md and UI_UX_GUIDE.md, "Revenue Model Calculator" in HISTORY.md → all now say "Software Transaction Structuring Tool"
2. **Cleaned up orphaned compliance comment** in calculator/src/index.ts (referenced never-created module; TP is implemented inline)
3. **Aligned CLAUDE.md with glow-props conventions**:
   - Added "READ AND FOLLOW..." header and Process section
   - Added REMINDER banners after key sections
   - Added Principles #6 "Follow conventions" and #7 "Repeatable process"
   - Aligned Cleanup to use `// KEEP:` marker convention
   - Added specific Quality Check items (XSS via `{@html}`, reactivity, keys)
   - Added full Documentation section with per-doc descriptions (what/when/why) including BUSINESS_GUIDE.md as User Guide and TESTING_GUIDE.md
   - Added Triggers section (10 analysis triggers: review, audit, docs, mobile, clean, perf, security, debug, improve, start)
   - Added 3 missing Prohibitions from glow-props
   - Expanded AI Notes (commit before ending, sibling repo access, communication style merged in)
   - Removed standalone COMMUNICATION STYLE section (merged into AI Notes)
   - Updated cross-reference date to 2026-03-24

### Known remaining issue

- **Model 3 model-use-cases doc**: Variant headings for 3D-3G describe different concepts than the code variants (e.g., doc says "Joint Venture Entity" for 3F but code says "Buy-In Arrangement"). Flagged for a future session.

### Key Files Changed

- `CLAUDE.md` — Major alignment with glow-props conventions
- `docs/CALCULATIONS.md` — Fixed stale product name
- `docs/UI_UX_GUIDE.md` — Fixed stale product name
- `docs/HISTORY.md` — Fixed stale product name + new entry
- `packages/calculator/src/index.ts` — Cleaned up orphaned compliance comment

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
