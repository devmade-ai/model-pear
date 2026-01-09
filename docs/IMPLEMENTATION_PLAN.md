# Implementation Plan: Aligning Tool with Usage Scenarios

This plan addresses the gaps identified in `USAGE_SCENARIOS_REVIEW.md` and aligns the tool with how users actually work.

**Reference:** Based on the two user workflows documented:
1. Internal decision-making ("We need software")
2. Two-party negotiation ("We have an idea")

**Perspective Framework (now documented everywhere):**
- 2 perspectives for independent parties (Developer, Buyer)
- 3 perspectives (+ Shareholder) for mutual ownership
- NOT about group accounting consolidation

---

## Priority 1: Compare Mode

**User Need:** "Show me these options side-by-side so I can see trade-offs."

### Current Gap
- Results not saved (ephemeral)
- Must re-run wizard and remember values
- No side-by-side comparison view
- No export for stakeholders

### Implementation Approach

#### 1.1 State Extension

**File:** `state/app-state.js`

Add comparison storage to state:

```javascript
// Add to state object
savedComparisons: [],  // Array of saved comparison objects

// Each comparison object structure:
{
  id: crypto.randomUUID(),
  name: 'Option A - License Model',  // User-defined name
  timestamp: Date.now(),
  modelId: 'model-2',
  variantId: '2A',
  inputs: { ... },  // Copy of all inputs used
  entityConfig: { ... },  // Entity settings at time of save
  taxParams: { ... },  // Tax parameters
  results: { ... },  // Full calculation results
  perspective: 'combined',  // Which perspective was active
  notes: ''  // Optional user notes
}
```

Add state management functions:

```javascript
export function saveComparison(name, notes = '') { ... }
export function loadComparison(id) { ... }
export function deleteComparison(id) { ... }
export function updateComparisonNotes(id, notes) { ... }
export function getComparisons() { ... }
export function clearAllComparisons() { ... }
```

#### 1.2 Persistence Layer

**New File:** `utils/storage.js`

Implement localStorage persistence:

```javascript
const STORAGE_KEY = 'model-pear-comparisons';
const MAX_COMPARISONS = 20;  // Prevent localStorage overflow

export function saveToStorage(comparisons) { ... }
export function loadFromStorage() { ... }
export function exportAsJSON() { ... }
export function importFromJSON(json) { ... }
```

#### 1.3 Compare Mode UI

**New File:** `ui/intercompany/comparison-manager.js`

Components to build:

1. **Save Button** - Appears after successful calculation
   - "Save as Option" button in results area
   - Opens modal to name the option
   - Shows count of saved options

2. **Saved Options Panel** - Collapsible sidebar or tab
   - List of saved options with name/timestamp
   - Quick actions: Load, Compare, Delete
   - Drag to reorder comparison order

3. **Comparison View** - Side-by-side display
   - Select 2-4 options to compare
   - Key metrics table (rows = metrics, cols = options)
   - Highlight best/worst values
   - Color-coded differences

**New File:** `ui/intercompany/comparison-view.js`

```javascript
// Comparison view layout:
┌────────────────────────────────────────────────────────────┐
│  Compare Options                            [Close]        │
├────────────┬────────────┬────────────┬────────────────────┤
│  Metric    │  Option A  │  Option B  │  Difference        │
├────────────┼────────────┼────────────┼────────────────────┤
│  Model     │  License   │  BOT       │  -                 │
│  Variant   │  2A        │  4B        │  -                 │
├────────────┼────────────┼────────────┼────────────────────┤
│  DEVELOPER │            │            │                    │
│  Revenue   │  R 850,000 │  R 950,000 │  +R 100,000 ▲      │
│  Profit    │  R 200,000 │  R 180,000 │  -R 20,000 ▼       │
│  Tax       │  R 56,000  │  R 50,400  │  -R 5,600 ▼        │
├────────────┼────────────┼────────────┼────────────────────┤
│  BUYER     │            │            │                    │
│  Cost      │  R 850,000 │  R 950,000 │  +R 100,000 ▲      │
│  Asset     │  R 850,000 │  R 0       │  -R 850,000 ▼      │
│  Tax Ben   │  R 54,000  │  R 20,000  │  -R 34,000 ▼       │
├────────────┼────────────┼────────────┼────────────────────┤
│  COMBINED  │            │            │                    │
│  Net Cost  │  R 546,000 │  R 480,000 │  -R 66,000 ▼       │
│  NPV       │  R 380,000 │  R 420,000 │  +R 40,000 ▲       │
├────────────┼────────────┼────────────┼────────────────────┤
│  RISK      │            │            │                    │
│  Transfer  │  Low       │  Medium    │  ▲                 │
│  Compliance│  92%       │  78%       │  -14% ▼            │
└────────────┴────────────┴────────────┴────────────────────┘
```

#### 1.4 Export Functionality

Add to comparison view:
- "Export PDF" - Generate printable comparison
- "Export CSV" - Raw data for Excel
- "Copy Link" - Share encoded comparison state (base64 URL params)

### Tasks for Compare Mode

