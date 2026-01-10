# Model 4: Build-Operate-Transfer (BOT) Model
## Variant Comparison Tool — Concept Document

---

## Purpose

This tool enables comparison of eight sub-variants within the Build-Operate-Transfer model to determine optimal fit for a software development project. The tool evaluates financial, accounting, tax, and risk outcomes from both perspectives: Developer and Buyer.

---

## Model Overview

The Developer builds the software, operates/maintains it for a period (providing SaaS-style access to the Buyer), then transfers ownership to the Buyer at a predetermined point or price.

**Characteristics:**
- IP ownership: Developer initially; transfers to Buyer at end of operation period
- Cash flow: Service fees during operation; transfer payment at end
- Risk allocation: Developer bears initial development and operational risk; transfers with ownership
- Developer asset position: High during operation, None after transfer
- Buyer asset position: None during operation, High after transfer

---

## Variants Covered

| Code | Variant Name | Key Differentiator |
|------|--------------|-------------------|
| 4A | Fixed Transfer Price | Transfer price agreed upfront |
| 4B | Formula-Based Transfer Price | Price determined by formula at transfer |
| 4C | Fair Market Value at Transfer | Independent valuation at transfer date |
| 4D | BOT with Purchase Option | Buyer has option, not obligation, to acquire |
| 4E | Build-Operate-Own (BOO) | No transfer — Developer operates indefinitely |
| 4F | Build-Transfer-Operate (BTO) | Developer builds, transfers immediately, then operates |
| 4G | Build-Lease-Transfer | Developer builds, leases to Buyer, ownership transfers at lease end |
| 4H | Phased Transfer | Modules transfer progressively over time |

---

## Stage 1: Static Basic Inputs

### Project Parameters

**Development Timeline**
- Project start date
- Development completion date
- Operation period start date
- Operation period end date / scheduled transfer date
- Date IAS 38 criteria expected to be met (capitalisation trigger date)

**Operation Period Parameters**
- Duration of operation period (months)
- Monthly service fee charged to Buyer
- Service level commitments (for risk assessment)
- Planned enhancements during operation period

**Cost Structure**
- Total estimated development cost (ZAR)
- Research phase costs (pre-criteria, always expensed by Developer)
- Development phase costs (post-criteria, capitalised by Developer)
- Direct costs breakdown: salaries, contractors, infrastructure, other
- Indirect/overhead costs (if allocated)
- Estimated annual operating costs during operation period

### Variant-Specific Inputs

**4A: Fixed Transfer Price**
- Agreed fixed transfer price
- Date of price agreement
- Any adjustment mechanisms (inflation, scope changes)

**4B: Formula-Based Transfer Price**
- Formula type: Cost-plus / Revenue multiple / EBITDA multiple / Other
- Base metric for formula
- Multiplier or margin percentage
- Floor and ceiling prices (if any)

**4C: Fair Market Value at Transfer**
- Valuation methodology to be used
- Estimated valuation cost
- Independent valuer identity (if known)
- Preliminary valuation range (low / mid / high)

**4D: BOT with Purchase Option**
- Option exercise price (or formula)
- Option exercise window (dates)
- Option premium amount (if any)
- Probability of exercise (for expected value calculations)

**4E: Build-Operate-Own (BOO)**
- Confirmation: No transfer planned
- Ongoing service fee structure (annual escalation)
- Contract term and renewal provisions

**4F: Build-Transfer-Operate (BTO)**
- Immediate transfer price
- Monthly managed service fee (post-transfer)
- Service agreement term

**4G: Build-Lease-Transfer**
- Lease term (months)
- Monthly lease payment
- Interest rate implicit in lease (for IFRS 16)
- Guaranteed residual value (if any)
- Transfer price at lease end

**4H: Phased Transfer**
- Number of modules/components
- Transfer date for each module
- Transfer price for each module
- Percentage of total value per module

### Entity Parameters

**Developer**
- Corporate tax rate (default: 27% for SA)
- Accounting framework (IFRS / GRAP / other)
- Related party status (default: Yes)
- Existing intangible asset carrying value (if any)

