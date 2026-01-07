# Implementation Roadmap: Inter-Company Transaction Tool

This document outlines the phased implementation plan for integrating the Financial Models framework with the existing Pricing Equilibrium Calculator. Each phase and sub-phase is designed to be completed in a separate session.

---

## Overview

**Goal:** Transform the Pricing Equilibrium Calculator into a comprehensive Inter-Company Software Transaction Tool that handles pricing, accounting treatment, tax implications, and transfer pricing compliance.

**Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│                    INTER-COMPANY SOFTWARE TOOL                  │
├─────────────────────────────────────────────────────────────────┤
│  Module 1: Structure    Module 2: Pricing    Module 3: Compliance│
│  Selector (NEW)         Calculator (ENHANCED) Analyzer (NEW)     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Preparation & Planning
**Status:** Completed
**Estimated Sessions:** 1-2
**Documentation:** [PHASE_0_PREPARATION.md](PHASE_0_PREPARATION.md)

### 0.1 Codebase Audit
- [x] Review current calculator architecture
- [x] Document existing module structure
- [x] Identify extension points
- [x] List current dependencies

### 0.2 Data Model Design
- [x] Design model/variant data structures
- [x] Design three-perspective output schema
- [x] Design compliance scoring schema
- [x] Plan state management for new features

### 0.3 UI/UX Planning
- [~] Sketch new navigation flow (deferred to Phase 1)
- [~] Design model selector UI (deferred to Phase 1)
- [~] Design variant comparison views (deferred to Phase 1)
- [~] Plan mobile responsiveness for new features (deferred to Phase 1)

---

## Phase 1: Foundation Infrastructure
**Status:** In Progress
**Estimated Sessions:** 3-4
**Dependencies:** Phase 0 (Completed)

### 1.1 Model Registry System
- [x] Create model definitions data structure
- [x] Define Model 1 (Cost-Plus) with metadata
- [x] Define 6 variants for Model 1 (1A-1F) with metadata
- [ ] Define remaining models (2-6) with metadata
- [ ] Create model-to-current-calculator mapping

### 1.2 Three-Perspective Framework
- [x] Create perspective toggle UI component
- [x] Implement Developer perspective output structure
- [x] Implement Buyer perspective output structure
- [x] Implement Combined perspective output structure
- [x] Add perspective state management

### 1.3 South African Tax Inputs
- [x] Add corporate tax rate input (default 27%)
- [x] Add Section 11(e) software type selector (Mainframe 5yr / PC 2yr)
- [x] Add useful life input for amortisation
- [ ] Add accounting framework selector (IFRS / GRAP)
- [x] Calculate deferred tax positions

### 1.4 Entity Configuration
- [x] Add Developer entity configuration schema
- [x] Add Buyer entity configuration schema
- [ ] Add entity configuration UI panel
- [ ] Add related party status toggle
- [ ] Add consolidation status toggle

---

## Phase 2: Model 1 - Development Services (Cost-Plus)
**Status:** Not Started
**Estimated Sessions:** 3-4
**Dependencies:** Phase 1

### 2.1 Core Cost-Plus Model
- [ ] Create Model 1 input form
- [ ] Add base development cost input
- [ ] Add margin percentage input (5-15% range guidance)
- [ ] Add research vs development phase split
- [ ] Add IAS 38 criteria date input

### 2.2 Variant Implementation (1A-1F)
- [ ] 1A: Pure Cost Reimbursement (no margin)
- [ ] 1B: Cost-Plus Fixed Margin (standard)
- [ ] 1C: Cost-Plus with Performance Bonus (milestones)
- [ ] 1D: Fixed Price Development Contract
- [ ] 1E: Time and Materials
- [ ] 1F: Dedicated Development Team

### 2.3 Model 1 Calculations
- [ ] Developer revenue by variant
- [ ] Developer profit and tax calculations
- [ ] Buyer capitalisation calculations
- [ ] Buyer amortisation schedule
- [ ] Combined asset efficiency ratio
- [ ] Intercompany profit elimination amount

### 2.4 Model 1 Outputs & Visualisations
- [ ] Variant comparison bar chart
- [ ] Cash flow timeline chart
- [ ] Asset carrying value over time chart
- [ ] Risk vs return scatter plot
- [ ] Decision support recommendation matrix

