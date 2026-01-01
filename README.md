# Revenue Model Calculator

A static web application for visualizing and comparing different software revenue models. Built with a modular ES6 JavaScript architecture for easy deployment on GitHub Pages - no backend or build process required.

## Overview

This tool helps analyze and visualize 20 different software revenue models through interactive charts and calculations. Perfect for founders, product managers, and finance teams exploring different pricing strategies.

## Features

- **20 Revenue Models**: From subscription to usage-based, freemium to enterprise licensing
- **Four Calculator Modes**:
  - **Vendor Mode** (Forward): Input parameters → Calculate revenue projections
  - **Growth Mode** (Reverse): Set revenue target → Calculate required inputs
  - **Client Mode** (Budget): Enter budget → Find optimal pricing options
  - **Admin Mode**: Edit default parameters for all 20 models in one centralized view
- **Scenario Planning**: Generate multiple alternative scenarios to reach your targets
- **Budget Optimization**: Find the best pricing plan within your budget constraints
- **Interactive Charts**: Real-time visualization using ApexCharts
- **Calculation Transparency**:
  - **Clickable Tooltips**: Interactive info icons (ⓘ) on all inputs and metrics with detailed explanations
  - **Formula Display**: View calculation methodology and formulas for each revenue model
  - **Variables Summary**: See all input values used in calculations at a glance
  - **Flexible Validation**: Support for zero values in appropriate scenarios (e.g., existing customer base, no new acquisitions)
- **No Installation**: Runs entirely in the browser, no backend required
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Fast Performance**: Sub-second page loads, instant calculations

## Revenue Models Included

1. One-Time Purchase (Perpetual License)
2. Subscription (SaaS)
3. Freemium
4. Usage-Based (Consumption)
5. Tiered Pricing
6. Per-Seat/Per-User
7. Credits/Token System
8. Time and Materials (Hourly)
9. Fixed-Price Projects
10. Retainer Agreements
11. Managed Services
12. Outcome-Based/Milestone
13. Open Core
14. Marketplace/Platform Fee
15. Revenue Share
16. Enterprise License Agreement (ELA)
17. Pay-Per-Transaction
18. Advertising Supported
19. Data Licensing
20. White Label/OEM

## Technology Stack

- **HTML5** - Structure and content
- **ES6 JavaScript** - Modular architecture (16 modules across 7 directories)
- **Tailwind CSS** - Styling via Play CDN
- **ApexCharts** - Data visualization
- **GitHub Pages** - Hosting (free HTTPS included)

## Getting Started

### View Live Demo

