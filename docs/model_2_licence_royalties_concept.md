# Model 2: Software Licence with Royalties
## Variant Comparison Tool — Concept Document

---

## Purpose

This tool enables comparison of eight sub-variants within the Software Licence with Royalties model to determine optimal fit for a software licensing arrangement. The tool evaluates financial, accounting, tax, and risk outcomes from both perspectives: Developer and Buyer. When mutual ownership applies (you own both entities), a Shareholder Perspective shows your overall position.

---

## Model Overview

The Developer develops and owns the IP, then grants a licence to the Buyer. The Buyer pays either upfront fees, ongoing royalties, or both. The Developer retains ownership and can license to others.

**Characteristics:**
- IP ownership: Developer retains
- Cash flow: Upfront fee and/or usage-based royalties
- Risk allocation: Developer bears development risk; Buyer bears implementation risk
- Developer asset position: High (capitalises development costs, recognises intangible asset)
- Buyer asset position: Medium (capitalises licence cost, amortises over term/useful life)

---

## Variants Covered

| Code | Variant Name | Key Differentiator |
|------|--------------|-------------------|
| 2A | Perpetual Licence (Upfront Payment) | One-time payment, use indefinitely |
| 2B | Term Licence (Annual/Multi-Year) | Fixed period, must renew |
| 2C | Usage-Based Royalties | Pay per transaction/user/metric |
| 2D | Minimum Guarantee Plus Royalties | Floor payment plus variable upside |
| 2E | Revenue Share / Profit Share | Percentage of Buyer's earnings |
| 2F | White-Label / Reseller Licence | Buyer rebrands and sells to end customers |
| 2G | Exclusive vs Non-Exclusive Licence | Sole rights vs shared rights |
| 2H | Source Code Licence / Escrow | Access to source code included |

---

## Stage 1: Static Basic Inputs

### Project Parameters

**Development (Developer Side)**
- Total development cost incurred (ZAR)
- Development start date
- Date IAS 38 criteria met
- Software completion date
- Useful life of software asset (years)

**Licence Terms**
- Licence grant date
- Licence type: Perpetual / Term
- If term: licence duration (years)
- Exclusivity: Exclusive / Non-exclusive
- Territory: South Africa / Africa / Global / Custom
- Source code access: Yes / No / Escrow only

### Variant-Specific Inputs

**2A: Perpetual Licence (Upfront Payment)**
- Upfront licence fee (ZAR)
- Implementation costs paid to Developer (if any)

**2B: Term Licence (Annual/Multi-Year)**
- Annual licence fee (ZAR)
- Term duration (years)
- Renewal expected: Yes / No
- Renewal fee (if different from initial)

**2C: Usage-Based Royalties**
- Royalty rate (percentage or fixed amount per unit)
- Usage metric: Transactions / Users / API calls / Revenue / Other
- Estimated annual usage volume
- Minimum royalty (if any)

**2D: Minimum Guarantee Plus Royalties**
- Minimum annual guarantee (ZAR)
- Royalty rate above threshold
- Threshold before royalties apply
- Guarantee term (years)

**2E: Revenue Share / Profit Share**
- Share percentage
- Basis: Gross revenue / Net revenue / Gross profit / Net profit
- Estimated annual Buyer revenue/profit from software use
- True-up frequency: Monthly / Quarterly / Annual

**2F: White-Label / Reseller Licence**
- Upfront territory/distribution fee (if any)
- Per-sale royalty rate
- Estimated end-customer sales volume
- Estimated end-customer price point
- Buyer's margin on resale

**2G: Exclusive vs Non-Exclusive**
- Exclusivity premium percentage (if exclusive)
- For non-exclusive: estimated number of other licensees
- Impact on Buyer's competitive position (qualitative input)

**2H: Source Code Licence / Escrow**
- Source code access fee (if any)
- Escrow setup and annual fees
- Escrow release triggers defined: Yes / No

### Entity Parameters

**Developer**
- Corporate tax rate (default: 27%)
- Accounting framework (IFRS / GRAP)
- Amortisation method for developed software
- Useful life assigned to software asset

**Buyer**
- Corporate tax rate (default: 27%)
- Accounting framework (IFRS / GRAP)
- Useful life for licence amortisation
- Implementation costs incurred separately

