# CLAUDE.md

## HARD RULES

These rules are non-negotiable. Stop and ask before proceeding if any rule would be violated.

### Before Making Changes

- [ ] Read relevant existing code and documentation first
- [ ] Read SESSION_NOTES.md for current state and context
- [ ] Check TODO.md for pending items
- [ ] Ask clarifying questions if scope, approach, or intent is unclear
- [ ] Confirm understanding before implementing non-trivial changes
- [ ] Never assume - when in doubt, ask

### Best Practices

- [ ] Follow established patterns and conventions in the codebase
- [ ] Use industry-standard solutions over custom implementations when available
- [ ] Apply SOLID principles, DRY, and separation of concerns
- [ ] Prefer well-maintained, widely-adopted libraries over obscure alternatives
- [ ] Follow security best practices (input validation, sanitization, principle of least privilege)
- [ ] Handle errors gracefully with meaningful messages
- [ ] Write self-documenting code with clear naming

### Code Organization

- [ ] Prefer smaller, focused files and functions
- [ ] Pause and consider extraction at: 500 lines (file), 100 lines (function), 400 lines (class)
- [ ] Strongly consider refactoring at: 800+ lines (file), 150+ lines (function), 600+ lines (class)
- [ ] Extract reusable logic into separate modules/files immediately
- [ ] Group related functionality into logical directories
- [ ] Split large classes into smaller, focused classes when responsibilities diverge

### Decision Documentation in Code

Every non-trivial code change must include comments explaining:
- **What** was the requirement or instruction
- **Why** this approach was chosen
- **What alternatives** were considered and why they were rejected

Example:
```typescript
// Requirement: Calculate NPV for multi-year projections
// Approach: Newton-Raphson method for IRR, standard DCF for NPV
// Alternatives considered:
//   - Simple payback: Rejected - doesn't account for time value of money
//   - Excel-style XIRR: Rejected - irregular dates not needed, adds complexity
//   - Bisection method: Rejected - slower convergence than Newton-Raphson
function calculateIRR(cashFlows: number[]): number {
    ...
}
```

### User Experience (CRITICAL)

Assume all end users are non-technical. This is non-negotiable.

- [ ] UI must be intuitive without instructions
- [ ] Use plain language - no jargon, technical terms, or developer-speak
- [ ] Error messages must tell users what went wrong AND what to do next, in simple terms
- [ ] Labels, buttons, and instructions should be clear to someone unfamiliar with the domain
- [ ] Prioritize clarity over brevity in user-facing text
- [ ] Confirm destructive actions with clear consequences explained
- [ ] Provide feedback for all user actions (loading states, success confirmations, etc.)
- [ ] Design for the least technical person who will use this

Bad: "Error 500: Internal server exception"
Good: "Something went wrong on our end. Please try again, or contact support if this continues."

Bad: "Invalid input format"
Good: "Please enter your phone number as 10 digits, like 0821234567"

### Frontend: Styles and Scripts

- [ ] Never write inline CSS or JS (Tailwind utility classes are acceptable)
- [ ] All custom styles must be in dedicated stylesheet files
- [ ] Use CSS variables for theming (colors, spacing, typography)
- [ ] Separate component styles into individual files when component is created

### Documentation

- [ ] Update relevant documentation with every code change
- [ ] All documentation lives in `/docs` directory
- [ ] Plans, notes, and scratch files go in `/docs/working`
- [ ] Never write docs or plans to root directory or random locations
- [ ] Keep docs updated immediately - update right after each change, before moving to the next task (sessions can end abruptly)

### Cleanup

- [ ] Remove all temporary files after implementation is complete
- [ ] Delete unused imports, variables, and dead code immediately
- [ ] Remove commented-out code unless explicitly marked for preservation
- [ ] Clean up console.log/print statements before marking work complete
- [ ] Clean up completed or obsolete docs/files and remove references to them

### Quality Checks

