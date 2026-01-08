// ========== ADVANCED VISUALIZATIONS UI ==========
// User interface for Phase 10: Advanced Visualisations module.
// Provides cross-model comparisons, timeline views, and risk visualizations.
//
// Part of Phase 10 implementation:
// - 10.1 Cross-Model Comparison Charts
// - 10.2 Timeline Visualisations
// - 10.3 Risk Visualisations

import { getState, subscribe } from '../../state/app-state.js';
import {
    VIZ_COLORS,
    generateCrossModelComparison,
    generateAssetTimeline,
    generateCashFlowWaterfall,
    generateAmortisationSchedule,
    generateProjectGantt,
    generateTPRiskHeatMap,
    generateRiskReturnQuadrant,
    generateComplianceGauge,
    generateSensitivityTornado,
    formatForApexCharts
} from '../../models/intercompany/advanced-visualizations.js';
import { showToast, formatCurrency, formatPercentage } from '../../utils/index.js';

// ========== STATE ==========

let vizState = {
    calculationResults: null,
    comparisonData: null,
    baseInputs: null,
    activeTab: 'comparison',
    chartInstances: {},
    isComparing: false
};

let containerRef = null;
let unsubscribe = null;

// ========== INITIALIZATION ==========

/**
 * Initialize the advanced visualizations UI
 * @param {HTMLElement} container - The container element
 * @param {Object} options - Configuration options
 */
export function initAdvancedVisualizations(container, options = {}) {
    containerRef = container;

    // Initialize state from options or app state
    const appState = getState();
    vizState.calculationResults = options.calculationResults || appState.intercompany?.lastResults;
    vizState.baseInputs = options.baseInputs || getDefaultInputs();

    // Subscribe to app state changes
    unsubscribe = subscribe((state) => {
        if (state.intercompany?.lastResults !== vizState.calculationResults) {
            vizState.calculationResults = state.intercompany?.lastResults;
            renderVisualizations();
        }
    });

    renderVisualizations();
}

/**
 * Get default inputs for comparison
 */
function getDefaultInputs() {
    return {
        developmentCost: 1000000,
        markupPercentage: 10,
        usefulLife: 5,
        corporateTaxRate: 27,
        section11eType: 'pc-2yr'
    };
}

/**
 * Update visualizations with new results
 */
export function updateVisualizationResults(results) {
    vizState.calculationResults = results;
    renderVisualizations();
}

/**
 * Destroy the visualizations module
 */
export function destroyAdvancedVisualizations() {
    // Destroy all chart instances
    Object.values(vizState.chartInstances).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    vizState.chartInstances = {};

    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
    containerRef = null;
}

// ========== RENDER FUNCTIONS ==========

/**
 * Main render function
 */
function renderVisualizations() {
    if (!containerRef) return;

    containerRef.innerHTML = `
        <div class="advanced-visualizations">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-semibold text-gray-100">Advanced Visualizations</h2>
                    <p class="text-sm text-gray-400 mt-1">
                        Cross-model comparisons, timelines, and risk analysis
                    </p>
                </div>
                <div class="flex gap-2">
                    <button id="runComparisonBtn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <span>Compare All Models</span>
                    </button>
                </div>
            </div>

            <!-- Tab Navigation -->
            ${renderTabs()}

            <!-- Tab Content -->
            <div class="tab-content mt-6">
                ${renderTabContent()}
            </div>
        </div>
    `;

    setupEventListeners();
}

/**
 * Render navigation tabs
 */
function renderTabs() {
    const tabs = [
        { id: 'comparison', label: 'Model Comparison', icon: '📊' },
        { id: 'timeline', label: 'Timelines', icon: '📈' },
        { id: 'risk', label: 'Risk Analysis', icon: '⚠️' }
    ];

    return `
        <div class="flex border-b border-gray-700">
            ${tabs.map(tab => `
                <button
                    class="viz-tab-btn px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px
                           ${vizState.activeTab === tab.id
                               ? 'text-blue-400 border-blue-400'
                               : 'text-gray-400 border-transparent hover:text-gray-300'}"
                    data-tab="${tab.id}"
                >
                    <span class="mr-2">${tab.icon}</span>${tab.label}
                </button>
            `).join('')}
        </div>
    `;
}

