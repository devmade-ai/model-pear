// ========== STRUCTURE SELECTOR - DECISION TREE ==========
// Intelligent decision tree to help users select the optimal
// software transaction structure (model and variant).
//
// The selector asks a series of questions and scores each model
// based on user responses to recommend the best fit.

import { INTERCOMPANY_MODELS, getModelMetadata, getModelVariants } from './registry.js';

// ========== DECISION FACTORS ==========

export const DECISION_FACTORS = {
    ipOwnership: {
        id: 'ipOwnership',
        question: 'Who should own the intellectual property (IP)?',
        description: 'Determines where the software asset sits on the balance sheet',
        options: [
            {
                value: 'buyer',
                label: 'Client should own IP',
                description: 'Client controls development and owns the resulting asset',
                modelScores: { 'model-1': 10, 'model-3': 5, 'model-4': 3, 'model-5': 8, 'model-2': 0, 'model-6': 0 }
            },
            {
                value: 'developer',
                label: 'Your company should retain IP',
                description: 'You keep IP and grant usage rights to client',
                modelScores: { 'model-1': 0, 'model-2': 10, 'model-6': 10, 'model-4': 5, 'model-3': 3, 'model-5': 0 }
            },
            {
                value: 'shared',
                label: 'Shared/Joint ownership',
                description: 'Both parties have ownership rights based on contribution',
                modelScores: { 'model-3': 10, 'model-4': 3, 'model-1': 0, 'model-2': 2, 'model-5': 0, 'model-6': 2 }
            },
            {
                value: 'transfer-later',
                label: 'Your company initially, transfer to client later',
                description: 'You build and operate, ownership transfers at agreed point',
                modelScores: { 'model-4': 10, 'model-5': 8, 'model-2': 3, 'model-1': 0, 'model-3': 2, 'model-6': 5 }
            }
        ]
    },

    cashFlowPreference: {
        id: 'cashFlowPreference',
        question: 'What is the preferred cash flow structure?',
        description: 'How should payments flow between parties over time',
        options: [
            {
                value: 'upfront',
                label: 'Upfront payment (one-time)',
                description: 'Single payment at project completion or asset transfer',
                modelScores: { 'model-5': 10, 'model-1': 8, 'model-2': 5, 'model-3': 3, 'model-4': 2, 'model-6': 0 }
            },
            {
                value: 'milestone',
                label: 'Milestone-based payments',
                description: 'Payments tied to project deliverables and stages',
                modelScores: { 'model-1': 10, 'model-4': 7, 'model-3': 5, 'model-5': 5, 'model-2': 3, 'model-6': 0 }
            },
            {
                value: 'recurring',
                label: 'Recurring payments (subscription/royalty)',
                description: 'Ongoing periodic payments over time',
                modelScores: { 'model-6': 10, 'model-2': 9, 'model-4': 5, 'model-5': 4, 'model-1': 0, 'model-3': 2 }
            },
            {
                value: 'usage-based',
                label: 'Usage/revenue-based payments',
                description: 'Payments linked to actual usage or revenue generated',
                modelScores: { 'model-2': 10, 'model-6': 8, 'model-3': 5, 'model-4': 3, 'model-1': 0, 'model-5': 2 }
            },
            {
                value: 'hybrid',
                label: 'Hybrid (upfront + ongoing)',
                description: 'Initial payment plus recurring or usage-based fees',
                modelScores: { 'model-5': 10, 'model-2': 8, 'model-4': 7, 'model-6': 5, 'model-1': 3, 'model-3': 3 }
            }
        ]
    },

    riskAllocation: {
        id: 'riskAllocation',
        question: 'How should development and commercial risk be allocated?',
        description: 'Who bears the risk if development fails or the software underperforms',
        options: [
            {
                value: 'buyer-bears-all',
                label: 'Client bears all risk',
                description: 'You are paid regardless of outcome; client takes development and commercial risk',
                modelScores: { 'model-1': 10, 'model-6': 7, 'model-5': 3, 'model-2': 2, 'model-3': 0, 'model-4': 2 }
            },
            {
                value: 'developer-bears-dev',
                label: 'Your company bears development risk',
                description: 'You take risk on building; client takes commercial risk',
                modelScores: { 'model-2': 10, 'model-5': 8, 'model-4': 7, 'model-6': 5, 'model-3': 3, 'model-1': 0 }
            },
            {
                value: 'shared-risk',
                label: 'Shared risk (both parties)',
                description: 'Both parties share development and commercial risks',
                modelScores: { 'model-3': 10, 'model-4': 5, 'model-2': 4, 'model-6': 3, 'model-1': 2, 'model-5': 2 }
            },
            {
                value: 'performance-linked',
                label: 'Performance-linked (your skin in game)',
                description: 'Your compensation tied to software performance',
                modelScores: { 'model-2': 10, 'model-3': 8, 'model-4': 5, 'model-6': 5, 'model-1': 3, 'model-5': 2 }
            }
        ]
    },

    assetRecognition: {
        id: 'assetRecognition',
        question: 'What is the priority for asset recognition?',
        description: 'Where the intangible asset should appear for accounting purposes',
        options: [
            {
                value: 'buyer-balance-sheet',
                label: 'Asset on client balance sheet',
                description: 'Client wants to capitalise and show the asset',
                modelScores: { 'model-1': 10, 'model-5': 10, 'model-3': 7, 'model-4': 5, 'model-2': 3, 'model-6': 0 }
            },
            {
                value: 'developer-balance-sheet',
                label: 'Asset on your balance sheet',
                description: 'You want to retain and show the asset',
                modelScores: { 'model-2': 10, 'model-6': 10, 'model-4': 7, 'model-3': 5, 'model-1': 0, 'model-5': 0 }
            },
            {
                value: 'both-balance-sheets',
                label: 'Asset on both balance sheets',
                description: 'Both parties want to capitalise and show an asset (including licence arrangements)',
                modelScores: { 'model-3': 10, 'model-4': 8, 'model-2': 7, 'model-1': 3, 'model-5': 2, 'model-6': 0 }
            },
            {
                value: 'minimize-assets',
                label: 'Minimise balance sheet assets',
                description: 'Prefer operational expense treatment over capitalisation',
                modelScores: { 'model-6': 10, 'model-2': 7, 'model-4': 5, 'model-1': 2, 'model-3': 2, 'model-5': 0 }
            },
            {
                value: 'tax-efficient',
                label: 'Optimise for tax efficiency',
                description: 'Prioritise accelerated tax deductions (Section 11(e))',
                modelScores: { 'model-1': 8, 'model-5': 8, 'model-2': 5, 'model-4': 5, 'model-3': 5, 'model-6': 3 }
            }
        ]
    },

    consolidation: {
        id: 'consolidation',
        question: 'Are the entities consolidated for group reporting?',
        description: 'Whether Developer and Buyer are in the same reporting group',
        options: [
            {
                value: 'yes-consolidated',
                label: 'Yes, entities are consolidated',
                description: 'Inter-company profits eliminated; combined view important',
                modelScores: { 'model-1': 8, 'model-3': 10, 'model-6': 5, 'model-2': 5, 'model-4': 5, 'model-5': 5 }
            },
            {
                value: 'no-separate',
                label: 'No, separate unrelated entities',
                description: 'Arm\'s length pricing critical; no elimination',
                modelScores: { 'model-2': 8, 'model-5': 8, 'model-6': 7, 'model-1': 5, 'model-3': 3, 'model-4': 5 }
            },
            {
                value: 'related-not-consolidated',
                label: 'Related parties but not consolidated',
                description: 'Transfer pricing scrutiny applies but no elimination',
                modelScores: { 'model-1': 7, 'model-2': 7, 'model-4': 7, 'model-5': 7, 'model-3': 5, 'model-6': 5 }
            }
        ]
    },

    softwareMaturity: {
        id: 'softwareMaturity',
        question: 'What is the software development stage?',
        description: 'Is this new development or existing software',
        options: [
            {
                value: 'new-development',
                label: 'New software to be developed',
                description: 'Software will be created from scratch',
                modelScores: { 'model-1': 10, 'model-3': 10, 'model-4': 8, 'model-2': 3, 'model-5': 0, 'model-6': 3 }
            },
            {
                value: 'existing-transfer',
                label: 'Existing software to transfer',
                description: 'Completed software changing ownership or being licensed',
                modelScores: { 'model-5': 10, 'model-2': 10, 'model-4': 5, 'model-6': 5, 'model-1': 0, 'model-3': 0 }
            },
            {
                value: 'existing-enhance',
                label: 'Existing software to enhance',
                description: 'Existing software needs further development',
                modelScores: { 'model-3': 8, 'model-1': 7, 'model-4': 7, 'model-2': 5, 'model-6': 5, 'model-5': 3 }
            },
            {
                value: 'saas-service',
                label: 'Delivered as ongoing service',
                description: 'Software provided as a service, not a product',
                modelScores: { 'model-6': 10, 'model-4': 8, 'model-2': 5, 'model-1': 0, 'model-3': 2, 'model-5': 0 }
            }
        ]
    },

    controlPreference: {
        id: 'controlPreference',
        question: 'Who should control the development process?',
        description: 'Who directs how the software is built and makes key decisions',
        options: [
            {
                value: 'buyer-controls',
                label: 'Client controls development',
                description: 'Client specifies requirements and directs development',
                modelScores: { 'model-1': 10, 'model-3': 5, 'model-4': 3, 'model-5': 3, 'model-2': 0, 'model-6': 0 }
            },
            {
                value: 'developer-controls',
                label: 'Your company controls development',
                description: 'You make technical decisions independently',
                modelScores: { 'model-2': 10, 'model-6': 10, 'model-4': 7, 'model-5': 5, 'model-3': 3, 'model-1': 0 }
            },
            {
                value: 'joint-control',
                label: 'Joint control/collaboration',
                description: 'Both parties jointly direct development',
                modelScores: { 'model-3': 10, 'model-4': 5, 'model-1': 3, 'model-2': 3, 'model-5': 2, 'model-6': 2 }
            }
        ]
    }
};

