# Revenue Model Calculator

> **IMPORTANT**: This file should ALWAYS be kept up to date with any changes to project goals, architecture, completed features, and progress. Update this file whenever making significant changes to the codebase.

## Current Project Status

**Current Phase**: Building Multi-Model Comparison Infrastructure

**Completed Models**: 6/20
- ✅ One-Time Purchase (Perpetual License)
- ✅ Subscription (SaaS)
- ✅ Freemium
- ✅ Usage-Based (Consumption)
- ✅ Tiered Pricing
- ✅ Per-Seat/Per-User

**In Progress**:
- Designing model family metadata system
- Planning universal metrics calculator
- Planning comparison UI architecture

**Next Steps**:
- Implement remaining 14 revenue models
- Build model family compatibility matrix
- Create multi-model comparison UI
- Implement universal metrics (CAC, LTV, LTV:CAC, etc.)
- Build comparison chart overlay system

## New Goals: Multi-Model Comparison System

### Primary Objective
Enable users to compare multiple revenue models simultaneously on the same page, with intelligent grouping by model families and universal metrics that work across all models.

### Key Requirements

1. **No Mode Toggle**: Single page layout that dynamically updates as models are selected/deselected
2. **Model Families**: Group similar models that share inputs and can be directly compared
3. **Family-Level Comparison**: Models in the same family can overlay on identical charts
4. **Universal Metrics**: All models calculate CAC, LTV, LTV:CAC, payback period, growth rates
5. **Cross-Family Comparison**: Universal metrics allow comparison even between different families

### Model Families & Comparison Strategy

#### **Subscription Model Family**
- **Models**: Subscription (SaaS), Per-Seat/Per-User, Retainer Agreements, Managed Services
- **Shared Metrics**: MRR/ARR, Customer Count, Churn Rate, Revenue per Customer
- **Direct Comparison**: Can overlay on same charts

#### **Usage-Based Consumption Family**
- **Models**: Usage-Based (Consumption), Pay-Per-Transaction, Credits/Token System
- **Shared Metrics**: Revenue over time, Volume consumed, ARPU, Usage growth
- **Direct Comparison**: Can overlay on same charts

#### **Project Delivery Family**
- **Models**: Time and Materials (Hourly), Fixed-Price Projects, Outcome-Based/Milestone
- **Shared Metrics**: Revenue over time, Active projects, Revenue per resource
- **Note**: Revenue recognition patterns differ

#### **Free-to-Paid Conversion Family**
- **Models**: Freemium, Open Core
- **Shared Metrics**: Free vs Paid users, Conversion rate, Cohort conversion
- **Direct Comparison**: Can overlay on same charts

#### **Platform/Intermediary Family**
- **Models**: Marketplace/Platform Fee, Revenue Share, Advertising Supported
- **Shared Metrics**: Volume vs Revenue, Take rate, Participant growth
- **Direct Comparison**: Can overlay on same charts

#### **Enterprise License Family**
- **Models**: Enterprise License Agreement (ELA), Data Licensing, White Label/OEM
- **Shared Metrics**: Annual contract value, Contract count, Renewal rates
- **Direct Comparison**: Can overlay on same charts

#### **Standalone Models**
- **One-Time Purchase**: Lumpy revenue pattern, incompatible with recurring models (except maintenance component)
- **Professional Services Attachment**: Hybrid requiring split analysis

### Universal Comparable Metrics (All Models)

These allow comparison across ANY model combination:

**Customer Economics**:
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV:CAC ratio
- Payback period

**Growth Metrics**:
- Month-over-month growth rate
- Customer/unit growth rate
- Revenue growth rate

**Efficiency Metrics**:
- Revenue per customer
- Gross margin percentage
- Customer retention rate

**Financial Performance**:
- Total revenue over time
- Revenue run rate
- Cash flow patterns

### Comparison UI Architecture

**Multi-Model Selector**:
- Checkbox list of all 20 models
- Visual grouping by family
- Select multiple models simultaneously
- Page updates dynamically as selections change

