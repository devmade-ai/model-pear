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

## Scenario 1: "A client approached us about building something"

**Context:** A potential client has reached out about custom software development. No decisions have been made yet about structure, IP ownership, or pricing.

### Typical Process

| Step | Activity | Key Questions | Who's Involved | Rating | Findings |
|------|----------|---------------|----------------|--------|----------|
| 1 | Initial client meeting | What do they want? Why? Timeline? | Sales, Tech Lead | 🤔 | Not tool's job - requirements gathering |
| 2 | Internal feasibility | Can we build this? Do we want to? | Dev team, Management | 🤔 | Not tool's job - technical assessment |
| 3 | Scoping & estimation | How much effort? What resources? | Tech Lead, PM | ❌ | **Gap** - No help translating scope to cost |
| 4 | Commercial strategy | How do we structure this? Who owns IP? | Management, Finance | ✅ | Structure Selector wizard guides this well |
| 5 | Pricing | What do we charge? What's our margin? | Finance, Management | ✅ | Calculator handles cost + margin |
| 6 | Proposal preparation | Put it all together | Sales, Finance | ⚠️ | Results exist but no export/proposal format |
| 7 | Client negotiation | Back and forth on terms | Sales, Management | ⚠️ | Can model alternatives but no side-by-side comparison view |
| 8 | Contract & delivery | Execute and invoice | Legal, Delivery team | 🤔 | Not tool's job - legal/execution |

### Summary

**Strengths:**
- Wizard helps think through structure decisions
- Calculator provides clear pricing with margin

**Gaps/Improvements:**
- No bridge from "scope" to "cost" (effort estimation)
- No client-facing output format
- No easy way to compare 2-3 options side-by-side for negotiation

---

## Scenario 2: "We have software we built - how do we monetize it?"

**Context:** Company has internal IP (software they built) and wants to explore ways to generate revenue from it.

### Typical Process

| Step | Activity | Key Questions | Who's Involved | Rating | Findings |
|------|----------|---------------|----------------|--------|----------|
| 1 | Asset assessment | What do we actually have? What's it worth? | Tech, Finance | ❌ | **Gap** - No help assessing/valuing existing IP |
| 2 | Market research | Who would want this? What would they pay? | Sales, Management | 🤔 | Not tool's job - market research |
| 3 | Strategic decision | Sell it? License it? SaaS it? Keep it internal? | Board, Management | ✅ | Wizard helps compare models |
| 4 | Business model design | Recurring vs one-time? Pricing tiers? | Management, Finance | ⚠️ | Pricing Mode helps but limited on tiers |
| 5 | Financial modeling | What revenue can we expect? Break-even? | Finance | ✅ | Projections tab handles this |
| 6 | Go-to-market | How do we sell this? | Sales, Marketing | 🤔 | Not tool's job - marketing |
| 7 | First customer | Test the model with real buyer | Sales | ⚠️ | Can model a deal but no "test pricing" mode |

### Summary

**Strengths:**
- Good at comparing sell vs license vs SaaS options
- Projections help with financial planning

**Gaps/Improvements:**
- No "what is my IP worth?" starting point
- Could help more with "what would market pay?" equilibrium

---

## Scenario 3: "We need to quote on a project"

**Context:** Company received an RFP or enquiry and needs to prepare a quote/proposal.

### Typical Process

| Step | Activity | Key Questions | Who's Involved | Rating | Findings |
|------|----------|---------------|----------------|--------|----------|
| 1 | RFP received | What are they asking for? | Sales | 🤔 | Not tool's job |
| 2 | Requirements analysis | What's the actual scope? | Tech Lead, BA | 🤔 | Not tool's job |
| 3 | Effort estimation | How many hours/days? What skills? | Dev team | ❌ | **Gap** - No effort-to-cost calculator |
| 4 | Cost calculation | What will this cost us? | Finance | ❌ | **Gap** - Tool starts at "cost" not "effort" |
| 5 | Structure decision | Fixed price? T&M? Phases? IP ownership? | Management | ✅ | Wizard covers this well |
| 6 | Margin & pricing | What markup? Final price? | Finance, Management | ✅ | Calculator handles this |
| 7 | Proposal submission | Document and send | Sales | ⚠️ | No export/proposal output |
| 8 | Negotiation | Client pushback on price/terms | Sales, Management | ⚠️ | Can re-run but no comparison view |

### Summary

**Strengths:**
- Structure decision is well-supported
- Margin calculation is clear

**Gaps/Improvements:**
- Missing "effort estimation" step before costing
- No proposal/quote output format
- No negotiation comparison view

---

## Scenario 4: "We're starting a software business"

**Context:** Founders/entrepreneurs deciding how to structure their new software venture.

### Typical Process

