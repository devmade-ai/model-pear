import { models } from '../models/index.js';
import { reverseCalculatorState } from '../config/constants.js';

// ========== UTILITY FUNCTIONS ==========

/**
 * Format currency value with proper decimals
 */
export function formatCurrency(value) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercentage(value) {
    return `${value.toFixed(1)}%`;
}

/**
 * Format large numbers with thousand separators
 */
export function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
}

/**
 * Validate input based on type
 */
export function validateInput(type, value) {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) return false;
    if (numValue < 0) return false;

    if (type === 'percent' && numValue > 100) return false;

    return true;
}

/**
 * Validate model inputs for potential issues
 */
export function validateModelInputs(modelKey, inputs) {
    const warnings = [];

    // Model-specific validation rules
    if (modelKey === 'subscription' || modelKey === 'per-seat' || modelKey === 'tiered') {
        // Allow zero newCustomers if there's a starting customer base
        if (inputs.newCustomers === 0 && (!inputs.startingCustomers || inputs.startingCustomers === 0)) {
            warnings.push({
                severity: 'warning',
                field: 'newCustomers',
                message: 'No new customers and no starting base - revenue will be zero',
                suggestion: 'Add either new customers or a starting customer base'
            });
        }

        if (inputs.churnRate && inputs.churnRate > 15 && (!inputs.expansionRate || inputs.expansionRate < 5)) {
            warnings.push({
                severity: 'warning',
                field: 'churnRate',
                message: 'High churn (>15%) without expansion will cause declining revenue',
                suggestion: 'Reduce churn to <10% or increase expansion rate'
            });
        }

        if (inputs.monthlyPrice && inputs.cac && inputs.monthlyPrice < inputs.cac / 12) {
            warnings.push({
                severity: 'warning',
                field: 'monthlyPrice',
                message: 'Monthly price is too low - CAC payback will exceed 1 year',
                suggestion: 'Increase price or reduce CAC'
            });
        }
    }

    if (modelKey === 'freemium') {
        if (inputs.conversionRate < 1) {
            warnings.push({
                severity: 'warning',
                field: 'conversionRate',
                message: 'Conversion rate <1% is very low for freemium models',
                suggestion: 'Typical freemium conversion: 2-5%'
            });
        }

        // Allow zero freeUsers as warning only
        if (inputs.freeUsers === 0) {
            warnings.push({
                severity: 'warning',
                field: 'freeUsers',
                message: 'Zero free users - freemium model requires user acquisition',
                suggestion: 'Try: 500-1000 free users/month or consider different model'
            });
        }
    }

    if (modelKey === 'usage-based') {
        // Price per unit = 0 is still an error (can't give away free service)
        if (inputs.pricePerUnit === 0) {
            warnings.push({
                severity: 'error',
                field: 'pricePerUnit',
                message: 'Price per unit must be > 0',
                suggestion: 'Set a minimum unit price'
            });
        }

        // Allow zero newCustomers if there's a starting customer base
        if (inputs.newCustomers === 0 && (!inputs.startingCustomers || inputs.startingCustomers === 0)) {
            warnings.push({
                severity: 'warning',
                field: 'newCustomers',
                message: 'No new customers and no starting base - revenue will be zero',
                suggestion: 'Add either new customers or a starting customer base'
            });
        }
    }

    if (modelKey === 'one-time') {
        // Allow zero unitsSold as warning
        if (inputs.unitsSold === 0) {
            warnings.push({
                severity: 'warning',
                field: 'unitsSold',
                message: 'Zero units sold - no revenue will be generated',
                suggestion: 'Try: 10-50 units/month'
            });
        }
    }

    return warnings;
}

/**
 * Display validation warnings
 */
