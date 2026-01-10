# My Preferences

## Process
1. **Read these preferences first**
2. **Gather context from documentation** (CLAUDE.md, relevant docs/)
3. **Then proceed with the task**

## Principles
1. **User-first design** - Align with how real people will use the tool (top priority)
2. **Simplicity** - Simple flow, clear guidance, non-overwhelming visuals, accurate interpretation
3. **Document WHY** - Explain decisions and how they align with tool goals
4. **Keep docs updated** - HISTORY.md, CALCULATIONS.md, BUSINESS_GUIDE.md, CLAUDE.md as relevant
5. **Testability** - Ensure correctness and alignment with usage goals can be verified
6. **Know the purpose** - Always be aware of what the tool is for
7. **Logical checkpoints** - Stop at sensible points, document progress, leave notes for future sessions
8. **Follow conventions** - Best practices and consistent patterns
9. **Repeatable process** - Follow consistent steps to ensure all the above

---

# Software Transaction Structuring Tool

> **Purpose**: AI assistant context file for the Software Transaction Structuring Tool
> **Last Updated**: January 2026
> **Status**: Active - Comprehensive tool with 6 transaction models, 3 modules, sensitivity analysis, and growth projections

## System Purpose

This tool helps **software companies** analyse and compare different transaction models to maximize value for both parties (your company and your client) when starting new projects or products.

1. **Pricing Calculator (Mode 1)**: Find equilibrium pricing for B2B software products
2. **Transaction Structuring Tool (Mode 2)**: Compare transaction models to optimize expenses, capitalization, and tax outcomes for both parties

**The core questions**:
- Pricing Mode: What price lets the seller make their target margin while giving the buyer compelling ROI?
- Transaction Mode: Which model maximizes value for both your company and the client? How do expenses, capitalization, and tax effects compare across different structures?

**Why this matters**: Software transactions involve IP ownership, different accounting treatments per party, and tax implications. This tool analyses all dimensions simultaneously to inform your structuring decision.

**Important scope clarification**:
- This is NOT specifically for inter-company/related party transactions
- It works for ANY client (related or unrelated)
- Consolidated accounting is NOT in scope
- "Mutual ownership" (related parties) is just one optional configuration

## Architecture

### Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| ES6 JavaScript | ~40 modules (~28,000 lines) |
| Tailwind CSS (CDN) | Styling |
| ApexCharts (CDN) | Visualisations |
| GitHub Pages | Free hosting, no backend |

### File Structure

```
model-pear/
├── index.html                  # Entry point (dual-mode: pricing + intercompany)
├── styles.css                  # Custom styles
├── app.js                      # Orchestrator (mode switching, dependencies)
│
├── config/
│   ├── constants.js            # Chart colors, global config
│   └── sa-pricing-defaults.js  # South African market defaults (ZAR)
│
├── state/
│   └── app-state.js            # Pub/sub state management for both modes
│
├── models/
│   ├── index.js                # 5 pricing models with calculation logic
│   └── intercompany/           # Inter-company transaction models
│       ├── registry.js         # Model registry with helper functions
│       ├── model-1-cost-plus.js        # Model 1: Development Services (6 variants)
│       ├── model-2-licence-royalties.js # Model 2: Software Licence (8 variants)
│       ├── model-3-joint-development.js # Model 3: Joint Development (8 variants)
│       ├── model-4-bot.js              # Model 4: Build-Operate-Transfer (8 variants)
│       ├── model-5-software-sale.js    # Model 5: Software Sale (8 variants)
│       ├── model-6-saas-subscription.js # Model 6: SaaS/Subscription (9 variants)
│       ├── structure-selector.js       # Module 1: Decision tree wizard
│       ├── compliance-analyzer.js      # Module 3: TP risk, checklists, analysis
│       ├── sensitivity-analysis.js     # Stage 2: Range inputs, scenarios, Monte Carlo
│       ├── growth-projections.js       # Stage 3: NPV, IRR, payback calculations
│       └── advanced-visualizations.js  # Cross-model comparison, timelines, risk charts
│
├── calculators/
│   ├── engine.js               # Main calculation engine (pricing mode)
│   └── reverse-calculations.js # Auto-calculate missing inputs
│
├── ui/
│   ├── initialization.js       # App startup
│   ├── forms.js                # Dynamic form generation
│   ├── results-display.js      # Render result panels (pricing)
│   ├── modals.js               # Tooltips and modals
│   └── intercompany/           # Inter-company UI components
│       ├── calculator.js               # Main inter-company calculator
│       ├── entity-config.js            # Developer/Buyer entity configuration
│       ├── perspective-toggle.js       # Perspective switcher (Developer/Buyer/Shareholder)
│       ├── party-selector.js           # Party relationship selector (Independent/Related)
│       ├── results-display.js          # Perspective-based results rendering
│       ├── structure-selector.js       # Module 1: Wizard UI
│       ├── options-overview.js         # Options Overview: Model selection grid
│       ├── comparison-manager.js       # Compare Mode: Saved options panel
│       ├── comparison-view.js          # Compare Mode: Side-by-side comparison
│       ├── compliance-analyzer.js      # Module 3: Compliance UI
│       ├── range-input.js              # Stage 2: Range input components
│       ├── sensitivity-visualizations.js # Stage 2: Tornado, fan, break-even charts
│       ├── projection-visualizations.js  # Stage 3: NPV, ROI, cash flow charts
│       └── advanced-visualizations.js    # Cross-model comparison, timeline charts
│
├── charts/
│   └── index.js                # Equilibrium chart rendering (pricing mode)
│
├── utils/
│   ├── index.js                # Formatting, validation, helpers
│   └── storage.js              # Compare Mode: localStorage persistence
│
├── CLAUDE.md                   # This file (AI assistant context)
│
└── docs/
    ├── README.md               # Quick start
    ├── BUSINESS_GUIDE.md       # Comprehensive user guide with tutorials
    ├── CALCULATIONS.md         # Formula explanations
    ├── UI_UX_GUIDE.md          # Accessibility features
    ├── HISTORY.md              # Changelog
    ├── USAGE_SCENARIOS_REVIEW.md  # User workflow analysis
    ├── financial_models_intercompany_software.md  # Framework overview
    └── model_*_concept.md      # Concept docs for Models 1-6
```

