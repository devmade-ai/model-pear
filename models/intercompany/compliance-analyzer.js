// ========== COMPLIANCE ANALYZER MODULE ==========
// Comprehensive compliance analysis for inter-company software transactions.
// Provides transfer pricing risk assessment, accounting treatment summaries,
// tax impact analysis, and compliance checklists.
//
// Part of Phase 9 implementation - Module 3: Compliance Analyzer

import { INTERCOMPANY_MODELS } from './registry.js';

// ========== TRANSFER PRICING BENCHMARKS ==========

/**
 * Arm's length benchmark ranges by transaction type (OECD Guidelines)
 */
export const TRANSFER_PRICING_BENCHMARKS = {
    'cost-plus': {
        name: 'Cost Plus Method (CPM)',
        description: 'Markup on costs for development services',
        lowRisk: { min: 5, max: 15 },
        mediumRisk: { min: 0, max: 20 },
        typical: 10,
        guidance: 'Software development services typically attract 5-15% markup'
    },
    'licence-royalty': {
        name: 'Comparable Uncontrolled Price (CUP) / Royalty',
        description: 'Royalty rate as percentage of revenue',
        lowRisk: { min: 5, max: 25 },
        mediumRisk: { min: 2, max: 35 },
        typical: 15,
        guidance: 'Software licence royalties typically range 5-25% of revenue'
    },
    'resale-margin': {
        name: 'Resale Price Method (RPM)',
        description: 'Margin retained by reseller/distributor',
        lowRisk: { min: 20, max: 40 },
        mediumRisk: { min: 15, max: 50 },
        typical: 30,
        guidance: 'Software resellers typically retain 20-40% margin'
    },
    'profit-split': {
        name: 'Profit Split Method (PSM)',
        description: 'Residual profit allocation percentage',
        lowRisk: { min: 40, max: 60 },
        mediumRisk: { min: 30, max: 70 },
        typical: 50,
        guidance: 'Joint development typically splits residual profits 40-60%'
    },
    'tnmm': {
        name: 'Transactional Net Margin Method (TNMM)',
        description: 'Net operating margin percentage',
        lowRisk: { min: 3, max: 10 },
        mediumRisk: { min: 1, max: 15 },
        typical: 6,
        guidance: 'Service providers typically earn 3-10% net margin'
    }
};

// ========== RISK SCORING FACTORS ==========

/**
 * Risk factor weights for composite score calculation
 */
const RISK_FACTORS = {
    marginCompliance: {
        weight: 30,
        description: 'Margin/royalty within benchmark range'
    },
    documentationStatus: {
        weight: 25,
        description: 'Transfer pricing documentation completeness'
    },
    substanceRequirements: {
        weight: 20,
        description: 'Economic substance and business rationale'
    },
    comparabilityAnalysis: {
        weight: 15,
        description: 'Comparable transaction analysis quality'
    },
    consistentApplication: {
        weight: 10,
        description: 'Consistent year-on-year application'
    }
};

// ========== COMPLIANCE CHECKLISTS ==========

/**
 * Comprehensive compliance checklists by category
 */
