# Software Transaction Tool

> **Purpose**: AI assistant context file for the Software Transaction Tool
> **Last Updated**: January 2026
> **Status**: Active - Dual-mode tool with Pricing Calculator (5 models) and Inter-Company Transaction Tool (6 models)

## System Purpose

This tool exists to help **an owner of two companies** (a seller company and a buyer company) with:

1. **Pricing Calculator**: Find pricing that works for both sides (equilibrium pricing)
2. **Inter-Company Tool**: Structure and analyse inter-company software transactions with proper accounting, tax, and transfer pricing treatment

**The core questions**:
- Pricing: What price lets the seller make their target margin while giving the buyer compelling ROI?
- Inter-Company: How should we structure this transaction for optimal accounting treatment, tax efficiency, and transfer pricing compliance?

**Why this matters**: Most pricing tools focus only on the seller's perspective. This tool shows both sides simultaneously, revealing whether a sustainable business relationship is possible AND how to properly account for it.

## Architecture

### Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| ES6 JavaScript | 12 modules (~4,600 lines) |
| Tailwind CSS (CDN) | Styling |
| ApexCharts (CDN) | Equilibrium visualization |
| GitHub Pages | Free hosting, no backend |

### File Structure

```
model-pear/
├── index.html              # Entry point (dual-mode: pricing + intercompany)
├── styles.css              # Custom styles
├── app.js                  # Orchestrator (sets up dependencies, mode switching)
│
├── config/
│   ├── constants.js        # Chart colors, global config
│   └── sa-pricing-defaults.js  # South African market defaults (ZAR)
│
├── state/
│   └── app-state.js        # Pub/sub state management for both modes
│
├── models/
│   ├── index.js            # 5 pricing models with calculation logic
│   └── intercompany/       # NEW: Inter-company transaction models
│       ├── registry.js     # Model registry with helper functions
│       └── model-1-cost-plus.js  # Model 1: Development Services (6 variants)
│
├── calculators/
│   ├── engine.js           # Main calculation engine (pricing)
│   └── reverse-calculations.js  # Auto-calculate missing inputs
│
├── ui/
│   ├── initialization.js   # App startup
│   ├── forms.js            # Dynamic form generation
│   ├── results-display.js  # Render result panels (pricing)
│   ├── modals.js           # Tooltips and modals
│   └── intercompany/       # NEW: Inter-company UI components
│       ├── calculator.js       # Main inter-company calculator
│       ├── entity-config.js    # Developer/Buyer entity configuration
│       ├── perspective-toggle.js  # Three-perspective switcher
│       └── results-display.js  # Three-perspective results rendering
│
├── charts/
│   └── index.js            # Equilibrium chart rendering
│
├── utils/
│   └── index.js            # Formatting, validation, helpers
│
├── claude.md               # This file (AI assistant context, must be in root)
│
└── docs/
    ├── README.md           # Quick start
    ├── BUSINESS_GUIDE.md   # User guide with tutorials
    ├── CALCULATIONS.md     # Formula explanations
    ├── UI_UX_GUIDE.md      # Accessibility features
    ├── HISTORY.md          # Changelog
    ├── IMPLEMENTATION_ROADMAP.md  # NEW: 13-phase implementation plan
    ├── PHASE_0_PREPARATION.md     # NEW: Phase 0 audit findings
    ├── financial_models_intercompany_software.md  # Framework overview
    └── model_*_concept.md  # Concept docs for Models 1-6
```

## The 5 Pricing Models

Each model answers the same core question from two perspectives:

### 1. Subscription (SaaS)
**Use case**: Monthly recurring revenue per customer

| Perspective | Key Question |
|-------------|--------------|
| Seller | "What's my minimum price to cover R150 cost and hit 70% margin?" |
| Buyer | "Is paying R500/month worth it if I save R5,000/month?" |

### 2. Usage-Based
**Use case**: Pay per unit (API calls, transactions, build minutes)

