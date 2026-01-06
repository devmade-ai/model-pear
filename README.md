# Pricing Equilibrium Calculator

A simple, focused pricing tool for South African B2B software businesses to find equilibrium between seller costs and buyer value.

## Overview

This tool helps you find the **sweet spot** in pricing by showing you:
- **Seller Perspective**: Minimum price needed to meet your margin goals
- **Buyer Perspective**: Maximum price buyers will pay based on value received
- **Equilibrium Zone**: The range where both seller and buyer win

No growth projections, no complicated forecasting - just clear unit economics to help you price realistically.

## Key Features

- **5 Core Pricing Models**: Subscription, Usage-Based, Per-Seat, One-Time License, Marketplace
- **Reverse Calculations**: Auto-calculate missing inputs
  - Calculate optimal price from costs and buyer value
  - Calculate required buyer value from target price
  - Calculate achievable margin from current pricing
  - Calculate maximum cost ceiling from pricing targets
- **Three-Perspective View**:
  - Revenue & Profit Overview
  - Seller Economics (cost + margin analysis)
  - Buyer Economics (value + ROI analysis)
  - Equilibrium Analysis (floor vs ceiling pricing)
- **South African Defaults**: Realistic ZAR pricing across all models
- **Static Unit Economics**: No month-by-month projections - just simple math
- **No Installation**: Runs entirely in the browser

## The 5 Pricing Models

### 1. Subscription (SaaS)
Monthly recurring revenue per customer.
- **Example**: R500/month × 100 customers = R50,000 MRR
- **Use for**: SaaS platforms, cloud software, recurring services

### 2. Usage-Based
Pay per unit consumed (API calls, transactions, build minutes).
- **Example**: R2 per 1,000 API calls × 10,000 units = R20,000/month
- **Use for**: APIs, CI/CD platforms, payment processing

### 3. Per-Seat (Per User)
Price per active user or seat.
- **Example**: R250/seat × 25 users = R6,250/month
- **Use for**: Collaboration tools, business software, developer tools

### 4. One-Time Purchase (Perpetual License)
Upfront license fee + optional annual maintenance.
- **Example**: R5,000 license + 20% annual maintenance
- **Use for**: Desktop software, enterprise platforms, accounting software

### 5. Marketplace (Two-Sided)
Commission-based marketplace connecting buyers and sellers.
- **Example**: 10% commission on R500 avg transaction
- **Use for**: Freelance platforms, supplier marketplaces, service booking

## How It Works

### Seller Inputs
- Cost to serve/deliver per unit
- Desired gross margin %

### Buyer Inputs
- Value received per unit (revenue enabled or cost saved)

### The Calculator Shows You
1. **Seller Floor**: Minimum price to meet your margin (e.g., R350/month)
2. **Buyer Ceiling**: Maximum price buyer will pay based on value (e.g., R2,000/month)
3. **Equilibrium Zone**: R350 - R2,000
4. **Suggested Price**: R1,175 (midpoint)

### Example: Subscription SaaS

**Your costs:**
- Cost to serve: R150/customer/month
- Desired margin: 70%
→ **Minimum price: R500/month**

**Buyer value:**
- Value received: R5,000/month (cost savings)
- Acceptable ROI: 2.5x minimum
→ **Maximum price: R2,000/month**

