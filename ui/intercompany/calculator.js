// ========== TRANSACTION STRUCTURING CALCULATOR UI ==========
// Main UI component for the Software Transaction Structuring Tool.
// Helps software companies analyze different transaction models to maximize value
// for both parties (your company and client) on any project or product.
// Integrates model selection, variant selection, input forms, and results display.
// Includes Structure Selector wizard for guided model selection.

import {
    getState, subscribe, selectIntercompanyModel, selectVariant, setIntercompanyResults, setCalculating,
    initializeComparisons, saveComparison, getComparisons, setSaveModalOpen, setComparisonViewOpen
} from '../../state/app-state.js';
import { getModelMetadata, getModelVariants, getVariantInputs, calculateIntercompany, DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from '../../models/intercompany/registry.js';
import { initPerspectiveToggle } from './perspective-toggle.js';
import { renderIntercompanyResults } from './results-display.js';
import { initEntityConfig } from './entity-config.js';
import { initStructureSelector } from './structure-selector.js';
import { initPartySelector, partySelectorStyles } from './party-selector.js';
import { initOptionsOverview, destroyOptionsOverview, optionsOverviewStyles } from './options-overview.js';
import { initComplianceAnalyzer, destroyComplianceAnalyzer } from './compliance-analyzer.js';
import { initAdvancedVisualizations, destroyAdvancedVisualizations } from './advanced-visualizations.js';
import { initRangeInputControls, renderRangeInputField, setupRangeSliders, gatherRangeValues, isRangeModeActive, getRangeInputState, getRangeInputStyles } from './range-input.js';
import { initSensitivityVisualizations, updateSensitivityData, destroySensitivityVisualizations } from './sensitivity-visualizations.js';
import { initProjectionVisualizations, updateProjectionData, destroyProjectionVisualizations } from './projection-visualizations.js';
import { createInputRanges, calculateScenarios, calculateInputSensitivity, calculateBreakEven } from '../../models/intercompany/sensitivity-analysis.js';
import { formatCurrency, formatPercentage, showToast } from '../../utils/index.js';

// ========== STATE ==========

// localStorage keys for user preferences
const STORAGE_KEY_SELECTION_MODE = 'model-pear-selection-mode';
const VALID_SELECTION_MODES = ['overview', 'wizard', 'direct'];

/**
 * Load selection mode preference from localStorage
 * Returns 'overview' as default if not set or invalid
 */
function loadSelectionModePreference() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_SELECTION_MODE);
        if (saved && VALID_SELECTION_MODES.includes(saved)) {
            return saved;
        }
    } catch (e) {
        console.warn('Failed to load selection mode preference:', e);
    }
    return 'overview';  // Default
}

/**
 * Save selection mode preference to localStorage
 */
function saveSelectionModePreference(mode) {
    try {
        if (VALID_SELECTION_MODES.includes(mode)) {
            localStorage.setItem(STORAGE_KEY_SELECTION_MODE, mode);
        }
    } catch (e) {
        console.warn('Failed to save selection mode preference:', e);
    }
}

let unsubscribers = [];
let selectionMode = loadSelectionModePreference();  // Load from localStorage or default to 'overview'
let activeMainTab = 'calculator';  // 'calculator' | 'compliance' | 'visualizations' | 'sensitivity' | 'projections'
let sensitivityData = null;  // Cached sensitivity analysis results
let lastInputRanges = null;  // Cached input ranges for sensitivity analysis
let projectionData = null;   // Cached projection data

// Store bound event handlers for cleanup
let boundClickHandler = null;
let boundCalcClickHandler = null;
let boundSensitivityClickHandler = null;
let currentContainer = null;

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
 * Cleanup subscriptions and modules
 */