| Perspective | Key Question |
|-------------|--------------|
| Seller | "What price per unit covers my R0.50 cost and hits 75% margin?" |
| Buyer | "Is R2 per unit worth it if each unit generates R10 value?" |

### 3. Per-Seat (Per User)
**Use case**: Price per active user/seat per month

| Perspective | Key Question |
|-------------|--------------|
| Seller | "What seat price covers R70 cost and hits 72% margin?" |
| Buyer | "Is R250/seat worth it if each seat saves R2,000 in productivity?" |

### 4. One-Time Purchase
**Use case**: Upfront license fee + optional annual maintenance

| Perspective | Key Question |
|-------------|--------------|
| Seller | "What license price covers R1,500 delivery cost and hits 70% margin?" |
| Buyer | "Is R5,000 upfront worth it if I save R15,000/year?" |

### 5. Marketplace (Two-Sided)
**Use case**: Commission-based platform connecting buyers and sellers

| Perspective | Key Question |
|-------------|--------------|
| Platform | "What commission rate covers R15/transaction cost and hits 70% margin?" |
| Merchants | "Is 10% commission worth it if I profit R150 per transaction?" |

## The Inter-Company Transaction Tool (NEW)

A separate mode for analysing inter-company software transactions. Accessed via the mode switcher in the header.

### Three-Perspective Framework

Every transaction is analysed from three perspectives:

| Perspective | Shows |
|-------------|-------|
| **Developer** | Revenue recognition, costs, profit, tax position |
| **Buyer** | Asset capitalisation, amortisation, tax deductions |
| **Combined** | Group consolidation, profit elimination, efficiency |

### Model 1: Development Services (Cost-Plus) ✅ IMPLEMENTED

Developer creates software for Buyer as a service. IP ownership goes to Buyer.

**6 Variants:**
| Variant | Description | Use Case |
|---------|-------------|----------|
| 1A | Pure Cost Reimbursement | Zero margin, cost validation |
| 1B | Cost-Plus Fixed Margin | Standard arrangement (5-15%) |
| 1C | Cost-Plus with Bonus | Milestone incentives |
| 1D | Fixed Price Development | Well-defined scope |
| 1E | Time and Materials | Uncertain scope |
| 1F | Dedicated Team | Monthly retainer |

### Models 2-6 (Planned)

| Model | Description | Status |
|-------|-------------|--------|
| Model 2 | Software Licence with Royalties | Not Started |
| Model 3 | Joint Development / Cost-Sharing | Not Started |
| Model 4 | Build-Operate-Transfer (BOT) | Not Started |
| Model 5 | Software Sale with Ongoing Support | Not Started |
| Model 6 | Subscription/SaaS Enhancement | Not Started |

### South African Tax Features

- Corporate tax rate (default 27%)
- Section 11(e) accelerated depreciation (PC: 2yr, Mainframe: 5yr)
- Capital Gains Tax inclusion rate
- Deferred tax calculations (timing differences)
- Transfer pricing risk assessment

### Entity Configuration

Configurable settings for:
- Developer entity (name, jurisdiction, accounting framework)
- Buyer entity (name, jurisdiction, accounting framework)
- Relationship settings (related parties, consolidation required)

## Core Concept: Equilibrium Pricing

### The Math

```
Seller Floor = Cost / (1 - TargetMargin%)
Buyer Ceiling = BuyerValue × 0.4   (ensures 2.5x ROI minimum)
```

### Why 0.4 (40%)?

Buyers want at least 2.5x return on spending. If they get R100 value, they'll pay at most R40.
- At R40: ROI = R100/R40 = 2.5x (minimum acceptable)
- At R20: ROI = R100/R20 = 5x (compelling)
- At R60: ROI = R100/R60 = 1.67x (poor, unlikely to buy)

### Equilibrium Exists When

```javascript
if (sellerFloor <= buyerCeiling) {
  // Win-win zone exists
  equilibriumRange = {
    floor: sellerFloor,      // Most competitive price
    ceiling: buyerCeiling,   // Maximum value capture
    suggested: midpoint      // Balanced approach
  };
}
```