/**
 * Render active tab content
 */
function renderTabContent() {
    switch (vizState.activeTab) {
        case 'comparison':
            return renderComparisonTab();
        case 'timeline':
            return renderTimelineTab();
        case 'risk':
            return renderRiskTab();
        default:
            return renderComparisonTab();
    }
}

// ========== 10.1 COMPARISON TAB ==========

function renderComparisonTab() {
    const comparison = vizState.comparisonData;

    if (!comparison) {
        return renderComparisonPlaceholder();
    }

    return `
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            ${renderSummaryCard('Best for Developer', comparison.summary?.bestForDeveloper?.name, formatCurrency(comparison.summary?.bestForDeveloper?.value || 0), 'text-blue-400', '💻')}
            ${renderSummaryCard('Lowest Cost for Buyer', comparison.summary?.bestForBuyer?.name, formatCurrency(comparison.summary?.bestForBuyer?.value || 0), 'text-green-400', '🏢')}
            ${renderSummaryCard('Lowest Risk', comparison.summary?.lowestRisk?.name, `${comparison.summary?.lowestRisk?.value?.toFixed(0) || 'N/A'}% risk score`, 'text-yellow-400', '🛡️')}
        </div>

        <!-- Model Comparison Chart -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
            <div id="modelComparisonChart" style="min-height: 400px;"></div>
        </div>

        <!-- Side by Side Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div id="developerReturnChart" style="min-height: 350px;"></div>
            </div>
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div id="buyerCostChart" style="min-height: 350px;"></div>
            </div>
        </div>

        <!-- Asset Position Chart -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
            <div id="assetPositionChart" style="min-height: 350px;"></div>
        </div>

        <!-- Comparison Table -->
        ${renderComparisonTable(comparison)}
    `;
}

function renderComparisonPlaceholder() {
    return `
        <div class="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
            <div class="text-5xl mb-4">📊</div>
            <h3 class="text-lg font-medium text-gray-200 mb-2">Compare All Models</h3>
            <p class="text-gray-400 mb-6 max-w-md mx-auto">
                Click "Compare All Models" to run calculations across all 6 transaction models
                and see side-by-side comparisons of costs, returns, and risk profiles.
            </p>

            <!-- Input Configuration -->
            <div class="max-w-md mx-auto text-left bg-gray-700/50 rounded-lg p-4 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-3">Base Inputs for Comparison</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs text-gray-400">Development Cost (R)</label>
                        <input type="number" id="baseDevCost" value="${vizState.baseInputs.developmentCost}"
                               class="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm">
                    </div>
                    <div>
                        <label class="text-xs text-gray-400">Markup (%)</label>
                        <input type="number" id="baseMarkup" value="${vizState.baseInputs.markupPercentage}"
                               class="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm">
                    </div>
                    <div>
                        <label class="text-xs text-gray-400">Useful Life (Years)</label>
                        <input type="number" id="baseUsefulLife" value="${vizState.baseInputs.usefulLife}"
                               class="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm">
                    </div>
                    <div>
                        <label class="text-xs text-gray-400">Tax Rate (%)</label>
                        <input type="number" id="baseTaxRate" value="${vizState.baseInputs.corporateTaxRate}"
                               class="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm">
                    </div>
                </div>
            </div>

            <button id="runComparisonBtn2" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <span class="mr-2">📊</span> Run Comparison
            </button>
        </div>
    `;
}

