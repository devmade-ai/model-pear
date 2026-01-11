// ========== ADVANCED VISUALIZATIONS ==========
// Data processing module for Phase 10: Advanced Visualisations
// Provides cross-model comparison data, timeline data, and risk visualization data.
//
// Part of Phase 10 implementation:
// - 10.1 Cross-Model Comparison Charts
// - 10.2 Timeline Visualisations
// - 10.3 Risk Visualisations

import { INTERCOMPANY_MODELS, calculateIntercompany, DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from './registry.js';

// ========== CHART COLOR PALETTE ==========

export const VIZ_COLORS = {
    models: {
        'model-1': '#3B82F6', // Blue - Cost-Plus
        'model-2': '#10B981', // Green - Licence
        'model-3': '#F59E0B', // Amber - Joint Development
        'model-4': '#8B5CF6', // Purple - BOT
        'model-5': '#EF4444', // Red - Software Sale
        'model-6': '#06B6D4'  // Cyan - SaaS
    },
    perspectives: {
        developer: '#3B82F6',
        buyer: '#10B981'
    },
    risk: {
        low: '#10B981',
        medium: '#F59E0B',
        high: '#EF4444'
    },
    gradients: {
        positive: ['#10B981', '#059669'],
        negative: ['#EF4444', '#DC2626'],
        neutral: ['#6B7280', '#4B5563']
    }
};

// ========== 10.1 CROSS-MODEL COMPARISON ==========

/**
 * Generate comparison data for all models with given inputs
 * @param {Object} baseInputs - Common inputs to use across models
 * @param {Object} entityConfig - Entity configuration
 * @param {Object} taxParams - Tax parameters
 * @returns {Object} Comparison data for all models
 */
export function generateCrossModelComparison(baseInputs, entityConfig = DEFAULT_ENTITY_CONFIG, taxParams = DEFAULT_TAX_PARAMS) {
    const modelResults = {};
    const errors = [];

    // Calculate results for each model's default variant
    Object.entries(INTERCOMPANY_MODELS).forEach(([modelId, model]) => {
        try {
            // Map base inputs to model-specific inputs
            const modelInputs = mapInputsToModel(baseInputs, modelId, model);
            const variantId = model.defaultVariant;

            const results = calculateIntercompany(modelId, variantId, modelInputs, entityConfig, taxParams);
            modelResults[modelId] = {
                name: model.shortName || model.name,
                variant: variantId,
                results: results,
                color: VIZ_COLORS.models[modelId]
            };
        } catch (error) {
            errors.push({ modelId, error: error.message });
        }
    });

    return {
        models: modelResults,
        errors: errors,
        summary: generateComparisonSummary(modelResults),
        charts: {
            modelComparison: generateModelComparisonChartData(modelResults),
            assetPosition: generateAssetPositionChartData(modelResults),
            totalCostToBuyer: generateTotalCostChartData(modelResults),
            developerReturn: generateDeveloperReturnChartData(modelResults),
            riskComparison: generateRiskComparisonChartData(modelResults)
        }
    };
}

/**
 * Map common inputs to model-specific inputs
 */
function mapInputsToModel(baseInputs, modelId, model) {
    const mapped = { ...baseInputs };

    // Common mappings based on model type
    const cost = baseInputs.developmentCost || baseInputs.totalCost || 1000000;
    const markup = baseInputs.markupPercentage || 10;

    switch (modelId) {
        case 'model-1': // Cost-Plus
            mapped.developmentCost = cost;
            mapped.researchPhaseCost = cost * 0.2;
            mapped.developmentPhaseCost = cost * 0.8;
            mapped.markupPercentage = markup;
            break;

        case 'model-2': // Licence Royalties
            mapped.developmentCost = cost;
            mapped.licenceFee = cost * 0.3;
            mapped.royaltyRate = baseInputs.royaltyRate || 5;
            mapped.expectedRevenue = baseInputs.expectedRevenue || cost * 5;
            break;

        case 'model-3': // Joint Development
            mapped.totalProjectCost = cost;
            mapped.developerContribution = baseInputs.developerContribution || 50;
            mapped.buyerContribution = 100 - (baseInputs.developerContribution || 50);
            break;

        case 'model-4': // BOT
            mapped.buildCost = cost;
            mapped.operatePeriod = baseInputs.operatePeriod || 3;
            mapped.operatingRevenue = baseInputs.operatingRevenue || cost * 0.4;
            mapped.transferPrice = baseInputs.transferPrice || cost * 1.5;
            break;

        case 'model-5': // Software Sale
            mapped.salePrice = baseInputs.salePrice || cost * 1.2;
            mapped.costOfDevelopment = cost;
            mapped.supportFee = baseInputs.supportFee || cost * 0.15;
            break;

        case 'model-6': // SaaS
            mapped.monthlyFee = baseInputs.monthlyFee || (cost / 36); // 3-year recovery
            mapped.setupCost = baseInputs.setupCost || cost * 0.1;
            mapped.contractPeriod = baseInputs.contractPeriod || 36;
            break;
    }

    // Add common defaults
    mapped.usefulLife = mapped.usefulLife || 5;
    mapped.corporateTaxRate = mapped.corporateTaxRate || 27;
    mapped.section11eType = mapped.section11eType || 'pc-2yr';

    return mapped;
}

/**
 * Generate summary statistics for all models
 */
function generateComparisonSummary(modelResults) {
    const models = Object.values(modelResults).filter(m => m.results);

    if (models.length === 0) return null;

    // Find best options for different criteria
    const developerProfit = models.map(m => ({
        modelId: Object.keys(modelResults).find(k => modelResults[k] === m),
        name: m.name,
        value: m.results.developer?.profit?.net || 0
    })).sort((a, b) => b.value - a.value);

    const buyerCost = models.map(m => ({
        modelId: Object.keys(modelResults).find(k => modelResults[k] === m),
        name: m.name,
        value: m.results.buyer?.totalCost || 0
    })).sort((a, b) => a.value - b.value);

    const riskScores = models.map(m => ({
        modelId: Object.keys(modelResults).find(k => modelResults[k] === m),
        name: m.name,
        value: m.results.transferPricing?.riskScore || 50
    })).sort((a, b) => a.value - b.value);

    return {
        bestForDeveloper: developerProfit[0],
        bestForBuyer: buyerCost[0],
        lowestRisk: riskScores[0],
        modelCount: models.length,
        summary: `Compared ${models.length} models. Best for Developer: ${developerProfit[0]?.name}. Lowest cost for Buyer: ${buyerCost[0]?.name}. Lowest risk: ${riskScores[0]?.name}.`
    };
}

/**
 * Generate model comparison chart data (horizontal bar chart)
 */
function generateModelComparisonChartData(modelResults) {
    const models = Object.entries(modelResults).filter(([_, m]) => m.results);

    return {
        type: 'bar',
        title: 'Model Comparison Summary',
        subtitle: 'Key metrics across all transaction models',
        series: [
            {
                name: 'Developer Profit',
                data: models.map(([id, m]) => ({
                    x: m.name,
                    y: m.results.developer?.profit?.net || 0,
                    fillColor: VIZ_COLORS.perspectives.developer
                }))
            },
            {
                name: 'Buyer Total Cost',
                data: models.map(([id, m]) => ({
                    x: m.name,
                    y: m.results.buyer?.totalCost || 0,
                    fillColor: VIZ_COLORS.perspectives.buyer
                }))
            }
        ],
        categories: models.map(([_, m]) => m.name)
    };
}

/**
 * Generate asset position chart data (stacked bar)
 */
function generateAssetPositionChartData(modelResults) {
    const models = Object.entries(modelResults).filter(([_, m]) => m.results);

    return {
        type: 'bar',
        stacked: true,
        title: 'Asset Position by Model',
        subtitle: 'Where the asset sits after transaction',
        series: [
            {
                name: 'Developer Asset',
                data: models.map(([_, m]) => m.results.developer?.asset?.carryingValue || 0)
            },
            {
                name: 'Buyer Asset',
                data: models.map(([_, m]) => m.results.buyer?.asset?.capitalised || 0)
            }
        ],
        categories: models.map(([_, m]) => m.name)
    };
}

/**
 * Generate total cost to buyer chart data
 */
function generateTotalCostChartData(modelResults) {
    const models = Object.entries(modelResults).filter(([_, m]) => m.results);

    return {
        type: 'bar',
        horizontal: true,
        title: 'Total Cost to Buyer by Model',
        subtitle: 'Ranked from lowest to highest cost',
        series: [{
            name: 'Total Cost',
            data: models
                .map(([id, m]) => ({
                    x: m.name,
                    y: m.results.buyer?.totalCost || 0,
                    fillColor: m.color
                }))
                .sort((a, b) => a.y - b.y)
        }]
    };
}

/**
 * Generate developer return chart data
 */
function generateDeveloperReturnChartData(modelResults) {
    const models = Object.entries(modelResults).filter(([_, m]) => m.results);

    return {
        type: 'bar',
        horizontal: true,
        title: 'Developer Net Profit by Model',
        subtitle: 'After-tax return for developer entity',
        series: [{
            name: 'Net Profit',
            data: models
                .map(([id, m]) => ({
                    x: m.name,
                    y: m.results.developer?.profit?.net || 0,
                    fillColor: m.color
                }))
                .sort((a, b) => b.y - a.y)
        }]
    };
}

/**
 * Generate risk comparison chart data
 */
function generateRiskComparisonChartData(modelResults) {
    const models = Object.entries(modelResults).filter(([_, m]) => m.results);

    return {
        type: 'radar',
        title: 'Risk Profile Comparison',
        subtitle: 'Transfer pricing and compliance risk by model',
        series: models.map(([id, m]) => ({
            name: m.name,
            data: [
                m.results.transferPricing?.riskScore || 50,
                100 - (m.results.transferPricing?.documentationScore || 50),
                m.results.transferPricing?.marginDeviation || 0,
                50, // Default complexity score
                50  // Default tax efficiency gap
            ]
        })),
        categories: ['TP Risk', 'Documentation Gap', 'Margin Deviation', 'Complexity', 'Tax Inefficiency']
    };
}

// ========== 10.2 TIMELINE VISUALIZATIONS ==========

/**
 * Generate timeline data for asset location over time
 * @param {Object} results - Calculation results
 * @param {number} years - Number of years to project
 * @returns {Object} Timeline visualization data
 */
export function generateAssetTimeline(results, years = 5) {
    const timeline = [];
    const developerStart = results.developer?.asset?.carryingValue || 0;
    const buyerStart = results.buyer?.asset?.capitalised || 0;
    const devAmort = results.developer?.asset?.annualAmortisation || 0;
    const buyerAmort = results.buyer?.asset?.annualAmortisation || buyerStart / years;

    for (let year = 0; year <= years; year++) {
        timeline.push({
            year: year,
            developer: {
                assetValue: Math.max(0, developerStart - (devAmort * year)),
                cumulativeAmortisation: devAmort * year
            },
            buyer: {
                assetValue: Math.max(0, buyerStart - (buyerAmort * year)),
                cumulativeAmortisation: buyerAmort * year
            }
        });
    }

    return {
        type: 'area',
        title: 'Asset Value Over Time',
        subtitle: 'Carrying value trajectory with amortisation',
        animation: true,
        series: [
            {
                name: 'Developer Asset',
                data: timeline.map(t => ({ x: `Year ${t.year}`, y: t.developer.assetValue }))
            },
            {
                name: 'Buyer Asset',
                data: timeline.map(t => ({ x: `Year ${t.year}`, y: t.buyer.assetValue }))
            }
        ],
        categories: timeline.map(t => `Year ${t.year}`)
    };
}

/**
 * Generate cash flow waterfall data
 * @param {Object} results - Calculation results
 * @returns {Object} Waterfall chart data
 */
export function generateCashFlowWaterfall(results) {
    const dev = results.developer || {};
    const buyer = results.buyer || {};

    // Build waterfall data points
    const waterfallData = [
        { x: 'Development Cost', y: -(dev.costs?.total || 0), type: 'negative' },
        { x: 'Developer Revenue', y: dev.revenue?.total || 0, type: 'positive' },
        { x: 'Developer Tax', y: -(dev.tax?.taxPayable || 0), type: 'negative' },
        { x: 'Developer Net', y: dev.profit?.net || 0, type: 'subtotal' },
        { x: 'Buyer Payment', y: -(buyer.totalCost || 0), type: 'negative' },
        { x: 'Buyer Tax Benefit', y: buyer.tax?.taxBenefit || 0, type: 'positive' }
    ];

    return {
        type: 'bar',
        waterfall: true,
        title: 'Cash Flow Waterfall',
        subtitle: 'Transaction cash flows by component',
        series: [{
            name: 'Cash Flow',
            data: waterfallData.map(d => ({
                x: d.x,
                y: d.y,
                fillColor: d.type === 'positive' ? VIZ_COLORS.risk.low :
                           d.type === 'negative' ? VIZ_COLORS.risk.high :
                           VIZ_COLORS.perspectives.developer
            }))
        }]
    };
}

/**
 * Generate amortisation schedule data for multi-entity view
 * @param {Object} results - Calculation results
 * @param {number} years - Number of years
 * @returns {Object} Amortisation schedule data
 */
export function generateAmortisationSchedule(results, years = 5) {
    const devAsset = results.developer?.asset?.carryingValue || 0;
    const buyerAsset = results.buyer?.asset?.capitalised || 0;
    const buyerUsefulLife = results.buyer?.asset?.usefulLife || years;

    const schedule = [];

    for (let year = 1; year <= years; year++) {
        // Buyer Section 11(e) - accelerated tax depreciation
        const section11eYears = results.buyer?.tax?.section11eYears || 2;
        const taxDeduction = year <= section11eYears ? buyerAsset / section11eYears : 0;

        // Accounting amortisation (straight-line)
        const accountingAmort = buyerAsset / buyerUsefulLife;

        schedule.push({
            year: year,
            developer: {
                opening: year === 1 ? devAsset : schedule[year - 2]?.developer.closing || 0,
                amortisation: devAsset / years,
                closing: Math.max(0, devAsset - (devAsset / years * year))
            },
            buyer: {
                opening: year === 1 ? buyerAsset : schedule[year - 2]?.buyer.closing || 0,
                accountingAmort: accountingAmort,
                taxDeduction: taxDeduction,
                timingDifference: accountingAmort - taxDeduction,
                closing: Math.max(0, buyerAsset - (accountingAmort * year))
            }
        });
    }

    return {
        type: 'line',
        title: 'Amortisation Schedules',
        subtitle: 'Accounting vs Tax depreciation by entity',
        series: [
            {
                name: 'Buyer - Accounting',
                data: schedule.map(s => ({ x: `Year ${s.year}`, y: s.buyer.accountingAmort }))
            },
            {
                name: 'Buyer - Tax (S11e)',
                data: schedule.map(s => ({ x: `Year ${s.year}`, y: s.buyer.taxDeduction }))
            },
            {
                name: 'Developer',
                data: schedule.map(s => ({ x: `Year ${s.year}`, y: s.developer.amortisation }))
            }
        ],
        categories: schedule.map(s => `Year ${s.year}`),
        rawData: schedule
    };
}

/**
 * Generate project phase Gantt chart data
 * @param {Object} inputs - Input parameters including project phases
 * @returns {Object} Gantt chart data
 */
export function generateProjectGantt(inputs) {
    // Define typical software project phases
    const phases = [
        { name: 'Research Phase', start: 0, duration: 2, type: 'expense', color: VIZ_COLORS.risk.medium },
        { name: 'Development Phase', start: 2, duration: 6, type: 'capitalise', color: VIZ_COLORS.risk.low },
        { name: 'Testing & QA', start: 7, duration: 2, type: 'capitalise', color: VIZ_COLORS.perspectives.developer },
        { name: 'Deployment', start: 9, duration: 1, type: 'capitalise', color: VIZ_COLORS.perspectives.buyer },
        { name: 'Support Period', start: 10, duration: 12, type: 'ongoing', color: VIZ_COLORS.risk.low }
    ];

    // Adjust durations based on inputs if provided
    const totalMonths = inputs.projectDuration || 12;
    const scaleFactor = totalMonths / 10;

    return {
        type: 'rangeBar',
        title: 'Project Timeline',
        subtitle: 'Development phases and milestones',
        series: [{
            name: 'Project Phases',
            data: phases.map(p => ({
                x: p.name,
                y: [p.start, p.start + p.duration],
                fillColor: p.color,
                meta: { type: p.type }
            }))
        }],
        annotations: [
            { x: 2, label: 'IAS 38 Criteria Met' },
            { x: 10, label: 'Go-Live' }
        ]
    };
}

// ========== 10.3 RISK VISUALIZATIONS ==========

/**
 * Generate transfer pricing risk heat map data
 * @param {Object} results - Calculation results
 * @param {Object} complianceData - Compliance analyzer data
 * @returns {Object} Heat map visualization data
 */
export function generateTPRiskHeatMap(results, complianceData = null) {
    const tp = results.transferPricing || {};

    // Risk factors with scores
    const factors = [
        {
            name: 'Margin Analysis',
            score: calculateMarginRiskScore(tp.actualMargin, tp.benchmarkMin, tp.benchmarkMax),
            detail: `${tp.actualMargin?.toFixed(1) || 'N/A'}% vs ${tp.benchmarkMin || 5}-${tp.benchmarkMax || 15}%`
        },
        {
            name: 'Documentation',
            score: complianceData?.documentationScore || 50,
            detail: complianceData?.documentationStatus || 'Not assessed'
        },
        {
            name: 'Economic Substance',
            score: complianceData?.substanceScore || 70,
            detail: 'Functions, assets, risks analysis'
        },
        {
            name: 'Comparability',
            score: complianceData?.comparabilityScore || 60,
            detail: 'Benchmark quality'
        },
        {
            name: 'Consistency',
            score: complianceData?.consistencyScore || 80,
            detail: 'Year-on-year methodology'
        }
    ];

    return {
        type: 'heatmap',
        title: 'Transfer Pricing Risk Heat Map',
        subtitle: 'Risk factor analysis',
        series: [{
            name: 'Risk Level',
            data: factors.map(f => ({
                x: f.name,
                y: 100 - f.score, // Convert score to risk (higher = more risk)
                meta: f.detail
            }))
        }],
        colorScale: {
            ranges: [
                { from: 0, to: 30, color: VIZ_COLORS.risk.low, name: 'Low Risk' },
                { from: 31, to: 60, color: VIZ_COLORS.risk.medium, name: 'Medium Risk' },
                { from: 61, to: 100, color: VIZ_COLORS.risk.high, name: 'High Risk' }
            ]
        }
    };
}

/**
 * Calculate margin risk score based on position within benchmark range
 */
function calculateMarginRiskScore(actual, min, max) {
    if (actual === undefined || actual === null) return 50;
    min = min || 5;
    max = max || 15;

    if (actual < min) {
        // Below range - risk increases as you go lower
        const deviation = min - actual;
        return Math.max(0, 80 - deviation * 10);
    } else if (actual > max) {
        // Above range - risk increases as you go higher
        const deviation = actual - max;
        return Math.max(0, 80 - deviation * 10);
    } else {
        // Within range - closer to middle is better
        const midpoint = (min + max) / 2;
        const distanceFromMid = Math.abs(actual - midpoint);
        const range = (max - min) / 2;
        return 90 - (distanceFromMid / range) * 20;
    }
}

/**
 * Generate risk vs return quadrant chart data
 * @param {Object} comparisonData - Cross-model comparison data
 * @returns {Object} Scatter plot data
 */
export function generateRiskReturnQuadrant(comparisonData) {
    const models = Object.entries(comparisonData.models || {}).filter(([_, m]) => m.results);

    const points = models.map(([id, m]) => ({
        x: m.results.transferPricing?.riskScore || 50,
        y: m.results.developer?.profit?.margin || 0,
        name: m.name,
        color: m.color
    }));

    // Calculate quadrant boundaries
    const avgRisk = points.reduce((sum, p) => sum + p.x, 0) / points.length || 50;
    const avgReturn = points.reduce((sum, p) => sum + p.y, 0) / points.length || 10;

    return {
        type: 'scatter',
        title: 'Risk vs Return Quadrant',
        subtitle: 'Model positioning by risk and return profile',
        series: [{
            name: 'Models',
            data: points.map(p => ({
                x: p.x,
                y: p.y,
                name: p.name,
                fillColor: p.color
            }))
        }],
        xaxis: {
            title: 'Transfer Pricing Risk Score',
            min: 0,
            max: 100
        },
        yaxis: {
            title: 'Developer Margin %',
            min: 0
        },
        annotations: {
            xaxis: [{ x: avgRisk, borderColor: '#666', label: 'Avg Risk' }],
            yaxis: [{ y: avgReturn, borderColor: '#666', label: 'Avg Return' }]
        },
        quadrants: [
            { name: 'High Risk/High Return', x: [avgRisk, 100], y: [avgReturn, 100] },
            { name: 'Low Risk/High Return', x: [0, avgRisk], y: [avgReturn, 100] },
            { name: 'Low Risk/Low Return', x: [0, avgRisk], y: [0, avgReturn] },
            { name: 'High Risk/Low Return', x: [avgRisk, 100], y: [0, avgReturn] }
        ]
    };
}

/**
 * Generate compliance score gauge data
 * @param {Object} complianceReport - Compliance analyzer report
 * @returns {Object} Gauge chart data
 */
export function generateComplianceGauge(complianceReport) {
    const score = complianceReport?.overallCompliance?.score || 0;

    return {
        type: 'radialBar',
        title: 'Overall Compliance Score',
        subtitle: complianceReport?.overallCompliance?.status || 'Not Assessed',
        series: [score],
        labels: ['Compliance'],
        colors: [
            score >= 80 ? VIZ_COLORS.risk.low :
            score >= 60 ? VIZ_COLORS.risk.medium :
            VIZ_COLORS.risk.high
        ],
        options: {
            startAngle: -135,
            endAngle: 135,
            track: {
                background: '#374151',
                strokeWidth: '80%'
            },
            hollow: {
                size: '65%'
            },
            dataLabels: {
                value: {
                    formatter: val => `${val}%`,
                    fontSize: '32px'
                }
            }
        }
    };
}

/**
 * Generate sensitivity tornado chart data (Stage 2 prep)
 * @param {Object} baseResults - Base case calculation results
 * @param {Object} inputs - Input parameters for sensitivity
 * @returns {Object} Tornado chart data
 */
export function generateSensitivityTornado(baseResults, inputs) {
    const baseProfit = baseResults.developer?.profit?.net || 0;

    // Define key variables to test
    const variables = [
        { name: 'Development Cost', key: 'developmentCost', variance: 0.2 },
        { name: 'Markup %', key: 'markupPercentage', variance: 0.5 },
        { name: 'Tax Rate', key: 'corporateTaxRate', variance: 0.15 },
        { name: 'Useful Life', key: 'usefulLife', variance: 0.4 },
        { name: 'Research Cost %', key: 'researchPhaseCost', variance: 0.5 }
    ];

    // For now, estimate sensitivities based on input values
    // In Stage 2, this will actually recalculate for each scenario
    const sensitivities = variables.map(v => {
        const inputValue = inputs[v.key] || 0;
        const lowValue = inputValue * (1 - v.variance);
        const highValue = inputValue * (1 + v.variance);

        // Estimated impact (placeholder - Stage 2 will calculate actual)
        const estimatedImpact = baseProfit * v.variance * 0.5;

        return {
            name: v.name,
            low: -estimatedImpact,
            high: estimatedImpact,
            baseValue: inputValue,
            lowInput: lowValue,
            highInput: highValue
        };
    });

    // Sort by total range (absolute impact)
    sensitivities.sort((a, b) => (Math.abs(b.high) + Math.abs(b.low)) - (Math.abs(a.high) + Math.abs(a.low)));

    return {
        type: 'bar',
        horizontal: true,
        stacked: true,
        title: 'Sensitivity Analysis (Tornado)',
        subtitle: 'Impact of input variations on developer profit',
        series: [
            {
                name: 'Decrease',
                data: sensitivities.map(s => s.low)
            },
            {
                name: 'Increase',
                data: sensitivities.map(s => s.high)
            }
        ],
        categories: sensitivities.map(s => s.name),
        annotations: {
            xaxis: [{ x: 0, borderColor: '#666', label: 'Base Case' }]
        },
        meta: sensitivities
    };
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Format chart data for ApexCharts
 * @param {Object} chartData - Raw chart data
 * @returns {Object} ApexCharts-compatible options
 */
export function formatForApexCharts(chartData) {
    const baseOptions = {
        chart: {
            type: chartData.type || 'bar',
            height: chartData.height || 400,
            toolbar: { show: true },
            background: 'transparent',
            animations: {
                enabled: chartData.animation !== false,
                speed: 500
            }
        },
        title: {
            text: chartData.title || '',
            align: 'center',
            style: { fontSize: '16px', fontWeight: 600, color: '#F3F4F6' }
        },
        subtitle: {
            text: chartData.subtitle || '',
            align: 'center',
            style: { fontSize: '12px', color: '#9CA3AF' }
        },
        series: chartData.series || [],
        grid: {
            borderColor: '#374151'
        },
        tooltip: {
            theme: 'dark'
        },
        legend: {
            position: 'top',
            labels: { colors: '#9CA3AF' }
        }
    };

    // Add type-specific options
    switch (chartData.type) {
        case 'bar':
            baseOptions.plotOptions = {
                bar: {
                    horizontal: chartData.horizontal || false,
                    borderRadius: 4,
                    distributed: chartData.distributed || false
                }
            };
            baseOptions.xaxis = {
                categories: chartData.categories || [],
                labels: { style: { colors: '#9CA3AF' } }
            };
            baseOptions.yaxis = {
                labels: {
                    formatter: val => typeof val === 'number' ? `R${val.toLocaleString()}` : val,
                    style: { colors: '#9CA3AF' }
                }
            };
            break;

        case 'area':
        case 'line':
            baseOptions.stroke = { curve: 'smooth', width: 2 };
            baseOptions.fill = chartData.type === 'area' ? {
                type: 'gradient',
                gradient: { opacityFrom: 0.6, opacityTo: 0.2 }
            } : {};
            baseOptions.xaxis = {
                categories: chartData.categories || [],
                labels: { style: { colors: '#9CA3AF' } }
            };
            baseOptions.yaxis = {
                labels: {
                    formatter: val => typeof val === 'number' ? `R${val.toLocaleString()}` : val,
                    style: { colors: '#9CA3AF' }
                }
            };
            break;

        case 'radar':
            baseOptions.xaxis = {
                categories: chartData.categories || []
            };
            break;

        case 'radialBar':
            baseOptions.plotOptions = {
                radialBar: chartData.options || {}
            };
            baseOptions.labels = chartData.labels || [];
            baseOptions.colors = chartData.colors || [VIZ_COLORS.perspectives.developer];
            break;

        case 'heatmap':
            baseOptions.plotOptions = {
                heatmap: {
                    colorScale: chartData.colorScale || {}
                }
            };
            break;

        case 'scatter':
            baseOptions.xaxis = chartData.xaxis || {};
            baseOptions.yaxis = chartData.yaxis || {};
            break;
    }

    return baseOptions;
}

// ========== EXPORTS ==========

export default {
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
};
