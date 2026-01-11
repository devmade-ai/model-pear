/**
 * Tests for Model 3: Joint Development / Cost-Sharing
 *
 * These tests verify calculation logic for joint development arrangements
 * including contribution-based and benefit-based ownership splits.
 */

import { describe, it, expect } from 'vitest';
import {
  calculate,
  BENCHMARK_RANGE,
  VARIANTS,
  type Variant3AInputs,
  type Variant3BInputs,
  type Variant3CInputs,
  type Variant3DInputs,
  type Variant3EInputs,
  type Variant3FInputs,
  type Variant3GInputs,
  type Variant3HInputs,
} from '../../src/models/model-3-joint-development.js';

// ============================================================
// TEST DATA
// ============================================================

const baseInputs = {
  projectName: 'Test Joint Development',
  totalProjectCost: 1_000_000,
  researchPhaseCost: 200_000,
  developmentPhaseCost: 800_000,
  projectDurationMonths: 12,
  developerCashContribution: 200_000,
  developerPersonnelFTEs: 4,
  developerPersonnelCostPerMonth: 20_000,
  developerIPContribution: 100_000,
  developerFacilitiesContribution: 50_000,
  buyerCashContribution: 100_000,
  buyerPersonnelFTEs: 2,
  buyerPersonnelCostPerMonth: 15_000,
  buyerIPContribution: 50_000,
  buyerDomainExpertiseValue: 80_000,
  usefulLife: 5,
  section11eType: 'pc-2yr' as const,
  corporateTaxRate: 27,
};

// ============================================================
// VARIANT 3A: PROPORTIONAL COST SHARING (EQUAL)
// ============================================================

