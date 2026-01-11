/**
 * Tests for Model 6: SaaS / Subscription Enhancement
 *
 * These tests verify calculation logic for SaaS arrangements including
 * flat-rate, per-user, usage-based, and tiered pricing models.
 */

import { describe, it, expect } from 'vitest';
import {
  calculate,
  BENCHMARK_RANGE,
  VARIANTS,
  type Variant6AInputs,
  type Variant6BInputs,
  type Variant6CInputs,
  type Variant6DInputs,
  type Variant6EInputs,
  type Variant6FInputs,
  type Variant6GInputs,
  type Variant6HInputs,
  type Variant6IInputs,
} from '../../src/models/model-6-saas.js';

// ============================================================
// TEST DATA
// ============================================================

const baseInputs = {
  projectName: 'Test SaaS Platform',
  developmentCost: 1_000_000,
  researchPhaseCost: 200_000,
  developmentPhaseCost: 800_000,
  monthlySubscriptionFee: 10_000,
  contractLengthMonths: 36,
  annualHostingCost: 50_000,
  annualSupportCost: 30_000,
  usefulLife: 10,
  section11eType: 'pc-2yr' as const,
  corporateTaxRate: 27,
};

// ============================================================
// VARIANT 6A: FLAT-RATE SUBSCRIPTION
// ============================================================

