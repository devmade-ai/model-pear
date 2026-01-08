# Model 1: Development Services Agreement (Cost-Plus Model)
## Variant Comparison Tool — Concept Document

---

## Purpose

This tool enables comparison of six sub-variants within the Development Services Agreement model to determine optimal fit for a software development project. The tool evaluates financial, accounting, tax, and risk outcomes from both perspectives: Developer and Buyer. When mutual ownership applies (you own both entities), a Shareholder Perspective shows your overall position.

---

## Model Overview

The Developer provides development services to the Buyer under a services agreement. The Buyer pays for development as it occurs and owns the resulting IP from inception.

**Characteristics:**
- IP ownership: Buyer from inception
- Cash flow: Buyer pays Developer periodically during development
- Risk allocation: Buyer bears development risk
- Developer asset position: None (no intangible asset recognised)
- Buyer asset position: High (capitalises costs once IAS 38 criteria met)

---

## Variants Covered

| Code | Variant Name | Key Differentiator |
|------|--------------|-------------------|
| 1A | Pure Cost Reimbursement | No margin — Developer recovers costs only |
| 1B | Cost-Plus Fixed Margin | Standard 5-15% margin on costs |
| 1C | Cost-Plus with Performance Bonus | Base margin plus milestone/delivery bonuses |
| 1D | Fixed Price Development Contract | Developer bears cost overrun risk |
| 1E | Time and Materials | Hourly rates plus materials, no fixed scope |
| 1F | Dedicated Development Team | Staff augmentation under Buyer direction |

---

## Stage 1: Static Basic Inputs

### Project Parameters

**Development Timeline**
- Project start date
- Estimated completion date
- Date IAS 38 criteria expected to be met (capitalisation trigger date)
- Software available-for-use date

**Cost Structure**
- Total estimated development cost (ZAR)
- Research phase costs (pre-criteria, always expensed)
- Development phase costs (post-criteria, capitalised by Buyer)
- Direct costs breakdown: salaries, contractors, infrastructure, other
- Indirect/overhead costs (if allocated)

### Variant-Specific Inputs

**1A: Pure Cost Reimbursement**
- Total reimbursable costs

**1B: Cost-Plus Fixed Margin**
- Base costs
- Margin percentage (default: 10%, range guidance: 5-15%)

**1C: Cost-Plus with Performance Bonus**
- Base costs
- Base margin percentage
- Number of milestones
- Bonus amount per milestone
- Probability of achieving each milestone (for expected value)

**1D: Fixed Price Development Contract**
- Agreed fixed price
- Developer's estimated costs
- Contingency buffer percentage

**1E: Time and Materials**
- Estimated hours by role/rate category
- Hourly rates per category
- Estimated materials/infrastructure costs
- Rate benchmark source (for transfer pricing)

**1F: Dedicated Development Team**
- Number of FTEs
- Monthly cost per FTE (fully loaded)
- Duration in months
- Management fee percentage (if any)

### Entity Parameters

**Developer**
- Corporate tax rate (default: 27% for SA)
- Accounting framework (IFRS / GRAP / other)
- Related party status (default: Yes)

**Buyer**
- Corporate tax rate (default: 27% for SA)
- Accounting framework (IFRS / GRAP / other)
- Useful life for amortisation (years)
- Amortisation method (straight-line / units of production / other)

### South African Tax Inputs

**Section 11(e) Wear and Tear**
- Software type: Mainframe (5-year write-off) or PC software (2-year write-off)
- Applicable to Buyer as IP owner

**Transfer Pricing**
- Comparable margin range for benchmarking (low / median / high)
- Documentation status (prepared / not prepared)

---

## Metrics — Stage 1

### Developer Perspective

**Revenue Recognition**
- Total revenue from Buyer over project life
- Revenue timing profile (when recognised)

**Profitability**
- Gross profit (Revenue minus Direct Costs)
- Gross margin percentage
- Net profit before tax
- Tax payable on profit
- Net profit after tax

