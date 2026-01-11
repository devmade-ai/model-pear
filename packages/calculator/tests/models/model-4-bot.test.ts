/**
 * Tests for Model 4: Build-Operate-Transfer (BOT)
 *
 * These tests verify calculation logic for BOT arrangements including
 * fixed price, formula-based, and fair value transfer mechanisms.
 */

import { describe, it, expect } from 'vitest';
import {
  calculate,
  BENCHMARK_RANGE,
  VARIANTS,
  type Variant4AInputs,
  type Variant4BInputs,
  type Variant4CInputs,
  type Variant4DInputs,
  type Variant4EInputs,
  type Variant4FInputs,
  type Variant4GInputs,
  type Variant4HInputs,
} from '../../src/models/model-4-bot.js';

// ============================================================
// TEST DATA
// ============================================================

const baseInputs = {
  projectName: 'Test BOT Project',
  developmentCost: 1_000_000,
  researchPhaseCost: 200_000,
  developmentPhaseCost: 800_000,
  operationPeriodYears: 3,
  annualOperatingFee: 200_000,
  annualOperatingCost: 100_000,
  estimatedAnnualRevenue: 500_000,
  transferYear: 3,
  usefulLife: 10,
  section11eType: 'pc-2yr' as const,
  corporateTaxRate: 27,
};

// ============================================================
// VARIANT 4A: FIXED TRANSFER PRICE
// ============================================================

