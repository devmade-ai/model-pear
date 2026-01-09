// ========== TESTING UTILITIES ==========
// Workflow-based testing for validating that displayed values are logically correct.
//
// These tests verify that given a user's workflow (model selection, inputs, settings),
// the calculated and displayed results follow the correct business logic.
//
// KEY PRINCIPLE: We're not testing math (1000 × 1.1 = 1100).
// We're testing logic: "Developer Revenue should equal Development Cost times (1 + Markup)"

import { calculateIntercompany, DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from './registry.js';

// ========== LOGICAL ASSERTION LIBRARY ==========
// Reusable assertions that describe WHAT should happen in plain English,
// with a formula function that calculates the expected value from inputs.

/**
 * Assertion: Developer Revenue equals Cost plus Markup
 * Used in: Model 1 (Cost-Plus) variants
 */
const DEVELOPER_REVENUE_COST_PLUS = {
    id: 'developer-revenue-cost-plus',
    field: 'Developer Revenue',
    logic: 'Development Cost × (1 + Markup Percentage ÷ 100)',
    description: 'The developer charges the client their costs plus an agreed markup percentage',
    calculate: (inputs) => inputs.developmentCost * (1 + (inputs.markupPercentage || 0) / 100),
    resultPath: 'developer.revenue.total'
};

/**
 * Assertion: Developer Gross Profit equals Revenue minus Cost
 * Used in: All models where developer has costs
 */
const DEVELOPER_GROSS_PROFIT = {
    id: 'developer-gross-profit',
    field: 'Developer Gross Profit',
    logic: 'Developer Revenue minus Development Cost',
    description: 'Profit before tax is what the developer keeps after covering their costs',
    calculate: (inputs, results) => {
        const revenue = results?.developer?.revenue?.total || 0;
        return revenue - (inputs.developmentCost || 0);
    },
    resultPath: 'developer.profit.gross',
    dependsOn: ['developer.revenue.total']
};

/**
 * Assertion: Developer Tax equals Profit times Tax Rate
 * Used in: All models
 */
const DEVELOPER_TAX_PAYABLE = {
    id: 'developer-tax-payable',
    field: 'Developer Tax Payable',
    logic: 'Developer Gross Profit × Corporate Tax Rate',
    description: 'Tax is calculated on the profit at the applicable corporate rate',
    calculate: (inputs, results) => {
        const profit = results?.developer?.profit?.gross || 0;
        const taxRate = (inputs.corporateTaxRate || 27) / 100;
        return profit * taxRate;
    },
    resultPath: 'developer.tax.taxPayable',
    dependsOn: ['developer.profit.gross']
};

/**
 * Assertion: Developer Net Profit equals Gross Profit minus Tax
 * Used in: All models
 */
const DEVELOPER_NET_PROFIT = {
    id: 'developer-net-profit',
    field: 'Developer Net Profit',
    logic: 'Developer Gross Profit minus Tax Payable',
    description: 'What the developer actually keeps after paying tax',
    calculate: (inputs, results) => {
        const grossProfit = results?.developer?.profit?.gross || 0;
        const tax = results?.developer?.tax?.taxPayable || 0;
        return grossProfit - tax;
    },
    resultPath: 'developer.profit.net',
    dependsOn: ['developer.profit.gross', 'developer.tax.taxPayable']
};

/**
 * Assertion: Developer Margin Percentage
 * Used in: Cost-Plus models
 */
const DEVELOPER_MARGIN_PERCENTAGE = {
    id: 'developer-margin-percentage',
    field: 'Developer Margin %',
    logic: 'Markup Percentage (as entered)',
    description: 'The margin should match what was entered as the markup',
    calculate: (inputs) => inputs.markupPercentage || 0,
    resultPath: 'developer.profit.margin'
};

/**
 * Assertion: Buyer Capitalised Asset (Development Phase Only)
 * Used in: Model 1 (IAS 38 treatment)
 */
const BUYER_CAPITALISED_ASSET = {
    id: 'buyer-capitalised-asset',
    field: 'Buyer Capitalised Asset',
    logic: 'Development Phase Cost (research phase is expensed per IAS 38)',
    description: 'Per IAS 38, only development phase costs are capitalised as an intangible asset',
    calculate: (inputs) => inputs.developmentPhaseCost || 0,
    resultPath: 'buyer.asset.capitalised'
};

/**
 * Assertion: Buyer Expensed Amount (Research Phase)
 * Used in: Model 1 (IAS 38 treatment)
 */
const BUYER_EXPENSED_RESEARCH = {
    id: 'buyer-expensed-research',
    field: 'Buyer Expensed (Research)',
    logic: 'Research Phase Cost (expensed immediately per IAS 38.54)',
    description: 'Research costs cannot be capitalised and must be expensed when incurred',
    calculate: (inputs) => inputs.researchPhaseCost || 0,
    resultPath: 'buyer.asset.expensed'
};

/**
 * Assertion: Buyer Annual Amortisation
 * Used in: All models where buyer capitalises an asset
 */
const BUYER_ANNUAL_AMORTISATION = {
    id: 'buyer-annual-amortisation',
    field: 'Buyer Annual Amortisation',
    logic: 'Capitalised Asset ÷ Useful Life (years)',
    description: 'The asset is written off evenly over its expected useful life',
    calculate: (inputs, results) => {
        const capitalised = results?.buyer?.asset?.capitalised || inputs.developmentPhaseCost || 0;
        const usefulLife = inputs.usefulLife || 5;
        return usefulLife > 0 ? capitalised / usefulLife : 0;
    },
    resultPath: 'buyer.asset.annualAmortisation',
    dependsOn: ['buyer.asset.capitalised']
};

/**
 * Assertion: Buyer Section 11(e) Tax Deduction
 * Used in: SA tax scenarios
 */
const BUYER_SECTION_11E_DEDUCTION = {
    id: 'buyer-section-11e-deduction',
    field: 'Buyer Section 11(e) Deduction',
    logic: 'Capitalised Asset ÷ Write-off Period (2 years for PC, 5 for mainframe)',
    description: 'SA tax allows accelerated write-off: 2 years for PC software, 5 years for mainframe',
    calculate: (inputs, results) => {
        const capitalised = results?.buyer?.asset?.capitalised || inputs.developmentPhaseCost || 0;
        const writeOffYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
        return writeOffYears > 0 ? capitalised / writeOffYears : 0;
    },
    resultPath: 'buyer.tax.section11eDeduction',
    dependsOn: ['buyer.asset.capitalised']
};

/**
 * Assertion: Transfer Pricing Risk Level
 * Used in: Related party transactions
 */
const TRANSFER_PRICING_RISK = {
    id: 'transfer-pricing-risk',
    field: 'Transfer Pricing Risk',
    logic: 'If Markup ≤ 15%: LOW risk (within OECD range); If Markup > 15%: HIGH risk',
    description: 'OECD benchmarks for cost-plus services are typically 5-15%. Exceeding this raises scrutiny.',
    calculate: (inputs) => {
        const markup = inputs.markupPercentage || 0;
        return markup <= 15 ? 'low' : 'high';
    },
    resultPath: 'transferPricing.riskLevel'
};

/**
 * Assertion: Transfer Pricing Within Range
 * Used in: Related party transactions
 */
const TRANSFER_PRICING_WITHIN_RANGE = {
    id: 'transfer-pricing-within-range',
    field: 'Within Arm\'s Length Range',
    logic: 'TRUE if Markup is between 5% and 15% (OECD safe harbour)',
    description: 'Transactions within this range are generally considered arm\'s length',
    calculate: (inputs) => {
        const markup = inputs.markupPercentage || 0;
        return markup >= 5 && markup <= 15;
    },
    resultPath: 'transferPricing.withinRange'
};

/**
 * Assertion: Fixed Price Revenue
 * Used in: Model 1D (Fixed Price)
 */
const FIXED_PRICE_REVENUE = {
    id: 'fixed-price-revenue',
    field: 'Developer Revenue (Fixed Price)',
    logic: 'Fixed Price amount (agreed upfront, regardless of actual costs)',
    description: 'In a fixed price contract, revenue is the agreed price, not cost-plus',
    calculate: (inputs) => inputs.fixedPrice || 0,
    resultPath: 'developer.revenue.total'
};

/**
 * Assertion: Time & Materials Revenue
 * Used in: Model 1E (T&M)
 */
const TIME_MATERIALS_REVENUE = {
    id: 'time-materials-revenue',
    field: 'Developer Revenue (T&M)',
    logic: 'Hours Worked × Hourly Rate',
    description: 'Revenue is based on actual time spent at the agreed hourly rate',
    calculate: (inputs) => (inputs.developerHours || 0) * (inputs.hourlyRate || 0),
    resultPath: 'developer.revenue.total'
};

/**
 * Assertion: Retainer Revenue
 * Used in: Model 1F (Dedicated Team)
 */
const RETAINER_REVENUE = {
    id: 'retainer-revenue',
    field: 'Developer Revenue (Retainer)',
    logic: 'Monthly Retainer × Contract Months',
    description: 'Revenue is the agreed monthly fee multiplied by contract duration',
    calculate: (inputs) => (inputs.monthlyRetainer || 0) * (inputs.contractMonths || 0),
    resultPath: 'developer.revenue.total'
};

/**
 * Assertion: Retainer Costs
 * Used in: Model 1F (Dedicated Team)
 */
const RETAINER_COSTS = {
    id: 'retainer-costs',
    field: 'Developer Costs (Retainer)',
    logic: 'Monthly Team Cost × Contract Months',
    description: 'Costs are the actual team cost multiplied by contract duration',
    calculate: (inputs) => (inputs.monthlyCost || 0) * (inputs.contractMonths || 0),
    resultPath: 'developer.costs.total'
};

// ========== ASSERTION LIBRARY EXPORT ==========
export const ASSERTIONS = {
    DEVELOPER_REVENUE_COST_PLUS,
    DEVELOPER_GROSS_PROFIT,
    DEVELOPER_TAX_PAYABLE,
    DEVELOPER_NET_PROFIT,
    DEVELOPER_MARGIN_PERCENTAGE,
    BUYER_CAPITALISED_ASSET,
    BUYER_EXPENSED_RESEARCH,
    BUYER_ANNUAL_AMORTISATION,
    BUYER_SECTION_11E_DEDUCTION,
    TRANSFER_PRICING_RISK,
    TRANSFER_PRICING_WITHIN_RANGE,
    FIXED_PRICE_REVENUE,
    TIME_MATERIALS_REVENUE,
    RETAINER_REVENUE,
    RETAINER_COSTS
};

// ========== WORKFLOW SCENARIOS ==========
// Each scenario describes a complete user journey and what should be verified.

const WORKFLOW_SCENARIOS = [
    // ==================== MODEL 1B: COST-PLUS STANDARD ====================
    {
        id: 'workflow-1b-standard-independent',
        name: 'Cost-Plus 10% Markup (Independent Parties)',
        story: `
            A software company is hired by an independent client to build a custom application.

            The developer enters their costs (R1,000,000 total: R200,000 research, R800,000 development)
            and applies a 10% markup, which is within the typical market range.

            The client will capitalise the development costs and write them off over 5 years
            for accounting purposes, but can claim accelerated tax depreciation under Section 11(e).
        `,
        workflow: {
            model: 'Model 1: Cost-Plus Development Services',
            variant: '1B: Cost-Plus with Fixed Margin',
            partyRelationship: 'independent',
            perspective: 'both'
        },
        inputs: {
            projectName: 'Custom Application',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            DEVELOPER_REVENUE_COST_PLUS,
            DEVELOPER_GROSS_PROFIT,
            DEVELOPER_MARGIN_PERCENTAGE,
            DEVELOPER_TAX_PAYABLE,
            DEVELOPER_NET_PROFIT,
            BUYER_CAPITALISED_ASSET,
            BUYER_EXPENSED_RESEARCH,
            BUYER_ANNUAL_AMORTISATION,
            BUYER_SECTION_11E_DEDUCTION
        ],
        modelId: 'model-1',
        variantId: '1B'
    },

    // ==================== MODEL 1B: HIGH MARGIN (TP RISK) ====================
    {
        id: 'workflow-1b-high-margin-related',
        name: 'Cost-Plus 25% Markup (Related Parties - TP Risk)',
        story: `
            A group company is developing software for a related entity.

            The 25% markup exceeds the OECD safe harbour range (5-15%), which should
            trigger a HIGH transfer pricing risk flag. This requires documentation to
            justify why the premium is commercially justified.

            This scenario tests that the system correctly identifies TP risk.
        `,
        workflow: {
            model: 'Model 1: Cost-Plus Development Services',
            variant: '1B: Cost-Plus with Fixed Margin',
            partyRelationship: 'related',
            perspective: 'shareholder'
        },
        inputs: {
            projectName: 'Intercompany Software',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 25,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            DEVELOPER_REVENUE_COST_PLUS,
            DEVELOPER_GROSS_PROFIT,
            TRANSFER_PRICING_RISK,
            TRANSFER_PRICING_WITHIN_RANGE
        ],
        modelId: 'model-1',
        variantId: '1B'
    },

    // ==================== MODEL 1A: ZERO MARKUP ====================
    {
        id: 'workflow-1a-cost-recovery',
        name: 'Pure Cost Recovery (No Markup)',
        story: `
            A company builds software for a subsidiary at cost, with no markup.
            This is a pure cost reimbursement arrangement.

            Expected outcomes:
            - Developer revenue equals exactly the development cost
            - Developer profit is zero (no markup = no profit)
            - No tax payable (nothing to tax)

            This is typically used between related parties or as a loss-leader.
        `,
        workflow: {
            model: 'Model 1: Cost-Plus Development Services',
            variant: '1A: Pure Cost Reimbursement',
            partyRelationship: 'related',
            perspective: 'developer'
        },
        inputs: {
            projectName: 'Internal Tool',
            developmentCost: 500000,
            researchPhaseCost: 100000,
            developmentPhaseCost: 400000,
            markupPercentage: 0,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            {
                ...DEVELOPER_REVENUE_COST_PLUS,
                // Override calculate for zero markup case
                calculate: (inputs) => inputs.developmentCost
            },
            {
                id: 'zero-profit',
                field: 'Developer Gross Profit',
                logic: 'Should be zero (no markup applied)',
                description: 'With 0% markup, there is no profit margin',
                calculate: () => 0,
                resultPath: 'developer.profit.gross'
            },
            {
                id: 'zero-tax',
                field: 'Developer Tax Payable',
                logic: 'Should be zero (no profit to tax)',
                description: 'With no profit, there is no tax liability',
                calculate: () => 0,
                resultPath: 'developer.tax.taxPayable'
            }
        ],
        modelId: 'model-1',
        variantId: '1A'
    },

    // ==================== MODEL 1D: FIXED PRICE ====================
    {
        id: 'workflow-1d-fixed-price',
        name: 'Fixed Price Contract',
        story: `
            A company agrees to build software for a fixed price of R1,200,000.
            Their estimated cost is R1,000,000, but they expect 10% cost overrun.

            Key difference from cost-plus:
            - Revenue is the fixed price (R1,200,000), not cost + markup
            - Profit depends on actual costs vs estimate
            - Risk is on the developer (cost overruns reduce profit)
        `,
        workflow: {
            model: 'Model 1: Cost-Plus Development Services',
            variant: '1D: Fixed Price Development',
            partyRelationship: 'independent',
            perspective: 'developer'
        },
        inputs: {
            projectName: 'Fixed Price Project',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            fixedPrice: 1200000,
            estimatedCostVariance: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            FIXED_PRICE_REVENUE,
            {
                id: 'fixed-price-profit',
                field: 'Developer Gross Profit',
                logic: 'Fixed Price minus Adjusted Cost (Cost × (1 + Variance%))',
                description: 'Profit is what remains after accounting for expected cost overruns',
                calculate: (inputs) => {
                    const adjustedCost = inputs.developmentCost * (1 + (inputs.estimatedCostVariance || 0) / 100);
                    return inputs.fixedPrice - adjustedCost;
                },
                resultPath: 'developer.profit.gross'
            }
        ],
        modelId: 'model-1',
        variantId: '1D'
    },

    // ==================== MODEL 1E: TIME & MATERIALS ====================
    {
        id: 'workflow-1e-time-materials',
        name: 'Time & Materials Engagement',
        story: `
            A company provides development services on a T&M basis.

            They work 2,000 hours at R500/hour (which includes a 25% markup).

            Key points:
            - Revenue = Hours × Rate
            - The rate INCLUDES the markup (unlike cost-plus where markup is added)
            - Cost is derived by removing the markup from revenue
        `,
        workflow: {
            model: 'Model 1: Cost-Plus Development Services',
            variant: '1E: Time and Materials',
            partyRelationship: 'independent',
            perspective: 'developer'
        },
        inputs: {
            projectName: 'T&M Engagement',
            developerHours: 2000,
            hourlyRate: 500,
            hourlyMarkup: 25,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            TIME_MATERIALS_REVENUE,
            {
                id: 'tm-profit',
                field: 'Developer Gross Profit',
                logic: 'Revenue minus Cost, where Cost = Revenue ÷ (1 + Markup%)',
                description: 'Profit is the markup portion of the loaded hourly rate',
                calculate: (inputs) => {
                    const revenue = inputs.developerHours * inputs.hourlyRate;
                    const cost = revenue / (1 + inputs.hourlyMarkup / 100);
                    return revenue - cost;
                },
                resultPath: 'developer.profit.gross'
            },
            {
                id: 'tm-margin',
                field: 'Developer Margin %',
                logic: 'Should equal the Hourly Markup percentage',
                description: 'The effective margin equals the markup built into the rate',
                calculate: (inputs) => inputs.hourlyMarkup,
                resultPath: 'developer.profit.margin'
            }
        ],
        modelId: 'model-1',
        variantId: '1E'
    },

    // ==================== MODEL 1F: DEDICATED TEAM ====================
    {
        id: 'workflow-1f-retainer',
        name: 'Dedicated Team Retainer',
        story: `
            A company provides a dedicated development team on a monthly retainer.

            Monthly retainer: R250,000
            Monthly team cost: R200,000
            Contract duration: 12 months

            This is a predictable revenue model with consistent monthly income.
        `,
        workflow: {
            model: 'Model 1: Cost-Plus Development Services',
            variant: '1F: Dedicated Development Team',
            partyRelationship: 'independent',
            perspective: 'developer'
        },
        inputs: {
            projectName: 'Dedicated Team',
            monthlyRetainer: 250000,
            contractMonths: 12,
            monthlyCost: 200000,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            RETAINER_REVENUE,
            {
                id: 'retainer-profit',
                field: 'Developer Gross Profit',
                logic: 'Total Revenue minus Total Cost ((Retainer - Cost) × Months)',
                description: 'Monthly profit times number of months',
                calculate: (inputs) => {
                    const totalRevenue = inputs.monthlyRetainer * inputs.contractMonths;
                    const totalCost = inputs.monthlyCost * inputs.contractMonths;
                    return totalRevenue - totalCost;
                },
                resultPath: 'developer.profit.gross'
            }
        ],
        modelId: 'model-1',
        variantId: '1F'
    },

    // ==================== TAX CALCULATION VERIFICATION ====================
    {
        id: 'workflow-tax-chain',
        name: 'Full Tax Calculation Chain',
        story: `
            Verify the complete tax calculation from revenue to net profit.

            Using a simple example:
            - Cost: R500,000
            - Markup: 20%
            - Tax Rate: 27%

            This tests the full chain:
            Revenue → Gross Profit → Tax → Net Profit
        `,
        workflow: {
            model: 'Model 1: Cost-Plus Development Services',
            variant: '1B: Cost-Plus with Fixed Margin',
            partyRelationship: 'independent',
            perspective: 'developer'
        },
        inputs: {
            projectName: 'Tax Test',
            developmentCost: 500000,
            researchPhaseCost: 100000,
            developmentPhaseCost: 400000,
            markupPercentage: 20,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            DEVELOPER_REVENUE_COST_PLUS,
            DEVELOPER_GROSS_PROFIT,
            DEVELOPER_TAX_PAYABLE,
            DEVELOPER_NET_PROFIT
        ],
        modelId: 'model-1',
        variantId: '1B'
    },

    // ==================== BUYER AMORTISATION VS TAX ====================
    {
        id: 'workflow-buyer-amortisation',
        name: 'Buyer: Accounting vs Tax Depreciation',
        story: `
            Verify the buyer's different treatment for accounting and tax:

            Accounting (IAS 38):
            - Capitalise development costs
            - Amortise over useful life (4 years = R250,000/year)

            Tax (Section 11(e)):
            - Accelerated write-off (2 years = R500,000/year)

            This difference creates a timing difference for deferred tax.
        `,
        workflow: {
            model: 'Model 1: Cost-Plus Development Services',
            variant: '1B: Cost-Plus with Fixed Margin',
            partyRelationship: 'independent',
            perspective: 'buyer'
        },
        inputs: {
            projectName: 'Amortisation Test',
            developmentCost: 1000000,
            researchPhaseCost: 0,
            developmentPhaseCost: 1000000,
            markupPercentage: 10,
            usefulLife: 4,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            BUYER_CAPITALISED_ASSET,
            BUYER_ANNUAL_AMORTISATION,
            BUYER_SECTION_11E_DEDUCTION,
            {
                id: 'timing-difference',
                field: 'Timing Difference (Year 1)',
                logic: 'Accounting Amortisation minus Tax Deduction',
                description: 'Negative means tax deduction exceeds accounting expense (deferred tax liability)',
                calculate: (inputs, results) => {
                    const accountingAmort = results?.buyer?.asset?.annualAmortisation ||
                        (inputs.developmentPhaseCost / inputs.usefulLife);
                    const taxDeduction = results?.buyer?.tax?.section11eDeduction ||
                        (inputs.developmentPhaseCost / 2);
                    return accountingAmort - taxDeduction;
                },
                resultPath: 'buyer.tax.timingDifference'
            }
        ],
        modelId: 'model-1',
        variantId: '1B'
    },

    // ==================== EDGE CASE: ZERO COST ====================
    {
        id: 'workflow-edge-zero-cost',
        name: 'Edge Case: Zero Development Cost',
        story: `
            What happens when development cost is zero?

            This tests defensive handling:
            - No division by zero errors
            - All derived values should be zero
            - System should not crash
        `,
        workflow: {
            model: 'Model 1: Cost-Plus Development Services',
            variant: '1B: Cost-Plus with Fixed Margin',
            partyRelationship: 'independent',
            perspective: 'developer'
        },
        inputs: {
            projectName: 'Zero Cost Test',
            developmentCost: 0,
            researchPhaseCost: 0,
            developmentPhaseCost: 0,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            {
                id: 'zero-revenue',
                field: 'Developer Revenue',
                logic: 'Should be zero (0 × 1.1 = 0)',
                description: 'Zero cost means zero revenue',
                calculate: () => 0,
                resultPath: 'developer.revenue.total'
            },
            {
                id: 'zero-profit',
                field: 'Developer Gross Profit',
                logic: 'Should be zero',
                description: 'No cost, no profit',
                calculate: () => 0,
                resultPath: 'developer.profit.gross'
            },
            {
                id: 'zero-asset',
                field: 'Buyer Capitalised Asset',
                logic: 'Should be zero',
                description: 'Nothing to capitalise',
                calculate: () => 0,
                resultPath: 'buyer.asset.capitalised'
            }
        ],
        modelId: 'model-1',
        variantId: '1B'
    },

    // ==================== EDGE CASE: CUSTOM TAX RATE ====================
    {
        id: 'workflow-edge-custom-tax',
        name: 'Edge Case: Non-Default Tax Rate (25%)',
        story: `
            Verify the calculator respects custom tax rates.

            Using 25% instead of the default 27% to confirm:
            - Tax is calculated at the specified rate, not hardcoded
            - This supports different jurisdictions or historical calculations
        `,
        workflow: {
            model: 'Model 1: Cost-Plus Development Services',
            variant: '1B: Cost-Plus with Fixed Margin',
            partyRelationship: 'independent',
            perspective: 'developer'
        },
        inputs: {
            projectName: 'Custom Tax Rate',
            developmentCost: 1000000,
            researchPhaseCost: 200000,
            developmentPhaseCost: 800000,
            markupPercentage: 10,
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 25  // Custom rate, not 27%
        },
        assertions: [
            DEVELOPER_REVENUE_COST_PLUS,
            DEVELOPER_GROSS_PROFIT,
            {
                id: 'custom-tax',
                field: 'Developer Tax Payable',
                logic: 'Gross Profit × 25% (custom rate)',
                description: 'Tax should use the input rate, not default 27%',
                calculate: (inputs, results) => {
                    const profit = results?.developer?.profit?.gross ||
                        (inputs.developmentCost * inputs.markupPercentage / 100);
                    return profit * 0.25;  // 25%, not 27%
                },
                resultPath: 'developer.tax.taxPayable'
            }
        ],
        modelId: 'model-1',
        variantId: '1B'
    }
];

// ========== EXPORT ALL SCENARIOS ==========
export const ALL_TEST_CASES = WORKFLOW_SCENARIOS;

// ========== TEST RUNNER ==========

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
}

