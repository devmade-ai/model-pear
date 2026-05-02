# Negotiation Mode: Ideal Flow Design

> **Purpose**: Design the 5-minute client walkthrough based on Discovery findings
> **Status**: Draft - for review

---

## Context from Discovery

**Actual use case**: Tech-sales person guiding a non-technical exec + finance exec through options in a live session to reach agreement faster.

**Key insight**: The tool is a negotiation aid, not a back-office calculator. It's used *with* the client, not *about* the client.

---

## Current Flow vs Ideal Flow

### Current Flow (Analysis-Oriented)

```
Home → Choose Mode (Pricing/Structuring)
         ↓
    Structuring → Wizard OR Browse Models
                      ↓
              Select Model → Calculator Page
                                 ↓
                   Inputs | Results | Sensitivity | Projections
                                 ↓
                         Save Option → Compare
```

**Issues for negotiation context:**
- Too many steps before seeing numbers
- Wizard asks questions you already know (from prior discovery)
- All inputs shown at once (overwhelming for client)
- Technical tabs visible (Sensitivity, Projections)
- No clear "neutral ground" starting point

### Ideal Flow (Negotiation-Oriented)

```
[Pre-meeting: You know which model fits from your discovery]
         ↓
Open directly to Model Calculator
         ↓
STEP 1: Show industry baseline (pre-populated)
        "Here's what a typical deal looks like"
         ↓
STEP 2: Adjust key numbers together
        "Let's put in your specific situation"
         ↓
STEP 3: See both sides immediately
        "Here's what you'd get, here's what we'd get"
         ↓
STEP 4: Save as Option A
         ↓
STEP 5: "What if we structured it differently?"
        Adjust → Save as Option B
         ↓
STEP 6: Compare side-by-side
        "Which works better for both of us?"
         ↓
DECISION
```

---

## 5-Minute Walkthrough Script

### Minute 0-1: Open & Orient

**You say**: "Let me show you a tool we use to structure these deals fairly. It shows both sides - what works for us and what works for you."

**What they see**:
- Clean calculator screen
- Model name and simple description
- Numbers pre-populated with industry standards
- Clear "Your Company" / "Client" split in results

**Design requirements**:
- [ ] Direct link to specific model (skip home/wizard)
- [ ] Industry defaults clearly labelled ("Industry Standard: 10%")
- [ ] Results visible immediately (no need to click calculate)

### Minute 1-2: Establish Baseline

**You say**: "These are industry-standard numbers. A typical cost-plus deal uses a 10% margin - that's within OECD guidelines and what most software companies charge."

**What they see**:
- Key inputs highlighted with industry benchmark labels
- Results showing both parties' outcomes
- "What you get" / "What we get" clearly separated

**Design requirements**:
- [ ] Benchmark labels on key fields ("Industry: 5-15%")
- [ ] Two-column results: Developer | Buyer (or "Us" | "You")
- [ ] Key numbers prominent: Total cost, Profit, Asset value

### Minute 2-3: Customise Together

**You say**: "Now let's put in your actual numbers. What's the budget you're working with?"

**What they see**:
- Focused input section (not all 15 fields)
- Only the inputs that matter for this conversation
- Results updating in real-time

**Design requirements**:
- [ ] Progressive disclosure - essential inputs first
- [ ] Expandable "Advanced" section for other inputs
- [ ] Real-time calculation (no "Calculate" button needed)

### Minute 3-4: Save & Explore Alternative

**You say**: "That's one way to do it. Let me save this and show you another option."

**What they see**:
- Quick save (one click, auto-named)
- Adjust a key variable (margin %, payment terms, etc.)
- See how outcomes change
- Save as Option B

**Design requirements**:
- [ ] One-click save with smart default name
- [ ] Clear visual feedback when saved
- [ ] Easy to tweak and save another

### Minute 4-5: Compare & Decide

**You say**: "Let's look at these side by side. Option A gives you X, Option B gives you Y. Which feels right?"

**What they see**:
- Two options side-by-side
- Key differences highlighted
- Clear winner indicators (if any)
- Both parties' outcomes visible

**Design requirements**:
- [ ] Side-by-side comparison (2 columns)
- [ ] Differences highlighted (arrows, colours)
- [ ] "Best for Developer" / "Best for Buyer" indicators
- [ ] Simple summary row at top

