// ========== MODEL 2: SOFTWARE LICENCE WITH ROYALTIES ==========
// Developer develops and owns the IP, then grants a licence to the Buyer.
// Buyer pays upfront fees, ongoing royalties, or both.
//
// Key characteristics:
// - Developer: Retains IP, recognises intangible asset, earns licence/royalty revenue
// - Buyer: Capitalises licence cost, expenses royalties as incurred
// - Transfer pricing: Arm's length royalty rates (typically 1-25% depending on industry)

// ========== INPUT CATEGORIES ==========

const INPUT_CATEGORIES = {
    development: {
        name: 'Development Costs',
        description: 'Developer software development costs and asset recognition',
        icon: '💻'
    },
    licence: {
        name: 'Licence Terms',
        description: 'Licence structure and rights granted',
        icon: '📜'
    },
    pricing: {
        name: 'Pricing Structure',
        description: 'Fees, royalties, and payment terms',
        icon: '💰'
    },
    buyer: {
        name: 'Buyer Treatment',
        description: 'Buyer accounting and asset treatment',
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
    // Development Costs (Developer side)
    {
        name: 'projectName',
        label: 'Project Name',
        type: 'text',
        default: 'Software Licence Agreement',
        category: 'development',
        hint: 'Name of the software product being licensed'
    },
    {
        name: 'developmentCost',
        label: 'Total Development Cost (R)',
        type: 'currency',
        default: 2000000,
        min: 0,
        step: 50000,
        category: 'development',
        hint: 'Total cost incurred by Developer to create the software'
    },
    {
        name: 'researchPhaseCost',
        label: 'Research Phase Cost (R)',
        type: 'currency',
        default: 400000,
        min: 0,
        step: 25000,
        category: 'development',
        hint: 'Costs before IAS 38 capitalisation criteria met (expensed)'
    },
    {
        name: 'developmentPhaseCost',
        label: 'Development Phase Cost (R)',
        type: 'currency',
        default: 1600000,
        min: 0,
        step: 25000,
        category: 'development',
        hint: 'Costs after IAS 38 criteria met (capitalised by Developer)'
    },
    {
        name: 'developerUsefulLife',
        label: 'Developer Asset Useful Life (Years)',
        type: 'number',
        default: 5,
        min: 1,
        max: 20,
        step: 1,
        category: 'development',
        hint: 'Expected useful life of the software asset for Developer'
    },

    // Licence Terms
    {
        name: 'licenceType',
        label: 'Licence Type',
        type: 'select',
        default: 'perpetual',
        options: [
            { value: 'perpetual', label: 'Perpetual (indefinite use)' },
            { value: 'term', label: 'Term (fixed period)' }
        ],
        category: 'licence',
        hint: 'Whether the licence grants indefinite or time-limited use'
    },
    {
        name: 'licenceTerm',
        label: 'Licence Term (Years)',
        type: 'number',
        default: 5,
        min: 1,
        max: 20,
        step: 1,
        category: 'licence',
        hint: 'Duration of term licence (ignored for perpetual)',
        conditionalOn: { field: 'licenceType', value: 'term' }
    },
    {
        name: 'exclusivity',
        label: 'Exclusivity',
        type: 'select',
        default: 'non-exclusive',
        options: [
            { value: 'exclusive', label: 'Exclusive (sole rights)' },
            { value: 'non-exclusive', label: 'Non-Exclusive (shared rights)' }
        ],
        category: 'licence',
        hint: 'Whether Buyer has sole rights or Developer can license to others'
    },
    {
        name: 'territory',
        label: 'Territory',
        type: 'select',
        default: 'south-africa',
        options: [
            { value: 'south-africa', label: 'South Africa' },
            { value: 'africa', label: 'Africa' },
            { value: 'global', label: 'Global' }
        ],
        category: 'licence',
        hint: 'Geographic scope of the licence'
    },
    {
        name: 'sourceCodeAccess',
        label: 'Source Code Access',
        type: 'select',
        default: 'none',
        options: [
            { value: 'none', label: 'No Access' },
            { value: 'escrow', label: 'Escrow Only' },
            { value: 'full', label: 'Full Source Code' }
        ],
        category: 'licence',
        hint: 'Level of source code access granted to Buyer'
    },

    // Buyer Treatment
    {
        name: 'buyerUsefulLife',
        label: 'Buyer Licence Useful Life (Years)',
        type: 'number',
        default: 5,
        min: 1,
        max: 20,
        step: 1,
        category: 'buyer',
        hint: 'Shorter of licence term or expected useful life'
    },
    {
        name: 'implementationCosts',
        label: 'Implementation Costs (R)',
        type: 'currency',
        default: 100000,
        min: 0,
        step: 10000,
        category: 'buyer',
        hint: 'Directly attributable costs to bring licence into use (capitalised)'
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
        hint: 'Section 11(e) tax depreciation. Most software qualifies for 2-year treatment. Select 5-year only for mainframe/complex enterprise systems.'
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
        hint: 'South African corporate income tax rate (currently 27%)'
    }
];

// ========== VARIANT DEFINITIONS ==========

const VARIANTS = {
    '2A': {
        name: 'Perpetual Licence (Upfront Payment)',
        description: 'One-time payment for indefinite use rights',
        scenario: 'Buyer wants permanent rights without ongoing obligations; Developer needs upfront capital',
        additionalInputs: [
            {
                name: 'upfrontLicenceFee',
                label: 'Upfront Licence Fee (R)',
                type: 'currency',
                default: 500000,
                min: 0,
                step: 25000,
                category: 'pricing',
                hint: 'One-time payment for perpetual licence rights'
            }
        ],
        excludeInputs: ['licenceTerm']
    },
    '2B': {
        name: 'Term Licence (Annual/Multi-Year)',
        description: 'Fixed period licence with renewal option',
        scenario: 'Buyer uncertain about long-term needs; Developer wants ongoing relationship',
        additionalInputs: [
            {
                name: 'annualLicenceFee',
                label: 'Annual Licence Fee (R)',
                type: 'currency',
                default: 150000,
                min: 0,
                step: 10000,
                category: 'pricing',
                hint: 'Annual fee for term licence'
            },
            {
                name: 'renewalExpected',
                label: 'Renewal Expected',
                type: 'select',
                default: 'yes',
                options: [
                    { value: 'yes', label: 'Yes - likely to renew' },
                    { value: 'no', label: 'No - single term only' }
                ],
                category: 'licence',
                hint: 'Whether renewal is reasonably certain'
            }
        ],
        excludeInputs: []
    },
    '2C': {
        name: 'Usage-Based Royalties',
        description: 'Pay per transaction/user/metric',
        scenario: 'Usage is variable; align cost with value received',
        additionalInputs: [
            {
                name: 'royaltyRate',
                label: 'Royalty Rate (%)',
                type: 'percent',
                default: 5,
                min: 0,
                max: 50,
                step: 0.5,
                category: 'pricing',
                hint: 'Percentage per unit of usage (arm\'s length: 1-25%)'
            },
            {
                name: 'usageMetric',
                label: 'Usage Metric',
                type: 'select',
                default: 'transactions',
                options: [
                    { value: 'transactions', label: 'Transactions' },
                    { value: 'users', label: 'Users' },
                    { value: 'revenue', label: 'Revenue Generated' },
                    { value: 'api-calls', label: 'API Calls' }
                ],
                category: 'pricing',
                hint: 'Basis for calculating royalty payments'
            },
            {
                name: 'estimatedAnnualUsage',
                label: 'Estimated Annual Usage Volume',
                type: 'number',
                default: 100000,
                min: 0,
                step: 10000,
                category: 'pricing',
                hint: 'Expected annual volume of the usage metric'
            },
            {
                name: 'usageUnitValue',
                label: 'Value per Usage Unit (R)',
                type: 'currency',
                default: 10,
                min: 0,
                step: 1,
                category: 'pricing',
                hint: 'Revenue or value per unit (for calculating royalty base)'
            }
        ],
        excludeInputs: []
    },
    '2D': {
        name: 'Minimum Guarantee Plus Royalties',
        description: 'Floor payment plus variable upside',
        scenario: 'Developer needs revenue certainty; Buyer expects high usage',
        additionalInputs: [
            {
                name: 'minimumAnnualGuarantee',
                label: 'Minimum Annual Guarantee (R)',
                type: 'currency',
                default: 200000,
                min: 0,
                step: 25000,
                category: 'pricing',
                hint: 'Floor payment regardless of usage'
            },
            {
                name: 'royaltyRate',
                label: 'Royalty Rate Above Threshold (%)',
                type: 'percent',
                default: 3,
                min: 0,
                max: 50,
                step: 0.5,
                category: 'pricing',
                hint: 'Rate for usage above the guaranteed level'
            },
            {
                name: 'usageThreshold',
                label: 'Usage Threshold (before royalties)',
                type: 'number',
                default: 50000,
                min: 0,
                step: 5000,
                category: 'pricing',
                hint: 'Usage level covered by minimum guarantee'
            },
            {
                name: 'estimatedAnnualUsage',
                label: 'Estimated Annual Usage',
                type: 'number',
                default: 100000,
                min: 0,
                step: 10000,
                category: 'pricing',
                hint: 'Expected annual usage volume'
            },
            {
                name: 'usageUnitValue',
                label: 'Value per Usage Unit (R)',
                type: 'currency',
                default: 10,
                min: 0,
                step: 1,
                category: 'pricing',
                hint: 'Revenue per unit for royalty calculation'
            }
        ],
        excludeInputs: []
    },
    '2E': {
        name: 'Revenue Share / Profit Share',
        description: 'Percentage of Buyer earnings',
        scenario: 'Strong alignment of interests; software directly generates Buyer revenue',
        additionalInputs: [
            {
                name: 'sharePercentage',
                label: 'Share Percentage (%)',
                type: 'percent',
                default: 15,
                min: 0,
                max: 50,
                step: 1,
                category: 'pricing',
                hint: 'Developer\'s share of Buyer\'s earnings'
            },
            {
                name: 'shareBasis',
                label: 'Share Basis',
                type: 'select',
                default: 'gross-revenue',
                options: [
                    { value: 'gross-revenue', label: 'Gross Revenue' },
                    { value: 'net-revenue', label: 'Net Revenue' },
                    { value: 'gross-profit', label: 'Gross Profit' },
                    { value: 'net-profit', label: 'Net Profit' }
                ],
                category: 'pricing',
                hint: 'Basis for calculating Developer share'
            },
            {
                name: 'estimatedAnnualBuyerRevenue',
                label: 'Estimated Annual Buyer Revenue (R)',
                type: 'currency',
                default: 2000000,
                min: 0,
                step: 100000,
                category: 'pricing',
                hint: 'Expected annual revenue generated using the software'
            },
            {
                name: 'buyerGrossMargin',
                label: 'Buyer Gross Margin (%)',
                type: 'percent',
                default: 40,
                min: 0,
                max: 100,
                step: 5,
                category: 'pricing',
                hint: 'Buyer\'s gross margin (for profit-based calculations)'
            }
        ],
        excludeInputs: []
    },
    '2F': {
        name: 'White-Label / Reseller Licence',
        description: 'Buyer rebrands and sells to end customers',
        scenario: 'Developer lacks distribution; Buyer has market access',
        additionalInputs: [
            {
                name: 'distributionFee',
                label: 'Upfront Distribution Fee (R)',
                type: 'currency',
                default: 100000,
                min: 0,
                step: 25000,
                category: 'pricing',
                hint: 'Upfront payment for distribution rights'
            },
            {
                name: 'perSaleRoyalty',
                label: 'Per-Sale Royalty Rate (%)',
                type: 'percent',
                default: 20,
                min: 0,
                max: 50,
                step: 1,
                category: 'pricing',
                hint: 'Developer\'s share of each end-customer sale'
            },
            {
                name: 'estimatedEndCustomerSales',
                label: 'Estimated Annual End-Customer Sales',
                type: 'number',
                default: 50,
                min: 0,
                step: 5,
                category: 'pricing',
                hint: 'Expected number of end-customer sales per year'
            },
            {
                name: 'endCustomerPricePoint',
                label: 'End-Customer Price Point (R)',
                type: 'currency',
                default: 50000,
                min: 0,
                step: 5000,
                category: 'pricing',
                hint: 'Typical price charged to end customers'
            }
        ],
        excludeInputs: []
    },
    '2G': {
        name: 'Exclusive vs Non-Exclusive Licence',
        description: 'Compare sole rights versus shared rights',
        scenario: 'Buyer needs competitive protection; willing to pay premium',
        additionalInputs: [
            {
                name: 'baseLicenceFee',
                label: 'Base Licence Fee (Non-Exclusive) (R)',
                type: 'currency',
                default: 300000,
                min: 0,
                step: 25000,
                category: 'pricing',
                hint: 'Licence fee for non-exclusive rights'
            },
            {
                name: 'exclusivityPremium',
                label: 'Exclusivity Premium (%)',
                type: 'percent',
                default: 50,
                min: 0,
                max: 200,
                step: 10,
                category: 'pricing',
                hint: 'Premium for exclusive rights (typically 20-100%)'
            },
            {
                name: 'estimatedOtherLicensees',
                label: 'Estimated Other Licensees (if non-exclusive)',
                type: 'number',
                default: 3,
                min: 0,
                max: 50,
                step: 1,
                category: 'pricing',
                hint: 'Number of other licensees Developer may grant'
            }
        ],
        excludeInputs: []
    },
    '2H': {
        name: 'Source Code Licence / Escrow',
        description: 'Access to source code included',
        scenario: 'Buyer concerned about Developer continuity; may need to self-maintain',
        additionalInputs: [
            {
                name: 'baseLicenceFee',
                label: 'Base Licence Fee (R)',
                type: 'currency',
                default: 400000,
                min: 0,
                step: 25000,
                category: 'pricing',
                hint: 'Licence fee excluding source code access'
            },
            {
                name: 'sourceCodeFee',
                label: 'Source Code Access Fee (R)',
                type: 'currency',
                default: 150000,
                min: 0,
                step: 10000,
                category: 'pricing',
                hint: 'Additional fee for source code access (if full access)'
            },
            {
                name: 'escrowSetupFee',
                label: 'Escrow Setup Fee (R)',
                type: 'currency',
                default: 25000,
                min: 0,
                step: 5000,
                category: 'pricing',
                hint: 'One-time escrow arrangement fee'
            },
            {
                name: 'escrowAnnualFee',
                label: 'Escrow Annual Fee (R)',
                type: 'currency',
                default: 10000,
                min: 0,
                step: 1000,
                category: 'pricing',
                hint: 'Ongoing escrow maintenance fee'
            },
            {
                name: 'escrowTriggersDefned',
                label: 'Escrow Release Triggers Defined',
                type: 'select',
                default: 'yes',
                options: [
                    { value: 'yes', label: 'Yes - clearly defined' },
                    { value: 'no', label: 'No - to be negotiated' }
                ],
                category: 'licence',
                hint: 'Whether conditions for source code release are documented'
            }
        ],
        excludeInputs: []
    }
};

// ========== CALCULATION FUNCTIONS ==========

/**
 * Calculate three-perspective results for Model 2
 */
function calculate(inputs, variantId, entityConfig = {}, taxParams = {}) {
    const variant = VARIANTS[variantId] || VARIANTS['2A'];

    // Get effective values based on variant
    const { developerRevenue, buyerCosts, revenueBreakdown, costBreakdown } =
        calculateRevenueAndCosts(inputs, variant, variantId);

    // Developer perspective calculations
    const developer = calculateDeveloperPerspective(
        developerRevenue,
        revenueBreakdown,
        inputs,
        taxParams,
        variantId
    );

    // Buyer perspective calculations
    const buyer = calculateBuyerPerspective(
        buyerCosts,
        costBreakdown,
        inputs,
        taxParams,
        variantId
    );

    // Transfer pricing assessment
    const transferPricing = assessTransferPricing(inputs, variantId, developerRevenue, buyerCosts);

    return {
        developer,
        buyer,
        transferPricing,
        metadata: {
            modelId: 'model-2',
            modelName: 'Software Licence with Royalties',
            variantId,
            variantName: variant.name,
            calculatedAt: new Date().toISOString()
        }
    };
}

/**
 * Calculate revenue and costs based on variant type
 */
function calculateRevenueAndCosts(inputs, variant, variantId) {
    const licenceTerm = inputs.licenceType === 'perpetual' ?
        (inputs.buyerUsefulLife || 5) :
        (inputs.licenceTerm || 5);

    let developerRevenue = 0;
    let buyerCosts = 0;
    let revenueBreakdown = {
        upfront: 0,
        annual: 0,
        royalties: 0,
        other: 0
    };
    let costBreakdown = {
        capitalised: 0,
        expensed: 0,
        royalties: 0,
        implementation: inputs.implementationCosts || 0
    };

    switch (variantId) {
        case '2A': {
            // Perpetual Licence - upfront payment
            const upfrontFee = inputs.upfrontLicenceFee || 0;
            developerRevenue = upfrontFee;
            buyerCosts = upfrontFee + (inputs.implementationCosts || 0);
            revenueBreakdown.upfront = upfrontFee;
            costBreakdown.capitalised = upfrontFee + (inputs.implementationCosts || 0);
            break;
        }

        case '2B': {
            // Term Licence - annual payments
            const annualFee = inputs.annualLicenceFee || 0;
            const totalTermFees = annualFee * licenceTerm;
            developerRevenue = totalTermFees;
            buyerCosts = totalTermFees + (inputs.implementationCosts || 0);
            revenueBreakdown.annual = totalTermFees;
            // First year capitalised if right-to-use, otherwise expensed
            costBreakdown.capitalised = annualFee + (inputs.implementationCosts || 0);
            costBreakdown.expensed = (licenceTerm - 1) * annualFee;
            break;
        }

        case '2C': {
            // Usage-Based Royalties
            const annualUsage = inputs.estimatedAnnualUsage || 0;
            const unitValue = inputs.usageUnitValue || 0;
            const royaltyRate = (inputs.royaltyRate || 0) / 100;
            const annualRoyalty = annualUsage * unitValue * royaltyRate;
            const totalRoyalties = annualRoyalty * licenceTerm;

            developerRevenue = totalRoyalties;
            buyerCosts = totalRoyalties + (inputs.implementationCosts || 0);
            revenueBreakdown.royalties = totalRoyalties;
            costBreakdown.expensed = totalRoyalties;
            costBreakdown.capitalised = inputs.implementationCosts || 0;
            break;
        }

        case '2D': {
            // Minimum Guarantee Plus Royalties
            const minGuarantee = inputs.minimumAnnualGuarantee || 0;
            const threshold = inputs.usageThreshold || 0;
            const annualUsage = inputs.estimatedAnnualUsage || 0;
            const unitValue = inputs.usageUnitValue || 0;
            const royaltyRate = (inputs.royaltyRate || 0) / 100;

            const excessUsage = Math.max(0, annualUsage - threshold);
            const variableRoyalty = excessUsage * unitValue * royaltyRate;
            const annualPayment = minGuarantee + variableRoyalty;
            const totalPayments = annualPayment * licenceTerm;

            developerRevenue = totalPayments;
            buyerCosts = totalPayments + (inputs.implementationCosts || 0);
            revenueBreakdown.upfront = minGuarantee * licenceTerm;
            revenueBreakdown.royalties = variableRoyalty * licenceTerm;
            costBreakdown.capitalised = inputs.implementationCosts || 0;
            costBreakdown.expensed = totalPayments;
            break;
        }

        case '2E': {
            // Revenue/Profit Share
            const shareRate = (inputs.sharePercentage || 0) / 100;
            const buyerRevenue = inputs.estimatedAnnualBuyerRevenue || 0;
            const grossMargin = (inputs.buyerGrossMargin || 0) / 100;

            let shareBasis = buyerRevenue;
            if (inputs.shareBasis === 'gross-profit') {
                shareBasis = buyerRevenue * grossMargin;
            } else if (inputs.shareBasis === 'net-profit') {
                shareBasis = buyerRevenue * grossMargin * 0.7; // Assume 30% operating costs
            } else if (inputs.shareBasis === 'net-revenue') {
                shareBasis = buyerRevenue * 0.9; // Assume 10% deductions
            }

            const annualShare = shareBasis * shareRate;
            const totalShares = annualShare * licenceTerm;

            developerRevenue = totalShares;
            buyerCosts = totalShares + (inputs.implementationCosts || 0);
            revenueBreakdown.royalties = totalShares;
            costBreakdown.expensed = totalShares;
            costBreakdown.capitalised = inputs.implementationCosts || 0;
            break;
        }

        case '2F': {
            // White-Label / Reseller
            const distributionFee = inputs.distributionFee || 0;
            const perSaleRate = (inputs.perSaleRoyalty || 0) / 100;
            const salesVolume = inputs.estimatedEndCustomerSales || 0;
            const pricePoint = inputs.endCustomerPricePoint || 0;

            const annualRoyalties = salesVolume * pricePoint * perSaleRate;
            const totalRoyalties = annualRoyalties * licenceTerm;

            developerRevenue = distributionFee + totalRoyalties;
            buyerCosts = distributionFee + totalRoyalties + (inputs.implementationCosts || 0);
            revenueBreakdown.upfront = distributionFee;
            revenueBreakdown.royalties = totalRoyalties;
            costBreakdown.capitalised = distributionFee + (inputs.implementationCosts || 0);
            costBreakdown.royalties = totalRoyalties;
            break;
        }

        case '2G': {
            // Exclusive vs Non-Exclusive
            const baseFee = inputs.baseLicenceFee || 0;
            const premium = (inputs.exclusivityPremium || 0) / 100;
            const isExclusive = inputs.exclusivity === 'exclusive';

            const actualFee = isExclusive ? baseFee * (1 + premium) : baseFee;

            developerRevenue = actualFee;
            buyerCosts = actualFee + (inputs.implementationCosts || 0);
            revenueBreakdown.upfront = actualFee;
            costBreakdown.capitalised = actualFee + (inputs.implementationCosts || 0);
            break;
        }

        case '2H': {
            // Source Code / Escrow
            const baseFee = inputs.baseLicenceFee || 0;
            const sourceCodeFee = inputs.sourceCodeAccess === 'full' ? (inputs.sourceCodeFee || 0) : 0;
            const escrowSetup = inputs.sourceCodeAccess === 'escrow' ? (inputs.escrowSetupFee || 0) : 0;
            const escrowAnnual = inputs.sourceCodeAccess === 'escrow' ?
                (inputs.escrowAnnualFee || 0) * licenceTerm : 0;

            const upfrontTotal = baseFee + sourceCodeFee + escrowSetup;
            const totalPayments = upfrontTotal + escrowAnnual;

            developerRevenue = totalPayments;
            buyerCosts = totalPayments + (inputs.implementationCosts || 0);
            revenueBreakdown.upfront = upfrontTotal;
            revenueBreakdown.other = escrowAnnual;
            costBreakdown.capitalised = upfrontTotal + (inputs.implementationCosts || 0);
            costBreakdown.expensed = escrowAnnual;
            break;
        }

        default: {
            // Fallback to 2A-style calculation
            const upfrontFee = inputs.upfrontLicenceFee || 0;
            developerRevenue = upfrontFee;
            buyerCosts = upfrontFee + (inputs.implementationCosts || 0);
            revenueBreakdown.upfront = upfrontFee;
            costBreakdown.capitalised = upfrontFee + (inputs.implementationCosts || 0);
        }
    }

    return { developerRevenue, buyerCosts, revenueBreakdown, costBreakdown };
}

/**
 * Developer perspective: Asset recognition and revenue
 */
function calculateDeveloperPerspective(revenue, revenueBreakdown, inputs, taxParams, variantId) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;

    // Developer capitalises development phase costs as intangible asset
    const researchCost = inputs.researchPhaseCost || 0;
    const developmentCost = inputs.developmentPhaseCost || 0;
    const developerUsefulLife = inputs.developerUsefulLife || 5;
    const annualAmortisation = developmentCost / developerUsefulLife;

    // Section 11(e) tax depreciation for Developer
    const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
    const taxDepreciation = developmentCost / section11eYears;

    // Calculate licence term for spreading calculations
    const licenceTerm = inputs.licenceType === 'perpetual' ?
        (inputs.buyerUsefulLife || 5) :
        (inputs.licenceTerm || 5);

    // Determine revenue recognition timing
    let recognitionTiming = 'point-in-time';
    let recognitionBasis = 'IFRS 15 - point in time (right to use)';

    // Usage-based variants recognise revenue over time
    if (['2C', '2D', '2E', '2F'].includes(variantId)) {
        recognitionTiming = 'over-time';
        recognitionBasis = 'IFRS 15 - over time (sales-based royalty exception)';
    } else if (variantId === '2B' && inputs.renewalExpected !== 'yes') {
        recognitionTiming = 'over-time';
        recognitionBasis = 'IFRS 15 - over time (right to access)';
    }

    // Calculate profit (simplified - using first year or annualised)
    const annualRevenue = revenue / licenceTerm;
    const grossProfit = annualRevenue - annualAmortisation;
    const taxableIncome = grossProfit;
    const taxPayable = Math.max(0, taxableIncome * taxRate);
    const netProfit = grossProfit - taxPayable;

    // Deferred tax from timing difference
    const timingDifference = annualAmortisation - taxDepreciation;
    const deferredTax = timingDifference * taxRate;

    return {
        revenue: {
            total: revenue,
            annual: annualRevenue,
            breakdown: revenueBreakdown,
            recognitionTiming,
            recognitionBasis
        },
        costs: {
            researchExpensed: researchCost,
            developmentCapitalised: developmentCost,
            annualAmortisation,
            totalAnnualCost: researchCost / licenceTerm + annualAmortisation
        },
        asset: {
            recognised: true,
            capitalisedAmount: developmentCost,
            carryingValue: developmentCost,
            usefulLife: developerUsefulLife,
            amortisationMethod: 'straight-line',
            annualAmortisation,
            reason: 'Internally developed software - IAS 38 criteria met'
        },
        profit: {
            gross: grossProfit,
            margin: annualRevenue > 0 ? (grossProfit / annualRevenue) * 100 : 0,
            net: netProfit,
            totalOverTerm: netProfit * licenceTerm
        },
        tax: {
            taxableIncome,
            corporateTaxRate: taxRate,
            taxPayable,
            section11eDeduction: taxDepreciation,
            timingDifference,
            deferredTaxAsset: deferredTax > 0 ? deferredTax : 0,
            deferredTaxLiability: deferredTax < 0 ? Math.abs(deferredTax) : 0,
            effectiveTaxRate: annualRevenue > 0 ? (taxPayable / annualRevenue) * 100 : 0
        },
        schedule: generateDeveloperSchedule(developmentCost, developerUsefulLife, revenue, licenceTerm)
    };
}

