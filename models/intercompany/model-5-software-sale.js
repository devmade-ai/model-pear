// ========== MODEL 5: SOFTWARE SALE WITH ONGOING SUPPORT ==========
// Developer creates software, sells it outright to Buyer, and optionally provides
// ongoing maintenance/support under a separate service agreement. Ownership
// transfers completely at sale.
//
// Key characteristics:
// - IP ownership: Transfers to Buyer on sale
// - Cash flow: Upfront purchase price + optional recurring support fees
// - Risk allocation: Development risk with Developer; ongoing operational risk with Buyer
// - Developer asset position: None after sale (derecognises)
// - Buyer asset position: High (capitalises purchase price)

// ========== INPUT CATEGORIES ==========

const INPUT_CATEGORIES = {
    project: {
        name: 'Project Parameters',
        description: 'Development timeline and costs',
        icon: '📋'
    },
    sale: {
        name: 'Sale Transaction',
        description: 'Sale price and payment terms',
        icon: '💰'
    },
    support: {
        name: 'Support Agreement',
        description: 'Ongoing support terms (if applicable)',
        icon: '🛠️'
    },
    tax: {
        name: 'Tax Parameters',
        description: 'South African tax settings',
        icon: '📊'
    }
};

// ========== BASE INPUTS (Common to all variants) ==========

const BASE_INPUTS = [
    // Project Parameters
    {
        name: 'projectName',
        label: 'Project Name',
        type: 'text',
        default: 'Software Sale Project',
        category: 'project',
        hint: 'Name of the software sale transaction'
    },
    {
        name: 'totalDevelopmentCost',
        label: 'Total Development Cost (R)',
        type: 'currency',
        default: 1500000,
        min: 0,
        step: 50000,
        category: 'project',
        hint: 'Total cost incurred by Developer to create the software'
    },
    {
        name: 'researchPhaseCost',
        label: 'Research Phase Cost (R)',
        type: 'currency',
        default: 300000,
        min: 0,
        step: 10000,
        category: 'project',
        hint: 'Pre-IAS 38 costs (always expensed by Developer)'
    },
    {
        name: 'developmentPhaseCost',
        label: 'Development Phase Cost (R)',
        type: 'currency',
        default: 1200000,
        min: 0,
        step: 10000,
        category: 'project',
        hint: 'Post-IAS 38 costs (capitalised by Developer)'
    },
    {
        name: 'carryingValueAtSale',
        label: 'Carrying Value at Sale (R)',
        type: 'currency',
        default: 1000000,
        min: 0,
        step: 10000,
        category: 'project',
        hint: 'Net book value of intangible asset at sale date (after any amortisation)'
    },

    // Sale Transaction
    {
        name: 'salePrice',
        label: 'Sale Price (R)',
        type: 'currency',
        default: 2000000,
        min: 0,
        step: 50000,
        category: 'sale',
        hint: 'Agreed sale price for the software'
    },
    {
        name: 'paymentStructure',
        label: 'Payment Structure',
        type: 'select',
        default: 'lump-sum',
        options: [
            { value: 'lump-sum', label: 'Lump Sum Payment' },
            { value: 'instalments', label: 'Instalment Payments' },
            { value: 'deferred', label: 'Deferred Payment' }
        ],
        category: 'sale',
        hint: 'How the sale price will be paid'
    },
    {
        name: 'numberOfInstalments',
        label: 'Number of Instalments',
        type: 'number',
        default: 4,
        min: 2,
        max: 24,
        step: 1,
        category: 'sale',
        hint: 'Number of equal instalments (if instalment payment)',
        showIf: (inputs) => inputs.paymentStructure === 'instalments'
    },
    {
        name: 'deferralMonths',
        label: 'Deferral Period (Months)',
        type: 'number',
        default: 12,
        min: 1,
        max: 60,
        step: 1,
        category: 'sale',
        hint: 'Months until payment due (if deferred)',
        showIf: (inputs) => inputs.paymentStructure === 'deferred'
    },

    // Tax Parameters
    {
        name: 'assetClassification',
        label: 'Asset Classification (Developer)',
        type: 'select',
        default: 'capital-asset',
        options: [
            { value: 'capital-asset', label: 'Capital Asset (CGT applies)' },
            { value: 'trading-stock', label: 'Trading Stock (Revenue treatment)' }
        ],
        category: 'tax',
        hint: 'How the software is classified for Developer tax purposes'
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
        name: 'cgtInclusionRate',
        label: 'CGT Inclusion Rate (%)',
        type: 'percent',
        default: 80,
        min: 0,
        max: 100,
        step: 5,
        category: 'tax',
        hint: 'Capital gains tax inclusion rate for companies'
    },
    {
        name: 'section11eType',
        label: 'Section 11(e) Classification',
        type: 'select',
        default: 'pc-2yr',
        options: [
            { value: 'pc-2yr', label: 'PC Software (2 years)' },
            { value: 'mainframe-5yr', label: 'Mainframe Software (5 years)' }
        ],
        category: 'tax',
        hint: 'SARS accelerated depreciation classification (for Buyer)'
    },
    {
        name: 'usefulLifeYears',
        label: 'Useful Life (Years)',
        type: 'number',
        default: 5,
        min: 1,
        max: 20,
        step: 1,
        category: 'tax',
        hint: 'Buyer accounting amortisation period'
    }
];

// ========== VARIANT DEFINITIONS ==========

