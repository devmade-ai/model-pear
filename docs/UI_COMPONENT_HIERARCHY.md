# UI Component Hierarchy

> **Purpose**: Reference document for understanding how UI components are organized and interact
> **Last Updated**: January 2026
> **Total UI Code**: ~13,000+ lines across 21 files

## Overview

The tool has **two UI modes** with separate component trees:

| Mode | Entry Point | Components | Purpose |
|------|-------------|------------|---------|
| **Pricing** | `ui/*.js` (5 files) | ~950 lines | Find price where seller hits margin AND buyer sees ROI |
| **Intercompany** | `ui/intercompany/*.js` (16 files) | ~12,000 lines | Compare transaction structures for best mutual outcome |

Both modes share:
- State management (`state/app-state.js`)
- Mode switching (`app.js`)
- Tooltip system (`ui/modals.js`)

---

## Component Tree

### Root Orchestration

```
index.html
└── app.js (orchestrator)
    ├── Mode: pricing
    │   └── [Pricing Component Tree]
    │
    └── Mode: intercompany
        └── [Intercompany Component Tree]
```

### Pricing Mode Components

```
app.js
├── ui/initialization.js
│   └── Model selector buttons (Subscription, Usage, Per-Seat, etc.)
│
├── ui/forms.js
│   ├── generateForm(modelKey)
│   ├── Calculation mode selector
│   └── Input field groups (Pricing, Seller, Buyer)
│
├── ui/results-display.js
│   ├── renderOverviewPanel()
│   ├── renderSellerPanel()
│   ├── renderBuyerPanel()
│   └── renderEquilibriumPanel()
│
├── ui/modals.js
│   ├── showTooltipModal()
│   ├── showMetricInfo()
│   └── showInputInfo()
│
└── charts/index.js
    └── Equilibrium chart (ApexCharts)
```

### Intercompany Mode Components

```
app.js
└── ui/intercompany/calculator.js (main controller)
    │
    ├── TAB: Calculator ─────────────────────────────────────────────
    │   │
    │   ├── party-selector.js
    │   │   └── Independent / Related party toggle
    │   │
    │   ├── [Selection Mode - one active at a time]
    │   │   ├── options-overview.js (default)
    │   │   │   ├── 6 model cards with icons
    │   │   │   ├── Quick comparison table
    │   │   │   └── "Explore" buttons → structure-selector.js
    │   │   │
    │   │   ├── structure-selector.js (wizard)
    │   │   │   ├── Progressive Q&A flow
    │   │   │   ├── Real-time recommendation
    │   │   │   └── Variant selection
    │   │   │
    │   │   └── [Direct Selection]
    │   │       └── Model + Variant dropdowns
    │   │
    │   ├── perspective-toggle.js
    │   │   └── Developer / Buyer perspective buttons
    │   │
    │   ├── entity-config.js
    │   │   ├── Developer entity settings (collapsible)
    │   │   ├── Buyer entity settings (collapsible)
    │   │   └── Relationship settings
    │   │
    │   ├── [Input Form]
    │   │   └── Dynamic fields per model/variant
    │   │
    │   ├── cost-estimator.js
    │   │   └── Hours × Rate helper modal
    │   │
    │   ├── results-display.js
    │   │   ├── Developer perspective results
    │   │   │   ├── Revenue breakdown
    │   │   │   ├── Cost breakdown
    │   │   │   ├── Profit analysis
    │   │   │   └── Tax liability
    │   │   │
    │   │   └── Buyer perspective results
    │   │       ├── Asset capitalisation
    │   │       ├── Amortisation schedule
    │   │       ├── Section 11(e) benefit
    │   │       └── Deferred tax position
    │   │
    │   └── range-input.js
    │       └── Low / Base / High toggle for sensitivity inputs
    │
    ├── TAB: Compliance ─────────────────────────────────────────────
    │   └── compliance-analyzer.js
    │       ├── TP Risk Dashboard (composite score)
    │       ├── Benchmark Comparison
    │       ├── Accounting Treatment Summary
    │       ├── Tax Impact Analysis
    │       └── Compliance Checklists (6 categories)
    │
    ├── TAB: Visualizations ─────────────────────────────────────────
    │   └── advanced-visualizations.js
    │       ├── Cross-Model Comparison Charts
    │       ├── Asset Location Timeline (animated)
    │       ├── Cash Flow Waterfall (interactive)
    │       ├── Amortisation Schedule Chart
    │       ├── TP Risk Heat Map
    │       └── Risk vs Return Quadrant
    │
    ├── TAB: Sensitivity ────────────────────────────────────────────
    │   └── sensitivity-visualizations.js
    │       ├── Scenario Comparison (Best/Base/Worst)
    │       ├── Tornado Chart (input sensitivity ranking)
    │       ├── Fan Chart (projection ranges)
    │       ├── Break-Even Analysis
    │       └── Monte Carlo Simulation Results
    │
    ├── TAB: Projections ────────────────────────────────────────────
    │   └── projection-visualizations.js
    │       ├── Projection Parameters (years, growth, discount)
    │       ├── Multi-Year Cash Flow Chart
    │       ├── NPV Waterfall
    │       ├── ROI Trajectory
    │       ├── Asset Value Timeline
    │       ├── Payback Period Indicator
    │       └── Metrics Radar Chart
    │
    ├── TAB: Testing ────────────────────────────────────────────────
    │   └── testing.js
    │       └── Test execution panel (debug/validation)
    │
    └── FLOATING: Compare Mode ──────────────────────────────────────
        ├── comparison-manager.js
        │   ├── Saved options list (up to 20)
        │   ├── Load / Delete / Rename actions
        │   ├── Edit notes
        │   └── Export (JSON, CSV, Print)
        │
        ├── comparison-view.js
        │   ├── Side-by-side table (2-4 options)
        │   ├── Difference column (▲ ▼ arrows)
        │   ├── Best/worst highlighting
        │   └── Compatibility warnings
        │
        └── diff-view.js
            └── What changed between two options
```

