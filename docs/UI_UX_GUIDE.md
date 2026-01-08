# UI/UX Guide - Pricing Equilibrium Calculator

This guide documents all the user interface and user experience features of the Pricing Equilibrium Calculator, including accessibility, keyboard shortcuts, and design patterns.

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

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Calculate equilibrium |
| `Esc` | Close modal dialogs |
| `Tab` | Navigate between form fields |
| `?` | Show keyboard shortcuts help |

### How to Use

1. Press `?` anywhere in the application to view all available shortcuts
2. Use `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac) to quickly calculate
3. Press `Esc` to dismiss any open modal or dialog

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

The Inter-Company tool uses a progressive disclosure wizard for model selection:

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
<button class="bg-blue-600 hover:bg-blue-700">
    Calculate Equilibrium
</button>
```

#### Loading State
```html
<button disabled class="opacity-75 cursor-not-allowed">
    <svg class="animate-spin"><!-- Loading spinner --></svg>
</button>
```

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

### Color Palette

#### Semantic Colors
- **Blue** (#3B82F6): Primary actions, selected states, focus indicators
- **Green** (#10B981): Success, positive metrics
- **Yellow** (#F59E0B): Warnings, calculated fields
- **Red** (#EF4444): Errors, negative metrics
- **Purple** (#8B5CF6): Secondary/tertiary information

#### Background Colors
- **Gray-900** (#111827): Page background
- **Gray-800** (#1F2937): Card backgrounds
- **Gray-750** (#2d3748): Nested cards
- **Gray-700** (#374151): Input backgrounds

### Typography

#### Font Family
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

#### Scale
- **H1**: 3xl (1.875rem / 30px) - Page title
- **H2**: 2xl (1.5rem / 24px) - Section headings
- **H3**: lg (1.125rem / 18px) - Subsection headings
- **Body**: sm (0.875rem / 14px) - Regular text
- **Hint**: xs (0.75rem / 12px) - Helper text

### Spacing

Consistent spacing scale using Tailwind's spacing system:
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

### Animations

#### Slide-In (Validation Warnings)
```css
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

#### Fade-In (Results)
```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
```

#### Slide-In-Right (Toasts)
```css
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
```

### Component Patterns

#### Cards
```css
.card {
    background: #1F2937;
    border: 1px solid #374151;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
```

#### Buttons
```css
.button-primary {
    background: #3B82F6;  /* blue-600 */
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    font-weight: 600;
    transition: background-color 0.2s;
}

.button-primary:hover {
    background: #2563EB;  /* blue-700 */
}
```

#### Inputs
```css
.input {
    background: #374151;
    border: 1px solid #4B5563;
    color: #F3F4F6;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
}

.input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
```

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

## Future Enhancements

Planned UI/UX improvements:

1. **Dark/Light Mode Toggle**: User preference for theme
2. **Hover Tooltips**: Show info on hover (in addition to click)
3. **Undo/Redo**: History navigation for inputs
4. **Save/Load**: Local storage for calculation sessions
5. **Export**: PDF/CSV export of results
6. **Guided Tour**: First-time user walkthrough

---

## Getting Help

### Keyboard Shortcuts
Press `?` anywhere to view all keyboard shortcuts

### Tooltips & Help Icons

The application features a comprehensive tooltip system with `?` help icons throughout:

**Where to Find Help Icons**:
- **Mode Switcher**: Click `?` next to "Inter-Company Tool" or "Pricing Calculator" buttons
- **Pricing Models**: Each model button (Subscription, Usage-Based, etc.) has a `?` icon
- **Calculator Tabs**: All 5 tabs (Calculator, Compliance, Visualizations, Sensitivity, Projections) have help icons
- **Selection Mode**: Wizard and Direct mode buttons include tooltips
- **Input Fields**: Every form input has a `?` button for detailed field explanations

**Tooltip Content Includes**:
- Detailed explanation of the feature/field
- Key metrics or values tracked
- Common use cases
- Formulas (for pricing models)
- Best practices

**How to Use**:
1. Click any `?` icon to open a modal with detailed information
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

### Version 2.3 (2026-01-08)

#### Changed
- **Default Mode**: Inter-Company Tool is now the default mode (previously Pricing Calculator)
- **Tab Order**: Mode switcher tabs reordered with Inter-Company first

#### Added
- **Comprehensive Tooltip System**: Added help icons (`?`) with detailed modal explanations:
  - Mode switcher buttons explain each tool's purpose
  - All 5 pricing models have tooltips with formulas, key metrics, and use cases
  - All 5 intercompany calculator tabs have tooltips explaining their function
  - Wizard/Direct mode toggle buttons have help explanations
  - All form input fields have clickable help icons opening detailed modals
- **Help Icon Styling**: New CSS styles for help icons with hover effects and accessibility

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

*Last updated: 2026-01-08*
