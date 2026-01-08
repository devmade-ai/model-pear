// ========== ENTITY CONFIGURATION UI ==========
// UI panel for configuring Developer and Buyer entity settings.
// Allows customization of tax parameters and relationship status.

import { getState, updateEntityConfig, updateTaxParams, subscribe } from '../../state/app-state.js';
import { DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from '../../models/intercompany/registry.js';

// ========== STATE ==========

let isExpanded = false;

// Store bound event handlers for cleanup
let boundChangeHandler = null;
let boundInputHandler = null;
let boundToggleHandler = null;
let boundResetHandler = null;
let currentContainer = null;

// ========== INITIALIZATION ==========

/**
 * Initialize the entity configuration panel
 */
export function initEntityConfig(container) {
    if (!container) return;

    renderEntityConfigPanel(container);
    setupEventListeners(container);
}

// ========== RENDER FUNCTIONS ==========

/**
 * Render the entity configuration panel
 */
function renderEntityConfigPanel(container) {
    const state = getState();
    const entities = state.entities || DEFAULT_ENTITY_CONFIG;
    const taxParams = state.taxParams || DEFAULT_TAX_PARAMS;

    container.innerHTML = `
        <div class="entity-config-panel">
            <!-- Collapsible Header -->
            <button
                id="entityConfigToggle"
                class="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                aria-expanded="${isExpanded}"
                aria-controls="entityConfigContent"
            >
                <div class="flex items-center gap-3">
                    <span class="text-xl">🏢</span>
                    <div class="text-left">
                        <span class="font-medium text-gray-200">Entity Configuration</span>
                        <p class="text-xs text-gray-400">Your company & client settings</p>
                    </div>
                </div>
                <svg
                    id="entityConfigChevron"
                    class="w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            <!-- Collapsible Content -->
            <div
                id="entityConfigContent"
                class="${isExpanded ? '' : 'hidden'} mt-4 space-y-6"
            >
                <!-- Your Company -->
                <div class="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                    <h4 class="text-md font-semibold text-blue-300 mb-4 flex items-center gap-2">
                        <span>💻</span> Your Company (Developer)
                    </h4>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-1" for="developer-name">Company Name</label>
                            <input
                                type="text"
                                id="developer-name"
                                name="developer.name"
                                value="${entities.developer?.name || 'Your Company'}"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                        </div>

                        <div>
                            <label class="block text-sm text-gray-400 mb-1" for="developer-jurisdiction">Jurisdiction</label>
                            <select
                                id="developer-jurisdiction"
                                name="developer.jurisdiction"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="South Africa" ${entities.developer?.jurisdiction === 'South Africa' ? 'selected' : ''}>South Africa</option>
                                <option value="Namibia" ${entities.developer?.jurisdiction === 'Namibia' ? 'selected' : ''}>Namibia</option>
                                <option value="Botswana" ${entities.developer?.jurisdiction === 'Botswana' ? 'selected' : ''}>Botswana</option>
                                <option value="Mauritius" ${entities.developer?.jurisdiction === 'Mauritius' ? 'selected' : ''}>Mauritius</option>
                                <option value="Other" ${entities.developer?.jurisdiction === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm text-gray-400 mb-1" for="developer-framework">Accounting Framework</label>
                            <select
                                id="developer-framework"
                                name="developer.accountingFramework"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="IFRS" ${entities.developer?.accountingFramework === 'IFRS' ? 'selected' : ''}>IFRS</option>
                                <option value="GRAP" ${entities.developer?.accountingFramework === 'GRAP' ? 'selected' : ''}>GRAP</option>
                                <option value="IFRS-SME" ${entities.developer?.accountingFramework === 'IFRS-SME' ? 'selected' : ''}>IFRS for SMEs</option>
                            </select>
                        </div>

                        <div class="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="developer-taxResident"
                                name="developer.taxResident"
                                ${entities.developer?.taxResident !== false ? 'checked' : ''}
                                class="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                            >
                            <label class="text-sm text-gray-400" for="developer-taxResident">SA Tax Resident</label>
                        </div>
                    </div>
                </div>

                <!-- Client -->
                <div class="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                    <h4 class="text-md font-semibold text-green-300 mb-4 flex items-center gap-2">
                        <span>🏢</span> Client (Buyer)
                    </h4>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-1" for="buyer-name">Client Name</label>
                            <input
                                type="text"
                                id="buyer-name"
                                name="buyer.name"
                                value="${entities.buyer?.name || 'Client'}"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                        </div>

                        <div>
                            <label class="block text-sm text-gray-400 mb-1" for="buyer-jurisdiction">Jurisdiction</label>
                            <select
                                id="buyer-jurisdiction"
                                name="buyer.jurisdiction"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="South Africa" ${entities.buyer?.jurisdiction === 'South Africa' ? 'selected' : ''}>South Africa</option>
                                <option value="Namibia" ${entities.buyer?.jurisdiction === 'Namibia' ? 'selected' : ''}>Namibia</option>
                                <option value="Botswana" ${entities.buyer?.jurisdiction === 'Botswana' ? 'selected' : ''}>Botswana</option>
                                <option value="Mauritius" ${entities.buyer?.jurisdiction === 'Mauritius' ? 'selected' : ''}>Mauritius</option>
                                <option value="Other" ${entities.buyer?.jurisdiction === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm text-gray-400 mb-1" for="buyer-framework">Accounting Framework</label>
                            <select
                                id="buyer-framework"
                                name="buyer.accountingFramework"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="IFRS" ${entities.buyer?.accountingFramework === 'IFRS' ? 'selected' : ''}>IFRS</option>
                                <option value="GRAP" ${entities.buyer?.accountingFramework === 'GRAP' ? 'selected' : ''}>GRAP</option>
                                <option value="IFRS-SME" ${entities.buyer?.accountingFramework === 'IFRS-SME' ? 'selected' : ''}>IFRS for SMEs</option>
                            </select>
                        </div>

                        <div class="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="buyer-taxResident"
                                name="buyer.taxResident"
                                ${entities.buyer?.taxResident !== false ? 'checked' : ''}
                                class="w-4 h-4 rounded bg-gray-700 border-gray-600 text-green-600 focus:ring-green-500"
                            >
                            <label class="text-sm text-gray-400" for="buyer-taxResident">SA Tax Resident</label>
                        </div>
                    </div>
                </div>

                <!-- Relationship Settings -->
                <div class="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
                    <h4 class="text-md font-semibold text-purple-300 mb-4 flex items-center gap-2">
                        <span>🔗</span> Relationship
                    </h4>

                    <div class="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="relationship-relatedParties"
                            name="relationship.relatedParties"
                            ${entities.relationship?.relatedParties === true ? 'checked' : ''}
                            class="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                        >
                        <label class="text-sm text-gray-400" for="relationship-relatedParties">Mutual Ownership (Related Parties)</label>
                    </div>

                    <p class="mt-3 text-xs text-gray-500">
                        Enable this if both entities share common ownership. This affects transfer pricing considerations and disclosure requirements.
                    </p>
                </div>

                <!-- Tax Parameters -->
                <div class="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                    <h4 class="text-md font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                        <span>💰</span> Tax Parameters (South Africa)
                    </h4>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-1" for="tax-corporateRate">Corporate Tax Rate (%)</label>
                            <input
                                type="number"
                                id="tax-corporateRate"
                                name="taxParams.corporateTaxRate"
                                value="${(taxParams.corporateTaxRate || 0.27) * 100}"
                                min="0"
                                max="50"
                                step="0.5"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                            >
                        </div>

                        <div>
                            <label class="block text-sm text-gray-400 mb-1" for="tax-section11ePC">Section 11(e) PC (years)</label>
                            <input
                                type="number"
                                id="tax-section11ePC"
                                name="taxParams.section11ePC"
                                value="${taxParams.section11ePC || 2}"
                                min="1"
                                max="10"
                                step="1"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                            >
                        </div>

                        <div>
                            <label class="block text-sm text-gray-400 mb-1" for="tax-section11eMainframe">Section 11(e) Mainframe (years)</label>
                            <input
                                type="number"
                                id="tax-section11eMainframe"
                                name="taxParams.section11eMainframe"
                                value="${taxParams.section11eMainframe || 5}"
                                min="1"
                                max="10"
                                step="1"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                            >
                        </div>

                        <div>
                            <label class="block text-sm text-gray-400 mb-1" for="tax-cgtInclusion">CGT Inclusion Rate (%)</label>
                            <input
                                type="number"
                                id="tax-cgtInclusion"
                                name="taxParams.cgtInclusionRate"
                                value="${(taxParams.cgtInclusionRate || 0.80) * 100}"
                                min="0"
                                max="100"
                                step="1"
                                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                            >
                        </div>
                    </div>

                    <p class="mt-3 text-xs text-gray-500">
                        Default values reflect current South African tax legislation. Adjust for specific scenarios.
                    </p>
                </div>

                <!-- Reset Button -->
                <div class="flex justify-end">
                    <button
                        id="resetEntityConfigBtn"
                        class="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 border border-gray-600 rounded-md hover:border-gray-500 transition-colors"
                    >
                        Reset to Defaults
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ========== EVENT HANDLERS ==========

/**
 * Remove event listeners from container to prevent accumulation
 */
function removeEventListeners() {
    if (!currentContainer) return;

    if (boundChangeHandler) {
        currentContainer.removeEventListener('change', boundChangeHandler);
        boundChangeHandler = null;
    }
    if (boundInputHandler) {
        currentContainer.removeEventListener('input', boundInputHandler);
        boundInputHandler = null;
    }
    if (boundToggleHandler) {
        const toggleBtn = currentContainer.querySelector('#entityConfigToggle');
        if (toggleBtn) {
            toggleBtn.removeEventListener('click', boundToggleHandler);
        }
        boundToggleHandler = null;
    }
    if (boundResetHandler) {
        const resetBtn = currentContainer.querySelector('#resetEntityConfigBtn');
        if (resetBtn) {
            resetBtn.removeEventListener('click', boundResetHandler);
        }
        boundResetHandler = null;
    }
}

function setupEventListeners(container) {
    // Remove any existing listeners first to prevent accumulation
    removeEventListeners();

    // Store reference to current container
    currentContainer = container;

    // Toggle collapse/expand
    const toggleBtn = container.querySelector('#entityConfigToggle');
    if (toggleBtn) {
        boundToggleHandler = () => {
            isExpanded = !isExpanded;
            const content = container.querySelector('#entityConfigContent');
            const chevron = container.querySelector('#entityConfigChevron');

            if (content) {
                content.classList.toggle('hidden', !isExpanded);
            }
            if (chevron) {
                chevron.classList.toggle('rotate-180', isExpanded);
            }
            toggleBtn.setAttribute('aria-expanded', isExpanded);
        };
        toggleBtn.addEventListener('click', boundToggleHandler);
    }

    // Handle input changes
    boundChangeHandler = handleInputChange;
    boundInputHandler = debounce(handleInputChange, 300);
    container.addEventListener('change', boundChangeHandler);
    container.addEventListener('input', boundInputHandler);

    // Reset button
    const resetBtn = container.querySelector('#resetEntityConfigBtn');
    if (resetBtn) {
        boundResetHandler = handleReset;
        resetBtn.addEventListener('click', boundResetHandler);
    }
}

function handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    if (!name) return;

    const value = target.type === 'checkbox' ? target.checked :
                  target.type === 'number' ? parseFloat(target.value) : target.value;

    // Parse the name to determine which part of state to update
    const parts = name.split('.');

    if (parts[0] === 'developer' || parts[0] === 'buyer' || parts[0] === 'relationship') {
        // Entity config update
        const entityType = parts[0];
        const field = parts[1];

        updateEntityConfig(entityType, { [field]: value });
    } else if (parts[0] === 'taxParams') {
        // Tax params update
        const field = parts[1];
        let processedValue = value;

        // Convert percentages to decimals for rates
        if (field === 'corporateTaxRate' || field === 'cgtInclusionRate') {
            processedValue = value / 100;
        }

        updateTaxParams({ [field]: processedValue });
    }
}

function handleReset() {
    // Reset all entity config to defaults
    updateEntityConfig('developer', DEFAULT_ENTITY_CONFIG.developer);
    updateEntityConfig('buyer', DEFAULT_ENTITY_CONFIG.buyer);
    updateEntityConfig('relationship', DEFAULT_ENTITY_CONFIG.relationship);
    updateTaxParams(DEFAULT_TAX_PARAMS);

    // Re-render the panel
    const container = document.querySelector('.entity-config-panel')?.parentElement;
    if (container) {
        renderEntityConfigPanel(container);
        setupEventListeners(container);
    }
}

// ========== UTILITY FUNCTIONS ==========

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== EXPORTS ==========

export default {
    initEntityConfig
};
