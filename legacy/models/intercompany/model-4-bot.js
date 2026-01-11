// ========== MODEL 4: BUILD-OPERATE-TRANSFER (BOT) ==========
// Developer builds software, operates/maintains it for a period (providing SaaS-style
// access to the Buyer), then transfers ownership to the Buyer at a predetermined point.
//
// Key characteristics:
// - IP ownership: Developer initially; transfers to Buyer at end of operation period
// - Cash flow: Service fees during operation; transfer payment at end
// - Risk allocation: Developer bears initial development and operational risk
// - Developer asset position: High during operation, None after transfer
// - Buyer asset position: None during operation, High after transfer

// ========== INPUT CATEGORIES ==========

const INPUT_CATEGORIES = {
    project: {
        name: 'Project Parameters',
        description: 'Development and operation timeline',
        icon: '📋'
    },
    development: {
        name: 'Development Costs',
        description: 'Costs to build the software',
        icon: '💻'
    },
    operation: {
        name: 'Operation Period',
        description: 'Service fees and operating costs during operation',
        icon: '⚙️'
    },
    transfer: {
        name: 'Transfer Terms',
        description: 'Transfer pricing and timing',
        icon: '🔄'
    },
    tax: {
        name: 'Tax Parameters',
        description: 'South African tax settings',
        icon: '💰'
    }
};

// ========== BASE INPUTS (Common to all variants) ==========

const BASE_INPUTS = [
    // Project Parameters
    {
        name: 'projectName',
        label: 'Project Name',
        type: 'text',
        default: 'BOT Software Project',
        category: 'project',
        hint: 'Name of the build-operate-transfer project'
    },
    {
        name: 'developmentPeriodMonths',
        label: 'Development Period (Months)',
        type: 'number',
        default: 12,
        min: 1,
        max: 60,
        step: 1,
        category: 'project',
        hint: 'Duration of the development/build phase'
    },
    {
        name: 'operationPeriodMonths',
        label: 'Operation Period (Months)',
        type: 'number',
        default: 36,
        min: 6,
        max: 120,
        step: 6,
        category: 'project',
        hint: 'Duration Developer operates the software before transfer'
    },

    // Development Costs
    {
        name: 'totalDevelopmentCost',
        label: 'Total Development Cost (R)',
        type: 'currency',
        default: 2000000,
        min: 0,
        step: 50000,
        category: 'development',
        hint: 'Total cost to develop the software'
    },
    {
        name: 'researchPhaseCost',
        label: 'Research Phase Cost (R)',
        type: 'currency',
        default: 400000,
        min: 0,
        step: 10000,
        category: 'development',
        hint: 'Pre-IAS 38 costs (always expensed by Developer)'
    },
    {
        name: 'developmentPhaseCost',
        label: 'Development Phase Cost (R)',
        type: 'currency',
        default: 1600000,
        min: 0,
        step: 10000,
        category: 'development',
        hint: 'Post-IAS 38 costs (capitalised by Developer)'
    },

    // Operation Period
    {
        name: 'monthlyServiceFee',
        label: 'Monthly Service Fee (R)',
        type: 'currency',
        default: 80000,
        min: 0,
        step: 5000,
        category: 'operation',
        hint: 'Monthly fee charged to Buyer during operation period'
    },
    {
        name: 'annualOperatingCost',
        label: 'Annual Operating Cost (R)',
        type: 'currency',
        default: 400000,
        min: 0,
        step: 10000,
        category: 'operation',
        hint: 'Developer annual costs to operate/maintain the software'
    },

    // Tax Parameters
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
        hint: 'Section 11(e) tax depreciation (applies to Client post-transfer). Most software qualifies for 2-year treatment.'
    },
    {
        name: 'corporateTaxRate',
        label: 'Corporate Tax Rate (%)',
        type: 'percent',
        default: 27,
        min: 0,
        max: 50,
        step: 1,
        category: 'tax',
        hint: 'South African corporate income tax rate'
    },
    {
        name: 'usefulLifeYears',
        label: 'Useful Life Post-Transfer (Years)',
        type: 'number',
        default: 5,
        min: 1,
        max: 20,
        step: 1,
        category: 'tax',
        hint: 'Buyer amortisation period after transfer'
    }
];

// ========== VARIANT DEFINITIONS ==========

