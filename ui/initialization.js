import { models } from '../models/index.js';
import { currentMode, selectedModels, storedInputValues, reverseCalculatorState, clientBudgetState, setCurrentMode } from '../config/constants.js';
import { LAYER_1_CATEGORIES, getCategoryDefaults } from '../framework/categories.js';
import { setSelectedDelivery, setSelectedService } from '../framework/services.js';
import { SCENARIO_TEMPLATES } from './forms.js';

// Forward declarations for functions that will be provided by app.js
let generateAdminPanel, updateClientBudgetOptions, onCategoryChangeHandler,
    onCompareMultipleToggleHandler, onDeliveryChangeHandler,
    onServiceChangeHandler, onCalculateHandler,
    generateModelCheckboxes, updateSelectedSummary, updateCalculateButton,
    onInputChange, onModelSelectionChange, updateInputForms;

export function setUIHandlers(handlers) {
    generateAdminPanel = handlers.generateAdminPanel;
    updateClientBudgetOptions = handlers.updateClientBudgetOptions;
    onCategoryChangeHandler = handlers.onCategoryChange;
    onCompareMultipleToggleHandler = handlers.onCompareMultipleToggle;
    onDeliveryChangeHandler = handlers.onDeliveryChange;
    onServiceChangeHandler = handlers.onServiceChange;
    onCalculateHandler = handlers.onCalculate;
    generateModelCheckboxes = handlers.generateModelCheckboxes;
    updateSelectedSummary = handlers.updateSelectedSummary;
    updateCalculateButton = handlers.updateCalculateButton;
    onInputChange = handlers.onInputChange;
    onModelSelectionChange = handlers.onModelSelectionChange;
    updateInputForms = handlers.updateInputForms;
}

// ========== INITIALIZATION ==========

// Global state for framework selections
export let selectedCategory = null;
export let selectedDelivery = 'cloud-saas';
export let selectedService = 'self-service';

/**
 * Set calculator mode (forward, reverse, or client-budget)
 */