**Cash Flow**
- Total cash inflows from Buyer
- Cash flow timing profile

**Balance Sheet Impact**
- No intangible asset (IP vests with Buyer)
- Contract asset/liability position during project
- Deferred tax position (if any timing differences)

**Risk Metrics**
- Cost overrun exposure (1D only: full exposure)
- Revenue certainty (fixed vs variable)

### Buyer Perspective

**Asset Recognition**
- Total capitalised amount (intangible asset)
- Research phase expense (pre-criteria)
- Capitalisation ratio (capitalised / total paid)

**Expense Profile**
- Research phase costs expensed
- Amortisation expense per year (post completion)
- Total expense over useful life

**Tax Position**
- Section 11(e) deduction per year
- Tax benefit timing vs accounting expense timing
- Deferred tax asset/liability

**Cash Flow**
- Total cash outflows to Developer
- Payment timing profile

**Balance Sheet Impact**
- Intangible asset carrying value at completion
- Intangible asset carrying value over time (amortisation schedule)

### Shareholder Perspective (When Mutual Ownership)

Only relevant when the same person/entity owns both Developer and Buyer. This is NOT about group accounting consolidation.

**Your Total Asset Position**
- Total intangible assets across both your entities
- Asset efficiency ratio: Combined Assets / Total Cash Exchanged

**Cash Flow to You**
- Cash moves between your entities (internal)
- Your net cash position unchanged
- External cash impact only relevant if third parties involved

**Where Does Profit Sit?**
- Developer profit from the margin
- Which entity should hold the profit for tax efficiency?
- What's your total after-tax position?

**Transfer Pricing Risk**
- Qualitative rating based on margin vs benchmark range
- Documentation completeness (in case SARS queries)

**Your Total Tax Position**
- Total tax payable across both entities
- Effective combined tax rate on project
- Which structure minimises your overall tax?

---

## Graphs — Stage 1

### Variant Comparison Charts

**Bar Chart: Total Cost to Buyer by Variant**
- X-axis: Variant (1A through 1F)
- Y-axis: Total ZAR paid by Buyer
- Purpose: Quick visual of which variant costs Buyer most/least

**Bar Chart: Developer Profit by Variant**
- X-axis: Variant
- Y-axis: Developer net profit after tax (ZAR)
- Purpose: Shows Developer's return under each structure

**Bar Chart: Buyer Capitalised Asset by Variant**
- X-axis: Variant
- Y-axis: Intangible asset recognised (ZAR)
- Purpose: Shows balance sheet impact for Buyer

**Stacked Bar: Combined View — Expense vs Asset**
- X-axis: Variant
- Y-axis: Total project value
- Segments: Buyer expensed portion, Buyer capitalised portion, Developer profit (eliminated on consolidation)
- Purpose: Shows how total value splits between expense and asset recognition

### Timeline Charts

**Line Chart: Cumulative Cash Flow by Variant**
- X-axis: Time (months)
- Y-axis: Cumulative ZAR
- Lines: One per variant showing payment profile
- Purpose: Compares cash flow timing across variants

**Line Chart: Buyer Asset Carrying Value Over Time**
- X-axis: Time (years, from completion through full amortisation)
- Y-axis: Asset carrying value (ZAR)
- Lines: One per variant
- Purpose: Shows long-term balance sheet trajectory

### Risk Visualisation

