# Model 6: Subscription/SaaS Model (No Asset Transfer)
## Variant Comparison Tool — Concept Document

---

## Purpose

This tool enables comparison of nine sub-variants within the Subscription/SaaS model to determine optimal fit for a software arrangement. The tool evaluates financial, accounting, tax, and risk outcomes from both perspectives: Developer and Buyer. When mutual ownership applies (you own both entities), a Shareholder Perspective shows your overall position.

---

## Model Overview

Developer hosts and maintains software, providing access to Buyer via subscription. No IP ownership transfers. Developer retains the asset; Buyer expenses subscription fees.

**Characteristics:**
- IP ownership: Developer retains throughout
- Cash flow: Recurring subscription fees
- Risk allocation: Developer bears all software/platform risk; Buyer bears business dependency risk
- Developer asset position: High (capitalises and holds intangible asset)
- Buyer asset position: None (expenses fees as incurred)

**Note:** This model is least favourable for combined asset maximisation but included for completeness and to enable comparison against other models.

---

## Variants Covered

| Code | Variant Name | Key Differentiator |
|------|--------------|-------------------|
| 6A | Pure SaaS (Multi-Tenant) | Shared platform, no customisation |
| 6B | Dedicated Instance (Single-Tenant) | Buyer-specific environment |
| 6C | Subscription with Customisation | Base subscription plus custom development |
| 6D | Hybrid: Subscription + On-Premise Option | Choice of deployment model |
| 6E | Freemium / Tiered Pricing | Base free, premium features paid |
| 6F | Consumption-Based Pricing | Pay per usage (API calls, transactions) |
| 6G | Enterprise Agreement (Committed Spend) | Minimum annual commitment |
| 6H | Private Label SaaS | Buyer rebrands for end customers |
| 6I | Managed Service with Transition Rights | SaaS with option to insource later |

---

## Stage 1: Static Basic Inputs

### Project Parameters

**Development Timeline (Developer)**
- Development start date
- Development completion date
- Date IAS 38 criteria met
- Service launch date (subscription available)

**Cost Structure (Developer)**
- Total development cost (ZAR)
- Research phase costs (expensed)
- Development phase costs (capitalised)
- Estimated annual operating/hosting costs
- Estimated annual enhancement costs

### Subscription Parameters

**Contract Terms**
- Contract start date
- Initial contract term (months/years)
- Renewal terms (auto-renewal / renegotiate)
- Notice period for termination
- Minimum commitment period (if any)

**Pricing Structure**
- Base subscription fee (monthly/annual)
- Fee escalation rate (annual increase %)
- Payment terms (advance / arrears)
- Multi-year discount (if any)

### Variant-Specific Inputs

**6A: Pure SaaS (Multi-Tenant)**
- Monthly subscription fee
- Number of users (if per-user pricing)
- Standard features included

**6B: Dedicated Instance (Single-Tenant)**
- Base subscription fee
- Dedicated environment surcharge
- SLA commitments (uptime, support response)

**6C: Subscription with Customisation**
- Base subscription fee
- Customisation scope and cost
- Who controls customisation output: Developer / Buyer
- Customisation maintenance: Included / Additional fee

**6D: Hybrid (Subscription + On-Premise)**
- Cloud subscription fee
- On-premise licence fee (if chosen)
- Deployment choice: Cloud / On-Premise / Hybrid
- Switching costs between deployment modes

**6E: Freemium / Tiered Pricing**
- Free tier features
- Tier 1 (Basic) fee and features
- Tier 2 (Professional) fee and features
- Tier 3 (Enterprise) fee and features
- Current/expected tier for Buyer

**6F: Consumption-Based Pricing**
- Unit of consumption (API calls, transactions, storage, users)
- Price per unit
- Expected monthly consumption
- Volume discounts (if any)
- Minimum charge (if any)

**6G: Enterprise Agreement**
- Minimum annual commitment (ZAR)
- Products/services included
- Overage pricing (above commitment)
- Commitment period (years)
- True-up frequency

**6H: Private Label SaaS**
- Platform fee to Developer
- Buyer's pricing to end customers
- Revenue share (if applicable)
- Branding/white-label fee
- Support responsibilities: Developer / Buyer / Shared

**6I: Managed Service with Transition Rights**
- Monthly managed service fee
- Transition option: Yes / No
- Transition trigger conditions
- Transition price (or formula)
- Transition notice period
- Post-transition support arrangement

### Entity Parameters

