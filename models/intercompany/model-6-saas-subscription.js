// ========== MODEL 6: SUBSCRIPTION/SAAS MODEL ==========
// Developer hosts and maintains software, providing access to Buyer via subscription.
// No IP ownership transfers. Developer retains the asset; Buyer expenses subscription fees.
//
// Key characteristics:
// - Developer: Retains IP, capitalises development costs, earns recurring subscription revenue
// - Buyer: No asset recognition, expenses subscription fees as incurred
// - Transfer pricing: Arm's length subscription pricing (comparable SaaS benchmarks)
// - Note: Least favourable for combined asset maximisation

// ========== INPUT CATEGORIES ==========

const INPUT_CATEGORIES = {
    development: {
        name: 'Development Costs',
        description: 'Developer software development and platform costs',
        icon: '💻'
    },
    subscription: {
        name: 'Subscription Terms',
        description: 'Contract and pricing structure',
        icon: '📅'
    },
    pricing: {
        name: 'Pricing Structure',
        description: 'Fees, tiers, and payment terms',
        icon: '💰'
    },
    buyer: {
        name: 'Buyer Costs',
        description: 'Implementation and additional costs',
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
        label: 'Project/Service Name',
        type: 'text',
        default: 'SaaS Platform',
        category: 'development',
        hint: 'Name of the software service being provided'
    },
    {
        name: 'developmentCost',
        label: 'Total Development Cost (R)',
        type: 'currency',
        default: 3000000,
        min: 0,
        step: 100000,
        category: 'development',
        hint: 'Total cost to develop the platform'
    },
    {
        name: 'researchPhaseCost',
        label: 'Research Phase Cost (R)',
        type: 'currency',
        default: 600000,
        min: 0,
        step: 50000,
        category: 'development',
        hint: 'Costs before IAS 38 capitalisation criteria met (expensed)'
    },
    {
        name: 'developmentPhaseCost',
        label: 'Development Phase Cost (R)',
        type: 'currency',
        default: 2400000,
        min: 0,
        step: 50000,
        category: 'development',
        hint: 'Costs after IAS 38 criteria met (capitalised by Developer)'
    },
    {
        name: 'developerUsefulLife',
        label: 'Platform Useful Life (Years)',
        type: 'number',
        default: 5,
        min: 1,
        max: 15,
        step: 1,
        category: 'development',
        hint: 'Expected useful life for Developer asset amortisation'
    },
    {
        name: 'annualOperatingCost',
        label: 'Annual Operating/Hosting Cost (R)',
        type: 'currency',
        default: 300000,
        min: 0,
        step: 25000,
        category: 'development',
        hint: 'Annual infrastructure, hosting, and maintenance costs'
    },
    {
        name: 'annualEnhancementCost',
        label: 'Annual Enhancement Cost (R)',
        type: 'currency',
        default: 200000,
        min: 0,
        step: 25000,
        category: 'development',
        hint: 'Annual cost for platform improvements and updates'
    },

    // Subscription Terms
    {
        name: 'contractTerm',
        label: 'Initial Contract Term (Years)',
        type: 'number',
        default: 3,
        min: 1,
        max: 10,
        step: 1,
        category: 'subscription',
        hint: 'Duration of the subscription agreement'
    },
    {
        name: 'renewalTerms',
        label: 'Renewal Terms',
        type: 'select',
        default: 'auto-renew',
        options: [
            { value: 'auto-renew', label: 'Auto-renewal (annual)' },
            { value: 'renegotiate', label: 'Renegotiate at end of term' }
        ],
        category: 'subscription',
        hint: 'How the contract renews after initial term'
    },
    {
        name: 'paymentTiming',
        label: 'Payment Timing',
        type: 'select',
        default: 'advance',
        options: [
            { value: 'advance', label: 'Paid in Advance' },
            { value: 'arrears', label: 'Paid in Arrears' }
        ],
        category: 'subscription',
        hint: 'When subscription fees are payable'
    },

    // Buyer Costs
    {
        name: 'implementationCosts',
        label: 'Implementation Costs (R)',
        type: 'currency',
        default: 50000,
        min: 0,
        step: 10000,
        category: 'buyer',
        hint: 'One-time setup, training, and integration costs (typically expensed)'
    },

    // Tax Parameters
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
        hint: 'SARS accelerated depreciation (for Developer asset)'
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
    '6A': {
        name: 'Pure SaaS (Multi-Tenant)',
        description: 'Shared platform, standard features, no customisation',
        scenario: 'Standard SaaS offering - cost efficient, quick deployment',
        additionalInputs: [
            {
                name: 'monthlySubscriptionFee',
                label: 'Monthly Subscription Fee (R)',
                type: 'currency',
                default: 25000,
                min: 0,
                step: 1000,
                category: 'pricing',
                hint: 'Monthly fee for standard SaaS access'
            },
            {
                name: 'numberOfUsers',
                label: 'Number of Users',
                type: 'number',
                default: 50,
                min: 1,
                step: 5,
                category: 'subscription',
                hint: 'Users included in subscription (if per-user pricing)'
            }
        ],
        excludeInputs: []
    },
    '6B': {
        name: 'Dedicated Instance (Single-Tenant)',
        description: 'Buyer-specific environment with enhanced SLAs',
        scenario: 'Data isolation required, performance SLAs critical',
        additionalInputs: [
            {
                name: 'monthlySubscriptionFee',
                label: 'Base Monthly Fee (R)',
                type: 'currency',
                default: 35000,
                min: 0,
                step: 1000,
                category: 'pricing',
                hint: 'Base monthly subscription fee'
            },
            {
                name: 'dedicatedSurcharge',
                label: 'Dedicated Environment Surcharge (R)',
                type: 'currency',
                default: 15000,
                min: 0,
                step: 1000,
                category: 'pricing',
                hint: 'Additional monthly fee for dedicated infrastructure'
            },
            {
                name: 'slaUptimeGuarantee',
                label: 'SLA Uptime Guarantee (%)',
                type: 'percent',
                default: 99.9,
                min: 99,
                max: 100,
                step: 0.1,
                category: 'subscription',
                hint: 'Committed uptime percentage'
            }
        ],
        excludeInputs: []
    },
    '6C': {
        name: 'Subscription with Customisation',
        description: 'Base subscription plus custom development',
        scenario: 'Standard product needs modification for Buyer requirements',
        additionalInputs: [
            {
                name: 'monthlySubscriptionFee',
                label: 'Monthly Subscription Fee (R)',
                type: 'currency',
                default: 30000,
                min: 0,
                step: 1000,
                category: 'pricing',
                hint: 'Monthly fee for base SaaS access'
            },
            {
                name: 'customisationCost',
                label: 'Customisation Cost (R)',
                type: 'currency',
                default: 200000,
                min: 0,
                step: 25000,
                category: 'pricing',
                hint: 'One-time cost for custom development'
            },
            {
                name: 'customisationControl',
                label: 'Customisation Control',
                type: 'select',
                default: 'developer',
                options: [
                    { value: 'developer', label: 'Developer controls (expense for Buyer)' },
                    { value: 'buyer', label: 'Buyer controls (potential asset for Buyer)' }
                ],
                category: 'subscription',
                hint: 'Who controls the customisation output'
            },
            {
                name: 'customisationMaintenance',
                label: 'Customisation Maintenance',
                type: 'select',
                default: 'included',
                options: [
                    { value: 'included', label: 'Included in subscription' },
                    { value: 'additional', label: 'Additional fee required' }
                ],
                category: 'subscription',
                hint: 'Whether customisation maintenance is included'
            }
        ],
        excludeInputs: []
    },
    '6D': {
        name: 'Hybrid (Subscription + On-Premise)',
        description: 'Choice of cloud or on-premise deployment',
        scenario: 'Deployment flexibility needed, regulatory constraints on cloud',
        additionalInputs: [
            {
                name: 'deploymentChoice',
                label: 'Deployment Choice',
                type: 'select',
                default: 'cloud',
                options: [
                    { value: 'cloud', label: 'Cloud (Subscription)' },
                    { value: 'on-premise', label: 'On-Premise (Licence)' },
                    { value: 'hybrid', label: 'Hybrid (Both)' }
                ],
                category: 'subscription',
                hint: 'Where the software is deployed'
            },
            {
                name: 'cloudMonthlyFee',
                label: 'Cloud Monthly Fee (R)',
                type: 'currency',
                default: 25000,
                min: 0,
                step: 1000,
                category: 'pricing',
                hint: 'Monthly fee for cloud deployment'
            },
            {
                name: 'onPremiseLicenceFee',
                label: 'On-Premise Licence Fee (R)',
                type: 'currency',
                default: 500000,
                min: 0,
                step: 25000,
                category: 'pricing',
                hint: 'One-time licence fee for on-premise deployment'
            },
            {
                name: 'onPremiseMaintenanceFee',
                label: 'On-Premise Annual Maintenance (%)',
                type: 'percent',
                default: 20,
                min: 0,
                max: 50,
                step: 5,
                category: 'pricing',
                hint: 'Annual maintenance as % of licence fee'
            }
        ],
        excludeInputs: []
    },
    '6E': {
        name: 'Freemium / Tiered Pricing',
        description: 'Multiple tiers with graduated pricing',
        scenario: 'Starting small, clear tier boundaries, upgrade path expected',
        additionalInputs: [
            {
                name: 'selectedTier',
                label: 'Selected Tier',
                type: 'select',
                default: 'professional',
                options: [
                    { value: 'free', label: 'Free Tier' },
                    { value: 'basic', label: 'Basic Tier' },
                    { value: 'professional', label: 'Professional Tier' },
                    { value: 'enterprise', label: 'Enterprise Tier' }
                ],
                category: 'subscription',
                hint: 'Current tier for Buyer'
            },
            {
                name: 'freeTierFeatures',
                label: 'Free Tier Included',
                type: 'select',
                default: 'yes',
                options: [
                    { value: 'yes', label: 'Yes - free tier available' },
                    { value: 'no', label: 'No - paid only' }
                ],
                category: 'subscription',
                hint: 'Whether a free tier is offered'
            },
            {
                name: 'basicTierFee',
                label: 'Basic Tier Monthly Fee (R)',
                type: 'currency',
                default: 5000,
                min: 0,
                step: 500,
                category: 'pricing',
                hint: 'Monthly fee for basic tier'
            },
            {
                name: 'professionalTierFee',
                label: 'Professional Tier Monthly Fee (R)',
                type: 'currency',
                default: 15000,
                min: 0,
                step: 1000,
                category: 'pricing',
                hint: 'Monthly fee for professional tier'
            },
            {
                name: 'enterpriseTierFee',
                label: 'Enterprise Tier Monthly Fee (R)',
                type: 'currency',
                default: 50000,
                min: 0,
                step: 5000,
                category: 'pricing',
                hint: 'Monthly fee for enterprise tier'
            }
        ],
        excludeInputs: []
    },
    '6F': {
        name: 'Consumption-Based Pricing',
        description: 'Pay per usage (API calls, transactions, storage)',
        scenario: 'Variable usage, align cost with value received',
        additionalInputs: [
            {
                name: 'usageUnit',
                label: 'Unit of Consumption',
                type: 'select',
                default: 'api-calls',
                options: [
                    { value: 'api-calls', label: 'API Calls' },
                    { value: 'transactions', label: 'Transactions' },
                    { value: 'storage', label: 'Storage (GB)' },
                    { value: 'users', label: 'Active Users' }
                ],
                category: 'subscription',
                hint: 'Basis for consumption billing'
            },
            {
                name: 'pricePerUnit',
                label: 'Price per Unit (R)',
                type: 'currency',
                default: 0.50,
                min: 0,
                step: 0.10,
                category: 'pricing',
                hint: 'Price per consumption unit'
            },
            {
                name: 'expectedMonthlyUsage',
                label: 'Expected Monthly Usage',
                type: 'number',
                default: 100000,
                min: 0,
                step: 10000,
                category: 'subscription',
                hint: 'Expected monthly consumption volume'
            },
            {
                name: 'minimumMonthlyCharge',
                label: 'Minimum Monthly Charge (R)',
                type: 'currency',
                default: 5000,
                min: 0,
                step: 1000,
                category: 'pricing',
                hint: 'Floor charge regardless of usage'
            },
            {
                name: 'volumeDiscountThreshold',
                label: 'Volume Discount Threshold',
                type: 'number',
                default: 500000,
                min: 0,
                step: 50000,
                category: 'pricing',
                hint: 'Usage level where volume discount applies'
            },
            {
                name: 'volumeDiscountRate',
                label: 'Volume Discount (%)',
                type: 'percent',
                default: 20,
                min: 0,
                max: 50,
                step: 5,
                category: 'pricing',
                hint: 'Discount on units above threshold'
            }
        ],
        excludeInputs: []
    },
    '6G': {
        name: 'Enterprise Agreement (Committed Spend)',
        description: 'Minimum annual commitment with benefits',
        scenario: 'Large-scale deployment, budget certainty required',
        additionalInputs: [
            {
                name: 'minimumAnnualCommitment',
                label: 'Minimum Annual Commitment (R)',
                type: 'currency',
                default: 500000,
                min: 0,
                step: 50000,
                category: 'pricing',
                hint: 'Minimum annual spend regardless of usage'
            },
            {
                name: 'commitmentPeriod',
                label: 'Commitment Period (Years)',
                type: 'number',
                default: 3,
                min: 1,
                max: 5,
                step: 1,
                category: 'subscription',
                hint: 'Duration of enterprise agreement'
            },
            {
                name: 'overageRate',
                label: 'Overage Rate (% of standard)',
                type: 'percent',
                default: 80,
                min: 50,
                max: 100,
                step: 5,
                category: 'pricing',
                hint: 'Rate for usage above commitment (as % of standard rate)'
            },
            {
                name: 'estimatedAnnualUsageValue',
                label: 'Estimated Annual Usage Value (R)',
                type: 'currency',
                default: 600000,
                min: 0,
                step: 50000,
                category: 'subscription',
                hint: 'Expected actual usage value per year'
            }
        ],
        excludeInputs: ['contractTerm']
    },
    '6H': {
        name: 'Private Label SaaS',
        description: 'Buyer rebrands and sells to end customers',
        scenario: 'Buyer wants to resell, Developer wants platform revenue',
        additionalInputs: [
            {
                name: 'platformFee',
                label: 'Monthly Platform Fee (R)',
                type: 'currency',
                default: 50000,
                min: 0,
                step: 5000,
                category: 'pricing',
                hint: 'Base monthly fee for white-label platform access'
            },
            {
                name: 'revenueShareRate',
                label: 'Revenue Share Rate (%)',
                type: 'percent',
                default: 15,
                min: 0,
                max: 50,
                step: 5,
                category: 'pricing',
                hint: 'Developer share of Buyer\'s end-customer revenue'
            },
            {
                name: 'estimatedEndCustomerRevenue',
                label: 'Est. Monthly End-Customer Revenue (R)',
                type: 'currency',
                default: 200000,
                min: 0,
                step: 25000,
                category: 'subscription',
                hint: 'Expected monthly revenue from Buyer\'s end customers'
            },
            {
                name: 'brandingFee',
                label: 'White-Label/Branding Fee (R)',
                type: 'currency',
                default: 25000,
                min: 0,
                step: 5000,
                category: 'pricing',
                hint: 'One-time fee for branding and setup'
            },
            {
                name: 'supportResponsibility',
                label: 'Support Responsibility',
                type: 'select',
                default: 'buyer',
                options: [
                    { value: 'developer', label: 'Developer provides support' },
                    { value: 'buyer', label: 'Buyer provides support' },
                    { value: 'shared', label: 'Shared (tiered)' }
                ],
                category: 'subscription',
                hint: 'Who provides end-customer support'
            }
        ],
        excludeInputs: []
    },
    '6I': {
        name: 'Managed Service with Transition Rights',
        description: 'SaaS with option to insource/purchase later',
        scenario: 'Testing before committing to purchase, transition path important',
        additionalInputs: [
            {
                name: 'monthlyManagedServiceFee',
                label: 'Monthly Managed Service Fee (R)',
                type: 'currency',
                default: 40000,
                min: 0,
                step: 5000,
                category: 'pricing',
                hint: 'Monthly fee during managed service period'
            },
            {
                name: 'transitionOption',
                label: 'Transition Option',
                type: 'select',
                default: 'yes',
                options: [
                    { value: 'yes', label: 'Yes - transition rights included' },
                    { value: 'no', label: 'No - SaaS only' }
                ],
                category: 'subscription',
                hint: 'Whether Buyer can transition to ownership'
            },
            {
                name: 'transitionPrice',
                label: 'Transition Price (R)',
                type: 'currency',
                default: 1500000,
                min: 0,
                step: 100000,
                category: 'pricing',
                hint: 'Price to purchase/transition to ownership'
            },
            {
                name: 'transitionNoticePeriod',
                label: 'Transition Notice Period (Months)',
                type: 'number',
                default: 6,
                min: 1,
                max: 24,
                step: 1,
                category: 'subscription',
                hint: 'Notice required before transition'
            },
            {
                name: 'postTransitionSupportFee',
                label: 'Post-Transition Annual Support (R)',
                type: 'currency',
                default: 150000,
                min: 0,
                step: 25000,
                category: 'pricing',
                hint: 'Annual support fee after transition'
            }
        ],
        excludeInputs: []
    }
};

