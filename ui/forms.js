import { models } from '../models/index.js';
import { getCalculationOptions } from '../calculators/reverse-calculations.js';

// Forward declaration - will be set by app.js
let onInputChange;
let onCalculationModeChange;

// Store current calculation mode
let currentCalculationMode = 'none';
let currentPricingStrategy = 'balanced';

export function setEventHandlers(handlers) {
    onInputChange = handlers.onInputChange;
    onCalculationModeChange = handlers.onCalculationModeChange;
}

export function getCurrentCalculationMode() {
    return currentCalculationMode;
}

export function getCurrentPricingStrategy() {
    return currentPricingStrategy;
}

// ========== FORM GENERATION ==========

/**
 * Group inputs by category
 */
function groupInputsByCategory(inputs) {
    const grouped = {
        pricing: [],
        seller: [],
        buyer: []
    };

    inputs.forEach(input => {
        const category = input.category || 'pricing';
        if (grouped[category]) {
            grouped[category].push(input);
        }
    });

    return grouped;
}

/**
 * Generate HTML for a single input field
 */
function generateInputHTML(modelKey, input, isCalculated = false) {
    const inputId = `${modelKey}-${input.name}`;
    const inputType = input.type === 'text' ? 'text' : 'number';

    // Generate tooltip data attribute if input has hint or detailed info
    const tooltipData = input.hint ? `data-input-tooltip="${modelKey}:${input.name}"` : '';

    return `
        <div class="mb-4 ${isCalculated ? 'relative' : ''}">
            <label for="${inputId}" class="block text-sm font-medium text-gray-300 mb-1">
                <span class="flex items-center gap-2">
                    <span>${input.label}</span>
                    ${isCalculated ? '<span class="text-xs px-2 py-0.5 bg-yellow-600 rounded" role="status">Auto-calculated</span>' : ''}
                    <button type="button" class="input-help-btn text-gray-500 hover:text-blue-400 transition-colors" ${tooltipData} title="Click for more information about ${input.label}" aria-label="Help for ${input.label}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </button>
                </span>
            </label>
            <div class="relative">
                <input
                    type="${inputType}"
                    id="${inputId}"
                    name="${input.name}"
                    class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isCalculated ? 'bg-yellow-900/20 border-yellow-600' : ''}"
                    value="${input.default}"
                    ${inputType === 'number' ? `min="${input.min !== undefined ? input.min : 0}"` : ''}
                    ${inputType === 'number' && input.max !== undefined ? `max="${input.max}"` : ''}
                    ${inputType === 'number' ? `step="${input.step}"` : ''}
                    data-type="${input.type}"
                    data-model="${modelKey}"
                    ${isCalculated ? 'readonly' : ''}
                    ${input.hint ? `aria-describedby="${inputId}-hint"` : ''}
                    aria-required="${!isCalculated}"
                />
                <span id="${inputId}-validation" class="success-indicator hidden" aria-live="polite">✓</span>
            </div>
            ${input.hint ? `
                <div id="${inputId}-hint" class="hint-with-icon">
                    <span class="hint-icon" aria-hidden="true">💡</span>
                    <small class="text-xs text-gray-400">${input.hint}</small>
                </div>
            ` : ''}
            <div id="${inputId}-error" class="error-message hidden" role="alert"></div>
        </div>
    `;
}

/**
 * Generate categorized form sections
 */