Once deployed, the calculator will be available at: `https://[username].github.io/model-pear`

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/[username]/model-pear.git
   cd model-pear
   ```

2. Open `index.html` in your browser:
   ```bash
   # macOS
   open index.html

   # Linux
   xdg-open index.html

   # Windows
   start index.html
   ```

That's it! No build process or dependencies to install.

## Usage

### Vendor Mode - Forward Calculator (Revenue Projection)

**Use this mode when:** You're a vendor/business wanting to project your revenue based on pricing and growth assumptions.

1. **Select Category**: Choose your software category
2. **Choose Selection Mode**:
   - Check "Compare multiple models" to analyze multiple pricing models side-by-side
   - Leave unchecked to focus on a single model
3. **Select Models**: Pick one or more revenue models (depending on your selection mode)
4. **Enter Parameters**: Adjust values using the guided input form with hints and category-specific defaults
5. **Calculate & Visualize**: View real-time calculations and interactive charts
6. **Compare Models**: Switch between selected models using tabs (when multiple models selected)

### Growth Mode - Reverse Calculator (Target Planning)

**Use this mode when:** You're a vendor/business with a revenue target and want to know what inputs are needed to achieve it.

The reverse calculator helps you answer questions like: "What price should I charge to reach R100,000/month in 24 months?"

1. **Select Mode**: Click the "Growth" button at the top
2. **Choose Category & Model**: Select your software category and one revenue model
3. **Set Your Target**:
   - Enter your target monthly revenue (MRR)
   - Choose by which month you want to achieve it (1-60 months)
4. **Select Variable to Solve**: Choose which input variable to calculate (e.g., "New Customers per Month", "Monthly Price")
5. **Set Constraints** (optional): Expand "Advanced" to set fixed values for other variables
6. **Calculate**: Click "Calculate & Compare"
7. **Review Results**:
   - See the required value to hit your target
   - View 3 alternative scenarios (Recommended, Optimistic, Conservative)
   - See full projections, charts, and metrics

**Example Use Cases:**
- "How many customers do I need to acquire monthly to reach R50,000 MRR?"
- "What should my pricing be to hit R100,000 MRR in 18 months?"
- "With a 5% churn rate, how many new users do I need for R200,000 MRR?"

### Client Mode - Budget Calculator (Pricing Options Finder)

**Use this mode when:** You're a client/buyer with a budget and want to see what pricing options are available within your constraints.

The client budget calculator helps you answer questions like: "What can I get for R10,000/month?" or "Which plan gives me the most users within my budget?"

**Now supports budgets from R100 to R10M+** with dynamic scaling for accurate results at any budget level.

1. **Select Mode**: Click the "Client" button at the top
2. **Choose Category**: Select your software category
3. **Choose Selection Mode**:
   - Check "Compare multiple models" to see options across different pricing models
   - Leave unchecked to focus on a single pricing model
4. **Select Models**: Pick one or more pricing models to explore (depending on your selection mode)
5. **Set Your Budget**:
   - Enter your monthly budget (how much you can spend)
   - Choose budget flexibility (strict, moderate ±10%, flexible ±20%)
6. **Choose Priority**: Select what's most important to you:
   - **Maximum Users/Capacity**: Get the most seats/users/storage
   - **Best Value**: Optimize for lowest cost per unit
   - **Premium Features**: Get the best tier/features
   - **Budget Conscious**: Leave a buffer (uses ~80% of budget)
7. **Set Requirements** (optional): Expand "Advanced" to set minimum requirements (e.g., "at least 20 users")
8. **Calculate**: Click "Calculate & Compare"
9. **Review Options**:
   - See 3-6 different pricing configurations within your budget
   - Compare monthly cost, capacity, and value metrics
   - View budget utilization and remaining buffer
   - Explore configuration details for each option

**Example Use Cases:**
- "I have R15,000/month. Which SaaS plan gets me the most users?"
- "Show me all pricing options between R8,000-R12,000/month"
- "What's the best value plan for my R20,000 budget?"
- "I need at least 50 users. What options are within R25,000/month?"

**Understanding the Results:**
- 🟢 **Green badge** = Within budget
- 🟡 **Yellow badge** = Within your flexibility range (e.g., budget + 10%)
- 🔴 **Red badge** = Over budget (only shown if no options found within budget)

Each option shows:
- **Monthly cost** and budget utilization percentage
- **Capacity** (users, seats, storage, etc.)
- **Cost per unit** for value comparison
- **Budget buffer** (remaining budget if you choose this option)
- **Configuration details** (expand to see all parameters)

### Admin Mode - Model Configuration Editor

**Use this mode when:** You want to customize default parameters across all revenue models or need a centralized view to manage model configurations.

The admin panel provides a comprehensive spreadsheet-style interface for editing all 20 revenue models simultaneously.

1. **Select Mode**: Click the "⚙️ Admin" button at the top
2. **View All Models**: See all 20 revenue models in a side-by-side table
3. **Edit Parameters**:
   - Each row represents a parameter (Price, Customers, Churn, etc.)
   - Each column represents a revenue model
   - Edit any value directly in the table
4. **Real-time Updates**: Changes immediately update model defaults
5. **Return to Calculator**: Switch back to Vendor/Growth/Client mode to use the updated values

**Features:**
- **Centralized Configuration**: Edit all model defaults in one place
- **Side-by-side Comparison**: Easily compare parameter values across models
- **Horizontal Scrolling**: Navigate through all 20 models
- **Parameter Tooltips**: Hover over inputs to see descriptions
- **Sticky Headers**: Parameter names and model names stay visible while scrolling
- **N/A Indicators**: Clearly shows which parameters don't apply to specific models

**Use Cases:**
- Customizing default values for your specific industry or market
- Batch updating parameters across multiple models
- Comparing default assumptions across different pricing strategies
- Setting up consistent baseline values for team analysis
- Quick auditing of all model parameters

**Example Scenarios:**
- "Update all churn rates to match my industry benchmarks"
- "Set all pricing to my local currency defaults"
- "Review and adjust acquisition costs across all models"
- "Compare subscription vs usage-based default configurations"

## Interactive Help & Tooltips

The calculator includes comprehensive interactive help throughout the interface:

### Clickable Information Icons (ⓘ)

Look for blue info icons throughout the interface - click them to open detailed explanations:

1. **Input Fields**: Each input parameter has an info icon that displays:
   - Detailed explanation of the parameter
   - How it affects the calculation
   - Typical ranges and benchmarks
   - Context within the revenue model

2. **Metric Cards**: Results and metrics have info icons showing:
   - Clear explanation of what the metric means
   - How it's calculated
   - Interpretation guidelines (e.g., what's a "good" LTV:CAC ratio)
   - Industry benchmarks

3. **Model Information**: Click the info icon next to model names to see:
   - Revenue model description
   - Calculation formula
   - Step-by-step methodology
   - Key metrics tracked
   - Common use cases

### Variables Summary Panel

After running calculations, you'll see an "Input Variables Used" panel that shows:
- All input values used in the calculation
- Formatted and labeled for easy reference
- Clickable info icons for each variable
- Organized by model when comparing multiple models

This transparency ensures you can always verify what assumptions went into your calculations.

### Zero Values Support

The calculator now intelligently handles zero values in scenarios where they make sense:
- **Allowed**: Starting customer base = 0 (new business), New customers = 0 (existing base only), Expansion rate = 0 (no upsells)
- **Warning**: Zero values that might indicate an issue (e.g., no acquisition and no existing customers)
- **Error**: Zero values that don't make sense (e.g., pricing = 0 for paid products)

This flexibility allows modeling realistic scenarios like focusing purely on existing customers or launching with a current user base.

## Deployment

### GitHub Pages

1. Push changes to the main branch
2. Go to repository Settings > Pages
3. Set source to "Deploy from branch: main"
4. Site will be live at `https://[username].github.io/model-pear`

