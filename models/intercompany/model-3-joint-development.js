// ========== MODEL 3: JOINT DEVELOPMENT / COST-SHARING ==========
// Both parties contribute resources to jointly develop software.
// Each party owns rights proportional to their contribution or as agreed.
//
// Key characteristics:
// - IP ownership: Shared/proportional
// - Cash flow: Each party funds their share of costs
// - Risk allocation: Shared proportionally
// - Developer asset position: Proportional (capitalises their share)
// - Buyer asset position: Proportional (capitalises their share)
// - No intercompany profit - key benefit for consolidation

// ========== INPUT CATEGORIES ==========

const INPUT_CATEGORIES = {
    project: {
        name: 'Project Parameters',
        description: 'Overall project scope and timing',
        icon: '📋'
    },
    developerContribution: {
        name: 'Developer Contributions',
        description: 'Developer entity contributions to the project',
        icon: '💻'
    },
    buyerContribution: {
        name: 'Buyer Contributions',
        description: 'Buyer entity contributions to the project',
        icon: '🏢'
    },
    ownership: {
        name: 'Ownership & Rights',
        description: 'Ownership split and exploitation rights',
        icon: '📊'
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
        default: 'Joint Software Development',
        category: 'project',
        hint: 'Name of the joint development project'
    },
    {
        name: 'totalProjectCost',
        label: 'Total Project Cost (R)',
        type: 'currency',
        default: 2000000,
        min: 0,
        step: 50000,
        category: 'project',
        hint: 'Total estimated cost of the development project'
    },
    {
        name: 'researchPhaseCost',
        label: 'Research Phase Cost (R)',
        type: 'currency',
        default: 400000,
        min: 0,
        step: 10000,
        category: 'project',
        hint: 'Costs before IAS 38 capitalisation criteria met (always expensed)'
    },
    {
        name: 'developmentPhaseCost',
        label: 'Development Phase Cost (R)',
        type: 'currency',
        default: 1600000,
        min: 0,
        step: 10000,
        category: 'project',
        hint: 'Costs after IAS 38 criteria met (capitalised by each party)'
    },
    {
        name: 'projectDurationMonths',
        label: 'Project Duration (Months)',
        type: 'number',
        default: 18,
        min: 1,
        max: 60,
        step: 1,
        category: 'project',
        hint: 'Expected duration of the development project'
    },

    // Developer Contributions
    {
        name: 'developerCashContribution',
        label: 'Developer Cash Contribution (R)',
        type: 'currency',
        default: 500000,
        min: 0,
        step: 10000,
        category: 'developerContribution',
        hint: 'Direct cash contribution from Developer'
    },
    {
        name: 'developerPersonnelFTEs',
        label: 'Developer Personnel (FTEs)',
        type: 'number',
        default: 5,
        min: 0,
        max: 100,
        step: 1,
        category: 'developerContribution',
        hint: 'Full-time equivalent staff contributed by Developer'
    },
    {
        name: 'developerPersonnelCostPerMonth',
        label: 'Personnel Cost per FTE/Month (R)',
        type: 'currency',
        default: 50000,
        min: 0,
        step: 5000,
        category: 'developerContribution',
        hint: 'Monthly cost per FTE contributed'
    },
    {
        name: 'developerIPContribution',
        label: 'Developer Existing IP Contribution (R)',
        type: 'currency',
        default: 200000,
        min: 0,
        step: 10000,
        category: 'developerContribution',
        hint: 'Fair value of existing IP contributed by Developer'
    },
    {
        name: 'developerFacilitiesContribution',
        label: 'Developer Facilities Contribution (R)',
        type: 'currency',
        default: 100000,
        min: 0,
        step: 10000,
        category: 'developerContribution',
        hint: 'Value of facilities/infrastructure contributed by Developer'
    },

    // Buyer Contributions
    {
        name: 'buyerCashContribution',
        label: 'Buyer Cash Contribution (R)',
        type: 'currency',
        default: 600000,
        min: 0,
        step: 10000,
        category: 'buyerContribution',
        hint: 'Direct cash contribution from Buyer'
    },
    {
        name: 'buyerPersonnelFTEs',
        label: 'Buyer Personnel (FTEs)',
        type: 'number',
        default: 3,
        min: 0,
        max: 100,
        step: 1,
        category: 'buyerContribution',
        hint: 'Full-time equivalent staff contributed by Buyer'
    },
    {
        name: 'buyerPersonnelCostPerMonth',
        label: 'Personnel Cost per FTE/Month (R)',
        type: 'currency',
        default: 45000,
        min: 0,
        step: 5000,
        category: 'buyerContribution',
        hint: 'Monthly cost per FTE contributed'
    },
    {
        name: 'buyerIPContribution',
        label: 'Buyer Existing IP Contribution (R)',
        type: 'currency',
        default: 100000,
        min: 0,
        step: 10000,
        category: 'buyerContribution',
        hint: 'Fair value of existing IP contributed by Buyer'
    },
    {
        name: 'buyerDomainExpertiseValue',
        label: 'Buyer Domain Expertise Value (R)',
        type: 'currency',
        default: 150000,
        min: 0,
        step: 10000,
        category: 'buyerContribution',
        hint: 'Value of domain expertise/requirements contributed by Buyer'
    },

    // Ownership & Rights
    {
        name: 'usefulLife',
        label: 'Useful Life (Years)',
        type: 'number',
        default: 5,
        min: 1,
        max: 20,
        step: 1,
        category: 'ownership',
        hint: 'Expected useful life for amortisation purposes'
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
    '3A': {
        name: 'Proportional Cost Sharing (Equal)',
        description: '50/50 ownership split regardless of actual contribution',
        scenario: 'Use when parties want simple, equal ownership regardless of varying contributions',
        additionalInputs: [
            {
                name: 'ownershipSplit',
                label: 'Developer Ownership (%)',
                type: 'percent',
                default: 50,
                min: 0,
                max: 100,
                step: 5,
                category: 'ownership',
                hint: 'Fixed ownership percentage for Developer (Buyer gets remainder)'
            }
        ],
        excludeInputs: [],
        ownershipMethod: 'fixed'
    },
    '3B': {
        name: 'Contribution-Based Sharing',
        description: 'Ownership matches contribution value - fair allocation',
        scenario: 'Use when ownership should reflect actual contributions from each party',
        additionalInputs: [
            {
                name: 'valuationMethod',
                label: 'Contribution Valuation Method',
                type: 'select',
                default: 'fair-value',
                options: [
                    { value: 'fair-value', label: 'Fair Value' },
                    { value: 'cost-basis', label: 'Cost Basis' },
                    { value: 'market-value', label: 'Market Value' }
                ],
                category: 'ownership',
                hint: 'Method for valuing non-cash contributions'
            }
        ],
        excludeInputs: [],
        ownershipMethod: 'contribution'
    },
    '3C': {
        name: 'Benefit-Based Sharing',
        description: 'Costs allocated by anticipated benefits received',
        scenario: 'Use when benefits differ significantly from contributions (transfer pricing compliant)',
        additionalInputs: [
            {
                name: 'developerAnticipatedBenefit',
                label: 'Developer Anticipated Benefit (R)',
                type: 'currency',
                default: 3000000,
                min: 0,
                step: 100000,
                category: 'ownership',
                hint: 'Expected value of benefits Developer will derive from the software'
            },
            {
                name: 'buyerAnticipatedBenefit',
                label: 'Buyer Anticipated Benefit (R)',
                type: 'currency',
                default: 5000000,
                min: 0,
                step: 100000,
                category: 'ownership',
                hint: 'Expected value of benefits Buyer will derive from the software'
            },
            {
                name: 'benefitMeasurementBasis',
                label: 'Benefit Measurement Basis',
                type: 'select',
                default: 'revenue',
                options: [
                    { value: 'revenue', label: 'Expected Revenue' },
                    { value: 'cost-savings', label: 'Cost Savings' },
                    { value: 'users-served', label: 'Users Served' }
                ],
                category: 'ownership',
                hint: 'Basis for measuring anticipated benefits'
            }
        ],
        excludeInputs: [],
        ownershipMethod: 'benefit'
    },
    '3D': {
        name: 'Platform + Application Split',
        description: 'Layered IP ownership - platform and application owned separately',
        scenario: 'Use when software has modular architecture with separable platform and application layers',
        additionalInputs: [
            {
                name: 'platformCost',
                label: 'Platform Development Cost (R)',
                type: 'currency',
                default: 800000,
                min: 0,
                step: 50000,
                category: 'project',
                hint: 'Cost to develop the platform/infrastructure layer'
            },
            {
                name: 'applicationCost',
                label: 'Application Development Cost (R)',
                type: 'currency',
                default: 800000,
                min: 0,
                step: 50000,
                category: 'project',
                hint: 'Cost to develop the application/business layer'
            },
            {
                name: 'platformOwner',
                label: 'Platform Owner',
                type: 'select',
                default: 'developer',
                options: [
                    { value: 'developer', label: 'Developer' },
                    { value: 'buyer', label: 'Buyer' },
                    { value: 'shared', label: 'Shared (50/50)' }
                ],
                category: 'ownership',
                hint: 'Entity that will own the platform IP'
            },
            {
                name: 'applicationOwner',
                label: 'Application Owner',
                type: 'select',
                default: 'buyer',
                options: [
                    { value: 'developer', label: 'Developer' },
                    { value: 'buyer', label: 'Buyer' },
                    { value: 'shared', label: 'Shared (50/50)' }
                ],
                category: 'ownership',
                hint: 'Entity that will own the application IP'
            },
            {
                name: 'crossLicenceFee',
                label: 'Cross-Licence Fee (R/year)',
                type: 'currency',
                default: 0,
                min: 0,
                step: 10000,
                category: 'ownership',
                hint: 'Annual fee for cross-licence (0 = royalty-free)'
            }
        ],
        excludeInputs: ['developmentPhaseCost'],
        ownershipMethod: 'layered'
    },
    '3E': {
        name: 'Development + Commercialisation Split',
        description: 'One party develops, other commercialises - capability-based split',
        scenario: 'Use when one party has development capability and other has market access',
        additionalInputs: [
            {
                name: 'developmentContributionValue',
                label: 'Development Contribution Value (R)',
                type: 'currency',
                default: 1200000,
                min: 0,
                step: 50000,
                category: 'developerContribution',
                hint: 'Value of development capability contributed (typically by Developer)'
            },
            {
                name: 'commercialisationContributionValue',
                label: 'Commercialisation Contribution Value (R)',
                type: 'currency',
                default: 800000,
                min: 0,
                step: 50000,
                category: 'buyerContribution',
                hint: 'Value of market access/distribution contributed (typically by Buyer)'
            },
            {
                name: 'revenueShareDeveloper',
                label: 'Developer Revenue Share (%)',
                type: 'percent',
                default: 40,
                min: 0,
                max: 100,
                step: 5,
                category: 'ownership',
                hint: 'Developer share of commercial revenue'
            },
            {
                name: 'expectedAnnualRevenue',
                label: 'Expected Annual Revenue (R)',
                type: 'currency',
                default: 2000000,
                min: 0,
                step: 100000,
                category: 'project',
                hint: 'Expected annual revenue from commercial exploitation'
            }
        ],
        excludeInputs: [],
        ownershipMethod: 'capability'
    },
    '3F': {
        name: 'Joint Venture Entity',
        description: 'Separate legal entity holds IP - formal JV structure',
        scenario: 'Use when legal separation is desired, third-party investors possible, or clean exit needed',
        additionalInputs: [
            {
                name: 'jvOwnershipDeveloper',
                label: 'Developer JV Ownership (%)',
                type: 'percent',
                default: 50,
                min: 0,
                max: 100,
                step: 5,
                category: 'ownership',
                hint: 'Developer ownership stake in the JV entity'
            },
            {
                name: 'developerCapitalContribution',
                label: 'Developer Capital Contribution (R)',
                type: 'currency',
                default: 500000,
                min: 0,
                step: 50000,
                category: 'developerContribution',
                hint: 'Cash capital contributed to JV by Developer'
            },
            {
                name: 'buyerCapitalContribution',
                label: 'Buyer Capital Contribution (R)',
                type: 'currency',
                default: 500000,
                min: 0,
                step: 50000,
                category: 'buyerContribution',
                hint: 'Cash capital contributed to JV by Buyer'
            },
            {
                name: 'jvOperatingCosts',
                label: 'JV Annual Operating Costs (R)',
                type: 'currency',
                default: 200000,
                min: 0,
                step: 10000,
                category: 'project',
                hint: 'Annual operating costs of the JV entity'
            },
            {
                name: 'dividendPolicy',
                label: 'Dividend Policy',
                type: 'select',
                default: 'reinvest',
                options: [
                    { value: 'reinvest', label: 'Reinvest All Profits' },
                    { value: 'distribute-50', label: 'Distribute 50% of Profits' },
                    { value: 'distribute-all', label: 'Distribute All Profits' }
                ],
                category: 'ownership',
                hint: 'JV profit distribution policy'
            },
            {
                name: 'accountingMethod',
                label: 'Parent Accounting Method',
                type: 'select',
                default: 'equity',
                options: [
                    { value: 'equity', label: 'Equity Method' },
                    { value: 'proportionate', label: 'Proportionate Consolidation' }
                ],
                category: 'ownership',
                hint: 'Accounting method for investment in JV'
            }
        ],
        excludeInputs: ['developerCashContribution', 'buyerCashContribution'],
        ownershipMethod: 'jv'
    },
    '3G': {
        name: 'Consortium / Multi-Party',
        description: 'More than two parties involved - industry collaboration',
        scenario: 'Use for industry-wide standards, research consortiums, or multi-party collaborations',
        additionalInputs: [
            {
                name: 'numberOfParties',
                label: 'Number of Parties',
                type: 'number',
                default: 4,
                min: 3,
                max: 10,
                step: 1,
                category: 'project',
                hint: 'Total number of parties in the consortium'
            },
            {
                name: 'developerOwnershipPct',
                label: 'Developer Ownership (%)',
                type: 'percent',
                default: 25,
                min: 0,
                max: 100,
                step: 5,
                category: 'ownership',
                hint: 'Developer ownership in the consortium'
            },
            {
                name: 'buyerOwnershipPct',
                label: 'Buyer Ownership (%)',
                type: 'percent',
                default: 25,
                min: 0,
                max: 100,
                step: 5,
                category: 'ownership',
                hint: 'Buyer ownership in the consortium'
            },
            {
                name: 'otherPartiesContribution',
                label: 'Other Parties Total Contribution (R)',
                type: 'currency',
                default: 1000000,
                min: 0,
                step: 50000,
                category: 'project',
                hint: 'Total contribution from all other consortium parties'
            },
            {
                name: 'governanceStructure',
                label: 'Governance Structure',
                type: 'select',
                default: 'steering-committee',
                options: [
                    { value: 'steering-committee', label: 'Steering Committee' },
                    { value: 'lead-party', label: 'Lead Party Model' },
                    { value: 'rotating-chair', label: 'Rotating Chair' }
                ],
                category: 'ownership',
                hint: 'Consortium governance structure'
            },
            {
                name: 'decisionThreshold',
                label: 'Decision Threshold (%)',
                type: 'percent',
                default: 75,
                min: 50,
                max: 100,
                step: 5,
                category: 'ownership',
                hint: 'Percentage required for major decisions'
            }
        ],
        excludeInputs: [],
        ownershipMethod: 'consortium'
    },
    '3H': {
        name: 'Pre-Competitive Joint Development',
        description: 'Shared base technology with proprietary extensions',
        scenario: 'Use when parties compete downstream but benefit from shared infrastructure',
        additionalInputs: [
            {
                name: 'sharedBaseCost',
                label: 'Shared Base Technology Cost (R)',
                type: 'currency',
                default: 1000000,
                min: 0,
                step: 50000,
                category: 'project',
                hint: 'Cost of developing shared/common technology base'
            },
            {
                name: 'developerExtensionCost',
                label: 'Developer Extension Cost (R)',
                type: 'currency',
                default: 400000,
                min: 0,
                step: 10000,
                category: 'developerContribution',
                hint: 'Cost of Developer-proprietary extensions'
            },
            {
                name: 'buyerExtensionCost',
                label: 'Buyer Extension Cost (R)',
                type: 'currency',
                default: 400000,
                min: 0,
                step: 10000,
                category: 'buyerContribution',
                hint: 'Cost of Buyer-proprietary extensions'
            },
            {
                name: 'sharedCostSplit',
                label: 'Developer Share of Base Cost (%)',
                type: 'percent',
                default: 50,
                min: 0,
                max: 100,
                step: 5,
                category: 'ownership',
                hint: 'Developer share of shared base development cost'
            },
            {
                name: 'crossLicenceForBase',
                label: 'Cross-Licence for Base',
                type: 'select',
                default: 'royalty-free',
                options: [
                    { value: 'royalty-free', label: 'Royalty-Free' },
                    { value: 'frand', label: 'FRAND Terms' },
                    { value: 'fee-based', label: 'Fee-Based' }
                ],
                category: 'ownership',
                hint: 'Terms for cross-licensing the shared base'
            }
        ],
        excludeInputs: ['totalProjectCost', 'developmentPhaseCost'],
        ownershipMethod: 'precompetitive'
    }
};

// ========== CALCULATION FUNCTIONS ==========

/**
 * Calculate three-perspective results for Model 3
 */
function calculate(inputs, variantId, entityConfig = {}, taxParams = {}) {
    const variant = VARIANTS[variantId] || VARIANTS['3B'];

    // Calculate contributions and ownership
    const contributions = calculateContributions(inputs, variant);

    // Calculate ownership based on variant method
    const ownership = calculateOwnership(inputs, variant, contributions);

    // Developer perspective calculations
    const developer = calculateDeveloperPerspective(inputs, variant, contributions, ownership, taxParams);

    // Buyer perspective calculations
    const buyer = calculateBuyerPerspective(inputs, variant, contributions, ownership, taxParams);

    // Transfer pricing assessment
    const transferPricing = assessTransferPricing(contributions, ownership, inputs, variant);

    return {
        developer,
        buyer,
        transferPricing,
        metadata: {
            modelId: 'model-3',
            modelName: 'Joint Development / Cost-Sharing',
            variantId,
            variantName: variant.name,
            ownershipMethod: variant.ownershipMethod,
            calculatedAt: new Date().toISOString()
        }
    };
}

/**
 * Calculate contribution values for each party
 */
function calculateContributions(inputs, variant) {
    const projectDuration = inputs.projectDurationMonths || 18;

    // Developer contributions
    const developerCash = inputs.developerCashContribution || 0;
    const developerPersonnel = (inputs.developerPersonnelFTEs || 0) *
        (inputs.developerPersonnelCostPerMonth || 0) * projectDuration;
    const developerIP = inputs.developerIPContribution || 0;
    const developerFacilities = inputs.developerFacilitiesContribution || 0;
    const developerTotal = developerCash + developerPersonnel + developerIP + developerFacilities;

    // Buyer contributions
    const buyerCash = inputs.buyerCashContribution || 0;
    const buyerPersonnel = (inputs.buyerPersonnelFTEs || 0) *
        (inputs.buyerPersonnelCostPerMonth || 0) * projectDuration;
    const buyerIP = inputs.buyerIPContribution || 0;
    const buyerDomainExpertise = inputs.buyerDomainExpertiseValue || 0;
    const buyerTotal = buyerCash + buyerPersonnel + buyerIP + buyerDomainExpertise;

    // Handle variant-specific contribution adjustments
    let totalContributions = developerTotal + buyerTotal;
    let otherPartiesTotal = 0;

    if (variant.ownershipMethod === 'jv') {
        // For JV, use capital contributions
        const devCapital = inputs.developerCapitalContribution || 0;
        const buyerCapital = inputs.buyerCapitalContribution || 0;
        totalContributions = devCapital + buyerCapital;
    } else if (variant.ownershipMethod === 'consortium') {
        otherPartiesTotal = inputs.otherPartiesContribution || 0;
        totalContributions = developerTotal + buyerTotal + otherPartiesTotal;
    } else if (variant.ownershipMethod === 'precompetitive') {
        // Shared base plus proprietary extensions
        const sharedBase = inputs.sharedBaseCost || 0;
        const devExtension = inputs.developerExtensionCost || 0;
        const buyerExtension = inputs.buyerExtensionCost || 0;
        totalContributions = sharedBase + devExtension + buyerExtension;
    }

    return {
        developer: {
            cash: developerCash,
            personnel: developerPersonnel,
            existingIP: developerIP,
            facilities: developerFacilities,
            total: developerTotal,
            breakdown: {
                cash: developerCash,
                inKind: developerPersonnel + developerIP + developerFacilities
            }
        },
        buyer: {
            cash: buyerCash,
            personnel: buyerPersonnel,
            existingIP: buyerIP,
            domainExpertise: buyerDomainExpertise,
            total: buyerTotal,
            breakdown: {
                cash: buyerCash,
                inKind: buyerPersonnel + buyerIP + buyerDomainExpertise
            }
        },
        otherParties: otherPartiesTotal,
        total: totalContributions
    };
}

/**
 * Calculate ownership percentages based on variant method
 */
function calculateOwnership(inputs, variant, contributions) {
    let developerPct, buyerPct, otherPartiesPct = 0;

    switch (variant.ownershipMethod) {
        case 'fixed':
            // 3A: Fixed ownership split
            developerPct = inputs.ownershipSplit || 50;
            buyerPct = 100 - developerPct;
            break;

        case 'contribution':
            // 3B: Ownership matches contribution
            if (contributions.total > 0) {
                developerPct = (contributions.developer.total / contributions.total) * 100;
                buyerPct = (contributions.buyer.total / contributions.total) * 100;
            } else {
                developerPct = 50;
                buyerPct = 50;
            }
            break;

        case 'benefit':
            // 3C: Ownership matches anticipated benefits
            const devBenefit = inputs.developerAnticipatedBenefit || 0;
            const buyerBenefit = inputs.buyerAnticipatedBenefit || 0;
            const totalBenefit = devBenefit + buyerBenefit;
            if (totalBenefit > 0) {
                developerPct = (devBenefit / totalBenefit) * 100;
                buyerPct = (buyerBenefit / totalBenefit) * 100;
            } else {
                developerPct = 50;
                buyerPct = 50;
            }
            break;

        case 'layered':
            // 3D: Platform + Application split - calculate effective ownership
            const platformCost = inputs.platformCost || 0;
            const applicationCost = inputs.applicationCost || 0;
            const totalLayeredCost = platformCost + applicationCost;

            let devOwnership = 0;
            let buyerOwnership = 0;

            if (totalLayeredCost > 0) {
                // Platform ownership
                if (inputs.platformOwner === 'developer') devOwnership += platformCost;
                else if (inputs.platformOwner === 'buyer') buyerOwnership += platformCost;
                else { devOwnership += platformCost / 2; buyerOwnership += platformCost / 2; }

                // Application ownership
                if (inputs.applicationOwner === 'developer') devOwnership += applicationCost;
                else if (inputs.applicationOwner === 'buyer') buyerOwnership += applicationCost;
                else { devOwnership += applicationCost / 2; buyerOwnership += applicationCost / 2; }

                developerPct = (devOwnership / totalLayeredCost) * 100;
                buyerPct = (buyerOwnership / totalLayeredCost) * 100;
            } else {
                developerPct = 50;
                buyerPct = 50;
            }
            break;

        case 'capability':
            // 3E: Development + Commercialisation split
            const devContrib = inputs.developmentContributionValue || 0;
            const commContrib = inputs.commercialisationContributionValue || 0;
            const totalCapability = devContrib + commContrib;
            if (totalCapability > 0) {
                developerPct = (devContrib / totalCapability) * 100;
                buyerPct = (commContrib / totalCapability) * 100;
            } else {
                developerPct = 50;
                buyerPct = 50;
            }
            break;

        case 'jv':
            // 3F: JV ownership
            developerPct = inputs.jvOwnershipDeveloper || 50;
            buyerPct = 100 - developerPct;
            break;

        case 'consortium':
            // 3G: Multi-party consortium
            developerPct = inputs.developerOwnershipPct || 25;
            buyerPct = inputs.buyerOwnershipPct || 25;
            otherPartiesPct = 100 - developerPct - buyerPct;
            break;

        case 'precompetitive':
            // 3H: Pre-competitive - shared base + proprietary extensions
            const sharedBase = inputs.sharedBaseCost || 0;
            const devExt = inputs.developerExtensionCost || 0;
            const buyerExt = inputs.buyerExtensionCost || 0;
            const devSharePct = inputs.sharedCostSplit || 50;

            // Each party owns their share of base + their full extensions
            const devValue = (sharedBase * devSharePct / 100) + devExt;
            const buyerValue = (sharedBase * (100 - devSharePct) / 100) + buyerExt;
            const totalValue = devValue + buyerValue;

            if (totalValue > 0) {
                developerPct = (devValue / totalValue) * 100;
                buyerPct = (buyerValue / totalValue) * 100;
            } else {
                developerPct = 50;
                buyerPct = 50;
            }
            break;

        default:
            developerPct = 50;
            buyerPct = 50;
    }

    return {
        developer: developerPct,
        buyer: buyerPct,
        otherParties: otherPartiesPct,
        method: variant.ownershipMethod
    };
}

/**
 * Developer perspective: Contribution, asset recognition, tax
 */
function calculateDeveloperPerspective(inputs, variant, contributions, ownership, taxParams) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;
    const usefulLife = inputs.usefulLife || 5;

    // Research vs Development split for capitalisation
    const researchCost = inputs.researchPhaseCost || 0;
    const developmentCost = inputs.developmentPhaseCost || (inputs.totalProjectCost - researchCost) || 0;

    // Developer's share of costs
    const costSharePct = ownership.developer / 100;

    // Handle variant-specific asset calculations
    let capitalisedAmount, expensedAmount, assetDescription;

    if (variant.ownershipMethod === 'jv') {
        // JV: Investment in associate/subsidiary
        const capitalContrib = inputs.developerCapitalContribution || 0;
        capitalisedAmount = capitalContrib;  // Investment at cost
        expensedAmount = 0;
        assetDescription = 'Investment in joint venture (equity method)';
    } else if (variant.ownershipMethod === 'layered') {
        // Layered: Calculate based on owned layers
        const platformCost = inputs.platformCost || 0;
        const applicationCost = inputs.applicationCost || 0;

        let devAsset = 0;
        if (inputs.platformOwner === 'developer') devAsset += platformCost;
        else if (inputs.platformOwner === 'shared') devAsset += platformCost / 2;
        if (inputs.applicationOwner === 'developer') devAsset += applicationCost;
        else if (inputs.applicationOwner === 'shared') devAsset += applicationCost / 2;

        // Apply research/dev split
        const layeredTotal = platformCost + applicationCost;
        const devPhasePct = layeredTotal > 0 ? developmentCost / (researchCost + developmentCost) : 0.8;
        capitalisedAmount = devAsset * devPhasePct;
        expensedAmount = devAsset * (1 - devPhasePct);
        assetDescription = 'Intangible asset - owned technology layers';
    } else if (variant.ownershipMethod === 'precompetitive') {
        // Pre-competitive: Share of base + full extension
        const sharedBase = inputs.sharedBaseCost || 0;
        const devExtension = inputs.developerExtensionCost || 0;
        const devSharePct = inputs.sharedCostSplit || 50;

        const devTotal = (sharedBase * devSharePct / 100) + devExtension;
        const devPhasePct = 0.8;  // Assume 80% development phase
        capitalisedAmount = devTotal * devPhasePct;
        expensedAmount = devTotal * (1 - devPhasePct);
        assetDescription = 'Intangible asset - shared base + proprietary extensions';
    } else {
        // Standard joint development
        capitalisedAmount = developmentCost * costSharePct;
        expensedAmount = researchCost * costSharePct;
        assetDescription = 'Intangible asset - jointly developed software';
    }

    const annualAmortisation = capitalisedAmount / usefulLife;

    // Section 11(e) tax depreciation
    const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
    const taxDepreciation = capitalisedAmount / section11eYears;
    const timingDifference = annualAmortisation - taxDepreciation;
    const deferredTax = timingDifference * taxRate;

    // Revenue share if applicable (3E)
    let revenueShare = 0;
    if (variant.ownershipMethod === 'capability') {
        const revSharePct = inputs.revenueShareDeveloper || 40;
        const expectedRevenue = inputs.expectedAnnualRevenue || 0;
        revenueShare = expectedRevenue * revSharePct / 100;
    }

    return {
        contribution: {
            total: contributions.developer.total,
            percentage: contributions.total > 0 ?
                (contributions.developer.total / contributions.total) * 100 : 0,
            breakdown: contributions.developer.breakdown,
            detail: {
                cash: contributions.developer.cash,
                personnel: contributions.developer.personnel,
                existingIP: contributions.developer.existingIP,
                facilities: contributions.developer.facilities
            }
        },
        ownership: {
            percentage: ownership.developer,
            rights: 'Proportional exploitation rights based on ownership'
        },
        asset: {
            recognised: capitalisedAmount > 0,
            capitalised: capitalisedAmount,
            expensed: expensedAmount,
            carryingValue: capitalisedAmount,
            description: assetDescription,
            usefulLife: usefulLife,
            amortisationMethod: 'straight-line',
            annualAmortisation: annualAmortisation,
            schedule: generateAmortisationSchedule(capitalisedAmount, usefulLife)
        },
        revenue: {
            revenueShare: revenueShare,
            recognitionTiming: 'not-applicable',
            recognitionBasis: 'Joint development - no sale transaction'
        },
        tax: {
            section11eDeduction: taxDepreciation,
            accountingAmortisation: annualAmortisation,
            timingDifference: timingDifference,
            deferredTaxAsset: deferredTax > 0 ? deferredTax : 0,
            deferredTaxLiability: deferredTax < 0 ? Math.abs(deferredTax) : 0,
            annualTaxBenefit: taxDepreciation * taxRate
        }
    };
}