const VARIANTS = {
    '4A': {
        name: 'Fixed Transfer Price',
        description: 'Transfer price agreed upfront at contract signing',
        scenario: 'Use when both parties want certainty and transfer price can be fairly estimated upfront',
        additionalInputs: [
            {
                name: 'fixedTransferPrice',
                label: 'Fixed Transfer Price (R)',
                type: 'currency',
                default: 2500000,
                min: 0,
                step: 50000,
                category: 'transfer',
                hint: 'Agreed transfer price at contract signing'
            },
            {
                name: 'inflationAdjustment',
                label: 'Inflation Adjustment (%/year)',
                type: 'percent',
                default: 0,
                min: 0,
                max: 15,
                step: 0.5,
                category: 'transfer',
                hint: 'Annual adjustment for inflation (0 = no adjustment)'
            }
        ],
        excludeInputs: [],
        transferMethod: 'fixed'
    },
    '4B': {
        name: 'Formula-Based Transfer Price',
        description: 'Price determined by formula at transfer date',
        scenario: 'Use when uncertainty about fair value; price should reflect actual performance',
        additionalInputs: [
            {
                name: 'formulaType',
                label: 'Formula Type',
                type: 'select',
                default: 'cost-plus',
                options: [
                    { value: 'cost-plus', label: 'Cost-Plus Margin' },
                    { value: 'revenue-multiple', label: 'Revenue Multiple' },
                    { value: 'ebitda-multiple', label: 'EBITDA Multiple' }
                ],
                category: 'transfer',
                hint: 'Method for calculating transfer price'
            },
            {
                name: 'formulaMultiplier',
                label: 'Formula Multiplier / Margin (%)',
                type: 'percent',
                default: 25,
                min: 0,
                max: 200,
                step: 5,
                category: 'transfer',
                hint: 'Multiplier or margin percentage for formula'
            },
            {
                name: 'floorPrice',
                label: 'Floor Price (R)',
                type: 'currency',
                default: 1500000,
                min: 0,
                step: 50000,
                category: 'transfer',
                hint: 'Minimum transfer price regardless of formula'
            },
            {
                name: 'ceilingPrice',
                label: 'Ceiling Price (R)',
                type: 'currency',
                default: 4000000,
                min: 0,
                step: 50000,
                category: 'transfer',
                hint: 'Maximum transfer price regardless of formula'
            }
        ],
        excludeInputs: [],
        transferMethod: 'formula'
    },
    '4C': {
        name: 'Fair Market Value at Transfer',
        description: 'Independent valuation at transfer date',
        scenario: 'Use when transfer pricing defensibility is paramount or tax authority scrutiny expected',
        additionalInputs: [
            {
                name: 'valuationMethod',
                label: 'Valuation Methodology',
                type: 'select',
                default: 'income-approach',
                options: [
                    { value: 'income-approach', label: 'Income Approach (DCF)' },
                    { value: 'market-approach', label: 'Market Approach (Comparables)' },
                    { value: 'cost-approach', label: 'Cost Approach' }
                ],
                category: 'transfer',
                hint: 'Valuation methodology to be used'
            },
            {
                name: 'estimatedFMVLow',
                label: 'Estimated FMV - Low (R)',
                type: 'currency',
                default: 2000000,
                min: 0,
                step: 50000,
                category: 'transfer',
                hint: 'Low end of preliminary valuation range'
            },
            {
                name: 'estimatedFMVMid',
                label: 'Estimated FMV - Mid (R)',
                type: 'currency',
                default: 2500000,
                min: 0,
                step: 50000,
                category: 'transfer',
                hint: 'Midpoint of preliminary valuation range'
            },
            {
                name: 'estimatedFMVHigh',
                label: 'Estimated FMV - High (R)',
                type: 'currency',
                default: 3000000,
                min: 0,
                step: 50000,
                category: 'transfer',
                hint: 'High end of preliminary valuation range'
            },
            {
                name: 'valuationCost',
                label: 'Valuation Cost (R)',
                type: 'currency',
                default: 50000,
                min: 0,
                step: 5000,
                category: 'transfer',
                hint: 'Cost of independent valuation'
            }
        ],
        excludeInputs: [],
        transferMethod: 'fmv'
    },
    '4D': {
        name: 'BOT with Purchase Option',
        description: 'Buyer has option, not obligation, to acquire at transfer date',
        scenario: 'Use when Buyer uncertain about long-term needs or wants flexibility',
        additionalInputs: [
            {
                name: 'optionExercisePrice',
                label: 'Option Exercise Price (R)',
                type: 'currency',
                default: 2500000,
                min: 0,
                step: 50000,
                category: 'transfer',
                hint: 'Price if Buyer exercises option'
            },
            {
                name: 'optionPremium',
                label: 'Option Premium (R)',
                type: 'currency',
                default: 100000,
                min: 0,
                step: 10000,
                category: 'transfer',
                hint: 'Upfront premium paid for the option (if any)'
            },
            {
                name: 'exerciseProbability',
                label: 'Exercise Probability (%)',
                type: 'percent',
                default: 75,
                min: 0,
                max: 100,
                step: 5,
                category: 'transfer',
                hint: 'Estimated probability Buyer will exercise option'
            },
            {
                name: 'nonExerciseAction',
                label: 'If Option Not Exercised',
                type: 'select',
                default: 'continue-service',
                options: [
                    { value: 'continue-service', label: 'Continue as SaaS' },
                    { value: 'terminate', label: 'Contract Terminates' },
                    { value: 'extend-option', label: 'Option Extends' }
                ],
                category: 'transfer',
                hint: 'What happens if Buyer does not exercise'
            }
        ],
        excludeInputs: [],
        transferMethod: 'option'
    },
    '4E': {
        name: 'Build-Operate-Own (BOO)',
        description: 'No transfer - Developer operates indefinitely',
        scenario: 'Use when Developer wants recurring revenue model and Buyer prefers OPEX treatment',
        additionalInputs: [
            {
                name: 'contractTermYears',
                label: 'Initial Contract Term (Years)',
                type: 'number',
                default: 5,
                min: 1,
                max: 20,
                step: 1,
                category: 'operation',
                hint: 'Initial contract duration'
            },
            {
                name: 'renewalTermYears',
                label: 'Renewal Term (Years)',
                type: 'number',
                default: 3,
                min: 1,
                max: 10,
                step: 1,
                category: 'operation',
                hint: 'Duration of each renewal period'
            },
            {
                name: 'annualEscalation',
                label: 'Annual Fee Escalation (%)',
                type: 'percent',
                default: 5,
                min: 0,
                max: 15,
                step: 0.5,
                category: 'operation',
                hint: 'Annual increase in service fees'
            },
            {
                name: 'terminationNoticePeriod',
                label: 'Termination Notice (Months)',
                type: 'number',
                default: 6,
                min: 1,
                max: 24,
                step: 1,
                category: 'operation',
                hint: 'Required notice period for termination'
            }
        ],
        excludeInputs: ['operationPeriodMonths'],
        transferMethod: 'none'
    },
    '4F': {
        name: 'Build-Transfer-Operate (BTO)',
        description: 'Developer builds, transfers immediately, then operates for Buyer',
        scenario: 'Use when Buyer wants asset on balance sheet quickly but lacks operational capability',
        additionalInputs: [
            {
                name: 'immediateTransferPrice',
                label: 'Immediate Transfer Price (R)',
                type: 'currency',
                default: 2000000,
                min: 0,
                step: 50000,
                category: 'transfer',
                hint: 'Price paid for immediate transfer of ownership'
            },
            {
                name: 'managedServiceFee',
                label: 'Monthly Managed Service Fee (R)',
                type: 'currency',
                default: 60000,
                min: 0,
                step: 5000,
                category: 'operation',
                hint: 'Monthly fee for Developer to operate Buyer-owned software'
            },
            {
                name: 'serviceAgreementTermMonths',
                label: 'Service Agreement Term (Months)',
                type: 'number',
                default: 36,
                min: 12,
                max: 120,
                step: 12,
                category: 'operation',
                hint: 'Duration of managed service agreement'
            }
        ],
        excludeInputs: ['operationPeriodMonths'],
        transferMethod: 'immediate'
    },
    '4G': {
        name: 'Build-Lease-Transfer',
        description: 'Developer builds, leases to Buyer, ownership transfers at lease end',
        scenario: 'Use when financing element desired and Buyer wants to spread payments (IFRS 16)',
        additionalInputs: [
            {
                name: 'leaseTermMonths',
                label: 'Lease Term (Months)',
                type: 'number',
                default: 48,
                min: 12,
                max: 120,
                step: 12,
                category: 'transfer',
                hint: 'Duration of the lease'
            },
            {
                name: 'monthlyLeasePayment',
                label: 'Monthly Lease Payment (R)',
                type: 'currency',
                default: 60000,
                min: 0,
                step: 5000,
                category: 'transfer',
                hint: 'Monthly lease payment from Buyer to Developer'
            },
            {
                name: 'implicitInterestRate',
                label: 'Implicit Interest Rate (%)',
                type: 'percent',
                default: 10,
                min: 0,
                max: 25,
                step: 0.5,
                category: 'transfer',
                hint: 'Interest rate implicit in the lease for IFRS 16'
            },
            {
                name: 'transferPriceAtLeaseEnd',
                label: 'Transfer Price at Lease End (R)',
                type: 'currency',
                default: 100000,
                min: 0,
                step: 10000,
                category: 'transfer',
                hint: 'Nominal transfer price at end of lease (often minimal)'
            },
            {
                name: 'guaranteedResidualValue',
                label: 'Guaranteed Residual Value (R)',
                type: 'currency',
                default: 0,
                min: 0,
                step: 10000,
                category: 'transfer',
                hint: 'Amount Buyer guarantees asset will be worth'
            }
        ],
        excludeInputs: ['monthlyServiceFee', 'operationPeriodMonths'],
        transferMethod: 'lease'
    },
    '4H': {
        name: 'Phased Transfer',
        description: 'Modules transfer progressively over time',
        scenario: 'Use for modular development where Buyer can use components independently',
        additionalInputs: [
            {
                name: 'numberOfModules',
                label: 'Number of Modules',
                type: 'number',
                default: 4,
                min: 2,
                max: 10,
                step: 1,
                category: 'transfer',
                hint: 'Number of modules to transfer separately'
            },
            {
                name: 'module1TransferMonth',
                label: 'Module 1 Transfer (Month)',
                type: 'number',
                default: 12,
                min: 1,
                max: 120,
                step: 1,
                category: 'transfer',
                hint: 'Month when Module 1 transfers'
            },
            {
                name: 'module1Price',
                label: 'Module 1 Price (R)',
                type: 'currency',
                default: 500000,
                min: 0,
                step: 25000,
                category: 'transfer',
                hint: 'Transfer price for Module 1'
            },
            {
                name: 'module2TransferMonth',
                label: 'Module 2 Transfer (Month)',
                type: 'number',
                default: 18,
                min: 1,
                max: 120,
                step: 1,
                category: 'transfer',
                hint: 'Month when Module 2 transfers'
            },
            {
                name: 'module2Price',
                label: 'Module 2 Price (R)',
                type: 'currency',
                default: 600000,
                min: 0,
                step: 25000,
                category: 'transfer',
                hint: 'Transfer price for Module 2'
            },
            {
                name: 'module3TransferMonth',
                label: 'Module 3 Transfer (Month)',
                type: 'number',
                default: 24,
                min: 1,
                max: 120,
                step: 1,
                category: 'transfer',
                hint: 'Month when Module 3 transfers'
            },
            {
                name: 'module3Price',
                label: 'Module 3 Price (R)',
                type: 'currency',
                default: 600000,
                min: 0,
                step: 25000,
                category: 'transfer',
                hint: 'Transfer price for Module 3'
            },
            {
                name: 'module4TransferMonth',
                label: 'Module 4 Transfer (Month)',
                type: 'number',
                default: 30,
                min: 1,
                max: 120,
                step: 1,
                category: 'transfer',
                hint: 'Month when Module 4 transfers'
            },
            {
                name: 'module4Price',
                label: 'Module 4 Price (R)',
                type: 'currency',
                default: 800000,
                min: 0,
                step: 25000,
                category: 'transfer',
                hint: 'Transfer price for Module 4'
            }
        ],
        excludeInputs: [],
        transferMethod: 'phased'
    }
};