### South African Tax Inputs

**Developer**
- Section 11(e) applicable (self-developed software)
- Software classification: Mainframe (5 years) / PC (2 years)

**Buyer**
- Licence fee deductibility timing
- Royalty withholding tax considerations (if cross-border, not applicable for domestic)

**Transfer Pricing**
- Comparable royalty rate range (low / median / high)
- Comparable upfront fee benchmarks

---

## Metrics — Stage 1

### Developer Perspective

**Asset Recognition**
- Capitalised development costs
- Carrying value of intangible asset
- Annual amortisation expense

**Revenue Recognition**
- Upfront licence revenue (point in time vs over time)
- Royalty/subscription revenue per period
- Total revenue over licence term
- Revenue timing profile

**Profitability**
- Gross margin on licence (Revenue minus Amortisation)
- Operating profit
- Tax payable
- Net profit after tax

**Cash Flow**
- Upfront cash received
- Periodic cash received
- Total cash over licence term
- NPV of cash flows (at standard discount rate)

**Balance Sheet**
- Intangible asset carrying value trajectory
- Deferred revenue (if upfront payment recognised over time)
- Contract asset/liability

### Buyer Perspective

**Asset Recognition**
- Capitalised licence cost (upfront fees + directly attributable costs)
- Carrying value of licence asset
- Costs expensed (royalties, training, non-capitalisable implementation)

**Expense Profile**
- Upfront capitalised amount
- Annual amortisation of capitalised licence
- Annual royalty expense (2C, 2D, 2E, 2F variants)
- Total expense over licence term

**Tax Position**
- Timing of tax deductions
- Deferred tax impact

**Cash Flow**
- Upfront payment
- Periodic payments
- Total cash outflow
- NPV of cash outflows

**Balance Sheet**
- Intangible asset (licence) carrying value
- Prepaid expenses (if annual paid upfront)

### Shareholder Perspective (When Mutual Ownership)

Only relevant when the same person/entity owns both Developer and Buyer. This is NOT about group accounting consolidation.

**Your Overall Position**
- Developer asset: Software intangible
- Buyer asset: Licence intangible
- Total assets across both your entities

**Cash Flow to You**
- What you receive from Developer (dividends, drawings)
- What you receive from Buyer (dividends, drawings)
- Net cash flow to you as shareholder

**Where Should Profit Sit?**
- Developer's licence revenue = Buyer's licence cost
- Which entity has better tax treatment?
- Where do you want the profit to land?

**Transfer Pricing Risk**
- Royalty rate vs benchmark range
- Upfront fee vs comparable transactions
- Documentation completeness (in case SARS queries)

**Your Total Tax Position**
- Total tax across both entities
- Timing of deductions vs income recognition
- Which structure minimises your overall tax?

---

## Graphs — Stage 1

### Variant Comparison Charts

**Bar Chart: Total Buyer Cost by Variant (NPV)**
- X-axis: Variant (2A through 2H)
- Y-axis: NPV of total payments (ZAR)
- Purpose: Compare true cost accounting for time value

**Bar Chart: Developer Total Revenue by Variant (NPV)**
- X-axis: Variant
- Y-axis: NPV of revenue (ZAR)
- Purpose: Compare Developer returns across structures

**Stacked Bar: Buyer Cost Split — Capitalised vs Expensed**
- X-axis: Variant
- Y-axis: Total cost (ZAR)
- Segments: Capitalised (asset), Expensed (P&L hit)
- Purpose: Show balance sheet vs income statement impact

**Grouped Bar: Asset Position — Developer vs Buyer**
- X-axis: Variant
- Y-axis: Asset carrying value (ZAR)
- Bars: Developer intangible, Buyer intangible
- Purpose: Visualise where asset sits in group structure

### Timeline Charts

**Line Chart: Developer Revenue Recognition Over Time**
- X-axis: Time (years)
- Y-axis: Cumulative revenue (ZAR)
- Lines: One per variant
- Purpose: Compare revenue timing patterns

**Line Chart: Buyer Expense Profile Over Time**
- X-axis: Time (years)
- Y-axis: Annual expense (ZAR)
- Lines: One per variant
- Purpose: Show expense timing — upfront hit vs spread

