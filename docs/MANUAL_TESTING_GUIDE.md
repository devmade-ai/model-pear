# Manual Testing Guide
# Software Transaction Structuring Tool

> **Purpose**: Step-by-step manual testing guide for QA and development validation
> **Last Updated**: January 2026
> **Estimated Time**: 2-3 hours for complete testing

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Sanity Check (10 minutes)](#quick-sanity-check)
3. [Mode 1: Pricing Calculator](#mode-1-pricing-calculator)
4. [Mode 2: Transaction Structuring Tool](#mode-2-transaction-structuring-tool)
5. [Options Overview Testing](#options-overview-testing)
6. [Structure Selector (Wizard) Testing](#structure-selector-wizard-testing)
7. [Model-by-Model Testing](#model-by-model-testing)
8. [Perspective Toggle Testing](#perspective-toggle-testing)
9. [Compare Mode Testing](#compare-mode-testing)
10. [Sensitivity Analysis Testing](#sensitivity-analysis-testing)
11. [Growth Projections Testing](#growth-projections-testing)
12. [Compliance Analyzer Testing](#compliance-analyzer-testing)
13. [Export/Import Testing](#exportimport-testing)
14. [Edge Cases & Error Handling](#edge-cases--error-handling)
15. [Cross-Browser Testing](#cross-browser-testing)

---

## Prerequisites

### Environment Setup
- [ ] Modern browser (Chrome recommended, Firefox, Safari, or Edge)
- [ ] JavaScript enabled
- [ ] Clear localStorage before testing: `localStorage.clear()` in console
- [ ] Console open (F12) to monitor for errors

### Test Data Reference

**Standard Test Values (South African Rands)**:
| Input | Value | Notes |
|-------|-------|-------|
| Development Cost | R 800,000 | Typical small project |
| Margin (Cost-Plus) | 10% | Middle of benchmark (5-15%) |
| Royalty Rate | 15% | Middle of benchmark (5-25%) |
| Buyer Revenue | R 2,000,000 | Used for royalty calculations |
| Discount Rate | 12% | SA typical |
| Useful Life | 5 years | Software standard |
| Corporate Tax | 27% | SA current rate |

---

## Quick Sanity Check

**Time**: ~10 minutes

This quick test verifies the app loads and core features work.

### Steps

1. **Load the application**
   - [ ] Open `index.html` in browser
   - [ ] Verify no console errors on load
   - [ ] Verify header shows "Software Transaction Structuring Tool"

2. **Check Mode 1 (Pricing Calculator)**
   - [ ] Click "Pricing Calculator" tab/mode
   - [ ] Select "Subscription (SaaS)" model
   - [ ] Enter any values and click Calculate
   - [ ] Verify results display without errors
   - [ ] Verify chart renders

3. **Check Mode 2 (Transaction Structuring)**
   - [ ] Click "Transaction Structuring" tab/mode
   - [ ] Verify Options Overview displays with 6 model cards
   - [ ] Click "Select Model" on any card
   - [ ] Enter R 800,000 for development cost
   - [ ] Click Calculate
   - [ ] Verify results show for both Developer and Buyer perspectives

4. **Quick Save/Load Test**
   - [ ] Click "Save as Option"
   - [ ] Enter name "Test Option 1"
   - [ ] Click Save
   - [ ] Verify success message appears
   - [ ] Click "View Saved"
   - [ ] Verify option appears in list

**Expected Result**: All checks pass, no console errors.

---

## Mode 1: Pricing Calculator

### Test Case 1.1: Subscription Model

**Scenario**: Calculate equilibrium price for a SaaS product

**Steps**:
1. Select Mode 1: Pricing Calculator
2. Choose "Subscription (SaaS)" model
3. Enter inputs:
   - Monthly Price: R 500
   - Number of Customers: 100
   - Churn Rate: 5%
   - Acquisition Cost: R 2,000
4. Click Calculate

**Expected Results**:
- [ ] Monthly Recurring Revenue (MRR) displays
- [ ] Annual Recurring Revenue (ARR) displays
- [ ] Customer Lifetime Value (LTV) calculated
- [ ] LTV/CAC ratio shown
- [ ] Equilibrium chart renders

### Test Case 1.2: Usage-Based Model

**Steps**:
1. Select "Usage-Based" model
2. Enter inputs:
   - Price per Unit: R 0.50
   - Expected Monthly Usage: 10,000 units
   - Variable Cost per Unit: R 0.10
3. Click Calculate

**Expected Results**:
- [ ] Revenue per user calculated
- [ ] Contribution margin displayed
- [ ] Break-even units shown

### Test Case 1.3: Per-Seat Model

**Steps**:
1. Select "Per-Seat" model
2. Enter inputs:
   - Price per Seat: R 200/month
   - Average Seats per Customer: 10
   - Cost per Seat: R 50
3. Click Calculate

**Expected Results**:
- [ ] Revenue per customer shown
- [ ] Margin per seat calculated
- [ ] Scaling projection displayed

### Test Case 1.4: One-Time Purchase Model

**Steps**:
1. Select "One-Time Purchase" model
2. Enter inputs:
   - License Price: R 50,000
   - Annual Maintenance: R 10,000 (20%)
   - Development Cost: R 200,000
3. Click Calculate

**Expected Results**:
- [ ] Break-even customers calculated
- [ ] Recurring revenue from maintenance shown
- [ ] Payback period displayed

### Test Case 1.5: Marketplace Model

**Steps**:
1. Select "Marketplace" model
2. Enter inputs:
   - Commission Rate: 15%
   - Average Transaction: R 1,000
   - Monthly Transactions: 500
3. Click Calculate

**Expected Results**:
- [ ] Gross Merchandise Value (GMV) shown
- [ ] Take rate revenue calculated
- [ ] Transaction economics displayed

---

## Mode 2: Transaction Structuring Tool

This is the primary focus of testing - the 6 transaction models with 47 variants.

---

## Options Overview Testing

### Test Case 2.1: Default Landing View

**Steps**:
1. Switch to Mode 2: Transaction Structuring
2. Clear localStorage and refresh

**Expected Results**:
- [ ] Options Overview is the default view
- [ ] All 6 model cards are visible
- [ ] Each card shows: icon, name, description, key features, "Best for" tags
- [ ] Quick comparison table visible below cards
- [ ] "Use the guided wizard" link is visible

### Test Case 2.2: Model Card Interaction

**Steps**:
1. Hover over Model 1 card
2. Click "Select Model →" button

**Expected Results**:
- [ ] Card has hover effect
- [ ] Calculator view opens
- [ ] Model 1 (Development Services) is pre-selected
- [ ] Variant dropdown shows options 1A-1F

### Test Case 2.3: View Mode Toggle

**Steps**:
1. Find view mode toggle (Overview/Wizard/Direct)
2. Click "Wizard"
3. Click "Direct"
4. Click "Overview"

**Expected Results**:
- [ ] Each view mode displays correctly
- [ ] View mode persists on page refresh
- [ ] Smooth transition between views

### Test Case 2.4: Quick Comparison Table

**Steps**:
1. Scroll to quick comparison table in Options Overview
2. Review all columns

**Expected Results**:
- [ ] Table shows: Model, IP Owner, Payment, Asset?, Risk
- [ ] All 6 models listed
- [ ] Information matches model descriptions

---

## Structure Selector (Wizard) Testing

### Test Case 3.1: Complete Wizard Flow

**Scenario**: User wants IP with developer, recurring payments, low risk

**Steps**:
1. Click "Use the guided wizard" or switch to Wizard view
2. Answer questions:
   - Q1 (IP Ownership): "Developer retains IP"
   - Q2 (Cash Flow): "Recurring payments"
   - Q3 (Risk): "Low risk to developer"
   - Q4 (Asset Recognition): "Developer balance sheet"
   - Q5 (Mutual Ownership): "No - independent parties"
   - Q6 (Development Stage): "Existing software"
3. Click "Get Recommendations"

**Expected Results**:
- [ ] Progress indicator shows completion
- [ ] Recommendations display ranked by score
- [ ] Model 2 (Licence) or Model 6 (SaaS) ranked highest
- [ ] Rationale explains why each model fits
- [ ] "Use this model" buttons work

### Test Case 3.2: Wizard - Different Path

**Scenario**: User wants IP with buyer, upfront payment, high asset recognition

**Steps**:
1. Start wizard fresh
2. Answer questions:
   - Q1: "Buyer owns IP"
   - Q2: "Upfront payment"
   - Q3: "Risk transferred to buyer"
   - Q4: "Buyer balance sheet"
   - Q5: "No - independent parties"
   - Q6: "New development"
3. Click "Get Recommendations"

**Expected Results**:
- [ ] Model 1 (Development Services) or Model 5 (Software Sale) ranked highest
- [ ] Recommendations match the stated preferences
- [ ] Clicking "Use this model" populates calculator

### Test Case 3.3: Wizard Navigation

**Steps**:
1. Start wizard
2. Answer Q1 and Q2
3. Click "Back" button
4. Change Q1 answer
5. Continue forward

**Expected Results**:
- [ ] Back navigation works
- [ ] Changing answers updates recommendations
- [ ] Can restart wizard at any time

---

## Model-by-Model Testing

### Test Case 4.1: Model 1 - Development Services (Cost-Plus)

**Scenario**: Software company develops custom software for client

**Steps**:
1. Select Model 1
2. Select Variant 1B (Cost-Plus Fixed Margin)
3. Enter inputs:
   - Development Cost: R 800,000
   - Margin: 10%
4. Click Calculate

**Expected Results**:
- [ ] **Developer Revenue**: R 880,000 (800,000 × 1.10)
- [ ] **Developer Profit**: R 80,000
- [ ] **Developer Tax** (27%): R 21,600
- [ ] **Buyer Asset Value**: R 880,000 (capitalised)
- [ ] **Buyer Section 11(e)**: R 440,000/year (2-year write-off)
- [ ] Accounting treatment shows IFRS 15 for Developer
- [ ] Accounting treatment shows IAS 38 for Buyer

### Test Case 4.2: Model 1 - Different Variants

**Test each variant with R 500,000 cost**:

| Variant | Specific Input | Expected Behaviour |
|---------|----------------|-------------------|
| 1A (Pure Cost) | Margin: 0% | Revenue = Cost exactly |
| 1B (Cost-Plus) | Margin: 10% | Standard markup |
| 1C (With Bonus) | Bonus: R 50,000 | Base + bonus total |
| 1D (Fixed Price) | Fixed: R 600,000 | Predetermined revenue |
| 1E (T&M) | Hours: 1000, Rate: R 500 | Hours × rate |
| 1F (Dedicated Team) | Monthly: R 100,000 | Monthly × 12 |

### Test Case 4.3: Model 2 - Software Licence

**Scenario**: Developer licenses existing software to client

**Steps**:
1. Select Model 2
2. Select Variant 2C (Usage-Based Royalties)
3. Enter inputs:
   - Royalty Rate: 15%
   - Buyer Expected Revenue: R 2,000,000
   - Upfront Fee: R 100,000 (if applicable)
4. Click Calculate

**Expected Results**:
- [ ] **Annual Royalty**: R 300,000 (2,000,000 × 15%)
- [ ] **Developer Income**: R 300,000 + upfront fee
- [ ] **Buyer Royalty Expense**: R 300,000
- [ ] Developer retains IP (indicated in results)
- [ ] Transfer pricing benchmark shown (5-25%)

### Test Case 4.4: Model 3 - Joint Development

**Scenario**: Two parties share development costs and ownership

**Steps**:
1. Select Model 3
2. Select Variant 3B (Contribution-Based)
3. Enter inputs:
   - Developer Contribution: R 600,000
   - Buyer Contribution: R 400,000
4. Click Calculate

**Expected Results**:
- [ ] **Total Contribution**: R 1,000,000
- [ ] **Developer Ownership**: 60%
- [ ] **Buyer Ownership**: 40%
- [ ] **Developer Asset**: R 600,000
- [ ] **Buyer Asset**: R 400,000
- [ ] Joint IP ownership indicated
- [ ] Profit split method referenced

### Test Case 4.5: Model 4 - Build-Operate-Transfer

**Scenario**: Developer builds, operates for 3 years, then transfers

**Steps**:
1. Select Model 4
2. Select Variant 4A (Fixed Transfer Price)
3. Enter inputs:
   - Development Cost: R 1,000,000
   - Operation Period: 3 years
   - Annual Service Fee: R 200,000
   - Transfer Price: R 800,000
4. Click Calculate

**Expected Results**:
- [ ] **Service Revenue (total)**: R 600,000 (3 × 200,000)
- [ ] **Transfer Revenue**: R 800,000
- [ ] **CGT on transfer**: Calculated if gain exists
- [ ] **Buyer Total Cost**: R 1,400,000 (600k + 800k)
- [ ] Timeline shows operation then transfer phases

### Test Case 4.6: Model 5 - Software Sale

**Scenario**: Outright sale of developed software

**Steps**:
1. Select Model 5
2. Select Variant 5A (Clean Sale)
3. Enter inputs:
   - Sale Price: R 1,500,000
   - Development Cost (cost base): R 800,000
4. Click Calculate

**Expected Results**:
- [ ] **Capital Gain**: R 700,000 (1,500,000 - 800,000)
- [ ] **CGT Inclusion** (80%): R 560,000
- [ ] **CGT Payable** (27%): R 151,200
- [ ] **Net Proceeds**: R 1,348,800
- [ ] **Buyer Asset**: R 1,500,000
- [ ] Full IP ownership transferred indicated

### Test Case 4.7: Model 6 - SaaS/Subscription

**Scenario**: Ongoing software-as-a-service

**Steps**:
1. Select Model 6
2. Select Variant 6A (Pure SaaS Multi-Tenant)
3. Enter inputs:
   - Monthly Subscription: R 50,000
   - Operating Costs: R 30,000/month
4. Click Calculate

**Expected Results**:
- [ ] **Annual Revenue**: R 600,000
- [ ] **Annual Costs**: R 360,000
- [ ] **Annual Profit**: R 240,000
- [ ] **Buyer Expense**: R 600,000 (no capitalisation)
- [ ] Developer retains all IP indicated
- [ ] Buyer shows no asset (operational expense)

---

## Perspective Toggle Testing

### Test Case 5.1: Developer vs Buyer Perspective

**Steps**:
1. Calculate Model 1 with R 800,000 cost, 10% margin
2. Switch to "Developer" perspective tab
3. Review results
4. Switch to "Buyer" perspective tab
5. Review results

**Expected Results - Developer View**:
- [ ] Revenue: R 880,000
- [ ] Costs: R 800,000
- [ ] Profit: R 80,000
- [ ] Tax: R 21,600
- [ ] Net: R 58,400

**Expected Results - Buyer View**:
- [ ] Cost Paid: R 880,000
- [ ] Asset Capitalised: R 880,000
- [ ] Annual Amortisation: Based on useful life
- [ ] Section 11(e) Deduction: R 440,000/year
- [ ] Deferred Tax calculation shown

### Test Case 5.2: Shareholder Perspective (Related Parties)

**Steps**:
1. Enable "Mutual Ownership" / "Related Parties" checkbox
2. Calculate Model 1 with same inputs
3. Switch to "Shareholder" or "Combined" perspective tab

**Expected Results**:
- [ ] Shareholder/Combined perspective tab now visible
- [ ] Combined profit shown
- [ ] Net cash flow to shareholder calculated
- [ ] Transfer pricing risk indicator appears
- [ ] Message about owning both entities displayed

### Test Case 5.3: Perspective Consistency

**Steps**:
1. Save an option from Developer perspective
2. Save another option from Buyer perspective
3. Compare them

**Expected Results**:
- [ ] Each saved option retains its perspective
- [ ] Comparison shows which perspective each option uses
- [ ] Warning if comparing different perspectives

---

## Compare Mode Testing

### Test Case 6.1: Save Single Option

**Steps**:
1. Calculate Model 1 with R 800,000, 10% margin
2. Click "Save as Option"
3. Enter name: "Model 1 - 10% margin"
4. Add note: "Standard scenario"
5. Click Save

**Expected Results**:
- [ ] Success message appears
- [ ] Option appears in saved list
- [ ] Name and note are saved correctly
- [ ] Timestamp recorded

### Test Case 6.2: Save Multiple Options

**Steps**:
1. Save 3-4 different calculations:
   - Option A: Model 1, 10% margin
   - Option B: Model 1, 15% margin
   - Option C: Model 2, 15% royalty
   - Option D: Model 5, R 1M sale
2. Click "View Saved"

**Expected Results**:
- [ ] All options listed
- [ ] Each shows key metrics (Developer Revenue, Profit, Buyer Cost)
- [ ] Timestamps are correct
- [ ] Can scroll if many options

### Test Case 6.3: Load Saved Option

**Steps**:
1. Open View Saved panel
2. Click "Load" on Option A

**Expected Results**:
- [ ] Calculator inputs are populated
- [ ] Model and variant are selected
- [ ] Results display immediately
- [ ] Entity settings match saved values

### Test Case 6.4: Compare 2 Options

**Steps**:
1. Check checkbox for Option A
2. Check checkbox for Option B
3. Click "Compare Selected"

**Expected Results**:
- [ ] Side-by-side comparison view opens
- [ ] Two columns show Option A and Option B
- [ ] Difference column shows +/- with arrows
- [ ] Best values highlighted in green
- [ ] Worst values highlighted in red

### Test Case 6.5: Compare 4 Options

**Steps**:
1. Select 4 different options
2. Click "Compare Selected"

**Expected Results**:
- [ ] All 4 options shown in columns
- [ ] Difference column compares to first option
- [ ] Table scrolls horizontally if needed
- [ ] All metrics visible for each option

### Test Case 6.6: Delete Option

**Steps**:
1. Open View Saved panel
2. Click "Delete" on one option
3. Confirm deletion

**Expected Results**:
- [ ] Confirmation dialog appears
- [ ] Option is removed from list
- [ ] Other options remain intact
- [ ] Count updates correctly

### Test Case 6.7: Rename Option

**Steps**:
1. Click "Rename" on an option
2. Enter new name: "Updated Name"
3. Save

**Expected Results**:
- [ ] Name is updated
- [ ] Timestamp unchanged
- [ ] Note preserved
- [ ] Appears in list with new name

### Test Case 6.8: Edit Notes

**Steps**:
1. Click "Edit Notes" on an option
2. Add/modify note text
3. Save

**Expected Results**:
- [ ] Note is updated
- [ ] Other fields unchanged
- [ ] Note visible when viewing option

### Test Case 6.9: Comparison Limit

**Steps**:
1. Try to compare more than 4 options

**Expected Results**:
- [ ] Warning or limit enforced
- [ ] Maximum 4 options can be compared
- [ ] Clear message to user

### Test Case 6.10: Storage Limit

**Steps**:
1. Try to save more than 20 options

**Expected Results**:
- [ ] Warning message appears
- [ ] Oldest option can be deleted to make room
- [ ] Clear guidance to user

---

## Sensitivity Analysis Testing

### Test Case 7.1: Range Input Mode

**Steps**:
1. Calculate a base scenario
2. Click "Sensitivity" or "What-If" tab
3. Enable range inputs
4. Enter for Development Cost:
   - Low: R 600,000
   - Base: R 800,000
   - High: R 1,000,000
5. Run sensitivity analysis

**Expected Results**:
- [ ] Three scenarios calculated (Best/Base/Worst)
- [ ] Results table shows range of outcomes
- [ ] Best case shows highest profit
- [ ] Worst case shows lowest profit

### Test Case 7.2: Tornado Chart

**Steps**:
1. Set ranges for multiple inputs:
   - Development Cost: ±25%
   - Margin: ±5%
   - Tax Rate: ±2%
2. Generate Tornado Chart

**Expected Results**:
- [ ] Chart renders correctly
- [ ] Inputs ranked by impact (longest bar = most impact)
- [ ] Development cost likely highest impact
- [ ] Clear labels and values

### Test Case 7.3: Break-Even Analysis

**Steps**:
1. Enable break-even analysis
2. Review break-even points

**Expected Results**:
- [ ] Break-even margin shown (what margin makes profit = 0)
- [ ] Break-even revenue shown
- [ ] Clear indication of current vs break-even

### Test Case 7.4: Monte Carlo Simulation (if available)

**Steps**:
1. Enable Monte Carlo option
2. Set number of iterations: 1000
3. Run simulation

**Expected Results**:
- [ ] Progress indicator during calculation
- [ ] Distribution chart displayed
- [ ] Mean, median, percentiles shown
- [ ] Confidence intervals displayed

---

## Growth Projections Testing

### Test Case 8.1: Multi-Year NPV Calculation

**Steps**:
1. Calculate base scenario
2. Click "Projections" or "Growth" tab
3. Enter projection inputs:
   - Buyer Expected Revenue (Year 1): R 2,000,000
   - Revenue Growth Rate: 10%
   - Discount Rate: 12%
   - Projection Period: 5 years
4. Calculate projections

**Expected Results**:
- [ ] NPV calculated for Developer
- [ ] NPV calculated for Buyer
- [ ] Combined NPV shown (if related parties)
- [ ] Year-by-year cash flow table displayed

### Test Case 8.2: IRR Calculation

**Steps**:
1. Using same projection inputs
2. Review IRR output

**Expected Results**:
- [ ] IRR percentage displayed
- [ ] IRR compared to discount rate
- [ ] Indication if investment is worthwhile (IRR > discount rate)

### Test Case 8.3: Payback Period

**Steps**:
1. Review payback period outputs

**Expected Results**:
- [ ] Simple payback period shown (years)
- [ ] Discounted payback period shown
- [ ] Clear if payback occurs within projection period

### Test Case 8.4: Different Projection Periods

**Test each period**:
- [ ] 3 years - calculations complete
- [ ] 5 years - calculations complete
- [ ] 7 years - calculations complete
- [ ] 10 years - calculations complete

### Test Case 8.5: Cash Flow Projection Chart

**Steps**:
1. View cash flow chart

**Expected Results**:
- [ ] Chart renders with years on X-axis
- [ ] Cumulative cash flow line visible
- [ ] Break-even point marked (if applicable)
- [ ] Legend shows parties

---

## Compliance Analyzer Testing

### Test Case 9.1: Transfer Pricing Risk Score

**Steps**:
1. Enable "Related Parties"
2. Calculate Model 1 with 10% margin
3. Click "Compliance" tab

**Expected Results**:
- [ ] TP Risk Score displayed (0-100)
- [ ] Score breakdown by factor:
  - Margin Compliance (30%)
  - Documentation (25%)
  - Substance (20%)
  - Comparability (15%)
  - Consistency (10%)
- [ ] Risk level indicator (Low/Medium/High)

### Test Case 9.2: Benchmark Comparison

**Steps**:
1. Review benchmark comparison section

**Expected Results**:
- [ ] Shows arm's length range for transaction type
- [ ] Current margin/rate highlighted
- [ ] Indication if within benchmark (✓) or outside (⚠)

### Test Case 9.3: Accounting Treatment Summary

**Steps**:
1. Review accounting treatment section

**Expected Results**:
- [ ] Developer treatment: IFRS standard referenced
- [ ] Buyer treatment: IAS standard referenced
- [ ] Journal entry templates provided
- [ ] Deferred tax explanation included

### Test Case 9.4: Compliance Checklists

**Steps**:
1. Expand compliance checklists

**Expected Results**:
- [ ] Written Agreement checklist displayed
- [ ] TP Documentation checklist displayed
- [ ] Items are interactive (checkable)
- [ ] Progress indicator shows completion

### Test Case 9.5: Out-of-Benchmark Warning

**Steps**:
1. Calculate Model 1 with 25% margin (above 5-15% benchmark)
2. View Compliance tab

**Expected Results**:
- [ ] Warning indicator displayed
- [ ] Message about margin being above benchmark
- [ ] TP Risk Score increases
- [ ] Recommendation to document justification

---

## Export/Import Testing

### Test Case 10.1: Export to JSON

**Steps**:
1. Save 2-3 options
2. Click "Export JSON" in comparison manager

**Expected Results**:
- [ ] JSON file downloads
- [ ] File contains all saved options
- [ ] File includes version information
- [ ] Data is valid JSON (verify in text editor)

### Test Case 10.2: Export to CSV

**Steps**:
1. Open comparison view with 2+ options
2. Click "Export CSV"

**Expected Results**:
- [ ] CSV file downloads
- [ ] Opens correctly in Excel/Sheets
- [ ] Columns match comparison metrics
- [ ] Each option is a column

### Test Case 10.3: Print/PDF Export

**Steps**:
1. Open comparison view
2. Click "Print / PDF"
3. Select "Save as PDF" in print dialog

**Expected Results**:
- [ ] Print dialog opens
- [ ] Page is formatted for printing
- [ ] Headers and footers appropriate
- [ ] Tables fit on page

### Test Case 10.4: Import JSON

**Steps**:
1. Clear all saved options
2. Click "Import"
3. Select previously exported JSON file

**Expected Results**:
- [ ] Import dialog appears
- [ ] Options to merge or replace
- [ ] Options imported successfully
- [ ] All data intact

### Test Case 10.5: Import Invalid File

**Steps**:
1. Try to import non-JSON file
2. Try to import JSON with wrong structure

**Expected Results**:
- [ ] Error message displayed
- [ ] Existing options not affected
- [ ] Clear guidance on correct format

---

## Edge Cases & Error Handling

### Test Case 11.1: Zero Values

**Steps**:
1. Enter 0 for Development Cost
2. Click Calculate

**Expected Results**:
- [ ] Validation error or meaningful result
- [ ] No NaN or Infinity values
- [ ] Clear message if input invalid

### Test Case 11.2: Very Large Values

**Steps**:
1. Enter R 999,999,999,999 for cost
2. Click Calculate

**Expected Results**:
- [ ] Calculations complete or validation triggers
- [ ] Numbers formatted correctly (thousands separators)
- [ ] No overflow errors

### Test Case 11.3: Negative Values

**Steps**:
1. Try entering negative values for:
   - Development Cost
   - Margin percentage
   - Revenue

**Expected Results**:
- [ ] Validation prevents or handles negatives
- [ ] Clear error message
- [ ] Form guides to correct input

### Test Case 11.4: 100% Margin (Division Issues)

**Steps**:
1. Select Model 1
2. Enter 100% margin

**Expected Results**:
- [ ] No division by zero error
- [ ] Calculation handles edge case
- [ ] Warning about extreme margin

### Test Case 11.5: Empty Required Fields

**Steps**:
1. Leave required fields empty
2. Click Calculate

**Expected Results**:
- [ ] Validation prevents calculation
- [ ] Required fields highlighted
- [ ] Clear message about missing inputs

### Test Case 11.6: Special Characters in Names

**Steps**:
1. Save option with name: `Test <script>alert('x')</script>`
2. Save option with name containing emojis: `Test 🚀 Option`

**Expected Results**:
- [ ] HTML is escaped (no XSS)
- [ ] Names display correctly
- [ ] No console errors

### Test Case 11.7: localStorage Corruption

**Steps**:
1. In console, corrupt localStorage: `localStorage.setItem('savedOptions', 'invalid json')`
2. Refresh page

**Expected Results**:
- [ ] App handles gracefully
- [ ] Error message or automatic recovery
- [ ] App still functional

### Test Case 11.8: Network Offline (CDN Dependencies)

**Steps**:
1. Disconnect network
2. Refresh page

**Expected Results**:
- [ ] Document loads
- [ ] Clear indication if CDN resources failed
- [ ] Core functionality may be limited (charts may not render)

---

## Cross-Browser Testing

### Browsers to Test

| Browser | Priority | Notes |
|---------|----------|-------|
| Chrome (latest) | High | Primary target |
| Firefox (latest) | High | ES6 modules support |
| Safari (latest) | Medium | macOS/iOS users |
| Edge (latest) | Medium | Windows default |

### Test Checklist per Browser

For each browser, verify:

- [ ] Page loads without errors
- [ ] Mode switching works
- [ ] Calculations produce correct results
- [ ] Charts render properly
- [ ] Save/Load options work
- [ ] Export downloads correctly
- [ ] Print preview displays
- [ ] Responsive layout (resize window)

### Mobile/Tablet Testing

**Steps**:
1. Open in mobile browser or use DevTools responsive mode
2. Test common screen sizes:
   - iPhone SE (375×667)
   - iPhone 12 (390×844)
   - iPad (768×1024)

**Expected Results**:
- [ ] Layout adapts to screen size
- [ ] Inputs are usable on touch
- [ ] Tables scroll horizontally if needed
- [ ] No horizontal overflow on page
- [ ] Buttons/links have adequate tap targets

---

## Test Completion Checklist

### Core Functionality

- [ ] Mode 1 (Pricing Calculator) - All 5 models
- [ ] Mode 2 (Transaction Structuring) - All 6 models
- [ ] Options Overview displays correctly
- [ ] Structure Selector wizard works
- [ ] All 47 variants accessible

### Perspectives & Relationships

- [ ] Developer perspective displays correctly
- [ ] Buyer perspective displays correctly
- [ ] Shareholder perspective (when enabled)
- [ ] Independent parties mode
- [ ] Related parties mode

### Compare Mode

- [ ] Save options (up to 20)
- [ ] Load saved options
- [ ] Compare 2-4 options
- [ ] Delete, rename, edit notes
- [ ] Best/worst highlighting

### Advanced Features

- [ ] Sensitivity analysis with ranges
- [ ] Tornado chart renders
- [ ] Growth projections (3/5/7/10 years)
- [ ] NPV, IRR, Payback calculations
- [ ] Compliance analyzer and TP risk

### Export/Import

- [ ] Export JSON
- [ ] Export CSV
- [ ] Print/PDF
- [ ] Import JSON

### Quality

- [ ] No console errors during testing
- [ ] All edge cases handled
- [ ] Cross-browser compatibility
- [ ] Responsive design works

---

## Reporting Issues

When reporting issues found during testing, include:

1. **Test Case ID** (e.g., TC 4.1)
2. **Browser/Version**
3. **Steps to Reproduce**
4. **Expected Result**
5. **Actual Result**
6. **Screenshot/Console Errors**

**Issue Template**:
```
## Issue: [Brief Description]

**Test Case**: TC X.X
**Browser**: Chrome 120
**Date**: YYYY-MM-DD

### Steps to Reproduce
1. Step one
2. Step two
3. Step three

### Expected Result
What should happen

### Actual Result
What actually happened

### Console Errors
```
[paste any errors]
```

### Screenshot
[attach if applicable]
```

---

**Document Version**: 1.0
**Last Updated**: January 2026
