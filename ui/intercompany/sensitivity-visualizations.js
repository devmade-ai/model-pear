// ========== SENSITIVITY VISUALIZATIONS UI ==========
// Phase 11.3: Sensitivity Visualizations
// Provides UI components for tornado charts, fan charts, break-even analysis, and Monte Carlo results.

import {
    calculateScenarios,
    calculateInputSensitivity,
    calculateBreakEven,
    runMonteCarloSimulation,
    generateTornadoChartData,
    generateFanChartData,
    generateBreakEvenChartData,
    generateMonteCarloChartData
} from '../../models/intercompany/sensitivity-analysis.js';
import { formatCurrency, formatPercentage } from '../../utils/index.js';

// ========== STATE ==========

let currentSensitivityData = null;
let activeTab = 'scenarios';
let monteCarloIterations = 1000;

// ========== INITIALIZATION ==========

/**
 * Initialize sensitivity visualizations panel
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Configuration options
 */
export function initSensitivityVisualizations(container, options = {}) {
    if (!container) return;

    currentSensitivityData = options.sensitivityData || null;

    renderSensitivityPanel(container, options);
}

/**
 * Render the main sensitivity panel
 */
function renderSensitivityPanel(container, options) {
    const hasData = currentSensitivityData !== null;

    container.innerHTML = `
        <div class="sensitivity-visualizations">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">📈</span>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-100">Sensitivity Analysis</h3>
                        <p class="text-sm text-gray-400">Explore scenarios, sensitivities, and risk profiles</p>
                    </div>
                </div>
                ${hasData ? `
                    <button id="runMonteCarloBtn" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                        <span>🎲</span> Run Monte Carlo
                    </button>
                ` : ''}
            </div>

            ${!hasData ? `
                <div class="text-center py-12 text-gray-400">
                    <span class="text-4xl mb-4 block">📊</span>
                    <p class="mb-2">No sensitivity data available</p>
                    <p class="text-sm">Enable range mode and calculate to see sensitivity analysis</p>
                </div>
            ` : `
                <!-- Tab Navigation -->
                <div class="bg-gray-700/50 rounded-lg p-1 mb-6">
                    <div class="flex gap-1">
                        <button class="sensitivity-tab-btn flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'scenarios' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}" data-tab="scenarios">
                            Scenarios
                        </button>
                        <button class="sensitivity-tab-btn flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'tornado' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}" data-tab="tornado">
                            Tornado
                        </button>
                        <button class="sensitivity-tab-btn flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'breakeven' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}" data-tab="breakeven">
                            Break-Even
                        </button>
                        <button class="sensitivity-tab-btn flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'montecarlo' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}" data-tab="montecarlo">
                            Monte Carlo
                        </button>
                    </div>
                </div>

                <!-- Tab Content -->
                <div id="sensitivityTabContent" class="sensitivity-tab-content">
                    ${renderTabContent(activeTab)}
                </div>
            `}
        </div>
    `;

    setupEventListeners(container, options);
}

/**
 * Render content for active tab
 */
function renderTabContent(tab) {
    if (!currentSensitivityData) return '';

    switch (tab) {
        case 'scenarios':
            return renderScenariosTab();
        case 'tornado':
            return renderTornadoTab();
        case 'breakeven':
            return renderBreakEvenTab();
        case 'montecarlo':
            return renderMonteCarloTab();
        default:
            return '';
    }
}

// ========== SCENARIO COMPARISON TAB ==========