function renderSummaryCard(title, value, detail, colorClass, icon) {
    return `
        <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">${icon}</span>
                <span class="text-sm text-gray-400">${title}</span>
            </div>
            <div class="text-lg font-bold ${colorClass}">${value || 'N/A'}</div>
            <div class="text-sm text-gray-500">${detail}</div>
        </div>
    `;
}

function renderComparisonTable(comparison) {
    const models = Object.entries(comparison.models || {}).filter(([_, m]) => m.results);

    if (models.length === 0) return '';

    return `
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6 overflow-x-auto">
            <h4 class="text-lg font-semibold text-gray-200 mb-4">Detailed Comparison</h4>
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="text-left py-3 px-2 text-gray-400">Model</th>
                        <th class="text-right py-3 px-2 text-gray-400">Developer Revenue</th>
                        <th class="text-right py-3 px-2 text-gray-400">Developer Profit</th>
                        <th class="text-right py-3 px-2 text-gray-400">Margin</th>
                        <th class="text-right py-3 px-2 text-gray-400">Buyer Cost</th>
                        <th class="text-right py-3 px-2 text-gray-400">Buyer Asset</th>
                        <th class="text-right py-3 px-2 text-gray-400">Risk Score</th>
                    </tr>
                </thead>
                <tbody>
                    ${models.map(([id, m]) => `
                        <tr class="border-b border-gray-700/50 hover:bg-gray-700/30">
                            <td class="py-3 px-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full" style="background-color: ${m.color}"></span>
                                    <span class="text-gray-200">${m.name}</span>
                                </div>
                            </td>
                            <td class="py-3 px-2 text-right text-gray-300">${formatCurrency(m.results.developer?.revenue?.total || 0)}</td>
                            <td class="py-3 px-2 text-right text-green-400">${formatCurrency(m.results.developer?.profit?.net || 0)}</td>
                            <td class="py-3 px-2 text-right text-gray-300">${formatPercentage(m.results.developer?.profit?.margin || 0)}</td>
                            <td class="py-3 px-2 text-right text-gray-300">${formatCurrency(m.results.buyer?.totalCost || 0)}</td>
                            <td class="py-3 px-2 text-right text-blue-400">${formatCurrency(m.results.buyer?.asset?.capitalised || 0)}</td>
                            <td class="py-3 px-2 text-right">
                                <span class="px-2 py-1 rounded text-xs ${
                                    (m.results.transferPricing?.riskScore || 50) < 30 ? 'bg-green-900/50 text-green-400' :
                                    (m.results.transferPricing?.riskScore || 50) < 60 ? 'bg-yellow-900/50 text-yellow-400' :
                                    'bg-red-900/50 text-red-400'
                                }">
                                    ${(m.results.transferPricing?.riskScore || 50).toFixed(0)}%
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ========== 10.2 TIMELINE TAB ==========

function renderTimelineTab() {
    const hasResults = !!vizState.calculationResults;

    if (!hasResults) {
        return renderTimelinePlaceholder();
    }

    return `
        <!-- Asset Timeline -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
            <div id="assetTimelineChart" style="min-height: 400px;"></div>
        </div>

        <!-- Cash Flow Waterfall -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
            <div id="cashFlowWaterfallChart" style="min-height: 400px;"></div>
        </div>

        <!-- Amortisation Schedule -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
            <div id="amortisationChart" style="min-height: 350px;"></div>
            ${renderAmortisationTable()}
        </div>

        <!-- Project Gantt -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div id="projectGanttChart" style="min-height: 300px;"></div>
        </div>
    `;
}

function renderTimelinePlaceholder() {
    return `
        <div class="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
            <div class="text-5xl mb-4">📈</div>
            <h3 class="text-lg font-medium text-gray-200 mb-2">Timeline Visualizations</h3>
            <p class="text-gray-400 mb-4 max-w-md mx-auto">
                Run a model calculation first to see asset value trajectories,
                cash flow waterfalls, and amortisation schedules over time.
            </p>
            <p class="text-sm text-gray-500">
                Go to the Calculator tab, select a model, and run calculations.
            </p>
        </div>
    `;
}