// Define the order of questions in the wizard
// Note: 'consolidation' removed - consolidated accounting is not in scope
export const QUESTION_ORDER = [
    'softwareMaturity',
    'ipOwnership',
    'controlPreference',
    'cashFlowPreference',
    'riskAllocation',
    'assetRecognition'
];

// ========== SCORING ENGINE ==========

/**
 * Calculate model scores based on user answers
 * @param {Object} answers - Map of factorId to selected option value
 * @returns {Object} Scores and recommendations for each model
 */
export function calculateModelScores(answers) {
    const scores = {
        'model-1': 0,
        'model-2': 0,
        'model-3': 0,
        'model-4': 0,
        'model-5': 0,
        'model-6': 0
    };

    const maxPossibleScores = { ...scores };
    const factorContributions = {};

    // Calculate scores from each answered factor
    Object.entries(answers).forEach(([factorId, selectedValue]) => {
        const factor = DECISION_FACTORS[factorId];
        if (!factor) return;

        const selectedOption = factor.options.find(opt => opt.value === selectedValue);
        if (!selectedOption) return;

        factorContributions[factorId] = {};

        Object.entries(selectedOption.modelScores).forEach(([modelId, score]) => {
            scores[modelId] += score;
            factorContributions[factorId][modelId] = score;
        });

        // Track max possible score for normalization
        Object.keys(scores).forEach(modelId => {
            const maxForFactor = Math.max(...factor.options.map(opt => opt.modelScores[modelId] || 0));
            maxPossibleScores[modelId] += maxForFactor;
        });
    });

    // Calculate normalized percentages
    const normalizedScores = {};
    Object.entries(scores).forEach(([modelId, score]) => {
        const maxPossible = maxPossibleScores[modelId] || 1;
        normalizedScores[modelId] = Math.round((score / maxPossible) * 100);
    });

    return {
        rawScores: scores,
        normalizedScores,
        maxPossibleScores,
        factorContributions
    };
}

