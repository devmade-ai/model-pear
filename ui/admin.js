import { models } from '../models/index.js';
import { selectedModels, storedInputValues } from '../config/constants.js';

// Forward declaration - will be set by app.js
let onAdminInputChangeHandler;

export function setAdminHandlers(handlers) {
    onAdminInputChangeHandler = handlers.onAdminInputChange;
}

// ========== ADMIN PANEL IMPLEMENTATION ==========

/**
 * Generate admin panel for editing all model defaults
 */
export function generateAdminPanel() {
    const adminPanelContent = document.getElementById('adminPanelContent');

    // Get all 20 main revenue models (excluding categories and framework options)
    const mainModels = [
        'one-time', 'subscription', 'freemium', 'usage-based', 'tiered', 'per-seat',
        'retainer', 'managed-services', 'credits-token', 'time-materials', 'fixed-price',
        'outcome-based', 'open-core', 'marketplace', 'revenue-share', 'advertising',
        'ela', 'data-licensing', 'white-label'
    ];

    // Collect all unique parameter names across all models
    const allParameters = new Map();

    mainModels.forEach(modelKey => {
        const model = models[modelKey];
        if (!model || !model.inputs) return;

        model.inputs.forEach(input => {
            if (!allParameters.has(input.name)) {
                allParameters.set(input.name, {
                    label: input.label,
                    type: input.type,
                    models: new Map()
                });
            }
            allParameters.get(input.name).models.set(modelKey, input);
        });
    });

    let tableHTML = `
        <div class="overflow-x-auto max-h-[calc(100vh-300px)]">
            <table class="w-full text-xs text-gray-300 border border-gray-600 rounded-lg">
                <thead class="bg-gray-700 sticky top-0 z-20">
                    <tr>
                        <th class="px-3 py-2 text-left font-semibold border-b border-gray-600 sticky left-0 bg-gray-700 z-30 min-w-[180px]">Parameter</th>
    `;

    // Add header for each model
    mainModels.forEach(modelKey => {
        const model = models[modelKey];
        if (!model) return;

        // Shorten model names for table headers
        let shortName = model.name;
        if (shortName.length > 20) {
            shortName = shortName.substring(0, 18) + '...';
        }

        tableHTML += `
            <th class="px-2 py-2 text-left font-semibold border-b border-gray-600 min-w-[120px]" title="${model.name}">
                <div class="text-white text-xs">${shortName}</div>
            </th>
        `;
    });

    tableHTML += `
                    </tr>
                </thead>
                <tbody class="bg-gray-800">
    `;

    // Add rows for each parameter
    let rowIndex = 0;
    allParameters.forEach((paramData, paramName) => {
        const rowClass = rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750';
        tableHTML += `
            <tr class="${rowClass} hover:bg-gray-700 transition-colors">
                <td class="px-3 py-2 font-medium border-b border-gray-700 sticky left-0 ${rowClass} z-10">
                    <div class="text-gray-100">${paramData.label}</div>
                    <div class="text-xs text-gray-500 mt-1">${paramData.type === 'currency' ? 'R' : paramData.type === 'percent' ? '%' : '#'}</div>
                </td>
        `;

        // Add cell for each model
        mainModels.forEach(modelKey => {
            const input = paramData.models.get(modelKey);

            if (input) {
                const currentValue = input.default;
                const unit = input.type === 'currency' ? 'R' : input.type === 'percent' ? '%' : '';

                tableHTML += `
                    <td class="px-2 py-2 border-b border-gray-700">
                        <div class="flex items-center gap-1">
                            <input
                                type="number"
                                id="admin-${modelKey}-${input.name}"
                                name="${input.name}"
                                class="w-full px-2 py-1 bg-gray-700 text-gray-100 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                value="${currentValue}"
                                min="${input.min !== undefined ? input.min : 0}"
                                ${input.max !== undefined ? 'max="' + input.max + '"' : ''}
                                step="${input.step}"
                                data-type="${input.type}"
                                data-model="${modelKey}"
                                data-input-name="${input.name}"
                                title="${input.hint || input.label}"
                            />
                            ${unit ? `<span class="text-gray-500 text-xs">${unit}</span>` : ''}
                        </div>
                    </td>
                `;
            } else {
                // Parameter not applicable to this model
                tableHTML += `
                    <td class="px-2 py-2 border-b border-gray-700 text-center">
                        <span class="text-gray-600 text-xs italic">N/A</span>
                    </td>
                `;
            }
        });

        tableHTML += `
            </tr>
        `;
        rowIndex++;
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
        <div class="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
            <p class="text-xs text-gray-300 mb-2">
                <strong>💡 Admin Panel Instructions:</strong>
            </p>
            <ul class="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>Edit default values for all 20 revenue models in one place</li>
                <li>Changes update model defaults immediately</li>
                <li>Scroll horizontally to see all models</li>
                <li>Hover over inputs to see parameter descriptions</li>
                <li>Switch back to Vendor/Growth/Client mode to use the calculator</li>
            </ul>
        </div>
    `;

    adminPanelContent.innerHTML = tableHTML;

    // Add event listeners to all admin inputs
    allParameters.forEach((paramData, paramName) => {
        mainModels.forEach(modelKey => {
            const input = paramData.models.get(modelKey);
            if (input) {
                const adminInputId = `admin-${modelKey}-${input.name}`;
                const adminInputElement = document.getElementById(adminInputId);
                if (adminInputElement) {
                    adminInputElement.addEventListener('input', onAdminInputChange);
                }
            }
        });
    });
}

/**
 * Handle admin panel input changes and update model defaults
 */
export function onAdminInputChange(event) {
    const adminInput = event.target;
    const modelKey = adminInput.dataset.model;
    const inputName = adminInput.dataset.inputName;
    const value = parseFloat(adminInput.value) || 0;

    // Update the model's default value
    const model = models[modelKey];
    if (model && model.inputs) {
        const input = model.inputs.find(inp => inp.name === inputName);
        if (input) {
            input.default = value;
        }
    }

    // If this model is currently selected and has a form input, update it
    const formInputId = `${modelKey}-${inputName}`;
    const formInput = document.getElementById(formInputId);
    if (formInput) {
        formInput.value = value;
    }

    // Update stored values if this model is selected
    if (selectedModels.has(modelKey)) {
        if (!storedInputValues.has(modelKey)) {
            storedInputValues.set(modelKey, {});
        }
        storedInputValues.get(modelKey)[inputName] = value;
    }
}