export const COMPLIANCE_CHECKLISTS = {
    writtenAgreement: {
        name: 'Written Agreement Requirements',
        description: 'Legal documentation requirements for inter-company transactions',
        items: [
            { id: 'wa1', text: 'Written agreement in place before transaction commencement', critical: true },
            { id: 'wa2', text: 'Agreement clearly defines scope of work / IP rights', critical: true },
            { id: 'wa3', text: 'Pricing terms and payment schedule documented', critical: true },
            { id: 'wa4', text: 'Risk allocation clearly specified', critical: false },
            { id: 'wa5', text: 'Termination clauses and consequences defined', critical: false },
            { id: 'wa6', text: 'Dispute resolution mechanism included', critical: false },
            { id: 'wa7', text: 'Agreement signed by authorised representatives', critical: true },
            { id: 'wa8', text: 'Amendments properly documented and signed', critical: false }
        ]
    },
    transferPricingDoc: {
        name: 'Transfer Pricing Documentation',
        description: 'SARS and OECD transfer pricing documentation requirements',
        items: [
            { id: 'tp1', text: 'Master File prepared (group overview)', critical: false },
            { id: 'tp2', text: 'Local File prepared (entity-specific analysis)', critical: true },
            { id: 'tp3', text: 'Functional analysis documenting DEMPE functions', critical: true },
            { id: 'tp4', text: 'Economic analysis with benchmark study', critical: true },
            { id: 'tp5', text: 'Comparable transactions identified and analysed', critical: false },
            { id: 'tp6', text: 'Transfer pricing method selection justified', critical: true },
            { id: 'tp7', text: 'Arm\'s length range determined', critical: true },
            { id: 'tp8', text: 'Year-end adjustments documented (if any)', critical: false },
            { id: 'tp9', text: 'Country-by-Country Report filed (if applicable)', critical: false }
        ]
    },
    developmentPhase: {
        name: 'Development Phase Documentation',
        description: 'IAS 38 intangible asset recognition requirements',
        items: [
            { id: 'dp1', text: 'Research vs development phase clearly distinguished', critical: true },
            { id: 'dp2', text: 'Technical feasibility demonstrated', critical: true },
            { id: 'dp3', text: 'Intention to complete documented (board minutes)', critical: false },
            { id: 'dp4', text: 'Ability to use or sell demonstrated', critical: false },
            { id: 'dp5', text: 'Future economic benefits probable', critical: true },
            { id: 'dp6', text: 'Adequate resources to complete available', critical: false },
            { id: 'dp7', text: 'Costs reliably measured and tracked', critical: true },
            { id: 'dp8', text: 'Date of IAS 38 criteria met documented', critical: true }
        ]
    },
    costTracking: {
        name: 'Cost Tracking Systems',
        description: 'Cost allocation and tracking requirements',
        items: [
            { id: 'ct1', text: 'Time tracking system in place for developers', critical: true },
            { id: 'ct2', text: 'Project-specific cost codes established', critical: true },
            { id: 'ct3', text: 'Direct vs indirect cost allocation methodology', critical: true },
            { id: 'ct4', text: 'Overhead allocation keys documented', critical: false },
            { id: 'ct5', text: 'Third-party costs separately tracked', critical: false },
            { id: 'ct6', text: 'Monthly cost reconciliation performed', critical: false },
            { id: 'ct7', text: 'Cost allocation policy documented', critical: true }
        ]
    },
    controlAssessment: {
        name: 'Control Assessment',
        description: 'IP ownership and control requirements',
        items: [
            { id: 'ca1', text: 'Control over development decisions documented', critical: true },
            { id: 'ca2', text: 'Risk-bearing capacity demonstrated', critical: true },
            { id: 'ca3', text: 'Funding of development costs tracked', critical: true },
            { id: 'ca4', text: 'Decision-making authority documented', critical: false },
            { id: 'ca5', text: 'Key personnel involvement recorded', critical: false },
            { id: 'ca6', text: 'Project governance structure defined', critical: false }
        ]
    },
    relatedPartyDisclosure: {
        name: 'Related Party Disclosure',
        description: 'IAS 24 related party disclosure requirements',
        items: [
            { id: 'rp1', text: 'Related party relationship disclosed in financials', critical: true },
            { id: 'rp2', text: 'Transaction amounts disclosed', critical: true },
            { id: 'rp3', text: 'Outstanding balances disclosed', critical: true },
            { id: 'rp4', text: 'Terms and conditions disclosed', critical: false },
            { id: 'rp5', text: 'Guarantees given/received disclosed', critical: false },
            { id: 'rp6', text: 'Bad debt provisions for related party balances', critical: false }
        ]
    }
};

// ========== ACCOUNTING STANDARDS GUIDANCE ==========

/**
 * Key accounting standards applicable to software transactions
 */
export const ACCOUNTING_STANDARDS = {
    developer: {
        revenueRecognition: {
            standard: 'IFRS 15',
            title: 'Revenue from Contracts with Customers',
            considerations: [
                'Identify separate performance obligations',
                'Determine transaction price (variable consideration)',
                'Allocate transaction price to obligations',
                'Recognise revenue over time or at point in time'
            ]
        },
        assetRecognition: {
            standard: 'IAS 38',
            title: 'Intangible Assets',
            considerations: [
                'Expense research costs as incurred',
                'Capitalise development costs when criteria met',
                'Assess useful life (finite vs indefinite)',
                'Annual impairment testing if indefinite'
            ]
        },
        taxTreatment: {
            standard: 'IAS 12',
            title: 'Income Taxes',
            considerations: [
                'Current tax on taxable income',
                'Deferred tax on temporary differences',
                'Tax rate changes prospective application'
            ]
        }
    },
    buyer: {
        assetRecognition: {
            standard: 'IAS 38',
            title: 'Intangible Assets',
            considerations: [
                'Recognise at cost (purchase price + directly attributable)',
                'Research costs not capitalised even if reimbursed',
                'Development costs capitalised from criteria date',
                'Subsequent measurement: cost or revaluation model'
            ]
        },
        amortisation: {
            standard: 'IAS 38',
            title: 'Intangible Assets - Amortisation',
            considerations: [
                'Amortise over useful life (finite)',
                'Straight-line method typical for software',
                'Annual review of useful life and method',
                'Residual value assumed zero unless active market'
            ]
        },
        taxTreatment: {
            standard: 'Section 11(e) ITA',
            title: 'South African Tax Depreciation',
            considerations: [
                'PC Software: 50% per annum (2 years)',
                'Mainframe Software: 20% per annum (5 years)',
                'Creates temporary difference if useful life differs',
                'Deferred tax asset or liability recognition'
            ]
        }
    }
};