### When No Equilibrium

If `sellerFloor > buyerCeiling`, there's no sustainable price:
- Seller needs more than buyer will pay
- Solution: Reduce costs, lower margin target, or increase buyer value delivered

## Reverse Calculations

Users can auto-calculate missing inputs using three strategies:

| Strategy | What It Does | When to Use |
|----------|--------------|-------------|
| Minimum | Uses seller floor | Most competitive pricing |
| Balanced | Uses midpoint | Default, fair to both sides |
| Maximum | Uses buyer ceiling | Maximum value capture |

### Available Calculations Per Model

Each model supports calculating:
1. **Optimal Price** - Given costs and value, find equilibrium price
2. **Required Buyer Value** - Given price, what value must I deliver?
3. **Achievable Margin** - Given price and costs, what margin do I get?
4. **Maximum Cost** - Given price and margin, what's my cost ceiling?

## Key Implementation Details

### Why Static Unit Economics (No Monthly Projections)

Earlier versions had 24-month forecasts. They were removed because:
1. **Adds complexity without insight** - Users got distracted by growth curves
2. **Equilibrium is the key question** - If pricing doesn't work at unit level, projections don't matter
3. **Simpler is better** - The goal is "start basic and add complexity later"

### Why South African Defaults

The primary users are SA B2B software businesses. Defaults use ZAR and realistic SA market pricing (e.g., R250/seat vs $25/seat).

### Why No Build Process

1. **GitHub Pages deploys instantly** - Just push HTML/JS/CSS
2. **ES6 modules work natively** - Modern browsers handle imports
3. **Less tooling = less friction** - Focus on the product, not the build

## Comment Philosophy

Comments should explain **why**, not **what**. The code explains what's happening.

**Bad** (explains what):
```javascript
// Calculate minimum price
const minimumPrice = cost / (1 - margin / 100);
```

**Good** (explains why):
```javascript
// Seller needs this minimum to cover costs AND achieve target margin
const minimumPrice = cost / (1 - margin / 100);
```

## Development Guidelines

### Adding a New Model

1. Add to `models/index.js` with:
   - Input definitions (name, label, type, category, hint)
   - `calculate()` function returning standard result structure
2. Add reverse calculations to `calculators/reverse-calculations.js`
3. Test equilibrium chart renders correctly

### Making Changes

1. Edit the relevant module (models/, calculators/, ui/, charts/)
2. Test locally by opening `index.html` in browser
3. Commit with clear message explaining the change
4. Push to origin

### What NOT to Do

- Don't add month-by-month projections (keep it simple)
- Don't add features the user hasn't asked for
- Don't add comments that explain "what" - only "why"
- Don't create new files unless absolutely necessary

## Documentation Maintenance

| File | Update When |
|------|-------------|
| **CLAUDE.md** (root) | Architecture or models change |
| **docs/CALCULATIONS.md** | Formulas change |
| **docs/BUSINESS_GUIDE.md** | User workflows change |
| **docs/HISTORY.md** | Any bug fix or improvement |
| **docs/README.md** | Only for major changes |

## Troubleshooting

### Charts Not Rendering
- Check browser console for ApexCharts errors
- Verify equilibrium data exists (floor <= ceiling)

### Calculations Returning Infinity
- Check if margin is 100% (division by zero)
- Verify cost inputs are reasonable

### ES6 Module Errors
- Ensure `.nojekyll` file exists in root
- Use relative imports with `.js` extensions

---

**For AI Assistants**: This file is your source of truth. The system has two modes:
1. **Pricing Calculator**: 5 models focused on equilibrium pricing - keep it simple
2. **Inter-Company Tool**: 6 models (1 implemented, 5 planned) for transaction structuring with three-perspective analysis

See `docs/IMPLEMENTATION_ROADMAP.md` for the detailed implementation plan. Focus on Phase 3-7 (Models 2-6) as next steps.