**Area Chart: Cash Flow Differential**
- X-axis: Time (months/years)
- Y-axis: Net cash position
- Areas: Developer cash in, Buyer cash out
- Purpose: Visualise cash flow timing mismatch

### Risk Visualisation

**Bubble Chart: Risk vs Return by Variant**
- X-axis: Buyer cost volatility (fixed to variable spectrum)
- Y-axis: Developer expected return
- Bubble size: Total deal value
- Purpose: Position each variant on risk-return spectrum

**Heat Map: Transfer Pricing Risk Factors**
- Rows: Variants
- Columns: Risk factors (rate benchmark, documentation, comparables)
- Cells: Red/Yellow/Green rating
- Purpose: Quick risk assessment across variants

---

## Calculations — Stage 1

### Developer Calculations

**Capitalised Development Cost**
Development Asset = Costs incurred after IAS 38 criteria met

**Annual Amortisation**
Amortisation = Development Asset / Useful Life

**Revenue Recognition**

*2A Perpetual Licence:*
Revenue recognised at point in time (on grant) = Upfront Fee
(Right to use — no ongoing obligation)

*2B Term Licence:*
If right to access: Revenue = Annual Fee recognised over each year
If right to use: Revenue = Total fees recognised upfront

*2C Usage-Based Royalties:*
Revenue = Usage Volume × Royalty Rate
Recognised as usage occurs (sales-based royalty exception under IFRS 15)

*2D Minimum Guarantee Plus Royalties:*
Guaranteed Revenue = Minimum recognised over guarantee period
Variable Revenue = (Actual Usage × Rate) - Minimum, if positive
Total = Guaranteed + Variable

*2E Revenue/Profit Share:*
Revenue = Buyer's Revenue/Profit × Share Percentage
Recognised as Buyer earns underlying revenue

*2F White-Label:*
Upfront Fee recognised per licence type (point in time or over time)
Per-sale Royalty = End Customer Sales × Royalty Rate

*2G Exclusive vs Non-Exclusive:*
Same as underlying structure (2A-2F) but:
Exclusive commands premium (input as percentage uplift)

*2H Source Code:*
Base licence revenue per underlying structure
Plus: Source code access fee (typically point in time)
Plus: Escrow fees (recognised as services rendered)

**Developer Profit**
Gross Profit = Revenue - Amortisation - Direct Costs
Tax = Gross Profit × Tax Rate
Net Profit = Gross Profit - Tax

### Buyer Calculations

**Capitalised Licence Cost**
Capitalised Amount = Upfront Fee + Directly Attributable Implementation Costs
(Excludes: training, ongoing royalties, maintenance fees)

**Annual Amortisation**
Amortisation = Capitalised Amount / Shorter of (Licence Term, Useful Life)

**Royalty Expense (where applicable)**
Annual Royalty Expense = Usage × Rate (2C)
Or = Share × Buyer Revenue (2E)
Or = Max(Minimum, Usage × Rate) (2D)

**Total Annual Expense**
Total Expense = Amortisation + Royalty Expense + Other Fees

**Tax Deduction Timing**
Upfront fees: Deductible as amortised (spread over useful life)
Royalties: Deductible when incurred
Timing difference creates deferred tax

### Combined Calculations

**Combined Asset Efficiency**
Combined Assets = Developer Software Asset + Buyer Licence Asset
Efficiency = Combined Assets / Total Development Cost
(Note: On consolidation, Buyer's licence asset may be eliminated against Developer's revenue)

**Intercompany Elimination**
Developer Revenue = Buyer Cost (for intercompany portion)
Elimination removes profit and asset on consolidation
Remaining: Original development cost as group asset

**Effective Royalty Rate Benchmark**
Implied Rate = Total Payments / (Usage Volume × Years)
Compare to arm's length range

**Combined Tax Position**
Developer Tax on Licence Income
Less: Buyer Tax Benefit from Deductions
Net Tax Cost = Developer Tax - Buyer Tax Benefit

---

## Stage 2: Range Selections (Future Enhancement)

