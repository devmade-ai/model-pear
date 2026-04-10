# Software Transaction Structuring Tool

A dual-mode tool for South African B2B software companies:
1. **Pricing Calculator**: Find equilibrium between seller costs and buyer value
2. **Transaction Structuring Tool**: Compare transaction models to optimize outcomes for both parties

## What It Does

### Transaction Structuring Mode (Default)
Analyse software transactions from **two perspectives**:
- **Your Company**: Revenue recognition, costs, profit, tax position
- **Client**: Asset capitalisation, amortisation, Section 11(e) tax benefits

### Pricing Calculator Mode
Find the **sweet spot** in pricing by showing you:
- **Seller Perspective**: Minimum price needed to meet your margin goals
- **Buyer Perspective**: Maximum price buyers will pay based on value received
- **Equilibrium Zone**: The range where both seller and buyer win

## The 5 Pricing Models

1. **Subscription (SaaS)** - Monthly recurring revenue per customer
2. **Usage-Based** - Pay per unit consumed (API calls, transactions, build minutes)
3. **Per-Seat (Per User)** - Price per active user or seat
4. **One-Time Purchase** - Upfront license fee + optional annual maintenance
5. **Marketplace (Two-Sided)** - Commission-based marketplace

## The 6 Transaction Models

| Model | Name | Variants |
|-------|------|----------|
| 1 | Development Services (Cost-Plus) | 6 (1A-1F) |
| 2 | Software Licence with Royalties | 8 (2A-2H) |
| 3 | Joint Development / Cost-Sharing | 8 (3A-3H) |
| 4 | Build-Operate-Transfer (BOT) | 8 (4A-4H) |
| 5 | Software Sale with Ongoing Support | 8 (5A-5H) |
| 6 | SaaS/Subscription Enhancement | 9 (6A-6I) |

## Key Features

- **Two-Perspective View**: Your Company, Client
- **Structure Selector Wizard**: Guided model selection
- **Options Overview**: Visual grid of all 6 models
- **Compare Mode**: Save and compare up to 4 options side-by-side
- **Sensitivity Analysis**: Best/base/worst scenarios with tornado charts
- **Growth Projections**: NPV, IRR, payback period calculations
- **South African Tax**: Section 11(e), deferred tax, CGT calculations
- **Transfer Pricing**: Risk scoring for related party transactions
- **Export**: JSON, CSV, and PDF export of results and comparisons

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests (301 unit tests)
pnpm test

# Build for production
pnpm build

# Run E2E tests
pnpm test:e2e
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript |
| Framework | SvelteKit 2.x |
| Styling | Tailwind CSS |
| Charts | ApexCharts |
| Build | Vite |
| Testing | Vitest + Playwright |
| Package Manager | pnpm |
| Hosting | Vercel |

## Documentation

| Document | Description |
|----------|-------------|
| **[BUSINESS_GUIDE.md](BUSINESS_GUIDE.md)** | Complete user guide with tutorials |
| **[CALCULATIONS.md](CALCULATIONS.md)** | All formulas and economic theory |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Technical architecture |
| **[model-use-cases/](model-use-cases/)** | When to use each model variant |
| **[CLAUDE.md](../CLAUDE.md)** | AI assistant context and development guide |
| **[HISTORY.md](HISTORY.md)** | Changelog and bug fixes |

## Example: Finding Equilibrium

**Your costs:**
- Cost to serve: R150/customer/month
- Desired margin: 70%
- **Minimum price: R500/month**

**Buyer value:**
- Value received: R5,000/month (cost savings)
- Acceptable ROI: 2.5x minimum
- **Maximum price: R2,000/month**

**Equilibrium:**
- Floor: R500 (your minimum)
- Ceiling: R2,000 (buyer's maximum)
- **Suggested: R1,250** (balanced pricing)
- Result: 75% margin for you, 4x ROI for buyer = win-win

## Contributing

This is an open-source project. Contributions welcome!

## License

MIT License - see LICENSE file for details