## The Two Modes

### Mode 1: Pricing Calculator (5 Models)

For B2B software product pricing decisions.

| Model | Use Case |
|-------|----------|
| Subscription (SaaS) | Monthly recurring revenue per customer |
| Usage-Based | Pay per unit (API calls, transactions) |
| Per-Seat | Price per active user/seat |
| One-Time Purchase | Upfront license + optional maintenance |
| Marketplace | Commission on transactions |

### Mode 2: Transaction Structuring Tool (6 Models, 47 Variants)

For comparing software transaction structures to optimize outcomes for both parties.

| Model | Description | Variants |
|-------|-------------|----------|
| **Model 1** | Development Services (Cost-Plus) | 6 (1A-1F) |
| **Model 2** | Software Licence with Royalties | 8 (2A-2H) |
| **Model 3** | Joint Development / Cost-Sharing | 8 (3A-3H) |
| **Model 4** | Build-Operate-Transfer (BOT) | 8 (4A-4H) |
| **Model 5** | Software Sale with Ongoing Support | 8 (5A-5H) |
| **Model 6** | Subscription/SaaS Enhancement | 9 (6A-6I) |

## The Three Modules

### Module 1: Structure Selector
**File**: `models/intercompany/structure-selector.js`

Decision tree wizard that helps users choose the optimal model by asking about:
- IP ownership preferences
- Cash flow structure preferences
- Risk allocation
- Asset recognition needs
- Whether user owns both entities (mutual ownership)
- Transaction timeframe

### Module 2: Pricing Calculator
**Files**: `ui/intercompany/calculator.js`, `ui/intercompany/results-display.js`

Dynamic calculator that:
- Generates input forms per model/variant
- Calculates results for both parties (plus shareholder view when mutual ownership)
- Renders accounting treatment summaries
- Shows tax calculations and journal entries
- Displays visualisations

### Module 3: Compliance Analyzer
**File**: `models/intercompany/compliance-analyzer.js`

Transfer pricing compliance analysis:
- TP risk score (composite of 5 factors)
- Benchmark comparison (OECD methods)
- Accounting treatment summaries
- Tax impact analysis
- Compliance checklists (6 categories)
- Journal entry templates

## Advanced Features

### Options Overview
**File**: `ui/intercompany/options-overview.js`

Default landing view showing all 6 transaction models at a glance:
- Visual grid of model cards with icons, summaries, key features
- "Best for" tags showing ideal use cases
- Quick comparison table (IP ownership, payment type, risk profile)
- "Explore →" buttons to select a model
- "Use the guided wizard" link for decision tree flow
- View mode persisted in localStorage

### Compare Mode
**Files**: `ui/intercompany/comparison-manager.js`, `ui/intercompany/comparison-view.js`, `utils/storage.js`