| Step | Activity | Key Questions | Who's Involved | Rating | Findings |
|------|----------|---------------|----------------|--------|----------|
| 1 | Idea validation | Is there a real problem to solve? | Founders | 🤔 | Not tool's job |
| 2 | Market sizing | How big is the opportunity? | Founders | 🤔 | Not tool's job |
| 3 | Business model selection | SaaS? Licenses? Services? Marketplace? | Founders | ✅ | Pricing Mode covers this well |
| 4 | Unit economics | Cost to serve? Price point? Margins? | Founders, Advisors | ✅ | Calculator handles this |
| 5 | Financial projections | Revenue forecasts? Break-even? Runway? | Founders, Finance | ✅ | Projections tab |
| 6 | Pricing strategy | How do we price to win customers AND make money? | Founders | ✅ | Pricing Mode equilibrium analysis |
| 7 | MVP & launch | Build and test with real users | Dev team | 🤔 | Not tool's job |

### Summary

**Strengths:**
- This scenario is well-covered by Pricing Mode
- Good unit economics and equilibrium pricing
- Projections help with planning

**Gaps/Improvements:**
- Could link better to Transaction Mode when they land first customer

---

## Scenario 5: "Our client wants flexibility on how they pay"

**Context:** During negotiation, client indicates they can't or won't pay in the proposed structure.

### Typical Process

| Step | Activity | Key Questions | Who's Involved | Rating | Findings |
|------|----------|---------------|----------------|--------|----------|
| 1 | Client raises concern | "We can't pay upfront" / "Budget is tight" | Sales | 🤔 | Not tool's job - conversation |
| 2 | Understand constraints | Cash flow issue? Budget cycle? Risk concern? | Sales | 🤔 | Not tool's job - discovery |
| 3 | Explore alternatives internally | What options can we offer? What's the impact on us? | Finance, Management | ⚠️ | Can re-run wizard but tedious |
| 4 | Model different structures | Subscription? Deferred? Milestone-based? | Finance | ✅ | Calculator can model each |
| 5 | Present options to client | Here are 3 ways we could do this... | Sales | ❌ | **Gap** - No multi-option comparison output |
| 6 | Negotiate & agree | Find the win-win | Sales, Management | ⚠️ | No side-by-side trade-off view |

### Summary

**Strengths:**
- Can model any structure the client might prefer

**Gaps/Improvements:**
- **Key gap**: No "compare 3 options" view for client presentation
- Need easy way to show "here's what each option means for both of us"

---

## Scenario 6: "We're doing work for a related company"

**Context:** The client is a subsidiary, sister company, or has common shareholders with the software company.

### Typical Process

| Step | Activity | Key Questions | Who's Involved | Rating | Findings |
|------|----------|---------------|----------------|--------|----------|
| 1 | Understand the relationship | Subsidiary? Common shareholder? How related? | Management, Legal | ⚠️ | Mutual Ownership checkbox exists but could guide more |
| 2 | Understand the rules | What's different? What are the risks? | Finance, Tax advisor | ✅ | Help content explains transfer pricing |
| 3 | Determine arm's length price | What would unrelated parties pay? | Finance | ✅ | Benchmarks provided |
| 4 | Document the rationale | Can we defend this to SARS? | Finance, Tax advisor | ✅ | Compliance tab with checklists |
| 5 | Structure appropriately | Which model is cleanest? | Finance | ✅ | Wizard helps |
| 6 | Ongoing compliance | Keep records, review annually | Finance | ⚠️ | No reminder/tracking for annual review |

### Summary

**Strengths:**
- Transfer pricing is well-covered
- Compliance checklists are helpful
- Benchmarks guide arm's length pricing

**Gaps/Improvements:**
- Could guide relationship classification more clearly upfront
- No ongoing compliance tracking/reminders

---

## Overall Findings

### Key Strengths Across Scenarios

1. **Structure selection** - Wizard does a good job guiding users to the right model
2. **Pricing calculations** - Clear cost + margin = price logic
3. **Transfer pricing/compliance** - Well-covered for related party scenarios
4. **Financial projections** - NPV, IRR, break-even analysis is solid
5. **Pricing Mode** - Works well for startup/product pricing decisions

### Common Gaps

1. **Effort-to-cost bridge** - Tool assumes you know your cost; no help getting from "scope" to "cost"
2. **Client-facing output** - No proposal/quote/presentation format for sharing with clients
3. **Multi-option comparison** - Can't easily compare 2-3 structures side-by-side
4. **IP valuation starting point** - No help assessing "what is my existing software worth?"
5. **Negotiation support** - No trade-off visualization for "if we change X, here's what happens"

### Recommended Improvements

(To be prioritized after discussion)

1. **Effort Estimation Module** - Simple calculator: hours × rate = cost as input to pricing
2. **Compare Mode** - Save and compare 2-3 scenarios side-by-side
3. **Export/Proposal Output** - Client-friendly PDF or summary view
4. **IP Valuation Guide** - Questionnaire to help value existing software
5. **Negotiation View** - Show trade-offs: "Option A vs Option B - impact on both parties"

---

## Next Steps

- [ ] Prioritize which gaps to address
- [ ] Design solutions for top priorities
- [ ] Update roadmap
