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
// PROJECTIONS (to be implemented)
// ============================================================

// export { calculateNPV } from './projections/npv.js';
// export { calculateIRR } from './projections/irr.js';
// export { calculatePayback } from './projections/payback.js';
// export { runSensitivityAnalysis } from './projections/sensitivity.js';

// ============================================================
// COMPLIANCE (to be implemented)
// ============================================================

// export { assessTransferPricing } from './compliance/transfer-pricing.js';