/**
 * Get ranked model recommendations
 * @param {Object} answers - User's answers
 * @returns {Array} Sorted array of model recommendations
 */
export function getModelRecommendations(answers) {
    const { rawScores, normalizedScores, factorContributions } = calculateModelScores(answers);
    const modelMetadata = getModelMetadata();

    const recommendations = modelMetadata.map(model => {
        const rawScore = rawScores[model.id] || 0;
        const normalizedScore = normalizedScores[model.id] || 0;

        // Gather reasons why this model scored well/poorly
        const strengths = [];
        const weaknesses = [];

        Object.entries(factorContributions).forEach(([factorId, modelScores]) => {
            const score = modelScores[model.id] || 0;
            const factor = DECISION_FACTORS[factorId];
            const selectedOption = factor.options.find(
                opt => opt.value === answers[factorId]
            );

            if (score >= 8) {
                strengths.push({
                    factor: factor.question,
                    reason: selectedOption?.label || '',
                    score
                });
            } else if (score <= 2) {
                weaknesses.push({
                    factor: factor.question,
                    reason: selectedOption?.label || '',
                    score
                });
            }
        });

        return {
            modelId: model.id,
            name: model.name,
            shortName: model.shortName,
            description: model.description,
            variantCount: model.variantCount,
            rawScore,
            normalizedScore,
            strengths,
            weaknesses,
            matchLevel: getMatchLevel(normalizedScore)
        };
    });

    // Sort by normalized score descending
    recommendations.sort((a, b) => b.normalizedScore - a.normalizedScore);

    return recommendations;
}

