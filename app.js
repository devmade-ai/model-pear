// ========== MAIN APPLICATION ORCHESTRATOR ==========
// This file imports all modules and sets up dependency injection for circular dependencies

// ===== CONFIG & CONSTANTS =====
import * as constants from './config/constants.js';

// ===== FRAMEWORK =====
import * as modelFamilies from './framework/model-families.js';
import * as categories from './framework/categories.js';
import * as delivery from './framework/delivery.js';
import * as services from './framework/services.js';

// ===== MODELS =====
import * as modelsModule from './models/index.js';

// ===== UTILS =====
import * as utils from './utils/index.js';

// ===== CHARTS =====
import * as charts from './charts/index.js';

// ===== CALCULATORS =====
import * as engine from './calculators/engine.js';
import * as clientBudget from './calculators/client-budget.js';

// ===== UI =====
import * as forms from './ui/forms.js';
import * as events from './ui/events.js';
import * as initialization from './ui/initialization.js';
import * as admin from './ui/admin.js';
import * as modals from './ui/modals.js';

// ========== DEPENDENCY INJECTION SETUP ==========

// Set up circular dependency resolution for UI components
forms.setEventHandlers({
    onInputChange: events.onInputChange
});

events.setDependencies({
    generateForm: forms.generateForm,
    performClientBudgetCalculation: clientBudget.performClientBudgetCalculation,
    renderCharts: charts.renderCharts,
    updateMetrics: charts.updateMetrics,
    renderComparison: clientBudget.renderComparison,
    renderSingleModel: clientBudget.renderSingleModel,
    gatherInputs: clientBudget.gatherInputs,
    destroyChart: charts.destroyChart,
    raceChartAnimation: null, // Will be set later if needed
    gatherConstraints: initialization.gatherConstraints
});

initialization.setUIHandlers({
    generateAdminPanel: admin.generateAdminPanel,
    updateClientBudgetOptions: clientBudget.updateClientBudgetOptions,
    onCategoryChange: initialization.onCategoryChange,
    onCompareMultipleToggle: initialization.onCompareMultipleToggle,
    onDeliveryChange: initialization.onDeliveryChange,
    onServiceChange: initialization.onServiceChange,
    onCalculate: events.onCalculate,
    generateModelCheckboxes: initialization.generateModelCheckboxes,
    updateSelectedSummary: initialization.updateSelectedSummary,
    updateCalculateButton: initialization.updateCalculateButton,
    onInputChange: events.onInputChange,
    onModelSelectionChange: initialization.onModelSelectionChange,
    updateInputForms: initialization.updateInputForms
});

admin.setAdminHandlers({
    onAdminInputChange: admin.onAdminInputChange
});

modals.setInitFunction(initialization.init);

clientBudget.setUIFunctions({
    hideAllResultPanels: events.hideAllResultPanels,
    renderCharts: charts.renderCharts,
    updateMetrics: charts.updateMetrics,
    displayVariablesSummary: clientBudget.displayVariablesSummary,
    renderExecutiveSummary: clientBudget.renderExecutiveSummary,
    renderUniversalMetrics: clientBudget.renderUniversalMetrics,
    renderComparisonCharts: clientBudget.renderComparisonCharts,
    renderRaceChart: clientBudget.renderRaceChart,
    renderComparisonTable: clientBudget.renderComparisonTable,
    showCalculationInfo: modals.showCalculationInfo,
    showInputInfo: modals.showInputInfo,
    showMetricInfo: modals.showMetricInfo,
    raceChartAnimation: null, // Will be set if needed
    selectedCategory: initialization.selectedCategory,
    LAYER_1_CATEGORIES: categories.LAYER_1_CATEGORIES,
    selectedDelivery: initialization.selectedDelivery,
    selectedService: initialization.selectedService,
    LAYER_2_DELIVERY: delivery.LAYER_2_DELIVERY,
    LAYER_3_SERVICE: services.LAYER_3_SERVICE
});