**Equilibrium:**
- Floor: R500 (your minimum)
- Ceiling: R2,000 (buyer's maximum)
- **Suggested: R1,250** (balanced pricing)
- Result: 75% margin for you, 4x ROI for buyer = win-win

## Getting Started

### Online
Visit: `https://[your-username].github.io/model-pear`

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/[username]/model-pear.git
   cd model-pear
   ```

2. Open in your browser:
   ```bash
   # macOS
   open index.html

   # Linux
   xdg-open index.html

   # Windows
   start index.html
   ```

No build process needed - it's pure HTML/CSS/JS.

## Quick Start Guide

### Option 1: Manual Entry (Traditional)

1. **Select a pricing model** from the 5 options
2. **Choose calculation mode**: "Enter All Inputs Manually"
3. **Enter your inputs**:
   - **Pricing**: Current price and volume
   - **Seller Costs**: Cost to serve/deliver + desired margin
   - **Buyer Value**: Value your product delivers to customers
4. **Click Calculate**
5. **View results** across three perspectives:
   - Revenue & profit overview
   - Seller perspective (are you meeting margin goals?)
   - Buyer perspective (is ROI compelling?)
   - Equilibrium analysis (is there a pricing sweet spot?)

### Option 2: Calculate Missing Input (NEW!)

1. **Select a pricing model** from the 5 options
2. **Choose what to calculate**:
   - **Calculate Optimal Price**: Find best price from costs & buyer value
   - **Calculate Required Buyer Value**: How much value to deliver?
   - **Calculate Achievable Margin**: What margin at current price?
   - **Calculate Maximum Cost**: What's your cost ceiling?
3. **For price calculation, select pricing strategy**:
   - Minimum Viable (seller floor - most competitive)
   - Balanced (midpoint - recommended)
   - Maximum Capture (buyer ceiling - highest profit)
4. **Enter your known inputs** (calculator auto-fills the missing one)
5. **View results** - the calculated field updates in real-time

### Example: Calculate Optimal Price

**You know:**
- Cost to serve: R150/month
- Desired margin: 70%
- Buyer value: R5,000/month

**Calculator finds:**
- Seller floor: R500 (meets your 70% margin)
- Buyer ceiling: R2,000 (maintains 2.5x ROI)
- **Balanced price: R1,250** (88% margin, 4x ROI - win-win!)

💡 **Want to understand the math?** See [CALCULATIONS.md](CALCULATIONS.md) for detailed explanations of all formulas and rationale.

## Field State Management

When using calculation modes:
- Only ONE field is ever auto-calculated and locked at a time
- Switching between modes automatically unlocks the previous field
- The locked field shows yellow styling and an "Auto-calculated" badge
- Switching to "Manual Entry" unlocks all fields

## Technology Stack

- **HTML5** - Structure
- **ES6 JavaScript** - Modular architecture
- **Tailwind CSS** - Styling (via CDN)
- **ApexCharts** - Data visualization
- **GitHub Pages** - Free hosting

## Project Structure

```
model-pear/
├── index.html              # Main page
├── app.js                  # Application initialization
├── config/
│   ├── constants.js        # Global configuration
│   └── sa-pricing-defaults.js  # South African pricing data
├── models/
│   └── index.js            # 5 pricing model definitions
├── calculators/
│   ├── engine.js           # Calculation engine
│   └── reverse-calculations.js  # Auto-calculate missing inputs
├── ui/
│   ├── forms.js            # Input form generation
│   ├── results-display.js  # Results visualization
│   └── initialization.js   # UI setup
├── charts/
│   └── index.js            # Chart rendering
└── utils/
    └── index.js            # Formatting & utilities
```

## Key Differences from Complex Calculators

### What This Tool DOESN'T Have (By Design)
- ❌ Month-by-month revenue projections
- ❌ Growth rate assumptions
- ❌ Churn rate modeling
- ❌ Customer acquisition cost calculations
- ❌ Complex scenario planning
- ❌ 20+ pricing models to choose from
- ❌ Multiple calculator modes

### What This Tool DOES Have (Intentionally Simple)
- ✅ Static unit economics (units × price = revenue)
- ✅ Seller cost + margin analysis
- ✅ Buyer value + ROI analysis
- ✅ Equilibrium pricing (seller floor vs buyer ceiling)
- ✅ 5 core pricing models only
- ✅ South African defaults
- ✅ Single, focused calculator mode

## Use Cases

### For Founders
- "What should I charge for my SaaS product?"
- "Is my pricing sustainable given my costs?"
- "Will buyers find my pricing compelling?"

### For Product Managers
- "Which pricing model makes sense for this feature?"
- "How do I price to create a win-win?"

### For Finance Teams
- "What's our minimum viable price?"
- "What margin are we actually achieving?"

## Philosophy

**Pricing should be simple:**
1. Know your costs
2. Set a margin target
3. Understand buyer value
4. Find the equilibrium

This tool helps you do exactly that - no more, no less.

## Documentation

### For Users
- **[README.md](README.md)** (this file) - Overview and quick start guide
- **[CALCULATIONS.md](CALCULATIONS.md)** - Complete explanation of all formulas, rationale, and examples

### For Developers
- **[SIMPLIFICATION_SUMMARY.md](SIMPLIFICATION_SUMMARY.md)** - Transition from old to new system
- **[TODO_REMAINING_WORK.md](TODO_REMAINING_WORK.md)** - Development progress tracking

## Contributing

This is an open-source project. Contributions welcome!

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open a GitHub issue.