// ========== CALCULATION FUNCTIONS ==========

/**
 * Calculate three-perspective results for Model 4
 */
function calculate(inputs, variantId, entityConfig = {}, taxParams = {}) {
    const variant = VARIANTS[variantId] || VARIANTS['4A'];

    // Calculate transfer price based on variant method
    const transferDetails = calculateTransferPrice(inputs, variant);

    // Developer perspective calculations
    const developer = calculateDeveloperPerspective(inputs, variant, transferDetails, taxParams);

    // Buyer perspective calculations
    const buyer = calculateBuyerPerspective(inputs, variant, transferDetails, taxParams);

    // Transfer pricing assessment
    const transferPricing = assessTransferPricing(inputs, variant, transferDetails, developer);

    return {
        developer,
        buyer,
        transferPricing,
        metadata: {
            modelId: 'model-4',
            modelName: 'Build-Operate-Transfer (BOT)',
            variantId,
            variantName: variant.name,
            transferMethod: variant.transferMethod,
            calculatedAt: new Date().toISOString()
        }
    };
}

/**
 * Calculate transfer price based on variant method
 */
function calculateTransferPrice(inputs, variant) {
    const developmentCost = inputs.developmentPhaseCost || 0;
    const operationMonths = inputs.operationPeriodMonths || 36;
    const monthlyServiceFee = inputs.monthlyServiceFee || 0;
    const annualServiceRevenue = monthlyServiceFee * 12;

    let transferPrice = 0;
    let transferMonth = inputs.developmentPeriodMonths + operationMonths;
    let method = variant.transferMethod;
    let details = {};

    switch (variant.transferMethod) {
        case 'fixed':
            transferPrice = inputs.fixedTransferPrice || 0;
            const inflationAdj = inputs.inflationAdjustment || 0;
            if (inflationAdj > 0) {
                const years = operationMonths / 12;
                transferPrice = transferPrice * Math.pow(1 + inflationAdj / 100, years);
            }
            details = {
                basePrice: inputs.fixedTransferPrice || 0,
                inflationAdjustment: inflationAdj,
                adjustedPrice: transferPrice
            };
            break;

        case 'formula':
            const formulaType = inputs.formulaType || 'cost-plus';
            const multiplier = (inputs.formulaMultiplier || 25) / 100;
            const floor = inputs.floorPrice || 0;
            const ceiling = inputs.ceilingPrice || Infinity;

            if (formulaType === 'cost-plus') {
                transferPrice = developmentCost * (1 + multiplier);
            } else if (formulaType === 'revenue-multiple') {
                transferPrice = annualServiceRevenue * (1 + multiplier);
            } else if (formulaType === 'ebitda-multiple') {
                const annualOpCost = inputs.annualOperatingCost || 0;
                const ebitda = annualServiceRevenue - annualOpCost;
                transferPrice = ebitda * (1 + multiplier);
            }

            // Apply floor and ceiling
            transferPrice = Math.max(floor, Math.min(ceiling, transferPrice));
            details = {
                formulaType,
                multiplier,
                calculatedPrice: transferPrice,
                floor,
                ceiling
            };
            break;

        case 'fmv':
            transferPrice = inputs.estimatedFMVMid || 0;
            details = {
                low: inputs.estimatedFMVLow || 0,
                mid: inputs.estimatedFMVMid || 0,
                high: inputs.estimatedFMVHigh || 0,
                valuationMethod: inputs.valuationMethod || 'income-approach',
                valuationCost: inputs.valuationCost || 0
            };
            break;

        case 'option':
            const exerciseProb = (inputs.exerciseProbability || 75) / 100;
            transferPrice = (inputs.optionExercisePrice || 0) * exerciseProb;
            details = {
                exercisePrice: inputs.optionExercisePrice || 0,
                premium: inputs.optionPremium || 0,
                probability: exerciseProb,
                expectedValue: transferPrice,
                nonExerciseAction: inputs.nonExerciseAction || 'continue-service'
            };
            break;

        case 'none':
            // BOO - no transfer
            transferPrice = 0;
            transferMonth = null;
            const contractYears = inputs.contractTermYears || 5;
            details = {
                contractTerm: contractYears,
                renewalTerm: inputs.renewalTermYears || 3,
                annualEscalation: inputs.annualEscalation || 5,
                noTransfer: true
            };
            break;

        case 'immediate':
            // BTO - immediate transfer
            transferPrice = inputs.immediateTransferPrice || 0;
            transferMonth = inputs.developmentPeriodMonths || 12;
            details = {
                immediateTransfer: true,
                managedServiceFee: inputs.managedServiceFee || 0,
                serviceTermMonths: inputs.serviceAgreementTermMonths || 36
            };
            break;

        case 'lease':
            // Build-Lease-Transfer (IFRS 16)
            const leaseTermMonths = inputs.leaseTermMonths || 48;
            const monthlyLease = inputs.monthlyLeasePayment || 0;
            const interestRate = (inputs.implicitInterestRate || 10) / 100 / 12;
            const endPrice = inputs.transferPriceAtLeaseEnd || 0;

            // Calculate PV of lease payments
            let pvLeasePayments = 0;
            for (let m = 1; m <= leaseTermMonths; m++) {
                pvLeasePayments += monthlyLease / Math.pow(1 + interestRate, m);
            }
            // Add PV of transfer price at end
            pvLeasePayments += endPrice / Math.pow(1 + interestRate, leaseTermMonths);

            transferPrice = endPrice;  // Nominal transfer at end
            transferMonth = inputs.developmentPeriodMonths + leaseTermMonths;
            details = {
                leaseTerm: leaseTermMonths,
                monthlyPayment: monthlyLease,
                totalLeasePayments: monthlyLease * leaseTermMonths,
                pvLeasePayments: pvLeasePayments,
                implicitRate: inputs.implicitInterestRate || 10,
                endPrice: endPrice,
                rightOfUseAsset: pvLeasePayments,
                guaranteedResidual: inputs.guaranteedResidualValue || 0
            };
            break;

        case 'phased':
            // Phased transfer
            const modules = [];
            const numModules = Math.min(inputs.numberOfModules || 4, 4);

            for (let i = 1; i <= numModules; i++) {
                modules.push({
                    module: i,
                    transferMonth: inputs[`module${i}TransferMonth`] || (12 + (i - 1) * 6),
                    price: inputs[`module${i}Price`] || 500000
                });
            }

            transferPrice = modules.reduce((sum, m) => sum + m.price, 0);
            transferMonth = Math.max(...modules.map(m => m.transferMonth));
            details = {
                modules,
                totalPrice: transferPrice,
                firstTransferMonth: Math.min(...modules.map(m => m.transferMonth)),
                lastTransferMonth: transferMonth
            };
            break;
    }

    return {
        price: transferPrice,
        month: transferMonth,
        method,
        details
    };
}