export function displayValidationWarnings(warnings) {
    // Remove existing warnings
    const existingWarnings = document.getElementById('validation-warnings');
    if (existingWarnings) {
        existingWarnings.remove();
    }

    if (warnings.length === 0) return;

    // Create warnings container
    const warningsDiv = document.createElement('div');
    warningsDiv.id = 'validation-warnings';
    warningsDiv.className = 'mb-4 space-y-2';

    warnings.forEach(w => {
        const alertDiv = document.createElement('div');
        alertDiv.className = w.severity === 'error'
            ? 'p-3 bg-red-900 border border-red-700 rounded-md text-sm'
            : 'p-3 bg-yellow-900 border border-yellow-700 rounded-md text-sm';

        alertDiv.innerHTML = `
            <div class="font-semibold text-gray-100">${w.field ? w.field + ': ' : ''}${w.message}</div>
            <div class="text-xs text-gray-300 mt-1">💡 ${w.suggestion}</div>
        `;

        warningsDiv.appendChild(alertDiv);
    });

    // Insert warnings before calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.parentElement.insertBefore(warningsDiv, calculateBtn);
}

/**
 * Metric explanations and interpretations
 */
export const METRIC_EXPLANATIONS = {
    totalRevenue: {
        label: 'Total Revenue',
        explanation: 'Sum of all revenue over the forecast period',
        higherIsBetter: true,
        benchmark: 'Depends on business stage and market size'
    },
    finalMonthRevenue: {
        label: 'Final Month Revenue',
        explanation: 'Revenue in the last month of the forecast',
        higherIsBetter: true,
        benchmark: 'Indicates growth trajectory'
    },
    avgMonthlyGrowth: {
        label: 'Avg Monthly Growth',
        explanation: 'Average month-over-month revenue growth rate',
        higherIsBetter: true,
        interpretation: {
            '<5%': '⚠️ Slow growth',
            '5-15%': '✓ Good growth',
            '15-30%': '⭐ Strong growth',
            '>30%': '🚀 Exceptional growth'
        },
        benchmark: '10-20% monthly is typical for early stage SaaS'
    },
    estimatedLTV: {
        label: 'Estimated LTV',
        explanation: 'Customer Lifetime Value - total revenue expected from average customer',
        higherIsBetter: true,
        benchmark: 'Should be at least 3x CAC'
    },
    ltvCacRatio: {
        label: 'LTV:CAC Ratio',
        explanation: 'Lifetime Value to Customer Acquisition Cost ratio',
        higherIsBetter: true,
        interpretation: {
            '<1': '🔴 Unsustainable - losing money on each customer',
            '1-3': '🟡 Concerning - barely profitable',
            '3-5': '🟢 Good - healthy business',
            '>5': '🟢 Excellent - very profitable'
        },
        benchmark: '3:1 is considered healthy for SaaS businesses'
    },
    paybackPeriod: {
        label: 'CAC Payback Period',
        explanation: 'Months required to recover customer acquisition cost',
        higherIsBetter: false,
        interpretation: {
            '<6': '🟢 Excellent - fast payback',
            '6-12': '🟢 Good - acceptable for most SaaS',
            '12-18': '🟡 Concerning - need high retention',
            '>18': '🔴 Poor - requires significant capital'
        },
        benchmark: '6-12 months is typical for SaaS'
    }
};

/**
 * Calculation methodology explanations for each revenue model
 */
