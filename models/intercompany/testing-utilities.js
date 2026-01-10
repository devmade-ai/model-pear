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

// ========== MODEL 2 ASSERTIONS ==========

/**
 * Assertion: Developer Licence Revenue (Perpetual)
 * Used in: Model 2A
 */
const DEVELOPER_LICENCE_REVENUE_PERPETUAL = {
    id: 'developer-licence-revenue-perpetual',
    field: 'Developer Licence Revenue',
    logic: 'Upfront Licence Fee (one-time payment)',
    description: 'Perpetual licence revenue equals the agreed upfront fee',
    calculate: (inputs) => inputs.upfrontLicenceFee || 0,
    resultPath: 'developer.revenue.total'
};

/**
 * Assertion: Buyer Capitalised Licence
 * Used in: Model 2A, 2B
 */
const BUYER_CAPITALISED_LICENCE = {
    id: 'buyer-capitalised-licence',
    field: 'Buyer Capitalised Asset',
    logic: 'Licence Fee + Implementation Costs',
    description: 'Buyer capitalises the licence cost plus directly attributable costs',
    calculate: (inputs) => (inputs.upfrontLicenceFee || 0) + (inputs.implementationCosts || 0),
    resultPath: 'buyer.asset.capitalised'
};

/**
 * Assertion: Usage-Based Royalty Revenue
 * Used in: Model 2C
 */
const USAGE_BASED_ROYALTY_REVENUE = {
    id: 'usage-based-royalty-revenue',
    field: 'Developer Royalty Revenue',
    logic: 'Usage × Unit Value × Royalty Rate × Term',
    description: 'Royalty revenue based on usage volume and agreed rate',
    calculate: (inputs) => {
        const usage = inputs.estimatedAnnualUsage || 0;
        const unitValue = inputs.usageUnitValue || 0;
        const rate = (inputs.royaltyRate || 0) / 100;
        const term = inputs.licenceType === 'perpetual' ?
            (inputs.buyerUsefulLife || 5) : (inputs.licenceTerm || 5);
        return usage * unitValue * rate * term;
    },
    resultPath: 'developer.revenue.total'
};

// ========== MODEL 3 ASSERTIONS ==========

/**
 * Assertion: Developer Ownership Percentage (Contribution-Based)
 * Used in: Model 3B
 */
const DEVELOPER_OWNERSHIP_CONTRIBUTION = {
    id: 'developer-ownership-contribution',
    field: 'Developer Ownership %',
    logic: 'Developer Contribution ÷ Total Contributions × 100',
    description: 'Ownership matches contribution value in contribution-based arrangements',
    calculate: (inputs) => {
        const projectDuration = inputs.projectDurationMonths || 18;
        const devCash = inputs.developerCashContribution || 0;
        const devPersonnel = (inputs.developerPersonnelFTEs || 0) *
            (inputs.developerPersonnelCostPerMonth || 0) * projectDuration;
        const devIP = inputs.developerIPContribution || 0;
        const devFacilities = inputs.developerFacilitiesContribution || 0;
        const devTotal = devCash + devPersonnel + devIP + devFacilities;

        const buyerCash = inputs.buyerCashContribution || 0;
        const buyerPersonnel = (inputs.buyerPersonnelFTEs || 0) *
            (inputs.buyerPersonnelCostPerMonth || 0) * projectDuration;
        const buyerIP = inputs.buyerIPContribution || 0;
        const buyerDomain = inputs.buyerDomainExpertiseValue || 0;
        const buyerTotal = buyerCash + buyerPersonnel + buyerIP + buyerDomain;

        const total = devTotal + buyerTotal;
        return total > 0 ? (devTotal / total) * 100 : 50;
    },
    resultPath: 'developer.ownership.percentage'
};

/**
 * Assertion: Developer Capitalised Asset (Joint Development)
 * Used in: Model 3B
 */
const DEVELOPER_JOINT_ASSET = {
    id: 'developer-joint-asset',
    field: 'Developer Capitalised Asset',
    logic: 'Development Phase Cost × Developer Ownership %',
    description: 'Each party capitalises their proportional share of development costs',
    calculate: (inputs, results) => {
        const devPhaseCost = inputs.developmentPhaseCost || 0;
        const ownershipPct = results?.developer?.ownership?.percentage || 50;
        return devPhaseCost * (ownershipPct / 100);
    },
    resultPath: 'developer.asset.capitalised',
    dependsOn: ['developer.ownership.percentage']
};