const VARIANTS = {
    '5A': {
        name: 'Clean Sale',
        description: 'Outright sale with no post-sale obligations',
        scenario: 'Use when Developer wants complete exit and Buyer has internal support capability',
        additionalInputs: [
            {
                name: 'directlyAttributableCosts',
                label: 'Directly Attributable Costs (R)',
                type: 'currency',
                default: 50000,
                min: 0,
                step: 5000,
                category: 'sale',
                hint: 'Implementation, customisation, or other costs Buyer incurs to use the software'
            }
        ],
        excludeInputs: [],
        saleType: 'clean'
    },
    '5B': {
        name: 'Sale Plus Maintenance Agreement',
        description: 'Separate maintenance contract for bug fixes and patches',
        scenario: 'Use when Buyer needs ongoing support and Developer wants recurring revenue',
        additionalInputs: [
            {
                name: 'annualMaintenanceFee',
                label: 'Annual Maintenance Fee (R)',
                type: 'currency',
                default: 150000,
                min: 0,
                step: 10000,
                category: 'support',
                hint: 'Annual fee for maintenance services'
            },
            {
                name: 'maintenanceTermYears',
                label: 'Maintenance Term (Years)',
                type: 'number',
                default: 3,
                min: 1,
                max: 10,
                step: 1,
                category: 'support',
                hint: 'Duration of maintenance agreement'
            },
            {
                name: 'maintenanceEscalation',
                label: 'Annual Escalation (%)',
                type: 'percent',
                default: 5,
                min: 0,
                max: 15,
                step: 0.5,
                category: 'support',
                hint: 'Annual increase in maintenance fee'
            },
            {
                name: 'maintenanceCostRatio',
                label: 'Maintenance Cost Ratio (%)',
                type: 'percent',
                default: 40,
                min: 0,
                max: 100,
                step: 5,
                category: 'support',
                hint: 'Developer costs as percentage of maintenance revenue'
            }
        ],
        excludeInputs: [],
        saleType: 'with-maintenance'
    },
    '5C': {
        name: 'Sale Plus Support and Updates',
        description: 'Ongoing enhancements included in support package',
        scenario: 'Use for rapidly evolving software where Buyer wants update entitlement',
        additionalInputs: [
            {
                name: 'annualSupportFee',
                label: 'Annual Support Fee (R)',
                type: 'currency',
                default: 200000,
                min: 0,
                step: 10000,
                category: 'support',
                hint: 'Annual fee for support and updates'
            },
            {
                name: 'supportTermYears',
                label: 'Support Term (Years)',
                type: 'number',
                default: 5,
                min: 1,
                max: 10,
                step: 1,
                category: 'support',
                hint: 'Duration of support agreement'
            },
            {
                name: 'supportEscalation',
                label: 'Annual Escalation (%)',
                type: 'percent',
                default: 5,
                min: 0,
                max: 15,
                step: 0.5,
                category: 'support',
                hint: 'Annual increase in support fee'
            },
            {
                name: 'updateEntitlement',
                label: 'Update Entitlement',
                type: 'select',
                default: 'all-updates',
                options: [
                    { value: 'minor-only', label: 'Minor Updates Only' },
                    { value: 'major-minor', label: 'Major and Minor Updates' },
                    { value: 'all-updates', label: 'All Updates' }
                ],
                category: 'support',
                hint: 'Scope of updates included'
            },
            {
                name: 'supportCostRatio',
                label: 'Support Cost Ratio (%)',
                type: 'percent',
                default: 50,
                min: 0,
                max: 100,
                step: 5,
                category: 'support',
                hint: 'Developer costs as percentage of support revenue'
            },
            {
                name: 'updateSSPRatio',
                label: 'Update SSP Ratio (%)',
                type: 'percent',
                default: 30,
                min: 0,
                max: 100,
                step: 5,
                category: 'support',
                hint: 'Updates standalone selling price as % of total support'
            }
        ],
        excludeInputs: [],
        saleType: 'with-support-updates'
    },
    '5D': {
        name: 'Sale with Warranty',
        description: 'Warranty period included (assurance-type, not separate performance obligation)',
        scenario: 'Use when standard warranty is appropriate and Developer is confident in quality',
        additionalInputs: [
            {
                name: 'warrantyPeriodMonths',
                label: 'Warranty Period (Months)',
                type: 'number',
                default: 12,
                min: 1,
                max: 36,
                step: 1,
                category: 'support',
                hint: 'Duration of warranty coverage'
            },
            {
                name: 'warrantyScope',
                label: 'Warranty Scope',
                type: 'select',
                default: 'bug-fixes',
                options: [
                    { value: 'bug-fixes', label: 'Bug Fixes Only' },
                    { value: 'performance', label: 'Performance Guarantees' },
                    { value: 'both', label: 'Bug Fixes + Performance' }
                ],
                category: 'support',
                hint: 'What the warranty covers'
            },
            {
                name: 'estimatedWarrantyCostRate',
                label: 'Estimated Warranty Cost (%)',
                type: 'percent',
                default: 3,
                min: 0,
                max: 20,
                step: 0.5,
                category: 'support',
                hint: 'Expected warranty costs as % of sale price'
            }
        ],
        excludeInputs: [],
        saleType: 'with-warranty'
    },
    '5E': {
        name: 'Sale with Buyback Commitment',
        description: 'Developer commits to repurchase under specified conditions',
        scenario: 'Use when financing element desired or Buyer uncertain about long-term needs',
        additionalInputs: [
            {
                name: 'buybackTrigger',
                label: 'Buyback Trigger',
                type: 'select',
                default: 'buyer-option',
                options: [
                    { value: 'buyer-option', label: 'Buyer Option (Put)' },
                    { value: 'developer-option', label: 'Developer Option (Call)' },
                    { value: 'contingent', label: 'Contingent on Events' }
                ],
                category: 'sale',
                hint: 'What triggers the buyback'
            },
            {
                name: 'buybackPrice',
                label: 'Buyback Price (R)',
                type: 'currency',
                default: 1500000,
                min: 0,
                step: 50000,
                category: 'sale',
                hint: 'Price at which Developer will repurchase'
            },
            {
                name: 'buybackProbability',
                label: 'Buyback Probability (%)',
                type: 'percent',
                default: 25,
                min: 0,
                max: 100,
                step: 5,
                category: 'sale',
                hint: 'Estimated probability buyback will occur'
            },
            {
                name: 'buybackWindowMonths',
                label: 'Buyback Window (Months)',
                type: 'number',
                default: 24,
                min: 6,
                max: 60,
                step: 6,
                category: 'sale',
                hint: 'Period during which buyback can be exercised'
            },
            {
                name: 'isFinancingArrangement',
                label: 'Treat as Financing?',
                type: 'select',
                default: 'no',
                options: [
                    { value: 'no', label: 'No - Genuine Sale' },
                    { value: 'yes', label: 'Yes - Financing Arrangement' }
                ],
                category: 'sale',
                hint: 'If buyback highly probable, may be financing, not sale'
            }
        ],
        excludeInputs: [],
        saleType: 'with-buyback'
    },
    '5F': {
        name: 'Sale with Retained Improvements',
        description: 'Buyer acquires current version, Developer retains rights to future versions',
        scenario: 'Use when Developer continuing to develop product line',
        additionalInputs: [
            {
                name: 'currentVersionPrice',
                label: 'Current Version Price (R)',
                type: 'currency',
                default: 1800000,
                min: 0,
                step: 50000,
                category: 'sale',
                hint: 'Sale price for current version'
            },
            {
                name: 'futureVersionRights',
                label: 'Future Version Rights',
                type: 'select',
                default: 'exclusive-developer',
                options: [
                    { value: 'exclusive-developer', label: 'Developer Exclusive' },
                    { value: 'shared', label: 'Shared Rights' },
                    { value: 'buyer-option', label: 'Buyer Has Option' }
                ],
                category: 'sale',
                hint: 'Who owns rights to future versions'
            },
            {
                name: 'futureVersionLicenceFee',
                label: 'Future Version Licence Fee (R)',
                type: 'currency',
                default: 300000,
                min: 0,
                step: 25000,
                category: 'sale',
                hint: 'Fee for Buyer to licence future versions (if applicable)'
            },
            {
                name: 'expectedFutureVersions',
                label: 'Expected Future Versions',
                type: 'number',
                default: 3,
                min: 1,
                max: 10,
                step: 1,
                category: 'sale',
                hint: 'Number of future versions expected over planning horizon'
            }
        ],
        excludeInputs: ['salePrice'],
        saleType: 'retained-improvements'
    },
    '5G': {
        name: 'Asset Sale vs Share Sale',
        description: 'Compare direct IP asset sale vs entity acquisition',
        scenario: 'Use when considering alternative transaction structures for tax efficiency',
        additionalInputs: [
            {
                name: 'transactionType',
                label: 'Transaction Type',
                type: 'select',
                default: 'asset-sale',
                options: [
                    { value: 'asset-sale', label: 'Asset Sale (Direct IP)' },
                    { value: 'share-sale', label: 'Share Sale (Entity)' }
                ],
                category: 'sale',
                hint: 'Type of sale transaction'
            },
            {
                name: 'shareSalePrice',
                label: 'Share Sale Price (R)',
                type: 'currency',
                default: 2200000,
                min: 0,
                step: 50000,
                category: 'sale',
                hint: 'Price for shares (if share sale)'
            },
            {
                name: 'entityNetAssetValue',
                label: 'Entity Net Asset Value (R)',
                type: 'currency',
                default: 1800000,
                min: 0,
                step: 50000,
                category: 'sale',
                hint: 'NAV of entity being sold (if share sale)'
            },
            {
                name: 'entityOtherAssets',
                label: 'Other Entity Assets (R)',
                type: 'currency',
                default: 200000,
                min: 0,
                step: 10000,
                category: 'sale',
                hint: 'Non-IP assets in entity (if share sale)'
            },
            {
                name: 'entityLiabilities',
                label: 'Entity Liabilities (R)',
                type: 'currency',
                default: 100000,
                min: 0,
                step: 10000,
                category: 'sale',
                hint: 'Liabilities in entity (if share sale)'
            }
        ],
        excludeInputs: [],
        saleType: 'asset-vs-share'
    },
    '5H': {
        name: 'Sale with Licence-Back',
        description: 'Developer sells IP but licences it back from Buyer',
        scenario: 'Use when Developer needs cash but wants continued use',
        additionalInputs: [
            {
                name: 'licenceBackType',
                label: 'Licence-Back Type',
                type: 'select',
                default: 'royalty',
                options: [
                    { value: 'royalty', label: 'Royalty-Based' },
                    { value: 'fixed-fee', label: 'Fixed Annual Fee' },
                    { value: 'perpetual', label: 'Perpetual (Prepaid)' }
                ],
                category: 'support',
                hint: 'Type of licence arrangement'
            },
            {
                name: 'licenceBackRoyaltyRate',
                label: 'Licence-Back Royalty (%)',
                type: 'percent',
                default: 5,
                min: 0,
                max: 25,
                step: 0.5,
                category: 'support',
                hint: 'Royalty rate Developer pays Buyer (if royalty-based)'
            },
            {
                name: 'licenceBackFixedFee',
                label: 'Licence-Back Fixed Fee (R/year)',
                type: 'currency',
                default: 100000,
                min: 0,
                step: 10000,
                category: 'support',
                hint: 'Annual fee Developer pays Buyer (if fixed fee)'
            },
            {
                name: 'licenceBackTerm',
                label: 'Licence-Back Term (Years)',
                type: 'number',
                default: 5,
                min: 1,
                max: 20,
                step: 1,
                category: 'support',
                hint: 'Duration of licence-back'
            },
            {
                name: 'developerExpectedRevenue',
                label: 'Developer Expected Revenue (R/year)',
                type: 'currency',
                default: 1000000,
                min: 0,
                step: 50000,
                category: 'support',
                hint: 'Developer expected revenue from software use (for royalty calculation)'
            },
            {
                name: 'licenceBackScope',
                label: 'Licence-Back Scope',
                type: 'select',
                default: 'unlimited',
                options: [
                    { value: 'unlimited', label: 'Unlimited (All Uses)' },
                    { value: 'territory', label: 'Territory Limited' },
                    { value: 'internal', label: 'Internal Use Only' }
                ],
                category: 'support',
                hint: 'Scope of Developer licence-back'
            }
        ],
        excludeInputs: [],
        saleType: 'licence-back'
    }
};