/**
 * Compare two values with tolerance for numeric values
 */
function compareValues(actual, expected, tolerance = 0.01) {
    if (actual === undefined) return false;

    if (typeof expected === 'number' && typeof actual === 'number') {
        if (expected === 0) {
            return Math.abs(actual) < 1;  // Allow small rounding errors for zero
        }
        const diff = Math.abs(actual - expected) / Math.abs(expected);
        return diff <= tolerance;
    }
    if (typeof expected === 'boolean') {
        return actual === expected;
    }
    if (typeof expected === 'string') {
        return actual === expected || String(actual).toLowerCase() === expected.toLowerCase();
    }
    return actual === expected;
}

/**
 * Run a single workflow scenario
 * @param {Object} scenario - Workflow scenario to test
 * @param {Object} entityConfig - Entity configuration (optional)
 * @param {Object} taxParams - Tax parameters (optional)
 * @returns {Object} Test result with pass/fail status and details
 */
export function runTest(scenario, entityConfig = DEFAULT_ENTITY_CONFIG, taxParams = DEFAULT_TAX_PARAMS) {
    const startTime = performance.now();

    const result = {
        id: scenario.id,
        name: scenario.name,
        story: scenario.story,
        workflow: scenario.workflow,
        passed: true,
        assertions: [],
        error: null,
        duration: 0
    };

    try {
        // Run the calculation
        const calcResult = calculateIntercompany(
            scenario.modelId,
            scenario.variantId,
            scenario.inputs,
            entityConfig,
            taxParams
        );

        // Evaluate each assertion
        for (const assertion of scenario.assertions) {
            const expectedValue = assertion.calculate(scenario.inputs, calcResult);
            const actualValue = getNestedValue(calcResult, assertion.resultPath);
            const passed = compareValues(actualValue, expectedValue);

            result.assertions.push({
                id: assertion.id,
                field: assertion.field,
                logic: assertion.logic,
                description: assertion.description,
                expected: expectedValue,
                actual: actualValue,
                resultPath: assertion.resultPath,
                passed: passed,
                message: passed
                    ? `✓ ${assertion.field} is correct`
                    : `✗ ${assertion.field}: expected ${expectedValue}, got ${actualValue}`
            });

            if (!passed) {
                result.passed = false;
            }
        }

        // Store the full result for debugging
        result.calculationResult = calcResult;

    } catch (error) {
        result.passed = false;
        result.error = {
            message: error.message,
            stack: error.stack
        };
    }

    result.duration = performance.now() - startTime;
    return result;
}

