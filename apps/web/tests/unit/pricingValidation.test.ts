import { describe, expect, it } from 'vitest';
import { validatePricingModel } from '../../src/lib/utils/pricingValidation';

type FieldDef = { label: string; value: number | ''; min?: number; max?: number };

function marketplaceFields(overrides: {
  commissionRate?: number | '';
  desiredMargin?: number | '';
}): Record<string, FieldDef> {
  return {
    market_commissionRate: {
      label: 'Commission Rate',
      value: overrides.commissionRate ?? 10,
      min: 0,
      max: 100,
    },
    market_avgTransactionValue: { label: 'Average Transaction Value', value: 1000, min: 0 },
    market_monthlyTransactions: { label: 'Monthly Transactions', value: 500, min: 0 },
    market_costPerTransaction: { label: 'Cost per Transaction', value: 2, min: 0 },
    market_desiredMargin: {
      label: 'Desired Gross Margin',
      value: overrides.desiredMargin ?? 70,
      min: 0,
      max: 99,
    },
    market_sellerValuePerTransaction: { label: 'Value per Transaction to Seller', value: 50, min: 0 },
    market_activeSellers: { label: 'Active Sellers', value: 100, min: 0 },
  };
}

function subscriptionFields(desiredMargin: number | ''): Record<string, FieldDef> {
  return {
    sub_monthlyPrice: { label: 'Monthly Price per Customer', value: 500, min: 0 },
    sub_customers: { label: 'Number of Customers', value: 100, min: 0 },
    sub_costToServe: { label: 'Cost to Serve per Customer', value: 50, min: 0 },
    sub_desiredMargin: { label: 'Desired Gross Margin', value: desiredMargin, min: 0, max: 99 },
    sub_buyerValue: { label: 'Monthly Value to Client', value: 5000, min: 0 },
  };
}

describe('validatePricingModel marketplace commission vs desired margin', () => {
  it('allows commission 0, 99, and 100 without desired-margin error', () => {
    for (const commission of [0, 99, 100]) {
      const issues = validatePricingModel('marketplace', marketplaceFields({ commissionRate: commission }));
      expect(issues.some((m) => /Desired margin must be below 100%/i.test(m)), String(commission)).toBe(
        false
      );
    }
  });

  it('rejects commission above 100 with bounds message, not desired-margin copy', () => {
    const issues = validatePricingModel('marketplace', marketplaceFields({ commissionRate: 101 }));
    expect(issues.some((m) => /Commission Rate cannot be above 100/i.test(m))).toBe(true);
    expect(issues.some((m) => /Desired margin must be below 100%/i.test(m))).toBe(false);
  });

  it('rejects desired margin 100 and 101 distinctly from commission', () => {
    expect(
      validatePricingModel('marketplace', marketplaceFields({ desiredMargin: 100 })).some((m) =>
        /Desired Gross Margin cannot be above 99/i.test(m)
      )
    ).toBe(true);
    expect(
      validatePricingModel('marketplace', marketplaceFields({ desiredMargin: 101 })).some((m) =>
        /Desired Gross Margin cannot be above 99/i.test(m)
      )
    ).toBe(true);
    expect(
      validatePricingModel('marketplace', marketplaceFields({ desiredMargin: 100 })).some((m) =>
        /Desired margin must be below 100%/i.test(m)
      )
    ).toBe(false);
  });

  it('allows desired margin 99', () => {
    const issues = validatePricingModel('marketplace', marketplaceFields({ desiredMargin: 99 }));
    expect(issues.filter((m) => /Desired margin must be below 100%/i.test(m))).toEqual([]);
  });
});

describe('validatePricingModel subscription desired margin', () => {
  it('margin 99 valid; 100 and 101 blocked', () => {
    expect(validatePricingModel('subscription', subscriptionFields(99))).toEqual([]);
    for (const margin of [100, 101]) {
      const issues = validatePricingModel('subscription', subscriptionFields(margin));
      expect(
        issues.some(
          (m) =>
            /Desired Gross Margin cannot be above 99/i.test(m) ||
            /Desired margin must be below 100%/i.test(m)
        )
      ).toBe(true);
    }
  });
});