/**
 * Buyer perspective: Asset capitalisation and expense profile
 */
function calculateBuyerPerspective(totalCost, costBreakdown, inputs, taxParams, variantId) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;

    const capitalisedAmount = costBreakdown.capitalised || 0;
    const expensedAmount = costBreakdown.expensed || 0;
    const royaltyExpense = costBreakdown.royalties || 0;

    // Determine useful life for amortisation
    const licenceTerm = inputs.licenceType === 'perpetual' ?
        (inputs.buyerUsefulLife || 5) :
        Math.min(inputs.licenceTerm || 5, inputs.buyerUsefulLife || 5);

    const annualAmortisation = capitalisedAmount > 0 ? capitalisedAmount / licenceTerm : 0;
    const annualRoyaltyExpense = expensedAmount / licenceTerm;

    // Section 11(e) tax depreciation for Buyer
    const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
    const taxDepreciation = capitalisedAmount / section11eYears;

    // Deferred tax from timing difference
    const timingDifference = annualAmortisation - taxDepreciation;
    const deferredTax = timingDifference * taxRate;

    // Tax benefit from deductions
    const annualTaxBenefit = (taxDepreciation + annualRoyaltyExpense) * taxRate;

    return {
        asset: {
            recognised: capitalisedAmount > 0,
            capitalised: capitalisedAmount,
            expensed: expensedAmount,
            carryingValue: capitalisedAmount,
            usefulLife: licenceTerm,
            amortisationMethod: 'straight-line',
            annualAmortisation,
            section11eType: inputs.section11eType || 'pc-2yr',
            section11eYears
        },
        expenses: {
            year1: {
                amortisation: annualAmortisation,
                royalties: annualRoyaltyExpense,
                total: annualAmortisation + annualRoyaltyExpense
            },
            ongoing: {
                amortisation: annualAmortisation,
                royalties: annualRoyaltyExpense,
                total: annualAmortisation + annualRoyaltyExpense
            },
            breakdown: costBreakdown,
            schedule: generateBuyerSchedule(capitalisedAmount, licenceTerm, annualRoyaltyExpense)
        },
        tax: {
            section11eDeduction: taxDepreciation,
            royaltyDeduction: annualRoyaltyExpense,
            accountingAmortisation: annualAmortisation,
            timingDifference,
            deferredTaxAsset: deferredTax > 0 ? deferredTax : 0,
            deferredTaxLiability: deferredTax < 0 ? Math.abs(deferredTax) : 0,
            annualTaxBenefit,
            totalTaxBenefit: annualTaxBenefit * licenceTerm
        },
        totalCost,
        npv: calculateNPV(totalCost, licenceTerm, 0.10) // 10% discount rate
    };
}