**Buyer**
- Corporate tax rate (default: 27% for SA)
- Accounting framework (IFRS / GRAP / other)
- Useful life for amortisation (years, post-transfer)
- Amortisation method (straight-line / units of production / other)

### South African Tax Inputs

**Section 11(e) Wear and Tear**
- Software type: Mainframe (5-year write-off) or PC software (2-year write-off)
- Applicable to Buyer after transfer

**Capital Gains Tax**
- Base cost for Developer (costs capitalised)
- Inclusion rate for CGT (if applicable)
- Trading stock vs capital asset classification

**Transfer Pricing**
- Comparable margin range for operation services
- Comparable pricing for similar software transfers
- Documentation status (prepared / not prepared)

---

## Metrics — Stage 1

### Developer Perspective

**During Operation Period**

*Revenue Recognition*
- Total service revenue over operation period
- Revenue timing profile (monthly/annual)

*Profitability*
- Gross profit from services (Revenue minus Operating Costs)
- Gross margin percentage
- Net profit before tax (per year and cumulative)
- Tax payable on service income

*Asset Position*
- Intangible asset carrying value (initial and at each year-end)
- Accumulated amortisation
- Amortisation expense per period
- Net book value at transfer date

**At Transfer**
- Transfer proceeds received
- Carrying value of asset at transfer
- Gain/(Loss) on transfer = Proceeds minus Carrying Value
- Tax on gain (CGT or revenue, depending on classification)
- Net proceeds after tax

*Cash Flow*
- Total cash inflows from Buyer (services + transfer)
- Cash flow timing profile (monthly during operation, lump sum at transfer)

### Buyer Perspective

**During Operation Period**
- Total service fees paid
- Annual expense recognised
- No asset recognised (unless 4G lease variant)
- Cash outflows timing profile

**At Transfer**
- Purchase price paid
- Intangible asset recognised
- Cash outflow (transfer payment)

**Post-Transfer**
- Asset carrying value
- Annual amortisation expense
- Section 11(e) tax deduction per year
- Deferred tax position
- Asset carrying value over time (amortisation schedule)

*Total Cost of Ownership*
- Service fees during operation period
- Transfer price
- Total expenditure before asset recognition

---

## Graphs — Stage 1

### Variant Comparison Charts

**Bar Chart: Total Cost to Buyer by Variant**
- X-axis: Variant (4A through 4H)
- Y-axis: Total ZAR paid by Buyer (services + transfer)
- Purpose: Quick visual of which variant costs Buyer most/least

**Bar Chart: Developer Total Revenue by Variant**
- X-axis: Variant
- Y-axis: Total Developer revenue (services + transfer proceeds)
- Purpose: Shows Developer's total return under each structure

**Bar Chart: Buyer Asset Recognised by Variant**
- X-axis: Variant
- Y-axis: Intangible asset recognised (ZAR)
- Annotation: Date when asset is first recognised
- Purpose: Shows balance sheet impact and timing for Buyer

**Stacked Bar: Total Value Split by Component**
- X-axis: Variant
- Y-axis: Total project value
- Segments: Service fees, Transfer price, Developer gain (eliminated on consolidation)
- Purpose: Shows how total value splits between components

### Timeline Charts

**Area Chart: Asset Location Over Time**
- X-axis: Time (months/years)
- Y-axis: Asset carrying value (ZAR)
- Areas: Developer's asset (one colour), Buyer's asset (different colour)
- Purpose: Visualises when asset "shifts" from Developer to Buyer

**Line Chart: Cumulative Buyer Cash Outflow by Variant**
- X-axis: Time (months)
- Y-axis: Cumulative ZAR paid
- Lines: One per variant showing payment profile
- Purpose: Compares cash flow timing across variants

**Line Chart: Developer Profit Accumulation Over Time**
- X-axis: Time (months)
- Y-axis: Cumulative profit (ZAR)
- Lines: One per variant
- Purpose: Shows when and how Developer earns returns

### Risk Visualisation

**Scatter Plot: Transfer Price Risk vs Developer Return**
- X-axis: Transfer pricing risk score
- Y-axis: Developer total return
- Points: One per variant, sized by total project value
- Purpose: Visualise risk-return positioning