---

## Phase 3: Model 2 - Software Licence with Royalties
**Status:** Not Started
**Estimated Sessions:** 3-4
**Dependencies:** Phase 1

### 3.1 Core Licence Model
- [ ] Create Model 2 input form
- [ ] Add development cost inputs (Developer side)
- [ ] Add licence type selector (Perpetual / Term)
- [ ] Add exclusivity toggle (Exclusive / Non-exclusive)
- [ ] Add territory selector

### 3.2 Variant Implementation (2A-2H)
- [ ] 2A: Perpetual Licence (Upfront Payment)
- [ ] 2B: Term Licence (Annual/Multi-Year)
- [ ] 2C: Usage-Based Royalties
- [ ] 2D: Minimum Guarantee Plus Royalties
- [ ] 2E: Revenue Share / Profit Share
- [ ] 2F: White-Label / Reseller Licence
- [ ] 2G: Exclusive vs Non-Exclusive comparison
- [ ] 2H: Source Code Licence / Escrow

### 3.3 Model 2 Calculations
- [ ] Developer asset recognition and amortisation
- [ ] Revenue recognition (point in time vs over time)
- [ ] Royalty revenue calculations
- [ ] Buyer capitalisation (licence cost)
- [ ] Buyer expense profile (royalties)
- [ ] Combined NPV analysis

### 3.4 Model 2 Outputs & Visualisations
- [ ] Revenue recognition timeline
- [ ] Buyer cost split (capitalised vs expensed)
- [ ] Developer vs Buyer asset position chart
- [ ] Risk-return bubble chart

---

## Phase 4: Model 3 - Joint Development / Cost-Sharing
**Status:** Not Started
**Estimated Sessions:** 3-4
**Dependencies:** Phase 1

### 4.1 Core Joint Development Model
- [ ] Create Model 3 input form
- [ ] Add Developer contribution inputs (cash, personnel, IP, facilities)
- [ ] Add Buyer contribution inputs
- [ ] Add contribution valuation method selector
- [ ] Add benefit projection inputs

### 4.2 Variant Implementation (3A-3H)
- [ ] 3A: Proportional Cost Sharing (Equal 50/50)
- [ ] 3B: Contribution-Based Sharing
- [ ] 3C: Benefit-Based Sharing
- [ ] 3D: Platform + Application Split
- [ ] 3E: Development + Commercialisation Split
- [ ] 3F: Joint Venture Entity
- [ ] 3G: Consortium / Multi-Party
- [ ] 3H: Pre-Competitive Joint Development

### 4.3 Model 3 Calculations
- [ ] Ownership percentage calculator
- [ ] Per-party capitalisation amounts
- [ ] Per-party amortisation schedules
- [ ] Buy-in payment calculations
- [ ] Combined asset efficiency (should be high)
- [ ] Transfer pricing contribution analysis

### 4.4 Model 3 Outputs & Visualisations
- [ ] Ownership split pie charts
- [ ] Contribution composition stacked bar
- [ ] Asset recognition by party grouped bar
- [ ] Sankey diagram for JV flows (3F)
- [ ] Contribution timeline area chart

---

## Phase 5: Model 4 - Build-Operate-Transfer (BOT)
**Status:** Not Started
**Estimated Sessions:** 3-4
**Dependencies:** Phase 1

### 5.1 Core BOT Model
- [ ] Create Model 4 input form
- [ ] Add development cost inputs
- [ ] Add operation period inputs (duration, service fee)
- [ ] Add operating cost inputs
- [ ] Add transfer pricing method selector

### 5.2 Variant Implementation (4A-4H)
- [ ] 4A: Fixed Transfer Price
- [ ] 4B: Formula-Based Transfer Price
- [ ] 4C: Fair Market Value at Transfer
- [ ] 4D: BOT with Purchase Option
- [ ] 4E: Build-Operate-Own (BOO) - no transfer
- [ ] 4F: Build-Transfer-Operate (BTO)
- [ ] 4G: Build-Lease-Transfer (IFRS 16)
- [ ] 4H: Phased Transfer

