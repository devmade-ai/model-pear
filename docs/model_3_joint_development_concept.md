# Model 3: Joint Development / Cost-Sharing Arrangement
## Variant Comparison Tool — Concept Document

---

## Purpose

This tool enables comparison of eight sub-variants within the Joint Development model to determine optimal fit for a collaborative software development arrangement. The tool evaluates financial, accounting, tax, and risk outcomes from both perspectives: Developer and Buyer.

---

## Model Overview

Both companies contribute resources (cash, personnel, facilities) to jointly develop software. Each party owns rights proportional to their contribution or as contractually agreed. Neither party "sells" to the other.

**Characteristics:**
- IP ownership: Shared/proportional
- Cash flow: Each party funds their share of costs
- Risk allocation: Shared proportionally
- Developer asset position: Proportional (capitalises their share of costs)
- Buyer asset position: Proportional (capitalises their share of costs)

---

## Variants Covered

| Code | Variant Name | Key Differentiator |
|------|--------------|-------------------|
| 3A | Proportional Cost Sharing (Equal Ownership) | 50/50 split regardless of contribution |
| 3B | Contribution-Based Sharing | Ownership matches contribution value |
| 3C | Benefit-Based Sharing | Costs allocated by anticipated benefits |
| 3D | Platform + Application Split | Layered IP ownership |
| 3E | Development + Commercialisation Split | Capability-based contribution |
| 3F | Joint Venture Entity | Separate legal entity holds IP |
| 3G | Consortium / Multi-Party Arrangement | More than two parties |
| 3H | Pre-Competitive Joint Development | Shared base, proprietary extensions |

---

## Stage 1: Static Basic Inputs

### Project Parameters

**Development Timeline**
- Project start date
- Date IAS 38 criteria met
- Software completion date
- Total project duration (months)

**Total Project Costs**
- Total estimated development cost (ZAR)
- Research phase costs (always expensed)
- Development phase costs (capitalisable)
- Cost breakdown by category: Personnel, Infrastructure, Third-party services, Other

### Contribution Inputs

**Developer Contributions**
- Cash contribution (ZAR)
- Personnel contribution (FTEs × months × cost rate)
- Existing IP contributed (fair value)
- Facilities/infrastructure contributed (fair value)
- Total Developer contribution value

**Buyer Contributions**
- Cash contribution (ZAR)
- Personnel contribution (FTEs × months × cost rate)
- Existing IP contributed (fair value)
- Domain expertise / requirements contribution (fair value, if valued)
- Total Buyer contribution value

### Variant-Specific Inputs

**3A: Proportional Cost Sharing (Equal Ownership)**
- Ownership split (default: 50/50)
- Cost sharing ratio (default: matches ownership)

**3B: Contribution-Based Sharing**
- Valuation method for non-cash contributions
- Agreed contribution values per party
- Resulting ownership percentages (calculated from contributions)

**3C: Benefit-Based Sharing**
- Developer's anticipated benefit (ZAR or percentage)
- Buyer's anticipated benefit (ZAR or percentage)
- Benefit measurement basis: Revenue / Cost savings / Users served
- Cost allocation follows benefit ratio

**3D: Platform + Application Split**
- Platform development costs
- Application development costs
- Platform owner: Developer / Buyer / Shared
- Application owner: Developer / Buyer / Shared
- Cross-licence terms (royalty-free or fee-based)

**3E: Development + Commercialisation Split**
- Development contribution (primarily Developer)
- Commercialisation contribution (primarily Buyer)
- Valuation of each contribution type
- Revenue/profit split for commercial exploitation

**3F: Joint Venture Entity**
- JV ownership split
- Capital contributions to JV from each party
- JV operating costs
- Dividend/distribution policy
- Parent accounting method (equity method)

**3G: Consortium / Multi-Party**
- Number of parties
- Contribution and ownership per party
- Governance structure
- Decision-making thresholds

**3H: Pre-Competitive Joint Development**
- Shared base technology scope
- Proprietary extension scope per party
- Shared costs for base
- Separate costs for extensions
- Cross-licence terms for base technology

### Entity Parameters

**Developer**
- Corporate tax rate (default: 27%)
- Accounting framework (IFRS / GRAP)
- Useful life for software asset

**Buyer**
- Corporate tax rate (default: 27%)
- Accounting framework (IFRS / GRAP)
- Useful life for software asset

### South African Tax Inputs

- Section 11(e) applicability per party
- Software classification per party
- Transfer pricing documentation for contribution valuations

---

## Metrics — Stage 1

### Developer Perspective

**Contribution Analysis**
- Total contribution value
- Contribution as percentage of total
- Cash vs in-kind contribution split