Save and compare calculation results side-by-side:
- Save calculations as named options (up to 20)
- Comparison manager panel (list, load, delete, rename, edit notes)
- Side-by-side comparison view (2-4 options)
- Difference column with directional arrows (▲ ▼)
- Best/worst value highlighting (green/red)
- Compatibility warnings for different models/perspectives
- Export: JSON, CSV, Print/PDF
- Import: Load from JSON file
- localStorage persistence with version tracking

### Stage 2: Sensitivity Analysis
**Files**: `models/intercompany/sensitivity-analysis.js`, `ui/intercompany/range-input.js`, `ui/intercompany/sensitivity-visualizations.js`

- Range inputs (Low / Base / High)
- Best case / Base case / Worst case scenarios
- Tornado charts (input sensitivity ranking)
- Fan charts (projection ranges)
- Break-even analysis
- Monte Carlo simulation (optional)

### Stage 3: Growth Projections
**Files**: `models/intercompany/growth-projections.js`, `ui/intercompany/projection-visualizations.js`

- Multi-year projections (3/5/7/10 years)
- NPV calculations per party
- IRR calculations (Newton-Raphson method)
- Payback period (simple and discounted)
- Break-even revenue analysis
- Cash flow projection charts
- ROI trajectory visualisations

### Advanced Visualisations
**Files**: `models/intercompany/advanced-visualizations.js`, `ui/intercompany/advanced-visualizations.js`

- Cross-model comparison charts
- Asset location timeline (animated)
- Cash flow waterfall (interactive)
- Amortisation schedules (multi-entity)
- TP risk heat map
- Risk vs Return quadrant chart
- Compliance score gauge

## Perspective Framework

Transactions are analysed from two core perspectives, with a third available for related parties:

### Your Company (Developer)
- Revenue recognition (service revenue, licence revenue, sale proceeds)
- Development costs (capitalised vs expensed)
- Profit margin analysis
- Income tax liability
- Asset position (if IP retained)

### Client (Buyer)
- Asset capitalisation
- Amortisation schedule (accounting vs tax)
- Section 11(e) accelerated depreciation
- Deferred tax position
- Total cost of ownership

### Shareholder Perspective (When Mutual Ownership)
Only shown when user owns both entities. This is NOT group accounting consolidation.

**Focus**: What's best for the shareholder who owns both companies
- Total profit across both entities
- Where should profit sit for optimal tax treatment?
- Overall cash flow to the shareholder
- Transfer pricing risk assessment
- Which structure benefits the shareholder most

## South African Tax Features

| Feature | Implementation |
|---------|----------------|
| Corporate tax rate | 27% (configurable) |
| Section 11(e) PC | 2-year write-off (50% p.a.) |
| Section 11(e) Mainframe | 5-year write-off (20% p.a.) |
| CGT inclusion rate | 80% for companies |
| CGT effective rate | 21.6% (27% × 80%) |
| Deferred tax | Calculated on timing differences |

## Key Calculation Formulas

### Cost-Plus (Model 1)
```javascript
developerRevenue = totalCost × (1 + marginPercent / 100)
developerProfit = developerRevenue - totalCost
buyerCapitalisedAsset = developerRevenue
```

### Licence Royalty (Model 2)
```javascript
annualRoyalty = buyerRevenue × (royaltyRate / 100)
developerRoyaltyIncome = annualRoyalty
buyerRoyaltyExpense = annualRoyalty
```

### Joint Development (Model 3)
```javascript
totalContribution = developerContribution + buyerContribution
developerOwnership = developerContribution / totalContribution
buyerOwnership = buyerContribution / totalContribution
```

### NPV Calculation (Stage 3)
```javascript
NPV = Σ (cashFlow_t / (1 + discountRate)^t) for t = 0 to n
```

### IRR Calculation (Newton-Raphson)
```javascript
// Iterative: find rate where NPV = 0
while (Math.abs(npv) > tolerance) {
  npv = calculateNPV(cashFlows, rate)
  dnpv = calculateNPVDerivative(cashFlows, rate)
  rate = rate - npv / dnpv
}
```

### Transfer Pricing Risk Score
```javascript
riskScore =
  marginComplianceScore × 0.30 +
  documentationScore × 0.25 +
  substanceScore × 0.20 +
  comparabilityScore × 0.15 +
  consistencyScore × 0.10
```

## Entity Configuration

The tool is pre-configured for **South African companies** doing software transactions. These defaults:
- Reduce setup time for typical users
- Assume independent parties by default (NOT related)
- Show Developer and Buyer perspectives only (no Shareholder perspective by default)

**Note**: When "Mutual Ownership" is checked, the Shareholder Perspective is shown. This is NOT group accounting consolidation - it shows what's best for the person who owns both entities.