### 5.3 Model 4 Calculations
- [ ] Developer service revenue over operation period
- [ ] Developer asset amortisation during operation
- [ ] Developer gain/loss at transfer
- [ ] Buyer expense during operation (SaaS treatment)
- [ ] Buyer asset at transfer
- [ ] Lease calculations for 4G (IFRS 16)
- [ ] Option valuation for 4D

### 5.4 Model 4 Outputs & Visualisations
- [ ] Asset location over time area chart
- [ ] Cumulative buyer cash outflow timeline
- [ ] Developer profit accumulation chart
- [ ] Ownership timeline Gantt chart
- [ ] Value split stacked bar

---

## Phase 6: Model 5 - Software Sale with Ongoing Support
**Status:** Not Started
**Estimated Sessions:** 3-4
**Dependencies:** Phase 1

### 6.1 Core Sale Model
- [ ] Create Model 5 input form
- [ ] Add sale price input
- [ ] Add payment structure selector (lump sum / instalments)
- [ ] Add support fee inputs
- [ ] Add support term inputs

### 6.2 Variant Implementation (5A-5H)
- [ ] 5A: Clean Sale (no post-sale obligations)
- [ ] 5B: Sale Plus Maintenance Agreement
- [ ] 5C: Sale Plus Support and Updates
- [ ] 5D: Sale with Warranty
- [ ] 5E: Sale with Buyback Commitment
- [ ] 5F: Sale with Retained Improvements
- [ ] 5G: Asset Sale vs Share Sale comparison
- [ ] 5H: Sale with Licence-Back

### 6.3 Model 5 Calculations
- [ ] Developer gain/loss on sale
- [ ] Developer CGT vs revenue treatment
- [ ] Developer support margin
- [ ] Buyer asset allocation (IFRS 15 bundling)
- [ ] Buyer amortisation schedule
- [ ] Warranty provision (5D)
- [ ] Securities transfer tax (5G share sale)

### 6.4 Model 5 Outputs & Visualisations
- [ ] Revenue split bar (sale vs support)
- [ ] Transaction price allocation pie chart
- [ ] Buyer asset carrying value timeline
- [ ] Cash flow waterfall

---

## Phase 7: Model 6 - Subscription/SaaS Enhancement
**Status:** Not Started
**Estimated Sessions:** 2-3
**Dependencies:** Phase 1

### 7.1 Enhance Existing Subscription Model
- [ ] Add variant selector to current Subscription model
- [ ] Add Developer asset tracking
- [ ] Add customisation control assessment
- [ ] Add transition rights option

### 7.2 Variant Implementation (6A-6I)
- [ ] 6A: Pure SaaS (Multi-Tenant) - enhance existing
- [ ] 6B: Dedicated Instance (Single-Tenant)
- [ ] 6C: Subscription with Customisation
- [ ] 6D: Hybrid (Subscription + On-Premise)
- [ ] 6E: Freemium / Tiered Pricing
- [ ] 6F: Consumption-Based Pricing - enhance existing Usage-Based
- [ ] 6G: Enterprise Agreement (Committed Spend)
- [ ] 6H: Private Label SaaS
- [ ] 6I: Managed Service with Transition Rights

### 7.3 Model 6 Additional Calculations
- [ ] Developer asset amortisation
- [ ] Developer multi-customer cost allocation
- [ ] Customisation control test (6C)
- [ ] On-premise licence accounting (6D)
- [ ] Transition accounting (6I)
- [ ] SaaS vs Build vs Buy comparison

### 7.4 Model 6 Outputs & Visualisations
- [ ] Annual cost comparison by variant
- [ ] Developer revenue vs asset value timeline
- [ ] SaaS vs alternatives comparison chart
- [ ] Multi-factor radar chart

---

## Phase 8: Module 1 - Structure Selector
**Status:** Not Started
**Estimated Sessions:** 2-3
**Dependencies:** Phases 2-7 (at least 2 models implemented)

### 8.1 Decision Tree Logic
- [ ] Design decision tree algorithm
- [ ] Map questions to model recommendations
- [ ] Weight factors for scoring
- [ ] Handle edge cases and ties

### 8.2 Selector UI
- [ ] Create step-by-step wizard interface
- [ ] Question: Who should own IP?
- [ ] Question: Cash flow preference?
- [ ] Question: Risk allocation preference?
- [ ] Question: Asset recognition priority?
- [ ] Question: Are entities consolidated?
- [ ] Display recommended model with rationale

