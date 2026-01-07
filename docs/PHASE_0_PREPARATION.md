# Phase 0: Preparation & Planning

This document captures the findings from Phase 0 of the implementation roadmap, providing the foundation for transforming the Pricing Equilibrium Calculator into a comprehensive Inter-Company Software Transaction Tool.

---

## 0.1 Codebase Audit

### Current Architecture Overview

**Project Type:** Browser-based SPA (Single Page Application)
**Technology Stack:**
- HTML5 with semantic markup
- ES6 JavaScript modules (no build process)
- Tailwind CSS via CDN
- ApexCharts via CDN

**Total Codebase:** ~3,973 lines of JavaScript across 12 modules

### Module Structure

```
/home/user/model-pear/
├── index.html                    # Entry point (172 lines)
├── app.js                        # Application orchestrator (243 lines)
├── styles.css                    # Custom CSS styles
│
├── config/
│   ├── constants.js             # Chart colors, global config (21 lines)
│   └── sa-pricing-defaults.js   # South African market defaults
│
├── models/
│   └── index.js                 # 5 pricing model definitions (792 lines)
│
├── calculators/
│   ├── engine.js                # Main calculation engine (129 lines)
│   └── reverse-calculations.js  # Auto-calculate missing inputs
│
├── ui/
│   ├── initialization.js        # App startup & DOM setup
│   ├── forms.js                 # Dynamic form generation
│   ├── results-display.js       # Render result panels
│   └── modals.js                # Tooltips & modal dialogs
│
├── charts/
│   └── index.js                 # ApexCharts integration
│
├── utils/
│   └── index.js                 # Formatters, validators, helpers
│
└── docs/                         # Documentation
```

### Current Pricing Models (5)

| Model | Key Purpose | Equilibrium Logic |
|-------|-------------|-------------------|
| **Subscription (SaaS)** | Monthly recurring revenue | Seller floor vs buyer ceiling (2.5x ROI) |
| **Usage-Based** | Pay per unit consumed | Per-unit equilibrium analysis |
| **Per-Seat** | Price per user/month | Per-seat equilibrium analysis |
| **One-Time** | Perpetual license + maintenance | First-year TCO vs annual value (2x ROI) |
| **Marketplace** | Commission-based platform | Platform margin vs merchant tolerance |

### Model Definition Structure

Each model follows this structure:
```javascript
{
    name: 'Model Name',
    description: 'Brief description',
    inputs: [
        {
            name: 'fieldName',
            label: 'Display Label',
            type: 'currency' | 'number' | 'percent' | 'text',
            default: defaultValue,
            min: 0,
            max: 100,           // optional
            step: 1,
            category: 'pricing' | 'seller' | 'buyer',
            hint: 'Helper text'
        }
    ],
    calculate: function(inputs) {
        // Returns standardized result object
        return {
            // Revenue & Profit
            monthlyRevenue, annualRevenue, monthlyCost, monthlyProfit, annualProfit, actualMargin,

            // Seller perspective
            sellerMinimumPrice, sellerMeetsTarget, sellerPriceGap,

            // Buyer perspective
            buyerROI, buyerAnnualSavings, buyerPaybackMonths, buyerMaxPrice,

            // Equilibrium
            equilibriumExists, equilibriumRange
        };
    },
    defaultTier: 'standard',
    tiers: ['basic', 'standard', 'enterprise']
}
```

### Data Flow

```
User selects model
        ↓
Form generates dynamically from model.inputs
        ↓
User enters values / selects auto-calculation mode
        ↓
Real-time validation
        ↓
"Calculate Equilibrium" clicked
        ↓
calculateModel() → gathers inputs → calls model.calculate()
        ↓
Results render in 4 panels + equilibrium chart
```

### Key Files for Extension

| File | Purpose | Extension Strategy |
|------|---------|-------------------|
| `models/index.js` | Model definitions | Add new models here |
| `calculators/engine.js` | Calculation orchestration | Extend for new calculation modes |
| `ui/forms.js` | Dynamic form generation | Add new input types, categories |
| `ui/results-display.js` | Results rendering | Add new perspectives, panels |
| `charts/index.js` | Visualization | Add new chart types |
| `config/constants.js` | Global configuration | Add new config options |

