// ========== APPLICATION STATE MANAGEMENT ==========
// Simple pub/sub state management for the Inter-Company Transaction Tool.
// Maintains compatibility with existing pricing calculator while adding
// new state for inter-company features.

import { DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from '../models/intercompany/registry.js';
import { saveToStorage, loadFromStorage, clearStorage } from '../utils/storage.js';

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
        currentPerspective: 'developer',  // 'developer' | 'buyer'
        results: null,
        complianceScore: null
    },

    // Entity Configuration
    entities: { ...DEFAULT_ENTITY_CONFIG },

    // Tax Parameters
    taxParams: { ...DEFAULT_TAX_PARAMS },

    // Saved Comparisons
    // Array of saved calculation snapshots for side-by-side comparison
    savedComparisons: [],  // Loaded from localStorage on init

    // UI State
    ui: {
        isCalculating: false,
        showEntityConfig: false,
        showTaxConfig: false,
        activeTab: 'calculator',  // 'calculator' | 'comparison' | 'compliance'
        // Comparison-related UI state
        comparisonViewOpen: false,
        activeComparisonIds: [],  // IDs of comparisons selected for side-by-side view
        saveModalOpen: false
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

// ========== COMPARISON ACTION CREATORS ==========

/**
 * Initialize comparisons from localStorage
 * Should be called once on app startup
 */
export function initializeComparisons() {
    const saved = loadFromStorage();
    updateState({ savedComparisons: saved });
    return saved;
}

/**
 * Save current calculation as a comparison option
 * @param {string} name - User-defined name for this option
 * @param {string} notes - Optional user notes
 * @param {Object} inputs - The inputs used for calculation
 * @returns {Object} - The saved comparison object
 */
export function saveComparison(name, notes = '', inputs = {}) {
    const currentState = getState();
    const { intercompany, entities, taxParams } = currentState;

    if (!intercompany.results) {
        console.warn('No results to save');
        return null;
    }

    const comparison = {
        id: crypto.randomUUID(),
        name: name.trim() || `Option ${currentState.savedComparisons.length + 1}`,
        timestamp: Date.now(),
        modelId: intercompany.selectedModel,
        variantId: intercompany.selectedVariant,
        inputs: JSON.parse(JSON.stringify(inputs)),
        entityConfig: JSON.parse(JSON.stringify(entities)),
        taxParams: JSON.parse(JSON.stringify(taxParams)),
        results: JSON.parse(JSON.stringify(intercompany.results)),
        perspective: intercompany.currentPerspective,
        notes: notes.trim()
    };

    const updatedComparisons = [...currentState.savedComparisons, comparison];

    updateState({ savedComparisons: updatedComparisons });

    // Persist to localStorage
    saveToStorage(updatedComparisons);

    return comparison;
}

/**
 * Load a saved comparison's inputs (restore to current state)
 * @param {string} id - Comparison ID to load
 * @returns {Object|null} - The loaded comparison or null if not found
 */
export function loadComparison(id) {
    const comparison = state.savedComparisons.find(c => c.id === id);
    if (!comparison) {
        console.warn(`Comparison not found: ${id}`);
        return null;
    }

    // Restore state from comparison
    updateState({
        intercompany: {
            ...state.intercompany,
            selectedModel: comparison.modelId,
            selectedVariant: comparison.variantId,
            currentPerspective: comparison.perspective,
            results: comparison.results
        },
        entities: comparison.entityConfig,
        taxParams: comparison.taxParams
    });

    return comparison;
}

/**
 * Delete a saved comparison
 * @param {string} id - Comparison ID to delete
 * @returns {boolean} - Success status
 */
export function deleteComparison(id) {
    const currentComparisons = state.savedComparisons;
    const updatedComparisons = currentComparisons.filter(c => c.id !== id);

    if (updatedComparisons.length === currentComparisons.length) {
        console.warn(`Comparison not found for deletion: ${id}`);
        return false;
    }

    // Also remove from activeComparisonIds if selected
    const activeIds = state.ui.activeComparisonIds.filter(cid => cid !== id);

    updateState({
        savedComparisons: updatedComparisons,
        ui: {
            ...state.ui,
            activeComparisonIds: activeIds
        }
    });

    // Persist to localStorage
    saveToStorage(updatedComparisons);

    return true;
}

/**
 * Update notes for a saved comparison
 * @param {string} id - Comparison ID
 * @param {string} notes - New notes text
 * @returns {boolean} - Success status
 */
export function updateComparisonNotes(id, notes) {
    const updatedComparisons = state.savedComparisons.map(c =>
        c.id === id ? { ...c, notes: notes.trim() } : c
    );

    const found = updatedComparisons.some(c => c.id === id);
    if (!found) {
        console.warn(`Comparison not found for update: ${id}`);
        return false;
    }

    updateState({ savedComparisons: updatedComparisons });

    // Persist to localStorage
    saveToStorage(updatedComparisons);

    return true;
}

/**
 * Rename a saved comparison
 * @param {string} id - Comparison ID
 * @param {string} name - New name
 * @returns {boolean} - Success status
 */
export function renameComparison(id, name) {
    const updatedComparisons = state.savedComparisons.map(c =>
        c.id === id ? { ...c, name: name.trim() } : c
    );

    const found = updatedComparisons.some(c => c.id === id);
    if (!found) {
        console.warn(`Comparison not found for rename: ${id}`);
        return false;
    }

    updateState({ savedComparisons: updatedComparisons });

    // Persist to localStorage
    saveToStorage(updatedComparisons);

    return true;
}

/**
 * Get all saved comparisons
 * @returns {Array} - Array of comparison objects
 */
export function getComparisons() {
    return [...state.savedComparisons];
}

/**
 * Get a specific comparison by ID
 * @param {string} id - Comparison ID
 * @returns {Object|null} - Comparison object or null
 */
export function getComparisonById(id) {
    return state.savedComparisons.find(c => c.id === id) || null;
}

/**
 * Clear all saved comparisons
 * @returns {boolean} - Success status
 */
export function clearAllComparisons() {
    updateState({
        savedComparisons: [],
        ui: {
            ...state.ui,
            activeComparisonIds: [],
            comparisonViewOpen: false
        }
    });

    // Clear from localStorage
    clearStorage();

    return true;
}

/**
 * Import comparisons from external data
 * @param {Array} comparisons - Array of comparison objects
 * @param {string} mode - 'merge' | 'replace'
 * @returns {number} - Number of comparisons after import
 */
export function importComparisons(comparisons, mode = 'merge') {
    if (!Array.isArray(comparisons)) {
        console.warn('Invalid comparisons data for import');
        return state.savedComparisons.length;
    }

    let updatedComparisons;
    if (mode === 'replace') {
        updatedComparisons = comparisons;
    } else {
        // Merge mode: add new, skip duplicates by id
        const existingIds = new Set(state.savedComparisons.map(c => c.id));
        const newComparisons = comparisons.filter(c => !existingIds.has(c.id));
        updatedComparisons = [...state.savedComparisons, ...newComparisons];
    }

    updateState({ savedComparisons: updatedComparisons });

    // Persist to localStorage
    saveToStorage(updatedComparisons);

    return updatedComparisons.length;
}

// ========== COMPARISON UI STATE ==========

/**
 * Toggle comparison view open/closed
 */
export function toggleComparisonView() {
    updateState({
        ui: {
            ...state.ui,
            comparisonViewOpen: !state.ui.comparisonViewOpen
        }
    });
}

/**
 * Set comparison view open state
 * @param {boolean} isOpen
 */
export function setComparisonViewOpen(isOpen) {
    updateState({
        ui: {
            ...state.ui,
            comparisonViewOpen: isOpen
        }
    });
}

/**
 * Toggle save modal
 * @param {boolean} isOpen
 */
export function setSaveModalOpen(isOpen) {
    updateState({
        ui: {
            ...state.ui,
            saveModalOpen: isOpen
        }
    });
}

/**
 * Select comparisons for side-by-side view
 * @param {Array<string>} ids - Array of comparison IDs
 */
export function setActiveComparisons(ids) {
    // Validate IDs exist
    const validIds = ids.filter(id =>
        state.savedComparisons.some(c => c.id === id)
    );

    updateState({
        ui: {
            ...state.ui,
            activeComparisonIds: validIds
        }
    });
}

/**
 * Toggle a comparison in/out of active selection
 * @param {string} id - Comparison ID to toggle
 */
export function toggleComparisonSelection(id) {
    const current = state.ui.activeComparisonIds;
    const isSelected = current.includes(id);

    let newIds;
    if (isSelected) {
        newIds = current.filter(cid => cid !== id);
    } else {
        // Max 4 comparisons for side-by-side view
        if (current.length >= 4) {
            console.warn('Maximum 4 comparisons can be selected');
            newIds = [...current.slice(1), id];  // Remove oldest, add new
        } else {
            newIds = [...current, id];
        }
    }

    updateState({
        ui: {
            ...state.ui,
            activeComparisonIds: newIds
        }
    });
}

/**
 * Clear all comparison selections
 */
export function clearComparisonSelections() {
    updateState({
        ui: {
            ...state.ui,
            activeComparisonIds: []
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
    setCalculating,
    // Comparison actions
    initializeComparisons,
    saveComparison,
    loadComparison,
    deleteComparison,
    updateComparisonNotes,
    renameComparison,
    getComparisons,
    getComparisonById,
    clearAllComparisons,
    importComparisons,
    // Comparison UI state
    toggleComparisonView,
    setComparisonViewOpen,
    setSaveModalOpen,
    setActiveComparisons,
    toggleComparisonSelection,
    clearComparisonSelections
};
