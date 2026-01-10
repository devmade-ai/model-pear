# Model 5: Software Sale with Ongoing Support
## Variant Comparison Tool — Concept Document

---

## Purpose

This tool enables comparison of eight sub-variants within the Software Sale with Ongoing Support model to determine optimal fit for a software transaction. The tool evaluates financial, accounting, tax, and risk outcomes from both perspectives: Developer and Buyer.

---

## Model Overview

Developer creates software, sells it outright to Buyer, and provides ongoing maintenance/support under a separate service agreement. Ownership transfers completely at sale.

**Characteristics:**
- IP ownership: Transfers to Buyer on sale
- Cash flow: Upfront purchase price + recurring support fees
- Risk allocation: Development risk with Developer; ongoing operational risk with Buyer
- Developer asset position: None after sale (derecognises)
- Buyer asset position: High (capitalises purchase price)

---

## Variants Covered

| Code | Variant Name | Key Differentiator |
|------|--------------|-------------------|
| 5A | Clean Sale | Outright sale with no post-sale obligations |
| 5B | Sale Plus Maintenance Agreement | Separate maintenance contract for bug fixes, patches |
| 5C | Sale Plus Support and Updates | Ongoing enhancements included in support |
| 5D | Sale with Warranty | Warranty period included (assurance-type) |
| 5E | Sale with Buyback Commitment | Developer commits to repurchase under conditions |
| 5F | Sale with Retained Improvements | Buyer acquires current version, Developer keeps future rights |
| 5G | Asset Sale vs Share Sale | Compare direct IP sale vs entity sale |
| 5H | Sale with Licence-Back | Developer sells IP, Buyer licences back to Developer |

---

## Stage 1: Static Basic Inputs

### Project Parameters

**Development Timeline**
- Project start date
- Development completion date
- Date IAS 38 criteria expected to be met
- Software ready-for-sale date
- Sale transaction date

**Cost Structure (Developer)**
- Total development cost (ZAR)
- Research phase costs (pre-criteria, expensed)
- Development phase costs (post-criteria, capitalised)
- Direct costs breakdown: salaries, contractors, infrastructure, other
- Carrying value of intangible asset at sale date

### Transaction Parameters

**Sale Terms**
- Agreed sale price (ZAR)
- Payment structure: Lump sum / Instalments / Deferred
- Payment timing
- Any contingent consideration

**Ongoing Support Terms (if applicable)**
- Monthly/annual support fee
- Support agreement term (months/years)
- Services included: bug fixes, patches, enhancements, helpdesk
- Support fee escalation (annual increase percentage)

### Variant-Specific Inputs

**5A: Clean Sale**
- Sale price only
- Confirmation: No post-sale obligations

**5B: Sale Plus Maintenance Agreement**
- Sale price
- Annual maintenance fee
- Maintenance term (years)
- Services included: List of maintenance obligations

**5C: Sale Plus Support and Updates**
- Sale price
- Annual support fee
- Support term
- Update entitlements: Major versions / Minor versions / All updates
- Standalone selling price of updates (for allocation)

**5D: Sale with Warranty**
- Sale price
- Warranty period (months)
- Warranty scope: Bug fixes only / Performance guarantees / Both
- Estimated warranty cost (for provision)

**5E: Sale with Buyback Commitment**
- Sale price
- Buyback trigger conditions
- Buyback price (or formula)
- Probability of buyback occurrence

**5F: Sale with Retained Improvements**
- Sale price for current version
- Developer's rights to future versions: Exclusive / Shared / None
- Licensing arrangement for future versions to Buyer

**5G: Asset Sale vs Share Sale**
- Asset sale: IP sale price
- Share sale: Share purchase price, Book value of target entity, Net asset value
- Securities transfer tax applicable (share sale: 0.25%)

**5H: Sale with Licence-Back**
- Sale price
- Licence-back terms: Royalty rate or fixed fee
- Licence-back duration
- Scope of licence-back: Perpetual / Term / Territory limited