export function setCalculatorMode(mode) {
    console.log('🔄 setCalculatorMode called with mode:', mode);
    setCurrentMode(mode);

    const forwardModeBtn = document.getElementById('forwardModeBtn');
    const reverseModeBtn = document.getElementById('reverseModeBtn');
    const clientBudgetModeBtn = document.getElementById('clientBudgetModeBtn');
    const adminModeBtn = document.getElementById('adminModeBtn');
    const inputFormContainer = document.getElementById('inputFormContainer');
    const reverseInputsSection = document.getElementById('reverseInputsSection');
    const clientBudgetInputsSection = document.getElementById('clientBudgetInputsSection');
    const adminPanelContainer = document.getElementById('adminPanelContainer');
    const categorySection = document.getElementById('categorySection');
    const modelSelectionSection = document.getElementById('modelSelectionSection');
    const layerTwoThreeSection = document.getElementById('layerTwoThreeSection');
    const selectedSummary = document.getElementById('selectedSummary');
    const calculateBtn = document.getElementById('calculateBtn');

    // Reset all buttons
    forwardModeBtn.classList.remove('bg-blue-600', 'text-white');
    forwardModeBtn.classList.add('bg-gray-700', 'text-gray-300');
    reverseModeBtn.classList.remove('bg-blue-600', 'text-white');
    reverseModeBtn.classList.add('bg-gray-700', 'text-gray-300');
    clientBudgetModeBtn.classList.remove('bg-blue-600', 'text-white');
    clientBudgetModeBtn.classList.add('bg-gray-700', 'text-gray-300');
    adminModeBtn.classList.remove('bg-blue-600', 'text-white');
    adminModeBtn.classList.add('bg-gray-700', 'text-gray-300');

    // Hide all input sections
    reverseInputsSection.classList.add('hidden');
    clientBudgetInputsSection.classList.add('hidden');
    inputFormContainer.classList.add('hidden');
    adminPanelContainer.classList.add('hidden');

    if (mode === 'admin') {
        // Highlight admin button
        adminModeBtn.classList.add('bg-blue-600', 'text-white');
        adminModeBtn.classList.remove('bg-gray-700', 'text-gray-300');

        // Show admin panel
        adminPanelContainer.classList.remove('hidden');

        // Hide category selection, model selection, and other sections
        categorySection.classList.add('hidden');
        modelSelectionSection.classList.add('hidden');
        layerTwoThreeSection.classList.add('hidden');
        selectedSummary.classList.add('hidden');
        calculateBtn.parentElement.classList.add('hidden');

        // Generate admin panel
        generateAdminPanel();
    } else if (mode === 'reverse') {
        // Show regular sections
        categorySection.classList.remove('hidden');
        selectedSummary.classList.remove('hidden');
        calculateBtn.parentElement.classList.remove('hidden');

        // Show model selection sections if category is selected
        if (selectedCategory) {
            modelSelectionSection.classList.remove('hidden');
            layerTwoThreeSection.classList.remove('hidden');
        }

        // Highlight reverse button
        reverseModeBtn.classList.add('bg-blue-600', 'text-white');
        reverseModeBtn.classList.remove('bg-gray-700', 'text-gray-300');

        // Show reverse inputs
        reverseInputsSection.classList.remove('hidden');

        // Update reverse calculator options if a model is selected
        updateReverseCalculatorOptions();

        // Limit to single model selection in reverse mode
        if (selectedModels.size > 1) {
            alert('Reverse calculator works with one model at a time. Please select only one model.');
        }
    } else if (mode === 'client-budget') {
        // Show regular sections
        categorySection.classList.remove('hidden');
        selectedSummary.classList.remove('hidden');
        calculateBtn.parentElement.classList.remove('hidden');

        // Show model selection sections if category is selected
        if (selectedCategory) {
            modelSelectionSection.classList.remove('hidden');
            layerTwoThreeSection.classList.remove('hidden');
        }

        // Highlight client budget button
        clientBudgetModeBtn.classList.add('bg-blue-600', 'text-white');
        clientBudgetModeBtn.classList.remove('bg-gray-700', 'text-gray-300');

        // Show client budget inputs
        clientBudgetInputsSection.classList.remove('hidden');

        // Update client budget options if models are selected
        updateClientBudgetOptions();
    } else {
        // Show regular sections
        categorySection.classList.remove('hidden');
        selectedSummary.classList.remove('hidden');
        calculateBtn.parentElement.classList.remove('hidden');

        // Show model selection sections if category is selected
        if (selectedCategory) {
            modelSelectionSection.classList.remove('hidden');
            layerTwoThreeSection.classList.remove('hidden');
        }

        // Highlight forward button
        forwardModeBtn.classList.add('bg-blue-600', 'text-white');
        forwardModeBtn.classList.remove('bg-gray-700', 'text-gray-300');

        // Show forward inputs
        inputFormContainer.classList.remove('hidden');
    }
}

/**
 * Update reverse calculator options based on selected model
 */
export function updateReverseCalculatorOptions() {
    if (currentMode !== 'reverse' || selectedModels.size === 0) return;

    const modelKey = Array.from(selectedModels)[0];
    const model = models[modelKey];

    if (!model) return;

    // Update the "solve for" dropdown
    const solveForSelect = document.getElementById('solveForVariable');
    solveForSelect.innerHTML = '<option value="">-- Select variable to solve --</option>';

    // Add all input variables as options
    model.inputs.forEach(input => {
        const option = document.createElement('option');
        option.value = input.name;
        option.textContent = input.label;
        solveForSelect.appendChild(option);
    });

    // Update constraint inputs
    const constraintInputs = document.getElementById('constraintInputs');
    constraintInputs.innerHTML = '';

    // Add event listener to solve-for dropdown to update constraints
    solveForSelect.addEventListener('change', function() {
        reverseCalculatorState.solveForVariable = this.value;
        updateConstraintInputs(modelKey);
    });
}

/**
 * Update constraint inputs based on selected solve-for variable
 */