---

## 0.1.2 Extension Points Identified

### 1. Model Registry (HIGH PRIORITY)

**Current State:** Models are hardcoded in `models/index.js`

**Extension Strategy:**
- Create `models/registry.js` for inter-company transaction models
- Keep existing pricing models in `models/pricing-models.js`
- Add model category concept: `pricing` | `intercompany`
- Support model variants as sub-models

**New Model Structure:**
```javascript
{
    id: 'model-1-cost-plus',
    category: 'intercompany',
    name: 'Model 1: Development Services (Cost-Plus)',
    variants: ['1A', '1B', '1C', '1D', '1E', '1F'],
    selectedVariant: '1B',  // Current variant
    inputs: [...],
    calculate: function(inputs, variant) { ... }
}
```

### 2. Input Categories (MEDIUM PRIORITY)

**Current Categories:** `pricing`, `seller`, `buyer`

**New Categories Needed:**
- `developer` - Developer entity inputs
- `buyer` - Buyer entity inputs (rename from current)
- `transaction` - Transaction structure inputs
- `tax` - South African tax inputs
- `compliance` - Transfer pricing inputs

### 3. Results Perspectives (HIGH PRIORITY)

**Current:** Single combined view with seller/buyer sections

**New Perspectives:**
- **Developer Perspective:** Revenue, asset recognition, amortisation, tax position
- **Buyer Perspective:** Capitalisation, expense treatment, deferred tax
- **Combined Perspective:** Consolidation impact, intercompany elimination

**UI Component:** Perspective toggle (tabs or buttons)

### 4. Chart Types (MEDIUM PRIORITY)

**Current:** Equilibrium range chart only

**New Charts Needed:**
- Variant comparison bar chart
- Cash flow timeline
- Asset carrying value over time
- Ownership split pie chart
- Risk vs return scatter plot

### 5. State Management (MEDIUM PRIORITY)

**Current:** Minimal state (selected model, calculation mode)

**New State Needs:**
- Selected inter-company model
- Selected variant within model
- Current perspective view
- Entity configurations (Developer, Buyer)
- Tax parameters
- Compliance scores

---

## 0.1.3 Current Dependencies

### External CDN Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | Play CDN (latest) | Styling & responsive design |
| ApexCharts | 3.45.0 | Data visualization |

### No Build Dependencies
- No npm packages
- No bundler (webpack, vite, etc.)
- No transpilation (babel)
- Pure ES6 modules loaded directly

### Browser Compatibility
- ES6 module support required
- Modern browsers only (Chrome, Firefox, Safari, Edge)

---

## 0.2 Data Model Design

### 0.2.1 Inter-Company Model Registry

```javascript
// models/intercompany/registry.js

export const INTERCOMPANY_MODELS = {
    'model-1': {
        id: 'model-1',
        name: 'Development Services (Cost-Plus)',
        description: 'Developer creates software for Buyer as a service',
        category: 'intercompany',

        variants: {
            '1A': { name: 'Pure Cost Reimbursement', margin: 0 },
            '1B': { name: 'Cost-Plus Fixed Margin', margin: 'variable' },
            '1C': { name: 'Cost-Plus with Performance Bonus', margin: 'variable+bonus' },
            '1D': { name: 'Fixed Price Development Contract', pricing: 'fixed' },
            '1E': { name: 'Time and Materials', pricing: 'hourly' },
            '1F': { name: 'Dedicated Development Team', pricing: 'retainer' }
        },
        defaultVariant: '1B',

        inputs: [...],  // Variant-specific inputs
        calculate: function(inputs, variantId) { ... }
    },

    'model-2': { /* Licence with Royalties */ },
    'model-3': { /* Joint Development / Cost-Sharing */ },
    'model-4': { /* Build-Operate-Transfer (BOT) */ },
    'model-5': { /* Software Sale with Ongoing Support */ },
    'model-6': { /* Subscription/SaaS (Enhanced) */ }
};
```