// ========== CALCULATION FUNCTIONS ==========

/**
 * Calculate three-perspective results for Model 6
 */
function calculate(inputs, variantId, entityConfig = {}, taxParams = {}) {
    const variant = VARIANTS[variantId] || VARIANTS['6A'];

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

    // Combined perspective calculations
    const combined = calculateCombinedPerspective(developer, buyer, entityConfig, inputs);

    // Transfer pricing assessment
    const transferPricing = assessTransferPricing(inputs, variantId, developerRevenue, buyerCosts);

    // SaaS vs alternatives comparison
    const alternatives = calculateAlternativesComparison(inputs, buyerCosts);

    return {
        developer,
        buyer,
        combined,
        transferPricing,
        alternatives,
        metadata: {
            modelId: 'model-6',
            modelName: 'Subscription/SaaS Model',
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
    const contractTerm = inputs.contractTerm || 3;

    let developerRevenue = 0;
    let buyerCosts = 0;
    let revenueBreakdown = {
        subscription: 0,
        consumption: 0,
        customisation: 0,
        revenueShare: 0,
        other: 0
    };
    let costBreakdown = {
        subscription: 0,
        consumption: 0,
        customisation: 0,
        implementation: inputs.implementationCosts || 0,
        other: 0
    };

    switch (variantId) {
        case '6A': {
            // Pure SaaS - monthly subscription
            const monthlyFee = inputs.monthlySubscriptionFee || 0;
            const totalSubscription = monthlyFee * 12 * contractTerm;
            developerRevenue = totalSubscription;
            buyerCosts = totalSubscription + (inputs.implementationCosts || 0);
            revenueBreakdown.subscription = totalSubscription;
            costBreakdown.subscription = totalSubscription;
            break;
        }

        case '6B': {
            // Dedicated Instance - base + surcharge
            const monthlyFee = (inputs.monthlySubscriptionFee || 0) + (inputs.dedicatedSurcharge || 0);
            const totalSubscription = monthlyFee * 12 * contractTerm;
            developerRevenue = totalSubscription;
            buyerCosts = totalSubscription + (inputs.implementationCosts || 0);
            revenueBreakdown.subscription = totalSubscription;
            costBreakdown.subscription = totalSubscription;
            break;
        }

        case '6C': {
            // Subscription with Customisation
            const monthlyFee = inputs.monthlySubscriptionFee || 0;
            const totalSubscription = monthlyFee * 12 * contractTerm;
            const customisationCost = inputs.customisationCost || 0;

            developerRevenue = totalSubscription + customisationCost;
            buyerCosts = totalSubscription + customisationCost + (inputs.implementationCosts || 0);
            revenueBreakdown.subscription = totalSubscription;
            revenueBreakdown.customisation = customisationCost;
            costBreakdown.subscription = totalSubscription;
            costBreakdown.customisation = customisationCost;
            break;
        }

        case '6D': {
            // Hybrid - depends on deployment choice
            const deploymentChoice = inputs.deploymentChoice || 'cloud';

            if (deploymentChoice === 'cloud') {
                const monthlyFee = inputs.cloudMonthlyFee || 0;
                const totalSubscription = monthlyFee * 12 * contractTerm;
                developerRevenue = totalSubscription;
                buyerCosts = totalSubscription + (inputs.implementationCosts || 0);
                revenueBreakdown.subscription = totalSubscription;
                costBreakdown.subscription = totalSubscription;
            } else if (deploymentChoice === 'on-premise') {
                const licenceFee = inputs.onPremiseLicenceFee || 0;
                const maintenanceRate = (inputs.onPremiseMaintenanceFee || 20) / 100;
                const annualMaintenance = licenceFee * maintenanceRate;
                const totalMaintenance = annualMaintenance * contractTerm;

                developerRevenue = licenceFee + totalMaintenance;
                buyerCosts = licenceFee + totalMaintenance + (inputs.implementationCosts || 0);
                revenueBreakdown.subscription = licenceFee;
                revenueBreakdown.other = totalMaintenance;
                costBreakdown.subscription = licenceFee;
                costBreakdown.other = totalMaintenance;
            } else {
                // Hybrid - both
                const cloudFee = (inputs.cloudMonthlyFee || 0) * 12 * contractTerm;
                const licenceFee = inputs.onPremiseLicenceFee || 0;
                const maintenanceRate = (inputs.onPremiseMaintenanceFee || 20) / 100;
                const totalMaintenance = licenceFee * maintenanceRate * contractTerm;

                developerRevenue = cloudFee + licenceFee + totalMaintenance;
                buyerCosts = developerRevenue + (inputs.implementationCosts || 0);
                revenueBreakdown.subscription = cloudFee + licenceFee;
                revenueBreakdown.other = totalMaintenance;
                costBreakdown.subscription = cloudFee + licenceFee;
                costBreakdown.other = totalMaintenance;
            }
            break;
        }

        case '6E': {
            // Freemium / Tiered
            const selectedTier = inputs.selectedTier || 'professional';
            let monthlyFee = 0;

            switch (selectedTier) {
                case 'free': monthlyFee = 0; break;
                case 'basic': monthlyFee = inputs.basicTierFee || 0; break;
                case 'professional': monthlyFee = inputs.professionalTierFee || 0; break;
                case 'enterprise': monthlyFee = inputs.enterpriseTierFee || 0; break;
            }

            const totalSubscription = monthlyFee * 12 * contractTerm;
            developerRevenue = totalSubscription;
            buyerCosts = totalSubscription + (inputs.implementationCosts || 0);
            revenueBreakdown.subscription = totalSubscription;
            costBreakdown.subscription = totalSubscription;
            break;
        }

        case '6F': {
            // Consumption-Based
            const pricePerUnit = inputs.pricePerUnit || 0;
            const monthlyUsage = inputs.expectedMonthlyUsage || 0;
            const minimumCharge = inputs.minimumMonthlyCharge || 0;
            const discountThreshold = inputs.volumeDiscountThreshold || Infinity;
            const discountRate = (inputs.volumeDiscountRate || 0) / 100;

            // Calculate usage charge with volume discount
            let monthlyUsageCharge = 0;
            if (monthlyUsage <= discountThreshold) {
                monthlyUsageCharge = monthlyUsage * pricePerUnit;
            } else {
                monthlyUsageCharge = (discountThreshold * pricePerUnit) +
                    ((monthlyUsage - discountThreshold) * pricePerUnit * (1 - discountRate));
            }

            const monthlyCharge = Math.max(monthlyUsageCharge, minimumCharge);
            const totalConsumption = monthlyCharge * 12 * contractTerm;

            developerRevenue = totalConsumption;
            buyerCosts = totalConsumption + (inputs.implementationCosts || 0);
            revenueBreakdown.consumption = totalConsumption;
            costBreakdown.consumption = totalConsumption;
            break;
        }

        case '6G': {
            // Enterprise Agreement
            const minimumCommitment = inputs.minimumAnnualCommitment || 0;
            const commitmentPeriod = inputs.commitmentPeriod || 3;
            const estimatedUsage = inputs.estimatedAnnualUsageValue || 0;
            const overageRate = (inputs.overageRate || 80) / 100;

            // Calculate actual annual payment
            let annualPayment;
            if (estimatedUsage <= minimumCommitment) {
                annualPayment = minimumCommitment;
            } else {
                const overage = (estimatedUsage - minimumCommitment) * overageRate;
                annualPayment = minimumCommitment + overage;
            }

            const totalPayments = annualPayment * commitmentPeriod;
            developerRevenue = totalPayments;
            buyerCosts = totalPayments + (inputs.implementationCosts || 0);
            revenueBreakdown.subscription = totalPayments;
            costBreakdown.subscription = totalPayments;
            break;
        }

        case '6H': {
            // Private Label SaaS
            const platformFee = inputs.platformFee || 0;
            const revenueShareRate = (inputs.revenueShareRate || 0) / 100;
            const endCustomerRevenue = inputs.estimatedEndCustomerRevenue || 0;
            const brandingFee = inputs.brandingFee || 0;

            const monthlyRevenueShare = endCustomerRevenue * revenueShareRate;
            const totalPlatformFees = platformFee * 12 * contractTerm;
            const totalRevenueShare = monthlyRevenueShare * 12 * contractTerm;

            developerRevenue = brandingFee + totalPlatformFees + totalRevenueShare;
            buyerCosts = brandingFee + totalPlatformFees + totalRevenueShare + (inputs.implementationCosts || 0);
            revenueBreakdown.subscription = totalPlatformFees;
            revenueBreakdown.revenueShare = totalRevenueShare;
            revenueBreakdown.other = brandingFee;
            costBreakdown.subscription = totalPlatformFees;
            costBreakdown.other = brandingFee + totalRevenueShare;
            break;
        }

        case '6I': {
            // Managed Service with Transition Rights
            const monthlyFee = inputs.monthlyManagedServiceFee || 0;
            const totalManagedService = monthlyFee * 12 * contractTerm;

            // Note: Transition costs not included in base calculation
            // (only applies if transition option is exercised)
            developerRevenue = totalManagedService;
            buyerCosts = totalManagedService + (inputs.implementationCosts || 0);
            revenueBreakdown.subscription = totalManagedService;
            costBreakdown.subscription = totalManagedService;
            break;
        }

        default: {
            // Fallback to 6A-style
            const monthlyFee = inputs.monthlySubscriptionFee || 0;
            const totalSubscription = monthlyFee * 12 * contractTerm;
            developerRevenue = totalSubscription;
            buyerCosts = totalSubscription + (inputs.implementationCosts || 0);
            revenueBreakdown.subscription = totalSubscription;
            costBreakdown.subscription = totalSubscription;
        }
    }

    return { developerRevenue, buyerCosts, revenueBreakdown, costBreakdown };
}

/**
 * Developer perspective: Asset retention and subscription revenue
 */
function calculateDeveloperPerspective(revenue, revenueBreakdown, inputs, taxParams, variantId) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;
    const contractTerm = inputs.contractTerm || 3;

    // Developer capitalises development phase costs
    const researchCost = inputs.researchPhaseCost || 0;
    const developmentCost = inputs.developmentPhaseCost || 0;
    const developerUsefulLife = inputs.developerUsefulLife || 5;
    const annualAmortisation = developmentCost / developerUsefulLife;

    // Operating costs
    const annualOperatingCost = inputs.annualOperatingCost || 0;
    const annualEnhancementCost = inputs.annualEnhancementCost || 0;
    const totalAnnualCosts = annualAmortisation + annualOperatingCost + annualEnhancementCost;

    // Section 11(e) tax depreciation
    const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
    const taxDepreciation = developmentCost / section11eYears;

    // Annual revenue and profit
    const annualRevenue = revenue / contractTerm;
    const grossProfit = annualRevenue - totalAnnualCosts;
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
            monthly: annualRevenue / 12,
            breakdown: revenueBreakdown,
            recognitionTiming: 'over-time',
            recognitionBasis: 'IFRS 15 - over time as access provided'
        },
        costs: {
            researchExpensed: researchCost,
            developmentCapitalised: developmentCost,
            annualAmortisation,
            annualOperating: annualOperatingCost,
            annualEnhancement: annualEnhancementCost,
            totalAnnualCost: totalAnnualCosts
        },
        asset: {
            recognised: true,
            capitalisedAmount: developmentCost,
            carryingValue: developmentCost,
            usefulLife: developerUsefulLife,
            amortisationMethod: 'straight-line',
            annualAmortisation,
            reason: 'Internally developed platform - IAS 38 criteria met'
        },
        profit: {
            gross: grossProfit,
            margin: annualRevenue > 0 ? (grossProfit / annualRevenue) * 100 : 0,
            net: netProfit,
            totalOverTerm: netProfit * contractTerm
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
        schedule: generateDeveloperSchedule(developmentCost, developerUsefulLife, revenue, contractTerm)
    };
}