// ========== ANALYSIS FUNCTIONS ==========

/**
 * Calculate transfer pricing risk score
 * @param {Object} calculationResults - Results from model calculation
 * @param {Object} documentationStatus - Status of documentation (user input)
 * @returns {Object} Risk assessment with score and details
 */
export function calculateTransferPricingRisk(calculationResults, documentationStatus = {}) {
    const { transferPricing, metadata } = calculationResults;

    if (!transferPricing) {
        return {
            score: 50,
            level: 'medium',
            color: 'yellow',
            message: 'Unable to assess - no transfer pricing data available',
            factors: []
        };
    }

    // Get benchmark for the pricing method
    const methodKey = transferPricing.method || 'cost-plus';
    const benchmark = TRANSFER_PRICING_BENCHMARKS[methodKey] || TRANSFER_PRICING_BENCHMARKS['cost-plus'];

    // Calculate factor scores
    const factors = [];
    let totalWeightedScore = 0;
    let totalWeight = 0;

    // 1. Margin Compliance (30%)
    const margin = transferPricing.margin || 0;
    let marginScore;
    if (margin >= benchmark.lowRisk.min && margin <= benchmark.lowRisk.max) {
        marginScore = 100;
    } else if (margin >= benchmark.mediumRisk.min && margin <= benchmark.mediumRisk.max) {
        marginScore = 60;
    } else {
        marginScore = 20;
    }
    factors.push({
        name: 'Margin Compliance',
        score: marginScore,
        weight: RISK_FACTORS.marginCompliance.weight,
        detail: `${margin}% vs benchmark ${benchmark.lowRisk.min}-${benchmark.lowRisk.max}%`,
        status: marginScore >= 80 ? 'pass' : marginScore >= 50 ? 'warning' : 'fail'
    });
    totalWeightedScore += marginScore * RISK_FACTORS.marginCompliance.weight;
    totalWeight += RISK_FACTORS.marginCompliance.weight;

    // 2. Documentation Status (25%)
    const docItems = documentationStatus.completedItems || 0;
    const docTotal = documentationStatus.totalItems || 10;
    const docScore = Math.round((docItems / docTotal) * 100);
    factors.push({
        name: 'Documentation Status',
        score: docScore,
        weight: RISK_FACTORS.documentationStatus.weight,
        detail: `${docItems} of ${docTotal} items complete`,
        status: docScore >= 80 ? 'pass' : docScore >= 50 ? 'warning' : 'fail'
    });
    totalWeightedScore += docScore * RISK_FACTORS.documentationStatus.weight;
    totalWeight += RISK_FACTORS.documentationStatus.weight;

    // 3. Substance Requirements (20%)
    const substanceScore = documentationStatus.substanceScore || 70; // Default moderate
    factors.push({
        name: 'Economic Substance',
        score: substanceScore,
        weight: RISK_FACTORS.substanceRequirements.weight,
        detail: transferPricing.withinRange ?
            'Transaction has clear business rationale' :
            'Business rationale may be questioned',
        status: substanceScore >= 80 ? 'pass' : substanceScore >= 50 ? 'warning' : 'fail'
    });
    totalWeightedScore += substanceScore * RISK_FACTORS.substanceRequirements.weight;
    totalWeight += RISK_FACTORS.substanceRequirements.weight;

    // 4. Comparability Analysis (15%)
    const comparabilityScore = documentationStatus.comparabilityScore || 60;
    factors.push({
        name: 'Comparability Analysis',
        score: comparabilityScore,
        weight: RISK_FACTORS.comparabilityAnalysis.weight,
        detail: 'Benchmark study quality assessment',
        status: comparabilityScore >= 80 ? 'pass' : comparabilityScore >= 50 ? 'warning' : 'fail'
    });
    totalWeightedScore += comparabilityScore * RISK_FACTORS.comparabilityAnalysis.weight;
    totalWeight += RISK_FACTORS.comparabilityAnalysis.weight;

    // 5. Consistent Application (10%)
    const consistencyScore = documentationStatus.consistencyScore || 80;
    factors.push({
        name: 'Consistent Application',
        score: consistencyScore,
        weight: RISK_FACTORS.consistentApplication.weight,
        detail: 'Year-on-year policy consistency',
        status: consistencyScore >= 80 ? 'pass' : consistencyScore >= 50 ? 'warning' : 'fail'
    });
    totalWeightedScore += consistencyScore * RISK_FACTORS.consistentApplication.weight;
    totalWeight += RISK_FACTORS.consistentApplication.weight;

    // Calculate composite score
    const compositeScore = Math.round(totalWeightedScore / totalWeight);

    // Determine risk level
    let level, color;
    if (compositeScore >= 80) {
        level = 'low';
        color = 'green';
    } else if (compositeScore >= 60) {
        level = 'medium';
        color = 'yellow';
    } else {
        level = 'high';
        color = 'red';
    }

    return {
        score: compositeScore,
        level,
        color,
        method: benchmark.name,
        methodGuidance: benchmark.guidance,
        benchmark: benchmark.lowRisk,
        actualMargin: margin,
        factors,
        recommendations: generateRiskRecommendations(factors, level)
    };
}

