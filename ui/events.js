import { models } from '../models/index.js';
import { CONFIG, storedInputValues, selectedModels, currentMode, reverseCalculatorState, clientBudgetState, setStoredInputValue } from '../config/constants.js';
import { debounce, validateModelInputs, displayValidationWarnings, reverseCalculate, formatVariableName, formatSolvedValue, generateScenarios, calculateUniversalMetrics } from '../utils/index.js';
import { canCompareModels } from '../framework/model-families.js';
import { calculateModel } from '../calculators/engine.js';

// Forward declarations for functions that will be provided by app.js
let generateForm, performClientBudgetCalculation, renderCharts, updateMetrics,
    renderComparison, renderSingleModel, gatherInputs, destroyChart,
    raceChartAnimation, gatherConstraints;

export function setDependencies(deps) {
    generateForm = deps.generateForm;
    performClientBudgetCalculation = deps.performClientBudgetCalculation;
    renderCharts = deps.renderCharts;
    updateMetrics = deps.updateMetrics;
    renderComparison = deps.renderComparison;
    renderSingleModel = deps.renderSingleModel;
    gatherInputs = deps.gatherInputs;
    destroyChart = deps.destroyChart;
    raceChartAnimation = deps.raceChartAnimation;
    gatherConstraints = deps.gatherConstraints;
}

// ========== EVENT HANDLERS ==========

/**
 * Handle model selection change
 */
export function onModelChange(event) {
    const selectedModel = event.target.value;

    if (!selectedModel) {
        document.getElementById('inputForm').innerHTML = '<p class="text-gray-400 text-sm">Select a model to see input fields</p>';
        document.getElementById('calculateBtn').disabled = true;

        // Hide all charts and metrics
        document.getElementById('metricsPanel').classList.add('hidden');
        document.getElementById('primaryChartContainer').classList.add('hidden');
        document.getElementById('secondaryChartsGrid').classList.add('hidden');

        return;
    }

    // Generate form for selected model
    generateForm(selectedModel);

    // Enable calculate button
    document.getElementById('calculateBtn').disabled = false;

    // Auto-calculate with default values
    performCalculation();
}

/**
 * Handle input field changes (debounced)
 */
export const onInputChange = debounce(function(event) {
    // Store the input value when it changes
    const modelKey = event.target.dataset.model;
    const inputName = event.target.name;
    const value = parseFloat(event.target.value) || 0;

    if (!storedInputValues.has(modelKey)) {
        storedInputValues.set(modelKey, {});
    }
    storedInputValues.get(modelKey)[inputName] = value;

    performCalculation();
}, CONFIG.debounceDelay);

/**
 * Hide all result panels and clean up dynamic elements
 */
export function hideAllResultPanels() {
    // Hide all result panels
    document.getElementById('reverseResultsPanel').classList.add('hidden');
    document.getElementById('clientBudgetResultsPanel').classList.add('hidden');
    document.getElementById('universalMetricsPanel').classList.add('hidden');
    document.getElementById('metricsPanel').classList.add('hidden');
    document.getElementById('primaryChartContainer').classList.add('hidden');
    document.getElementById('secondaryChartsGrid').classList.add('hidden');
    document.getElementById('comparisonChartsContainer').classList.add('hidden');
    document.getElementById('raceChartContainer').classList.add('hidden');
    document.getElementById('comparisonTableContainer').classList.add('hidden');

    // Remove dynamically created summary elements
    const executiveSummary = document.getElementById('executive-summary');
    if (executiveSummary) {
        executiveSummary.remove();
    }

    // Remove all variables summary elements
    const variablesSummaries = document.querySelectorAll('.variables-summary');
    variablesSummaries.forEach(elem => elem.remove());
}

/**
 * Handle calculate button click
 */
export function onCalculate() {
    if (currentMode === 'reverse') {
        performReverseCalculation();
    } else if (currentMode === 'client-budget') {
        performClientBudgetCalculation();
    } else {
        performCalculation();
    }
}

/**
 * Perform the calculation and update UI
 */
export function performCalculation() {
    if (selectedModels.size === 0) return;

    // Hide all result panels from other modes
    hideAllResultPanels();

    // Validate inputs and collect warnings
    const allWarnings = [];
    const allInputs = new Map();

    for (const modelKey of selectedModels) {
        const inputs = gatherInputs(modelKey);
        allInputs.set(modelKey, inputs);
        const warnings = validateModelInputs(modelKey, inputs);
        allWarnings.push(...warnings);
    }

    // Display validation warnings
    displayValidationWarnings(allWarnings);

    // Calculate results for all selected models
    const allResults = new Map();

    for (const modelKey of selectedModels) {
        const results = calculateModel(modelKey);
        allResults.set(modelKey, results);
    }

    // Determine comparison type
    const comparison = canCompareModels(Array.from(selectedModels));

    // Update UI based on number of models selected
    if (selectedModels.size === 1) {
        // Single model view
        const modelKey = Array.from(selectedModels)[0];
        renderSingleModel(modelKey, allResults.get(modelKey), allInputs.get(modelKey));
    } else {
        // Multi-model comparison view
        renderComparison(allResults, allInputs, comparison);
    }
}

/**
 * Perform reverse calculation
 */
