import { models } from '../models/index.js';

// Forward declaration - will be set by app.js
let onInputChange;

export function setEventHandlers(handlers) {
    onInputChange = handlers.onInputChange;
}

// ========== FORM GENERATION ==========

/**
 * Scenario templates for quick-start
 */
export const SCENARIO_TEMPLATES = {
    'subscription': {
        'Early Stage SaaS': {
            monthlyPrice: 49,
            newCustomers: 50,
            churnRate: 8,
            startingCustomers: 0,
            expansionRate: 2,
            cac: 150
        },
        'Enterprise SaaS': {
            monthlyPrice: 999,
            newCustomers: 5,
            churnRate: 3,
            startingCustomers: 10,
            expansionRate: 10,
            cac: 5000
        }
    },
    'freemium': {
        'Consumer App': {
            freeUsers: 1000,
            conversionRate: 2,
            timeToConversion: 3,
            paidPrice: 9.99,
            freeChurn: 20,
            paidChurn: 5,
            cac: 10
        },
        'B2B Freemium': {
            freeUsers: 200,
            conversionRate: 5,
            timeToConversion: 1,
            paidPrice: 99,
            freeChurn: 10,
            paidChurn: 4,
            cac: 100
        }
    },
    'usage-based': {
        'API Service': {
            pricePerUnit: 0.01,
            avgUsage: 5000,
            usageGrowth: 8,
            newCustomers: 30,
            churnRate: 2,
            usageVariance: 25,
            cac: 200
        },
        'Cloud Infrastructure': {
            pricePerUnit: 0.10,
            avgUsage: 1000,
            usageGrowth: 15,
            newCustomers: 10,
            churnRate: 5,
            usageVariance: 30,
            cac: 800
        }
    }
};

/**
 * Apply template to form inputs
 */
export function applyTemplate(modelKey, templateName) {
    const templates = SCENARIO_TEMPLATES[modelKey];
    if (!templates || !templates[templateName]) return;

    const templateData = templates[templateName];
    for (const [key, value] of Object.entries(templateData)) {
        const inputId = `${modelKey}-${key}`;
        const element = document.getElementById(inputId);
        if (element) {
            element.value = value;
        }
    }

    // Trigger input change to recalculate
    onInputChange();
}

/**
 * Generate dynamic form based on model inputs
 */
export function generateForm(modelKey) {
    const model = models[modelKey];
    const formContainer = document.getElementById('inputForm');

    let formHTML = `<h3 class="text-lg font-semibold text-gray-100 mb-4">Input Parameters</h3>`;

    // Add template selector if templates exist for this model
    if (SCENARIO_TEMPLATES[modelKey]) {
        formHTML += `
            <div class="mb-4 p-3 bg-gray-750 rounded-md border border-gray-600">
                <label class="block text-sm font-medium text-gray-300 mb-2">Quick Start Template</label>
                <select
                    id="${modelKey}-template"
                    class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onchange="applyTemplate('${modelKey}', this.value)"
                >
                    <option value="">Choose a template...</option>
                    ${Object.keys(SCENARIO_TEMPLATES[modelKey]).map(name =>
                        `<option value="${name}">${name}</option>`
                    ).join('')}
                </select>
            </div>
        `;
    }

    model.inputs.forEach(input => {
        const inputId = `${modelKey}-${input.name}`;
        // Show tooltip icon only for complex inputs (long hints or containing specific keywords)
        const needsTooltip = input.hint && (
            input.hint.length > 50 ||
            input.hint.includes('churn') ||
            input.hint.includes('conversion') ||
            input.hint.includes('rate') ||
            input.hint.includes('CAC') ||
            input.hint.includes('LTV') ||
            input.hint.includes('multiplier') ||
            input.hint.includes('percentage') ||
            input.hint.includes('ratio')
        );

        formHTML += `
            <div class="mb-4">
                <label for="${inputId}" class="flex items-center justify-between text-sm font-medium text-gray-300 mb-1">
                    <span>${input.label}</span>
                    ${needsTooltip ? `<span class="text-xs text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" onclick="showInputInfo('${modelKey}', '${input.name}')">ⓘ</span>` : ''}
                </label>
                <input
                    type="number"
                    id="${inputId}"
                    name="${input.name}"
                    class="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value="${input.default}"
                    min="${input.min !== undefined ? input.min : 0}"
                    ${input.max !== undefined ? 'max="' + input.max + '"' : ''}
                    step="${input.step}"
                    data-type="${input.type}"
                    data-model="${modelKey}"
                />
                ${input.hint ? `<small class="text-xs text-gray-500 mt-1 block">${input.hint}</small>` : ''}
            </div>
        `;
    });

    formContainer.innerHTML = formHTML;

    // Add input event listeners
    model.inputs.forEach(input => {
        const inputId = `${modelKey}-${input.name}`;
        const inputElement = document.getElementById(inputId);
        inputElement.addEventListener('input', onInputChange);
    });
}

