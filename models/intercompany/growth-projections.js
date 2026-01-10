// ========== GROWTH PROJECTIONS MODULE ==========
// Phase 12: Stage 3 - Growth Projections
// Provides multi-year financial projections with NPV, IRR, and payback analysis.
//
// Features:
// - 12.1 Projection Inputs: Revenue, cost, inflation, discount rate, period
// - 12.2 Projection Calculations: NPV, IRR, payback, asset trajectories
// - 12.3 Projection Visualizations: Cash flow, NPV comparison, ROI charts

import { calculateIntercompany, DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from './registry.js';

// ========== PROJECTION INPUT DEFINITIONS ==========

/**
 * Default projection parameters
 */
export const DEFAULT_PROJECTION_PARAMS = {
    projectionPeriod: 5,           // years
    discountRate: 0.12,            // 12% WACC/discount rate
    inflationRate: 0.05,           // 5% annual inflation
    revenueGrowthRate: 0.08,       // 8% revenue growth
    costGrowthRate: 0.04,          // 4% cost growth
    enhancementCostPercent: 0.10,  // 10% of base cost for annual enhancements
    terminalGrowthRate: 0.02,      // 2% terminal growth rate
    taxRate: 0.27                  // 27% corporate tax rate
};

/**
 * Projection input field definitions
 */
export const PROJECTION_INPUTS = {
    // Period settings
    projectionPeriod: {
        name: 'projectionPeriod',
        label: 'Projection Period',
        type: 'select',
        category: 'period',
        options: [
            { value: 3, label: '3 Years' },
            { value: 5, label: '5 Years' },
            { value: 7, label: '7 Years' },
            { value: 10, label: '10 Years' }
        ],
        default: 5,
        hint: 'Time horizon for financial projections'
    },

    // Rate inputs
    discountRate: {
        name: 'discountRate',
        label: 'Discount Rate (WACC)',
        type: 'percent',
        category: 'rates',
        default: 12,
        min: 1,
        max: 30,
        step: 0.5,
        hint: 'Weighted average cost of capital for NPV calculations'
    },
    inflationRate: {
        name: 'inflationRate',
        label: 'Inflation Rate',
        type: 'percent',
        category: 'rates',
        default: 5,
        min: 0,
        max: 20,
        step: 0.5,
        hint: 'Expected annual inflation rate'
    },
    revenueGrowthRate: {
        name: 'revenueGrowthRate',
        label: 'Revenue Growth Rate',
        type: 'percent',
        category: 'growth',
        default: 8,
        min: -10,
        max: 50,
        step: 1,
        hint: 'Expected annual revenue growth from the software/asset'
    },
    costGrowthRate: {
        name: 'costGrowthRate',
        label: 'Cost Growth Rate',
        type: 'percent',
        category: 'growth',
        default: 4,
        min: 0,
        max: 20,
        step: 0.5,
        hint: 'Expected annual increase in operating costs'
    },

    // Enhancement/Investment inputs
    enhancementCostPercent: {
        name: 'enhancementCostPercent',
        label: 'Annual Enhancement %',
        type: 'percent',
        category: 'investment',
        default: 10,
        min: 0,
        max: 50,
        step: 1,
        hint: 'Percentage of base cost for annual enhancements/upgrades'
    },
    expectedAnnualRevenue: {
        name: 'expectedAnnualRevenue',
        label: 'Expected Annual Revenue',
        type: 'currency',
        category: 'buyer',
        default: 0,
        min: 0,
        hint: 'Buyer\'s expected annual revenue from the software (optional)'
    },
    terminalGrowthRate: {
        name: 'terminalGrowthRate',
        label: 'Terminal Growth Rate',
        type: 'percent',
        category: 'rates',
        default: 2,
        min: 0,
        max: 5,
        step: 0.5,
        hint: 'Long-term sustainable growth rate for terminal value'
    }
};

// ========== CORE PROJECTION CALCULATIONS ==========

/**
 * Generate multi-year projections from transaction results
 * @param {Object} transactionResults - Results from calculateIntercompany
 * @param {Object} projectionParams - Projection parameters
 * @returns {Object} Multi-year projection data
 */
export function generateProjections(transactionResults, projectionParams = {}) {
    const params = { ...DEFAULT_PROJECTION_PARAMS, ...projectionParams };
    const years = params.projectionPeriod;

    // Extract base values from transaction results
    const developerRevenue = transactionResults.developer?.revenue?.total || 0;
    const developerCost = transactionResults.developer?.costs?.total || 0;
    const developerProfit = transactionResults.developer?.profit?.net || 0;
    const buyerAssetValue = transactionResults.buyer?.asset?.initialValue || 0;
    const buyerTotalCost = transactionResults.buyer?.totalCost || 0;
    const usefulLife = transactionResults.buyer?.asset?.usefulLife || 5;

    // Generate year-by-year projections
    const developerProjection = generatePartyProjection({
        baseRevenue: developerRevenue,
        baseCost: developerCost,
        baseProfit: developerProfit,
        revenueGrowthRate: params.revenueGrowthRate,
        costGrowthRate: params.costGrowthRate,
        years,
        discountRate: params.discountRate,
        taxRate: params.taxRate,
        partyType: 'developer'
    });

    const buyerProjection = generateBuyerProjection({
        initialInvestment: buyerTotalCost,
        assetValue: buyerAssetValue,
        usefulLife,
        expectedRevenue: params.expectedAnnualRevenue || buyerTotalCost * 0.3,
        revenueGrowthRate: params.revenueGrowthRate,
        enhancementCostPercent: params.enhancementCostPercent,
        costGrowthRate: params.costGrowthRate,
        years,
        discountRate: params.discountRate,
        taxRate: params.taxRate
    });

    return {
        params,
        years,
        developer: developerProjection,
        buyer: buyerProjection,
        summary: generateProjectionSummary(developerProjection, buyerProjection, params)
    };
}

/**
 * Generate projections for Developer party
 */
function generatePartyProjection({ baseRevenue, baseCost, baseProfit, revenueGrowthRate, costGrowthRate, years, discountRate, taxRate, partyType }) {
    const yearlyData = [];
    const cashFlows = [-baseCost]; // Initial outlay at year 0

    let cumulativeCashFlow = -baseCost;
    let paybackYear = null;

    for (let year = 1; year <= years; year++) {
        const growthMultiplier = Math.pow(1 + revenueGrowthRate, year - 1);
        const costMultiplier = Math.pow(1 + costGrowthRate, year - 1);

        const revenue = baseRevenue * growthMultiplier;
        const costs = baseCost * 0.3 * costMultiplier; // Assume 30% ongoing costs
        const grossProfit = revenue - costs;
        const tax = grossProfit * taxRate;
        const netProfit = grossProfit - tax;
        const cashFlow = netProfit;

        cumulativeCashFlow += cashFlow;
        if (paybackYear === null && cumulativeCashFlow >= 0) {
            paybackYear = year - (cumulativeCashFlow / cashFlow);
        }

        cashFlows.push(cashFlow);

        yearlyData.push({
            year,
            revenue,
            costs,
            grossProfit,
            tax,
            netProfit,
            cashFlow,
            cumulativeCashFlow,
            discountFactor: 1 / Math.pow(1 + discountRate, year),
            presentValue: cashFlow / Math.pow(1 + discountRate, year)
        });
    }

    const npv = calculateNPV(cashFlows, discountRate);
    const irr = calculateIRR(cashFlows);

    return {
        partyType,
        yearlyData,
        cashFlows,
        metrics: {
            npv,
            irr,
            paybackPeriod: paybackYear || years,
            totalRevenue: yearlyData.reduce((sum, y) => sum + y.revenue, 0),
            totalProfit: yearlyData.reduce((sum, y) => sum + y.netProfit, 0),
            averageMargin: yearlyData.reduce((sum, y) => sum + (y.netProfit / y.revenue), 0) / years * 100,
            roic: baseCost > 0 ? (yearlyData.reduce((sum, y) => sum + y.netProfit, 0) / baseCost) * 100 : 0
        }
    };
}

/**
 * Generate projections for Buyer party
 */
function generateBuyerProjection({ initialInvestment, assetValue, usefulLife, expectedRevenue, revenueGrowthRate, enhancementCostPercent, costGrowthRate, years, discountRate, taxRate }) {
    const yearlyData = [];
    const cashFlows = [-initialInvestment]; // Initial investment at year 0

    const annualAmortisation = assetValue / usefulLife;
    let cumulativeCashFlow = -initialInvestment;
    let paybackYear = null;
    let currentAssetValue = assetValue;
    let totalEnhancements = 0;

    for (let year = 1; year <= years; year++) {
        const revenueMultiplier = Math.pow(1 + revenueGrowthRate, year - 1);
        const costMultiplier = Math.pow(1 + costGrowthRate, year - 1);

        const revenue = expectedRevenue * revenueMultiplier;
        const enhancementCost = assetValue * enhancementCostPercent * costMultiplier;
        const operatingCosts = initialInvestment * 0.1 * costMultiplier; // 10% operating costs
        const totalCosts = enhancementCost + operatingCosts;
        totalEnhancements += enhancementCost;

        // Amortisation calculation
        const amortisation = year <= usefulLife ? annualAmortisation : 0;
        currentAssetValue = Math.max(0, assetValue - (annualAmortisation * year) + (totalEnhancements * 0.8)); // 80% of enhancements add to asset

        const grossProfit = revenue - totalCosts - amortisation;
        const tax = Math.max(0, grossProfit * taxRate);
        const netProfit = grossProfit - tax;
        const cashFlow = netProfit + amortisation - enhancementCost; // Add back amortisation (non-cash), deduct capex

        cumulativeCashFlow += cashFlow;
        if (paybackYear === null && cumulativeCashFlow >= 0) {
            paybackYear = year - (cumulativeCashFlow / cashFlow);
        }

        cashFlows.push(cashFlow);

        yearlyData.push({
            year,
            revenue,
            enhancementCost,
            operatingCosts,
            totalCosts,
            amortisation,
            assetValue: currentAssetValue,
            grossProfit,
            tax,
            netProfit,
            cashFlow,
            cumulativeCashFlow,
            discountFactor: 1 / Math.pow(1 + discountRate, year),
            presentValue: cashFlow / Math.pow(1 + discountRate, year)
        });
    }

    const npv = calculateNPV(cashFlows, discountRate);
    const irr = calculateIRR(cashFlows);

    return {
        partyType: 'buyer',
        yearlyData,
        cashFlows,
        metrics: {
            npv,
            irr,
            paybackPeriod: paybackYear || years,
            totalRevenue: yearlyData.reduce((sum, y) => sum + y.revenue, 0),
            totalCosts: yearlyData.reduce((sum, y) => sum + y.totalCosts, 0),
            totalEnhancements: totalEnhancements,
            finalAssetValue: currentAssetValue,
            roi: initialInvestment > 0 ? ((yearlyData.reduce((sum, y) => sum + y.netProfit, 0)) / initialInvestment) * 100 : 0
        }
    };
}

/**
 * Generate summary of projection metrics
 */
function generateProjectionSummary(developerProjection, buyerProjection, params) {
    return {
        developer: {
            npv: developerProjection.metrics.npv,
            irr: developerProjection.metrics.irr,
            paybackPeriod: developerProjection.metrics.paybackPeriod,
            totalProfit: developerProjection.metrics.totalProfit,
            assessment: assessInvestment(developerProjection.metrics.npv, developerProjection.metrics.irr, params.discountRate)
        },
        buyer: {
            npv: buyerProjection.metrics.npv,
            irr: buyerProjection.metrics.irr,
            paybackPeriod: buyerProjection.metrics.paybackPeriod,
            roi: buyerProjection.metrics.roi,
            assessment: assessInvestment(buyerProjection.metrics.npv, buyerProjection.metrics.irr, params.discountRate)
        },
        recommendation: generateRecommendation(developerProjection, buyerProjection, params)
    };
}

/**
 * Assess investment quality
 */
function assessInvestment(npv, irr, discountRate) {
    if (npv > 0 && irr > discountRate) {
        return { rating: 'Excellent', color: 'green', description: 'Strong value creation, exceeds hurdle rate' };
    } else if (npv > 0) {
        return { rating: 'Good', color: 'blue', description: 'Positive NPV, acceptable returns' };
    } else if (npv > -10000) {
        return { rating: 'Marginal', color: 'yellow', description: 'Near break-even, review assumptions' };
    } else {
        return { rating: 'Poor', color: 'red', description: 'Negative NPV, value destruction likely' };
    }
}

/**
 * Generate investment recommendation
 */
function generateRecommendation(developerProjection, buyerProjection, params) {
    const devNPV = developerProjection.metrics.npv;
    const buyerNPV = buyerProjection.metrics.npv;
    const devIRR = developerProjection.metrics.irr;
    const buyerIRR = buyerProjection.metrics.irr;

    const recommendations = [];

    if (devNPV > 0 && buyerNPV > 0) {
        recommendations.push('Transaction creates value for both parties - proceed');
    }

    if (devIRR > params.discountRate * 1.5) {
        recommendations.push('Developer returns significantly exceed hurdle rate');
    }

    if (buyerProjection.metrics.paybackPeriod > params.projectionPeriod * 0.7) {
        recommendations.push('Buyer payback period is long - consider renegotiating terms');
    }

    if (buyerNPV < 0) {
        recommendations.push('Buyer NPV is negative - transaction may need restructuring');
    }

    if (developerProjection.metrics.averageMargin < 15) {
        recommendations.push('Developer margins are thin - consider cost optimization');
    }

    return recommendations.length > 0 ? recommendations : ['Transaction appears balanced - proceed with standard diligence'];
}

// ========== NPV CALCULATION ==========

/**
 * Calculate Net Present Value
 * @param {number[]} cashFlows - Array of cash flows (year 0, 1, 2, ...)
 * @param {number} discountRate - Discount rate (e.g., 0.12 for 12%)
 * @returns {number} NPV
 */
export function calculateNPV(cashFlows, discountRate) {
    return cashFlows.reduce((npv, cf, year) => {
        return npv + cf / Math.pow(1 + discountRate, year);
    }, 0);
}

// ========== IRR CALCULATION ==========

/**
 * Calculate Internal Rate of Return using Newton-Raphson method
 * @param {number[]} cashFlows - Array of cash flows (year 0, 1, 2, ...)
 * @returns {number} IRR as decimal (e.g., 0.15 for 15%)
 */
export function calculateIRR(cashFlows) {
    const maxIterations = 100;
    const tolerance = 0.00001;
    let irr = 0.1; // Initial guess

    for (let i = 0; i < maxIterations; i++) {
        const npv = calculateNPV(cashFlows, irr);
        const derivative = calculateNPVDerivative(cashFlows, irr);

        if (Math.abs(derivative) < tolerance) {
            break;
        }

        const newIRR = irr - npv / derivative;

        if (Math.abs(newIRR - irr) < tolerance) {
            return newIRR;
        }

        irr = newIRR;

        // Bounds check
        if (irr < -0.99) irr = -0.99;
        if (irr > 10) irr = 10;
    }

    return irr;
}

/**
 * Calculate derivative of NPV with respect to discount rate
 */
function calculateNPVDerivative(cashFlows, rate) {
    return cashFlows.reduce((derivative, cf, year) => {
        if (year === 0) return derivative;
        return derivative - (year * cf) / Math.pow(1 + rate, year + 1);
    }, 0);
}

// ========== PAYBACK PERIOD CALCULATION ==========

/**
 * Calculate payback period
 * @param {number[]} cashFlows - Array of cash flows (year 0, 1, 2, ...)
 * @param {boolean} discounted - Whether to use discounted cash flows
 * @param {number} discountRate - Discount rate if discounted
 * @returns {number} Payback period in years
 */
export function calculatePaybackPeriod(cashFlows, discounted = false, discountRate = 0.1) {
    let cumulative = 0;

    for (let year = 0; year < cashFlows.length; year++) {
        const cf = discounted
            ? cashFlows[year] / Math.pow(1 + discountRate, year)
            : cashFlows[year];

        cumulative += cf;

        if (cumulative >= 0 && year > 0) {
            // Interpolate for fractional year
            const prevCumulative = cumulative - cf;
            const fraction = -prevCumulative / cf;
            return year - 1 + fraction;
        }
    }

    return cashFlows.length; // Payback not achieved within period
}

// ========== BREAK-EVEN ANALYSIS ==========

/**
 * Calculate break-even revenue for buyer
 * @param {Object} transactionResults - Results from calculateIntercompany
 * @param {Object} projectionParams - Projection parameters
 * @returns {Object} Break-even analysis
 */
export function calculateRevenueBreakEven(transactionResults, projectionParams = {}) {
    const params = { ...DEFAULT_PROJECTION_PARAMS, ...projectionParams };
    const initialInvestment = transactionResults.buyer?.totalCost || 0;
    const years = params.projectionPeriod;

    // Binary search for break-even revenue
    let low = 0;
    let high = initialInvestment * 2;
    let iterations = 0;
    const maxIterations = 50;

    while (iterations < maxIterations && (high - low) > 100) {
        const mid = (low + high) / 2;

        const projection = generateBuyerProjection({
            initialInvestment,
            assetValue: transactionResults.buyer?.asset?.initialValue || initialInvestment,
            usefulLife: transactionResults.buyer?.asset?.usefulLife || 5,
            expectedRevenue: mid,
            revenueGrowthRate: params.revenueGrowthRate,
            enhancementCostPercent: params.enhancementCostPercent,
            costGrowthRate: params.costGrowthRate,
            years,
            discountRate: params.discountRate,
            taxRate: params.taxRate
        });

        if (projection.metrics.npv < 0) {
            low = mid;
        } else {
            high = mid;
        }

        iterations++;
    }

    const breakEvenRevenue = (low + high) / 2;

    return {
        breakEvenRevenue,
        initialInvestment,
        revenueToInvestmentRatio: breakEvenRevenue / initialInvestment,
        description: `Buyer needs annual revenue of R${breakEvenRevenue.toLocaleString()} to break even on NPV basis`
    };
}

// ========== ASSET TRAJECTORY ==========

/**
 * Calculate asset value trajectory over time
 * @param {Object} transactionResults - Results from calculateIntercompany
 * @param {Object} projectionParams - Projection parameters
 * @returns {Object[]} Year-by-year asset values
 */
export function calculateAssetTrajectory(transactionResults, projectionParams = {}) {
    const params = { ...DEFAULT_PROJECTION_PARAMS, ...projectionParams };
    const years = params.projectionPeriod;

    const initialAssetValue = transactionResults.buyer?.asset?.initialValue || 0;
    const usefulLife = transactionResults.buyer?.asset?.usefulLife || 5;
    const annualAmortisation = initialAssetValue / usefulLife;

    const trajectory = [];
    let currentValue = initialAssetValue;
    let totalEnhancements = 0;

    for (let year = 0; year <= years; year++) {
        const enhancement = year > 0 ? initialAssetValue * params.enhancementCostPercent : 0;
        totalEnhancements += enhancement;

        // Asset value = initial - amortisation + enhancements (80% capitalised)
        if (year > 0 && year <= usefulLife) {
            currentValue -= annualAmortisation;
        }
        currentValue += enhancement * 0.8;
        currentValue = Math.max(0, currentValue);

        trajectory.push({
            year,
            grossAssetValue: initialAssetValue + totalEnhancements,
            accumulatedAmortisation: Math.min(year * annualAmortisation, initialAssetValue),
            netAssetValue: currentValue,
            enhancement,
            totalEnhancements
        });
    }

    return trajectory;
}

// ========== MODEL COMPARISON ==========

/**
 * Compare NPV across different models/variants
 * @param {Object[]} modelResults - Array of { modelId, variantId, results }
 * @param {Object} projectionParams - Projection parameters
 * @returns {Object[]} Comparison data
 */
export function compareModelNPV(modelResults, projectionParams = {}) {
    const params = { ...DEFAULT_PROJECTION_PARAMS, ...projectionParams };

    return modelResults.map(({ modelId, variantId, results, label }) => {
        const projections = generateProjections(results, params);

        return {
            modelId,
            variantId,
            label: label || `${modelId}-${variantId}`,
            developer: {
                npv: projections.developer.metrics.npv,
                irr: projections.developer.metrics.irr,
                payback: projections.developer.metrics.paybackPeriod
            },
            buyer: {
                npv: projections.buyer.metrics.npv,
                irr: projections.buyer.metrics.irr,
                payback: projections.buyer.metrics.paybackPeriod
            }
        };
    }).sort((a, b) => b.developer.npv - a.developer.npv);
}

// ========== VISUALIZATION DATA GENERATORS ==========

/**
 * Generate cash flow chart data
 * @param {Object} projections - Result from generateProjections
 * @returns {Object} Chart-ready data
 */
export function generateCashFlowChartData(projections) {
    const { developer, buyer, years } = projections;

    const labels = ['Initial'];
    for (let i = 1; i <= years; i++) {
        labels.push(`Year ${i}`);
    }

    return {
        type: 'cashflow',
        title: 'Multi-Year Cash Flow Projection',
        subtitle: `${years}-year projection`,
        labels,
        datasets: [
            {
                label: 'Your Company',
                data: developer.cashFlows,
                color: '#3B82F6',
                cumulative: developer.yearlyData.map(y => y.cumulativeCashFlow)
            },
            {
                label: 'Client',
                data: buyer.cashFlows,
                color: '#10B981',
                cumulative: buyer.yearlyData.map(y => y.cumulativeCashFlow)
            }
        ],
        annotations: {
            developerPayback: developer.metrics.paybackPeriod,
            buyerPayback: buyer.metrics.paybackPeriod
        }
    };
}

/**
 * Generate NPV waterfall chart data
 * @param {Object} projections - Result from generateProjections
 * @returns {Object} Chart-ready data
 */
export function generateNPVWaterfallData(projections) {
    const { developer, buyer, params } = projections;

    // Build waterfall showing NPV components
    const components = [
        { label: 'Initial Investment', value: developer.cashFlows[0], type: 'negative' },
        { label: 'Operating Cash Flows', value: developer.cashFlows.slice(1).reduce((sum, cf) => sum + cf / Math.pow(1 + params.discountRate, developer.cashFlows.indexOf(cf)), 0), type: 'positive' },
        { label: 'Developer NPV', value: developer.metrics.npv, type: 'total' }
    ];

    return {
        type: 'waterfall',
        title: 'NPV Components',
        subtitle: 'Breakdown of Net Present Value',
        data: components
    };
}

/**
 * Generate ROI trajectory chart data
 * @param {Object} projections - Result from generateProjections
 * @returns {Object} Chart-ready data
 */
export function generateROITrajectoryData(projections) {
    const { buyer, years } = projections;
    const initialInvestment = Math.abs(buyer.cashFlows[0]);

    const trajectory = [];
    let cumulativeProfit = 0;

    for (let i = 0; i < years; i++) {
        const yearData = buyer.yearlyData[i];
        cumulativeProfit += yearData.netProfit;

        trajectory.push({
            year: i + 1,
            annualROI: (yearData.netProfit / initialInvestment) * 100,
            cumulativeROI: (cumulativeProfit / initialInvestment) * 100,
            targetROI: projections.params.discountRate * 100 * (i + 1)
        });
    }

    return {
        type: 'roi-trajectory',
        title: 'ROI Trajectory',
        subtitle: 'Return on Investment over time',
        data: trajectory,
        breakEvenYear: buyer.metrics.paybackPeriod
    };
}

/**
 * Generate asset value chart data
 * @param {Object} transactionResults - Results from calculateIntercompany
 * @param {Object} projectionParams - Projection parameters
 * @returns {Object} Chart-ready data
 */
export function generateAssetValueChartData(transactionResults, projectionParams = {}) {
    const trajectory = calculateAssetTrajectory(transactionResults, projectionParams);

    return {
        type: 'asset-trajectory',
        title: 'Asset Value Trajectory',
        subtitle: 'Net book value with enhancements',
        data: trajectory.map(t => ({
            year: t.year,
            netValue: t.netAssetValue,
            grossValue: t.grossAssetValue,
            amortisation: t.accumulatedAmortisation,
            enhancements: t.totalEnhancements
        }))
    };
}

/**
 * Generate metrics comparison radar data
 * @param {Object} projections - Result from generateProjections
 * @returns {Object} Chart-ready data
 */
export function generateMetricsRadarData(projections) {
    const { developer, buyer, params } = projections;

    // Normalize metrics to 0-100 scale for radar chart
    const normalize = (value, min, max) => Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    return {
        type: 'radar',
        title: 'Investment Metrics Comparison',
        metrics: [
            {
                label: 'NPV Score',
                developer: normalize(developer.metrics.npv, -100000, 500000),
                buyer: normalize(buyer.metrics.npv, -100000, 500000)
            },
            {
                label: 'IRR vs Hurdle',
                developer: normalize(developer.metrics.irr, 0, params.discountRate * 3) * 100,
                buyer: normalize(buyer.metrics.irr, 0, params.discountRate * 3) * 100
            },
            {
                label: 'Payback Speed',
                developer: normalize(params.projectionPeriod - developer.metrics.paybackPeriod, 0, params.projectionPeriod),
                buyer: normalize(params.projectionPeriod - buyer.metrics.paybackPeriod, 0, params.projectionPeriod)
            },
            {
                label: 'Total Return',
                developer: normalize(developer.metrics.totalProfit, 0, Math.abs(developer.cashFlows[0]) * 2),
                buyer: normalize(buyer.metrics.roi, 0, 200)
            }
        ]
    };
}

// ========== EXPORTS ==========

export default {
    // Constants
    DEFAULT_PROJECTION_PARAMS,
    PROJECTION_INPUTS,

    // Core calculations
    generateProjections,
    calculateNPV,
    calculateIRR,
    calculatePaybackPeriod,
    calculateRevenueBreakEven,
    calculateAssetTrajectory,
    compareModelNPV,

    // Chart data generators
    generateCashFlowChartData,
    generateNPVWaterfallData,
    generateROITrajectoryData,
    generateAssetValueChartData,
    generateMetricsRadarData
};
