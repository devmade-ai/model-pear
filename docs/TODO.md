# TODO

> Lower priority items and improvements to capture between sessions

---

## High Priority: Align Tool with Discovery Findings

*See [DISCOVERY_FINDINGS.md](./DISCOVERY_FINDINGS.md) for full context*

### 1. Design "Negotiation Mode" Flow
**Priority**: High
**Status**: Not started

Define the ideal 5-minute client walkthrough:
- [ ] What screens are needed for a live negotiation session?
- [ ] What's shown vs hidden by default?
- [ ] What's the minimum viable feature set for closing a deal?
- [ ] What features are "impressive but never used"?

### 2. UI Audit Against Design Principles
**Priority**: High
**Status**: Not started

Evaluate current UI against these principles:

| Principle | Test Question |
|-----------|---------------|
| Client in the room | Can you explain this screen in 10 seconds? |
| Neutral ground first | Do industry standards appear as defaults? |
| Show both sides | Is "what you get / what they get" always visible? |
| Progressive complexity | Can you start simple and add detail on demand? |
| Compare to decide | Is save/compare/choose obvious and fast? |

Specific checks:
- [ ] Presentation friendly? (Professional, clear hierarchy)
- [ ] Industry standards prominent? (Defaults populated, labelled)
- [ ] Language accessible? (CEO-friendly terms)
- [ ] Progressive disclosure? (Simple first, advanced tucked away)
- [ ] Compare flow smooth? (Save/compare/choose is fast)
- [ ] Right-sized? (No features that slow down live negotiation)

### 3. Create Specific Fix List
**Priority**: High
**Status**: Blocked by #1 and #2

After designing the flow and auditing the UI:
- [ ] Document specific changes needed
- [ ] Prioritise by impact on negotiation flow
- [ ] Implement changes

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