// ========== CALCULATION FUNCTIONS ==========

/**
 * Calculate three-perspective results for Model 5
 */
function calculate(inputs, variantId, entityConfig = {}, taxParams = {}) {
    const variant = VARIANTS[variantId] || VARIANTS['5A'];

    // Developer perspective calculations
    const developer = calculateDeveloperPerspective(inputs, variant, taxParams);

    // Buyer perspective calculations
    const buyer = calculateBuyerPerspective(inputs, variant, taxParams);

    // Combined perspective calculations
    const combined = calculateCombinedPerspective(developer, buyer, entityConfig, inputs, variant);

    // Transfer pricing assessment
    const transferPricing = assessTransferPricing(inputs, variant, developer);

    return {
        developer,
        buyer,
        combined,
        transferPricing,
        metadata: {
            modelId: 'model-5',
            modelName: 'Software Sale with Ongoing Support',
            variantId,
            variantName: variant.name,
            saleType: variant.saleType,
            calculatedAt: new Date().toISOString()
        }
    };
}

/**
 * Developer perspective: Sale proceeds, gain/loss, ongoing revenue
 */
function calculateDeveloperPerspective(inputs, variant, taxParams) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;
    const cgtInclusion = (inputs.cgtInclusionRate || 80) / 100;
    const isCapitalAsset = inputs.assetClassification === 'capital-asset';

    // Get effective sale price based on variant
    let salePrice = inputs.salePrice || 0;
    let effectiveSalePrice = salePrice;

    if (variant.saleType === 'retained-improvements') {
        salePrice = inputs.currentVersionPrice || 0;
        effectiveSalePrice = salePrice;
    } else if (variant.saleType === 'asset-vs-share') {
        if (inputs.transactionType === 'share-sale') {
            effectiveSalePrice = inputs.shareSalePrice || 0;
        }
    }

    // Asset values
    const carryingValue = inputs.carryingValueAtSale || 0;
    const researchCost = inputs.researchPhaseCost || 0;

    // Calculate gain/loss on sale
    let gainOnSale = effectiveSalePrice - carryingValue;
    let taxOnSale = 0;

    // Special handling for buyback variant
    if (variant.saleType === 'with-buyback' && inputs.isFinancingArrangement === 'yes') {
        // Financing arrangement - no sale recognition
        gainOnSale = 0;
        taxOnSale = 0;
    } else {
        // Normal sale - calculate tax
        if (isCapitalAsset) {
            // CGT treatment
            const taxableGain = gainOnSale > 0 ? gainOnSale * cgtInclusion : 0;
            taxOnSale = taxableGain * taxRate;
        } else {
            // Revenue treatment
            taxOnSale = gainOnSale > 0 ? gainOnSale * taxRate : 0;
        }
    }

    // Calculate ongoing revenue (support/maintenance)
    const ongoingRevenue = calculateDeveloperOngoingRevenue(inputs, variant);

    // Warranty provision (5D)
    let warrantyProvision = 0;
    if (variant.saleType === 'with-warranty') {
        const warrantyRate = (inputs.estimatedWarrantyCostRate || 3) / 100;
        warrantyProvision = effectiveSalePrice * warrantyRate;
    }

    // Licence-back costs (5H)
    let licenceBackCosts = 0;
    if (variant.saleType === 'licence-back') {
        licenceBackCosts = calculateLicenceBackCosts(inputs);
    }

    // Calculate net proceeds after tax
    const netProceedsAfterTax = effectiveSalePrice - taxOnSale;

    // Total return calculation
    const totalRevenue = effectiveSalePrice + ongoingRevenue.totalRevenue;
    const totalCosts = carryingValue + ongoingRevenue.totalCosts + warrantyProvision + licenceBackCosts;
    const totalProfit = totalRevenue - totalCosts - researchCost;
    const totalTax = taxOnSale + (ongoingRevenue.totalRevenue - ongoingRevenue.totalCosts) * taxRate;
    const netProfitAfterTax = totalProfit - totalTax;

    return {
        development: {
            totalCost: inputs.totalDevelopmentCost || 0,
            researchExpensed: researchCost,
            developmentCapitalised: inputs.developmentPhaseCost || 0,
            carryingValueAtSale: carryingValue
        },
        sale: {
            price: effectiveSalePrice,
            carryingValue: carryingValue,
            gainOnSale: gainOnSale,
            isCapitalAsset: isCapitalAsset,
            taxTreatment: isCapitalAsset ? 'Capital Gains Tax' : 'Revenue (Income Tax)',
            taxOnSale: taxOnSale,
            netProceedsAfterTax: netProceedsAfterTax,
            paymentStructure: inputs.paymentStructure || 'lump-sum',
            paymentDetails: getPaymentDetails(inputs)
        },
        warranty: variant.saleType === 'with-warranty' ? {
            periodMonths: inputs.warrantyPeriodMonths || 12,
            scope: inputs.warrantyScope || 'bug-fixes',
            provision: warrantyProvision,
            recognitionBasis: 'Assurance-type warranty - provision accrued, no separate revenue'
        } : null,
        buyback: variant.saleType === 'with-buyback' ? {
            trigger: inputs.buybackTrigger || 'buyer-option',
            price: inputs.buybackPrice || 0,
            probability: inputs.buybackProbability || 25,
            windowMonths: inputs.buybackWindowMonths || 24,
            isFinancingArrangement: inputs.isFinancingArrangement === 'yes',
            accountingTreatment: inputs.isFinancingArrangement === 'yes'
                ? 'Financing arrangement - no sale recognised'
                : 'Sale recognised with contingent liability disclosure'
        } : null,
        ongoingRevenue: ongoingRevenue,
        licenceBack: variant.saleType === 'licence-back' ? {
            type: inputs.licenceBackType || 'royalty',
            annualCost: licenceBackCosts / (inputs.licenceBackTerm || 5),
            totalCost: licenceBackCosts,
            termYears: inputs.licenceBackTerm || 5
        } : null,
        // For results-display.js compatibility
        asset: {
            recognised: carryingValue > 0,
            reason: carryingValue > 0
                ? 'Development costs were capitalised under IAS 38 and derecognised on sale'
                : 'No intangible asset was recognised - costs expensed'
        },
        revenue: {
            total: totalRevenue, // For results-display.js compatibility
            saleProceeds: effectiveSalePrice,
            ongoingRevenue: ongoingRevenue.totalRevenue,
            totalRevenue: totalRevenue,
            recognitionTiming: ongoingRevenue.totalRevenue > 0 ? 'point-in-time-and-over-time' : 'point-in-time',
            recognitionBasis: ongoingRevenue.totalRevenue > 0
                ? 'Sale at point of transfer; support over time'
                : 'Full recognition at point of transfer',
            breakdown: {
                saleProceeds: effectiveSalePrice,
                supportRevenue: ongoingRevenue.totalRevenue
            }
        },
        // For results-display.js compatibility
        costs: {
            total: carryingValue + ongoingRevenue.totalCosts + warrantyProvision + licenceBackCosts,
            breakdown: {
                assetCarryingValue: carryingValue,
                supportCosts: ongoingRevenue.totalCosts,
                warrantyProvision: warrantyProvision,
                licenceBackCosts: licenceBackCosts
            }
        },
        profit: {
            gross: totalProfit, // For results-display.js compatibility
            margin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0, // For results-display.js compatibility
            net: netProfitAfterTax, // For results-display.js compatibility
            saleGain: gainOnSale,
            supportMargin: ongoingRevenue.totalRevenue - ongoingRevenue.totalCosts,
            totalProfit: totalProfit,
            netProfitAfterTax: netProfitAfterTax
        },
        tax: {
            taxableIncome: totalProfit, // For results-display.js compatibility
            corporateTaxRate: taxRate, // For results-display.js compatibility
            taxPayable: totalTax, // For results-display.js compatibility
            assetClassification: inputs.assetClassification || 'capital-asset',
            cgtInclusionRate: isCapitalAsset ? cgtInclusion * 100 : null,
            taxOnSale: taxOnSale,
            taxOnSupportIncome: (ongoingRevenue.totalRevenue - ongoingRevenue.totalCosts) * taxRate,
            totalTax: totalTax,
            effectiveRate: totalProfit > 0 ? (totalTax / totalProfit) * 100 : 0
        },
        cashFlow: {
            saleProceeds: effectiveSalePrice,
            ongoingInflows: ongoingRevenue.totalRevenue,
            licenceBackOutflows: -licenceBackCosts,
            taxOutflow: -totalTax,
            netCashFlow: effectiveSalePrice + ongoingRevenue.totalRevenue - licenceBackCosts - totalTax
        },
        balanceSheet: {
            intangibleAssetRemoved: carryingValue,
            warrantyProvision: warrantyProvision,
            deferredRevenue: ongoingRevenue.deferredRevenue || 0
        }
    };
}

