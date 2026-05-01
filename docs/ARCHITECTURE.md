# Architecture

> **Status**: Complete
> **Completed**: January 2026
> **Goal**: Migrate from vanilla JS to TypeScript + SvelteKit for improved maintainability, type safety, and testability

## Table of Contents

1. [Why Redesign](#why-redesign)
2. [Architecture Comparison](#architecture-comparison)
3. [New Tech Stack](#new-tech-stack)
4. [Directory Structure](#directory-structure)
5. [Migration Strategy](#migration-strategy)
6. [Core Principles](#core-principles)
7. [Package Details](#package-details)
8. [Decision Log](#decision-log)

---

## Why Redesign

### Current Pain Points

| Issue | Impact | Solution |
|-------|--------|----------|
| No type safety | Runtime errors, hard to refactor | TypeScript |
| Manual pub/sub state | Complex, easy to introduce bugs | Svelte stores |
| No build process | No tree-shaking, no minification | Vite |
| No tests | Can't verify calculations are correct | Vitest |
| Mixed concerns | UI and calculations intertwined | Separate packages |
| ~28,000 lines vanilla JS | Hard to maintain and extend | Component-based architecture |

### Benefits of Redesign

1. **Type Safety**: Catch errors at compile time, not runtime
2. **Testable Calculations**: Pure functions with comprehensive unit tests
3. **Better DX**: Fast HMR, autocomplete, refactoring support
4. **Smaller Bundles**: Tree-shaking removes unused code
5. **Maintainability**: Clear separation of concerns
6. **Future-Proof**: Could publish calculator as npm package, build CLI, etc.

---

## Architecture Comparison

### Before (Current)

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                     index.html                          │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │ │
│  │  │ app.js  │  │models/  │  │  ui/    │  │ state/  │   │ │
│  │  │         │  │         │  │         │  │         │   │ │
│  │  │ ~40 ES6 modules loaded via <script type="module">   │ │
│  │  │ No bundling, no tree-shaking, no type checking      │ │
│  │  └─────────┴──┴─────────┴──┴─────────┴──┴─────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    CDN Libraries                        │ │
│  │  Tailwind CSS (full)  │  ApexCharts (full)             │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### After (New)

```
┌─────────────────────────────────────────────────────────────┐
│                     Build Time (Vite)                        │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │ packages/calculator │  │      apps/web (SvelteKit)   │  │
│  │                     │  │                             │  │
│  │  Pure TypeScript    │  │  Svelte Components         │  │
│  │  No UI dependencies │  │  Svelte Stores             │  │
│  │  100% testable      │  │  Tailwind (purged)         │  │
│  │                     │  │  ApexCharts (tree-shaken)  │  │
│  └──────────┬──────────┘  └──────────────┬──────────────┘  │
│             │                            │                  │
│             └──────────┬─────────────────┘                  │
│                        ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Optimized Static Build                     │ │
│  │  - Minified JS bundles (code-split)                    │ │
│  │  - Purged CSS (only used classes)                      │ │
│  │  - Pre-rendered HTML                                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Vercel (static hosting)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## New Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Language** | TypeScript 5.x | Type safety for financial calculations |
| **Framework** | SvelteKit 2.x + adapter-static | Small bundles, built-in reactivity, SPA fallback to `/200.html` |
| **Styling** | Tailwind CSS v4 (CSS-first config) + DaisyUI v5 | `emerald` (light) + `dim` (dark) themes; `@import "tailwindcss"` + inline `@theme`; no `tailwind.config.js` |
| **Charts** | ApexCharts | Keep familiar API, bundle only what's used; theme-aware via `theme:change` event |
| **PWA** | vite-plugin-pwa + workbox-window | `registerType: 'prompt'` for user-controlled SW updates; `navigateFallback: '/200.html'` aligns with adapter-static |
| **Build** | Vite 5.x | Fast dev server, optimized production builds |
| **Linting** | ESLint v10 (flat config) + typescript-eslint + eslint-plugin-svelte | Catches a11y, navigation-resolve, each-key, immutable-reactive issues |
| **Testing** | Vitest | Fast, native ESM support, works with TypeScript |
| **E2E Testing** | Playwright | Cross-browser testing for critical flows |
| **Package Manager** | pnpm | Fast, disk-efficient, good monorepo support |
| **Monorepo** | pnpm workspaces | Simple, no extra tooling needed |
| **Hosting** | Vercel | Static hosting with SPA rewrites, auto-deploy on push |

---

## Directory Structure

```
model-pear/
├── packages/
│   └── calculator/                       # Pure TypeScript calculation engine
│       ├── src/
│       │   ├── models/                   # 6 transaction models (47 variants)
│       │   │   ├── index.ts              # Model registry + re-exports
│       │   │   ├── model-1-cost-plus.ts
│       │   │   ├── model-2-licence.ts
│       │   │   ├── model-3-joint-development.ts
│       │   │   ├── model-4-bot.ts
│       │   │   ├── model-5-software-sale.ts
│       │   │   └── model-6-saas.ts
│       │   ├── projections/              # NPV / IRR / payback (in calculations.ts)
│       │   │   ├── calculations.ts
│       │   │   ├── types.ts
│       │   │   └── index.ts
│       │   ├── sensitivity/              # Ranges / scenarios / Monte Carlo
│       │   │   ├── calculations.ts
│       │   │   ├── types.ts
│       │   │   └── index.ts
│       │   └── types/                    # Shared interfaces
│       │       ├── common.ts
│       │       ├── entities.ts
│       │       ├── results.ts
│       │       └── index.ts
│       └── tests/                        # 301 unit tests (8 files)
│
├── apps/
│   └── web/                              # SvelteKit application
│       ├── eslint.config.js              # ESLint flat config (TS + Svelte)
│       ├── postcss.config.js             # @tailwindcss/postcss only (no v3 plugins)
│       ├── svelte.config.js
│       ├── vite.config.ts                # SvelteKit + VitePWA plugin
│       ├── src/
│       │   ├── app.css                   # @import tailwindcss + @plugin daisyui + @theme + @media print
│       │   ├── app.d.ts                  # Global Window / Navigator augmentation
│       │   ├── app.html                  # Pre-paint theme bootstrap + early beforeinstallprompt capture
│       │   ├── lib/
│       │   │   ├── theme.ts              # Runtime theme management (window.__theme)
│       │   │   ├── pwa.ts                # SW + install + update (window.__pwa)
│       │   │   ├── debugLog.ts           # Alpha-only in-memory debug log
│       │   │   ├── clipboardUtils.ts     # Three-tier clipboard fallback
│       │   │   ├── components/
│       │   │   │   ├── UpdateBanner.svelte    # PWA update prompt (z-70)
│       │   │   │   ├── InstallModal.svelte    # Browser-specific install instructions
│       │   │   │   ├── DebugPill.svelte       # Floating debug pill (alpha)
│       │   │   │   ├── DeveloperResults.svelte / BuyerResults.svelte
│       │   │   │   ├── ComparisonManager.svelte / ComparisonView.svelte
│       │   │   │   ├── StructureWizard.svelte
│       │   │   │   ├── SensitivityPanel.svelte / ProjectionsPanel.svelte
│       │   │   │   ├── TransferPricingResults.svelte
│       │   │   │   ├── InputField.svelte
│       │   │   │   ├── Result{Panel,Row,Section}.svelte
│       │   │   │   └── charts/                # ApexCharts wrappers (BaseChart + 6 charts)
│       │   │   ├── stores/
│       │   │   │   ├── comparison.ts          # Saved options (the only store currently)
│       │   │   │   └── comparison.types.ts
│       │   │   ├── config/                    # Wizard + input field configs
│       │   │   ├── utils/
│       │   │   │   ├── trackListener.ts       # Type-aware event-listener tracker
│       │   │   │   ├── bodyScrollLock.ts      # Reference-counted scroll lock
│       │   │   │   └── formatters.ts
│       │   │   └── components/index.ts        # Barrel export
│       │   └── routes/
│       │       ├── +layout.svelte             # Burger menu + UpdateBanner + InstallModal mount
│       │       ├── +page.svelte               # Landing / mode selector
│       │       ├── pricing/+page.svelte       # Mode 1: 5 pricing models
│       │       └── structuring/
│       │           ├── +page.svelte           # Options Overview + Wizard
│       │           └── [model]/+page.svelte   # Model 1-6 calculator
│       ├── static/                            # Served at root URL
│       │   ├── favicon.png                    # 48×48 tab icon
│       │   ├── apple-touch-icon.png           # 180×180 iOS home screen
│       │   ├── icon-192.png / icon-512.png    # PWA manifest (purpose: any)
│       │   └── icon-1024.png                  # PWA manifest (purpose: maskable)
│       └── tests/e2e/                         # Playwright (comparison, mobile, navigation, pricing, structuring)
│
├── assets/icon-source.svg                # Edit this, run `pnpm generate-icons`
├── scripts/generate-icons.mjs            # Sharp: SVG → PNG icons
│
├── docs/                                 # Documentation (shared)
│   ├── README.md
│   ├── BUSINESS_GUIDE.md / CALCULATIONS.md / ARCHITECTURE.md (this)
│   ├── SESSION_NOTES.md / TODO.md / USER_ACTIONS.md / AI_MISTAKES.md
│   └── model-use-cases/                  # Per-model when-to-use guides
│
├── CLAUDE.md                             # AI assistant context (root)
├── pnpm-workspace.yaml                   # Monorepo config
└── package.json                          # Root package
```

> The PWA manifest used to live at `apps/web/static/manifest.webmanifest`; it was removed once VitePWA started generating one at build time so there's a single source of truth (the `manifest:` block in `vite.config.ts`).

---

## Migration Status

### ✅ Completed

All migration phases are complete:

**Phase 1: Foundation**
- ✅ Architecture documentation
- ✅ Monorepo with pnpm workspaces
- ✅ Calculator package with TypeScript
- ✅ All 6 models with full types
- ✅ Comprehensive tests (301 tests passing)

**Phase 2: Complete Calculator Package**
- ✅ Models 1-6 fully implemented
- ✅ Projection calculations (NPV, IRR, sensitivity)
- ✅ 90%+ test coverage on calculations

**Phase 3: Build New UI**
- ✅ SvelteKit with Tailwind CSS
- ✅ Core UI components and charts
- ✅ Mode 1: Pricing Calculator (5 models)
- ✅ Mode 2: Transaction Structuring (6 models, 47 variants)
- ✅ Compare Mode with save/load
- ✅ Structure Selector wizard

**Phase 4: Polish & Deploy**
- ✅ Static build to Vercel
- ✅ Legacy code removed

---

## Core Principles

### 1. Separation of Concerns

```
┌─────────────────────────────────────────────────────────────┐
│                    packages/calculator                       │
│                                                             │
│  • Pure functions only (no side effects)                    │
│  • No DOM, no UI, no browser APIs                           │
│  • Input → Output (deterministic)                           │
│  • 100% unit testable                                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ imports
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       apps/web                               │
│                                                             │
│  • Svelte components (presentation)                         │
│  • Svelte stores (state management)                         │
│  • Event handlers (user interaction)                        │
│  • Side effects (localStorage, charts)                      │
└─────────────────────────────────────────────────────────────┘
```

### 2. Type-First Design

All calculations start with TypeScript interfaces:

```typescript
// Define the shape of inputs
interface CostPlusInputs {
  developmentCost: number;      // R (ZAR)
  researchPhaseCost: number;    // R (ZAR)
  developmentPhaseCost: number; // R (ZAR)
  markupPercentage: number;     // 0-100
  usefulLife: number;           // Years
  corporateTaxRate: number;     // 0-100
  section11eType: 'pc-2yr' | 'mainframe-5yr';
}

// Define the shape of outputs
interface CostPlusResult {
  developer: DeveloperPerspective;
  buyer: BuyerPerspective;
  transferPricing: TransferPricingAssessment;
  metadata: CalculationMetadata;
}

// Function signature is self-documenting
function calculate(
  inputs: CostPlusInputs,
  variant: CostPlusVariant
): CostPlusResult;
```

### 3. Immutability

All state updates create new objects:

```typescript
// Svelte store example
import { writable, derived } from 'svelte/store';

export const inputs = writable<CostPlusInputs>(defaultInputs);

// Derived state - automatically recalculates
export const results = derived(inputs, ($inputs) =>
  calculate($inputs, selectedVariant)
);

// Updates create new state (never mutate)
inputs.update(current => ({
  ...current,
  markupPercentage: 15
}));
```

### 4. Testability

Every calculation has corresponding tests:

```typescript
// tests/models/model-1-cost-plus.test.ts
import { describe, it, expect } from 'vitest';
import { calculate } from '../../src/models/model-1-cost-plus';

describe('Model 1: Cost-Plus', () => {
  describe('variant 1B: Standard Cost-Plus', () => {
    it('calculates developer revenue with 10% markup', () => {
      const inputs = {
        developmentCost: 1_000_000,
        markupPercentage: 10,
        // ... other inputs
      };

      const result = calculate(inputs, '1B');

      expect(result.developer.revenue.total).toBe(1_100_000);
    });

    it('calculates developer profit correctly', () => {
      const inputs = { /* ... */ };
      const result = calculate(inputs, '1B');

      expect(result.developer.profit.gross).toBe(100_000);
      expect(result.developer.profit.margin).toBe(10);
    });
  });
});
```

---

## Package Details

### @model-pear/calculator

**Purpose**: Pure TypeScript calculation engine with no UI dependencies.

**Public API**:

```typescript
// Models
export { calculateCostPlus } from './models/model-1-cost-plus';
export { calculateLicence } from './models/model-2-licence';
// ... etc

// Projections
export { calculateNPV } from './projections/npv';
export { calculateIRR } from './projections/irr';
export { calculatePayback } from './projections/payback';
export { runSensitivityAnalysis } from './projections/sensitivity';

// Compliance
export { assessTransferPricing } from './compliance/transfer-pricing';

// Types (for consumers)
export type {
  CostPlusInputs,
  CostPlusResult,
  DeveloperPerspective,
  BuyerPerspective,
  // ... etc
} from './types';

// Constants
export { TAX_RATES, BENCHMARK_RANGES } from './constants';
```

**Design Decisions**:

1. **Zero runtime dependencies**: Pure TypeScript, no validation library or formatter — type checks happen at the boundary in `apps/web` before calling into the calculator
2. **Tree-shakeable**: Only import what you use
3. **Platform-agnostic**: Works in browser, Node, Deno, etc.
4. **Versioned**: Follows semver for API stability

### apps/web

**Purpose**: SvelteKit application that provides the user interface.

**Key Dependencies**:
- `@model-pear/calculator` (local package)
- `svelte` 4.x + `@sveltejs/kit` 2.x + `@sveltejs/adapter-static`
- `tailwindcss` v4 + `@tailwindcss/postcss` + `daisyui` v5
- `apexcharts`
- `vite-plugin-pwa` + `workbox-window`

**Routing**:

| Route | Description |
|-------|-------------|
| `/` | Landing page with mode selector |
| `/pricing` | Mode 1: Pricing Calculator (5 pricing models) |
| `/structuring` | Mode 2: Options Overview + Structure Selector wizard |
| `/structuring/[model]` | Specific transaction model calculator (model 1-6) |

Side-by-side comparison is rendered in-place on `/structuring/[model]` via `ComparisonView` — there is no `/structuring/compare` route.

---

## Decision Log

### Why SvelteKit over Next.js/React?

| Factor | SvelteKit | Next.js/React |
|--------|-----------|---------------|
| Bundle size | Smaller (compiles away) | Larger (runtime) |
| Reactivity | Built-in, simple | Requires hooks, more boilerplate |
| Learning curve | Lower | Higher |
| Static export | First-class support | Supported but more config |
| This use case | Perfect fit | Overkill |

### Why pnpm over npm/yarn?

1. **Faster** - Efficient caching and linking
2. **Disk efficient** - Single copy of each package version
3. **Strict** - Prevents phantom dependencies
4. **Monorepo support** - Built-in workspaces

### Why Vitest over Jest?

1. **Native ESM** - No transpilation needed
2. **Fast** - Uses Vite's transform pipeline
3. **Compatible** - Jest-like API, easy migration
4. **TypeScript** - First-class support

---

## Development

### Running the Application

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Development server
pnpm dev

# Production build
pnpm build
```

### Project Structure

The application is organized as a TypeScript monorepo:
- **packages/calculator**: Pure calculation logic with 301 tests
- **apps/web**: SvelteKit frontend with both modes

See [SESSION_NOTES.md](./SESSION_NOTES.md) for recent changes.