/**
 * Generate recommendations based on risk factors
 */
function generateRiskRecommendations(factors, level) {
    const recommendations = [];

    factors.forEach(factor => {
        if (factor.status === 'fail') {
            recommendations.push({
                priority: 'high',
                factor: factor.name,
                action: getRecommendationAction(factor.name, 'fail')
            });
        } else if (factor.status === 'warning') {
            recommendations.push({
                priority: 'medium',
                factor: factor.name,
                action: getRecommendationAction(factor.name, 'warning')
            });
        }
    });

    // Sort by priority
    recommendations.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return recommendations;
}

/**
 * Get specific recommendation action based on factor and status
 */
function getRecommendationAction(factorName, status) {
    const actions = {
        'Margin Compliance': {
            fail: 'Adjust pricing to within arm\'s length benchmark range or prepare robust defence documentation',
            warning: 'Document business rationale for margin deviation from benchmark median'
        },
        'Documentation Status': {
            fail: 'Urgently complete transfer pricing documentation before year-end',
            warning: 'Complete remaining documentation items within 60 days'
        },
        'Economic Substance': {
            fail: 'Document decision-making, key personnel, and risk-bearing capacity',
            warning: 'Enhance substance documentation with supporting evidence'
        },
        'Comparability Analysis': {
            fail: 'Commission formal benchmark study with comparable transaction analysis',
            warning: 'Update benchmark study with more recent comparable data'
        },
        'Consistent Application': {
            fail: 'Document rationale for methodology changes and assess transition impact',
            warning: 'Review policy documentation for consistency with prior years'
        }
    };

    return actions[factorName]?.[status] || 'Review and address compliance gap';
}

/**
 * Generate accounting treatment summary
 * @param {Object} calculationResults - Results from model calculation
 * @param {Object} entityConfig - Entity configuration
 * @returns {Object} Accounting treatment summary for both perspectives
 */