**Gantt Chart: Ownership Timeline by Variant**
- X-axis: Time
- Y-axis: Variant
- Bars: Developer ownership period vs Buyer ownership period
- Purpose: Visual comparison of ownership timing

**Horizontal Bar: Control Transfer Timing by Variant**
- X-axis: Months until Buyer has asset
- Y-axis: Variant
- Purpose: Quick view of how long Buyer waits for asset

---

## Calculations — Stage 1

### Developer Calculations

**Development Phase**

*Capitalised Development Costs*
Capitalised Amount = Costs incurred after IAS 38 criteria met
Expensed Amount = Costs incurred before IAS 38 criteria met (research phase)

*Initial Asset Recognition*
Initial Intangible Asset = Capitalised Development Costs

**Operation Period**

*Service Revenue (annual)*
Annual Service Revenue = Monthly Service Fee × 12

*Amortisation*
Useful Life for Developer = Operation Period Duration
Annual Amortisation = Capitalised Amount / Useful Life (or units of production)
Carrying Value at Year End = Prior Carrying Value - Annual Amortisation

*Operating Profit*
Annual Operating Profit = Service Revenue - Operating Costs - Amortisation

*Tax on Operating Profit*
Tax Payable = Operating Profit × Corporate Tax Rate

**At Transfer**

*Gain/Loss Calculation*
Transfer Gain/(Loss) = Transfer Proceeds - Carrying Value at Transfer Date

*Tax on Gain*
If classified as capital: CGT = Gain × Inclusion Rate × Tax Rate
If classified as revenue: Tax = Gain × Corporate Tax Rate

*Net Proceeds*
Net Proceeds After Tax = Transfer Proceeds - Tax on Gain

**Total Developer Return**
Total Revenue = Sum of Service Revenue + Transfer Proceeds
Total Costs = Development Costs + Operating Costs + Taxes
Net Return = Total Revenue - Total Costs

### Buyer Calculations

**During Operation Period**

*Expense Recognition*
Annual Expense = Service Fees Paid (no asset — SaaS treatment)

*Cash Outflow*
Cumulative Cash Out (Operation) = Service Fees × Number of Periods

**At Transfer**

*Asset Recognition*
Intangible Asset = Transfer Price (plus directly attributable costs)

*Capitalisation Ratio*
Capitalisation Ratio = Transfer Price / Total Payments to Developer (services + transfer)

**Post-Transfer**

*Amortisation (Straight-Line)*
Annual Amortisation = Intangible Asset / Useful Life in Years

*Section 11(e) Tax Deduction*
If Mainframe Software: Annual Deduction = Intangible Asset / 5
If PC Software: Annual Deduction = Intangible Asset / 2

*Deferred Tax Calculation*
Temporary Difference = Accounting Carrying Value - Tax Base
Deferred Tax Liability (or Asset) = Temporary Difference × Tax Rate

**Total Cost of Ownership**
Total Cash Paid = Service Fees + Transfer Price
Asset Recognised = Transfer Price only
Expense Portion = Service Fees (not capitalised)
Asset Efficiency = Transfer Price / Total Cash Paid

### Variant-Specific Calculations

**4A Fixed Transfer Price**
Transfer Price = Agreed Fixed Amount (no calculation)

**4B Formula-Based Transfer Price**

*Cost-Plus Formula:*
Transfer Price = Developer's Total Capitalised Costs × (1 + Margin %)

*Revenue Multiple:*
Transfer Price = Annual Service Revenue × Multiple

*EBITDA Multiple:*
Transfer Price = Annual EBITDA × Multiple

**4C Fair Market Value**
Transfer Price = Valuation Result (input from external valuation)

**4D BOT with Purchase Option**
Expected Transfer Price = Exercise Price × Probability of Exercise
Option Value = Calculated using Black-Scholes or similar (if premium valued)