### Entity Parameters

**Developer**
- Corporate tax rate (default: 27% for SA)
- Accounting framework (IFRS / GRAP / other)
- Related party status (default: Yes)
- Current intangible asset carrying value

**Buyer**
- Corporate tax rate (default: 27% for SA)
- Accounting framework (IFRS / GRAP / other)
- Useful life for amortisation (years)
- Amortisation method (straight-line / units of production / other)

### South African Tax Inputs

**Section 11(e) Wear and Tear (Buyer)**
- Software type: Mainframe (5-year write-off) or PC software (2-year write-off)

**Capital Gains Tax (Developer)**
- Base cost for Developer
- Inclusion rate for CGT
- Trading stock vs capital asset classification
- Any rollover relief applicable

**Transfer Pricing**
- Comparable sale prices for similar software
- Comparable support fee benchmarks
- Documentation status

---

## Metrics — Stage 1

### Developer Perspective

**At Sale**

*Revenue/Proceeds*
- Sale proceeds received
- Timing of receipt

*Asset Derecognition*
- Carrying value of intangible asset at sale
- Gain/(Loss) on sale = Sale Proceeds - Carrying Value
- Classification: Revenue or capital gain

*Tax on Sale*
- If trading stock: Tax = Gain × Corporate Tax Rate
- If capital asset: CGT = Gain × Inclusion Rate × Tax Rate
- Net proceeds after tax

*Cash Flow*
- Lump sum or instalment receipts
- Present value of deferred payments (if applicable)

**Post-Sale (Support Revenue)**
- Annual support revenue
- Support revenue over contract term
- Support costs incurred
- Support margin
- Tax on support income

**Total Developer Return**
- Sale proceeds
- Support revenue (if applicable)
- Total revenue
- Total costs (development + support delivery)
- Net profit after tax

*Balance Sheet Impact*
- Intangible asset removed
- Cash/receivable recognised
- Deferred revenue (if bundled and support undelivered)
- Warranty provision (5D variant)

### Buyer Perspective

**At Purchase**
- Purchase price paid
- Directly attributable costs (implementation, customisation)
- Total capitalised amount

*Allocation (if bundled with support)*
- Standalone selling price of software
- Standalone selling price of support
- Allocated transaction price per element

**Asset Recognition**
- Intangible asset = Allocated purchase price
- Prepaid support = Remaining allocation (if any)

**Post-Purchase**
- Annual amortisation expense
- Annual support expense (if not capitalised)
- Total annual expense

*Tax Position*
- Section 11(e) deduction per year
- Deferred tax position
- Tax benefit timing

*Cash Flow*
- Purchase payment
- Ongoing support payments
- Total cash outflows

*Balance Sheet*
- Intangible asset carrying value over time
- Prepaid expense (if support prepaid)

---

## Graphs — Stage 1

### Variant Comparison Charts

**Bar Chart: Total Cost to Buyer by Variant**
- X-axis: Variant (5A through 5H)
- Y-axis: Total ZAR paid (purchase + support)
- Purpose: Compare total expenditure across variants

**Bar Chart: Developer Total Revenue by Variant**
- X-axis: Variant
- Y-axis: Total revenue (sale + support)
- Purpose: Compare Developer's return

**Bar Chart: Buyer Asset Recognised by Variant**
- X-axis: Variant
- Y-axis: Intangible asset capitalised (ZAR)
- Purpose: Show capitalisation differences (bundling effects)

**Stacked Bar: Revenue Split — Sale vs Support**
- X-axis: Variant
- Y-axis: Total Developer revenue
- Segments: Sale proceeds, Support revenue
- Purpose: Show revenue composition

### Timeline Charts

**Line Chart: Cumulative Cash Flow (Developer)**
- X-axis: Time (months/years)
- Y-axis: Cumulative cash received (ZAR)
- Lines: One per variant
- Purpose: Compare cash timing

