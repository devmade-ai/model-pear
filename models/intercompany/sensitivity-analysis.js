// ========== SENSITIVITY ANALYSIS MODULE ==========
// Phase 11: Range Selections & Sensitivity Analysis
// Provides range-based scenario analysis, break-even calculations, and Monte Carlo simulation.
//
// Features:
// - 11.1 Range Input Framework: Low/Base/High input modes
// - 11.2 Sensitivity Calculations: Best/Base/Worst case scenarios
// - 11.3 Sensitivity Visualizations: Tornado charts, fan charts, break-even analysis

import { INTERCOMPANY_MODELS, calculateIntercompany, DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from './registry.js';

// ========== RANGE INPUT DEFINITIONS ==========

/**
 * Defines which inputs support range selection and their typical variance
 */
export const RANGE_ENABLED_INPUTS = {
    // Cost inputs - typically +/- 20% variance
    developmentCost: { variance: 0.20, label: 'Development Cost', category: 'cost' },
    researchPhaseCost: { variance: 0.25, label: 'Research Phase Cost', category: 'cost' },
    developmentPhaseCost: { variance: 0.20, label: 'Development Phase Cost', category: 'cost' },
    totalProjectCost: { variance: 0.20, label: 'Total Project Cost', category: 'cost' },
    buildCost: { variance: 0.20, label: 'Build Cost', category: 'cost' },
    costOfDevelopment: { variance: 0.20, label: 'Cost of Development', category: 'cost' },
    setupCost: { variance: 0.15, label: 'Setup Cost', category: 'cost' },
    operatingCost: { variance: 0.15, label: 'Operating Cost', category: 'cost' },

    // Revenue inputs - typically +/- 30% variance
    salePrice: { variance: 0.25, label: 'Sale Price', category: 'revenue' },
    licenceFee: { variance: 0.25, label: 'Licence Fee', category: 'revenue' },
    expectedRevenue: { variance: 0.30, label: 'Expected Revenue', category: 'revenue' },
    operatingRevenue: { variance: 0.30, label: 'Operating Revenue', category: 'revenue' },
    transferPrice: { variance: 0.25, label: 'Transfer Price', category: 'revenue' },
    monthlyFee: { variance: 0.20, label: 'Monthly Fee', category: 'revenue' },
    supportFee: { variance: 0.15, label: 'Support Fee', category: 'revenue' },

    // Margin inputs - typically +/- 5 percentage points
    markupPercentage: { variance: 0.50, label: 'Markup %', category: 'margin', isPercent: true },
    royaltyRate: { variance: 0.40, label: 'Royalty Rate', category: 'margin', isPercent: true },

    // Duration inputs - +/- 1-2 years
    usefulLife: { variance: 0.40, label: 'Useful Life', category: 'duration', isInteger: true },
    operatePeriod: { variance: 0.33, label: 'Operate Period', category: 'duration', isInteger: true },
    contractPeriod: { variance: 0.25, label: 'Contract Period', category: 'duration', isInteger: true },

    // Tax inputs - small variance
    corporateTaxRate: { variance: 0.10, label: 'Corporate Tax Rate', category: 'tax', isPercent: true }
};

// ========== RANGE CALCULATIONS ==========

/**
 * Create a range from a base value using standard variance
 * @param {string} inputName - Name of the input
 * @param {number} baseValue - The base value
 * @param {Object} options - Custom options
 * @returns {Object} Range with low, base, high values
 */
export function createRange(inputName, baseValue, options = {}) {
    const config = RANGE_ENABLED_INPUTS[inputName] || { variance: 0.20 };
    const variance = options.variance ?? config.variance;

    let low = baseValue * (1 - variance);
    let high = baseValue * (1 + variance);

    // For percentages, ensure reasonable bounds
    if (config.isPercent) {
        low = Math.max(0, low);
        high = Math.min(100, high);
    }

    // For integers, round to whole numbers
    if (config.isInteger) {
        low = Math.max(1, Math.floor(low));
        high = Math.ceil(high);
    }

    return {
        low: options.low ?? low,
        base: baseValue,
        high: options.high ?? high,
        variance,
        inputName,
        label: config.label || inputName,
        category: config.category || 'other'
    };
}

/**
 * Create ranges for all supported inputs in a model
 * @param {Object} baseInputs - Base input values
 * @returns {Object} Ranges for all applicable inputs
 */
export function createInputRanges(baseInputs) {
    const ranges = {};

    Object.entries(baseInputs).forEach(([name, value]) => {
        if (typeof value === 'number' && RANGE_ENABLED_INPUTS[name]) {
            ranges[name] = createRange(name, value);
        }
    });

    return ranges;
}

// ========== SCENARIO ANALYSIS ==========

/**
 * Calculate results for all three scenarios (best, base, worst)
 * @param {string} modelId - Model ID
 * @param {string} variantId - Variant ID
 * @param {Object} ranges - Input ranges
 * @param {Object} entityConfig - Entity configuration
 * @param {Object} taxParams - Tax parameters
 * @returns {Object} Results for all scenarios
 */
export function calculateScenarios(modelId, variantId, ranges, entityConfig = DEFAULT_ENTITY_CONFIG, taxParams = DEFAULT_TAX_PARAMS) {
    // Base case uses base values
    const baseInputs = {};
    Object.entries(ranges).forEach(([name, range]) => {
        baseInputs[name] = range.base;
    });

    // Best case: low costs, high revenues
    const bestInputs = {};
    Object.entries(ranges).forEach(([name, range]) => {
        const category = range.category;
        if (category === 'cost') {
            bestInputs[name] = range.low;  // Lower costs are better
        } else if (category === 'revenue' || category === 'margin') {
            bestInputs[name] = range.high;  // Higher revenue is better
        } else {
            bestInputs[name] = range.base;
        }
    });

    // Worst case: high costs, low revenues
    const worstInputs = {};
    Object.entries(ranges).forEach(([name, range]) => {
        const category = range.category;
        if (category === 'cost') {
            worstInputs[name] = range.high;  // Higher costs are worse
        } else if (category === 'revenue' || category === 'margin') {
            worstInputs[name] = range.low;  // Lower revenue is worse
        } else {
            worstInputs[name] = range.base;
        }
    });

    try {
        const baseResults = calculateIntercompany(modelId, variantId, baseInputs, entityConfig, taxParams);
        const bestResults = calculateIntercompany(modelId, variantId, bestInputs, entityConfig, taxParams);
        const worstResults = calculateIntercompany(modelId, variantId, worstInputs, entityConfig, taxParams);

        return {
            base: {
                inputs: baseInputs,
                results: baseResults,
                label: 'Base Case'
            },
            best: {
                inputs: bestInputs,
                results: bestResults,
                label: 'Best Case'
            },
            worst: {
                inputs: worstInputs,
                results: worstResults,
                label: 'Worst Case'
            },
            summary: generateScenarioSummary(baseResults, bestResults, worstResults)
        };
    } catch (error) {
        return {
            error: error.message,
            base: null,
            best: null,
            worst: null
        };
    }
}

/**
 * Generate summary metrics across scenarios
 */
function generateScenarioSummary(baseResults, bestResults, worstResults) {
    const getMetric = (results, path) => {
        const parts = path.split('.');
        let value = results;
        for (const part of parts) {
            value = value?.[part];
        }
        return value || 0;
    };

    const metrics = [
        { key: 'developerProfit', path: 'developer.profit.net', label: 'Developer Net Profit', format: 'currency' },
        { key: 'buyerTotalCost', path: 'buyer.totalCost', label: 'Buyer Total Cost', format: 'currency' },
        { key: 'combinedValue', path: 'combined.totalValue', label: 'Combined Transaction Value', format: 'currency' }
    ];

    const summary = {};
    metrics.forEach(metric => {
        const base = getMetric(baseResults, metric.path);
        const best = getMetric(bestResults, metric.path);
        const worst = getMetric(worstResults, metric.path);

        summary[metric.key] = {
            base,
            best,
            worst,
            range: Math.abs(best - worst),
            volatility: base !== 0 ? Math.abs(best - worst) / Math.abs(base) : 0,
            label: metric.label,
            format: metric.format
        };
    });

    return summary;
}

// ========== INPUT SENSITIVITY ANALYSIS ==========

/**
 * Calculate sensitivity of outputs to each input
 * @param {string} modelId - Model ID
 * @param {string} variantId - Variant ID
 * @param {Object} baseInputs - Base input values
 * @param {Object} entityConfig - Entity configuration
 * @param {Object} taxParams - Tax parameters
 * @returns {Object} Sensitivity rankings for each input
 */
export function calculateInputSensitivity(modelId, variantId, baseInputs, entityConfig = DEFAULT_ENTITY_CONFIG, taxParams = DEFAULT_TAX_PARAMS) {
    const sensitivities = [];
    const baseResults = calculateIntercompany(modelId, variantId, baseInputs, entityConfig, taxParams);
    const baseProfit = baseResults.developer?.profit?.net || 0;

    // Test sensitivity of each range-enabled input
    Object.entries(baseInputs).forEach(([inputName, baseValue]) => {
        if (typeof baseValue !== 'number' || !RANGE_ENABLED_INPUTS[inputName]) {
            return;
        }

        const config = RANGE_ENABLED_INPUTS[inputName];
        const variance = config.variance;

        // Calculate with low value
        const lowInputs = { ...baseInputs, [inputName]: baseValue * (1 - variance) };
        const lowResults = calculateIntercompany(modelId, variantId, lowInputs, entityConfig, taxParams);
        const lowProfit = lowResults.developer?.profit?.net || 0;

        // Calculate with high value
        const highInputs = { ...baseInputs, [inputName]: baseValue * (1 + variance) };
        const highResults = calculateIntercompany(modelId, variantId, highInputs, entityConfig, taxParams);
        const highProfit = highResults.developer?.profit?.net || 0;

        const impact = Math.abs(highProfit - lowProfit);
        const percentChange = baseProfit !== 0 ? (impact / Math.abs(baseProfit)) * 100 : 0;

        sensitivities.push({
            inputName,
            label: config.label || inputName,
            category: config.category,
            baseValue,
            lowValue: baseValue * (1 - variance),
            highValue: baseValue * (1 + variance),
            lowProfit,
            highProfit,
            baseProfit,
            impact,
            percentChange,
            direction: highProfit > lowProfit ? 'positive' : 'negative'
        });
    });

    // Sort by absolute impact
    sensitivities.sort((a, b) => b.impact - a.impact);

    return {
        baseProfit,
        sensitivities,
        topInfluencers: sensitivities.slice(0, 5),
        totalVariance: sensitivities.reduce((sum, s) => sum + s.impact, 0)
    };
}

// ========== BREAK-EVEN ANALYSIS ==========

/**
 * Calculate break-even points for key inputs
 * @param {string} modelId - Model ID
 * @param {string} variantId - Variant ID
 * @param {Object} baseInputs - Base input values
 * @param {Object} entityConfig - Entity configuration
 * @param {Object} taxParams - Tax parameters
 * @returns {Object} Break-even analysis results
 */
export function calculateBreakEven(modelId, variantId, baseInputs, entityConfig = DEFAULT_ENTITY_CONFIG, taxParams = DEFAULT_TAX_PARAMS) {
    const baseResults = calculateIntercompany(modelId, variantId, baseInputs, entityConfig, taxParams);
    const baseProfit = baseResults.developer?.profit?.net || 0;

    const breakEvenPoints = {};

    // For each revenue-type input, find where profit = 0
    Object.entries(baseInputs).forEach(([inputName, baseValue]) => {
        if (typeof baseValue !== 'number' || !RANGE_ENABLED_INPUTS[inputName]) {
            return;
        }

        const config = RANGE_ENABLED_INPUTS[inputName];

        // Only calculate break-even for revenue/margin inputs
        if (config.category !== 'revenue' && config.category !== 'margin') {
            return;
        }

        // Binary search for break-even point
        let low = 0;
        let high = baseValue * 2;
        let iterations = 0;
        const maxIterations = 50;

        while (iterations < maxIterations && (high - low) > baseValue * 0.001) {
            const mid = (low + high) / 2;
            const testInputs = { ...baseInputs, [inputName]: mid };
            const testResults = calculateIntercompany(modelId, variantId, testInputs, entityConfig, taxParams);
            const testProfit = testResults.developer?.profit?.net || 0;

            if (testProfit < 0) {
                low = mid;
            } else {
                high = mid;
            }
            iterations++;
        }

        const breakEvenValue = (low + high) / 2;
        const margin = ((baseValue - breakEvenValue) / baseValue) * 100;

        breakEvenPoints[inputName] = {
            inputName,
            label: config.label || inputName,
            baseValue,
            breakEvenValue,
            margin,
            marginOfSafety: margin > 0 ? 'Safe' : 'At Risk',
            description: margin > 0
                ? `${inputName} can decrease by ${margin.toFixed(1)}% before breaking even`
                : `${inputName} needs to increase by ${Math.abs(margin).toFixed(1)}% to break even`
        };
    });

    // Calculate cost-based break-even (max cost before loss)
    Object.entries(baseInputs).forEach(([inputName, baseValue]) => {
        if (typeof baseValue !== 'number' || !RANGE_ENABLED_INPUTS[inputName]) {
            return;
        }

        const config = RANGE_ENABLED_INPUTS[inputName];

        if (config.category !== 'cost') {
            return;
        }

        // Binary search for break-even point
        let low = baseValue;
        let high = baseValue * 3;
        let iterations = 0;
        const maxIterations = 50;

        while (iterations < maxIterations && (high - low) > baseValue * 0.001) {
            const mid = (low + high) / 2;
            const testInputs = { ...baseInputs, [inputName]: mid };
            const testResults = calculateIntercompany(modelId, variantId, testInputs, entityConfig, taxParams);
            const testProfit = testResults.developer?.profit?.net || 0;

            if (testProfit > 0) {
                low = mid;
            } else {
                high = mid;
            }
            iterations++;
        }

        const breakEvenValue = (low + high) / 2;
        const margin = ((breakEvenValue - baseValue) / baseValue) * 100;

        breakEvenPoints[inputName] = {
            inputName,
            label: config.label || inputName,
            baseValue,
            breakEvenValue,
            margin,
            marginOfSafety: margin > 0 ? 'Safe' : 'At Risk',
            description: margin > 0
                ? `${inputName} can increase by ${margin.toFixed(1)}% before breaking even`
                : `Already at a loss`
        };
    });

    return {
        baseProfit,
        isProfitable: baseProfit > 0,
        breakEvenPoints,
        summary: Object.values(breakEvenPoints)
            .filter(bp => bp.margin > 0)
            .sort((a, b) => a.margin - b.margin)
            .slice(0, 3)
            .map(bp => `${bp.label}: ${bp.margin.toFixed(1)}% margin`)
            .join(', ')
    };
}

// ========== MONTE CARLO SIMULATION ==========

/**
 * Run Monte Carlo simulation for probabilistic outcomes
 * @param {string} modelId - Model ID
 * @param {string} variantId - Variant ID
 * @param {Object} ranges - Input ranges
 * @param {Object} entityConfig - Entity configuration
 * @param {Object} taxParams - Tax parameters
 * @param {number} iterations - Number of simulation runs
 * @returns {Object} Monte Carlo simulation results
 */
export function runMonteCarloSimulation(
    modelId,
    variantId,
    ranges,
    entityConfig = DEFAULT_ENTITY_CONFIG,
    taxParams = DEFAULT_TAX_PARAMS,
    iterations = 1000
) {
    const results = [];
    const profits = [];
    const costs = [];

    for (let i = 0; i < iterations; i++) {
        // Generate random inputs within ranges using triangular distribution
        const randomInputs = {};
        Object.entries(ranges).forEach(([name, range]) => {
            randomInputs[name] = triangularRandom(range.low, range.base, range.high);
        });

        try {
            const result = calculateIntercompany(modelId, variantId, randomInputs, entityConfig, taxParams);
            const profit = result.developer?.profit?.net || 0;
            const cost = result.buyer?.totalCost || 0;

            results.push({
                inputs: randomInputs,
                profit,
                cost
            });
            profits.push(profit);
            costs.push(cost);
        } catch (error) {
            // Skip failed calculations
        }
    }

    // Calculate statistics
    profits.sort((a, b) => a - b);
    costs.sort((a, b) => a - b);

    const profitStats = calculateStatistics(profits);
    const costStats = calculateStatistics(costs);

    // Calculate percentiles
    const percentiles = [5, 10, 25, 50, 75, 90, 95];
    const profitPercentiles = {};
    const costPercentiles = {};

    percentiles.forEach(p => {
        const index = Math.floor((p / 100) * profits.length);
        profitPercentiles[`p${p}`] = profits[index];
        costPercentiles[`p${p}`] = costs[index];
    });

    // Calculate probability of loss
    const lossCount = profits.filter(p => p < 0).length;
    const probabilityOfLoss = (lossCount / profits.length) * 100;

    // Create histogram data
    const profitHistogram = createHistogram(profits, 20);
    const costHistogram = createHistogram(costs, 20);

    return {
        iterations: results.length,
        profit: {
            ...profitStats,
            percentiles: profitPercentiles,
            histogram: profitHistogram,
            probabilityOfLoss
        },
        cost: {
            ...costStats,
            percentiles: costPercentiles,
            histogram: costHistogram
        },
        confidence: {
            profit90: {
                low: profitPercentiles.p5,
                high: profitPercentiles.p95,
                range: profitPercentiles.p95 - profitPercentiles.p5
            },
            cost90: {
                low: costPercentiles.p5,
                high: costPercentiles.p95,
                range: costPercentiles.p95 - costPercentiles.p5
            }
        },
        summary: `Based on ${results.length} simulations: Expected profit R${profitStats.mean.toLocaleString()} (${probabilityOfLoss.toFixed(1)}% chance of loss)`
    };
}

/**
 * Triangular distribution random number
 */
function triangularRandom(min, mode, max) {
    const u = Math.random();
    const f = (mode - min) / (max - min);

    if (u < f) {
        return min + Math.sqrt(u * (max - min) * (mode - min));
    } else {
        return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
    }
}

/**
 * Calculate basic statistics for an array of numbers
 */
function calculateStatistics(values) {
    if (values.length === 0) {
        return { mean: 0, median: 0, min: 0, max: 0, stdDev: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(avgSquaredDiff);

    return { mean, median, min, max, stdDev };
}

/**
 * Create histogram data for visualization
 */
function createHistogram(values, bins = 20) {
    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;

    const histogram = Array(bins).fill(0).map((_, i) => ({
        binStart: min + i * binWidth,
        binEnd: min + (i + 1) * binWidth,
        count: 0,
        frequency: 0
    }));

    values.forEach(v => {
        const binIndex = Math.min(Math.floor((v - min) / binWidth), bins - 1);
        if (binIndex >= 0 && binIndex < bins) {
            histogram[binIndex].count++;
        }
    });

    histogram.forEach(bin => {
        bin.frequency = (bin.count / values.length) * 100;
    });

    return histogram;
}

// ========== VISUALIZATION DATA GENERATORS ==========

/**
 * Generate tornado chart data from sensitivity analysis
 * @param {Object} sensitivityData - Result from calculateInputSensitivity
 * @returns {Object} Chart-ready data for tornado visualization
 */
export function generateTornadoChartData(sensitivityData) {
    const { sensitivities, baseProfit } = sensitivityData;

    // Take top 10 most impactful inputs
    const topInputs = sensitivities.slice(0, 10);

    return {
        type: 'tornado',
        title: 'Input Sensitivity Analysis',
        subtitle: 'Impact of input variations on Developer Profit',
        baseValue: baseProfit,
        series: topInputs.map(s => ({
            label: s.label,
            lowValue: s.lowProfit,
            highValue: s.highProfit,
            baseValue: baseProfit,
            lowDelta: s.lowProfit - baseProfit,
            highDelta: s.highProfit - baseProfit,
            impact: s.impact,
            percentChange: s.percentChange,
            category: s.category
        }))
    };
}

/**
 * Generate fan chart data from scenario analysis
 * @param {Object} scenarioData - Result from calculateScenarios
 * @param {number} years - Number of years to project
 * @returns {Object} Chart-ready data for fan chart visualization
 */
export function generateFanChartData(scenarioData, years = 5) {
    const { base, best, worst, summary } = scenarioData;

    if (!base || !best || !worst) {
        return null;
    }

    // Project profits over time (simplified linear projection)
    const baseProfit = base.results.developer?.profit?.net || 0;
    const bestProfit = best.results.developer?.profit?.net || 0;
    const worstProfit = worst.results.developer?.profit?.net || 0;

    const projections = [];
    for (let year = 0; year <= years; year++) {
        const growth = 1 + (year * 0.05); // 5% annual growth assumption
        projections.push({
            year,
            base: baseProfit * growth,
            best: bestProfit * growth,
            worst: worstProfit * growth,
            p10: worstProfit * growth * 0.8,
            p25: (worstProfit + baseProfit) / 2 * growth,
            p75: (baseProfit + bestProfit) / 2 * growth,
            p90: bestProfit * growth * 1.1
        });
    }

    return {
        type: 'fan',
        title: 'Profit Projection Range',
        subtitle: `${years}-Year projection with uncertainty bands`,
        data: projections,
        bands: [
            { name: 'P10-P90', opacity: 0.2, color: '#3B82F6' },
            { name: 'P25-P75', opacity: 0.4, color: '#3B82F6' },
            { name: 'Base', opacity: 1, color: '#3B82F6' }
        ]
    };
}

/**
 * Generate break-even chart data
 * @param {Object} breakEvenData - Result from calculateBreakEven
 * @returns {Object} Chart-ready data for break-even visualization
 */
export function generateBreakEvenChartData(breakEvenData) {
    const { breakEvenPoints, baseProfit } = breakEvenData;

    const chartData = Object.values(breakEvenPoints)
        .filter(bp => bp.margin !== undefined)
        .sort((a, b) => a.margin - b.margin)
        .map(bp => ({
            label: bp.label,
            baseValue: bp.baseValue,
            breakEvenValue: bp.breakEvenValue,
            margin: bp.margin,
            status: bp.marginOfSafety,
            color: bp.margin > 20 ? '#10B981' : bp.margin > 10 ? '#F59E0B' : '#EF4444'
        }));

    return {
        type: 'breakeven',
        title: 'Break-Even Analysis',
        subtitle: 'Margin of safety for key inputs',
        baseProfit,
        data: chartData
    };
}

/**
 * Generate Monte Carlo histogram data
 * @param {Object} monteCarloData - Result from runMonteCarloSimulation
 * @returns {Object} Chart-ready data for histogram visualization
 */
export function generateMonteCarloChartData(monteCarloData) {
    const { profit, confidence, iterations } = monteCarloData;

    return {
        type: 'histogram',
        title: 'Monte Carlo Profit Distribution',
        subtitle: `Based on ${iterations.toLocaleString()} simulations`,
        histogram: profit.histogram,
        statistics: {
            mean: profit.mean,
            median: profit.median,
            stdDev: profit.stdDev,
            min: profit.min,
            max: profit.max
        },
        confidence: confidence.profit90,
        probabilityOfLoss: profit.probabilityOfLoss,
        annotations: [
            { value: profit.mean, label: 'Mean', color: '#3B82F6' },
            { value: profit.percentiles.p5, label: 'P5', color: '#EF4444' },
            { value: profit.percentiles.p95, label: 'P95', color: '#10B981' }
        ]
    };
}

// ========== EXPORTS ==========

export default {
    // Range handling
    RANGE_ENABLED_INPUTS,
    createRange,
    createInputRanges,

    // Calculations
    calculateScenarios,
    calculateInputSensitivity,
    calculateBreakEven,
    runMonteCarloSimulation,

    // Visualization data
    generateTornadoChartData,
    generateFanChartData,
    generateBreakEvenChartData,
    generateMonteCarloChartData
};
