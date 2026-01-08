# Development History & Bug Fixes

> **Last Updated**: January 2026
> **Purpose**: Historical record of bug fixes, improvements, and major refactoring work

This file tracks all significant bug fixes, improvements, and architectural changes made to the Revenue Model Calculator project. For current project status and architecture, see [CLAUDE.md](../CLAUDE.md).

---

## Recent Bug Fixes & Improvements (January 2026)

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
Added help icons (`?`) with detailed modal explanations throughout the application:

- **Mode Switcher Buttons**: Each mode button now has a help icon explaining the tool's purpose
- **Pricing Model Selection**: All 5 pricing models (Subscription, Usage-Based, Per-Seat, One-Time, Marketplace) have help icons with formulas, key metrics, and use cases
- **Intercompany Calculator Tabs**: All 5 tabs (Calculator, Compliance, Visualizations, Sensitivity, Projections) have tooltips explaining their purpose
- **Selection Mode Toggle**: Wizard and Direct mode buttons have help icons explaining each approach
- **Form Inputs (Pricing)**: All input fields now have help icon buttons that open detailed modal explanations
- **Form Inputs (Intercompany)**: All input fields with hints now have clickable help icons

**Tooltip Content**:
- Each tooltip includes: explanation, key metrics/features, and common use cases
- Pricing model tooltips also include formulas
- Uses existing modal system for consistent UX
- Event delegation pattern for efficient handling

**Styling**:
- Added CSS styles for help icons with hover effects
- Help icons scale on hover for visual feedback
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
- Maintains clean UI with non-intrusive `?` icons
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
