/**
 * Sensitivity Analysis Calculations
 *
 * Provides range-based scenario analysis, input sensitivity ranking,
 * break-even analysis, and Monte Carlo simulation.
 */

import type { Percentage } from '../types/common.js';
import type {
  InputCategory,
  RangeConfig,
  InputRange,
  Statistics,
  HistogramBin,
  Percentiles,
  MonteCarloResult,
  InputSensitivity,
  SensitivityAnalysis,
} from './types.js';

// ============================================================
// RANGE INPUT DEFINITIONS
// ============================================================

/**
 * Default variance configurations for common input types
 */
export const RANGE_CONFIGS: Record<string, RangeConfig> = {
  // Cost inputs - typically +/- 20% variance
  developmentCost: { variance: 0.20, label: 'Development Cost', category: 'cost' },
  researchPhaseCost: { variance: 0.25, label: 'Research Phase Cost', category: 'cost' },
  developmentPhaseCost: { variance: 0.20, label: 'Development Phase Cost', category: 'cost' },
  totalProjectCost: { variance: 0.20, label: 'Total Project Cost', category: 'cost' },
  buildCost: { variance: 0.20, label: 'Build Cost', category: 'cost' },
  setupCost: { variance: 0.15, label: 'Setup Cost', category: 'cost' },
  operatingCost: { variance: 0.15, label: 'Operating Cost', category: 'cost' },
  annualOperatingCost: { variance: 0.15, label: 'Annual Operating Cost', category: 'cost' },
  annualMaintenanceCost: { variance: 0.15, label: 'Maintenance Cost', category: 'cost' },
  annualHostingCost: { variance: 0.15, label: 'Hosting Cost', category: 'cost' },
  annualSupportCost: { variance: 0.15, label: 'Support Cost', category: 'cost' },

  // Revenue inputs - typically +/- 25-30% variance
  salePrice: { variance: 0.25, label: 'Sale Price', category: 'revenue' },
  licenceFee: { variance: 0.25, label: 'Licence Fee', category: 'revenue' },
  upfrontLicenceFee: { variance: 0.25, label: 'Upfront Licence Fee', category: 'revenue' },
  annualLicenceFee: { variance: 0.25, label: 'Annual Licence Fee', category: 'revenue' },
  expectedRevenue: { variance: 0.30, label: 'Expected Revenue', category: 'revenue' },
  operatingRevenue: { variance: 0.30, label: 'Operating Revenue', category: 'revenue' },
  transferPrice: { variance: 0.25, label: 'Transfer Price', category: 'revenue' },
  fixedTransferPrice: { variance: 0.25, label: 'Fixed Transfer Price', category: 'revenue' },
  monthlySubscriptionFee: { variance: 0.20, label: 'Monthly Subscription', category: 'revenue' },
  annualOperatingFee: { variance: 0.20, label: 'Annual Operating Fee', category: 'revenue' },
  annualMaintenanceFee: { variance: 0.15, label: 'Maintenance Fee', category: 'revenue' },

  // Margin inputs - typically +/- 40-50% of the percentage
  markupPercentage: { variance: 0.50, label: 'Markup %', category: 'margin', isPercent: true },
  royaltyRate: { variance: 0.40, label: 'Royalty Rate', category: 'margin', isPercent: true },
  sharePercentage: { variance: 0.30, label: 'Share %', category: 'margin', isPercent: true },

  // Duration inputs - +/- 1-2 years
  usefulLife: { variance: 0.40, label: 'Useful Life', category: 'duration', isInteger: true },
  operationPeriodYears: { variance: 0.33, label: 'Operation Period', category: 'duration', isInteger: true },
  contractLengthMonths: { variance: 0.25, label: 'Contract Length', category: 'duration', isInteger: true },
  maintenanceTerm: { variance: 0.33, label: 'Maintenance Term', category: 'duration', isInteger: true },

  // Tax inputs - small variance
  corporateTaxRate: { variance: 0.10, label: 'Corporate Tax Rate', category: 'tax', isPercent: true },
};

// ============================================================
// RANGE CALCULATIONS
// ============================================================

/**
 * Create a range from a base value using standard variance
 *
 * @param inputName - Name of the input field
 * @param baseValue - The base/expected value
 * @param options - Optional overrides for variance, low, high values
 * @returns Input range with low, base, high values
 */
export function createRange(
  inputName: string,
  baseValue: number,
  options: { variance?: number; low?: number; high?: number } = {}
): InputRange {
  const config = RANGE_CONFIGS[inputName] || {
    variance: 0.20,
    label: inputName,
    category: 'other' as InputCategory,
  };
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
    category: config.category || 'other',
  };
}

/**
 * Create ranges for all numeric inputs in an object
 *
 * @param baseInputs - Object with input values
 * @returns Object with ranges for all numeric inputs that have configurations
 */