/**
 * Developer perspective: Revenue, asset, profit, tax
 */
function calculateDeveloperPerspective(inputs, variant, transferDetails, taxParams) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;
    const researchCost = inputs.researchPhaseCost || 0;
    const developmentCost = inputs.developmentPhaseCost || 0;
    const devPeriodMonths = inputs.developmentPeriodMonths || 12;
    const operationMonths = inputs.operationPeriodMonths || 36;
    const monthlyServiceFee = inputs.monthlyServiceFee || 0;
    const annualOpCost = inputs.annualOperatingCost || 0;

    // Initial asset recognition
    const capitalisedAmount = developmentCost;
    const expensedAmount = researchCost;

    // Operation period calculations (varies by variant)
    let operationYears, totalServiceRevenue, totalOperatingCosts;

    if (variant.transferMethod === 'none') {
        // BOO - use contract term
        operationYears = inputs.contractTermYears || 5;
        const escalation = (inputs.annualEscalation || 5) / 100;
        totalServiceRevenue = 0;
        for (let y = 0; y < operationYears; y++) {
            totalServiceRevenue += monthlyServiceFee * 12 * Math.pow(1 + escalation, y);
        }
        totalOperatingCosts = annualOpCost * operationYears;
    } else if (variant.transferMethod === 'immediate') {
        // BTO - no operation period before transfer
        operationYears = 0;
        totalServiceRevenue = 0;
        totalOperatingCosts = 0;
        // Post-transfer service revenue
        const serviceTermMonths = inputs.serviceAgreementTermMonths || 36;
        const managedServiceFee = inputs.managedServiceFee || 0;
        totalServiceRevenue = managedServiceFee * serviceTermMonths;
        totalOperatingCosts = annualOpCost * (serviceTermMonths / 12);
    } else if (variant.transferMethod === 'lease') {
        // Lease - use lease term
        const leaseTermMonths = inputs.leaseTermMonths || 48;
        operationYears = leaseTermMonths / 12;
        totalServiceRevenue = (inputs.monthlyLeasePayment || 0) * leaseTermMonths;
        totalOperatingCosts = annualOpCost * operationYears;
    } else {
        operationYears = operationMonths / 12;
        totalServiceRevenue = monthlyServiceFee * operationMonths;
        totalOperatingCosts = annualOpCost * operationYears;
    }

    // Amortisation during operation (Developer amortises over operation period)
    const amortisationPeriod = variant.transferMethod === 'none' ?
        (inputs.contractTermYears || 5) : (operationMonths / 12);
    const annualAmortisation = amortisationPeriod > 0 ? capitalisedAmount / amortisationPeriod : 0;
    const totalAmortisation = Math.min(capitalisedAmount, annualAmortisation * operationYears);
    const carryingValueAtTransfer = Math.max(0, capitalisedAmount - totalAmortisation);

    // Transfer gain/loss
    const transferPrice = transferDetails.price;
    const transferGain = transferPrice - carryingValueAtTransfer;

    // Revenue summary
    let totalRevenue;
    if (variant.transferMethod === 'option') {
        // Option: include premium
        const premium = inputs.optionPremium || 0;
        totalRevenue = totalServiceRevenue + transferPrice + premium;
    } else {
        totalRevenue = totalServiceRevenue + transferPrice;
    }

    // Profit calculations
    const operatingProfit = totalServiceRevenue - totalOperatingCosts - totalAmortisation;
    const totalProfit = operatingProfit + transferGain - expensedAmount;

    // Tax calculations
    const taxOnOperatingProfit = Math.max(0, operatingProfit) * taxRate;
    // Transfer gain may be CGT or revenue depending on classification
    const taxOnTransferGain = transferGain > 0 ? transferGain * taxRate : 0;
    const totalTax = taxOnOperatingProfit + taxOnTransferGain;
    const netProfitAfterTax = totalProfit - totalTax;

    // Generate amortisation schedule
    const schedule = generateDeveloperAmortisationSchedule(
        capitalisedAmount, amortisationPeriod, annualAmortisation
    );

    return {
        development: {
            totalCost: researchCost + developmentCost,
            researchExpensed: expensedAmount,
            developmentCapitalised: capitalisedAmount
        },
        asset: {
            recognised: capitalisedAmount > 0, // For results-display.js compatibility
            reason: capitalisedAmount > 0
                ? 'Development costs capitalised under IAS 38 during build phase'
                : 'No intangible asset recognised - costs expensed', // For results-display.js compatibility
            initialCarryingValue: capitalisedAmount,
            usefulLife: amortisationPeriod,
            annualAmortisation: annualAmortisation,
            totalAmortisation: totalAmortisation,
            carryingValueAtTransfer: carryingValueAtTransfer,
            schedule: schedule
        },
        operation: {
            periodMonths: variant.transferMethod === 'none' ?
                (inputs.contractTermYears || 5) * 12 : operationMonths,
            periodYears: operationYears,
            monthlyServiceFee: monthlyServiceFee,
            totalServiceRevenue: totalServiceRevenue,
            totalOperatingCosts: totalOperatingCosts,
            grossOperatingProfit: totalServiceRevenue - totalOperatingCosts,
            operatingMargin: totalServiceRevenue > 0 ?
                ((totalServiceRevenue - totalOperatingCosts) / totalServiceRevenue) * 100 : 0
        },
        transfer: {
            price: transferPrice,
            month: transferDetails.month,
            carryingValueAtTransfer: carryingValueAtTransfer,
            gainOnTransfer: transferGain,
            method: transferDetails.method,
            details: transferDetails.details
        },
        revenue: {
            total: totalRevenue, // For results-display.js compatibility
            totalServiceRevenue: totalServiceRevenue,
            transferProceeds: transferPrice,
            totalRevenue: totalRevenue,
            recognitionTiming: 'over-time-and-point',
            recognitionBasis: 'Service revenue over time, transfer at point of transfer',
            breakdown: {
                serviceRevenue: totalServiceRevenue,
                transferProceeds: transferPrice
            }
        },
        // For results-display.js compatibility
        costs: {
            total: researchCost + developmentCost + totalOperatingCosts,
            breakdown: {
                research: researchCost,
                development: developmentCost,
                operating: totalOperatingCosts
            }
        },
        profit: {
            gross: totalProfit, // For results-display.js compatibility
            margin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0, // For results-display.js compatibility
            net: netProfitAfterTax, // For results-display.js compatibility
            grossOperatingProfit: totalServiceRevenue - totalOperatingCosts,
            operatingProfitAfterAmort: operatingProfit,
            transferGain: transferGain,
            totalProfit: totalProfit,
            netProfitAfterTax: netProfitAfterTax
        },
        tax: {
            taxableIncome: operatingProfit + transferGain, // For results-display.js compatibility
            corporateTaxRate: taxRate, // For results-display.js compatibility
            taxPayable: totalTax, // For results-display.js compatibility
            taxableOperatingProfit: operatingProfit,
            taxOnOperatingProfit: taxOnOperatingProfit,
            transferGain: transferGain,
            taxOnTransferGain: taxOnTransferGain,
            totalTax: totalTax,
            effectiveRate: totalProfit > 0 ? (totalTax / totalProfit) * 100 : 0
        },
        cashFlow: {
            developmentOutflow: -(researchCost + developmentCost),
            operatingInflows: totalServiceRevenue,
            operatingOutflows: -totalOperatingCosts,
            transferInflow: transferPrice,
            taxOutflow: -totalTax,
            netCashFlow: totalServiceRevenue + transferPrice - (researchCost + developmentCost) -
                totalOperatingCosts - totalTax
        }
    };
}

