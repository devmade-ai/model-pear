// ========== MODEL 1: DEVELOPMENT SERVICES (COST-PLUS) ==========
// Developer creates software for Buyer as a service.
// IP ownership goes to Buyer (who controls the development).
//
// Key characteristics:
// - Developer: Recognises service revenue, no asset on books
// - Buyer: Capitalises development costs as intangible asset
// - Transfer pricing: Cost-plus margin (arm's length range 5-15%)

// ========== INPUT CATEGORIES ==========

const INPUT_CATEGORIES = {
    transaction: {
        name: 'Transaction Details',
        description: 'Core transaction structure and values',
        icon: '📋'
    },
    developer: {
        name: 'Developer Inputs',
        description: 'Developer entity costs and requirements',
        icon: '💻'
    },
    buyer: {
        name: 'Buyer Inputs',
        description: 'Buyer entity asset treatment',
        icon: '🏢'
    },
    tax: {
        name: 'Tax Parameters',
        description: 'South African tax settings',
        icon: '📊'
    }
};

// ========== BASE INPUTS (Common to all variants) ==========

const BASE_INPUTS = [
    // Transaction Details
    {
        name: 'projectName',
        label: 'Project Name',
        type: 'text',
        default: 'Software Development Project',
        category: 'transaction',
        hint: 'Name of the development project'
    },
    {
        name: 'developmentCost',
        label: 'Total Development Cost (R)',
        type: 'currency',
        default: 1000000,
        min: 0,
        step: 10000,
        category: 'developer',
        hint: 'Total cost incurred by Developer (salaries, infrastructure, etc.)'
    },
    {
        name: 'researchPhaseCost',
        label: 'Research Phase Cost (R)',
        type: 'currency',
        default: 200000,
        min: 0,
        step: 10000,
        category: 'developer',
        hint: 'Costs before IAS 38 capitalisation criteria met (expensed by Buyer)'
    },
    {
        name: 'developmentPhaseCost',
        label: 'Development Phase Cost (R)',
        type: 'currency',
        default: 800000,
        min: 0,
        step: 10000,
        category: 'developer',
        hint: 'Costs after IAS 38 criteria met (capitalised by Buyer)'
    },
    {
        name: 'markupPercentage',
        label: 'Cost-Plus Markup (%)',
        type: 'percent',
        default: 10,
        min: 0,
        max: 50,
        step: 1,
        category: 'developer',
        hint: 'Arm\'s length range for development services: 5-15%'
    },

    // Buyer Asset Treatment
    {
        name: 'usefulLife',
        label: 'Useful Life (Years)',
        type: 'number',
        default: 5,
        min: 1,
        max: 20,
        step: 1,
        category: 'buyer',
        hint: 'Expected useful life for amortisation purposes'
    },
    {
        name: 'section11eType',
        label: 'Tax Write-Off Period',
        type: 'select',
        default: 'pc-2yr',
        options: [
            { value: 'pc-2yr', label: 'Standard Software (2-year write-off)' },
            { value: 'mainframe-5yr', label: 'Complex Systems (5-year write-off)' }
        ],
        category: 'tax',
        hint: 'Section 11(e) tax depreciation. Most software qualifies for 2-year treatment. Select 5-year only for mainframe/complex enterprise systems.'
    },

    // Tax Parameters
    {
        name: 'corporateTaxRate',
        label: 'Corporate Tax Rate (%)',
        type: 'percent',
        default: 27,
        min: 0,
        max: 50,
        step: 1,
        category: 'tax',
        hint: 'South African corporate income tax rate (currently 27%)'
    }
];

// ========== VARIANT DEFINITIONS ==========