### Inputs Converted to Ranges
- Royalty rates: Low / Benchmark / High
- Usage volumes: Conservative / Expected / Optimistic
- Licence useful life: Short / Medium / Long
- Renewal probability (2B): Low / Medium / High

### Additional Outputs
- Scenario matrix: Best / Base / Worst for each party
- Break-even usage volume (2C, 2D, 2E)
- Sensitivity of Developer return to usage assumptions

### Additional Graphs
- Tornado chart: Input sensitivity on NPV
- Fan chart: Revenue projection range over time
- Break-even analysis: Volume vs Royalty rate trade-off

---

## Stage 3: Growth Projections (Future Enhancement)

### Additional Inputs
- Usage growth rate per year
- Licence renewal assumptions
- Additional licensee projections (Developer)
- Software enhancement capital expenditure
- Discount rate for NPV/IRR

### Additional Calculations
- Multi-year NPV for Developer and Buyer
- IRR for each party
- Lifetime value of licence relationship
- Optimal licence term based on projections

### Additional Graphs
- 10-year cash flow projection
- Asset value trajectory with enhancements
- Comparative NPV across variants with growth

---

## Decision Support Output

### Variant Recommendation Matrix

| Criterion | Best Variant | Rationale |
|-----------|--------------|-----------|
| Developer recurring revenue | 2C, 2D, 2E | Ongoing royalty streams |
| Developer upfront cash | 2A | Full payment immediately |
| Buyer cost certainty | 2A, 2B | Fixed known amounts |
| Buyer cash flow flexibility | 2C | Pay as you use |
| Combined asset maximisation | 2A | Both parties recognise assets |
| Transfer pricing simplicity | 2A, 2B | Easier to benchmark lump sums |
| Alignment of incentives | 2E | Both benefit from Buyer success |
| Buyer resale opportunity | 2F | White-label structure |
| Buyer competitive protection | 2G (Exclusive) | Sole rights in market |
| Buyer risk mitigation | 2H | Source code access if Developer fails |

### Scenario Guidance

**Choose 2A (Perpetual Licence) when:**
- Buyer wants permanent rights without ongoing obligations
- Developer needs upfront capital
- Simple structure preferred
- Buyer has capacity to self-maintain long-term

**Choose 2B (Term Licence) when:**
- Buyer uncertain about long-term needs
- Developer wants ongoing relationship and renewal revenue
- Technology may become obsolete
- Lower upfront cost important to Buyer

**Choose 2C (Usage-Based Royalties) when:**
- Usage is variable and hard to predict
- Buyer wants to align cost with value received
- Developer willing to accept volume risk
- Robust usage tracking available

**Choose 2D (Minimum Guarantee Plus Royalties) when:**
- Developer needs revenue certainty
- Buyer expects high usage and wants upside capped
- Balances fixed and variable elements
- Common in content/media licensing

**Choose 2E (Revenue/Profit Share) when:**
- Software directly generates Buyer revenue
- Strong alignment of interests desired
- Buyer willing to share upside
- Trust and transparency between parties

**Choose 2F (White-Label) when:**
- Buyer will resell to end customers
- Developer lacks distribution capability
- Buyer has market access Developer lacks
- Clear separation of development vs distribution

**Choose 2G (Exclusive) when:**
- Buyer needs competitive protection
- Willing to pay premium for sole rights
- Developer prepared to forgo other opportunities
- Market or territory clearly defined

**Choose 2H (Source Code) when:**
- Buyer concerned about Developer continuity
- Buyer may need to self-maintain in future
- High dependency on software
- Additional fee justified by risk mitigation

---

## Data Validation Rules

- Royalty rates typically 1-25% (warn if outside range)
- Minimum guarantees should be less than expected usage value
- Licence term minimum 1 year
- Useful life cannot exceed licence term for term licences
- Exclusive premium typically 20-100% above non-exclusive
- Usage volumes must be non-negative
- Share percentages must be 0-100%

---

## Notes for Implementation

- Revenue recognition requires assessment of right to use vs right to access
- Variable consideration (royalties) subject to constraint assessment
- Sales-based royalty exception applies — recognise as sales occur
- Withholding tax not applicable for domestic SA transactions
- Related party disclosure required in both sets of financials

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
- SARS Transfer Pricing Practice Note
