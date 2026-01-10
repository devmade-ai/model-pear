// ========== TRANSACTION MODEL REGISTRY ==========
// Registry system for software transaction structuring models.
// Each model represents a different transaction structure with multiple variants.
//
// Purpose: Help software companies analyze different transaction models to
// maximize value for both parties (your company and client) on any project/product.
//
// Architecture:
// - Models define the overall transaction type (e.g., Cost-Plus, Licence, BOT)
// - Variants define specific implementations within each model
// - All models produce two-perspective outputs (Your Company, Client)

import { MODEL_1_COST_PLUS } from './model-1-cost-plus.js';
import { MODEL_2_LICENCE_ROYALTIES } from './model-2-licence-royalties.js';
import { MODEL_3_JOINT_DEVELOPMENT } from './model-3-joint-development.js';
import { MODEL_4_BOT } from './model-4-bot.js';
import { MODEL_5_SOFTWARE_SALE } from './model-5-software-sale.js';
import { MODEL_6_SAAS_SUBSCRIPTION } from './model-6-saas-subscription.js';

// ========== MODEL REGISTRY ==========

export const INTERCOMPANY_MODELS = {
    'model-1': MODEL_1_COST_PLUS,
    'model-2': MODEL_2_LICENCE_ROYALTIES,
    'model-3': MODEL_3_JOINT_DEVELOPMENT,
    'model-4': MODEL_4_BOT,
    'model-5': MODEL_5_SOFTWARE_SALE,
    'model-6': MODEL_6_SAAS_SUBSCRIPTION,
};

// ========== REGISTRY HELPER FUNCTIONS ==========

/**
 * Get a model by ID
 */
export function getIntercompanyModel(modelId) {
    return INTERCOMPANY_MODELS[modelId] || null;
}

/**
 * Get all model IDs
 */
export function getIntercompanyModelIds() {
    return Object.keys(INTERCOMPANY_MODELS);
}

// ========== MODEL OVERVIEW METADATA ==========
// Enhanced metadata for Options Overview display
// Helps users understand and compare models at a glance

const MODEL_OVERVIEW_DATA = {
    'model-1': {
        icon: '💼',
        summary: 'Cost-plus approach where developer provides services and buyer capitalises the costs.',
        keyFeatures: [
            'Developer retains no IP (created for buyer)',
            'Buyer capitalises development costs as intangible asset',
            'Lower risk for developer (guaranteed margin)'
        ],
        bestFor: [
            'Custom development projects',
            'When buyer wants to own the IP',
            'Risk-averse developers'
        ],
        paymentType: 'Service fee (cost + margin)',
        ipOwnership: 'Buyer',
        riskProfile: { developer: 'Low', buyer: 'Medium' }
    },
    'model-2': {
        icon: '📜',
        summary: 'Developer owns IP and grants licence to buyer with upfront fees and/or royalties.',
        keyFeatures: [
            'Developer retains IP ownership',
            'Ongoing royalty revenue stream',
            'Buyer capitalises licence costs'
        ],
        bestFor: [
            'Reusable software products',
            'When developer wants ongoing revenue',
            'Multiple potential licensees'
        ],
        paymentType: 'Licence fee + Royalties',
        ipOwnership: 'Developer',
        riskProfile: { developer: 'Medium', buyer: 'Low' }
    },
    'model-3': {
        icon: '🤝',
        summary: 'Both parties contribute resources and share ownership proportionally.',
        keyFeatures: [
            'Shared IP ownership',
            'Both parties capitalise their contributions',
            'No intercompany profit element'
        ],
        bestFor: [
            'Strategic partnerships',
            'Related party transactions',
            'When both parties want skin in the game'
        ],
        paymentType: 'Cost sharing (no markup)',
        ipOwnership: 'Shared',
        riskProfile: { developer: 'Shared', buyer: 'Shared' }
    },
    'model-4': {
        icon: '🔄',
        summary: 'Developer builds and operates software, then transfers ownership to buyer.',
        keyFeatures: [
            'Phased IP transfer',
            'Operational period before handover',
            'Developer bears initial risk'
        ],
        bestFor: [
            'Complex implementations',
            'When buyer lacks operational capability',
            'Proof-of-concept projects'
        ],
        paymentType: 'Service fees + Transfer payment',
        ipOwnership: 'Developer → Buyer',
        riskProfile: { developer: 'High initially', buyer: 'Low initially' }
    },
    'model-5': {
        icon: '💰',
        summary: 'Outright sale of software with optional ongoing support agreement.',
        keyFeatures: [
            'Full IP transfer on sale',
            'One-time purchase price',
            'Optional support revenue stream'
        ],
        bestFor: [
            'Complete solutions ready for handover',
            'When buyer wants full ownership immediately',
            'Developer exit scenarios'
        ],
        paymentType: 'Once-off purchase + Support fees',
        ipOwnership: 'Buyer (on sale)',
        riskProfile: { developer: 'Low after sale', buyer: 'High' }
    },
    'model-6': {
        icon: '📊',
        summary: 'Subscription/SaaS model with recurring fees. Developer retains IP, buyer expenses fees.',
        keyFeatures: [
            'Developer retains all IP',
            'Recurring subscription revenue',
            'Buyer has no asset to capitalise'
        ],
        bestFor: [
            'Cloud-hosted solutions',
            'When buyer prefers OpEx over CapEx',
            'Ongoing product development'
        ],
        paymentType: 'Monthly/Annual subscription',
        ipOwnership: 'Developer',
        riskProfile: { developer: 'Medium', buyer: 'Low' }
    }
};