### 8.3 Variant Recommendation
- [ ] Within-model variant selector logic
- [ ] Scenario guidance display
- [ ] Trade-off analysis display
- [ ] Link to selected model calculator

---

## Phase 9: Module 3 - Compliance Analyzer
**Status:** Not Started
**Estimated Sessions:** 3-4
**Dependencies:** Phases 2-7 (at least 3 models implemented)

### 9.1 Transfer Pricing Risk Score
- [ ] Define scoring methodology
- [ ] Margin vs benchmark range analysis
- [ ] Comparable transaction assessment
- [ ] Documentation status factor
- [ ] Business rationale factor
- [ ] Calculate composite risk score (Low/Medium/High)

### 9.2 Accounting Treatment Summary
- [ ] Generate Developer accounting summary
- [ ] Generate Buyer accounting summary
- [ ] Identify key accounting standards applied
- [ ] Flag complex accounting issues
- [ ] Generate journal entry examples

### 9.3 Tax Impact Analysis
- [ ] Section 11(e) deduction schedule
- [ ] CGT calculation (where applicable)
- [ ] Tax timing differences
- [ ] Deferred tax calculations
- [ ] Net tax position summary

### 9.4 Compliance Checklist
- [ ] Written agreement checklist
- [ ] Transfer pricing documentation checklist
- [ ] Development phase documentation checklist
- [ ] Cost tracking systems checklist
- [ ] Control assessment checklist
- [ ] Related party disclosure checklist
- [ ] Export checklist as PDF/printable

### 9.5 Compliance UI
- [ ] Risk score dashboard display
- [ ] Heat map visualisation
- [ ] Checklist interactive interface
- [ ] Warning/flag system for issues
- [ ] Recommendations for improvement

---

## Phase 10: Advanced Visualisations
**Status:** Not Started
**Estimated Sessions:** 2-3
**Dependencies:** Phases 2-7, Phase 9

### 10.1 Cross-Model Comparison Charts
- [ ] Model comparison summary table
- [ ] Combined asset position by model
- [ ] Total cost to Buyer by model
- [ ] Developer return by model
- [ ] Risk score by model

### 10.2 Timeline Visualisations
- [ ] Asset location timeline (animated)
- [ ] Cash flow waterfall (interactive)
- [ ] Amortisation schedules (multi-entity)
- [ ] Project phase Gantt chart

### 10.3 Risk Visualisations
- [ ] Transfer pricing risk heat map
- [ ] Risk vs return quadrant chart
- [ ] Compliance score gauge
- [ ] Sensitivity tornado chart (Stage 2 prep)

---

## Phase 11: Stage 2 - Range Selections & Sensitivity
**Status:** Not Started
**Estimated Sessions:** 3-4
**Dependencies:** Phases 2-10

### 11.1 Range Input Framework
- [ ] Design range input UI component
- [ ] Low / Base / High input mode
- [ ] Slider-based range selection
- [ ] Apply to key inputs across all models

### 11.2 Sensitivity Calculations
- [ ] Best case / Base case / Worst case scenarios
- [ ] Break-even analysis calculations
- [ ] Input sensitivity ranking
- [ ] Monte Carlo simulation (optional)

### 11.3 Sensitivity Visualisations
- [ ] Tornado chart (input sensitivity)
- [ ] Fan chart (projection ranges)
- [ ] Break-even analysis chart
- [ ] Range bars on comparison charts

---

## Phase 12: Stage 3 - Growth Projections
**Status:** Not Started
**Estimated Sessions:** 3-4
**Dependencies:** Phase 11

### 12.1 Projection Inputs
- [ ] Add expected revenue inputs (Buyer side)
- [ ] Add enhancement cost projections
- [ ] Add inflation rate input
- [ ] Add discount rate input
- [ ] Add projection period selector (5/10 years)

### 12.2 Projection Calculations
- [ ] NPV calculations per party
- [ ] IRR calculations per party
- [ ] Payback period calculations
- [ ] Projected asset value trajectories
- [ ] Break-even usage/revenue analysis