export const CALCULATION_EXPLANATIONS = {
    'one-time': {
        name: 'One-Time Purchase (Perpetual License)',
        description: 'Traditional software licensing model with upfront payment and optional recurring maintenance fees',
        formula: 'Revenue = (Units Sold × License Price) + (Total Customers × Maintenance Fee × Attach Rate)',
        methodology: 'Calculates revenue from new license sales each month plus recurring maintenance revenue from the accumulated customer base. Maintenance is charged as a percentage of the license price annually, prorated monthly.',
        keyMetrics: ['License Revenue', 'Maintenance Revenue', 'Total Customers'],
        useCases: 'Enterprise software, desktop applications, specialized tools with long usage cycles'
    },
    'subscription': {
        name: 'Subscription (SaaS)',
        description: 'Recurring revenue model with monthly or annual subscriptions',
        formula: 'MRR = (Customers × Price) + Expansion Revenue - Churned Revenue',
        methodology: 'Tracks Monthly Recurring Revenue (MRR) by adding new customer revenue, applying churn to existing customers, and factoring in expansion revenue from upsells. Customer count evolves based on new acquisitions minus churned customers.',
        keyMetrics: ['MRR', 'ARR', 'Customer Count', 'Churn Rate', 'Expansion Revenue'],
        useCases: 'Cloud software, SaaS products, membership services'
    },
    'freemium': {
        name: 'Freemium',
        description: 'Free tier with conversion to paid subscriptions over time',
        formula: 'Revenue = Paid Users × Price (Free users convert after delay)',
        methodology: 'Manages two user pools: free and paid. Free users are acquired monthly and convert to paid at a specified rate after a time delay. Both pools experience churn. Revenue comes only from paid users.',
        keyMetrics: ['Free Users', 'Paid Users', 'Conversion Rate', 'Revenue from Paid'],
        useCases: 'Consumer apps, developer tools, collaboration platforms'
    },
    'usage-based': {
        name: 'Usage-Based (Consumption)',
        description: 'Pay-per-use pricing based on consumption metrics',
        formula: 'Revenue = Total Usage × Price per Unit (Usage = Customers × Avg Usage)',
        methodology: 'Calculates revenue from total consumption across all customers. Usage per customer grows monthly, and customer count changes with new acquisitions and churn. Includes variance modeling for usage fluctuations.',
        keyMetrics: ['Total Usage', 'Revenue per Customer', 'Usage Growth'],
        useCases: 'Cloud infrastructure (AWS, Azure), APIs, data processing services'
    },
    'tiered': {
        name: 'Tiered Pricing',
        description: 'Multiple price tiers with customer movement between tiers',
        formula: 'Revenue = Σ(Customers in Each Tier × Tier Price)',
        methodology: 'Tracks customers across three tiers (Starter, Pro, Enterprise). Customers join at different tier distributions, can upgrade or downgrade monthly, and churn is applied to each tier. Revenue is the sum of all tier revenues.',
        keyMetrics: ['Customers per Tier', 'Upgrade Rate', 'Downgrade Rate', 'Blended ARPU'],
        useCases: 'SaaS with feature differentiation, productivity tools, team collaboration software'
    },
    'per-seat': {
        name: 'Per-Seat/Per-User',
        description: 'Pricing based on number of users or seats',
        formula: 'Revenue = Customers × Avg Seats per Customer × Price per Seat',
        methodology: 'Calculates revenue from total seats across all customers. Seat count per customer expands over time, customers churn monthly, and new customers are added. Revenue scales with both customer and seat growth.',
        keyMetrics: ['Total Seats', 'Seats per Customer', 'Seat Expansion Rate'],
        useCases: 'Team collaboration tools, HR software, project management platforms'
    },
    'retainer': {
        name: 'Retainer',
        description: 'Fixed monthly fee for ongoing services or access',
        formula: 'Revenue = Active Clients × Monthly Retainer Fee',
        methodology: 'Simple recurring model where clients pay a fixed monthly fee. New clients are added each month, existing clients may churn, resulting in predictable recurring revenue from active client count.',
        keyMetrics: ['Active Clients', 'Monthly Recurring Revenue', 'Client Retention'],
        useCases: 'Consulting services, managed services, support contracts'
    },
    'managed-services': {
        name: 'Managed Services',
        description: 'Full-service offering with base fee plus variable component',
        formula: 'Revenue = (Base Fee + Variable Fee) × Number of Clients',
        methodology: 'Combines a fixed base fee with variable charges based on service scope or resources. Client count grows with new acquisitions and decreases with churn. Revenue reflects total service value delivered.',
        keyMetrics: ['Client Count', 'Average Service Value', 'Service Margin'],
        useCases: 'IT managed services, DevOps management, infrastructure management'
    },
    'pay-per-transaction': {
        name: 'Pay-per-Transaction',
        description: 'Fee charged per transaction or event processed',
        formula: 'Revenue = Total Transactions × Fee per Transaction',
        methodology: 'Calculates revenue from transaction volume. Customers process transactions at an average monthly rate that grows over time. Customer count changes with acquisitions and churn.',
        keyMetrics: ['Transaction Volume', 'Transactions per Customer', 'Transaction Growth'],
        useCases: 'Payment processing, e-commerce platforms, API transactions'
    },
    'credits-token': {
        name: 'Credits/Token-Based',
        description: 'Pre-purchased credits consumed over time',
        formula: 'Revenue = Customers × Monthly Credits Purchased × Price per Credit',
        methodology: 'Customers purchase credits monthly which are consumed for usage. Tracks customer count with churn, credits purchased per customer, and recognizes revenue as credits are bought (not necessarily when used).',
        keyMetrics: ['Credits Sold', 'Credit Consumption Rate', 'Unused Credit Balance'],
        useCases: 'AI/ML APIs, rendering services, communication platforms'
    },
    'time-materials': {
        name: 'Time & Materials',
        description: 'Billing based on hours worked and materials used',
        formula: 'Revenue = (Billable Hours × Hourly Rate) + Materials Costs',
        methodology: 'Calculates revenue from billable time and direct costs. Tracks number of active projects, average monthly hours per project, and hourly rates. Revenue varies with project load and resource utilization.',
        keyMetrics: ['Billable Hours', 'Utilization Rate', 'Hourly Rate'],
        useCases: 'Consulting projects, custom development, professional services'
    },
    'fixed-price': {
        name: 'Fixed-Price Projects',
        description: 'Fixed fee for defined scope of work',
        formula: 'Revenue = Number of Projects × Average Project Value (recognized over duration)',
        methodology: 'Projects have fixed price and duration. Revenue is recognized proportionally over project timeline. New projects start monthly, completed projects roll off. Models project pipeline and revenue recognition.',
        keyMetrics: ['Active Projects', 'Project Value', 'Project Duration'],
        useCases: 'Custom software development, implementation projects, design work'
    },
    'outcome-based': {
        name: 'Outcome-Based Pricing',
        description: 'Payment tied to results or performance metrics',
        formula: 'Revenue = Base Fee + (Performance Achieved × Success Rate × Performance Fee)',
        methodology: 'Combines base fees with performance-based payments. Success rate determines percentage of clients achieving targets. Revenue includes guaranteed base plus variable performance bonuses.',
        keyMetrics: ['Success Rate', 'Performance Fees', 'Client Outcomes'],
        useCases: 'Marketing services, recruitment, performance consulting'
    },
    'open-core': {
        name: 'Open Core',
        description: 'Free open-source core with paid premium features',
        formula: 'Revenue = Enterprise Users × Enterprise Price',
        methodology: 'Free open-source users adopt the core product, with a percentage converting to paid enterprise licenses for premium features. Tracks both free and paid users separately with different conversion and churn dynamics.',
        keyMetrics: ['Community Users', 'Enterprise Conversion Rate', 'Enterprise Revenue'],
        useCases: 'Developer tools, databases, infrastructure software'
    },
    'marketplace': {
        name: 'Marketplace/Platform',
        description: 'Commission on transactions between buyers and sellers',
        formula: 'Revenue = Transaction Volume × Commission Rate',
        methodology: 'Facilitates transactions between parties and takes a commission. Tracks total marketplace volume, number of active participants, and applies commission rate to calculate platform revenue.',
        keyMetrics: ['Gross Marketplace Volume (GMV)', 'Take Rate', 'Active Participants'],
        useCases: 'App stores, freelance platforms, B2B marketplaces'
    },
    'revenue-share': {
        name: 'Revenue Share',
        description: 'Percentage of partner or customer revenue',
        formula: 'Revenue = Partner Revenue × Revenue Share Percentage',
        methodology: 'Partners generate revenue and share a percentage with the platform. Tracks number of partners, their average revenue, and applies revenue share percentage. Partner revenue can grow over time.',
        keyMetrics: ['Number of Partners', 'Partner Revenue', 'Revenue Share %'],
        useCases: 'Reseller programs, affiliate networks, OEM partnerships'
    },
    'advertising': {
        name: 'Advertising-Based',
        description: 'Revenue from displaying ads to users',
        formula: 'Revenue = Impressions × CPM / 1000 (or Clicks × CPC)',
        methodology: 'Generates revenue from ad impressions or clicks. Tracks user base growth, engagement levels, and ad rates (CPM or CPC). Revenue scales with user count and engagement.',
        keyMetrics: ['Active Users', 'Impressions/User', 'CPM or CPC'],
        useCases: 'Social media, content platforms, mobile apps'
    },
    'ela': {
        name: 'Enterprise License Agreement (ELA)',
        description: 'Large enterprise contracts with unlimited usage',
        formula: 'Revenue = Number of Accounts × Average Contract Value (amortized monthly)',
        methodology: 'Multi-year enterprise contracts with large upfront values. Revenue is recognized monthly over contract term. New accounts are added periodically, existing contracts renew at intervals.',
        keyMetrics: ['Active ELA Accounts', 'Average Contract Value', 'Renewal Rate'],
        useCases: 'Enterprise software suites, infrastructure platforms, security solutions'
    },
    'data-licensing': {
        name: 'Data Licensing',
        description: 'Selling access to proprietary data or datasets',
        formula: 'Revenue = Licenses Sold × Price per License',
        methodology: 'Licenses data access to customers either as one-time purchases or subscriptions. Tracks number of active licenses and pricing tiers. May include recurring refresh fees for updated data.',
        keyMetrics: ['Active Licenses', 'Data Refresh Revenue', 'Usage Volume'],
        useCases: 'Market data, research databases, analytics platforms'
    },
    'white-label': {
        name: 'White Label Licensing',
        description: 'Licensing software for rebranding and resale',
        formula: 'Revenue = Partners × (License Fee + Revenue Share)',
        methodology: 'Partners license the platform to resell under their brand. Combines upfront license fees with ongoing revenue sharing based on partner success. Tracks partner count and their combined revenue.',
        keyMetrics: ['Active Partners', 'Partner Revenue', 'License Revenue'],
        useCases: 'SaaS platforms, payment solutions, communication infrastructure'
    },
    'professional-services': {
        name: 'Professional Services',
        description: 'Expert consulting and implementation services',
        formula: 'Revenue = Billable Resources × Utilization × Hourly Rate',
        methodology: 'Delivers expert services through consulting teams. Revenue based on number of billable resources, utilization percentage, and hourly rates. May combine with recurring support contracts.',
        keyMetrics: ['Billable Resources', 'Utilization Rate', 'Average Rate'],
        useCases: 'Implementation services, training, technical consulting'
    }
};