/**
 * Get model metadata for UI display
 * Enhanced with overview data for Options Overview component
 */
export function getModelMetadata() {
    return Object.entries(INTERCOMPANY_MODELS).map(([id, model]) => {
        const overview = MODEL_OVERVIEW_DATA[id] || {};
        return {
            id,
            name: model.name,
            shortName: model.shortName,
            description: model.description,
            variantCount: Object.keys(model.variants).length,
            defaultVariant: model.defaultVariant,
            // Overview fields for Options Overview component
            icon: overview.icon || '📦',
            summary: overview.summary || model.description,
            keyFeatures: overview.keyFeatures || [],
            bestFor: overview.bestFor || [],
            paymentType: overview.paymentType || 'Various',
            ipOwnership: overview.ipOwnership || 'Varies',
            riskProfile: overview.riskProfile || { developer: 'Varies', buyer: 'Varies' }
        };
    });
}

/**
 * Get quick comparison data for all models
 * Returns a compact table-friendly format for side-by-side comparison
 */
export function getModelComparisonData() {
    return Object.entries(INTERCOMPANY_MODELS).map(([id, model]) => {
        const overview = MODEL_OVERVIEW_DATA[id] || {};
        return {
            id,
            shortName: model.shortName,
            ipOwnership: overview.ipOwnership || 'Varies',
            paymentType: overview.paymentType || 'Various',
            buyerAsset: getBuyerAssetIndicator(id),
            riskDirection: getRiskDirection(id)
        };
    });
}

/**
 * Get buyer asset recognition indicator for a model
 */
function getBuyerAssetIndicator(modelId) {
    const indicators = {
        'model-1': 'Yes',           // Buyer capitalises development costs
        'model-2': 'Maybe',         // Depends on licence terms
        'model-3': 'Yes (partial)', // Buyer capitalises their share
        'model-4': 'Yes (deferred)',// Buyer gets asset at transfer
        'model-5': 'Yes',           // Buyer capitalises purchase price
        'model-6': 'No'             // SaaS = no asset for buyer
    };
    return indicators[modelId] || 'Varies';
}

/**
 * Get risk direction indicator
 * Arrow shows who bears more risk
 */