/**
 * Buyer perspective: Expense treatment (no asset recognition)
 */
function calculateBuyerPerspective(totalCost, costBreakdown, inputs, taxParams, variantId) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;
    const contractTerm = inputs.contractTerm || 3;

    // Key distinction: SaaS = no asset for Buyer (expense as incurred)
    const annualExpense = (totalCost - (inputs.implementationCosts || 0)) / contractTerm;
    const implementationCost = inputs.implementationCosts || 0;

    // Check for customisation that Buyer controls (6C variant)
    let buyerAsset = 0;
    let buyerAssetRecognised = false;
    if (variantId === '6C' && inputs.customisationControl === 'buyer') {
        buyerAsset = inputs.customisationCost || 0;
        buyerAssetRecognised = true;
    }

    // On-premise option creates asset (6D variant)
    if (variantId === '6D' && (inputs.deploymentChoice === 'on-premise' || inputs.deploymentChoice === 'hybrid')) {
        buyerAsset += inputs.onPremiseLicenceFee || 0;
        buyerAssetRecognised = true;
    }

    const buyerUsefulLife = contractTerm;
    const annualAssetAmortisation = buyerAsset > 0 ? buyerAsset / buyerUsefulLife : 0;

    // Tax benefit - subscription expenses deductible as incurred
    const annualTaxBenefit = (annualExpense + annualAssetAmortisation) * taxRate;

    return {
        asset: {
            recognised: buyerAssetRecognised,
            capitalised: buyerAsset,
            carryingValue: buyerAsset,
            usefulLife: buyerUsefulLife,
            annualAmortisation: annualAssetAmortisation,
            reason: buyerAssetRecognised ?
                'Buyer-controlled customisation or on-premise licence' :
                'SaaS - no asset recognised (expense as incurred)'
        },
        expenses: {
            year1: {
                subscription: annualExpense,
                implementation: implementationCost,
                amortisation: annualAssetAmortisation,
                total: annualExpense + implementationCost + annualAssetAmortisation
            },
            ongoing: {
                subscription: annualExpense,
                amortisation: annualAssetAmortisation,
                total: annualExpense + annualAssetAmortisation
            },
            breakdown: costBreakdown,
            totalOverTerm: totalCost
        },
        tax: {
            subscriptionDeduction: annualExpense,
            assetAmortisation: annualAssetAmortisation,
            annualTaxBenefit,
            totalTaxBenefit: annualTaxBenefit * contractTerm,
            deductionTiming: 'As incurred (no timing difference for subscription)'
        },
        totalCost,
        annualCost: annualExpense + annualAssetAmortisation,
        npv: calculateNPV(totalCost, contractTerm, 0.10)
    };
}