---

## Logic-to-UI Mapping

Each UI component has a corresponding logic module:

| Logic Module (`models/intercompany/`) | UI Component (`ui/intercompany/`) |
|---------------------------------------|-----------------------------------|
| `structure-selector.js` | `structure-selector.js` |
| `registry.js` | `calculator.js`, `options-overview.js` |
| `compliance-analyzer.js` | `compliance-analyzer.js` |
| `advanced-visualizations.js` | `advanced-visualizations.js` |
| `sensitivity-analysis.js` | `sensitivity-visualizations.js`, `range-input.js` |
| `growth-projections.js` | `projection-visualizations.js` |

---

## State Management

All components communicate via pub/sub pattern through `state/app-state.js`:

```
┌─────────────────────────────────────────────────────────────┐
│                     app-state.js                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  state = {                                          │   │
│  │    mode: 'intercompany',                            │   │
│  │    intercompany: {                                  │   │
│  │      selectedModel: 'model-1',                      │   │
│  │      selectedVariant: '1A',                         │   │
│  │      currentPerspective: 'developer',               │   │
│  │      lastResults: { ... },                          │   │
│  │      entityConfig: { ... },                         │   │
│  │      savedComparisons: [ ... ],                     │   │
│  │      activeComparisonIds: [ ... ]                   │   │
│  │    }                                                │   │
│  │  }                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│         ┌────────────────┼────────────────┐                │
│         ▼                ▼                ▼                │
│    subscribe()      getState()      setState()             │
└─────────────────────────────────────────────────────────────┘
         │                                    ▲
         ▼                                    │
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ results-display │  │ compliance-     │  │ comparison-     │
│      .js        │  │ analyzer.js     │  │ manager.js      │
│                 │  │                 │  │                 │
│ subscribe(cb)   │  │ subscribe(cb)   │  │ setState(...)   │
│ re-renders on   │  │ re-renders on   │  │ triggers all    │
│ state change    │  │ state change    │  │ subscribers     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Key State Actions

| Action | Effect |
|--------|--------|
| `selectIntercompanyModel(modelId)` | Updates selected model, clears results |
| `selectVariant(variantId)` | Updates selected variant |
| `setPerspective(perspective)` | Switches Developer/Buyer view |
| `setIntercompanyResults(results)` | Stores calculation results |
| `saveComparison(option)` | Adds option to saved list |
| `setActiveComparisonIds(ids)` | Selects options for comparison |

---

## Initialization Flow

### App Startup

```
DOMContentLoaded
    │
    ▼