const VARIANTS = {
    '1A': {
        name: 'Pure Cost Reimbursement',
        description: 'No markup - costs passed through at zero margin',
        scenario: 'Use when Developer is providing resources without profit motive, or for initial cost validation',
        additionalInputs: [],
        excludeInputs: ['markupPercentage'],
        fixedMarkup: 0
    },
    '1B': {
        name: 'Cost-Plus Fixed Margin',
        description: 'Standard cost-plus with fixed percentage markup',
        scenario: 'Most common arrangement - Developer earns consistent margin on all costs',
        additionalInputs: [],
        excludeInputs: [],
        fixedMarkup: null  // Use input value
    },
    '1C': {
        name: 'Cost-Plus with Performance Bonus',
        description: 'Base margin plus milestone-based bonuses',
        scenario: 'Incentivise timely delivery and quality outcomes',
        additionalInputs: [
            {
                name: 'milestoneBonus',
                label: 'Milestone Bonus Amount (R)',
                type: 'currency',
                default: 100000,
                min: 0,
                step: 10000,
                category: 'developer',
                hint: 'Additional payment upon milestone achievement'
            },
            {
                name: 'milestoneProbability',
                label: 'Milestone Achievement Probability (%)',
                type: 'percent',
                default: 80,
                min: 0,
                max: 100,
                step: 5,
                category: 'developer',
                hint: 'Expected probability of achieving bonus milestones'
            }
        ],
        excludeInputs: []
    },
    '1D': {
        name: 'Fixed Price Development',
        description: 'Lump sum payment regardless of actual costs',
        scenario: 'When scope is well-defined and Developer accepts delivery risk',
        additionalInputs: [
            {
                name: 'fixedPrice',
                label: 'Fixed Contract Price (R)',
                type: 'currency',
                default: 1200000,
                min: 0,
                step: 10000,
                category: 'transaction',
                hint: 'Total fixed price for the development contract'
            },
            {
                name: 'estimatedCostVariance',
                label: 'Expected Cost Variance (%)',
                type: 'percent',
                default: 10,
                min: -50,
                max: 50,
                step: 5,
                category: 'developer',
                hint: 'Expected variance from estimated costs (+ = overrun, - = savings)'
            }
        ],
        excludeInputs: ['markupPercentage'],
        fixedMarkup: null  // Calculated from fixed price
    },
    '1E': {
        name: 'Time and Materials',
        description: 'Hourly/daily rates plus material costs',
        scenario: 'When scope is uncertain and flexibility is needed',
        additionalInputs: [
            {
                name: 'developerHours',
                label: 'Total Developer Hours',
                type: 'number',
                default: 2000,
                min: 0,
                step: 100,
                category: 'developer',
                hint: 'Total hours estimated for the project'
            },
            {
                name: 'hourlyRate',
                label: 'Blended Hourly Rate (R)',
                type: 'currency',
                default: 500,
                min: 0,
                step: 50,
                category: 'developer',
                hint: 'Average rate across all resource types'
            },
            {
                name: 'hourlyMarkup',
                label: 'Rate Markup (%)',
                type: 'percent',
                default: 25,
                min: 0,
                max: 100,
                step: 5,
                category: 'developer',
                hint: 'Markup built into hourly rate (above cost)'
            }
        ],
        excludeInputs: ['developmentCost', 'markupPercentage']
    },
    '1F': {
        name: 'Dedicated Development Team',
        description: 'Monthly retainer for dedicated resources',
        scenario: 'Long-term arrangement with predictable monthly costs',
        additionalInputs: [
            {
                name: 'monthlyRetainer',
                label: 'Monthly Retainer Fee (R)',
                type: 'currency',
                default: 250000,
                min: 0,
                step: 10000,
                category: 'developer',
                hint: 'Fixed monthly fee for dedicated team'
            },
            {
                name: 'contractMonths',
                label: 'Contract Duration (Months)',
                type: 'number',
                default: 12,
                min: 1,
                max: 60,
                step: 1,
                category: 'transaction',
                hint: 'Duration of the dedicated team arrangement'
            },
            {
                name: 'monthlyCost',
                label: 'Monthly Cost to Developer (R)',
                type: 'currency',
                default: 200000,
                min: 0,
                step: 10000,
                category: 'developer',
                hint: 'Developer\'s actual monthly cost for the team'
            }
        ],
        excludeInputs: ['developmentCost', 'researchPhaseCost', 'developmentPhaseCost', 'markupPercentage']
    }
};

// ========== CALCULATION FUNCTIONS ==========

/**
 * Calculate three-perspective results for Model 1
 */
