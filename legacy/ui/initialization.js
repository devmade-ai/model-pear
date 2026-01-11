import { models } from '../models/index.js';
import { generateForm } from './forms.js';

// Forward declarations for functions that will be provided by app.js
let onCalculateHandler, onInputChange;

export function setUIHandlers(handlers) {
    onCalculateHandler = handlers.onCalculate;
    onInputChange = handlers.onInputChange;
}

// ========== STATE ==========

export let selectedModel = null;

/**
 * Initialize the application
 */
export function init() {
    console.log('🚀 Initializing Pricing Equilibrium Calculator...');

    // Add event listeners to model selection buttons
    const modelButtons = document.querySelectorAll('.model-btn');
    modelButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modelKey = e.currentTarget.id.replace('model-', '');
            selectModel(modelKey);
        });
    });

    // Add event listener to calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', onCalculateHandler);
    }

    console.log('✅ Initialization complete');
}

/**
 * Select a pricing model
 */
function selectModel(modelKey) {
    console.log('📊 Model selected:', modelKey);

    selectedModel = modelKey;

    // Update button styles
    const modelButtons = document.querySelectorAll('.model-btn');
    modelButtons.forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-500');
        btn.classList.add('bg-gray-700', 'text-gray-300', 'border-transparent');
    });

    const selectedBtn = document.getElementById(`model-${modelKey}`);
    if (selectedBtn) {
        selectedBtn.classList.remove('bg-gray-700', 'text-gray-300', 'border-transparent');
        selectedBtn.classList.add('bg-blue-600', 'text-white', 'border-blue-500');
    }

    // Show input form container
    const inputFormContainer = document.getElementById('inputFormContainer');
    if (inputFormContainer) {
        inputFormContainer.classList.remove('hidden');
    }

    // Generate the form with default values
    generateForm(modelKey);

    // Show calculate button
    const calculateBtnContainer = document.getElementById('calculateBtnContainer');
    if (calculateBtnContainer) {
        calculateBtnContainer.classList.remove('hidden');
    }

    // Hide welcome message, show results container
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.classList.remove('hidden');
    }
}

/**
 * Get current model selection
 */
export function getSelectedModel() {
    return selectedModel;
}

/**
 * Get all input values for the selected model
 */
export function gatherInputs() {
    if (!selectedModel) return {};

    const model = models[selectedModel];
    const inputs = {};

    model.inputs.forEach(input => {
        const inputId = `${selectedModel}-${input.name}`;
        const inputElement = document.getElementById(inputId);

        if (inputElement) {
            if (input.type === 'text') {
                inputs[input.name] = inputElement.value;
            } else {
                inputs[input.name] = parseFloat(inputElement.value) || 0;
            }
        }
    });

    return inputs;
}
