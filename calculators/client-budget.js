import { models } from '../models/index.js';
import { currentMode, selectedModels, clientBudgetState, CONFIG } from '../config/constants.js';
import { formatCurrency, formatNumber, calculateUniversalMetrics, getMetricInterpretation, METRIC_EXPLANATIONS, CALCULATION_EXPLANATIONS } from '../utils/index.js';
import { canCompareModels } from '../framework/model-families.js';
import { calculateModel } from './engine.js';

// Forward declarations for functions that will be provided by app.js
let hideAllResultPanels, renderCharts, updateMetrics, displayVariablesSummary,
    renderExecutiveSummary, renderUniversalMetrics, renderComparisonCharts,
    renderRaceChart, renderComparisonTable, showCalculationInfo, showInputInfo,
    showMetricInfo, raceChartAnimation, selectedCategory, LAYER_1_CATEGORIES,
    selectedDelivery, selectedService, LAYER_2_DELIVERY, LAYER_3_SERVICE;

// Setter functions to inject dependencies from app.js
export function setUIFunctions(functions) {
    hideAllResultPanels = functions.hideAllResultPanels;
    renderCharts = functions.renderCharts;
    updateMetrics = functions.updateMetrics;
    displayVariablesSummary = functions.displayVariablesSummary;
    renderExecutiveSummary = functions.renderExecutiveSummary;
    renderUniversalMetrics = functions.renderUniversalMetrics;
    renderComparisonCharts = functions.renderComparisonCharts;
    renderRaceChart = functions.renderRaceChart;
    renderComparisonTable = functions.renderComparisonTable;
    showCalculationInfo = functions.showCalculationInfo;
    showInputInfo = functions.showInputInfo;
    showMetricInfo = functions.showMetricInfo;
    raceChartAnimation = functions.raceChartAnimation;
    selectedCategory = functions.selectedCategory;
    LAYER_1_CATEGORIES = functions.LAYER_1_CATEGORIES;
    selectedDelivery = functions.selectedDelivery;
    selectedService = functions.selectedService;
    LAYER_2_DELIVERY = functions.LAYER_2_DELIVERY;
    LAYER_3_SERVICE = functions.LAYER_3_SERVICE;
}

// ========== CLIENT BUDGET CALCULATOR ==========

/**
 * Update client budget calculator options based on selected models
 */
export function updateClientBudgetOptions() {
    if (currentMode !== 'client-budget' || selectedModels.size === 0) return;

    const clientRequirements = document.getElementById('clientRequirements');
    clientRequirements.innerHTML = '';

    // For each selected model, add requirement inputs
    for (const modelKey of selectedModels) {
        const model = models[modelKey];
        if (!model) continue;

        // Add a section for this model
        const modelSection = document.createElement('div');
        modelSection.className = 'mb-3 pb-3 border-b border-gray-600 last:border-0';

        const modelLabel = document.createElement('div');
        modelLabel.className = 'text-xs font-medium text-blue-400 mb-2';
        modelLabel.textContent = model.name;
        modelSection.appendChild(modelLabel);

        // Add key inputs as requirements
        model.inputs.forEach(input => {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'mb-2';

            const label = document.createElement('label');
            label.className = 'block text-xs text-gray-400 mb-1';
            label.textContent = `Min ${input.label}`;

            const inputElement = document.createElement('input');
            inputElement.type = 'number';
            inputElement.name = `req-${modelKey}-${input.name}`;
            inputElement.className = 'w-full px-2 py-1 text-sm bg-gray-600 border border-gray-500 rounded text-gray-100';
            inputElement.placeholder = input.default || 0;
            inputElement.min = input.min || 0;
            inputElement.step = input.step || 1;

            inputDiv.appendChild(label);
            inputDiv.appendChild(inputElement);
            modelSection.appendChild(inputDiv);
        });

        clientRequirements.appendChild(modelSection);
    }
}

/**
 * Perform client budget calculation
 */
export function performClientBudgetCalculation() {
    if (selectedModels.size === 0) {
        alert('Please select at least one pricing model first');
        return;
    }

    // Hide all result panels from other modes
    hideAllResultPanels();

    // Get client budget inputs
    const budget = parseFloat(document.getElementById('clientBudget').value);
    const flexibility = document.getElementById('budgetFlexibility').value;
    const priority = document.querySelector('input[name="clientPriority"]:checked').value;
    const showMultiple = document.getElementById('showMultipleOptions').checked;

    if (!budget || budget <= 0) {
        alert('Please enter a valid budget amount');
        return;
    }

    // Update state
    clientBudgetState.budget = budget;
    clientBudgetState.flexibility = flexibility;
    clientBudgetState.priority = priority;
    clientBudgetState.showMultipleOptions = showMultiple;

    // Gather requirements
    const requirements = {};
    const reqInputs = document.querySelectorAll('[name^="req-"]');
    reqInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (value && value > 0) {
            requirements[input.name] = value;
        }
    });
    clientBudgetState.requirements = requirements;

    // Calculate budget flexibility range
    let flexibilityMultiplier = 1.0;
    if (flexibility === 'moderate') {
        flexibilityMultiplier = 1.1;
    } else if (flexibility === 'flexible') {
        flexibilityMultiplier = 1.2;
    }
    const maxBudget = budget * flexibilityMultiplier;

    // Calculate options for each model
    const allOptions = [];

    for (const modelKey of selectedModels) {
        const options = calculateClientBudgetOptions(modelKey, budget, maxBudget, priority, requirements);
        allOptions.push(...options);
    }

    // Sort options based on priority
    const sortedOptions = sortOptionsByPriority(allOptions, priority, budget);

    // Display results
    displayClientBudgetResults(sortedOptions, budget, maxBudget);
}

