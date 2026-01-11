/**
 * Type definitions for sensitivity analysis
 */

import type { Currency, Percentage } from '../types/common.js';

// ============================================================
// RANGE INPUT TYPES
// ============================================================

export type InputCategory = 'cost' | 'revenue' | 'margin' | 'duration' | 'tax' | 'other';

export interface RangeConfig {
  /** Standard variance for this input type (e.g., 0.20 for 20%) */
  variance: number;
  /** Display label */
  label: string;
  /** Category for scenario analysis */
  category: InputCategory;
  /** Whether this is a percentage value */
  isPercent?: boolean;
  /** Whether this should be an integer */
  isInteger?: boolean;
}

export interface InputRange {
  /** Low estimate */
  low: number;
  /** Base/expected value */
  base: number;
  /** High estimate */
  high: number;
  /** Variance used to calculate range */
  variance: number;
  /** Input field name */
  inputName: string;
  /** Display label */
  label: string;
  /** Category for scenario analysis */
  category: InputCategory;
}

// ============================================================
// SCENARIO TYPES
// ============================================================

export interface ScenarioInputs {
  [key: string]: number;
}

export interface ScenarioResult<T> {
  inputs: ScenarioInputs;
  results: T;
  label: string;
}

export interface ScenarioSummaryMetric {
  base: number;
  best: number;
  worst: number;
  range: number;
  volatility: number;
  label: string;
  format: 'currency' | 'percentage' | 'number';
}

export interface ScenarioSummary {
  [key: string]: ScenarioSummaryMetric;
}

export interface ScenarioAnalysis<T> {
  base: ScenarioResult<T>;
  best: ScenarioResult<T>;
  worst: ScenarioResult<T>;
  summary: ScenarioSummary;
}

// ============================================================
// SENSITIVITY TYPES
// ============================================================

export interface InputSensitivity {
  inputName: string;
  label: string;
  category: InputCategory;
  baseValue: number;
  lowValue: number;
  highValue: number;
  lowOutput: number;
  highOutput: number;
  baseOutput: number;
  impact: number;
  percentChange: Percentage;
  direction: 'positive' | 'negative';
}

export interface SensitivityAnalysis {
  baseOutput: number;
  sensitivities: InputSensitivity[];
  topInfluencers: InputSensitivity[];
  totalVariance: number;
}

// ============================================================
// BREAK-EVEN TYPES
// ============================================================

export interface BreakEvenPoint {
  inputName: string;
  label: string;
  baseValue: number;
  breakEvenValue: number;
  margin: Percentage;
  marginOfSafety: 'Safe' | 'At Risk';
  description: string;
}

export interface BreakEvenAnalysis {
  baseOutput: number;
  isPositive: boolean;
  breakEvenPoints: { [key: string]: BreakEvenPoint };
  summary: string;
}

// ============================================================
// MONTE CARLO TYPES
// ============================================================

export interface Statistics {
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
}

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  count: number;
  frequency: Percentage;
}

export interface Percentiles {
  p5: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
}

export interface ConfidenceInterval {
  low: number;
  high: number;
  range: number;
}

export interface MonteCarloResult {
  iterations: number;
  statistics: Statistics;
  percentiles: Percentiles;
  histogram: HistogramBin[];
  probabilityOfLoss: Percentage;
}

export interface MonteCarloSimulation {
  iterations: number;
  output: MonteCarloResult;
  confidence90: ConfidenceInterval;
  summary: string;
}

// ============================================================
// CHART DATA TYPES
// ============================================================

export interface TornadoChartSeries {
  label: string;
  lowValue: number;
  highValue: number;
  baseValue: number;
  lowDelta: number;
  highDelta: number;
  impact: number;
  percentChange: Percentage;
  category: InputCategory;
}

export interface TornadoChartData {
  type: 'tornado';
  title: string;
  subtitle: string;
  baseValue: number;
  series: TornadoChartSeries[];
}

export interface FanChartPoint {
  year: number;
  base: number;
  best: number;
  worst: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
}

export interface FanChartData {
  type: 'fan';
  title: string;
  subtitle: string;
  data: FanChartPoint[];
}

export interface BreakEvenChartPoint {
  label: string;
  baseValue: number;
  breakEvenValue: number;
  margin: Percentage;
  status: 'Safe' | 'At Risk';
  color: string;
}

export interface BreakEvenChartData {
  type: 'breakeven';
  title: string;
  subtitle: string;
  baseOutput: number;
  data: BreakEvenChartPoint[];
}