**Developer**
- Corporate tax rate (default: 27% for SA)
- Accounting framework (IFRS / GRAP / other)
- Related party status (default: Yes)
- Software useful life for amortisation
- Number of other customers using same platform (for cost allocation context)

**Buyer**
- Corporate tax rate (default: 27% for SA)
- Accounting framework (IFRS / GRAP / other)
- Internal IT capability (for build vs buy context)

### South African Tax Inputs

**Developer Tax Position**
- Section 11(e) wear and tear on developed software
- Section 11D R&D incentive (if qualifying)

**Buyer Tax Position**
- Subscription fees: Generally deductible as incurred
- Prepaid subscriptions: Timing of deduction

**Transfer Pricing**
- Comparable SaaS pricing benchmarks
- Functional analysis (services provided)
- Documentation status

---

## Metrics — Stage 1

### Developer Perspective

**Asset Position**
- Intangible asset carrying value (initial)
- Annual amortisation expense
- Carrying value over time
- Enhancement capital additions (if any)

**Revenue Recognition**
- Annual subscription revenue from Buyer
- Revenue recognition timing (over access period)
- Contract liability (deferred revenue) at period-end
- Multi-year revenue projection

**Profitability**
- Annual gross profit = Subscription Revenue - Operating Costs - Amortisation
- Gross margin percentage
- Contribution margin (if multi-customer, allocation to this Buyer)
- Net profit before tax
- Tax payable

**Cash Flow**
- Annual cash inflows from Buyer
- Cash flow timing (advance vs arrears)
- Working capital impact (deferred revenue)

**Unit Economics (Multi-Customer Context)**
- Revenue per customer
- Cost to serve per customer
- Customer contribution margin
- Buyer as % of total revenue

### Buyer Perspective

**Expense Recognition**
- Annual subscription expense
- Expense timing (as service received)
- Prepaid expense (if paid in advance)

**Asset Position**
- No intangible asset recognised for subscription
- Customisation asset: Only if Buyer controls separate asset
- Right-of-use asset: Generally not applicable to SaaS (not IFRS 16)

**Total Cost of Access**
- Annual subscription cost
- Customisation costs (if applicable)
- Implementation costs (usually expensed)
- Training costs (expensed)
- Total annual cost

**Cash Flow**
- Annual cash outflows
- Payment timing
- Multi-year cash commitment

**Dependency Metrics**
- Single supplier dependency flag
- Switching cost estimate
- Contract lock-in period

### Shareholder Perspective (When Mutual Ownership)

Only relevant when the same person/entity owns both Developer and Buyer. This is NOT about group accounting consolidation.

**Your Asset Position**
- Total intangible assets = Developer's asset only
- Buyer contributes no assets
- Asset concentrated in Developer
- Note: Significant cash moves between your entities for limited asset shift

**Cash Flow to You**
- Cash moves between your entities (internal)
- Your net cash position unchanged
- Recurring payments vs one-time models

**Where Does Profit Sit?**
- Developer's gross profit from subscription
- Cumulative profit over contract term
- Is this the right entity to hold the profit?

**Transfer Pricing Risk**
- Subscription fee vs market rate (in case SARS queries)
- Comparable SaaS pricing analysis
- Documentation completeness

**Your Total Tax Position**
- Developer: Tax on subscription profit
- Buyer: Tax deduction on subscription expense
- Net tax impact across your entities

**Should You Use a Different Model?**
- Total cost if Buyer developed internally
- Total cost if licensed outright (Model 2)
- Total cost if purchased (Model 5)
- Which structure is best for your overall position?

---

## Graphs — Stage 1

### Variant Comparison Charts

**Bar Chart: Annual Cost to Buyer by Variant**
- X-axis: Variant (6A through 6I)
- Y-axis: Annual ZAR cost
- Purpose: Compare cost levels across subscription models

**Bar Chart: Developer Annual Revenue by Variant**
- X-axis: Variant
- Y-axis: Annual revenue (ZAR)
- Purpose: Compare Developer's return

**Bar Chart: Developer Gross Margin by Variant**
- X-axis: Variant
- Y-axis: Gross margin percentage
- Purpose: Compare profitability across models

**Stacked Bar: Buyer Cost Composition**
- X-axis: Variant
- Y-axis: Annual cost (ZAR)
- Segments: Base subscription, Customisation, Premium features, Overages
- Purpose: Show cost breakdown

### Timeline Charts

