# My Preferences

## Process
1. **Read these preferences first**
2. **Gather context from documentation** (CLAUDE.md, relevant docs/)
3. **Then proceed with the task**

## Principles
1. **User-first design** - Align with how real people will use the tool (top priority)
2. **Simplicity** - Simple flow, clear guidance, non-overwhelming visuals, accurate interpretation
3. **Document WHY** - Explain decisions and how they align with tool goals
4. **Keep docs updated immediately** - Update relevant docs right after each change, before moving to the next task (sessions can end abruptly)
5. **Testability** - Ensure correctness and alignment with usage goals can be verified
6. **Know the purpose** - Always be aware of what the tool is for
7. **Preserve session context** - Update SESSION_NOTES.md after each significant task (not at the end - sessions can end abruptly)
8. **Follow conventions** - Best practices and consistent patterns
9. **Capture ideas** - Add lower priority items and improvements to TODO.md so they persist between sessions
10. **Repeatable process** - Follow consistent steps to ensure all the above
11. **Document user actions** - When manual user action is required (external dashboards, credentials, etc.), add detailed instructions to docs/USER_ACTIONS.md

## AI Checklists

### At Session Start
- [ ] Read CLAUDE.md (this file)
- [ ] Read SESSION_NOTES.md for current state and context
- [ ] Check TODO.md for pending items
- [ ] Understand what was last done before starting new work

### After Each Significant Task
- [ ] Update SESSION_NOTES.md with current state
- [ ] Update relevant docs (CALCULATIONS.md, BUSINESS_GUIDE.md, etc.)
- [ ] Add entry to HISTORY.md if code/docs changed
- [ ] Commit changes (code + docs together)

### Before Each Commit
- [ ] Relevant docs updated for changes in this commit
- [ ] HISTORY.md entry added (if significant change)
- [ ] SESSION_NOTES.md reflects current state
- [ ] Commit message is clear and descriptive

### Before Each Push
- [ ] All commits include their related doc updates
- [ ] SESSION_NOTES.md is current (in case session ends)
- [ ] No work-in-progress that would be lost

### Before Compact
- [ ] SESSION_NOTES.md updated with full context needed to continue after summary:
  - What's being worked on?
  - Current state of the work?
  - What's left to do?
  - Any decisions or blockers?
  - Key details that shouldn't be lost in the summary

## AI Notes

<!-- Reminders and learnings for AI assistants - add to this as needed -->

- Always read a file before attempting to edit it
- Check for existing patterns in the codebase before creating new ones
- Clean up completed or obsolete docs/files and remove references to them

---

# Software Transaction Structuring Tool

> **Purpose**: AI assistant context file for the Software Transaction Structuring Tool
> **Last Updated**: January 2026
> **Status**: Active - TypeScript + SvelteKit application with 5 pricing models and 6 transaction models (47 variants)

## System Purpose

This tool helps **software companies** structure transactions with clients to find the best deal for both parties.

### The Two Modes

| Mode | Goal | Core Question |
|------|------|---------------|
| **Mode 1: Pricing Calculator** | Find the price where you hit your margin AND your client sees clear ROI | "What's the price range that works for both of us?" |
| **Mode 2: Transaction Structuring** | Compare structures to find the best deal for both you and your client | "Which model gives us the best combined outcome?" |

### What "Best Deal" Means (Mode 2)

The tool helps you optimise across multiple dimensions:

1. **Financial Impact**: What does each option cost, and what profit/tax benefit does each party get?
2. **Tax Efficiency**: Which structure minimises your combined tax burden?
3. **Accounting Treatment**: How will this appear on each party's financial statements?
4. **Compliance Risk**: What are the transfer pricing risks? (related parties only)
5. **Long-term Value**: How does this look over 3-10 years? (NPV, IRR, payback)

**Why this matters**: Software transactions involve IP ownership, different accounting treatments per party, and tax implications. This tool analyses all dimensions simultaneously so you can make an informed structuring decision.

**Important scope clarification**:
- This is NOT specifically for inter-company/related party transactions
- It works for ANY client (related or unrelated)
- Consolidated accounting is NOT in scope
- "Mutual ownership" (related parties) is just one optional configuration

## Architecture

### Tech Stack

| Technology | Purpose |
|------------|---------|
| TypeScript | Type-safe calculation logic |
| SvelteKit | Web framework |
| Tailwind CSS | Styling |
| ApexCharts | Visualisations |
| pnpm | Package manager |
| GitHub Pages | Static hosting |

### File Structure

