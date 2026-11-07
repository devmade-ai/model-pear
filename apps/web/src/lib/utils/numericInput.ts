/**
 * Parsing and validation helpers for bound number inputs.
 *
 * Requirement: Keep raw user edits (empty field while clearing/retyping)
 *   without throwing in formatters or charts.
 * Approach: Treat '', null, and non-finite numbers as "missing"; validate
 *   bounds separately for user-facing messages (no silent clamping).
 */

export type NumericInput = number | string | null | undefined;

/** True when the user left the field empty (clearing in progress). */
export function isEmptyNumericInput(value: NumericInput): boolean {
  return value === '' || value === null || value === undefined;
}

/** Finite number for math, or null when empty / not a finite number. */
export function parseFiniteNumber(value: NumericInput): number | null {
  if (isEmptyNumericInput(value)) return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const trimmed = String(value).trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export interface NumberBoundsIssue {
  fieldId: string;
  label: string;
  message: string;
}

/**
 * Validate a single numeric field against optional min/max (inclusive).
 * Negative values with min >= 0 surface a plain-language error (no clamp).
 */
export function validateNumberBounds(
  fieldId: string,
  label: string,
  value: NumericInput,
  options?: { min?: number; max?: number; allowEmpty?: boolean }
): NumberBoundsIssue | null {
  if (isEmptyNumericInput(value)) {
    if (options?.allowEmpty === false) {
      return { fieldId, label, message: `${label} is required.` };
    }
    return null;
  }
  const n = parseFiniteNumber(value);
  if (n === null) {
    return { fieldId, label, message: `${label} must be a valid number.` };
  }
  const { min, max } = options ?? {};
  if (min !== undefined && n < min) {
    if (min >= 0) {
      return {
        fieldId,
        label,
        message: `${label} cannot be negative. Enter zero or a positive amount.`,
      };
    }
    return { fieldId, label, message: `${label} must be at least ${min}.` };
  }
  if (max !== undefined && n > max) {
    return {
      fieldId,
      label,
      message: `${label} cannot be above ${max}${max === 100 && label.toLowerCase().includes('margin') ? '%' : ''}.`,
    };
  }
  return null;
}

/** Coerce to a finite number for display/formatting, or null. */
export function finiteOrNull(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}
