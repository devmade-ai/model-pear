# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (February 27, 2026)

**Last completed**: Cross-project review of glow-props CLAUDE.md — adopted useful patterns

**Status**: CLAUDE.md updated, docs/AI_MISTAKES.md created

### What was done this session

1. **Reviewed external glow-props CLAUDE.md** — Compared against model-pear's CLAUDE.md to identify useful patterns
2. **Created docs/AI_MISTAKES.md** — New doc for logging AI assistant mistakes to prevent repeat errors across sessions (adopted from glow-props)
3. **Added cross-reference to glow-props** — HTML comment in AI Notes section linking to the sibling project's CLAUDE.md with last-reviewed date and list of shared conventions
4. **Added AI note** — "Ask clarifying questions before assuming bug causes" (from glow-props AI Notes)
5. **Added AI note** — "Check docs/AI_MISTAKES.md at session start and log new mistakes"
6. **Updated documentation reference table** — Added AI_MISTAKES.md entry
7. **Updated file tree** — Added AI_MISTAKES.md to the docs/ listing

### Key Files Changed

- `CLAUDE.md` — AI Notes expanded (2 new notes + cross-reference comment), doc reference table updated, file tree updated
- `docs/AI_MISTAKES.md` — New file
- `docs/SESSION_NOTES.md` — Updated with current session context
- `docs/HISTORY.md` — Added entry for this change

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
