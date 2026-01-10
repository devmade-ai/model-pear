/**
 * Type exports for @model-pear/calculator
 *
 * This module re-exports all types for easy consumption:
 *
 * ```typescript
 * import type { CostPlusInputs, CalculationResult } from '@model-pear/calculator/types';
 * ```
 */

// Common types
export type {
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
} from './common.js';

// Entity types
export type {
  AccountingFramework,
  DeveloperEntityConfig,
  BuyerEntityConfig,
  RelationshipConfig,
  EntityConfig,
  TaxParams,
} from './entities.js';

export { DEFAULT_ENTITY_CONFIG, DEFAULT_TAX_PARAMS } from './entities.js';

// Result types
export type {
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
} from './results.js';