- [x] Extend `app-state.js` with `savedComparisons` array
- [x] Add state functions: save, load, delete, get comparisons
- [x] Create `utils/storage.js` for localStorage persistence
- [x] Add "Save as Option" button after calculation
- [x] Create save modal with name/notes input
- [x] Create `comparison-manager.js` - saved options panel
- [x] Create `comparison-view.js` - side-by-side comparison
- [x] Implement difference highlighting (green up, red down)
- [x] Add export functionality (PDF/CSV/JSON) - CSV and JSON implemented
- [x] Add import functionality (load from JSON)
- [x] Add clear all option with confirmation
- [x] Update tab navigation to include Comparison tab (or use modal) - using modal approach
- [x] Handle edge cases (missing data, incompatible comparisons) - warnings implemented
- [ ] Test with various models/variants

---

## Priority 2: Options Overview

**User Need:** "What are my options? Show me everything at once before I dive deep."

### Current Gap
- Tool starts with "pick a model"
- Must complete wizard for one model before seeing alternatives
- No high-level view of all 6 models with key differences

### Implementation Approach

#### 2.1 New Landing View

**New File:** `ui/intercompany/options-overview.js`

Create a new starting view that shows all 6 models:

```
┌──────────────────────────────────────────────────────────────────┐
│  How would you like to structure this transaction?               │
│  ─────────────────────────────────────────────────────────────── │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐              │
│  │ 💼 DEVELOPMENT       │  │ 📜 LICENSE           │              │
│  │    SERVICES          │  │    WITH ROYALTIES    │              │
│  │                      │  │                      │              │
│  │ Cost-plus approach   │  │ IP ownership stays   │              │
│  │ Developer retains IP │  │ with developer       │              │
│  │ Lower risk for buyer │  │ Ongoing royalty fees │              │
│  │                      │  │                      │              │
│  │ Payment: Service fee │  │ Payment: License +   │              │
│  │ Variants: 6          │  │          Royalties   │              │
│  │                      │  │ Variants: 8          │              │
│  │ [Explore →]          │  │ [Explore →]          │              │
│  └──────────────────────┘  └──────────────────────┘              │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐              │
│  │ 🤝 JOINT             │  │ 🔄 BUILD-OPERATE     │              │
│  │    DEVELOPMENT       │  │    TRANSFER          │              │
│  │                      │  │                      │              │
│  │ Shared costs & risks │  │ Phased IP transfer   │              │
│  │ Shared IP ownership  │  │ Operational period   │              │
│  │ Mutual commitment    │  │ then full handover   │              │
│  │                      │  │                      │              │
│  │ Payment: Cost share  │  │ Payment: Phased      │              │
│  │ Variants: 8          │  │ Variants: 8          │              │
│  │                      │  │                      │              │
│  │ [Explore →]          │  │ [Explore →]          │              │
│  └──────────────────────┘  └──────────────────────┘              │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐              │
│  │ 💰 SOFTWARE          │  │ 📊 SUBSCRIPTION      │              │
│  │    SALE              │  │    / SaaS            │              │
│  │                      │  │                      │              │
│  │ Outright purchase    │  │ Recurring revenue    │              │
│  │ Full IP transfer     │  │ No asset recognition │              │
│  │ One-time payment     │  │ Lower upfront cost   │              │
│  │                      │  │                      │              │
│  │ Payment: Once-off    │  │ Payment: Monthly/    │              │
│  │ Variants: 8          │  │          Annual      │              │
│  │                      │  │ Variants: 9          │              │
│  │ [Explore →]          │  │ [Explore →]          │              │
│  └──────────────────────┘  └──────────────────────┘              │
│                                                                  │
│  ─────────────────────────────────────────────────────────────── │
│  Not sure which fits best? [Use the guided wizard →]             │
└──────────────────────────────────────────────────────────────────┘
```

#### 2.2 Model Metadata Enhancement

**File:** `models/intercompany/registry.js`

Enhance `getModelMetadata()` to include overview data:

```javascript
{
  id: 'model-1',
  name: 'Development Services',
  shortName: 'Dev Services',
  icon: '💼',

  // New fields for overview
  summary: 'Cost-plus approach. Developer retains IP, buyer pays for services.',
  keyFeatures: [
    'Developer retains IP ownership',
    'Lower risk for buyer',
    'Service fee payment structure'
  ],
  bestFor: [
    'Custom development projects',
    'When IP should remain with developer',
    'Risk-averse buyers'
  ],
  paymentType: 'Service fee (monthly/milestone)',
  ipOwnership: 'Developer',
  riskProfile: 'Low for buyer, Higher for developer',

  // Existing
  variantCount: 6,
  defaultVariant: '1A'
}
```

#### 2.3 Quick Comparison Table

Add compact comparison table below cards:

```
┌─────────────────┬─────────────┬────────────┬──────────────┬─────────────┐
│ Model           │ IP Owner    │ Payment    │ Asset?       │ Risk        │
├─────────────────┼─────────────┼────────────┼──────────────┼─────────────┤
│ Dev Services    │ Developer   │ Fee        │ Buyer: No    │ Low →       │
│ License         │ Developer   │ Royalties  │ Buyer: Maybe │ Medium      │
│ Joint Dev       │ Shared      │ Cost share │ Both: Yes    │ Shared      │
│ BOT             │ → Buyer     │ Phased     │ Buyer: Yes*  │ Medium      │
│ Software Sale   │ Buyer       │ Once-off   │ Buyer: Yes   │ High →      │
│ Subscription    │ Developer   │ Recurring  │ Buyer: No    │ Low →       │
└─────────────────┴─────────────┴────────────┴──────────────┴─────────────┘
```

