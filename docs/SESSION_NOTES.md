# Session Notes

> Context and progress notes to preserve between sessions

## Current Session

**Date:** 2026-01-11

**Task:** Architecture Redesign - Phase 3 (Tests & Projections)

**Goal:** Add comprehensive tests for all models and extract projection calculations.

**What was done:**

1. **Added Tests for Models 2-6**
   - Model 2 (Licence): 46 tests covering all 8 variants
   - Model 3 (Joint Dev): 28 tests covering all 8 variants
   - Model 4 (BOT): 32 tests covering all 8 variants
   - Model 5 (Software Sale): 35 tests covering all 8 variants
   - Model 6 (SaaS): 37 tests covering all 9 variants

2. **Extracted Projections Module to TypeScript**
   - NPV calculation with proper discounting
   - IRR using Newton-Raphson method
   - Simple and discounted payback period
   - MIRR, profitability index, ROI calculations
   - Investment assessment utility
   - Cash flow utilities (growing, cumulative, discount)
   - 39 tests for projection calculations

**Files Created:**
- `packages/calculator/tests/models/model-2-licence.test.ts`
- `packages/calculator/tests/models/model-3-joint-development.test.ts`
- `packages/calculator/tests/models/model-4-bot.test.ts`
- `packages/calculator/tests/models/model-5-software-sale.test.ts`
- `packages/calculator/tests/models/model-6-saas.test.ts`
- `packages/calculator/src/projections/types.ts`
- `packages/calculator/src/projections/calculations.ts`
- `packages/calculator/src/projections/index.ts`
- `packages/calculator/tests/projections/calculations.test.ts`
- Updated `packages/calculator/src/index.ts`

**Status:** Phase 3 Complete

**Total Tests:** 261 tests across 7 test files (all passing)

**Build Commands:**
```bash
pnpm install          # Install dependencies
pnpm test             # Run calculator tests (261 tests passing)
pnpm build            # Build all packages
```

**Next Steps:**
- Extract sensitivity analysis module
- Build out SvelteKit UI for all models
- Add model comparison functionality

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