/**
 * Calculate pricing options for a model within budget
 */
export function calculateClientBudgetOptions(modelKey, budget, maxBudget, priority, requirements) {
    const model = models[modelKey];
    if (!model) return [];

    const options = [];

    // Strategy 1: Maximum capacity/users
    const maxOption = findMaximumCapacity(modelKey, model, budget, maxBudget, requirements);
    if (maxOption) {
        options.push({
            ...maxOption,
            modelKey,
            modelName: model.name,
            strategy: 'max-capacity',
            strategyLabel: 'Maximum Capacity'
        });
    }

    // Strategy 2: Best value (lowest cost per unit)
    const valueOption = findBestValue(modelKey, model, budget, maxBudget, requirements);
    if (valueOption) {
        options.push({
            ...valueOption,
            modelKey,
            modelName: model.name,
            strategy: 'best-value',
            strategyLabel: 'Best Value'
        });
    }

    // Strategy 3: Budget conscious (leave buffer)
    const conservativeOption = findConservativeOption(modelKey, model, budget * 0.8, budget, requirements);
    if (conservativeOption) {
        options.push({
            ...conservativeOption,
            modelKey,
            modelName: model.name,
            strategy: 'budget-conscious',
            strategyLabel: 'Budget Conscious'
        });
    }

    return options;
}

/**
 * Helper function to find capacity-related inputs
 * Improved to be more flexible and catch more input types
 */
export function findCapacityInput(model) {
    // Look for inputs that represent capacity/scale (case-insensitive)
    const capacityKeywords = [
        'users', 'seats', 'customers', 'members', 'subscribers',
        'startingusers', 'startingcustomers', 'freeusers', 'paidusers',
        'newcustomers', 'initial', 'activeusers', 'licenses'
    ];

    const capacityInput = model.inputs.find(input => {
        const nameLower = input.name.toLowerCase();
        return capacityKeywords.some(keyword => nameLower.includes(keyword));
    });

    return capacityInput || null;
}

/**
 * Calculate dynamic capacity limit based on budget
 * Ensures we search high enough for large budgets
 */
export function calculateCapacityLimit(budget, minPriceEstimate = 5) {
    // Estimate maximum possible capacity based on budget
    // Assume minimum price per unit is around R5-10
    const estimatedMax = Math.floor(budget / minPriceEstimate);

    // Cap at reasonable limits to avoid infinite searches
    // But ensure we go high enough for large budgets
    return Math.min(Math.max(estimatedMax, 10000), 1000000);
}

/**
 * Find maximum capacity within budget
 */
