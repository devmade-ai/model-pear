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
| **Framework** | SvelteKit 2.x | Small bundles, built-in reactivity, static export |
| **Styling** | Tailwind CSS 3.x | Keep familiar styling, but bundled properly |
| **Charts** | ApexCharts | Keep familiar API, bundle only what's used |
| **Build** | Vite 5.x | Fast dev server, optimized production builds |
| **Testing** | Vitest | Fast, native ESM support, works with TypeScript |
| **E2E Testing** | Playwright | Cross-browser testing for critical flows |
| **Package Manager** | pnpm | Fast, disk-efficient, good monorepo support |
| **Monorepo** | pnpm workspaces | Simple, no extra tooling needed |
| **Validation** | Zod | Runtime validation of financial inputs |
| **Hosting** | Vercel | Static hosting with SPA rewrites, auto-deploy on push |

---

## Directory Structure

```
model-pear/
├── packages/
│   └── calculator/                 # Pure TypeScript calculation engine
│       ├── package.json
│       ├── tsconfig.json
│       ├── vitest.config.ts
│       ├── src/
│       │   ├── index.ts            # Public API exports
│       │   ├── types/
│       │   │   ├── index.ts        # Re-exports all types
│       │   │   ├── common.ts       # Shared types (Currency, Percentage, etc.)
│       │   │   ├── entities.ts     # Entity configuration types
│       │   │   └── results.ts      # Calculation result types
│       │   ├── models/
│       │   │   ├── index.ts        # Model registry
│       │   │   ├── model-1-cost-plus.ts
│       │   │   ├── model-2-licence.ts
│       │   │   ├── model-3-joint-development.ts
│       │   │   ├── model-4-bot.ts
│       │   │   ├── model-5-software-sale.ts
│       │   │   └── model-6-saas.ts
│       │   ├── projections/
│       │   │   ├── npv.ts          # Net Present Value
│       │   │   ├── irr.ts          # Internal Rate of Return
│       │   │   ├── payback.ts      # Payback period calculations
│       │   │   └── sensitivity.ts  # Sensitivity analysis
│       │   ├── compliance/
│       │   │   └── transfer-pricing.ts
│       │   └── utils/
│       │       ├── currency.ts     # Currency formatting
│       │       ├── tax.ts          # SA tax calculations
│       │       └── validation.ts   # Input validation with Zod
│       └── tests/
│           ├── models/
│           │   ├── model-1-cost-plus.test.ts
│           │   └── ...
│           └── projections/
│               ├── npv.test.ts
│               └── irr.test.ts
│
├── apps/
│   └── web/                        # SvelteKit application
│       ├── package.json
│       ├── svelte.config.js
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       ├── src/
│       │   ├── app.html
│       │   ├── app.css             # Tailwind imports
│       │   ├── routes/
│       │   │   ├── +layout.svelte  # Root layout
│       │   │   ├── +page.svelte    # Landing / mode selector
│       │   │   ├── pricing/
│       │   │   │   └── +page.svelte
│       │   │   └── structuring/
│       │   │       ├── +page.svelte
│       │   │       └── [model]/
│       │   │           └── +page.svelte
│       │   ├── lib/
│       │   │   ├── components/
│       │   │   │   ├── ui/         # Reusable UI components
│       │   │   │   │   ├── Button.svelte
│       │   │   │   │   ├── Input.svelte
│       │   │   │   │   ├── Card.svelte
│       │   │   │   │   └── ...
│       │   │   │   ├── forms/      # Form components
│       │   │   │   │   ├── ModelInputForm.svelte
│       │   │   │   │   └── EntityConfigForm.svelte
│       │   │   │   ├── results/    # Results display
│       │   │   │   │   ├── DeveloperResults.svelte
│       │   │   │   │   ├── BuyerResults.svelte
│       │   │   │   │   └── ComparisonTable.svelte
│       │   │   │   └── charts/     # Chart wrappers
│       │   │   │       ├── TornadoChart.svelte
│       │   │   │       └── CashFlowChart.svelte
│       │   │   ├── stores/
│       │   │   │   ├── calculation.ts   # Calculation state
│       │   │   │   ├── comparison.ts    # Saved comparisons
│       │   │   │   └── ui.ts            # UI state
│       │   │   └── utils/
│       │   │       └── formatting.ts
│       │   └── static/
│       │       └── favicon.png
│       └── tests/
│           └── e2e/
│               └── calculation-flow.test.ts
│
├── docs/                           # Documentation (shared)
│   ├── ARCHITECTURE.md             # This file
│   ├── BUSINESS_GUIDE.md
│   ├── CALCULATIONS.md
│   └── ...
│
├── pnpm-workspace.yaml             # Monorepo configuration
├── package.json                    # Root package.json
├── tsconfig.base.json              # Shared TypeScript config
└── CLAUDE.md                       # AI assistant context
```

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

1. **No dependencies** except Zod for validation
2. **Tree-shakeable**: Only import what you use
3. **Platform-agnostic**: Works in browser, Node, Deno, etc.
4. **Versioned**: Follows semver for API stability

### apps/web

**Purpose**: SvelteKit application that provides the user interface.

**Key Dependencies**:
- `@model-pear/calculator` (local package)
- `svelte` + `@sveltejs/kit`
- `tailwindcss`
- `apexcharts`

**Routing**:

| Route | Description |
|-------|-------------|
| `/` | Landing page with mode selector |
| `/pricing` | Mode 1: Pricing Calculator |
| `/structuring` | Mode 2: Transaction Structuring overview |
| `/structuring/[model]` | Specific model calculator |
| `/structuring/compare` | Side-by-side comparison |

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