function renderAmortisationTable() {
    if (!vizState.calculationResults) return '';

    const schedule = generateAmortisationSchedule(vizState.calculationResults, 5);

    return `
        <div class="mt-6 overflow-x-auto">
            <h4 class="text-sm font-medium text-gray-300 mb-3">Amortisation Schedule Detail</h4>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="text-left py-2 px-2 text-gray-400">Year</th>
                        <th class="text-right py-2 px-2 text-gray-400">Buyer Opening</th>
                        <th class="text-right py-2 px-2 text-gray-400">Accounting Amort</th>
                        <th class="text-right py-2 px-2 text-gray-400">Tax Deduction (S11e)</th>
                        <th class="text-right py-2 px-2 text-gray-400">Timing Diff</th>
                        <th class="text-right py-2 px-2 text-gray-400">Closing</th>
                    </tr>
                </thead>
                <tbody>
                    ${schedule.rawData.map(row => `
                        <tr class="border-b border-gray-700/50">
                            <td class="py-2 px-2 text-gray-300">Year ${row.year}</td>
                            <td class="py-2 px-2 text-right text-gray-300">${formatCurrency(row.buyer.opening)}</td>
                            <td class="py-2 px-2 text-right text-gray-300">${formatCurrency(row.buyer.accountingAmort)}</td>
                            <td class="py-2 px-2 text-right text-green-400">${formatCurrency(row.buyer.taxDeduction)}</td>
                            <td class="py-2 px-2 text-right ${row.buyer.timingDifference < 0 ? 'text-blue-400' : 'text-yellow-400'}">${formatCurrency(row.buyer.timingDifference)}</td>
                            <td class="py-2 px-2 text-right text-gray-300">${formatCurrency(row.buyer.closing)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ========== 10.3 RISK TAB ==========

function renderRiskTab() {
    const hasResults = !!vizState.calculationResults;
    const hasComparison = !!vizState.comparisonData;

    return `
        <!-- Compliance Gauge -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div id="complianceGaugeChart" style="min-height: 250px;"></div>
            </div>
            <div class="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div id="riskHeatmapChart" style="min-height: 250px;"></div>
            </div>
        </div>

        <!-- Risk vs Return Quadrant -->
        ${hasComparison ? `
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                <div id="riskReturnQuadrantChart" style="min-height: 400px;"></div>
                ${renderQuadrantLegend()}
            </div>
        ` : renderRiskComparisonPlaceholder()}

        <!-- Sensitivity Tornado -->
        ${hasResults ? `
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div id="sensitivityTornadoChart" style="min-height: 350px;"></div>
                <p class="text-xs text-gray-500 mt-4 text-center">
                    Note: Full sensitivity analysis with actual recalculations will be available in Phase 11 (Stage 2)
                </p>
            </div>
        ` : ''}
    `;
}

function renderRiskComparisonPlaceholder() {
    return `
        <div class="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center mb-6">
            <div class="text-4xl mb-3">⚖️</div>
            <h3 class="text-md font-medium text-gray-200 mb-2">Risk vs Return Analysis</h3>
            <p class="text-sm text-gray-400 mb-4">
                Run "Compare All Models" to see the risk-return quadrant chart
            </p>
        </div>
    `;
}

function renderQuadrantLegend() {
    return `
        <div class="flex justify-center gap-6 mt-4 text-xs">
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-green-500/50 rounded"></div>
                <span class="text-gray-400">Low Risk / High Return (Optimal)</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-yellow-500/50 rounded"></div>
                <span class="text-gray-400">High Risk / High Return</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-gray-500/50 rounded"></div>
                <span class="text-gray-400">Low Risk / Low Return</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-red-500/50 rounded"></div>
                <span class="text-gray-400">High Risk / Low Return (Avoid)</span>
            </div>
        </div>
    `;
}

// ========== EVENT HANDLERS ==========

function setupEventListeners() {
    if (!containerRef) return;

    // Tab navigation
    containerRef.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.viz-tab-btn');
        if (tabBtn) {
            vizState.activeTab = tabBtn.dataset.tab;
            renderVisualizations();
            renderChartsForTab(vizState.activeTab);
            return;
        }

        // Run comparison buttons
        if (e.target.closest('#runComparisonBtn') || e.target.closest('#runComparisonBtn2')) {
            handleRunComparison();
            return;
        }
    });

    // Initial chart render
    setTimeout(() => renderChartsForTab(vizState.activeTab), 100);
}

