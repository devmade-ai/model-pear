# Software Transaction Tool

A dual-mode tool for South African B2B software businesses:
1. **Pricing Calculator**: Find equilibrium between seller costs and buyer value
2. **Inter-Company Tool**: Structure and analyse inter-company software transactions

## What It Does

### Inter-Company Tool Mode (Default)
Analyse inter-company software transactions from **three perspectives**:
- **Developer Perspective**: Revenue recognition, costs, profit, tax position
- **Buyer Perspective**: Asset capitalisation, amortisation, Section 11(e) tax benefits
- **Combined Perspective**: Group consolidation, profit elimination, efficiency analysis

### Pricing Calculator Mode
Find the **sweet spot** in pricing by showing you:
- **Seller Perspective**: Minimum price needed to meet your margin goals
- **Buyer Perspective**: Maximum price buyers will pay based on value received
- **Equilibrium Zone**: The range where both seller and buyer win

No growth projections, no complicated forecasting - just clear unit economics and transaction structuring.

## The 5 Pricing Models

1. **Subscription (SaaS)** - Monthly recurring revenue per customer
2. **Usage-Based** - Pay per unit consumed (API calls, transactions, build minutes)
3. **Per-Seat (Per User)** - Price per active user or seat
4. **One-Time Purchase** - Upfront license fee + optional annual maintenance
5. **Marketplace (Two-Sided)** - Commission-based marketplace

## The 6 Inter-Company Models

| Model | Name | Description | Status |
|-------|------|-------------|--------|
| 1 | Development Services | Cost-plus software development | ✅ Implemented |
| 2 | Software Licence | Perpetual/term licences with royalties | ✅ Implemented |
| 3 | Joint Development | Cost-sharing arrangements | Planned |
| 4 | Build-Operate-Transfer | BOT/BTO/BOO structures | Planned |
| 5 | Software Sale | Asset sale with ongoing support | Planned |
| 6 | SaaS/Subscription | Enhanced subscription model | ✅ Implemented |

Each inter-company model includes:
- Multiple variants (e.g., Model 1 has 6 variants: 1A-1F)
- Three-perspective calculations (Developer, Buyer, Combined)
- South African tax treatment (Section 11(e), CGT, deferred tax)
- Transfer pricing risk assessment

## Key Features

### Pricing Calculator
- **Reverse Calculations**: Auto-calculate missing inputs (price, costs, margin, buyer value)
- **Equilibrium Analysis**: Find win-win pricing zones

### Inter-Company Tool
- **Three-Perspective View**: Developer, Buyer, Combined (consolidation)
- **Entity Configuration**: Customise developer/buyer settings
- **Transfer Pricing**: Risk assessment with arm's length benchmarks
- **Tax Calculations**: Section 11(e), deferred tax, CGT

### Both Modes
- **South African Defaults**: Pre-configured for SA group companies (IFRS, 27% tax, consolidation enabled). See [Default Entity Configuration](BUSINESS_GUIDE.md#default-entity-configuration) for full explanation of why each setting is selected.
- **Static Unit Economics**: No month-by-month projections - just simple math
- **No Installation**: Runs entirely in the browser
- **Comprehensive Help System**: Click info icons (`ⓘ`) throughout for detailed explanations, formulas, and use cases
- **Accessibility First**: Full keyboard navigation, ARIA support, screen reader friendly
- **Mobile Optimized**: Responsive design with touch-friendly controls
- **Real-time Validation**: Inline feedback as you type with helpful suggestions

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
- **[UI_UX_GUIDE.md](UI_UX_GUIDE.md)** - Accessibility, keyboard shortcuts, and UX features

**For Understanding the Math:**
- **[CALCULATIONS.md](CALCULATIONS.md)** - All formulas, rationale, and economic theory explained

**For Inter-Company Transactions:**
- **[financial_models_intercompany_software.md](financial_models_intercompany_software.md)** - Framework overview
- **[model_1_cost_plus_concept.md](model_1_cost_plus_concept.md)** - Model 1 specifications
- **[model_2_licence_royalties_concept.md](model_2_licence_royalties_concept.md)** - Model 2 specifications
- **[model_6_saas_subscription_concept.md](model_6_saas_subscription_concept.md)** - Model 6 specifications
- **[IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)** - 13-phase implementation plan

**For Developers:**
- **[claude.md](../claude.md)** - Technical architecture and development guide (AI assistant context)
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