**Comparison Views**:
1. **Family Overlay Charts**: When models from same family selected, overlay their data
2. **Universal Metrics Dashboard**: Side-by-side cards showing CAC, LTV, etc. for each selected model
3. **Comparison Table**: Month-by-month data for all selected models
4. **Individual Model Cards**: Each selected model gets its own card with specific charts

**Chart Strategy**:
- Same family → Single chart with multiple series (overlaid)
- Different families → Side-by-side charts OR universal metrics comparison
- Always show universal metrics for cross-model comparison

## Project Overview

Static web application for visualizing and comparing different software revenue models. Single HTML file with embedded JavaScript and CSS, hosted on GitHub Pages.

## Technical Stack

**Core Technologies:**
- HTML5 with embedded CSS and JavaScript
- ApexCharts 3.x for data visualization (145 KB via CDN)
- Tailwind CSS 3.4 via Play CDN (3.4 KB compressed)
- No build process, no dependencies, no server

**Hosting:**
- GitHub Pages
- Free HTTPS included
- Deploy via push to gh-pages branch
- URL format: username.github.io/repository-name

**Performance Targets:**
- Initial page load: under 1 second
- Model switch: under 100 ms
- Calculation + chart render: under 200 ms
- Input change to visual update: under 300 ms
- Total file size: under 200 KB

## Code Structure

Single file organization:
- HTML structure: 200-300 lines
- JavaScript logic: 800-1,200 lines
- Inline styles/overrides: 50-100 lines
- Total: 1,050-1,600 lines

**Application Sections:**
- Model definitions with input schemas
- Calculation engine for each revenue model
- Chart configuration generators
- Event handlers for user interactions
- Form renderer for dynamic inputs

## Revenue Models to Implement

### 1. One-Time Purchase (Perpetual License)

**Inputs:**
- Unit price per license (currency)
- Units sold per time period (number)
- Maintenance fee percentage (0-100%)
- Maintenance attach rate (0-100%)
- Customer lifetime in years (number)

**Calculations:**
- Revenue over time following sales cycles
- Cumulative customers vs revenue
- Maintenance revenue growth
- Revenue composition: new licenses vs maintenance

**Charts:**
- Line chart: Revenue over 24 months
- Stacked area: License revenue vs maintenance revenue
- Bar chart: Unit sales by period

### 2. Subscription (SaaS)

**Inputs:**
- Monthly or annual subscription price (currency)
- New customers acquired per period (number)
- Monthly churn rate (0-100%)
- Starting customer base (number)
- Expansion revenue rate (0-100%)

**Calculations:**
- Monthly Recurring Revenue (MRR) over time
- Annual Recurring Revenue (ARR)
- New MRR vs churned MRR vs expansion MRR
- Customer count over time
- Revenue per customer over time

**Charts:**
- Line chart: MRR/ARR growth
- Waterfall chart: MRR components
- Line chart: Customer count
- Bar chart: Revenue per customer

### 3. Freemium

**Inputs:**
- Free users acquired per period (number)
- Free-to-paid conversion rate (0-100%)
- Time to conversion in days or months (number)
- Paid subscription price (currency)
- Free user churn rate (0-100%)
- Paid user churn rate (0-100%)

**Calculations:**
- Free vs paid user growth
- Conversion funnel over time
- Paid revenue despite free user base
- Cohort conversion rates

**Charts:**
- Stacked area: Free vs paid users
- Line chart: Conversion rate over time
- Bar chart: Revenue from paid users
- Line chart: Cohort conversion tracking

### 4. Usage-Based (Consumption)

**Inputs:**
- Price per unit (currency)
- Average usage per customer per month (number)
- Usage growth rate per customer (0-100% monthly)
- New customers per period (number)
- Customer churn rate (0-100%)
- Usage variance/standard deviation (number)