describe('Model 4: Build-Operate-Transfer', () => {
  describe('Variant 4A: Fixed Transfer Price', () => {
    const inputs: Variant4AInputs = {
      ...baseInputs,
      variant: '4A',
      fixedTransferPrice: 1_000_000,
      inflationAdjustment: 5,
    };

    it('applies inflation adjustment to transfer price', () => {
      const result = calculate(inputs);

      // Transfer price = 1,000,000 × (1.05)^3 ≈ 1,157,625
      const expectedPrice = 1_000_000 * Math.pow(1.05, 3);
      const actualTransfer = result.developer.revenue.breakdown.services;

      expect(actualTransfer).toBeCloseTo(expectedPrice, 0);
    });

    it('calculates developer revenue from fees + transfer', () => {
      const result = calculate(inputs);

      // Operating fees = 200,000 × 3 = 600,000
      // Transfer (with inflation) ≈ 1,157,625
      // Total ≈ 1,757,625
      expect(result.developer.revenue.total).toBeCloseTo(1_757_625, 0);
    });

    it('calculates developer costs correctly', () => {
      const result = calculate(inputs);

      // Development + operating costs = 1,000,000 + (100,000 × 3) = 1,300,000
      expect(result.developer.costs.total).toBe(1_300_000);
    });

    it('developer retains asset until transfer', () => {
      const result = calculate(inputs);

      expect(result.developer.asset.recognised).toBe(true);
      expect(result.developer.asset.carryingValue).toBe(800_000);
      expect(result.developer.asset.reason).toContain('BOT asset');
    });

    it('correctly identifies variant metadata', () => {
      const result = calculate(inputs);

      expect(result.metadata.modelId).toBe('model-4');
      expect(result.metadata.variantId).toBe('4A');
      expect(result.metadata.variantName).toBe('Fixed Transfer Price');
    });
  });

  // ============================================================
  // VARIANT 4B: FORMULA-BASED TRANSFER PRICE
  // ============================================================

  describe('Variant 4B: Formula-Based Transfer Price', () => {
    const inputs: Variant4BInputs = {
      ...baseInputs,
      variant: '4B',
      formulaType: 'cost-plus',
      formulaMultiplier: 50,
      floorPrice: 500_000,
      ceilingPrice: 2_000_000,
    };

    it('calculates cost-plus transfer price', () => {
      const result = calculate(inputs);

      // Cost-plus: 800,000 × (1 + 50%) = 1,200,000
      // Within floor/ceiling, so 1,200,000
      const transferPrice = result.developer.revenue.breakdown.services;
      expect(transferPrice).toBe(1_200_000);
    });

    it('applies floor price when formula is below', () => {
      const lowInputs: Variant4BInputs = {
        ...inputs,
        formulaMultiplier: 10,
        floorPrice: 1_000_000,
      };
      const result = calculate(lowInputs);

      // Cost-plus: 800,000 × (1 + 10%) = 880,000 < 1,000,000 floor
      expect(result.developer.revenue.breakdown.services).toBe(1_000_000);
    });

    it('applies ceiling price when formula is above', () => {
      const highInputs: Variant4BInputs = {
        ...inputs,
        formulaMultiplier: 200,
        ceilingPrice: 1_500_000,
      };
      const result = calculate(highInputs);

      // Cost-plus: 800,000 × (1 + 200%) = 2,400,000 > 1,500,000 ceiling
      expect(result.developer.revenue.breakdown.services).toBe(1_500_000);
    });

    it('calculates revenue multiple formula', () => {
      const revenueInputs: Variant4BInputs = {
        ...inputs,
        formulaType: 'revenue-multiple',
        formulaMultiplier: 200, // 2x revenue
        floorPrice: 0,
        ceilingPrice: 10_000_000,
      };
      const result = calculate(revenueInputs);

      // Revenue multiple: 500,000 × 200% = 1,000,000
      expect(result.developer.revenue.breakdown.services).toBe(1_000_000);
    });
  });

  // ============================================================
  // VARIANT 4C: FAIR MARKET VALUE AT TRANSFER
  // ============================================================

  describe('Variant 4C: Fair Market Value at Transfer', () => {
    const inputs: Variant4CInputs = {
      ...baseInputs,
      variant: '4C',
      valuationMethod: 'income-approach',
      valuationDate: 'transfer',
      discountRate: 10,
    };

    it('calculates NPV of remaining cash flows', () => {
      const result = calculate(inputs);

      // Cash flows = 500,000 - 100,000 = 400,000 per year
      // Remaining years = 10 - 3 = 7
      // NPV = Σ 400,000 / (1.10)^t for t=1 to 7
      let expectedNPV = 0;
      for (let t = 1; t <= 7; t++) {
        expectedNPV += 400_000 / Math.pow(1.1, t);
      }

      expect(result.developer.revenue.breakdown.services).toBeCloseTo(expectedNPV, 0);
    });
  });

  // ============================================================
  // VARIANT 4D: COST RECOVERY PLUS
  // ============================================================

  describe('Variant 4D: Cost Recovery Plus', () => {
    const inputs: Variant4DInputs = {
      ...baseInputs,
      variant: '4D',
      costRecoveryMultiple: 150,
      profitSharingRate: 20,
    };

    it('calculates cost recovery transfer price', () => {
      const result = calculate(inputs);

      // Transfer = 800,000 × 150% = 1,200,000
      expect(result.developer.revenue.breakdown.services).toBe(1_200_000);
    });
  });

  // ============================================================
  // VARIANT 4E: PERFORMANCE-BASED TRANSFER
  // ============================================================

  describe('Variant 4E: Performance-Based Transfer', () => {
    const inputs: Variant4EInputs = {
      ...baseInputs,
      variant: '4E',
      performanceMetric: 'uptime',
      performanceThreshold: 99,
      performanceBonus: 100_000,
      performancePenalty: 50_000,
    };

    it('uses default transfer price calculation', () => {
      const result = calculate(inputs);

      // Default: developmentPhaseCost × 1.25 = 1,000,000
      expect(result.developer.revenue.breakdown.services).toBe(1_000_000);
    });
  });

  // ============================================================
  // VARIANT 4F: RETAINED STAKE
  // ============================================================

  describe('Variant 4F: Retained Stake', () => {
    const inputs: Variant4FInputs = {
      ...baseInputs,
      variant: '4F',
      developerStakePercentage: 20,
      stakeBuyoutYear: 5,
      stakeBuyoutMultiple: 150,
    };

    it('uses default transfer price calculation', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.breakdown.services).toBe(1_000_000);
    });
  });

  // ============================================================
  // VARIANT 4G: TRANSFER WITH WARRANTY
  // ============================================================

  describe('Variant 4G: Transfer with Warranty', () => {
    const inputs: Variant4GInputs = {
      ...baseInputs,
      variant: '4G',
      transferGuarantee: 'full',
      warrantyPeriod: 2,
      escrowPercentage: 10,
    };

    it('uses default transfer price calculation', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.breakdown.services).toBe(1_000_000);
    });
  });

  // ============================================================
  // VARIANT 4H: CROSS-BORDER BOT
  // ============================================================

  describe('Variant 4H: Cross-Border BOT', () => {
    const inputs: Variant4HInputs = {
      ...baseInputs,
      variant: '4H',
      ipRegistration: 'developer-jurisdiction',
      crossBorderWithholding: 15,
    };

    it('uses default transfer price calculation', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.breakdown.services).toBe(1_000_000);
    });
  });

  // ============================================================
  // BUYER PERSPECTIVE
  // ============================================================

  describe('Buyer Perspective', () => {
    const inputs: Variant4AInputs = {
      ...baseInputs,
      variant: '4A',
      fixedTransferPrice: 1_000_000,
      inflationAdjustment: 0,
    };

    it('capitalises transfer price at acquisition', () => {
      const result = calculate(inputs);

      expect(result.buyer.asset.recognised).toBe(true);
      expect(result.buyer.asset.capitalised).toBe(1_000_000);
    });

    it('expenses operating fees during operation period', () => {
      const result = calculate(inputs);

      // Operating fees = 200,000 × 3 = 600,000
      expect(result.buyer.asset.expensed).toBe(600_000);
    });

    it('calculates amortisation over remaining life', () => {
      const result = calculate(inputs);

      // Remaining life = 10 - 3 = 7 years
      // Annual amortisation = 1,000,000 / 7 ≈ 142,857
      expect(result.buyer.asset.usefulLife).toBe(7);
      expect(result.buyer.asset.annualAmortisation).toBeCloseTo(142_857, 0);
    });

    it('calculates buyer total cost correctly', () => {
      const result = calculate(inputs);

      // Operating fees + transfer price = 600,000 + 1,000,000 = 1,600,000
      expect(result.buyer.totalCost).toBe(1_600_000);
    });
  });

  // ============================================================
  // TRANSFER PRICING ASSESSMENT
  // ============================================================

  describe('Transfer Pricing Assessment', () => {
    it('uses CUP method', () => {
      const inputs: Variant4AInputs = {
        ...baseInputs,
        variant: '4A',
        fixedTransferPrice: 1_000_000,
        inflationAdjustment: 0,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.method).toBe('CUP');
    });

    it('classifies transfer within range as low risk', () => {
      const inputs: Variant4AInputs = {
        ...baseInputs,
        variant: '4A',
        fixedTransferPrice: 1_000_000, // 125% of development cost
        inflationAdjustment: 0,
      };
      const result = calculate(inputs);

      // 1,000,000 / 800,000 × 100 = 125% - within 100-200% range
      expect(result.transferPricing.withinRange).toBe(true);
      expect(result.transferPricing.riskLevel).toBe('low');
    });

    it('classifies transfer outside range as medium risk', () => {
      const inputs: Variant4AInputs = {
        ...baseInputs,
        variant: '4A',
        fixedTransferPrice: 2_000_000, // 250% of development cost
        inflationAdjustment: 0,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.withinRange).toBe(false);
      expect(result.transferPricing.riskLevel).toBe('medium');
    });
  });

  // ============================================================
  // SECTION 11(E) TAX TREATMENT
  // ============================================================

  describe('Section 11(e) Tax Treatment', () => {
    it('applies 2-year write-off for PC software', () => {
      const inputs: Variant4AInputs = {
        ...baseInputs,
        variant: '4A',
        fixedTransferPrice: 1_000_000,
        inflationAdjustment: 0,
        section11eType: 'pc-2yr',
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.section11eYears).toBe(2);
      expect(result.buyer.tax.section11eDeduction).toBe(500_000);
    });

    it('applies 5-year write-off for mainframe software', () => {
      const inputs: Variant4AInputs = {
        ...baseInputs,
        variant: '4A',
        fixedTransferPrice: 1_000_000,
        inflationAdjustment: 0,
        section11eType: 'mainframe-5yr',
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.section11eYears).toBe(5);
      expect(result.buyer.tax.section11eDeduction).toBe(200_000);
    });
  });

  // ============================================================
  // AMORTISATION SCHEDULE
  // ============================================================

  describe('Amortisation Schedule', () => {
    it('generates schedule over remaining useful life', () => {
      const inputs: Variant4AInputs = {
        ...baseInputs,
        variant: '4A',
        fixedTransferPrice: 1_000_000,
        inflationAdjustment: 0,
        usefulLife: 10,
        transferYear: 3,
      };
      const result = calculate(inputs);
      const schedule = result.buyer.expenses.schedule;

      // Remaining life = 10 - 3 = 7 years
      expect(schedule).toHaveLength(7);
      expect(schedule[0].year).toBe(1);
      expect(schedule[6].closingBalance).toBeCloseTo(0, 0);
    });
  });

  // ============================================================
  // EDGE CASES
  // ============================================================

  describe('Edge Cases', () => {
    it('handles zero operating costs', () => {
      const inputs: Variant4AInputs = {
        ...baseInputs,
        variant: '4A',
        fixedTransferPrice: 1_000_000,
        inflationAdjustment: 0,
        annualOperatingCost: 0,
      };
      const result = calculate(inputs);

      expect(result.developer.costs.total).toBe(1_000_000);
    });

    it('handles zero inflation adjustment', () => {
      const inputs: Variant4AInputs = {
        ...baseInputs,
        variant: '4A',
        fixedTransferPrice: 1_000_000,
        inflationAdjustment: 0,
      };
      const result = calculate(inputs);

      expect(result.developer.revenue.breakdown.services).toBe(1_000_000);
    });

    it('handles transfer at year 1', () => {
      const inputs: Variant4AInputs = {
        ...baseInputs,
        variant: '4A',
        fixedTransferPrice: 1_000_000,
        inflationAdjustment: 5,
        transferYear: 1,
        operationPeriodYears: 1,
      };
      const result = calculate(inputs);

      // Transfer = 1,000,000 × 1.05^1 = 1,050,000
      expect(result.developer.revenue.breakdown.services).toBe(1_050_000);
    });

    it('handles remaining life of 1 year', () => {
      const inputs: Variant4AInputs = {
        ...baseInputs,
        variant: '4A',
        fixedTransferPrice: 1_000_000,
        inflationAdjustment: 0,
        usefulLife: 4,
        transferYear: 3,
      };
      const result = calculate(inputs);

      // Remaining life = max(1, 4 - 3) = 1
      expect(result.buyer.asset.usefulLife).toBe(1);
      expect(result.buyer.asset.annualAmortisation).toBe(1_000_000);
    });
  });

  // ============================================================
  // VARIANT DEFINITIONS
  // ============================================================

  describe('Variant Definitions', () => {
    it('has all eight variants defined', () => {
      expect(Object.keys(VARIANTS)).toHaveLength(8);
      expect(VARIANTS['4A']).toBeDefined();
      expect(VARIANTS['4B']).toBeDefined();
      expect(VARIANTS['4C']).toBeDefined();
      expect(VARIANTS['4D']).toBeDefined();
      expect(VARIANTS['4E']).toBeDefined();
      expect(VARIANTS['4F']).toBeDefined();
      expect(VARIANTS['4G']).toBeDefined();
      expect(VARIANTS['4H']).toBeDefined();
    });

    it('has correct variant names', () => {
      expect(VARIANTS['4A'].name).toBe('Fixed Transfer Price');
      expect(VARIANTS['4B'].name).toBe('Formula-Based Transfer Price');
      expect(VARIANTS['4C'].name).toBe('Fair Market Value at Transfer');
      expect(VARIANTS['4D'].name).toBe('Cost Recovery Plus');
      expect(VARIANTS['4E'].name).toBe('Performance-Based Transfer');
      expect(VARIANTS['4F'].name).toBe('Retained Stake');
      expect(VARIANTS['4G'].name).toBe('Transfer with Warranty');
      expect(VARIANTS['4H'].name).toBe('Cross-Border BOT');
    });
  });

  // ============================================================
  // BENCHMARK RANGE
  // ============================================================

  describe('Benchmark Range', () => {
    it('has correct BOT benchmark values', () => {
      expect(BENCHMARK_RANGE.low).toBe(100);
      expect(BENCHMARK_RANGE.median).toBe(150);
      expect(BENCHMARK_RANGE.high).toBe(200);
      expect(BENCHMARK_RANGE.extremeHigh).toBe(300);
    });
  });
});