/**
 * Assess transfer pricing risk for licence/royalty arrangements
 */
function assessTransferPricing(inputs, variantId, developerRevenue, buyerCosts) {
    // Arm's length ranges for software royalties
    const royaltyBenchmarks = {
        low: 1,
        median: 10,
        high: 25,
        extremeHigh: 35
    };

    // Calculate implied royalty rate
    const developmentCost = inputs.developmentPhaseCost || 0;
    const impliedRoyaltyRate = developmentCost > 0 ?
        (developerRevenue / developmentCost) * 100 : 0;

    // Specific benchmarks by variant
    let specificBenchmark = royaltyBenchmarks;
    let method = 'CUP/royalty comparison';

    if (['2A', '2B', '2G', '2H'].includes(variantId)) {
        method = 'CUP - comparable licence transactions';
    } else if (['2C', '2D'].includes(variantId)) {
        method = 'Royalty rate benchmarking';
        // Check actual royalty rate input
        const actualRate = inputs.royaltyRate || 0;
        const withinRange = actualRate >= royaltyBenchmarks.low && actualRate <= royaltyBenchmarks.high;

        return {
            method,
            royaltyRate: actualRate,
            benchmarkRange: royaltyBenchmarks,
            withinRange,
            riskScore: withinRange ? 85 : (actualRate <= royaltyBenchmarks.extremeHigh ? 60 : 35),
            riskLevel: withinRange ? 'low' : (actualRate <= royaltyBenchmarks.extremeHigh ? 'medium' : 'high'),
            recommendation: withinRange ?
                'Royalty rate is within arm\'s length range' :
                `Consider adjusting rate toward ${royaltyBenchmarks.median}% (median benchmark)`,
            documentation: getDocumentationRequirements(variantId)
        };
    } else if (['2E', '2F'].includes(variantId)) {
        method = 'Profit split / residual analysis';
    }

    // General assessment based on implied return
    const withinRange = impliedRoyaltyRate >= 50 && impliedRoyaltyRate <= 300;
    const withinExtendedRange = impliedRoyaltyRate >= 25 && impliedRoyaltyRate <= 500;

    let riskScore, riskLevel;
    if (withinRange) {
        riskScore = 85;
        riskLevel = 'low';
    } else if (withinExtendedRange) {
        riskScore = 65;
        riskLevel = 'medium';
    } else {
        riskScore = 40;
        riskLevel = 'high';
    }

    return {
        method,
        impliedReturnOnIP: impliedRoyaltyRate,
        benchmarkRange: { low: 50, median: 150, high: 300 },
        withinRange,
        riskScore,
        riskLevel,
        recommendation: withinRange ?
            'Licence pricing appears arm\'s length based on return on IP' :
            'Consider obtaining independent valuation or comparable transaction analysis',
        documentation: getDocumentationRequirements(variantId)
    };
}

