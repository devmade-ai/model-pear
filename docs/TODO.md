# TODO

> Lower priority items and improvements to capture between sessions

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