/**
 * Run all workflow scenarios
 */
export function runAllTests(scenarios = ALL_TEST_CASES, options = {}) {
    const startTime = performance.now();
    const results = [];

    const entityConfig = options.entityConfig || DEFAULT_ENTITY_CONFIG;
    const taxParams = options.taxParams || DEFAULT_TAX_PARAMS;

    for (const scenario of scenarios) {
        const result = runTest(scenario, entityConfig, taxParams);
        results.push(result);
    }

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const errors = results.filter(r => r.error).length;

    return {
        summary: {
            total: results.length,
            passed,
            failed,
            errors,
            passRate: results.length > 0 ? (passed / results.length) * 100 : 0,
            duration: performance.now() - startTime
        },
        results,
        timestamp: new Date().toISOString()
    };
}

/**
 * Get test cases grouped by model
 */
export function getTestsByModel() {
    const grouped = {};
    for (const scenario of ALL_TEST_CASES) {
        if (!grouped[scenario.modelId]) {
            grouped[scenario.modelId] = [];
        }
        grouped[scenario.modelId].push(scenario);
    }
    return grouped;
}

/**
 * Get test case by ID
 */
export function getTestById(testId) {
    return ALL_TEST_CASES.find(s => s.id === testId) || null;
}

/**
 * Run tests for a specific model
 */
export function runModelTests(modelId) {
    const modelTests = ALL_TEST_CASES.filter(s => s.modelId === modelId);
    return runAllTests(modelTests);
}

/**
 * Create a custom test case
 */
export function createTestCase(config) {
    return {
        id: config.id || `custom-${Date.now()}`,
        name: config.name || 'Custom Test',
        story: config.story || '',
        workflow: config.workflow || {},
        inputs: config.inputs,
        assertions: config.assertions || [],
        modelId: config.modelId,
        variantId: config.variantId
    };
}

// ========== EXPORTS ==========
export default {
    ALL_TEST_CASES,
    ASSERTIONS,
    runTest,
    runAllTests,
    runModelTests,
    getTestsByModel,
    getTestById,
    createTestCase
};
