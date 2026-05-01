# TODO

> Lower priority items and improvements to capture between sessions

---

## High Priority: Infrastructure

### Major-version dependency upgrade epic
**Priority**: High
**Effort**: Large
**Surfaced by**: branch self-review post-validation item 5 (`a973c07`, April 2026)

`pnpm audit` reports **16 remaining vulnerabilities** after closing 14 via in-major bumps. All 16 are pinned by major-version-locked deps and require coordinated bumps:

- `svelte` 4 → 5 — runes migration; biggest single change
- `vite` 5 → 8 — transitively closes 5 advisories (`rollup`, `esbuild`, `picomatch`, `minimatch`, `serialize-javascript`)
- `@sveltejs/vite-plugin-svelte` 3 → 7 — required to pair with Svelte 5 / Vite 8
- `@sveltejs/kit` 2.58 → next major (when published) — for the cookie advisory
- `vitest` 1 → 4 + `@vitest/coverage-v8` 1 → 4 — usually upgraded together
- `svelte-check` 3 → 4 — pairs with Svelte 5
- `apexcharts` 3 → 5 — independent
- `typescript` 5 → 6 — independent (ts 5→6 is more conservative than 4→5)
- `zod` 3 → 4 — independent (calculator package only; no runtime usage today)

**Why epic, not chunk**: each bump touches the public API or runtime semantics in ways that require coordinated component updates. Svelte 4 → 5 in particular requires migrating reactive primitives (`$:` declarations) to runes. Best done as a dedicated branch with E2E + visual-regression coverage in place first.

**Verification surface**: after each bump, the existing `pnpm test` + `pnpm -r check` + `pnpm build` + `pnpm lint` flow should catch most regressions. Real risk is in the chart components (ApexCharts 3 → 5 has theme API changes), the chart-reactivity pattern (Svelte 4's `$:` lexical-dep tracking is replaced by runes' `$state` / `$derived`), and the test suite (Vitest 1 → 4 has config-format changes).

---

## Medium Priority: Feature Ideas

### Recommendation Summary for Compare Mode
**Priority**: Medium
**Effort**: Medium

**Problem**: The tool calculates many metrics but doesn't tell users which option IS the best value. Users must interpret results themselves.

**Current state**: Compare Mode shows differences but doesn't highlight which option is optimal overall. The Wizard recommends a *model* but not a specific *configuration*.

**Proposed solution**: Add a "Recommendation Summary" section to Compare Mode that:
1. Lets users weight their priorities (e.g., "tax efficiency matters more than cash flow timing")
2. Calculates a weighted score for each compared option
3. Highlights the recommended option with clear rationale
4. Shows which dimensions each option wins on

**Example UI**:
```
┌─────────────────────────────────────────────────────┐
│ RECOMMENDATION SUMMARY                              │
├─────────────────────────────────────────────────────┤
│ Based on your priorities:                           │
│   Tax Efficiency: ●●●●○ (High)                     │
│   Cash Flow: ●●○○○ (Low)                           │
│   Developer Profit: ●●●○○ (Medium)                 │
│                                                     │
│ ✓ RECOMMENDED: Option B (Licence Model at 12%)     │
│                                                     │
│ Why: Best combined tax position (+R45,000),         │
│ acceptable developer margin (within target range).  │
│                                                     │
│ Option A wins on: Developer Profit                  │
│ Option B wins on: Tax Efficiency, Client Benefit    │
└─────────────────────────────────────────────────────┘
```

**Why this helps**:
- Transforms the tool from "calculator" to "advisor"
- Reduces cognitive load for users interpreting multiple metrics
- Aligns with tool goal: "find the best deal for both parties"

---

### Accounting Treatment Comparison in Compare Mode
**Priority**: Low
**Effort**: Small

**Problem**: Individual results show accounting treatment details (recognition timing, journal entries), but Compare Mode doesn't extract these for side-by-side comparison.

**Current state**: Comparison view shows financial metrics, tax, compliance, and long-term value - but accounting treatment is only visible by loading each option individually.

**Proposed solution**: Add an "Accounting Treatment" section to the comparison table showing:
- Developer: Revenue recognition timing (point-in-time vs over-time)
- Developer: Asset recognition (yes/no)
- Buyer: Amount capitalised vs expensed
- Buyer: Amortisation period

**Why low priority**: Users can already see accounting treatment in individual results. Compare Mode covers the most impactful metrics. This would be a nice-to-have for detailed accounting analysis.

---

## Low Priority: Naming

- [ ] Rename `intercompany` model category to `transactions` — the category id was set when the tool was scoped to intercompany transactions only; current scope is "any client (related or unrelated)" and the category name no longer reflects reality. Touches the model registry and any branching on `category === 'intercompany'`.