export function generateAccountingTreatment(calculationResults, entityConfig = {}) {
    const { developer, buyer, metadata } = calculationResults;
    const modelId = metadata?.modelId || 'model-1';
    const model = INTERCOMPANY_MODELS[modelId];

    // Developer accounting summary
    const developerSummary = {
        entity: entityConfig?.developer?.name || 'Developer Entity',
        framework: entityConfig?.developer?.accountingFramework || 'IFRS',
        revenue: {
            amount: developer?.revenue?.total || 0,
            recognition: developer?.revenue?.recognitionBasis || 'IFRS 15 - as services rendered',
            timing: developer?.revenue?.recognitionTiming || 'over-time',
            journalEntry: generateJournalEntry('developer-revenue', developer?.revenue?.total || 0)
        },
        asset: {
            recognised: developer?.asset?.recognised || false,
            carryingValue: developer?.asset?.carryingValue || 0,
            reason: developer?.asset?.reason || 'N/A',
            journalEntry: developer?.asset?.recognised ?
                generateJournalEntry('developer-asset', developer?.asset?.carryingValue || 0) : null
        },
        tax: {
            taxableIncome: developer?.tax?.taxableIncome || 0,
            corporateTax: developer?.tax?.taxPayable || 0,
            deferredTax: {
                asset: developer?.tax?.deferredTaxAsset || 0,
                liability: developer?.tax?.deferredTaxLiability || 0
            }
        },
        keyStandards: ['IFRS 15', 'IAS 38', 'IAS 12'],
        complexIssues: identifyComplexIssues('developer', developer, metadata)
    };

    // Buyer accounting summary
    const buyerSummary = {
        entity: entityConfig?.buyer?.name || 'Buyer Entity',
        framework: entityConfig?.buyer?.accountingFramework || 'IFRS',
        asset: {
            recognised: buyer?.asset?.recognised || false,
            capitalised: buyer?.asset?.capitalised || 0,
            expensed: buyer?.asset?.expensed || 0,
            carryingValue: buyer?.asset?.carryingValue || 0,
            usefulLife: buyer?.asset?.usefulLife || 5,
            amortisationMethod: buyer?.asset?.amortisationMethod || 'straight-line',
            annualAmortisation: buyer?.asset?.annualAmortisation || 0,
            journalEntry: generateJournalEntry('buyer-asset', buyer?.asset?.capitalised || 0, buyer?.asset?.expensed || 0)
        },
        tax: {
            section11eType: buyer?.asset?.section11eType || 'pc-2yr',
            section11eYears: buyer?.asset?.section11eYears || 2,
            taxDeduction: buyer?.tax?.section11eDeduction || 0,
            taxBenefit: buyer?.tax?.taxBenefit || 0,
            deferredTax: {
                asset: buyer?.tax?.deferredTaxAsset || 0,
                liability: buyer?.tax?.deferredTaxLiability || 0
            },
            timingDifference: buyer?.tax?.timingDifference || 0
        },
        keyStandards: ['IAS 38', 'IAS 12', 'Section 11(e) ITA'],
        complexIssues: identifyComplexIssues('buyer', buyer, metadata)
    };

    return {
        developer: developerSummary,
        buyer: buyerSummary,
        consolidated: calculationResults.combined ? {
            eliminationRequired: calculationResults.combined.elimination?.required || false,
            profitEliminated: calculationResults.combined.elimination?.profitEliminated || 0,
            adjustedAsset: calculationResults.combined.assetEfficiency?.groupAsset || 0,
            journalEntry: calculationResults.combined.elimination?.journalEntry || null
        } : null
    };
}

/**
 * Generate journal entry for a transaction
 */
function generateJournalEntry(type, amount, secondaryAmount = 0) {
    const entries = {
        'developer-revenue': {
            description: 'Recognise development services revenue',
            entries: [
                { account: 'Trade Receivables / Bank', debitCredit: 'DR', amount },
                { account: 'Revenue - Development Services', debitCredit: 'CR', amount }
            ]
        },
        'developer-asset': {
            description: 'Capitalise internally developed software',
            entries: [
                { account: 'Intangible Asset - Software', debitCredit: 'DR', amount },
                { account: 'Development Costs Capitalised', debitCredit: 'CR', amount }
            ]
        },
        'buyer-asset': {
            description: 'Recognise acquired software and research expense',
            entries: [
                { account: 'Intangible Asset - Software', debitCredit: 'DR', amount },
                { account: 'Research Expense', debitCredit: 'DR', amount: secondaryAmount },
                { account: 'Trade Payables / Bank', debitCredit: 'CR', amount: amount + secondaryAmount }
            ]
        }
    };

    return entries[type] || null;
}

/**
 * Identify complex accounting issues requiring attention
 */
function identifyComplexIssues(perspective, data, metadata) {
    const issues = [];
    const variantId = metadata?.variantId || '';

    if (perspective === 'developer') {
        // Check for variable consideration
        if (variantId.match(/C|E/)) {
            issues.push({
                issue: 'Variable consideration',
                standard: 'IFRS 15',
                detail: 'Performance bonus or revenue share requires constraint assessment'
            });
        }
        // Check for asset recognition criteria
        if (data?.asset?.recognised) {
            issues.push({
                issue: 'Development cost capitalisation',
                standard: 'IAS 38',
                detail: 'Ensure six IAS 38 criteria are demonstrably met'
            });
        }
    }

    if (perspective === 'buyer') {
        // Check for timing differences
        if (data?.tax?.timingDifference && data.tax.timingDifference !== 0) {
            issues.push({
                issue: 'Deferred tax recognition',
                standard: 'IAS 12',
                detail: `Timing difference of R${Math.abs(data.tax.timingDifference).toLocaleString()} between accounting and tax`
            });
        }
        // Check for research vs development split
        if (data?.asset?.expensed > 0) {
            issues.push({
                issue: 'Research phase costs expensed',
                standard: 'IAS 38',
                detail: `R${data.asset.expensed.toLocaleString()} research costs not capitalised`
            });
        }
    }

    return issues;
}

/**
 * Generate tax impact analysis
 * @param {Object} calculationResults - Results from model calculation
 * @param {Object} taxParams - Tax parameters
 * @returns {Object} Tax impact analysis
 */
