# Revenue Model Calculator

A static web application for visualizing and comparing different software revenue models. Built as a single HTML file with embedded JavaScript and CSS for easy deployment on GitHub Pages.

## Overview

This tool helps analyze and visualize 20 different software revenue models through interactive charts and calculations. Perfect for founders, product managers, and finance teams exploring different pricing strategies.

## Features

- **20 Revenue Models**: From subscription to usage-based, freemium to enterprise licensing
- **Dual Calculator Modes**:
  - **Forward Mode**: Input parameters → Calculate revenue projections
  - **Reverse Mode**: Set revenue target → Calculate required inputs
- **Scenario Planning**: Generate multiple alternative scenarios to reach your targets
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

### Forward Calculator (Traditional Mode)

1. Select a revenue model from the dropdown menu
2. Enter your parameters (or use the provided defaults)
3. View real-time calculations and charts
4. Export charts as PNG images
5. Switch between models to compare approaches

### Reverse Calculator (Goal-Oriented Mode)

The reverse calculator helps you answer questions like: "What price should I charge to reach R100,000/month in 24 months?"

1. **Select Mode**: Click the "Reverse" button at the top
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
