# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (February 27, 2026)

**Last completed**: Fixed calculator package exports for Vercel build

**Status**: Calculator exports point to source TypeScript files; Vercel build succeeds

### What was done this session

1. **Fixed Vercel build failure** — `@model-pear/calculator` exports pointed to `./dist/` which doesn't exist on Vercel (TypeScript not pre-compiled). Changed exports to point to `./src/*.ts` source files instead. Vite handles TypeScript natively, so no separate build step needed.

### Key Files Changed

- `packages/calculator/package.json` — Changed `main`, `module`, `types`, `exports`, and `files` from `dist/` to `src/` paths

### Verified

- All 301 calculator tests pass
- Web app builds successfully (`pnpm build` from `apps/web`)

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