/**
 * Buyer perspective: Contribution, asset recognition, tax
 */
function calculateBuyerPerspective(inputs, variant, contributions, ownership, taxParams) {
    const taxRate = (inputs.corporateTaxRate || 27) / 100;
    const usefulLife = inputs.usefulLife || 5;

    // Research vs Development split
    const researchCost = inputs.researchPhaseCost || 0;
    const developmentCost = inputs.developmentPhaseCost || (inputs.totalProjectCost - researchCost) || 0;

    // Buyer's share of costs
    const costSharePct = ownership.buyer / 100;

    // Handle variant-specific asset calculations
    let capitalisedAmount, expensedAmount, assetDescription;

    if (variant.ownershipMethod === 'jv') {
        // JV: Investment in associate/subsidiary
        const capitalContrib = inputs.buyerCapitalContribution || 0;
        capitalisedAmount = capitalContrib;
        expensedAmount = 0;
        assetDescription = 'Investment in joint venture (equity method)';
    } else if (variant.ownershipMethod === 'layered') {
        // Layered: Calculate based on owned layers
        const platformCost = inputs.platformCost || 0;
        const applicationCost = inputs.applicationCost || 0;

        let buyerAsset = 0;
        if (inputs.platformOwner === 'buyer') buyerAsset += platformCost;
        else if (inputs.platformOwner === 'shared') buyerAsset += platformCost / 2;
        if (inputs.applicationOwner === 'buyer') buyerAsset += applicationCost;
        else if (inputs.applicationOwner === 'shared') buyerAsset += applicationCost / 2;

        const layeredTotal = platformCost + applicationCost;
        const devPhasePct = layeredTotal > 0 ? developmentCost / (researchCost + developmentCost) : 0.8;
        capitalisedAmount = buyerAsset * devPhasePct;
        expensedAmount = buyerAsset * (1 - devPhasePct);
        assetDescription = 'Intangible asset - owned technology layers';
    } else if (variant.ownershipMethod === 'precompetitive') {
        // Pre-competitive: Share of base + full extension
        const sharedBase = inputs.sharedBaseCost || 0;
        const buyerExtension = inputs.buyerExtensionCost || 0;
        const devSharePct = inputs.sharedCostSplit || 50;

        const buyerTotal = (sharedBase * (100 - devSharePct) / 100) + buyerExtension;
        const devPhasePct = 0.8;
        capitalisedAmount = buyerTotal * devPhasePct;
        expensedAmount = buyerTotal * (1 - devPhasePct);
        assetDescription = 'Intangible asset - shared base + proprietary extensions';
    } else {
        // Standard joint development
        capitalisedAmount = developmentCost * costSharePct;
        expensedAmount = researchCost * costSharePct;
        assetDescription = 'Intangible asset - jointly developed software';
    }

    const annualAmortisation = capitalisedAmount / usefulLife;

    // Section 11(e) tax depreciation
    const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
    const taxDepreciation = capitalisedAmount / section11eYears;
    const timingDifference = annualAmortisation - taxDepreciation;
    const deferredTax = timingDifference * taxRate;

    // Revenue share if applicable (3E)
    let revenueShare = 0;
    if (variant.ownershipMethod === 'capability') {
        const buyerSharePct = 100 - (inputs.revenueShareDeveloper || 40);
        const expectedRevenue = inputs.expectedAnnualRevenue || 0;
        revenueShare = expectedRevenue * buyerSharePct / 100;
    }

    return {
        contribution: {
            total: contributions.buyer.total,
            percentage: contributions.total > 0 ?
                (contributions.buyer.total / contributions.total) * 100 : 0,
            breakdown: contributions.buyer.breakdown,
            detail: {
                cash: contributions.buyer.cash,
                personnel: contributions.buyer.personnel,
                existingIP: contributions.buyer.existingIP,
                domainExpertise: contributions.buyer.domainExpertise
            }
        },
        ownership: {
            percentage: ownership.buyer,
            rights: 'Proportional exploitation rights based on ownership'
        },
        asset: {
            recognised: capitalisedAmount > 0,
            capitalised: capitalisedAmount,
            expensed: expensedAmount,
            carryingValue: capitalisedAmount,
            description: assetDescription,
            usefulLife: usefulLife,
            amortisationMethod: 'straight-line',
            annualAmortisation: annualAmortisation,
            schedule: generateAmortisationSchedule(capitalisedAmount, usefulLife)
        },
        revenue: {
            revenueShare: revenueShare,
            recognitionTiming: 'not-applicable',
            recognitionBasis: 'Joint development - no sale transaction'
        },
        tax: {
            section11eDeduction: taxDepreciation,
            accountingAmortisation: annualAmortisation,
            timingDifference: timingDifference,
            deferredTaxAsset: deferredTax > 0 ? deferredTax : 0,
            deferredTaxLiability: deferredTax < 0 ? Math.abs(deferredTax) : 0,
            annualTaxBenefit: taxDepreciation * taxRate
        },
        totalCost: contributions.buyer.total
    };
}