export function createInputRanges(baseInputs: Record<string, unknown>): Record<string, InputRange> {
  const ranges: Record<string, InputRange> = {};

  Object.entries(baseInputs).forEach(([name, value]) => {
    if (typeof value === 'number' && RANGE_CONFIGS[name]) {
      ranges[name] = createRange(name, value);
    }
  });

  return ranges;
}

// ============================================================
// SCENARIO GENERATION
// ============================================================

/**
 * Generate best case inputs (low costs, high revenues)
 */
export function generateBestCaseInputs(ranges: Record<string, InputRange>): Record<string, number> {
  const inputs: Record<string, number> = {};

  Object.entries(ranges).forEach(([name, range]) => {
    const category = range.category;
    if (category === 'cost') {
      inputs[name] = range.low; // Lower costs are better
    } else if (category === 'revenue' || category === 'margin') {
      inputs[name] = range.high; // Higher revenue is better
    } else {
      inputs[name] = range.base;
    }
  });

  return inputs;
}

/**
 * Generate worst case inputs (high costs, low revenues)
 */
export function generateWorstCaseInputs(ranges: Record<string, InputRange>): Record<string, number> {
  const inputs: Record<string, number> = {};

  Object.entries(ranges).forEach(([name, range]) => {
    const category = range.category;
    if (category === 'cost') {
      inputs[name] = range.high; // Higher costs are worse
    } else if (category === 'revenue' || category === 'margin') {
      inputs[name] = range.low; // Lower revenue is worse
    } else {
      inputs[name] = range.base;
    }
  });

  return inputs;
}

/**
 * Generate base case inputs
 */
export function generateBaseCaseInputs(ranges: Record<string, InputRange>): Record<string, number> {
  const inputs: Record<string, number> = {};

  Object.entries(ranges).forEach(([name, range]) => {
    inputs[name] = range.base;
  });

  return inputs;
}

// ============================================================
// SENSITIVITY ANALYSIS
// ============================================================

/**
 * Calculate sensitivity of an output to each input
 *
 * This function requires a calculation function that takes inputs
 * and returns a numeric output value.
 *
 * @param baseInputs - Base input values
 * @param calculateFn - Function that calculates output from inputs
 * @returns Sensitivity analysis with ranked inputs
 */
export function calculateInputSensitivity(
  baseInputs: Record<string, number>,
  calculateFn: (inputs: Record<string, number>) => number
): SensitivityAnalysis {
  const sensitivities: InputSensitivity[] = [];
  const baseOutput = calculateFn(baseInputs);

  // Test sensitivity of each range-enabled input
  Object.entries(baseInputs).forEach(([inputName, baseValue]) => {
    if (typeof baseValue !== 'number' || !RANGE_CONFIGS[inputName]) {
      return;
    }

    const config = RANGE_CONFIGS[inputName];
    const variance = config.variance;

    // Calculate with low value
    const lowInputs = { ...baseInputs, [inputName]: baseValue * (1 - variance) };
    const lowOutput = calculateFn(lowInputs);

    // Calculate with high value
    const highInputs = { ...baseInputs, [inputName]: baseValue * (1 + variance) };
    const highOutput = calculateFn(highInputs);

    const impact = Math.abs(highOutput - lowOutput);
    const percentChange = baseOutput !== 0 ? (impact / Math.abs(baseOutput)) * 100 : 0;

    sensitivities.push({
      inputName,
      label: config.label || inputName,
      category: config.category,
      baseValue,
      lowValue: baseValue * (1 - variance),
      highValue: baseValue * (1 + variance),
      lowOutput,
      highOutput,
      baseOutput,
      impact,
      percentChange,
      direction: highOutput > lowOutput ? 'positive' : 'negative',
    });
  });

  // Sort by absolute impact
  sensitivities.sort((a, b) => b.impact - a.impact);

  return {
    baseOutput,
    sensitivities,
    topInfluencers: sensitivities.slice(0, 5),
    totalVariance: sensitivities.reduce((sum, s) => sum + s.impact, 0),
  };
}

// ============================================================
// BREAK-EVEN ANALYSIS
// ============================================================

/**
 * Find break-even value for an input using binary search
 *
 * @param inputName - Name of the input to find break-even for
 * @param baseValue - Current value of the input
 * @param baseInputs - All base inputs
 * @param calculateFn - Function that calculates output from inputs
 * @param isRevenueType - Whether higher values increase output
 * @returns Break-even value or null if not found
 */