/**
 * Get interpretation for a metric value
 */
export function getMetricInterpretation(metricKey, value) {
    const info = METRIC_EXPLANATIONS[metricKey];
    if (!info || !info.interpretation) return null;

    for (const [range, text] of Object.entries(info.interpretation)) {
        if (range.startsWith('<')) {
            const threshold = parseFloat(range.substring(1));
            if (value < threshold) return text;
        } else if (range.startsWith('>')) {
            const threshold = parseFloat(range.substring(1));
            if (value > threshold) return text;
        } else if (range.includes('-')) {
            const [min, max] = range.split('-').map(s => parseFloat(s));
            if (value >= min && value <= max) return text;
        }
    }

    return null;
}

/**
 * Calculate universal metrics that work across all models
 * Allows comparison even between different model families
 */
export function calculateUniversalMetrics(modelKey, results, inputs) {
    if (!results || results.length === 0) return null;

    const totalRevenue = results.reduce((sum, r) => sum + (r.totalRevenue || r.revenue || r.mrr || 0), 0);
    const finalMonthRevenue = results[results.length - 1].totalRevenue
        || results[results.length - 1].revenue
        || results[results.length - 1].mrr
        || 0;
    const firstMonthRevenue = results[0].totalRevenue
        || results[0].revenue
        || results[0].mrr
        || 0;

    // Calculate month-over-month growth rate (average)
    let totalGrowth = 0;
    let growthMonths = 0;
    for (let i = 1; i < results.length; i++) {
        const currentRevenue = results[i].totalRevenue || results[i].revenue || results[i].mrr || 0;
        const previousRevenue = results[i-1].totalRevenue || results[i-1].revenue || results[i-1].mrr || 0;

        if (previousRevenue > 0) {
            const growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
            totalGrowth += growth;
            growthMonths++;
        }
    }
    const avgMonthlyGrowth = growthMonths > 0 ? totalGrowth / growthMonths : 0;

    // Calculate revenue per customer (if applicable)
    const finalMonthCustomers = results[results.length - 1].customers
        || results[results.length - 1].totalCustomers
        || results[results.length - 1].paidUsers
        || results[results.length - 1].activeAccounts
        || 0;

    const revenuePerCustomer = finalMonthCustomers > 0 ? finalMonthRevenue / finalMonthCustomers : 0;

    // Calculate CAC, LTV, and related metrics
    // Use real CAC from inputs if provided, otherwise estimate
    const estimatedCAC = inputs.cac !== undefined && inputs.cac > 0
        ? inputs.cac
        : revenuePerCustomer * 4; // Fallback: Conservative estimate

    // Calculate retention rate (use appropriate churn field based on model)
    const churnRate = inputs.churnRate !== undefined ? inputs.churnRate
        : inputs.paidChurn !== undefined ? inputs.paidChurn
        : inputs.customerChurn !== undefined ? inputs.customerChurn
        : inputs.clientChurn !== undefined ? inputs.clientChurn
        : inputs.accountChurn !== undefined ? inputs.accountChurn
        : 5; // Default 5% churn if not specified

    const retentionRate = (100 - churnRate) / 100;

    // Calculate average customer lifetime in months
    const avgLifetimeMonths = retentionRate > 0 ? 1 / (1 - retentionRate) : 24;

    // Calculate LTV (Lifetime Value)
    const estimatedLTV = revenuePerCustomer * avgLifetimeMonths;

    // Calculate LTV:CAC ratio
    const ltvCacRatio = estimatedCAC > 0 ? estimatedLTV / estimatedCAC : 0;

    // Calculate payback period in months
    const paybackPeriod = revenuePerCustomer > 0 ? estimatedCAC / revenuePerCustomer : 0;

    // Calculate gross margin (assume 80% for software, adjust if cost data available)
    const grossMargin = 0.80;

    // Revenue run rate (annualized based on final month)
    const revenueRunRate = finalMonthRevenue * 12;

    return {
        totalRevenue,
        finalMonthRevenue,
        avgMonthlyGrowth,
        revenuePerCustomer,
        estimatedCAC,
        estimatedLTV,
        ltvCacRatio,
        paybackPeriod,
        grossMargin,
        revenueRunRate,
        retentionRate: retentionRate * 100,
        avgLifetimeMonths,
        totalCustomers: finalMonthCustomers
    };
}

