# Usage Scenarios Review

This document reviews realistic usage scenarios to validate whether the tool adequately supports users throughout their decision-making journey.

**Vision:** The tool should help users from nearly the beginning of their process through negotiations - not just the calculation step.

## Rating Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | **Covered** - Tool helps here |
| ⚠️ | **Partial** - Tool helps somewhat but could be better |
| ❌ | **Gap** - Tool doesn't address this step |
| 🤔 | **Out of scope** - Not the tool's job |

---

## The Real User Journey

Users don't think in "scenarios" - they follow a **workflow**:

```
┌─────────────────────────────────────────────────────────────┐
│  START: "We need software to [increase profits/reduce costs]" │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  EXPLORE: What are our options?                             │
│  - Build it ourselves                                       │
│  - Pay someone to build it                                  │
│  - License existing software                                │
│  - Subscribe to SaaS                                        │
│  - Joint development                                        │
│  → For each: Cost? Monthly vs once-off? Capitalize/expense? │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  COMPARE: Show me options side-by-side                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  ITERATE: "What if we change X?" → See updated options      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  SCENARIOS: "What if this happens? What about that?"        │
└─────────────────────────────────────────────────────────────┘
```

**Throughout the entire journey, there are 2 perspectives:**
1. **Independent parties** - Random person/client (arm's length)
2. **Related parties** - You're a shareholder in both developer and buyer

---

## Alternative Entry Point: "We have an idea"

A similar workflow but starting as a conversation between two parties:

```
"We have an idea"
       ↓
"How do we do it? Can you do it?"
       ↓
"What do we get? What do you get?"
       ↓
"How much is it going to cost?"
       ↓
"What are the options?"
       ↓
"What if this happens? What about that?"
```

This is the **negotiation flow** - two parties working through a deal together. The tool should support both:
- Internal decision-making (first workflow)
- Two-party negotiation (this workflow)

Both converge on the same core needs: options, costs, what each party gets, and what-if scenarios.

---

## Workflow Step 1: START

**User thinking:** "We need software to improve our business. How much will it cost? What are our options?"

| Aspect | Rating | Current State | Gap |
|--------|--------|---------------|-----|
| Entry point | ✅ | Options Overview as default landing | Shows all 6 models at a glance |
| Cost estimation | ✅ | Cost Estimator helper available | Hours × rate calculator with phases |
| Quick overview | ✅ | Options Overview shows all models | Cards with features, "best for" tags |

---

## Workflow Step 2: EXPLORE

**User thinking:** "What are my options? For each option: What does it cost? Do I pay monthly or once-off? What do I capitalize vs expense? What do I show on my balance sheet?"

| Aspect | Rating | Current State | Gap |
|--------|--------|---------------|-----|
| List all options | ✅ | Options Overview with comparison table | All 6 models with key metrics visible |
| Cost breakdown | ✅ | Calculator shows this well | - |
| Payment structure | ✅ | Different models have different structures | - |
| Capitalize vs expense | ✅ | Accounting treatment shown | - |
| Balance sheet impact | ✅ | Asset recognition covered | - |

---

## Workflow Step 3: COMPARE

**User thinking:** "Show me these options side-by-side so I can see trade-offs."

| Aspect | Rating | Current State | Gap |
|--------|--------|---------------|-----|
| Save a scenario | ✅ | Save as Option button | Can save up to 20 options |
| Side-by-side view | ✅ | Compare Mode available | 2-4 options side-by-side |
| Key metrics comparison | ✅ | Comparison table with highlighting | Best/worst highlighting, difference column |
| Share with stakeholders | ✅ | Export JSON/CSV/Print | Can share comparison results |

---

## Workflow Step 4: ITERATE

**User thinking:** "We discussed and want to change some assumptions. Show me the options again with these changes."

| Aspect | Rating | Current State | Gap |
|--------|--------|---------------|-----|
| Change inputs | ✅ | Can modify and recalculate | - |
| See impact | ✅ | Results update | - |
| Compare before/after | ✅ | "What Changed?" diff view | Shows input/setting changes and result impact |
| Track versions | ✅ | Save multiple options | Each saved option acts as a version snapshot |

---

## Workflow Step 5: SCENARIOS

**User thinking:** "There are a few ways this could play out. What if X happens? What about Y?"

| Aspect | Rating | Current State | Gap |
|--------|--------|---------------|-----|
| Sensitivity analysis | ✅ | Sensitivity tab exists | - |
| Best/worst case | ✅ | Range inputs supported | - |
| Custom scenarios | ⚠️ | Can run manually | No "save scenario A, save scenario B, compare" |
| Probability weighting | ❌ | Not supported | No "60% chance of X, 40% chance of Y" |

---

## The Two Perspectives

**Key insight:** Every step in the workflow can be viewed from two perspectives:

### Perspective A: Independent Parties
- You are the buyer OR the developer
- The other party is unrelated
- Arm's length pricing applies naturally
- No special compliance requirements

### Perspective B: Related Parties (Mutual Ownership)
- You're a shareholder in BOTH the developer and buyer
- Transfer pricing rules apply
- Need to document arm's length rationale
- SARS compliance matters

| Aspect | Rating | Current State | Gap |
|--------|--------|---------------|-----|
| Toggle between perspectives | ✅ | Party Selector at top of calculator | Prominent Independent/Related toggle |
| Impact on calculations | ✅ | Transfer pricing benchmarks apply | - |
| Compliance requirements | ✅ | Compliance tab shows requirements | - |
| Clear explanation | ✅ | Help tooltips and UI labels | Party relationship clearly shown |

---

## Current Tool vs User's Mental Model

| Current Tool | User's Mental Model | Status |
|--------------|---------------------|--------|
| Options Overview shows all models | Start with the need | ✅ Aligned |
| Compare multiple saved options | See all options at once | ✅ Aligned |
| Save options and compare | Easy comparison and iteration | ✅ Aligned |
| What-If tab with sensitivity | "What if" is natural flow | ✅ Aligned |
| Party Selector at top | Simple toggle that's always visible | ✅ Aligned |
| Save as Option + What Changed? | Save and compare versions | ✅ Aligned |

---

## Prioritized Gaps (Updated)

Based on the workflow analysis, all high-priority gaps have been addressed:

| Priority | Feature | Status | Implementation |
|----------|---------|--------|----------------|
| **1** | **Compare Mode** | ✅ Implemented | Save up to 20 options, side-by-side comparison, export |
| **2** | **"All options" overview** | ✅ Implemented | Options Overview as default landing page |
| **3** | **Prominent related/unrelated toggle** | ✅ Implemented | Party Selector at top of calculator |
| **4** | **Save & iterate** | ✅ Implemented | "What Changed?" diff view shows input changes and impact |
| **5** | **Export/share** | ✅ Implemented | JSON, CSV, Print/PDF export |
| **6** | **Cost estimation helper** | ✅ Implemented | Hours × rate calculator with phase breakdown |

---

## Implementation Summary

All prioritized features have been implemented:

### ✅ High Priority (Complete)

1. **Compare Mode** - `ui/intercompany/comparison-manager.js`, `ui/intercompany/comparison-view.js`
   - Save calculations as named options (up to 20)
   - Side-by-side comparison of 2-4 options
   - Best/worst value highlighting with difference column
   - Export: JSON, CSV, Print/PDF

2. **Options Overview** - `ui/intercompany/options-overview.js`
   - Default landing view with all 6 models
   - Model cards with icons, key features, "best for" tags
   - Quick comparison table (IP ownership, payment type, risk)
   - Toggle between Overview/Wizard/Direct selection modes

3. **Perspective Toggle** - `ui/intercompany/party-selector.js`
   - Party Selector at top of calculator
   - Clear Independent/Related party toggle
   - Visible indicator of relationship status

### ✅ Medium Priority (Complete)

4. **Save & Iterate** - `ui/intercompany/diff-view.js`
   - "What Changed?" button in comparison manager
   - Shows input changes, setting changes, and result impact
   - Visual diff with added/removed/changed badges

5. **Export/Share** - `utils/storage.js`
   - JSON export for data portability
   - CSV export for spreadsheet analysis
   - Print/PDF via browser print dialog

### ✅ Lower Priority (Complete)

6. **Cost Estimation Helper** - `ui/intercompany/cost-estimator.js`
   - Hours × rate calculator
   - Phase breakdown (Discovery, Design, Development, Testing, Deployment)
   - Contingency percentage
   - "Use Estimate" populates calculator inputs

---

## Completion Status

All usage scenarios from the original analysis are now covered:

- [x] Compare Mode designed and implemented
- [x] Options Overview prototyped and deployed
- [x] Perspective toggle moved to prominent position
- [x] Save & iterate with diff view
- [x] Export/share functionality
- [x] Cost estimation helper