// ========== MODEL 4 ASSERTIONS ==========

/**
 * Assertion: Developer Service Revenue (BOT)
 * Used in: Model 4
 */
const DEVELOPER_BOT_SERVICE_REVENUE = {
    id: 'developer-bot-service-revenue',
    field: 'Developer Service Revenue',
    logic: 'Monthly Service Fee × Operation Period',
    description: 'Revenue from operating the software for the buyer',
    calculate: (inputs) => {
        const monthlyFee = inputs.monthlyServiceFee || 0;
        const months = inputs.operationPeriodMonths || 36;
        return monthlyFee * months;
    },
    resultPath: 'developer.revenue.serviceRevenue'
};

/**
 * Assertion: Developer Total Revenue (BOT Fixed Price)
 * Used in: Model 4A
 */
const DEVELOPER_BOT_TOTAL_REVENUE = {
    id: 'developer-bot-total-revenue',
    field: 'Developer Total Revenue',
    logic: 'Service Revenue + Transfer Price',
    description: 'Total revenue includes both service fees and transfer payment',
    calculate: (inputs) => {
        const monthlyFee = inputs.monthlyServiceFee || 0;
        const months = inputs.operationPeriodMonths || 36;
        const serviceRevenue = monthlyFee * months;
        const transferPrice = inputs.fixedTransferPrice || 0;
        return serviceRevenue + transferPrice;
    },
    resultPath: 'developer.revenue.total'
};

// ========== MODEL 5 ASSERTIONS ==========

/**
 * Assertion: Developer Sale Proceeds
 * Used in: Model 5
 */
const DEVELOPER_SALE_PROCEEDS = {
    id: 'developer-sale-proceeds',
    field: 'Developer Sale Proceeds',
    logic: 'Sale Price (agreed purchase price)',
    description: 'Revenue from the outright sale of software',
    calculate: (inputs) => inputs.salePrice || 0,
    resultPath: 'developer.revenue.total'
};

/**
 * Assertion: Developer Capital Gain
 * Used in: Model 5 (Capital Asset)
 */
const DEVELOPER_CAPITAL_GAIN = {
    id: 'developer-capital-gain',
    field: 'Developer Capital Gain',
    logic: 'Sale Price minus Carrying Value',
    description: 'Gain on disposal equals proceeds minus net book value',
    calculate: (inputs) => {
        const salePrice = inputs.salePrice || 0;
        const carryingValue = inputs.carryingValueAtSale || 0;
        return salePrice - carryingValue;
    },
    resultPath: 'developer.profit.capitalGain'
};

/**
 * Assertion: Buyer Capitalised Purchase
 * Used in: Model 5
 */
const BUYER_CAPITALISED_PURCHASE = {
    id: 'buyer-capitalised-purchase',
    field: 'Buyer Capitalised Asset',
    logic: 'Sale Price (full purchase price capitalised)',
    description: 'Buyer capitalises the full purchase price as intangible asset',
    calculate: (inputs) => inputs.salePrice || 0,
    resultPath: 'buyer.asset.capitalised'
};

// ========== MODEL 6 ASSERTIONS ==========

/**
 * Assertion: Developer Subscription Revenue
 * Used in: Model 6A
 */
const DEVELOPER_SUBSCRIPTION_REVENUE = {
    id: 'developer-subscription-revenue',
    field: 'Developer Subscription Revenue',
    logic: 'Monthly Fee × 12 × Contract Term',
    description: 'Total subscription revenue over the contract period',
    calculate: (inputs) => {
        const monthlyFee = inputs.monthlySubscriptionFee || 0;
        const years = inputs.contractTerm || 3;
        return monthlyFee * 12 * years;
    },
    resultPath: 'developer.revenue.total'
};

/**
 * Assertion: Buyer Has No Asset (SaaS)
 * Used in: Model 6
 */
