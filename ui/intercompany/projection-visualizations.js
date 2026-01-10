// ========== PROJECTION VISUALIZATIONS UI ==========
// Phase 12.3: Projection Visualizations
// Provides UI components for multi-year cash flow, NPV comparison, ROI trajectory, and asset value charts.

import {
    generateProjections,
    calculateAssetTrajectory,
    calculateRevenueBreakEven,
    generateCashFlowChartData,
    generateNPVWaterfallData,
    generateROITrajectoryData,
    generateAssetValueChartData,
    generateMetricsRadarData,
    DEFAULT_PROJECTION_PARAMS,
    PROJECTION_INPUTS
} from '../../models/intercompany/growth-projections.js';
import { formatCurrency, formatPercentage } from '../../utils/index.js';

// ========== STATE ==========

let currentProjectionData = null;
let projectionParams = { ...DEFAULT_PROJECTION_PARAMS };
let activeTab = 'overview';
let transactionResults = null;

// ========== INITIALIZATION ==========

/**
 * Initialize projection visualizations panel
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Configuration options
 */
export function initProjectionVisualizations(container, options = {}) {
    if (!container) return;

    transactionResults = options.calculationResults || null;
    projectionParams = { ...DEFAULT_PROJECTION_PARAMS, ...options.projectionParams };

    if (transactionResults) {
        currentProjectionData = generateProjections(transactionResults, projectionParams);
    }

    renderProjectionPanel(container, options);
}

/**
 * Render the main projection panel
 */
function renderProjectionPanel(container, options) {
    const hasData = currentProjectionData !== null;

    container.innerHTML = `
        <div class="projection-visualizations">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">📈</span>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-100">Growth Projections</h3>
                        <p class="text-sm text-gray-400">Multi-year NPV, IRR, and ROI analysis</p>
                    </div>
                </div>
                ${hasData ? `
                    <button id="exportProjectionsBtn" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium flex items-center gap-2">
                        <span>📥</span> Export
                    </button>
                ` : ''}
            </div>

            ${!hasData ? renderNoDataState() : `
                <!-- Projection Parameters -->
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <span>⚙️</span> Projection Parameters
                        </h4>
                        <button id="updateProjectionsBtn" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                            Update
                        </button>
                    </div>
                    ${renderProjectionInputs()}
                </div>

                <!-- Tab Navigation -->
                <div class="bg-gray-700/50 rounded-lg p-1 mb-6">
                    <div class="flex gap-1">
                        <button class="projection-tab-btn flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}" data-tab="overview">
                            Overview
                        </button>
                        <button class="projection-tab-btn flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'cashflow' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}" data-tab="cashflow">
                            Cash Flow
                        </button>
                        <button class="projection-tab-btn flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'roi' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}" data-tab="roi">
                            ROI
                        </button>
                        <button class="projection-tab-btn flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'assets' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}" data-tab="assets">
                            Assets
                        </button>
                    </div>
                </div>

                <!-- Tab Content -->
                <div id="projectionTabContent" class="projection-tab-content">
                    ${renderTabContent(activeTab)}
                </div>
            `}
        </div>
    `;

    setupEventListeners(container, options);
}

/**
 * Render no data state
 */
function renderNoDataState() {
    return `
        <div class="text-center py-12 text-gray-400">
            <span class="text-4xl mb-4 block">📊</span>
            <p class="mb-2">No projection data available</p>
            <p class="text-sm">Calculate a transaction first to see growth projections</p>
        </div>
    `;
}

/**
 * Render projection parameter inputs
 */