export function findBreakEvenValue(
  inputName: string,
  baseValue: number,
  baseInputs: Record<string, number>,
  calculateFn: (inputs: Record<string, number>) => number,
  isRevenueType: boolean
): number | null {
  const maxIterations = 50;
  const tolerance = baseValue * 0.001;

  let low = isRevenueType ? 0 : baseValue;
  let high = isRevenueType ? baseValue * 2 : baseValue * 3;
  let iterations = 0;

  while (iterations < maxIterations && high - low > tolerance) {
    const mid = (low + high) / 2;
    const testInputs = { ...baseInputs, [inputName]: mid };
    const testOutput = calculateFn(testInputs);

    if (isRevenueType) {
      // For revenue: output < 0 means we need more revenue
      if (testOutput < 0) {
        low = mid;
      } else {
        high = mid;
      }
    } else {
      // For cost: output > 0 means we can afford more cost
      if (testOutput > 0) {
        low = mid;
      } else {
        high = mid;
      }
    }
    iterations++;
  }

  return (low + high) / 2;
}

// ============================================================
// MONTE CARLO SIMULATION
// ============================================================

/**
 * Generate a random number using triangular distribution
 *
 * Triangular distribution is useful for simulation when you have
 * low, most likely (mode), and high estimates.
 *
 * @param min - Minimum value
 * @param mode - Most likely value (peak of distribution)
 * @param max - Maximum value
 * @returns Random value from triangular distribution
 */
export function triangularRandom(min: number, mode: number, max: number): number {
  const u = Math.random();
  const f = (mode - min) / (max - min);

  if (u < f) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

/**
 * Generate random inputs from ranges using triangular distribution
 */
export function generateRandomInputs(ranges: Record<string, InputRange>): Record<string, number> {
  const inputs: Record<string, number> = {};

  Object.entries(ranges).forEach(([name, range]) => {
    inputs[name] = triangularRandom(range.low, range.base, range.high);
  });

  return inputs;
}

/**
 * Calculate basic statistics for an array of numbers
 */
export function calculateStatistics(values: number[]): Statistics {
  if (values.length === 0) {
    return { mean: 0, median: 0, min: 0, max: 0, stdDev: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;

  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(avgSquaredDiff);

  return { mean, median, min, max, stdDev };
}

/**
 * Calculate percentiles for an array of sorted numbers
 */
export function calculatePercentiles(sortedValues: number[]): Percentiles {
  const getPercentile = (p: number): number => {
    if (sortedValues.length === 0) return 0;
    const index = Math.floor((p / 100) * sortedValues.length);
    return sortedValues[Math.min(index, sortedValues.length - 1)] ?? 0;
  };

  return {
    p5: getPercentile(5),
    p10: getPercentile(10),
    p25: getPercentile(25),
    p50: getPercentile(50),
    p75: getPercentile(75),
    p90: getPercentile(90),
    p95: getPercentile(95),
  };
}

/**
 * Create histogram bins from values
 */
export function createHistogram(values: number[], bins = 20): HistogramBin[] {
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / bins;

  const histogram: HistogramBin[] = Array(bins)
    .fill(0)
    .map((_, i) => ({
      binStart: min + i * binWidth,
      binEnd: min + (i + 1) * binWidth,
      count: 0,
      frequency: 0,
    }));

  values.forEach((v) => {
    const binIndex = Math.min(Math.floor((v - min) / binWidth), bins - 1);
    const bin = histogram[binIndex];
    if (binIndex >= 0 && binIndex < bins && bin) {
      bin.count++;
    }
  });

  histogram.forEach((bin) => {
    bin.frequency = (bin.count / values.length) * 100;
  });

  return histogram;
}

/**
 * Run Monte Carlo simulation
 *
 * @param ranges - Input ranges for simulation
 * @param calculateFn - Function that calculates output from inputs
 * @param iterations - Number of simulation iterations
 * @returns Monte Carlo simulation results
 */
export function runMonteCarloSimulation(
  ranges: Record<string, InputRange>,
  calculateFn: (inputs: Record<string, number>) => number,
  iterations = 1000
): MonteCarloResult {
  const outputs: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const randomInputs = generateRandomInputs(ranges);
    try {
      const output = calculateFn(randomInputs);
      outputs.push(output);
    } catch {
      // Skip failed calculations
    }
  }

  // Sort for percentile calculations
  outputs.sort((a, b) => a - b);

  const statistics = calculateStatistics(outputs);
  const percentiles = calculatePercentiles(outputs);
  const histogram = createHistogram(outputs, 20);

  // Calculate probability of loss (negative output)
  const lossCount = outputs.filter((o) => o < 0).length;
  const probabilityOfLoss: Percentage = (lossCount / outputs.length) * 100;

  return {
    iterations: outputs.length,
    statistics,
    percentiles,
    histogram,
    probabilityOfLoss,
  };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Format a number as currency string
 */
export function formatCurrency(value: number, currency = 'R'): string {
  return `${currency}${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format a number as percentage string
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
