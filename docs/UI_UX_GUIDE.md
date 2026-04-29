# UI/UX Guide - Software Transaction Structuring Tool

This guide documents all the user interface and user experience features of the Software Transaction Structuring Tool, including accessibility, keyboard shortcuts, and design patterns.

## Table of Contents

1. [Accessibility Features](#accessibility-features)
2. [Keyboard Shortcuts](#keyboard-shortcuts)
3. [Mobile Optimizations](#mobile-optimizations)
4. [Form Interactions](#form-interactions)
5. [Visual Feedback](#visual-feedback)
6. [Loading States](#loading-states)
7. [Validation & Error Handling](#validation--error-handling)
8. [Design System](#design-system)

---

## Accessibility Features

### ARIA Attributes

The calculator implements comprehensive ARIA attributes for screen reader support:

- **Modal Dialogs**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Form Inputs**: `aria-describedby`, `aria-required`, `aria-invalid`
- **Live Regions**: `aria-live="polite"` for toast notifications and validation feedback
- **Button Labels**: `aria-label` for icon-only buttons

### Keyboard Navigation

- **Tab Navigation**: All interactive elements are keyboard accessible
- **Focus Management**: Visible focus indicators on all controls
- **Modal Focus Trap**: Focus automatically moves to modal when opened and returns to trigger element on close
- **ESC Key Support**: Close modals and dialogs with the Escape key

### Focus States

Enhanced focus indicators for better visibility:

```css
*:focus-visible {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
    border-radius: 4px;
}

button:focus-visible {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}
```

### Screen Reader Support

- Semantic HTML5 elements (`<header>`, `<main>`, `<footer>`)
- Proper heading hierarchy (H1 → H2 → H3)
- Descriptive labels for all form inputs
- Status messages announced via `role="status"` and `role="alert"`

---

## Keyboard Shortcuts

Power users can navigate the calculator using keyboard shortcuts:

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Calculate equilibrium |
| `Esc` | Close modal dialogs |
| `Tab` | Navigate between form fields |
| `?` | Show keyboard shortcuts help |

### Perspective Shortcuts (Inter-Company Tool)

| Shortcut | Action |
|----------|--------|
| `D` | Switch to Your Company perspective |
| `B` | Switch to Client perspective |
| `C` | Switch to Combined View perspective |

### How to Use

1. Use `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac) to quickly calculate
2. Press `Esc` to dismiss any open modal or dialog
3. Use `D`, `B`, `C` to quickly switch perspectives in results view

---

## Mobile Optimizations

### Responsive Design

The calculator uses a mobile-first approach with breakpoints at 1024px (lg):

- **Mobile (< 1024px)**: Single-column layout, stacked sections
- **Desktop (≥ 1024px)**: 3-column grid layout

### Touch-Friendly Features

#### Larger Touch Targets
```css
@media (max-width: 1024px) {
    .model-btn {
        min-height: 3.5rem;  /* 56px */
        padding: 1rem;
    }

    button {
        min-height: 2.75rem;  /* 44px - iOS minimum */
    }

    input, select {
        min-height: 2.75rem;
        font-size: 16px;  /* Prevents zoom on iOS */
    }
}
```

#### Sticky Calculate Button

On mobile devices, the calculate button stays visible at the bottom of the screen:

```css
#calculateBtnContainer {
    position: sticky;
    bottom: 0;
    background: linear-gradient(to top, #1F2937 80%, transparent);
    z-index: 10;
}
```

### Mobile-Specific Improvements

- Reduced padding for better space utilization
- Larger font sizes to prevent iOS zoom
- Sticky positioning for primary actions
- Smooth scroll behavior

---

## Form Interactions

### Structure Selection Wizard

The Transaction Structuring tool uses a progressive disclosure wizard for model selection:

#### Auto-Advancing Flow
- Questions are revealed one at a time as you answer
- Selecting an option automatically shows the next question
- No "Next" button needed - selections drive progress
- Smooth scroll animation to the next question

#### Answered Questions
- Answered questions collapse to a compact summary
- Shows checkmark (✓), question number, and selected answer
- "Change" button allows modification at any time
- Changing an answer clears subsequent answers for re-evaluation

#### Live Preview
- Top 3 recommendations update in real-time as you answer
- Shows match percentage and model name
- Helps users understand how their choices affect recommendations

#### Completion
- "See Recommendations" button appears after all questions answered
- Full recommendation details with rationale
- Variant selection within chosen model

### Collapsible Sections

Form inputs are organized into collapsible sections for better readability:

- **Pricing Inputs**: Current price and volume data
- **Seller Costs**: Cost structure and margin goals
- **Buyer Value**: Value delivered to customers

#### Interaction Pattern

- Click section header to expand/collapse
- Visual indicator (▼) rotates when section opens
- All sections open by default for first-time users
- Sections remember state during session

### Calculation Modes

The calculator supports multiple calculation modes:

1. **Forward Calculation**: Calculate metrics from inputs
2. **Reverse Calculation**: Auto-calculate missing values
3. **Pricing Strategy Selection**: Choose between minimum, balanced, or maximum pricing

### Dynamic Form Generation

Forms are generated dynamically based on the selected pricing model:

- **Model-specific inputs**: Each model shows only relevant fields
- **Auto-calculated fields**: Highlighted in yellow with "Auto-calculated" badge
- **Read-only states**: Calculated fields cannot be edited

---

## Visual Feedback

### Toast Notifications

Toast notifications appear in the top-right corner for temporary feedback:

#### Types
- **Success** (green): "Calculation completed successfully!"
- **Error** (red): "An error occurred during calculation"
- **Warning** (yellow): Field validation warnings
- **Info** (blue): General information and tips

#### Features
- Auto-dismiss after 4 seconds (configurable)
- Slide-in animation from right
- Dismissible with × button
- Non-blocking (doesn't prevent interaction)
- Accessible via `aria-live="polite"`

### Validation Indicators

Inline validation provides real-time feedback:

- **✓ Green border**: Valid input
- **⚠ Yellow border**: Warning (e.g., empty field)
- **✕ Red border**: Error (e.g., negative value, percentage > 100%)

### Empty State

Enhanced empty state with:
- Calculator icon (SVG)
- Clear heading: "Ready to Find Your Perfect Price?"
- Visual cards explaining seller floor, buyer ceiling, and equilibrium
- Keyboard shortcut tip

---

## Loading States

### Calculate Button States

#### Default State
```html
<button class="btn btn-primary">
    Calculate Equilibrium
</button>
```

#### Loading State
```html
<button class="btn btn-primary" disabled>
    <span class="loading loading-spinner"></span>
    Calculating…
</button>
```

DaisyUI's `loading loading-spinner` utility renders an inline spinner that
matches the active theme. The disabled state is handled natively by the
button element — no custom `opacity-75 cursor-not-allowed` needed (the
`.btn` class applies appropriate disabled styling automatically).

### Loading Flow

1. User clicks "Calculate Equilibrium"
2. Button becomes disabled with spinner
3. Calculation performs (with 100ms delay for UI update)
4. Results display
5. Button re-enables
6. Success toast appears

---

## Validation & Error Handling

### Inline Validation

Each input field validates on blur and input:

#### Validation Rules
- **Negative values**: Not allowed for any numeric input
- **Percentages**: Must be between 0-100%
- **Empty fields**: Warned but not blocked
- **Zero values**: Contextual warnings for specific models

#### Validation Messages

```html
<div class="error-message" role="alert">
    <span aria-hidden="true">✕</span>
    <span>Value cannot be negative</span>
</div>
```

### Model-Specific Validation

Business logic validation warns users of potential issues:

- **Subscription Model**: High churn without expansion
- **Freemium Model**: Low conversion rates (< 1%)
- **Usage-Based**: Zero customers or zero pricing
- **One-Time**: Zero units sold

### Validation Warning Display

Warnings appear above the calculate button with:
- Severity indicator (error/warning)
- Field name
- Clear message
- Helpful suggestion (💡)

Example:
```
⚠ churnRate: High churn (>15%) without expansion will cause declining revenue
💡 Reduce churn to <10% or increase expansion rate
```

---

## Design System

The project uses **Tailwind CSS v4 + DaisyUI v5** with the `emerald` (light)
and `dim` (dark) themes. There is no custom colour palette — the active
DaisyUI theme IS the brand. Components use DaisyUI semantic classes directly;
hardcoded hex codes are not permitted (the only documented exception is the
debug-pill warning fallback in `app.html`, which renders pre-framework).

### Color Tokens

DaisyUI exposes every theme colour as a CSS custom property, accessible via
Tailwind utilities:

#### Surfaces
- `bg-base-100` — primary page background
- `bg-base-200` — card / panel surface (one step elevated)
- `bg-base-300` — input fields, hover states, dividers

#### Text
- `text-base-content` — primary text (full opacity)
- `text-base-content/70` — secondary / muted text
- `text-base-content/60` — even more muted (hints, footer)

#### Brand
- `bg-primary` / `text-primary` / `border-primary` — primary actions, links, focus rings
- `bg-secondary` — secondary accent
- `bg-accent` — tertiary accent

#### Status
- `text-success` / `bg-success` — positive metrics, completion
- `text-warning` / `bg-warning` — warnings, calculated/auto fields
- `text-error` / `bg-error` — errors, negative metrics, validation failures
- `text-info` / `bg-info` — informational messages, tooltips

Each token resolves to the active theme's value at runtime. Switching themes
flips every token in lockstep — no per-component changes needed.

### Typography

#### Font Family
Set via `--font-sans` in `app.css` (`@theme` block):

```
"Figtree", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
"Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
```

Figtree is the brand display face (loaded from Google Fonts via `app.html`);
the rest is the conventional system-font fallback chain.

#### Scale
- **H1**: `text-3xl` (1.875rem / 30px) — page title
- **H2**: `text-2xl` (1.5rem / 24px) — section heading
- **H3**: `text-lg` (1.125rem / 18px) — subsection heading
- **Body**: `text-sm` (0.875rem / 14px) — regular text
- **Hint**: `text-xs` (0.75rem / 12px) — helper text

All headings get `font-semibold tracking-tight` from the `@layer base` block
in `app.css`.

### Spacing

Standard Tailwind spacing scale — no overrides:
- **xs**: 0.25rem (4px) — `p-1` / `gap-1`
- **sm**: 0.5rem (8px) — `p-2` / `gap-2`
- **md**: 1rem (16px) — `p-4` / `gap-4`
- **lg**: 1.5rem (24px) — `p-6` / `gap-6`
- **xl**: 2rem (32px) — `p-8` / `gap-8`

### Component Patterns

The project uses DaisyUI's component classes — do NOT introduce custom
`.button-primary` / `.card` CSS. Every styling primitive below is a stock
DaisyUI utility that picks up the active theme automatically.

#### Cards
```html
<div class="card bg-base-200 border border-base-300 p-6 space-y-4">
  <!-- content -->
</div>
```

`card` is DaisyUI's base; `bg-base-200 border border-base-300 p-6` is the
project's standard elevated-surface pattern. Use `space-y-4` for vertical
rhythm between children.

#### Buttons
```html
<!-- Primary -->
<button class="btn btn-primary">Calculate</button>

<!-- Secondary / outlined -->
<button class="btn btn-outline">Cancel</button>

<!-- Ghost / inline -->
<button class="btn btn-ghost btn-sm">Close</button>
```

Important: `btn-primary` / `btn-outline` are MODIFIERS — they require the
`.btn` base class for proper sizing, padding, and border-radius. Using
`btn-primary` alone (without `btn`) produces a primary-coloured but otherwise
unstyled element. svelte-check / ESLint won't catch this, but it's the most
common DaisyUI mistake — see the `branch-self-review` commit history for
12 instances that had to be retroactively fixed.

#### Inputs
```html
<input type="number" class="input" />
<select class="input">…</select>
```

DaisyUI's `.input` already inherits theme tokens — no custom background /
border / focus styles needed. Pair with `<label for="…">` to satisfy the
a11y rule (`svelte/a11y` flags unpaired labels).

### Animations

Single-property transitions are handled by Tailwind utilities (`transition-all
duration-200`, `transition-opacity`, etc.). The few keyframe animations
defined in the project live in component-scoped `<style>` blocks rather than
in global CSS — keeps each component self-contained.

The only global keyframe is DaisyUI's own (loading spinner, etc.). The
project itself does not register custom `@keyframes` in `app.css`.

`prefers-reduced-motion` is respected by Tailwind's transition utilities
automatically — no separate handling needed.

---

## Best Practices

### Performance

- **Debounced Inputs**: Input validation debounced at 300ms
- **Lazy Loading**: Charts only render when needed
- **Minimal Reflows**: Batch DOM updates
- **CSS Animations**: Hardware-accelerated transforms

### Accessibility

- **Color Contrast**: All text meets WCAG AA standards (4.5:1 minimum)
- **Not Color Alone**: Icons and text labels accompany color indicators
- **Keyboard First**: All features accessible via keyboard
- **Screen Reader Tested**: ARIA labels and live regions

### Mobile

- **Touch Targets**: Minimum 44×44px (iOS guidelines)
- **No Hover States**: Mobile-friendly interactions
- **Responsive Images**: SVG icons scale perfectly
- **Prevent Zoom**: 16px+ font sizes prevent unwanted zoom

### User Experience

- **Progressive Disclosure**: Collapsible sections reduce cognitive load
- **Inline Help**: Context-sensitive hints and tooltips
- **Instant Feedback**: Validation happens in real-time
- **Error Recovery**: Clear suggestions for fixing errors

---

## Browser Support

### Tested & Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features
- CSS Grid & Flexbox
- ES6 Modules
- CSS Custom Properties
- SVG Support

### Fallbacks
- `font-size: 16px` prevents iOS zoom
- System fonts for fast load
- Graceful degradation for animations

---

## Options Overview

The Options Overview provides a visual grid showing all 6 transaction models at a glance.

### Layout

```
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ 💼 Development       │  │ 📜 Licence           │  │ 🤝 Joint Dev         │
│    Services          │  │    with Royalties    │  │                      │
│                      │  │                      │  │                      │
│ [Key features...]    │  │ [Key features...]    │  │ [Key features...]    │
│ [Best for tags]      │  │ [Best for tags]      │  │ [Best for tags]      │
│                      │  │                      │  │                      │
│ [Select Model →]     │  │ [Select Model →]     │  │ [Select Model →]     │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

### Card Design

Each model card includes:
- **Icon**: Visual identifier (emoji)
- **Name**: Model name as header
- **Summary**: One-line description
- **Key Features**: 3-4 bullet points
- **Best For**: Tag badges showing ideal use cases
- **Footer**: IP ownership, payment type, and variant count
- **Action**: "Select Model →" button

### Quick Comparison Table

Below the cards, a compact table shows all models side-by-side with columns for:
- Model name
- IP ownership
- Payment type
- Asset recognition
- Risk profile

### View Mode Toggle

Three-way toggle for navigation preference:
- **Overview**: Visual grid (default)
- **Wizard**: Guided questions
- **Manual**: Dropdown selection

Toggle state persists in localStorage.

### Responsive Design

- **Desktop**: 3-column grid
- **Tablet**: 2-column grid
- **Mobile**: Single-column stack

---

## Compare Mode

Compare Mode allows saving and comparing calculation results.

### Save Modal

```
┌──────────────────────────────────────────────────────┐
│  Save as Option                              [×]     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Model: Development Services (1A)                    │
│                                                      │
│  Option Name:                                        │
│  ┌────────────────────────────────────────────────┐  │
│  │ Option A - Dev Services                        │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Notes (optional):                                   │
│  ┌────────────────────────────────────────────────┐  │
│  │ Assumptions: 10% margin, R2M dev cost          │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│                    [Cancel]  [Save Option]           │
└──────────────────────────────────────────────────────┘
```

### Save Actions Bar

Appears in results area after successful calculation:
- **Save as Option** button (always visible)
- Saved options count badge
- **View Saved** button (when 1+ saved)
- **Compare** button (when 2+ saved)

### Comparison Manager Panel

```
┌─────────────────────────────────────────────────────────────────┐
│  Saved Options                                          [×]     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☐  Option A - Dev Services              2h ago   [⋮]    │   │
│  │    Model 1A • Dev: R880K Rev • Buyer: R880K Cost        │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☐  Option B - Licence                   1d ago   [⋮]    │   │
│  │    Model 2A • Dev: R750K Rev • Buyer: R850K Cost        │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  [Compare Selected]  [Export JSON]  [Export CSV]  [Import]      │
├─────────────────────────────────────────────────────────────────┤
│  Storage: 2 of 20 options • 4.2 KB used                         │
└─────────────────────────────────────────────────────────────────┘
```

Features:
- Checkbox selection for comparison
- Relative timestamps
- Key metrics preview
- Actions menu (Load, Delete, Rename, Edit Notes)
- Export/Import buttons
- Storage info display

### Comparison View

```
┌──────────────────────────────────────────────────────────────────────┐
│  Compare Options                                             [×]     │
├────────────┬─────────────┬─────────────┬───────────────────────────┤
│  Metric    │  Option A   │  Option B   │  Difference               │
├────────────┼─────────────┼─────────────┼───────────────────────────┤
│  DEVELOPER │             │             │                           │
│  Revenue   │  R 880,000  │  R 750,000  │  -R 130,000 ▼             │
│  Profit    │  R 80,000   │  R 120,000  │  +R 40,000 ▲              │
├────────────┼─────────────┼─────────────┼───────────────────────────┤
│  BUYER     │             │             │                           │
│  Cost      │  R 880,000  │  R 850,000  │  -R 30,000 ▼              │
│  Asset     │  R 880,000  │  R 750,000  │  -R 130,000 ▼             │
└────────────┴─────────────┴─────────────┴───────────────────────────┘
│  Legend: [■ Best] [■ Worst]   [🖨️ Print/PDF] [Export JSON] [CSV]    │
└──────────────────────────────────────────────────────────────────────┘
```

Visual Indicators:
- **Green background**: Best value in row
- **Red background**: Worst value in row
- **▲ Arrow**: Higher than first option
- **▼ Arrow**: Lower than first option

### Storage

- Uses localStorage with key `model-pear-comparisons`
- Maximum 20 saved options
- Versioned format for future migrations
- Auto-persists on every change

---

## Future Enhancements

Planned UI/UX improvements:

1. **Dark/Light Mode Toggle**: User preference for theme
2. **Hover Tooltips**: Show info on hover (in addition to click)
3. **Undo/Redo**: History navigation for inputs
4. **Guided Tour**: First-time user walkthrough

**Recently Implemented:**
- ✅ **Save/Load**: Compare Mode with local storage for saved options
- ✅ **Export**: JSON and CSV export from Compare Mode
- ✅ **Options Overview**: Visual model selection grid
- ✅ **Print/PDF Export**: Print-friendly styles with browser Print-to-PDF support

---

## Getting Help

### Keyboard Shortcuts
Press `?` anywhere to view all keyboard shortcuts

### Tooltips & Help Icons

The application features a comprehensive tooltip system with info icons (`ⓘ`) throughout:

**Where to Find Help Icons**:
- **Mode Switcher**: Click the `ⓘ` icon next to "Inter-Company Tool" or "Pricing Calculator" buttons
- **Pricing Models**: Each model button (Subscription, Usage-Based, etc.) has an info icon
- **Calculator Tabs**: All 5 tabs (Calculator, Compliance, Charts, What-If, Projections) have help icons
- **Selection Mode**: Wizard and Manual mode buttons include tooltips
- **Input Fields**: Every form input has an info button for detailed field explanations

**Tooltip Content Includes**:
- Detailed explanation of the feature/field
- Key metrics or values tracked
- Common use cases
- Formulas (for pricing models)
- Best practices

**How to Use**:
1. Click any info icon (`ⓘ`) to open a modal with detailed information
2. Press `Esc` or click outside the modal to close
3. Inline hints (with 💡) below inputs provide quick reference

### Validation Help
Each error message includes a 💡 suggestion for how to fix it

### Documentation
- **Business Guide**: [BUSINESS_GUIDE.md](BUSINESS_GUIDE.md)
- **Technical Docs**: [CLAUDE.md](../CLAUDE.md)
- **Calculations**: [CALCULATIONS.md](CALCULATIONS.md)

---

## Changelog

### Version 2.6 (2026-01-09)

#### Changed
- **Terminology Standardization**: Unified terminology throughout the application
  - Perspectives now consistently use "Your Company", "Client", and "Combined View"
  - Removed "Net Effect"/"Shareholder" dual naming for clearer user experience
  - Input categories renamed to "Your Company Costs" and "Client Treatment"

- **Navigation Tab Improvements**:
  - Renamed "Visualizations" tab to "Charts" for clarity
  - Renamed "Sensitivity" tab to "What-If" for better user understanding
  - Changed Compliance tab emoji from ✓ to ⚖️

- **Selection Mode**: Renamed "Direct" mode to "Manual" mode

- **Model Cards**: Changed "Explore" button to "Select Model" for clearer action

- **Keyboard Shortcuts**:
  - Changed Combined View shortcut from `S` to `C`
  - Removed `M` shortcut for toggling mutual ownership (use UI toggle instead)

- **Tax Terminology**: Modernized Section 11(e) labels
  - "PC Software (2 years)" → "Standard Software (2-year write-off)"
  - "Mainframe Software (5 years)" → "Complex Systems (5-year write-off)"
  - Added clearer help text explaining when to use each option

- **Party Selector**: Improved wording for related/independent party selection
  - More user-friendly descriptions
  - Generic transfer pricing warning (not SA-specific)

### Version 2.5 (2026-01-09)

#### Added
- **Options Overview**: New default landing view showing all 6 models in a visual grid
  - Model cards with icon, summary, key features, and best-for tags
  - Quick comparison table showing all models side-by-side
  - "Select Model →" buttons to select models directly
  - Three-way mode toggle: Overview / Wizard / Manual
  - Mode preference persists in localStorage

- **Compare Mode**: Save and compare calculation results
  - "Save as Option" button in results area
  - Save modal with name and notes fields
  - Comparison Manager panel for viewing/managing saved options
  - Side-by-side comparison view for 2-4 options
  - Difference highlighting with best/worst indicators
  - Export to JSON and CSV
  - Import from JSON file
  - Storage info display (count, size, max limit)
  - Maximum 20 saved options in localStorage
  - **Print/PDF export**: Print button with print-friendly CSS styles
  - Comparison view formatted for A4 landscape PDF output

#### Changed
- Default view changed from Wizard to Options Overview
- Results area now shows save actions bar when results are available

### Version 2.4 (2026-01-09)

#### Added
- **Party Relationship Selector**: New prominent UI component for selecting party relationship type
  - Two options: "Independent Parties" (2 perspectives) or "Related Parties" (3 perspectives)
  - Visual radio cards with color-coded borders and selection indicators
  - Transfer pricing warning shown when Related Parties is selected

- **Enhanced Perspective Toggle**: Improved perspective switching experience
  - Header shows current mode (Independent/Related parties)
  - Description box updates with each perspective
  - Keyboard shortcut hints displayed in the UI

- **Perspective Keyboard Shortcuts**: New keyboard shortcuts for fast perspective switching
  - `D` - Switch to Your Company perspective
  - `B` - Switch to Client perspective
  - `C` - Switch to Combined View perspective

#### Changed
- **Entity Configuration**: Removed "Relationship Settings" section (moved to Party Relationship Selector)
- **Perspective Framework**: Clarified that perspectives are about the two/three parties in a transaction, not group accounting consolidation

### Version 2.3 (2026-01-08)

#### Changed
- **Default Mode**: Inter-Company Tool is now the default mode (previously Pricing Calculator)
- **Tab Order**: Mode switcher tabs reordered with Inter-Company first

#### Added
- **Comprehensive Tooltip System**: Added info icons (`ⓘ`) with detailed modal explanations:
  - Mode switcher buttons explain each tool's purpose
  - All 5 pricing models have tooltips with formulas, key metrics, and use cases
  - All 5 intercompany calculator tabs have tooltips explaining their function
  - Wizard/Direct mode toggle buttons have help explanations
  - All form input fields have clickable info icons opening detailed modals
- **Help Icon Styling**: New CSS styles for info icons with hover effects, borders, and shadows for visual distinction

### Version 2.2 (2026-01-08)

#### Improved
- **Main tab navigation**: Added `flex-wrap` to tab buttons so they stack properly on mobile devices with `min-w-[120px]` for consistent sizing
- **Structure Selection Wizard**: Converted from step-by-step wizard with Next/Previous buttons to progressive disclosure pattern
  - Questions now auto-advance when an option is selected (no more confusing Next button)
  - All answered questions remain visible in a compact format for easy review
  - Users can click "Change" on any answered question to modify their selection
  - Smooth scroll to next question after each selection
  - "See Recommendations" button appears only after all questions are answered
  - Live preview of top recommendations updates in real-time as questions are answered

### Version 2.1 (2025-01-07)

#### Improved
- **Calculate button styling**: Reverted to blue (`bg-blue-600`) for better visual prominence as the primary action
- **Mobile sticky gradient**: Fixed gradient background to use `gray-800` (#1F2937) instead of `gray-900` (#111827) to match card backgrounds and eliminate visual discontinuity
- The sticky container now seamlessly blends with the card color scheme while the blue button remains prominent

### Version 2.0 (2025-01-06)

#### Added
- ✅ Comprehensive accessibility (ARIA attributes, keyboard navigation)
- ✅ Keyboard shortcuts (Ctrl+Enter to calculate, ? for help)
- ✅ Toast notification system
- ✅ Inline input validation with real-time feedback
- ✅ Loading states with spinner animation
- ✅ Collapsible form sections
- ✅ Enhanced empty state with visual hierarchy
- ✅ Mobile-optimized sticky calculate button
- ✅ Larger touch targets for mobile (44px minimum)
- ✅ Improved focus states across all elements
- ✅ Icon-enhanced input hints

#### Improved
- Enhanced visual hierarchy with better spacing
- Better color contrast for accessibility
- Smoother animations and transitions
- Responsive design for mobile devices
- Form organization with progressive disclosure

#### Fixed
- iOS zoom prevention with 16px minimum font size
- Focus restoration after modal close
- ESC key support for modal dialogs
- Mobile calculate button visibility

---

*Last updated: 2026-01-09*