### 0.2.2 Three-Perspective Output Schema

```javascript
// Standardized output structure for all inter-company models

const threePerspecitveOutput = {
    // ===== DEVELOPER PERSPECTIVE =====
    developer: {
        // Revenue Recognition
        revenue: {
            total: 0,
            breakdown: {
                development: 0,
                licence: 0,
                royalties: 0,
                maintenance: 0,
                services: 0
            },
            recognitionTiming: 'over-time' | 'point-in-time'
        },

        // Asset Treatment
        asset: {
            recognised: true | false,
            carryingValue: 0,
            amortisationPeriod: 0,  // years
            amortisationMethod: 'straight-line',
            annualAmortisation: 0,
            accumulatedAmortisation: 0
        },

        // Tax Position (SA-specific)
        tax: {
            taxableIncome: 0,
            corporateTaxRate: 0.27,  // 27%
            taxPayable: 0,
            section11eDeduction: 0,   // Software depreciation
            deferredTaxAsset: 0,
            deferredTaxLiability: 0,
            netTaxPosition: 0
        },

        // Transfer Pricing
        transferPricing: {
            method: 'cost-plus' | 'CUP' | 'profit-split',
            margin: 0,
            benchmarkRange: { low: 0.05, median: 0.10, high: 0.15 },
            withinRange: true | false,
            riskScore: 'low' | 'medium' | 'high'
        }
    },

    // ===== BUYER PERSPECTIVE =====
    buyer: {
        // Asset Recognition
        asset: {
            recognised: true | false,
            capitalised: 0,
            expensed: 0,
            carryingValue: 0,
            usefulLife: 0,  // years
            section11eType: 'mainframe-5yr' | 'pc-2yr',
            annualAmortisation: 0
        },

        // Expense Profile
        expenses: {
            total: 0,
            breakdown: {
                amortisation: 0,
                maintenance: 0,
                royalties: 0,
                services: 0
            },
            timing: []  // Year-by-year expense schedule
        },

        // Tax Position
        tax: {
            deductibleExpenses: 0,
            section11eDeduction: 0,
            deferredTaxAsset: 0,
            deferredTaxLiability: 0,
            netTaxBenefit: 0
        }
    },

    // ===== COMBINED / CONSOLIDATION PERSPECTIVE =====
    combined: {
        // Intercompany Elimination
        elimination: {
            required: true | false,
            profitEliminated: 0,
            assetAdjustment: 0
        },

        // Asset Efficiency
        assetEfficiency: {
            totalGroupAsset: 0,
            duplication: 0,
            efficiencyRatio: 0  // Lower is better (no double-counting)
        },

        // Cash Flow Summary
        cashFlow: {
            developerNetCash: 0,
            buyerNetCash: 0,
            groupNetCash: 0  // Should net to zero for intercompany
        },

        // Key Metrics
        metrics: {
            totalTransactionValue: 0,
            effectiveTaxRate: 0,
            netGroupBenefit: 0
        }
    },

    // ===== METADATA =====
    metadata: {
        modelId: 'model-1',
        variantId: '1B',
        calculatedAt: new Date().toISOString(),
        assumptions: []
    }
};
```

### 0.2.3 Compliance Scoring Schema