**Line Chart: Buyer Asset Carrying Value Over Time**
- X-axis: Time (years)
- Y-axis: Asset carrying value (ZAR)
- Lines: One per variant
- Purpose: Show amortisation profiles

**Line Chart: Buyer Total Expense Recognition Over Time**
- X-axis: Time (years)
- Y-axis: Cumulative expense (ZAR)
- Lines: One per variant (amortisation + support expense)
- Purpose: Compare expense profiles

### Allocation Visualisation (for bundled variants)

**Pie Chart: Transaction Price Allocation (per variant)**
- Segments: Software (capitalised), Support (expensed or prepaid)
- Purpose: Show bundling impact

**Waterfall Chart: From Sale Price to Asset Recognised**
- Starting point: Sale price paid
- Adjustments: Support allocation, directly attributable costs
- Ending point: Asset capitalised
- Purpose: Trace from payment to asset

### Risk Visualisation

**Scatter Plot: Transfer Price Risk vs Developer Return**
- X-axis: Transfer pricing risk score
- Y-axis: Developer net return
- Points: One per variant
- Purpose: Risk-return positioning

**Horizontal Bar: Complexity Rating by Variant**
- X-axis: Complexity score (Low / Medium / High)
- Y-axis: Variant
- Factors: Accounting, tax, documentation
- Purpose: Implementation difficulty comparison

---

## Calculations — Stage 1

### Developer Calculations

**Prior to Sale**

*Asset Carrying Value*
Carrying Value = Capitalised Development Costs - Accumulated Amortisation (if any)

**At Sale**

*Gain/Loss on Sale*
Gain/(Loss) = Sale Proceeds - Carrying Value at Sale Date

*Tax Calculation*

If Trading Stock:
Taxable Amount = Sale Proceeds - Cost of Goods Sold
Tax = Taxable Amount × Corporate Tax Rate

If Capital Asset:
Capital Gain = Sale Proceeds - Base Cost
Taxable Gain = Capital Gain × Inclusion Rate (currently 80% for companies)
CGT = Taxable Gain × Corporate Tax Rate

*Net Proceeds*
Net Proceeds After Tax = Sale Proceeds - Tax on Gain

**Support Revenue (where applicable)**

*Annual Support Revenue*
Year 1 Revenue = Annual Support Fee
Year n Revenue = Year (n-1) Revenue × (1 + Escalation Rate)

*Support Margin*
Support Margin = Support Revenue - Support Delivery Costs

*Tax on Support*
Tax = Support Margin × Corporate Tax Rate

**Total Return (5B, 5C, 5D variants)**
Total Revenue = Sale Proceeds + Sum of Support Revenue over Term
Total Tax = Tax on Sale + Tax on Support Margins
Net Return = Total Revenue - Development Costs - Support Costs - Total Tax

### Buyer Calculations

**At Purchase**

*If single performance obligation (5A):*
Capitalised Amount = Sale Price + Directly Attributable Costs

*If multiple performance obligations (5B, 5C):*

Step 1: Identify performance obligations
- Software licence (distinct good)
- Support services (distinct service)

Step 2: Determine standalone selling prices
- Software SSP = Market price or cost-plus
- Support SSP = Market rate for comparable support

Step 3: Allocate transaction price
Total Transaction Price = Sale Price (bundled)
Software Allocation = Transaction Price × (Software SSP / Total SSPs)
Support Allocation = Transaction Price × (Support SSP / Total SSPs)

Step 4: Recognition
Intangible Asset = Software Allocation
Prepaid Support = Support Allocation (released over support term)

**Amortisation**

*Straight-Line:*
Annual Amortisation = Capitalised Amount / Useful Life

*Units of Production:*
Annual Amortisation = Capitalised Amount × (Year Production / Total Expected Production)

**Tax Deductions**

*Section 11(e) Wear and Tear:*
If Mainframe: Annual Deduction = Capitalised Amount / 5
If PC Software: Annual Deduction = Capitalised Amount / 2

*Deferred Tax:*
Temporary Difference = Accounting Carrying Value - Tax Base
Deferred Tax Liability/Asset = Temporary Difference × Tax Rate