/**
 * Calculate Developer ongoing revenue based on variant
 */
function calculateDeveloperOngoingRevenue(inputs, variant) {
    let totalRevenue = 0;
    let totalCosts = 0;
    let deferredRevenue = 0;
    let schedule = [];

    if (variant.saleType === 'with-maintenance') {
        const annualFee = inputs.annualMaintenanceFee || 0;
        const term = inputs.maintenanceTermYears || 3;
        const escalation = (inputs.maintenanceEscalation || 5) / 100;
        const costRatio = (inputs.maintenanceCostRatio || 40) / 100;

        for (let year = 1; year <= term; year++) {
            const yearRevenue = annualFee * Math.pow(1 + escalation, year - 1);
            const yearCost = yearRevenue * costRatio;
            totalRevenue += yearRevenue;
            totalCosts += yearCost;
            schedule.push({
                year,
                revenue: yearRevenue,
                cost: yearCost,
                margin: yearRevenue - yearCost
            });
        }
    } else if (variant.saleType === 'with-support-updates') {
        const annualFee = inputs.annualSupportFee || 0;
        const term = inputs.supportTermYears || 5;
        const escalation = (inputs.supportEscalation || 5) / 100;
        const costRatio = (inputs.supportCostRatio || 50) / 100;

        for (let year = 1; year <= term; year++) {
            const yearRevenue = annualFee * Math.pow(1 + escalation, year - 1);
            const yearCost = yearRevenue * costRatio;
            totalRevenue += yearRevenue;
            totalCosts += yearCost;
            schedule.push({
                year,
                revenue: yearRevenue,
                cost: yearCost,
                margin: yearRevenue - yearCost
            });
        }
    } else if (variant.saleType === 'retained-improvements') {
        // Future version licence revenue
        const futureVersionFee = inputs.futureVersionLicenceFee || 0;
        const expectedVersions = inputs.expectedFutureVersions || 3;
        if (inputs.futureVersionRights === 'exclusive-developer' || inputs.futureVersionRights === 'shared') {
            totalRevenue = futureVersionFee * expectedVersions;
            totalCosts = totalRevenue * 0.3; // Assume 30% development cost
        }
    }

    return {
        totalRevenue,
        totalCosts,
        deferredRevenue,
        schedule,
        hasOngoingRevenue: totalRevenue > 0
    };
}