/**
 * Buyer perspective: Expense during operation, asset at transfer
 */
function calculateBuyerPerspective(inputs, variant, transferDetails, taxParams) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;
    const usefulLife = inputs.usefulLifeYears || 5;
    const operationMonths = inputs.operationPeriodMonths || 36;
    const monthlyServiceFee = inputs.monthlyServiceFee || 0;
    const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;

    // Operation period expenses (varies by variant)
    let totalServiceFees, assetRecognised, assetRecognitionMonth;

    if (variant.transferMethod === 'none') {
        // BOO - no asset, all expense
        const contractYears = inputs.contractTermYears || 5;
        const escalation = (inputs.annualEscalation || 5) / 100;
        totalServiceFees = 0;
        for (let y = 0; y < contractYears; y++) {
            totalServiceFees += monthlyServiceFee * 12 * Math.pow(1 + escalation, y);
        }
        assetRecognised = 0;
        assetRecognitionMonth = null;
    } else if (variant.transferMethod === 'immediate') {
        // BTO - immediate asset, then service fees
        assetRecognised = inputs.immediateTransferPrice || 0;
        assetRecognitionMonth = inputs.developmentPeriodMonths || 12;
        const serviceTermMonths = inputs.serviceAgreementTermMonths || 36;
        totalServiceFees = (inputs.managedServiceFee || 0) * serviceTermMonths;
    } else if (variant.transferMethod === 'lease') {
        // Lease - IFRS 16 right-of-use asset
        const leaseDetails = transferDetails.details;
        assetRecognised = leaseDetails.rightOfUseAsset || 0;
        assetRecognitionMonth = inputs.developmentPeriodMonths || 12;
        totalServiceFees = 0;  // Lease payments, not service fees
    } else if (variant.transferMethod === 'phased') {
        // Phased - multiple asset recognitions
        totalServiceFees = monthlyServiceFee * operationMonths;
        assetRecognised = transferDetails.price;
        assetRecognitionMonth = transferDetails.details.firstTransferMonth;
    } else {
        // Standard BOT
        totalServiceFees = monthlyServiceFee * operationMonths;
        assetRecognised = transferDetails.price;
        assetRecognitionMonth = transferDetails.month;
    }

    // Post-transfer amortisation (only if asset recognised)
    const annualAmortisation = assetRecognised > 0 ? assetRecognised / usefulLife : 0;
    const taxDepreciation = assetRecognised > 0 ? assetRecognised / section11eYears : 0;
    const timingDifference = annualAmortisation - taxDepreciation;
    const deferredTax = timingDifference * taxRate;

    // Total cost of ownership
    let totalCashPaid;
    if (variant.transferMethod === 'lease') {
        totalCashPaid = transferDetails.details.totalLeasePayments +
            (transferDetails.details.endPrice || 0);
    } else if (variant.transferMethod === 'option') {
        const premium = inputs.optionPremium || 0;
        totalCashPaid = totalServiceFees + transferDetails.price + premium;
    } else {
        totalCashPaid = totalServiceFees + transferDetails.price;
    }

    const capitalisationRatio = totalCashPaid > 0 ? (assetRecognised / totalCashPaid) * 100 : 0;

    // Generate post-transfer amortisation schedule
    const schedule = assetRecognised > 0 ?
        generateBuyerAmortisationSchedule(assetRecognised, usefulLife, section11eYears, taxRate) : [];

    return {
        operation: {
            periodMonths: variant.transferMethod === 'none' ?
                (inputs.contractTermYears || 5) * 12 : operationMonths,
            monthlyServiceFee: monthlyServiceFee,
            totalServiceFees: totalServiceFees,
            expenseRecognition: 'period-expense',
            expenseBasis: variant.transferMethod === 'lease' ?
                'IFRS 16 interest and depreciation' : 'SaaS-style period expense'
        },
        transfer: {
            price: transferDetails.price,
            month: assetRecognitionMonth,
            hasTransfer: variant.transferMethod !== 'none'
        },
        asset: {
            recognised: assetRecognised > 0,
            capitalised: assetRecognised, // For results-display.js compatibility
            expensed: totalServiceFees, // For results-display.js compatibility (service fees are expensed)
            section11eType: inputs.section11eType || 'pc-2yr', // For results-display.js compatibility
            amount: assetRecognised,
            recognitionMonth: assetRecognitionMonth,
            usefulLife: usefulLife,
            amortisationMethod: 'straight-line',
            annualAmortisation: annualAmortisation,
            schedule: schedule
        },
        expenses: {
            schedule: schedule // For results-display.js compatibility (amortisation schedule)
        },
        tax: {
            section11eYears: section11eYears,
            section11eDeduction: taxDepreciation,
            accountingAmortisation: annualAmortisation,
            timingDifference: timingDifference,
            deferredTaxAsset: deferredTax > 0 ? deferredTax : 0,
            deferredTaxLiability: deferredTax < 0 ? Math.abs(deferredTax) : 0,
            annualTaxBenefit: taxDepreciation * taxRate,
            taxBenefit: taxDepreciation * taxRate // For results-display.js compatibility
        },
        totalCost: totalCashPaid, // For results-display.js compatibility (direct value)
        totalCostDetails: {
            serviceFees: totalServiceFees,
            transferPrice: transferDetails.price,
            optionPremium: inputs.optionPremium || 0,
            totalCashPaid: totalCashPaid,
            assetRecognised: assetRecognised,
            expenseRecognised: totalCashPaid - assetRecognised,
            capitalisationRatio: capitalisationRatio
        },
        lease: variant.transferMethod === 'lease' ? {
            rightOfUseAsset: transferDetails.details.rightOfUseAsset,
            leaseLiability: transferDetails.details.rightOfUseAsset,
            totalLeasePayments: transferDetails.details.totalLeasePayments,
            interestExpense: transferDetails.details.totalLeasePayments -
                transferDetails.details.rightOfUseAsset,
            depreciationExpense: transferDetails.details.rightOfUseAsset / usefulLife
        } : null,
        cashFlow: {
            serviceFeeOutflows: -totalServiceFees,
            transferPayment: -transferDetails.price,
            optionPremium: -(inputs.optionPremium || 0),
            totalOutflow: -totalCashPaid,
            taxBenefitPV: taxDepreciation * taxRate * usefulLife * 0.8  // Rough PV
        }
    };
}