**Support Expense Recognition**
Annual Support Expense = Prepaid Support / Support Term (if prepaid)
Or: Annual Support Expense = Annual Support Payment (if paid annually)

**Total Cost of Ownership**
Total Cash Paid = Purchase Price + Support Payments
Asset Recognised = Capitalised Amount
Expense Recognised = Support Allocation + Amortisation
Asset Efficiency = Capitalised Amount / Total Cash Paid

### Variant-Specific Calculations

**5A Clean Sale**
Capitalised Amount = Sale Price + Directly Attributable Costs
No support revenue or allocation required

**5B Sale Plus Maintenance**
Apply allocation methodology above
Maintenance typically recognised as expense over term

**5C Sale Plus Support and Updates**
Three potential performance obligations:
1. Software licence (capitalised)
2. Support services (expensed)
3. Update rights (may be capitalised if asset-enhancing)

If updates significant, Buyer may capitalise incremental amount when updates received

**5D Sale with Warranty**
Developer: Warranty Provision = Estimated Warranty Costs
Warranty is assurance-type: not a separate performance obligation
Buyer: Capitalises full purchase price (no allocation for warranty)

**5E Sale with Buyback Commitment**
Assess whether sale qualifies for derecognition:
- If buyback certain: May be financing arrangement, not sale
- If buyback contingent: Assess probability

If genuine sale:
Developer: Recognise sale, accrue for potential buyback
Buyer: Recognise asset, disclose contingency

If financing:
Developer: Recognise liability, no derecognition of asset
Buyer: No asset, recognise prepayment/deposit

**5F Sale with Retained Improvements**
Developer: 
- Sale of current version: Recognise gain/loss
- Future versions: Capitalise development costs, separate asset

Buyer:
- Current version: Capitalise purchase price
- Future versions: Separate licence arrangement

**5G Asset Sale vs Share Sale**

*Asset Sale:*
Developer receives sale proceeds
Developer: Gain = Proceeds - Carrying Value
Buyer: Asset = Purchase Price
No securities transfer tax

*Share Sale:*
Buyer acquires shares in entity holding software
Share price may differ from IP value (includes other assets/liabilities)
Base cost adjustment: Buyer's base = Share purchase price (no step-up for IP within company)
Securities Transfer Tax = 0.25% of higher of market value or purchase price

**5H Sale with Licence-Back**

Developer:
- Sale: Recognise sale proceeds, derecognise asset
- Licence-back: Expense (if royalty) or capitalise (if prepaid perpetual)

Buyer:
- Purchase: Capitalise asset
- Licence-back: Revenue (royalty income) or deferred revenue (prepaid)

Combined assessment: Check economic substance — may be challenged as circular

### Combined Calculations

**Asset Efficiency**
Combined Efficiency = Buyer Capitalised Amount / Total Transaction Price

**Intercompany Elimination**
Developer Gain = Sale Proceeds - Carrying Value
Developer Support Margin = Support Revenue - Support Costs
Total Elimination = Developer Gain + Developer Support Margin

**Combined Tax Position**
Developer Tax = Tax on sale + Tax on support
Buyer Tax Benefit = Present value of Section 11(e) deductions
Net Tax Cost = Developer Tax - Buyer Tax Benefit

**Transfer Pricing Risk Score**

Factors:
1. Sale price vs comparable transactions
2. Sale price vs cost-plus
3. Sale price vs income-based valuation
4. Support fees vs market rates
5. Documentation completeness

Score = Weighted combination → Low / Medium / High

---

## Stage 2: Range Selections (Future Enhancement)

### Purpose
Allow users to input ranges for sensitivity analysis and break-even identification.

### Inputs Converted to Ranges
- Sale price: Low / Base / High
- Support fee: Low / Market / High
- Development costs: -10% / Base / +20%
- Useful life: Short / Medium / Long
- Support term: Short / Medium / Long

