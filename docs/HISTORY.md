# Development History & Bug Fixes

> **Last Updated**: March 2026
> **Purpose**: Historical record of bug fixes, improvements, and major refactoring work

This file tracks all significant bug fixes, improvements, and architectural changes made to the Software Transaction Structuring Tool project. For current project status and architecture, see [CLAUDE.md](../CLAUDE.md).

---

## Add "Save as PDF" Button (April 10, 2026)

**Impact**: User-facing — both pricing and structuring calculators now have a PDF export option

### Changes

1. Added "Save as PDF" button to the structuring model calculator action bar (`structuring/[model]/+page.svelte`)
2. Added "Save as PDF" button to the pricing calculator results header (`pricing/+page.svelte`)
3. Both buttons call `window.print()`, leveraging existing `@media print` CSS in `app.css`
4. Buttons use `no-print` class so they hide automatically during print preview

---

## Align CLAUDE.md glow-props Implementation Patterns (April 10, 2026)

**Impact**: Documentation — stale AI Note replaced with standard implementation patterns section

### Changes

1. Replaced "Shared conventions with glow-props" AI Note with canonical "Implementation patterns — always fetch from glow-props" note
2. Added "Implementation Patterns (Source of Truth)" section with fetch URLs and rules
3. Added prohibition: no local copies of implementation pattern files

---

## Align CLAUDE.md with glow-props Conventions (March 24, 2026)

**Impact**: Documentation consistency — CLAUDE.md now follows canonical glow-props structure

### Changes

Cross-repo audit revealed model-pear's CLAUDE.md had drifted from the glow-props canonical version:

1. Added "READ AND FOLLOW..." header and explicit Process section
2. Added REMINDER banners after all key sections (Code Standards, Session Management, Documentation, AI Notes, Prohibitions, Triggers)
3. Added Principles #6 "Follow conventions" and #7 "Repeatable process"
4. Aligned Cleanup to use `// KEEP:` marker convention (was "explicitly marked for preservation")
5. Added specific Quality Check items matching glow-props (XSS, reactivity, keys)
6. Added comprehensive Documentation section with per-doc descriptions (what/when/why) for all 9 doc files, including BUSINESS_GUIDE.md as User Guide and TESTING_GUIDE.md
7. Added Triggers section (10 analysis triggers with aliases and sweep behavior)
8. Added 3 missing Prohibitions: no removing features during cleanup, no assumptions over clarifying questions, no interactive prompts
9. Expanded AI Notes: commit before ending, sibling repo access pattern, communication style merged in from standalone section
10. Updated cross-reference last-reviewed date to 2026-03-24

---

## Fix Stale Product Names & Orphaned Compliance Comment (March 23, 2026)

**Impact**: Documentation accuracy — removed references to old product names

### Problem

Cross-repo documentation audit identified stale references in model-pear:
- `CALCULATIONS.md` title and conclusion still said "Pricing Equilibrium Calculator" (old name)
- `UI_UX_GUIDE.md` title and intro still said "Pricing Equilibrium Calculator"
- `HISTORY.md` intro still said "Revenue Model Calculator"
- `packages/calculator/src/index.ts` had a "COMPLIANCE (to be implemented)" section with a commented-out export to `compliance/transfer-pricing.js` — a module that was never created. Transfer pricing is fully implemented inline in each model.

### Fixes

1. **CALCULATIONS.md**: Updated title and conclusion to "Software Transaction Structuring Tool"
2. **UI_UX_GUIDE.md**: Updated title and intro to "Software Transaction Structuring Tool"
3. **HISTORY.md**: Updated intro to "Software Transaction Structuring Tool"
4. **calculator/src/index.ts**: Replaced misleading "to be implemented" comment with accurate description of where TP lives

---

## Documentation & Code Comments Audit (March 3, 2026)

**Impact**: Documentation accuracy — docs now reflect actual code

### Problem

Comprehensive audit revealed documentation had drifted significantly from the codebase:
- CLAUDE.md referenced 15 JavaScript files from the pre-TypeScript architecture (none exist)
- CLAUDE.md listed wrong model filenames (e.g., `costPlus.ts` instead of `model-1-cost-plus.ts`)
- BUSINESS_GUIDE.md had completely different variant names for Models 3, 4, 5, and 6
- README.md had wrong variant counts for Models 3 and 4
- All 6 model-use-cases docs linked to non-existent concept files
- 4 docs existed but weren't listed in CLAUDE.md's documentation table
- `/docs/working/` directory referenced but didn't exist
- `docs/EXTRACTION_PLAYBOOK.md` referenced but doesn't exist
- 3 key code files lacked CLAUDE.md-required decision documentation comments

### Fixes

1. **CLAUDE.md**: Updated all file references to actual Svelte/TS components, fixed model filenames, added missing docs to table, fixed Troubleshooting section, added `projections/` and `sensitivity/` to file tree
2. **BUSINESS_GUIDE.md**: Updated variant name tables for Models 3, 4, 5, 6 to match code VARIANTS definitions
3. **README.md**: Fixed variant counts — Model 3: "8 (3A-3H)", Model 4: "8 (4A-4H)"
4. **Model-use-cases (all 6)**: Removed stale concept file links, fixed variant count headers
5. **Code comments**: Added What/Why/Alternatives decision docs to `model-6-saas.ts`, `pricing/+page.svelte`, `structuring/[model]/+page.svelte`
6. **Created `/docs/working/`**: Directory now exists as referenced in CLAUDE.md
7. **Removed stale reference**: EXTRACTION_PLAYBOOK.md reference replaced with inline guidance

### Known remaining issue

Model 3 model-use-cases doc has detailed business analysis for variant concepts (3D-3G) that differ from the code variant names. The doc analysis is thorough and valuable but describes different variants than the code implements. Requires future decision: update code to match docs or rewrite docs.

---

## Fix Vercel Build — Calculator Exports & Output Directory (February 27, 2026)

**Impact**: Build fix — two issues preventing Vercel deployments

### Problem 1: Calculator package resolution failure

The `@model-pear/calculator` package's `exports` field in `package.json` pointed to `./dist/index.js` (compiled output). On Vercel, only the web app's `vite build` runs — the calculator's TypeScript compilation step (`tsc`) was not executed first, so `dist/` didn't exist. This caused Vite's module resolver to fail with: `Failed to resolve entry for package "@model-pear/calculator"`.

### Problem 2: Output directory not found

After fixing the exports, Vercel reported: `No Output Directory named "build" found after the Build completed.`

Two issues caused this:
1. **SvelteKit auto-detection**: Vercel detected SvelteKit and overrode `outputDirectory`. Fix: `"framework": null`.
2. **Root vercel.json ignored**: The Vercel project's Root Directory is set to `apps/web` in the dashboard. This means Vercel only reads `apps/web/vercel.json` — the root `vercel.json` was completely ignored. The initial fix (adding `framework: null` to root) had no effect.

### Fixes

1. **Calculator exports**: Changed all export paths from `./dist/*.js` / `./dist/*.d.ts` to `./src/*.ts` source files. Vite handles TypeScript natively via esbuild, so no separate build step is needed.
2. **Moved vercel.json to `apps/web/`**: Since Vercel Root Directory is `apps/web`, the config must live there. Changed `outputDirectory` from `"apps/web/build"` to `"build"` (relative to `apps/web`). Removed `buildCommand`/`installCommand` (Vercel auto-detects pnpm and uses `package.json` scripts). Kept `framework: null` and SPA rewrites.
3. **adapter-static cleanup**: Removed redundant options (all were defaults), kept only `fallback: '200.html'` for SPA routing. Eliminates the "Please remove adapter-static options" warning.

### Files Changed

- `packages/calculator/package.json` — `main`, `module`, `types`, `exports`, `files` all updated from `dist/` to `src/`
- `apps/web/vercel.json` — **NEW** — `framework: null`, `outputDirectory: "build"`, SPA rewrites
- `vercel.json` (root) — **DELETED** — Was ignored by Vercel
- `apps/web/svelte.config.js` — Simplified adapter-static config, updated comment about vercel.json location

---

## Migrate from GitHub Pages to Vercel (February 27, 2026)

**Impact**: Hosting platform migration — simplified deployment, removed base-path workarounds

### Changes

- **Deleted `.github/workflows/deploy.yml`** — GitHub Actions deploy workflow no longer needed
- **Deleted `.nojekyll`** — GitHub Pages artifact preventing Jekyll processing
- **Updated `apps/web/svelte.config.js`** — Removed `paths.base: '/model-pear'` (Vercel serves at root), changed fallback from `404.html` to `200.html` (Vercel convention)
- **Added `vercel.json`** — Build command (`pnpm build`), output directory (`apps/web/build`), SPA rewrites
- **Updated docs** — CLAUDE.md, ARCHITECTURE.md, README.md all updated from "GitHub Pages" to "Vercel"

### Rationale

GitHub Pages required a base-path prefix (`/model-pear/`) for subdirectory hosting, a `404.html` fallback hack for SPA routing, and a `.nojekyll` file. Vercel handles all of this natively — serves at root `/`, has built-in SPA rewrites, and auto-deploys on push.

### Migration Notes