describe('Model 3: Joint Development', () => {
  describe('Variant 3A: Proportional Cost Sharing (Equal)', () => {
    const inputs: Variant3AInputs = {
      ...baseInputs,
      variant: '3A',
      ownershipSplit: 50, // 50% developer, 50% buyer
    };

    it('applies fixed ownership split regardless of contribution', () => {
      const result = calculate(inputs);

      // Developer gets 50% of development phase cost
      expect(result.developer.asset.carryingValue).toBe(400_000);
      // Buyer gets 50%
      expect(result.buyer.asset.capitalised).toBe(400_000);
    });

    it('has no revenue for developer (cost-sharing)', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(0);
    });

    it('calculates developer costs from contributions', () => {
      const result = calculate(inputs);

      // Developer cash + personnel + IP + facilities
      // 200,000 + (4 × 20,000 × 12) + 100,000 + 50,000 = 1,310,000
      expect(result.developer.costs.total).toBe(1_310_000);
    });

    it('correctly identifies variant metadata', () => {
      const result = calculate(inputs);

      expect(result.metadata.modelId).toBe('model-3');
      expect(result.metadata.variantId).toBe('3A');
      expect(result.metadata.variantName).toBe('Proportional Cost Sharing (Equal)');
    });
  });

  // ============================================================
  // VARIANT 3B: CONTRIBUTION-BASED SHARING
  // ============================================================

  describe('Variant 3B: Contribution-Based Sharing', () => {
    const inputs: Variant3BInputs = {
      ...baseInputs,
      variant: '3B',
      valuationMethod: 'cost-basis',
    };

    it('calculates ownership based on contribution ratio', () => {
      const result = calculate(inputs);

      // Developer contribution: 200,000 + (4 × 20,000 × 12) + 100,000 + 50,000 = 1,310,000
      // Buyer contribution: 100,000 + (2 × 15,000 × 12) + 50,000 + 80,000 = 590,000
      // Total: 1,900,000
      // Developer share: 1,310,000 / 1,900,000 ≈ 68.95%

      const expectedDevShare = 1_310_000 / 1_900_000;
      const expectedDevCapitalised = 800_000 * expectedDevShare;

      expect(result.developer.asset.carryingValue).toBeCloseTo(expectedDevCapitalised, 0);
    });

    it('buyer receives proportional share', () => {
      const result = calculate(inputs);

      const buyerShare = 590_000 / 1_900_000;
      const expectedBuyerCapitalised = 800_000 * buyerShare;

      expect(result.buyer.asset.capitalised).toBeCloseTo(expectedBuyerCapitalised, 0);
    });
  });

  // ============================================================
  // VARIANT 3C: BENEFIT-BASED SHARING
  // ============================================================

  describe('Variant 3C: Benefit-Based Sharing', () => {
    const inputs: Variant3CInputs = {
      ...baseInputs,
      variant: '3C',
      developerAnticipatedBenefit: 3_000_000,
      buyerAnticipatedBenefit: 2_000_000,
    };

    it('calculates ownership based on anticipated benefits', () => {
      const result = calculate(inputs);

      // Developer benefit share: 3,000,000 / 5,000,000 = 60%
      // Expected capitalised: 800,000 × 60% = 480,000
      expect(result.developer.asset.carryingValue).toBeCloseTo(480_000, 0);
    });

    it('buyer receives proportional share of benefits', () => {
      const result = calculate(inputs);

      // Buyer benefit share: 2,000,000 / 5,000,000 = 40%
      // Expected capitalised: 800,000 × 40% = 320,000
      expect(result.buyer.asset.capitalised).toBeCloseTo(320_000, 0);
    });
  });

  // ============================================================
  // VARIANT 3D: USAGE RIGHTS SPLIT
  // ============================================================

  describe('Variant 3D: Usage Rights Split', () => {
    const inputs: Variant3DInputs = {
      ...baseInputs,
      variant: '3D',
      developerUsageRights: 70,
      buyerUsageRights: 30,
    };

    it('defaults to contribution-based ownership', () => {
      const result = calculate(inputs);

      // Usage rights don't affect capitalisation calculation in current impl
      // Falls back to contribution-based
      expect(result.developer.asset.carryingValue).toBeGreaterThan(0);
      expect(result.buyer.asset.capitalised).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // VARIANT 3E: PLATFORM + DERIVATIVES
  // ============================================================

  describe('Variant 3E: Platform + Derivatives', () => {
    const inputs: Variant3EInputs = {
      ...baseInputs,
      variant: '3E',
      platformOwnership: 'developer',
      derivativeWorksSplit: 50,
    };

    it('calculates using contribution-based approach', () => {
      const result = calculate(inputs);

      expect(result.developer.asset.carryingValue).toBeGreaterThan(0);
      expect(result.buyer.asset.capitalised).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // VARIANT 3F: BUY-IN ARRANGEMENT
  // ============================================================

  describe('Variant 3F: Buy-In Arrangement', () => {
    const inputs: Variant3FInputs = {
      ...baseInputs,
      variant: '3F',
      buyInPayment: 200_000,
      buyInTiming: 'upfront',
    };

    it('uses contribution-based ownership calculation', () => {
      const result = calculate(inputs);

      expect(result.developer.asset.carryingValue).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // VARIANT 3G: TERMINATION PROVISIONS
  // ============================================================

  describe('Variant 3G: Termination Provisions', () => {
    const inputs: Variant3GInputs = {
      ...baseInputs,
      variant: '3G',
      terminationTrigger: 'budget-overrun',
      terminationCompensation: 75,
    };

    it('calculates normally with termination provisions', () => {
      const result = calculate(inputs);

      expect(result.developer.asset.carryingValue).toBeGreaterThan(0);
      expect(result.buyer.asset.capitalised).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // VARIANT 3H: CROSS-BORDER JOINT DEVELOPMENT
  // ============================================================

  describe('Variant 3H: Cross-Border Joint Development', () => {
    const inputs: Variant3HInputs = {
      ...baseInputs,
      variant: '3H',
      governingLaw: 'south-africa',
      disputeResolution: 'arbitration',
    };

    it('calculates normally for cross-border arrangement', () => {
      const result = calculate(inputs);

      expect(result.developer.asset.carryingValue).toBeGreaterThan(0);
      expect(result.buyer.asset.capitalised).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // TRANSFER PRICING ASSESSMENT
  // ============================================================

  describe('Transfer Pricing Assessment', () => {
    it('uses cost-contribution method', () => {
      const inputs: Variant3AInputs = {
        ...baseInputs,
        variant: '3A',
        ownershipSplit: 50,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.method).toBe('cost-contribution');
    });

    it('classifies cost-sharing as low TP risk', () => {
      const inputs: Variant3BInputs = {
        ...baseInputs,
        variant: '3B',
        valuationMethod: 'cost-basis',
      };
      const result = calculate(inputs);

      expect(result.transferPricing.withinRange).toBe(true);
      expect(result.transferPricing.riskLevel).toBe('low');
      expect(result.transferPricing.riskScore).toBe(90);
    });

    it('has zero margin for cost-sharing arrangements', () => {
      const inputs: Variant3AInputs = {
        ...baseInputs,
        variant: '3A',
        ownershipSplit: 50,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.margin).toBe(0);
    });

    it('provides documentation requirements', () => {
      const inputs: Variant3AInputs = {
        ...baseInputs,
        variant: '3A',
        ownershipSplit: 50,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.documentation).toContain('Cost contribution arrangement (CCA) agreement');
      expect(result.transferPricing.documentation).toContain('Anticipated benefits analysis');
    });
  });

  // ============================================================
  // SECTION 11(E) TAX TREATMENT
  // ============================================================

  describe('Section 11(e) Tax Treatment', () => {
    it('applies 2-year write-off for PC software', () => {
      const inputs: Variant3AInputs = {
        ...baseInputs,
        variant: '3A',
        ownershipSplit: 50,
        section11eType: 'pc-2yr',
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.section11eYears).toBe(2);
    });

    it('applies 5-year write-off for mainframe software', () => {
      const inputs: Variant3AInputs = {
        ...baseInputs,
        variant: '3A',
        ownershipSplit: 50,
        section11eType: 'mainframe-5yr',
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.section11eYears).toBe(5);
    });

    it('calculates buyer tax benefit correctly', () => {
      const inputs: Variant3AInputs = {
        ...baseInputs,
        variant: '3A',
        ownershipSplit: 50,
        section11eType: 'pc-2yr',
      };
      const result = calculate(inputs);

      // Buyer capitalised = 400,000
      // Annual deduction = 400,000 / 2 = 200,000
      // Tax benefit = 200,000 × 27% = 54,000
      expect(result.buyer.tax.section11eDeduction).toBe(200_000);
      expect(result.buyer.tax.taxBenefit).toBeCloseTo(54_000, 2);
    });
  });

  // ============================================================
  // AMORTISATION SCHEDULE
  // ============================================================

  describe('Amortisation Schedule', () => {
    it('generates correct schedule for buyer', () => {
      const inputs: Variant3AInputs = {
        ...baseInputs,
        variant: '3A',
        ownershipSplit: 50,
        usefulLife: 5,
      };
      const result = calculate(inputs);
      const schedule = result.buyer.expenses.schedule;

      expect(schedule).toHaveLength(5);

      // Year 1
      expect(schedule[0].year).toBe(1);
      expect(schedule[0].openingBalance).toBe(400_000);
      expect(schedule[0].amortisation).toBe(80_000);
      expect(schedule[0].closingBalance).toBe(320_000);

      // Year 5
      expect(schedule[4].closingBalance).toBe(0);
    });
  });

  // ============================================================
  // EDGE CASES
  // ============================================================

  describe('Edge Cases', () => {
    it('handles equal contributions', () => {
      const equalInputs: Variant3BInputs = {
        projectName: 'Equal Test',
        totalProjectCost: 1_000_000,
        researchPhaseCost: 200_000,
        developmentPhaseCost: 800_000,
        projectDurationMonths: 12,
        developerCashContribution: 250_000,
        developerPersonnelFTEs: 2,
        developerPersonnelCostPerMonth: 10_000,
        developerIPContribution: 0,
        developerFacilitiesContribution: 10_000,
        buyerCashContribution: 250_000,
        buyerPersonnelFTEs: 2,
        buyerPersonnelCostPerMonth: 10_000,
        buyerIPContribution: 0,
        buyerDomainExpertiseValue: 10_000,
        usefulLife: 5,
        section11eType: 'pc-2yr',
        corporateTaxRate: 27,
        variant: '3B',
        valuationMethod: 'cost-basis',
      };
      const result = calculate(equalInputs);

      // Both should get equal shares when contributions are equal
      expect(result.developer.asset.carryingValue).toBe(result.buyer.asset.capitalised);
    });

    it('handles zero buyer contribution', () => {
      const zeroInputs: Variant3BInputs = {
        ...baseInputs,
        variant: '3B',
        valuationMethod: 'cost-basis',
        buyerCashContribution: 0,
        buyerPersonnelFTEs: 0,
        buyerIPContribution: 0,
        buyerDomainExpertiseValue: 0,
      };
      const result = calculate(zeroInputs);

      // Developer should get 100%
      expect(result.developer.asset.carryingValue).toBe(800_000);
      expect(result.buyer.asset.capitalised).toBe(0);
    });

    it('handles 100% ownership split', () => {
      const fullOwnershipInputs: Variant3AInputs = {
        ...baseInputs,
        variant: '3A',
        ownershipSplit: 100,
      };
      const result = calculate(fullOwnershipInputs);

      expect(result.developer.asset.carryingValue).toBe(800_000);
      expect(result.buyer.asset.capitalised).toBe(0);
    });

    it('handles 0% ownership split', () => {
      const noOwnershipInputs: Variant3AInputs = {
        ...baseInputs,
        variant: '3A',
        ownershipSplit: 0,
      };
      const result = calculate(noOwnershipInputs);

      expect(result.developer.asset.carryingValue).toBe(0);
      expect(result.buyer.asset.capitalised).toBe(800_000);
    });
  });

  // ============================================================
  // VARIANT DEFINITIONS
  // ============================================================

  describe('Variant Definitions', () => {
    it('has all eight variants defined', () => {
      expect(Object.keys(VARIANTS)).toHaveLength(8);
      expect(VARIANTS['3A']).toBeDefined();
      expect(VARIANTS['3B']).toBeDefined();
      expect(VARIANTS['3C']).toBeDefined();
      expect(VARIANTS['3D']).toBeDefined();
      expect(VARIANTS['3E']).toBeDefined();
      expect(VARIANTS['3F']).toBeDefined();
      expect(VARIANTS['3G']).toBeDefined();
      expect(VARIANTS['3H']).toBeDefined();
    });

    it('has correct variant names', () => {
      expect(VARIANTS['3A'].name).toBe('Proportional Cost Sharing (Equal)');
      expect(VARIANTS['3B'].name).toBe('Contribution-Based Sharing');
      expect(VARIANTS['3C'].name).toBe('Benefit-Based Sharing');
      expect(VARIANTS['3D'].name).toBe('Usage Rights Split');
      expect(VARIANTS['3E'].name).toBe('Platform + Derivatives');
      expect(VARIANTS['3F'].name).toBe('Buy-In Arrangement');
      expect(VARIANTS['3G'].name).toBe('Termination Provisions');
      expect(VARIANTS['3H'].name).toBe('Cross-Border Joint Development');
    });
  });

  // ============================================================
  // BENCHMARK RANGE
  // ============================================================

  describe('Benchmark Range', () => {
    it('has correct cost-sharing benchmark values', () => {
      expect(BENCHMARK_RANGE.low).toBe(-5);
      expect(BENCHMARK_RANGE.median).toBe(0);
      expect(BENCHMARK_RANGE.high).toBe(5);
      expect(BENCHMARK_RANGE.extremeHigh).toBe(10);
    });
  });
});