function handleRunComparison() {
    // Gather inputs from form if available
    const devCostInput = containerRef.querySelector('#baseDevCost');
    const markupInput = containerRef.querySelector('#baseMarkup');
    const usefulLifeInput = containerRef.querySelector('#baseUsefulLife');
    const taxRateInput = containerRef.querySelector('#baseTaxRate');

    if (devCostInput) vizState.baseInputs.developmentCost = parseFloat(devCostInput.value) || 1000000;
    if (markupInput) vizState.baseInputs.markupPercentage = parseFloat(markupInput.value) || 10;
    if (usefulLifeInput) vizState.baseInputs.usefulLife = parseFloat(usefulLifeInput.value) || 5;
    if (taxRateInput) vizState.baseInputs.corporateTaxRate = parseFloat(taxRateInput.value) || 27;

    vizState.isComparing = true;

    try {
        vizState.comparisonData = generateCrossModelComparison(vizState.baseInputs);
        showToast(`Compared ${Object.keys(vizState.comparisonData.models).length} models successfully`, 'success');

        // Re-render and render charts
        renderVisualizations();
        setTimeout(() => renderChartsForTab('comparison'), 100);
    } catch (error) {
        console.error('Comparison error:', error);
        showToast('Error running comparison: ' + error.message, 'error');
    } finally {
        vizState.isComparing = false;
    }
}

// ========== CHART RENDERING ==========

function renderChartsForTab(tabId) {
    // Destroy existing charts
    Object.values(vizState.chartInstances).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    vizState.chartInstances = {};

    switch (tabId) {
        case 'comparison':
            renderComparisonCharts();
            break;
        case 'timeline':
            renderTimelineCharts();
            break;
        case 'risk':
            renderRiskCharts();
            break;
    }
}

function renderComparisonCharts() {
    if (!vizState.comparisonData) return;

    const charts = vizState.comparisonData.charts;

    // Model Comparison Chart
    if (charts.modelComparison) {
        const container = document.getElementById('modelComparisonChart');
        if (container) {
            const options = formatForApexCharts(charts.modelComparison);
            options.colors = [VIZ_COLORS.perspectives.developer, VIZ_COLORS.perspectives.buyer];
            vizState.chartInstances.modelComparison = new ApexCharts(container, options);
            vizState.chartInstances.modelComparison.render();
        }
    }

    // Developer Return Chart
    if (charts.developerReturn) {
        const container = document.getElementById('developerReturnChart');
        if (container) {
            const options = formatForApexCharts(charts.developerReturn);
            vizState.chartInstances.developerReturn = new ApexCharts(container, options);
            vizState.chartInstances.developerReturn.render();
        }
    }

    // Buyer Cost Chart
    if (charts.totalCostToBuyer) {
        const container = document.getElementById('buyerCostChart');
        if (container) {
            const options = formatForApexCharts(charts.totalCostToBuyer);
            vizState.chartInstances.buyerCost = new ApexCharts(container, options);
            vizState.chartInstances.buyerCost.render();
        }
    }

    // Asset Position Chart
    if (charts.assetPosition) {
        const container = document.getElementById('assetPositionChart');
        if (container) {
            const options = formatForApexCharts(charts.assetPosition);
            options.colors = [VIZ_COLORS.perspectives.developer, VIZ_COLORS.perspectives.buyer];
            vizState.chartInstances.assetPosition = new ApexCharts(container, options);
            vizState.chartInstances.assetPosition.render();
        }
    }
}