/**
 * Combined/Consolidation perspective
 */
function calculateCombinedPerspective(developer, buyer, entityConfig, inputs) {
    const isConsolidated = entityConfig?.relationship?.consolidationRequired ?? true;
    const contractTerm = inputs.contractTerm || 3;

    // In SaaS model: Developer has asset, Buyer has none (or minimal)
    const developerAsset = developer.asset.carryingValue;
    const buyerAsset = buyer.asset.capitalised;

    // On consolidation, subscription revenue/expense eliminates
    // Developer's asset represents the only group asset
    const groupAssetValue = developerAsset + (isConsolidated ? 0 : buyerAsset);

    // Intercompany profit elimination
    const profitToEliminate = isConsolidated ? developer.profit.gross : 0;

    // Asset efficiency - lower for SaaS since Buyer pays but gets no asset
    const totalCashExchanged = developer.revenue.total;
    const assetEfficiency = totalCashExchanged > 0 ? groupAssetValue / totalCashExchanged : 0;

    return {
        elimination: {
            required: isConsolidated,
            profitEliminated: profitToEliminate * contractTerm,
            revenueEliminated: developer.revenue.total,
            expenseEliminated: buyer.expenses.totalOverTerm,
            journalEntry: isConsolidated ? {
                debit: { account: 'Subscription Revenue (Developer)', amount: developer.revenue.total },
                credit: { account: 'Subscription Expense (Buyer)', amount: buyer.expenses.totalOverTerm }
            } : null
        },
        assetEfficiency: {
            developerAsset,
            buyerAsset,
            groupAsset: groupAssetValue,
            duplication: 0,  // No duplication - asset only with Developer
            efficiencyRatio: assetEfficiency,
            note: 'SaaS model - asset concentrated with Developer; Buyer expenses payments'
        },
        cashFlow: {
            developerNetCash: developer.revenue.total - (developer.tax.taxPayable * contractTerm),
            buyerNetCash: -buyer.totalCost + buyer.tax.totalTaxBenefit,
            groupNetCash: isConsolidated ?
                developer.profit.totalOverTerm :
                (developer.revenue.total - buyer.totalCost)
        },
        metrics: {
            totalTransactionValue: developer.revenue.total,
            groupTaxCost: (developer.tax.taxPayable - buyer.tax.annualTaxBenefit) * contractTerm,
            effectiveGroupTaxRate: developer.profit.gross > 0 ?
                ((developer.tax.taxPayable - buyer.tax.annualTaxBenefit) / developer.profit.gross) * 100 : 0,
            developerReturnOnAsset: developerAsset > 0 ?
                (developer.revenue.total / developerAsset) * 100 : 0
        },
        warning: {
            assetConcentration: true,
            message: 'SaaS model results in asset concentration with Developer. ' +
                'Consider Model 1, 2, or 3 if combined asset maximisation is priority.'
        }
    };
}

