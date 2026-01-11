/**
 * Sensitivity Analysis Module
 *
 * Provides range-based scenario analysis, input sensitivity ranking,
 * break-even analysis, and Monte Carlo simulation.
 */

// Types
export type {
  InputCategory,
  RangeConfig,
  InputRange,
  ScenarioInputs,
  ScenarioResult,
  ScenarioSummaryMetric,
  ScenarioSummary,
  ScenarioAnalysis,
  InputSensitivity,
  SensitivityAnalysis,
  BreakEvenPoint,
  BreakEvenAnalysis,
  Statistics,
  HistogramBin,
  Percentiles,
  ConfidenceInterval,
  MonteCarloResult,
  MonteCarloSimulation,
  TornadoChartSeries,
  TornadoChartData,
  FanChartPoint,
  FanChartData,
  BreakEvenChartPoint,
  BreakEvenChartData,
} from './types.js';

// Range handling
export {
  RANGE_CONFIGS,
  createRange,
  createInputRanges,
} from './calculations.js';

// Scenario generation
export {
  generateBestCaseInputs,
  generateWorstCaseInputs,
  generateBaseCaseInputs,
} from './calculations.js';

// Sensitivity analysis
export { calculateInputSensitivity } from './calculations.js';

// Break-even analysis
export { findBreakEvenValue } from './calculations.js';

// Monte Carlo simulation
export {
  triangularRandom,
  generateRandomInputs,
  calculateStatistics,
  calculatePercentiles,
  createHistogram,
  runMonteCarloSimulation,
} from './calculations.js';

// Utilities
export { formatCurrency, formatPercentage } from './calculations.js';
