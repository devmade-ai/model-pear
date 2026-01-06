// ========== SIMPLIFIED APPLICATION ORCHESTRATOR ==========
// Pricing Equilibrium Calculator - Simplified version

// ===== MODELS =====
import { models } from './models/index.js';

// ===== CALCULATORS =====
import { calculateModel } from './calculators/engine.js';

// ===== UTILS =====
import { formatCurrency, formatPercentage, formatNumber, showToast, validateInputField } from './utils/index.js';

// ===== UI =====
import * as forms from './ui/forms.js';
import * as initialization from './ui/initialization.js';
import * as resultsDisplay from './ui/results-display.js';

// ===== CHARTS (simplified) =====
// Charts will be minimal - just equilibrium visualization
import * as charts from './charts/index.js';

// ========== EVENT HANDLERS ==========

/**
 * Show loading state
 */
function showLoadingState() {
    const btn = document.getElementById('calculateBtn');
    const btnText = document.getElementById('calculateBtnText');
    const btnLoader = document.getElementById('calculateBtnLoader');

    if (btn && btnText && btnLoader) {
        btn.disabled = true;
        btn.classList.add('opacity-75', 'cursor-not-allowed');
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const btn = document.getElementById('calculateBtn');
    const btnText = document.getElementById('calculateBtnText');
    const btnLoader = document.getElementById('calculateBtnLoader');

    if (btn && btnText && btnLoader) {
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

/**
 * Handle calculate button click
 */
function onCalculate() {
    console.log('🧮 Calculate button clicked');

    const selectedModel = initialization.getSelectedModel();

    if (!selectedModel) {
        console.warn('No model selected');
        showToast('Please select a pricing model first', 'warning');
        return;
    }

    // Show loading state
    showLoadingState();

    // Use setTimeout to allow UI to update before calculation
    setTimeout(() => {
        try {
            // Get calculation mode and pricing strategy
            const calculationMode = forms.getCurrentCalculationMode();
            const pricingStrategy = forms.getCurrentPricingStrategy();

            // Perform calculation with reverse calculation support
            const results = calculateModel(selectedModel, calculationMode, pricingStrategy);
            console.log('📊 Results:', results);

            // Display results
            displayResults(selectedModel, results);

            // Show success toast
            showToast('Calculation completed successfully!', 'success', 3000);
        } catch (error) {
            console.error('Calculation error:', error);
            showToast('An error occurred during calculation', 'error');
        } finally {
            // Hide loading state
            hideLoadingState();
        }
    }, 100);
}

/**
 * Handle input change (for real-time calculation and validation)
 */
function onInputChange(event) {
    console.log('📝 Input changed');

    // Validate the input field
    if (event && event.target && event.target.tagName === 'INPUT') {
        validateInputField(event.target);
    }
}

/**
 * Handle calculation mode change (triggers recalculation)
 */
function onCalculationModeChange(modelKey) {
    console.log('🔄 Calculation mode changed');

    // Get calculation mode and pricing strategy
    const calculationMode = forms.getCurrentCalculationMode();
    const pricingStrategy = forms.getCurrentPricingStrategy();

    // Perform calculation with new mode
    const results = calculateModel(modelKey, calculationMode, pricingStrategy);

    // Display results
    displayResults(modelKey, results);
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
    onInputChange: onInputChange,
    onCalculationModeChange: onCalculationModeChange
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

// ========== KEYBOARD SHORTCUTS ==========

/**
 * Handle global keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Enter: Calculate
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn && !calculateBtn.disabled) {
            onCalculate();
            showToast('Keyboard shortcut: Ctrl+Enter to calculate', 'info', 2000);
        }
    }

    // ? key: Show keyboard shortcuts help
    if (event.key === '?' && !event.target.matches('input, textarea, select')) {
        event.preventDefault();
        showKeyboardShortcutsHelp();
    }
}

/**
 * Show keyboard shortcuts help
 */
function showKeyboardShortcutsHelp() {
    const shortcuts = {
        explanation: 'Use these keyboard shortcuts to navigate the calculator more efficiently:',
        keyMetrics: [
            '<kbd>Ctrl/Cmd + Enter</kbd> - Calculate equilibrium',
            '<kbd>Esc</kbd> - Close modal dialogs',
            '<kbd>Tab</kbd> - Navigate between fields',
            '<kbd>?</kbd> - Show this help'
        ]
    };

    // Use the modal system to show shortcuts
    import('./ui/modals.js').then(modals => {
        modals.showTooltipModal('⌨️ Keyboard Shortcuts', shortcuts);
    });
}

// Add keyboard event listener
document.addEventListener('keydown', handleKeyboardShortcuts);

// ========== AUTO-INITIALIZE ==========

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialization.init);
} else {
    initialization.init();
}

console.log('🚀 Pricing Equilibrium Calculator loaded successfully!');
console.log('💡 Tip: Press Ctrl+Enter to calculate or ? for keyboard shortcuts');