/**
 * Calculate SaaS vs alternatives comparison
 */
function calculateAlternativesComparison(inputs, buyerCosts) {
    const contractTerm = inputs.contractTerm || 3;

    // Estimate internal development cost (typically 2-3x platform cost)
    const internalBuildCost = (inputs.developmentCost || 0) * 1.5; // 50% premium for Buyer to build
    const internalAnnualMaintenance = internalBuildCost * 0.2; // 20% annual maintenance

    // Estimate outright purchase (Model 5)
    const outrightPurchase = (inputs.developmentCost || 0) * 0.8; // 80% of development cost
    const purchaseAnnualSupport = outrightPurchase * 0.15; // 15% annual support

    // Calculate 5-year total cost for each option
    const years = 5;

    const saas5YearCost = (buyerCosts / contractTerm) * years;
    const internal5YearCost = internalBuildCost + (internalAnnualMaintenance * years);
    const purchase5YearCost = outrightPurchase + (purchaseAnnualSupport * years);

    // Break-even analysis
    const annualSaaSCost = buyerCosts / contractTerm;
    const breakEvenVsInternal = annualSaaSCost > 0 ?
        internalBuildCost / (annualSaaSCost - internalAnnualMaintenance) : Infinity;
    const breakEvenVsPurchase = annualSaaSCost > 0 ?
        outrightPurchase / (annualSaaSCost - purchaseAnnualSupport) : Infinity;

    return {
        saas: {
            totalCost: saas5YearCost,
            annualCost: buyerCosts / contractTerm,
            assetRecognised: 0,
            pros: ['No upfront capital', 'Automatic updates', 'Scalable'],
            cons: ['No asset', 'Ongoing dependency', 'Cumulative cost']
        },
        internalDevelopment: {
            totalCost: internal5YearCost,
            upfrontCost: internalBuildCost,
            annualMaintenance: internalAnnualMaintenance,
            assetRecognised: internalBuildCost * 0.8, // Assume 80% capitalised
            breakEvenYears: breakEvenVsInternal > 0 ? breakEvenVsInternal : 'Never',
            pros: ['Full control', 'Asset recognised', 'Custom fit'],
            cons: ['High upfront cost', 'Development risk', 'Maintenance burden']
        },
        outrightPurchase: {
            totalCost: purchase5YearCost,
            upfrontCost: outrightPurchase,
            annualSupport: purchaseAnnualSupport,
            assetRecognised: outrightPurchase,
            breakEvenYears: breakEvenVsPurchase > 0 ? breakEvenVsPurchase : 'Never',
            pros: ['Asset recognised', 'Control', 'No vendor dependency'],
            cons: ['Upfront capital', 'Implementation risk', 'Upgrade costs']
        },
        recommendation: saas5YearCost < Math.min(internal5YearCost, purchase5YearCost) ?
            'SaaS appears most cost-effective for 5-year horizon' :
            'Consider purchase or internal development for long-term cost savings'
    };
}