function getRiskDirection(modelId) {
    const directions = {
        'model-1': '→ Buyer',    // Risk transfers to buyer
        'model-2': 'Developer',   // Developer bears product risk
        'model-3': 'Shared',      // Both parties share
        'model-4': 'Dev → Buyer', // Risk transfers over time
        'model-5': '→ Buyer',     // Risk transfers on sale
        'model-6': 'Developer'    // Developer bears ongoing risk
    };
    return directions[modelId] || 'Varies';
}

/**
 * Get variants for a specific model
 */
export function getModelVariants(modelId) {
    const model = INTERCOMPANY_MODELS[modelId];
    if (!model) return [];

    return Object.entries(model.variants).map(([id, variant]) => ({
        id,
        name: variant.name,
        description: variant.description,
        scenario: variant.scenario
    }));
}

/**
 * Get inputs for a model variant
 * Combines base model inputs with variant-specific inputs
 */
export function getVariantInputs(modelId, variantId) {
    const model = INTERCOMPANY_MODELS[modelId];
    if (!model) return [];

    const variant = model.variants[variantId] || model.variants[model.defaultVariant];

    // Start with base inputs
    let inputs = [...model.baseInputs];

    // Add variant-specific inputs if any
    if (variant.additionalInputs) {
        inputs = inputs.concat(variant.additionalInputs);
    }

    // Remove inputs that the variant excludes
    if (variant.excludeInputs) {
        inputs = inputs.filter(input => !variant.excludeInputs.includes(input.name));
    }

    return inputs;
}

/**
 * Get default values for a model variant's inputs
 * Returns an object with input names as keys and default values
 */
export function getVariantDefaults(modelId, variantId) {
    const inputDefs = getVariantInputs(modelId, variantId);
    const defaults = {};

    for (const input of inputDefs) {
        if (input.default !== undefined) {
            defaults[input.name] = input.default;
        }
    }

    return defaults;
}

/**
 * Calculate results for a model variant
 * Merges provided inputs with defaults to ensure sensible values
 */
export function calculateIntercompany(modelId, variantId, inputs, entityConfig, taxParams) {
    const model = INTERCOMPANY_MODELS[modelId];
    if (!model) {
        throw new Error(`Unknown model: ${modelId}`);
    }

    const variant = model.variants[variantId] || model.variants[model.defaultVariant];
    if (!variant) {
        throw new Error(`Unknown variant: ${variantId} for model ${modelId}`);
    }

    // Merge defaults with provided inputs (provided inputs take precedence)
    // This ensures calculations have sensible values even if inputs are missing
    const defaults = getVariantDefaults(modelId, variantId);
    const mergedInputs = { ...defaults, ...inputs };

    // Call the model's calculate function with merged inputs
    return model.calculate(mergedInputs, variantId, entityConfig, taxParams);
}

// ========== DEFAULT CONFIGURATIONS ==========

export const DEFAULT_ENTITY_CONFIG = {
    developer: {
        name: 'Your Company',
        jurisdiction: 'South Africa',
        taxResident: true,
        corporateTaxRate: 0.27,
        accountingFramework: 'IFRS'
    },
    buyer: {
        name: 'Client',
        jurisdiction: 'South Africa',
        taxResident: true,
        corporateTaxRate: 0.27,
        accountingFramework: 'IFRS',
        section11eType: 'pc-2yr'
    },
    relationship: {
        // Default: independent parties (not related)
        // Set to true only when entities share common ownership
        relatedParties: false,
        // When true, enables transfer pricing compliance features
        mutualOwnership: false
    }
};

export const DEFAULT_TAX_PARAMS = {
    corporateTaxRate: 0.27,
    section11eMainframe: 5,  // years
    section11ePC: 2,         // years
    cgtInclusionRate: 0.80,  // 80% inclusion
    cgtEffectiveRate: 0.216  // 27% * 80%
};