/**
 * Assess transfer pricing risk for joint development
 */
function assessTransferPricing(contributions, ownership, inputs, variant) {
    // For joint development, key is contribution value defensibility
    let riskScore, riskLevel, recommendation;

    // Calculate contribution vs ownership alignment
    const devContribPct = contributions.total > 0 ?
        (contributions.developer.total / contributions.total) * 100 : 0;
    const devOwnershipPct = ownership.developer;

    const alignmentDiff = Math.abs(devContribPct - devOwnershipPct);

    // Assess risk based on alignment
    if (variant.ownershipMethod === 'benefit') {
        // Benefit-based requires robust benefit projections
        const totalBenefit = (inputs.developerAnticipatedBenefit || 0) +
            (inputs.buyerAnticipatedBenefit || 0);
        if (totalBenefit > 0 && alignmentDiff <= 15) {
            riskScore = 85;
            riskLevel = 'low';
            recommendation = 'Benefit-based allocation with documented projections is defensible';
        } else {
            riskScore = 60;
            riskLevel = 'medium';
            recommendation = 'Ensure benefit projections are well-documented and reasonable';
        }
    } else if (variant.ownershipMethod === 'contribution') {
        // Contribution-based is typically low risk
        if (alignmentDiff <= 5) {
            riskScore = 95;
            riskLevel = 'low';
            recommendation = 'Ownership matches contributions - highly defensible';
        } else if (alignmentDiff <= 15) {
            riskScore = 80;
            riskLevel = 'low';
            recommendation = 'Minor alignment variance - document rationale';
        } else {
            riskScore = 65;
            riskLevel = 'medium';
            recommendation = 'Significant misalignment between contributions and ownership';
        }
    } else if (variant.ownershipMethod === 'fixed') {
        // Fixed split requires business rationale
        if (alignmentDiff <= 20) {
            riskScore = 75;
            riskLevel = 'low';
            recommendation = 'Fixed split acceptable with documented business rationale';
        } else {
            riskScore = 55;
            riskLevel = 'medium';
            recommendation = 'Fixed split significantly differs from contributions - document reasons';
        }
    } else if (variant.ownershipMethod === 'jv') {
        // JV structure provides good documentation
        riskScore = 85;
        riskLevel = 'low';
        recommendation = 'JV structure provides clear legal separation and documentation';
    } else {
        // Other variants
        riskScore = 70;
        riskLevel = 'low';
        recommendation = 'Ensure contribution valuations are documented and defensible';
    }

    return {
        method: 'cost-contribution-arrangement',
        contributionAlignment: {
            developerContributionPct: devContribPct,
            developerOwnershipPct: devOwnershipPct,
            alignmentDifference: alignmentDiff
        },
        riskScore: riskScore,
        riskLevel: riskLevel,
        recommendation: recommendation,
        keyBenefit: 'No intercompany profit - eliminates margin-based transfer pricing risk',
        documentation: [
            'Written cost-sharing agreement (must predate development)',
            'Contribution valuation methodology and supporting analysis',
            'Benefit expectation analysis (if benefit-based)',
            'Cost tracking and allocation records',
            'Independent valuation for non-cash contributions',
            'Transfer pricing policy document'
        ],
        oecdCompliance: {
            principle: 'OECD Cost Contribution Arrangement guidelines',
            requirement: 'Contributions should be commensurate with expected benefits',
            assessment: alignmentDiff <= 20 ? 'Compliant' : 'Review recommended'
        }
    };
}