```javascript
DEFAULT_ENTITY_CONFIG = {
  developer: {
    name: 'Your Company',
    jurisdiction: 'South Africa',       // Default market for the tool
    taxResident: true,                   // Subject to SARS rules
    corporateTaxRate: 0.27,              // SA CIT rate (since 2023)
    accountingFramework: 'IFRS'          // Mandatory for SA listed companies
  },
  buyer: {
    name: 'Client',
    jurisdiction: 'South Africa',
    taxResident: true,
    corporateTaxRate: 0.27,
    accountingFramework: 'IFRS',
    section11eType: 'pc-2yr'             // Accelerated depreciation (2yr for PC software)
  },
  relationship: {
    mutualOwnership: false               // Default: independent parties (no shareholder view)
  }
}
```

**When to enable "Mutual Ownership"**: Check this only if the client shares common ownership with your company. This activates transfer pricing compliance considerations and related party disclosure requirements.

See **[BUSINESS_GUIDE.md - Default Entity Configuration](docs/BUSINESS_GUIDE.md#default-entity-configuration)** for detailed explanations of each setting.

## Transfer Pricing Benchmarks

| Transaction Type | Low Risk | Medium Risk | Typical |
|------------------|----------|-------------|---------|
| Cost-plus markup | 5-15% | 0-20% | 10% |
| Licence royalty | 5-25% | 2-35% | 15% |
| Reseller margin | 20-40% | 15-50% | 30% |
| Profit split | 40-60% | 30-70% | 50% |
| Service provider | 3-10% | 1-15% | 6% |

## Development Guidelines

### Adding a New Model Variant

1. Add variant definition to the model file (e.g., `model-1-cost-plus.js`)
2. Include: name, description, scenario, calculation modifiers
3. Test with different input combinations
4. Update documentation

### Adding a New Calculation

1. Add to appropriate module (`calculators/` or `models/intercompany/`)
2. Include JSDoc comments explaining the formula
3. Handle edge cases (division by zero, negative values)
4. Add unit tests if applicable

### Adding a New Visualisation

1. Add chart configuration to visualisation module
2. Use ApexCharts for consistency
3. Ensure responsive design
4. Include loading states

### What NOT to Do

- Don't add features without updating documentation
- Don't introduce build dependencies (keep vanilla JS)
- Don't modify default values without business justification
- Don't skip error handling for edge cases
- Don't create new files unless necessary

## Comment Philosophy

Comments should explain **why**, not **what**:

**Bad** (explains what):
```javascript
// Calculate developer profit
const profit = revenue - cost;
```

**Good** (explains why):
```javascript
// Developer profit = gross margin before tax; used for TP compliance scoring
const profit = revenue - cost;
```

## Documentation Maintenance

| File | Update When |
|------|-------------|
| **CLAUDE.md** (root) | Architecture, models, or major features change |
| **BUSINESS_GUIDE.md** | User workflows, features, or terminology change |
| **CALCULATIONS.md** | Formulas or calculation logic change |
| **HISTORY.md** | Any change to the application |

## Troubleshooting

### Charts Not Rendering
- Check browser console for ApexCharts errors
- Verify data structure matches chart requirements
- Check if container element exists

### Calculations Returning NaN/Infinity
- Check for division by zero (margin = 100%)
- Verify input validation catches invalid values
- Check for negative numbers in log/power calculations

### ES6 Module Errors
- Ensure `.nojekyll` file exists in root
- Use relative imports with `.js` extensions
- Check for circular dependencies

### State Not Updating
- Verify pub/sub subscription is active
- Check event names match exactly
- Ensure state mutations call notify()

---

**For AI Assistants**: This file is your source of truth. The system is a Software Transaction Structuring Tool:

- **Mode 1**: 5 pricing models for equilibrium pricing (original functionality)
- **Mode 2**: 6 transaction models (47 variants total) for comparing structures

**Key scope clarification**:
- This tool is for a **software company** (the developer) working with **any client**
- The goal is to compare models to maximize value for both parties
- "Mutual ownership" (related parties) is just one scenario, NOT the default
- When mutual ownership is enabled, a Shareholder Perspective shows what's best for the owner of both entities
- This is NOT about group accounting consolidation
- Focus is on: expenses, capitalization, and tax effects

The tool includes:
- Options Overview (visual model selection grid)
- Structure Selector (decision tree wizard)
- Perspective analysis (Developer, Buyer, plus Shareholder when mutual ownership)
- Compare Mode (save, compare, export options side-by-side)
- Sensitivity Analysis (ranges, scenarios, Monte Carlo)
- Growth Projections (NPV, IRR, payback)
- Advanced Visualisations (comparisons, timelines, charts)
