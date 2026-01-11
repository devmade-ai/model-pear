/**
 * Tests for Model 5: Software Sale with Ongoing Support
 *
 * These tests verify calculation logic for software sales including
 * upfront sales, instalment payments, and earnout arrangements.
 */

import { describe, it, expect } from 'vitest';
import {
  calculate,
  BENCHMARK_RANGE,
  VARIANTS,
  type Variant5AInputs,
  type Variant5BInputs,
  type Variant5CInputs,
  type Variant5DInputs,
  type Variant5EInputs,
  type Variant5FInputs,
  type Variant5GInputs,
  type Variant5HInputs,
} from '../../src/models/model-5-software-sale.js';

// ============================================================
// TEST DATA
// ============================================================

const baseInputs = {
  projectName: 'Test Software Sale',
  developmentCost: 1_000_000,
  researchPhaseCost: 200_000,
  developmentPhaseCost: 800_000,
  salePrice: 2_000_000,
  annualMaintenanceFee: 100_000,
  annualMaintenanceCost: 50_000,
  maintenanceTerm: 5,
  usefulLife: 5,
  section11eType: 'pc-2yr' as const,
  corporateTaxRate: 27,
};

// ============================================================
// VARIANT 5A: OUTRIGHT SALE (UPFRONT)
// ============================================================