**Line Chart: Cumulative Buyer Spend Over Contract Term**
- X-axis: Time (years)
- Y-axis: Cumulative ZAR spent
- Lines: One per variant
- Purpose: Compare total investment over time

**Line Chart: Developer Revenue and Asset Value**
- X-axis: Time (years)
- Y-axis: ZAR
- Lines: Cumulative revenue, Asset carrying value
- Purpose: Show revenue accumulation vs asset depreciation

**Area Chart: Combined Asset Position Over Time**
- X-axis: Time (years)
- Y-axis: Asset value (ZAR)
- Single area: Developer's asset (Buyer has none)
- Purpose: Visualise asset concentration

### Comparison to Alternatives Charts

**Bar Chart: SaaS vs Build vs Buy Total Cost**
- X-axis: Option (SaaS variants, Internal build, Outright purchase)
- Y-axis: Total 5-year cost (ZAR)
- Purpose: Strategic comparison

**Line Chart: Cumulative Cost — SaaS vs Own**
- X-axis: Time (years)
- Y-axis: Cumulative cost (ZAR)
- Lines: SaaS subscription, Internal development + maintenance
- Crossover point highlighted
- Purpose: Break-even analysis

### Risk Visualisation

**Horizontal Bar: Transfer Pricing Risk by Variant**
- X-axis: Risk level
- Y-axis: Variant
- Purpose: Compare TP risk

**Radar Chart: Multi-Factor Comparison per Variant**
- Axes: Cost, Flexibility, Scalability, Control, Asset recognition
- Purpose: Holistic variant comparison

---

## Calculations — Stage 1

### Developer Calculations

**Asset Valuation and Amortisation**

*Initial Asset*
Capitalised Amount = Development Costs after IAS 38 criteria met

*Annual Amortisation*
Annual Amortisation = Capitalised Amount / Useful Life

*Carrying Value*
Carrying Value (Year n) = Capitalised Amount - (Amortisation × n)

*Enhancement Additions*
If enhancements meet capitalisation criteria:
New Asset = Enhancement Costs (capitalised)
Total Asset = Prior Asset + Enhancement - Cumulative Amortisation

**Revenue Recognition**

*Subscription Revenue (per period)*

6A, 6B: Revenue = Monthly Fee × 12 (or Annual Fee)

6C: Revenue = Base Subscription + Customisation Fees (allocated over delivery/access period)

6D: Revenue = Subscription Fee (or Licence Fee if on-premise chosen)
    If on-premise: May be point-in-time recognition (right to use)

6E: Revenue = Tier Fee based on Buyer's tier

6F: Revenue = Units Consumed × Price per Unit + Minimum Charge (if applicable)

6G: Revenue = Greater of (Minimum Commitment, Actual Usage Value)
    Excess over minimum recognised as earned

6H: Revenue = Platform Fee + Revenue Share (as Buyer earns from end customers)

6I: Revenue = Managed Service Fee (until transition)
    At transition: Recognise transfer proceeds

*Deferred Revenue*
If paid in advance:
Deferred Revenue = Cash Received - Revenue Recognised

**Profitability**

*Gross Profit*
Gross Profit = Subscription Revenue - Direct Operating Costs - Amortisation (allocated)

*Gross Margin*
Gross Margin % = Gross Profit / Subscription Revenue × 100

*Net Profit*
Net Profit Before Tax = Gross Profit - Allocated Overheads
Tax = Net Profit × Tax Rate
Net Profit After Tax = Net Profit - Tax

**Multi-Customer Allocation (if applicable)**
If Developer serves multiple customers:
Buyer's Share of Costs = Total Operating Costs × (Buyer Revenue / Total Revenue)
Or: Buyer's Share = Direct costs to serve Buyer

### Buyer Calculations

**Expense Recognition**

*Subscription Expense*
Annual Expense = Subscription Fees Paid (recognised as service received)

*Prepaid Expense*
If paid in advance:
Prepaid Expense = Cash Paid - Expense Recognised
Released over service period

**Customisation (6C Variant)**

*If Developer controls customisation:*
Buyer Expense = Customisation Fee (expense as incurred)
No asset recognised

*If Buyer controls separate asset:*
Buyer Asset = Customisation Cost (capitalised)
Amortisation = Asset / Useful Life

**Implementation Costs**
Generally expensed unless:
- Creating a separate identifiable asset
- Buyer controls the output
Most cloud implementation costs are expensed under current guidance

**Total Cost of Access**
Annual Cost = Subscription Fee + Customisation (if any) + Implementation (Year 1)
Multi-Year Cost = Sum of Annual Costs over Contract Term