```
model-pear/
├── apps/
│   └── web/                    # SvelteKit web application
│       ├── src/
│       │   ├── routes/
│       │   │   ├── +page.svelte                # Home page
│       │   │   ├── +layout.svelte              # Global layout with header/footer
│       │   │   ├── pricing/                    # Mode 1: Pricing Calculator
│       │   │   │   └── +page.svelte            # 5 pricing models (subscription, usage, seat, one-time, marketplace)
│       │   │   └── structuring/                # Mode 2: Transaction Structuring
│       │   │       ├── +page.svelte            # Model browser (Options Overview)
│       │   │       └── [model]/                # Dynamic route for models 1-6
│       │   │           └── +page.svelte        # Model calculator with variants
│       │   └── lib/
│       │       ├── components/                 # Reusable UI components
│       │       ├── stores/                     # Svelte stores
│       │       ├── config/                     # Configuration
│       │       └── utils/                      # Utilities
│       ├── svelte.config.js                    # SvelteKit config (GitHub Pages adapter)
│       └── package.json
│
├── packages/
│   └── calculator/             # Pure TypeScript calculation engine
│       ├── src/
│       │   ├── models/                         # 6 transaction models with variants
│       │   │   ├── costPlus.ts                 # Model 1: Development Services (6 variants)
│       │   │   ├── licenceRoyalties.ts         # Model 2: Software Licence (8 variants)
│       │   │   ├── jointDevelopment.ts         # Model 3: Joint Development (8 variants)
│       │   │   ├── buildOperateTransfer.ts     # Model 4: BOT (8 variants)
│       │   │   ├── softwareSale.ts             # Model 5: Software Sale (8 variants)
│       │   │   └── saasSubscription.ts         # Model 6: SaaS/Subscription (9 variants)
│       │   └── types/                          # TypeScript interfaces
│       ├── tsconfig.json
│       └── package.json
│
├── CLAUDE.md                   # This file (AI assistant context)
│
└── docs/
    ├── README.md               # Quick start and project overview
    ├── BUSINESS_GUIDE.md       # Comprehensive user guide with tutorials
    ├── CALCULATIONS.md         # Formula explanations and economic theory
    ├── ARCHITECTURE.md         # Technical architecture (TypeScript monorepo)
    ├── HISTORY.md              # Changelog and bug fixes
    ├── SESSION_NOTES.md        # Build commands and architecture reference
    ├── TODO.md                 # Feature ideas and backlog
    ├── USER_ACTIONS.md         # Manual user action instructions (when needed)
    └── model-use-cases/        # When to use each model variant
        ├── README.md           # Model selection guide
        ├── model-1-development-services.md
        ├── model-2-software-licence.md
        ├── model-3-joint-development.md
        ├── model-4-build-operate-transfer.md
        ├── model-5-software-sale.md
        └── model-6-saas-subscription.md
```

## The Two Modes

### Mode 1: Pricing Calculator (5 Models)

**Goal**: Find the price range where you hit your margin AND your client sees clear ROI.

| Model | Use Case |
|-------|----------|
| Subscription (SaaS) | Monthly recurring revenue per customer |
| Usage-Based | Pay per unit (API calls, transactions) |
| Per-Seat | Price per active user/seat |
| One-Time Purchase | Upfront license + optional maintenance |
| Marketplace | Commission on transactions |

### Mode 2: Transaction Structuring Tool (6 Models, 47 Variants)

**Goal**: Compare structures to find the best deal for both you and your client.

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
- Calculates results for both parties (Developer and Buyer)
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

Transactions are analysed from two perspectives:

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
- Show Developer and Buyer perspectives

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
    mutualOwnership: false               // Default: independent parties
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

## Documentation Reference

| Document | Purpose | Update When |
|----------|---------|-------------|
| **CLAUDE.md** (root) | AI assistant context, architecture overview, development guide | Architecture, models, or major features change |
| **docs/README.md** | Quick start guide, project overview | Tech stack or setup process changes |
| **docs/BUSINESS_GUIDE.md** | Comprehensive user guide with tutorials | User workflows, features, or terminology change |
| **docs/CALCULATIONS.md** | All formulas, rationale, economic theory | Formulas or calculation logic change |
| **docs/ARCHITECTURE.md** | Technical architecture (TypeScript monorepo) | Build process, package structure, or tech decisions change |
| **docs/HISTORY.md** | Changelog and bug fixes | Any change to the application |
| **docs/SESSION_NOTES.md** | Session continuity - context for next AI to continue work | After each significant task (sessions end abruptly); remove stale notes |
| **docs/TODO.md** | Feature ideas and backlog | Add ideas to persist between sessions |
| **docs/USER_ACTIONS.md** | Manual user action instructions | When user needs to do something outside the tool |
| **docs/model-use-cases/** | When to use each model variant, TP considerations | Model logic or variant definitions change |

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

**For AI Assistants**: This file is your source of truth. The system is a Software Transaction Structuring Tool.

### Tool Goals (use these to guide development)

| Mode | Goal | User gets... |
|------|------|--------------|
| **Mode 1** | Find price where seller hits margin AND buyer sees ROI | Price recommendation with equilibrium zone visualisation |
| **Mode 2** | Compare structures to find best deal for both parties | Side-by-side comparison across 5 dimensions (financial, tax, accounting, compliance, long-term) |

### Key Scope

- This tool is for a **software company** (the developer) working with **any client**
- Works for independent OR related parties
- "Mutual ownership" (related parties) activates transfer pricing compliance features
- Focus: financial impact, tax efficiency, accounting treatment, compliance risk, long-term value
- NOT about group accounting consolidation

### Features

- Options Overview (visual model selection grid)
- Structure Selector (decision tree wizard)
- Perspective analysis (Developer and Buyer)
- Compare Mode (save, compare, export options side-by-side)
- Sensitivity Analysis (ranges, scenarios, Monte Carlo)
- Growth Projections (NPV, IRR, payback)
- Advanced Visualisations (comparisons, timelines, charts)