export function generateTaxImpact(calculationResults, taxParams = {}) {
    const { developer, buyer, combined, metadata } = calculationResults;
    const corporateTaxRate = taxParams.corporateTaxRate || 0.27;

    // Section 11(e) schedule generation
    const section11eSchedule = generateSection11eSchedule(buyer, taxParams);

    // CGT analysis (if applicable)
    const cgtAnalysis = analyseCGT(calculationResults, taxParams);

    // Timing differences analysis
    const timingAnalysis = analyseTimingDifferences(developer, buyer, corporateTaxRate);

    // Net tax position
    const netTaxPosition = calculateNetTaxPosition(developer, buyer, combined, corporateTaxRate);

    return {
        summary: {
            developerTaxPayable: developer?.tax?.taxPayable || 0,
            buyerTaxBenefit: buyer?.tax?.taxBenefit || 0,
            groupNetTaxCost: netTaxPosition.groupNetTaxCost,
            effectiveGroupRate: netTaxPosition.effectiveGroupRate
        },
        section11e: section11eSchedule,
        cgt: cgtAnalysis,
        timingDifferences: timingAnalysis,
        deferredTax: {
            developer: {
                asset: developer?.tax?.deferredTaxAsset || 0,
                liability: developer?.tax?.deferredTaxLiability || 0
            },
            buyer: {
                asset: buyer?.tax?.deferredTaxAsset || 0,
                liability: buyer?.tax?.deferredTaxLiability || 0
            }
        },
        netPosition: netTaxPosition
    };
}

/**
 * Generate Section 11(e) deduction schedule
 */
function generateSection11eSchedule(buyer, taxParams) {
    if (!buyer?.asset?.capitalised) return null;

    const capitalised = buyer.asset.capitalised;
    const type = buyer.asset.section11eType || 'pc-2yr';
    const years = type === 'mainframe-5yr' ? 5 : 2;
    const annualDeduction = capitalised / years;
    const taxRate = taxParams.corporateTaxRate || 0.27;

    const schedule = [];
    for (let year = 1; year <= years; year++) {
        schedule.push({
            year,
            openingBalance: capitalised - (annualDeduction * (year - 1)),
            deduction: annualDeduction,
            taxBenefit: annualDeduction * taxRate,
            closingBalance: capitalised - (annualDeduction * year)
        });
    }

    return {
        type: type === 'mainframe-5yr' ? 'Mainframe Software (5 years)' : 'PC Software (2 years)',
        capitalisedAmount: capitalised,
        yearsToDeduct: years,
        annualDeduction,
        totalTaxBenefit: capitalised * taxRate,
        schedule
    };
}

/**
 * Analyse CGT implications
 */
function analyseCGT(calculationResults, taxParams) {
    const { developer, metadata } = calculationResults;
    const variantId = metadata?.variantId || '';

    // CGT only relevant for sale transactions (Model 5)
    if (!metadata?.modelId?.includes('model-5')) {
        return {
            applicable: false,
            reason: 'CGT not applicable - not a sale transaction'
        };
    }

    // Check if this is an asset sale with CGT
    const hasCGT = developer?.tax?.cgtPayable && developer.tax.cgtPayable > 0;

    if (!hasCGT) {
        return {
            applicable: false,
            reason: 'Revenue treatment applies (trading stock)'
        };
    }

    const cgtInclusionRate = taxParams.cgtInclusionRate || 0.80;
    const corporateTaxRate = taxParams.corporateTaxRate || 0.27;
    const effectiveCGTRate = cgtInclusionRate * corporateTaxRate;

    return {
        applicable: true,
        capitalGain: developer.tax.capitalGain || 0,
        inclusionRate: cgtInclusionRate * 100,
        includedGain: (developer.tax.capitalGain || 0) * cgtInclusionRate,
        effectiveRate: effectiveCGTRate * 100,
        cgtPayable: developer.tax.cgtPayable || 0,
        comparison: {
            ifRevenue: (developer.tax.capitalGain || 0) * corporateTaxRate,
            ifCGT: developer.tax.cgtPayable || 0,
            saving: ((developer.tax.capitalGain || 0) * corporateTaxRate) - (developer.tax.cgtPayable || 0)
        }
    };
}

/**
 * Analyse timing differences
 */