**Tax Deduction**
Subscription Expense: Deductible as incurred
Prepaid: Deductible as expense recognised (matching)
Tax Benefit = Expense × Tax Rate

### Variant-Specific Calculations

**6A Pure SaaS**
Annual Cost = Monthly Fee × 12
No complexity — standard expense

**6B Dedicated Instance**
Annual Cost = Base Fee + Dedicated Surcharge
Higher cost, same expense treatment

**6C Subscription with Customisation**

Control Test:
- Does Buyer control the customisation during development? → Asset possible
- Can Buyer use customisation independent of SaaS? → Asset more likely
- Does customisation enhance SaaS only? → Expense

If Expense: Total Cost = Subscription + Customisation Fee
If Asset: Customisation Asset = Customisation Cost, Subscription Expense = Subscription Fee

**6D Hybrid**

If Cloud chosen:
Same as 6A — subscription expense

If On-Premise chosen:
Assess whether licence is right-to-use or right-to-access
Right-to-use: Capitalise licence, amortise
Right-to-access: Expense over licence term

**6E Freemium / Tiered**
Annual Cost = Tier Fee for selected tier
Upgrade: Incremental cost = New Tier Fee - Old Tier Fee

**6F Consumption-Based**
Expected Annual Cost = Expected Units × Price per Unit
Actual varies with usage
Budget variance = Actual - Expected

**6G Enterprise Agreement**
Annual Cost = Greater of (Minimum Commitment, Actual Usage)
Overage = Actual - Minimum (if positive)
Overage Cost = Overage Units × Overage Rate

**6H Private Label**
Developer Revenue = Platform Fee + Revenue Share
Buyer Cost = Platform Fee + Revenue Share
Buyer Revenue = End Customer Sales
Buyer Net = End Customer Revenue - Cost to Developer

**6I Managed Service with Transition**

Pre-Transition:
Buyer Expense = Managed Service Fee
No asset

At Transition:
Buyer pays Transition Price
Buyer recognises Intangible Asset = Transition Price
Accounting changes to Model 5 (Sale with Support) or Model 2 (Licence)

Post-Transition:
Buyer amortises asset
Support fees (if any) expensed

### Combined Calculations

**Combined Asset Efficiency**
Asset Efficiency = Combined Assets / Total Cash Exchanged
For pure SaaS: Efficiency = Developer Asset Only / Cumulative Subscription Fees
Note: This ratio may be low because Buyer's payments fund Developer's business, not asset transfer

**Intercompany Profit**
Annual Elimination = Developer Gross Profit from Buyer
Cumulative Elimination = Sum over contract term

**Combined Tax Position**
Developer Tax = Tax on subscription profit
Buyer Tax Deduction = Subscription expense × Tax Rate
Net Tax Impact = Developer Tax - Buyer Tax Benefit

**Break-Even vs Internal Development**

Internal Development Cost = Estimated build cost + Annual maintenance
SaaS Cost = Annual Subscription × Years

Break-Even Years = Internal Development Cost / (Internal Annual Cost - SaaS Annual Cost)
If SaaS cheaper annually: May never break even for internal
If SaaS more expensive annually: Years until internal cheaper

**Transfer Pricing Risk Score**

