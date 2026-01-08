// ========== APPLICATION ORCHESTRATOR ==========
// Software Transaction Tool - Pricing & Inter-Company Calculators

// ===== GLOBAL ERROR HANDLING =====

/**
 * Global error handler for uncaught errors
 */
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error caught:', { message, source, lineno, colno, error });
    // Don't show toast for every error to avoid spam, but log them
    return false; // Let the error propagate for debugging
};

/**
 * Global handler for unhandled promise rejections
 */
window.onunhandledrejection = function(event) {
    console.error('Unhandled promise rejection:', event.reason);
};

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

// ===== CHARTS =====
import * as charts from './charts/index.js';

// ===== STATE =====
import { getState, setMode, subscribe } from './state/app-state.js';

// ===== INTER-COMPANY =====
import { initIntercompanyCalculator } from './ui/intercompany/calculator.js';

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

// ========== MODE SWITCHING ==========

/**
 * Handle mode switch between pricing and intercompany
 */
function switchMode(mode) {
    setMode(mode);

    const pricingSection = document.getElementById('pricingCalculatorSection');
    const intercompanySection = document.getElementById('intercompanyCalculatorSection');
    const modePricingBtn = document.getElementById('mode-pricing');
    const modeIntercompanyBtn = document.getElementById('mode-intercompany');

    if (mode === 'pricing') {
        pricingSection?.classList.remove('hidden');
        intercompanySection?.classList.add('hidden');

        modePricingBtn?.classList.add('bg-blue-600', 'text-white');
        modePricingBtn?.classList.remove('text-gray-300', 'hover:bg-gray-600');

        modeIntercompanyBtn?.classList.remove('bg-blue-600', 'text-white');
        modeIntercompanyBtn?.classList.add('text-gray-300', 'hover:bg-gray-600');
    } else {
        pricingSection?.classList.add('hidden');
        intercompanySection?.classList.remove('hidden');

        modeIntercompanyBtn?.classList.add('bg-blue-600', 'text-white');
        modeIntercompanyBtn?.classList.remove('text-gray-300', 'hover:bg-gray-600');

        modePricingBtn?.classList.remove('bg-blue-600', 'text-white');
        modePricingBtn?.classList.add('text-gray-300', 'hover:bg-gray-600');

        // Initialize inter-company calculator if not already
        initIntercompanyCalculator();
    }
}

/**
 * Set up mode switching buttons
 */
function setupModeSwitching() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            if (mode) {
                switchMode(mode);
            }
        });
    });
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
function initApp() {
    try {
        // Initialize pricing calculator
        initialization.init();

        // Set up mode switching
        setupModeSwitching();

        // Check URL hash for initial mode
        if (window.location.hash === '#intercompany') {
            switchMode('intercompany');
        }

        console.log('🚀 Software Transaction Tool loaded successfully!');
        console.log('💡 Tip: Press Ctrl+Enter to calculate or ? for keyboard shortcuts');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        // Show a user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorDiv.textContent = 'Failed to load application. Please refresh the page.';
        document.body.appendChild(errorDiv);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