function calculate(inputs, variantId, entityConfig = {}, taxParams = {}) {
    const variant = VARIANTS[variantId] || VARIANTS['1B'];

    // Get effective values based on variant
    const { revenue, costs, margin } = calculateRevenueAndCosts(inputs, variant);

    // Developer perspective calculations
    const developer = calculateDeveloperPerspective(revenue, costs, margin, inputs, taxParams);

    // Buyer perspective calculations
    const buyer = calculateBuyerPerspective(revenue, inputs, taxParams);

    // Transfer pricing assessment
    const transferPricing = assessTransferPricing(margin, inputs);

    return {
        developer,
        buyer,
        transferPricing,
        metadata: {
            modelId: 'model-1',
            modelName: 'Development Services (Cost-Plus)',
            variantId,
            variantName: variant.name,
            calculatedAt: new Date().toISOString()
        }
    };
}

/**
 * Calculate revenue and costs based on variant type
 */
function calculateRevenueAndCosts(inputs, variant) {
    let revenue, costs, margin;

    // Handle variant-specific calculations
    if (variant.fixedMarkup === 0) {
        // 1A: Pure cost reimbursement
        costs = inputs.developmentCost || 0;
        margin = 0;
        revenue = costs;
    } else if (inputs.fixedPrice !== undefined) {
        // 1D: Fixed price
        costs = inputs.developmentCost * (1 + (inputs.estimatedCostVariance || 0) / 100);
        revenue = inputs.fixedPrice;
        margin = costs > 0 ? ((revenue - costs) / costs) * 100 : 0;
    } else if (inputs.developerHours !== undefined) {
        // 1E: Time and materials
        const baseCost = inputs.developerHours * (inputs.hourlyRate / (1 + (inputs.hourlyMarkup || 0) / 100));
        costs = baseCost;
        margin = inputs.hourlyMarkup || 0;
        revenue = inputs.developerHours * inputs.hourlyRate;
    } else if (inputs.monthlyRetainer !== undefined) {
        // 1F: Dedicated team
        costs = (inputs.monthlyCost || 0) * (inputs.contractMonths || 12);
        revenue = (inputs.monthlyRetainer || 0) * (inputs.contractMonths || 12);
        margin = costs > 0 ? ((revenue - costs) / costs) * 100 : 0;
    } else {
        // 1B/1C: Standard cost-plus
        costs = inputs.developmentCost || 0;
        margin = inputs.markupPercentage || 10;
        revenue = costs * (1 + margin / 100);

        // Add milestone bonus for 1C
        if (inputs.milestoneBonus !== undefined) {
            const expectedBonus = inputs.milestoneBonus * (inputs.milestoneProbability || 100) / 100;
            revenue += expectedBonus;
        }
    }

    return { revenue, costs, margin };
}

/**
 * Developer perspective: Revenue recognition, no asset
 */
function calculateDeveloperPerspective(revenue, costs, margin, inputs, taxParams) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;
    const profit = revenue - costs;
    const taxPayable = profit * taxRate;
    const netProfit = profit - taxPayable;

    return {
        revenue: {
            total: revenue,
            breakdown: {
                development: revenue,
                licence: 0,
                royalties: 0,
                maintenance: 0,
                services: 0
            },
            recognitionTiming: 'over-time',
            recognitionBasis: 'IFRS 15 - over time as services rendered'
        },
        costs: {
            total: costs,
            breakdown: {
                personnel: costs * 0.7,  // Typical software dev cost split
                infrastructure: costs * 0.2,
                other: costs * 0.1
            }
        },
        profit: {
            gross: profit,
            margin: margin,
            net: netProfit
        },
        asset: {
            recognised: false,
            reason: 'Development services - IP controlled by Buyer',
            carryingValue: 0
        },
        tax: {
            taxableIncome: profit,
            corporateTaxRate: taxRate,
            taxPayable: taxPayable,
            effectiveTaxRate: revenue > 0 ? (taxPayable / revenue) * 100 : 0,
            deferredTaxAsset: 0,
            deferredTaxLiability: 0
        }
    };
}

/**
 * Buyer perspective: Asset capitalisation and amortisation
 */