function renderProjectionInputs() {
    return `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label class="block text-xs text-gray-400 mb-1">Projection Period</label>
                <select id="projectionPeriod" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 text-sm">
                    <option value="3" ${projectionParams.projectionPeriod === 3 ? 'selected' : ''}>3 Years</option>
                    <option value="5" ${projectionParams.projectionPeriod === 5 ? 'selected' : ''}>5 Years</option>
                    <option value="7" ${projectionParams.projectionPeriod === 7 ? 'selected' : ''}>7 Years</option>
                    <option value="10" ${projectionParams.projectionPeriod === 10 ? 'selected' : ''}>10 Years</option>
                </select>
            </div>
            <div>
                <label class="block text-xs text-gray-400 mb-1">Discount Rate (%)</label>
                <input type="number" id="discountRate" value="${(projectionParams.discountRate * 100).toFixed(1)}"
                       min="1" max="30" step="0.5"
                       class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 text-sm">
            </div>
            <div>
                <label class="block text-xs text-gray-400 mb-1">Revenue Growth (%)</label>
                <input type="number" id="revenueGrowthRate" value="${(projectionParams.revenueGrowthRate * 100).toFixed(1)}"
                       min="-10" max="50" step="1"
                       class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 text-sm">
            </div>
            <div>
                <label class="block text-xs text-gray-400 mb-1">Enhancement Cost (%)</label>
                <input type="number" id="enhancementCostPercent" value="${(projectionParams.enhancementCostPercent * 100).toFixed(0)}"
                       min="0" max="50" step="1"
                       class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 text-sm">
            </div>
        </div>
    `;
}

/**
 * Render content for active tab
 */
function renderTabContent(tab) {
    if (!currentProjectionData) return '';

    switch (tab) {
        case 'overview':
            return renderOverviewTab();
        case 'cashflow':
            return renderCashFlowTab();
        case 'roi':
            return renderROITab();
        case 'assets':
            return renderAssetsTab();
        default:
            return '';
    }
}

// ========== OVERVIEW TAB ==========

function renderOverviewTab() {
    const { developer, buyer, summary, years } = currentProjectionData;

    return `
        <div class="overview-view">
            <!-- Key Metrics Cards -->
            <div class="grid grid-cols-2 gap-4 mb-6">
                ${renderPartyMetricCard('Developer', developer, 'blue', '💻')}
                ${renderPartyMetricCard('Buyer', buyer, 'green', '🏢')}
            </div>

            <!-- Summary Assessment -->
            <div class="grid grid-cols-2 gap-6 mb-6">
                <!-- Developer Assessment -->
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 class="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <span>💻</span> Developer Assessment
                    </h4>
                    ${renderAssessmentGauge(summary.developer.assessment)}
                    <div class="mt-4 space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">NPV</span>
                            <span class="${developer.metrics.npv >= 0 ? 'text-green-400' : 'text-red-400'}">${formatCurrency(developer.metrics.npv)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">IRR</span>
                            <span class="text-blue-400">${(developer.metrics.irr * 100).toFixed(1)}%</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">Payback</span>
                            <span class="text-gray-200">${developer.metrics.paybackPeriod.toFixed(1)} years</span>
                        </div>
                    </div>
                </div>

                <!-- Buyer Assessment -->
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 class="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <span>🏢</span> Buyer Assessment
                    </h4>
                    ${renderAssessmentGauge(summary.buyer.assessment)}
                    <div class="mt-4 space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">NPV</span>
                            <span class="${buyer.metrics.npv >= 0 ? 'text-green-400' : 'text-red-400'}">${formatCurrency(buyer.metrics.npv)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">IRR</span>
                            <span class="text-blue-400">${(buyer.metrics.irr * 100).toFixed(1)}%</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">ROI</span>
                            <span class="text-gray-200">${buyer.metrics.roi.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recommendations -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <span>💡</span> Recommendations
                </h4>
                <ul class="space-y-2">
                    ${summary.recommendation.map(rec => `
                        <li class="flex items-start gap-2 text-sm">
                            <span class="text-blue-400 mt-0.5">•</span>
                            <span class="text-gray-300">${rec}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
}