describe('Model 6: SaaS / Subscription', () => {
  describe('Variant 6A: Flat-Rate Subscription', () => {
    const inputs: Variant6AInputs = {
      ...baseInputs,
      variant: '6A',
      pricingModel: 'flat-rate',
    };

    it('calculates total subscription revenue', () => {
      const result = calculate(inputs);

      // Monthly fee × months = 10,000 × 36 = 360,000
      expect(result.developer.revenue.total).toBe(360_000);
    });

    it('calculates operating costs correctly', () => {
      const result = calculate(inputs);

      // Hosting + Support per year × contract years
      // (50,000 + 30,000) × 3 = 240,000
      // Plus developer amortisation
      const annualOpCost = (50_000 + 30_000) * 3;
      const annualAmort = 800_000 / 10;
      expect(result.developer.costs.total).toBeCloseTo(annualOpCost + annualAmort * 3, 0);
    });

    it('developer retains IP ownership', () => {
      const result = calculate(inputs);

      expect(result.developer.asset.recognised).toBe(true);
      expect(result.developer.asset.carryingValue).toBe(800_000);
      expect(result.developer.asset.reason).toContain('Developer retains IP');
    });

    it('buyer has no asset (operating expense)', () => {
      const result = calculate(inputs);

      expect(result.buyer.asset.recognised).toBe(false);
      expect(result.buyer.asset.capitalised).toBe(0);
    });

    it('uses over-time revenue recognition', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.recognitionTiming).toBe('over-time');
      expect(result.developer.revenue.recognitionBasis).toContain('IFRS 15');
    });

    it('correctly identifies variant metadata', () => {
      const result = calculate(inputs);

      expect(result.metadata.modelId).toBe('model-6');
      expect(result.metadata.variantId).toBe('6A');
      expect(result.metadata.variantName).toBe('Flat-Rate Subscription');
    });
  });

  // ============================================================
  // VARIANT 6B: PER-USER PRICING
  // ============================================================

  describe('Variant 6B: Per-User Pricing', () => {
    const inputs: Variant6BInputs = {
      ...baseInputs,
      variant: '6B',
      pricingModel: 'per-user',
      userCount: 100,
      perUserMonthlyFee: 50,
    };

    it('calculates revenue from user count × per-user fee', () => {
      const result = calculate(inputs);

      // Monthly = 100 × 50 = 5,000
      // Total = 5,000 × 36 = 180,000
      expect(result.developer.revenue.total).toBe(180_000);
    });

    it('scales with user count', () => {
      const largerInputs: Variant6BInputs = {
        ...inputs,
        userCount: 500,
      };
      const result = calculate(largerInputs);

      // Monthly = 500 × 50 = 25,000
      // Total = 25,000 × 36 = 900,000
      expect(result.developer.revenue.total).toBe(900_000);
    });
  });

  // ============================================================
  // VARIANT 6C: USAGE-BASED PRICING
  // ============================================================

  describe('Variant 6C: Usage-Based Pricing', () => {
    const inputs: Variant6CInputs = {
      ...baseInputs,
      variant: '6C',
      pricingModel: 'usage-based',
      usageMetric: 'api-calls',
      estimatedMonthlyUsage: 1_000_000,
      perUnitFee: 0.01,
    };

    it('calculates revenue from usage × per-unit fee', () => {
      const result = calculate(inputs);

      // Monthly = 1,000,000 × 0.01 = 10,000
      // Total = 10,000 × 36 = 360,000
      expect(result.developer.revenue.total).toBe(360_000);
    });

    it('handles different usage metrics', () => {
      const storageInputs: Variant6CInputs = {
        ...inputs,
        usageMetric: 'storage',
        estimatedMonthlyUsage: 10_000, // GB
        perUnitFee: 0.10, // per GB
      };
      const result = calculate(storageInputs);

      // Monthly = 10,000 × 0.10 = 1,000
      // Total = 1,000 × 36 = 36,000
      expect(result.developer.revenue.total).toBe(36_000);
    });
  });

  // ============================================================
  // VARIANT 6D: TIERED PRICING
  // ============================================================

  describe('Variant 6D: Tiered Pricing', () => {
    const inputs: Variant6DInputs = {
      ...baseInputs,
      variant: '6D',
      pricingModel: 'tiered',
      tierName: 'professional',
      tierMultiplier: 150, // 150% of base
    };

    it('applies tier multiplier to base fee', () => {
      const result = calculate(inputs);

      // Monthly = 10,000 × 150% = 15,000
      // Total = 15,000 × 36 = 540,000
      expect(result.developer.revenue.total).toBe(540_000);
    });

    it('handles starter tier', () => {
      const starterInputs: Variant6DInputs = {
        ...inputs,
        tierName: 'starter',
        tierMultiplier: 50, // 50% of base
      };
      const result = calculate(starterInputs);

      // Monthly = 10,000 × 50% = 5,000
      // Total = 5,000 × 36 = 180,000
      expect(result.developer.revenue.total).toBe(180_000);
    });

    it('handles enterprise tier', () => {
      const enterpriseInputs: Variant6DInputs = {
        ...inputs,
        tierName: 'enterprise',
        tierMultiplier: 300, // 300% of base
      };
      const result = calculate(enterpriseInputs);

      expect(result.developer.revenue.total).toBe(1_080_000);
    });
  });

  // ============================================================
  // VARIANT 6E: SAAS WITH CUSTOMIZATION
  // ============================================================

  describe('Variant 6E: SaaS with Customization', () => {
    const inputs: Variant6EInputs = {
      ...baseInputs,
      variant: '6E',
      customizationIncluded: true,
      customizationFee: 100_000,
      customizationCost: 60_000,
    };

    it('includes customization fee in revenue when included', () => {
      const result = calculate(inputs);

      // Subscription + customization = 360,000 + 100,000 = 460,000
      expect(result.developer.revenue.total).toBe(460_000);
    });

    it('excludes customization when not included', () => {
      const noCustomInputs: Variant6EInputs = {
        ...inputs,
        customizationIncluded: false,
      };
      const result = calculate(noCustomInputs);

      expect(result.developer.revenue.total).toBe(360_000);
    });
  });

  // ============================================================
  // VARIANT 6F: SAAS WITH PREMIUM SUPPORT
  // ============================================================

  describe('Variant 6F: SaaS with Premium Support', () => {
    const inputs: Variant6FInputs = {
      ...baseInputs,
      variant: '6F',
      supportLevel: 'premium',
      supportPremium: 50, // 50% premium
      slaCoverage: 99.9,
    };

    it('applies support premium to monthly fee', () => {
      const result = calculate(inputs);

      // Monthly = 10,000 × (1 + 50%) = 15,000
      // Total = 15,000 × 36 = 540,000
      expect(result.developer.revenue.total).toBe(540_000);
    });

    it('handles standard support (no premium)', () => {
      const standardInputs: Variant6FInputs = {
        ...inputs,
        supportLevel: 'standard',
        supportPremium: 0,
      };
      const result = calculate(standardInputs);

      expect(result.developer.revenue.total).toBe(360_000);
    });

    it('handles dedicated support', () => {
      const dedicatedInputs: Variant6FInputs = {
        ...inputs,
        supportLevel: 'dedicated',
        supportPremium: 100, // 100% premium
      };
      const result = calculate(dedicatedInputs);

      // Monthly = 10,000 × 2 = 20,000
      // Total = 20,000 × 36 = 720,000
      expect(result.developer.revenue.total).toBe(720_000);
    });
  });

  // ============================================================
  // VARIANT 6G: SAAS WITH DATA RESIDENCY
  // ============================================================

  describe('Variant 6G: SaaS with Data Residency', () => {
    const inputs: Variant6GInputs = {
      ...baseInputs,
      variant: '6G',
      dataResidencyRequired: true,
      dataResidencyPremium: 25,
      complianceCertifications: ['SOC2', 'GDPR', 'POPIA'],
    };

    it('applies data residency premium when required', () => {
      const result = calculate(inputs);

      // Monthly = 10,000 × (1 + 25%) = 12,500
      // Total = 12,500 × 36 = 450,000
      expect(result.developer.revenue.total).toBe(450_000);
    });

    it('no premium when residency not required', () => {
      const noResidencyInputs: Variant6GInputs = {
        ...inputs,
        dataResidencyRequired: false,
      };
      const result = calculate(noResidencyInputs);

      expect(result.developer.revenue.total).toBe(360_000);
    });
  });

  // ============================================================
  // VARIANT 6H: COMMITTED USE DISCOUNT
  // ============================================================

  describe('Variant 6H: Committed Use Discount', () => {
    const inputs: Variant6HInputs = {
      ...baseInputs,
      variant: '6H',
      minimumCommitment: 300_000, // Annual commitment
      overageRate: 20,
      commitmentPeriod: 3,
    };

    it('calculates monthly from annual commitment', () => {
      const result = calculate(inputs);

      // Monthly = 300,000 / 12 = 25,000
      // Total = 25,000 × 36 = 900,000
      expect(result.developer.revenue.total).toBe(900_000);
    });
  });

  // ============================================================
  // VARIANT 6I: WHITE-LABEL SAAS
  // ============================================================

  describe('Variant 6I: White-Label SaaS', () => {
    const inputs: Variant6IInputs = {
      ...baseInputs,
      variant: '6I',
      whitelabelEnabled: true,
      whitelabelFee: 5_000,
      resellerMargin: 30,
    };

    it('includes white-label fee in monthly revenue', () => {
      const result = calculate(inputs);

      // Monthly = 10,000 + 5,000 = 15,000
      // Total = 15,000 × 36 = 540,000
      expect(result.developer.revenue.total).toBe(540_000);
    });
  });

  // ============================================================
  // BUYER PERSPECTIVE
  // ============================================================

  describe('Buyer Perspective', () => {
    const inputs: Variant6AInputs = {
      ...baseInputs,
      variant: '6A',
      pricingModel: 'flat-rate',
    };

    it('buyer has no capitalised asset', () => {
      const result = calculate(inputs);

      expect(result.buyer.asset.recognised).toBe(false);
      expect(result.buyer.asset.capitalised).toBe(0);
    });

    it('expenses all subscription fees', () => {
      const result = calculate(inputs);

      expect(result.buyer.asset.expensed).toBe(360_000);
    });

    it('calculates buyer total cost', () => {
      const result = calculate(inputs);

      expect(result.buyer.totalCost).toBe(360_000);
    });

    it('provides tax benefit on subscription expense', () => {
      const result = calculate(inputs);

      // Annual subscription = 360,000 / 3 = 120,000
      // Tax benefit = 120,000 × 27% = 32,400
      expect(result.buyer.tax.taxBenefit).toBeCloseTo(32_400, 0);
    });
  });

  // ============================================================
  // TRANSFER PRICING ASSESSMENT
  // ============================================================

  describe('Transfer Pricing Assessment', () => {
    it('uses TNMM method for SaaS', () => {
      const inputs: Variant6AInputs = {
        ...baseInputs,
        variant: '6A',
        pricingModel: 'flat-rate',
      };
      const result = calculate(inputs);

      expect(result.transferPricing.method).toBe('TNMM');
    });

    it('assesses margin against SaaS benchmarks', () => {
      const inputs: Variant6AInputs = {
        ...baseInputs,
        variant: '6A',
        pricingModel: 'flat-rate',
        monthlySubscriptionFee: 15_000, // Higher margin
      };
      const result = calculate(inputs);

      expect(result.transferPricing.benchmarkRange.low).toBe(60);
      expect(result.transferPricing.benchmarkRange.high).toBe(85);
    });

    it('provides documentation requirements', () => {
      const inputs: Variant6AInputs = {
        ...baseInputs,
        variant: '6A',
        pricingModel: 'flat-rate',
      };
      const result = calculate(inputs);

      expect(result.transferPricing.documentation).toContain('SaaS subscription agreement');
      expect(result.transferPricing.documentation).toContain('Service level agreement');
    });
  });

  // ============================================================
  // EDGE CASES
  // ============================================================

  describe('Edge Cases', () => {
    it('handles zero monthly fee', () => {
      const inputs: Variant6AInputs = {
        ...baseInputs,
        variant: '6A',
        pricingModel: 'flat-rate',
        monthlySubscriptionFee: 0,
      };
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(0);
    });

    it('handles short contract (1 month)', () => {
      const inputs: Variant6AInputs = {
        ...baseInputs,
        variant: '6A',
        pricingModel: 'flat-rate',
        contractLengthMonths: 1,
      };
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(10_000);
    });

    it('handles zero users in per-user pricing', () => {
      const inputs: Variant6BInputs = {
        ...baseInputs,
        variant: '6B',
        pricingModel: 'per-user',
        userCount: 0,
        perUserMonthlyFee: 50,
      };
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(0);
    });

    it('handles zero usage in usage-based pricing', () => {
      const inputs: Variant6CInputs = {
        ...baseInputs,
        variant: '6C',
        pricingModel: 'usage-based',
        usageMetric: 'api-calls',
        estimatedMonthlyUsage: 0,
        perUnitFee: 0.01,
      };
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(0);
    });

    it('handles zero tax rate', () => {
      const inputs: Variant6AInputs = {
        ...baseInputs,
        variant: '6A',
        pricingModel: 'flat-rate',
        corporateTaxRate: 0,
      };
      const result = calculate(inputs);

      expect(result.developer.tax.taxPayable).toBe(0);
      expect(result.buyer.tax.taxBenefit).toBe(0);
    });
  });

  // ============================================================
  // VARIANT DEFINITIONS
  // ============================================================

  describe('Variant Definitions', () => {
    it('has all nine variants defined', () => {
      expect(Object.keys(VARIANTS)).toHaveLength(9);
      expect(VARIANTS['6A']).toBeDefined();
      expect(VARIANTS['6B']).toBeDefined();
      expect(VARIANTS['6C']).toBeDefined();
      expect(VARIANTS['6D']).toBeDefined();
      expect(VARIANTS['6E']).toBeDefined();
      expect(VARIANTS['6F']).toBeDefined();
      expect(VARIANTS['6G']).toBeDefined();
      expect(VARIANTS['6H']).toBeDefined();
      expect(VARIANTS['6I']).toBeDefined();
    });

    it('has correct variant names', () => {
      expect(VARIANTS['6A'].name).toBe('Flat-Rate Subscription');
      expect(VARIANTS['6B'].name).toBe('Per-User Pricing');
      expect(VARIANTS['6C'].name).toBe('Usage-Based Pricing');
      expect(VARIANTS['6D'].name).toBe('Tiered Pricing');
      expect(VARIANTS['6E'].name).toBe('SaaS with Customization');
      expect(VARIANTS['6F'].name).toBe('SaaS with Premium Support');
      expect(VARIANTS['6G'].name).toBe('SaaS with Data Residency');
      expect(VARIANTS['6H'].name).toBe('Committed Use Discount');
      expect(VARIANTS['6I'].name).toBe('White-Label SaaS');
    });
  });

  // ============================================================
  // BENCHMARK RANGE
  // ============================================================

  describe('Benchmark Range', () => {
    it('has correct SaaS gross margin benchmark values', () => {
      expect(BENCHMARK_RANGE.low).toBe(60);
      expect(BENCHMARK_RANGE.median).toBe(75);
      expect(BENCHMARK_RANGE.high).toBe(85);
      expect(BENCHMARK_RANGE.extremeHigh).toBe(90);
    });
  });
});
