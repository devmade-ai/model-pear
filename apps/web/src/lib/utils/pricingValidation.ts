/**
 * User-facing validation for Mode 1 pricing calculator inputs.
 */

import {
  isEmptyNumericInput,
  parseFiniteNumber,
  validateNumberBounds,
  type NumericInput,
} from './numericInput';

export type PricingModelId =
  | 'subscription'
  | 'usage-based'
  | 'per-seat'
  | 'one-time'
  | 'marketplace';

/** Gross-margin fields only — never marketplace commission rate (0–100% allowed). */
const DESIRED_MARGIN_FIELD: Record<PricingModelId, string> = {
  subscription: 'sub_desiredMargin',
  'usage-based': 'usage_desiredMargin',
  'per-seat': 'seat_desiredMargin',
  'one-time': 'onetime_desiredMargin',
  marketplace: 'market_desiredMargin',
};

export function validatePricingModel(
  model: PricingModelId,
  fields: Record<string, { label: string; value: NumericInput; min?: number; max?: number }>
): string[] {
  const issues: string[] = [];
  for (const [id, { label, value, min, max }] of Object.entries(fields)) {
    const issue = validateNumberBounds(id, label, value, { min, max, allowEmpty: true });
    if (issue) issues.push(issue.message);
  }
  if (issues.length) return issues;

  // Requirement: margin >= 100% guard applies only to desired gross margin inputs,
  // not marketplace commission rate (commission may be 0–100% inclusive).
  // Approach: model-specific field id — Object.keys iteration previously picked
  //   market_commissionRate before market_desiredMargin on marketplace.
  const marginKey = DESIRED_MARGIN_FIELD[model];
  const marginField = marginKey ? fields[marginKey] : undefined;
  if (marginField) {
    const m = parseFiniteNumber(marginField.value);
    if (m !== null && m >= 100) {
      issues.push(
        'Desired margin must be below 100%. At 100% or above, there is no finite minimum price to calculate.'
      );
    }
  }

  const requiredByModel: Record<PricingModelId, string[]> = {
    subscription: ['sub_monthlyPrice', 'sub_customers', 'sub_costToServe', 'sub_desiredMargin', 'sub_buyerValue'],
    'usage-based': ['usage_pricePerUnit', 'usage_monthlyUnits', 'usage_costPerUnit', 'usage_desiredMargin', 'usage_buyerValuePerUnit'],
    'per-seat': ['seat_pricePerSeat', 'seat_seats', 'seat_costPerSeat', 'seat_desiredMargin', 'seat_valuePerSeat'],
    'one-time': ['onetime_licensePrice', 'onetime_costToDeliver', 'onetime_desiredMargin', 'onetime_buyerValuePerYear'],
    marketplace: ['market_commissionRate', 'market_avgTransactionValue', 'market_monthlyTransactions', 'market_costPerTransaction', 'market_desiredMargin', 'market_sellerValuePerTransaction'],
  };

  for (const key of requiredByModel[model]) {
    const f = fields[key];
    if (!f) continue;
    if (isEmptyNumericInput(f.value)) {
      issues.push(`${f.label} is required to show results.`);
    }
  }

  return issues;
}

/** Values safe to pass into Apex (finite only). */
export function chartFiniteProps(props: Record<string, unknown>): boolean {
  return Object.values(props).every((v) => typeof v === 'number' && Number.isFinite(v));
}
