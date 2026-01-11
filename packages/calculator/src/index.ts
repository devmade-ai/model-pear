/**
 * @model-pear/calculator
 *
 * Pure TypeScript calculation engine for software transaction structuring.
 * This package contains no UI dependencies and can be used in any JavaScript environment.
 *
 * @example
 * ```typescript
 * import { calculateCostPlus, type Variant1BInputs } from '@model-pear/calculator';
 *
 * const inputs: Variant1BInputs = {
 *   variant: '1B',
 *   projectName: 'CRM Development',
 *   developmentCost: 1_000_000,
 *   researchPhaseCost: 200_000,
 *   developmentPhaseCost: 800_000,
 *   markupPercentage: 10,
 *   usefulLife: 5,
 *   section11eType: 'pc-2yr',
 *   corporateTaxRate: 27,
 * };
 *
 * const result = calculateCostPlus(inputs);
 * console.log(result.developer.revenue.total); // 1,100,000
 * ```
 */

// ============================================================
// MODELS
// ============================================================

export {
  // Model 1: Cost-Plus
  calculateCostPlus,
  MODEL_1_COST_PLUS,
  COST_PLUS_VARIANTS,
  COST_PLUS_BENCHMARK_RANGE,
  COST_PLUS_INPUT_CATEGORIES,
  COST_PLUS_INPUT_FIELDS,
} from './models/index.js';

export type {
  CostPlusInputs,
  CostPlusVariantId,
  CostPlusBaseInputs,
  Variant1AInputs,
  Variant1BInputs,
  Variant1CInputs,
  Variant1DInputs,
  Variant1EInputs,
  Variant1FInputs,
  VariantDefinition,
} from './models/index.js';

// ============================================================
// TYPES
// ============================================================

export type {
  // Common types
  Currency,
  Percentage,
  Years,
  Section11eType,
  RevenueRecognitionTiming,
  AmortisationMethod,
  RiskLevel,
  InputFieldConfig,
  InputCategory,
  CalculationMetadata,

  // Entity types
  AccountingFramework,
  DeveloperEntityConfig,
  BuyerEntityConfig,
  RelationshipConfig,
  EntityConfig,
  TaxParams,

  // Result types
  RevenueBreakdown,
  DeveloperRevenue,
  CostBreakdown,
  DeveloperCosts,
  DeveloperProfit,
  DeveloperAsset,
  DeveloperTax,
  DeveloperPerspective,
  BuyerAsset,
  BuyerYear1Expenses,
  BuyerOngoingExpenses,
  AmortisationScheduleYear,
  BuyerExpenses,
  BuyerTax,
  BuyerPerspective,
  BenchmarkRange,
  TransferPricingAssessment,
  CalculationResult,
} from './types/index.js';

export { DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from './types/index.js';

// ============================================================
// PROJECTIONS
// ============================================================

export {
  // Core calculations
  calculateNPV,
  calculatePresentValue,
  calculateFutureValue,
  calculateIRR,
  calculateMIRR,
  calculatePaybackPeriod,
  calculateDiscountedPaybackPeriod,
  calculateProfitabilityIndex,
  calculateROI,
  calculateAnnualizedROI,
  assessInvestment,
  // Cash flow utilities
  generateGrowingCashFlows,
  calculateCumulativeCashFlows,
  discountCashFlows,
  // Constants
  DEFAULT_PROJECTION_PARAMS,
} from './projections/index.js';

export type {
  ProjectionParams,
  CashFlows,
  YearlyProjection,
  BuyerYearlyProjection,
  ProjectionMetrics,
  InvestmentAssessment,
  PartyProjection,
  ProjectionResult,
  ProjectionSummary,
  BreakEvenResult,
  AssetTrajectoryPoint,
  AssetTrajectory,
} from './projections/index.js';

// ============================================================
// SENSITIVITY ANALYSIS
// ============================================================

export {
  // Range handling
  RANGE_CONFIGS,
  createRange,
  createInputRanges,
  // Scenario generation
  generateBestCaseInputs,
  generateWorstCaseInputs,
  generateBaseCaseInputs,
  // Sensitivity analysis
  calculateInputSensitivity,
  // Break-even analysis
  findBreakEvenValue,
  // Monte Carlo simulation
  triangularRandom,
  generateRandomInputs,
  calculateStatistics,
  calculatePercentiles,
  createHistogram,
  runMonteCarloSimulation,
  // Utilities
  formatCurrency,
  formatPercentage,
} from './sensitivity/index.js';

export type {
  InputCategory as SensitivityInputCategory,
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
} from './sensitivity/index.js';

// ============================================================
// COMPLIANCE (to be implemented)
// ============================================================

// export { assessTransferPricing } from './compliance/transfer-pricing.js';