export function destroyIntercompanyCalculator() {
    unsubscribers.forEach(fn => fn());
    unsubscribers = [];

    // Remove event listeners
    removeEventListeners();

    // Cleanup options overview
    const overviewSection = document.querySelector('#optionsOverviewSection');
    if (overviewSection) {
        destroyOptionsOverview(overviewSection);
    }

    // Cleanup compliance, visualizations, sensitivity, and projections modules
    destroyComplianceAnalyzer();
    destroyAdvancedVisualizations();
    destroySensitivityVisualizations();
    destroyProjectionVisualizations();

    // Reset local state
    sensitivityData = null;
    lastInputRanges = null;
    projectionData = null;
    currentContainer = null;
}

/**
 * Remove event listeners from container to prevent accumulation
 */
function removeEventListeners() {
    if (!currentContainer) return;

    if (boundClickHandler) {
        currentContainer.removeEventListener('click', boundClickHandler);
        boundClickHandler = null;
    }
    if (boundCalcClickHandler) {
        const calcBtn = currentContainer.querySelector('#calculateIntercompanyBtn');
        if (calcBtn) {
            calcBtn.removeEventListener('click', boundCalcClickHandler);
        }
        boundCalcClickHandler = null;
    }
    if (boundSensitivityClickHandler) {
        const sensitivityBtn = currentContainer.querySelector('#runSensitivityBtn');
        if (sensitivityBtn) {
            sensitivityBtn.removeEventListener('click', boundSensitivityClickHandler);
        }
        boundSensitivityClickHandler = null;
    }
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
            <!-- Main Tab Navigation -->
            <div class="bg-gray-800 shadow-sm rounded-lg p-2 border border-gray-700 mb-6">
                <div class="flex flex-wrap gap-2">
                    <button
                        class="main-tab-btn flex-1 min-w-[120px] px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                               ${activeMainTab === 'calculator' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}"
                        data-main-tab="calculator"
                        title="Configure and calculate inter-company transactions"
                    >
                        <span class="mr-1">🧮</span> Calculator
                        <span class="help-icon cursor-help" data-tooltip="tab-calculator">i</span>
                    </button>
                    <button
                        class="main-tab-btn flex-1 min-w-[120px] px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                               ${activeMainTab === 'compliance' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}"
                        data-main-tab="compliance"
                        title="Transfer pricing compliance and SARS risk analysis"
                    >
                        <span class="mr-1">✓</span> Compliance
                        <span class="help-icon cursor-help" data-tooltip="tab-compliance">i</span>
                    </button>
                    <button
                        class="main-tab-btn flex-1 min-w-[120px] px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                               ${activeMainTab === 'visualizations' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}"
                        data-main-tab="visualizations"
                        title="Charts and visual analysis of results"
                    >
                        <span class="mr-1">📊</span> Visualizations
                        <span class="help-icon cursor-help" data-tooltip="tab-visualizations">i</span>
                    </button>
                    <button
                        class="main-tab-btn flex-1 min-w-[120px] px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                               ${activeMainTab === 'sensitivity' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}"
                        data-main-tab="sensitivity"
                        title="What-if analysis and scenario comparison"
                    >
                        <span class="mr-1">📈</span> Sensitivity
                        <span class="help-icon cursor-help" data-tooltip="tab-sensitivity">i</span>
                    </button>
                    <button
                        class="main-tab-btn flex-1 min-w-[120px] px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                               ${activeMainTab === 'projections' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}"
                        data-main-tab="projections"
                        title="Multi-year projections and growth scenarios"
                    >
                        <span class="mr-1">🚀</span> Projections
                        <span class="help-icon cursor-help" data-tooltip="tab-projections">i</span>
                    </button>
                </div>
            </div>

            <!-- Calculator Tab Content -->
            <div id="calculatorTabContent" class="${activeMainTab === 'calculator' ? '' : 'hidden'}">
                <!-- Party Relationship Selector (Prominent) -->
                <div id="partySelectorSection" class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                    <!-- Party selector will be populated here -->
                </div>

                <!-- Entity Configuration (Collapsible) -->
                <div id="entityConfigSection" class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                    <!-- Entity config will be populated here -->
                </div>

                <!-- Selection Mode Toggle -->
            <div class="bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-700 mb-6">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">🧭</span>
                        <div>
                            <h3 class="text-sm font-medium text-gray-200">Model Selection Mode</h3>
                            <p class="text-xs text-gray-400">Choose how you want to select a transaction model</p>
                        </div>
                    </div>
                    <div class="flex gap-2 bg-gray-700 p-1 rounded-lg">
                        <button
                            id="modeOverviewBtn"
                            class="selection-mode-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectionMode === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}"
                            data-mode="overview"
                            title="See all models at a glance"
                        >
                            <span class="mr-1">📊</span> Overview
                        </button>
                        <button
                            id="modeWizardBtn"
                            class="selection-mode-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectionMode === 'wizard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}"
                            data-mode="wizard"
                            title="Guided questions to recommend the best model"
                        >
                            <span class="mr-1">✨</span> Wizard
                            <span class="help-icon cursor-help" data-tooltip="wizard-mode">i</span>
                        </button>
                        <button
                            id="modeDirectBtn"
                            class="selection-mode-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectionMode === 'direct' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}"
                            data-mode="direct"
                            title="Select model and variant directly"
                        >
                            <span class="mr-1">📋</span> Direct
                            <span class="help-icon cursor-help" data-tooltip="direct-mode">i</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Options Overview (shown in overview mode) -->
            <div id="optionsOverviewSection" class="${selectionMode === 'overview' ? '' : 'hidden'} bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                <!-- Options overview will be populated here -->
            </div>

            <!-- Structure Selector Wizard (shown in wizard mode) -->
            <div id="structureSelectorSection" class="${selectionMode === 'wizard' ? '' : 'hidden'} bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                <!-- Wizard will be populated here -->
            </div>

            <!-- Model Selection (shown in direct mode or after model selected from overview/wizard) -->
            <div id="modelSelectionSection" class="${(selectionMode === 'direct' || state.intercompany.selectedModel) && selectionMode !== 'overview' ? '' : 'hidden'} bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                <h2 class="text-xl font-semibold text-gray-100 mb-3">Select Transaction Model</h2>
                <p class="text-sm text-gray-400 mb-4">Choose how to structure the transaction for this project</p>

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

                <!-- Range Input Controls -->
                <div id="rangeInputControls" class="mb-6">
                    <!-- Range controls will be populated dynamically -->
                </div>

                <form id="intercompanyInputForm" class="space-y-6">
                    <!-- Inputs will be populated dynamically -->
                </form>

                <div class="mt-6 flex gap-3">
                    <button id="calculateIntercompanyBtn" class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold">
                        <span id="calcBtnText">Calculate Transaction</span>
                        <span id="calcBtnLoader" class="hidden">
                            <svg class="animate-spin inline-block h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                    </button>
                    <button id="runSensitivityBtn" class="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-semibold hidden" title="Run Sensitivity Analysis">
                        <span>📈</span> Sensitivity
                    </button>
                </div>
            </div>

            <!-- Results Section -->
            <div id="resultsSection" class="hidden">
                <!-- Perspective Toggle -->
                <div id="perspectiveToggleContainer" class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700 mb-6">
                    <!-- Perspective toggle will be rendered here -->
                </div>

                <!-- Save Actions Bar -->
                <div id="saveActionsBar" class="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
                    <div class="flex items-center gap-4">
                        <button id="saveAsOptionBtn" class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                            <span>💾</span> Save as Option
                        </button>
                        <span id="savedOptionsCount" class="text-sm text-gray-400"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="viewSavedOptionsBtn" class="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-sm hidden">
                            <span>📋</span> View Saved (<span id="savedCount">0</span>)
                        </button>
                        <button id="compareOptionsBtn" class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm hidden">
                            <span>⚖️</span> Compare
                        </button>
                    </div>
                </div>

                <!-- Results Display -->
                <div id="intercompanyResults" class="bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700">
                    <!-- Results will be rendered here -->
                </div>

                <!-- Save Modal -->
                <div id="saveOptionModal" class="hidden fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
                        <div class="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 class="text-lg font-semibold text-gray-200">💾 Save as Option</h3>
                            <button id="closeSaveModal" class="text-gray-400 hover:text-gray-200 text-2xl leading-none">&times;</button>
                        </div>
                        <div class="p-4">
                            <div class="mb-4">
                                <label for="optionName" class="block text-sm font-medium text-gray-300 mb-2">Option Name *</label>
                                <input type="text" id="optionName" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g., License Model - Low Royalty">
                            </div>
                            <div class="mb-4">
                                <label for="optionNotes" class="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
                                <textarea id="optionNotes" rows="3" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Add any notes about this option..."></textarea>
                            </div>
                            <div id="saveModalInfo" class="text-sm text-gray-400 mb-4 p-3 bg-gray-700/50 rounded">
                                <p><strong>Model:</strong> <span id="modalModelName">-</span></p>
                                <p><strong>Variant:</strong> <span id="modalVariantName">-</span></p>
                            </div>
                        </div>
                        <div class="flex justify-end gap-3 p-4 border-t border-gray-700">
                            <button id="cancelSaveBtn" class="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">Cancel</button>
                            <button id="confirmSaveBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">Save Option</button>
                        </div>
                    </div>
                </div>
            </div>
            </div><!-- End Calculator Tab Content -->

            <!-- Compliance Tab Content -->
            <div id="complianceTabContent" class="${activeMainTab === 'compliance' ? '' : 'hidden'}">
                <div id="complianceSection">
                    <!-- Compliance analyzer will be populated here -->
                </div>
            </div>

            <!-- Visualizations Tab Content -->
            <div id="visualizationsTabContent" class="${activeMainTab === 'visualizations' ? '' : 'hidden'}">
                <div id="visualizationsSection">
                    <!-- Advanced visualizations will be populated here -->
                </div>
            </div>

            <!-- Sensitivity Tab Content -->
            <div id="sensitivityTabContent" class="${activeMainTab === 'sensitivity' ? '' : 'hidden'}">
                <div id="sensitivitySection">
                    <!-- Sensitivity visualizations will be populated here -->
                </div>
            </div>

            <!-- Projections Tab Content -->
            <div id="projectionsTabContent" class="${activeMainTab === 'projections' ? '' : 'hidden'}">
                <div id="projectionsSection">
                    <!-- Projection visualizations will be populated here -->
                </div>
            </div>
        </div>

        <!-- Range Input Styles -->
        <style>${getRangeInputStyles()}</style>
        <!-- Party Selector Styles -->
        <style>${partySelectorStyles}</style>
        <!-- Options Overview Styles -->
        <style>${optionsOverviewStyles}</style>
    `;

    // Add event listeners
    setupEventListeners(container);

    // Initialize party relationship selector
    const partySelectorSection = container.querySelector('#partySelectorSection');
    if (partySelectorSection) {
        initPartySelector(partySelectorSection);
    }

    // Initialize entity configuration panel
    const entityConfigSection = container.querySelector('#entityConfigSection');
    if (entityConfigSection) {
        initEntityConfig(entityConfigSection);
    }

    // Initialize options overview if in overview mode
    if (selectionMode === 'overview') {
        const overviewSection = container.querySelector('#optionsOverviewSection');
        if (overviewSection) {
            initOptionsOverview(overviewSection, {
                onModelSelect: handleOverviewModelSelected,
                onWizardClick: handleSwitchToWizard
            });
        }
    }

    // Initialize structure selector wizard if in wizard mode
    if (selectionMode === 'wizard') {
        const wizardSection = container.querySelector('#structureSelectorSection');
        if (wizardSection) {
            initStructureSelector(wizardSection, handleWizardModelSelected);
        }
    }

    // Initialize compliance analyzer if on that tab
    if (activeMainTab === 'compliance') {
        const complianceSection = container.querySelector('#complianceSection');
        if (complianceSection) {
            initComplianceAnalyzer(complianceSection, {
                calculationResults: state.intercompany?.results
            });
        }
    }

    // Initialize advanced visualizations if on that tab
    if (activeMainTab === 'visualizations') {
        const vizSection = container.querySelector('#visualizationsSection');
        if (vizSection) {
            initAdvancedVisualizations(vizSection, {
                calculationResults: state.intercompany?.results
            });
        }
    }

    // Initialize sensitivity visualizations if on that tab
    if (activeMainTab === 'sensitivity') {
        const sensitivitySection = container.querySelector('#sensitivitySection');
        if (sensitivitySection) {
            initSensitivityVisualizations(sensitivitySection, {
                sensitivityData: sensitivityData,
                modelId: state.intercompany?.selectedModel,
                variantId: state.intercompany?.selectedVariant,
                ranges: lastInputRanges,
                entityConfig: state.entities,
                taxParams: state.taxParams
            });
        }
    }

    // Initialize projection visualizations if on that tab
    if (activeMainTab === 'projections') {
        const projectionsSection = container.querySelector('#projectionsSection');
        if (projectionsSection) {
            initProjectionVisualizations(projectionsSection, {
                calculationResults: state.intercompany?.results,
                projectionParams: projectionData?.params
            });
        }
    }

    // Initialize saved options UI (comparisons)
    initSavedOptionsUI(container);
}

/**
 * Handle model selection from options overview
 */
function handleOverviewModelSelected(modelId) {
    if (!modelId) return;

    const container = document.getElementById('intercompanyCalculator');
    if (!container) return;

    // Select the model in state
    selectIntercompanyModel(modelId);

    // Switch to direct mode to show model details
    selectionMode = 'direct';
    saveSelectionModePreference('direct');

    // Re-render to show model selection section
    renderCalculatorUI(container);

    // Show variant section immediately since model is selected
    const variantSection = container.querySelector('#variantSection');
    const variantSelector = container.querySelector('#variantSelector');

    if (variantSection && variantSelector) {
        variantSelector.innerHTML = renderVariantButtons(modelId);
        variantSection.classList.remove('hidden');
    }

    // Update model button styles to show selection
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

/**
 * Handle switching to wizard mode from overview
 */
function handleSwitchToWizard() {
    selectionMode = 'wizard';
    saveSelectionModePreference('wizard');
    const container = document.getElementById('intercompanyCalculator');
    if (container) {
        renderCalculatorUI(container);
    }
}

/**
 * Handle model selection from wizard
 */
function handleWizardModelSelected(modelId, variantId) {
    if (!modelId) {
        // User skipped wizard, switch to direct mode
        selectionMode = 'direct';
        saveSelectionModePreference('direct');
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
                    ${input.hint ? `aria-describedby="${inputId}-hint"` : ''}
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
                        ${input.hint ? `aria-describedby="${inputId}-hint"` : ''}
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
                    ${input.hint ? `aria-describedby="${inputId}-hint"` : ''}
                >
            `;
    }

    return `
        <div class="input-field">
            <label for="${inputId}" class="block text-sm text-gray-400 mb-1">
                <span class="flex items-center gap-2">
                    <span>${input.label}</span>
                    ${input.hint ? `
                        <button type="button" class="intercompany-input-help text-gray-500 hover:text-blue-400 transition-colors" data-input-name="${input.name}" data-input-hint="${encodeURIComponent(input.hint)}" data-input-label="${encodeURIComponent(input.label)}" title="Click for more information" aria-label="Help for ${input.label}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </button>
                    ` : ''}
                </span>
            </label>
            ${inputHtml}
            ${input.hint ? `<p id="${inputId}-hint" class="text-xs text-gray-500 mt-1 flex items-start gap-1"><span class="text-blue-400">💡</span> ${input.hint}</p>` : ''}
        </div>
    `;
}