function renderTimelineCharts() {
    if (!vizState.calculationResults) return;

    // Asset Timeline Chart
    const timelineData = generateAssetTimeline(vizState.calculationResults, 5);
    const timelineContainer = document.getElementById('assetTimelineChart');
    if (timelineContainer) {
        const options = formatForApexCharts(timelineData);
        options.colors = [VIZ_COLORS.perspectives.developer, VIZ_COLORS.perspectives.buyer];
        vizState.chartInstances.assetTimeline = new ApexCharts(timelineContainer, options);
        vizState.chartInstances.assetTimeline.render();
    }

    // Cash Flow Waterfall
    const waterfallData = generateCashFlowWaterfall(vizState.calculationResults);
    const waterfallContainer = document.getElementById('cashFlowWaterfallChart');
    if (waterfallContainer) {
        const options = {
            chart: {
                type: 'bar',
                height: 400,
                toolbar: { show: true },
                background: 'transparent'
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    distributed: true,
                    horizontal: false
                }
            },
            series: waterfallData.series,
            title: {
                text: waterfallData.title,
                align: 'center',
                style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' }
            },
            subtitle: {
                text: waterfallData.subtitle,
                align: 'center',
                style: { fontSize: '12px', color: '#9CA3AF' }
            },
            dataLabels: {
                enabled: true,
                formatter: val => `R${(val / 1000).toFixed(0)}k`,
                style: { colors: ['#F3F4F6'] }
            },
            xaxis: {
                labels: { style: { colors: '#9CA3AF' } }
            },
            yaxis: {
                labels: {
                    formatter: val => `R${(val / 1000).toFixed(0)}k`,
                    style: { colors: '#9CA3AF' }
                }
            },
            legend: { show: false },
            grid: { borderColor: '#374151' },
            tooltip: {
                theme: 'dark',
                y: { formatter: val => `R${val.toLocaleString()}` }
            }
        };
        vizState.chartInstances.waterfall = new ApexCharts(waterfallContainer, options);
        vizState.chartInstances.waterfall.render();
    }

    // Amortisation Chart
    const amortData = generateAmortisationSchedule(vizState.calculationResults, 5);
    const amortContainer = document.getElementById('amortisationChart');
    if (amortContainer) {
        const options = formatForApexCharts(amortData);
        options.colors = [VIZ_COLORS.perspectives.buyer, VIZ_COLORS.risk.low, VIZ_COLORS.perspectives.developer];
        options.stroke = { curve: 'smooth', width: [2, 2, 2], dashArray: [0, 5, 0] };
        vizState.chartInstances.amortisation = new ApexCharts(amortContainer, options);
        vizState.chartInstances.amortisation.render();
    }

    // Project Gantt
    const ganttData = generateProjectGantt(vizState.baseInputs);
    const ganttContainer = document.getElementById('projectGanttChart');
    if (ganttContainer) {
        const options = {
            chart: {
                type: 'rangeBar',
                height: 300,
                toolbar: { show: true },
                background: 'transparent'
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    distributed: true,
                    borderRadius: 4
                }
            },
            series: ganttData.series,
            title: {
                text: ganttData.title,
                align: 'center',
                style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' }
            },
            subtitle: {
                text: ganttData.subtitle,
                align: 'center',
                style: { fontSize: '12px', color: '#9CA3AF' }
            },
            xaxis: {
                type: 'numeric',
                title: { text: 'Months', style: { color: '#9CA3AF' } },
                labels: { style: { colors: '#9CA3AF' } }
            },
            yaxis: {
                labels: { style: { colors: '#9CA3AF' } }
            },
            legend: { show: false },
            grid: { borderColor: '#374151' },
            tooltip: { theme: 'dark' }
        };
        vizState.chartInstances.gantt = new ApexCharts(ganttContainer, options);
        vizState.chartInstances.gantt.render();
    }
}

