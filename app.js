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

// ========== TOOLTIP HELPER SYSTEM ==========

/**
 * Tooltip content definitions for all UI elements
 */
const TOOLTIP_CONTENT = {
    // Mode switcher tooltips
    'intercompany-mode': {
        explanation: 'The Transaction Structuring Tool helps you compare different models for software projects to maximize value for both your company and your client. Analyze expenses, capitalization, and tax effects to decide which model works best.',
        keyMetrics: [
            'Your Company: Revenue recognition, costs, profit, tax position',
            'Client: Asset capitalisation, amortisation, Section 11(e) tax benefits',
            'Net Effect: Combined financial impact for both parties'
        ],
        useCases: 'Use this when starting new projects or products to determine the optimal transaction structure. Compare models like cost-plus, licensing, joint development, or SaaS to find the best fit.'
    },
    'pricing-mode': {
        explanation: 'The Pricing Calculator helps you find the equilibrium zone between your minimum acceptable price (seller floor) and the maximum price buyers will pay (buyer ceiling).',
        keyMetrics: [
            'Seller Floor: Minimum price based on your costs + desired margin',
            'Buyer Ceiling: Maximum price based on value delivered to customers',
            'Equilibrium Zone: The win-win range where both parties benefit'
        ],
        useCases: 'Use this for pricing new products, validating existing prices, or understanding the value-cost dynamics of your software offerings.'
    },
    // Pricing model tooltips
    'model-subscription': {
        explanation: 'Monthly recurring revenue model where customers pay a fixed fee per month. Ideal for SaaS businesses with predictable, recurring revenue streams.',
        formula: 'MRR = Customers × Monthly Price',
        keyMetrics: ['Monthly Recurring Revenue (MRR)', 'Annual Recurring Revenue (ARR)', 'Churn Rate', 'Customer Lifetime Value'],
        useCases: 'Cloud software, SaaS products, membership services, hosted applications'
    },
    'model-usage-based': {
        explanation: 'Pay-per-use model where customers are charged based on their actual consumption. Revenue scales directly with customer usage.',
        formula: 'Revenue = Units Consumed × Price Per Unit',
        keyMetrics: ['Average Revenue Per User (ARPU)', 'Usage Volume', 'Unit Economics', 'Cost Per Unit'],
        useCases: 'API services, cloud computing, transaction processing, build minutes, storage services'
    },
    'model-per-seat': {
        explanation: 'Pricing based on the number of users or seats. Each active user represents a unit of revenue.',
        formula: 'Revenue = Active Seats × Price Per Seat',
        keyMetrics: ['Seats Sold', 'Revenue Per Seat', 'Seat Expansion Rate', 'Cost Per Seat'],
        useCases: 'Team collaboration tools, enterprise software, productivity suites, CRM systems'
    },
    'model-one-time': {
        explanation: 'Perpetual license model with upfront payment and optional annual maintenance. Customer owns the software indefinitely.',
        formula: 'Revenue = License Fee + (Annual Maintenance × Years)',
        keyMetrics: ['License Revenue', 'Maintenance Revenue', 'Renewal Rate', 'Upgrade Revenue'],
        useCases: 'Desktop software, on-premise enterprise solutions, perpetual licenses, one-time purchases'
    },
    'model-marketplace': {
        explanation: 'Two-sided platform model where you facilitate transactions between buyers and sellers, taking a commission on each transaction.',
        formula: 'Revenue = GMV × Take Rate',
        keyMetrics: ['Gross Merchandise Value (GMV)', 'Take Rate', 'Transaction Volume', 'Platform Fees'],
        useCases: 'App stores, e-commerce platforms, service marketplaces, freelance platforms'
    },
    // Intercompany tab tooltips
    'tab-calculator': {
        explanation: 'The main calculation interface where you configure your inter-company transaction. Select a model, variant, and input your transaction parameters.',
        keyMetrics: ['Model Selection', 'Variant Configuration', 'Transaction Inputs', 'Calculate Results'],
        useCases: 'Setting up new transactions, modifying existing calculations, comparing scenarios'
    },
    'tab-compliance': {
        explanation: 'Transfer pricing compliance analysis including arm\'s length benchmarking, SARS risk indicators, and documentation requirements.',
        keyMetrics: ['Arm\'s Length Range', 'Transfer Pricing Risk Score', 'Documentation Checklist', 'SARS Red Flags'],
        useCases: 'Compliance review, audit preparation, transfer pricing documentation, risk assessment'
    },
    'tab-visualizations': {
        explanation: 'Advanced charts and visualizations showing tax impact, cash flows, and comparative analysis between perspectives.',
        keyMetrics: ['Tax Impact Charts', 'Cash Flow Waterfall', 'Perspective Comparison', 'Timeline Analysis'],
        useCases: 'Presentations, stakeholder reporting, visual analysis, decision support'
    },
    'tab-sensitivity': {
        explanation: 'What-if analysis showing how changes in key inputs affect your transaction outcomes. Includes scenario comparison and break-even analysis.',
        keyMetrics: ['Tornado Charts', 'Scenario Analysis', 'Break-Even Points', 'Monte Carlo Simulation'],
        useCases: 'Risk analysis, decision modelling, understanding variable impact, stress testing'
    },
    'tab-projections': {
        explanation: 'Future scenario projections showing how your transaction might evolve over multiple years with different growth assumptions.',
        keyMetrics: ['Multi-Year Forecasts', 'Growth Scenarios', 'NPV Analysis', 'Cumulative Impact'],
        useCases: 'Long-term planning, investment decisions, board presentations, strategic analysis'
    },
    // Wizard mode tooltips
    'wizard-mode': {
        explanation: 'The guided wizard asks you questions about your transaction to recommend the best inter-company model. It uses progressive disclosure to show questions one at a time.',
        keyMetrics: ['Guided Question Flow', 'Real-time Recommendations', 'Model Matching Score', 'Variant Suggestions'],
        useCases: 'New users, complex transactions, when unsure which model to use, training purposes'
    },
    'direct-mode': {
        explanation: 'Direct selection mode lets experienced users skip the wizard and select their preferred model and variant directly.',
        keyMetrics: ['Quick Model Selection', 'Direct Variant Access', 'Faster Workflow', 'Expert Mode'],
        useCases: 'Experienced users, repeat transactions, when you know exactly which model to use'
    }
};