/**
 * Assess transfer pricing risk for subscription arrangements
 */
function assessTransferPricing(inputs, variantId, developerRevenue, buyerCosts) {
    const contractTerm = inputs.contractTerm || 3;
    const annualSubscription = developerRevenue / contractTerm;

    // Benchmark ranges for SaaS/subscription arrangements
    const subscriptionBenchmarks = {
        costMultiplier: {
            low: 1.5,
            median: 2.5,
            high: 4.0
        },
        marginRange: {
            low: 40,
            median: 60,
            high: 80
        }
    };

    // Calculate implied margin
    const totalAnnualCosts = (inputs.annualOperatingCost || 0) +
        (inputs.annualEnhancementCost || 0) +
        ((inputs.developmentPhaseCost || 0) / (inputs.developerUsefulLife || 5));
    const impliedMargin = totalAnnualCosts > 0 ?
        ((annualSubscription - totalAnnualCosts) / annualSubscription) * 100 : 0;

    // Check if margin is within arm's length range
    const withinRange = impliedMargin >= subscriptionBenchmarks.marginRange.low &&
        impliedMargin <= subscriptionBenchmarks.marginRange.high;

    let riskScore, riskLevel;
    if (withinRange) {
        riskScore = 85;
        riskLevel = 'low';
    } else if (impliedMargin > 0 && impliedMargin < 100) {
        riskScore = 60;
        riskLevel = 'medium';
    } else {
        riskScore = 35;
        riskLevel = 'high';
    }

    return {
        method: 'Comparable Uncontrolled Price (CUP) / Cost Plus',
        annualSubscriptionValue: annualSubscription,
        impliedMargin,
        benchmarkRange: subscriptionBenchmarks.marginRange,
        withinRange,
        riskScore,
        riskLevel,
        recommendation: withinRange ?
            'Subscription pricing appears arm\'s length' :
            `Consider adjusting pricing toward ${subscriptionBenchmarks.marginRange.median}% margin`,
        documentation: [
            'Written subscription agreement',
            'Service level agreement (SLA)',
            'Comparable SaaS pricing analysis',
            'Functional analysis of services provided',
            'Cost allocation methodology'
        ]
    };
}