function renderRiskCharts() {
    // Compliance Gauge
    const gaugeContainer = document.getElementById('complianceGaugeChart');
    if (gaugeContainer) {
        const score = vizState.calculationResults?.transferPricing?.riskScore
            ? 100 - vizState.calculationResults.transferPricing.riskScore
            : 70;

        const options = {
            chart: {
                type: 'radialBar',
                height: 250,
                background: 'transparent'
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    hollow: {
                        size: '65%'
                    },
                    track: {
                        background: '#374151',
                        strokeWidth: '80%'
                    },
                    dataLabels: {
                        name: {
                            show: true,
                            fontSize: '14px',
                            color: '#9CA3AF',
                            offsetY: -10
                        },
                        value: {
                            show: true,
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: score >= 70 ? VIZ_COLORS.risk.low : score >= 50 ? VIZ_COLORS.risk.medium : VIZ_COLORS.risk.high,
                            formatter: val => `${val}%`
                        }
                    }
                }
            },
            series: [score],
            labels: ['Compliance'],
            colors: [score >= 70 ? VIZ_COLORS.risk.low : score >= 50 ? VIZ_COLORS.risk.medium : VIZ_COLORS.risk.high],
            title: {
                text: 'Compliance Score',
                align: 'center',
                style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' }
            }
        };
        vizState.chartInstances.complianceGauge = new ApexCharts(gaugeContainer, options);
        vizState.chartInstances.complianceGauge.render();
    }

    // Risk Heatmap
    const heatmapContainer = document.getElementById('riskHeatmapChart');
    if (heatmapContainer && vizState.calculationResults) {
        const heatmapData = generateTPRiskHeatMap(vizState.calculationResults);
        const options = {
            chart: {
                type: 'heatmap',
                height: 250,
                toolbar: { show: false },
                background: 'transparent'
            },
            plotOptions: {
                heatmap: {
                    colorScale: {
                        ranges: [
                            { from: 0, to: 30, color: VIZ_COLORS.risk.low, name: 'Low' },
                            { from: 31, to: 60, color: VIZ_COLORS.risk.medium, name: 'Medium' },
                            { from: 61, to: 100, color: VIZ_COLORS.risk.high, name: 'High' }
                        ]
                    }
                }
            },
            dataLabels: {
                enabled: true,
                style: { colors: ['#fff'] }
            },
            series: [{
                name: 'Risk',
                data: heatmapData.series[0].data.map(d => ({ x: d.x, y: d.y }))
            }],
            title: {
                text: heatmapData.title,
                align: 'center',
                style: { fontSize: '14px', fontWeight: 600, color: '#F3F4F6' }
            },
            xaxis: {
                labels: { style: { colors: '#9CA3AF' } }
            },
            tooltip: { theme: 'dark' }
        };
        vizState.chartInstances.heatmap = new ApexCharts(heatmapContainer, options);
        vizState.chartInstances.heatmap.render();
    }

    // Risk Return Quadrant
    if (vizState.comparisonData) {
        const quadrantContainer = document.getElementById('riskReturnQuadrantChart');
        if (quadrantContainer) {
            const quadrantData = generateRiskReturnQuadrant(vizState.comparisonData);
            const options = {
                chart: {
                    type: 'scatter',
                    height: 400,
                    toolbar: { show: true },
                    background: 'transparent',
                    zoom: { enabled: true }
                },
                series: [{
                    name: 'Models',
                    data: quadrantData.series[0].data.map(d => ({
                        x: d.x,
                        y: d.y,
                        marker: {
                            fillColor: d.fillColor
                        }
                    }))
                }],
                markers: {
                    size: 15,
                    hover: { size: 18 }
                },
                title: {
                    text: quadrantData.title,
                    align: 'center',
                    style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' }
                },
                subtitle: {
                    text: quadrantData.subtitle,
                    align: 'center',
                    style: { fontSize: '12px', color: '#9CA3AF' }
                },
                xaxis: {
                    title: { text: 'Risk Score (%)', style: { color: '#9CA3AF' } },
                    min: 0,
                    max: 100,
                    labels: { style: { colors: '#9CA3AF' } }
                },
                yaxis: {
                    title: { text: 'Developer Margin (%)', style: { color: '#9CA3AF' } },
                    min: 0,
                    labels: { style: { colors: '#9CA3AF' } }
                },
                grid: {
                    borderColor: '#374151',
                    xaxis: { lines: { show: true } }
                },
                tooltip: {
                    theme: 'dark',
                    custom: function({ series, seriesIndex, dataPointIndex, w }) {
                        const point = quadrantData.series[0].data[dataPointIndex];
                        return `<div class="px-3 py-2 bg-gray-800 border border-gray-700 rounded">
                            <strong class="text-gray-200">${point.name}</strong><br>
                            <span class="text-gray-400">Risk: ${point.x.toFixed(1)}%</span><br>
                            <span class="text-gray-400">Margin: ${point.y.toFixed(1)}%</span>
                        </div>`;
                    }
                },
                annotations: {
                    xaxis: [{
                        x: 50,
                        borderColor: '#666',
                        strokeDashArray: 5,
                        label: {
                            text: 'Risk Threshold',
                            style: { color: '#9CA3AF', background: '#374151' }
                        }
                    }],
                    yaxis: [{
                        y: 10,
                        borderColor: '#666',
                        strokeDashArray: 5,
                        label: {
                            text: 'Return Threshold',
                            style: { color: '#9CA3AF', background: '#374151' }
                        }
                    }]
                }
            };
            vizState.chartInstances.riskReturnQuadrant = new ApexCharts(quadrantContainer, options);
            vizState.chartInstances.riskReturnQuadrant.render();
        }
    }

    // Sensitivity Tornado
    if (vizState.calculationResults) {
        const tornadoContainer = document.getElementById('sensitivityTornadoChart');
        if (tornadoContainer) {
            const tornadoData = generateSensitivityTornado(vizState.calculationResults, vizState.baseInputs);
            const options = {
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: true,
                    toolbar: { show: true },
                    background: 'transparent'
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        borderRadius: 4
                    }
                },
                colors: [VIZ_COLORS.risk.high, VIZ_COLORS.risk.low],
                series: tornadoData.series,
                title: {
                    text: tornadoData.title,
                    align: 'center',
                    style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' }
                },
                subtitle: {
                    text: tornadoData.subtitle,
                    align: 'center',
                    style: { fontSize: '12px', color: '#9CA3AF' }
                },
                xaxis: {
                    title: { text: 'Impact on Developer Profit (R)', style: { color: '#9CA3AF' } },
                    labels: {
                        formatter: val => `R${(val / 1000).toFixed(0)}k`,
                        style: { colors: '#9CA3AF' }
                    },
                    categories: tornadoData.categories
                },
                yaxis: {
                    labels: { style: { colors: '#9CA3AF' } }
                },
                grid: { borderColor: '#374151' },
                legend: {
                    position: 'top',
                    labels: { colors: '#9CA3AF' }
                },
                tooltip: {
                    theme: 'dark',
                    y: { formatter: val => `R${Math.abs(val).toLocaleString()}` }
                }
            };
            vizState.chartInstances.tornado = new ApexCharts(tornadoContainer, options);
            vizState.chartInstances.tornado.render();
        }
    }
}

// ========== EXPORTS ==========

export default {
    initAdvancedVisualizations,
    updateVisualizationResults,
    destroyAdvancedVisualizations
};