Factors:
1. Subscription fee vs comparable SaaS pricing
2. Margin analysis (Developer's return)
3. Functional analysis alignment
4. Documentation completeness

Score = Weighted combination → Low / Medium / High

---

## Stage 2: Range Selections (Future Enhancement)

### Purpose
Allow users to input ranges for sensitivity analysis.

### Inputs Converted to Ranges
- Subscription fee: Low / Market / High
- Contract term: Short / Medium / Long
- Consumption (6F): Low / Expected / High
- Tier progression (6E): Stay current / Upgrade path
- Escalation rate: 0% / CPI / Aggressive

### Additional Calculations
- Best/worst case annual costs
- Sensitivity to usage levels (6F)
- Impact of tier upgrades (6E)
- Break-even analysis range

### Additional Graphs
- Range bars on cost comparisons
- Scenario analysis (low/high usage)
- Monte Carlo simulation for consumption-based (6F)

---

## Stage 3: Growth Projections (Future Enhancement)

### Purpose
Model long-term SaaS economics and strategic alternatives.

### Additional Inputs
- Expected business growth (impacts usage/tiers)
- Developer roadmap (feature additions)
- Alternative vendor pricing
- Internal development capability assessment
- Discount rate

### Additional Calculations
- 5-year total cost of ownership
- NPV of SaaS vs alternatives
- Vendor dependency score
- Strategic flexibility assessment

### Additional Graphs
- Multi-year cost projection
- Comparison: SaaS vs build vs buy NPV
- Sensitivity to growth rate

---

## Decision Support Output

### Variant Recommendation Matrix

| Criterion | Best Variant | Rationale |
|-----------|--------------|-----------|
| Lowest cost (standard use) | 6A | No customisation or premium |
| Scalability | 6F | Pay for what you use |
| Cost predictability | 6G | Fixed commitment, no surprises |
| Flexibility to exit | 6I | Transition rights included |
| Revenue opportunity for Buyer | 6H | Buyer sells to end customers |
| Customisation needs | 6C | Built for specific requirements |
| Performance/security | 6B | Dedicated environment |
| Cost optimisation (low usage) | 6E or 6F | Start free or pay per use |

### Scenario Guidance

**Choose 6A (Pure SaaS) when:**
- Standard functionality meets needs
- Cost efficiency priority
- No special security/performance requirements
- Quick deployment needed

**Choose 6B (Dedicated Instance) when:**
- Data isolation required
- Performance SLAs critical
- Compliance requires dedicated environment
- Higher cost acceptable for assurance

**Choose 6C (Subscription with Customisation) when:**
- Standard product needs modification
- Customisation enhances SaaS (not standalone)
- Developer maintains customisation
- Willing to expense customisation costs

**Choose 6D (Hybrid) when:**
- Deployment flexibility needed
- May switch between cloud and on-premise
- Different accounting treatment desired (on-premise)
- Regulatory constraints on cloud

**Choose 6E (Freemium/Tiered) when:**
- Starting small, may grow
- Want to test before committing
- Clear tier boundaries match needs
- Upgrade path acceptable

**Choose 6F (Consumption-Based) when:**
- Usage is variable/unpredictable
- Want to align cost with value received
- Can manage usage actively
- Volume discounts available at scale

**Choose 6G (Enterprise Agreement) when:**
- Large-scale deployment
- Budget certainty required
- Multi-product/service needs
- Negotiating power for discounts

**Choose 6H (Private Label) when:**
- Buyer resells to customers
- Developer wants recurring platform revenue
- Buyer lacks development capability
- White-label arrangement suits both

**Choose 6I (Managed Service with Transition) when:**
- Long-term may want to own
- Testing before committing to purchase
- Transition path important strategically
- Hybrid initial SaaS + future ownership

---

## Important Note: Combined Asset Position

For entities under common control seeking to maximise combined asset recognition, the SaaS model is generally suboptimal because:

- Developer holds the asset, Buyer has no asset
- Buyer's payments become Developer's revenue, not Buyer's asset
- On consolidation, Buyer's expense and Developer's revenue eliminate, leaving only Developer's asset

**Consider alternative models if asset recognition is priority:**
- Model 1 (Development Services): Buyer capitalises
- Model 2 (Licence): Buyer capitalises licence
- Model 3 (Joint Development): Both capitalise shares
- Model 5 (Sale): Buyer capitalises purchase

SaaS model best suits scenarios where:
- Developer wants recurring revenue and asset retention
- Buyer prefers OPEX treatment
- Flexibility and low commitment valued over balance sheet impact

---

## Data Validation Rules

- Subscription fee must be non-negative
- Contract term minimum 1 month, maximum 10 years
- Escalation rate must be 0-30%
- Usage estimates must be non-negative
- Minimum commitment must be non-negative
- Tier fees must be in ascending order (6E)
- Transition price must be non-negative (6I)
- Tax rates must be 0-100%

---

## Notes for Implementation

- All monetary values in ZAR
- Dates in YYYY-MM-DD format
- Percentages stored as decimals
- Default view: Combined perspective
- Toggle between: Developer / Buyer / Combined
- Include "Alternative Comparison" section showing SaaS vs other models
- Flag when SaaS is suboptimal for combined asset goals
- Export and save/load capabilities

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-07 | — | Initial concept document |

---

## References

- IAS 38 Intangible Assets
- IFRS 15 Revenue from Contracts with Customers
- IFRS 16 Leases (for completeness, generally not applicable to SaaS)
- GRAP 31 Intangible Assets
- IFRIC guidance on cloud computing arrangements
- South African Income Tax Act Section 11(e)
- South African Income Tax Act Section 11D
- SARS Transfer Pricing Practice Note