/**
 * Generate asset timeline showing when asset shifts from Developer to Buyer
 */
function generateAssetTimeline(inputs, developer, buyer, transferDetails) {
    const timeline = [];
    const devPeriod = inputs.developmentPeriodMonths || 12;
    const opPeriod = inputs.operationPeriodMonths || 36;
    const totalMonths = devPeriod + opPeriod + 12;  // Plus 1 year post-transfer

    const initialAsset = developer.asset.initialCarryingValue;
    const monthlyAmort = developer.asset.annualAmortisation / 12;

    for (let month = 0; month <= totalMonths; month += 6) {
        let developerAsset = 0;
        let buyerAsset = 0;

        if (month <= devPeriod) {
            // Development phase - asset building
            developerAsset = initialAsset * (month / devPeriod);
        } else if (transferDetails.month && month < transferDetails.month) {
            // Operation phase - Developer holds depreciating asset
            const monthsSinceDev = month - devPeriod;
            developerAsset = Math.max(0, initialAsset - (monthlyAmort * monthsSinceDev));
        } else if (transferDetails.month && month >= transferDetails.month) {
            // Post-transfer - Buyer holds asset
            developerAsset = 0;
            const monthsSinceTransfer = month - transferDetails.month;
            const buyerMonthlyAmort = buyer.asset.annualAmortisation / 12;
            buyerAsset = Math.max(0, buyer.asset.amount - (buyerMonthlyAmort * monthsSinceTransfer));
        } else if (!transferDetails.month) {
            // BOO - Developer always holds
            const monthsSinceDev = month - devPeriod;
            developerAsset = Math.max(0, initialAsset - (monthlyAmort * monthsSinceDev));
        }

        timeline.push({
            month,
            developerAsset: Math.round(developerAsset),
            buyerAsset: Math.round(buyerAsset),
            totalAsset: Math.round(developerAsset + buyerAsset)
        });
    }

    return timeline;
}