/**
 * Get match level label based on score
 */
function getMatchLevel(score) {
    if (score >= 80) return { label: 'Excellent Match', color: 'green', icon: '✓✓' };
    if (score >= 60) return { label: 'Good Match', color: 'blue', icon: '✓' };
    if (score >= 40) return { label: 'Moderate Match', color: 'yellow', icon: '~' };
    return { label: 'Poor Match', color: 'red', icon: '✗' };
}

// ========== VARIANT RECOMMENDATION ==========

/**
 * Variant recommendation factors - questions specific to recommending
 * variants within a selected model
 */
export const VARIANT_FACTORS = {
    'model-1': {
        question: 'What pricing approach is preferred for the development services?',
        factors: [
            {
                value: 'zero-margin',
                label: 'Zero margin / pure cost recovery',
                variants: ['1A'],
                scenario: 'Internal group service or cost validation phase'
            },
            {
                value: 'fixed-margin',
                label: 'Fixed percentage markup on all costs',
                variants: ['1B'],
                scenario: 'Standard arm\'s length arrangement'
            },
            {
                value: 'performance-bonus',
                label: 'Base margin plus milestone bonuses',
                variants: ['1C'],
                scenario: 'Incentivise quality and timely delivery'
            },
            {
                value: 'fixed-price',
                label: 'Fixed total price (lump sum)',
                variants: ['1D'],
                scenario: 'Budget certainty for Buyer, risk on Developer'
            },
            {
                value: 'time-materials',
                label: 'Time and materials billing',
                variants: ['1E'],
                scenario: 'Flexible scope, ongoing development'
            },
            {
                value: 'dedicated-team',
                label: 'Dedicated team with monthly fee',
                variants: ['1F'],
                scenario: 'Long-term resource commitment'
            }
        ]
    },
    'model-2': {
        question: 'What type of licence arrangement is needed?',
        factors: [
            {
                value: 'perpetual-upfront',
                label: 'Perpetual licence with upfront payment',
                variants: ['2A'],
                scenario: 'One-time acquisition, Buyer owns indefinitely'
            },
            {
                value: 'term-licence',
                label: 'Term/subscription licence (annual)',
                variants: ['2B'],
                scenario: 'Renewable licence, lower initial cost'
            },
            {
                value: 'usage-royalty',
                label: 'Usage-based or per-transaction royalties',
                variants: ['2C'],
                scenario: 'Payment linked to actual use/value generated'
            },
            {
                value: 'minimum-guarantee',
                label: 'Minimum guarantee plus royalties',
                variants: ['2D'],
                scenario: 'Developer guaranteed minimum, plus upside'
            },
            {
                value: 'revenue-share',
                label: 'Revenue or profit share',
                variants: ['2E'],
                scenario: 'Align interests, share commercial success'
            },
            {
                value: 'white-label',
                label: 'White-label / reseller licence',
                variants: ['2F'],
                scenario: 'Buyer rebrands and resells the software'
            },
            {
                value: 'exclusive',
                label: 'Exclusive vs non-exclusive comparison',
                variants: ['2G'],
                scenario: 'Evaluate exclusivity implications'
            },
            {
                value: 'source-code',
                label: 'Source code licence or escrow',
                variants: ['2H'],
                scenario: 'Buyer needs access to source code'
            }
        ]
    },
    'model-3': {
        question: 'How should the joint development be structured?',
        factors: [
            {
                value: 'equal-split',
                label: 'Equal 50/50 cost sharing',
                variants: ['3A'],
                scenario: 'Simple equal partnership'
            },
            {
                value: 'contribution-based',
                label: 'Based on actual contributions',
                variants: ['3B'],
                scenario: 'Ownership reflects what each party puts in'
            },
            {
                value: 'benefit-based',
                label: 'Based on expected benefits',
                variants: ['3C'],
                scenario: 'Ownership reflects anticipated value extraction'
            },
            {
                value: 'platform-app',
                label: 'Platform + application split',
                variants: ['3D'],
                scenario: 'One party builds platform, other builds apps'
            },
            {
                value: 'dev-commercialise',
                label: 'Development + commercialisation split',
                variants: ['3E'],
                scenario: 'One party develops, other commercialises'
            },
            {
                value: 'joint-venture',
                label: 'Joint venture entity (JV)',
                variants: ['3F'],
                scenario: 'Create separate legal entity to hold IP'
            },
            {
                value: 'consortium',
                label: 'Consortium / multi-party arrangement',
                variants: ['3G'],
                scenario: 'More than two parties involved'
            },
            {
                value: 'pre-competitive',
                label: 'Pre-competitive joint development',
                variants: ['3H'],
                scenario: 'Industry collaboration on shared technology'
            }
        ]
    },
    'model-4': {
        question: 'How should the Build-Operate-Transfer be structured?',
        factors: [
            {
                value: 'fixed-transfer',
                label: 'Fixed transfer price agreed upfront',
                variants: ['4A'],
                scenario: 'Certainty on transfer value from start'
            },
            {
                value: 'formula-transfer',
                label: 'Formula-based transfer price',
                variants: ['4B'],
                scenario: 'Price adjusts based on agreed metrics'
            },
            {
                value: 'fmv-transfer',
                label: 'Fair market value at transfer',
                variants: ['4C'],
                scenario: 'Valuation at time of transfer'
            },
            {
                value: 'purchase-option',
                label: 'BOT with purchase option',
                variants: ['4D'],
                scenario: 'Buyer has option but not obligation to acquire'
            },
            {
                value: 'no-transfer',
                label: 'Build-Operate-Own (no transfer)',
                variants: ['4E'],
                scenario: 'Developer retains ownership permanently'
            },
            {
                value: 'transfer-first',
                label: 'Build-Transfer-Operate (transfer first)',
                variants: ['4F'],
                scenario: 'Transfer immediately, then operate as service'
            },
            {
                value: 'lease',
                label: 'Build-Lease-Transfer (IFRS 16)',
                variants: ['4G'],
                scenario: 'Lease accounting treatment'
            },
            {
                value: 'phased',
                label: 'Phased transfer over time',
                variants: ['4H'],
                scenario: 'Gradual transition of ownership'
            }
        ]
    },
    'model-5': {
        question: 'What type of software sale structure is needed?',
        factors: [
            {
                value: 'clean-sale',
                label: 'Clean sale (no ongoing obligations)',
                variants: ['5A'],
                scenario: 'Simple outright sale, complete exit'
            },
            {
                value: 'sale-maintenance',
                label: 'Sale plus maintenance agreement',
                variants: ['5B'],
                scenario: 'Ongoing support and bug fixes'
            },
            {
                value: 'sale-support-updates',
                label: 'Sale plus support and updates',
                variants: ['5C'],
                scenario: 'Include enhancement and version updates'
            },
            {
                value: 'sale-warranty',
                label: 'Sale with warranty period',
                variants: ['5D'],
                scenario: 'Developer guarantees quality for period'
            },
            {
                value: 'sale-buyback',
                label: 'Sale with buyback commitment',
                variants: ['5E'],
                scenario: 'Developer may repurchase under conditions'
            },
            {
                value: 'sale-retained-improvements',
                label: 'Sale with retained improvement rights',
                variants: ['5F'],
                scenario: 'Developer keeps rights to improvements made'
            },
            {
                value: 'asset-vs-share',
                label: 'Asset sale vs share sale comparison',
                variants: ['5G'],
                scenario: 'Evaluate different legal structures'
            },
            {
                value: 'sale-licence-back',
                label: 'Sale with licence-back to Developer',
                variants: ['5H'],
                scenario: 'Buyer owns, Developer licensed to continue using'
            }
        ]
    },
    'model-6': {
        question: 'What type of SaaS/subscription model is appropriate?',
        factors: [
            {
                value: 'pure-saas',
                label: 'Pure SaaS (multi-tenant)',
                variants: ['6A'],
                scenario: 'Standard cloud service, shared infrastructure'
            },
            {
                value: 'dedicated-instance',
                label: 'Dedicated instance (single-tenant)',
                variants: ['6B'],
                scenario: 'Isolated environment for each customer'
            },
            {
                value: 'customisation',
                label: 'Subscription with customisation',
                variants: ['6C'],
                scenario: 'Standard platform plus customer-specific features'
            },
            {
                value: 'hybrid',
                label: 'Hybrid (cloud + on-premise)',
                variants: ['6D'],
                scenario: 'Part cloud, part local installation'
            },
            {
                value: 'freemium',
                label: 'Freemium / tiered pricing',
                variants: ['6E'],
                scenario: 'Free tier with paid upgrades'
            },
            {
                value: 'consumption',
                label: 'Consumption-based pricing',
                variants: ['6F'],
                scenario: 'Pay per use, API calls, transactions'
            },
            {
                value: 'enterprise',
                label: 'Enterprise agreement (committed spend)',
                variants: ['6G'],
                scenario: 'Large committed contract with volume discounts'
            },
            {
                value: 'private-label',
                label: 'Private label SaaS',
                variants: ['6H'],
                scenario: 'White-labelled SaaS for resale'
            },
            {
                value: 'transition',
                label: 'Managed service with transition rights',
                variants: ['6I'],
                scenario: 'Option to move to perpetual licence later'
            }
        ]
    }
};