### 12.3 Projection Visualisations
- [ ] Multi-year cash flow projection
- [ ] NPV comparison across models/variants
- [ ] ROI trajectory charts
- [ ] Asset value with enhancement additions

---

## Phase 13: Polish & Documentation
**Status:** Not Started
**Estimated Sessions:** 2-3
**Dependencies:** Phases 1-10 (core features)

### 13.1 User Documentation
- [ ] Update BUSINESS_GUIDE.md with new features
- [ ] Create model-specific user guides
- [ ] Add glossary of accounting/tax terms
- [ ] Create video walkthrough scripts

### 13.2 Developer Documentation
- [ ] Update CLAUDE.md with new architecture
- [ ] Document new module structure
- [ ] Document calculation formulas
- [ ] Create API documentation (if applicable)

### 13.3 Testing & Quality
- [ ] Create test scenarios for each model
- [ ] Validate calculations against examples
- [ ] Cross-browser testing
- [ ] Accessibility audit for new features
- [ ] Performance testing

### 13.4 UI Polish
- [ ] Consistent styling across new features
- [ ] Responsive design verification
- [ ] Loading states and error handling
- [ ] Tooltips and help text
- [ ] Keyboard navigation for new components

---

## Implementation Notes

### Session Guidelines
- Each sub-phase (e.g., 2.1, 2.2) is designed as a single session
- Sessions should be 1-3 hours of focused work
- Commit and push after each sub-phase completion
- Update this document with status after each session

### Dependencies Summary
```
Phase 0 (Prep)
    ↓
Phase 1 (Foundation)
    ↓
Phases 2-7 (Models) ← Can be done in parallel after Phase 1
    ↓
Phase 8 (Structure Selector) ← Needs at least 2 models
    ↓
Phase 9 (Compliance) ← Needs at least 3 models
    ↓
Phase 10 (Visualisations)
    ↓
Phase 11 (Stage 2 - Ranges)
    ↓
Phase 12 (Stage 3 - Projections)
    ↓
Phase 13 (Polish)
```

### Priority Order (Recommended)
1. Phase 0 & 1 - Foundation (must do first)
2. Phase 7 - Enhance existing SaaS model (quickest win)
3. Phase 6 - Model 5 Sale + Support (maps to existing One-Time)
4. Phase 3 - Model 2 Licences (maps to existing models)
5. Phase 2 - Model 1 Cost-Plus (new capability)
6. Phase 4 - Model 3 Joint Development (new capability)
7. Phase 5 - Model 4 BOT (new capability)
8. Phases 8-13 - Supporting features

### Technical Considerations
- Maintain backwards compatibility with existing calculator
- Use feature flags to gradually enable new features
- Consider lazy loading for model-specific code
- Ensure all new features work without build process (vanilla JS)

---

## Status Legend
- [ ] Not Started
- [~] In Progress
- [x] Completed
- [!] Blocked

---

## Change Log

| Date | Phase | Changes | Author |
|------|-------|---------|--------|
| 2026-01-07 | All | Initial roadmap created | — |
| 2026-01-07 | Phase 0 | Completed - See PHASE_0_PREPARATION.md | Claude |
| 2026-01-07 | Phase 1 | Started implementation | Claude |
| 2026-01-07 | Phase 1 | Core infrastructure complete: registry, state, perspectives, Model 1 | Claude |

---

## References

- [financial_models_intercompany_software.md](financial_models_intercompany_software.md) - Main framework document
- [model_1_cost_plus_concept.md](model_1_cost_plus_concept.md) - Model 1 specifications
- [model_2_licence_royalties_concept.md](model_2_licence_royalties_concept.md) - Model 2 specifications
- [model_3_joint_development_concept.md](model_3_joint_development_concept.md) - Model 3 specifications
- [model_4_build_operate_transfer_concept.md](model_4_build_operate_transfer_concept.md) - Model 4 specifications
- [model_5_software_sale_support_concept.md](model_5_software_sale_support_concept.md) - Model 5 specifications
- [model_6_saas_subscription_concept.md](model_6_saas_subscription_concept.md) - Model 6 specifications
- [CALCULATIONS.md](CALCULATIONS.md) - Current calculator formulas
- [BUSINESS_GUIDE.md](BUSINESS_GUIDE.md) - Current user documentation
