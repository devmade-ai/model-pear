# Pricing Equilibrium Calculator - Calculations & Rationale

This document explains all calculations performed by the Pricing Equilibrium Calculator, the formulas used, and the economic rationale behind them.

## Table of Contents

1. [Core Calculation Philosophy](#core-calculation-philosophy)
2. [Universal Formulas (All Models)](#universal-formulas-all-models)
3. [Model-Specific Calculations](#model-specific-calculations)
4. [Equilibrium Theory](#equilibrium-theory)
5. [ROI Thresholds & Assumptions](#roi-thresholds--assumptions)
6. [South African Market Calibration](#south-african-market-calibration)

---

## Core Calculation Philosophy

### Static Unit Economics

This calculator uses **static unit economics** rather than dynamic projections. The approach is:

```
Revenue = Price × Volume
Cost = Unit Cost × Volume
Profit = Revenue - Cost
```

**Why static?** Because pricing decisions should be based on fundamental unit economics, not growth assumptions. A price that doesn't work for one customer won't magically work for 100 customers.

### Three-Perspective Analysis

Every calculation is viewed through three lenses:

1. **Revenue & Profit Overview**: What are we making?
2. **Seller Perspective**: Can we sustain this?
3. **Buyer Perspective**: Is this compelling?
4. **Equilibrium Analysis**: Is there a win-win?

This ensures pricing decisions consider both sides of the transaction.

---

## Reverse Calculations (Calculate Missing Inputs)

### Overview

The calculator now supports **auto-calculating missing inputs** based on other known values. Instead of manually entering all values, you can:

1. **Calculate Optimal Price** - Find the best price based on your costs and buyer value
2. **Calculate Required Buyer Value** - Determine how much value you need to deliver
3. **Calculate Achievable Margin** - See what margin is possible with your costs
4. **Calculate Maximum Cost** - Find your cost ceiling to maintain target margins

### How It Works

Select a calculation mode from the dropdown at the top of the form. The calculator will:
- Lock the field being calculated (read-only with yellow styling)
- Show an "Auto-calculated" badge on that field
- Automatically compute the missing value based on other inputs
- Update in real-time as you change other values

### Field State Management

**When switching between calculation modes:**
- The previously calculated field is automatically unlocked and becomes editable again
- Only ONE field is ever locked at a time (the current calculation target)
- Switching to "Enter All Inputs Manually" unlocks all fields

**Example:**
1. Select "Calculate Optimal Price" → Price field locks (yellow, read-only)
2. Switch to "Calculate Margin" → Price unlocks, Margin locks
3. Switch to "Manual Entry" → All fields unlock

This ensures you always know which field is being auto-calculated and prevents confusion about field states.

### Calculation Mode Options

#### 1. Calculate Optimal Price

**What you provide:**
- Cost to serve (or equivalent for your model)
- Desired margin
- Buyer value

**What the calculator finds:**
- Seller floor (minimum viable price)
- Buyer ceiling (maximum compelling price)
- **Suggested price** based on your chosen strategy

**Pricing Strategies:**
- **Minimum Viable** (Seller Floor): Most competitive, meets your margin target
- **Balanced** (Midpoint): Recommended - fair to both parties
- **Maximum Capture** (Buyer Ceiling): Highest profit while maintaining buyer ROI

**Example:**
```
Cost: R150/month
Desired Margin: 70%
Buyer Value: R5,000/month

Results:
- Seller Floor: R500 (70% margin achieved)
- Buyer Ceiling: R2,000 (2.5x ROI maintained)
- Balanced Price: R1,250 (88% margin, 4x ROI - win-win!)
```

#### 2. Calculate Required Buyer Value

**What you provide:**
- Target price
- Cost to serve
- Desired margin

**What the calculator finds:**
- Minimum buyer value needed for compelling ROI

**Use case:** "I want to charge R1,500/month - how much value must I deliver?"

**Example:**
```
Target Price: R1,500/month

Result:
Required Buyer Value: R3,750/month (for 2.5x ROI threshold)

Action: Ensure your solution delivers at least R3,750/month value
```

#### 3. Calculate Achievable Margin

**What you provide:**
- Current market price
- Cost to serve
- Buyer value

**What the calculator finds:**
- Actual margin percentage at this price

**Use case:** "The market rate is R600 - what margin can I achieve?"

**Example:**
```
Market Price: R600/month
Cost: R150/month

Result:
Achievable Margin: 75%

Analysis: Exceeds typical 70% target - good market positioning
```

#### 4. Calculate Maximum Cost

**What you provide:**
- Target price
- Desired margin
- Buyer value

**What the calculator finds:**
- Maximum cost to serve ceiling

**Use case:** "I want R800 pricing with 70% margin - what's my cost budget?"

**Example:**
```
Target Price: R800/month
Desired Margin: 70%

Result:
Maximum Cost: R240/month

Action: Keep infrastructure + support below R240/customer
```

### Reverse Calculation Formulas

#### For Subscription, Usage-Based, and Per-Seat Models:

**Price Calculation:**
```
Seller Floor = Cost / (1 - Margin/100)
Buyer Ceiling = Value × 0.4 (for 2.5x ROI)
Balanced Price = (Floor + Ceiling) / 2
```

**Buyer Value Calculation:**
```
Required Value = Price / 0.4
```

**Margin Calculation:**
```
Achievable Margin = (1 - Cost/Price) × 100
```

**Cost Calculation:**
```
Maximum Cost = Price × (1 - Margin/100)
```

#### For One-Time Purchase Model:

**Price Calculation:**
```
Seller Floor = Delivery Cost / (1 - Margin/100)
Buyer Ceiling = Annual Value × 0.5 (for 2x ROI year 1)
Balanced Price = (Floor + Ceiling) / 2
```

**Buyer Value Calculation:**
```
Required Annual Value = License Price / 0.5
```

#### For Marketplace Model:

**Commission Rate Calculation:**
```
Min Rate = (Cost per Tx / Avg Tx Value) / (1 - Margin/100) × 100
Max Rate = (Seller Profit × 0.3) / Avg Tx Value × 100
Balanced Rate = (Min Rate + Max Rate) / 2
```

---

## Universal Formulas (All Models)

These calculations apply to all five pricing models.

### 1. Revenue Calculations

**Monthly Revenue**
```
Monthly Revenue = Price × Quantity
```

**Annual Revenue**
```
Annual Revenue = Monthly Revenue × 12
```

**Rationale**: Revenue is the top-line number. It's the starting point for all financial analysis.

---

### 2. Cost Calculations

**Monthly Cost**
```
Monthly Cost = Cost per Unit × Quantity
```

**Rationale**: We focus on **variable costs** (costs that scale with usage) because these are directly relevant to pricing decisions. Fixed costs (rent, salaries) are important for business viability but don't change the per-unit pricing floor.

---

### 3. Profit & Margin Calculations

**Monthly Profit**
```
Monthly Profit = Monthly Revenue - Monthly Cost
```

**Actual Margin Percentage**
```
Actual Margin = (Monthly Profit / Monthly Revenue) × 100
```

**Example**:
- Revenue: R50,000
- Cost: R15,000
- Profit: R35,000
- Margin: (35,000 / 50,000) × 100 = **70%**

**Rationale**: Margin is more meaningful than absolute profit because it's scale-independent. A 70% margin means for every R1 you earn, R0.70 is profit after covering variable costs.

**Annual Profit**
```
Annual Profit = Monthly Profit × 12
```

---

### 4. Seller Perspective: Minimum Viable Price

**Formula**
```
Minimum Price = Cost per Unit / (1 - Desired Margin ÷ 100)
```

**Example**:
- Cost to serve: R150/customer/month
- Desired margin: 70%
- Minimum price: R150 / (1 - 0.70) = R150 / 0.30 = **R500/month**

**Proof**:
- Revenue at R500: R500
- Cost: R150
- Profit: R350
- Margin: (R350 / R500) × 100 = **70%** ✓

**Rationale**: This formula derives the **seller's floor price** - the absolute minimum price needed to achieve your target margin. Price below this and you're eroding your business sustainability.

**Edge Case**: If desired margin ≥ 100%, minimum price = Infinity (impossible to achieve)

---

### 5. Seller Price Gap Analysis

**Price Gap**
```
Price Gap = Current Price - Minimum Price
```

**Meets Target?**
```
Meets Target = Current Price ≥ Minimum Price
```

**Example**:
- Current price: R600
- Minimum price: R500
- Gap: R600 - R500 = **R100 surplus** ✓ (meets target)

**Rationale**: This tells you whether your current pricing is sustainable. A negative gap means you're underpricing and need to either raise prices or reduce costs.

---

### 6. Buyer Perspective: ROI

**Return on Investment (ROI)**
```
ROI = Value Received / Price Paid
```

**Example**:
- Monthly value to buyer: R5,000 (cost savings)
- Price paid: R500
- ROI: 5,000 / 500 = **10x return**

**Interpretation**:
- ROI = 2.0x means buyer gets R2 of value for every R1 spent (2x return)
- ROI = 5.0x means buyer gets R5 of value for every R1 spent (5x return)
- ROI = 10.0x means buyer gets R10 of value for every R1 spent (10x return)

**Rationale**: Buyers make purchase decisions based on value received vs. price paid. Software that costs R500/month but saves R5,000/month is an easy decision (10x return). Software that costs R4,500/month for R5,000 value is marginal (1.1x return).

---

### 7. Buyer Savings & Payback

**Annual Savings**
```
Annual Savings = (Value per Period - Price per Period) × 12
```

**Example**:
- Monthly value: R5,000
- Monthly price: R500
- Annual savings: (5,000 - 500) × 12 = **R54,000/year**

**Payback Period (in months)**
```
Payback = Price / (Value - Price)
```

**Example**:
- Price: R500
- Value: R5,000
- Payback: 500 / (5,000 - 500) = 500 / 4,500 = **0.11 months** (~3 days)

**Rationale**: Payback period tells buyers "how long until this pays for itself?" Shorter is better. For subscription software, payback < 3 months is excellent, < 6 months is good, > 12 months is concerning.

**Edge Case**: If value ≤ price, payback = Infinity (never pays back)

---

### 8. Equilibrium Analysis

**Maximum Price Buyer Will Pay**

Different thresholds for different models (see [ROI Thresholds](#roi-thresholds--assumptions)):

**For Subscription, Usage-Based, Per-Seat:**
```
Max Price = Value × 0.4    (ensures 2.5x ROI minimum)
```

**For One-Time Purchase:**
```
Max Price = Annual Value × 0.5    (ensures 2x ROI in year 1)
```

**For Marketplace:**
```
Max Commission Rate = (Seller Profit × 0.3) / Transaction Value × 100
(takes max 30% of seller's profit margin)
```

**Equilibrium Exists?**
```
Equilibrium Exists = Seller Floor ≤ Buyer Ceiling
```

**Equilibrium Range**
```
Range = [Seller Minimum Price, Buyer Maximum Price]
```

**Suggested Price**
```
Suggested Price = (Seller Floor + Buyer Ceiling) / 2
```

**Example**:
- Seller floor (70% margin): R500
- Buyer ceiling (2.5x ROI): R2,000
- Equilibrium exists: R500 ≤ R2,000 ✓
- Range: R500 - R2,000
- Suggested: (500 + 2,000) / 2 = **R1,250**

**Result at R1,250**:
- Seller margin: (1,250 - 150) / 1,250 = 88% ✓
- Buyer ROI: 5,000 / 1,250 = 4x ✓
- **Win-win pricing**

**Rationale**: The equilibrium zone represents prices where both seller and buyer win. Pricing at the midpoint balances value capture vs. value delivery.

---

## Model-Specific Calculations

### 1. Subscription (SaaS)

**Pricing Structure**: Fixed price per customer per month

**Inputs**:
- `monthlyPrice`: Price charged per customer (R)
- `customers`: Number of active customers
- `costToServe`: Infrastructure + support cost per customer (R/month)
- `desiredMargin`: Target gross margin (%)
- `buyerValue`: Revenue enabled or cost saved per customer (R/month)

**Key Calculations**:

```javascript
// Revenue
monthlyRevenue = monthlyPrice × customers
annualRevenue = monthlyRevenue × 12

// Costs
monthlyCost = costToServe × customers

// Profit & Margin
monthlyProfit = monthlyRevenue - monthlyCost
actualMargin = (monthlyProfit / monthlyRevenue) × 100

// Seller minimum
minimumPrice = costToServe / (1 - desiredMargin / 100)

// Buyer ROI
buyerROI = buyerValue / monthlyPrice
buyerAnnualSavings = (buyerValue - monthlyPrice) × 12
buyerPaybackMonths = monthlyPrice / (buyerValue - monthlyPrice)

// Equilibrium
maximumPriceBuyerWillPay = buyerValue × 0.4  // 2.5x ROI threshold
equilibriumRange = [minimumPrice, maximumPriceBuyerWillPay]
suggestedPrice = (minimumPrice + maximumPriceBuyerWillPay) / 2
```

**Example Scenario**:

**Inputs**:
- Monthly price: R500
- Customers: 100
- Cost to serve: R150/customer
- Desired margin: 70%
- Buyer value: R5,000/month

**Results**:
- Monthly revenue: R500 × 100 = **R50,000**
- Annual revenue: **R600,000**
- Monthly cost: R150 × 100 = **R15,000**
- Monthly profit: R50,000 - R15,000 = **R35,000**
- Actual margin: **70%**
- Seller minimum: R150 / 0.3 = **R500** ✓ (meets target)
- Buyer ROI: 5,000 / 500 = **10x**
- Buyer annual savings: (5,000 - 500) × 12 = **R54,000**
- Buyer payback: 0.11 months = **~3 days**
- Buyer max: 5,000 × 0.4 = **R2,000**
- Equilibrium: R500 - R2,000 (exists ✓)
- Suggested: **R1,250** (88% margin, 4x ROI)

---

### 2. Usage-Based

**Pricing Structure**: Price per unit consumed (API calls, transactions, build minutes)

**Inputs**:
- `pricePerUnit`: Price per unit (R)
- `monthlyUnits`: Units consumed per month
- `unitLabel`: Description (e.g., "1,000 API calls")
- `costPerUnit`: Infrastructure cost per unit (R)
- `desiredMargin`: Target gross margin (%)
- `buyerValuePerUnit`: Value generated per unit (R)

**Key Calculations**:

```javascript
// Revenue
monthlyRevenue = pricePerUnit × monthlyUnits
annualRevenue = monthlyRevenue × 12

// Costs
monthlyCost = costPerUnit × monthlyUnits

// Profit & Margin
monthlyProfit = monthlyRevenue - monthlyCost
actualMargin = (monthlyProfit / monthlyRevenue) × 100

// Seller minimum (per unit)
minimumPricePerUnit = costPerUnit / (1 - desiredMargin / 100)

// Buyer ROI (per unit)
buyerROIPerUnit = buyerValuePerUnit / pricePerUnit
buyerMonthlyValue = buyerValuePerUnit × monthlyUnits
buyerMonthlySavings = buyerMonthlyValue - monthlyRevenue
buyerAnnualSavings = buyerMonthlySavings × 12

// Equilibrium
maximumPricePerUnit = buyerValuePerUnit × 0.4  // 2.5x ROI threshold
equilibriumRange = [minimumPricePerUnit, maximumPricePerUnit]
suggestedPricePerUnit = (minimumPricePerUnit + maximumPricePerUnit) / 2
```

**Example Scenario**: API Platform

**Inputs**:
- Price per unit: R2.00 per 1,000 API calls
- Monthly units: 10,000 (= 10 million API calls)
- Cost per unit: R0.50 per 1,000 calls
- Desired margin: 75%
- Buyer value per unit: R10.00 per 1,000 calls

**Results**:
- Monthly revenue: R2 × 10,000 = **R20,000**
- Annual revenue: **R240,000**
- Monthly cost: R0.50 × 10,000 = **R5,000**
- Monthly profit: **R15,000**
- Actual margin: **75%**
- Minimum price per unit: R0.50 / 0.25 = **R2.00** ✓
- Buyer ROI per unit: 10 / 2 = **5x**
- Buyer monthly value: R10 × 10,000 = **R100,000**
- Buyer annual savings: (100,000 - 20,000) × 12 = **R960,000**
- Buyer max per unit: 10 × 0.4 = **R4.00**
- Equilibrium: R2.00 - R4.00 (exists ✓)
- Suggested: **R3.00** (83% margin, 3.3x ROI)

---

### 3. Per-Seat (Per User)

**Pricing Structure**: Price per active user/seat

**Inputs**:
- `pricePerSeat`: Price per user per month (R)
- `seats`: Number of active seats/users
- `costPerSeat`: Infrastructure + support per seat (R/month)
- `desiredMargin`: Target gross margin (%)
- `valuePerSeat`: Productivity gain per user (R/month)

**Key Calculations**:

```javascript
// Revenue
monthlyRevenue = pricePerSeat × seats
annualRevenue = monthlyRevenue × 12

// Costs
monthlyCost = costPerSeat × seats

// Profit & Margin
monthlyProfit = monthlyRevenue - monthlyCost
actualMargin = (monthlyProfit / monthlyRevenue) × 100

// Seller minimum (per seat)
minimumPricePerSeat = costPerSeat / (1 - desiredMargin / 100)

// Buyer ROI (per seat)
buyerROIPerSeat = valuePerSeat / pricePerSeat
buyerMonthlyValue = valuePerSeat × seats
buyerMonthlySavings = buyerMonthlyValue - monthlyRevenue
buyerAnnualSavings = buyerMonthlySavings × 12

// Equilibrium
maximumPricePerSeat = valuePerSeat × 0.4  // 2.5x ROI threshold
equilibriumRange = [minimumPricePerSeat, maximumPricePerSeat]
suggestedPricePerSeat = (minimumPricePerSeat + maximumPricePerSeat) / 2
```

**Example Scenario**: Collaboration Tool

**Inputs**:
- Price per seat: R250/user/month
- Seats: 25 users
- Cost per seat: R70/user/month
- Desired margin: 72%
- Value per seat: R2,000/user/month (productivity gains)

**Results**:
- Monthly revenue: R250 × 25 = **R6,250**
- Annual revenue: **R75,000**
- Monthly cost: R70 × 25 = **R1,750**
- Monthly profit: **R4,500**
- Actual margin: **72%**
- Minimum price per seat: R70 / 0.28 = **R250** ✓
- Buyer ROI per seat: 2,000 / 250 = **8x**
- Buyer monthly value: R2,000 × 25 = **R50,000**
- Buyer annual savings: (50,000 - 6,250) × 12 = **R525,000**
- Buyer max per seat: 2,000 × 0.4 = **R800**
- Equilibrium: R250 - R800 (exists ✓)
- Suggested: **R525** (87% margin, 3.8x ROI)

---

### 4. One-Time Purchase (Perpetual License)

**Pricing Structure**: Upfront license + annual maintenance fee

**Inputs**:
- `licensePrice`: One-time perpetual license fee (R)
- `maintenanceFee`: Annual maintenance as % of license (%)
- `maintenanceAttach`: % of customers buying maintenance (%)
- `unitsSoldPerMonth`: New licenses sold monthly
- `existingCustomers`: Customers on maintenance
- `costToDeliver`: One-time onboarding/implementation cost (R)
- `monthlySupportCost`: Ongoing support per customer (R/month)
- `desiredMargin`: Target margin on license sales (%)
- `buyerValuePerYear`: Annual value to buyer (R)

**Key Calculations**:

```javascript
// Revenue (mixed: new licenses + recurring maintenance)
monthlyLicenseRevenue = licensePrice × unitsSoldPerMonth
annualMaintenanceFee = licensePrice × (maintenanceFee / 100)
monthlyMaintenanceRevenue = (existingCustomers × annualMaintenanceFee) / 12
monthlyRevenue = monthlyLicenseRevenue + monthlyMaintenanceRevenue
annualRevenue = monthlyRevenue × 12

// Costs
monthlyLicenseCost = costToDeliver × unitsSoldPerMonth
monthlySupportCost = existingCustomers × monthlySupportCost
monthlyCost = monthlyLicenseCost + monthlySupportCost

// Profit & Margin
monthlyProfit = monthlyRevenue - monthlyCost
actualMargin = (monthlyProfit / monthlyRevenue) × 100

// Seller minimum (license only)
minimumLicensePrice = costToDeliver / (1 - desiredMargin / 100)

// Buyer perspective (total cost of ownership)
buyerFirstYearCost = licensePrice + (annualMaintenanceFee × maintenanceAttach / 100)
buyerYear2PlusCost = annualMaintenanceFee × (maintenanceAttach / 100)
buyerROIFirstYear = buyerValuePerYear / buyerFirstYearCost
buyerPaybackMonths = 12 × (buyerFirstYearCost / (buyerValuePerYear - buyerFirstYearCost))

// Equilibrium
maximumLicensePrice = buyerValuePerYear × 0.5  // 2x ROI in year 1
equilibriumRange = [minimumLicensePrice, maximumLicensePrice]
suggestedLicensePrice = (minimumLicensePrice + maximumLicensePrice) / 2
```

**Example Scenario**: Accounting Software

**Inputs**:
- License price: R5,000
- Maintenance fee: 20% (R1,000/year)
- Maintenance attach: 60%
- Units sold/month: 5 licenses
- Existing customers: 30
- Cost to deliver: R1,500
- Monthly support cost: R50/customer
- Desired margin: 70%
- Buyer annual value: R15,000

**Results**:
- Monthly license revenue: R5,000 × 5 = **R25,000**
- Annual maintenance fee: R5,000 × 0.2 = **R1,000**
- Monthly maintenance revenue: (30 × 1,000) / 12 = **R2,500**
- Total monthly revenue: **R27,500**
- Annual revenue: **R330,000**
- Monthly license cost: R1,500 × 5 = **R7,500**
- Monthly support cost: 30 × 50 = **R1,500**
- Total monthly cost: **R9,000**
- Monthly profit: **R18,500**
- Actual margin: **67%**
- Minimum license: R1,500 / 0.3 = **R5,000** ✓
- Buyer 1st year cost: 5,000 + (1,000 × 0.6) = **R5,600**
- Buyer year 2+ cost: **R600**
- Buyer ROI (year 1): 15,000 / 5,600 = **2.68x**
- Buyer payback: 12 × (5,600 / 9,400) = **7.1 months**
- Buyer max license: 15,000 × 0.5 = **R7,500**
- Equilibrium: R5,000 - R7,500 (exists ✓)
- Suggested: **R6,250** (75% margin, 2.4x ROI year 1)

---

### 5. Marketplace (Two-Sided)

**Pricing Structure**: Commission on each transaction

**Inputs**:
- `commissionRate`: Commission percentage (%)
- `avgTransactionValue`: Average GMV per transaction (R)
- `monthlyTransactions`: Total transactions per month
- `activeBuyers`: Number of active buyers
- `activeSellers`: Number of active sellers
- `costPerTransaction`: Payment processing + support (R)
- `desiredMargin`: Target margin on commissions (%)
- `sellerValuePerTransaction`: Profit seller makes before commission (R)

**Key Calculations**:

```javascript
// Revenue
monthlyGMV = avgTransactionValue × monthlyTransactions
commissionPerTransaction = avgTransactionValue × (commissionRate / 100)
monthlyRevenue = commissionPerTransaction × monthlyTransactions
annualRevenue = monthlyRevenue × 12
annualGMV = monthlyGMV × 12

// Costs
monthlyCost = costPerTransaction × monthlyTransactions

// Profit & Margin
monthlyProfit = monthlyRevenue - monthlyCost
actualMargin = (monthlyProfit / monthlyRevenue) × 100

// Seller (platform) minimum
minimumCommissionRate = (costPerTransaction / avgTransactionValue) /
                         (1 - desiredMargin / 100) × 100

// Buyer (merchants on platform) perspective
sellerNetProfit = sellerValuePerTransaction - commissionPerTransaction
sellerROI = sellerNetProfit / sellerValuePerTransaction
sellerMonthlyProfit = sellerNetProfit × monthlyTransactions
avgTransactionsPerSeller = monthlyTransactions / activeSellers

// Equilibrium (max commission sellers will accept)
maximumCommissionRate = (sellerValuePerTransaction × 0.3) / avgTransactionValue × 100
                        // Takes max 30% of seller's profit margin
equilibriumRange = [minimumCommissionRate, maximumCommissionRate]
suggestedCommissionRate = (minimumCommissionRate + maximumCommissionRate) / 2
```

**Example Scenario**: Freelance Marketplace

**Inputs**:
- Commission rate: 10%
- Avg transaction: R500
- Monthly transactions: 200
- Active buyers: 100
- Active sellers: 20
- Cost per transaction: R15 (payment processing, support)
- Desired margin: 70%
- Seller value per transaction: R150 (their profit before commission)

**Results**:
- Monthly GMV: R500 × 200 = **R100,000**
- Annual GMV: **R1,200,000**
- Commission per transaction: R500 × 0.1 = **R50**
- Monthly revenue: R50 × 200 = **R10,000**
- Annual revenue: **R120,000**
- Monthly cost: R15 × 200 = **R3,000**
- Monthly profit: **R7,000**
- Actual margin: **70%**
- Minimum commission rate: (15 / 500) / 0.3 × 100 = **10%** ✓
- Seller net profit: R150 - R50 = **R100 per transaction**
- Seller ROI: 100 / 150 = **67%** (keeps 67% after commission)
- Seller monthly profit: R100 × 200 = **R20,000 total**
- Avg transactions per seller: 200 / 20 = **10 per seller**
- Max commission rate: (150 × 0.3) / 500 × 100 = **9%** ⚠️
- Equilibrium: **Does not exist** (floor 10% > ceiling 9%)
- **Action needed**: Reduce cost per transaction or lower margin target

---

## Equilibrium Theory

### What is Equilibrium Pricing?

**Equilibrium pricing** is the range where:
1. Sellers achieve their minimum margin requirements (sustainability)
2. Buyers receive compelling ROI (value proposition)

```
[Seller Floor] ←――――― Equilibrium Zone ―――――→ [Buyer Ceiling]
    R500                                          R2,000
```

### The Two Constraints

**Constraint 1: Seller Floor (Supply Side)**
```
Price ≥ Cost / (1 - Margin)
```
Below this price, the business is unsustainable.

**Constraint 2: Buyer Ceiling (Demand Side)**
```
Price ≤ Value × ROI_threshold
```
Above this price, buyers won't buy (ROI too low).

### When Equilibrium Exists

```
If: Seller Floor ≤ Buyer Ceiling
Then: Equilibrium exists
Else: No viable pricing
```

**Example: Equilibrium Exists**
- Seller floor: R500 (70% margin needed)
- Buyer ceiling: R2,000 (2.5x ROI threshold)
- R500 ≤ R2,000 ✓
- **Range: R500 - R2,000**
- Suggested: R1,250 (midpoint)

**Example: No Equilibrium**
- Seller floor: R500 (70% margin needed)
- Buyer ceiling: R400 (value only R1,000, ceiling = R400)
- R500 > R400 ✗
- **No viable pricing**
- Action: Reduce costs OR increase value delivered

### Pricing Within the Equilibrium Zone

**Lower in Range (Closer to Floor)**:
- ✅ More competitive pricing
- ✅ Easier to win customers
- ✅ Higher buyer ROI
- ❌ Lower seller margins
- ❌ Less room for error

**Higher in Range (Closer to Ceiling)**:
- ✅ Higher seller margins
- ✅ More profit per customer
- ✅ More investment capacity
- ❌ Harder to justify to buyers
- ❌ More vulnerable to competition

**Midpoint (Balanced)**:
- ✅ Fair to both parties
- ✅ Sustainable and compelling
- ✅ Room for negotiation both ways
- Recommended starting point

---

## ROI Thresholds & Assumptions

### Why ROI Thresholds Matter

Buyers have an **opportunity cost** for money spent. They could:
- Invest in other solutions
- Hire additional staff
- Invest in marketing
- Keep as cash reserves

Therefore, your solution must **clearly beat the alternatives**.

### Threshold by Pricing Model

| Model | Threshold | Buyer Max Price | Rationale |
|-------|-----------|-----------------|-----------|
| **Subscription** | 2.5x ROI | Value × 0.4 | Monthly commitment; needs quick payback |
| **Usage-Based** | 2.5x ROI | Value × 0.4 | Variable cost; easy to compare alternatives |
| **Per-Seat** | 2.5x ROI | Value × 0.4 | Per-person pricing; must justify each seat |
| **One-Time** | 2x ROI (Year 1) | Annual Value × 0.5 | Larger upfront investment; longer payback acceptable |
| **Marketplace** | 70% profit retention | Seller Profit × 0.3 / GMV | Sellers must retain majority of profit |

### Rationale for 2.5x ROI (Subscription/Usage/Per-Seat)

**2.5x ROI** means:
- Buyer spends R1
- Buyer receives R2.50 in value
- Net gain: R1.50 (150% return)

**Why 2.5x and not 2x?**
- Accounts for implementation effort
- Accounts for switching costs
- Accounts for adoption risk
- Accounts for opportunity cost
- Provides clear "no-brainer" value

**Why not higher (e.g., 5x)?**
- Would overly restrict pricing
- Would leave money on the table
- Market reality: 2.5x is compelling

### Rationale for 2x ROI (One-Time Purchase)

**Why lower threshold?**
- Perpetual license = long-term asset
- Buyer amortizes cost over multiple years
- Year 1: 2x ROI
- Year 2+: Nearly pure value (only maintenance cost)
- Lifetime ROI much higher

**Example**:
- License: R5,000 + R1,000/year maintenance
- Annual value: R15,000
- Year 1 ROI: 15,000 / 6,000 = 2.5x
- Year 2 ROI: 15,000 / 1,000 = 15x
- 5-year total: (15,000 × 5) / (5,000 + 1,000 × 5) = **7.5x**

### Rationale for 30% Commission Ceiling (Marketplace)

**Marketplace dynamics**:
- Sellers have alternatives (direct sales, other platforms)
- Commission must be small fraction of seller's profit
- Sellers must retain majority of value created

**Why 30% of seller profit?**
- Platform provides access to buyers (valuable service)
- But seller does the actual work (delivery, fulfillment)
- 30% = meaningful revenue for platform, acceptable for seller
- Seller keeps 70% = majority of their value

**Example**:
- Transaction value: R500
- Seller's cost: R350
- Seller's profit before commission: R150
- Max commission: R150 × 0.3 = **R45** (9% of GMV)
- Seller keeps: R105 (70% of their profit)

---

## South African Market Calibration

All default values are calibrated for the **South African B2B software market** (ZAR pricing).

### Market Research Basis

Defaults based on:
1. Public pricing from South African SaaS companies
2. International pricing converted to ZAR (≈ R18:$1 historically)
3. Purchasing power parity adjustments
4. South African SME budget constraints

### Typical Ranges by Model

**Subscription SaaS**:
- Small business: R250-R500/month
- Mid-market: R500-R1,500/month
- Enterprise: R1,500-R5,000/month

**API / Usage-Based**:
- API calls: R0.50-R5 per 1,000 calls
- Transactions: R5-R20 per transaction
- Build minutes: R1-R3 per minute

**Per-Seat**:
- Collaboration tools: R100-R200/user
- Business operations: R200-R350/user
- Developer tools: R300-R500/user

**One-Time License**:
- Small business software: R3,000-R10,000
- Mid-market: R10,000-R30,000
- Enterprise: R30,000-R100,000+

**Marketplace**:
- Low-value transactions: 10-15% commission
- High-value transactions: 3-7% commission

### Cost Structure Assumptions

**Subscription SaaS**:
- Infrastructure: 10-20% of price
- Support: 5-10% of price
- Total cost to serve: 20-30% of price
- Target margin: 70-85%

**Usage-Based**:
- Infrastructure (compute, storage): 15-25% of price
- Target margin: 75-90%

**Per-Seat**:
- Infrastructure per user: 15-25% of price
- Support allocation: 5-10% of price
- Target margin: 70-80%

**One-Time**:
- Delivery cost (onboarding): 25-35% of license
- Ongoing support: R50-R500/customer/month
- Target margin: 70-80%

**Marketplace**:
- Payment processing: 2-3% of GMV
- Platform costs: 1-2% of GMV
- Total: 3-5% of GMV
- Target margin: 60-75%

---

## Calculation Examples by Scenario

### Scenario 1: Underpricing (Need to Raise Price)

**Current State**:
- Model: Subscription
- Price: R300/month
- Cost to serve: R150
- Desired margin: 70%

**Analysis**:
- Minimum price: R150 / 0.3 = **R500**
- Current price: **R300**
- Gap: R300 - R500 = **-R200** ❌
- Actual margin: (300 - 150) / 300 = **50%** (below target)

**Action**: Raise price to R500+ or reduce cost to serve to R90

---

### Scenario 2: Overpricing (Buyer Won't Pay)

**Current State**:
- Model: Subscription
- Price: R3,000/month
- Value to buyer: R5,000/month
- Cost to serve: R150

**Analysis**:
- Buyer max (2.5x ROI): R5,000 × 0.4 = **R2,000**
- Current price: **R3,000**
- Gap: R3,000 - R2,000 = **+R1,000** ❌
- Buyer ROI: 5,000 / 3,000 = **1.67x** (below 2.5x threshold)

**Action**: Lower price to R2,000 or increase value delivered to R7,500+

---

### Scenario 3: Perfect Equilibrium

**Current State**:
- Model: Subscription
- Price: R1,250/month
- Cost to serve: R150
- Desired margin: 70%
- Value to buyer: R5,000

**Analysis**:
- Minimum price: **R500**
- Maximum price: **R2,000**
- Current price: **R1,250** (midpoint) ✓
- Actual margin: (1,250 - 150) / 1,250 = **88%** ✓
- Buyer ROI: 5,000 / 1,250 = **4x** ✓
- **Win-win pricing achieved**

---

### Scenario 4: No Equilibrium (Fundamental Problem)

**Current State**:
- Model: Subscription
- Cost to serve: R400
- Desired margin: 70%
- Value to buyer: R800

**Analysis**:
- Minimum price: R400 / 0.3 = **R1,333**
- Maximum price: R800 × 0.4 = **R320**
- R1,333 > R320 ❌
- **No equilibrium exists**

**Root cause**: Value delivered (R800) is too low relative to cost (R400)

**Actions**:
1. **Reduce cost**: Target R96 cost to serve → R320 minimum price
2. **Increase value**: Deliver R3,333 value → R1,333 maximum price
3. **Lower margin**: Accept 50% margin → R800 minimum price
4. **Pivot**: This pricing model isn't viable for this product

---

## Assumptions & Limitations

### What This Calculator Assumes

1. **Static volumes**: Quantity doesn't change month-to-month
2. **Variable costs only**: Fixed costs (rent, salaries) excluded
3. **Perfect information**: Assumes you know true costs and buyer value
4. **Rational buyers**: Buyers make decisions based on ROI
5. **Single buyer type**: Doesn't segment by customer type
6. **No seasonality**: Revenue/costs consistent monthly
7. **No churn**: Customer count stays constant

### What This Calculator Does NOT Calculate

❌ Growth projections (ARR growth, CAC payback)
❌ Churn rates or retention curves
❌ Customer acquisition costs
❌ Sales cycle length
❌ Market size or TAM
❌ Competitive positioning
❌ Price elasticity of demand
❌ Multi-year contract dynamics
❌ Tiered pricing optimization
❌ Discount or negotiation scenarios

### When to Use This Calculator

✅ Initial pricing decisions
✅ Unit economics validation
✅ Margin feasibility checks
✅ Value-based pricing analysis
✅ Equilibrium zone identification
✅ Quick scenario testing

### When NOT to Use This Calculator

❌ Detailed financial projections
❌ Investor pitch models
❌ Complex pricing optimization
❌ Multi-product pricing
❌ Dynamic pricing strategies

---

## Formula Quick Reference

| Calculation | Formula | Example |
|-------------|---------|---------|
| **Monthly Revenue** | Price × Quantity | R500 × 100 = R50,000 |
| **Gross Margin %** | (Revenue - Cost) / Revenue × 100 | (50,000 - 15,000) / 50,000 × 100 = 70% |
| **Minimum Price** | Cost / (1 - Margin ÷ 100) | R150 / (1 - 0.70) = R500 |
| **ROI Multiple** | Value / Price | R5,000 / R500 = 10x |
| **Annual Savings** | (Value - Price) × 12 | (5,000 - 500) × 12 = R54,000 |
| **Payback (months)** | Price / (Value - Price) | 500 / 4,500 = 0.11 months |
| **Buyer Max Price** | Value × 0.4 (for 2.5x ROI) | R5,000 × 0.4 = R2,000 |
| **Suggested Price** | (Min + Max) / 2 | (500 + 2,000) / 2 = R1,250 |

---

## Conclusion

The Pricing Equilibrium Calculator implements fundamental economic principles:

1. **Cost-plus pricing** (seller perspective): Price must cover costs + desired margin
2. **Value-based pricing** (buyer perspective): Price must deliver compelling ROI
3. **Equilibrium analysis** (market perspective): Find the range where both constraints are satisfied

By viewing pricing through all three lenses simultaneously, you can make informed decisions that create sustainable, win-win business models.

**Remember**: Good pricing isn't about maximizing revenue - it's about finding the sustainable equilibrium where both you and your customers thrive.