/**
 * Set up click handlers for tooltip help icons
 */
function setupTooltipHelpers() {
    // Use event delegation for all help icons
    document.addEventListener('click', (e) => {
        // Handle mode/model help icons
        const helpIcon = e.target.closest('.help-icon[data-tooltip]');
        if (helpIcon) {
            e.preventDefault();
            e.stopPropagation();
            const tooltipId = helpIcon.dataset.tooltip;
            showTooltipForId(tooltipId);
            return;
        }

        // Handle input help buttons
        const inputHelpBtn = e.target.closest('.input-help-btn[data-input-tooltip]');
        if (inputHelpBtn) {
            e.preventDefault();
            e.stopPropagation();
            const tooltipData = inputHelpBtn.dataset.inputTooltip;
            if (tooltipData) {
                const [modelKey, inputName] = tooltipData.split(':');
                showInputTooltip(modelKey, inputName);
            }
            return;
        }

        // Handle intercompany input help buttons
        const intercompanyHelpBtn = e.target.closest('.intercompany-input-help');
        if (intercompanyHelpBtn) {
            e.preventDefault();
            e.stopPropagation();
            const inputName = intercompanyHelpBtn.dataset.inputName;
            const inputHint = decodeURIComponent(intercompanyHelpBtn.dataset.inputHint || '');
            const inputLabel = decodeURIComponent(intercompanyHelpBtn.dataset.inputLabel || inputName);
            showIntercompanyInputTooltip(inputName, inputHint, inputLabel);
            return;
        }
    });
}

/**
 * Show tooltip for an input field
 */
function showInputTooltip(modelKey, inputName) {
    import('./ui/modals.js').then(modals => {
        modals.showInputInfo(modelKey, inputName);
    });
}

/**
 * Show tooltip for an intercompany input field
 */
function showIntercompanyInputTooltip(inputName, inputHint, inputLabel) {
    import('./ui/modals.js').then(modals => {
        modals.showTooltipModal(`📋 ${inputLabel}`, {
            explanation: inputHint,
            useCases: 'This input affects the transaction calculation. Adjust based on your specific transaction parameters.'
        });
    });
}

/**
 * Show tooltip modal for a given tooltip ID
 */
function showTooltipForId(tooltipId) {
    const content = TOOLTIP_CONTENT[tooltipId];
    if (!content) {
        console.warn(`No tooltip content found for: ${tooltipId}`);
        return;
    }

    // Determine title from tooltip ID
    const titles = {
        'intercompany-mode': '📊 Inter-Company Tool',
        'pricing-mode': '💰 Pricing Calculator',
        'model-subscription': '📅 Subscription (SaaS) Model',
        'model-usage-based': '📈 Usage-Based Model',
        'model-per-seat': '👥 Per-Seat Model',
        'model-one-time': '🎯 One-Time Purchase Model',
        'model-marketplace': '🏪 Marketplace Model',
        'tab-calculator': '🧮 Calculator Tab',
        'tab-compliance': '⚖️ Compliance Tab',
        'tab-charts': '📊 Charts Tab',
        'tab-whatif': '📈 What-If Analysis Tab',
        'tab-projections': '🚀 Projections Tab',
        'wizard-mode': '✨ Wizard Mode',
        'manual-mode': '📋 Manual Selection Mode'
    };

    const title = titles[tooltipId] || 'Help';

    // Use the modal system to show tooltip
    import('./ui/modals.js').then(modals => {
        modals.showTooltipModal(title, content);
    });
}

// ========== AUTO-INITIALIZE ==========

// Initialize when DOM is ready
function initApp() {
    try {
        // Initialize pricing calculator
        initialization.init();

        // Set up mode switching
        setupModeSwitching();

        // Set up tooltip help icons
        setupTooltipHelpers();

        // Default to intercompany mode unless URL hash specifies pricing
        if (window.location.hash === '#pricing') {
            switchMode('pricing');
        } else {
            // Default: intercompany mode
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
