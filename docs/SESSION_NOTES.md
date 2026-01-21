# Session Notes

> Context for the next session to continue without losing context. Update after each significant task.

---

## Current State (January 21, 2026)

**Last completed**: Dark theme implementation

**Status**: Dark theme redesign complete

### What was done this session

1. **Implemented dark theme** - Complete visual redesign:
   - Dark theme by default (background #1B1B1B, cards #2a2a2a)
   - Primary color: #2D68FF (blue for CTAs, links, focus states)
   - Figtree font family from Google Fonts
   - Semantic colors: success #16A34A, error #EF4444, warning #EAB308
   - CSS variable-based color system for Tailwind
   - Updated all component styles (.card, .btn, .input, .badge)
   - Updated all pages and layout for dark theme

### Key Files Changed

- `apps/web/tailwind.config.js` - New color system with CSS variables
- `apps/web/src/app.css` - CSS variables and dark theme component styles
- `apps/web/src/app.html` - Figtree font import, dark mode class
- `apps/web/src/routes/+layout.svelte` - Dark header/footer
- `apps/web/src/routes/+page.svelte` - Home page dark theme
- `apps/web/src/routes/structuring/+page.svelte` - Transaction structuring dark theme
- `apps/web/src/routes/structuring/[model]/+page.svelte` - Model calculator dark theme
- `apps/web/src/routes/pricing/+page.svelte` - Pricing calculator dark theme

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