**Calculations:**
- Revenue over time with variability
- Average revenue per customer
- Usage per customer over time
- Revenue distribution by customer segment
- Peak vs average usage patterns

**Charts:**
- Line chart with variance band: Revenue ± standard deviation
- Scatter plot: Revenue per customer distribution
- Line chart: Average usage per customer
- Histogram: Usage distribution

### 5. Tiered Pricing

**Inputs:**
- Price for Starter tier (currency)
- Price for Professional tier (currency)
- Price for Enterprise tier (currency)
- Percentage of customers in each tier (0-100% total)
- Monthly tier upgrade rate (0-100%)
- Monthly tier downgrade rate (0-100%)
- Monthly churn rate per tier (0-100%)
- New customer distribution across tiers (0-100% total)

**Calculations:**
- Revenue by tier over time
- Customer migration between tiers
- Average revenue per tier
- Tier distribution changes over time

**Charts:**
- Stacked area: Revenue by tier
- Sankey diagram: Customer migration (use Google Charts CDN)
- Bar chart: Average revenue per tier
- Line chart: Tier distribution over time

### 6. Per-Seat/Per-User

**Inputs:**
- Price per seat per month (currency)
- Average seats per customer at signup (number)
- Seat expansion rate (0-100% monthly growth)
- Customer churn rate (0-100%)
- New customers per period (number)

**Calculations:**
- Total seats over time
- Average seats per customer over time
- Revenue growth from seat expansion vs new customers
- Revenue per customer over time

**Charts:**
- Line chart: Total seats
- Line chart: Average seats per customer
- Stacked area: Revenue from expansion vs new customers
- Bar chart: Revenue per customer

### 7. Credits/Token System

**Inputs:**
- Credit package prices (array: 100 credits for $10, 1000 for $80, etc.)
- Average credits consumed per month per customer (number)
- Credit purchase frequency per year (number)
- Percentage of credits that expire unused (0-100%)
- Customer count (number)
- Credit balance rollover policy in months (number)

**Calculations:**
- Credit purchases over time (spiky pattern)
- Credit consumption over time (smoother)
- Outstanding credit liability
- Revenue recognition vs cash received

**Charts:**
- Line chart: Credits purchased vs consumed
- Bar chart: Outstanding credit liability
- Line chart: Revenue recognized vs cash received
- Bar chart: Package size distribution

### 8. Time and Materials (Hourly)

**Inputs:**
- Billable hourly rate (currency)
- Number of billable staff (number)
- Utilization rate (0-100%)
- Available hours per person per month (160-176 typical)
- Monthly growth in staff count (0-100%)

**Calculations:**
- Revenue over time
- Utilization rate trends
- Revenue per employee
- Billable hours vs available hours

**Charts:**
- Line chart: Revenue over time
- Line chart: Utilization rate
- Bar chart: Revenue per employee
- Stacked bar: Billable vs available hours

### 9. Fixed-Price Projects

**Inputs:**
- Average project value (currency)
- Project duration in months (number)
- Number of concurrent projects (number)
- New projects signed per period (number)
- Project completion rate (0-100%)
- Payment milestones: percentage upfront, at milestones, at completion (0-100% total)

**Calculations:**
- Revenue recognition over time
- Cash flow vs revenue
- Project pipeline value
- Active projects over time

**Charts:**
- Line chart: Revenue recognized vs cash received
- Bar chart: Active projects
- Area chart: Project pipeline value
- Bar chart: Average project value

### 10. Retainer Agreements

**Inputs:**
- Monthly retainer fee (currency)
- Number of active retainers (number)
- New retainers signed per month (number)
- Retainer churn rate (0-100% monthly)
- Average retainer duration in months (number)
- Retainer value growth rate (0-100% annual)

**Calculations:**
- MRR from retainers
- Active retainer count
- Retainer renewal rates by cohort
- Average retainer value over time

**Charts:**
- Line chart: MRR from retainers
- Line chart: Active retainer count
- Bar chart: Renewal rates by cohort
- Line chart: Average retainer value

