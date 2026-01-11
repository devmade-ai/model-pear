# Session Notes

> Context and progress notes to preserve between sessions

## Current Session

**Date:** 2026-01-11

**Task:** Architecture Redesign - Phase 3 Complete (Tests, Projections & Sensitivity)

**Goal:** Add comprehensive tests for all models, extract projection and sensitivity calculations.

**What was done:**

1. **Added Tests for Models 2-6** (178 new tests)
   - Model 2 (Licence): 46 tests covering all 8 variants
   - Model 3 (Joint Dev): 28 tests covering all 8 variants
   - Model 4 (BOT): 32 tests covering all 8 variants
   - Model 5 (Software Sale): 35 tests covering all 8 variants
   - Model 6 (SaaS): 37 tests covering all 9 variants

2. **Extracted Projections Module** (39 tests)
   - NPV calculation with proper discounting
   - IRR using Newton-Raphson method
   - Simple and discounted payback period
   - MIRR, profitability index, ROI calculations
   - Investment assessment utility
   - Cash flow utilities (growing, cumulative, discount)

3. **Extracted Sensitivity Analysis Module** (40 tests)
   - Range creation with configurable variance
   - Scenario generation (best/base/worst case)
   - Input sensitivity analysis with ranking
   - Break-even analysis using binary search
   - Monte Carlo simulation with triangular distribution
   - Statistical utilities (mean, median, percentiles, histogram)
   - Formatting utilities (currency, percentage)

**Files Created:**
- `packages/calculator/tests/models/model-{2-6}-*.test.ts`
- `packages/calculator/src/projections/{types,calculations,index}.ts`
- `packages/calculator/tests/projections/calculations.test.ts`
- `packages/calculator/src/sensitivity/{types,calculations,index}.ts`
- `packages/calculator/tests/sensitivity/calculations.test.ts`

**Status:** Phase 3 Complete

**Total Tests:** 301 tests across 8 test files (all passing)

**Build Commands:**
```bash
pnpm install          # Install dependencies
pnpm test             # Run calculator tests (301 tests passing)
pnpm build            # Build all packages
```

**Next Steps:**
- Build out SvelteKit UI for all 6 models
- Add model comparison functionality
- Add chart generation helpers

---

## Previous Sessions

### 2026-01-10 (Phase 2)
**Task:** Architecture Redesign - Complete Calculator Package
- Extracted Models 2-6 to TypeScript (47 variants total)
- Updated models index with unified exports

### 2026-01-10 (Phase 1)
**Task:** Architecture Redesign - Foundation
- Created ARCHITECTURE.md documentation
- Set up monorepo with pnpm workspaces
- Created calculator package with TypeScript
- Extracted Model 1 with 44 passing tests
- Created SvelteKit app shell