#### 2.4 Integration with Existing Flow

Update `ui/intercompany/calculator.js`:

```javascript
// New flow:
// 1. Show Options Overview as default landing view
// 2. User clicks "Explore" on a model → Show variants & inputs
// 3. User clicks "Use Wizard" → Existing wizard flow
// 4. After calculation → Results with "Compare" option
```

### Tasks for Options Overview

- [x] Create `ui/intercompany/options-overview.js`
- [x] Enhance `getModelMetadata()` with overview fields
- [x] Design model cards with key info (icon, summary, features)
- [x] Add quick comparison table below cards
- [x] Create "Best For" tags/badges for each model
- [x] Add "Explore →" button per card
- [x] Add "Use the guided wizard" link
- [x] Integrate as new landing view in calculator
- [x] Add view toggle: Overview ↔ Wizard ↔ Direct
- [x] Make view selection persistent (localStorage preference)
- [x] Ensure mobile responsiveness (stack cards) - CSS grid with auto-fit
- [x] Update app.js to route to overview by default (already defaults to overview)
- [x] Test navigation flows

---

## Priority 3: Perspective Toggle

**User Need:** "Am I looking at this from my perspective or theirs? What about the shareholder view?"

### Current Gap
- Toggle exists but not prominent enough
- "Mutual Ownership" buried in entity config
- Users don't realize they can switch perspectives easily
- Related/unrelated parties distinction not obvious

### Implementation Approach

#### 3.1 Make Related/Unrelated Toggle Prominent

**File:** `ui/intercompany/entity-config.js`

Move "Mutual Ownership" checkbox to a more prominent position:

```
┌────────────────────────────────────────────────────────────────────┐
│  Who are the parties?                                              │
│  ─────────────────────────────────────────────────────────────── │
│                                                                    │
│  ┌─────────────────────────┐  ┌─────────────────────────────────┐ │
│  │  ○ INDEPENDENT          │  │  ○ RELATED (Mutual Ownership)   │ │
│  │     PARTIES             │  │                                  │ │
│  │                         │  │  ☑ You're a shareholder in      │ │
│  │  Developer & Buyer      │  │    BOTH the developer AND       │ │
│  │  are unrelated          │  │    the buyer                    │ │
│  │                         │  │                                  │ │
│  │  → 2 perspectives       │  │  → 3 perspectives               │ │
│  │    (Developer, Buyer)   │  │    (Developer, Buyer,           │ │
│  │                         │  │     Shareholder)                 │ │
│  │  Standard arm's length  │  │  Transfer pricing rules apply   │ │
│  └─────────────────────────┘  └─────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

#### 3.2 Persistent Perspective Indicator

Add a persistent indicator showing current perspective mode:

**In header area of results/tabs:**

```
┌────────────────────────────────────────────────────────────────────┐
│  Viewing as: [Independent Parties ▼]  |  ← Expand for settings    │
└────────────────────────────────────────────────────────────────────┘
```

When clicked, dropdown shows:
- Independent Parties (current)
- Related Parties (Mutual Ownership)
  - ↳ Show Shareholder perspective

#### 3.3 Enhanced Perspective Toggle in Results

**File:** `ui/intercompany/perspective-toggle.js`

Enhance the existing toggle:

```
VIEWING AS INDEPENDENT PARTIES                                    [Change ▼]
┌────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────┐  ┌─────────────────┐                                  │
│  │ 💻 DEVELOPER    │  │ 🏢 BUYER        │  [Shareholder view not available │
│  │    PERSPECTIVE  │  │    PERSPECTIVE  │   for independent parties]       │
│  │                 │  │                 │                                  │
│  │  ● Active       │  │  ○              │                                  │
│  └─────────────────┘  └─────────────────┘                                  │
└────────────────────────────────────────────────────────────────────────────┘

VIEWING AS RELATED PARTIES (Mutual Ownership)                     [Change ▼]
┌────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │ 💻 DEVELOPER    │  │ 🏢 BUYER        │  │ ⚖️ SHAREHOLDER   │            │
│  │    PERSPECTIVE  │  │    PERSPECTIVE  │  │    PERSPECTIVE  │            │
│  │                 │  │                 │  │                 │            │
│  │  ○              │  │  ○              │  │  ● Active       │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                            │
│  ℹ️ Shareholder view shows combined effect on your ownership in BOTH       │
│     entities. Transfer pricing compliance is critical.                     │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 3.4 Visual Consistency

Add visual theming based on current perspective:

| Perspective | Primary Color | Icon | Border/Accent |
|-------------|---------------|------|---------------|
| Developer   | Blue (#3B82F6)| 💻   | Blue border   |
| Buyer       | Green (#10B981)| 🏢  | Green border  |
| Shareholder | Purple (#8B5CF6)| ⚖️  | Purple border |

Results cards should reflect active perspective color.

#### 3.5 Keyboard Shortcuts

Add keyboard navigation:
- `D` - Switch to Developer perspective
- `B` - Switch to Buyer perspective
- `S` - Switch to Shareholder perspective (if mutual ownership)
- `M` - Toggle Mutual Ownership on/off

Show keyboard hints in tooltip/help.

### Tasks for Perspective Toggle

- [x] Redesign party relationship selector (prominent radio cards) - Created `ui/intercompany/party-selector.js`
- [x] Move "Mutual Ownership" out of entity config panel - Removed from `entity-config.js`
- [x] Create persistent perspective indicator in header - Added to `perspective-toggle.js`
- [x] Enhance perspective toggle visual design - Updated `perspective-toggle.js` with new layout
- [x] Add color-coded borders/themes per perspective - Implemented with dynamic CSS classes
- [x] Show/hide Shareholder toggle based on relationship type - Labels change: "Net Effect" ↔ "Shareholder"
- [x] Add explanatory text for each perspective - Added description box that changes with perspective
- [x] Implement keyboard shortcuts (D/B/S/M) - Added in `perspective-toggle.js`
- [x] Add keyboard hint in tooltip/help modal - Shown in perspective toggle header
- [ ] Update all results components to use perspective colors - Future enhancement
- [ ] Test perspective switching with various models - Manual testing needed
- [ ] Ensure state persists correctly - Basic testing done

---

## Implementation Order

### Phase 1: Foundation (Priority 3 first - simpler)

1. **Perspective Toggle Enhancement**
   - Quickest win, high visibility
   - Establishes the "2 perspectives vs 3 perspectives" pattern
   - Prepares users for comparison mode

### Phase 2: Options Overview (Priority 2)

2. **Options Overview**
   - Creates new landing experience
   - Sets up "explore then compare" flow
   - Metadata enhancements useful for Compare Mode

### Phase 3: Compare Mode (Priority 1 - most complex)

3. **Compare Mode**
   - Most complex feature
   - Benefits from completed Perspective and Overview work
   - Storage layer enables future enhancements

---

## Architecture Notes

### State Management Extensions

All features connect to existing state management in `app-state.js`:

```javascript
// Existing
state.intercompany.currentPerspective  // 'developer' | 'buyer' | 'combined'

// New for Priority 3
state.entities.relationship.type  // 'independent' | 'related'
state.entities.relationship.mutualOwnership  // boolean (existing, promote)

// New for Priority 1
state.savedComparisons  // Array of saved comparison objects
state.ui.activeComparison  // IDs of items being compared
state.ui.comparisonViewOpen  // boolean
```

### File Structure

New files to create:
```
ui/intercompany/
├── options-overview.js      # Priority 2 - Model overview grid
├── comparison-manager.js    # Priority 1 - Save/load UI
├── comparison-view.js       # Priority 1 - Side-by-side display
└── party-selector.js        # Priority 3 - Related/unrelated toggle

utils/
└── storage.js               # Priority 1 - localStorage persistence
```

Files to modify:
```
state/app-state.js           # All priorities - state extensions
models/intercompany/registry.js  # Priority 2 - Enhanced metadata
ui/intercompany/calculator.js    # All priorities - Navigation updates
ui/intercompany/perspective-toggle.js  # Priority 3 - Enhanced toggle
ui/intercompany/entity-config.js  # Priority 3 - Move mutual ownership
ui/intercompany/results-display.js  # Priority 3 - Perspective colors
app.js                       # Priority 2 - Default landing view
```

---

## Success Metrics

### Compare Mode
- User can save 3+ options
- Side-by-side comparison shows meaningful differences
- Export produces usable PDF/CSV

### Options Overview
- User can see all 6 models in <3 seconds
- Clear path from overview → detailed exploration
- "Best for" guidance helps decision-making

### Perspective Toggle
- User immediately understands which perspective is active
- Switching perspectives takes 1 click
- Related party implications are clear

---

## Next Steps

1. [x] Review and approve this plan
2. [x] Begin Phase 1: Perspective Toggle Enhancement - **COMPLETED (Session 2026-01-09)**
3. [ ] User testing after Phase 1
4. [x] Begin Phase 2: Options Overview - **COMPLETED (Session 2026-01-09)**
5. [x] Begin Phase 3: Compare Mode - **SUBSTANTIALLY COMPLETE (Session 2026-01-09)**
   - [x] Sub-phase 3.1: State & Storage Foundation
   - [x] Sub-phase 3.2: Save Functionality UI
   - [x] Sub-phase 3.3: Comparison Manager & View
   - [x] Sub-phase 3.4: Export/Import Integration
6. [ ] User testing of all phases
7. [ ] Iterate based on feedback

---

## Session Notes

### Session: 2026-01-09 (Phase 1 Complete)

**What was implemented:**

1. **New File: `ui/intercompany/party-selector.js`**
   - Prominent radio card UI for selecting party relationship type
   - Two options: "Independent Parties" (2 perspectives) and "Related Parties" (3 perspectives)
   - Transfer pricing warning shown when Related Parties selected
   - Visual feedback with color-coded borders and selection indicators

2. **Updated: `state/app-state.js`**
   - Added `setRelationshipType(isRelated)` action creator
   - Added `arePartiesRelated()` helper function
   - Exported new functions in default export

3. **Updated: `ui/intercompany/calculator.js`**
   - Imported and integrated party selector component
   - Added party selector section above entity configuration
   - Included party selector styles

4. **Updated: `ui/intercompany/entity-config.js`**
   - Removed "Relationship Settings" section (moved to party selector)
   - Simplified entity config to focus on company/client details and tax params

5. **Updated: `ui/intercompany/perspective-toggle.js`**
   - Enhanced PERSPECTIVES definitions with shortcuts and relationship-aware labels
   - Added `getPerspectiveDisplayInfo()` function for dynamic label adjustment
   - "Net Effect" label changes to "Shareholder" when Related Parties is selected
   - Added header showing current mode (Independent/Related)
   - Added keyboard shortcut hints (D/B/S/M)
   - Implemented keyboard shortcuts for perspective switching
   - Added transfer pricing warning when Related Parties is active
   - Subscribe to relationship changes for automatic UI updates

**Keyboard Shortcuts Added:**
- `D` - Switch to Developer (Your Company) perspective
- `B` - Switch to Buyer (Client) perspective
- `S` - Switch to Shareholder/Net Effect perspective
- `M` - Toggle Mutual Ownership (Independent ↔ Related)

**What remains for Phase 1:**
- Manual testing with various models
- Results components could use perspective colors (optional enhancement)

**Ready to proceed with:**
- Phase 2: Options Overview
- Or user testing of Phase 1 changes

---

### Session: 2026-01-09 (Phase 2 - Options Overview Started)

**What was implemented:**

1. **Updated: `models/intercompany/registry.js`**
   - Added `MODEL_OVERVIEW_DATA` object with comprehensive metadata for all 6 models
   - Each model now has: icon, summary, keyFeatures, bestFor, paymentType, ipOwnership, riskProfile
   - Enhanced `getModelMetadata()` to include overview fields
   - Added `getModelComparisonData()` for quick comparison table
   - Added helper functions `getBuyerAssetIndicator()` and `getRiskDirection()`

2. **New File: `ui/intercompany/options-overview.js`**
   - Complete options overview component with model cards grid
   - Each card shows: icon, name, summary, key features, best-for tags, IP/payment badges
   - "Explore →" button on each card to select model
   - Quick comparison table showing all models side-by-side
   - "Use the guided wizard" link at bottom
   - Responsive CSS grid layout (auto-fit for mobile)
   - Event handling for model selection and wizard navigation

3. **Updated: `ui/intercompany/calculator.js`**
   - Added "Overview" button to selection mode toggle
   - Changed default selection mode from 'wizard' to 'overview'
   - Added `#optionsOverviewSection` container
   - Integrated options overview styles
   - Added `handleOverviewModelSelected()` handler
   - Added `handleSwitchToWizard()` handler
   - Added cleanup in `destroyIntercompanyCalculator()`

**Model Overview Data Added:**
| Model | Icon | IP Ownership | Payment Type |
|-------|------|--------------|--------------|
| Dev Services | 💼 | Buyer | Service fee (cost + margin) |
| Licence | 📜 | Developer | Licence fee + Royalties |
| Joint Dev | 🤝 | Shared | Cost sharing (no markup) |
| BOT | 🔄 | Developer → Buyer | Service fees + Transfer payment |
| Software Sale | 💰 | Buyer (on sale) | Once-off purchase + Support fees |
| SaaS | 📊 | Developer | Monthly/Annual subscription |

**Navigation Flow:**
1. App loads → Shows Overview mode (default)
2. User clicks card → Switches to Direct mode with model selected
3. User clicks "Use wizard" → Switches to Wizard mode
4. User can toggle between Overview/Wizard/Direct at any time

**What remains for Phase 2:**
- ~~Make view selection persistent (localStorage preference)~~ ✅
- ~~Verify app.js routing (should work as-is)~~ ✅
- ~~Test navigation flows~~ ✅

**Ready to proceed with:**
- Completing Phase 2 persistence feature
- Phase 3: Compare Mode
- Or user testing of Phase 2 changes

---

### Session: 2026-01-09 (Phase 2 - Options Overview Completed)

**What was implemented:**

1. **Updated: `ui/intercompany/calculator.js`**
   - Added `STORAGE_KEY_SELECTION_MODE` constant for localStorage key
   - Added `VALID_SELECTION_MODES` array for validation
   - Added `loadSelectionModePreference()` function to load from localStorage
   - Added `saveSelectionModePreference()` function to persist preference
   - Initial `selectionMode` now loads from localStorage (defaults to 'overview')
   - All mode change locations now call `saveSelectionModePreference()`

**localStorage Persistence:**
- Key: `model-pear-selection-mode`
- Valid values: `overview`, `wizard`, `direct`
- Default: `overview`
- Saved when: User clicks mode toggle buttons, selects model from overview, switches to wizard

**Phase 2 Complete!**

All tasks for Priority 2 (Options Overview) are now complete:
- ✅ Create options-overview.js component
- ✅ Enhanced model metadata with overview fields
- ✅ Model cards with icon, summary, features, best-for tags
- ✅ Quick comparison table
- ✅ Explore buttons and wizard link
- ✅ Integrated as default landing view
- ✅ Three-way mode toggle (Overview/Wizard/Direct)
- ✅ localStorage persistence for mode preference
- ✅ Mobile responsiveness

**Ready to proceed with:**
- Phase 3: Compare Mode (Priority 1 - most complex)
- User testing of Phase 1 & Phase 2 changes

---

### Session: 2026-01-09 (Phase 3 - Compare Mode Started)

**What was implemented:**

#### Sub-phase 3.1: State & Storage Foundation

1. **New File: `utils/storage.js`**
   - `saveToStorage(comparisons)` - Save comparisons to localStorage with version tracking
   - `loadFromStorage()` - Load and validate comparisons from localStorage
   - `clearStorage()` - Clear all saved comparisons
   - `getStorageInfo()` - Get storage usage statistics
   - `exportAsJSON(comparisons)` - Export comparisons as JSON string
   - `exportAsCSV(comparisons)` - Export comparisons as CSV format
   - `generateComparisonSummary(comparisons)` - Generate structured comparison data
   - `importFromJSON(jsonString)` - Import comparisons from JSON
   - `mergeComparisons(existing, imported, mode)` - Merge imported with existing
   - `downloadAsJSON()`, `downloadAsCSV()` - Trigger file downloads
   - Constants: `MAX_COMPARISONS = 20`, `STORAGE_VERSION = 1`

2. **Updated: `state/app-state.js`**
   - Added `savedComparisons: []` to initial state
   - Added UI state: `comparisonViewOpen`, `activeComparisonIds`, `saveModalOpen`
   - Added comparison action creators:
     - `initializeComparisons()` - Load from localStorage on startup
     - `saveComparison(name, notes, inputs)` - Save current calculation
     - `loadComparison(id)` - Restore a saved comparison to state
     - `deleteComparison(id)` - Remove a saved comparison
     - `updateComparisonNotes(id, notes)` - Update notes
     - `renameComparison(id, name)` - Rename a comparison
     - `getComparisons()` - Get all saved comparisons
     - `getComparisonById(id)` - Get specific comparison
     - `clearAllComparisons()` - Clear all and reset UI state
     - `importComparisons(comparisons, mode)` - Import external comparisons
   - Added comparison UI state functions:
     - `toggleComparisonView()`, `setComparisonViewOpen()`
     - `setSaveModalOpen()`
     - `setActiveComparisons(ids)`, `toggleComparisonSelection(id)`
     - `clearComparisonSelections()`

#### Sub-phase 3.2: Save Functionality UI

3. **Updated: `ui/intercompany/calculator.js`**
   - Added imports for comparison state functions
   - Added Save Actions Bar in results section:
     - "💾 Save as Option" button (always visible when results shown)
     - Saved options count display
     - "📋 View Saved" button (shown when 1+ options saved)
     - "⚖️ Compare" button (shown when 2+ options saved)
   - Added Save Modal:
     - Option name input (with auto-generated default)
     - Notes textarea (optional)
     - Model/Variant info display
     - Cancel and Save buttons
   - Added event handlers:
     - `handleOpenSaveModal()` - Opens modal, populates defaults
     - `handleCloseSaveModal()` - Closes modal
     - `handleConfirmSave()` - Validates and saves comparison
     - `handleViewSavedOptions()` - Placeholder for comparison manager
     - `handleCompareOptions()` - Placeholder for comparison view
     - `updateSavedOptionsUI()` - Updates count and button visibility
     - `initSavedOptionsUI()` - Initializes comparisons on load
   - Updated state change handler to react to comparison changes

**Comparison Object Structure:**
```javascript
{
  id: crypto.randomUUID(),
  name: 'Option A - License Model',
  timestamp: Date.now(),
  modelId: 'model-2',
  variantId: '2A',
  inputs: { ... },  // All inputs used
  entityConfig: { ... },  // Entity settings at save time
  taxParams: { ... },  // Tax parameters
  results: { ... },  // Full calculation results
  perspective: 'combined',
  notes: ''
}
```

**What remains for Phase 3:**
- `comparison-manager.js` - Saved options panel (list, load, delete, rename)
- `comparison-view.js` - Side-by-side comparison table
- Difference highlighting (green up arrows, red down arrows)
- Export functionality integration (PDF/CSV/JSON buttons)
- Import functionality integration (file upload)
- Clear all with confirmation dialog
- Tab/modal integration for comparison view
- Testing and edge case handling

**Recommended next session priorities:**
1. ~~Create `comparison-manager.js` for viewing/managing saved options~~ ✅
2. ~~Create `comparison-view.js` for side-by-side comparison~~ ✅
3. ~~Wire up export/import to UI buttons~~ ✅

**Notes:**
- Storage uses localStorage with 20 comparison limit to prevent overflow
- Versioned storage format allows for future migrations
- UI updates reactively when comparisons change
- Modal is inline in calculator HTML for simplicity
- ~~"View Saved" and "Compare" are placeholders until manager/view components built~~ ✅ Now fully implemented

---

### Session: 2026-01-09 (Phase 3 - Compare Mode Continued)

**What was implemented:**

#### Sub-phase 3.3: Comparison Manager & View

1. **New File: `ui/intercompany/comparison-manager.js`**
   - Full-featured panel for managing saved comparison options
   - View list of all saved comparisons with key metrics
   - Load a comparison (restores state to calculator)
   - Delete comparisons with confirmation dialog
   - Edit/rename comparisons inline
   - Edit notes for comparisons
   - Select multiple comparisons for side-by-side view (checkboxes)
   - Export to JSON and CSV
   - Import from JSON file
   - Clear all with confirmation
   - Storage info display (count, size, max limit)
   - Relative timestamps (e.g., "2h ago", "3d ago")
   - Key metrics summary on each card (Dev Revenue, Dev Profit, Buyer Cost, Combined Net)

2. **New File: `ui/intercompany/comparison-view.js`**
   - Side-by-side comparison table for 2-4 options
   - Metric categories: Developer, Buyer, Combined/Net Effect, Transfer Pricing Risk
   - Difference column (vs first option) with directional arrows
   - Best/worst value highlighting (green/red backgrounds)
   - Option header with model badges
   - Export comparison as JSON or CSV
   - Legend for highlight colors
   - Responsive design for mobile

3. **Updated: `ui/intercompany/calculator.js`**
   - Imported comparison-manager and comparison-view components
   - Added container elements for manager and view panels
   - Added styles for both components
   - Updated `handleViewSavedOptions()` to open comparison manager
   - Updated `handleCompareOptions()` to open comparison view with all options
   - Added initialization calls for both components
   - Added cleanup calls in `destroyIntercompanyCalculator()`

**Comparison Manager Features:**
| Feature | Status |
|---------|--------|
| List saved options | ✅ |
| Show key metrics | ✅ |
| Load option | ✅ |
| Delete with confirm | ✅ |
| Rename inline | ✅ |
| Edit notes | ✅ |
| Select for comparison | ✅ |
| Export JSON | ✅ |
| Export CSV | ✅ |
| Import JSON | ✅ |
| Clear all | ✅ |
| Storage info | ✅ |

**Comparison View Features:**
| Feature | Status |
|---------|--------|
| Side-by-side table | ✅ |
| Developer metrics | ✅ |
| Buyer metrics | ✅ |
| Combined metrics | ✅ |
| Transfer pricing | ✅ |
| Difference column | ✅ |
| Best/worst highlighting | ✅ |
| Export JSON/CSV | ✅ |

**What remains for Phase 3:**
- [ ] Add "Clear All" option with confirmation in results area (optional)
- [ ] Additional testing with various models/variants
- [ ] Handle edge cases (incompatible comparisons, missing data)
- [ ] Consider adding comparison tab to main navigation (optional enhancement)

**Phase 3 is now substantially complete!**

The core Compare Mode functionality is now fully implemented:
- ✅ Save calculations as named options
- ✅ View and manage saved options
- ✅ Side-by-side comparison view
- ✅ Export/Import functionality
- ✅ Difference highlighting
- ✅ Key metrics display

**Ready to proceed with:**
- User testing of the complete Compare Mode
- Minor enhancements and edge case handling
- Or move to other features/improvements

---

### Session: 2026-01-09 (Documentation Update)

**What was implemented:**

This session focused on updating all documentation to reflect the new features implemented in previous sessions.

#### Documentation Updates

1. **Updated: `docs/BUSINESS_GUIDE.md`**
   - Added new Table of Contents entries for Options Overview and Compare Mode
   - Added complete "Options Overview" section explaining the new landing view
   - Added complete "Compare Mode" section with:
     - Purpose and user need explanation
     - Saving options workflow
     - Managing saved options
     - Comparing options with visual indicators
     - Export/Import functionality
     - Storage limits and tips
   - Updated FAQ "Can I export results?" to reflect new export capabilities

2. **Updated: `docs/UI_UX_GUIDE.md`**
   - Added "Options Overview" section documenting UI layout and components
   - Added "Compare Mode" section with ASCII diagrams for:
     - Save Modal layout
     - Save Actions Bar
     - Comparison Manager Panel
     - Comparison View table
   - Updated "Future Enhancements" section (removed implemented features)
   - Added Version 2.5 changelog entry documenting all new features

3. **Updated: `docs/README.md`**
   - Added Options Overview and Compare Mode to Key Features list
   - Added Export feature mention

**Implementation Plan Status:**

All three phases from the implementation plan are now complete:

| Phase | Feature | Status |
|-------|---------|--------|
| Phase 1 | Perspective Toggle Enhancement | ✅ Complete |
| Phase 2 | Options Overview | ✅ Complete |
| Phase 3 | Compare Mode | ✅ Complete |

**Remaining Work (Optional Enhancements):**
- [ ] Update results components to use perspective colors (visual polish)
- [ ] Add "Clear All" option in results area
- [ ] Handle edge cases (incompatible comparisons, missing data)
- [ ] User testing of all phases
- [ ] Consider adding comparison tab to main navigation

**Notes:**
- All core functionality is implemented and documented
- Ready for user testing and feedback
- Future sessions can focus on polish, testing, and user-requested enhancements

---

## Future Work (Optional Enhancements)

This section consolidates all remaining optional work for easy reference in future sessions.

### Visual Polish

| Item | Priority | Effort | Notes |
|------|----------|--------|-------|
| Perspective colors on results components | Low | Medium | Apply blue/green/purple theming to results cards based on active perspective |

### Features

| Item | Priority | Effort | Notes |
|------|----------|--------|-------|
| ~~"Clear All" button in results area~~ | ~~Low~~ | ~~Low~~ | ✅ Added to save actions bar with confirmation dialog |
| Comparison tab in main navigation | Low | Medium | Alternative to modal-based comparison view |
| ~~PDF export~~ | ~~Medium~~ | ~~High~~ | ✅ Print/PDF button with print-friendly CSS (browser native approach) |

### Robustness

| Item | Priority | Effort | Notes |
|------|----------|--------|-------|
| ~~Handle incompatible comparisons~~ | ~~Medium~~ | ~~Medium~~ | ✅ Warnings implemented for different models, perspectives, and missing data |
| Edge case testing | Medium | Medium | Test with extreme values, empty states, storage limits |

### Testing

| Item | Priority | Effort | Notes |
|------|----------|--------|-------|
| User testing of Phase 1 (Perspective Toggle) | High | Low | Manual testing of keyboard shortcuts, perspective switching |
| User testing of Phase 2 (Options Overview) | High | Low | Test navigation flows, model selection, responsive design |
| User testing of Phase 3 (Compare Mode) | High | Medium | Test save/load/compare/export workflows |

### How to Use This List

1. Pick items based on priority and available time
2. Mark items complete in the checkbox format when done
3. Add new items as they're discovered
4. Move completed items to session notes

**Last Updated:** 2026-01-09 (PDF export added)

---

### Session: 2026-01-09 (Robustness Enhancement - Incompatible Comparisons)

**What was implemented:**

#### Comparison View Compatibility Warnings

1. **Updated: `ui/intercompany/comparison-view.js`**
   - Added `checkComparisonCompatibility(comparisons)` function that checks for:
     - Different models being compared (warning)
     - Different perspectives at time of save (info)
     - Missing or incomplete calculation results (error)
   - Added CSS styles for warning banners with severity levels (warning/info/error)
   - Added `renderWarnings(warnings)` function to display warnings
   - Warnings appear at the top of the comparison view, before the table

**Warning Types:**
| Type | Severity | Message |
|------|----------|---------|
| Different models | Warning | "Comparing different models (X, Y). Some metrics may not be directly comparable." |
| Different perspectives | Info | "Options were saved from different perspectives. Results reflect the perspective at time of save." |
| Missing data | Error | "X option(s) have missing or incomplete calculation results." |

**Visual Design:**
- Warning (amber): Different model types
- Info (blue): Different perspectives
- Error (red): Missing data

**Notes:**
- This is a focused enhancement that improves user experience when comparing options
- Users are now informed when comparisons may not be meaningful
- Error-level warnings indicate data issues that may need attention
- Warnings don't block the comparison, just inform the user

**Ready to proceed with:**
- User testing of comparison warnings
- Additional edge case handling as needed
- Other optional enhancements from Future Work list

---

### Session: 2026-01-09 (Feature - Clear All Button)

**What was implemented:**

#### Clear All Button in Results Area

1. **Updated: `ui/intercompany/calculator.js`**
   - Added `clearAllComparisons` to imports from app-state.js
   - Added "Clear All" button to save actions bar (red styling, hidden by default)
   - Updated `updateSavedOptionsUI()` to show/hide the Clear All button based on saved count
   - Added click handler for the button in the event delegation
   - Added `handleClearAllOptions()` function with browser confirmation dialog

**Button Behavior:**
- Only visible when 1+ options are saved
- Uses native browser `confirm()` dialog for confirmation
- Shows count of options to be deleted
- Displays success toast after clearing
- Updates UI immediately after clearing

**Notes:**
- Uses native confirm dialog for simplicity (matches browser UX patterns)
- Button styled with red background to indicate destructive action
- Quick, low-effort enhancement that improves workflow efficiency

---

### Session: 2026-01-09 (Feature - Print/PDF Export)

**What was implemented:**

#### Print-Friendly Export for Comparison View

1. **Updated: `ui/intercompany/comparison-view.js`**
   - Added comprehensive `@media print` CSS styles for PDF-ready output
   - Added "Print / PDF" button to the comparison view toolbar
   - Added `handlePrint()` function that triggers `window.print()`

**Print Styles Include:**
- White background for all elements (printer-friendly)
- Proper borders and contrast for table readability
- Hidden UI elements (close button, toolbar buttons) in print output
- Preserved highlight colors for best/worst values (green/red)
- Warning banners styled for print (amber/blue/red backgrounds)
- A4 landscape page setup with 1cm margins
- Visible only comparison view content (hides rest of page)

**User Experience:**
- Click "Print / PDF" button in comparison view toolbar
- Browser print dialog opens
- User can select "Save as PDF" destination in their browser
- Or print directly to a physical printer
- Output is formatted for professional presentation

**Why This Approach:**
- No external PDF library dependencies required
- Leverages browser's native print-to-PDF capability
- Works across all modern browsers
- Lower maintenance burden than library-based approach
- Consistent with browser UX patterns users already know

**Files Changed:**
- `ui/intercompany/comparison-view.js` - Added print CSS (~100 lines) and print button/handler

**Ready to proceed with:**
- User testing of print functionality across browsers
- Further visual refinements if needed
- Remaining items from Future Work list