---

## Screen-by-Screen Requirements

### Screen 1: Model Calculator (Main Screen)

**What stays**:
- Model name and description
- Input form
- Developer Results
- Buyer Results
- Save button
- Comparison Manager

**What changes**:

| Current | Negotiation Mode |
|---------|------------------|
| All inputs visible | Essential inputs first, "More options" collapsed |
| No benchmark labels | Industry standards labelled on key fields |
| Technical tabs (Sensitivity, Projections) | Hidden by default, available via "Advanced Analysis" |
| Transfer Pricing section prominent | Collapsed by default (only relevant for related parties) |
| Generic field labels | Client-friendly language |

**New elements**:
- "Industry Standard" badges on benchmark fields
- Quick comparison launcher ("Compare with saved options")
- Collapsible sections for progressive disclosure

### Screen 2: Comparison View (Overlay/Modal)

**What stays**:
- Side-by-side layout
- Difference indicators

**What changes**:

| Current | Negotiation Mode |
|---------|------------------|
| Shows all metrics | Summary first, details expandable |
| Technical column headers | "Option A" / "Option B" or custom names |
| All rows visible | Key metrics prominent, others collapsed |

**New elements**:
- "Winner" indicator per metric
- Summary sentence: "Option A is better for tax efficiency, Option B gives higher upfront revenue"

---

## Feature Visibility by Mode

| Feature | Negotiation Mode | Analysis Mode |
|---------|------------------|---------------|
| Industry benchmarks | Prominent, labelled | Available |
| Essential inputs | Visible | Visible |
| Advanced inputs | Collapsed | Visible |
| Sensitivity tab | Hidden | Visible |
| Projections tab | Hidden | Visible |
| Transfer Pricing | Collapsed (unless related party) | Visible |
| Monte Carlo | Hidden | Visible |
| Compare Mode | Prominent | Available |
| Export options | Simplified | Full |

---

## Language Changes for Non-Technical Audience

| Current Term | Client-Friendly Alternative |
|--------------|----------------------------|
| Developer | Your Company / Us |
| Buyer | Client / You |
| Transfer Pricing | Related Party Compliance (collapse by default) |
| Cost-Plus Margin | Markup Percentage |
| Section 11(e) | Tax Depreciation Period |
| Capitalised Asset | Asset on Your Books |
| NPV | Net Present Value (with "total value in today's money" hint) |
| IRR | Rate of Return |

---

## Implementation Options

### Option 1: Negotiation Mode Toggle
Add a toggle to switch between "Negotiation Mode" (simplified) and "Analysis Mode" (full). Persisted in localStorage.

**Pros**: One codebase, user choice
**Cons**: More UI complexity, toggle might confuse

### Option 2: Simplified by Default
Make the simplified view the default. Power features accessible but not prominent.

**Pros**: Serves primary use case, no mode switching
**Cons**: Power users need more clicks

### Option 3: Separate Routes
Create `/structuring/[model]/negotiate` route with simplified UI.

**Pros**: Clean separation, can optimize each path
**Cons**: Code duplication, two UIs to maintain

### Recommendation: Option 2

Simplify by default, with progressive disclosure for advanced features. This serves the primary use case (negotiation) while keeping power features available.

---

## Minimum Viable Feature Set

For a negotiation session, you need:

1. **Model Calculator** with industry defaults
2. **Two-sided results** (Developer + Buyer)
3. **Save option** (quick, one-click)
4. **Compare two options** side-by-side

You don't need (hide by default):
- Sensitivity analysis
- Monte Carlo simulation
- 10-year projections
- Transfer pricing compliance details
- Advanced export options

---

## Next Steps

1. Review this design with user
2. Audit current UI against these requirements
3. Create specific change list
4. Implement changes

---

## UI Audit Results

Based on reviewing actual code against design principles:

### Principle 1: Client in the Room

| Check | Current State | Status | Fix |
|-------|---------------|--------|-----|
| Can you explain each screen in 10 seconds? | Calculator page has clear sections | Partial | Simplify input labels |
| Professional appearance? | Clean Tailwind styling | Good | - |
| Clear visual hierarchy? | Results split by perspective | Good | - |
| Tabs might confuse client? | Sensitivity/Projections tabs visible | Fix | Hide by default |

### Principle 2: Neutral Ground First