// ========== EVENT HANDLERS ==========

function setupEventListeners(container) {
    // Remove any existing listeners first to prevent accumulation
    removeEventListeners();

    // Store reference to current container
    currentContainer = container;

    // Create bound handler for click events (event delegation)
    boundClickHandler = (e) => {
        const mainTabBtn = e.target.closest('.main-tab-btn');
        if (mainTabBtn) {
            const newTab = mainTabBtn.dataset.mainTab;
            if (newTab !== activeMainTab) {
                // Cleanup previous tab
                if (activeMainTab === 'compliance') {
                    destroyComplianceAnalyzer();
                } else if (activeMainTab === 'visualizations') {
                    destroyAdvancedVisualizations();
                } else if (activeMainTab === 'sensitivity') {
                    destroySensitivityVisualizations();
                } else if (activeMainTab === 'projections') {
                    destroyProjectionVisualizations();
                }

                activeMainTab = newTab;
                renderCalculatorUI(container);
            }
            return;
        }

        // Selection mode toggle
        const modeBtn = e.target.closest('.selection-mode-btn');
        if (modeBtn) {
            const newMode = modeBtn.dataset.mode;
            if (newMode !== selectionMode) {
                selectionMode = newMode;
                saveSelectionModePreference(newMode);
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

        // Save as Option button
        if (e.target.closest('#saveAsOptionBtn')) {
            handleOpenSaveModal(container);
            return;
        }

        // View Saved Options button
        if (e.target.closest('#viewSavedOptionsBtn')) {
            handleViewSavedOptions(container);
            return;
        }

        // Compare Options button
        if (e.target.closest('#compareOptionsBtn')) {
            handleCompareOptions(container);
            return;
        }

        // Save modal - close button or backdrop click
        if (e.target.closest('#closeSaveModal') || e.target.id === 'saveOptionModal') {
            handleCloseSaveModal(container);
            return;
        }

        // Save modal - cancel button
        if (e.target.closest('#cancelSaveBtn')) {
            handleCloseSaveModal(container);
            return;
        }

        // Save modal - confirm save button
        if (e.target.closest('#confirmSaveBtn')) {
            handleConfirmSave(container);
            return;
        }
    };

    // Add the main click handler
    container.addEventListener('click', boundClickHandler);

    // Calculate button
    const calcBtn = container.querySelector('#calculateIntercompanyBtn');
    if (calcBtn) {
        boundCalcClickHandler = () => handleCalculate(container);
        calcBtn.addEventListener('click', boundCalcClickHandler);
    }

    // Sensitivity button
    const sensitivityBtn = container.querySelector('#runSensitivityBtn');
    if (sensitivityBtn) {
        boundSensitivityClickHandler = () => handleRunSensitivity(container);
        sensitivityBtn.addEventListener('click', boundSensitivityClickHandler);
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

        // Initialize range input controls
        const rangeControlsContainer = container.querySelector('#rangeInputControls');
        if (rangeControlsContainer) {
            initRangeInputControls(rangeControlsContainer, {
                onToggle: (enabled) => {
                    // Show/hide sensitivity button
                    const sensitivityBtn = container.querySelector('#runSensitivityBtn');
                    if (sensitivityBtn) {
                        sensitivityBtn.classList.toggle('hidden', !enabled);
                    }
                    // Re-render form if range mode changes
                    if (inputForm) {
                        inputForm.innerHTML = renderInputForm(modelId, variantId);
                        setupRangeSliders(inputForm);
                    }
                },
                onModeChange: (mode) => {
                    // Re-render form with range inputs
                    if (inputForm) {
                        inputForm.innerHTML = renderInputForm(modelId, variantId);
                        setupRangeSliders(inputForm);
                    }
                }
            });
        }

        // Set up range sliders if in range mode
        setupRangeSliders(inputForm);
    }

    // Hide results section and reset analysis data
    container.querySelector('#resultsSection')?.classList.add('hidden');
    sensitivityData = null;
    lastInputRanges = null;
    projectionData = null;

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

            // If range mode is active, also run sensitivity analysis
            if (isRangeModeActive()) {
                const inputForm = container.querySelector('#intercompanyInputForm');
                lastInputRanges = inputForm ? gatherRangeValues(inputForm) : createInputRanges(inputs);

                // If no explicit ranges gathered, create from inputs
                if (Object.keys(lastInputRanges).length === 0) {
                    lastInputRanges = createInputRanges(inputs);
                }

                // Run sensitivity calculations
                try {
                    sensitivityData = {
                        scenarios: calculateScenarios(selectedModel, selectedVariant, lastInputRanges, state.entities, state.taxParams),
                        sensitivity: calculateInputSensitivity(selectedModel, selectedVariant, inputs, state.entities, state.taxParams),
                        breakEven: calculateBreakEven(selectedModel, selectedVariant, inputs, state.entities, state.taxParams),
                        monteCarlo: null  // Will be run on-demand
                    };
                    showToast('Calculation and sensitivity analysis completed!', 'success');
                } catch (sensitivityError) {
                    console.warn('Sensitivity analysis error:', sensitivityError);
                    sensitivityData = null;
                    showToast('Calculation completed (sensitivity analysis had issues)', 'warning');
                }
            } else {
                showToast('Calculation completed successfully!', 'success');
            }

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

/**
 * Handle running sensitivity analysis separately
 */
function handleRunSensitivity(container) {
    const state = getState();
    const { selectedModel, selectedVariant } = state.intercompany;

    if (!selectedModel || !selectedVariant) {
        showToast('Please select a model and variant first', 'warning');
        return;
    }

    const inputs = gatherInputValues(container, selectedModel);
    const inputForm = container.querySelector('#intercompanyInputForm');
    lastInputRanges = inputForm ? gatherRangeValues(inputForm) : createInputRanges(inputs);

    // If no explicit ranges, create from inputs
    if (Object.keys(lastInputRanges).length === 0) {
        lastInputRanges = createInputRanges(inputs);
    }

    try {
        sensitivityData = {
            scenarios: calculateScenarios(selectedModel, selectedVariant, lastInputRanges, state.entities, state.taxParams),
            sensitivity: calculateInputSensitivity(selectedModel, selectedVariant, inputs, state.entities, state.taxParams),
            breakEven: calculateBreakEven(selectedModel, selectedVariant, inputs, state.entities, state.taxParams),
            monteCarlo: null
        };

        // Switch to sensitivity tab
        activeMainTab = 'sensitivity';
        renderCalculatorUI(container);
        showToast('Sensitivity analysis completed!', 'success');
    } catch (error) {
        console.error('Sensitivity analysis error:', error);
        showToast('Sensitivity analysis error: ' + error.message, 'error');
    }
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

// ========== SAVE OPTION HANDLERS ==========

// Store reference to current inputs for saving
let currentInputsForSave = {};

/**
 * Open the save modal and populate with current model/variant info
 */
function handleOpenSaveModal(container) {
    const state = getState();
    const { selectedModel, selectedVariant, results } = state.intercompany;

    if (!results) {
        showToast('Please run a calculation first before saving', 'warning');
        return;
    }

    // Get model and variant metadata
    const modelMeta = getModelMetadata(selectedModel);
    const variants = getModelVariants(selectedModel);
    const variantMeta = variants?.find(v => v.id === selectedVariant);

    // Update modal info
    const modalModelName = container.querySelector('#modalModelName');
    const modalVariantName = container.querySelector('#modalVariantName');
    if (modalModelName) modalModelName.textContent = modelMeta?.name || selectedModel;
    if (modalVariantName) modalVariantName.textContent = variantMeta ? `${variantMeta.id} - ${variantMeta.name}` : selectedVariant;

    // Store current inputs
    currentInputsForSave = gatherInputValues(container, selectedModel);

    // Generate a default name suggestion
    const existingCount = getComparisons().length;
    const defaultName = `${modelMeta?.shortName || modelMeta?.name || 'Option'} - ${variantMeta?.name || selectedVariant}`;
    const optionNameInput = container.querySelector('#optionName');
    if (optionNameInput) {
        optionNameInput.value = defaultName;
        optionNameInput.select();
    }

    // Clear notes
    const optionNotesInput = container.querySelector('#optionNotes');
    if (optionNotesInput) optionNotesInput.value = '';

    // Show modal
    const modal = container.querySelector('#saveOptionModal');
    if (modal) {
        modal.classList.remove('hidden');
        setSaveModalOpen(true);
    }
}

/**
 * Close the save modal
 */
function handleCloseSaveModal(container) {
    const modal = container.querySelector('#saveOptionModal');
    if (modal) {
        modal.classList.add('hidden');
        setSaveModalOpen(false);
    }
}

/**
 * Confirm and save the current calculation as an option
 */
function handleConfirmSave(container) {
    const optionNameInput = container.querySelector('#optionName');
    const optionNotesInput = container.querySelector('#optionNotes');

    const name = optionNameInput?.value.trim();
    const notes = optionNotesInput?.value.trim() || '';

    if (!name) {
        showToast('Please enter a name for this option', 'warning');
        optionNameInput?.focus();
        return;
    }

    // Save the comparison
    const saved = saveComparison(name, notes, currentInputsForSave);

    if (saved) {
        showToast(`Option "${name}" saved successfully!`, 'success');
        handleCloseSaveModal(container);
        updateSavedOptionsUI(container);
    } else {
        showToast('Failed to save option. Please try again.', 'error');
    }
}

/**
 * Open the saved options panel (placeholder for future comparison-manager)
 */
function handleViewSavedOptions(container) {
    // For now, show a toast - full implementation comes in comparison-manager.js
    const comparisons = getComparisons();
    showToast(`You have ${comparisons.length} saved option${comparisons.length !== 1 ? 's' : ''}. Full comparison view coming soon!`, 'info');
    setComparisonViewOpen(true);
}

/**
 * Open the comparison view (placeholder for future comparison-view)
 */
function handleCompareOptions(container) {
    const comparisons = getComparisons();
    if (comparisons.length < 2) {
        showToast('Save at least 2 options to compare them side-by-side', 'info');
        return;
    }
    // Placeholder - full implementation comes in comparison-view.js
    showToast(`Compare mode with ${comparisons.length} options coming soon!`, 'info');
    setComparisonViewOpen(true);
}

/**
 * Update the saved options count and button visibility
 */
function updateSavedOptionsUI(container) {
    const comparisons = getComparisons();
    const count = comparisons.length;

    // Update count display
    const countSpan = container.querySelector('#savedOptionsCount');
    if (countSpan) {
        if (count > 0) {
            countSpan.textContent = `${count} saved option${count !== 1 ? 's' : ''}`;
        } else {
            countSpan.textContent = '';
        }
    }

    // Update saved count in button
    const savedCount = container.querySelector('#savedCount');
    if (savedCount) savedCount.textContent = count;

    // Show/hide buttons based on count
    const viewBtn = container.querySelector('#viewSavedOptionsBtn');
    const compareBtn = container.querySelector('#compareOptionsBtn');

    if (viewBtn) {
        if (count > 0) {
            viewBtn.classList.remove('hidden');
        } else {
            viewBtn.classList.add('hidden');
        }
    }

    if (compareBtn) {
        if (count >= 2) {
            compareBtn.classList.remove('hidden');
        } else {
            compareBtn.classList.add('hidden');
        }
    }
}

/**
 * Initialize saved options UI on load
 */
function initSavedOptionsUI(container) {
    // Initialize comparisons from localStorage
    initializeComparisons();

    // Update UI
    updateSavedOptionsUI(container);
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

    // Handle saved comparisons changes
    if (newState.savedComparisons?.length !== oldState?.savedComparisons?.length) {
        updateSavedOptionsUI(container);
    }
}

// ========== EXPORTS ==========

export default {
    initIntercompanyCalculator,
    destroyIntercompanyCalculator
};
