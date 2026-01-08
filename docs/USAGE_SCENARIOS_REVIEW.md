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
| Entry point | ⚠️ | Tool starts with "pick a model" | Should start with "I need software" |
| Cost estimation | ❌ | Tool assumes you know cost | No help getting from need → cost |
| Quick overview | ❌ | Must complete wizard for one model | No "show me all options at a glance" |

---

## Workflow Step 2: EXPLORE

**User thinking:** "What are my options? For each option: What does it cost? Do I pay monthly or once-off? What do I capitalize vs expense? What do I show on my balance sheet?"

| Aspect | Rating | Current State | Gap |
|--------|--------|---------------|-----|
| List all options | ⚠️ | Wizard recommends models | No overview of ALL options with key metrics |
| Cost breakdown | ✅ | Calculator shows this well | - |
| Payment structure | ✅ | Different models have different structures | - |
| Capitalize vs expense | ✅ | Accounting treatment shown | - |
| Balance sheet impact | ✅ | Asset recognition covered | - |

---

## Workflow Step 3: COMPARE

**User thinking:** "Show me these options side-by-side so I can see trade-offs."

| Aspect | Rating | Current State | Gap |
|--------|--------|---------------|-----|
| Save a scenario | ❌ | Results not saved | Can't bookmark for comparison |
| Side-by-side view | ❌ | Must re-run and remember | No comparison mode |
| Key metrics comparison | ❌ | No summary view | Need: total cost, cash flow, tax impact per option |
| Share with stakeholders | ❌ | No export | Can't send comparison to decision-makers |

---

## Workflow Step 4: ITERATE

**User thinking:** "We discussed and want to change some assumptions. Show me the options again with these changes."

| Aspect | Rating | Current State | Gap |
|--------|--------|---------------|-----|
| Change inputs | ✅ | Can modify and recalculate | - |
| See impact | ✅ | Results update | - |
| Compare before/after | ❌ | Previous results lost | No "what changed?" view |
| Track versions | ❌ | No history | Can't see evolution of thinking |

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
| Toggle between perspectives | ⚠️ | "Mutual Ownership" checkbox exists | Buried in entity config, not prominent |
| Impact on calculations | ✅ | Transfer pricing benchmarks apply | - |
| Compliance requirements | ✅ | Compliance tab shows requirements | - |
| Clear explanation | ⚠️ | Help content exists | Could be clearer what changes |

---

## Current Tool vs User's Mental Model

| Current Tool | User's Mental Model |
|--------------|---------------------|
| Pick a model first | Start with the need |
| Deep-dive one option at a time | See all options at once |
| Re-run wizard to try another | Easy comparison and iteration |
| Sensitivity is a separate tab | "What if" is natural flow |
| Related party is buried in config | Simple toggle that's always visible |
| Results disappear on recalculate | Save and compare versions |

---

## Prioritized Gaps

Based on the workflow analysis:

| Priority | Gap | Why |
|----------|-----|-----|
| **1** | **Compare Mode** | Core of the workflow - can't make decisions without comparing |
| **2** | **"All options" overview** | Users want to see landscape before diving deep |
| **3** | **Prominent related/unrelated toggle** | Fundamental to every calculation |
| **4** | **Save & iterate** | Support the natural back-and-forth of decision making |
| **5** | **Export/share** | Get results to stakeholders |
| **6** | **Cost estimation helper** | Nice to have, but users can work around it |

---

## Recommended Improvements

### High Priority

1. **Compare Mode**
   - Save current calculation as "Option A"
   - Run another, save as "Option B"
   - Side-by-side view with key metrics
   - Highlight differences

2. **Options Overview**
   - New starting view: "Here are 6 ways to structure this"
   - High-level comparison: payment type, IP ownership, risk profile
   - Click to explore any option in detail

3. **Perspective Toggle**
   - Move related/unrelated toggle to top-level
   - Make it visible throughout the workflow
   - Clear indicator of which mode you're in

### Medium Priority

4. **Save & Iterate**
   - Save calculation state
   - Track versions/history
   - "What changed?" diff view

5. **Export/Share**
   - PDF summary of comparison
   - Client-friendly view
   - Internal decision document

### Lower Priority

6. **Cost Estimation Helper**
   - Simple: hours × rate calculator
   - Optional - users can skip if they know their cost

---

## Next Steps

- [ ] Design Compare Mode UX
- [ ] Prototype "All Options" overview
- [ ] Move perspective toggle to prominent position
- [ ] Update roadmap with new priorities