Changes deploy automatically within 2-3 minutes of pushing to the main branch.

## Project Structure

```
model-pear/
├── index.html          # Main HTML structure
├── app.js              # Main orchestrator (imports all modules)
├── styles.css          # Custom styles
├── config/
│   └── constants.js    # Configuration and global state
├── framework/
│   ├── categories.js   # Layer 1: Core function categories
│   ├── delivery.js     # Layer 2: Delivery mechanisms
│   ├── services.js     # Layer 3: Service models
│   └── model-families.js # Model family groupings
├── models/
│   └── index.js        # All 20 revenue model definitions
├── utils/
│   └── index.js        # Utility functions (formatting, validation, etc.)
├── charts/
│   └── index.js        # Chart rendering with ApexCharts
├── calculators/
│   ├── engine.js       # Core calculation engine
│   └── client-budget.js # Client budget calculator
├── ui/
│   ├── forms.js        # Dynamic form generation
│   ├── events.js       # Event handlers
│   ├── initialization.js # App initialization logic
│   ├── admin.js        # Admin panel functionality
│   └── modals.js       # Tooltip and modal functions
├── README.md           # This file
├── claude.md           # Detailed project specification
└── .gitignore          # Git ignore rules
```

### Modular Architecture

The codebase has been refactored from a single monolithic app.js file (6,377 lines) into a modular architecture:

**Benefits:**
- **Better Maintainability**: Each module has a single, clear responsibility
- **Easier Testing**: Individual modules can be unit tested independently
- **Improved Developer Experience**: Navigate to specific functionality quickly
- **Reduced Cognitive Load**: Work on one concern at a time
- **Scalability**: Adding new models or features is straightforward