export function performReverseCalculation() {
    if (selectedModels.size === 0) {
        alert('Please select a revenue model first');
        return;
    }

    if (selectedModels.size > 1) {
        alert('Reverse calculator works with one model at a time. Please select only one model.');
        return;
    }

    // Hide all result panels from other modes
    hideAllResultPanels();

    // Get reverse calculator inputs
    const targetRevenue = parseFloat(document.getElementById('targetRevenue').value);
    const targetMonth = parseInt(document.getElementById('targetMonth').value);
    const solveForVariable = document.getElementById('solveForVariable').value;
    const generateScenariosCheckbox = document.getElementById('generateScenarios').checked;

    // Validation
    if (!targetRevenue || targetRevenue <= 0) {
        alert('Please enter a valid target revenue (greater than 0)');
        return;
    }

    if (!targetMonth || targetMonth < 1 || targetMonth > 60) {
        alert('Please enter a valid target month (1-60)');
        return;
    }

    if (!solveForVariable) {
        alert('Please select a variable to solve for');
        return;
    }

    // Update state
    reverseCalculatorState.targetRevenue = targetRevenue;
    reverseCalculatorState.targetMonth = targetMonth;
    reverseCalculatorState.solveForVariable = solveForVariable;
    reverseCalculatorState.generateScenarios = generateScenariosCheckbox;

    // Gather constraints
    const constraints = gatherConstraints();
    reverseCalculatorState.constraints = constraints;

    const modelKey = Array.from(selectedModels)[0];

    // Perform reverse calculation
    const solution = reverseCalculate(modelKey, targetRevenue, targetMonth, solveForVariable, constraints);

    if (!solution.success) {
        alert(solution.error || 'Could not find a solution. Try adjusting your constraints or target.');
        return;
    }

    // Generate scenarios if requested
    let scenarios = [];
    if (generateScenariosCheckbox) {
        scenarios = generateScenarios(modelKey, targetRevenue, targetMonth, constraints);
    }

    // Display reverse results
    displayReverseResults(modelKey, solution, scenarios);

    // Also render the normal forward calculation with the solved inputs
    // This shows the full projection and all charts
    const results = solution.results;
    const inputs = solution.inputs;
    const allResults = new Map();
    const allInputs = new Map();
    allResults.set(modelKey, results);
    allInputs.set(modelKey, inputs);

    renderSingleModel(modelKey, results, inputs);
}

/**
 * Display reverse calculation results
 */
export function displayReverseResults(modelKey, solution, scenarios) {
    const model = models[modelKey];
    const panel = document.getElementById('reverseResultsPanel');
    const content = document.getElementById('reverseResultsContent');

    panel.classList.remove('hidden');

    let html = '';

    // Primary solution
    html += `
        <div class="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-5 border border-green-700 mb-4">
            <div class="flex items-start justify-between mb-3">
                <div>
                    <div class="text-xs text-green-200 mb-1">Required ${formatVariableName(reverseCalculatorState.solveForVariable, model)}</div>
                    <div class="text-3xl font-bold text-white">
                        ${formatSolvedValue(reverseCalculatorState.solveForVariable, solution.solvedValue, model)}
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-green-200 mb-1">Target Revenue</div>
                    <div class="text-xl font-semibold text-green-100">
                        ${formatCurrency(reverseCalculatorState.targetRevenue)}/mo
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between text-sm border-t border-green-700 pt-3 mt-3">
                <div>
                    <span class="text-green-200">Achieved:</span>
                    <span class="text-white font-semibold ml-1">${formatCurrency(solution.achievedRevenue)}</span>
                </div>
                <div>
                    <span class="text-green-200">By Month:</span>
                    <span class="text-white font-semibold ml-1">${reverseCalculatorState.targetMonth}</span>
                </div>
                <div>
                    <span class="text-green-200">Accuracy:</span>
                    <span class="text-white font-semibold ml-1">${(100 - Math.abs((solution.achievedRevenue - reverseCalculatorState.targetRevenue) / reverseCalculatorState.targetRevenue * 100)).toFixed(1)}%</span>
                </div>
            </div>
            ${solution.isApproximation ? '<div class="mt-2 text-xs text-green-300 italic">Note: This is an approximate solution</div>' : ''}
        </div>
    `;

    // Show all input values used
    html += `
        <div class="mb-4">
            <h3 class="text-sm font-semibold text-gray-300 mb-2">All Input Values</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
    `;

    model.inputs.forEach(input => {
        const value = solution.inputs[input.name];
        const isSolved = input.name === reverseCalculatorState.solveForVariable;

        html += `
            <div class="bg-gray-700 rounded p-2 ${isSolved ? 'border-2 border-green-500' : 'border border-gray-600'}">
                <div class="text-xs text-gray-400 mb-1">${input.label}${isSolved ? ' (solved)' : ''}</div>
                <div class="text-sm font-semibold text-gray-100">
                    ${formatSolvedValue(input.name, value, model)}
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    // Display scenarios if available
    if (scenarios && scenarios.length > 0) {
        html += `
            <div>
                <h3 class="text-sm font-semibold text-gray-300 mb-3">Alternative Scenarios</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        `;

        scenarios.forEach((scenario, index) => {
            const colors = [
                'from-blue-900 to-blue-800 border-blue-700',
                'from-purple-900 to-purple-800 border-purple-700',
                'from-orange-900 to-orange-800 border-orange-700'
            ];

            html += `
                <div class="bg-gradient-to-br ${colors[index]} rounded-lg p-4 border">
                    <div class="font-semibold text-white mb-1">${scenario.name}</div>
                    <div class="text-xs text-gray-300 mb-3">${scenario.description}</div>
                    <div class="text-sm mb-2">
                        <span class="text-gray-300">Required:</span>
                        <span class="text-white font-semibold ml-1">${formatSolvedValue(reverseCalculatorState.solveForVariable, scenario.solvedValue, model)}</span>
                    </div>
                    <div class="text-xs text-gray-400">
                        Achieves ${formatCurrency(scenario.achievedRevenue)}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    content.innerHTML = html;
}