/**
 * Get variant recommendation for a specific model based on user preference
 * @param {string} modelId - The selected model ID
 * @param {string} preferenceValue - The user's variant preference
 * @returns {Object} Recommended variant info
 */
export function getVariantRecommendation(modelId, preferenceValue) {
    const modelVariantFactors = VARIANT_FACTORS[modelId];
    if (!modelVariantFactors) return null;

    const preference = modelVariantFactors.factors.find(f => f.value === preferenceValue);
    if (!preference) return null;

    const variants = getModelVariants(modelId);
    const recommendedVariants = variants.filter(v => preference.variants.includes(v.id));

    return {
        selectedPreference: preference,
        recommendedVariants,
        scenario: preference.scenario
    };
}

/**
 * Get all variant options for a model (for the wizard)
 */
export function getVariantOptions(modelId) {
    return VARIANT_FACTORS[modelId] || null;
}

// ========== RATIONALE GENERATION ==========

/**
 * Generate human-readable rationale for a model recommendation
 */
export function generateRationale(recommendation, answers) {
    const { modelId, strengths, weaknesses, normalizedScore } = recommendation;
    const model = INTERCOMPANY_MODELS[modelId];
    if (!model) return '';

    let rationale = [];

    // Opening statement based on match level
    if (normalizedScore >= 80) {
        rationale.push(`${model.shortName} is highly recommended based on your requirements.`);
    } else if (normalizedScore >= 60) {
        rationale.push(`${model.shortName} is a good fit for your transaction structure.`);
    } else if (normalizedScore >= 40) {
        rationale.push(`${model.shortName} could work but may not be optimal for your needs.`);
    } else {
        rationale.push(`${model.shortName} is not well-suited to your requirements.`);
    }

    // Add key strengths
    if (strengths.length > 0) {
        rationale.push('\nKey advantages:');
        strengths.slice(0, 3).forEach(s => {
            rationale.push(`• ${s.reason} aligns well with this model`);
        });
    }

    // Add key concerns
    if (weaknesses.length > 0 && normalizedScore < 80) {
        rationale.push('\nConsiderations:');
        weaknesses.slice(0, 2).forEach(w => {
            rationale.push(`• ${w.reason} is not typical for this model`);
        });
    }

    return rationale.join('\n');
}

// ========== EXPORTS ==========

export default {
    DECISION_FACTORS,
    QUESTION_ORDER,
    VARIANT_FACTORS,
    calculateModelScores,
    getModelRecommendations,
    getVariantRecommendation,
    getVariantOptions,
    generateRationale
};