export function updateConstraintInputs(modelKey) {
    const model = models[modelKey];
    const solveForVar = reverseCalculatorState.solveForVariable;
    const constraintInputs = document.getElementById('constraintInputs');

    constraintInputs.innerHTML = '';

    if (!solveForVar) {
        constraintInputs.innerHTML = '<p class="text-xs text-gray-500">Select a variable to solve for first</p>';
        return;
    }

    // Add inputs for all other variables
    model.inputs.forEach(input => {
        if (input.name === solveForVar) return; // Skip the variable we're solving for

        const inputDiv = document.createElement('div');
        inputDiv.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'block text-xs font-medium text-gray-300 mb-1';
        label.textContent = input.label;
        label.htmlFor = `constraint-${input.name}`;

        const inputElement = document.createElement('input');
        inputElement.type = 'number';
        inputElement.id = `constraint-${input.name}`;
        inputElement.name = input.name;
        inputElement.className = 'w-full px-2 py-1 bg-gray-600 text-gray-100 border border-gray-500 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500';
        inputElement.value = input.default || 0;
        inputElement.min = input.min !== undefined ? input.min : 0;
        if (input.max !== undefined) inputElement.max = input.max;
        if (input.step !== undefined) inputElement.step = input.step;

        const hint = document.createElement('p');
        hint.className = 'text-xs text-gray-500 mt-1';
        hint.textContent = input.hint || '';

        inputDiv.appendChild(label);
        inputDiv.appendChild(inputElement);
        inputDiv.appendChild(hint);

        constraintInputs.appendChild(inputDiv);
    });
}

/**
 * Gather constraints from reverse calculator inputs
 */
export function gatherConstraints() {
    const constraints = {};
    const constraintInputs = document.getElementById('constraintInputs');
    const inputs = constraintInputs.querySelectorAll('input');

    inputs.forEach(input => {
        constraints[input.name] = parseFloat(input.value) || 0;
    });

    return constraints;
}

/**
 * Initialize the application
 */
export function init() {
    console.log('🚀 Initializing Model Pear Calculator...');

    // Add calculator mode toggle event listeners
    const forwardModeBtn = document.getElementById('forwardModeBtn');
    const reverseModeBtn = document.getElementById('reverseModeBtn');
    const clientBudgetModeBtn = document.getElementById('clientBudgetModeBtn');
    const adminModeBtn = document.getElementById('adminModeBtn');

    forwardModeBtn.addEventListener('click', () => {
        console.log('👆 Forward mode button clicked');
        setCalculatorMode('forward');
    });
    reverseModeBtn.addEventListener('click', () => {
        console.log('👆 Reverse mode button clicked');
        setCalculatorMode('reverse');
    });
    clientBudgetModeBtn.addEventListener('click', () => {
        console.log('👆 Client budget mode button clicked');
        setCalculatorMode('client-budget');
    });
    adminModeBtn.addEventListener('click', () => {
        console.log('👆 Admin mode button clicked');
        setCalculatorMode('admin');
    });

    // Add category selector event listener
    const categorySelector = document.getElementById('categorySelector');
    categorySelector.addEventListener('change', onCategoryChange);

    // Add event listener for compare multiple models toggle
    const compareMultipleModels = document.getElementById('compareMultipleModels');
    if (compareMultipleModels) {
        compareMultipleModels.addEventListener('change', onCompareMultipleToggle);
    }

    // Add Layer 2/3 event listeners
    document.querySelectorAll('input[name="deliveryMechanism"]').forEach(radio => {
        radio.addEventListener('change', onDeliveryChange);
    });

    document.querySelectorAll('input[name="serviceModel"]').forEach(radio => {
        radio.addEventListener('change', onServiceChange);
    });

    // Add event listener to calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', onCalculateHandler);

    // Add event listener to model selection to update reverse calculator options
    document.addEventListener('modelSelectionChanged', updateReverseCalculatorOptions);

    // Initialize the default calculator mode
    console.log('🎯 Initializing default calculator mode: forward');
    setCalculatorMode('forward');
}

/**
 * Handle compare multiple models toggle
 */
export function onCompareMultipleToggle(event) {
    // When toggling between single and multiple selection modes,
    // regenerate the model selector to switch between radio and checkbox inputs
    generateModelCheckboxes();
}

/**
 * Handle category selection change
 */