### 11. Managed Services

**Inputs:**
- Price per managed unit (currency)
- Units under management (number)
- New units added per month (number)
- Unit churn rate (0-100% monthly)
- SLA penalty costs (0-100% of revenue at risk)

**Calculations:**
- Total units under management
- MRR growth
- Revenue per unit over time
- Unit growth vs churn

**Charts:**
- Line chart: Total units under management
- Line chart: MRR growth
- Bar chart: Revenue per unit
- Stacked area: Unit additions vs churn

### 12. Outcome-Based/Milestone

**Inputs:**
- Total project value (currency)
- Number of milestones (number)
- Payment amount per milestone (array or percentage)
- Average time to complete each milestone in weeks or months (number)
- Milestone completion rate (0-100%)
- Number of active projects (number)

**Calculations:**
- Cash flow pattern with stepped increases
- Revenue recognition vs cash received
- Milestone completion timeline
- Project success rate

**Charts:**
- Step chart: Cash flow at milestone completion
- Line chart: Revenue recognition vs cash
- Bar chart: Milestone completion timeline
- Pie chart: Project success rate

### 13. Open Core

**Inputs:**
- Community (free) users acquired per month (number)
- Community-to-paid conversion rate (0-100%)
- Paid tier pricing (currency)
- Community user churn (0-100%)
- Paid user churn (0-100%)
- Support costs per community user (currency)

**Calculations:**
- Community users vs paid users
- Conversion funnel efficiency
- Revenue despite large free base
- Cost per community user vs revenue per paid user

**Charts:**
- Stacked area: Community vs paid users
- Line chart: Conversion rate over time
- Bar chart: Revenue from paid tier
- Bar chart: Cost vs revenue comparison

### 14. Marketplace/Platform Fee

**Inputs:**
- Platform transaction volume per period (number)
- Commission rate (0-100%)
- Number of active sellers (number)
- Number of active buyers (number)
- Average transaction value (currency)
- Transaction growth rate (0-100% monthly)

**Calculations:**
- Gross Merchandise Volume (GMV) over time
- Take rate trends
- Revenue vs GMV
- Seller/buyer growth curves

**Charts:**
- Line chart: GMV over time
- Line chart: Commission rate trends
- Stacked area: Revenue vs GMV
- Line chart: Seller and buyer growth

### 15. Revenue Share

**Inputs:**
- Partner revenue per period (currency)
- Revenue share percentage (0-100%)
- Number of revenue-sharing partners (number)
- Average partner revenue growth (0-100% monthly)
- Partner churn rate (0-100%)
- New partners per period (number)

**Calculations:**
- Total partner revenue vs company take
- Revenue per partner over time
- Partner count growth
- Top partner concentration

**Charts:**
- Stacked bar: Partner revenue vs company revenue
- Line chart: Revenue per partner
- Line chart: Partner count
- Bar chart: Revenue concentration

### 16. Enterprise License Agreement (ELA)

**Inputs:**
- ELA contract value (currency)
- Contract term in years (1-3 typical)
- Number of ELAs signed per period (number)
- ELA renewal rate (0-100%)
- True-up charges (0-100% of base contract)
- Time to close ELA in months (number)

**Calculations:**
- Annual Contract Value (ACV) from ELAs
- Revenue recognition (straight-line over term)
- Pipeline value vs closed deals
- Average deal size over time

**Charts:**
- Bar chart: ACV from ELAs
- Line chart: Revenue recognition
- Bar chart: Pipeline vs closed
- Line chart: Average deal size

### 17. Pay-Per-Transaction

**Inputs:**
- Fee per transaction (currency or 0-100%)
- Transaction volume per period (number)
- Average transaction value (currency)
- Transaction growth rate (0-100% monthly)
- Number of active accounts (number)

**Calculations:**
- Transaction volume over time
- Revenue growth following transaction volume
- Average transaction value trends
- Revenue per active account