// ========== GLOBAL EXPORTS FOR BACKWARD COMPATIBILITY ==========
// Export everything to window for backward compatibility with index.html

// Config & Constants
window.CONFIG = constants.CONFIG;
window.chartInstances = constants.chartInstances;
window.selectedModels = constants.selectedModels;
window.storedInputValues = constants.storedInputValues;
window.currentMode = constants.currentMode;
window.reverseCalculatorState = constants.reverseCalculatorState;
window.clientBudgetState = constants.clientBudgetState;
window.setCurrentMode = constants.setCurrentMode;
window.setChartInstance = constants.setChartInstance;
window.addSelectedModel = constants.addSelectedModel;
window.removeSelectedModel = constants.removeSelectedModel;
window.clearSelectedModels = constants.clearSelectedModels;
window.setStoredInputValue = constants.setStoredInputValue;
window.updateReverseCalculatorState = constants.updateReverseCalculatorState;
window.updateClientBudgetState = constants.updateClientBudgetState;

// Framework
window.MODEL_FAMILIES = modelFamilies.MODEL_FAMILIES;
window.getModelFamily = modelFamilies.getModelFamily;
window.canCompareModels = modelFamilies.canCompareModels;
window.LAYER_1_CATEGORIES = categories.LAYER_1_CATEGORIES;
window.getApplicableModels = categories.getApplicableModels;
window.getCategoryDefaults = categories.getCategoryDefaults;
window.LAYER_2_DELIVERY = delivery.LAYER_2_DELIVERY;
window.LAYER_3_SERVICE = services.LAYER_3_SERVICE;
window.applyDeliveryModifier = services.applyDeliveryModifier;
window.applyServiceModifier = services.applyServiceModifier;
window.applyFrameworkModifiers = services.applyFrameworkModifiers;
window.setSelectedDelivery = services.setSelectedDelivery;
window.setSelectedService = services.setSelectedService;

// Models
window.models = modelsModule.models;

// Utils
window.formatCurrency = utils.formatCurrency;
window.formatPercentage = utils.formatPercentage;
window.formatNumber = utils.formatNumber;
window.validateInput = utils.validateInput;
window.validateModelInputs = utils.validateModelInputs;
window.displayValidationWarnings = utils.displayValidationWarnings;
window.METRIC_EXPLANATIONS = utils.METRIC_EXPLANATIONS;
window.CALCULATION_EXPLANATIONS = utils.CALCULATION_EXPLANATIONS;
window.getMetricInterpretation = utils.getMetricInterpretation;
window.calculateUniversalMetrics = utils.calculateUniversalMetrics;
window.getVariableBounds = utils.getVariableBounds;
window.extractRevenueFromResults = utils.extractRevenueFromResults;
window.reverseCalculate = utils.reverseCalculate;
window.formatVariableName = utils.formatVariableName;
window.formatSolvedValue = utils.formatSolvedValue;
window.generateScenarios = utils.generateScenarios;
window.debounce = utils.debounce;

// Charts
window.destroyChart = charts.destroyChart;
window.renderCharts = charts.renderCharts;
window.renderOneTimePurchaseCharts = charts.renderOneTimePurchaseCharts;
window.renderSubscriptionCharts = charts.renderSubscriptionCharts;
window.renderFreemiumCharts = charts.renderFreemiumCharts;
window.renderUsageBasedCharts = charts.renderUsageBasedCharts;
window.renderTieredCharts = charts.renderTieredCharts;
window.renderPerSeatCharts = charts.renderPerSeatCharts;
window.updateMetrics = charts.updateMetrics;

