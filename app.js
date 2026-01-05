// ========== SIMPLIFIED APPLICATION ORCHESTRATOR ==========
// Pricing Equilibrium Calculator - Simplified version

// ===== MODELS =====
import { models } from './models/index.js';

// ===== UTILS =====
import { formatCurrency, formatPercentage, formatNumber } from './utils/index.js';

// ===== UI =====
import * as forms from './ui/forms.js';
import * as initialization from './ui/initialization.js';
import * as resultsDisplay from './ui/results-display.js';

// ===== CHARTS (simplified) =====
// Charts will be minimal - just equilibrium visualization
import * as charts from './charts/index.js';

// ========== EVENT HANDLERS ==========

/**
 * Handle calculate button click
 */
function onCalculate() {
    console.log('🧮 Calculate button clicked');

    const selectedModel = initialization.getSelectedModel();

    if (!selectedModel) {
        console.warn('No model selected');
        return;
    }

    // Gather inputs
    const inputs = initialization.gatherInputs();
    console.log('📥 Inputs:', inputs);

    // Perform calculation
    const model = models[selectedModel];
    const results = model.calculate(inputs);
    console.log('📊 Results:', results);

    // Display results
    displayResults(selectedModel, results);
}

/**
 * Handle input change (for real-time calculation)
 */
function onInputChange() {
    // For now, we'll only calculate when the button is clicked
    // Could add debounced auto-calculation here later
    console.log('📝 Input changed');
}

/**
 * Display calculation results
 */
function displayResults(modelKey, results) {
    // Hide welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.classList.add('hidden');
    }

    // Show results container
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.classList.remove('hidden');
    }

    // Render results using the results-display component
    resultsDisplay.renderResults(modelKey, results);

    // Show charts container if equilibrium exists
    if (results.equilibriumExists && results.equilibriumRange) {
        const chartsContainer = document.getElementById('chartsContainer');
        if (chartsContainer) {
            chartsContainer.classList.remove('hidden');
        }

        // Render equilibrium chart
        charts.renderEquilibriumChart(results);
    }
}

// ========== DEPENDENCY INJECTION SETUP ==========

// Set up handlers for UI components
forms.setEventHandlers({
    onInputChange: onInputChange
});

initialization.setUIHandlers({
    onCalculate: onCalculate,
    onInputChange: onInputChange
});

// ========== GLOBAL EXPORTS ==========
// Export to window for use in HTML event handlers and debugging

// Models
window.models = models;

// Utils
window.formatCurrency = formatCurrency;
window.formatPercentage = formatPercentage;
window.formatNumber = formatNumber;

// UI Functions
window.init = initialization.init;

// ========== AUTO-INITIALIZE ==========

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialization.init);
} else {
    initialization.init();
}

console.log('🚀 Pricing Equilibrium Calculator loaded successfully!');