| Check | Current State | Status | Fix |
|-------|---------------|--------|-----|
| Industry standards as defaults? | Values pre-populated | Good | - |
| Labelled as "industry standard"? | Only hint on markup field | Fix | Add badges to key fields |
| Clear this isn't "your price"? | No explicit framing | Fix | Add "Industry Standard" badges |

**Good example found**: `model1Fields` has `hint: "Arm's length range: 5-15%"` on markup field.

**Missing**: Other models don't have benchmark hints. No visual badge indicating "this is standard".

### Principle 3: Show Both Sides

| Check | Current State | Status | Fix |
|-------|---------------|--------|-----|
| Developer + Buyer results visible? | Yes, separate panels | Good | - |
| Clear "Us" / "You" framing? | Uses "Developer" / "Buyer" | Fix | More personal language |
| Key numbers prominent? | Good hierarchy | Good | - |

**Current**: `DeveloperResults` has badge "Your Company", `BuyerResults` has badge "Client" - this is good!

### Principle 4: Progressive Complexity

| Check | Current State | Status | Fix |
|-------|---------------|--------|-----|
| Essential inputs first? | All inputs shown equally | Fix | Group into Essential/Advanced |
| Advanced features tucked away? | Sensitivity/Projections as tabs | Fix | Move to collapsed section |
| Transfer Pricing collapsed? | Shown by default | Fix | Collapse unless related party |

**Field configs have `category`** (basic, cost, revenue, tax, timing) - can use this for grouping!

### Principle 5: Compare to Decide

| Check | Current State | Status | Fix |
|-------|---------------|--------|-----|
| Easy save? | Save button + modal with name input | Partial | One-click with auto-name |
| Compare obvious? | ComparisonManager at bottom of results | Partial | More prominent |
| Side-by-side clear? | ComparisonView exists | Check | Review comparison layout |

---

## Specific Changes Required

### Priority 1: Quick Wins (Low Effort, High Impact)

1. **Add "Industry Standard" badge to key input fields**
   - Files: `inputFields.ts`, `InputField.svelte`
   - Add `benchmark?: string` to field config
   - Display badge next to fields with benchmarks

2. **Hide Sensitivity/Projections tabs by default**
   - File: `structuring/[model]/+page.svelte`
   - Replace tabs with collapsible "Advanced Analysis" section

3. **Collapse Transfer Pricing section by default**
   - File: `TransferPricingResults.svelte`
   - Make collapsible, default closed
   - Or: only show if "related party" flag is set

4. **One-click save with auto-generated name**
   - File: `structuring/[model]/+page.svelte`
   - Default name: "{Model} - Option {N}" or use project name
   - Skip modal for quick save, keep "Save As..." for custom name

### Priority 2: Input Grouping (Medium Effort)

5. **Group inputs into Essential / Advanced**
   - Use existing `category` field in config
   - Essential: projectName, developmentCost, markupPercentage
   - Advanced: everything else in collapsible section
   - Show count: "5 more options"

### Priority 3: Comparison Enhancement (Medium Effort)

6. **Make comparison more prominent**
   - Add "Compare Options" button near Save button
   - Show saved option count: "Compare (2 saved)"

7. **Add summary row to comparison**
   - "Option A: Better for tax efficiency"
   - "Option B: Higher upfront revenue"

### Priority 4: Language Polish (Low Effort)

8. **Review all user-facing labels**
   - Developer → "Your Company" (already done in badge)
   - Buyer → "Client" (already done in badge)
   - Consider making section titles match badges

---

## Implementation Order

Suggested order for implementation:

```
Week 1: Quick Wins
├── [x] Add benchmark badges to inputs
├── [x] Collapse Sensitivity/Projections
├── [x] Collapse Transfer Pricing
└── [x] One-click save

Week 2: Input Grouping
├── [ ] Group inputs by category
├── [ ] Essential inputs visible by default
└── [ ] Advanced inputs collapsed

Week 3: Comparison Polish
├── [ ] Prominent compare button
├── [ ] Summary row in comparison
└── [ ] Winner indicators
```

---

## Open Questions

1. Should "Us/You" terminology be configurable? (What if presenting to prospect?)
2. Should there be a "Share with client" export that's even simpler?
3. Do we need a "Presentation mode" that hides the input panel?