app.js: initApp()
    │
    ├── 1. initialization.init()          [pricing mode setup]
    ├── 2. setupModeSwitching()           [pricing ↔ intercompany]
    ├── 3. setupTooltipHelpers()          [help system]
    │
    └── 4. switchMode('intercompany')     [default mode]
            │
            ▼
        initIntercompanyCalculator()
            │
            ├── renderPartySelector()
            ├── renderOptionsOverview()    [default view]
            ├── initPerspectiveToggle()
            ├── initEntityConfig()
            ├── renderIntercompanyResults()
            ├── initComplianceAnalyzer()
            ├── initAdvancedVisualizations()
            ├── initRangeInputControls()
            ├── initSensitivityVisualizations()
            ├── initProjectionVisualizations()
            ├── initComparisonManager()
            └── initComparisonView()
```

### Calculation Flow

```
User fills inputs
    │
    ▼
Click "Calculate"
    │
    ▼
calculator.js: onCalculateClick()
    │
    ▼
registry.js: calculateIntercompany()
    │
    ▼
Returns results object
    │
    ▼
setIntercompanyResults(results)     [state update]
    │
    ├───────────────────────────────────────┐
    ▼                                       ▼
results-display.js                   compliance-analyzer.js
re-renders results                   re-renders risk dashboard
    │                                       │
    ├───────────────────────────────────────┤
    ▼                                       ▼
sensitivity-visualizations.js        projection-visualizations.js
re-renders charts                    re-renders projections
```

---

## Component Lifecycle

All intercompany components follow this pattern:

```javascript
// Component initialization
export function initComponent(container) {
  // 1. Render initial UI
  renderComponent(container);

  // 2. Setup event listeners
  setupEventListeners(container);

  // 3. Subscribe to state changes
  unsubscribe = subscribe(handleStateChange);
}

// Component cleanup
export function destroyComponent() {
  // 1. Unsubscribe from state
  if (unsubscribe) unsubscribe();

  // 2. Remove event listeners
  removeEventListeners();

  // 3. Clear references
  containerRef = null;
}
```

---

## File Reference

### Pricing Mode (`ui/`)

| File | Lines | Purpose |
|------|-------|---------|
| `initialization.js` | ~114 | Model selector, form generator setup |
| `forms.js` | ~242 | Dynamic form generation |
| `results-display.js` | ~369 | Pricing results panels |
| `modals.js` | ~228 | Tooltip/help modal system |

### Intercompany Mode (`ui/intercompany/`)

| File | Lines | Purpose |
|------|-------|---------|
| `calculator.js` | ~500+ | Main controller, tab management |
| `options-overview.js` | ~300+ | Model selection grid |
| `structure-selector.js` | ~400+ | Wizard Q&A flow |
| `party-selector.js` | ~150+ | Independent/Related toggle |
| `entity-config.js` | ~200+ | Entity settings panel |
| `perspective-toggle.js` | ~200+ | Developer/Buyer switcher |
| `results-display.js` | ~400+ | Perspective-based results |
| `compliance-analyzer.js` | ~400+ | TP risk, checklists |
| `advanced-visualizations.js` | ~300+ | Charts, timelines |
| `range-input.js` | ~300+ | Sensitivity range controls |
| `sensitivity-visualizations.js` | ~400+ | Tornado, fan, Monte Carlo |
| `projection-visualizations.js` | ~400+ | NPV, IRR, payback charts |
| `comparison-manager.js` | ~350+ | Saved options panel |
| `comparison-view.js` | ~350+ | Side-by-side comparison |
| `diff-view.js` | ~250+ | Option differences |
| `cost-estimator.js` | ~250+ | Hours × Rate helper |

---

## Maintenance Notes

### When to Update This Document

- Adding/removing UI components
- Changing component relationships
- Modifying state management patterns
- Adding new tabs or modes
- Restructuring file organization

### Related Documentation

| Document | Content |
|----------|---------|
| `CLAUDE.md` | Architecture overview, models, guidelines |
| `BUSINESS_GUIDE.md` | User workflows and features |
| `UI_UX_GUIDE.md` | Accessibility and design patterns |
| `CALCULATIONS.md` | Formula explanations |
