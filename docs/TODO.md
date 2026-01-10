# TODO

> Lower priority items and improvements to capture between sessions

## Backlog

### Technical Debt: Rename "intercompany" folders
**Priority**: Low
**Effort**: Medium (30+ files)

The folders `models/intercompany/` and `ui/intercompany/` use legacy naming from when the tool was focused on inter-company transactions. The tool now works for ANY client (related or unrelated), so the naming is inconsistent with the scope.

**Why it's low priority**: Folder names are internal - users never see them. All user-facing "intercompany" references have been removed.

**If tackled**:
- Rename `models/intercompany/` → `models/transactions/`
- Rename `ui/intercompany/` → `ui/transactions/`
- Update all import paths (~30+ files)
- Update HTML element IDs (e.g., `intercompanyCalculatorSection`)
- Update CSS classes (e.g., `.intercompany-input-help`)
- Update state property name `state.intercompany` → `state.transactions`

---

## Completed

### Refactor: Remove Combined/Group Perspective
**Completed**: January 10, 2026
**Effort**: 10 phases

Simplified to two perspectives (Developer + Buyer). Removed ~600+ lines of combined/group accounting code. See HISTORY.md for details.

---

## Ideas

### Feature: Recommendation Summary for Compare Mode
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