During every change, actively scan for:
- [ ] Error handling gaps
- [ ] Edge cases not covered
- [ ] Inconsistent naming
- [ ] Code duplication that should be extracted
- [ ] Missing validation
- [ ] Security concerns
- [ ] Performance issues

Report findings even if not directly related to current task.

---

## AI SESSION MANAGEMENT

### Principles

1. **User-first design** - Align with how real people will use the tool (top priority)
2. **Simplicity** - Simple flow, clear guidance, non-overwhelming visuals, accurate interpretation
3. **Document WHY** - Explain decisions and how they align with tool goals
4. **Testability** - Ensure correctness and alignment with usage goals can be verified
5. **Know the purpose** - Always be aware of what the tool is for
6. **Preserve session context** - Update SESSION_NOTES.md after each significant task (not at the end - sessions can end abruptly)
7. **Capture ideas** - Add lower priority items and improvements to TODO.md so they persist between sessions
8. **Document user actions** - When manual user action is required (external dashboards, credentials, etc.), add detailed instructions to docs/USER_ACTIONS.md

### After Each Significant Task

- [ ] Update SESSION_NOTES.md with current state
- [ ] Update relevant docs (CALCULATIONS.md, BUSINESS_GUIDE.md, etc.)
- [ ] Add entry to HISTORY.md if code/docs changed
- [ ] Commit changes (code + docs together)

### Commit Message Format

All commits must include metadata footers:

```
type(scope): subject

Body explaining why.

Tags: tag1, tag2, tag3
Complexity: 1-5
Urgency: 1-5
Impact: internal|user-facing|infrastructure|api
Risk: low|medium|high
Debt: added|paid|neutral
Epic: feature-name
Semver: patch|minor|major
```

**Tags:** Use from the project's tag list (see docs/EXTRACTION_PLAYBOOK.md)
**Complexity:** 1=trivial, 2=small, 3=medium, 4=large, 5=major rewrite
**Urgency:** 1=planned, 2=normal, 3=elevated, 4=urgent, 5=critical
**Impact:** internal, user-facing, infrastructure, or api
**Risk:** low=safe change, medium=could break things, high=touches critical paths
**Debt:** added=introduced shortcuts, paid=cleaned up debt, neutral=neither
**Epic:** groups related commits under one feature/initiative name
**Semver:** patch=bugfix, minor=new feature, major=breaking change

These footers are required on every commit. No exceptions.

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

### AI Notes

<!-- Reminders and learnings for AI assistants - add to this as needed -->

- Always read a file before attempting to edit it
- Check for existing patterns in the codebase before creating new ones
- Ask clarifying questions before assuming bug causes — wrong assumptions lead to wrong commits
- Check docs/AI_MISTAKES.md at session start and log new mistakes as they occur

<!-- Cross-reference: This project shares engineering conventions with glow-props.
     Review https://github.com/devmade-ai/glow-props/blob/main/CLAUDE.md periodically
     for new patterns or learnings that may apply here. Last reviewed: 2026-02-27.
     Shared conventions: code org thresholds, decision docs, commit format, cleanup rules,
     quality scans, non-technical user UX, prohibitions, communication style. -->

---

## COMMUNICATION STYLE

- Direct, concise responses
- No filler phrases or conversational padding
- State facts and actions, not opinions
- Ask specific questions with concrete options when clarification needed
- Never proceed with assumptions on ambiguous requests

---

## TESTING

- Write tests for critical paths and core business logic
- Test error handling and edge cases for critical functions
- Tests are not required for trivial getters/setters or UI-only code
- Run existing tests before and after changes (`pnpm test`)

---

## PROJECT-SPECIFIC CONFIGURATION

### Paths
```
DOCS_PATH=/docs
WORKING_DOCS_PATH=/docs/working
COMPONENTS_PATH=apps/web/src/lib/components
STYLES_PATH=apps/web/src/app.css
TESTS_PATH=packages/calculator/tests
E2E_TESTS_PATH=apps/web/tests/e2e
```

