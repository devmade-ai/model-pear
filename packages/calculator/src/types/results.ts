/**
 * Result types for calculation outputs
 * All models return results following these structures
 */

import type {
  Currency,
  Percentage,
  Years,
  Section11eType,
  RevenueRecognitionTiming,
  AmortisationMethod,
  RiskLevel,
  CalculationMetadata,
} from './common.js';

// ============================================================
// DEVELOPER PERSPECTIVE
// ============================================================

/**
 * Revenue breakdown by type
 */
export interface RevenueBreakdown {
  development: Currency;
  licence: Currency;
  royalties: Currency;
  maintenance: Currency;
  services: Currency;
}

/**
 * Developer revenue details
 */
export interface DeveloperRevenue {
  total: Currency;
  breakdown: RevenueBreakdown;
  recognitionTiming: RevenueRecognitionTiming;
  recognitionBasis: string;
}

/**
 * Cost breakdown by category
 */
export interface CostBreakdown {
  personnel: Currency;
  infrastructure: Currency;
  other: Currency;
}

/**
 * Developer costs details
 */
export interface DeveloperCosts {
  total: Currency;
  breakdown: CostBreakdown;
}

/**
 * Developer profit details
 */
export interface DeveloperProfit {
  gross: Currency;
  margin: Percentage;
  net: Currency;
}

/**
 * Developer asset recognition
 */
export interface DeveloperAsset {
  recognised: boolean;
  reason: string;
  carryingValue: Currency;
}

/**
 * Developer tax position
 */
export interface DeveloperTax {
  taxableIncome: Currency;
  corporateTaxRate: Percentage;
  taxPayable: Currency;
  effectiveTaxRate: Percentage;
  deferredTaxAsset: Currency;
  deferredTaxLiability: Currency;
}

/**
 * Complete developer perspective results
 */
export interface DeveloperPerspective {
  revenue: DeveloperRevenue;
  costs: DeveloperCosts;
  profit: DeveloperProfit;
  asset: DeveloperAsset;
  tax: DeveloperTax;
}

// ============================================================
// BUYER PERSPECTIVE
// ============================================================

/**
 * Buyer asset details
 */
export interface BuyerAsset {
  recognised: boolean;
  capitalised: Currency;
  expensed: Currency;
  carryingValue: Currency;
  usefulLife: Years;
  amortisationMethod: AmortisationMethod;
  annualAmortisation: Currency;
  section11eType: Section11eType;
  section11eYears: Years;
}

/**
 * Year 1 expense details for buyer
 */
export interface BuyerYear1Expenses {
  researchExpense: Currency;
  amortisation: Currency;
  total: Currency;
}

/**
 * Ongoing expense details for buyer
 */
export interface BuyerOngoingExpenses {
  amortisation: Currency;
  maintenance: Currency;
  total: Currency;
}

/**
 * Single year in amortisation schedule
 */
export interface AmortisationScheduleYear {
  year: number;
  openingBalance: Currency;
  amortisation: Currency;
  closingBalance: Currency;
}

/**
 * Buyer expenses summary
 */
export interface BuyerExpenses {
  year1: BuyerYear1Expenses;
  ongoing: BuyerOngoingExpenses;
  schedule: AmortisationScheduleYear[];
}

/**
 * Buyer tax position
 */
export interface BuyerTax {
  section11eDeduction: Currency;
  accountingAmortisation: Currency;
  timingDifference: Currency;
  deferredTaxAsset: Currency;
  deferredTaxLiability: Currency;
  taxBenefit: Currency;
}

/**
 * Complete buyer perspective results
 */
export interface BuyerPerspective {
  asset: BuyerAsset;
  expenses: BuyerExpenses;
  tax: BuyerTax;
  totalCost: Currency;
}

// ============================================================
// TRANSFER PRICING
// ============================================================

/**
 * Benchmark range for arm's length comparison
 */
export interface BenchmarkRange {
  low: Percentage;
  median: Percentage;
  high: Percentage;
  extremeHigh: Percentage;
}

/**
 * Transfer pricing assessment
 */
export interface TransferPricingAssessment {
  method: string;
  margin: Percentage;
  benchmarkRange: BenchmarkRange;
  withinRange: boolean;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendation: string;
  documentation: string[];
}

// ============================================================
// COMBINED RESULT
// ============================================================

/**
 * Complete calculation result combining all perspectives
 */
export interface CalculationResult {
  developer: DeveloperPerspective;
  buyer: BuyerPerspective;
  transferPricing: TransferPricingAssessment;
  metadata: CalculationMetadata;
}