**Asset Recognition**
- Capitalised development costs (Developer's share)
- Intangible asset carrying value
- Annual amortisation expense

**Expense Profile**
- Research phase expense (Developer's share)
- Non-capitalisable costs
- Total expense over project

**Exploitation Rights**
- Revenue rights (percentage or territory)
- Ability to license to third parties
- Restrictions on use

**Tax Position**
- Section 11(e) deduction (if IP owner)
- Tax impact of contribution structure

### Buyer Perspective

**Contribution Analysis**
- Total contribution value
- Contribution as percentage of total
- Cash vs in-kind contribution split

**Asset Recognition**
- Capitalised development costs (Buyer's share)
- Intangible asset carrying value
- Annual amortisation expense

**Expense Profile**
- Research phase expense (Buyer's share)
- Non-capitalisable costs
- Total expense over project

**Exploitation Rights**
- Usage rights (internal use, sublicensing)
- Territory or market restrictions
- Exclusivity of rights

**Tax Position**
- Section 11(e) deduction (if IP owner)
- Tax impact of contribution structure

---

## Graphs — Stage 1

### Variant Comparison Charts

**Pie Chart: Ownership Split by Variant**
- Segments: Developer share, Buyer share (and others for 3G)
- One chart per variant
- Purpose: Visualise ownership outcomes

**Stacked Bar: Contribution Composition**
- X-axis: Variant
- Y-axis: Total contribution value (ZAR)
- Segments: Developer cash, Developer in-kind, Buyer cash, Buyer in-kind
- Purpose: Show who contributes what

**Grouped Bar: Asset Recognition by Party**
- X-axis: Variant
- Y-axis: Intangible asset value (ZAR)
- Bars: Developer asset, Buyer asset
- Purpose: Compare balance sheet outcomes

**Bar Chart: Combined Asset Efficiency**
- X-axis: Variant
- Y-axis: Asset/Cost ratio (percentage)
- Purpose: Show which variant maximises asset recognition

### Structure Diagrams

**Sankey Diagram: Contribution Flow (3F JV variant)**
- Flows: Contributions from each party into JV
- JV to IP ownership
- Purpose: Visualise JV structure

**Org Chart: Ownership Structure (3G Consortium)**
- Boxes: Each party
- Lines: Ownership percentages
- Central: IP asset
- Purpose: Multi-party structure visualisation

### Timeline Charts

**Area Chart: Cumulative Contribution Over Time**
- X-axis: Time (months)
- Y-axis: Cumulative value (ZAR)
- Areas: Developer contribution, Buyer contribution
- Purpose: Show contribution timing

**Line Chart: Asset Carrying Value Over Time**
- X-axis: Time (years from completion)
- Y-axis: Carrying value (ZAR)
- Lines: Developer asset, Buyer asset
- Purpose: Show amortisation trajectories

---

## Calculations — Stage 1

### Contribution Calculations

**Total Contribution Value**
Developer Contribution = Cash + (Personnel FTEs × Months × Rate) + IP Fair Value + Facilities Value
Buyer Contribution = Cash + (Personnel FTEs × Months × Rate) + IP Fair Value + Other Contributions
Total Project Value = Developer Contribution + Buyer Contribution

**Ownership Percentage**

*3A Equal Ownership:*
Developer Ownership = 50%
Buyer Ownership = 50%

*3B Contribution-Based:*
Developer Ownership = Developer Contribution / Total Project Value
Buyer Ownership = Buyer Contribution / Total Project Value

*3C Benefit-Based:*
Developer Ownership = Developer Anticipated Benefit / Total Anticipated Benefits
Buyer Ownership = Buyer Anticipated Benefit / Total Anticipated Benefits
Cost Allocation follows Ownership

### Asset Recognition Calculations

**Capitalised Amount per Party**
Developer Capitalised = Development Phase Costs × Developer Cost Share
Buyer Capitalised = Development Phase Costs × Buyer Cost Share

Where Cost Share = Ownership Percentage (or as contractually agreed)

**Research Phase Expense**
Developer Expense = Research Phase Costs × Developer Cost Share
Buyer Expense = Research Phase Costs × Buyer Cost Share

**Annual Amortisation**
Developer Amortisation = Developer Capitalised / Useful Life
Buyer Amortisation = Buyer Capitalised / Useful Life

### Joint Venture Calculations (3F)

**JV Asset**
JV Intangible = Total Development Phase Costs (capitalised in JV)

**Parent Accounting**
Investment in JV = Capital Contributed
Equity Pickup = Share of JV Profit/Loss × Ownership %
Carrying Value = Investment + Cumulative Equity Pickup - Distributions

**Consolidation (if applicable)**
Proportionate consolidation: Recognise share of assets, liabilities, revenue, expense
Equity method: Single line investment on balance sheet

### Platform + Application Split (3D)

**Separate Assets**
Platform Asset = Platform Development Costs (owned by designated party)
Application Asset = Application Development Costs (owned by designated party)

**Cross-Licence Value**
If royalty-free: No ongoing payments, no revenue/expense
If fee-based: Licence accounting applies (see Model 2)

### Transfer Pricing Calculations

**Contribution Value Assessment**
Total Contributions should equal Total Costs for arm's length
If Contribution > Benefit Share: Excess is deemed payment to other party
If Contribution < Benefit Share: Shortfall is deemed receipt from other party

**Buy-In Payment**
If one party joins after development started:
Buy-In = Fair Value of Existing IP × Ownership Acquired

---

## Stage 2: Range Selections (Future Enhancement)

### Inputs Converted to Ranges
- Contribution valuations: Low / Mid / High
- Anticipated benefits: Conservative / Expected / Optimistic
- Useful life: Short / Medium / Long

### Additional Outputs
- Ownership sensitivity to contribution valuations
- Break-even contribution for target ownership
- Scenario analysis: What if one party contributes more/less?

### Additional Graphs
- Sensitivity chart: Ownership vs Contribution value changes
- Scenario comparison: Best/Base/Worst outcomes per party

---

## Stage 3: Growth Projections (Future Enhancement)

### Additional Inputs
- Expected revenue from software exploitation per party
- Ongoing enhancement contributions
- Third-party licensing potential
- Exit scenarios (buyout, sale, wind-down)

### Additional Calculations
- NPV of ownership position per party
- IRR on contribution
- Break-even timeline for contribution recovery
- Optimal ownership split based on projected benefits

### Additional Graphs
- 10-year revenue projection per party
- Cumulative return on contribution
- Exit value scenarios

---

## Decision Support Output

### Variant Recommendation Matrix

| Criterion | Best Variant | Rationale |
|-----------|--------------|-----------|
| Simplicity | 3A | Equal split, no complex valuations |
| Fairness to contributions | 3B | Ownership matches what each put in |
| Alignment with value | 3C | Costs follow anticipated benefits |
| Clear IP boundaries | 3D | Separate ownership of layers |
| Leverage complementary strengths | 3E | Development vs commercialisation split |
| Legal separation | 3F | JV isolates risk and governance |
| Multi-party collaboration | 3G | Consortium structure |
| Competitive flexibility | 3H | Shared base, proprietary extensions |

### Scenario Guidance

**Choose 3A (Equal Ownership) when:**
- Parties contribute roughly equally
- Simple structure preferred
- Trust is high, detailed tracking not needed
- Quick setup required

**Choose 3B (Contribution-Based) when:**
- Contributions are unequal and measurable
- Fairness based on input is important
- Non-cash contributions significant
- Clear valuation methodology available

**Choose 3C (Benefit-Based) when:**
- Anticipated benefits differ significantly
- Transfer pricing compliance is priority
- Benefits can be reliably projected
- Parties accept allocation based on outcomes

**Choose 3D (Platform + Application) when:**
- Modular architecture planned
- Clear separation of technology layers
- Different parties have expertise in different layers
- Cross-licensing is acceptable

**Choose 3E (Development + Commercialisation) when:**
- One party has development capability
- Other party has market access
- Revenue sharing for exploitation is acceptable
- Long-term partnership intended

**Choose 3F (Joint Venture Entity) when:**
- Legal separation desired
- Third-party investors possible
- Governance formality needed
- Clean exit mechanism required

**Choose 3G (Consortium) when:**
- More than two parties involved
- Industry collaboration (e.g., standards body)
- Complex governance acceptable
- Each party has distinct role

**Choose 3H (Pre-Competitive) when:**
- Base technology benefits all parties
- Competitive differentiation via extensions
- Industry-wide adoption desired
- Parties compete in downstream markets

---

## Data Validation Rules

- Ownership percentages must sum to 100%
- Cost shares must sum to 100%
- Contribution values must be non-negative
- If benefit-based (3C): Benefits must be non-negative
- JV ownership (3F) must match contribution ratios or have documented rationale
- Useful life minimum 1 year, maximum 20 years

---

## Notes for Implementation

- Joint development avoids intercompany profit — key benefit
- Contribution valuations are critical for transfer pricing
- Cost-sharing agreement must predate development (not retroactive)
- Changes to ownership require prospective adjustment
- Exit provisions should be documented upfront
- IFRS 11 joint arrangement assessment may be required for 3F

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-07 | — | Initial concept document |

---

## References

- IAS 38 Intangible Assets
- IFRS 11 Joint Arrangements
- GRAP 31 Intangible Assets
- OECD Transfer Pricing Guidelines (Cost Contribution Arrangements)
- South African Income Tax Act Section 11(e)
- SARS Transfer Pricing Practice Note
