import { models } from '../models/index.js';

// Forward declaration - will be set by app.js
let onInputChange;

export function setEventHandlers(handlers) {
    onInputChange = handlers.onInputChange;
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
function generateInputHTML(modelKey, input) {
    const inputId = `${modelKey}-${input.name}`;
    const inputType = input.type === 'text' ? 'text' : 'number';

    return `
        <div class="mb-4">
            <label for="${inputId}" class="block text-sm font-medium text-gray-300 mb-1">
                ${input.label}
            </label>
            <input
                type="${inputType}"
                id="${inputId}"
                name="${input.name}"
                class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value="${input.default}"
                ${inputType === 'number' ? `min="${input.min !== undefined ? input.min : 0}"` : ''}
                ${inputType === 'number' && input.max !== undefined ? `max="${input.max}"` : ''}
                ${inputType === 'number' ? `step="${input.step}"` : ''}
                data-type="${input.type}"
                data-model="${modelKey}"
            />
            ${input.hint ? `<small class="text-xs text-gray-500 mt-1 block">${input.hint}</small>` : ''}
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

    let formHTML = '';

    // PRICING SECTION
    if (grouped.pricing.length > 0) {
        formHTML += `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-100 mb-1">Pricing</h3>
                <p class="text-xs text-gray-400 mb-3">Current price and volume</p>
                ${grouped.pricing.map(input => generateInputHTML(modelKey, input)).join('')}
            </div>
        `;
    }

    // SELLER COSTS SECTION
    if (grouped.seller.length > 0) {
        formHTML += `
            <div class="mb-6 pb-6 border-b border-gray-700">
                <h3 class="text-lg font-semibold text-gray-100 mb-1">Seller Costs</h3>
                <p class="text-xs text-gray-400 mb-3">Your costs and margin goals</p>
                ${grouped.seller.map(input => generateInputHTML(modelKey, input)).join('')}
            </div>
        `;
    }

    // BUYER VALUE SECTION
    if (grouped.buyer.length > 0) {
        formHTML += `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-100 mb-1">Buyer Value</h3>
                <p class="text-xs text-gray-400 mb-3">Value delivered to customers</p>
                ${grouped.buyer.map(input => generateInputHTML(modelKey, input)).join('')}
            </div>
        `;
    }

    formContainer.innerHTML = formHTML;

    // Add input event listeners
    model.inputs.forEach(input => {
        const inputId = `${modelKey}-${input.name}`;
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.addEventListener('input', onInputChange);
        }
    });
}