/**
 * Calculate licence-back costs for 5H
 */
function calculateLicenceBackCosts(inputs) {
    const term = inputs.licenceBackTerm || 5;
    const type = inputs.licenceBackType || 'royalty';

    if (type === 'royalty') {
        const royaltyRate = (inputs.licenceBackRoyaltyRate || 5) / 100;
        const developerRevenue = inputs.developerExpectedRevenue || 0;
        return developerRevenue * royaltyRate * term;
    } else if (type === 'fixed-fee') {
        const annualFee = inputs.licenceBackFixedFee || 0;
        return annualFee * term;
    } else if (type === 'perpetual') {
        // Perpetual is a one-time prepaid amount
        return inputs.licenceBackFixedFee || 0;
    }
    return 0;
}

/**
 * Get payment details based on structure
 */
function getPaymentDetails(inputs) {
    const structure = inputs.paymentStructure || 'lump-sum';
    const salePrice = inputs.salePrice || 0;

    if (structure === 'instalments') {
        const numInstalments = inputs.numberOfInstalments || 4;
        const instalmentAmount = salePrice / numInstalments;
        return {
            type: 'instalments',
            numberOfPayments: numInstalments,
            amountPerPayment: instalmentAmount,
            totalAmount: salePrice
        };
    } else if (structure === 'deferred') {
        const deferralMonths = inputs.deferralMonths || 12;
        return {
            type: 'deferred',
            deferralPeriodMonths: deferralMonths,
            amount: salePrice,
            presentValue: salePrice / Math.pow(1.1, deferralMonths / 12) // Assume 10% discount
        };
    }
    return {
        type: 'lump-sum',
        amount: salePrice
    };
}

/**
 * Buyer perspective: Asset recognition, amortisation, ongoing costs
 */