**4E Build-Operate-Own**
Transfer Price = N/A (no transfer)
Total Buyer Cost = Sum of Service Fees over contract term
Transfer Pricing Assessment = Not applicable (no ownership transfer occurs; service fee arm's length analysis only)

**4F Build-Transfer-Operate**
Developer Revenue = Immediate Transfer Price + Sum of Service Fees (post-transfer)
Buyer Asset = Transfer Price (recognised immediately)
Buyer Service Expense = Monthly Service Fee × Service Term

**4G Build-Lease-Transfer**

*Lease Classification Test (Buyer):*
Present Value of Lease Payments = Sum of (Payment / (1 + Discount Rate)^n)
If PV ≥ Substantially all of Fair Value: Finance Lease

*Finance Lease Accounting (Buyer):*
Right-of-Use Asset = Present Value of Lease Payments
Lease Liability = Same amount
Interest Expense = Lease Liability × Interest Rate

*At Transfer:*
Additional Asset = Transfer Price (if any)
Total Intangible = Right-of-Use Asset + Transfer Price

**4H Phased Transfer**

*Per Module:*
Module Asset Value = Module Transfer Price
Module Recognition Date = Module Transfer Date

*Cumulative:*
Total Asset = Sum of Module Transfer Prices
Weighted Average Recognition Date = (Module Value × Date) / Total Value

### Combined Calculations

**Combined Asset Efficiency**
Total Cash Exchanged = All payments from Buyer to Developer
Final Asset Value = Buyer's intangible asset at end
Combined Efficiency = Final Asset Value / Total Cash Exchanged

**Intercompany Profit Elimination**
Service Profit = Developer's operating profit during operation period
Transfer Gain = Developer's gain on transfer
Total Elimination = Service Profit + Transfer Gain

**Combined Effective Tax Rate**
Combined Tax = Developer's total tax + Buyer's tax (on amortisation benefit)
Combined Effective Rate = Combined Tax / Total Project Value

**Time Value Analysis**
Years to Asset Recognition = Operation Period Duration (for variants with delayed transfer)
Deferral Cost = Buyer's cost of capital × Service Fees × Average Deferral Period
NPV Comparison = NPV(immediate purchase) vs NPV(BOT structure)

**Transfer Pricing Risk Score**

Risk factors assessed:
1. Service fee vs market rate: Within range (Low), Near boundary (Medium), Outside range (High)
2. Transfer price vs fair value: Within range (Low), Near boundary (Medium), Outside range (High)
3. Documentation: Complete (reduces risk), Incomplete (increases risk)
4. Business rationale: Clear (reduces risk), Unclear (increases risk)

Score = Weighted combination producing Low / Medium / High rating

**Note on BOO (4E):** Since Build-Operate-Own has no ownership transfer, the full transfer pricing assessment is not applicable. Only the service fee arm's length analysis is relevant for this variant. The tool will display a simplified assessment showing that no transfer pricing review is required, while still noting the importance of arm's length service fee pricing.

---

## Stage 2: Range Selections (Future Enhancement)

### Purpose
Allow users to input ranges rather than single values to see sensitivity and identify break-even points.

### Inputs Converted to Ranges
- Operation period duration: Short / Base / Long
- Service fee level: Low / Market / High
- Transfer price: Low / Base / High
- Operating costs: -10% / Base / +20%
- Useful life: Short / Medium / Long
- Option exercise probability (4D): Pessimistic / Expected / Optimistic

### Additional Calculations
- Best case / Base case / Worst case scenarios for all metrics
- Break-even service fee (where Developer achieves target return)
- Break-even transfer price
- Sensitivity analysis: Which input has largest impact on outcome

### Additional Graphs
- Tornado chart showing sensitivity of combined outcome to each input
- Range bars on all comparison charts showing min/max outcomes
- Probability distribution of transfer price (4C and 4D variants)
- Break-even analysis chart

---

## Stage 3: Growth Projections (Future Enhancement)

### Purpose
Model multi-year scenarios including post-transfer value creation and ongoing relationships.

### Additional Inputs
- Expected revenue generated by software (Buyer side, post-transfer)
- Ongoing enhancement costs per year (post-transfer)
- Inflation rate for service fees during operation
- Discount rate for NPV calculations
- Buyer's alternative: direct development cost estimate

### Additional Calculations
- NPV of project for Developer
- NPV of project for Buyer
- IRR for each party
- Payback period for Buyer's total investment
- Value creation: Asset value vs total cost paid
- Break-even revenue for Buyer (post-transfer)

### Additional Graphs
- NPV comparison across variants
- Cash flow waterfall over full project life
- Buyer ROI trajectory post-transfer
- Comparative analysis: BOT vs direct development

---

## Decision Support Output

### Variant Recommendation Matrix

The tool produces a summary showing which variant scores best on each criterion:

| Criterion | Best Variant | Rationale |
|-----------|--------------|-----------|
| Buyer asset timing (earliest) | 4F (BTO) | Transfer happens immediately after build |
| Developer cash flow stability | 4A or 4G | Fixed price or lease payments known upfront |
| Transfer pricing defensibility | 4C (FMV) | Independent valuation most arm's length |
| Buyer budget certainty | 4A | Fixed transfer price known from start |
| Developer exit flexibility | 4D | Option gives Buyer choice, Developer keeps asset if no exercise |
| Combined asset maximisation | 4F (BTO) | Buyer capitalises early, Developer earns service fees |
| Buyer capital deferral | 4E (BOO) or 4G | No large transfer payment, or spread via lease |
| Phased implementation | 4H | Modular approach, progressive asset recognition |

### Scenario Guidance

**Choose 4A (Fixed Transfer Price) when:**
- Both parties want certainty
- Transfer price can be fairly estimated upfront
- Market conditions stable
- Developer confident in delivery and value

**Choose 4B (Formula-Based Price) when:**
- Uncertainty about fair value at transfer
- Want price to reflect actual performance
- Cost recovery plus return acceptable to Developer
- Buyer willing to accept variability

**Choose 4C (Fair Market Value) when:**
- Transfer pricing defensibility is paramount
- Parties cannot agree on fixed price
- Material transaction value justifies valuation cost
- Tax authority scrutiny expected

**Choose 4D (BOT with Purchase Option) when:**
- Buyer uncertain about long-term needs
- Developer willing to accept option risk for premium
- Flexibility valued by both parties
- Option accounting complexity acceptable

**Choose 4E (Build-Operate-Own) when:**
- Developer wants recurring revenue model
- Buyer prefers OPEX treatment
- No strategic need for Buyer to own IP
- Similar to standard SaaS relationship

**Choose 4F (Build-Transfer-Operate) when:**
- Buyer wants asset on balance sheet quickly
- Developer capability for ongoing support
- Buyer lacks operational expertise
- Asset recognition priority over cash flow timing

**Choose 4G (Build-Lease-Transfer) when:**
- Financing element desired
- Buyer wants to spread payments
- IFRS 16 right-of-use asset acceptable
- Lease accounting complexity manageable

**Choose 4H (Phased Transfer) when:**
- Modular development approach
- Buyer can use modules independently
- Developer wants staged exit
- Reduces concentration of transfer pricing risk

---

## Data Validation Rules

- Operation period minimum 6 months, maximum 10 years
- Transfer price must be non-negative
- Service fees must be non-negative
- Option exercise probability must be 0-100%
- Useful life minimum 1 year, maximum 20 years
- Tax rates must be 0-100%
- Lease interest rate must be 0-50%
- Module percentages must sum to 100% (4H)
- Transfer date must be after development completion
- All module transfer dates must be after development completion

---

## Notes for Implementation

- All monetary values in ZAR
- Dates in YYYY-MM-DD format
- Percentages stored as decimals (10% = 0.10)
- Default view: Combined perspective
- Allow toggle between perspectives: Developer / Buyer / Combined
- Allow toggle between phases: During Operation / At Transfer / Post-Transfer
- Export capability for all calculated metrics
- Save/load scenario capability for comparison
- Warning flags for control assessment issues (accounting risk)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-07 | — | Initial concept document |

---

## References

- IAS 38 Intangible Assets
- IFRS 15 Revenue from Contracts with Customers
- IFRS 16 Leases
- GRAP 31 Intangible Assets
- South African Income Tax Act Section 11(e)
- South African Eighth Schedule (CGT)
- SARS Transfer Pricing Practice Note