### Stack
```
LANGUAGE=TypeScript
FRAMEWORK=SvelteKit 2.x
STYLING=Tailwind CSS
CHARTS=ApexCharts
TEST_RUNNER=Vitest (unit), Playwright (E2E)
PACKAGE_MANAGER=pnpm
HOSTING=GitHub Pages
```

### Conventions
```
NAMING_CONVENTION=camelCase
FILE_NAMING=camelCase (TS), PascalCase (Svelte components)
COMPONENT_STRUCTURE=feature-based (routes/ for pages, lib/components/ for shared)
```

### Build Commands
```bash
pnpm install          # Install dependencies
pnpm test             # Run calculator tests (301 tests)
pnpm build            # Build all packages
pnpm dev              # Start dev server (apps/web)
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:ui      # Run Playwright with UI
```

---

## WORKFLOW

1. **Receive task** - Ask clarifying questions if needed
2. **Gather context** - Read CLAUDE.md, SESSION_NOTES.md, TODO.md, relevant code
3. **Plan** - Write plan to `/docs/working` if task is non-trivial
4. **Implement** - Follow all hard rules above
5. **Verify** - Run tests, check for errors, review cleanup
6. **Document** - Update all affected documentation (SESSION_NOTES.md, HISTORY.md, etc.)
7. **Report** - Summarize changes and any issues found

---

## PROHIBITIONS

Never:
- Start implementation without understanding full scope
- Create files outside established project structure
- Leave TODO comments without tracking them in docs/TODO.md
- Ignore errors or warnings in output
- Make "while I'm here" changes without asking
- Use placeholder data that looks like real data
- Skip error handling "for now"
- Write code without decision context comments (for non-trivial changes)
- Modify default values without business justification
- Add features without updating documentation

---

# Software Transaction Structuring Tool

> **Purpose**: AI assistant context file for the Software Transaction Structuring Tool
> **Last Updated**: February 2026
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
    ├── AI_MISTAKES.md          # AI mistake log (prevent repeat errors across sessions)
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
- "Explore" buttons to select a model
- "Use the guided wizard" link for decision tree flow
- View mode persisted in localStorage

### Compare Mode
**Files**: `ui/intercompany/comparison-manager.js`, `ui/intercompany/comparison-view.js`, `utils/storage.js`

Save and compare calculation results side-by-side:
- Save calculations as named options (up to 20)
- Comparison manager panel (list, load, delete, rename, edit notes)
- Side-by-side comparison view (2-4 options)
- Difference column with directional arrows
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
| CGT effective rate | 21.6% (27% x 80%) |
| Deferred tax | Calculated on timing differences |

## Key Calculation Formulas

### Cost-Plus (Model 1)
```javascript
developerRevenue = totalCost * (1 + marginPercent / 100)
developerProfit = developerRevenue - totalCost
buyerCapitalisedAsset = developerRevenue
```

### Licence Royalty (Model 2)
```javascript
annualRoyalty = buyerRevenue * (royaltyRate / 100)
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
NPV = Sum(cashFlow_t / (1 + discountRate)^t) for t = 0 to n
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
  marginComplianceScore * 0.30 +
  documentationScore * 0.25 +
  substanceScore * 0.20 +
  comparabilityScore * 0.15 +
  consistencyScore * 0.10
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

1. Add variant definition to the model file in `packages/calculator/src/models/`
2. Include: name, description, scenario, calculation modifiers
3. Test with different input combinations
4. Update documentation

### Adding a New Calculation

1. Add to appropriate module in `packages/calculator/src/`
2. Include JSDoc/TSDoc comments explaining the formula
3. Handle edge cases (division by zero, negative values)
4. Add unit tests

### Adding a New Visualisation

1. Add chart component to `apps/web/src/lib/components/charts/`
2. Use ApexCharts for consistency
3. Ensure responsive design
4. Include loading states

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
| **docs/AI_MISTAKES.md** | AI assistant mistake log to prevent repeat errors | When an AI makes a mistake during a session |
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