/**
 * Get bounds for a variable based on input definition
 */
export function getVariableBounds(varName, model) {
    const inputDef = model.inputs.find(i => i.name === varName);

    if (inputDef) {
        let min = inputDef.min !== undefined ? inputDef.min : 0;
        let max = inputDef.max;

        // If no max defined, set reasonable defaults based on type
        if (max === undefined) {
            if (inputDef.type === 'currency') {
                max = 50000; // R50,000
            } else if (inputDef.type === 'percent') {
                max = 100;
            } else if (inputDef.type === 'number') {
                max = 10000;
            } else {
                max = 100000;
            }
        }

        return { min, max };
    }

    // Fallback bounds
    return { min: 0, max: 100000 };
}

/**
 * Extract revenue from results at a specific month
 */
export function extractRevenueFromResults(results, monthIndex) {
    if (!results || !results[monthIndex]) return 0;

    const monthData = results[monthIndex];
    return monthData.totalRevenue
        || monthData.revenue
        || monthData.mrr
        || 0;
}

/**
 * Reverse calculation: Given a target revenue, solve for required input
 * Uses binary search algorithm for monotonic relationships
 */
export function reverseCalculate(modelKey, targetRevenue, targetMonth, solveForVar, constraints) {
    const model = models[modelKey];

    if (!model) {
        return { success: false, error: 'Model not found' };
    }

    // Validate target month
    if (targetMonth < 1 || targetMonth > 60) {
        return { success: false, error: 'Target month must be between 1 and 60' };
    }

    // Define search bounds based on variable type
    const bounds = getVariableBounds(solveForVar, model);

    // Binary search for the solution
    let low = bounds.min;
    let high = bounds.max;
    let iterations = 0;
    const maxIterations = 50;
    const tolerance = targetRevenue * 0.01; // 1% tolerance

    let bestSolution = null;
    let bestDifference = Infinity;

    while (iterations < maxIterations && (high - low) > 0.01) {
        const mid = (low + high) / 2;

        // Create input object with solved variable
        const testInputs = { ...constraints };
        testInputs[solveForVar] = mid;

        try {
            // Run forward calculation
            const results = model.calculate(testInputs, targetMonth);
            const achievedRevenue = extractRevenueFromResults(results, targetMonth - 1);

            const difference = Math.abs(achievedRevenue - targetRevenue);

            // Track best solution
            if (difference < bestDifference) {
                bestDifference = difference;
                bestSolution = {
                    solvedValue: mid,
                    achievedRevenue: achievedRevenue,
                    inputs: { ...testInputs },
                    results: results
                };
            }

            // Check if within tolerance
            if (difference < tolerance) {
                return {
                    success: true,
                    solvedValue: mid,
                    achievedRevenue: achievedRevenue,
                    inputs: testInputs,
                    results: results,
                    iterations: iterations
                };
            }

            // Adjust search bounds
            if (achievedRevenue < targetRevenue) {
                low = mid; // Need higher value
            } else {
                high = mid; // Need lower value
            }
        } catch (error) {
            console.error('Error in reverse calculation:', error);
            // If calculation fails, try narrowing from the other direction
            high = mid;
        }

        iterations++;
    }

    // Return best approximation found
    if (bestSolution) {
        return {
            success: iterations < maxIterations,
            ...bestSolution,
            iterations: iterations,
            isApproximation: true
        };
    }

    return {
        success: false,
        error: 'Could not find a solution within the allowed range',
        iterations: iterations
    };
}