/**
 * Get documentation requirements by variant
 */
function getDocumentationRequirements(variantId) {
    const baseRequirements = [
        'Written licence agreement with clear terms',
        'Transfer pricing policy document',
        'Functional analysis documenting value drivers'
    ];

    const variantSpecific = {
        '2A': ['Independent software valuation', 'Comparable licence transaction analysis'],
        '2B': ['Right to use vs access assessment', 'Renewal probability documentation'],
        '2C': ['Usage tracking methodology', 'Royalty rate benchmarking study'],
        '2D': ['Minimum guarantee justification', 'Usage projection basis'],
        '2E': ['Profit attribution methodology', 'Revenue/profit share benchmarks'],
        '2F': ['Distribution rights valuation', 'End-market comparable analysis'],
        '2G': ['Exclusivity premium justification', 'Market exclusion value analysis'],
        '2H': ['Source code valuation', 'Escrow arrangement justification']
    };

    return [...baseRequirements, ...(variantSpecific[variantId] || [])];
}

/**
 * Generate Developer amortisation and revenue schedule
 */
function generateDeveloperSchedule(capitalisedAmount, usefulLife, totalRevenue, revenueTerm) {
    const annualAmortisation = capitalisedAmount / usefulLife;
    const annualRevenue = totalRevenue / revenueTerm;
    const schedule = [];

    const maxYears = Math.max(usefulLife, revenueTerm);

    for (let year = 1; year <= maxYears; year++) {
        schedule.push({
            year,
            openingAssetBalance: Math.max(0, capitalisedAmount - (annualAmortisation * (year - 1))),
            amortisation: year <= usefulLife ? annualAmortisation : 0,
            closingAssetBalance: Math.max(0, capitalisedAmount - (annualAmortisation * year)),
            revenue: year <= revenueTerm ? annualRevenue : 0,
            cumulativeRevenue: Math.min(year, revenueTerm) * annualRevenue
        });
    }

    return schedule;
}

