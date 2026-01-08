// ========== INTER-COMPANY CALCULATOR UI ==========
// Main UI component for the Inter-Company Software Transaction Tool.
// Integrates model selection, variant selection, input forms, and results display.
// Now includes Structure Selector wizard for guided model selection.

import { getState, subscribe, selectIntercompanyModel, selectVariant, setIntercompanyResults, setCalculating } from '../../state/app-state.js';
import { getModelMetadata, getModelVariants, getVariantInputs, calculateIntercompany, DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from '../../models/intercompany/registry.js';
import { initPerspectiveToggle } from './perspective-toggle.js';
import { renderIntercompanyResults } from './results-display.js';
import { initEntityConfig } from './entity-config.js';
import { initStructureSelector } from './structure-selector.js';
import { formatCurrency, formatPercentage, showToast } from '../../utils/index.js';

// ========== STATE ==========

let unsubscribers = [];
let selectionMode = 'wizard';  // 'wizard' | 'direct' - start with wizard by default

// ========== INITIALIZATION ==========

/**
 * Initialize the inter-company calculator
 */
export function initIntercompanyCalculator() {
    const container = document.getElementById('intercompanyCalculator');
    if (!container) {
        console.warn('Inter-company calculator container not found');
        return;
    }

    // Render initial UI
    renderCalculatorUI(container);

    // Subscribe to state changes
    const unsubscribe = subscribe((newState, oldState) => {
        handleStateChange(newState, oldState, container);
    });
    unsubscribers.push(unsubscribe);
}

/**
 * Cleanup subscriptions
 */
export function destroyIntercompanyCalculator() {
    unsubscribers.forEach(fn => fn());
    unsubscribers = [];
}

// ========== RENDER FUNCTIONS ==========

/**
 * Render the complete calculator UI
 */
function renderCalculatorUI(container) {
    const state = getState();
    const models = getModelMetadata();

    container.innerHTML = `
        <div class="intercompany-calculator">
            <!-- Entity Configuration (Collapsible) -->
            <div id="entityConfigSection" class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                <!-- Entity config will be populated here -->
            </div>

            <!-- Selection Mode Toggle -->
            <div class="bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-700 mb-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">🧭</span>
                        <div>
                            <h3 class="text-sm font-medium text-gray-200">Model Selection Mode</h3>
                            <p class="text-xs text-gray-400">Choose how you want to select a transaction model</p>
                        </div>
                    </div>
                    <div class="flex gap-2 bg-gray-700 p-1 rounded-lg">
                        <button
                            id="modeWizardBtn"
                            class="selection-mode-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectionMode === 'wizard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}"
                            data-mode="wizard"
                        >
                            <span class="mr-1">✨</span> Wizard
                        </button>
                        <button
                            id="modeDirectBtn"
                            class="selection-mode-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectionMode === 'direct' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}"
                            data-mode="direct"
                        >
                            <span class="mr-1">📋</span> Direct
                        </button>
                    </div>
                </div>
            </div>

            <!-- Structure Selector Wizard (shown in wizard mode) -->
            <div id="structureSelectorSection" class="${selectionMode === 'wizard' ? '' : 'hidden'} bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                <!-- Wizard will be populated here -->
            </div>

            <!-- Model Selection (shown in direct mode or after wizard selection) -->
            <div id="modelSelectionSection" class="${selectionMode === 'direct' || state.intercompany.selectedModel ? '' : 'hidden'} bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                <h2 class="text-xl font-semibold text-gray-100 mb-3">Select Transaction Model</h2>
                <p class="text-sm text-gray-400 mb-4">Choose the inter-company transaction structure</p>

                <div id="modelSelector" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    ${models.map(model => renderModelButton(model, state.intercompany.selectedModel === model.id)).join('')}
                </div>
            </div>

            <!-- Variant Selection (shown when model selected) -->
            <div id="variantSection" class="hidden bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                <h3 class="text-lg font-semibold text-gray-100 mb-3">Select Variant</h3>
                <p id="variantDescription" class="text-sm text-gray-400 mb-4"></p>
                <div id="variantSelector" class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <!-- Variants will be populated dynamically -->
                </div>
            </div>

            <!-- Input Form (shown when variant selected) -->
            <div id="inputSection" class="hidden bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                <h3 class="text-lg font-semibold text-gray-100 mb-4">Transaction Inputs</h3>
                <form id="intercompanyInputForm" class="space-y-6">
                    <!-- Inputs will be populated dynamically -->
                </form>

                <div class="mt-6">
                    <button id="calculateIntercompanyBtn" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold">
                        <span id="calcBtnText">Calculate Transaction</span>
                        <span id="calcBtnLoader" class="hidden">
                            <svg class="animate-spin inline-block h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            <!-- Results Section -->
            <div id="resultsSection" class="hidden">
                <!-- Perspective Toggle -->
                <div id="perspectiveToggleContainer" class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                    <!-- Perspective toggle will be rendered here -->
                </div>

                <!-- Results Display -->
                <div id="intercompanyResults" class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700">
                    <!-- Results will be rendered here -->
                </div>
            </div>
        </div>
    `;

    // Add event listeners
    setupEventListeners(container);

    // Initialize entity configuration panel
    const entityConfigSection = container.querySelector('#entityConfigSection');
    if (entityConfigSection) {
        initEntityConfig(entityConfigSection);
    }

    // Initialize structure selector wizard if in wizard mode
    if (selectionMode === 'wizard') {
        const wizardSection = container.querySelector('#structureSelectorSection');
        if (wizardSection) {
            initStructureSelector(wizardSection, handleWizardModelSelected);
        }
    }
}

/**
 * Handle model selection from wizard
 */
function handleWizardModelSelected(modelId, variantId) {
    if (!modelId) {
        // User skipped wizard, switch to direct mode
        selectionMode = 'direct';
        const container = document.getElementById('intercompanyCalculator');
        if (container) {
            renderCalculatorUI(container);
        }
        return;
    }

    // Model was selected, update the UI to show variant/input sections
    const container = document.getElementById('intercompanyCalculator');
    if (!container) return;

    // Show model selection section with selected model highlighted
    const modelSection = container.querySelector('#modelSelectionSection');
    if (modelSection) {
        modelSection.classList.remove('hidden');
    }

    // Update model button styles
    container.querySelectorAll('.model-select-btn').forEach(btn => {
        const isSelected = btn.dataset.modelId === modelId;
        btn.classList.toggle('bg-blue-600/20', isSelected);
        btn.classList.toggle('border-blue-500', isSelected);
        btn.classList.toggle('text-blue-300', isSelected);
        btn.classList.toggle('bg-gray-700', !isSelected);
        btn.classList.toggle('border-gray-600', !isSelected);
        btn.classList.toggle('text-gray-300', !isSelected);
    });

    // Show variant section
    const variantSection = container.querySelector('#variantSection');
    const variantSelector = container.querySelector('#variantSelector');
    if (variantSection && variantSelector) {
        variantSelector.innerHTML = renderVariantButtons(modelId);
        variantSection.classList.remove('hidden');

        // If variant was pre-selected by wizard, highlight it
        if (variantId) {
            container.querySelectorAll('.variant-select-btn').forEach(btn => {
                const isSelected = btn.dataset.variantId === variantId;
                btn.classList.toggle('bg-green-600/20', isSelected);
                btn.classList.toggle('border-green-500', isSelected);
                btn.classList.toggle('text-green-300', isSelected);
                btn.classList.toggle('bg-gray-700', !isSelected);
                btn.classList.toggle('border-gray-600', !isSelected);
                btn.classList.toggle('text-gray-300', !isSelected);
            });

            // Show input section
            const inputSection = container.querySelector('#inputSection');
            const inputForm = container.querySelector('#intercompanyInputForm');
            if (inputSection && inputForm) {
                inputForm.innerHTML = renderInputForm(modelId, variantId);
                inputSection.classList.remove('hidden');
            }
        }
    }

    // Hide wizard section since selection is complete
    const wizardSection = container.querySelector('#structureSelectorSection');
    if (wizardSection) {
        wizardSection.classList.add('hidden');
    }
}

/**
 * Render a model selection button
 */
function renderModelButton(model, isSelected) {
    return `
        <button
            class="model-select-btn text-left px-4 py-4 rounded-lg border-2 transition-all duration-200
                   ${isSelected ?
                       'bg-blue-600/20 border-blue-500 text-blue-300' :
                       'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50'
                   }"
            data-model-id="${model.id}"
        >
            <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">${model.id === 'model-1' ? '💻' : '📦'}</span>
                <span class="font-semibold">${model.shortName || model.name}</span>
            </div>
            <p class="text-sm opacity-75">${model.description}</p>
            <p class="text-xs mt-2 opacity-50">${model.variantCount} variants available</p>
        </button>
    `;
}

/**
 * Render variant selection buttons
 */
function renderVariantButtons(modelId) {
    const variants = getModelVariants(modelId);
    const state = getState();
    const selectedVariant = state.intercompany.selectedVariant;

    return variants.map(variant => `
        <button
            class="variant-select-btn text-left px-4 py-3 rounded-lg border-2 transition-all duration-200
                   ${selectedVariant === variant.id ?
                       'bg-green-600/20 border-green-500 text-green-300' :
                       'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                   }"
            data-variant-id="${variant.id}"
        >
            <div class="flex items-center justify-between mb-1">
                <span class="font-semibold">${variant.id}: ${variant.name}</span>
            </div>
            <p class="text-xs opacity-75">${variant.description}</p>
        </button>
    `).join('');
}

/**
 * Render the input form for a model variant
 */
function renderInputForm(modelId, variantId) {
    const inputs = getVariantInputs(modelId, variantId);

    // Group inputs by category
    const grouped = inputs.reduce((acc, input) => {
        const category = input.category || 'other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(input);
        return acc;
    }, {});

    const categoryOrder = ['transaction', 'developer', 'buyer', 'tax', 'other'];
    const categoryLabels = {
        transaction: { label: 'Transaction Details', icon: '📋' },
        developer: { label: 'Developer Inputs', icon: '💻' },
        buyer: { label: 'Buyer Inputs', icon: '🏢' },
        tax: { label: 'Tax Parameters', icon: '💰' },
        other: { label: 'Other', icon: '📁' }
    };

    return categoryOrder
        .filter(cat => grouped[cat] && grouped[cat].length > 0)
        .map(category => `
            <div class="input-category">
                <h4 class="text-md font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <span>${categoryLabels[category]?.icon || '📁'}</span>
                    ${categoryLabels[category]?.label || category}
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${grouped[category].map(input => renderInputField(input, modelId)).join('')}
                </div>
            </div>
        `).join('');
}

/**
 * Render a single input field
 */
function renderInputField(input, modelId) {
    const inputId = `${modelId}-${input.name}`;
    const value = input.default !== undefined ? input.default : '';

    let inputHtml;

    switch (input.type) {
        case 'select':
            inputHtml = `
                <select
                    id="${inputId}"
                    name="${input.name}"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    ${input.options.map(opt => `
                        <option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>
                    `).join('')}
                </select>
            `;
            break;

        case 'currency':
        case 'number':
        case 'percent':
            const prefix = input.type === 'currency' ? 'R ' : '';
            const suffix = input.type === 'percent' ? '%' : '';
            inputHtml = `
                <div class="relative">
                    ${prefix ? `<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${prefix}</span>` : ''}
                    <input
                        type="number"
                        id="${inputId}"
                        name="${input.name}"
                        value="${value}"
                        min="${input.min !== undefined ? input.min : ''}"
                        max="${input.max !== undefined ? input.max : ''}"
                        step="${input.step || 1}"
                        class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}"
                    >
                    ${suffix ? `<span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">${suffix}</span>` : ''}
                </div>
            `;
            break;

        case 'text':
        default:
            inputHtml = `
                <input
                    type="text"
                    id="${inputId}"
                    name="${input.name}"
                    value="${value}"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
            `;
    }

    return `
        <div class="input-field">
            <label for="${inputId}" class="block text-sm text-gray-400 mb-1">${input.label}</label>
            ${inputHtml}
            ${input.hint ? `<p class="text-xs text-gray-500 mt-1">${input.hint}</p>` : ''}
        </div>
    `;
}

// ========== EVENT HANDLERS ==========

function setupEventListeners(container) {
    // Selection mode toggle
    container.addEventListener('click', (e) => {
        const modeBtn = e.target.closest('.selection-mode-btn');
        if (modeBtn) {
            const newMode = modeBtn.dataset.mode;
            if (newMode !== selectionMode) {
                selectionMode = newMode;
                renderCalculatorUI(container);
            }
            return;
        }

        // Model selection
        const modelBtn = e.target.closest('.model-select-btn');
        if (modelBtn) {
            const modelId = modelBtn.dataset.modelId;
            handleModelSelect(modelId, container);
            return;
        }

        // Variant selection
        const variantBtn = e.target.closest('.variant-select-btn');
        if (variantBtn) {
            const variantId = variantBtn.dataset.variantId;
            handleVariantSelect(variantId, container);
            return;
        }
    });

    // Calculate button
    const calcBtn = container.querySelector('#calculateIntercompanyBtn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => handleCalculate(container));
    }
}

function handleModelSelect(modelId, container) {
    selectIntercompanyModel(modelId);

    // Show variant section
    const variantSection = container.querySelector('#variantSection');
    const variantSelector = container.querySelector('#variantSelector');

    if (variantSection && variantSelector) {
        variantSelector.innerHTML = renderVariantButtons(modelId);
        variantSection.classList.remove('hidden');
    }

    // Hide input and results sections
    container.querySelector('#inputSection')?.classList.add('hidden');
    container.querySelector('#resultsSection')?.classList.add('hidden');

    // Update model button styles
    container.querySelectorAll('.model-select-btn').forEach(btn => {
        const isSelected = btn.dataset.modelId === modelId;
        btn.classList.toggle('bg-blue-600/20', isSelected);
        btn.classList.toggle('border-blue-500', isSelected);
        btn.classList.toggle('text-blue-300', isSelected);
        btn.classList.toggle('bg-gray-700', !isSelected);
        btn.classList.toggle('border-gray-600', !isSelected);
        btn.classList.toggle('text-gray-300', !isSelected);
    });
}

function handleVariantSelect(variantId, container) {
    const state = getState();
    const modelId = state.intercompany.selectedModel;

    selectVariant(variantId);

    // Show input section
    const inputSection = container.querySelector('#inputSection');
    const inputForm = container.querySelector('#intercompanyInputForm');

    if (inputSection && inputForm) {
        inputForm.innerHTML = renderInputForm(modelId, variantId);
        inputSection.classList.remove('hidden');
    }

    // Hide results section
    container.querySelector('#resultsSection')?.classList.add('hidden');

    // Update variant button styles
    container.querySelectorAll('.variant-select-btn').forEach(btn => {
        const isSelected = btn.dataset.variantId === variantId;
        btn.classList.toggle('bg-green-600/20', isSelected);
        btn.classList.toggle('border-green-500', isSelected);
        btn.classList.toggle('text-green-300', isSelected);
        btn.classList.toggle('bg-gray-700', !isSelected);
        btn.classList.toggle('border-gray-600', !isSelected);
        btn.classList.toggle('text-gray-300', !isSelected);
    });
}

function handleCalculate(container) {
    const state = getState();
    const { selectedModel, selectedVariant } = state.intercompany;

    if (!selectedModel || !selectedVariant) {
        showToast('Please select a model and variant first', 'warning');
        return;
    }

    // Show loading state
    setCalculating(true);
    const btnText = container.querySelector('#calcBtnText');
    const btnLoader = container.querySelector('#calcBtnLoader');
    const calcBtn = container.querySelector('#calculateIntercompanyBtn');

    if (btnText && btnLoader && calcBtn) {
        calcBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    }

    // Gather inputs
    setTimeout(() => {
        try {
            const inputs = gatherInputValues(container, selectedModel);

            // Calculate
            const results = calculateIntercompany(
                selectedModel,
                selectedVariant,
                inputs,
                state.entities,
                state.taxParams
            );

            // Store results
            setIntercompanyResults(results);

            // Show results section
            const resultsSection = container.querySelector('#resultsSection');
            if (resultsSection) {
                resultsSection.classList.remove('hidden');

                // Initialize perspective toggle
                const toggleContainer = container.querySelector('#perspectiveToggleContainer');
                if (toggleContainer) {
                    initPerspectiveToggle(toggleContainer);
                }

                // Render results
                const resultsContainer = container.querySelector('#intercompanyResults');
                if (resultsContainer) {
                    renderIntercompanyResults(resultsContainer, results);
                }
            }

            showToast('Calculation completed successfully!', 'success');

        } catch (error) {
            console.error('Calculation error:', error);
            showToast('Calculation error: ' + error.message, 'error');
        } finally {
            // Hide loading state
            setCalculating(false);
            if (btnText && btnLoader && calcBtn) {
                calcBtn.disabled = false;
                btnText.classList.remove('hidden');
                btnLoader.classList.add('hidden');
            }
        }
    }, 100);
}

function gatherInputValues(container, modelId) {
    const inputs = {};
    const form = container.querySelector('#intercompanyInputForm');

    if (!form) return inputs;

    form.querySelectorAll('input, select').forEach(element => {
        const name = element.name;
        if (!name) return;

        if (element.type === 'number') {
            inputs[name] = parseFloat(element.value) || 0;
        } else {
            inputs[name] = element.value;
        }
    });

    return inputs;
}

// ========== STATE CHANGE HANDLER ==========

function handleStateChange(newState, oldState, container) {
    // Handle perspective changes
    if (newState.intercompany?.currentPerspective !== oldState?.intercompany?.currentPerspective) {
        const results = newState.intercompany?.results;
        if (results) {
            const resultsContainer = container.querySelector('#intercompanyResults');
            if (resultsContainer) {
                renderIntercompanyResults(resultsContainer, results);
            }
        }
    }
}

// ========== EXPORTS ==========

export default {
    initIntercompanyCalculator,
    destroyIntercompanyCalculator
};