- Kept `adapter-static` — the app is fully client-side, no SSR needed
- Kept `{base}` imports from `$app/paths` — SvelteKit best practice, resolves to `''` with no base configured
- `vercel.json` uses `200.html` for SPA fallback (Vercel convention vs GitHub Pages' `404.html`)

---

## Cross-Project CLAUDE.md Review (February 27, 2026)

**Impact**: Adopted useful patterns from glow-props sibling project

### Changes

- **Created `docs/AI_MISTAKES.md`** — New doc for tracking AI assistant mistakes across sessions (adopted from glow-props pattern)
- **Added cross-reference to glow-props CLAUDE.md** — HTML comment in AI Notes with link, last-reviewed date, and shared conventions list
- **Added AI notes** — "Ask before assuming bug causes" and "Check AI_MISTAKES.md at session start"
- **Updated documentation reference table** — Added AI_MISTAKES.md entry
- **Updated file tree** — Added AI_MISTAKES.md to docs/ listing

### Rationale

Both model-pear and glow-props share the same engineering conventions template. Periodic cross-review ensures useful patterns (like the mistake log) propagate between projects. The cross-reference comment enables future AI sessions to check for new patterns.

---

## CLAUDE.md Restructure (February 13, 2026)

**Impact**: Merged engineering standards template with existing project-specific CLAUDE.md

### Changes

- **Added HARD RULES section** - Non-negotiable engineering standards:
  - Code organization limits (500/800 line files, 100/150 line functions)
  - Decision documentation in code (what/why/alternatives for non-trivial changes)
  - User experience rules (non-technical users, plain language, actionable errors)
  - Frontend rules (no inline CSS/JS, CSS variables, Tailwind exception)
  - Cleanup requirements (remove temp files, dead code, console.logs)
  - Quality checks (error handling, edge cases, security, performance)
  - Security best practices (input validation, sanitization, least privilege)
- **Added COMMUNICATION STYLE** - Direct, concise, no filler
- **Added TESTING section** - Critical paths, edge cases, when to skip
- **Added PROJECT-SPECIFIC CONFIGURATION** - Filled in paths, stack, conventions
- **Added WORKFLOW** - 7-step process (receive, gather, plan, implement, verify, document, report)
- **Added PROHIBITIONS** - Explicit "never do" list
- **Preserved AI SESSION MANAGEMENT** - Checklists, session notes, compact prep
- **Preserved all project context** - Models, formulas, tax rules, benchmarks, troubleshooting
- **Fixed stale instruction** - Removed "keep vanilla JS" (project uses TypeScript/SvelteKit)

### Files Changed

- `CLAUDE.md` - Complete restructure
- `docs/SESSION_NOTES.md` - Updated for this session
- `docs/HISTORY.md` - This entry

---

## Dark Theme Implementation (January 21, 2026)

**Impact**: Complete visual redesign from light to dark theme

### Changes

- **Dark theme by default** - Page background #1B1B1B, card backgrounds #2a2a2a
- **Custom color system** - Primary #2D68FF, secondary #767676, border #333333
- **Figtree font** - Replaced Inter with Figtree from Google Fonts
- **Semantic colors** - Success #16A34A (green), error #EF4444 (red), warning #EAB308 (amber)
- **CSS variable system** - All colors defined as HSL variables for Tailwind integration
- **Updated component classes** - .card, .btn, .input, .badge all use new dark theme
- **All pages updated** - Home, structuring, pricing, model calculator pages

### Design System Reference

```css
:root {
  --background: 0 0% 11%;     /* #1B1B1B */
  --foreground: 0 0% 100%;    /* #FFFFFF */
  --card: 0 0% 16%;           /* #2a2a2a */
  --primary: 222 100% 59%;    /* #2D68FF */
  --secondary: 0 0% 46%;      /* #767676 */
  --border: 0 0% 20%;         /* #333333 */
}
```

### Files Changed

- `apps/web/tailwind.config.js` - CSS variable-based color system
- `apps/web/src/app.css` - CSS variables and component styles
- `apps/web/src/app.html` - Figtree font, dark mode
- `apps/web/src/routes/*.svelte` - All page components

---

## Wizard Navigation Improvements (January 21, 2026)

**Impact**: Improved usability of the Structure Selection Wizard

### Changes

- **Added Back/Next navigation buttons** - Removed auto-advance on answer selection; users now explicitly click "Next" to progress
- **Added step indicators** - Clickable numbered circles at top showing current position and progress
- **Preserved answers on navigation** - Going back no longer clears subsequent answers
- **Visual feedback** - Current step highlighted blue, completed steps show checkmark in green, future steps greyed out

### Files Changed

- `apps/web/src/lib/components/StructureWizard.svelte` - Complete navigation overhaul

---

## Discovery Framework & Tool Discovery Session (January 20, 2026)

**Impact**: Added methodology guide and applied it to understand actual tool usage

### New Documentation

- Created `DISCOVERY_FRAMEWORK.md` - comprehensive guide for conducting discovery sessions
  - Core principle: user flows as the spine connecting people, data, questions, and contacts
  - Session 1 structure: People, Flow, Data, Contact Mapping, Why Now
  - Post-session analysis checklist
  - Follow-up session templates for different stakeholder types
  - Language guide for non-technical audiences
  - Data complexity signals reference

### Discovery Session: This Tool

Applied the Discovery Framework to understand how this tool will actually be used.

**Key finding**: The tool is used *with* clients in live negotiation sessions, not as a back-office calculator.

- Created `DISCOVERY_FINDINGS.md` - full documentation of discovery session
- Identified actual users: tech-sales + non-technical exec + finance exec
- Mapped the flow: tool enters after discovery, during "let's structure this together"
- Defined 5 design principles from findings

### Negotiation Mode Design & UI Audit

Created comprehensive design for client-facing "Negotiation Mode":

- Created `NEGOTIATION_MODE.md` with:
  - 5-minute walkthrough script (what to say, what they see)
  - Screen-by-screen requirements
  - Feature visibility matrix (what to show/hide)
  - Implementation recommendation: "Simplified by Default"
- Audited current UI against 5 design principles
- Documented specific gaps and fixes needed
- Created prioritised implementation list in `TODO.md`:
  - Priority 1: Industry badges, hide advanced tabs, one-click save
  - Priority 2: Input grouping (Essential/Advanced)
  - Priority 3: Comparison enhancements

### Negotiation Mode Implementation

Implemented UI changes based on discovery findings and design principles:

**Input Field Enhancements** (`inputFields.ts`, `InputField.svelte`):
- Added `benchmark` property to show industry standard badges (e.g., "Industry: 5-15%")
- Added `essential` property to control field grouping
- InputField now displays benchmark badges next to labels

**Calculator Page Refactor** (`structuring/[model]/+page.svelte`):
- **Progressive Disclosure**: Inputs grouped into Essential (visible) and Advanced (collapsed)
- **Collapsed Sections**: Sensitivity/Projections moved to collapsible "Advanced Analysis"
- **Transfer Pricing**: Now collapsed by default with risk level badge visible
- **One-Click Save**: Quick save button with auto-generated names
- **Saved Count**: Shows number of saved options in action bar

**Comparison View Enhancements** (`ComparisonView.svelte`):
- **Quick Summary Section**: Shows best-for insights per option at top of comparison
- **Winner Indicators**: ★ star icon on metrics where option is best
- **Enhanced Highlighting**: Green background + text for winning values
- **Smart Detection**: Only shows winner when there's a clear best (no ties)

**Files Changed**:
- `apps/web/src/lib/config/inputFields.ts`
- `apps/web/src/lib/components/InputField.svelte`
- `apps/web/src/lib/components/ComparisonView.svelte`
- `apps/web/src/routes/structuring/[model]/+page.svelte`

---

## Transfer Pricing Documentation Review (January 18, 2026)

**Impact**: Corrected technical inaccuracies across all model use cases and CALCULATIONS.md

### Model Use Case Corrections

- **Model 1**: Fixed OECD citation (5-15% is market practice, not OECD guidance), margin vs markup terminology, IAS 38 caveats
- **Model 2**: Added IFRS 15 caveats, softened reseller margin claims, expanded TP complexity notes, added withholding tax considerations
- **Model 3**: Major restructure - fixed fundamental CCA errors (contributions must align with benefits), added buy-in/buy-out/balancing payment mechanics, converted 3G to Required Provisions section
- **Model 4**: Fixed BOT structure - added operation phase economics and transition considerations, converted 4G to Standard Provisions section, fixed UK withholding tax error
- **Model 5**: Fixed arithmetic error in 5B (R1.5M → R1.75M), added Sale Mechanics section, restructured variant selection guide
- **Model 6**: Added SaaS characterisation note, fixed regulatory reference (SARB → POPIA), added Standard SaaS Contract Elements section

### CALCULATIONS.md Corrections

- Clarified payback period formula context (recurring vs one-time)
- Reconciled Model 4 variant numbering with use cases
- Added CCA payment calculations (buy-in, buy-out, balancing payments)
- Defined margin compliance ranges in TP risk section
- Fixed BOT TP assessment language
- Added IFRS 15 variable consideration constraint for earnouts
- Added Mode 1/Mode 2 calculator model mapping table
- Added economies of scale limitation acknowledgement

### Documentation Cleanup

Deleted 10 stale files (~6,200 lines):
- `MANUAL_TESTING_GUIDE.md`, `UI_COMPONENT_HIERARCHY.md` (old vanilla JS references)
- `USAGE_SCENARIOS_REVIEW.md` (completed review)
- `financial_models_intercompany_software.md` (superseded)
- 6 `model_*_concept.md` files (superseded by model-use-cases/)

Updated:
- `README.md` (docs/) - Updated for TypeScript/SvelteKit architecture
- `ARCHITECTURE.md` - Status changed to "Complete"
- `SESSION_NOTES.md` - Trimmed to reference info only
- `TODO.md` - Trimmed completed items
- `CLAUDE.md` - Added full documentation reference, clarified doc update timing
- Created root `README.md` linking to docs/

---

## Architecture Redesign: TypeScript Monorepo (January 2026)

**Date**: January 10-11, 2026
**Impact**: Complete rewrite of calculator logic in TypeScript with modern SvelteKit frontend

### Overview

Redesigned the application from vanilla JavaScript (~28,000 lines) to a TypeScript monorepo with:
- Pure calculation library (`@model-pear/calculator`)
- SvelteKit 2.x frontend (`@model-pear/web`)
- 301 comprehensive unit tests
- Modern tooling (pnpm, Vite, Vitest)

### Phase 1: Foundation (Jan 10)
- Created monorepo structure with pnpm workspaces
- Extracted Model 1 (Cost-Plus) to TypeScript with 44 tests
- Set up SvelteKit app shell with Tailwind CSS

### Phase 2: Models (Jan 10)
- Extracted Models 2-6 to TypeScript (47 total variants)
- Created unified model registry with exports
- Added TypeScript types for all input/output structures

### Phase 3: Tests & Modules (Jan 11)
- Added 178 tests for Models 2-6
- Created projections module (NPV, IRR, payback, MIRR, ROI) - 39 tests
- Created sensitivity module (ranges, scenarios, Monte Carlo) - 40 tests
- Fixed TypeScript strict mode array access issues

### Phase 4: SvelteKit UI (Jan 11)
- Created reusable component library:
  - ResultPanel, ResultRow, ResultSection, InputField
  - DeveloperResults, BuyerResults, TransferPricingResults
  - ComparisonManager, ComparisonView
- Created data-driven input field configurations for all 6 models
- Built comparison feature with localStorage persistence
- Integrated save/compare workflow into calculator pages

### Phase 5: Analysis Features (Jan 11)
- Added ApexCharts integration for data visualization
- Created chart component library:
  - BaseChart (ApexCharts wrapper with SSR handling)
  - TornadoChart (input sensitivity ranking)
  - ScenarioChart (best/base/worst case comparison)
  - CashFlowChart (annual cash flows)
  - CumulativeCashFlowChart (payback visualization)
  - NPVComparisonChart (NPV comparison)
- Created analysis panels:
  - SensitivityPanel (tornado + scenario + key drivers)
  - ProjectionsPanel (NPV, IRR, payback metrics + charts)
  - ProjectionMetrics (metrics summary card)
- Added tabbed interface to calculator page (Results | Sensitivity | Projections)
- Updated formatters with compact currency notation for charts

### Phase 6: Structure Selector Wizard (Jan 11)
- Ported decision tree wizard from vanilla JS to SvelteKit
- Created wizard configuration with 6 questions and scoring logic
- Built StructureWizard component with:
  - Progressive disclosure (auto-advancing questions)
  - Live preview of recommendations as user answers
  - Final results with ranked model recommendations
  - Variant preference selector within each model
  - Change/restart functionality
- Added view mode toggle on structuring page (Wizard | Browse All Models)
- Wizard recommends models based on:
  - Software maturity (new/existing/SaaS)
  - IP ownership preference
  - Control preference
  - Cash flow structure
  - Risk allocation
  - Asset recognition priority

### New File Structure
```
model-pear/
├── packages/calculator/          # TypeScript calculation library
│   ├── src/
│   │   ├── models/               # 6 transaction models
│   │   ├── projections/          # NPV, IRR, payback
│   │   ├── sensitivity/          # Ranges, Monte Carlo
│   │   └── types/                # Shared types
│   └── tests/                    # 301 unit tests
│
├── apps/web/                     # SvelteKit frontend
│   └── src/lib/
│       ├── components/           # Result & analysis components
│       │   └── charts/           # ApexCharts visualizations
│       ├── config/               # Input field configs
│       ├── stores/               # Comparison store
│       └── utils/                # Formatters
│
└── (original vanilla JS preserved in root)
```

### Commands
```bash
pnpm install          # Install dependencies
pnpm test             # Run 301 tests
pnpm build            # Build all packages
pnpm dev              # Start dev server
```

### Branch
`claude/redesign-app-architecture-qdMCA`

---

## Phase 7: Polish & Testing (January 2026)

**Date**: January 12, 2026
**Impact**: Enhanced export features, E2E testing, and mobile responsiveness

### Print/Export Enhancements
- Added print-optimized CSS with proper styling for comparison view
- Added CSV export functionality to ComparisonView component
- Buttons for "Export CSV" and "Print / PDF" in comparison modal footer

### E2E Testing with Playwright
- Added Playwright configuration for E2E tests (`playwright.config.ts`)
- Created comprehensive test suites:
  - `navigation.spec.ts` - Page navigation and routing
  - `pricing-calculator.spec.ts` - Pricing model switching and calculations
  - `structuring.spec.ts` - Transaction structuring wizard and model calculator
  - `comparison.spec.ts` - Save and compare functionality
  - `mobile.spec.ts` - Mobile responsiveness and touch interactions
- Mobile viewport testing with iPhone and Pixel device emulation
- Scripts: `pnpm test:e2e` and `pnpm test:e2e:ui`

### Pricing Calculator Charts
- Created EquilibriumChart component showing price range visualization
- Shows seller minimum, buyer maximum, current price, and equilibrium zone
- Integrated into pricing calculator results section
- Supports both currency and percentage formats (for marketplace model)

### Mobile Optimization
- Added mobile hamburger menu navigation
- Sticky header for better mobile UX
- Horizontal scroll model selector on mobile with swipe hint
- Touch-friendly tap targets with `touch-manipulation` CSS
- Hidden scrollbars for horizontal scroll containers
- Responsive footer layout

### CSS Utilities Added
- `scrollbar-hide` - Hide scrollbars for horizontal scroll
- `touch-manipulation` - Touch-friendly interaction
- `safe-area-inset` - Support for notched devices
- Print media queries for proper PDF/print output

### Files Created
```
apps/web/
├── playwright.config.ts
├── tests/e2e/
│   ├── navigation.spec.ts
│   ├── pricing-calculator.spec.ts
│   ├── structuring.spec.ts
│   ├── comparison.spec.ts
│   └── mobile.spec.ts
└── src/lib/components/charts/
    └── EquilibriumChart.svelte
```

### Files Modified
- `apps/web/package.json` - Added Playwright dependency and scripts
- `apps/web/src/app.css` - Print styles and mobile utilities
- `apps/web/src/routes/+layout.svelte` - Mobile navigation
- `apps/web/src/routes/pricing/+page.svelte` - Equilibrium chart + mobile model selector
- `apps/web/src/lib/components/ComparisonView.svelte` - CSV export
- `apps/web/src/lib/components/charts/index.ts` - Export EquilibriumChart

### Branch
`claude/review-remaining-tasks-02suz`

---

## Recent Bug Fixes & Improvements (January 2026)

### UI Component Hierarchy Documentation

**Date**: January 10, 2026
**Impact**: New reference document for understanding UI component organization

**Purpose:**
Created a comprehensive document outlining the UI component hierarchy to serve as a reference for future development and maintenance.

**Document Contents:**
- Component tree for both Pricing and Intercompany modes
- Logic-to-UI mapping between `models/intercompany/` and `ui/intercompany/`
- State management architecture with pub/sub pattern diagram
- Initialization and calculation flow diagrams
- Component lifecycle pattern
- File reference with line counts and purposes

**Files Added**: `docs/UI_COMPONENT_HIERARCHY.md`

---

### Comprehensive Testing Coverage Expansion

**Date**: January 10, 2026
**Impact**: Testing Lab now covers all 6 transaction models + Long-term Value calculations

**Problem Identified:**
Testing Lab (built Jan 9) only had test scenarios for Model 1 (Cost-Plus). Models 2-6 had no test coverage. Long-term Value calculations (NPV, IRR, payback) were untested.

**Changes Made:**

1. **Expanded Workflow Test Scenarios** (`testing-utilities.js`)
   - Added 8 new workflow scenarios for Models 2-6:
     - Model 2: Perpetual Licence, Usage-Based Royalties
     - Model 3: Contribution-Based Joint Development
     - Model 4: BOT Fixed Transfer Price
     - Model 5: Outright Software Sale
     - Model 6: SaaS Subscription (2 scenarios)
   - Total workflow scenarios: 10 → 18

2. **New Assertion Library Entries** (`testing-utilities.js`)
   - Model 2: Developer Licence Revenue, Buyer Capitalised Licence, Usage-Based Royalty
   - Model 3: Developer Ownership Contribution, Developer Joint Asset
   - Model 4: Developer BOT Service Revenue, Developer BOT Total Revenue
   - Model 5: Developer Sale Proceeds, Developer Capital Gain, Buyer Capitalised Purchase
   - Model 6: Developer Subscription Revenue, Buyer No Asset (SaaS), Buyer Subscription Expense

3. **Long-term Value Test Suite** (`testing-utilities.js`)
   - 5 NPV test cases (simple, break-even, negative, high discount, zero discount)
   - 4 IRR test cases (standard, 100% return, low return, even cash flows)
   - 5 Payback test cases (simple, fractional, discounted, immediate, not achieved)
   - Helper functions: `runNPVTests()`, `runIRRTests()`, `runPaybackTests()`, `runLongTermValueTests()`

4. **Testing UI Tabs** (`ui/intercompany/testing.js`)
   - Added tab navigation: "Workflow Tests" | "Long-term Value Tests"
   - Long-term Value tab shows NPV, IRR, Payback test cases with results
   - Run All button executes all tests in active tab

**Files Modified**: 2 files (~600 lines added)

**Result**: Testing Lab now provides comprehensive coverage:
- 18 workflow scenarios covering all 6 models
- 14 Long-term Value calculation tests
- 32 total test cases

---

### UI Alignment with Tool Goals

**Date**: January 10, 2026
**Impact**: UI now fully delivers on the 5 dimensions promised in Mode 2 goals

**Problem Identified:**
UI analysis revealed Mode 2 was missing 2 of 5 promised dimensions in the comparison view and results display:
- Long-term Value (NPV, IRR, payback) not surfaced in comparison view
- Messaging emphasized "structuring" over "finding best deal"

**Changes Made:**

1. **Long-term Value in Comparison View** (`comparison-view.js`)
   - Added Long-term Value section with Developer/Buyer NPV, IRR, and payback period
   - Added 'years' format for payback display

2. **Long-term Value in Results Display** (`results-display.js`)
   - Added Long-term Value panel to both Developer and Buyer perspectives
   - Shows NPV, IRR, payback period, and investment rating
   - Includes assessment (Excellent/Good/Marginal/Poor) with color coding

3. **Projections Auto-generated on Save** (`app-state.js`)
   - When saving a comparison, projections are now automatically generated
   - Projections stored with comparison data for accurate comparison metrics

4. **Storage Utility Update** (`utils/storage.js`)
   - `generateComparisonSummary()` now includes projections data for comparison

5. **Options Overview Reframing** (`options-overview.js`)
   - Changed "How would you like to structure this transaction?" to
   - "Which structure creates the best outcome?"
   - Subtitle now emphasizes value maximization for both parties

6. **Mode-Aware Header Tagline** (`app.js`, `index.html`)
   - Header tagline now changes based on active mode
   - Mode 1: "Find the price where you hit your margin AND your client sees ROI"
   - Mode 2: "Compare transaction models to find the best deal for both parties"

**Files Modified**: 6 files

**Result**: Mode 2 now fully delivers on all 5 promised dimensions:
- Financial Impact ✓
- Tax Efficiency ✓
- Accounting Treatment ✓
- Compliance Risk ✓
- Long-term Value ✓ (NEW)

---

### Tool Goals Refinement & Documentation Update

**Date**: January 10, 2026
**Impact**: Clearer, user-focused goal statements across all documentation

**What was done:**

Investigated tool goals and found they were using technical jargon ("equilibrium pricing", "maximise value") that wasn't immediately clear to business users. Refined goal language to focus on user outcomes.

**New Goal Statements:**

| Mode | Old Goal | New Goal |
|------|----------|----------|
| Mode 1 | "Find equilibrium pricing for B2B software products" | "Find the price range where you hit your margin AND your client sees clear ROI" |
| Mode 2 | "Compare transaction models to optimize expenses, capitalization, and tax outcomes" | "Compare structures to find the best deal for both you and your client" |

**Defined "Best Deal" (Mode 2):**
1. Financial Impact: What does each option cost, and what profit/tax benefit does each party get?
2. Tax Efficiency: Which structure minimises combined tax burden?
3. Accounting Treatment: How will this appear on financial statements?
4. Compliance Risk: Transfer pricing risks (related parties only)
5. Long-term Value: NPV, IRR, payback over 3-10 years

**Documentation Updates:**
- CLAUDE.md: New "System Purpose" section with goal table and "What Best Deal Means"
- BUSINESS_GUIDE.md: Added "What It Helps You Answer" section, clearer mode descriptions
- financial_models_intercompany_software.md: Removed legacy "common ownership" framing, updated to work for any client

**Future Enhancement Identified:**
- Added "Recommendation Summary for Compare Mode" to TODO.md (user-weighted scoring to recommend best option)

**Files Modified**: 6 files

---

### Complete Terminology Cleanup - Phase 2

**Date**: January 10, 2026
**Impact**: Completed removal of all Combined/Shareholder/Net Effect references

**Changes Made**:

**Code Cleanup**:
- Removed `combined` perspective fallbacks in perspective-toggle.js
- Removed combined projection generation in growth-projections.js (~50 lines)
- Removed consolidation rendering in compliance-analyzer.js (UI)
- Removed `consolidation` field from accountingSummary in all 6 model files
- Removed unused `combined` parameter from `calculateNetTaxPosition()`
- Updated keyboard shortcuts display (removed 'C' key)

**Documentation Cleanup**:
- Updated README.md: "three perspectives" → "two perspectives", removed Net Effect
- Updated BUSINESS_GUIDE.md: removed "shareholder view" references
- Updated MANUAL_TESTING_GUIDE.md: removed shareholder perspective testing
- Removed "Shareholder Perspective (When Mutual Ownership)" sections from all 6 model concept docs
- Deleted completed REFACTOR_PLAN_REMOVE_COMBINED.md

**Terminology Updates**:
- "Net Effect" references removed from tooltips and comments
- "combined asset maximisation" → clearer client-focused language
- Updated registry.js and results-display.js header comments

**Technical Debt Identified**:
- Folder naming (`models/intercompany/`, `ui/intercompany/`) is legacy - added to TODO.md as low priority

**Files Modified**: 24 files
**Lines Removed**: ~960 lines (cumulative with Phase 1: ~1,500+ lines)

---

### Remove Combined/Group Perspective Refactor - Phase 1

**Date**: January 10, 2026
**Impact**: Simplified tool by removing consolidated/group accounting features that were out of scope

**Changes Made**:

**UI Changes**:
- Removed Combined View tab from perspective toggle
- Updated default perspective to Developer (was Combined)
- Removed Combined section from comparison view
- Removed Combined metrics from projections and sensitivity analysis
- Updated terminology from "Inter-Company" to "Transaction Tool"

**Backend Changes**:
- Removed `calculateCombinedPerspective` function from all 6 models
- Removed `combined` from calculation results
- Removed `consolidationRequired` and `sameGroup` config flags
- Removed `isShareholderPerspectiveAvailable()` function

**Documentation Updates**:
- Updated CLAUDE.md to remove Shareholder perspective references
- Updated perspective framework to show only Developer and Buyer

**Lines Removed**: ~600+ lines of code
**Commits**: 10 commits across 10 phases

**Benefits**:
- Tool now focuses on its core purpose: comparing models for Developer and Buyer
- Reduced complexity and maintenance burden
- Clearer separation from consolidated accounting (which was never in scope)

---

### Preferences Framework & AI Session Management

**Date**: January 10, 2026
**Impact**: Improved AI assistant consistency and session continuity

**Changes Made**:

**New "My Preferences" Section in CLAUDE.md**:
- Added Process section (read preferences → gather context → proceed)
- Added 10 Principles for consistent decision-making
- Added AI Notes section for learnings and reminders

**New Documentation Files**:
- `docs/SESSION_NOTES.md` - Context preservation between sessions
- `docs/TODO.md` - AI-managed backlog for lower priority items

**Benefits**:
- AI assistants now have clear guidance on how to approach tasks
- Session context preserved via SESSION_NOTES.md
- Ideas and improvements captured in TODO.md
- Consistent, repeatable process across sessions

**Files Created**:
- `docs/SESSION_NOTES.md`
- `docs/TODO.md`

**Files Modified**:
- `CLAUDE.md` (added My Preferences section at top)

---

### Testing Lab Tab

**Date**: January 9, 2026
**Impact**: Developers and testers can now validate calculation correctness with pre-defined test cases

**New Features**:

**Testing Tab (UI)**:
- New "Testing" tab in the inter-company calculator section
- Run all tests or individual tests with one click
- Visual pass/fail indicators with detailed assertions
- Filter tests by model (Model 1, Model 2, etc.)
- Expandable test details showing inputs and expected vs actual values
- Summary panel with pass rate, duration, and test counts

**Test Utilities (Backend)**:
- Pre-defined test cases for Model 1 variants (1A-1F)
- Test cases for Model 2 and Model 3
- Edge case tests (zero cost, high margin, custom tax rates)
- Tolerance-based comparison for floating point values
- Test runner with detailed assertion tracking
- Custom test creation from current calculator state

**Files Added**:
- `models/intercompany/testing-utilities.js` - Test case definitions and runner
- `ui/intercompany/testing.js` - Testing tab UI component

**Files Modified**:
- `ui/intercompany/calculator.js` - Integration of testing tab

---

### Configuration File Naming Convention Fix

**Date**: January 9, 2026
**Impact**: Claude Code now properly detects the project configuration file

**Changes Made**:

**File Rename**:
- Renamed `claude.md` → `CLAUDE.md` (uppercase) to match Claude Code's expected naming convention

**Reference Updates**:
- Updated file tree reference in `CLAUDE.md`
- Updated documentation maintenance table in `CLAUDE.md`
- Fixed link in `docs/README.md`
- Fixed link in `docs/BUSINESS_GUIDE.md`

**Files Modified**:
- `CLAUDE.md` (renamed from `claude.md`)
- `docs/README.md`
- `docs/BUSINESS_GUIDE.md`

---

### Version Tracking Diff View & Cost Estimation Helper

**Date**: January 9, 2026
**Impact**: Enhanced comparison workflow and simplified cost estimation

**New Features**:

**Diff View (What Changed?)**:
- Side-by-side comparison showing differences between two saved options
- Displays input changes, setting changes, and result impact
- Visual badges for added/removed/changed fields
- "What Changed?" button in comparison manager (requires 2 selections)

**Cost Estimation Helper**:
- Hours × rate calculator for project cost estimation
- Phase breakdown: Discovery, Design, Development, Testing, Deployment
- Contingency percentage calculation
- "Use Estimate" button populates calculator inputs directly
- Accessible via link in input form section

**Files Created**:
- `ui/intercompany/diff-view.js` (977 lines)
- `ui/intercompany/cost-estimator.js` (725 lines)

**Files Modified**:
- `ui/intercompany/calculator.js`
- `ui/intercompany/comparison-manager.js`
- `docs/USAGE_SCENARIOS_REVIEW.md`

---

### Major Feature: Compare Mode (Phase 3)

**Date**: January 9, 2026
**Impact**: Users can now save, manage, and compare multiple pricing options side-by-side

**New Features**:

**Save & Storage System**:
- Save calculated results as named options with notes
- localStorage persistence with version tracking
- 20 comparison limit with storage info display
- Export to JSON/CSV and import from JSON
- Auto-generated default names from model/variant

**Comparison Manager Panel**:
- List, load, delete, rename saved comparisons
- Edit notes for each saved option
- Select 2-4 options for side-by-side comparison
- Clear all with confirmation dialog

**Comparison View**:
- Side-by-side comparison table for 2-4 options
- Developer, Buyer, Combined metrics sections
- Transfer pricing risk display
- Difference column with directional arrows
- Best/worst value highlighting (green/red)
- Compatibility warnings for mismatched comparisons

**Print/PDF Export**:
- Browser-native print functionality
- Print-friendly CSS styles (@media print)
- A4 landscape layout optimized for comparison tables
- Best/worst highlighting preserved in print output

**UI Integration**:
- Save Actions Bar with Save/View/Compare buttons
- Save Modal with name and notes input
- Clear All button (shown when options exist)

**Files Created**:
- `utils/storage.js` (479 lines)
- `ui/intercompany/comparison-manager.js` (1,065 lines)
- `ui/intercompany/comparison-view.js` (767 lines)

**Files Modified**:
- `state/app-state.js` (added comparison state management)
- `ui/intercompany/calculator.js`
- `docs/BUSINESS_GUIDE.md`
- `docs/UI_UX_GUIDE.md`

---

### Major Feature: Options Overview (Phase 2)

**Date**: January 9, 2026
**Impact**: Users can now see all 6 transaction models at a glance before selecting one

**New Features**:

**Options Overview Landing View**:
- Model cards grid with icon, summary, key features, and best-for tags
- Quick comparison table for side-by-side model analysis
- "Explore" buttons to dive into specific models
- "Use the guided wizard" link for recommendation-based selection

**Selection Mode Toggle**:
- Three-way toggle: Overview / Wizard / Direct selection modes
- Overview is now the default landing view
- Remembers user preference

**Model Metadata Enhancement**:
- Rich `getModelMetadata()` with overview data
- `getModelComparisonData()` for comparison table population

**Files Created**:
- `ui/intercompany/options-overview.js` (544 lines)

**Files Modified**:
- `models/intercompany/registry.js` (added metadata functions)
- `ui/intercompany/calculator.js`

---

### Major Feature: Party Relationship Selector (Phase 1)

**Date**: January 9, 2026
**Impact**: Clearer party relationship selection and enhanced perspective navigation

**New Features**:

**Party Relationship Selector**:
- Prominent radio cards for selecting relationship type
- "Independent Parties" option (2 perspectives: Developer, Buyer)
- "Related Parties" option (3 perspectives with Shareholder/Combined view)
- Visual feedback and clear explanations for each option

**Enhanced Perspective Toggle**:
- Dynamic labels that change based on relationship type
- "Net Effect" becomes "Shareholder" when Related Parties selected
- Keyboard shortcuts: D (Developer), B (Buyer), S (Shareholder/Net Effect)

**Files Created**:
- `ui/intercompany/party-selector.js` (259 lines)

**Files Modified**:
- `state/app-state.js` (added `setRelationshipType()`, `arePartiesRelated()`)
- `ui/intercompany/calculator.js`
- `ui/intercompany/entity-config.js` (removed duplicate relationship settings)
- `ui/intercompany/perspective-toggle.js`
- `docs/UI_UX_GUIDE.md`

---

### UI/UX Terminology Standardization

**Date**: January 9, 2026
**Impact**: Improved clarity and consistency throughout the user interface

**Changes Made**:

**Terminology Standardization**:
- Perspectives now consistently use "Your Company", "Client", and "Combined View"
- Removed confusing dual naming ("Net Effect"/"Shareholder") for the combined perspective
- Input categories renamed to "Your Company Costs" and "Client Treatment"

**Navigation Improvements**:
- Renamed "Visualizations" tab to "Charts" for clarity
- Renamed "Sensitivity" tab to "What-If" for better user understanding
- Renamed "Direct" selection mode to "Manual"
- Changed "Explore" button to "Select Model" for clearer action
- Changed Compliance tab emoji from ✓ to ⚖️

**Tax Terminology**:
- Modernized Section 11(e) labels from "PC Software (2 years)"/"Mainframe Software (5 years)" to "Standard Software (2-year write-off)"/"Complex Systems (5-year write-off)"
- Added clearer help text explaining when to use each tax write-off option

**Party Selector**:
- Improved wording for related/independent party selection
- Made transfer pricing warning generic (not SA-specific)
- Removed perspective count badges that were causing confusion

**Keyboard Shortcuts**:
- Changed Combined View shortcut from `S` to `C`
- Removed `M` shortcut for toggling mutual ownership (use UI toggle instead)

**Files Modified**:
- `ui/intercompany/perspective-toggle.js`
- `ui/intercompany/party-selector.js`
- `ui/intercompany/calculator.js`
- `ui/intercompany/options-overview.js`
- `ui/intercompany/results-display.js`
- `ui/intercompany/compliance-analyzer.js`
- `models/intercompany/model-1-cost-plus.js` through `model-6-saas-subscription.js`
- `app.js`
- `docs/UI_UX_GUIDE.md`
- `docs/BUSINESS_GUIDE.md`

---

### Critical Fix: Intercompany Model 4 & 5 Calculation Error

**Date**: January 8, 2026
**Impact**: Fixed "Cannot read properties of undefined (reading 'total')" error when calculating BOT or Software Sale transactions

**Issue**: When users selected Model-4 (Build-Operate-Transfer) or Model-5 (Software Sale with Ongoing Support) and clicked "Calculate Transaction", the application showed both a success message and an error: `Calculation error: Cannot read properties of undefined (reading 'total')`.

**Root Cause**: Inconsistent property naming between the model calculation returns and what `results-display.js` expected:

| Property | Expected by UI | Model-4 Had | Model-5 Had |
|----------|---------------|-------------|-------------|
| `dev.revenue.total` | Yes | `dev.revenue.totalRevenue` | `dev.revenue.totalRevenue` |
| `dev.costs.total` | Yes | (no costs object) | (no costs object) |
| `dev.profit.gross` | Yes | `dev.profit.totalProfit` | `dev.profit.totalProfit` |
| `dev.tax.taxPayable` | Yes | `dev.tax.totalTax` | `dev.tax.totalTax` |
| `buyer.totalCost` (number) | Yes | `buyer.totalCost` (object) | `buyer.totalCost` (object) |

**Fix**: Added compatibility properties to both Model-4 and Model-5 to match the expected interface:

**Developer Perspective Changes**:
- Added `revenue.total` as alias for total revenue
- Added `revenue.breakdown` object for component visibility
- Added new `costs` object with `costs.total` and `costs.breakdown`
- Added `profit.gross`, `profit.margin`, `profit.net` aliases
- Added `tax.taxableIncome`, `tax.corporateTaxRate`, `tax.taxPayable` aliases
- Added `asset.recognised` and `asset.reason` for asset display

**Buyer Perspective Changes**:
- Changed `totalCost` from object to direct value (number)
- Moved detailed cost breakdown to `totalCostDetails` object
- Added `asset.capitalised`, `asset.expensed`, `asset.section11eType`
- Added `expenses.schedule` for amortisation display
- Added `tax.taxBenefit` alias

**Combined Perspective Changes**:
- Updated references from `buyer.totalCost.xxx` to `buyer.totalCostDetails.xxx`
- Added `elimination.profitEliminated` alias
- Added `assetEfficiency.developerAsset`, `assetEfficiency.duplication`
- Added `cashFlow.developerNetCash`, `cashFlow.buyerNetCash`, `cashFlow.groupNetCash`
- Added `metrics.groupTaxCost` alias
- Fixed `efficiencyRatio` to be a decimal (0-1) as expected by UI

**Transfer Pricing Assessment Changes**:
- Added top-level `margin`, `method`, `withinRange` properties
- Added `benchmarkRange` as object with `low` and `high` properties

**Files Modified**:
- `models/intercompany/model-4-bot.js` (developer, buyer, combined perspectives + transfer pricing)
- `models/intercompany/model-5-software-sale.js` (developer, buyer, combined perspectives + transfer pricing)

**Result**: Model-4 (BOT) and Model-5 (Software Sale) now calculate and display results correctly across all three perspectives (Developer, Buyer, Combined).

**Technical Note**: The fix maintains backward compatibility - original property names are preserved alongside the new compatibility aliases.

---

### UI/UX Enhancement: Default Mode & Comprehensive Tooltips

**Date**: January 8, 2026
**Impact**: Improved discoverability, user guidance, and default experience

**Changes**:

**Default Mode Change**:
- Inter-Company Tool is now the default mode (previously Pricing Calculator)
- Mode switcher tabs reordered: Inter-Company first, Pricing Calculator second
- URL hash `#pricing` can still be used to start in Pricing Calculator mode
- URL hash `#intercompany` is no longer needed (it's now default)

**Comprehensive Tooltip System**:
Added info icons (`ⓘ`) with detailed modal explanations throughout the application:

- **Mode Switcher Buttons**: Each mode button now has an info icon explaining the tool's purpose
- **Pricing Model Selection**: All 5 pricing models (Subscription, Usage-Based, Per-Seat, One-Time, Marketplace) have info icons with formulas, key metrics, and use cases
- **Intercompany Calculator Tabs**: All 5 tabs (Calculator, Compliance, Visualizations, Sensitivity, Projections) have tooltips explaining their purpose
- **Selection Mode Toggle**: Wizard and Direct mode buttons have info icons explaining each approach
- **Form Inputs (Pricing)**: All input fields now have info icon buttons that open detailed modal explanations
- **Form Inputs (Intercompany)**: All input fields with hints now have clickable info icons

**Tooltip Content**:
- Each tooltip includes: explanation, key metrics/features, and common use cases
- Pricing model tooltips also include formulas
- Uses existing modal system for consistent UX
- Event delegation pattern for efficient handling

**Styling**:
- Added CSS styles for info icons with borders, shadows, and hover effects
- Info icons have italic "i" styling to appear as deliberate help badges
- Icons scale on hover with enhanced glow for visual feedback
- Proper focus states for accessibility

**Files Modified**:
- `index.html` (mode switcher order, visibility defaults, pricing model buttons)
- `app.js` (default mode logic, TOOLTIP_CONTENT definitions, setupTooltipHelpers, event handlers)
- `ui/forms.js` (input field help icons)
- `ui/intercompany/calculator.js` (tab tooltips, mode toggle tooltips, input help icons)
- `styles.css` (help icon styling)
- `docs/UI_UX_GUIDE.md` (documentation update)
- `docs/README.md` (documentation update)

**Benefits**:
- New users can immediately understand each feature without guessing
- Reduced learning curve for both pricing and inter-company tools
- Consistent help pattern across the entire application
- Info icons (`ⓘ`) look like deliberate help badges, not confused question marks
- Inter-company tool highlighted as the primary feature

---

### Performance Fix: Wizard Event Listener Accumulation

**Date**: January 8, 2026
**Impact**: Fixed critical performance issue causing wizard to become unresponsive on restart

**Issue**: After completing the wizard once and restarting, the page became progressively slower with each answer until it was completely unresponsive by the final question.

**Root Cause**: Event listeners were accumulating without cleanup:
- Every time `renderWizard()` was called (on each answer), `setupEventListeners()` added new listeners
- Old listeners were never removed, causing exponential accumulation
- After 7 questions: 14 duplicate listeners
- After restart + 7 more: 28+ listeners all firing on every interaction
- Browser struggled to process dozens of redundant event handlers

**Fix**: Implemented proper listener cleanup pattern:
1. Store references to bound event handlers in module-level variables
2. Call `removeEventListeners()` before adding new listeners in `setupEventListeners()`
3. Clean up listeners in `destroy*()` functions

**Files Modified**:
- `ui/intercompany/structure-selector.js` - Added `boundChangeHandler`, `boundClickHandler`, and `removeEventListeners()`
- `ui/intercompany/calculator.js` - Same pattern for tab switching and mode changes
- `ui/intercompany/entity-config.js` - Fixed `handleReset()` which also stacked listeners

**Technical Pattern**:
```javascript
// Before (BAD - listeners accumulate)
function setupEventListeners() {
    container.addEventListener('click', (e) => { ... });
}

// After (GOOD - cleanup before adding)
let boundClickHandler = null;

function removeEventListeners() {
    if (boundClickHandler) {
        container.removeEventListener('click', boundClickHandler);
        boundClickHandler = null;
    }
}

function setupEventListeners() {
    removeEventListeners(); // Clean up first
    boundClickHandler = (e) => { ... };
    container.addEventListener('click', boundClickHandler);
}
```

**Lesson Learned**: When re-rendering UI that calls `setupEventListeners()`, always remove previous listeners first to prevent accumulation and memory leaks.

---

### UI/UX Improvements: Layout Wrapping and Wizard Auto-Advance

**Date**: January 8, 2026
**Impact**: Improved mobile usability and simplified wizard navigation

**Changes**:

**Main Tab Navigation** (`ui/intercompany/calculator.js`):
- Added `flex-wrap` to tab button container to allow wrapping on narrow screens
- Added `min-w-[120px]` to each tab button for consistent sizing when wrapped
- Reduced icon margin from `mr-2` to `mr-1` for better space utilization

**Structure Selection Wizard** (`ui/intercompany/structure-selector.js`):
- Removed confusing Previous/Next navigation buttons
- Converted from step-by-step wizard to progressive disclosure pattern
- Questions now auto-advance when an option is selected
- All answered questions remain visible in compact format with "Change" button
- Smooth scroll animation to next question after each selection
- "See Recommendations" button appears only after all questions are answered
- Removed unused `currentStep` from wizard state

**Documentation** (`docs/UI_UX_GUIDE.md`):
- Added new "Structure Selection Wizard" section documenting the auto-advancing flow
- Updated changelog with version 2.2 entry

**Benefits**:
- Mobile users can now see all tabs without horizontal scrolling
- Wizard is more intuitive - no need to click "Next" to proceed
- Users can easily review and change previous answers
- Live preview of recommendations guides decision-making
- Smoother, more natural interaction flow

**Files Modified**:
- `ui/intercompany/calculator.js` (tab navigation flex-wrap)
- `ui/intercompany/structure-selector.js` (complete wizard refactor)
- `docs/UI_UX_GUIDE.md` (documentation updates)

---

### Fix: Reserved Keyword in Destructuring

**Date**: January 8, 2026
**Impact**: Fixed SyntaxError preventing compliance analyzer from loading

**Issue**: `Uncaught SyntaxError: Invalid destructuring assignment target` at `compliance-analyzer.js:1075`

- **Root Cause**: Used `eval` as a variable name in destructuring assignment: `([id, eval]) => ...`
- **Why It Fails**: `eval` is a reserved keyword in JavaScript and cannot be used as a variable name in strict mode or destructuring
- **Fix**: Renamed variable from `eval` to `evaluation`
- **Impact**: Compliance analyzer module now loads correctly

**Technical Details**:

- JavaScript reserves certain keywords that cannot be used as identifiers
- `eval` is a built-in function and reserved keyword
- Using it in destructuring (`[id, eval]`) triggers a SyntaxError
- Other reserved keywords to avoid: `arguments`, `class`, `function`, `new`, `return`, `typeof`, etc.

**Files Modified**:

- `ui/intercompany/compliance-analyzer.js` (line 1075-1078: renamed `eval` to `evaluation`)

---

### Quality & Error Handling Improvements

**Date**: January 8, 2026
**Impact**: Improved application stability and error resilience

**Changes**:

**Global Error Handling** (`app.js`):
- Added `window.onerror` handler to catch and log uncaught JavaScript errors
- Added `window.onunhandledrejection` handler for unhandled promise rejections
- Wrapped application initialization in try-catch with user-friendly error display
- Moved console.log messages inside initialization to ensure they only appear on success

**Chart Rendering Safety** (`charts/index.js`):
- Created `safeGetElement()` helper function with null checks and console warnings
- Created `safeRenderChart()` helper for safe chart instantiation
- Refactored all 18 chart rendering calls to use safe helpers
- Prevents runtime errors when chart containers are not present in DOM
- Added null checks for `updateMetrics()` and `renderEquilibriumChart()` functions

**Utility Function Robustness** (`utils/index.js`):
- Added null/undefined/NaN checks to `formatCurrency()` - returns 'R 0.00' for invalid values
- Added null/undefined/NaN checks to `formatPercentage()` - returns '0.0%' for invalid values
- Added null/undefined/NaN checks to `formatNumber()` - returns '0' for invalid values
- Prevents "NaN" or "undefined" appearing in UI for edge cases

**Cleanup**:
- Removed accidentally created `package.json` (project is pure browser-based, no npm needed)

**Benefits**:
- More resilient application that gracefully handles unexpected errors
- Clear error logging in console for debugging
- User-friendly error messages instead of blank/broken screens
- No more potential "Cannot read property of null" errors from chart rendering
- Consistent formatting output even with invalid data inputs

**Files Modified**:
- `app.js` (added global error handlers and try-catch around init)
- `charts/index.js` (added safe helper functions, refactored all chart rendering)
- `utils/index.js` (added defensive checks to formatting functions)

---

### Documentation Reorganization: docs/ Folder

**Date**: January 7, 2026
**Impact**: Cleaner root directory, better organization

**Changes**:

- Created `docs/` folder to house all documentation
- Moved all `.md` files into `docs/`:
  - `README.md` → `docs/README.md`
  - `BUSINESS_GUIDE.md` → `docs/BUSINESS_GUIDE.md`
  - `CALCULATIONS.md` → `docs/CALCULATIONS.md`
  - `UI_UX_GUIDE.md` → `docs/UI_UX_GUIDE.md`
  - `HISTORY.md` → `docs/HISTORY.md`
- Created `CLAUDE.md` (uppercase) in root directory
  - Claude Code looks for `CLAUDE.md` in the root for AI assistant context
  - This is the single source for technical/development documentation
- Updated file structure documentation in `CLAUDE.md`
- Updated all cross-references in docs to point to `../CLAUDE.md`

**Benefits**:

- Cleaner root directory with only code, config, and LICENSE
- All user-facing documentation consolidated in `docs/` folder
- `CLAUDE.md` in root where Claude Code expects it (single source)
- No duplicate documentation files to maintain
- Easier to navigate for both developers and users
- Follows common open-source project conventions

---

### Codebase Cleanup: Remove Unused Framework & Improve Comments

**Date**: January 7, 2026
**Impact**: Simplified codebase, improved code documentation

**Changes**:

**Removed Unused Code**:
- ❌ `framework/categories.js` - Defined pricing contexts but never imported anywhere
- ❌ `framework/delivery.js` - Defined delivery mechanisms but never used
- ❌ `framework/model-families.js` - Defined model groupings but never used
- ❌ `framework/services.js` - Defined service models but never used
- ❌ `framework/` folder - Removed entirely (4 files, ~1,000 lines of dead code)

**Rewrote claude.md**:
- Previous version described 20 models, 4 calculator modes, admin panels - none of which exist
- New version accurately describes the 5-model equilibrium pricing system
- Added "System Purpose" section explaining the dual-company owner use case
- Added "Comment Philosophy" section explaining why > what principle

**Updated Code Comments (why > what)**:
- `calculators/engine.js` - Explains why static unit economics, why fields get locked
- `calculators/reverse-calculations.js` - Explains why 0.4 threshold, why 3 strategies
- `models/index.js` - Explains why 5 models, why input groupings, why equilibrium math

**Why this matters**:
- Reduced confusion: code now matches documentation
- Easier onboarding: comments explain reasoning, not just mechanics
- Simpler codebase: removed ~1,000 lines of unused code

---

### Documentation: Streamlined Structure & Business Guide

**Date**: January 6, 2026
**Impact**: Simplified documentation structure with clear separation of concerns

**Changes**:

**Removed Outdated Documentation**:
- ❌ `FRAMEWORK_ALIGNMENT_PLAN.md` - Described a different system than current implementation
- ❌ `QUICK_START_ALIGNMENT.md` - Described planned features that were simplified
- ❌ `IMPLEMENTATION_PROGRESS.md` - Outdated file references after modular refactoring
- ❌ `SIMPLIFICATION_SUMMARY.md` - Historical context, no longer needed
- ❌ `TODO_REMAINING_WORK.md` - Merged into HISTORY.md as ongoing changelog

**Updated Core Documentation**:
- ✅ **README.md** - Simplified to 106 lines (from 270), focused on quick overview
- ✅ **claude.md** - Added documentation structure section, designated as primary technical reference
- ✅ **HISTORY.md** - Designated as ongoing changelog for all bug fixes and improvements

**New Documentation**:
- ✅ **BUSINESS_GUIDE.md** - Comprehensive 800+ line user guide with:
  - Detailed pricing model explanations
  - Step-by-step usage tutorials
  - Calculation mode walkthroughs
  - Results interpretation guide
  - Common scenarios and examples
  - Best practices and troubleshooting
  - FAQ section

**New Documentation Structure**:
```
Documentation Hierarchy:
├── README.md              # Quick overview (business users)
├── BUSINESS_GUIDE.md      # Detailed user guide (business users)
├── CALCULATIONS.md        # Formula explanations (technical users)
├── claude.md              # Architecture & dev guide (developers/AI)
└── HISTORY.md             # Ongoing changelog (developers)
```

**Benefits**:
- Clear separation between business and technical documentation
- Reduced redundancy and confusion from multiple overlapping docs
- **claude.md** and **HISTORY.md** designated as primary living documents
- Easier maintenance with fewer files to keep updated
- Better onboarding for both business users and developers

**Files Modified**:
- `README.md` (simplified, 106 lines)
- `claude.md` (added documentation structure section)
- `HISTORY.md` (this entry)

**Files Created**:
- `BUSINESS_GUIDE.md` (comprehensive user guide, 800+ lines)

**Files Removed**:
- `FRAMEWORK_ALIGNMENT_PLAN.md`
- `QUICK_START_ALIGNMENT.md`
- `IMPLEMENTATION_PROGRESS.md`
- `SIMPLIFICATION_SUMMARY.md`
- `TODO_REMAINING_WORK.md`

---

### Documentation: Comprehensive Calculations Guide

**Date**: January 5, 2026
**Impact**: Complete mathematical documentation for all pricing calculations

**Addition**: Created CALCULATIONS.md - a comprehensive guide explaining all formulas, rationale, and economic theory

- **Content**:
  - Core calculation philosophy (static unit economics)
  - Universal formulas applicable to all models
  - Model-specific calculations with examples for all 5 pricing models
  - Equilibrium theory explanation (seller floor vs buyer ceiling)
  - ROI thresholds and assumptions with detailed rationale
  - South African market calibration details
  - Formula quick reference table
  - Multiple worked examples and scenarios
- **Purpose**: Help users understand the "why" behind every calculation
- **Benefits**:
  - Transparency in pricing logic
  - Educational resource for founders/PMs/finance teams
  - Reference for understanding economic principles
  - Trust building through clear explanations

**Files Modified**:
- `CALCULATIONS.md` (new file - 1000+ lines)
- `README.md` (added documentation section and quick start reference)
- `TODO_REMAINING_WORK.md` (marked documentation as completed)

### UX Fix: Vendor Mode Comparison Charts Default State

**Date**: January 5, 2026
**Impact**: Comparison graphs now display by default in vendor mode

**Issue**: Users couldn't see comparison graphs in vendor mode without manually checking the "Compare multiple models" checkbox

- **Root Cause**: The "Compare multiple models" checkbox was unchecked by default, forcing users into single-model selection mode (radio buttons)
- **Problem**: Most users didn't realize they needed to check this box to enable multi-model comparison
- **Result**: Comparison charts section appeared empty/hidden in vendor mode since only one model could be selected
- **Fix**: Added `checked` attribute to the checkbox in `index.html` line 92
- **Impact**:
  - Users can now select multiple models immediately without configuration
  - Comparison graphs, universal metrics, race charts, and comparison tables work by default
  - Side-by-side model visualization is enabled out of the box
  - Users can still uncheck the box to focus on a single model when needed

**Files Modified**:

- `index.html` (added `checked` attribute to compareMultipleModels checkbox)

**Testing**: Verified multi-model selection and comparison charts render correctly by default in vendor mode

### Critical Bug Fix: Comprehensive Duplicate Declaration Resolution

**Date**: January 5, 2026
**Impact**: Fixed multiple SyntaxError instances preventing application from loading

**Issue**: `Uncaught SyntaxError: Identifier has already been declared` for multiple functions

- **Root Cause**: Multiple functions were both forward-declared for dependency injection AND exported as local functions in `ui/initialization.js`
- **Affected Functions**:
  - `generateModelCheckboxes` - forward-declared AND exported locally (line 391)
  - `updateSelectedSummary` - forward-declared AND exported locally (line 559)
  - `updateCalculateButton` - forward-declared AND exported locally (line 763)
  - `onModelSelectionChange` - forward-declared AND exported locally (line 522)
  - `updateInputForms` - forward-declared AND exported locally (line 575)
- **Why It Happened**: Circular dependency injection pattern was incorrectly applied - the module was trying to inject its own functions into itself via `app.js`
- **Fix**: Removed all self-referencing functions from:
  - Forward declaration list (lines 8-12)
  - `setUIHandlers()` assignment (lines 14-27)
  - `app.js` dependency injection (lines 53-67)
- **Impact**: All functions remain as locally exported functions, called directly within module

**Technical Details**:

- Same root cause as previous duplicate declaration bugs in `calculators/client-budget.js`
- JavaScript doesn't allow the same identifier to be declared twice in the same scope
- `let functionName` creates a variable declaration
- `export function functionName` creates a function declaration
- A function defined and exported in a module should NOT also be forward-declared for injection back into itself
- **Correct Pattern**: Use dependency injection ONLY for functions from OTHER modules, not self-references
  - ✅ Inject `admin.generateAdminPanel` into `initialization.js` (cross-module)
  - ✅ Inject `events.onInputChange` into `initialization.js` (cross-module)
  - ❌ Inject `initialization.generateModelCheckboxes` into `initialization.js` (self-reference)

**Files Modified**:

- `ui/initialization.js` (removed 5 duplicate declarations from forward declarations and setter function)
- `app.js` (removed 5 self-injection calls from initialization.setUIHandlers)

**Testing**: Verified application loads without errors in browser console, model selection works correctly

### Critical Bug Fix: Duplicate Declaration Errors (Part 1)

**Date**: January 5, 2026
**Impact**: Fixed SyntaxError that prevented application from loading

**Issue**: `Uncaught SyntaxError: Identifier 'renderUniversalMetrics' has already been declared`

- **Root Cause**: Multiple functions were both forward-declared as dependency injection variables AND exported as local functions in `calculators/client-budget.js`
- **Affected Functions**:
  - `renderUniversalMetrics` (line 9 forward declaration, line 726 export)
  - `renderComparisonCharts` (line 9 forward declaration, line 907 export)
  - `renderRaceChart` (line 10 forward declaration, line 1188 export)
  - `renderComparisonTable` (line 10 forward declaration, line 1123 export)
- **Why It Happened**: During modular refactoring, these functions were moved from app.js to client-budget.js but the forward declarations weren't removed
- **Fix**: Removed duplicate function names from forward declarations (lines 8-11) and from setUIFunctions (lines 19-22)
- **Impact**: Application now loads without SyntaxError, all calculator modes functional

**Technical Details**:

- JavaScript doesn't allow the same identifier to be declared twice in the same scope
- `let renderUniversalMetrics` creates a variable declaration
- `export function renderUniversalMetrics` creates a function declaration
- Both in the same module scope → SyntaxError
- The pattern should be: either forward-declare for injection OR export your own implementation, not both

**Files Modified**:

- `calculators/client-budget.js` (removed 4 duplicate declarations from forward declaration block and setter function)

**Testing**: Verified application loads without errors in browser console

### Critical Bug Fix: DOMContentLoaded Race Condition

**Date**: January 3, 2026
**Impact**: Fixed complete application initialization failure on mobile devices and cached pages

**Issue**: Models not loading, mode selection not working, all interactive features unresponsive

- **Root Cause**: Race condition in app initialization - `document.addEventListener('DOMContentLoaded', init)` was called at ES6 module load time with `init` being `undefined`
- **Sequence**:
  1. `modals.js` loads and immediately registers DOMContentLoaded listener with undefined function
  2. `app.js` later calls `setInitFunction(initialization.init)` to set the actual init function
  3. If DOMContentLoaded already fired (common on mobile/cached pages), init() never executes
  4. No event listeners attached → entire app non-functional
- **Fix**: Moved listener registration inside `setInitFunction()` after init is defined, with readyState check
  - If DOM still loading: register listener
  - If DOM already ready: call init() immediately
- **Impact**: Restored all interactive functionality on mobile devices and cached pages

**Technical Details**:

- ES6 modules execute synchronously at load time, creating timing dependencies
- Mobile browsers and cached pages often have DOMContentLoaded fire before module imports complete
- The forward declaration pattern (`let init;`) doesn't work with immediate event listener registration
- Solution handles both cases: DOM loading vs already loaded via `document.readyState` check

**Files Modified**:

- `ui/modals.js` (moved DOMContentLoaded listener into setInitFunction, added readyState check)

**Testing**: Verified initialization works correctly on both desktop and mobile, with and without cached content

### Critical Bug Fixes: Perspective Buttons & Calculate Handler

**Date**: January 1, 2026
**Impact**: Restored functionality for calculator mode switching and calculations

**Issues Fixed**:

1. **Perspective Buttons Not Working**: Calculator mode buttons (Vendor, Growth, Client, Admin) were unresponsive
   - **Root Cause**: `setCalculatorMode()` was directly assigning to imported `currentMode` variable instead of using setter function
   - **Fix**: Changed `currentMode = mode` to `setCurrentMode(mode)` in `ui/initialization.js:41`
   - **Impact**: All four perspective buttons now work correctly, mode switching is functional

2. **Calculate Button Not Working**: Calculate & Compare button was not triggering calculations
   - **Root Cause**: Event listener referenced undefined `onCalculate` instead of injected `onCalculateHandler`
   - **Fix**: Changed `addEventListener('click', onCalculate)` to `addEventListener('click', onCalculateHandler)` in `ui/initialization.js:274`
   - **Impact**: Calculate button now properly routes to correct calculation function based on current mode

**Technical Details**:

- ES6 module imports create read-only bindings - cannot reassign imported variables directly
- Proper use of setter functions maintains module encapsulation and state consistency
- Dependency injection pattern requires using injected handler names, not external function names
- Both bugs prevented core functionality from working after modular refactoring

**Files Modified**:

- `ui/initialization.js` (2 lines changed)

**Testing**: Verified all four calculator modes (Vendor, Growth, Client, Admin) and calculation functions work correctly

### Major Refactoring: Monolithic to Modular Architecture

**Date**: January 1, 2026
**Impact**: Complete codebase restructuring

**Changes**:

- Refactored 6,377-line monolithic `app.js` into 16 specialized modules
- Created 7-directory structure: `config/`, `framework/`, `models/`, `utils/`, `charts/`, `calculators/`, `ui/`
- Reduced main orchestrator file to 243 lines (96% reduction)
- Implemented ES6 module system with import/export
- Added dependency injection pattern to resolve circular dependencies
- Maintained 100% backward compatibility with existing HTML

**Benefits**:

- Dramatically improved code maintainability and navigation
- Each module has single, clear responsibility
- Modules can be tested independently
- Easier onboarding for new developers
- Simpler to add new features and models
- Better separation of concerns

**Files Created**:

- `config/constants.js` - Global configuration and state
- `framework/*.js` - Three-layer pricing framework (4 files)
- `models/index.js` - All 20 revenue model definitions
- `utils/index.js` - Shared utilities
- `charts/index.js` - Chart rendering logic
- `calculators/engine.js` - Core calculation engine
- `calculators/client-budget.js` - Budget calculator
- `ui/*.js` - UI components (5 files: forms, events, initialization, admin, modals)

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

### Budget Calculation Improvements (Large Budget Support)

**Issue**: Budgets above R1M showed "no options in budget" due to hardcoded capacity limits
**Fix**: Implemented dynamic budget scaling system:

- Created `findCapacityInput()` helper with case-insensitive keyword matching
  - Expanded keyword list: users, seats, customers, members, subscribers, startingusers, startingcustomers, freeusers, paidusers, newcustomers, etc.
  - Case-insensitive matching catches more input variations
- Created `calculateCapacityLimit()` to dynamically scale search limits based on budget
  - Estimates maximum capacity as `budget / minPriceEstimate`
  - Caps at 1M to prevent infinite searches while supporting large budgets
- Updated `findMaximumCapacity()`: Binary search up to 1M capacity (was 10k)
- Updated `findBestValue()`: Adaptive step sizes up to 50k capacity (was 1k with fixed steps)
- Updated `findConservativeOption()`: Dynamic limits up to 25k capacity (was 500 with fixed steps)

**Result**: Budget calculator now supports budgets from R100 to R10M+ with accurate results

### Model Selection Flexibility

**Issue**: Users couldn't toggle between single model focus and multi-model comparison
**Fix**: Added "Compare multiple models" toggle checkbox:

- HTML: Added toggle checkbox in `index.html` before model selector
- JavaScript: Enhanced `generateModelCheckboxes()` to check toggle state
  - When checked: Uses checkboxes for multi-select (existing behavior)
  - When unchecked: Uses radio buttons for single-select
  - Preserves current selections when regenerating UI
- Updated `onModelSelectionChange()` to handle both input types:
  - Radio: Clears all selections and selects only the clicked model
  - Checkbox: Adds/removes from selection set
- Added `onCompareMultipleToggle()` event handler to regenerate selector on toggle
- Added event listener in `init()` function

**Result**: Users can now easily switch between single model analysis and multi-model comparison

---

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