/**
 * Generate Buyer expense schedule
 */
function generateBuyerSchedule(capitalisedAmount, usefulLife, annualRoyalty) {
    const annualAmortisation = capitalisedAmount / usefulLife;
    const schedule = [];

    for (let year = 1; year <= usefulLife; year++) {
        schedule.push({
            year,
            openingBalance: Math.max(0, capitalisedAmount - (annualAmortisation * (year - 1))),
            amortisation: annualAmortisation,
            royaltyExpense: annualRoyalty,
            totalExpense: annualAmortisation + annualRoyalty,
            closingBalance: Math.max(0, capitalisedAmount - (annualAmortisation * year))
        });
    }

    return schedule;
}

/**
 * Calculate NPV of cash flows
 */
function calculateNPV(totalCost, years, discountRate) {
    const annualPayment = totalCost / years;
    let npv = 0;

    for (let year = 1; year <= years; year++) {
        npv += annualPayment / Math.pow(1 + discountRate, year);
    }

    return npv;
}

// ========== EXPORT ==========

export const MODEL_2_LICENCE_ROYALTIES = {
    id: 'model-2',
    name: 'Software Licence with Royalties',
    shortName: 'Licence/Royalties',
    description: 'Developer owns IP and grants licence to Buyer. Buyer pays upfront fees, royalties, or both.',
    category: 'intercompany',

    inputCategories: INPUT_CATEGORIES,
    baseInputs: BASE_INPUTS,
    variants: VARIANTS,
    defaultVariant: '2A',

    calculate,

    // UI hints
    icon: '📜',
    color: '#8B5CF6',  // Purple

    // Accounting summary
    accountingSummary: {
        developer: 'Capitalise development costs (IAS 38). Recognise licence revenue per IFRS 15.',
        buyer: 'Capitalise licence fees (IAS 38). Expense royalties as incurred.'
    }
};