function renderPartyMetricCard(title, partyData, color, icon) {
    const colorClasses = {
        blue: 'bg-blue-900/30 border-blue-700/50 text-blue-300',
        green: 'bg-green-900/30 border-green-700/50 text-green-300'
    };

    const npv = partyData.metrics.npv;
    const irr = partyData.metrics.irr;

    return `
        <div class="p-4 rounded-lg border ${colorClasses[color]}">
            <div class="flex items-center gap-2 mb-3">
                <span class="text-xl">${icon}</span>
                <span class="font-medium">${title}</span>
            </div>
            <div class="text-2xl font-bold mb-1">
                ${formatCurrency(npv)}
            </div>
            <div class="text-xs opacity-75">NPV</div>
            <div class="mt-3 pt-3 border-t border-gray-700/50 grid grid-cols-2 gap-2 text-xs">
                <div>
                    <span class="text-gray-400 block">IRR</span>
                    <span class="font-medium">${(irr * 100).toFixed(1)}%</span>
                </div>
                <div>
                    <span class="text-gray-400 block">Payback</span>
                    <span class="font-medium">${partyData.metrics.paybackPeriod.toFixed(1)}y</span>
                </div>
            </div>
        </div>
    `;
}

function renderAssessmentGauge(assessment) {
    const colorMap = {
        green: 'bg-green-600',
        blue: 'bg-blue-600',
        yellow: 'bg-yellow-600',
        red: 'bg-red-600'
    };

    const widthMap = {
        'Excellent': '100%',
        'Good': '75%',
        'Marginal': '50%',
        'Poor': '25%'
    };

    return `
        <div class="assessment-gauge">
            <div class="flex justify-between items-center mb-2">
                <span class="text-lg font-bold ${assessment.color === 'green' ? 'text-green-400' : assessment.color === 'blue' ? 'text-blue-400' : assessment.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}">
                    ${assessment.rating}
                </span>
            </div>
            <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full ${colorMap[assessment.color]} rounded-full transition-all" style="width: ${widthMap[assessment.rating]}"></div>
            </div>
            <p class="text-xs text-gray-500 mt-2">${assessment.description}</p>
        </div>
    `;
}

// ========== CASH FLOW TAB ==========

function renderCashFlowTab() {
    const chartData = generateCashFlowChartData(currentProjectionData);
    const { developer, buyer, years } = currentProjectionData;

    return `
        <div class="cashflow-view">
            <!-- Cash Flow Chart -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-4">${chartData.title}</h4>
                ${renderCashFlowChart(chartData)}
            </div>

            <!-- Cumulative Cash Flow -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Cumulative Cash Flow</h4>
                ${renderCumulativeChart(chartData)}
            </div>

            <!-- Cash Flow Table -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Year-by-Year Cash Flows</h4>
                ${renderCashFlowTable(developer, buyer, years)}
            </div>
        </div>
    `;
}