export function onCategoryChange(event) {
    selectedCategory = event.target.value;
    console.log('📂 Category changed to:', selectedCategory);

    const categoryDescription = document.getElementById('categoryDescription');
    const categoryExamples = document.getElementById('categoryExamples');
    const modelSelectionSection = document.getElementById('modelSelectionSection');
    const layerTwoThreeSection = document.getElementById('layerTwoThreeSection');

    if (!selectedCategory) {
        // Hide everything if no category selected
        console.log('⚠️ No category selected, hiding model selection');
        categoryDescription.classList.add('hidden');
        categoryExamples.classList.add('hidden');
        modelSelectionSection.classList.add('hidden');
        layerTwoThreeSection.classList.add('hidden');
        selectedModels.clear();
        updateSelectedSummary();
        updateCalculateButton();
        return;
    }

    // Show category information
    const category = LAYER_1_CATEGORIES[selectedCategory];
    categoryDescription.textContent = category.description;
    categoryDescription.classList.remove('hidden');

    categoryExamples.textContent = `Examples: ${category.examples.join(', ')}`;
    categoryExamples.classList.remove('hidden');

    // Show model selection section
    console.log('✅ Showing model selection section');
    modelSelectionSection.classList.remove('hidden');
    layerTwoThreeSection.classList.remove('hidden');

    // Clear previously selected models when category changes
    selectedModels.clear();

    updateSelectedSummary();

    // Generate filtered model checkboxes
    console.log('🔧 Generating model checkboxes for category:', selectedCategory);
    generateModelCheckboxes();
    updateCalculateButton();
}

/**
 * Handle delivery mechanism change
 */
export function onDeliveryChange(event) {
    selectedDelivery = event.target.value;
}

/**
 * Handle service model change
 */
export function onServiceChange(event) {
    selectedService = event.target.value;
}

/**
 * Generate checkboxes or radio buttons for model selection - filtered by category if selected
 */
export function generateModelCheckboxes() {
    console.log('📋 generateModelCheckboxes called, selectedCategory:', selectedCategory);
    const container = document.getElementById('modelSelector');
    container.innerHTML = '';

    // Get applicable models for the selected category
    const applicableModelKeys = selectedCategory
        ? LAYER_1_CATEGORIES[selectedCategory].applicableModels
        : Object.keys(models);

    console.log('📊 Applicable models for category:', applicableModelKeys);

    // If no category selected, show a message
    if (!selectedCategory) {
        console.log('⚠️ No category selected in generateModelCheckboxes');
        container.innerHTML = '<p class="text-gray-400 text-sm">Select a software category first</p>';
        return;
    }

    // Check if multiple model comparison is enabled
    const compareMultiple = document.getElementById('compareMultipleModels')?.checked ?? false;
    const inputType = compareMultiple ? 'checkbox' : 'radio';

    // Show category-specific intro
    const category = LAYER_1_CATEGORIES[selectedCategory];
    const intro = document.createElement('div');
    intro.className = 'mb-4 p-3 bg-gray-750 rounded-md border border-gray-600';
    intro.innerHTML = `
        <div class="text-xs text-gray-400 mb-1">Applicable to <span class="text-blue-400 font-semibold">${category.name}</span>:</div>
        <div class="text-xs text-gray-500">${applicableModelKeys.length} revenue models available</div>
    `;
    container.appendChild(intro);

    // Display models that are applicable to this category
    applicableModelKeys.forEach(modelKey => {
        const model = models[modelKey];
        if (!model) return;

        const pricingContext = category.pricingContext[modelKey];

        const modelDiv = document.createElement('div');
        modelDiv.className = 'mb-3 p-3 bg-gray-700 rounded-md border border-gray-600 hover:border-blue-500 transition-colors';

        const label = document.createElement('label');
        label.className = 'flex items-start space-x-2 cursor-pointer';

        const inputElement = document.createElement('input');
        inputElement.type = inputType;
        inputElement.value = modelKey;
        inputElement.id = `model-${modelKey}`;
        inputElement.className = 'mt-1 rounded bg-gray-600 border-gray-500 text-blue-600 focus:ring-blue-500';

        // For radio buttons, add a shared name attribute
        if (inputType === 'radio') {
            inputElement.name = 'modelSelection';
        }

        // Check if this model is currently selected
        if (selectedModels.has(modelKey)) {
            inputElement.checked = true;
        }

        inputElement.addEventListener('change', onModelSelectionChange);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex-1';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'font-medium text-gray-100 text-sm mb-1';
        nameDiv.textContent = model.name;

        const contextDiv = document.createElement('div');
        contextDiv.className = 'text-xs space-y-1';

        if (pricingContext) {
            // Show category-specific pricing range
            if (pricingContext.range) {
                const rangeSpan = document.createElement('div');
                rangeSpan.className = 'text-blue-400';
                rangeSpan.textContent = `💰 ${pricingContext.range}`;
                contextDiv.appendChild(rangeSpan);
            }

            // Show examples
            if (pricingContext.examples) {
                const examplesSpan = document.createElement('div');
                examplesSpan.className = 'text-gray-500';
                const examples = Array.isArray(pricingContext.examples)
                    ? pricingContext.examples.join(', ')
                    : pricingContext.examples;
                examplesSpan.textContent = `📋 ${examples}`;
                contextDiv.appendChild(examplesSpan);
            }

            // Show additional context (churn, conversion, etc.)
            if (pricingContext.typicalChurn) {
                const churnSpan = document.createElement('div');
                churnSpan.className = 'text-gray-500';
                churnSpan.textContent = `📉 Typical churn: ${pricingContext.typicalChurn}`;
                contextDiv.appendChild(churnSpan);
            }

            if (pricingContext.conversion) {
                const conversionSpan = document.createElement('div');
                conversionSpan.className = 'text-gray-500';
                conversionSpan.textContent = `🎯 Conversion: ${pricingContext.conversion}`;
                contextDiv.appendChild(conversionSpan);
            }

            if (pricingContext.attachRate) {
                const attachSpan = document.createElement('div');
                attachSpan.className = 'text-gray-500';
                attachSpan.textContent = `📎 Attach rate: ${pricingContext.attachRate}`;
                contextDiv.appendChild(attachSpan);
            }
        }

        contentDiv.appendChild(nameDiv);
        contentDiv.appendChild(contextDiv);

        label.appendChild(inputElement);
        label.appendChild(contentDiv);
        modelDiv.appendChild(label);

        container.appendChild(modelDiv);
    });
}