export function generateForm(modelKey) {
    const model = models[modelKey];
    const formContainer = document.getElementById('inputForm');
    const grouped = groupInputsByCategory(model.inputs);
    const calculationOptions = getCalculationOptions(modelKey);

    let formHTML = '';

    // CALCULATION MODE SELECTOR
    formHTML += `
        <div class="mb-6 pb-6 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-yellow-400 mb-1">Calculation Mode</h3>
            <p class="text-xs text-gray-400 mb-3">Choose what you want to calculate</p>
            <select
                id="calculation-mode"
                class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-3"
            >
                ${calculationOptions.map(opt => `
                    <option value="${opt.value}">${opt.label}</option>
                `).join('')}
            </select>
            <div id="calculation-mode-description" class="text-xs text-gray-400 italic"></div>

            <div id="pricing-strategy-container" class="mt-4 hidden">
                <label for="pricing-strategy" class="block text-sm font-medium text-gray-300 mb-1">
                    Pricing Strategy
                </label>
                <select
                    id="pricing-strategy"
                    class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                    <option value="minimum">Minimum Viable (Seller Floor) - Most competitive</option>
                    <option value="balanced" selected>Balanced (Midpoint) - Recommended</option>
                    <option value="maximum">Maximum Capture (Buyer Ceiling) - Highest profit</option>
                </select>
                <small class="text-xs text-gray-500 mt-1 block">Choose where in the equilibrium zone to price</small>
            </div>
        </div>
    `;

    // PRICING SECTION
    if (grouped.pricing.length > 0) {
        formHTML += `
            <details class="mb-4" open>
                <summary class="text-lg font-semibold text-gray-100">
                    <span>Pricing Inputs</span>
                </summary>
                <div>
                    <p class="text-xs text-gray-400 mb-3">Current price and volume</p>
                    ${grouped.pricing.map(input => generateInputHTML(modelKey, input, false)).join('')}
                </div>
            </details>
        `;
    }

    // SELLER COSTS SECTION
    if (grouped.seller.length > 0) {
        formHTML += `
            <details class="mb-4" open>
                <summary class="text-lg font-semibold text-gray-100">
                    <span>Seller Costs</span>
                </summary>
                <div>
                    <p class="text-xs text-gray-400 mb-3">Your costs and margin goals</p>
                    ${grouped.seller.map(input => generateInputHTML(modelKey, input, false)).join('')}
                </div>
            </details>
        `;
    }

    // BUYER VALUE SECTION
    if (grouped.buyer.length > 0) {
        formHTML += `
            <details class="mb-4" open>
                <summary class="text-lg font-semibold text-gray-100">
                    <span>Buyer Value</span>
                </summary>
                <div>
                    <p class="text-xs text-gray-400 mb-3">Value delivered to customers</p>
                    ${grouped.buyer.map(input => generateInputHTML(modelKey, input, false)).join('')}
                </div>
            </details>
        `;
    }

    formContainer.innerHTML = formHTML;

    // Add calculation mode event listener
    const calculationModeSelect = document.getElementById('calculation-mode');
    const pricingStrategyContainer = document.getElementById('pricing-strategy-container');
    const pricingStrategySelect = document.getElementById('pricing-strategy');
    const descriptionDiv = document.getElementById('calculation-mode-description');

    if (calculationModeSelect) {
        calculationModeSelect.addEventListener('change', (e) => {
            currentCalculationMode = e.target.value;

            // Update description
            const selectedOption = calculationOptions.find(opt => opt.value === currentCalculationMode);
            if (selectedOption) {
                descriptionDiv.textContent = selectedOption.description;

                // Show/hide pricing strategy selector
                if (selectedOption.requiresStrategy) {
                    pricingStrategyContainer.classList.remove('hidden');
                } else {
                    pricingStrategyContainer.classList.add('hidden');
                }
            }

            // Trigger recalculation
            if (onCalculationModeChange) {
                onCalculationModeChange(modelKey);
            }
        });

        // Initialize description
        calculationModeSelect.dispatchEvent(new Event('change'));
    }

    if (pricingStrategySelect) {
        pricingStrategySelect.addEventListener('change', (e) => {
            currentPricingStrategy = e.target.value;

            // Trigger recalculation
            if (onCalculationModeChange) {
                onCalculationModeChange(modelKey);
            }
        });
    }

    // Add input event listeners
    model.inputs.forEach(input => {
        const inputId = `${modelKey}-${input.name}`;
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.addEventListener('input', onInputChange);
        }
    });
}