function renderCashFlowChart(chartData) {
    const maxAbsValue = Math.max(
        ...chartData.datasets.flatMap(d => d.data.map(Math.abs))
    );

    return `
        <div class="cashflow-chart">
            <div class="flex items-end justify-between gap-2 h-48">
                ${chartData.labels.map((label, idx) => `
                    <div class="flex-1 flex flex-col items-center">
                        <div class="w-full flex justify-center gap-1 h-36">
                            ${chartData.datasets.map(ds => {
                                const value = ds.data[idx] || 0;
                                const height = (Math.abs(value) / maxAbsValue) * 100;
                                const isNegative = value < 0;

                                return `
                                    <div class="w-4 flex ${isNegative ? 'items-start' : 'items-end'} h-full">
                                        <div class="w-full rounded-sm transition-all hover:opacity-80"
                                             style="height: ${height}%; background-color: ${ds.color}; ${isNegative ? 'margin-top: 50%;' : ''}"
                                             title="${ds.label}: ${formatCurrency(value)}">
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <span class="text-xs text-gray-500 mt-2">${label}</span>
                    </div>
                `).join('')}
            </div>

            <!-- Legend -->
            <div class="flex justify-center gap-6 mt-4">
                ${chartData.datasets.map(ds => `
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded" style="background-color: ${ds.color}"></div>
                        <span class="text-xs text-gray-400">${ds.label}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCumulativeChart(chartData) {
    // Find the range for cumulative values
    const allCumulativeValues = chartData.datasets.flatMap(d => d.cumulative || []);
    const minVal = Math.min(...allCumulativeValues, 0);
    const maxVal = Math.max(...allCumulativeValues);
    const range = maxVal - minVal;

    const normalize = (value) => ((value - minVal) / range) * 100;

    return `
        <div class="cumulative-chart relative h-48">
            <!-- Zero line -->
            <div class="absolute w-full border-t border-gray-600" style="top: ${normalize(0)}%"></div>

            <!-- Lines for each dataset -->
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                ${chartData.datasets.map(ds => {
                    const points = (ds.cumulative || []).map((val, idx) => {
                        const x = (idx / (ds.cumulative.length - 1)) * 100;
                        const y = 100 - normalize(val);
                        return `${x},${y}`;
                    }).join(' ');

                    return `<polyline points="${points}" fill="none" stroke="${ds.color}" stroke-width="2" />`;
                }).join('')}
            </svg>

            <!-- Y-axis labels -->
            <div class="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 -ml-2">
                <span>${formatCurrency(maxVal)}</span>
                <span>${formatCurrency(0)}</span>
                <span>${formatCurrency(minVal)}</span>
            </div>
        </div>
    `;
}

function renderCashFlowTable(developer, buyer, years) {
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="text-left py-2 text-gray-400">Year</th>
                        <th class="text-right py-2 text-blue-400">Developer</th>
                        <th class="text-right py-2 text-green-400">Buyer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-gray-800">
                        <td class="py-2 text-gray-300">Initial</td>
                        <td class="py-2 text-right text-blue-300">${formatCurrency(developer.cashFlows[0])}</td>
                        <td class="py-2 text-right text-green-300">${formatCurrency(buyer.cashFlows[0])}</td>
                    </tr>
                    ${developer.yearlyData.map((_, idx) => `
                        <tr class="border-b border-gray-800">
                            <td class="py-2 text-gray-300">Year ${idx + 1}</td>
                            <td class="py-2 text-right ${developer.yearlyData[idx].cashFlow >= 0 ? 'text-blue-300' : 'text-red-300'}">${formatCurrency(developer.yearlyData[idx].cashFlow)}</td>
                            <td class="py-2 text-right ${buyer.yearlyData[idx].cashFlow >= 0 ? 'text-green-300' : 'text-red-300'}">${formatCurrency(buyer.yearlyData[idx].cashFlow)}</td>
                        </tr>
                    `).join('')}
                    <tr class="border-t-2 border-gray-600 font-medium">
                        <td class="py-2 text-gray-200">Total</td>
                        <td class="py-2 text-right text-blue-400">${formatCurrency(developer.cashFlows.reduce((a, b) => a + b, 0))}</td>
                        <td class="py-2 text-right text-green-400">${formatCurrency(buyer.cashFlows.reduce((a, b) => a + b, 0))}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// ========== ROI TAB ==========

function renderROITab() {
    const roiData = generateROITrajectoryData(currentProjectionData);
    const { buyer, developer, params } = currentProjectionData;

    return `
        <div class="roi-view">
            <!-- ROI Trajectory Chart -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-4">${roiData.title}</h4>
                ${renderROIChart(roiData)}
            </div>

            <!-- Break-Even Analysis -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Break-Even Analysis</h4>
                ${renderBreakEvenAnalysis()}
            </div>

            <!-- Detailed ROI Table -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-gray-300 mb-4">ROI Details</h4>
                ${renderROITable(roiData, params)}
            </div>
        </div>
    `;
}

function renderROIChart(roiData) {
    const maxROI = Math.max(...roiData.data.map(d => Math.max(d.cumulativeROI, d.targetROI)));

    return `
        <div class="roi-chart relative h-48">
            <!-- Chart area -->
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <!-- Target ROI line -->
                <polyline
                    points="${roiData.data.map((d, idx) => `${(idx / (roiData.data.length - 1)) * 100},${100 - (d.targetROI / maxROI) * 100}`).join(' ')}"
                    fill="none" stroke="#F59E0B" stroke-width="1" stroke-dasharray="4,2"
                />

                <!-- Cumulative ROI line -->
                <polyline
                    points="${roiData.data.map((d, idx) => `${(idx / (roiData.data.length - 1)) * 100},${100 - (d.cumulativeROI / maxROI) * 100}`).join(' ')}"
                    fill="none" stroke="#10B981" stroke-width="2"
                />

                <!-- Break-even marker -->
                ${roiData.breakEvenYear < roiData.data.length ? `
                    <line x1="${(roiData.breakEvenYear / roiData.data.length) * 100}" y1="0"
                          x2="${(roiData.breakEvenYear / roiData.data.length) * 100}" y2="100"
                          stroke="#EF4444" stroke-width="1" stroke-dasharray="2,2" />
                ` : ''}
            </svg>

            <!-- Y-axis labels -->
            <div class="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
                <span>${maxROI.toFixed(0)}%</span>
                <span>0%</span>
            </div>

            <!-- X-axis labels -->
            <div class="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
                ${roiData.data.map(d => `<span>Y${d.year}</span>`).join('')}
            </div>
        </div>

        <!-- Legend -->
        <div class="flex justify-center gap-6 mt-6">
            <div class="flex items-center gap-2">
                <div class="w-4 h-0.5 bg-green-500"></div>
                <span class="text-xs text-gray-400">Cumulative ROI</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-0.5 bg-yellow-500 border-dashed"></div>
                <span class="text-xs text-gray-400">Target ROI (Hurdle Rate)</span>
            </div>
        </div>
    `;
}

function renderBreakEvenAnalysis() {
    if (!transactionResults) {
        return '<p class="text-gray-400 text-sm">No transaction data available</p>';
    }

    const breakEven = calculateRevenueBreakEven(transactionResults, projectionParams);

    return `
        <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-3 bg-gray-700/50 rounded-lg">
                <div class="text-xl font-bold text-blue-400">${formatCurrency(breakEven.breakEvenRevenue)}</div>
                <div class="text-xs text-gray-400 mt-1">Break-Even Revenue</div>
            </div>
            <div class="text-center p-3 bg-gray-700/50 rounded-lg">
                <div class="text-xl font-bold text-green-400">${formatCurrency(breakEven.initialInvestment)}</div>
                <div class="text-xs text-gray-400 mt-1">Initial Investment</div>
            </div>
            <div class="text-center p-3 bg-gray-700/50 rounded-lg">
                <div class="text-xl font-bold text-purple-400">${(breakEven.revenueToInvestmentRatio * 100).toFixed(0)}%</div>
                <div class="text-xs text-gray-400 mt-1">Revenue/Investment Ratio</div>
            </div>
        </div>
        <p class="text-sm text-gray-400 mt-4">${breakEven.description}</p>
    `;
}

function renderROITable(roiData, params) {
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="text-left py-2 text-gray-400">Year</th>
                        <th class="text-right py-2 text-gray-400">Annual ROI</th>
                        <th class="text-right py-2 text-gray-400">Cumulative ROI</th>
                        <th class="text-right py-2 text-gray-400">Target ROI</th>
                        <th class="text-right py-2 text-gray-400">Variance</th>
                    </tr>
                </thead>
                <tbody>
                    ${roiData.data.map(d => {
                        const variance = d.cumulativeROI - d.targetROI;
                        return `
                            <tr class="border-b border-gray-800">
                                <td class="py-2 text-gray-300">Year ${d.year}</td>
                                <td class="py-2 text-right text-blue-300">${d.annualROI.toFixed(1)}%</td>
                                <td class="py-2 text-right text-green-300">${d.cumulativeROI.toFixed(1)}%</td>
                                <td class="py-2 text-right text-yellow-300">${d.targetROI.toFixed(1)}%</td>
                                <td class="py-2 text-right ${variance >= 0 ? 'text-green-400' : 'text-red-400'}">
                                    ${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ========== ASSETS TAB ==========

function renderAssetsTab() {
    if (!transactionResults) {
        return `<div class="text-center py-8 text-gray-400">No transaction data available</div>`;
    }

    const assetChartData = generateAssetValueChartData(transactionResults, projectionParams);
    const { buyer } = currentProjectionData;

    return `
        <div class="assets-view">
            <!-- Asset Value Chart -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-4">${assetChartData.title}</h4>
                ${renderAssetValueChart(assetChartData)}
            </div>

            <!-- Asset Metrics -->
            <div class="grid grid-cols-4 gap-4 mb-6">
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <div class="text-xl font-bold text-blue-400">${formatCurrency(assetChartData.data[0]?.grossValue || 0)}</div>
                    <div class="text-xs text-gray-400 mt-1">Initial Asset Value</div>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <div class="text-xl font-bold text-green-400">${formatCurrency(buyer.metrics.totalEnhancements)}</div>
                    <div class="text-xs text-gray-400 mt-1">Total Enhancements</div>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <div class="text-xl font-bold text-purple-400">${formatCurrency(buyer.metrics.finalAssetValue)}</div>
                    <div class="text-xs text-gray-400 mt-1">Final Net Value</div>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                    <div class="text-xl font-bold text-yellow-400">
                        ${((buyer.metrics.finalAssetValue / (assetChartData.data[0]?.grossValue || 1)) * 100).toFixed(0)}%
                    </div>
                    <div class="text-xs text-gray-400 mt-1">Value Retention</div>
                </div>
            </div>

            <!-- Asset Value Table -->
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-gray-300 mb-4">Year-by-Year Asset Values</h4>
                ${renderAssetTable(assetChartData)}
            </div>
        </div>
    `;
}

function renderAssetValueChart(assetChartData) {
    const maxValue = Math.max(...assetChartData.data.map(d => d.grossValue));

    return `
        <div class="asset-chart flex items-end justify-between gap-2 h-48">
            ${assetChartData.data.map((d, idx) => {
                const grossHeight = (d.grossValue / maxValue) * 100;
                const netHeight = (d.netValue / maxValue) * 100;
                const amortHeight = (d.amortisation / maxValue) * 100;

                return `
                    <div class="flex-1 flex flex-col items-center">
                        <div class="w-full relative h-36 flex items-end">
                            <!-- Gross value (background) -->
                            <div class="absolute bottom-0 w-full bg-blue-900/30 rounded-t"
                                 style="height: ${grossHeight}%"></div>
                            <!-- Net value (foreground) -->
                            <div class="absolute bottom-0 w-full bg-green-600 rounded-t"
                                 style="height: ${netHeight}%"></div>
                            <!-- Enhancement indicator -->
                            ${d.enhancements > 0 ? `
                                <div class="absolute bottom-0 w-full bg-purple-600/50 rounded-t"
                                     style="height: ${(d.enhancements / maxValue) * 100}%"></div>
                            ` : ''}
                        </div>
                        <span class="text-xs text-gray-500 mt-2">Y${d.year}</span>
                    </div>
                `;
            }).join('')}
        </div>

        <!-- Legend -->
        <div class="flex justify-center gap-6 mt-4">
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded bg-blue-900/50"></div>
                <span class="text-xs text-gray-400">Gross Value</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded bg-green-600"></div>
                <span class="text-xs text-gray-400">Net Book Value</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded bg-purple-600/50"></div>
                <span class="text-xs text-gray-400">Enhancements</span>
            </div>
        </div>
    `;
}

function renderAssetTable(assetChartData) {
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="text-left py-2 text-gray-400">Year</th>
                        <th class="text-right py-2 text-gray-400">Gross Value</th>
                        <th class="text-right py-2 text-gray-400">Accum. Amort.</th>
                        <th class="text-right py-2 text-gray-400">Net Value</th>
                        <th class="text-right py-2 text-gray-400">Enhancement</th>
                    </tr>
                </thead>
                <tbody>
                    ${assetChartData.data.map(d => `
                        <tr class="border-b border-gray-800">
                            <td class="py-2 text-gray-300">Year ${d.year}</td>
                            <td class="py-2 text-right text-blue-300">${formatCurrency(d.grossValue)}</td>
                            <td class="py-2 text-right text-red-300">(${formatCurrency(d.amortisation)})</td>
                            <td class="py-2 text-right text-green-300">${formatCurrency(d.netValue)}</td>
                            <td class="py-2 text-right text-purple-300">${formatCurrency(d.enhancements)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ========== EVENT HANDLERS ==========

function setupEventListeners(container, options) {
    // Tab switching
    container.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.projection-tab-btn');
        if (tabBtn) {
            activeTab = tabBtn.dataset.tab;
            renderProjectionPanel(container, options);
            return;
        }

        // Update projections button
        if (e.target.closest('#updateProjectionsBtn')) {
            updateProjections(container, options);
            return;
        }

        // Export button
        if (e.target.closest('#exportProjectionsBtn')) {
            exportProjections();
            return;
        }
    });
}

function updateProjections(container, options) {
    // Gather new parameters
    const periodSelect = container.querySelector('#projectionPeriod');
    const discountInput = container.querySelector('#discountRate');
    const revenueGrowthInput = container.querySelector('#revenueGrowthRate');
    const enhancementInput = container.querySelector('#enhancementCostPercent');

    projectionParams = {
        ...projectionParams,
        projectionPeriod: parseInt(periodSelect?.value || '5'),
        discountRate: parseFloat(discountInput?.value || '12') / 100,
        revenueGrowthRate: parseFloat(revenueGrowthInput?.value || '8') / 100,
        enhancementCostPercent: parseFloat(enhancementInput?.value || '10') / 100
    };

    // Recalculate projections
    if (transactionResults) {
        currentProjectionData = generateProjections(transactionResults, projectionParams);
    }

    renderProjectionPanel(container, options);
}

function exportProjections() {
    if (!currentProjectionData) return;

    const { developer, buyer, summary, years } = currentProjectionData;

    // Create CSV content
    let csv = 'Growth Projections Export\n\n';

    csv += 'Summary Metrics\n';
    csv += 'Party,NPV,IRR,Payback Period,Assessment\n';
    csv += `Developer,${developer.metrics.npv.toFixed(0)},${(developer.metrics.irr * 100).toFixed(1)}%,${developer.metrics.paybackPeriod.toFixed(1)} years,${summary.developer.assessment.rating}\n`;
    csv += `Buyer,${buyer.metrics.npv.toFixed(0)},${(buyer.metrics.irr * 100).toFixed(1)}%,${buyer.metrics.paybackPeriod.toFixed(1)} years,${summary.buyer.assessment.rating}\n`;

    csv += '\nYearly Cash Flows\n';
    csv += 'Year,Developer,Buyer\n';
    csv += `Initial,${developer.cashFlows[0].toFixed(0)},${buyer.cashFlows[0].toFixed(0)}\n`;

    for (let i = 0; i < years; i++) {
        csv += `Year ${i + 1},${developer.yearlyData[i].cashFlow.toFixed(0)},${buyer.yearlyData[i].cashFlow.toFixed(0)}\n`;
    }

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'growth-projections.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// ========== PUBLIC API ==========

/**
 * Update projection data and re-render
 * @param {HTMLElement} container - Container element
 * @param {Object} newResults - New transaction results
 * @param {Object} options - Configuration options
 */
export function updateProjectionData(container, newResults, options = {}) {
    transactionResults = newResults;
    projectionParams = { ...DEFAULT_PROJECTION_PARAMS, ...options.projectionParams };

    if (transactionResults) {
        currentProjectionData = generateProjections(transactionResults, projectionParams);
    }

    renderProjectionPanel(container, options);
}

/**
 * Get current projection data
 */
export function getCurrentProjectionData() {
    return currentProjectionData;
}

/**
 * Destroy projection visualizations
 */
export function destroyProjectionVisualizations() {
    currentProjectionData = null;
    transactionResults = null;
    activeTab = 'overview';
    projectionParams = { ...DEFAULT_PROJECTION_PARAMS };
}

// ========== EXPORTS ==========

export default {
    initProjectionVisualizations,
    updateProjectionData,
    getCurrentProjectionData,
    destroyProjectionVisualizations
};
