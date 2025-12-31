# Revenue Model Calculator

A static web application for visualizing and comparing different software revenue models. Built as a single HTML file with embedded JavaScript and CSS for easy deployment on GitHub Pages.

## Overview

This tool helps analyze and visualize 20 different software revenue models through interactive charts and calculations. Perfect for founders, product managers, and finance teams exploring different pricing strategies.

## Features

- **20 Revenue Models**: From subscription to usage-based, freemium to enterprise licensing
- **Triple Calculator Modes**:
  - **Vendor Mode** (Forward): Input parameters → Calculate revenue projections
  - **Growth Mode** (Reverse): Set revenue target → Calculate required inputs
  - **Client Mode** (Budget): Enter budget → Find optimal pricing options
- **Dual Input Views**:
  - **Form View**: Guided input fields with hints and category-specific defaults
  - **Table View**: Quick table-based editing with side-by-side model comparison
- **Scenario Planning**: Generate multiple alternative scenarios to reach your targets
- **Budget Optimization**: Find the best pricing plan within your budget constraints
- **Interactive Charts**: Real-time visualization using ApexCharts
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
- **JavaScript** - Calculation engine and interactivity
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

1. **Select Category & Models**: Choose your software category and one or more revenue models
2. **Choose Input View**:
   - **Form View** (Default): Guided fields with hints and category-specific defaults - ideal for beginners
   - **Table View**: Spreadsheet-style editing - ideal for power users and comparing multiple models
3. **Enter Parameters**: Adjust values using either view (changes sync automatically)
4. **Calculate & Visualize**: View real-time calculations and interactive charts
5. **Compare Models**: Switch between selected models or view side-by-side in table view

#### Using Table View

The table view provides a streamlined interface for efficient parameter editing:

**Single Model Table:**
- Displays all parameters in a structured table format
- Columns: Parameter | Value | Unit | Description
- Quickly scan all inputs at once
- Copy-paste values from spreadsheets

**Multi-Model Comparison Table:**
- Side-by-side parameter comparison across all selected models
- Easily identify which parameters differ between models
- Edit multiple model inputs without switching tabs
- Highlights parameters not applicable to certain models (N/A)

**When to Use Table View:**
- Comparing multiple revenue models
- Bulk parameter adjustments
- Importing values from external sources (Excel, Google Sheets)
- Quick scanning of all model inputs

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

1. **Select Mode**: Click the "Client" button at the top
2. **Choose Category & Models**: Select your software category and one or more pricing models to explore
3. **Set Your Budget**:
   - Enter your monthly budget (how much you can spend)
   - Choose budget flexibility (strict, moderate ±10%, flexible ±20%)
4. **Choose Priority**: Select what's most important to you:
   - **Maximum Users/Capacity**: Get the most seats/users/storage
   - **Best Value**: Optimize for lowest cost per unit
   - **Premium Features**: Get the best tier/features
   - **Budget Conscious**: Leave a buffer (uses ~80% of budget)
5. **Set Requirements** (optional): Expand "Advanced" to set minimum requirements (e.g., "at least 20 users")
6. **Calculate**: Click "Calculate & Compare"
7. **Review Options**:
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
├── app.js              # Application logic & calculations
├── styles.css          # Custom styles
├── README.md           # This file
├── claude.md           # Detailed project specification
└── .gitignore          # Git ignore rules
```

## Performance

- **Page Load**: < 1 second
- **Model Switch**: < 100ms
- **Calculation + Chart**: < 200ms
- **Input to Update**: < 300ms
- **Total File Size**: < 200 KB

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

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
