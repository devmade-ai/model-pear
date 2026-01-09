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

- [ ] Extend `app-state.js` with `savedComparisons` array
- [ ] Add state functions: save, load, delete, get comparisons
- [ ] Create `utils/storage.js` for localStorage persistence
- [ ] Add "Save as Option" button after calculation
- [ ] Create save modal with name/notes input
- [ ] Create `comparison-manager.js` - saved options panel
- [ ] Create `comparison-view.js` - side-by-side comparison
- [ ] Implement difference highlighting (green up, red down)
- [ ] Add export functionality (PDF/CSV/JSON)
- [ ] Add import functionality (load from JSON)
- [ ] Add clear all option with confirmation
- [ ] Update tab navigation to include Comparison tab (or use modal)
- [ ] Test with various models/variants
- [ ] Handle edge cases (missing data, incompatible comparisons)

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

- [ ] Create `ui/intercompany/options-overview.js`
- [ ] Enhance `getModelMetadata()` with overview fields
- [ ] Design model cards with key info (icon, summary, features)
- [ ] Add quick comparison table below cards
- [ ] Create "Best For" tags/badges for each model
- [ ] Add "Explore →" button per card
- [ ] Add "Use the guided wizard" link
- [ ] Integrate as new landing view in calculator
- [ ] Add view toggle: Overview ↔ Wizard ↔ Direct
- [ ] Make view selection persistent (localStorage preference)
- [ ] Ensure mobile responsiveness (stack cards)
- [ ] Update app.js to route to overview by default
- [ ] Test navigation flows

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

- [ ] Redesign party relationship selector (prominent radio cards)
- [ ] Move "Mutual Ownership" out of entity config panel
- [ ] Create persistent perspective indicator in header
- [ ] Enhance perspective toggle visual design
- [ ] Add color-coded borders/themes per perspective
- [ ] Show/hide Shareholder toggle based on relationship type
- [ ] Add explanatory text for each perspective
- [ ] Implement keyboard shortcuts (D/B/S/M)
- [ ] Add keyboard hint in tooltip/help modal
- [ ] Update all results components to use perspective colors
- [ ] Test perspective switching with various models
- [ ] Ensure state persists correctly

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

1. [ ] Review and approve this plan
2. [ ] Begin Phase 1: Perspective Toggle Enhancement
3. [ ] User testing after each phase
4. [ ] Iterate based on feedback
