/**
 * Types for saved comparison options
 */

import type { CalculationResult } from '@model-pear/calculator';

export interface SavedOption {
  /** Unique identifier */
  id: string;
  /** User-defined name */
  name: string;
  /** Model ID (e.g., 'model-1') */
  modelId: string;
  /** Variant ID (e.g., '1B') */
  variantId: string;
  /** Input values used for calculation */
  inputs: Record<string, unknown>;
  /** Calculation result */
  result: CalculationResult;
  /** When saved */
  savedAt: string;
  /** Optional notes */
  notes?: string;
}

export interface ComparisonState {
  /** All saved options */
  options: SavedOption[];
  /** IDs of options selected for comparison (2-4) */
  selectedIds: string[];
  /** Whether comparison view is open */
  isComparing: boolean;
}

export const STORAGE_KEY = 'model-pear-saved-options';
export const MAX_OPTIONS = 20;
export const MAX_COMPARISON = 4;
export const MIN_COMPARISON = 2;