function renderScenariosTab() {
    const { scenarios } = currentSensitivityData;
    if (!scenarios || scenarios.error) {
        return `<div class="text-center py-8 text-gray-400">Unable to calculate scenarios</div>`;
    }

    const { base, best, worst, summary } = scenarios;

    return `
        <div class="scenarios-view">
            <!-- Scenario Summary Cards -->
            <div class="grid grid-cols-3 gap-4 mb-6">
                ${renderScenarioCard('Worst Case', worst, 'red', '📉')}
                ${renderScenarioCard('Base Case', base, 'blue', '📊')}
                ${renderScenarioCard('Best Case', best, 'green', '📈')}
            </div>

            <!-- Fan Chart Visualization -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Profit Range Visualization</h4>
                ${renderFanChart(scenarios)}
            </div>

            <!-- Scenario Comparison Table -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Scenario Comparison</h4>
                ${renderScenarioComparisonTable(scenarios)}
            </div>

            <!-- Key Insights -->
            ${summary ? `
                <div class="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <h4 class="text-sm font-medium text-blue-300 mb-2">Key Insights</h4>
                    <ul class="text-sm text-gray-300 space-y-1">
                        ${Object.entries(summary).map(([key, data]) => `
                            <li class="flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full ${data.volatility > 0.5 ? 'bg-red-500' : data.volatility > 0.25 ? 'bg-yellow-500' : 'bg-green-500'}"></span>
                                ${data.label}: Range ${formatCurrency(data.worst)} to ${formatCurrency(data.best)} (${(data.volatility * 100).toFixed(0)}% volatility)
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

function renderScenarioCard(title, scenario, color, icon) {
    if (!scenario?.results) return '';

    const profit = scenario.results.developer?.profit?.net || 0;
    const colorClasses = {
        red: 'bg-red-900/30 border-red-700/50 text-red-300',
        blue: 'bg-blue-900/30 border-blue-700/50 text-blue-300',
        green: 'bg-green-900/30 border-green-700/50 text-green-300'
    };

    return `
        <div class="p-4 rounded-lg border ${colorClasses[color]}">
            <div class="flex items-center gap-2 mb-2">
                <span class="text-xl">${icon}</span>
                <span class="font-medium">${title}</span>
            </div>
            <div class="text-2xl font-bold mb-1">
                ${formatCurrency(profit)}
            </div>
            <div class="text-xs opacity-75">Developer Net Profit</div>
        </div>
    `;
}

function renderFanChart(scenarios) {
    const { base, best, worst } = scenarios;

    const baseProfit = base?.results?.developer?.profit?.net || 0;
    const bestProfit = best?.results?.developer?.profit?.net || 0;
    const worstProfit = worst?.results?.developer?.profit?.net || 0;

    const range = Math.max(Math.abs(bestProfit), Math.abs(worstProfit), Math.abs(baseProfit)) * 1.1;
    const scale = (value) => ((value + range) / (2 * range)) * 100;

    return `
        <div class="relative h-32">
            <!-- Background bands -->
            <div class="absolute inset-0 flex items-center">
                <div class="w-full h-16 bg-gradient-to-r from-red-900/20 via-blue-900/20 to-green-900/20 rounded"></div>
            </div>

            <!-- Value markers -->
            <div class="absolute inset-0">
                <!-- Worst marker -->
                <div class="absolute top-4 transform -translate-x-1/2" style="left: ${scale(worstProfit)}%">
                    <div class="w-3 h-3 rounded-full bg-red-500 border-2 border-red-300"></div>
                    <div class="text-xs text-red-400 mt-1 whitespace-nowrap">${formatCurrency(worstProfit)}</div>
                </div>

                <!-- Base marker -->
                <div class="absolute top-4 transform -translate-x-1/2" style="left: ${scale(baseProfit)}%">
                    <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-300"></div>
                    <div class="text-xs text-blue-400 mt-1 whitespace-nowrap font-medium">${formatCurrency(baseProfit)}</div>
                </div>

                <!-- Best marker -->
                <div class="absolute top-4 transform -translate-x-1/2" style="left: ${scale(bestProfit)}%">
                    <div class="w-3 h-3 rounded-full bg-green-500 border-2 border-green-300"></div>
                    <div class="text-xs text-green-400 mt-1 whitespace-nowrap">${formatCurrency(bestProfit)}</div>
                </div>

                <!-- Range bar -->
                <div class="absolute top-6 h-2 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 rounded"
                     style="left: ${scale(worstProfit)}%; right: ${100 - scale(bestProfit)}%"></div>
            </div>

            <!-- Scale labels -->
            <div class="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                <span>Worst</span>
                <span>Base</span>
                <span>Best</span>
            </div>
        </div>
    `;
}

function renderScenarioComparisonTable(scenarios) {
    const metrics = [
        { key: 'developer.profit.net', label: 'Developer Net Profit' },
        { key: 'buyer.totalCost', label: 'Buyer Total Cost' },
        { key: 'developer.revenue.total', label: 'Developer Revenue' },
        { key: 'combined.totalValue', label: 'Combined Value' }
    ];

    const getValue = (scenario, path) => {
        const parts = path.split('.');
        let value = scenario?.results;
        for (const part of parts) {
            value = value?.[part];
        }
        return value || 0;
    };

    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="text-left py-2 text-gray-400">Metric</th>
                        <th class="text-right py-2 text-red-400">Worst</th>
                        <th class="text-right py-2 text-blue-400">Base</th>
                        <th class="text-right py-2 text-green-400">Best</th>
                        <th class="text-right py-2 text-gray-400">Range</th>
                    </tr>
                </thead>
                <tbody>
                    ${metrics.map(metric => {
                        const worst = getValue(scenarios.worst, metric.key);
                        const base = getValue(scenarios.base, metric.key);
                        const best = getValue(scenarios.best, metric.key);
                        const range = Math.abs(best - worst);

                        return `
                            <tr class="border-b border-gray-800">
                                <td class="py-2 text-gray-300">${metric.label}</td>
                                <td class="py-2 text-right text-red-300">${formatCurrency(worst)}</td>
                                <td class="py-2 text-right text-blue-300 font-medium">${formatCurrency(base)}</td>
                                <td class="py-2 text-right text-green-300">${formatCurrency(best)}</td>
                                <td class="py-2 text-right text-gray-400">${formatCurrency(range)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ========== TORNADO CHART TAB ==========

function renderTornadoTab() {
    const { sensitivity } = currentSensitivityData;
    if (!sensitivity) {
        return `<div class="text-center py-8 text-gray-400">No sensitivity data available</div>`;
    }

    const tornadoData = generateTornadoChartData(sensitivity);

    return `
        <div class="tornado-view">
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-2">${tornadoData.title}</h4>
                <p class="text-xs text-gray-500 mb-4">${tornadoData.subtitle}</p>

                <!-- Base value indicator -->
                <div class="text-center mb-4">
                    <span class="text-sm text-gray-400">Base Profit: </span>
                    <span class="text-lg font-medium text-blue-400">${formatCurrency(tornadoData.baseValue)}</span>
                </div>

                <!-- Tornado Chart -->
                <div class="tornado-chart space-y-3">
                    ${tornadoData.series.map((item, index) => renderTornadoBar(item, tornadoData.baseValue, index)).join('')}
                </div>
            </div>

            <!-- Top Influencers -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Top 5 Input Influencers</h4>
                <div class="space-y-2">
                    ${sensitivity.topInfluencers.map((inf, idx) => `
                        <div class="flex items-center gap-3">
                            <span class="w-6 h-6 rounded-full bg-blue-600/30 text-blue-300 text-xs flex items-center justify-center">${idx + 1}</span>
                            <span class="flex-1 text-gray-300">${inf.label}</span>
                            <span class="text-sm ${inf.percentChange > 20 ? 'text-red-400' : inf.percentChange > 10 ? 'text-yellow-400' : 'text-green-400'}">
                                ${inf.percentChange.toFixed(1)}% impact
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderTornadoBar(item, baseValue, index) {
    // Calculate bar positions relative to base
    const maxDelta = Math.max(Math.abs(item.lowDelta), Math.abs(item.highDelta));
    const scale = maxDelta > 0 ? 40 / maxDelta : 0; // 40% max width for each side

    const lowWidth = Math.abs(item.lowDelta) * scale;
    const highWidth = Math.abs(item.highDelta) * scale;

    const lowIsNegative = item.lowDelta < 0;
    const highIsPositive = item.highDelta > 0;

    return `
        <div class="tornado-bar-row">
            <div class="flex items-center gap-2 mb-1">
                <span class="text-sm text-gray-300 w-40 truncate">${item.label}</span>
                <span class="text-xs text-gray-500">(${item.category})</span>
            </div>
            <div class="flex items-center h-6">
                <!-- Left side (negative impact) -->
                <div class="w-[45%] flex justify-end">
                    <div class="h-5 bg-red-600/60 rounded-l transition-all"
                         style="width: ${lowIsNegative ? lowWidth : highWidth}%"
                         title="${formatCurrency(lowIsNegative ? item.lowValue : item.highValue)}">
                    </div>
                </div>

                <!-- Center line -->
                <div class="w-[10%] flex justify-center">
                    <div class="w-0.5 h-8 bg-gray-500"></div>
                </div>

                <!-- Right side (positive impact) -->
                <div class="w-[45%]">
                    <div class="h-5 bg-green-600/60 rounded-r transition-all"
                         style="width: ${highIsPositive ? highWidth : lowWidth}%"
                         title="${formatCurrency(highIsPositive ? item.highValue : item.lowValue)}">
                    </div>
                </div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>${formatCurrency(item.lowValue)}</span>
                <span class="text-gray-600">|</span>
                <span>${formatCurrency(item.highValue)}</span>
            </div>
        </div>
    `;
}

// ========== BREAK-EVEN TAB ==========

function renderBreakEvenTab() {
    const { breakEven } = currentSensitivityData;
    if (!breakEven) {
        return `<div class="text-center py-8 text-gray-400">No break-even data available</div>`;
    }

    const breakEvenData = generateBreakEvenChartData(breakEven);

    return `
        <div class="breakeven-view">
            <!-- Profitability Status -->
            <div class="mb-6 p-4 rounded-lg ${breakEven.isProfitable ? 'bg-green-900/20 border border-green-700/30' : 'bg-red-900/20 border border-red-700/30'}">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${breakEven.isProfitable ? '✅' : '⚠️'}</span>
                    <div>
                        <span class="font-medium ${breakEven.isProfitable ? 'text-green-300' : 'text-red-300'}">
                            ${breakEven.isProfitable ? 'Currently Profitable' : 'Currently Unprofitable'}
                        </span>
                        <p class="text-sm text-gray-400">Base profit: ${formatCurrency(breakEven.baseProfit)}</p>
                    </div>
                </div>
            </div>

            <!-- Break-Even Chart -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Margin of Safety by Input</h4>
                <div class="space-y-4">
                    ${breakEvenData.data.map(item => renderBreakEvenBar(item)).join('')}
                </div>
            </div>

            <!-- Break-Even Summary -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Break-Even Points</h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-gray-700">
                                <th class="text-left py-2 text-gray-400">Input</th>
                                <th class="text-right py-2 text-gray-400">Current</th>
                                <th class="text-right py-2 text-gray-400">Break-Even</th>
                                <th class="text-right py-2 text-gray-400">Margin</th>
                                <th class="text-center py-2 text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.values(breakEven.breakEvenPoints).map(bp => `
                                <tr class="border-b border-gray-800">
                                    <td class="py-2 text-gray-300">${bp.label}</td>
                                    <td class="py-2 text-right text-blue-300">${formatCurrency(bp.baseValue)}</td>
                                    <td class="py-2 text-right text-gray-400">${formatCurrency(bp.breakEvenValue)}</td>
                                    <td class="py-2 text-right ${bp.margin > 20 ? 'text-green-400' : bp.margin > 10 ? 'text-yellow-400' : 'text-red-400'}">
                                        ${bp.margin.toFixed(1)}%
                                    </td>
                                    <td class="py-2 text-center">
                                        <span class="px-2 py-1 rounded text-xs ${bp.marginOfSafety === 'Safe' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}">
                                            ${bp.marginOfSafety}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderBreakEvenBar(item) {
    const maxMargin = 50;
    const width = Math.min(Math.abs(item.margin), maxMargin) / maxMargin * 100;

    return `
        <div class="breakeven-bar">
            <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-gray-300">${item.label}</span>
                <span class="text-xs ${item.margin > 20 ? 'text-green-400' : item.margin > 10 ? 'text-yellow-400' : 'text-red-400'}">
                    ${item.margin.toFixed(1)}% margin
                </span>
            </div>
            <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all"
                     style="width: ${width}%; background-color: ${item.color}">
                </div>
            </div>
        </div>
    `;
}

// ========== MONTE CARLO TAB ==========

function renderMonteCarloTab() {
    const { monteCarlo } = currentSensitivityData;

    if (!monteCarlo) {
        return `
            <div class="text-center py-12">
                <span class="text-4xl mb-4 block">🎲</span>
                <h4 class="text-lg font-medium text-gray-300 mb-2">Monte Carlo Simulation</h4>
                <p class="text-sm text-gray-400 mb-6">Run probabilistic analysis based on your input ranges</p>

                <div class="inline-flex items-center gap-3 mb-4">
                    <label class="text-sm text-gray-400">Iterations:</label>
                    <select id="mcIterations" class="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200">
                        <option value="100">100 (Fast)</option>
                        <option value="500">500</option>
                        <option value="1000" selected>1,000</option>
                        <option value="5000">5,000</option>
                        <option value="10000">10,000 (Slow)</option>
                    </select>
                </div>

                <button id="runMCFromTab" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto">
                    <span>🎲</span> Run Simulation
                </button>
            </div>
        `;
    }

    const mcData = generateMonteCarloChartData(monteCarlo);

    return `
        <div class="montecarlo-view">
            <!-- Summary Stats -->
            <div class="grid grid-cols-4 gap-4 mb-6">
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <div class="text-2xl font-bold text-blue-400">${formatCurrency(mcData.statistics.mean)}</div>
                    <div class="text-xs text-gray-400 mt-1">Expected Profit</div>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <div class="text-2xl font-bold text-gray-300">${formatCurrency(mcData.statistics.median)}</div>
                    <div class="text-xs text-gray-400 mt-1">Median</div>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <div class="text-2xl font-bold text-yellow-400">${formatCurrency(mcData.statistics.stdDev)}</div>
                    <div class="text-xs text-gray-400 mt-1">Std Deviation</div>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <div class="text-2xl font-bold ${mcData.probabilityOfLoss > 30 ? 'text-red-400' : mcData.probabilityOfLoss > 10 ? 'text-yellow-400' : 'text-green-400'}">
                        ${mcData.probabilityOfLoss.toFixed(1)}%
                    </div>
                    <div class="text-xs text-gray-400 mt-1">Probability of Loss</div>
                </div>
            </div>

            <!-- Histogram -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Profit Distribution</h4>
                ${renderHistogram(mcData)}
            </div>

            <!-- Confidence Interval -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-4">90% Confidence Interval</h4>
                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-red-400">P5: ${formatCurrency(mcData.confidence.low)}</span>
                            <span class="text-green-400">P95: ${formatCurrency(mcData.confidence.high)}</span>
                        </div>
                        <div class="h-4 bg-gray-700 rounded-full overflow-hidden relative">
                            <div class="absolute inset-y-0 bg-gradient-to-r from-red-600 via-blue-600 to-green-600 rounded-full"
                                 style="left: 5%; right: 5%"></div>
                            <div class="absolute top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 border-2 border-blue-600"
                                 style="left: 50%"></div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-medium text-gray-300">${formatCurrency(mcData.confidence.range)}</div>
                        <div class="text-xs text-gray-500">Range</div>
                    </div>
                </div>
            </div>

            <!-- Percentile Table -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Percentile Distribution</h4>
                <div class="grid grid-cols-7 gap-2 text-center">
                    ${['p5', 'p10', 'p25', 'p50', 'p75', 'p90', 'p95'].map(p => `
                        <div class="p-2 rounded ${p === 'p50' ? 'bg-blue-900/30 border border-blue-700/30' : 'bg-gray-700/30'}">
                            <div class="text-xs text-gray-400 mb-1">${p.toUpperCase()}</div>
                            <div class="text-sm font-medium ${p === 'p50' ? 'text-blue-300' : 'text-gray-300'}">
                                ${formatCurrency(monteCarlo.profit.percentiles[p])}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Re-run Button -->
            <div class="mt-6 text-center">
                <button id="rerunMC" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm">
                    Re-run with different iterations
                </button>
            </div>
        </div>
    `;
}

function renderHistogram(mcData) {
    if (!mcData.histogram || mcData.histogram.length === 0) {
        return '<div class="text-center text-gray-500">No histogram data</div>';
    }

    const maxFreq = Math.max(...mcData.histogram.map(b => b.frequency));
    const binCount = mcData.histogram.length;

    return `
        <div class="histogram flex items-end justify-between gap-0.5 h-40">
            ${mcData.histogram.map((bin, idx) => {
                const height = (bin.frequency / maxFreq) * 100;
                const isNegative = bin.binEnd < 0;
                const color = isNegative ? 'bg-red-600' : 'bg-blue-600';

                return `
                    <div class="histogram-bar flex-1 flex flex-col items-center justify-end" title="R${bin.binStart.toFixed(0)} - R${bin.binEnd.toFixed(0)}: ${bin.frequency.toFixed(1)}%">
                        <div class="${color} w-full rounded-t transition-all hover:opacity-80"
                             style="height: ${height}%"></div>
                    </div>
                `;
            }).join('')}
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>${formatCurrency(mcData.statistics.min)}</span>
            <span class="text-gray-400">Profit Distribution</span>
            <span>${formatCurrency(mcData.statistics.max)}</span>
        </div>
    `;
}

// ========== EVENT HANDLERS ==========

function setupEventListeners(container, options) {
    // Tab switching
    container.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.sensitivity-tab-btn');
        if (tabBtn) {
            activeTab = tabBtn.dataset.tab;
            renderSensitivityPanel(container, options);
            return;
        }

        // Monte Carlo button from header
        if (e.target.closest('#runMonteCarloBtn')) {
            runMonteCarlo(container, options);
            return;
        }

        // Monte Carlo button from tab
        if (e.target.closest('#runMCFromTab')) {
            const select = container.querySelector('#mcIterations');
            monteCarloIterations = parseInt(select?.value || '1000');
            runMonteCarlo(container, options);
            return;
        }

        // Re-run Monte Carlo
        if (e.target.closest('#rerunMC')) {
            currentSensitivityData.monteCarlo = null;
            renderSensitivityPanel(container, options);
            return;
        }
    });
}

function runMonteCarlo(container, options) {
    if (!options.modelId || !options.variantId || !options.ranges) {
        console.warn('Cannot run Monte Carlo: missing model/variant/ranges');
        return;
    }

    // Show loading state
    const btn = container.querySelector('#runMonteCarloBtn, #runMCFromTab');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="animate-spin">⏳</span> Running...';
    }

    setTimeout(() => {
        try {
            const mcResults = runMonteCarloSimulation(
                options.modelId,
                options.variantId,
                options.ranges,
                options.entityConfig,
                options.taxParams,
                monteCarloIterations
            );

            currentSensitivityData.monteCarlo = mcResults;
            activeTab = 'montecarlo';
            renderSensitivityPanel(container, options);
        } catch (error) {
            console.error('Monte Carlo error:', error);
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span>🎲</span> Run Monte Carlo';
            }
        }
    }, 100);
}

// ========== PUBLIC API ==========

/**
 * Update sensitivity data and re-render
 * @param {HTMLElement} container - Container element
 * @param {Object} newData - New sensitivity data
 * @param {Object} options - Configuration options
 */
export function updateSensitivityData(container, newData, options = {}) {
    currentSensitivityData = newData;
    renderSensitivityPanel(container, options);
}

/**
 * Get current sensitivity data
 */
export function getCurrentSensitivityData() {
    return currentSensitivityData;
}

/**
 * Destroy sensitivity visualizations
 */
export function destroySensitivityVisualizations() {
    currentSensitivityData = null;
    activeTab = 'scenarios';
}

// ========== EXPORTS ==========

export default {
    initSensitivityVisualizations,
    updateSensitivityData,
    getCurrentSensitivityData,
    destroySensitivityVisualizations
};