function analyseTimingDifferences(developer, buyer, taxRate) {
    const differences = [];

    // Buyer timing difference (accounting vs tax depreciation)
    if (buyer?.tax?.timingDifference) {
        const diff = buyer.tax.timingDifference;
        differences.push({
            entity: 'Buyer',
            type: diff > 0 ? 'Deductible temporary difference' : 'Taxable temporary difference',
            amount: Math.abs(diff),
            deferredTaxEffect: Math.abs(diff) * taxRate,
            deferredTaxType: diff > 0 ? 'Deferred Tax Asset' : 'Deferred Tax Liability',
            explanation: diff > 0 ?
                'Tax depreciation exceeds accounting amortisation (accelerated tax benefit)' :
                'Accounting amortisation exceeds tax depreciation'
        });
    }

    // Developer timing differences (if any)
    if (developer?.tax?.deferredTaxAsset || developer?.tax?.deferredTaxLiability) {
        const dtaAmount = developer.tax.deferredTaxAsset || 0;
        const dtlAmount = developer.tax.deferredTaxLiability || 0;
        if (dtaAmount > 0 || dtlAmount > 0) {
            differences.push({
                entity: 'Developer',
                type: dtaAmount > 0 ? 'Deductible temporary difference' : 'Taxable temporary difference',
                amount: Math.max(dtaAmount, dtlAmount) / taxRate,
                deferredTaxEffect: Math.max(dtaAmount, dtlAmount),
                deferredTaxType: dtaAmount > 0 ? 'Deferred Tax Asset' : 'Deferred Tax Liability',
                explanation: 'Revenue/cost recognition timing difference'
            });
        }
    }

    return {
        differences,
        totalDTA: differences.filter(d => d.deferredTaxType === 'Deferred Tax Asset')
            .reduce((sum, d) => sum + d.deferredTaxEffect, 0),
        totalDTL: differences.filter(d => d.deferredTaxType === 'Deferred Tax Liability')
            .reduce((sum, d) => sum + d.deferredTaxEffect, 0)
    };
}

/**
 * Calculate net tax position
 */
function calculateNetTaxPosition(developer, buyer, combined, taxRate) {
    const developerTax = developer?.tax?.taxPayable || 0;
    const buyerBenefit = buyer?.tax?.taxBenefit || 0;
    const groupNetTaxCost = developerTax - buyerBenefit;
    const transactionValue = developer?.revenue?.total || 0;
    const developerProfit = developer?.profit?.gross || 0;

    return {
        developerTaxPayable: developerTax,
        buyerTaxBenefit: buyerBenefit,
        groupNetTaxCost,
        effectiveGroupRate: developerProfit > 0 ?
            (groupNetTaxCost / developerProfit) * 100 : 0,
        cashFlowImpact: {
            developer: transactionValue - developerTax,
            buyer: -transactionValue + buyerBenefit,
            group: developerProfit > 0 ? developerProfit - groupNetTaxCost : 0
        },
        analysis: groupNetTaxCost > developerTax * 0.5 ?
            'Consider structure optimisation - significant tax leakage at group level' :
            'Tax position within acceptable parameters'
    };
}

/**
 * Evaluate compliance checklist
 * @param {string} checklistId - ID of checklist to evaluate
 * @param {Object} responses - User responses (item ID to boolean)
 * @returns {Object} Checklist evaluation results
 */
export function evaluateChecklist(checklistId, responses = {}) {
    const checklist = COMPLIANCE_CHECKLISTS[checklistId];
    if (!checklist) return null;

    const results = {
        checklistId,
        name: checklist.name,
        description: checklist.description,
        items: [],
        summary: {
            total: checklist.items.length,
            completed: 0,
            pending: 0,
            criticalCompleted: 0,
            criticalTotal: 0
        }
    };

    checklist.items.forEach(item => {
        const completed = responses[item.id] === true;
        results.items.push({
            ...item,
            completed,
            status: completed ? 'complete' : 'pending'
        });

        if (completed) {
            results.summary.completed++;
            if (item.critical) results.summary.criticalCompleted++;
        } else {
            results.summary.pending++;
        }

        if (item.critical) results.summary.criticalTotal++;
    });

    results.summary.completionRate = Math.round(
        (results.summary.completed / results.summary.total) * 100
    );
    results.summary.criticalCompletionRate = results.summary.criticalTotal > 0 ?
        Math.round((results.summary.criticalCompleted / results.summary.criticalTotal) * 100) : 100;

    results.summary.overallStatus =
        results.summary.criticalCompletionRate === 100 && results.summary.completionRate >= 80 ? 'compliant' :
        results.summary.criticalCompletionRate >= 80 ? 'partial' : 'non-compliant';

    return results;
}

/**
 * Evaluate all checklists and get overall compliance score
 * @param {Object} allResponses - Object with checklistId keys and response objects
 * @returns {Object} Overall compliance evaluation
 */
