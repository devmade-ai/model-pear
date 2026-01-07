# Business User Guide
# Pricing Equilibrium Calculator

> **Last Updated**: January 2026
> **Target Audience**: Founders, Product Managers, Finance Teams, Business Analysts

## Table of Contents

1. [What Is This Tool?](#what-is-this-tool)
2. [Who Should Use It?](#who-should-use-it)
3. [The 5 Pricing Models Explained](#the-5-pricing-models-explained)
4. [How to Use the Calculator](#how-to-use-the-calculator)
5. [Calculation Modes](#calculation-modes)
6. [Understanding the Results](#understanding-the-results)
7. [Common Scenarios & Examples](#common-scenarios--examples)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

---

## What Is This Tool?

The Pricing Equilibrium Calculator is a web-based tool designed to help South African B2B software businesses find the optimal pricing point where both sellers and buyers win.

### Key Principle: Equilibrium Pricing

**Equilibrium** exists when:
- **Seller achieves target margin** (covers costs + desired profit)
- **Buyer receives compelling ROI** (value exceeds price paid)
- **Both parties win** (sustainable, long-term relationship)

### What Makes This Tool Different

**What This Tool DOESN'T Have** (by design):
- ❌ Month-by-month revenue projections
- ❌ Growth rate assumptions
- ❌ Churn rate modeling
- ❌ Customer acquisition cost calculations
- ❌ Complex scenario planning
- ❌ 20+ pricing models to choose from

**What This Tool DOES Have** (intentionally simple):
- ✅ Static unit economics (units × price = revenue)
- ✅ Seller cost + margin analysis
- ✅ Buyer value + ROI analysis
- ✅ Equilibrium pricing (seller floor vs buyer ceiling)
- ✅ 5 core pricing models only
- ✅ South African defaults (ZAR)
- ✅ Single, focused calculator

---

## Who Should Use It?

### For Founders
**Use Cases:**
- "What should I charge for my SaaS product?"
- "Is my pricing sustainable given my costs?"
- "Will buyers find my pricing compelling?"
- "Should I use subscription or usage-based pricing?"

**Value:**
- Validate pricing assumptions before launch
- Find equilibrium between profitability and market acceptance
- Compare pricing model alternatives objectively

### For Product Managers
**Use Cases:**
- "Which pricing model makes sense for this feature?"
- "How do I price to create a win-win?"
- "What's the revenue impact of different pricing strategies?"

**Value:**
- Data-driven pricing decisions
- Clear understanding of unit economics
- Alignment between product value and pricing

### For Finance Teams
**Use Cases:**
- "What's our minimum viable price?"
- "What margin are we actually achieving?"
- "Is our pricing aligned with our cost structure?"

**Value:**
- Validate margin targets are achievable
- Understand cost implications of pricing decisions
- Ensure pricing supports business sustainability

---

## The 5 Pricing Models Explained

### 1. Subscription (SaaS)

**Description**: Monthly recurring revenue per customer

**Example**: R500/month × 100 customers = R50,000 MRR

**Best For**:
- SaaS platforms (CRM, project management, accounting software)
- Cloud software with ongoing value delivery
- Recurring services (backups, monitoring, support)

**Typical South African Pricing**:
- SMB SaaS: R250 - R1,500/month
- Enterprise SaaS: R5,000 - R50,000/month

**When to Use**:
- Continuous value delivery to customers
- Predictable, recurring costs to serve
- Need for stable, predictable revenue

**Seller Inputs**:
- Monthly subscription price
- Number of customers
- Cost to serve per customer/month
- Desired gross margin %

**Buyer Inputs**:
- Value received per month (revenue enabled or cost saved)

---

### 2. Usage-Based

**Description**: Pay per unit consumed (API calls, transactions, build minutes)

**Example**: R2 per 1,000 API calls × 10,000 units = R20,000/month

**Best For**:
- APIs (payment processing, SMS, maps, AI services)
- CI/CD platforms (build minutes, deployments)
- Infrastructure services (storage, compute, bandwidth)
- Transaction processing (payments, invoicing)

**Typical South African Pricing**:
- API calls: R0.50 - R5 per 1,000 calls
- Build minutes: R10 - R50 per 1,000 minutes
- Transactions: R0.10 - R2 per transaction

**When to Use**:
- Variable customer usage patterns
- Cost scales directly with usage
- Customers want to "pay for what they use"

**Seller Inputs**:
- Price per unit (e.g., per 1,000 API calls)
- Average units per customer/month
- Number of customers
- Cost to serve per unit
- Desired gross margin %

**Buyer Inputs**:
- Value received per unit of usage

---

### 3. Per-Seat (Per User)

**Description**: Price per active user or seat

**Example**: R250/seat × 25 users = R6,250/month

**Best For**:
- Collaboration tools (Slack, Microsoft Teams, Notion)
- Business software (accounting, HR, sales tools)
- Developer tools (IDEs, code repositories)

**Typical South African Pricing**:
- Collaboration tools: R100 - R500/seat/month
- Professional tools: R500 - R2,000/seat/month
- Enterprise software: R2,000 - R10,000/seat/month

**When to Use**:
- Value increases with number of users
- Cost to serve scales with user count
- Clear per-user value proposition

**Seller Inputs**:
- Price per seat/month
- Average seats per customer
- Number of customers
- Cost to serve per seat/month
- Desired gross margin %

**Buyer Inputs**:
- Value received per user/month

---

### 4. One-Time Purchase (Perpetual License)

**Description**: Upfront license fee + optional annual maintenance

**Example**: R5,000 license + 20% annual maintenance (R1,000/year)

**Best For**:
- Desktop software (Adobe Creative Suite, Microsoft Office)
- Enterprise platforms (ERP, accounting software)
- Development tools (IDEs, compilers)

**Typical South African Pricing**:
- SMB software: R1,000 - R10,000 perpetual
- Professional tools: R10,000 - R50,000 perpetual
- Enterprise systems: R50,000 - R500,000+ perpetual
- Maintenance: 15% - 25% of license fee annually

**When to Use**:
- Software with long-term utility (multi-year use)
- Customers prefer ownership over subscription
- Minimal ongoing costs to serve after purchase

**Seller Inputs**:
- One-time license price
- Annual maintenance % (optional)
- Number of licenses sold per year
- Cost to deliver per license
- Desired gross margin %

**Buyer Inputs**:
- Value received from software ownership
- Expected years of use

---

### 5. Marketplace (Two-Sided)

**Description**: Commission-based marketplace connecting buyers and sellers

**Example**: 10% commission × R500 avg transaction × 100 transactions/month = R5,000/month

**Best For**:
- Freelance platforms (Upwork, Fiverr, local equivalents)
- Supplier marketplaces (e-commerce, B2B marketplaces)
- Service booking platforms (appointments, consultations)

**Typical South African Pricing**:
- Service marketplaces: 5% - 20% commission
- E-commerce platforms: 3% - 15% commission
- High-value B2B: 1% - 10% commission

**When to Use**:
- Facilitating transactions between buyers and sellers
- Providing trust, discovery, and payment infrastructure
- Revenue tied directly to transaction volume

**Seller Inputs**:
- Commission % per transaction
- Average transaction value
- Transactions per month
- Cost to facilitate per transaction
- Desired gross margin %

**Buyer Inputs**:
- Value created by the marketplace (trust, convenience, reach)

---

## How to Use the Calculator

### Step 1: Select Your Pricing Model

Choose one of the 5 pricing models that best fits your business:
- Subscription (SaaS)
- Usage-Based
- Per-Seat (Per User)
- One-Time Purchase
- Marketplace

**Tip**: Not sure which model fits? See the detailed descriptions above or try multiple models to compare.

### Step 2: Choose Your Calculation Mode

The calculator offers two modes:

**Option 1: Manual Entry (Traditional)**
- Enter all inputs manually
- See complete results across all perspectives
- Best when you have all your data ready

**Option 2: Calculate Missing Input (NEW!)**
- Let the calculator auto-calculate one missing input
- Choose what to calculate: Price, Buyer Value, Margin, or Maximum Cost
- Best when you want to explore "what if" scenarios

### Step 3: Enter Your Inputs

The calculator needs two categories of information:

#### Seller/Vendor Inputs
- **Pricing**: Current price, volume, units
- **Costs**: Cost to serve/deliver per unit
- **Margin**: Desired gross margin percentage

#### Buyer Inputs
- **Value**: How much value does your product deliver to customers?
  - Revenue enabled (how much money does it help them make?)
  - Cost saved (how much money does it save them?)

**Example for SaaS Project Management Tool**:
- Seller Cost: R150/customer/month (hosting, support, updates)
- Desired Margin: 70%
- Buyer Value: R5,000/month (saves 10 hours × R500/hour of project management time)

### Step 4: Click Calculate

The calculator processes your inputs and displays results across multiple perspectives.

---

## Calculation Modes

### Mode 1: Manual Entry

**When to Use**: You have all your data and want to see complete results

**How It Works**:
1. Select "Enter All Inputs Manually"
2. Fill in all fields:
   - Pricing (price, volume)
   - Seller costs (cost per unit, desired margin %)
   - Buyer value (value received)
3. Click "Calculate"
4. View results across all perspectives

**Example Workflow**:
```
Subscription SaaS Model
├── Price: R500/month
├── Volume: 100 customers
├── Cost to Serve: R150/customer/month
├── Desired Margin: 70%
└── Buyer Value: R5,000/month

Results:
├── Revenue: R50,000/month
├── Profit: R35,000/month (70% margin achieved)
├── Seller Floor: R500 (minimum price for 70% margin)
├── Buyer Ceiling: R2,000 (max price for 2.5x ROI)
└── Equilibrium: YES (price within R500 - R2,000 range)
```

---

### Mode 2: Calculate Missing Input

**When to Use**: You want to explore scenarios or reverse-engineer targets

#### Option A: Calculate Optimal Price

**Use Case**: "What should I charge based on my costs and buyer value?"

**You Provide**:
- Cost to serve
- Desired margin
- Buyer value

**Calculator Finds**:
- **Seller Floor**: Minimum price to meet your margin (e.g., R500)
- **Buyer Ceiling**: Maximum price maintaining buyer ROI (e.g., R2,000)
- **Balanced Price**: Midpoint between floor and ceiling (e.g., R1,250)

**Pricing Strategies**:
- **Minimum Viable**: Price at seller floor (R500) - most competitive, lowest margin
- **Balanced**: Price at midpoint (R1,250) - recommended, win-win
- **Maximum Capture**: Price at buyer ceiling (R2,000) - highest profit, premium positioning

**Example**:
```
Known Inputs:
├── Cost to Serve: R150/month
├── Desired Margin: 70%
└── Buyer Value: R5,000/month

Calculator Determines:
├── Seller Floor: R500 (meets 70% margin)
├── Buyer Ceiling: R2,000 (maintains 2.5x ROI)
└── Recommended Balanced Price: R1,250

At R1,250:
├── Your Margin: 88% (exceeds 70% target)
└── Buyer ROI: 4x (exceeds 2.5x threshold)
```

---

#### Option B: Calculate Required Buyer Value

**Use Case**: "How much value do I need to deliver to justify my pricing?"

**You Provide**:
- Target price
- Cost to serve
- Desired margin

**Calculator Finds**:
- Minimum buyer value needed to maintain acceptable ROI at your target price

**Example**:
```
Known Inputs:
├── Target Price: R1,500/month
├── Cost to Serve: R200/month
└── Desired Margin: 75%

Calculator Determines:
└── Required Buyer Value: R3,750/month

Interpretation:
- To charge R1,500, you must deliver at least R3,750/month in value
- This maintains 2.5x ROI for the buyer
- Your margin: 87% (exceeds 75% target)
```

---

#### Option C: Calculate Achievable Margin

**Use Case**: "What margin can I realistically achieve at my current price?"

**You Provide**:
- Current price
- Cost to serve
- Buyer value

**Calculator Finds**:
- Actual margin you're achieving
- Whether pricing is sustainable

**Example**:
```
Known Inputs:
├── Current Price: R800/month
├── Cost to Serve: R300/month
└── Buyer Value: R4,000/month

Calculator Determines:
├── Achievable Margin: 62.5%
├── Seller Floor: R1,000 (for 70% margin)
└── Buyer Ceiling: R1,600 (for 2.5x ROI)

Interpretation:
- Current pricing leaves margin opportunity on the table
- You could increase price to R1,000 (still below buyer ceiling)
- This would increase margin from 62.5% to 70%
```

---

#### Option D: Calculate Maximum Cost

**Use Case**: "What's the maximum I can spend on costs while maintaining margin targets?"

**You Provide**:
- Target price
- Desired margin
- Buyer value

**Calculator Finds**:
- Maximum allowable cost per unit to meet margin target

**Example**:
```
Known Inputs:
├── Target Price: R1,000/month
├── Desired Margin: 70%
└── Buyer Value: R5,000/month

Calculator Determines:
└── Maximum Cost: R300/month

Interpretation:
- To charge R1,000 with 70% margin, costs must stay ≤ R300
- Buyer ceiling: R2,000 (you have pricing headroom)
- Consider either: (a) reduce costs or (b) increase price
```

---

## Understanding the Results

The calculator displays results across four perspectives:

### 1. Revenue & Profit Overview

**What You See**:
- Total monthly revenue
- Total monthly profit
- Gross margin %
- Unit economics (revenue and profit per unit)

**How to Interpret**:
- **Revenue**: Is it sufficient for your business goals?
- **Profit**: Does it cover fixed costs and growth investments?
- **Margin**: Is it healthy for your industry? (SaaS: 70-90%, Services: 40-60%)

---

### 2. Seller Economics (Your Perspective)

**What You See**:
- **Seller Floor**: Minimum price to meet your margin target
- Cost breakdown per unit
- Margin analysis
- Profitability assessment

**Key Metrics**:
- **Seller Floor = Cost ÷ (1 - Desired Margin)**
  - Example: R150 ÷ (1 - 0.70) = R500
- **Actual Margin = (Price - Cost) ÷ Price**
  - Example: (R1,250 - R150) ÷ R1,250 = 88%

**How to Interpret**:
- **Price > Seller Floor**: ✅ You're meeting margin targets
- **Price = Seller Floor**: ⚠️ Minimum viable pricing, no buffer
- **Price < Seller Floor**: ❌ Unsustainable, losing money or margin too low

---

### 3. Buyer Economics (Customer Perspective)

**What You See**:
- **Buyer Ceiling**: Maximum price maintaining acceptable ROI
- Value delivered to customer
- ROI calculation
- Value proposition assessment

**Key Metrics**:
- **Buyer Ceiling = Buyer Value ÷ ROI Threshold**
  - Example: R5,000 ÷ 2.5 = R2,000
- **Actual ROI = Buyer Value ÷ Price**
  - Example: R5,000 ÷ R1,250 = 4x

**ROI Thresholds by Model**:
- Subscription: 2.5x minimum (buyer pays R1, gets R2.50+ value)
- Usage-Based: 3x minimum (higher variability requires buffer)
- Per-Seat: 2.5x minimum
- One-Time Purchase: 5x minimum (large upfront commitment)
- Marketplace: 10x minimum (transaction friction must be overcome)

**How to Interpret**:
- **Price < Buyer Ceiling**: ✅ Compelling ROI for buyer
- **Price = Buyer Ceiling**: ⚠️ Marginal ROI, buyer may hesitate
- **Price > Buyer Ceiling**: ❌ ROI too low, buyer will not purchase

---

### 4. Equilibrium Analysis

**What You See**:
- Seller Floor vs Buyer Ceiling comparison
- Equilibrium zone (if it exists)
- Recommended pricing strategy
- Gap analysis (if equilibrium doesn't exist)

**Possible Outcomes**:

#### Scenario 1: Equilibrium Exists (Floor < Ceiling)
```
Seller Floor:     R500
Buyer Ceiling:    R2,000
Equilibrium Zone: R500 - R2,000
Suggested Price:  R1,250 (midpoint)

Status: ✅ WIN-WIN PRICING POSSIBLE
```

**What This Means**:
- You can meet margin targets AND deliver compelling buyer ROI
- You have pricing flexibility within the R500 - R2,000 range
- Balanced pricing at R1,250 splits the value fairly

**Recommended Strategies**:
- **Minimum Viable** (R500): Competitive pricing, penetrate market quickly
- **Balanced** (R1,250): Fair value split, sustainable growth
- **Maximum Capture** (R2,000): Premium positioning, maximize profit

---

#### Scenario 2: No Equilibrium (Floor > Ceiling)
```
Seller Floor:     R800
Buyer Ceiling:    R600
Gap:              R200 (33% shortfall)

Status: ❌ NO WIN-WIN PRICING
```

**What This Means**:
- Your minimum price (R800) exceeds buyer's maximum willingness to pay (R600)
- No price exists where both seller and buyer win
- Fundamental business model problem

**Solutions**:
1. **Reduce Costs**: Lower cost to serve from R640 to R480 → seller floor drops to R600
2. **Increase Buyer Value**: Enhance product to deliver R2,000 value → buyer ceiling rises to R800
3. **Reduce Margin Target**: Accept 60% margin instead of 70% → seller floor drops to R600
4. **Pivot Business Model**: This pricing model may not work for your product

---

#### Scenario 3: Underpricing (Price < Floor)
```
Current Price:    R400
Seller Floor:     R500
Status:           ⚠️ BELOW MINIMUM

Your margin: 20% (target: 70%)
```

**What This Means**:
- You're not meeting margin targets
- Leaving profit on the table
- Potentially unsustainable pricing

**Actions**:
- Increase price to at least R500 (seller floor)
- Or reduce costs to lower the floor
- Or accept lower margin if strategically justified (market penetration, land-and-expand)

---

#### Scenario 4: Overpricing (Price > Ceiling)
```
Current Price:    R2,500
Buyer Ceiling:    R2,000
Status:           ⚠️ ABOVE MAXIMUM

Buyer ROI: 2.0x (threshold: 2.5x)
```

**What This Means**:
- Buyer ROI below acceptable threshold
- Price resistance likely
- Conversion rates may suffer

**Actions**:
- Reduce price to R2,000 or below (buyer ceiling)
- Or increase value delivered to justify R2,500 price
- Or target different buyer segment with higher value realization

---

## Common Scenarios & Examples

### Scenario 1: SaaS Subscription Pricing for CRM

**Context**: You're launching a South African CRM for SMBs

**Inputs**:
- Cost to serve: R200/customer/month (hosting, support, development)
- Desired margin: 75%
- Buyer value: R8,000/month (saves 20 hours × R400/hour in manual admin)

**Calculator Results**:
```
Seller Floor:     R800
Buyer Ceiling:    R3,200 (R8,000 ÷ 2.5)
Equilibrium Zone: R800 - R3,200
Balanced Price:   R2,000

At R2,000/month:
├── Your Margin: 90% (R1,800 profit)
├── Buyer ROI: 4x (excellent)
└── Status: ✅ Strong win-win
```

**Recommendation**: Price at R1,500 - R2,000 for balanced positioning

---

### Scenario 2: Usage-Based API Pricing

**Context**: SMS API service for developers

**Inputs**:
- Cost per 1,000 SMS: R30 (carrier fees, infrastructure)
- Desired margin: 60%
- Buyer value per 1,000 SMS: R200 (customer engagement, sales conversions)

**Calculator Results**:
```
Seller Floor:     R75 per 1,000 SMS
Buyer Ceiling:    R67 per 1,000 SMS (R200 ÷ 3x)
Gap:              -R8 (no equilibrium!)

Status: ❌ Business model issue
```

**Problem**: Costs too high relative to buyer value

**Solutions**:
1. **Negotiate better carrier rates**: Get cost to R20 → floor drops to R50 (below R67 ceiling)
2. **Increase buyer value**: Add delivery analytics, templates → value rises to R300 → ceiling rises to R100
3. **Target different segment**: Enterprise customers may value SMS at R500+ per 1,000

---

### Scenario 3: Per-Seat Collaboration Tool

**Context**: Team chat and collaboration platform

**Inputs**:
- Cost per seat: R50/month (hosting, support)
- Desired margin: 80%
- Buyer value per seat: R1,500/month (productivity gains, reduced email overhead)

**Calculator Results**:
```
Seller Floor:     R250 per seat
Buyer Ceiling:    R600 per seat (R1,500 ÷ 2.5)
Equilibrium Zone: R250 - R600
Balanced Price:   R425 per seat

At R425/seat:
├── Your Margin: 88%
├── Buyer ROI: 3.5x
└── Status: ✅ Win-win
```

**Competitive Analysis**:
- Slack: ~R150/user (international)
- Microsoft Teams: Bundled with Office 365
- Your pricing: R425 (premium but justified by local support + customization)

**Recommendation**: Price at R399 - R450 per seat, emphasize local support and ZAR billing

---

### Scenario 4: One-Time Software License

**Context**: Accounting software for small businesses

**Inputs**:
- Cost to deliver: R1,000 (development, support, packaging)
- Desired margin: 70%
- Buyer value: R50,000 over 5 years (R10,000/year in accounting fees saved)
- ROI threshold: 5x (one-time purchases require higher ROI)

**Calculator Results**:
```
Seller Floor:     R3,333 (R1,000 ÷ 0.30)
Buyer Ceiling:    R10,000 (R50,000 ÷ 5x)
Equilibrium Zone: R3,333 - R10,000
Balanced Price:   R6,667

At R6,667:
├── Your Margin: 85%
├── Buyer ROI: 7.5x (over 5 years)
└── Status: ✅ Excellent value
```

**Annual Maintenance Option**:
- 20% annual maintenance: R1,333/year
- Year 1 revenue: R6,667 (license) + R1,333 (maintenance) = R8,000
- Recurring revenue years 2-5: R1,333/year

**Recommendation**: Price at R5,995 - R7,995 perpetual + 20% annual maintenance

---

### Scenario 5: Marketplace Platform

**Context**: Freelance marketplace for South African designers

**Inputs**:
- Cost per transaction: R15 (payment processing, escrow, support)
- Desired margin: 70%
- Average transaction: R2,500
- Buyer value: R25,000 (trust, discovery, payment protection)
- ROI threshold: 10x (marketplaces require overcoming high friction)

**Calculator Results**:
```
Seller Floor:     R50 per transaction (2% of R2,500)
Buyer Ceiling:    R2,500 per transaction (R25,000 ÷ 10x = 10% of transaction)
Equilibrium Zone: R50 - R250
Balanced Price:   R150 per transaction (6% commission)

At 6% commission (R150):
├── Your Margin: 90%
├── Buyer ROI: 167x (R25,000 ÷ R150)
└── Status: ✅ Massive buyer value
```

**Competitive Benchmarks**:
- Upwork: 10-20% (international)
- Fiverr: 20% (international)
- Local platforms: 5-15%

**Recommendation**: Launch at 8-10% commission, reduce to 5% for high-volume users

---

## Best Practices

### 1. Start with Buyer Value

**Why**: Pricing disconnected from value always fails

**How to Estimate Buyer Value**:
- **Revenue Enabled**: "Our product helps customers make R_____ per month"
  - Example: Sales CRM enables R50,000 additional sales/month
- **Cost Saved**: "Our product saves customers R_____ per month"
  - Example: Automation tool saves 40 hours × R500/hour = R20,000/month
- **Risk Reduced**: "Our product prevents R_____ in potential losses"
  - Example: Backup service prevents R100,000 data loss risk

**Validate Your Assumptions**:
- Talk to 10+ potential customers
- Ask: "How much would you pay for [specific outcome]?"
- Benchmark against alternatives (competitors, manual processes)

---

### 2. Know Your True Costs

**Why**: Underestimating costs leads to unsustainable pricing

**Costs to Include**:
- **Direct Costs**: Hosting, infrastructure, third-party services, transaction fees
- **Support Costs**: Customer support time, onboarding, training
- **Development Costs**: Bug fixes, maintenance, updates (amortized)
- **Sales & Marketing**: For CAC-sensitive models

**Example Cost Breakdown (SaaS)**:
```
Per Customer/Month:
├── Hosting & infrastructure: R50
├── Support (2 hours/month × R200/hour): R40
├── Development (amortized): R30
├── Payment processing (2% of R500): R10
└── Total Cost to Serve: R130
```

---

### 3. Set Realistic Margin Targets

**Industry Benchmarks**:
- **SaaS**: 70-90% gross margin (world-class: 80%+)
- **Services**: 40-60% gross margin
- **Marketplaces**: 60-80% gross margin (low incremental costs)
- **Hardware/Physical**: 30-50% gross margin

**Why Margins Matter**:
- Gross margin must cover fixed costs (salaries, rent, marketing)
- SaaS needs high margins to fund growth and survive churn
- Lower margins = less room for error, slower growth

---

### 4. Understand ROI Thresholds

**Why Different Models Have Different Thresholds**:
- **Subscription (2.5x)**: Monthly commitment, easy to cancel
- **Usage-Based (3x)**: Variable costs, harder to predict
- **Per-Seat (2.5x)**: Similar to subscription
- **One-Time (5x)**: Large upfront commitment, higher perceived risk
- **Marketplace (10x)**: High friction, alternatives readily available

**How to Increase Acceptable ROI Threshold**:
- Build trust (case studies, testimonials, trials)
- Reduce risk (money-back guarantee, month-to-month)
- Improve UX (easier setup, faster time-to-value)

---

### 5. Test Your Assumptions

**Validate Before Launch**:
1. **Cost Assumptions**: Build a pilot or MVP to measure actual costs
2. **Value Assumptions**: Run customer interviews, ask willingness-to-pay questions
3. **Pricing Sensitivity**: Test 3 price points (low, medium, high) with sample customers

**Iterate After Launch**:
- Monitor conversion rates by price point
- Track customer feedback on pricing
- Measure actual costs vs estimates
- Adjust pricing annually or when value increases significantly

---

## Troubleshooting

### Issue: "No equilibrium exists - seller floor exceeds buyer ceiling"

**Causes**:
1. Costs too high relative to value delivered
2. Margin target too aggressive
3. Buyer value estimate too low
4. Wrong pricing model for your product

**Solutions**:
1. **Reduce costs**: Optimize infrastructure, automate support, negotiate vendor contracts
2. **Lower margin target**: Accept 60% instead of 80% (if sustainable)
3. **Increase buyer value**: Add features, improve UX, target higher-value use cases
4. **Change pricing model**: Try different model (e.g., usage-based instead of subscription)

---

### Issue: "Buyer ROI is too low"

**Diagnosis**: Price exceeds buyer ceiling

**Solutions**:
1. **Lower price**: Reduce to buyer ceiling or below
2. **Increase value**: Add features, integrations, support that increase buyer value
3. **Segment customers**: Target enterprise customers with higher value realization
4. **Change value metric**: Reposition product around higher-value outcome

---

### Issue: "Margin is below target"

**Diagnosis**: Price below seller floor

**Solutions**:
1. **Increase price**: Raise to seller floor (if buyer ceiling allows)
2. **Reduce costs**: Cut infrastructure, automate processes, outsource non-core
3. **Accept lower margin temporarily**: If strategically justified (land-and-expand, network effects)

---

### Issue: "Unsure which pricing model to use"

**Decision Framework**:

**Use Subscription when**:
- Continuous value delivery (SaaS platforms, monitoring, backups)
- Predictable costs to serve
- Want recurring revenue stability

**Use Usage-Based when**:
- Variable customer usage patterns
- Cost scales with usage (API calls, transactions, storage)
- Customers prefer "pay for what you use"

**Use Per-Seat when**:
- Value increases with number of users (collaboration, communication)
- Costs scale with user count
- Easy to understand and sell

**Use One-Time when**:
- Software has long-term utility (5+ years)
- Customers prefer ownership
- Low ongoing costs to serve

**Use Marketplace when**:
- Facilitating transactions between parties
- Providing trust/discovery infrastructure
- Revenue tied to transaction volume

---

## FAQ

### Q: Can I use multiple pricing models simultaneously?

**A**: Yes! Many successful companies use hybrid models:
- **Base subscription + usage overages**: Mailchimp (plan + extra emails)
- **Per-seat + usage**: Slack (per user + extra integrations)
- **License + maintenance**: Microsoft Office (perpetual + annual updates)

Use this calculator to model each component separately, then combine.

---

### Q: How often should I revisit my pricing?

**A**:
- **Annually**: Review costs, value delivery, competitive landscape
- **After major feature launches**: New value = potential pricing increase
- **When costs change significantly**: Infrastructure costs up/down 20%+
- **Market shifts**: New competitors, economic changes

**Caution**: Frequent price changes frustrate customers. Grandfather existing customers when possible.

---

### Q: What if my costs change over time?

**A**: Model scenarios:
- **Economies of scale**: Costs decrease as volume grows (infrastructure discounts, automation)
- **Cost increases**: Inflation, vendor price hikes, new compliance requirements

Run calculator at different cost levels to understand pricing implications.

---

### Q: How do I handle different customer segments with different value realization?

**A**: Create tiered pricing:
- **SMB Tier**: R500/month (R5,000 value = 10x ROI)
- **Mid-Market**: R2,000/month (R30,000 value = 15x ROI)
- **Enterprise**: R10,000/month (R200,000 value = 20x ROI)

Run calculator separately for each segment.

---

### Q: What if competitors are priced much lower?

**A**:
1. **Validate value differentiation**: If you deliver 3x more value, you can charge 3x more
2. **Segment differently**: Target customers who value your unique features
3. **Compete on non-price**: Service, support, local presence, customization
4. **Question their sustainability**: Are they profitable? VC-subsidized? Worth matching?

**Don't compete on price alone** - race to bottom benefits no one.

---

### Q: How do I price a completely new product category?

**A**:
1. **Anchor to buyer value**: What's the monetary outcome? (Revenue, cost savings, risk reduction)
2. **Use value-based pricing**: Price at 20-40% of value delivered (2.5x - 5x ROI)
3. **Test willingness to pay**: Customer interviews, landing page tests, pilot pricing
4. **Start high, adjust down**: Easier to lower prices than raise them

---

### Q: Should I offer discounts?

**A**:
- **Annual prepay**: 10-20% discount (improves cash flow, reduces churn)
- **Volume**: Tiered pricing for higher usage/seats
- **Avoid**: Arbitrary discounts, "because competitor did"

**Discounts should be strategic**, not reactive.

---

### Q: What about freemium or free trials?

**A**: This calculator focuses on paid pricing. For freemium:
- Offer limited free tier to demonstrate value
- Free → Paid conversion: 2-5% typical
- Use this calculator to price paid tiers based on value delivered

---

### Q: My calculator shows strong equilibrium, but customers still won't buy. Why?

**Possible Causes**:
1. **Value not realized**: You estimated R10k value, but customer only experiences R2k
2. **Perception problem**: Value exists but not communicated clearly
3. **Trust gap**: New vendor, no case studies, lack of social proof
4. **Competitive alternatives**: Better options available
5. **Budget constraints**: Value exists, but customer has no budget

**Actions**: Customer research, improve messaging, build trust, validate value assumptions

---

## Need More Help?

### For Technical Questions
- See **[CALCULATIONS.md](CALCULATIONS.md)** for detailed formula explanations
- See **[CLAUDE.md](../CLAUDE.md)** for developer documentation

### For Pricing Strategy
- Consult pricing experts or fractional CFOs
- Read: "Monetizing Innovation" by Madhavan Ramanujam
- Study competitors' pricing pages and value propositions

### For Product Questions
- Open a GitHub issue: [github.com/devmade-ai/model-pear/issues](https://github.com/devmade-ai/model-pear/issues)

---

**Last Updated**: January 2026

**Version**: 2.0 (Simplified 5-Model Equilibrium Calculator)