export function findMaximumCapacity(modelKey, model, budget, maxBudget, requirements) {
    // Find the primary capacity variable using improved detection
    const capacityInput = findCapacityInput(model);

    if (!capacityInput) return null;

    // Binary search for maximum capacity with dynamic limit
    let low = requirements[`req-${modelKey}-${capacityInput.name}`] || capacityInput.min || 1;
    let high = calculateCapacityLimit(maxBudget);
    let bestCapacity = null;

    for (let i = 0; i < 50; i++) {
        const mid = Math.floor((low + high) / 2);

        // Create inputs with this capacity
        const testInputs = { ...getDefaultInputs(model) };
        testInputs[capacityInput.name] = mid;

        // Calculate monthly cost
        const monthlyCost = calculateMonthlyCost(modelKey, testInputs);

        if (monthlyCost <= maxBudget) {
            bestCapacity = {
                inputs: { ...testInputs },
                monthlyCost,
                capacity: mid,
                capacityLabel: capacityInput.label,
                budgetUtilization: (monthlyCost / budget) * 100
            };
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return bestCapacity;
}

/**
 * Find best value option (optimize cost per unit)
 */
export function findBestValue(modelKey, model, budget, maxBudget, requirements) {
    // Use improved capacity detection
    const capacityInput = findCapacityInput(model);

    if (!capacityInput) return null;

    // Try different capacity levels and find best cost per unit
    let bestOption = null;
    let bestCostPerUnit = Infinity;

    // Dynamic limit based on budget
    const maxCapacity = Math.min(calculateCapacityLimit(maxBudget), 50000);
    const step = Math.max(Math.floor(maxCapacity / 100), 10); // Adaptive step size

    for (let capacity = 10; capacity <= maxCapacity; capacity += step) {
        const testInputs = { ...getDefaultInputs(model) };
        testInputs[capacityInput.name] = capacity;

        const monthlyCost = calculateMonthlyCost(modelKey, testInputs);

        if (monthlyCost <= maxBudget) {
            const costPerUnit = monthlyCost / capacity;

            if (costPerUnit < bestCostPerUnit) {
                bestCostPerUnit = costPerUnit;
                bestOption = {
                    inputs: { ...testInputs },
                    monthlyCost,
                    capacity,
                    capacityLabel: capacityInput.label,
                    costPerUnit,
                    budgetUtilization: (monthlyCost / budget) * 100
                };
            }
        }
    }

    return bestOption;
}

/**
 * Find conservative option (leave budget buffer)
 */
export function findConservativeOption(modelKey, model, targetBudget, maxBudget, requirements) {
    // Use improved capacity detection
    const capacityInput = findCapacityInput(model);

    if (!capacityInput) return null;

    let bestOption = null;
    let bestDiff = Infinity;

    // Dynamic limit based on target budget
    const maxCapacity = Math.min(calculateCapacityLimit(targetBudget), 25000);
    const step = Math.max(Math.floor(maxCapacity / 100), 5); // Adaptive step size

    for (let capacity = 5; capacity <= maxCapacity; capacity += step) {
        const testInputs = { ...getDefaultInputs(model) };
        testInputs[capacityInput.name] = capacity;

        const monthlyCost = calculateMonthlyCost(modelKey, testInputs);

        if (monthlyCost <= targetBudget) {
            const diff = Math.abs(monthlyCost - targetBudget);

            if (diff < bestDiff) {
                bestDiff = diff;
                bestOption = {
                    inputs: { ...testInputs },
                    monthlyCost,
                    capacity,
                    capacityLabel: capacityInput.label,
                    budgetUtilization: (monthlyCost / maxBudget) * 100,
                    bufferAmount: maxBudget - monthlyCost
                };
            }
        }
    }

    return bestOption;
}

/**
 * Get default inputs for a model
 */
export function getDefaultInputs(model) {
    const inputs = {};
    model.inputs.forEach(input => {
        inputs[input.name] = input.default || 0;
    });
    return inputs;
}

/**
 * Calculate monthly cost for given inputs
 */
export function calculateMonthlyCost(modelKey, inputs) {
    const model = models[modelKey];
    if (!model) return 0;

    // Run calculation for just first month
    const results = model.calculate(inputs, 1);
    if (!results || results.length === 0) return 0;

    // Extract monthly revenue/cost
    const firstMonth = results[0];
    return firstMonth.totalRevenue || firstMonth.revenue || firstMonth.mrr || 0;
}

/**
 * Sort options by priority
 */
export function sortOptionsByPriority(options, priority, budget) {
    if (priority === 'max-users') {
        return options.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
    } else if (priority === 'best-value') {
        return options.sort((a, b) => (a.costPerUnit || Infinity) - (b.costPerUnit || Infinity));
    } else if (priority === 'budget-conscious') {
        return options.sort((a, b) => (b.bufferAmount || 0) - (a.bufferAmount || 0));
    } else {
        // Default: sort by utilization closest to budget
        return options.sort((a, b) => {
            const aDiff = Math.abs(a.budgetUtilization - 100);
            const bDiff = Math.abs(b.budgetUtilization - 100);
            return aDiff - bDiff;
        });
    }
}

/**
 * Display client budget results
 */
export function displayClientBudgetResults(options, budget, maxBudget) {
    const panel = document.getElementById('clientBudgetResultsPanel');
    const content = document.getElementById('clientBudgetResultsContent');

    // Show client budget panel (other panels already hidden by hideAllResultPanels)
    panel.classList.remove('hidden');

    if (options.length === 0) {
        content.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-400">No options found within your budget. Try increasing your budget or adjusting requirements.</p>
            </div>
        `;
        return;
    }

    // Build HTML for options
    let html = `
        <div class="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <div class="text-xs text-gray-400">Your Budget</div>
                    <div class="text-xl font-bold text-white">${formatCurrency(budget)}/mo</div>
                </div>
                <div>
                    <div class="text-xs text-gray-400">Maximum (with flexibility)</div>
                    <div class="text-xl font-bold text-gray-300">${formatCurrency(maxBudget)}/mo</div>
                </div>
            </div>
        </div>

        <div class="space-y-4">
    `;

    // Show top options (limit to 4-6 options)
    const displayOptions = clientBudgetState.showMultipleOptions ? options.slice(0, 6) : options.slice(0, 1);

    displayOptions.forEach((option, index) => {
        const isOverBudget = option.monthlyCost > budget;
        const isWithinFlex = option.monthlyCost <= maxBudget;
        const borderColor = isOverBudget ? (isWithinFlex ? 'border-yellow-600' : 'border-red-600') : 'border-green-600';
        const badgeColor = isOverBudget ? (isWithinFlex ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200') : 'bg-green-900 text-green-200';
        const badgeText = isOverBudget ? (isWithinFlex ? 'Within Flexibility' : 'Over Budget') : 'Within Budget';

        html += `
            <div class="bg-gray-700 rounded-lg p-5 border-2 ${borderColor}">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h3 class="text-lg font-semibold text-white">${option.modelName}</h3>
                            <span class="text-xs px-2 py-1 rounded ${badgeColor}">${badgeText}</span>
                        </div>
                        <div class="text-sm text-gray-400">${option.strategyLabel}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-white">${formatCurrency(option.monthlyCost)}</div>
                        <div class="text-xs text-gray-400">per month</div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-3">
                    ${option.capacity ? `
                    <div>
                        <div class="text-xs text-gray-400">${option.capacityLabel}</div>
                        <div class="text-lg font-semibold text-blue-400">${formatNumber(option.capacity)}</div>
                    </div>
                    ` : ''}
                    ${option.costPerUnit ? `
                    <div>
                        <div class="text-xs text-gray-400">Cost Per Unit</div>
                        <div class="text-lg font-semibold text-blue-400">${formatCurrency(option.costPerUnit)}</div>
                    </div>
                    ` : ''}
                    <div>
                        <div class="text-xs text-gray-400">Budget Utilization</div>
                        <div class="text-lg font-semibold text-blue-400">${option.budgetUtilization.toFixed(1)}%</div>
                    </div>
                    ${option.bufferAmount ? `
                    <div>
                        <div class="text-xs text-gray-400">Budget Buffer</div>
                        <div class="text-lg font-semibold text-green-400">${formatCurrency(option.bufferAmount)}</div>
                    </div>
                    ` : ''}
                </div>

                <details class="mt-3">
                    <summary class="text-sm text-blue-400 cursor-pointer hover:text-blue-300">View Configuration Details</summary>
                    <div class="mt-2 p-3 bg-gray-800 rounded text-xs">
                        <div class="grid grid-cols-2 gap-2">
                            ${Object.entries(option.inputs).map(([key, value]) => `
                                <div>
                                    <span class="text-gray-400">${key}:</span>
                                    <span class="text-gray-200">${formatNumber(value)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </details>
            </div>
        `;
    });

    html += `</div>`;

    content.innerHTML = html;
}

/**
 * Gather inputs for a specific model
 */
export function gatherInputs(modelKey) {
    const model = models[modelKey];
    if (!model) return {};

    const inputs = {};
    for (const input of model.inputs) {
        const inputId = `${modelKey}-${input.name}`;
        const element = document.getElementById(inputId);
        if (element) {
            inputs[input.name] = parseFloat(element.value) || input.default || 0;
        } else {
            inputs[input.name] = input.default || 0;
        }
    }
    return inputs;
}

/**
 * Render single model view
 */
export function renderSingleModel(modelKey, results, inputs) {
    // Clear any running race chart animation
    if (raceChartAnimation) {
        clearInterval(raceChartAnimation);
        raceChartAnimation = null;
    }

    // Display variables summary
    const allInputs = new Map();
    allInputs.set(modelKey, inputs);
    const variablesSummary = displayVariablesSummary(new Set([modelKey]), allInputs);
    const metricsPanel = document.getElementById('metricsPanel');
    if (variablesSummary) {
        metricsPanel.parentElement.insertBefore(variablesSummary, metricsPanel);
    }

    // Show single model views
    renderCharts(modelKey, results);
    updateMetrics(modelKey, results);
}

/**
 * Render multi-model comparison view
 */
export function renderComparison(allResults, allInputs, comparison) {
    // Render executive summary and insert before universal metrics panel
    const executiveSummary = renderExecutiveSummary(allResults, allInputs);
    const metricsPanel = document.getElementById('universalMetricsPanel');
    if (executiveSummary) {
        metricsPanel.parentElement.insertBefore(executiveSummary, metricsPanel);
    }

    // Display variables summary
    const variablesSummary = displayVariablesSummary(new Set(allResults.keys()), allInputs);
    if (variablesSummary) {
        metricsPanel.parentElement.insertBefore(variablesSummary, metricsPanel);
    }

    // Show comparison views
    renderUniversalMetrics(allResults, allInputs);
    renderComparisonCharts(allResults, comparison);
    renderRaceChart(allResults);
    renderComparisonTable(allResults);
}

/**
 * Display variables/inputs summary panel
 */
export function displayVariablesSummary(modelKeys, allInputs) {
    // Remove existing variables summary if present
    const existingSummary = document.getElementById('variables-summary-panel');
    if (existingSummary) {
        existingSummary.remove();
    }

    const summaryDiv = document.createElement('div');
    summaryDiv.id = 'variables-summary-panel';
    summaryDiv.className = 'variables-summary bg-gray-800 shadow-sm rounded-lg p-6 mb-6 border border-gray-700';

    let html = `
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-100">📋 Input Variables Used</h2>
            <span class="text-xs text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" onclick="showCalculationInfo('${Array.from(modelKeys)[0]}')">ⓘ Calculation Details</span>
        </div>
    `;

    // Display variables for each model
    modelKeys.forEach(modelKey => {
        const model = models[modelKey];
        const inputs = allInputs.get(modelKey);
        if (!inputs) return;

        html += `
            <div class="mb-4 last:mb-0">
                <div class="flex items-center gap-2 mb-3">
                    <h3 class="text-lg font-semibold text-gray-200">${model.name}</h3>
                    ${modelKeys.size > 1 ? '' : `<span class="text-xs text-blue-400 cursor-pointer hover:text-blue-300" onclick="showCalculationInfo('${modelKey}')">ⓘ</span>`}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        `;

        model.inputs.forEach(input => {
            const value = inputs[input.name];
            let formattedValue;

            if (input.type === 'currency') {
                formattedValue = formatCurrency(value);
            } else if (input.type === 'percent') {
                formattedValue = value.toFixed(2) + '%';
            } else {
                formattedValue = value.toLocaleString();
            }

            html += `
                <div class="bg-gray-700 rounded-md p-3 border border-gray-600">
                    <div class="flex items-center justify-between mb-1">
                        <div class="text-xs text-gray-400">${input.label}</div>
                        <span class="text-xs text-blue-400 cursor-pointer hover:text-blue-300" onclick="showInputInfo('${modelKey}', '${input.name}')">ⓘ</span>
                    </div>
                    <div class="text-lg font-semibold text-gray-100">${formattedValue}</div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    summaryDiv.innerHTML = html;
    return summaryDiv;
}

/**
 * Render executive summary panel
 */
export function renderExecutiveSummary(allResults, allInputs) {
    const summaryDiv = document.createElement('div');
    summaryDiv.id = 'executive-summary';
    summaryDiv.className = 'bg-gray-800 shadow-sm rounded-lg p-6 mb-6 border border-gray-700';

    // Calculate metrics for all models
    const metricsData = [];
    for (const [modelKey, results] of allResults) {
        const inputs = allInputs.get(modelKey);
        const metrics = calculateUniversalMetrics(modelKey, results, inputs);
        if (metrics) {
            metricsData.push({ modelKey, modelName: models[modelKey].name, metrics });
        }
    }

    if (metricsData.length === 0) return null;

    // Find best models for each category
    const bestRevenue = metricsData.reduce((a, b) =>
        a.metrics.totalRevenue > b.metrics.totalRevenue ? a : b
    );
    const bestEfficiency = metricsData.reduce((a, b) =>
        a.metrics.ltvCacRatio > b.metrics.ltvCacRatio ? a : b
    );
    const bestPayback = metricsData.reduce((a, b) =>
        a.metrics.paybackPeriod < b.metrics.paybackPeriod ? a : b
    );

    let html = `
        <h2 class="text-xl font-semibold text-gray-100 mb-4">📊 Executive Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
                <div class="text-xs text-blue-200 mb-1">💵 Highest Total Revenue</div>
                <div class="text-lg font-bold text-white">${bestRevenue.modelName}</div>
                <div class="text-sm text-blue-100 mt-1">${formatCurrency(bestRevenue.metrics.totalRevenue)}</div>
            </div>
            <div class="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-700">
                <div class="text-xs text-green-200 mb-1">⚡ Best Efficiency (LTV:CAC)</div>
                <div class="text-lg font-bold text-white">${bestEfficiency.modelName}</div>
                <div class="text-sm text-green-100 mt-1">${bestEfficiency.metrics.ltvCacRatio.toFixed(2)}:1 ratio</div>
            </div>
            <div class="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
                <div class="text-xs text-purple-200 mb-1">🚀 Fastest CAC Payback</div>
                <div class="text-lg font-bold text-white">${bestPayback.modelName}</div>
                <div class="text-sm text-purple-100 mt-1">${bestPayback.metrics.paybackPeriod.toFixed(1)} months</div>
            </div>
        </div>
    `;

    summaryDiv.innerHTML = html;
    return summaryDiv;
}

/**
 * Generate recommendation based on comparison data
 */
export function generateRecommendation(metricsData, bestRevenue, bestEfficiency, bestPayback) {
    if (bestRevenue.modelKey === bestEfficiency.modelKey) {
        return `<strong>${bestRevenue.modelName}</strong> is the clear winner with both the highest revenue AND best efficiency. This model provides the optimal balance of growth and profitability.`;
    } else if (bestRevenue.modelKey === bestPayback.modelKey) {
        return `<strong>${bestRevenue.modelName}</strong> leads in total revenue and has the fastest payback period, making it ideal for capital-efficient growth.`;
    } else if (bestEfficiency.modelKey === bestPayback.modelKey) {
        return `<strong>${bestEfficiency.modelName}</strong> offers the best unit economics with top efficiency and fastest payback. Choose <strong>${bestRevenue.modelName}</strong> if maximum revenue is the priority.`;
    } else {
        return `Each model excels in different areas: <strong>${bestRevenue.modelName}</strong> for maximum revenue, <strong>${bestEfficiency.modelName}</strong> for sustainable unit economics, and <strong>${bestPayback.modelName}</strong> for capital efficiency. Choose based on your strategic priorities.`;
    }
}

/**
 * Render universal metrics comparison for all selected models
 */
export function renderUniversalMetrics(allResults, allInputs) {
    const panel = document.getElementById('universalMetricsPanel');
    const content = document.getElementById('universalMetricsContent');

    panel.classList.remove('hidden');
    content.innerHTML = '';

    // Add category context header
    if (selectedCategory) {
        const categoryInfo = LAYER_1_CATEGORIES[selectedCategory];
        const deliveryInfo = selectedDelivery ? LAYER_2_DELIVERY[selectedDelivery] : null;
        const serviceInfo = selectedService ? LAYER_3_SERVICE[selectedService] : null;

        const contextHeader = document.createElement('div');
        contextHeader.className = 'bg-gray-800 rounded-lg p-4 mb-6 border border-gray-600';

        let contextHTML = `<h3 class="text-lg font-semibold text-blue-400 mb-2">Calculation Context</h3>`;
        contextHTML += `<div class="space-y-1 text-sm">`;
        contextHTML += `<div><span class="text-gray-400">Category:</span> <span class="text-gray-100 font-medium">${categoryInfo.name}</span></div>`;

        if (deliveryInfo) {
            contextHTML += `<div><span class="text-gray-400">Delivery:</span> <span class="text-gray-100 font-medium">${deliveryInfo.name}</span>`;
            if (deliveryInfo.costImpact) {
                contextHTML += ` <span class="text-gray-500 text-xs">(${deliveryInfo.costImpact})</span>`;
            }
            contextHTML += `</div>`;
        }

        if (serviceInfo) {
            contextHTML += `<div><span class="text-gray-400">Service Model:</span> <span class="text-gray-100 font-medium">${serviceInfo.name}</span>`;
            if (serviceInfo.characteristics && serviceInfo.characteristics.length > 0) {
                contextHTML += ` <span class="text-gray-500 text-xs">(${serviceInfo.characteristics[0]})</span>`;
            }
            contextHTML += `</div>`;
        }

        contextHTML += `</div>`;
        contextHeader.innerHTML = contextHTML;
        content.appendChild(contextHeader);
    }

    // Calculate universal metrics for each model
    const metricsData = [];
    for (const [modelKey, results] of allResults) {
        const inputs = allInputs.get(modelKey);
        const metrics = calculateUniversalMetrics(modelKey, results, inputs);
        if (metrics) {
            metricsData.push({ modelKey, modelName: models[modelKey].name, metrics });
        }
    }

    // Create comparison cards grid
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

    // Metrics to display
    const metricsToShow = [
        { key: 'totalRevenue', label: 'Total Revenue', format: formatCurrency },
        { key: 'finalMonthRevenue', label: 'Final Month Revenue', format: formatCurrency },
        { key: 'avgMonthlyGrowth', label: 'Avg Monthly Growth', format: (v) => formatPercentage(v) },
        { key: 'estimatedLTV', label: 'Estimated LTV', format: formatCurrency },
        { key: 'ltvCacRatio', label: 'LTV:CAC Ratio', format: (v) => v.toFixed(2) + ':1' },
        { key: 'paybackPeriod', label: 'Payback Period', format: (v) => v.toFixed(1) + ' months' }
    ];

    metricsToShow.forEach(metric => {
        const metricInfo = METRIC_EXPLANATIONS[metric.key];
        const higherIsBetter = metricInfo?.higherIsBetter !== false;

        // Count how many values are null, undefined, or zero
        const emptyCount = metricsData.filter(data => {
            const value = data.metrics[metric.key];
            return value === null || value === undefined || value === 0;
        }).length;

        // Skip rendering this card if all values are empty, or if more than 50% are empty
        if (emptyCount === metricsData.length || emptyCount > metricsData.length / 2) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'bg-gray-700 rounded-lg p-4 relative metric-card';

        // Metric label with info icon
        const labelContainer = document.createElement('div');
        labelContainer.className = 'flex items-center justify-between mb-2';

        const label = document.createElement('div');
        label.className = 'text-sm text-gray-400';
        label.textContent = metric.label;

        const infoIcon = document.createElement('span');
        infoIcon.className = 'text-xs text-blue-400 cursor-pointer hover:text-blue-300 transition-colors';
        infoIcon.textContent = 'ⓘ';
        infoIcon.onclick = () => showMetricInfo(metric.key);

        labelContainer.appendChild(label);
        labelContainer.appendChild(infoIcon);
        card.appendChild(labelContainer);

        // Find winner for this metric
        const values = metricsData.map(d => ({
            ...d,
            value: d.metrics[metric.key] || 0
        }));

        values.sort((a, b) => higherIsBetter ? b.value - a.value : a.value - b.value);
        const winner = values[0];

        // Render each model's value with highlights for top performers
        metricsData.forEach(data => {
            const metricValue = data.metrics[metric.key] || 0;
            const isBest = data.modelKey === winner.modelKey;
            const percentDiff = winner.value !== 0
                ? Math.abs(((metricValue - winner.value) / winner.value) * 100)
                : 0;

            // Highlight top 3 performers with different intensities
            const rank = values.findIndex(v => v.modelKey === data.modelKey);
            const isTop3 = rank < 3;
            const highlightClass = rank === 0 ? 'bg-blue-900 bg-opacity-30 border-l-2 border-blue-500' :
                                   rank === 1 ? 'bg-blue-900 bg-opacity-20 border-l-2 border-blue-600' :
                                   rank === 2 ? 'bg-blue-900 bg-opacity-10 border-l-2 border-blue-700' : '';

            const row = document.createElement('div');
            row.className = `flex justify-between items-center mt-2 ${isTop3 ? 'p-2 -mx-2 rounded ' + highlightClass : ''}`;

            const modelNameContainer = document.createElement('div');
            modelNameContainer.className = 'flex items-center gap-1';

            const modelName = document.createElement('span');
            modelName.className = `text-xs ${isBest ? 'text-blue-300 font-semibold' : isTop3 ? 'text-gray-200' : 'text-gray-300'}`;
            modelName.textContent = data.modelName;
            modelNameContainer.appendChild(modelName);

            const valueContainer = document.createElement('div');
            valueContainer.className = 'text-right';

            const value = document.createElement('div');
            value.className = `text-sm font-semibold ${isBest ? 'text-blue-200' : 'text-gray-100'}`;

            // Handle null/undefined/zero values properly
            if (metricValue === null || metricValue === undefined) {
                value.textContent = 'N/A';
                value.className += ' text-gray-500';
            } else {
                value.textContent = metric.format(metricValue);
            }
            valueContainer.appendChild(value);

            // Show percentage difference for non-best performers
            if (!isBest && percentDiff > 0.1 && metricValue !== null && metricValue !== undefined) {
                const diff = document.createElement('div');
                diff.className = 'text-xs text-gray-500';
                diff.textContent = `(-${percentDiff.toFixed(1)}%)`;
                valueContainer.appendChild(diff);
            }

            // Show interpretation if available
            const interpretation = getMetricInterpretation(metric.key, metricValue);
            if (interpretation) {
                const interpSpan = document.createElement('div');
                interpSpan.className = 'text-xs mt-1';
                interpSpan.textContent = interpretation;
                valueContainer.appendChild(interpSpan);
            }

            row.appendChild(modelNameContainer);
            row.appendChild(valueContainer);
            card.appendChild(row);
        });

        grid.appendChild(card);
    });

    content.appendChild(grid);
}

/**
 * Render comparison charts for all selected models
 */
export function renderComparisonCharts(allResults, comparison) {
    const container = document.getElementById('comparisonChartsContainer');
    container.classList.remove('hidden');
    container.innerHTML = '';

    if (comparison.type === 'family') {
        // Same family - create overlay charts
        renderFamilyOverlayChart(container, allResults, comparison.family);
    } else {
        // Different families - create side-by-side revenue charts
        renderSideBySideCharts(container, allResults);
    }
}

/**
 * Render overlay chart for same family models
 */
export function renderFamilyOverlayChart(container, allResults, family) {
    const chartDiv = document.createElement('div');
    chartDiv.className = 'bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700';
    chartDiv.id = 'familyOverlayChart';
    container.appendChild(chartDiv);

    // Prepare series data for overlay
    const series = [];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const annotations = [];
    let colorIndex = 0;
    let hasNonZeroData = false;

    for (const [modelKey, results] of allResults) {
        // Determine which metric to use based on family
        let dataKey = 'revenue';
        if (family.commonMetrics.includes('mrr')) {
            dataKey = 'mrr';
        } else if (family.commonMetrics.includes('revenue')) {
            dataKey = 'revenue';
        } else if (family.commonMetrics.includes('totalRevenue')) {
            dataKey = 'totalRevenue';
        }

        const data = results.map(r => ({
            x: `Month ${r.month}`,
            y: r[dataKey] || r.revenue || r.mrr || r.totalRevenue || 0
        }));

        // Check if all values are zero
        const allZero = data.every(d => d.y === 0);
        if (!allZero) {
            hasNonZeroData = true;
        }

        series.push({
            name: models[modelKey].name,
            data: data.map(d => d.y),
            color: allZero ? '#6B7280' : colors[colorIndex % colors.length],
            dashArray: allZero ? 5 : 0
        });

        if (allZero) {
            annotations.push({
                y: 0,
                label: {
                    borderColor: '#EF4444',
                    style: { color: '#fff', background: '#EF4444' },
                    text: `⚠️ ${models[modelKey].name}: Zero Revenue - Check inputs`
                }
            });
        }

        colorIndex++;
    }

    // If all models have zero revenue, show empty state
    if (!hasNonZeroData) {
        chartDiv.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📊</div>
                <div class="text-xl font-semibold text-gray-200 mb-2">No Revenue Data</div>
                <div class="text-sm text-gray-400 mb-4">All models are generating zero revenue. This usually happens when:</div>
                <ul class="text-sm text-gray-400 text-left max-w-md mx-auto space-y-1">
                    <li>• New customers per month = 0</li>
                    <li>• Price per unit = 0</li>
                    <li>• Churn rate exceeds acquisition rate</li>
                </ul>
                <div class="mt-4 text-sm text-blue-400">💡 Check the validation warnings above and adjust your inputs</div>
            </div>
        `;
        return;
    }

    // Create ApexCharts overlay
    const options = {
        series: series,
        chart: {
            type: 'line',
            height: 400,
            background: '#1F2937',
            toolbar: { show: true }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            categories: series[0]?.data.map((_, i) => `Month ${i + 1}`) || [],
            labels: { style: { colors: '#9CA3AF' } }
        },
        yaxis: {
            labels: {
                style: { colors: '#9CA3AF' },
                formatter: (value) => formatCurrency(value)
            }
        },
        legend: {
            labels: { colors: '#9CA3AF' }
        },
        title: {
            text: `${family.name} - Revenue Comparison`,
            style: { color: '#F3F4F6' }
        },
        annotations: annotations.length > 0 ? { yaxis: annotations } : {},
        theme: { mode: 'dark' }
    };

    const chart = new ApexCharts(chartDiv, options);
    chart.render();
}

/**
 * Render side-by-side charts for different family models
 */
export function renderSideBySideCharts(container, allResults) {
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    let colorIndex = 0;

    for (const [modelKey, results] of allResults) {
        const chartDiv = document.createElement('div');
        chartDiv.className = 'bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-700';
        chartDiv.id = `comparison-chart-${modelKey}`;

        // Determine revenue metric
        const revenueData = results.map(r => r.totalRevenue || r.revenue || r.mrr || 0);

        // Check if all revenue is zero
        const allZero = revenueData.every(v => v === 0);

        if (allZero) {
            chartDiv.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-4xl mb-2">⚠️</div>
                    <div class="text-lg font-semibold text-gray-200 mb-1">${models[modelKey].name}</div>
                    <div class="text-sm text-gray-400">Zero Revenue</div>
                    <div class="text-xs text-gray-500 mt-2">Check inputs and validation warnings</div>
                </div>
            `;
            grid.appendChild(chartDiv);
        } else {
            const options = {
                series: [{
                    name: 'Revenue',
                    data: revenueData,
                    color: colors[colorIndex % colors.length]
                }],
                chart: {
                    type: 'area',
                    height: 300,
                    background: '#1F2937',
                    toolbar: { show: false }
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.6,
                        opacityTo: 0.1
                    }
                },
                xaxis: {
                    categories: results.map(r => `Month ${r.month}`),
                    labels: { style: { colors: '#9CA3AF' } }
                },
                yaxis: {
                    labels: {
                        style: { colors: '#9CA3AF' },
                        formatter: (value) => formatCurrency(value)
                    }
                },
                title: {
                    text: models[modelKey].name,
                    style: { color: '#F3F4F6' }
                },
                theme: { mode: 'dark' }
            };

            const chart = new ApexCharts(chartDiv, options);
            chart.render();
            grid.appendChild(chartDiv);
        }

        colorIndex++;
    }

    container.appendChild(grid);
}

/**
 * Render comparison table with month-by-month data
 */
export function renderComparisonTable(allResults) {
    const container = document.getElementById('comparisonTableContainer');
    const table = document.getElementById('comparisonTable');

    container.classList.remove('hidden');
    table.innerHTML = '';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.className = 'border-b border-gray-700';

    const monthHeader = document.createElement('th');
    monthHeader.className = 'text-left py-2 px-3 text-gray-300 font-semibold';
    monthHeader.textContent = 'Month';
    headerRow.appendChild(monthHeader);

    for (const [modelKey, _] of allResults) {
        const th = document.createElement('th');
        th.className = 'text-right py-2 px-3 text-gray-300 font-semibold';
        th.textContent = models[modelKey].name;
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    const maxMonths = Math.max(...Array.from(allResults.values()).map(r => r.length));

    for (let i = 0; i < maxMonths; i++) {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-800 hover:bg-gray-750';

        const monthCell = document.createElement('td');
        monthCell.className = 'py-2 px-3 text-gray-400';
        monthCell.textContent = `Month ${i + 1}`;
        row.appendChild(monthCell);

        for (const [modelKey, results] of allResults) {
            const cell = document.createElement('td');
            cell.className = 'py-2 px-3 text-right text-gray-200';

            if (results[i]) {
                const revenue = results[i].totalRevenue || results[i].revenue || results[i].mrr || 0;
                cell.textContent = formatCurrency(revenue);
            } else {
                cell.textContent = '-';
            }

            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
}

/**
 * Render cumulative revenue line chart
 */
let cumulativeChartInstance = null;

export function renderRaceChart(allResults) {
    const container = document.getElementById('raceChartContainer');
    const chartDiv = document.getElementById('raceChart');

    container.classList.remove('hidden');
    chartDiv.innerHTML = '';

    // Prepare data for cumulative chart
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
    const modelKeys = Array.from(allResults.keys());
    const maxMonths = Math.max(...Array.from(allResults.values()).map(r => r.length));

    // Calculate cumulative revenue for each model
    const series = modelKeys.map((modelKey, idx) => {
        const results = allResults.get(modelKey);
        let cumulativeRevenue = 0;
        const cumulativeData = [];

        for (let month = 0; month < maxMonths; month++) {
            const monthlyRevenue = results[month] ? (results[month].totalRevenue || results[month].revenue || results[month].mrr || 0) : 0;
            cumulativeRevenue += monthlyRevenue;
            cumulativeData.push(cumulativeRevenue);
        }

        return {
            name: models[modelKey].name,
            data: cumulativeData
        };
    });

    // Create categories (month labels)
    const categories = Array.from({ length: maxMonths }, (_, i) => `Month ${i + 1}`);

    // Destroy previous chart instance if exists
    if (cumulativeChartInstance) {
        cumulativeChartInstance.destroy();
    }

    // Create ApexCharts line chart
    const options = {
        series: series,
        chart: {
            type: 'line',
            height: 400,
            background: 'transparent',
            foreColor: '#9CA3AF',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        colors: colors,
        stroke: {
            width: 3,
            curve: 'smooth'
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    colors: '#9CA3AF'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#9CA3AF'
                },
                formatter: function(value) {
                    return formatCurrency(value);
                }
            }
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: function(value) {
                    return formatCurrency(value);
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            labels: {
                colors: '#9CA3AF'
            }
        },
        grid: {
            borderColor: '#374151',
            strokeDashArray: 4
        },
        markers: {
            size: 0,
            hover: {
                size: 6
            }
        }
    };

    cumulativeChartInstance = new ApexCharts(chartDiv, options);
    cumulativeChartInstance.render();
}

// Legacy functions kept for compatibility but not used
export function updateRaceChartDisplay(month) {
    // Deprecated - chart is now static cumulative line chart
}

export function setupRaceChartControls() {
    // Deprecated - chart is now static cumulative line chart
}