/**
 * Format variable name for display
 */
export function formatVariableName(varName, model) {
    const inputDef = model.inputs.find(i => i.name === varName);
    return inputDef ? inputDef.label : varName;
}

/**
 * Format solved value for display
 */
export function formatSolvedValue(varName, value, model) {
    const inputDef = model.inputs.find(i => i.name === varName);

    if (!inputDef) return value.toFixed(2);

    if (inputDef.type === 'currency') {
        return formatCurrency(value);
    } else if (inputDef.type === 'percent') {
        return value.toFixed(2) + '%';
    } else if (inputDef.type === 'number') {
        return Math.round(value).toLocaleString();
    }

    return value.toFixed(2);
}

/**
 * Generate multiple scenarios for achieving the target
 * Creates 3 different approaches based on different assumptions
 */
export function generateScenarios(modelKey, targetRevenue, targetMonth, baseConstraints) {
    const model = models[modelKey];
    const scenarios = [];

    // Determine which variables to use for scenarios based on model type
    // We'll try to create scenarios by varying different constraint assumptions

    // Scenario 1: Balanced/Recommended approach
    // Use the user's constraints or sensible defaults
    const scenario1Constraints = { ...baseConstraints };

    // Fill in missing constraints with defaults
    model.inputs.forEach(input => {
        if (scenario1Constraints[input.name] === undefined && input.name !== reverseCalculatorState.solveForVariable) {
            scenario1Constraints[input.name] = input.default || 0;
        }
    });

    const scenario1 = reverseCalculate(
        modelKey,
        targetRevenue,
        targetMonth,
        reverseCalculatorState.solveForVariable,
        scenario1Constraints
    );

    if (scenario1.success) {
        scenarios.push({
            name: 'Recommended Approach',
            description: 'Balanced assumptions based on industry standards',
            ...scenario1
        });
    }

    // Scenario 2: Aggressive/Growth-focused
    // Lower churn, higher efficiency assumptions
    const scenario2Constraints = { ...baseConstraints };
    model.inputs.forEach(input => {
        if (scenario2Constraints[input.name] === undefined && input.name !== reverseCalculatorState.solveForVariable) {
            if (input.name.includes('churn') || input.name.includes('Churn')) {
                scenario2Constraints[input.name] = Math.max((input.default || 5) * 0.6, input.min || 0);
            } else if (input.name.includes('expansion') || input.name.includes('conversion')) {
                scenario2Constraints[input.name] = Math.min((input.default || 2) * 1.5, input.max || 100);
            } else if (input.name.includes('Price') || input.name.includes('price')) {
                scenario2Constraints[input.name] = Math.min((input.default || 500) * 1.3, 50000);
            } else {
                scenario2Constraints[input.name] = input.default || 0;
            }
        }
    });

    const scenario2 = reverseCalculate(
        modelKey,
        targetRevenue,
        targetMonth,
        reverseCalculatorState.solveForVariable,
        scenario2Constraints
    );

    if (scenario2.success) {
        scenarios.push({
            name: 'Optimistic Scenario',
            description: 'Assumes better retention and higher efficiency',
            ...scenario2
        });
    }

    // Scenario 3: Conservative/Volume approach
    // Higher churn, lower prices, volume-based
    const scenario3Constraints = { ...baseConstraints };
    model.inputs.forEach(input => {
        if (scenario3Constraints[input.name] === undefined && input.name !== reverseCalculatorState.solveForVariable) {
            if (input.name.includes('churn') || input.name.includes('Churn')) {
                scenario3Constraints[input.name] = Math.min((input.default || 5) * 1.4, input.max || 100);
            } else if (input.name.includes('expansion') || input.name.includes('conversion')) {
                scenario3Constraints[input.name] = Math.max((input.default || 2) * 0.7, input.min || 0);
            } else if (input.name.includes('Price') || input.name.includes('price')) {
                scenario3Constraints[input.name] = Math.max((input.default || 500) * 0.7, input.min || 0);
            } else {
                scenario3Constraints[input.name] = input.default || 0;
            }
        }
    });

    const scenario3 = reverseCalculate(
        modelKey,
        targetRevenue,
        targetMonth,
        reverseCalculatorState.solveForVariable,
        scenario3Constraints
    );

    if (scenario3.success) {
        scenarios.push({
            name: 'Conservative Scenario',
            description: 'Higher churn tolerance, volume-focused approach',
            ...scenario3
        });
    }

    return scenarios;
}

/**
 * Debounce function for input handling
 */
export function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