**Charts:**
- Bar chart: Transaction volume
- Line chart: Revenue growth
- Line chart: Average transaction value
- Bar chart: Revenue per account

### 18. Advertising Supported

**Inputs:**
- Active users: Daily Active Users (DAU) or Monthly Active Users (MAU)
- Ad impressions per user per session (number)
- Sessions per user per month (number)
- CPM rate (currency per 1,000 impressions)
- CPC rate (currency per click, if using click-based ads)
- Click-through rate (0-100%)
- User growth rate (0-100% monthly)

**Calculations:**
- Revenue vs user count
- CPM/CPC trends over time
- Impressions served over time
- Revenue per user (ARPU)
- Ad inventory utilization

**Charts:**
- Line chart: Revenue vs users
- Line chart: CPM/CPC trends
- Bar chart: Impressions over time
- Line chart: ARPU

### 19. Data Licensing

**Inputs:**
- Number of data licensing contracts (number)
- Average contract value (currency)
- Contract term in years (number)
- New contracts per period (number)
- Renewal rate (0-100%)
- Price increases at renewal (0-100%)

**Calculations:**
- Total licensing revenue
- Active contract count
- Average contract value over time
- Revenue retention from renewals

**Charts:**
- Line chart: Total licensing revenue
- Bar chart: Active contract count
- Line chart: Average contract value
- Bar chart: Revenue retention rate

### 20. White Label/OEM