function calculateBuyerPerspective(transactionValue, inputs, taxParams) {
    const researchCost = inputs.researchPhaseCost || 0;
    const developmentCost = inputs.developmentPhaseCost || (transactionValue - researchCost);
    const capitalisedAmount = developmentCost;  // Only development phase capitalised
    const expensedAmount = researchCost;        // Research phase expensed

    const usefulLife = inputs.usefulLife || 5;
    const annualAmortisation = capitalisedAmount / usefulLife;

    // Section 11(e) tax depreciation
    const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
    const taxDepreciation = capitalisedAmount / section11eYears;

    // Deferred tax calculation (accounting vs tax timing difference)
    const taxRate = (inputs.corporateTaxRate || 27) / 100;
    const timingDifference = annualAmortisation - taxDepreciation;
    const deferredTax = timingDifference * taxRate;

    return {
        asset: {
            recognised: true,
            capitalised: capitalisedAmount,
            expensed: expensedAmount,
            carryingValue: capitalisedAmount,
            usefulLife: usefulLife,
            amortisationMethod: 'straight-line',
            annualAmortisation: annualAmortisation,
            section11eType: inputs.section11eType || 'pc-2yr',
            section11eYears: section11eYears
        },
        expenses: {
            year1: {
                researchExpense: expensedAmount,
                amortisation: annualAmortisation,
                total: expensedAmount + annualAmortisation
            },
            ongoing: {
                amortisation: annualAmortisation,
                maintenance: 0,
                total: annualAmortisation
            },
            schedule: generateAmortisationSchedule(capitalisedAmount, usefulLife)
        },
        tax: {
            section11eDeduction: taxDepreciation,
            accountingAmortisation: annualAmortisation,
            timingDifference: timingDifference,
            deferredTaxAsset: deferredTax > 0 ? deferredTax : 0,
            deferredTaxLiability: deferredTax < 0 ? Math.abs(deferredTax) : 0,
            taxBenefit: taxDepreciation * taxRate
        },
        totalCost: transactionValue
    };
}

/**
 * Assess transfer pricing risk
 */
function assessTransferPricing(margin, inputs) {
    // Arm's length range for development services (OECD guidelines)
    const benchmarkRange = {
        low: 5,
        median: 10,
        high: 15,
        extremeHigh: 20
    };

    const withinRange = margin >= benchmarkRange.low && margin <= benchmarkRange.high;
    const withinExtendedRange = margin >= 0 && margin <= benchmarkRange.extremeHigh;

    let riskScore, riskLevel;
    if (withinRange) {
        riskScore = 90;
        riskLevel = 'low';
    } else if (withinExtendedRange) {
        riskScore = 70;
        riskLevel = 'medium';
    } else {
        riskScore = 40;
        riskLevel = 'high';
    }

    return {
        method: 'cost-plus',
        margin: margin,
        benchmarkRange: benchmarkRange,
        withinRange: withinRange,
        riskScore: riskScore,
        riskLevel: riskLevel,
        recommendation: withinRange ?
            'Margin is within arm\'s length range' :
            `Consider adjusting margin to ${benchmarkRange.median}% (median benchmark)`,
        documentation: [
            'Written development agreement required',
            'Time tracking and cost allocation records',
            'Transfer pricing policy document',
            'Benchmark study or comparables analysis'
        ]
    };
}

/**
 * Generate year-by-year amortisation schedule
 */
function generateAmortisationSchedule(capitalisedAmount, usefulLife) {
    const annualAmortisation = capitalisedAmount / usefulLife;
    const schedule = [];

    for (let year = 1; year <= usefulLife; year++) {
        schedule.push({
            year: year,
            openingBalance: capitalisedAmount - (annualAmortisation * (year - 1)),
            amortisation: annualAmortisation,
            closingBalance: capitalisedAmount - (annualAmortisation * year)
        });
    }

    return schedule;
}

// ========== EXPORT ==========

export const MODEL_1_COST_PLUS = {
    id: 'model-1',
    name: 'Development Services (Cost-Plus)',
    shortName: 'Cost-Plus',
    description: 'Developer creates software for Buyer as a service. IP ownership goes to Buyer.',
    category: 'intercompany',

    inputCategories: INPUT_CATEGORIES,
    baseInputs: BASE_INPUTS,
    variants: VARIANTS,
    defaultVariant: '1B',

    calculate: calculate,

    // UI hints
    icon: '💻',
    color: '#3B82F6',  // Blue

    // Accounting summary
    accountingSummary: {
        developer: 'Revenue recognition over time (IFRS 15). No intangible asset recognised.',
        buyer: 'Capitalise development costs as intangible asset (IAS 38). Expense research costs.'
    }
};