// Calculators
window.calculateModel = engine.calculateModel;
window.updateClientBudgetOptions = clientBudget.updateClientBudgetOptions;
window.performClientBudgetCalculation = clientBudget.performClientBudgetCalculation;
window.calculateClientBudgetOptions = clientBudget.calculateClientBudgetOptions;
window.findCapacityInput = clientBudget.findCapacityInput;
window.calculateCapacityLimit = clientBudget.calculateCapacityLimit;
window.findMaximumCapacity = clientBudget.findMaximumCapacity;
window.findBestValue = clientBudget.findBestValue;
window.findConservativeOption = clientBudget.findConservativeOption;
window.getDefaultInputs = clientBudget.getDefaultInputs;
window.calculateMonthlyCost = clientBudget.calculateMonthlyCost;
window.sortOptionsByPriority = clientBudget.sortOptionsByPriority;
window.displayClientBudgetResults = clientBudget.displayClientBudgetResults;
window.gatherInputs = clientBudget.gatherInputs;
window.renderSingleModel = clientBudget.renderSingleModel;
window.renderComparison = clientBudget.renderComparison;
window.displayVariablesSummary = clientBudget.displayVariablesSummary;
window.renderExecutiveSummary = clientBudget.renderExecutiveSummary;
window.generateRecommendation = clientBudget.generateRecommendation;
window.renderUniversalMetrics = clientBudget.renderUniversalMetrics;
window.renderComparisonCharts = clientBudget.renderComparisonCharts;
window.renderFamilyOverlayChart = clientBudget.renderFamilyOverlayChart;
window.renderSideBySideCharts = clientBudget.renderSideBySideCharts;
window.renderComparisonTable = clientBudget.renderComparisonTable;
window.renderRaceChart = clientBudget.renderRaceChart;
window.updateRaceChartDisplay = clientBudget.updateRaceChartDisplay;
window.setupRaceChartControls = clientBudget.setupRaceChartControls;

// UI - Forms
window.SCENARIO_TEMPLATES = forms.SCENARIO_TEMPLATES;
window.applyTemplate = forms.applyTemplate;
window.generateForm = forms.generateForm;

// UI - Events
window.onModelChange = events.onModelChange;
window.onInputChange = events.onInputChange;
window.hideAllResultPanels = events.hideAllResultPanels;
window.onCalculate = events.onCalculate;
window.performCalculation = events.performCalculation;
window.performReverseCalculation = events.performReverseCalculation;
window.displayReverseResults = events.displayReverseResults;

// UI - Initialization
window.selectedCategory = initialization.selectedCategory;
window.selectedDelivery = initialization.selectedDelivery;
window.selectedService = initialization.selectedService;
window.setCalculatorMode = initialization.setCalculatorMode;
window.updateReverseCalculatorOptions = initialization.updateReverseCalculatorOptions;
window.updateConstraintInputs = initialization.updateConstraintInputs;
window.gatherConstraints = initialization.gatherConstraints;
window.init = initialization.init;
window.onCompareMultipleToggle = initialization.onCompareMultipleToggle;
window.onCategoryChange = initialization.onCategoryChange;
window.onDeliveryChange = initialization.onDeliveryChange;
window.onServiceChange = initialization.onServiceChange;
window.generateModelCheckboxes = initialization.generateModelCheckboxes;
window.onModelSelectionChange = initialization.onModelSelectionChange;
window.updateSelectedSummary = initialization.updateSelectedSummary;
window.updateInputForms = initialization.updateInputForms;
window.generateAllForms = initialization.generateAllForms;
window.generateInputTabs = initialization.generateInputTabs;
window.updateCalculateButton = initialization.updateCalculateButton;

// UI - Admin
window.generateAdminPanel = admin.generateAdminPanel;
window.onAdminInputChange = admin.onAdminInputChange;

// UI - Modals
window.showTooltipModal = modals.showTooltipModal;
window.closeTooltipModal = modals.closeTooltipModal;
window.showMetricInfo = modals.showMetricInfo;
window.showCalculationInfo = modals.showCalculationInfo;
window.showInputInfo = modals.showInputInfo;

// ========== AUTO-INITIALIZE ==========
// The application will auto-initialize when DOM is ready (handled by modals.js)

console.log('🚀 Model Pear Calculator loaded successfully!');
