/**
 * Common types used across all calculation modules
 */

/**
 * Currency amount in South African Rand (ZAR)
 * All monetary values in the system use this type
 */
export type Currency = number;

/**
 * Percentage value (0-100 scale, not 0-1)
 * Example: 27% tax rate = 27, not 0.27
 */
export type Percentage = number;

/**
 * Number of years (positive integer)
 */
export type Years = number;

/**
 * Section 11(e) tax depreciation type for software
 * - pc-2yr: Standard software, 2-year write-off (50% p.a.)
 * - mainframe-5yr: Complex/mainframe systems, 5-year write-off (20% p.a.)
 */
export type Section11eType = 'pc-2yr' | 'mainframe-5yr';

/**
 * Revenue recognition timing under IFRS 15
 */
export type RevenueRecognitionTiming = 'point-in-time' | 'over-time';

/**
 * Amortisation method for intangible assets
 */
export type AmortisationMethod = 'straight-line' | 'units-of-production' | 'diminishing-balance';

/**
 * Transfer pricing risk levels
 */
export type RiskLevel = 'low' | 'medium' | 'high';

/**
 * Input field configuration for dynamic form generation
 */
export interface InputFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'percent' | 'select' | 'checkbox';
  default: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  category: string;
  hint?: string;
  required?: boolean;
}

/**
 * Input category for grouping form fields
 */
export interface InputCategory {
  name: string;
  description: string;
  icon: string;
}

/**
 * Calculation metadata attached to all results
 */
export interface CalculationMetadata {
  modelId: string;
  modelName: string;
  variantId: string;
  variantName: string;
  calculatedAt: string;
}