**Scatter Plot: Risk vs Return Trade-off**
- X-axis: Risk score (Developer's cost overrun exposure)
- Y-axis: Developer expected profit
- Points: One per variant, sized by total project value
- Purpose: Visualise risk-return positioning of each variant

**Horizontal Bar: Transfer Pricing Risk by Variant**
- X-axis: Risk level (Low / Medium / High)
- Y-axis: Variant
- Colour coding: Green (low), Yellow (medium), Red (high)
- Purpose: Quick view of SARS scrutiny risk

---

## Calculations — Stage 1

### Developer Calculations

**Revenue (per variant)**

*1A Pure Cost Reimbursement:*
Revenue = Total Reimbursable Costs

*1B Cost-Plus Fixed Margin:*
Revenue = Base Costs × (1 + Margin Percentage)

*1C Cost-Plus with Performance Bonus:*
Base Revenue = Base Costs × (1 + Base Margin Percentage)
Expected Bonus = Sum of (Milestone Bonus × Probability of Achievement) for each milestone
Total Expected Revenue = Base Revenue + Expected Bonus

*1D Fixed Price:*
Revenue = Agreed Fixed Price
(Note: Developer bears risk if actual costs exceed estimate)

*1E Time and Materials:*
Revenue = Sum of (Hours per Category × Rate per Category) + Materials Costs

*1F Dedicated Team:*
Revenue = (Number of FTEs × Monthly Cost per FTE × Duration) × (1 + Management Fee Percentage)

**Developer Gross Profit**
Gross Profit = Revenue - Direct Costs Incurred

**Developer Tax Payable**
Taxable Income = Revenue - Allowable Deductions (costs)
Tax Payable = Taxable Income × Corporate Tax Rate

**Developer Net Profit**
Net Profit After Tax = Gross Profit - Tax Payable

### Buyer Calculations

**Capitalisation Split**

Capitalised Amount = Costs incurred after IAS 38 criteria met
Expensed Amount = Costs incurred before IAS 38 criteria met (research phase)

For all variants:
- If criteria met at project start: 100% capitalised
- If criteria never met: 100% expensed
- Otherwise: pro-rata based on timing

**Annual Amortisation (Straight-Line)**
Annual Amortisation = Capitalised Amount / Useful Life in Years

**Section 11(e) Tax Deduction**
If Mainframe Software: Annual Deduction = Capitalised Amount / 5
If PC Software: Annual Deduction = Capitalised Amount / 2

**Deferred Tax Calculation**
Temporary Difference = Accounting Carrying Value - Tax Base
Deferred Tax Liability (or Asset) = Temporary Difference × Tax Rate

### Combined Calculations

**Combined Asset Efficiency**
Asset Efficiency = Buyer Capitalised Amount / Total Cash Paid by Buyer
(Higher is better — more of spend becomes asset rather than expense)

**Intercompany Profit Elimination**
Elimination Amount = Developer Gross Profit
(This amount adds no value on consolidation — it's internal)

**Combined Effective Tax Rate**
Combined Tax = Developer Tax + Buyer Tax (on amortisation benefit)
Combined Effective Rate = Combined Tax / Total Project Value

**Transfer Pricing Risk Score**

Risk factors assessed:
1. Margin vs benchmark range: Within range (Low), Near boundary (Medium), Outside range (High)
2. Documentation: Complete (reduces risk), Incomplete (increases risk)
3. Comparable transactions: Available (reduces risk), Not available (increases risk)

Score = Weighted combination producing Low / Medium / High rating

---

## Stage 2: Range Selections (Future Enhancement)

### Purpose
Allow users to input ranges rather than single values to see sensitivity and identify break-even points.

### Inputs Converted to Ranges
- Margin percentage: Low / Base / High
- Milestone achievement probability: Pessimistic / Expected / Optimistic
- Development costs: -10% / Base / +20%
- Useful life: Short / Medium / Long
- Hourly rates: Low / Benchmark / High

### Additional Calculations
- Best case / Base case / Worst case scenarios for all metrics
- Break-even margin (where Developer profit = 0)
- Sensitivity analysis: Which input has largest impact on outcome

### Additional Graphs
- Tornado chart showing sensitivity of combined outcome to each input
- Range bars on all comparison charts showing min/max outcomes
- Probability distribution of Developer profit (1C and 1D variants)

---

## Stage 3: Growth Projections (Future Enhancement)

### Purpose
Model multi-year scenarios where the software generates ongoing value, requiring additional development, or scales across multiple projects.

### Additional Inputs
- Expected revenue generated by software (Buyer side)
- Ongoing enhancement costs per year
- Additional modules/phases planned
- Inflation rate for costs
- Discount rate for NPV calculations

### Additional Calculations
- NPV of project for Developer
- NPV of project for Buyer
- IRR for each party
- Payback period for Buyer's capitalised investment
- Projected asset value over 5-10 year horizon
- Break-even usage/revenue for Buyer

### Additional Graphs
- NPV comparison across variants
- Cash flow waterfall over projection period
- Asset value trajectory with enhancement capital additions
- ROI comparison chart

---

## Decision Support Output

### Variant Recommendation Matrix

The tool produces a summary showing which variant scores best on each criterion:

| Criterion | Best Variant | Rationale |
|-----------|--------------|-----------|
| Lowest cost to Buyer | 1A | No margin paid |
| Highest Developer profit | 1D (if delivered under budget) | Risk premium in fixed price |
| Highest Buyer asset | 1A | All spend capitalised (no margin leakage) |
| Best combined efficiency | 1A | No intercompany profit elimination |
| Lowest transfer pricing risk | 1B | Standard approach, most defensible |
| Best cash flow certainty (Buyer) | 1D | Fixed price known upfront |
| Best cash flow certainty (Developer) | 1E | Paid for actual time regardless of outcome |
| Best for variable scope | 1E or 1F | Adapts to changing requirements |

### Scenario Guidance

**Choose 1A (Pure Cost Reimbursement) when:**
- Maximising Buyer's asset is priority
- Entities are consolidated (margin eliminated anyway)
- Developer has no third-party benchmark work
- Transfer pricing risk is acceptable given documentation

**Choose 1B (Cost-Plus Fixed Margin) when:**
- Standard arm's length pricing needed
- Developer needs to show profit for other stakeholders
- Transfer pricing defensibility is priority
- Simple, well-understood structure preferred

**Choose 1C (Cost-Plus with Performance Bonus) when:**
- Incentivising Developer delivery performance matters
- Milestones are clearly definable
- Buyer willing to pay premium for on-time/quality delivery
- Variable consideration accounting is manageable

**Choose 1D (Fixed Price) when:**
- Buyer needs budget certainty
- Scope is well-defined and unlikely to change
- Developer confident in cost estimates
- Developer willing to accept overrun risk for higher margin

**Choose 1E (Time and Materials) when:**
- Scope is uncertain or evolving
- Agile/iterative development approach
- Buyer comfortable with cost variability
- Rates can be benchmarked for transfer pricing

**Choose 1F (Dedicated Development Team) when:**
- Buyer wants control over personnel and direction
- Long-term engagement expected
- Closer to secondment model preferred
- Buyer's control strengthens asset recognition position

---

## Data Validation Rules

- Margin percentage must be 0-100%
- Milestone probabilities must sum to reasonable total (warn if >100% for independent milestones)
- Useful life minimum 1 year, maximum 20 years
- Tax rates must be 0-100%
- All monetary values must be non-negative
- Capitalisation trigger date must be between start and completion dates
- Completion date must be after start date

---

## Notes for Implementation

- All monetary values in ZAR
- Dates in YYYY-MM-DD format
- Percentages stored as decimals (10% = 0.10)
- Default view: Combined perspective
- Allow toggle between perspectives: Developer / Buyer / Combined
- Export capability for all calculated metrics
- Save/load scenario capability for comparison

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-07 | — | Initial concept document |

---

## References

- IAS 38 Intangible Assets
- IFRS 15 Revenue from Contracts with Customers
- GRAP 31 Intangible Assets
- South African Income Tax Act Section 11(e)
- South African Income Tax Act Section 11D
- SARS Transfer Pricing Practice Note