/**
 * Assess transfer pricing risk
 */
function assessTransferPricing(inputs, variant, transferDetails, developer) {
    // BOO (Build-Operate-Own) has no transfer - transfer pricing not applicable
    if (variant.transferMethod === 'none') {
        return {
            notApplicable: true,
            reason: 'No transfer pricing assessment required - BOO model has no ownership transfer',
            serviceFeeAnalysis: {
                margin: developer.operation.operatingMargin,
                benchmarkRange: '5-15%',
                withinRange: developer.operation.operatingMargin >= 5 && developer.operation.operatingMargin <= 15,
                note: 'Service fee pricing should still follow arm\'s length principles'
            }
        };
    }

    let riskScore, riskLevel, recommendation;
    const risks = [];
    const mitigations = [];

    // Assess service fee risk
    const operatingMargin = developer.operation.operatingMargin;
    if (operatingMargin < 5) {
        risks.push('Service fee margin below typical arm\'s length range (5-15%)');
        riskScore = 50;
    } else if (operatingMargin > 20) {
        risks.push('Service fee margin above typical range - may attract scrutiny');
        riskScore = 60;
    } else {
        mitigations.push('Service fee margin within acceptable range');
        riskScore = 85;
    }

    // Assess transfer price risk based on method
    switch (variant.transferMethod) {
        case 'fmv':
            riskScore = Math.min(95, riskScore + 10);
            mitigations.push('Independent FMV valuation provides strong defence');
            break;
        case 'formula':
            if (inputs.floorPrice && inputs.ceilingPrice) {
                mitigations.push('Floor and ceiling provide bounds on variability');
            }
            break;
        case 'fixed':
            risks.push('Fixed price agreed upfront may diverge from FMV at transfer');
            break;
        case 'option':
            risks.push('Option pricing adds complexity to arm\'s length analysis');
            break;
        case 'lease':
            mitigations.push('Lease terms provide clear pricing mechanism');
            break;
        case 'phased':
            mitigations.push('Phased transfers spread transfer pricing risk');
            break;
    }

    // Determine risk level
    if (riskScore >= 80) {
        riskLevel = 'low';
        recommendation = 'Transaction structure is defensible with appropriate documentation';
    } else if (riskScore >= 60) {
        riskLevel = 'medium';
        recommendation = 'Consider additional documentation or independent valuation';
    } else {
        riskLevel = 'high';
        recommendation = 'Review pricing - consider independent valuation or restructure';
    }

    // For results-display.js compatibility
    const withinRange = operatingMargin >= 5 && operatingMargin <= 15;

    return {
        // For results-display.js compatibility - top-level properties
        margin: operatingMargin,
        method: 'cost-plus',
        withinRange: withinRange,
        benchmarkRange: {
            low: 5,
            high: 15
        },
        // Original detailed properties
        serviceFee: {
            margin: operatingMargin,
            benchmarkRange: '5-15%',
            assessment: withinRange ? 'Within range' : 'Outside typical range'
        },
        transferPrice: {
            method: variant.transferMethod,
            price: transferDetails.price,
            assessment: variant.transferMethod === 'fmv' ?
                'Independent valuation - strong defence' :
                'Document rationale and comparables'
        },
        riskScore: riskScore,
        riskLevel: riskLevel,
        risks: risks,
        mitigations: mitigations,
        recommendation: recommendation,
        documentation: [
            'Written BOT agreement with clear terms',
            'Service fee benchmarking analysis',
            'Transfer price methodology documentation',
            'Functional analysis (Developer vs Buyer roles)',
            'Cost tracking and allocation records',
            variant.transferMethod === 'fmv' ? 'Independent valuation report' : null,
            variant.transferMethod === 'option' ? 'Option valuation methodology' : null
        ].filter(Boolean)
    };
}

