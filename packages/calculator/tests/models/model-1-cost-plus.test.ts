/**
 * Tests for Model 1: Development Services (Cost-Plus)
 *
 * These tests verify the calculation logic matches the business requirements
 * documented in CALCULATIONS.md and the legacy implementation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculate,
  BENCHMARK_RANGE,
  VARIANTS,
  type Variant1AInputs,
  type Variant1BInputs,
  type Variant1CInputs,
  type Variant1DInputs,
  type Variant1EInputs,
  type Variant1FInputs,
} from '../../src/models/model-1-cost-plus.js';

// ============================================================
// TEST DATA
// ============================================================

const baseInputs = {
  projectName: 'Test Project',
  developmentCost: 1_000_000,
  researchPhaseCost: 200_000,
  developmentPhaseCost: 800_000,
  usefulLife: 5,
  section11eType: 'pc-2yr' as const,
  corporateTaxRate: 27,
};

// ============================================================
// VARIANT 1A: PURE COST REIMBURSEMENT
// ============================================================

describe('Model 1: Cost-Plus', () => {
  describe('Variant 1A: Pure Cost Reimbursement', () => {
    const inputs: Variant1AInputs = {
      ...baseInputs,
      variant: '1A',
    };

    it('calculates zero margin (cost pass-through)', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(1_000_000);
      expect(result.developer.costs.total).toBe(1_000_000);
      expect(result.developer.profit.gross).toBe(0);
      expect(result.developer.profit.margin).toBe(0);
    });

    it('has no tax payable when profit is zero', () => {
      const result = calculate(inputs);

      expect(result.developer.tax.taxableIncome).toBe(0);
      expect(result.developer.tax.taxPayable).toBe(0);
    });

    it('correctly identifies variant metadata', () => {
      const result = calculate(inputs);

      expect(result.metadata.modelId).toBe('model-1');
      expect(result.metadata.variantId).toBe('1A');
      expect(result.metadata.variantName).toBe('Pure Cost Reimbursement');
    });
  });

  // ============================================================
  // VARIANT 1B: STANDARD COST-PLUS
  // ============================================================

  describe('Variant 1B: Standard Cost-Plus', () => {
    const inputs: Variant1BInputs = {
      ...baseInputs,
      variant: '1B',
      markupPercentage: 10,
    };

    it('calculates developer revenue with 10% markup', () => {
      const result = calculate(inputs);

      // Revenue = Cost × (1 + 10%)
      expect(result.developer.revenue.total).toBe(1_100_000);
    });

    it('calculates developer profit correctly', () => {
      const result = calculate(inputs);

      expect(result.developer.profit.gross).toBe(100_000);
      expect(result.developer.profit.margin).toBe(10);
    });

    it('calculates tax payable at 27%', () => {
      const result = calculate(inputs);

      // Tax = Profit × 27%
      const expectedTax = 100_000 * 0.27;
      expect(result.developer.tax.taxPayable).toBe(expectedTax);
      expect(result.developer.profit.net).toBe(100_000 - expectedTax);
    });

    it('calculates buyer capitalised asset correctly', () => {
      const result = calculate(inputs);

      // Only development phase is capitalised (IAS 38)
      expect(result.buyer.asset.capitalised).toBe(800_000);
      expect(result.buyer.asset.expensed).toBe(200_000);
    });

    it('calculates buyer annual amortisation (5-year useful life)', () => {
      const result = calculate(inputs);

      // Amortisation = Capitalised / Useful Life
      expect(result.buyer.asset.annualAmortisation).toBe(160_000);
      expect(result.buyer.expenses.year1.amortisation).toBe(160_000);
    });

    it('calculates Section 11(e) tax depreciation (2-year write-off)', () => {
      const result = calculate(inputs);

      // 2-year write-off = 50% per year
      expect(result.buyer.tax.section11eDeduction).toBe(400_000);
    });

    it('calculates deferred tax liability correctly', () => {
      const result = calculate(inputs);

      // Timing difference = Accounting amort - Tax deduction
      // = 160,000 - 400,000 = -240,000
      // Deferred tax = -240,000 × 27% = -64,800 (liability)
      expect(result.buyer.tax.timingDifference).toBe(-240_000);
      expect(result.buyer.tax.deferredTaxLiability).toBeCloseTo(64_800, 2);
      expect(result.buyer.tax.deferredTaxAsset).toBe(0);
    });

    it('generates correct amortisation schedule', () => {
      const result = calculate(inputs);
      const schedule = result.buyer.expenses.schedule;

      expect(schedule).toHaveLength(5);

      // Year 1
      expect(schedule[0].year).toBe(1);
      expect(schedule[0].openingBalance).toBe(800_000);
      expect(schedule[0].amortisation).toBe(160_000);
      expect(schedule[0].closingBalance).toBe(640_000);

      // Year 5
      expect(schedule[4].year).toBe(5);
      expect(schedule[4].openingBalance).toBe(160_000);
      expect(schedule[4].closingBalance).toBe(0);
    });

    it('recognises revenue over time (IFRS 15)', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.recognitionTiming).toBe('over-time');
      expect(result.developer.revenue.recognitionBasis).toContain('IFRS 15');
    });

    it('does not recognise developer asset', () => {
      const result = calculate(inputs);

      expect(result.developer.asset.recognised).toBe(false);
      expect(result.developer.asset.carryingValue).toBe(0);
    });
  });

  // ============================================================
  // VARIANT 1C: COST-PLUS WITH PERFORMANCE BONUS
  // ============================================================

  describe('Variant 1C: Cost-Plus with Performance Bonus', () => {
    const inputs: Variant1CInputs = {
      ...baseInputs,
      variant: '1C',
      markupPercentage: 10,
      milestoneBonus: 100_000,
      milestoneProbability: 80,
    };

    it('includes expected bonus in revenue', () => {
      const result = calculate(inputs);

      // Base revenue = 1,000,000 × 1.10 = 1,100,000
      // Expected bonus = 100,000 × 80% = 80,000
      // Total = 1,180,000
      expect(result.developer.revenue.total).toBe(1_180_000);
    });

    it('calculates profit including bonus', () => {
      const result = calculate(inputs);

      // Profit = Revenue - Costs = 1,180,000 - 1,000,000 = 180,000
      expect(result.developer.profit.gross).toBe(180_000);
    });

    it('handles 100% milestone probability', () => {
      const fullBonusInputs: Variant1CInputs = {
        ...inputs,
        milestoneProbability: 100,
      };
      const result = calculate(fullBonusInputs);

      // Total = 1,100,000 + 100,000 = 1,200,000
      expect(result.developer.revenue.total).toBe(1_200_000);
    });

    it('handles 0% milestone probability', () => {
      const noBonusInputs: Variant1CInputs = {
        ...inputs,
        milestoneProbability: 0,
      };
      const result = calculate(noBonusInputs);

      // No bonus expected
      expect(result.developer.revenue.total).toBe(1_100_000);
    });
  });

  // ============================================================
  // VARIANT 1D: FIXED PRICE DEVELOPMENT
  // ============================================================

  describe('Variant 1D: Fixed Price Development', () => {
    const inputs: Variant1DInputs = {
      ...baseInputs,
      variant: '1D',
      fixedPrice: 1_200_000,
      estimatedCostVariance: 10,
    };

    it('uses fixed price as revenue regardless of costs', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(1_200_000);
    });

    it('calculates costs with variance', () => {
      const result = calculate(inputs);

      // Costs = 1,000,000 × (1 + 10%) = 1,100,000
      expect(result.developer.costs.total).toBe(1_100_000);
    });

    it('calculates derived margin from fixed price', () => {
      const result = calculate(inputs);

      // Margin = (1,200,000 - 1,100,000) / 1,100,000 × 100 ≈ 9.09%
      expect(result.developer.profit.gross).toBe(100_000);
      expect(result.developer.profit.margin).toBeCloseTo(9.09, 1);
    });

    it('handles cost overrun scenario', () => {
      const overrunInputs: Variant1DInputs = {
        ...inputs,
        estimatedCostVariance: 30, // 30% overrun
      };
      const result = calculate(overrunInputs);

      // Costs = 1,000,000 × 1.30 = 1,300,000
      // Loss = 1,200,000 - 1,300,000 = -100,000
      expect(result.developer.profit.gross).toBe(-100_000);
    });

    it('handles cost savings scenario', () => {
      const savingsInputs: Variant1DInputs = {
        ...inputs,
        estimatedCostVariance: -10, // 10% savings
      };
      const result = calculate(savingsInputs);

      // Costs = 1,000,000 × 0.90 = 900,000
      // Profit = 1,200,000 - 900,000 = 300,000
      expect(result.developer.profit.gross).toBe(300_000);
    });
  });

  // ============================================================
  // VARIANT 1E: TIME AND MATERIALS
  // ============================================================

  describe('Variant 1E: Time and Materials', () => {
    const inputs: Variant1EInputs = {
      projectName: 'Test Project',
      variant: '1E',
      researchPhaseCost: 200_000,
      developmentPhaseCost: 800_000,
      usefulLife: 5,
      section11eType: 'pc-2yr',
      corporateTaxRate: 27,
      developerHours: 2000,
      hourlyRate: 500,
      hourlyMarkup: 25,
    };

    it('calculates revenue from hours × rate', () => {
      const result = calculate(inputs);

      // Revenue = 2000 × 500 = 1,000,000
      expect(result.developer.revenue.total).toBe(1_000_000);
    });

    it('calculates base cost (rate minus markup)', () => {
      const result = calculate(inputs);

      // Base rate = 500 / 1.25 = 400
      // Costs = 2000 × 400 = 800,000
      expect(result.developer.costs.total).toBe(800_000);
    });

    it('calculates profit correctly', () => {
      const result = calculate(inputs);

      // Profit = 1,000,000 - 800,000 = 200,000
      expect(result.developer.profit.gross).toBe(200_000);
      expect(result.developer.profit.margin).toBe(25);
    });
  });

  // ============================================================
  // VARIANT 1F: DEDICATED DEVELOPMENT TEAM
  // ============================================================

  describe('Variant 1F: Dedicated Development Team', () => {
    const inputs: Variant1FInputs = {
      projectName: 'Test Project',
      variant: '1F',
      usefulLife: 5,
      section11eType: 'pc-2yr',
      corporateTaxRate: 27,
      monthlyRetainer: 250_000,
      contractMonths: 12,
      monthlyCost: 200_000,
    };

    it('calculates total revenue from retainer × months', () => {
      const result = calculate(inputs);

      // Revenue = 250,000 × 12 = 3,000,000
      expect(result.developer.revenue.total).toBe(3_000_000);
    });

    it('calculates total costs from cost × months', () => {
      const result = calculate(inputs);

      // Costs = 200,000 × 12 = 2,400,000
      expect(result.developer.costs.total).toBe(2_400_000);
    });

    it('calculates derived margin', () => {
      const result = calculate(inputs);

      // Profit = 3,000,000 - 2,400,000 = 600,000
      // Margin = 600,000 / 2,400,000 × 100 = 25%
      expect(result.developer.profit.gross).toBe(600_000);
      expect(result.developer.profit.margin).toBe(25);
    });
  });

  // ============================================================
  // TRANSFER PRICING ASSESSMENT
  // ============================================================

  describe('Transfer Pricing Assessment', () => {
    it('classifies margin within range as low risk', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 10, // Within 5-15% range
      };
      const result = calculate(inputs);

      expect(result.transferPricing.withinRange).toBe(true);
      expect(result.transferPricing.riskLevel).toBe('low');
      expect(result.transferPricing.riskScore).toBe(90);
    });

    it('classifies margin outside range but within extended as medium risk', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 18, // Between 15-20%
      };
      const result = calculate(inputs);

      expect(result.transferPricing.withinRange).toBe(false);
      expect(result.transferPricing.riskLevel).toBe('medium');
      expect(result.transferPricing.riskScore).toBe(70);
    });

    it('classifies margin beyond extended range as high risk', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 25, // Above 20%
      };
      const result = calculate(inputs);

      expect(result.transferPricing.withinRange).toBe(false);
      expect(result.transferPricing.riskLevel).toBe('high');
      expect(result.transferPricing.riskScore).toBe(40);
    });

    it('uses cost-plus method', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 10,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.method).toBe('cost-plus');
    });

    it('provides documentation requirements', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 10,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.documentation).toContain('Written development agreement required');
      expect(result.transferPricing.documentation).toContain('Transfer pricing policy document');
    });

    it('provides recommendation for out-of-range margins', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 25,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.recommendation).toContain('10%');
    });
  });

  // ============================================================
  // SECTION 11(E) VARIANTS
  // ============================================================

  describe('Section 11(e) Tax Treatment', () => {
    it('applies 2-year write-off for PC software', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 10,
        section11eType: 'pc-2yr',
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.section11eYears).toBe(2);
      // Annual deduction = 800,000 / 2 = 400,000
      expect(result.buyer.tax.section11eDeduction).toBe(400_000);
    });

    it('applies 5-year write-off for mainframe software', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 10,
        section11eType: 'mainframe-5yr',
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.section11eYears).toBe(5);
      // Annual deduction = 800,000 / 5 = 160,000
      expect(result.buyer.tax.section11eDeduction).toBe(160_000);
    });

    it('calculates tax benefit correctly', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 10,
        section11eType: 'pc-2yr',
      };
      const result = calculate(inputs);

      // Tax benefit = Section 11(e) deduction × 27%
      expect(result.buyer.tax.taxBenefit).toBe(400_000 * 0.27);
    });
  });

  // ============================================================
  // EDGE CASES
  // ============================================================

  describe('Edge Cases', () => {
    it('handles zero development cost', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 10,
        developmentCost: 0,
        researchPhaseCost: 0,
        developmentPhaseCost: 0,
      };
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(0);
      expect(result.developer.profit.gross).toBe(0);
      expect(result.developer.profit.margin).toBe(10); // Still 10% even with zero base
    });

    it('handles very high markup (50%)', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 50,
      };
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(1_500_000);
      expect(result.developer.profit.gross).toBe(500_000);
      expect(result.transferPricing.riskLevel).toBe('high');
    });

    it('handles zero tax rate', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 10,
        corporateTaxRate: 0,
      };
      const result = calculate(inputs);

      expect(result.developer.tax.taxPayable).toBe(0);
      expect(result.developer.profit.net).toBe(100_000);
    });

    it('handles 1-year useful life', () => {
      const inputs: Variant1BInputs = {
        ...baseInputs,
        variant: '1B',
        markupPercentage: 10,
        usefulLife: 1,
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.annualAmortisation).toBe(800_000);
      expect(result.buyer.expenses.schedule).toHaveLength(1);
    });
  });

  // ============================================================
  // VARIANT DEFINITIONS
  // ============================================================

  describe('Variant Definitions', () => {
    it('has all six variants defined', () => {
      expect(Object.keys(VARIANTS)).toHaveLength(6);
      expect(VARIANTS['1A']).toBeDefined();
      expect(VARIANTS['1B']).toBeDefined();
      expect(VARIANTS['1C']).toBeDefined();
      expect(VARIANTS['1D']).toBeDefined();
      expect(VARIANTS['1E']).toBeDefined();
      expect(VARIANTS['1F']).toBeDefined();
    });

    it('has correct variant names', () => {
      expect(VARIANTS['1A'].name).toBe('Pure Cost Reimbursement');
      expect(VARIANTS['1B'].name).toBe('Cost-Plus Fixed Margin');
      expect(VARIANTS['1C'].name).toBe('Cost-Plus with Performance Bonus');
      expect(VARIANTS['1D'].name).toBe('Fixed Price Development');
      expect(VARIANTS['1E'].name).toBe('Time and Materials');
      expect(VARIANTS['1F'].name).toBe('Dedicated Development Team');
    });
  });

  // ============================================================
  // BENCHMARK RANGE
  // ============================================================

  describe('Benchmark Range', () => {
    it('has correct OECD benchmark values', () => {
      expect(BENCHMARK_RANGE.low).toBe(5);
      expect(BENCHMARK_RANGE.median).toBe(10);
      expect(BENCHMARK_RANGE.high).toBe(15);
      expect(BENCHMARK_RANGE.extremeHigh).toBe(20);
    });
  });
});
