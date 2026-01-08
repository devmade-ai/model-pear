// ========== INTER-COMPANY MODEL REGISTRY ==========
// Registry system for inter-company software transaction models.
// Each model represents a different transaction structure with multiple variants.
//
// Architecture:
// - Models define the overall transaction type (e.g., Cost-Plus, Licence, BOT)
// - Variants define specific implementations within each model
// - All models produce three-perspective outputs (Developer, Buyer, Combined)

import { MODEL_1_COST_PLUS } from './model-1-cost-plus.js';
import { MODEL_2_LICENCE_ROYALTIES } from './model-2-licence-royalties.js';
import { MODEL_3_JOINT_DEVELOPMENT } from './model-3-joint-development.js';
import { MODEL_4_BOT } from './model-4-bot.js';
import { MODEL_6_SAAS_SUBSCRIPTION } from './model-6-saas-subscription.js';

// ========== MODEL REGISTRY ==========

export const INTERCOMPANY_MODELS = {
    'model-1': MODEL_1_COST_PLUS,
    'model-2': MODEL_2_LICENCE_ROYALTIES,
    'model-3': MODEL_3_JOINT_DEVELOPMENT,
    'model-4': MODEL_4_BOT,
    'model-6': MODEL_6_SAAS_SUBSCRIPTION,
    // Future models will be added here:
    // 'model-5': MODEL_5_SOFTWARE_SALE,
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

/**
 * Get model metadata for UI display
 */
export function getModelMetadata() {
    return Object.entries(INTERCOMPANY_MODELS).map(([id, model]) => ({
        id,
        name: model.name,
        shortName: model.shortName,
        description: model.description,
        variantCount: Object.keys(model.variants).length,
        defaultVariant: model.defaultVariant
    }));
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
 * Calculate results for a model variant
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

    // Call the model's calculate function with all context
    return model.calculate(inputs, variantId, entityConfig, taxParams);
}

// ========== DEFAULT CONFIGURATIONS ==========

export const DEFAULT_ENTITY_CONFIG = {
    developer: {
        name: 'Developer Entity',
        jurisdiction: 'South Africa',
        taxResident: true,
        corporateTaxRate: 0.27,
        accountingFramework: 'IFRS'
    },
    buyer: {
        name: 'Buyer Entity',
        jurisdiction: 'South Africa',
        taxResident: true,
        corporateTaxRate: 0.27,
        accountingFramework: 'IFRS',
        section11eType: 'pc-2yr'
    },
    relationship: {
        relatedParties: true,
        sameGroup: true,
        consolidationRequired: true
    }
};

export const DEFAULT_TAX_PARAMS = {
    corporateTaxRate: 0.27,
    section11eMainframe: 5,  // years
    section11ePC: 2,         // years
    cgtInclusionRate: 0.80,  // 80% inclusion
    cgtEffectiveRate: 0.216  // 27% * 80%
};