export function evaluateOverallCompliance(allResponses = {}) {
    const evaluations = {};
    let totalItems = 0;
    let completedItems = 0;
    let criticalItems = 0;
    let criticalCompleted = 0;

    Object.keys(COMPLIANCE_CHECKLISTS).forEach(checklistId => {
        const evaluation = evaluateChecklist(checklistId, allResponses[checklistId] || {});
        evaluations[checklistId] = evaluation;

        totalItems += evaluation.summary.total;
        completedItems += evaluation.summary.completed;
        criticalItems += evaluation.summary.criticalTotal;
        criticalCompleted += evaluation.summary.criticalCompleted;
    });

    const overallScore = Math.round((completedItems / totalItems) * 100);
    const criticalScore = criticalItems > 0 ?
        Math.round((criticalCompleted / criticalItems) * 100) : 100;

    let overallStatus, statusColor;
    if (criticalScore === 100 && overallScore >= 80) {
        overallStatus = 'Compliant';
        statusColor = 'green';
    } else if (criticalScore >= 80 && overallScore >= 60) {
        overallStatus = 'Partially Compliant';
        statusColor = 'yellow';
    } else {
        overallStatus = 'Non-Compliant';
        statusColor = 'red';
    }

    return {
        evaluations,
        summary: {
            totalItems,
            completedItems,
            criticalItems,
            criticalCompleted,
            overallScore,
            criticalScore,
            overallStatus,
            statusColor
        }
    };
}

/**
 * Generate comprehensive compliance report
 * @param {Object} calculationResults - Results from model calculation
 * @param {Object} entityConfig - Entity configuration
 * @param {Object} taxParams - Tax parameters
 * @param {Object} checklistResponses - Checklist responses
 * @param {Object} documentationStatus - Documentation status for TP risk
 * @returns {Object} Complete compliance report
 */
export function generateComplianceReport(
    calculationResults,
    entityConfig = {},
    taxParams = {},
    checklistResponses = {},
    documentationStatus = {}
) {
    // Generate all analysis components
    const tpRisk = calculateTransferPricingRisk(calculationResults, documentationStatus);
    const accountingTreatment = generateAccountingTreatment(calculationResults, entityConfig);
    const taxImpact = generateTaxImpact(calculationResults, taxParams);
    const checklistEvaluation = evaluateOverallCompliance(checklistResponses);

    // Calculate overall compliance score
    const overallScore = Math.round(
        (tpRisk.score * 0.4) +
        (checklistEvaluation.summary.overallScore * 0.4) +
        (checklistEvaluation.summary.criticalScore * 0.2)
    );

    let overallStatus, statusColor;
    if (overallScore >= 80) {
        overallStatus = 'Low Risk';
        statusColor = 'green';
    } else if (overallScore >= 60) {
        overallStatus = 'Medium Risk';
        statusColor = 'yellow';
    } else {
        overallStatus = 'High Risk';
        statusColor = 'red';
    }

    return {
        metadata: {
            modelId: calculationResults.metadata?.modelId,
            variantId: calculationResults.metadata?.variantId,
            generatedAt: new Date().toISOString()
        },
        overallCompliance: {
            score: overallScore,
            status: overallStatus,
            statusColor
        },
        transferPricingRisk: tpRisk,
        accountingTreatment,
        taxImpact,
        checklistEvaluation,
        recommendations: [
            ...tpRisk.recommendations,
            ...generateChecklistRecommendations(checklistEvaluation)
        ].sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
    };
}

/**
 * Generate recommendations from checklist evaluation
 */
function generateChecklistRecommendations(evaluation) {
    const recommendations = [];

    Object.values(evaluation.evaluations).forEach(checklist => {
        const pendingCritical = checklist.items.filter(
            item => item.critical && !item.completed
        );

        pendingCritical.forEach(item => {
            recommendations.push({
                priority: 'high',
                factor: checklist.name,
                action: `Complete: ${item.text}`
            });
        });

        // Add medium priority for non-critical items if completion is low
        if (checklist.summary.completionRate < 50) {
            recommendations.push({
                priority: 'medium',
                factor: checklist.name,
                action: `${checklist.summary.pending} items pending - review and complete checklist`
            });
        }
    });

    return recommendations;
}

// ========== EXPORTS ==========

export default {
    TRANSFER_PRICING_BENCHMARKS,
    COMPLIANCE_CHECKLISTS,
    ACCOUNTING_STANDARDS,
    calculateTransferPricingRisk,
    generateAccountingTreatment,
    generateTaxImpact,
    evaluateChecklist,
    evaluateOverallCompliance,
    generateComplianceReport
};
