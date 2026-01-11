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
  // Model 2: Licence
  calculateLicence,
  MODEL_2_LICENCE,
  LICENCE_VARIANTS,
  LICENCE_BENCHMARK_RANGE,
  // Model 3: Joint Development
  calculateJointDevelopment,
  MODEL_3_JOINT_DEVELOPMENT,
  JOINT_DEV_VARIANTS,
  JOINT_DEV_BENCHMARK_RANGE,
  // Model 4: BOT
  calculateBOT,
  MODEL_4_BOT,
  BOT_VARIANTS,
  BOT_BENCHMARK_RANGE,
  // Model 5: Software Sale
  calculateSoftwareSale,
  MODEL_5_SOFTWARE_SALE,
  SOFTWARE_SALE_VARIANTS,
  SOFTWARE_SALE_BENCHMARK_RANGE,
  // Model 6: SaaS
  calculateSaaS,
  MODEL_6_SAAS,
  SAAS_VARIANTS,
  SAAS_BENCHMARK_RANGE,
  // Model Registry
  ALL_MODELS,
} from './models/index.js';

export type {
  // Model 1
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
  // Model 2
  LicenceInputs,
  LicenceVariantId,
  Variant2AInputs,
  Variant2BInputs,
  Variant2CInputs,
  Variant2DInputs,
  Variant2EInputs,
  Variant2FInputs,
  Variant2GInputs,
  Variant2HInputs,
  // Model 3
  JointDevInputs,
  JointDevVariantId,
  Variant3AInputs,
  Variant3BInputs,
  Variant3CInputs,
  Variant3DInputs,
  Variant3EInputs,
  Variant3FInputs,
  Variant3GInputs,
  Variant3HInputs,
  // Model 4
  BOTInputs,
  BOTVariantId,
  Variant4AInputs,
  Variant4BInputs,
  Variant4CInputs,
  Variant4DInputs,
  Variant4EInputs,
  Variant4FInputs,
  Variant4GInputs,
  Variant4HInputs,
  // Model 5
  SoftwareSaleInputs,
  SoftwareSaleVariantId,
  Variant5AInputs,
  Variant5BInputs,
  Variant5CInputs,
  Variant5DInputs,
  Variant5EInputs,
  Variant5FInputs,
  Variant5GInputs,
  Variant5HInputs,
  // Model 6
  SaaSInputs,
  SaaSVariantId,
  Variant6AInputs,
  Variant6BInputs,
  Variant6CInputs,
  Variant6DInputs,
  Variant6EInputs,
  Variant6FInputs,
  Variant6GInputs,
  Variant6HInputs,
  Variant6IInputs,
  // Model Registry
  ModelId,
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