function calculateBuyerPerspective(inputs, variant, taxParams) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;
    const usefulLife = inputs.usefulLifeYears || 5;
    const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;

    // Calculate asset to be capitalised
    let capitalisedAmount = 0;
    let salePrice = inputs.salePrice || 0;

    if (variant.saleType === 'clean') {
        const directCosts = inputs.directlyAttributableCosts || 0;
        capitalisedAmount = salePrice + directCosts;
    } else if (variant.saleType === 'with-maintenance') {
        // Allocate between software and maintenance using relative SSP
        const annualMaintenance = inputs.annualMaintenanceFee || 0;
        const term = inputs.maintenanceTermYears || 3;
        const totalMaintenanceSSP = annualMaintenance * term;
        const totalSSP = salePrice + totalMaintenanceSSP;
        const softwareAllocation = salePrice * (salePrice / totalSSP);
        capitalisedAmount = softwareAllocation;
    } else if (variant.saleType === 'with-support-updates') {
        // Allocate between software, support, and updates
        const annualSupport = inputs.annualSupportFee || 0;
        const term = inputs.supportTermYears || 5;
        const totalSupportSSP = annualSupport * term;
        const updateSSPRatio = (inputs.updateSSPRatio || 30) / 100;
        const updateSSP = totalSupportSSP * updateSSPRatio;
        const supportOnlySSP = totalSupportSSP * (1 - updateSSPRatio);
        const totalSSP = salePrice + supportOnlySSP + updateSSP;
        const softwareAllocation = salePrice * (salePrice / totalSSP);
        capitalisedAmount = softwareAllocation;
    } else if (variant.saleType === 'with-warranty') {
        // Warranty is assurance-type, so full price capitalised
        capitalisedAmount = salePrice;
    } else if (variant.saleType === 'with-buyback') {
        if (inputs.isFinancingArrangement === 'yes') {
            // Financing - no asset recognised
            capitalisedAmount = 0;
        } else {
            capitalisedAmount = salePrice;
        }
    } else if (variant.saleType === 'retained-improvements') {
        capitalisedAmount = inputs.currentVersionPrice || 0;
    } else if (variant.saleType === 'asset-vs-share') {
        if (inputs.transactionType === 'share-sale') {
            // Share sale - asset is embedded in entity
            const shareSalePrice = inputs.shareSalePrice || 0;
            const otherAssets = inputs.entityOtherAssets || 0;
            const liabilities = inputs.entityLiabilities || 0;
            // Implied IP value = NAV - other assets + liabilities
            capitalisedAmount = shareSalePrice - otherAssets + liabilities;
        } else {
            capitalisedAmount = salePrice;
        }
    } else if (variant.saleType === 'licence-back') {
        capitalisedAmount = salePrice;
    } else {
        capitalisedAmount = salePrice;
    }

    // Calculate amortisation
    const annualAmortisation = capitalisedAmount > 0 ? capitalisedAmount / usefulLife : 0;
    const taxDeduction = capitalisedAmount > 0 ? capitalisedAmount / section11eYears : 0;
    const timingDifference = annualAmortisation - taxDeduction;
    const deferredTax = timingDifference * taxRate;

    // Calculate ongoing costs
    const ongoingCosts = calculateBuyerOngoingCosts(inputs, variant);

    // Securities transfer tax for share sale
    let securitiesTransferTax = 0;
    if (variant.saleType === 'asset-vs-share' && inputs.transactionType === 'share-sale') {
        const shareSalePrice = inputs.shareSalePrice || 0;
        securitiesTransferTax = shareSalePrice * 0.0025; // 0.25%
    }

    // Licence-back revenue for 5H
    let licenceBackRevenue = 0;
    if (variant.saleType === 'licence-back') {
        licenceBackRevenue = calculateLicenceBackCosts(inputs); // Same calculation, from Buyer's perspective it's revenue
    }

    // Total cost of ownership
    const totalCashPaid = salePrice + ongoingCosts.totalCost + securitiesTransferTax;
    const capitalisationRatio = totalCashPaid > 0 ? (capitalisedAmount / totalCashPaid) * 100 : 0;

    // Generate amortisation schedule
    const schedule = generateAmortisationSchedule(capitalisedAmount, usefulLife, section11eYears, taxRate);

    return {
        purchase: {
            salePrice: salePrice,
            directlyAttributableCosts: inputs.directlyAttributableCosts || 0,
            securitiesTransferTax: securitiesTransferTax,
            totalPurchaseCost: salePrice + (inputs.directlyAttributableCosts || 0) + securitiesTransferTax
        },
        allocation: variant.saleType === 'with-maintenance' || variant.saleType === 'with-support-updates' ? {
            totalTransactionPrice: salePrice,
            softwareAllocation: capitalisedAmount,
            supportAllocation: salePrice - capitalisedAmount,
            method: 'Relative standalone selling price (IFRS 15)'
        } : null,
        asset: {
            recognised: capitalisedAmount > 0,
            capitalised: capitalisedAmount, // For results-display.js compatibility
            expensed: ongoingCosts.totalCost, // For results-display.js compatibility (ongoing costs are expensed)
            section11eType: inputs.section11eType || 'pc-2yr', // For results-display.js compatibility
            amount: capitalisedAmount,
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
            section11eDeduction: taxDeduction,
            accountingAmortisation: annualAmortisation,
            timingDifference: timingDifference,
            deferredTaxAsset: deferredTax > 0 ? deferredTax : 0,
            deferredTaxLiability: deferredTax < 0 ? Math.abs(deferredTax) : 0,
            annualTaxBenefit: taxDeduction * taxRate,
            taxBenefit: taxDeduction * taxRate // For results-display.js compatibility
        },
        ongoingCosts: ongoingCosts,
        licenceBack: variant.saleType === 'licence-back' ? {
            totalRevenue: licenceBackRevenue,
            annualRevenue: licenceBackRevenue / (inputs.licenceBackTerm || 5),
            termYears: inputs.licenceBackTerm || 5
        } : null,
        shareSale: variant.saleType === 'asset-vs-share' && inputs.transactionType === 'share-sale' ? {
            sharePurchasePrice: inputs.shareSalePrice || 0,
            entityNAV: inputs.entityNetAssetValue || 0,
            impliedIPValue: capitalisedAmount,
            securitiesTransferTax: securitiesTransferTax,
            accountingTreatment: 'Acquisition accounting - allocate purchase price to identifiable assets'
        } : null,
        totalCost: totalCashPaid, // For results-display.js compatibility (direct value)
        totalCostDetails: {
            purchasePrice: salePrice,
            ongoingCosts: ongoingCosts.totalCost,
            securitiesTransferTax: securitiesTransferTax,
            totalCashPaid: totalCashPaid,
            assetRecognised: capitalisedAmount,
            expenseRecognised: totalCashPaid - capitalisedAmount,
            capitalisationRatio: capitalisationRatio
        },
        cashFlow: {
            purchasePayment: -salePrice,
            directCosts: -(inputs.directlyAttributableCosts || 0),
            securitiesTransferTax: -securitiesTransferTax,
            ongoingPayments: -ongoingCosts.totalCost,
            licenceBackRevenue: licenceBackRevenue,
            totalOutflow: -(totalCashPaid - licenceBackRevenue),
            taxBenefitPV: taxDeduction * taxRate * section11eYears * 0.85 // Rough PV
        }
    };
}