/**
 * Handle model selection change
 */
export function onModelSelectionChange(event) {
    const modelKey = event.target.value;
    const isRadio = event.target.type === 'radio';

    if (isRadio) {
        // For radio buttons: clear all selections and select only this one
        if (event.target.checked) {
            selectedModels.clear();
            selectedModels.add(modelKey);
        }
    } else {
        // For checkboxes: add or remove from selection
        if (event.target.checked) {
            selectedModels.add(modelKey);
        } else {
            selectedModels.delete(modelKey);
        }
    }

    updateSelectedSummary();
    updateInputForms();
    updateCalculateButton();

    // Update client budget options if in client-budget mode
    if (currentMode === 'client-budget') {
        updateClientBudgetOptions();
    }

    // Update reverse calculator options if in reverse mode
    if (currentMode === 'reverse') {
        updateReverseCalculatorOptions();
    }
}

/**
 * Update the selected models summary
 */
export function updateSelectedSummary() {
    const summary = document.getElementById('selectedSummary');

    if (selectedModels.size === 0) {
        summary.textContent = 'No models selected';
        summary.className = 'mb-4 text-sm text-gray-400';
    } else {
        const modelNames = Array.from(selectedModels).map(key => models[key]?.name || key);
        summary.textContent = `Selected: ${modelNames.join(', ')}`;
        summary.className = 'mb-4 text-sm text-blue-400';
    }
}

/**
 * Update input forms based on selected models
 */
export function updateInputForms() {
    const tabsContainer = document.getElementById('inputFormTabs');
    const formContainer = document.getElementById('inputForm');

    if (selectedModels.size === 0) {
        tabsContainer.classList.add('hidden');
        formContainer.innerHTML = '<p class="text-gray-400 text-sm">Select models to configure inputs</p>';
        return;
    }

    // Show tabs if multiple models selected
    if (selectedModels.size > 1) {
        tabsContainer.classList.remove('hidden');
        generateInputTabs();
    } else {
        tabsContainer.classList.add('hidden');
    }

    // Generate ALL forms for ALL selected models
    generateAllForms();
}

/**
 * Generate all forms for selected models and keep them in the DOM
 */