**Inputs:**
- Number of white label partners (number)
- Base licensing fee per partner (currency)
- Revenue share percentage (0-100% of partner's sales)
- Average partner revenue per month (currency)
- Partner growth rate (0-100% monthly)
- New partners signed per period (number)
- Partner churn rate (0-100%)

**Calculations:**
- Direct licensing revenue vs revenue share
- Total revenue by component
- Partner count over time
- Average revenue per partner

**Charts:**
- Stacked area: License revenue vs revenue share
- Line chart: Partner count
- Bar chart: Average revenue per partner
- Pie chart: Revenue concentration

## Chart Visualization Standards

**ApexCharts Configuration:**
- Line charts for trends over time
- Area charts for stacked components
- Bar charts for comparisons and distributions
- Waterfall charts for component breakdowns
- Scatter plots for distribution analysis
- Histogram for frequency distributions

**Sankey Diagrams:**
- Use Google Charts CDN (separate library)
- Only for tiered pricing customer migration
- Fallback to stacked bar if library fails to load

**Color Scheme:**
- Primary data: #3B82F6 (blue)
- Positive metrics: #10B981 (green)
- Moderate values: #F59E0B (orange)
- Negative/churn: #EF4444 (red)
- Secondary data: #6B7280 (gray)

**Interactive Features:**
- Hover tooltips with exact values
- Click legend to toggle series visibility
- Zoom enabled for time-series charts
- Export to PNG (ApexCharts built-in)

## User Interface Layout

**Desktop (1920x1080 pixels):**
```
┌─────────────────────────────────────────────┐
│ Revenue Model Calculator                     │
├──────────────┬──────────────────────────────┤
│              │                              │
│ Model Select │  Primary Chart (800x400px)  │
│              │                              │
│ Input Form   ├──────────────┬───────────────┤
│              │ Secondary    │ Metrics Panel │
│ • Field 1    │ Chart        │ • Total Rev   │
│ • Field 2    │ (400x300px)  │ • Growth Rate │
│ • Field 3    │              │ • Avg/Customer│
│              │              │               │
│ [Calculate]  │              │               │
└──────────────┴──────────────┴───────────────┘
```

**Responsive Breakpoints:**
- Desktop: 1920x1080 (3-column layout)
- Laptop: 1366x768 (2-column layout)
- Tablet: 768x1024 (1-column, stacked charts)
- Mobile: 375x667 (single column, simplified inputs)

**Form Components:**
- Currency inputs: min=0, step=0.01
- Percentage inputs: min=0, max=100, step=0.1
- Integer inputs: min=0, step=1
- Real-time validation with visual feedback
- Default values provided for all fields

## Data Precision Standards

- Currency: 2 decimal places (0.01)
- Percentages: 1 decimal place (0.1%)
- Growth rates: 2 decimal places
- Customer counts: whole numbers (round to nearest integer)
- Usage metrics: 2 decimal places
- Revenue per customer: 2 decimal places

## Calculation Engine

**Time Period:**
- Default forecast: 24 months
- Maximum forecast: 36 months
- Minimum data points: 3-6 for trend identification
- Ideal data points: 12-24 for pattern recognition

**Calculation Flow:**
1. User selects model from dropdown
2. Form renders with model-specific inputs and defaults
3. User enters values or accepts defaults
4. Calculation runs on input change (debounced 300 ms)
5. Results array generated for specified months
6. Charts update with new data
7. Summary metrics displayed

**Data Structure Example:**
```javascript
models = {
  subscription: {
    inputs: [
      {name: 'monthlyPrice', label: 'Monthly Price', type: 'currency', default: 99},
      {name: 'newCustomers', label: 'New Customers/Month', type: 'number', default: 50},
      {name: 'churnRate', label: 'Churn Rate (%)', type: 'percent', default: 5}
    ],
    calculate: function(inputs, months) {
      let results = [];
      let customers = 0;
      let mrr = 0;

      for (let month = 0; month < months; month++) {
        customers += inputs.newCustomers;
        customers -= customers * (inputs.churnRate / 100);
        mrr = customers * inputs.monthlyPrice;

        results.push({
          month: month,
          customers: Math.round(customers),
          mrr: mrr.toFixed(2),
          arr: (mrr * 12).toFixed(2)
        });
      }

      return results;
    },
    charts: [
      {type: 'line', title: 'MRR Growth', series: ['mrr']},
      {type: 'line', title: 'Customer Count', series: ['customers']}
    ]
  }
}
```

## Development Time Estimates

**Phase 1: Core Infrastructure (8-12 hours)**
- HTML layout and responsive design: 3-4 hours
- Model selector and dynamic form generation: 2-3 hours
- Calculation engine framework: 3-5 hours

**Phase 2: Model Implementations (20-30 hours)**
- 5 models per day at 4-6 hours each
- 20 models total: 20-30 hours
- Per model: input definition, calculation logic, chart config

**Phase 3: Charts and Visualization (10-15 hours)**
- ApexCharts integration and configuration: 3-4 hours
- Chart templates for each visualization type: 5-8 hours
- Responsive behavior and mobile optimization: 2-3 hours

**Phase 4: Polish and Testing (8-12 hours)**
- Error handling and input validation: 3-4 hours
- Cross-browser testing: 2-3 hours
- Performance optimization: 2-3 hours
- Documentation: 1-2 hours

**Total Estimate: 46-69 hours**
**With 20% buffer: 55-83 hours**

## Risk Mitigation

**Risk: ApexCharts lacks specific visualization**
- Mitigation: Fall back to Chart.js for specific chart types
- Alternative: Use Google Charts CDN for Sankey diagrams only
- Impact: Additional 5-10 KB per alternative library

**Risk: Calculation complexity causes performance lag**
- Mitigation: Implement debouncing on all input changes (300 ms delay)
- Alternative: Web Workers for models requiring 1,000+ data point calculations
- Impact: Additional 50-100 lines of code for worker implementation

**Risk: Single file becomes unmaintainable above 2,000 lines**
- Mitigation: Keep modular structure with clear section comments
- Comment navigation: `// ========== SUBSCRIPTION MODEL ==========`
- Alternative: Split into modules if file exceeds 2,000 lines
- Impact: Requires build process, contradicts simplicity goal

**Risk: Browser compatibility issues with modern JavaScript**
- Mitigation: Use ES5 syntax or include Babel standalone for older browsers
- Target browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Fallback: Provide graceful degradation message for unsupported browsers

## Deployment Process

1. Create GitHub repository: revenue-model-calculator
2. Create index.html file with complete application code
3. Commit and push to main branch
4. Navigate to repository Settings > Pages
5. Set source to "Deploy from branch: main"
6. GitHub Pages publishes site at: username.github.io/revenue-model-calculator
7. Changes deploy automatically on push (2-3 minute delay)

**No custom domain configuration required**
**HTTPS enabled by default**
**No authentication or server setup needed**

## Alternative Approaches

**Multi-Model Comparison:**
- Use URL parameters to save state: `?model=subscription&price=99&churn=5`
- Enable multiple browser tabs for side-by-side comparison
- Add "Compare" mode with side-by-side chart display
- Impact: Additional 200-300 lines of code

**Scenario Sharing:**
- Export scenario as JSON blob
- Generate shareable URL with compressed parameters
- Import scenario from pasted JSON
- Impact: Additional 150-200 lines of code

**Team Collaboration:**
- Add localStorage for saving scenarios locally
- Export to CSV for spreadsheet analysis
- Print-friendly CSS for PDF generation
- Impact: Additional 100-150 lines of code

## Technical Dependencies

**CDN Resources:**
- ApexCharts: https://cdn.jsdelivr.net/npm/apexcharts@3.45.0/dist/apexcharts.min.js
- Tailwind CSS: https://cdn.tailwindcss.com
- Google Charts (optional): https://www.gstatic.com/charts/loader.js

**Browser Requirements:**
- Modern JavaScript support (ES5 minimum, ES6 preferred)
- Canvas element for chart rendering
- LocalStorage for scenario persistence (optional feature)
- Fetch API or XMLHttpRequest for CDN resource loading

**No Backend Requirements:**
- No server-side processing
- No database
- No authentication
- No API calls (except CDN resources)

## Input Validation Rules

**Currency Fields:**
- Type: number
- Min: 0
- Step: 0.01
- Format: Display with currency symbol in results
- Validation: Reject negative values, non-numeric input

**Percentage Fields:**
- Type: number
- Min: 0
- Max: 100
- Step: 0.1
- Format: Display with % symbol
- Validation: Reject values outside 0-100 range

**Integer Fields:**
- Type: number
- Min: 0
- Step: 1
- Format: Display as whole numbers
- Validation: Round to nearest integer, reject negative values

**Array Fields (e.g., credit packages):**
- Type: text with JSON parsing
- Format: Comma-separated values or JSON array
- Validation: Parse and validate each element
- Default: Provide example format

## Summary Metrics Panel

**Universal Metrics (all models):**
- Total revenue over forecast period
- Average monthly growth rate
- Final month revenue
- Revenue per customer (if applicable)

**Model-Specific Metrics:**
- Subscription: MRR, ARR, customer lifetime value
- Usage-based: Average usage per customer, revenue variance
- Tiered: Revenue distribution by tier
- Freemium: Conversion rate, paid user percentage
- Marketplace: GMV, take rate, transaction volume

**Metric Display Format:**
- Currency: $123,456.78 or R2,284,950.43
- Percentages: 12.5%
- Growth rates: +8.3% or -2.1%
- Counts: 1,234 customers
- Large numbers: Use thousand separators

## Browser Storage (Optional Feature)

**localStorage Implementation:**
- Save current scenario on input change (debounced)
- Restore last scenario on page load
- Clear storage option in UI
- Storage key format: `revenue-calc-{modelName}`
- Maximum storage: 5 MB (typical localStorage limit)

**Data Structure:**
```javascript
{
  model: 'subscription',
  inputs: {
    monthlyPrice: 99,
    newCustomers: 50,
    churnRate: 5
  },
  timestamp: '2024-01-15T10:30:00Z'
}
```

## Export Functionality

**Chart Export (ApexCharts built-in):**
- PNG format
- Filename: `{modelName}-{chartType}-{timestamp}.png`
- Resolution: Match displayed chart size
- Triggered by toolbar button on each chart

**Data Export (optional):**
- CSV format with headers
- Columns: Month, metric1, metric2, ...
- Filename: `{modelName}-data-{timestamp}.csv`
- Triggered by "Export Data" button

**Scenario Export (optional):**
- JSON format
- Contains: model name, all inputs, timestamp
- Clipboard copy or file download
- Import via paste or file upload

## Code Organization Pattern

```javascript
// ========== CONFIGURATION ==========
const CONFIG = {
  defaultForecastMonths: 24,
  maxForecastMonths: 36,
  debounceDelay: 300,
  chartColors: {...}
};

// ========== MODEL DEFINITIONS ==========
const models = {
  subscription: {...},
  freemium: {...},
  // ... 18 more models
};

// ========== CALCULATION ENGINE ==========
function calculateModel(modelName, inputs, months) {...}

// ========== CHART RENDERING ==========
function renderChart(chartConfig, data) {...}

// ========== FORM GENERATION ==========
function generateForm(modelInputs) {...}

// ========== EVENT HANDLERS ==========
function onModelChange() {...}
function onInputChange() {...}

// ========== UTILITIES ==========
function formatCurrency(value) {...}
function formatPercentage(value) {...}
function validateInput(type, value) {...}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', init);
```

## Testing Requirements

**Manual Testing Checklist:**
- Each model renders correct input form
- Default values populate correctly
- Calculations produce expected results for test cases
- Charts render without errors
- Responsive layout works on all breakpoints
- Input validation prevents invalid values
- Chart interactivity functions (zoom, toggle, export)
- Browser compatibility across target browsers

**Test Cases Per Model:**
- Default inputs produce valid output
- Extreme values (0, 100%, maximum numbers)
- Edge cases (100% churn, zero customers, etc.)
- Growth scenarios (rapid, moderate, declining)
- Multiple time periods (12, 24, 36 months)

**Performance Testing:**
- Page load time under 1 second
- Input change to chart update under 300 ms
- Memory usage stable over multiple calculations
- No memory leaks after 100+ calculations

## Documentation Requirements

**README.md Content:**
- Project description and purpose
- Live demo link
- Model list with brief descriptions
- Technology stack
- Local development instructions
- Deployment instructions
- Contributing guidelines (if open source)

**Inline Code Comments:**
- Section headers for major code blocks
- Complex calculation explanations
- Formula citations if based on specific methodologies
- Parameter descriptions for functions
- Edge case handling explanations

**User Guide (optional):**
- How to select a model
- Input field explanations
- Chart interpretation guide
- Export instructions
- Scenario saving/loading

## Assumptions

**Scope:**
- Single-user tool for personal analysis
- No scenario saving between sessions (unless localStorage implemented)
- No user accounts or authentication
- Compare models sequentially, not simultaneously
- Public GitHub repository
- No custom domain needed

**Data:**
- Maximum forecast period: 36 months
- All calculations client-side
- No external data sources
- No real-time data updates

**Visual Design:**
- Modern, clean interface
- Light mode only (no dark mode toggle)
- Charts use consistent color scheme
- Tailwind CSS default styling
- No custom fonts beyond system defaults

**Deployment:**
- Updates pushed manually via git
- No CI/CD pipeline initially
- GitHub Pages automatic deployment
- No staging environment

## Open Questions

1. Multi-model comparison: Support viewing 2-3 models simultaneously for direct comparison, or analyze one model at a time?

2. Scenario persistence: Should scenarios save locally (localStorage) to persist between browser sessions, or start fresh each time?

3. Export requirements: Beyond PNG chart export, are CSV data exports or shareable URLs needed?

4. Target complexity: Start with 5-10 most common models first, or implement all 20 models in initial version?

5. Update expectations: Will model formulas need regular updates (suggesting multiple files for easier maintenance), or is single-file acceptable for infrequent changes?