```javascript
// Compliance scoring for transfer pricing risk

const complianceSchema = {
    // Overall Risk Score
    overallRisk: 'low' | 'medium' | 'high',
    overallScore: 85,  // 0-100

    // Individual Risk Factors
    factors: {
        // Transfer Pricing Risk
        transferPricing: {
            score: 90,
            status: 'low',
            details: {
                marginWithinBenchmark: true,
                documentationComplete: true,
                comparablesAvailable: true,
                businessRationaleStrong: true
            }
        },

        // Accounting Treatment Risk
        accounting: {
            score: 80,
            status: 'low',
            details: {
                ifrsCompliant: true,
                controlAssessmentClear: true,
                recognitionTimingCorrect: true,
                disclosuresComplete: true
            }
        },

        // Tax Risk
        tax: {
            score: 75,
            status: 'medium',
            details: {
                section11eAppliedCorrectly: true,
                deferredTaxCalculated: true,
                cgtTreatmentClear: true,
                witholdingTaxConsidered: true
            }
        },

        // Documentation Risk
        documentation: {
            score: 70,
            status: 'medium',
            details: {
                writtenAgreement: true,
                transferPricingPolicy: true,
                developmentPhaseRecords: false,
                costTrackingSystems: true,
                boardMinutes: false
            }
        }
    },

    // Recommendations
    recommendations: [
        {
            priority: 'high',
            category: 'documentation',
            action: 'Document development phase vs capitalisation date',
            reference: 'IAS 38.57'
        }
    ],

    // Checklist Status
    checklist: {
        agreement: { complete: true, required: true },
        transferPricingDoc: { complete: true, required: true },
        developmentRecords: { complete: false, required: true },
        costTracking: { complete: true, required: true },
        controlAssessment: { complete: true, required: false },
        relatedPartyDisclosure: { complete: true, required: true }
    }
};
```

### 0.2.4 Entity Configuration Schema

```javascript
// Entity configuration for Developer and Buyer

const entityConfigSchema = {
    developer: {
        name: 'Developer Entity Name',
        jurisdiction: 'South Africa',
        taxResident: true,
        corporateTaxRate: 0.27,
        accountingFramework: 'IFRS',  // IFRS | GRAP
        relatedParty: true,
        consolidationStatus: 'subsidiary'  // parent | subsidiary | associate | none
    },

    buyer: {
        name: 'Buyer Entity Name',
        jurisdiction: 'South Africa',
        taxResident: true,
        corporateTaxRate: 0.27,
        accountingFramework: 'IFRS',
        section11eType: 'pc-2yr',  // pc-2yr | mainframe-5yr
        relatedParty: true,
        consolidationStatus: 'subsidiary'
    },

    relationship: {
        relatedParties: true,
        sameGroup: true,
        consolidationRequired: true,
        transferPricingApplies: true
    }
};
```

---

## 0.3 State Management Plan

### Current State Management

Simple module-level state:
- `selectedModel` in `ui/initialization.js`
- `previousCalculationModes` in `calculators/engine.js`
- `chartInstances` in `config/constants.js`

### New State Requirements

```javascript
// state/app-state.js

export const appState = {
    // Mode Selection
    mode: 'pricing' | 'intercompany',  // Which calculator mode

    // Model Selection
    selectedModel: null,       // Model ID
    selectedVariant: null,     // Variant ID (for intercompany)

    // Perspective View
    currentPerspective: 'combined',  // 'developer' | 'buyer' | 'combined'

    // Entity Configuration
    entities: {
        developer: { ...entityDefaults },
        buyer: { ...entityDefaults }
    },

    // Tax Parameters
    taxParams: {
        corporateTaxRate: 0.27,
        section11eType: 'pc-2yr',
        accountingFramework: 'IFRS'
    },

    // Calculation Results
    results: null,
    complianceScore: null,

    // UI State
    calculationMode: 'none',
    pricingStrategy: 'balanced',
    isCalculating: false
};

// State update function
export function updateState(updates) {
    Object.assign(appState, updates);
    notifyListeners();
}

// Simple pub/sub for reactivity
const listeners = [];
export function subscribe(callback) {
    listeners.push(callback);
    return () => listeners.splice(listeners.indexOf(callback), 1);
}
function notifyListeners() {
    listeners.forEach(fn => fn(appState));
}
```

---

## Next Steps

### Phase 0 Completion
- [x] 0.1 Codebase Audit
- [x] 0.2 Data Model Design
- [ ] 0.3 UI/UX Planning (deferred to Phase 1)

### Ready for Phase 1
With the data models designed, we can begin Phase 1: Foundation Infrastructure
1. Create model registry system
2. Implement three-perspective framework
3. Add South African tax inputs
4. Add entity configuration panels

---

## Change Log

| Date | Section | Changes |
|------|---------|---------|
| 2026-01-07 | All | Initial Phase 0 documentation created |