**Module Organization:**
- **config/**: Global configuration and application state
- **framework/**: Three-layer framework (categories, delivery, services)
- **models/**: Revenue model definitions with calculation logic
- **utils/**: Shared utility functions for formatting, validation, calculations
- **charts/**: Visualization logic with ApexCharts
- **calculators/**: Calculation engines (forward, reverse, client budget)
- **ui/**: User interface logic (forms, events, initialization)

## Performance

- **Page Load**: < 1 second
- **Model Switch**: < 100ms
- **Calculation + Chart**: < 200ms
- **Input to Update**: < 300ms
- **Total File Size**: < 200 KB

## Browser Support

Requires modern browsers with ES6 module support:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Changelog

### January 2026 - Modular Architecture Refactoring

#### Major Refactoring
- **Modular Code Structure**: Refactored monolithic app.js (6,377 lines) into organized modules
  - Extracted code into 7 directories with 12 specialized modules
  - Improved maintainability and developer experience
  - Each module has a single, clear responsibility
  - Enables independent unit testing of modules

#### Architecture Changes
- **config/**: Centralized configuration and global state management
- **framework/**: Three-layer framework (categories, delivery, services, model families)
- **models/**: All 20 revenue model definitions with calculation logic
- **utils/**: Utility functions (formatting, validation, calculations, scenarios)
- **charts/**: Chart rendering logic with ApexCharts integration
- **calculators/**: Calculation engines (forward, reverse, client budget)
- **ui/**: User interface logic (forms, events, initialization, admin, modals)
- **app.js**: Main orchestrator that imports and coordinates all modules

#### Technical Details
- Implemented ES6 module system with proper imports/exports
- Resolved circular dependencies using dependency injection pattern
- Maintained backward compatibility with existing HTML
- Created clean separation of concerns across modules
- Reduced cognitive load from 6,377-line file to focused modules
- Updated index.html to load app.js as ES6 module

#### Benefits
- **96% reduction** in main file size (6,377 lines → 243 lines orchestrator)
- Better maintainability and code navigation
- Easier to add new revenue models or features
- Individual modules can be tested independently
- Improved scalability for future development

### January 2026 - Budget Calculations & Model Selection Improvements

#### Fixed
- **Large Budget Support**: Fixed issue where budgets above R1M would show "no options in budget"
  - Replaced hardcoded capacity limits (10k, 1k, 500) with dynamic scaling based on budget size
  - Maximum capacity now scales up to 1M users for very large budgets
  - Best value and conservative searches now use adaptive step sizes for better performance
- **Capacity Detection**: Improved model input detection to catch more capacity-related fields
  - Now recognizes `startingCustomers`, `freeUsers`, `paidUsers`, `newCustomers`, etc.
  - Case-insensitive keyword matching for broader compatibility
  - Added `findCapacityInput()` helper function for consistent detection across all budget strategies

#### New Features
- **Flexible Model Selection**: Added toggle to switch between single and multiple model selection
  - Check "Compare multiple models" to select multiple models (checkboxes)
  - Uncheck to select only one model (radio buttons)
  - Automatically switches UI between radio buttons and checkboxes
  - Preserves selections when toggling modes

#### Improved
- **Budget Calculator Performance**: Adaptive step sizes reduce calculation time for large budgets
- **Budget Flexibility**: All three pricing strategies (max capacity, best value, budget conscious) now support budgets from R100 to R10M+

#### Technical Details
- Added `findCapacityInput()` function with expanded keyword list and case-insensitive matching
- Added `calculateCapacityLimit()` function to dynamically scale search limits based on budget
- Updated `findMaximumCapacity()` to support up to 1M capacity with binary search
- Updated `findBestValue()` with adaptive step sizes (up to 50k capacity)
- Updated `findConservativeOption()` with dynamic limits (up to 25k capacity)
- Enhanced `generateModelCheckboxes()` to switch between radio and checkbox input types
- Modified `onModelSelectionChange()` to handle both radio and checkbox selection logic
- Added `onCompareMultipleToggle()` event handler to regenerate model selector on toggle

### January 2026 - Bug Fixes & UX Improvements

#### Fixed
- **Client Budget Calculator**: Budget options now update correctly when models are selected/deselected in Client Mode
- **Section Visibility**: Eliminated empty sections that appeared after switching between modes or running calculations
- **Dynamic Elements Cleanup**: Executive summaries and variable summaries are now properly removed when switching contexts

#### Improved
- **Chart Descriptions**: Added contextual subtitles to all major charts explaining what each visualization shows
- **Tooltip Clarity**: Info icons (ⓘ) now only appear on complex inputs, reducing visual clutter
- **Code Quality**: Removed 50+ lines of redundant code by centralizing panel visibility management

#### Technical Details
- Created `hideAllResultPanels()` function for centralized UI state management
- Enhanced `onModelSelectionChange()` to update budget and reverse calculator options dynamically
- Made tooltip display conditional based on hint complexity and keywords
- Added `subtitle` configuration to ApexCharts for better chart context

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Questions or Issues?

- Review the detailed specification in `claude.md`
- Open an issue on GitHub
- Check the inline code comments in `index.html`

---

Built with ❤️ for the developer community
