# Pricing Equilibrium Calculator

A focused pricing tool for South African B2B software businesses to find equilibrium between seller costs and buyer value.

## What It Does

This tool helps you find the **sweet spot** in pricing by showing you:
- **Seller Perspective**: Minimum price needed to meet your margin goals
- **Buyer Perspective**: Maximum price buyers will pay based on value received
- **Equilibrium Zone**: The range where both seller and buyer win

No growth projections, no complicated forecasting - just clear unit economics to help you price realistically.

## The 5 Pricing Models

1. **Subscription (SaaS)** - Monthly recurring revenue per customer
2. **Usage-Based** - Pay per unit consumed (API calls, transactions, build minutes)
3. **Per-Seat (Per User)** - Price per active user or seat
4. **One-Time Purchase** - Upfront license fee + optional annual maintenance
5. **Marketplace (Two-Sided)** - Commission-based marketplace

## Key Features

- **Reverse Calculations**: Auto-calculate missing inputs (price, costs, margin, buyer value)
- **Three-Perspective View**: Revenue & Profit, Seller Economics, Buyer Economics, Equilibrium Analysis
- **South African Defaults**: Realistic ZAR pricing across all models
- **Static Unit Economics**: No month-by-month projections - just simple math
- **No Installation**: Runs entirely in the browser

## Quick Start

### Online
Visit: `https://[your-username].github.io/model-pear`

### Local Development

```bash
git clone https://github.com/[username]/model-pear.git
cd model-pear
open index.html  # macOS
# or xdg-open index.html (Linux)
# or start index.html (Windows)
```

No build process needed - it's pure HTML/CSS/JS.

## Example: Finding Equilibrium

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

## Documentation

**For Business Users & Product Teams:**
- **[BUSINESS_GUIDE.md](BUSINESS_GUIDE.md)** - Complete user guide with tutorials and examples

**For Understanding the Math:**
- **[CALCULATIONS.md](CALCULATIONS.md)** - All formulas, rationale, and economic theory explained

**For Developers:**
- **[claude.md](claude.md)** - Technical architecture and development guide
- **[HISTORY.md](HISTORY.md)** - Changelog and bug fixes

## Technology Stack

- **HTML5** - Structure
- **ES6 JavaScript** - Modular architecture (16 modules, ~6,800 lines)
- **Tailwind CSS** - Styling (via CDN)
- **ApexCharts** - Data visualization
- **GitHub Pages** - Free hosting

## Philosophy

**Pricing should be simple:**
1. Know your costs
2. Set a margin target
3. Understand buyer value
4. Find the equilibrium

This tool helps you do exactly that - no more, no less.

## Contributing

This is an open-source project. Contributions welcome!

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open a GitHub issue.
