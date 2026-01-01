# Revenue Model Calculator

> **Purpose**: AI assistant context file for the Revenue Model Calculator project
> **Last Updated**: January 2026
> **Status**: Active Development - All 20 models implemented with comparison features and bug fixes

## Project Overview

**What**: Interactive web application for comparing software revenue models through visualization and financial metrics

**Goal**: Help founders, product managers, and finance teams evaluate different pricing strategies by comparing 20+ revenue models side-by-side with accurate financial projections

**Deployment**: Single-file static web app hosted on GitHub Pages (no backend, no build process)

## Architecture

### Tech Stack
- **Frontend**: Single HTML file with embedded CSS/JS
- **Styling**: Tailwind CSS (Play CDN)
- **Charts**: ApexCharts 3.x (CDN)
- **Hosting**: GitHub Pages (free HTTPS)
- **Performance**: <1s page load, <300ms updates

### File Structure
```
model-pear/
├── index.html          # Complete application (HTML + CSS + JS)
├── styles.css          # Additional custom styles
├── app.js              # Main application logic (linked from index.html)
├── README.md           # User-facing documentation
└── claude.md           # This file (AI context)
```

### Code Organization (app.js)
- **Line 1-95**: Configuration & constants
- **Line 97-1100**: 20 revenue model definitions with input schemas
- **Line 1102-2400**: Calculation engines (model-specific + universal metrics)
- **Line 2402-3200**: Chart rendering (overlay, side-by-side, comparison)
- **Line 3202-3800**: UI generation (forms, tabs, selectors)
- **Line 3802-4000**: Event handlers & initialization

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

- **Initial Page Load**: <1 second
- **Model Selection**: <100ms UI update
- **Calculation**: <200ms for 24-month projection
- **Chart Render**: <300ms including animations
- **Input Change to Update**: <300ms (debounced)
- **Total File Size**: ~150 KB (well under 200 KB target)

## Browser Compatibility

**Target**: Modern evergreen browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required APIs**:
- ES6 JavaScript (arrow functions, const/let, template literals)
- Canvas for ApexCharts
- LocalStorage (optional, for scenario persistence)

## Development Workflow

### Making Changes
1. Edit `index.html`, `app.js`, or `styles.css`
2. Test locally by opening `index.html` in browser
3. Commit changes to branch `claude/refactor-claude-md-c94Pq`
4. Push to origin
5. Changes auto-deploy to GitHub Pages (2-3 min delay)

### Adding a New Model
1. Define model in `app.js` models object (~50 lines)
2. Implement `calculate()` function with monthly projections
3. Define input schema with defaults and hints
4. Assign to appropriate family
5. Test validation rules
6. Update this file's model count

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
Location: `app.js:1272-1350` (METRIC_EXPLANATIONS constant)

### Add New Scenario Template
Location: `app.js:1251-1330` (SCENARIO_TEMPLATES constant)

### Modify Chart Colors
Location: `app.js:1-95` (CONFIG.chartColors)

### Adjust Validation Rules
Location: `app.js:1146-1267` (validateModelInputs function)

### Change Default Forecast Period
Location: `app.js:1-95` (CONFIG.defaultForecastMonths)

## Known Limitations & Trade-offs

### Single-File Architecture
- **Pro**: Zero build process, instant deployment, easy to understand
- **Con**: File size growing (~4000 lines in app.js), harder to navigate
- **Decision**: Keep single-file until exceeds 5000 lines, then split

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
- **Build Process**: Consider Vite/Rollup if file exceeds 5000 lines
- **TypeScript**: Add type safety if codebase grows significantly

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
2. **Test Calculations**: Verify mathematical accuracy with manual spot-checks
3. **Preserve Structure**: Maintain existing code organization and patterns
4. **Update This File**: Keep claude.md current when making architectural changes
5. **Validate Inputs**: Add validation rules for any new model inputs
6. **Mobile-First**: Test responsive behavior on small screens
7. **Accessibility**: Use semantic HTML and ARIA labels where appropriate
8. **Performance**: Profile any changes that add computation (keep <300ms)

## Recent Bug Fixes & Improvements (January 2026)

### Client Budget Calculator Fixes
**Issue**: Budget calculation options not appearing when models changed
**Fix**: Added `updateClientBudgetOptions()` call in `onModelSelectionChange()` to refresh budget options when models are selected/deselected in client-budget mode

### Section Visibility Management
**Issue**: Empty sections remained visible after switching modes or calculations
**Fix**: Created centralized `hideAllResultPanels()` function that:
- Hides all result panels (reverse, client-budget, universal metrics, charts, etc.)
- Removes dynamically created elements (executive summary, variables summary)
- Called at start of all calculation functions to ensure clean state
- Eliminated redundant hiding code across multiple functions

### Chart Descriptions
**Issue**: Charts lacked context and descriptions
**Fix**: Added `subtitle` property to all major charts with descriptive text:
- "License revenue declines while maintenance provides recurring stability"
- "Monthly and annual recurring revenue trends"
- "User base growth and conversion funnel visualization"
- "Revenue fluctuations based on customer usage patterns"
- And more model-specific descriptions

### Tooltip Improvements
**Issue**: Info icons (ⓘ) appeared on every input field, even simple ones
**Fix**: Made tooltips conditional - only show for complex inputs:
- Displays ⓘ icon only when hint is >50 chars OR contains complex keywords (churn, conversion, CAC, LTV, ratio, multiplier, percentage)
- Simple inputs like "Number of Users" no longer show redundant tooltip icons
- Keeps inline hint text for all inputs as quick reference

### Code Quality
- Removed 50+ lines of redundant panel-hiding code
- Added `variables-summary` class to dynamic summary elements for consistent cleanup
- Improved separation of concerns between UI state management and rendering

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

### Open
- ⏳ Scenario persistence: localStorage vs. session-only? (Lean toward session-only for simplicity)
- ⏳ Data export: CSV export priority? (Low priority, charts are primary value)
- ⏳ Custom models: Allow user-defined models? (Out of scope for v1)
- ⏳ Team features: Multi-user scenarios? (Not needed, individual tool)

## Contact & Resources

- **Repository**: https://github.com/devmade-ai/model-pear
- **Live Demo**: https://devmade-ai.github.io/model-pear
- **Issues**: Report bugs via GitHub Issues
- **Documentation**: This file + inline code comments

---

**Note to AI Assistants**: This file is your source of truth for understanding the project's architecture, goals, and current state. Keep it concise and up-to-date. When in doubt about implementation details, refer to the actual code in `app.js` and `index.html`.