/**
 * Generate Developer schedule
 */
function generateDeveloperSchedule(capitalisedAmount, usefulLife, totalRevenue, contractTerm) {
    const annualAmortisation = capitalisedAmount / usefulLife;
    const annualRevenue = totalRevenue / contractTerm;
    const schedule = [];
    const maxYears = Math.max(usefulLife, contractTerm);

    for (let year = 1; year <= maxYears; year++) {
        schedule.push({
            year,
            openingAssetBalance: Math.max(0, capitalisedAmount - (annualAmortisation * (year - 1))),
            amortisation: year <= usefulLife ? annualAmortisation : 0,
            closingAssetBalance: Math.max(0, capitalisedAmount - (annualAmortisation * year)),
            revenue: year <= contractTerm ? annualRevenue : 0,
            cumulativeRevenue: Math.min(year, contractTerm) * annualRevenue
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

export const MODEL_6_SAAS_SUBSCRIPTION = {
    id: 'model-6',
    name: 'Subscription/SaaS Model',
    shortName: 'SaaS/Subscription',
    description: 'Developer hosts software, Buyer pays subscription. No asset transfer to Buyer.',
    category: 'intercompany',

    inputCategories: INPUT_CATEGORIES,
    baseInputs: BASE_INPUTS,
    variants: VARIANTS,
    defaultVariant: '6A',

    calculate,

    // UI hints
    icon: '☁️',
    color: '#10B981',  // Green

    // Accounting summary
    accountingSummary: {
        developer: 'Capitalise development costs (IAS 38). Recognise subscription revenue over access period (IFRS 15).',
        buyer: 'No asset recognition for SaaS. Expense subscription fees as incurred.',
        consolidation: 'Eliminate intercompany subscription. Asset remains with Developer only.'
    },

    // Special note for this model
    assetWarning: 'Note: SaaS model results in asset concentration with Developer. ' +
        'Buyer has no asset recognition. Consider other models if combined asset maximisation is a priority.'
};
