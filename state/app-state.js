// ========== APPLICATION STATE MANAGEMENT ==========
// Simple pub/sub state management for the Inter-Company Transaction Tool.
// Maintains compatibility with existing pricing calculator while adding
// new state for inter-company features.

import { DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from '../models/intercompany/registry.js';

// ========== INITIAL STATE ==========

const initialState = {
    // Mode Selection: Which calculator is active
    mode: 'pricing',  // 'pricing' | 'intercompany'

    // Pricing Calculator State (existing)
    pricing: {
        selectedModel: null,
        calculationMode: 'none',
        pricingStrategy: 'balanced',
        results: null
    },

    // Inter-Company Calculator State (new)
    intercompany: {
        selectedModel: null,      // e.g., 'model-1'
        selectedVariant: null,    // e.g., '1B'
        currentPerspective: 'combined',  // 'developer' | 'buyer' | 'combined'
        results: null,
        complianceScore: null
    },

    // Entity Configuration
    entities: { ...DEFAULT_ENTITY_CONFIG },

    // Tax Parameters
    taxParams: { ...DEFAULT_TAX_PARAMS },

    // UI State
    ui: {
        isCalculating: false,
        showEntityConfig: false,
        showTaxConfig: false,
        activeTab: 'calculator'  // 'calculator' | 'comparison' | 'compliance'
    }
};

// ========== STATE STORE ==========

let state = JSON.parse(JSON.stringify(initialState));
const listeners = new Set();

/**
 * Get current state (read-only copy)
 */
export function getState() {
    return JSON.parse(JSON.stringify(state));
}

/**
 * Get a specific state slice
 */
export function getStateSlice(path) {
    const parts = path.split('.');
    let value = state;
    for (const part of parts) {
        if (value === undefined) return undefined;
        value = value[part];
    }
    return value;
}

/**
 * Update state with partial updates
 * Supports dot notation for nested updates
 */
export function updateState(updates) {
    const oldState = state;
    state = deepMerge(state, updates);

    // Notify listeners if state actually changed
    if (JSON.stringify(oldState) !== JSON.stringify(state)) {
        notifyListeners(state, oldState);
    }
}

/**
 * Set a specific state value using dot notation
 */
export function setState(path, value) {
    const parts = path.split('.');
    const updates = {};
    let current = updates;

    for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = {};
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;

    updateState(updates);
}

/**
 * Reset state to initial values
 */
export function resetState() {
    state = JSON.parse(JSON.stringify(initialState));
    notifyListeners(state, null);
}

// ========== SUBSCRIPTIONS ==========

/**
 * Subscribe to state changes
 * Returns unsubscribe function
 */
export function subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

/**
 * Subscribe to changes in a specific state path
 */
export function subscribeToPath(path, callback) {
    const wrappedCallback = (newState, oldState) => {
        const newValue = getValueByPath(newState, path);
        const oldValue = oldState ? getValueByPath(oldState, path) : undefined;

        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
            callback(newValue, oldValue);
        }
    };

    listeners.add(wrappedCallback);
    return () => listeners.delete(wrappedCallback);
}

function notifyListeners(newState, oldState) {
    listeners.forEach(callback => {
        try {
            callback(newState, oldState);
        } catch (error) {
            console.error('State listener error:', error);
        }
    });
}

// ========== ACTION CREATORS ==========
// Convenient functions for common state updates

/**
 * Switch between pricing and intercompany mode
 */
export function setMode(mode) {
    updateState({ mode });
}

/**
 * Select an inter-company model
 */
export function selectIntercompanyModel(modelId, variantId = null) {
    updateState({
        intercompany: {
            ...state.intercompany,
            selectedModel: modelId,
            selectedVariant: variantId,
            results: null,
            complianceScore: null
        }
    });
}

/**
 * Select a variant within the current model
 */
export function selectVariant(variantId) {
    updateState({
        intercompany: {
            ...state.intercompany,
            selectedVariant: variantId,
            results: null
        }
    });
}

/**
 * Change the current perspective view
 */
export function setPerspective(perspective) {
    updateState({
        intercompany: {
            ...state.intercompany,
            currentPerspective: perspective
        }
    });
}

/**
 * Store calculation results
 */
export function setIntercompanyResults(results, complianceScore = null) {
    updateState({
        intercompany: {
            ...state.intercompany,
            results,
            complianceScore
        }
    });
}

/**
 * Update entity configuration
 */
export function updateEntityConfig(entityType, config) {
    updateState({
        entities: {
            ...state.entities,
            [entityType]: {
                ...state.entities[entityType],
                ...config
            }
        }
    });
}

/**
 * Update tax parameters
 */
export function updateTaxParams(params) {
    updateState({
        taxParams: {
            ...state.taxParams,
            ...params
        }
    });
}

/**
 * Set party relationship type
 * @param {boolean} isRelated - true for related parties (mutual ownership), false for independent
 */
export function setRelationshipType(isRelated) {
    updateState({
        entities: {
            ...state.entities,
            relationship: {
                ...state.entities.relationship,
                relatedParties: isRelated
            }
        }
    });
}

/**
 * Check if parties are related (mutual ownership)
 */
export function arePartiesRelated() {
    return state.entities?.relationship?.relatedParties === true;
}

/**
 * Set UI loading state
 */
export function setCalculating(isCalculating) {
    updateState({
        ui: {
            ...state.ui,
            isCalculating
        }
    });
}

// ========== UTILITY FUNCTIONS ==========

function deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
        if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }

    return result;
}

function getValueByPath(obj, path) {
    const parts = path.split('.');
    let value = obj;
    for (const part of parts) {
        if (value === undefined || value === null) return undefined;
        value = value[part];
    }
    return value;
}

// ========== DEBUG HELPERS ==========

if (typeof window !== 'undefined') {
    // Expose state for debugging in browser console
    window.__appState = {
        getState,
        updateState,
        resetState,
        subscribe
    };
}

export default {
    getState,
    getStateSlice,
    updateState,
    setState,
    resetState,
    subscribe,
    subscribeToPath,
    // Actions
    setMode,
    selectIntercompanyModel,
    selectVariant,
    setPerspective,
    setIntercompanyResults,
    updateEntityConfig,
    updateTaxParams,
    setRelationshipType,
    arePartiesRelated,
    setCalculating
};