export function generateAllForms() {
    const formContainer = document.getElementById('inputForm');
    formContainer.innerHTML = '';

    const firstModel = Array.from(selectedModels)[0];

    selectedModels.forEach(modelKey => {
        const modelFormDiv = document.createElement('div');
        modelFormDiv.id = `form-${modelKey}`;
        modelFormDiv.className = modelKey === firstModel ? '' : 'hidden';

        const model = models[modelKey];
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

            // Get category-specific defaults if available
            const categoryDefaults = getCategoryDefaults(modelKey, selectedCategory);
            let defaultValue = input.default;
            let hintText = input.hint;

            // Check if we have a stored value for this input
            if (storedInputValues.has(modelKey) && storedInputValues.get(modelKey)[input.name] !== undefined) {
                defaultValue = storedInputValues.get(modelKey)[input.name];
            } else if (categoryDefaults) {
                // Apply category-specific defaults if they exist
                // Map common input names to pricing context properties
                if (input.name === 'price' && categoryDefaults.default !== undefined) {
                    defaultValue = categoryDefaults.default;
                }
            }

            // Update hint text to show category-specific range
            if (categoryDefaults) {
                if (input.name === 'price' && categoryDefaults.range) {
                    hintText = `${categoryDefaults.range} (category-specific)`;
                } else if (input.name === 'churnRate' && categoryDefaults.typicalChurn) {
                    hintText = `Typical for this category: ${categoryDefaults.typicalChurn}`;
                } else if (input.name === 'conversionRate' && categoryDefaults.conversion) {
                    hintText = `Typical for this category: ${categoryDefaults.conversion}`;
                }
            }

            // Set minimum initial value (at least 1 for most fields)
            const minValue = input.min !== undefined ? input.min : (input.name.includes('Rate') || input.name.includes('rate') ? 0 : 1);
            if (defaultValue < minValue && !storedInputValues.has(modelKey)) {
                defaultValue = minValue;
            }

            // Show tooltip icon only for complex inputs
            const needsTooltip = hintText && (
                hintText.length > 50 ||
                hintText.includes('churn') ||
                hintText.includes('conversion') ||
                hintText.includes('rate') ||
                hintText.includes('CAC') ||
                hintText.includes('LTV') ||
                hintText.includes('multiplier') ||
                hintText.includes('percentage') ||
                hintText.includes('ratio')
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
                        value="${defaultValue}"
                        min="${input.min !== undefined ? input.min : 0}"
                        ${input.max !== undefined ? 'max="' + input.max + '"' : ''}
                        step="${input.step}"
                        data-type="${input.type}"
                        data-model="${modelKey}"
                    />
                    ${hintText ? `<small class="text-xs text-gray-500 mt-1 block">${hintText}</small>` : ''}
                </div>
            `;
        });

        modelFormDiv.innerHTML = formHTML;
        formContainer.appendChild(modelFormDiv);

        // Add input event listeners
        model.inputs.forEach(input => {
            const inputId = `${modelKey}-${input.name}`;
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                inputElement.addEventListener('input', onInputChange);
            }
        });
    });
}

/**
 * Generate tabs for input forms
 */
export function generateInputTabs() {
    const tabsContainer = document.getElementById('inputFormTabs');
    tabsContainer.innerHTML = '';

    const firstModel = Array.from(selectedModels)[0];

    selectedModels.forEach(modelKey => {
        const button = document.createElement('button');
        button.textContent = models[modelKey].name;
        button.className = modelKey === firstModel
            ? 'px-3 py-1 text-sm rounded bg-blue-600 text-white'
            : 'px-3 py-1 text-sm rounded bg-gray-700 text-gray-300 hover:bg-gray-600';
        button.dataset.model = modelKey;
        button.addEventListener('click', (e) => {
            const targetModel = e.target.dataset.model;

            // Update active tab styling
            tabsContainer.querySelectorAll('button').forEach(btn => {
                btn.className = 'px-3 py-1 text-sm rounded bg-gray-700 text-gray-300 hover:bg-gray-600';
            });
            e.target.className = 'px-3 py-1 text-sm rounded bg-blue-600 text-white';

            // Show/hide forms
            selectedModels.forEach(mk => {
                const formDiv = document.getElementById(`form-${mk}`);
                if (formDiv) {
                    if (mk === targetModel) {
                        formDiv.classList.remove('hidden');
                    } else {
                        formDiv.classList.add('hidden');
                    }
                }
            });
        });
        tabsContainer.appendChild(button);
    });
}

/**
 * Update calculate button state
 */
export function updateCalculateButton() {
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.disabled = selectedModels.size === 0;
}