/**
 * Generate year-by-year amortisation schedule
 */
function generateAmortisationSchedule(capitalisedAmount, usefulLife) {
    if (capitalisedAmount <= 0 || usefulLife <= 0) {
        return [];
    }

    const annualAmortisation = capitalisedAmount / usefulLife;
    const schedule = [];

    for (let year = 1; year <= usefulLife; year++) {
        schedule.push({
            year: year,
            openingBalance: capitalisedAmount - (annualAmortisation * (year - 1)),
            amortisation: annualAmortisation,
            closingBalance: Math.max(0, capitalisedAmount - (annualAmortisation * year))
        });
    }

    return schedule;
}

// ========== EXPORT ==========

export const MODEL_3_JOINT_DEVELOPMENT = {
    id: 'model-3',
    name: 'Joint Development / Cost-Sharing',
    shortName: 'Joint Development',
    description: 'Both parties contribute resources to jointly develop software. Each party owns rights proportional to their contribution.',
    category: 'intercompany',

    inputCategories: INPUT_CATEGORIES,
    baseInputs: BASE_INPUTS,
    variants: VARIANTS,
    defaultVariant: '3B',

    calculate: calculate,

    // UI hints
    icon: '🤝',
    color: '#10B981',  // Green - collaboration

    // Accounting summary
    accountingSummary: {
        developer: 'Capitalise proportional share of development costs as intangible asset (IAS 38). Expense research phase costs.',
        buyer: 'Capitalise proportional share of development costs as intangible asset (IAS 38). Expense research phase costs.',
        consolidation: 'No intercompany profit elimination required. Both parties at cost basis. Clean consolidation.'
    }
};