### Additional Calculations
- Break-even sale price for Developer (recovers costs plus target return)
- Sensitivity of Buyer's effective cost to support fee level
- Impact of allocation methodology on asset recognised

### Additional Graphs
- Tornado chart: Key drivers of combined outcome
- Range bars on comparison charts
- Break-even analysis

---

## Stage 3: Growth Projections (Future Enhancement)

### Purpose
Model post-acquisition value creation and lifecycle costs.

### Additional Inputs
- Expected revenue from software (Buyer)
- Post-acquisition enhancement costs
- Software obsolescence timeline
- Replacement/upgrade timing
- Discount rate

### Additional Calculations
- Buyer ROI on software investment
- Payback period
- NPV of total investment (purchase + support + internal costs)
- Total cost of ownership over full lifecycle

### Additional Graphs
- Lifecycle cost waterfall
- ROI comparison across variants
- NPV sensitivity analysis

---

## Decision Support Output

### Variant Recommendation Matrix

| Criterion | Best Variant | Rationale |
|-----------|--------------|-----------|
| Clean separation | 5A | No ongoing entanglement |
| Ongoing revenue for Developer | 5B or 5C | Support stream continues |
| Buyer asset maximisation | 5A or 5D | Full price capitalised, no allocation |
| Transfer pricing simplicity | 5A | Single transaction to price |
| Developer IP retention | 5F | Keeps future version rights |
| Buyer budget predictability | 5B | Fixed maintenance fees |
| Tax efficiency (Developer) | 5G (share sale, if applicable) | May access CGT treatment more easily |
| Buyer ongoing protection | 5C | Updates included |

### Scenario Guidance

**Choose 5A (Clean Sale) when:**
- Developer wants complete exit
- Buyer has internal support capability
- Simple transaction preferred
- No ongoing relationship needed

**Choose 5B (Sale Plus Maintenance) when:**
- Buyer needs ongoing support
- Developer wants recurring revenue
- Clear delineation between asset and services
- Standard industry practice for software type

**Choose 5C (Sale Plus Support and Updates) when:**
- Software evolves rapidly
- Buyer wants update entitlement
- Developer maintains development capability
- Premium pricing acceptable

**Choose 5D (Sale with Warranty) when:**
- Buyer wants defect protection
- Standard warranty period appropriate
- Developer confident in software quality
- Simpler than ongoing support arrangement

**Choose 5E (Sale with Buyback) when:**
- Financing element desired
- Buyer uncertain about long-term needs
- Developer willing to retain contingent exposure
- Review economic substance carefully

**Choose 5F (Sale with Retained Improvements) when:**
- Developer continuing to develop product line
- Buyer wants current version only
- Future versions licensed separately
- Clear version boundaries exist

**Choose 5G (Share Sale) when:**
- Entity specifically holds software IP
- Tax planning benefits available
- Buyer wants entity's other assets/contracts
- Securities transfer tax acceptable

**Choose 5H (Sale with Licence-Back) when:**
- Developer needs cash but wants continued use
- Buyer wants recurring income stream
- Tax or financing structuring required
- Clear business substance documented

---

## Data Validation Rules

- Sale price must be non-negative
- Support fee must be non-negative
- Useful life minimum 1 year, maximum 20 years
- Tax rates must be 0-100%
- Warranty period maximum 36 months
- Support term minimum 1 year, maximum 10 years
- Allocation percentages must sum to 100%
- Buyback probability must be 0-100%
- Transaction date must be after development completion

---

## Notes for Implementation

- All monetary values in ZAR
- Dates in YYYY-MM-DD format
- Percentages stored as decimals
- Default view: Combined perspective
- Toggle between: Developer / Buyer / Combined views
- For bundled variants: Show allocation workings
- Flag control assessment issues (5E particularly)
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
- GRAP 31 Intangible Assets
- South African Income Tax Act Section 11(e)
- South African Eighth Schedule (CGT)
- Securities Transfer Tax Act
- SARS Transfer Pricing Practice Note