/**
 * Generate Developer amortisation schedule
 */
function generateDeveloperAmortisationSchedule(capitalisedAmount, usefulLife, annualAmort) {
    if (capitalisedAmount <= 0 || usefulLife <= 0) return [];

    const schedule = [];
    for (let year = 1; year <= Math.ceil(usefulLife); year++) {
        const amortThisYear = year <= usefulLife ? annualAmort :
            annualAmort * (usefulLife - Math.floor(usefulLife));
        schedule.push({
            year,
            openingBalance: capitalisedAmount - (annualAmort * (year - 1)),
            amortisation: amortThisYear,
            closingBalance: Math.max(0, capitalisedAmount - (annualAmort * year))
        });
    }
    return schedule;
}

/**
 * Generate Buyer amortisation schedule (post-transfer)
 */
function generateBuyerAmortisationSchedule(assetValue, usefulLife, section11eYears, taxRate) {
    if (assetValue <= 0) return [];

    const annualAmort = assetValue / usefulLife;
    const taxDeduction = assetValue / section11eYears;
    const schedule = [];

    for (let year = 1; year <= usefulLife; year++) {
        const taxDeductionThisYear = year <= section11eYears ? taxDeduction : 0;
        const timingDiff = annualAmort - taxDeductionThisYear;

        schedule.push({
            year,
            openingBalance: assetValue - (annualAmort * (year - 1)),
            amortisation: annualAmort,
            closingBalance: Math.max(0, assetValue - (annualAmort * year)),
            taxDeduction: taxDeductionThisYear,
            timingDifference: timingDiff,
            deferredTax: timingDiff * taxRate
        });
    }
    return schedule;
}

// ========== EXPORT ==========

export const MODEL_4_BOT = {
    id: 'model-4',
    name: 'Build-Operate-Transfer (BOT)',
    shortName: 'BOT',
    description: 'Developer builds software, operates it for a period providing SaaS-style access, then transfers ownership to the Buyer.',
    category: 'intercompany',

    inputCategories: INPUT_CATEGORIES,
    baseInputs: BASE_INPUTS,
    variants: VARIANTS,
    defaultVariant: '4A',

    calculate: calculate,

    // UI hints
    icon: '🔄',
    color: '#8B5CF6',  // Purple - transfer/transition

    // Accounting summary
    accountingSummary: {
        developer: 'Capitalise development costs (IAS 38). Recognise service revenue over operation period. Recognise gain/loss at transfer.',
        buyer: 'Expense service fees during operation (SaaS treatment). Recognise intangible asset at transfer price when ownership transfers.'
    }
};