/**
 * Calculate Buyer ongoing costs based on variant
 */
function calculateBuyerOngoingCosts(inputs, variant) {
    let totalCost = 0;
    let schedule = [];

    if (variant.saleType === 'with-maintenance') {
        const annualFee = inputs.annualMaintenanceFee || 0;
        const term = inputs.maintenanceTermYears || 3;
        const escalation = (inputs.maintenanceEscalation || 5) / 100;

        for (let year = 1; year <= term; year++) {
            const yearCost = annualFee * Math.pow(1 + escalation, year - 1);
            totalCost += yearCost;
            schedule.push({ year, cost: yearCost });
        }
    } else if (variant.saleType === 'with-support-updates') {
        const annualFee = inputs.annualSupportFee || 0;
        const term = inputs.supportTermYears || 5;
        const escalation = (inputs.supportEscalation || 5) / 100;

        for (let year = 1; year <= term; year++) {
            const yearCost = annualFee * Math.pow(1 + escalation, year - 1);
            totalCost += yearCost;
            schedule.push({ year, cost: yearCost });
        }
    } else if (variant.saleType === 'retained-improvements') {
        // Future version licence fees
        const futureVersionFee = inputs.futureVersionLicenceFee || 0;
        const expectedVersions = inputs.expectedFutureVersions || 3;
        if (inputs.futureVersionRights !== 'buyer-option') {
            totalCost = futureVersionFee * expectedVersions;
        }
    }

    return {
        totalCost,
        schedule,
        hasOngoingCosts: totalCost > 0
    };
}

/**
 * Generate amortisation schedule
 */
