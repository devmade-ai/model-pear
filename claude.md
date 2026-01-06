# Revenue Model Calculator

> **Purpose**: AI assistant context file for the Revenue Model Calculator project
> **Last Updated**: January 2026
> **Status**: Active Development - All 20 models implemented with comparison features and bug fixes

## Project Overview

**What**: Interactive web application for comparing software revenue models through visualization and financial metrics

**Goal**: Help founders, product managers, and finance teams evaluate different pricing strategies by comparing 20+ revenue models side-by-side with accurate financial projections

**Deployment**: Modular static web app hosted on GitHub Pages (no backend, no build process, ES6 modules)

## Architecture

### Tech Stack

- **Frontend**: HTML + Modular ES6 JavaScript
- **Architecture**: 16 modules across 7 directories (~6,800 lines total)
- **Styling**: Tailwind CSS (Play CDN)
- **Charts**: ApexCharts 3.x (CDN)
- **Hosting**: GitHub Pages (free HTTPS)
- **Performance**: <1s page load, <300ms updates

### File Structure

```
model-pear/
├── index.html                    # Main HTML entry point
├── styles.css                    # Additional custom styles
├── app.js                        # Main orchestrator (~243 lines)
├── .nojekyll                     # Disables Jekyll on GitHub Pages (critical for ES6 modules)
├── config/
│   └── constants.js              # Global configuration & state (~82 lines)
├── framework/
│   ├── model-families.js         # Model family groupings (~70 lines)
│   ├── categories.js             # Layer 1: Core function categories (~435 lines)
│   ├── delivery.js               # Layer 2: Delivery mechanisms (~55 lines)
│   └── services.js               # Layer 3: Service models (~175 lines)
├── models/
│   └── index.js                  # All 20 revenue model definitions (~1,251 lines)
├── utils/
│   └── index.js                  # Utilities: formatting, validation, calculations (~811 lines)
├── charts/
│   └── index.js                  # ApexCharts rendering logic (~732 lines)
├── calculators/
│   ├── engine.js                 # Core calculation engine (~29 lines)
│   └── client-budget.js          # Client budget calculator (~1,316 lines)
├── ui/
│   ├── forms.js                  # Dynamic form generation (~171 lines)
│   ├── events.js                 # Event handlers (~347 lines)
│   ├── initialization.js         # App initialization logic (~723 lines)
│   ├── admin.js                  # Admin panel functionality (~203 lines)
│   └── modals.js                 # Tooltip and modal functions (~156 lines)
├── README.md                     # User-facing documentation
└── claude.md                     # This file (AI context)
```

### Modular Architecture

**Status**: ✅ Refactored (January 2026)

The codebase has been refactored from a monolithic 6,377-line app.js into a modular architecture with 16 specialized modules across 7 directories:

**Benefits**:

- **96% reduction** in main file size (6,377 → 243 lines)
- **Clear separation of concerns** - each module has single responsibility
- **Independent testability** - modules can be unit tested in isolation
- **Maintainability** - easier to navigate and modify specific features
- **Scalability** - simpler to add new models or features

**Module Organization**:

- **config/** - Configuration constants and global state management
- **framework/** - Three-layer pricing framework (categories → delivery → services)
- **models/** - Revenue model definitions with calculation logic
- **utils/** - Shared utilities (formatting, validation, metrics)
- **charts/** - Chart rendering and visualization
- **calculators/** - Calculation engines (forward, reverse, budget)
- **ui/** - User interface components (forms, events, admin panel, modals)

**Dependency Injection**:
The main app.js orchestrator sets up circular dependency resolution using dependency injection patterns, ensuring clean module boundaries while maintaining functionality.

## Core Features

### 1. Multi-Model Comparison System

**Status**: ✅ Complete

Users can select and compare multiple revenue models simultaneously:

- **Model Families**: 7 families grouping similar models (e.g., Subscription Family: SaaS, Per-Seat, Retainer, Managed Services)
- **Family Overlay Charts**: Models in same family overlay on identical charts
- **Universal Metrics**: All models calculate CAC, LTV, LTV:CAC, payback period for cross-family comparison
- **Dynamic UI**: Page updates in real-time as models are selected/deselected

### 2. Revenue Models (20 Total)

**Status**: ✅ All Implemented

#### Subscription Model Family

- Subscription (SaaS)
- Per-Seat/Per-User
- Retainer Agreements
- Managed Services

#### Usage-Based Consumption Family

- Usage-Based (Consumption)
- Pay-Per-Transaction
- Credits/Token System

#### Project Delivery Family

- Time and Materials (Hourly)
- Fixed-Price Projects
- Outcome-Based/Milestone

#### Free-to-Paid Conversion Family

- Freemium
- Open Core

#### Platform/Intermediary Family

- Marketplace/Platform Fee
- Revenue Share Partnership
- Advertising Supported

#### Enterprise License Family

- Enterprise License Agreement (ELA)
- Data Licensing
- White Label/OEM

#### Standalone Models

- One-Time Purchase (Perpetual License)
- Tiered Pricing

### 3. Enhanced UX Features

**Status**: ✅ Complete (December 2024)

- **Four Calculator Modes**:
  - **Vendor Mode (Forward)**: Traditional guided input fields with hints and category-specific defaults
  - **Growth Mode (Reverse)**: Set revenue targets and calculate required inputs
  - **Client Mode (Budget)**: Enter budget constraints to find optimal pricing options
  - **Admin Mode**: Centralized spreadsheet-style editor for all 20 model defaults
- **Real CAC Inputs**: Accurate Customer Acquisition Cost inputs across all models (replaces estimation)
- **Quick-Start Templates**: Pre-configured scenarios (Early Stage SaaS, Enterprise SaaS, Consumer App, etc.)
- **Smart Validation**: Pre-calculation warnings for problematic input combinations with actionable suggestions
- **Winner Indicators**: 🏆 Trophy icons highlighting best-performing models per metric
- **Metric Tooltips**: Explanations and industry benchmarks for each metric
- **Executive Summary**: AI-generated recommendations based on comparison results
- **Empty State Handling**: Friendly guidance when inputs produce zero revenue
- **Input Hints**: Contextual ranges showing typical values for each parameter

### 4. Calculator Modes

**Status**: ✅ Complete (December 2024)

The calculator supports four distinct modes, each serving a different user perspective:

#### Vendor Mode (Forward Calculator)

**Perspective**: Business/Vendor calculating potential revenue

- **Input**: Pricing parameters (price, users, growth, churn, etc.)
- **Output**: Revenue projections, MRR/ARR, customer growth
- **Use Case**: "If I charge R250/user with 10% monthly growth, what revenue will I generate?"
- **Metrics Shown**: Total revenue, MRR, ARR, LTV:CAC, payback period
- **Supports**: Single and multi-model comparison

#### Growth Mode (Reverse Calculator)

**Perspective**: Business/Vendor with revenue targets

- **Input**: Target revenue goal, target month, constraints
- **Output**: Required input values to achieve target
- **Use Case**: "What price do I need to charge to reach R100,000 MRR in 24 months?"
- **Algorithm**: Binary search to solve for selected variable
- **Scenarios**: Generates 3 alternative approaches (Recommended, Optimistic, Conservative)
- **Supports**: Single model only

#### Client Mode (Budget Calculator)

**Perspective**: Client/Buyer with budget constraints

- **Input**: Monthly budget, flexibility (strict/moderate/flexible), optimization priority
- **Output**: Multiple pricing options within budget
- **Use Case**: "I have R10,000/month. What's the best SaaS plan I can get?"
- **Optimization Priorities**:
  - **Maximum Capacity**: Get the most users/seats/storage
  - **Best Value**: Optimize for lowest cost per unit
  - **Premium Features**: Get the best tier within budget
  - **Budget Conscious**: Leave a 20% buffer
- **Budget Flexibility**:
  - Strict: Stay within budget exactly
  - Moderate: ±10% acceptable
  - Flexible: ±20% acceptable
- **Results**: Shows 3-6 options sorted by priority
- **Each Option Shows**:
  - Monthly cost and budget utilization %
  - Capacity (users, seats, storage, etc.)
  - Cost per unit for value comparison
  - Budget buffer (remaining budget)
  - Full configuration details
- **Color Coding**:
  - 🟢 Green = Within budget
  - 🟡 Yellow = Within flexibility range
  - 🔴 Red = Over budget (only if no options found)
- **Supports**: Multiple models (shows best option per model)

#### Admin Mode (Model Configuration Editor)

**Perspective**: Power user/Administrator managing model defaults

- **Input**: Direct editing of all model default parameters
- **Output**: Updated default values across all 20 models
- **Use Case**: "Customize all model defaults to match my industry benchmarks"
- **Interface**: Spreadsheet-style table with parameters as rows, models as columns
- **Features**:
  - **Centralized View**: All 20 models visible side-by-side
  - **Sticky Headers**: Parameter names and model names stay visible while scrolling
  - **Horizontal Scrolling**: Navigate through all models efficiently
  - **Real-time Updates**: Changes immediately update model defaults
  - **Parameter Tooltips**: Hover to see descriptions
  - **N/A Indicators**: Shows which parameters don't apply to specific models
- **Use Cases**:
  - Batch updating parameters across multiple models
  - Comparing default assumptions across pricing strategies
  - Customizing defaults for specific industries/markets
  - Quick auditing of all model configurations
- **Behavior**: Changes made in admin mode persist when switching to other modes
- **Access**: Available via "⚙️ Admin" button in calculator mode selector

**Mode Switching**: Users can switch between modes via the 4-button grid at the top of the interface (2×2 layout).

## Universal Metrics (Cross-Model Comparison)

All 20 models calculate these standardized metrics for comparison:

### Customer Economics

- **CAC** (Customer Acquisition Cost): Input-based, not estimated
- **LTV** (Lifetime Value): Total revenue per customer over lifetime
- **LTV:CAC Ratio**: Industry benchmarks: <1 unsustainable, 3-5 healthy, >5 excellent
- **Payback Period**: Months to recover CAC (lower is better)

### Growth Metrics

- **MoM Growth Rate**: Month-over-month revenue growth percentage
- **Customer Growth**: New customers/units acquired per period
- **Revenue Growth**: Total revenue trajectory

### Efficiency Metrics

- **Revenue per Customer**: Average revenue generated per customer/unit
- **Gross Margin**: If applicable to model type
- **Retention Rate**: Customer/unit retention over time

### Financial Performance

- **Total Revenue**: Sum over forecast period (default: 24 months)
- **Revenue Run Rate**: Annualized current revenue
- **Cash Flow Patterns**: Revenue recognition vs. cash received

## Key Implementation Patterns

### Model Definition Schema

```javascript
{
  name: "Model Name",
  family: "subscription", // or "usage", "project", "conversion", "platform", "enterprise", "standalone"
  inputs: [
    {
      key: "monthlyPrice",
      label: "Monthly Price",
      type: "currency", // currency | number | percent
      default: 99,
      hint: "Typical range: $49-$499 for SMB SaaS"
    }
  ],
  calculate: (inputs, months) => {
    // Returns array of monthly results with revenue, customers, etc.
  }
}
```

### Universal Metrics Calculation

```javascript
calculateUniversalMetrics(modelData, inputs) {
  return {
    totalRevenue: sum(monthlyRevenue),
    ltv: totalRevenue / totalCustomers,
    cac: inputs.cac || (monthlyRevenue[0] / newCustomers * 4), // Real CAC or fallback
    ltvCacRatio: ltv / cac,
    paybackPeriod: monthsToRecoverCAC,
    momGrowth: averageMonthlyGrowthRate
  }
}
```

### Comparison View Logic

```javascript
if (selectedModels.length === 0) {
  // Show empty state
} else if (allSameFamily(selectedModels)) {
  // Render overlay chart (single chart, multiple series)
  renderFamilyOverlayChart(selectedModels);
} else {
  // Render side-by-side charts OR universal metrics comparison
  renderSideBySideCharts(selectedModels);
  renderUniversalMetrics(selectedModels);
}
```

## Input Validation Rules

### Validation Framework

Pre-calculation checks to prevent zero-revenue scenarios and guide users:

- **Zero Inputs**: Warn if customers/units = 0
- **High Churn**: Alert if churn >15% without expansion revenue
- **Negative Unit Economics**: Flag if price < CAC or LTV:CAC < 1
- **Unrealistic Conversion**: Warn if conversion <0.5% or >25%
- **Model-Specific Rules**: Each model has custom validation logic

### Example Validation

```javascript
validateModelInputs(modelKey, inputs) {
  const warnings = [];

  if (inputs.newCustomers === 0) {
    warnings.push({
      field: 'newCustomers',
      message: 'Zero new customers will result in zero revenue',
      suggestion: 'Set to at least 10-20 for meaningful projections'
    });
  }

  if (inputs.churnRate > 15 && inputs.expansionRate < 5) {
    warnings.push({
      field: 'churnRate',
      message: 'High churn without expansion will cause declining revenue',
      suggestion: 'Reduce churn to <10% or increase expansion rate'
    });
  }

  return warnings;
}
```

## Chart Visualization Strategy

### Family Overlay Charts

When models from **same family** selected:

- Single chart with multiple colored series
- Shared Y-axis (MRR, Revenue, etc.)
- Shared X-axis (months)
- Legend to toggle series visibility

### Side-by-Side Charts

When models from **different families** selected:

- Separate charts per model
- Universal metrics panel above for cross-comparison
- Consistent styling across charts

### Chart Types by Model

- **Line Charts**: Revenue trends, customer growth (all models)
- **Stacked Area**: Revenue composition (Subscription, Tiered, Marketplace)
- **Bar Charts**: Period comparisons (Fixed-Price, Outcome-Based)
- **Waterfall**: MRR components (Subscription family)

### Empty State Handling

```javascript
if (allSeriesEmpty(chartData)) {
  renderEmptyState({
    icon: '📊',
    title: 'No Revenue Data',
    causes: [
      'New customers per month = 0',
      'Price per unit = 0',
      'Churn rate exceeds acquisition rate'
    ],
    action: 'Check validation warnings above'
  });
}
```

## Scenario Templates

Pre-configured input sets for common use cases:

### Subscription Model

- **Early Stage SaaS**: $49 price, 25 customers/month, 5% churn, $200 CAC
- **Enterprise SaaS**: $499 price, 5 customers/month, 3% churn, $2000 CAC

### Freemium Model

- **Consumer App**: 1000 free users/month, 2% conversion, 15% free churn
- **B2B Freemium**: 200 free users/month, 8% conversion, 10% free churn

### Usage-Based Model

- **API Service**: $0.01/unit, 10k units/customer, 15% usage growth
- **Cloud Infrastructure**: $0.05/unit, 5k units/customer, 20% usage growth

## Performance Targets

- **Initial Page Load**: <1 second (including ES6 module loading)
- **Model Selection**: <100ms UI update
- **Calculation**: <200ms for 24-month projection
- **Chart Render**: <300ms including animations
- **Input Change to Update**: <300ms (debounced)
- **Total JavaScript Size**: ~180 KB (~6,800 lines across 16 modules)

## Browser Compatibility

**Target**: Modern evergreen browsers with ES6 module support

- Chrome 90+ (ES6 modules supported)
- Firefox 88+ (ES6 modules supported)
- Safari 14+ (ES6 modules supported)
- Edge 90+ (ES6 modules supported)

**Required APIs**:

- ES6 Modules (import/export statements)
- ES6 JavaScript (arrow functions, const/let, template literals, destructuring)
- Canvas for ApexCharts
- LocalStorage (optional, for scenario persistence)

## Documentation Structure

The project uses a streamlined documentation approach with **claude.md** and **HISTORY.md** as the primary living documents:

### For Business Users & Product Teams
- **[README.md](README.md)** - Quick overview and getting started
- **[BUSINESS_GUIDE.md](BUSINESS_GUIDE.md)** - Comprehensive user guide with tutorials and examples

### For Understanding the Math
- **[CALCULATIONS.md](CALCULATIONS.md)** - Complete explanation of all formulas, rationale, and examples

### For Developers & AI Assistants
- **[claude.md](claude.md)** (this file) - Primary technical documentation and architecture reference
- **[HISTORY.md](HISTORY.md)** - Ongoing changelog, bug fixes, and development history

### Documentation Maintenance Guidelines
- **claude.md**: Update when architecture, features, or technical patterns change
- **HISTORY.md**: Add entries for all bug fixes, improvements, and refactoring work
- **README.md**: Keep concise, update only for major feature changes
- **BUSINESS_GUIDE.md**: Update when user workflows or features change
- **CALCULATIONS.md**: Update when formulas or pricing logic changes

---

## Development Workflow

### Making Changes

1. **Edit relevant module files**:
   - Models: `models/index.js`
   - UI changes: `ui/*.js`
   - Charts: `charts/index.js`
   - Calculations: `calculators/*.js`
   - Configuration: `config/constants.js`
   - Styles: `styles.css`
   - HTML: `index.html`
2. Test locally by opening `index.html` in browser (supports ES6 modules)
3. Commit changes to your feature branch
4. Push to origin
5. Changes auto-deploy to GitHub Pages (2-3 min delay)

### GitHub Pages Configuration

**Critical Requirements:**

- `.nojekyll` file MUST exist in root directory (already included)
- This file disables Jekyll processing which can break ES6 module imports
- Without it, modules fail with MIME type errors: "Expected a JavaScript module script but the server responded with a MIME type of 'text/html'"

**Why .nojekyll is Required:**

- GitHub Pages uses Jekyll by default to process static sites
- Jekyll can interfere with JavaScript module MIME types
- Jekyll may ignore or alter files in subdirectories (config/, ui/, etc.)
- ES6 modules require exact file serving without processing
- The `.nojekyll` file bypasses Jekyll entirely

**Deployment Settings:**

- Source: Deploy from branch (usually `main`)
- Directory: `/ (root)` - DO NOT use `/docs`
- All JavaScript files use relative imports with `.js` extensions
- No build process required

### Adding a New Model

1. Define model in `models/index.js` (~50 lines)
2. Implement `calculate()` function with monthly projections
3. Define input schema with defaults and hints
4. Assign to appropriate family in `framework/model-families.js`
5. Add validation rules in `utils/index.js` if needed
6. Test with all calculator modes (vendor, growth, client, admin)
7. Update this file's model count and documentation

### Testing Checklist

- [ ] Model renders in selector with correct family
- [ ] Input form generates with all fields
- [ ] Default values populate correctly
- [ ] Validation warnings fire for edge cases
- [ ] Calculation produces expected results (manual verification)
- [ ] Charts render without errors
- [ ] Universal metrics calculate correctly
- [ ] Winner indicators highlight correct model
- [ ] Empty state shows when appropriate
- [ ] Mobile responsive layout works

## Common Tasks

### Update Metric Interpretation Ranges

**Location**: `utils/index.js` (METRIC_EXPLANATIONS constant)

### Add New Scenario Template

**Location**: `ui/forms.js` (SCENARIO_TEMPLATES constant)

### Modify Chart Colors

**Location**: `config/constants.js` (CONFIG.chartColors)

### Adjust Validation Rules

**Location**: `utils/index.js` (validateModelInputs function)

### Change Default Forecast Period

**Location**: `config/constants.js` (CONFIG.defaultForecastMonths)

### Add New Revenue Model

**Location**: `models/index.js` (add to models object and export)

### Modify Calculator Logic

**Location**: `calculators/engine.js` (forward calculations) or `calculators/client-budget.js` (budget/reverse calculations)

### Update UI Components

**Location**: `ui/*.js` (forms, events, initialization, admin, modals)

### Add Chart Visualizations

**Location**: `charts/index.js` (chart rendering functions)

## Known Limitations & Trade-offs

### Modular Architecture

- **Pro**: Clean separation, easy navigation, testable modules, scalable codebase
- **Pro**: No build process required (ES6 modules work natively in modern browsers)
- **Con**: Slightly more complex for beginners (16 files vs 1 file)
- **Decision**: Modular structure improves maintainability significantly, worth the small learning curve

### Client-Side Only

- **Pro**: Free hosting, infinite scale, no server costs
- **Con**: Can't persist scenarios across devices, no user accounts
- **Solution**: Optional localStorage for single-device persistence

### CDN Dependencies

- **Risk**: ApexCharts or Tailwind CDN outage breaks app
- **Mitigation**: CDNs have 99.9% uptime, can vendor libraries if needed
- **Decision**: Accept CDN dependency for simplicity, add fallback if issues arise

### No Real-Time Collaboration

- **Limitation**: Can't share live scenarios with team members
- **Workaround**: Export/import JSON, or share URL parameters
- **Decision**: Out of scope for v1, focus on individual analysis

## Future Enhancements (Not Committed)

### Potential Features

- **Scenario Persistence**: Save/load scenarios via localStorage or export JSON
- **URL Parameters**: Shareable links with encoded inputs
- **CSV Export**: Download monthly projections as spreadsheet
- **Comparison Table**: Side-by-side month-by-month data grid
- **Dark Mode Toggle**: User preference for light/dark theme
- **Custom Model Builder**: Let users define custom revenue models

### Technical Improvements

- **Web Workers**: Offload calculations for 36+ month forecasts
- **Service Worker**: Offline functionality via PWA
- **TypeScript**: Add type safety and better IDE support
- **Unit Tests**: Add test coverage for calculation modules
- **Build Process**: Consider bundler (Vite/Rollup) only if deployment optimization needed

## Troubleshooting

### Charts Not Rendering

- Check browser console for ApexCharts CDN load errors
- Verify data array has correct format: `[{month: 0, revenue: 100}, ...]`
- Ensure chart container div exists in DOM

### Calculations Returning Zero

- Run validation warnings to check input combinations
- Verify churn rate not exceeding acquisition rate
- Check for division by zero in custom model logic

### Performance Degradation

- Reduce forecast months from 36 to 24
- Disable animations in chart config
- Debounce input changes (already implemented at 300ms)

## AI Assistant Guidelines

When working on this project:

1. **Read Before Writing**: Always read files before editing to preserve exact formatting
2. **Understand Module Structure**: Familiarize yourself with the 7-directory modular organization
3. **Find the Right Module**: Changes to models go in `models/`, UI in `ui/`, charts in `charts/`, etc.
4. **Test Calculations**: Verify mathematical accuracy with manual spot-checks
5. **Preserve Structure**: Maintain existing code organization and patterns
6. **Update This File**: Keep claude.md current when making architectural changes
7. **Validate Inputs**: Add validation rules in `utils/index.js` for any new model inputs
8. **Mobile-First**: Test responsive behavior on small screens
9. **Accessibility**: Use semantic HTML and ARIA labels where appropriate
10. **Performance**: Profile any changes that add computation (keep <300ms)
11. **Module Dependencies**: Be aware of circular dependencies; use dependency injection pattern when needed

## Development History

For a complete history of bug fixes, improvements, and architectural changes, see [HISTORY.md](./HISTORY.md).

### Most Recent Changes (January 2026)

- **Vendor Mode Comparison Charts**: Fixed default "Compare multiple models" checkbox to be checked, enabling multi-model comparison and graphs by default
- **Comprehensive Duplicate Declaration Resolution**: Fixed multiple SyntaxError instances preventing app from loading
- **DOMContentLoaded Race Condition**: Fixed complete initialization failure on mobile devices
- **Modular Architecture Refactoring**: Restructured 6,377-line monolithic file into 16 specialized modules

## Questions & Decisions

### Resolved

- ✅ Multi-model comparison: Implemented with family overlay + universal metrics
- ✅ All 20 models: Complete with full calculation logic
- ✅ Winner indicators: Implemented with trophy icons and green highlighting
- ✅ Metric explanations: Added with industry benchmarks and tooltips
- ✅ Input validation: Comprehensive pre-calculation warnings
- ✅ Budget calculator: Fixed dynamic updates when models change
- ✅ Section visibility: Centralized panel management system
- ✅ Chart descriptions: Added contextual subtitles
- ✅ Tooltip specificity: Conditional display based on complexity
- ✅ Large budget support: Dynamic capacity limits scale from R100 to R10M+
- ✅ Model selection modes: Toggle between single-model focus and multi-model comparison

### Open

- ⏳ Scenario persistence: localStorage vs. session-only? (Lean toward session-only for simplicity)
- ⏳ Data export: CSV export priority? (Low priority, charts are primary value)
- ⏳ Custom models: Allow user-defined models? (Out of scope for v1)
- ⏳ Team features: Multi-user scenarios? (Not needed, individual tool)

## Contact & Resources

- **Repository**: <https://github.com/devmade-ai/model-pear>
- **Live Demo**: <https://devmade-ai.github.io/model-pear>
- **Issues**: Report bugs via GitHub Issues
- **Documentation**: This file + inline code comments

---

**Note to AI Assistants**: This file is your source of truth for understanding the project's architecture, goals, and current state. Keep it concise and up-to-date. When in doubt about implementation details, refer to the modular code in the appropriate directories: `models/`, `ui/`, `charts/`, `calculators/`, `utils/`, `config/`, or `framework/`. The main `app.js` file is now just an orchestrator that sets up dependency injection and exports to window for backward compatibility.