const BUYER_NO_ASSET_SAAS = {
    id: 'buyer-no-asset-saas',
    field: 'Buyer Asset Recognised',
    logic: 'FALSE (SaaS = no asset for buyer)',
    description: 'Under SaaS model, buyer expenses fees; no asset is capitalised',
    calculate: () => false,
    resultPath: 'buyer.asset.recognised'
};

/**
 * Assertion: Buyer Subscription Expense
 * Used in: Model 6A
 */
const BUYER_SUBSCRIPTION_EXPENSE = {
    id: 'buyer-subscription-expense',
    field: 'Buyer Annual Expense',
    logic: 'Monthly Fee × 12',
    description: 'Annual subscription expense for the buyer',
    calculate: (inputs) => (inputs.monthlySubscriptionFee || 0) * 12,
    resultPath: 'buyer.expenses.annual'
};

// ========== ASSERTION LIBRARY EXPORT ==========
export const ASSERTIONS = {
    // Model 1 assertions
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
    RETAINER_COSTS,
    // Model 2 assertions
    DEVELOPER_LICENCE_REVENUE_PERPETUAL,
    BUYER_CAPITALISED_LICENCE,
    USAGE_BASED_ROYALTY_REVENUE,
    // Model 3 assertions
    DEVELOPER_OWNERSHIP_CONTRIBUTION,
    DEVELOPER_JOINT_ASSET,
    // Model 4 assertions
    DEVELOPER_BOT_SERVICE_REVENUE,
    DEVELOPER_BOT_TOTAL_REVENUE,
    // Model 5 assertions
    DEVELOPER_SALE_PROCEEDS,
    DEVELOPER_CAPITAL_GAIN,
    BUYER_CAPITALISED_PURCHASE,
    // Model 6 assertions
    DEVELOPER_SUBSCRIPTION_REVENUE,
    BUYER_NO_ASSET_SAAS,
    BUYER_SUBSCRIPTION_EXPENSE
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
    },

    // ==================== MODEL 2A: PERPETUAL LICENCE ====================
    {
        id: 'workflow-2a-perpetual-licence',
        name: 'Perpetual Licence (Upfront Payment)',
        story: `
            A software company licenses its platform to a client for a one-time fee.

            The developer:
            - Developed the software at a cost of R2,000,000
            - Licenses it for R500,000 upfront fee
            - Retains ownership of the IP

            The buyer:
            - Pays R500,000 + R100,000 implementation costs
            - Capitalises the total R600,000 as an intangible asset
            - Amortises over the useful life
        `,
        workflow: {
            model: 'Model 2: Software Licence with Royalties',
            variant: '2A: Perpetual Licence (Upfront Payment)',
            partyRelationship: 'independent',
            perspective: 'both'
        },
        inputs: {
            projectName: 'Platform Licence',
            developmentCost: 2000000,
            researchPhaseCost: 400000,
            developmentPhaseCost: 1600000,
            developerUsefulLife: 5,
            upfrontLicenceFee: 500000,
            implementationCosts: 100000,
            buyerUsefulLife: 5,
            licenceType: 'perpetual',
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            DEVELOPER_LICENCE_REVENUE_PERPETUAL,
            BUYER_CAPITALISED_LICENCE,
            {
                id: 'developer-retains-asset',
                field: 'Developer Asset Recognised',
                logic: 'TRUE (Developer retains IP ownership)',
                description: 'Under licence model, developer keeps the IP asset',
                calculate: () => true,
                resultPath: 'developer.asset.recognised'
            }
        ],
        modelId: 'model-2',
        variantId: '2A'
    },

    // ==================== MODEL 2C: USAGE-BASED ROYALTIES ====================
    {
        id: 'workflow-2c-usage-royalties',
        name: 'Usage-Based Royalties',
        story: `
            A software company licenses its API platform with usage-based pricing.

            Terms:
            - 5% royalty on transaction value
            - Estimated 100,000 transactions/year
            - Average R10 per transaction
            - 5-year licence term

            Expected annual royalty: 100,000 × R10 × 5% = R50,000
            Total over term: R250,000
        `,
        workflow: {
            model: 'Model 2: Software Licence with Royalties',
            variant: '2C: Usage-Based Royalties',
            partyRelationship: 'independent',
            perspective: 'developer'
        },
        inputs: {
            projectName: 'API Platform',
            developmentCost: 2000000,
            researchPhaseCost: 400000,
            developmentPhaseCost: 1600000,
            developerUsefulLife: 5,
            royaltyRate: 5,
            estimatedAnnualUsage: 100000,
            usageUnitValue: 10,
            usageMetric: 'transactions',
            licenceType: 'term',
            licenceTerm: 5,
            buyerUsefulLife: 5,
            implementationCosts: 50000,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            USAGE_BASED_ROYALTY_REVENUE,
            {
                id: 'royalty-rate-in-range',
                field: 'Transfer Pricing Risk Level',
                logic: '5% royalty is within OECD range (1-25%)',
                description: 'Low risk when royalty rate is within benchmarks',
                calculate: () => 'low',
                resultPath: 'transferPricing.riskLevel'
            }
        ],
        modelId: 'model-2',
        variantId: '2C'
    },

    // ==================== MODEL 3B: CONTRIBUTION-BASED JOINT DEVELOPMENT ====================
    {
        id: 'workflow-3b-joint-development',
        name: 'Contribution-Based Joint Development',
        story: `
            Two companies jointly develop software, with ownership based on contributions.

            Developer contributes:
            - Cash: R500,000
            - Personnel: 5 FTEs × R50,000/month × 18 months = R4,500,000
            - Existing IP: R200,000
            - Facilities: R100,000
            - Total: R5,300,000

            Buyer contributes:
            - Cash: R600,000
            - Personnel: 3 FTEs × R45,000/month × 18 months = R2,430,000
            - Existing IP: R100,000
            - Domain expertise: R150,000
            - Total: R3,280,000

            Developer ownership: 5,300,000 / 8,580,000 = 61.8%
            Buyer ownership: 38.2%
        `,
        workflow: {
            model: 'Model 3: Joint Development / Cost-Sharing',
            variant: '3B: Contribution-Based Sharing',
            partyRelationship: 'related',
            perspective: 'both'
        },
        inputs: {
            projectName: 'Joint Platform',
            totalProjectCost: 2000000,
            researchPhaseCost: 400000,
            developmentPhaseCost: 1600000,
            projectDurationMonths: 18,
            developerCashContribution: 500000,
            developerPersonnelFTEs: 5,
            developerPersonnelCostPerMonth: 50000,
            developerIPContribution: 200000,
            developerFacilitiesContribution: 100000,
            buyerCashContribution: 600000,
            buyerPersonnelFTEs: 3,
            buyerPersonnelCostPerMonth: 45000,
            buyerIPContribution: 100000,
            buyerDomainExpertiseValue: 150000,
            valuationMethod: 'fair-value',
            usefulLife: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            DEVELOPER_OWNERSHIP_CONTRIBUTION,
            {
                id: 'no-intercompany-profit',
                field: 'Transfer Pricing Risk Level',
                logic: 'Low risk (cost contribution = no profit element)',
                description: 'Joint development eliminates intercompany profit',
                calculate: () => 'low',
                resultPath: 'transferPricing.riskLevel'
            }
        ],
        modelId: 'model-3',
        variantId: '3B'
    },

    // ==================== MODEL 4A: BOT FIXED TRANSFER PRICE ====================
    {
        id: 'workflow-4a-bot-fixed',
        name: 'Build-Operate-Transfer (Fixed Price)',
        story: `
            A developer builds and operates software for 3 years, then transfers ownership.

            Development: R2,000,000
            Operation: 36 months × R80,000/month = R2,880,000 service revenue
            Annual operating cost: R400,000
            Transfer price: R2,500,000

            Total developer revenue: R2,880,000 + R2,500,000 = R5,380,000
        `,
        workflow: {
            model: 'Model 4: Build-Operate-Transfer (BOT)',
            variant: '4A: Fixed Transfer Price',
            partyRelationship: 'independent',
            perspective: 'developer'
        },
        inputs: {
            projectName: 'BOT Project',
            developmentPeriodMonths: 12,
            operationPeriodMonths: 36,
            totalDevelopmentCost: 2000000,
            researchPhaseCost: 400000,
            developmentPhaseCost: 1600000,
            monthlyServiceFee: 80000,
            annualOperatingCost: 400000,
            fixedTransferPrice: 2500000,
            inflationAdjustment: 0,
            usefulLifeYears: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            DEVELOPER_BOT_TOTAL_REVENUE,
            {
                id: 'bot-service-revenue',
                field: 'Developer Service Revenue',
                logic: 'Monthly Fee × Operation Months',
                description: 'Service revenue during operation period',
                calculate: (inputs) => (inputs.monthlyServiceFee || 0) * (inputs.operationPeriodMonths || 36),
                resultPath: 'developer.revenue.breakdown.serviceRevenue'
            }
        ],
        modelId: 'model-4',
        variantId: '4A'
    },

    // ==================== MODEL 5A: SOFTWARE SALE ====================
    {
        id: 'workflow-5a-software-sale',
        name: 'Outright Software Sale',
        story: `
            A developer sells software outright to a buyer.

            Developer:
            - Development cost: R1,500,000
            - Carrying value at sale: R1,000,000 (after some amortisation)
            - Sale price: R2,000,000
            - Capital gain: R1,000,000

            Buyer:
            - Capitalises R2,000,000 as intangible asset
            - Amortises over 5 years (R400,000/year)
            - Gets Section 11(e) deduction (R1,000,000/year for 2 years)
        `,
        workflow: {
            model: 'Model 5: Software Sale with Ongoing Support',
            variant: '5A: Outright Sale (Lump Sum)',
            partyRelationship: 'independent',
            perspective: 'both'
        },
        inputs: {
            projectName: 'Software Sale',
            totalDevelopmentCost: 1500000,
            researchPhaseCost: 300000,
            developmentPhaseCost: 1200000,
            carryingValueAtSale: 1000000,
            salePrice: 2000000,
            paymentStructure: 'lump-sum',
            assetClassification: 'capital-asset',
            cgtInclusionRate: 80,
            usefulLifeYears: 5,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            DEVELOPER_SALE_PROCEEDS,
            DEVELOPER_CAPITAL_GAIN,
            BUYER_CAPITALISED_PURCHASE,
            {
                id: 'cgt-calculation',
                field: 'Developer CGT',
                logic: 'Capital Gain × Inclusion Rate × Tax Rate',
                description: 'CGT = R1,000,000 × 80% × 27% = R216,000',
                calculate: (inputs) => {
                    const gain = (inputs.salePrice || 0) - (inputs.carryingValueAtSale || 0);
                    const inclusionRate = (inputs.cgtInclusionRate || 80) / 100;
                    const taxRate = (inputs.corporateTaxRate || 27) / 100;
                    return gain * inclusionRate * taxRate;
                },
                resultPath: 'developer.tax.cgt'
            }
        ],
        modelId: 'model-5',
        variantId: '5A'
    },

    // ==================== MODEL 6A: SAAS SUBSCRIPTION ====================
    {
        id: 'workflow-6a-saas',
        name: 'SaaS Subscription Model',
        story: `
            A company provides SaaS access to their platform.

            Developer:
            - Developed platform for R3,000,000
            - Charges R50,000/month subscription
            - 3-year contract term
            - Total revenue: R50,000 × 12 × 3 = R1,800,000

            Buyer:
            - Expenses R50,000/month as operating cost
            - NO asset capitalised (SaaS = service, not asset)
            - Gets immediate tax deduction for subscription fees
        `,
        workflow: {
            model: 'Model 6: Subscription/SaaS Model',
            variant: '6A: Pure SaaS (Multi-Tenant)',
            partyRelationship: 'independent',
            perspective: 'both'
        },
        inputs: {
            projectName: 'SaaS Platform',
            developmentCost: 3000000,
            researchPhaseCost: 600000,
            developmentPhaseCost: 2400000,
            developerUsefulLife: 5,
            annualOperatingCost: 300000,
            annualEnhancementCost: 200000,
            contractTerm: 3,
            renewalTerms: 'auto-renew',
            paymentTiming: 'advance',
            monthlySubscriptionFee: 50000,
            implementationCosts: 50000,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            DEVELOPER_SUBSCRIPTION_REVENUE,
            BUYER_NO_ASSET_SAAS,
            {
                id: 'buyer-annual-expense',
                field: 'Buyer Annual Subscription Expense',
                logic: 'Monthly Fee × 12',
                description: 'Buyer expenses subscription fees as incurred',
                calculate: (inputs) => (inputs.monthlySubscriptionFee || 0) * 12,
                resultPath: 'buyer.expenses.ongoing.subscriptionFee'
            },
            {
                id: 'developer-retains-ip',
                field: 'Developer Asset Recognised',
                logic: 'TRUE (Developer retains all IP in SaaS)',
                description: 'SaaS model means developer owns the asset',
                calculate: () => true,
                resultPath: 'developer.asset.recognised'
            }
        ],
        modelId: 'model-6',
        variantId: '6A'
    },

    // ==================== MODEL 6: SAAS vs LICENCE COMPARISON ====================
    {
        id: 'workflow-6-saas-no-buyer-asset',
        name: 'SaaS: Buyer Has No Asset',
        story: `
            Key difference between SaaS (Model 6) and Licence (Model 2):

            In SaaS:
            - Buyer does NOT capitalise any asset
            - All fees are expensed
            - No amortisation
            - Immediate tax deduction

            This is critical for clients who prefer OpEx over CapEx.
        `,
        workflow: {
            model: 'Model 6: Subscription/SaaS Model',
            variant: '6A: Pure SaaS (Multi-Tenant)',
            partyRelationship: 'independent',
            perspective: 'buyer'
        },
        inputs: {
            projectName: 'SaaS Service',
            developmentCost: 2000000,
            researchPhaseCost: 400000,
            developmentPhaseCost: 1600000,
            developerUsefulLife: 5,
            annualOperatingCost: 200000,
            annualEnhancementCost: 100000,
            contractTerm: 3,
            monthlySubscriptionFee: 40000,
            implementationCosts: 25000,
            section11eType: 'pc-2yr',
            corporateTaxRate: 27
        },
        assertions: [
            BUYER_NO_ASSET_SAAS,
            {
                id: 'buyer-no-capitalised-amount',
                field: 'Buyer Capitalised Amount',
                logic: 'Should be zero or near zero (SaaS)',
                description: 'Under SaaS, subscription fees are expensed, not capitalised',
                calculate: () => 0,
                resultPath: 'buyer.asset.capitalised'
            }
        ],
        modelId: 'model-6',
        variantId: '6A'
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

// ========== LONG-TERM VALUE TEST CASES (NPV, IRR, PAYBACK) ==========

/**
 * NPV calculation test cases
 * Tests the calculateNPV function from growth-projections.js
 */
export const NPV_TEST_CASES = [
    {
        id: 'npv-simple',
        name: 'Simple NPV Calculation',
        description: 'Basic NPV with known expected result',
        cashFlows: [-1000, 300, 300, 300, 300, 300],
        discountRate: 0.10,
        expectedNPV: 137.24,  // Hand-calculated: -1000 + 300/1.1 + 300/1.21 + 300/1.331 + 300/1.4641 + 300/1.6105
        tolerance: 1.0  // Allow R1 variance
    },
    {
        id: 'npv-break-even',
        name: 'Break-Even NPV (near zero)',
        description: 'Cash flows that approximately break even',
        cashFlows: [-1000, 263, 263, 263, 263, 263],
        discountRate: 0.10,
        expectedNPV: 0,
        tolerance: 5.0  // Small tolerance for near-zero
    },
    {
        id: 'npv-negative',
        name: 'Negative NPV (value destruction)',
        description: 'Project with negative NPV should be rejected',
        cashFlows: [-1000, 100, 100, 100, 100, 100],
        discountRate: 0.10,
        expectedNPV: -620.92,  // Significantly negative
        tolerance: 1.0
    },
    {
        id: 'npv-high-discount',
        name: 'High Discount Rate (20%)',
        description: 'Higher discount rate reduces NPV',
        cashFlows: [-1000, 400, 400, 400, 400],
        discountRate: 0.20,
        expectedNPV: 35.49,  // Lower than with 10% rate
        tolerance: 1.0
    },
    {
        id: 'npv-zero-discount',
        name: 'Zero Discount Rate',
        description: 'No discounting - NPV equals sum of cash flows',
        cashFlows: [-1000, 300, 300, 300, 300],
        discountRate: 0,
        expectedNPV: 200,  // Simple sum: -1000 + 1200
        tolerance: 0.01
    }
];

/**
 * IRR calculation test cases
 * Tests the calculateIRR function from growth-projections.js
 */
export const IRR_TEST_CASES = [
    {
        id: 'irr-standard',
        name: 'Standard IRR Calculation',
        description: 'Typical investment with positive IRR',
        cashFlows: [-1000, 300, 300, 300, 300, 300],
        expectedIRR: 0.1525,  // Approximately 15.25%
        tolerance: 0.005  // 0.5% tolerance
    },
    {
        id: 'irr-double-investment',
        name: 'IRR with 100% Return',
        description: 'Double the investment back in one year',
        cashFlows: [-1000, 2000],
        expectedIRR: 1.0,  // 100% return
        tolerance: 0.01
    },
    {
        id: 'irr-low-return',
        name: 'Low IRR Project',
        description: 'Marginal project with low return',
        cashFlows: [-1000, 200, 200, 200, 200, 200, 200],
        expectedIRR: 0.055,  // Approximately 5.5%
        tolerance: 0.01
    },
    {
        id: 'irr-even-cashflows',
        name: 'Even Cash Flows',
        description: 'Equal annual returns',
        cashFlows: [-1000, 250, 250, 250, 250, 250],
        expectedIRR: 0.0783,  // Approximately 7.83%
        tolerance: 0.01
    }
];

/**
 * Payback period test cases
 * Tests the calculatePaybackPeriod function from growth-projections.js
 */
export const PAYBACK_TEST_CASES = [
    {
        id: 'payback-simple',
        name: 'Simple Payback (3 years)',
        description: 'Investment recovered in 3 years',
        cashFlows: [-900, 300, 300, 300, 100],
        discounted: false,
        discountRate: 0.10,
        expectedPayback: 3.0,
        tolerance: 0.1
    },
    {
        id: 'payback-fractional',
        name: 'Fractional Payback Period',
        description: 'Payback falls between years',
        cashFlows: [-1000, 400, 400, 400],
        discounted: false,
        discountRate: 0.10,
        expectedPayback: 2.5,  // Recovered halfway through year 3
        tolerance: 0.1
    },
    {
        id: 'payback-discounted',
        name: 'Discounted Payback Period',
        description: 'Payback using discounted cash flows',
        cashFlows: [-1000, 400, 400, 400, 400],
        discounted: true,
        discountRate: 0.10,
        expectedPayback: 3.12,  // Longer than simple payback due to discounting
        tolerance: 0.2
    },
    {
        id: 'payback-immediate',
        name: 'Immediate Payback',
        description: 'First year covers investment',
        cashFlows: [-500, 1000],
        discounted: false,
        discountRate: 0.10,
        expectedPayback: 0.5,  // Halfway through year 1
        tolerance: 0.1
    },
    {
        id: 'payback-not-achieved',
        name: 'Payback Not Achieved',
        description: 'Investment never fully recovered',
        cashFlows: [-1000, 100, 100, 100],
        discounted: false,
        discountRate: 0.10,
        expectedPayback: 3,  // Returns period length (not achieved)
        tolerance: 0.1
    }
];

/**
 * Run NPV test cases
 * @param {Function} calculateNPV - NPV calculation function from growth-projections.js
 */
export function runNPVTests(calculateNPV) {
    const results = [];

    for (const testCase of NPV_TEST_CASES) {
        const actualNPV = calculateNPV(testCase.cashFlows, testCase.discountRate);
        const diff = Math.abs(actualNPV - testCase.expectedNPV);
        const passed = diff <= testCase.tolerance;

        results.push({
            id: testCase.id,
            name: testCase.name,
            description: testCase.description,
            expected: testCase.expectedNPV,
            actual: actualNPV,
            difference: diff,
            tolerance: testCase.tolerance,
            passed,
            message: passed
                ? `✓ NPV correct: R${actualNPV.toFixed(2)}`
                : `✗ NPV incorrect: expected R${testCase.expectedNPV.toFixed(2)}, got R${actualNPV.toFixed(2)}`
        });
    }

    const passed = results.filter(r => r.passed).length;
    return {
        name: 'NPV Calculations',
        summary: { total: results.length, passed, failed: results.length - passed },
        results
    };
}

/**
 * Run IRR test cases
 * @param {Function} calculateIRR - IRR calculation function from growth-projections.js
 */
export function runIRRTests(calculateIRR) {
    const results = [];

    for (const testCase of IRR_TEST_CASES) {
        const actualIRR = calculateIRR(testCase.cashFlows);
        const diff = Math.abs(actualIRR - testCase.expectedIRR);
        const passed = diff <= testCase.tolerance;

        results.push({
            id: testCase.id,
            name: testCase.name,
            description: testCase.description,
            expected: testCase.expectedIRR,
            actual: actualIRR,
            difference: diff,
            tolerance: testCase.tolerance,
            passed,
            message: passed
                ? `✓ IRR correct: ${(actualIRR * 100).toFixed(2)}%`
                : `✗ IRR incorrect: expected ${(testCase.expectedIRR * 100).toFixed(2)}%, got ${(actualIRR * 100).toFixed(2)}%`
        });
    }

    const passed = results.filter(r => r.passed).length;
    return {
        name: 'IRR Calculations',
        summary: { total: results.length, passed, failed: results.length - passed },
        results
    };
}

/**
 * Run Payback period test cases
 * @param {Function} calculatePaybackPeriod - Payback calculation function from growth-projections.js
 */
export function runPaybackTests(calculatePaybackPeriod) {
    const results = [];

    for (const testCase of PAYBACK_TEST_CASES) {
        const actualPayback = calculatePaybackPeriod(
            testCase.cashFlows,
            testCase.discounted,
            testCase.discountRate
        );
        const diff = Math.abs(actualPayback - testCase.expectedPayback);
        const passed = diff <= testCase.tolerance;

        results.push({
            id: testCase.id,
            name: testCase.name,
            description: testCase.description,
            expected: testCase.expectedPayback,
            actual: actualPayback,
            difference: diff,
            tolerance: testCase.tolerance,
            passed,
            message: passed
                ? `✓ Payback correct: ${actualPayback.toFixed(2)} years`
                : `✗ Payback incorrect: expected ${testCase.expectedPayback.toFixed(2)} years, got ${actualPayback.toFixed(2)} years`
        });
    }

    const passed = results.filter(r => r.passed).length;
    return {
        name: 'Payback Period Calculations',
        summary: { total: results.length, passed, failed: results.length - passed },
        results
    };
}

/**
 * Run all Long-term Value tests
 * @param {Object} projectionFunctions - Object containing calculateNPV, calculateIRR, calculatePaybackPeriod
 */
export function runLongTermValueTests(projectionFunctions) {
    const { calculateNPV, calculateIRR, calculatePaybackPeriod } = projectionFunctions;

    const npvResults = runNPVTests(calculateNPV);
    const irrResults = runIRRTests(calculateIRR);
    const paybackResults = runPaybackTests(calculatePaybackPeriod);

    const totalTests = npvResults.summary.total + irrResults.summary.total + paybackResults.summary.total;
    const totalPassed = npvResults.summary.passed + irrResults.summary.passed + paybackResults.summary.passed;

    return {
        summary: {
            total: totalTests,
            passed: totalPassed,
            failed: totalTests - totalPassed,
            passRate: totalTests > 0 ? (totalPassed / totalTests) * 100 : 0
        },
        sections: [npvResults, irrResults, paybackResults],
        timestamp: new Date().toISOString()
    };
}

// ========== EXPORTS ==========
export default {
    // Workflow tests
    ALL_TEST_CASES,
    ASSERTIONS,
    runTest,
    runAllTests,
    runModelTests,
    getTestsByModel,
    getTestById,
    createTestCase,
    // Long-term Value tests
    NPV_TEST_CASES,
    IRR_TEST_CASES,
    PAYBACK_TEST_CASES,
    runNPVTests,
    runIRRTests,
    runPaybackTests,
    runLongTermValueTests
};