function generateAmortisationSchedule(assetValue, usefulLife, section11eYears, taxRate) {
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

/**
 * Combined/Consolidation perspective
 */
function calculateCombinedPerspective(developer, buyer, entityConfig, inputs, variant) {
    const isConsolidated = entityConfig?.relationship?.consolidationRequired ?? true;

    // Intercompany profit elimination
    const saleGain = developer.sale.gainOnSale;
    const supportMargin = developer.profit.supportMargin || 0;
    const totalProfitToEliminate = saleGain + supportMargin;

    // Asset efficiency - use buyer.totalCost directly (now a number)
    const totalCashExchanged = buyer.totalCost;
    const finalAssetValue = buyer.asset.amount;
    const assetEfficiency = totalCashExchanged > 0 ?
        (finalAssetValue / totalCashExchanged) * 100 : 0;

    // Consolidated asset position
    const consolidatedAsset = isConsolidated ?
        Math.max(0, finalAssetValue - saleGain) : finalAssetValue;

    // Group tax cost calculation
    const groupTaxCost = developer.tax.totalTax - (buyer.tax.annualTaxBenefit * buyer.tax.section11eYears);

    return {
        elimination: {
            required: isConsolidated && totalProfitToEliminate > 0,
            profitEliminated: totalProfitToEliminate, // For results-display.js compatibility
            saleGain: saleGain,
            supportMargin: supportMargin,
            totalProfitEliminated: totalProfitToEliminate,
            assetWriteDown: saleGain > 0 ? saleGain : 0,
            assetAdjustment: saleGain > 0 ? saleGain : 0, // For results-display.js compatibility
            journalEntry: isConsolidated && totalProfitToEliminate > 0 ? {
                debit: { account: 'Retained Earnings / Gain on Sale', amount: totalProfitToEliminate },
                credit: { account: 'Intangible Asset', amount: totalProfitToEliminate },
                credit2: { account: 'Cost of Sales', amount: 0 }
            } : null
        },
        assetEfficiency: {
            developerAsset: developer.development.carryingValueAtSale, // For results-display.js compatibility
            developerCarryingValue: developer.development.carryingValueAtSale,
            buyerAsset: finalAssetValue,
            groupAsset: consolidatedAsset,
            duplication: 0, // For results-display.js compatibility
            totalCashExchanged: totalCashExchanged,
            efficiencyRatio: assetEfficiency / 100, // For results-display.js compatibility (as decimal)
            efficiencyAssessment: assetEfficiency >= 80 ?
                'High efficiency - majority capitalised' :
                assetEfficiency >= 50 ?
                    'Moderate efficiency - significant portion capitalised' :
                    'Low efficiency - majority expensed (bundled pricing)'
        },
        assetPosition: {
            beforeSale: {
                developer: developer.development.carryingValueAtSale,
                buyer: 0,
                total: developer.development.carryingValueAtSale
            },
            afterSale: {
                developer: 0,
                buyer: finalAssetValue,
                total: finalAssetValue
            },
            consolidated: consolidatedAsset,
            cleanTransfer: true
        },
        cashFlow: {
            developerNetCash: developer.cashFlow.saleProceeds + developer.cashFlow.ongoingInflows - developer.tax.totalTax, // For results-display.js compatibility
            buyerNetCash: buyer.cashFlow.totalOutflow + (buyer.tax.annualTaxBenefit * buyer.tax.section11eYears), // For results-display.js compatibility
            developerTotalInflow: developer.cashFlow.saleProceeds + developer.cashFlow.ongoingInflows,
            buyerTotalOutflow: buyer.cashFlow.totalOutflow,
            netIntercompany: 0,
            groupNetCash: developer.profit.net, // For results-display.js compatibility
            externalImpact: developer.cashFlow.licenceBackOutflows || 0
        },
        valueCreation: {
            totalDeveloperRevenue: developer.revenue.totalRevenue,
            totalBuyerCost: buyer.totalCost,
            developerProfit: developer.profit.totalProfit,
            buyerAssetAcquired: finalAssetValue,
            consolidatedAsset: consolidatedAsset
        },
        taxPosition: {
            developerTax: developer.tax.totalTax,
            buyerTaxBenefit: buyer.tax.annualTaxBenefit * buyer.tax.section11eYears,
            netTaxCost: groupTaxCost,
            timing: 'Developer tax immediate; Buyer benefit over Section 11(e) period'
        },
        metrics: {
            totalTransactionValue: totalCashExchanged,
            groupTaxCost: groupTaxCost, // For results-display.js compatibility
            developerMargin: developer.profit.totalProfit > 0 ?
                (developer.profit.totalProfit / developer.revenue.totalRevenue) * 100 : 0,
            buyerCapitalisationRatio: buyer.totalCostDetails.capitalisationRatio,
            combinedTaxRate: developer.revenue.totalRevenue > 0 ?
                (developer.tax.totalTax / developer.revenue.totalRevenue) * 100 : 0
        }
    };
}

/**
 * Assess transfer pricing risk
 */
function assessTransferPricing(inputs, variant, developer) {
    let riskScore = 70; // Base score
    const risks = [];
    const mitigations = [];

    // Assess sale price vs carrying value
    const carryingValue = inputs.carryingValueAtSale || 0;
    const salePrice = inputs.salePrice || 0;
    const markup = carryingValue > 0 ? ((salePrice - carryingValue) / carryingValue) * 100 : 0;

    if (markup < 10) {
        risks.push('Sale price close to carrying value - may lack adequate return for Developer');
        riskScore -= 10;
    } else if (markup > 100) {
        risks.push('Sale price significantly above carrying value - ensure FMV documentation');
        riskScore -= 15;
    } else {
        mitigations.push('Sale price within reasonable range of cost-plus expectations');
        riskScore += 5;
    }

    // Variant-specific risks
    switch (variant.saleType) {
        case 'clean':
            mitigations.push('Clean sale structure simplifies transfer pricing');
            riskScore += 10;
            break;
        case 'with-maintenance':
        case 'with-support-updates':
            const supportFee = inputs.annualMaintenanceFee || inputs.annualSupportFee || 0;
            if (supportFee > 0) {
                mitigations.push('Separate support agreement provides benchmarking clarity');
            }
            break;
        case 'with-buyback':
            risks.push('Buyback arrangement adds complexity - document business rationale');
            riskScore -= 15;
            if (inputs.isFinancingArrangement === 'yes') {
                risks.push('Financing treatment may face scrutiny - ensure substance');
            }
            break;
        case 'licence-back':
            risks.push('Sale-leaseback structure requires careful economic substance analysis');
            risks.push('Circular cash flows may attract tax authority scrutiny');
            riskScore -= 20;
            break;
        case 'asset-vs-share':
            if (inputs.transactionType === 'share-sale') {
                mitigations.push('Share sale avoids direct IP valuation challenges');
            }
            break;
    }

    // Determine risk level
    let riskLevel, recommendation;
    if (riskScore >= 75) {
        riskLevel = 'low';
        recommendation = 'Transaction structure is defensible with standard documentation';
    } else if (riskScore >= 50) {
        riskLevel = 'medium';
        recommendation = 'Consider independent valuation or enhanced documentation';
    } else {
        riskLevel = 'high';
        recommendation = 'Obtain independent valuation and document business rationale thoroughly';
    }

    // For results-display.js compatibility
    const withinRange = markup >= 10 && markup <= 100;

    return {
        // For results-display.js compatibility - top-level properties
        margin: markup,
        method: 'comparable-uncontrolled-price',
        withinRange: withinRange,
        benchmarkRange: {
            low: 10,
            high: 100
        },
        // Original detailed properties
        salePrice: {
            amount: salePrice,
            carryingValue: carryingValue,
            markup: markup,
            assessment: withinRange ? 'Within acceptable range' : 'Outside typical range - document basis'
        },
        supportFees: variant.saleType === 'with-maintenance' || variant.saleType === 'with-support-updates' ? {
            annualFee: inputs.annualMaintenanceFee || inputs.annualSupportFee || 0,
            benchmarkRange: '10-25% of software value per annum',
            assessment: 'Compare to market rates for similar support'
        } : null,
        riskScore: riskScore,
        riskLevel: riskLevel,
        risks: risks,
        mitigations: mitigations,
        recommendation: recommendation,
        documentation: [
            'Written sale agreement with clear terms',
            'Valuation report or methodology documentation',
            'Functional analysis (Developer vs Buyer)',
            'Comparable transaction analysis',
            variant.saleType === 'with-maintenance' || variant.saleType === 'with-support-updates' ?
                'Support fee benchmarking analysis' : null,
            variant.saleType === 'with-buyback' ?
                'Business rationale for buyback provision' : null,
            variant.saleType === 'licence-back' ?
                'Economic substance documentation' : null
        ].filter(Boolean)
    };
}

// ========== EXPORT ==========

export const MODEL_5_SOFTWARE_SALE = {
    id: 'model-5',
    name: 'Software Sale with Ongoing Support',
    shortName: 'Software Sale',
    description: 'Developer creates software, sells it outright to Buyer, with optional ongoing support arrangement. Ownership transfers completely at sale.',
    category: 'intercompany',

    inputCategories: INPUT_CATEGORIES,
    baseInputs: BASE_INPUTS,
    variants: VARIANTS,
    defaultVariant: '5A',

    calculate: calculate,

    // UI hints
    icon: '🏷️',
    color: '#EC4899', // Pink - sale/transaction

    // Accounting summary
    accountingSummary: {
        developer: 'Derecognise intangible asset at carrying value. Recognise gain/loss on sale (CGT or revenue treatment). Support revenue recognised over time.',
        buyer: 'Capitalise purchase price (allocate if bundled with support - IFRS 15). Amortise over useful life. Section 11(e) accelerated tax deduction.',
        consolidation: 'Eliminate Developer gain on sale. Buyer asset reduced by unrealised profit on consolidation. Support margin eliminated.'
    }
};