describe('Model 5: Software Sale', () => {
  describe('Variant 5A: Outright Sale (Upfront)', () => {
    const inputs: Variant5AInputs = {
      ...baseInputs,
      variant: '5A',
      paymentTerms: 'upfront',
    };

    it('calculates developer revenue from sale + maintenance', () => {
      const result = calculate(inputs);

      // Sale + maintenance = 2,000,000 + (100,000 × 5) = 2,500,000
      expect(result.developer.revenue.total).toBe(2_500_000);
    });

    it('breaks down revenue correctly', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.breakdown.licence).toBe(2_000_000);
      expect(result.developer.revenue.breakdown.maintenance).toBe(500_000);
    });

    it('calculates developer costs correctly', () => {
      const result = calculate(inputs);

      // Development + maintenance costs = 1,000,000 + (50,000 × 5) = 1,250,000
      expect(result.developer.costs.total).toBe(1_250_000);
    });

    it('calculates developer profit correctly', () => {
      const result = calculate(inputs);

      // Gross = 2,500,000 - 1,250,000 = 1,250,000
      expect(result.developer.profit.gross).toBe(1_250_000);
    });

    it('developer no longer recognises asset after sale', () => {
      const result = calculate(inputs);

      expect(result.developer.asset.recognised).toBe(false);
      expect(result.developer.asset.carryingValue).toBe(0);
      expect(result.developer.asset.reason).toContain('IP transferred');
    });

    it('uses point-in-time revenue recognition', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.recognitionTiming).toBe('point-in-time');
      expect(result.developer.revenue.recognitionBasis).toContain('IFRS 15');
    });

    it('correctly identifies variant metadata', () => {
      const result = calculate(inputs);

      expect(result.metadata.modelId).toBe('model-5');
      expect(result.metadata.variantId).toBe('5A');
      expect(result.metadata.variantName).toBe('Outright Sale (Upfront)');
    });
  });

  // ============================================================
  // VARIANT 5B: INSTALMENT SALE
  // ============================================================

  describe('Variant 5B: Instalment Sale', () => {
    const inputs: Variant5BInputs = {
      ...baseInputs,
      variant: '5B',
      instalmentPeriod: 3,
      instalmentCount: 12,
      interestRate: 10,
    };

    it('uses full sale price as revenue', () => {
      const result = calculate(inputs);

      // Revenue = sale price + maintenance
      expect(result.developer.revenue.total).toBe(2_500_000);
    });
  });

  // ============================================================
  // VARIANT 5C: DEFERRED PAYMENT
  // ============================================================

  describe('Variant 5C: Deferred Payment', () => {
    const inputs: Variant5CInputs = {
      ...baseInputs,
      variant: '5C',
      deferralPeriod: 2,
      discountRate: 10,
    };

    it('uses full sale price as revenue', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(2_500_000);
    });
  });

  // ============================================================
  // VARIANT 5D: SALE WITH SLA-BASED MAINTENANCE
  // ============================================================

  describe('Variant 5D: Sale with SLA-Based Maintenance', () => {
    const inputs: Variant5DInputs = {
      ...baseInputs,
      variant: '5D',
      maintenanceLevel: 'premium',
      slaUptimeTarget: 99.9,
      slaPenaltyRate: 10,
    };

    it('calculates total revenue correctly', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(2_500_000);
    });
  });

  // ============================================================
  // VARIANT 5E: SOURCE CODE SALE
  // ============================================================

  describe('Variant 5E: Source Code Sale', () => {
    const inputs: Variant5EInputs = {
      ...baseInputs,
      variant: '5E',
      sourceCodeIncluded: true,
      sourceCodePremium: 25,
      escrowArrangement: false,
    };

    it('applies source code premium when included', () => {
      const result = calculate(inputs);

      // Effective price = 2,000,000 × 1.25 = 2,500,000
      // Total revenue = 2,500,000 + 500,000 maintenance = 3,000,000
      expect(result.developer.revenue.total).toBe(3_000_000);
    });

    it('does not apply premium when source not included', () => {
      const noSourceInputs: Variant5EInputs = {
        ...inputs,
        sourceCodeIncluded: false,
      };
      const result = calculate(noSourceInputs);

      expect(result.developer.revenue.total).toBe(2_500_000);
    });
  });

  // ============================================================
  // VARIANT 5F: SALE WITH EXTENDED WARRANTY
  // ============================================================

  describe('Variant 5F: Sale with Extended Warranty', () => {
    const inputs: Variant5FInputs = {
      ...baseInputs,
      variant: '5F',
      warrantyType: 'extended',
      warrantyPeriod: 3,
      warrantyProvision: 5,
    };

    it('calculates total revenue correctly', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(2_500_000);
    });
  });

  // ============================================================
  // VARIANT 5G: SALE WITH EARNOUT
  // ============================================================

  describe('Variant 5G: Sale with Earnout', () => {
    const inputs: Variant5GInputs = {
      ...baseInputs,
      variant: '5G',
      earnoutPercentage: 20,
      earnoutMetric: 'revenue',
      earnoutTarget: 5_000_000,
      earnoutPeriod: 3,
    };

    it('includes expected earnout in revenue', () => {
      const result = calculate(inputs);

      // Expected earnout = 5,000,000 × 20% × 70% probability = 700,000
      // Total = 2,000,000 + 700,000 + 500,000 maintenance = 3,200,000
      expect(result.developer.revenue.total).toBe(3_200_000);
    });
  });

  // ============================================================
  // VARIANT 5H: SALE WITH TRANSITION SUPPORT
  // ============================================================

  describe('Variant 5H: Sale with Transition Support', () => {
    const inputs: Variant5HInputs = {
      ...baseInputs,
      variant: '5H',
      transitionSupportPeriod: 1,
      transitionSupportFee: 200_000,
      knowledgeTransferIncluded: true,
    };

    it('uses sale price as revenue', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(2_500_000);
    });
  });

  // ============================================================
  // BUYER PERSPECTIVE
  // ============================================================

  describe('Buyer Perspective', () => {
    const inputs: Variant5AInputs = {
      ...baseInputs,
      variant: '5A',
      paymentTerms: 'upfront',
    };

    it('capitalises sale price as intangible asset', () => {
      const result = calculate(inputs);

      expect(result.buyer.asset.recognised).toBe(true);
      expect(result.buyer.asset.capitalised).toBe(2_000_000);
    });

    it('calculates annual amortisation correctly', () => {
      const result = calculate(inputs);

      // Amortisation = 2,000,000 / 5 = 400,000
      expect(result.buyer.asset.annualAmortisation).toBe(400_000);
    });

    it('calculates buyer total cost correctly', () => {
      const result = calculate(inputs);

      // Sale price + maintenance = 2,000,000 + 500,000 = 2,500,000
      expect(result.buyer.totalCost).toBe(2_500_000);
    });

    it('expenses maintenance fees as incurred', () => {
      const result = calculate(inputs);

      expect(result.buyer.expenses.year1.total).toBe(500_000); // amort + maintenance
    });
  });

  // ============================================================
  // TRANSFER PRICING ASSESSMENT
  // ============================================================

  describe('Transfer Pricing Assessment', () => {
    it('uses CUP method', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
      };
      const result = calculate(inputs);

      expect(result.transferPricing.method).toBe('CUP');
    });

    it('classifies sale within implied multiple range as low risk', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
        salePrice: 2_000_000, // 200% of dev cost - within range
      };
      const result = calculate(inputs);

      // Implied multiple = 2,000,000 / 1,000,000 × 100 = 200%
      expect(result.transferPricing.withinRange).toBe(true);
      expect(result.transferPricing.riskLevel).toBe('low');
    });

    it('classifies sale with high multiple as medium risk', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
        salePrice: 5_000_000, // 500% of dev cost
      };
      const result = calculate(inputs);

      expect(result.transferPricing.withinRange).toBe(false);
      expect(result.transferPricing.riskLevel).toBe('medium');
    });

    it('provides documentation requirements', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
      };
      const result = calculate(inputs);

      expect(result.transferPricing.documentation).toContain('Software sale agreement');
      expect(result.transferPricing.documentation).toContain('Valuation report');
    });
  });

  // ============================================================
  // SECTION 11(E) TAX TREATMENT
  // ============================================================

  describe('Section 11(e) Tax Treatment', () => {
    it('applies 2-year write-off for PC software', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
        section11eType: 'pc-2yr',
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.section11eYears).toBe(2);
      expect(result.buyer.tax.section11eDeduction).toBe(1_000_000);
    });

    it('applies 5-year write-off for mainframe software', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
        section11eType: 'mainframe-5yr',
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.section11eYears).toBe(5);
      expect(result.buyer.tax.section11eDeduction).toBe(400_000);
    });

    it('calculates tax benefit correctly', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
        section11eType: 'pc-2yr',
      };
      const result = calculate(inputs);

      // Tax benefit = 1,000,000 × 27% = 270,000
      expect(result.buyer.tax.taxBenefit).toBe(270_000);
    });
  });

  // ============================================================
  // AMORTISATION SCHEDULE
  // ============================================================

  describe('Amortisation Schedule', () => {
    it('generates correct schedule for buyer', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
        usefulLife: 5,
      };
      const result = calculate(inputs);
      const schedule = result.buyer.expenses.schedule;

      expect(schedule).toHaveLength(5);

      // Year 1
      expect(schedule[0].year).toBe(1);
      expect(schedule[0].openingBalance).toBe(2_000_000);
      expect(schedule[0].amortisation).toBe(400_000);
      expect(schedule[0].closingBalance).toBe(1_600_000);

      // Year 5
      expect(schedule[4].closingBalance).toBe(0);
    });
  });

  // ============================================================
  // EDGE CASES
  // ============================================================

  describe('Edge Cases', () => {
    it('handles zero maintenance term', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
        maintenanceTerm: 0,
      };
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(2_000_000);
      expect(result.developer.revenue.breakdown.maintenance).toBe(0);
    });

    it('handles zero maintenance fee', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
        annualMaintenanceFee: 0,
      };
      const result = calculate(inputs);

      expect(result.developer.revenue.breakdown.maintenance).toBe(0);
    });

    it('handles sale at development cost (no margin)', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
        salePrice: 1_000_000,
      };
      const result = calculate(inputs);

      // Profit = 1,000,000 - 1,000,000 + (100,000 - 50,000) × 5 = 250,000
      expect(result.developer.profit.gross).toBe(250_000);
    });

    it('handles sale below development cost (loss)', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
        salePrice: 500_000,
        maintenanceTerm: 0,
      };
      const result = calculate(inputs);

      // Profit = 500,000 - 1,000,000 = -500,000
      expect(result.developer.profit.gross).toBe(-500_000);
    });

    it('handles zero tax rate', () => {
      const inputs: Variant5AInputs = {
        ...baseInputs,
        variant: '5A',
        paymentTerms: 'upfront',
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
    it('has all eight variants defined', () => {
      expect(Object.keys(VARIANTS)).toHaveLength(8);
      expect(VARIANTS['5A']).toBeDefined();
      expect(VARIANTS['5B']).toBeDefined();
      expect(VARIANTS['5C']).toBeDefined();
      expect(VARIANTS['5D']).toBeDefined();
      expect(VARIANTS['5E']).toBeDefined();
      expect(VARIANTS['5F']).toBeDefined();
      expect(VARIANTS['5G']).toBeDefined();
      expect(VARIANTS['5H']).toBeDefined();
    });

    it('has correct variant names', () => {
      expect(VARIANTS['5A'].name).toBe('Outright Sale (Upfront)');
      expect(VARIANTS['5B'].name).toBe('Instalment Sale');
      expect(VARIANTS['5C'].name).toBe('Deferred Payment');
      expect(VARIANTS['5D'].name).toBe('Sale with SLA-Based Maintenance');
      expect(VARIANTS['5E'].name).toBe('Source Code Sale');
      expect(VARIANTS['5F'].name).toBe('Sale with Extended Warranty');
      expect(VARIANTS['5G'].name).toBe('Sale with Earnout');
      expect(VARIANTS['5H'].name).toBe('Sale with Transition Support');
    });
  });

  // ============================================================
  // BENCHMARK RANGE
  // ============================================================

  describe('Benchmark Range', () => {
    it('has correct software sale benchmark values', () => {
      expect(BENCHMARK_RANGE.low).toBe(150);
      expect(BENCHMARK_RANGE.median).toBe(250);
      expect(BENCHMARK_RANGE.high).toBe(400);
      expect(BENCHMARK_RANGE.extremeHigh).toBe(600);
    });
  });
});
