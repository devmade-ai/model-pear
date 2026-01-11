/**
 * Tests for Model 2: Software Licence with Royalties
 *
 * These tests verify the calculation logic for licence and royalty arrangements
 * including perpetual/term licences, usage-based pricing, and revenue sharing.
 */

import { describe, it, expect } from 'vitest';
import {
  calculate,
  BENCHMARK_RANGE,
  VARIANTS,
  type Variant2AInputs,
  type Variant2BInputs,
  type Variant2CInputs,
  type Variant2DInputs,
  type Variant2EInputs,
  type Variant2FInputs,
  type Variant2GInputs,
  type Variant2HInputs,
} from '../../src/models/model-2-licence.js';

// ============================================================
// TEST DATA
// ============================================================

const baseInputs = {
  projectName: 'Test Licence',
  developmentCost: 1_000_000,
  researchPhaseCost: 200_000,
  developmentPhaseCost: 800_000,
  developerUsefulLife: 10,
  licenceType: 'perpetual' as const,
  licenceTerm: 5,
  exclusivity: 'non-exclusive' as const,
  territory: 'south-africa' as const,
  sourceCodeAccess: 'none' as const,
  buyerUsefulLife: 5,
  implementationCosts: 50_000,
  section11eType: 'pc-2yr' as const,
  corporateTaxRate: 27,
};

// ============================================================
// VARIANT 2A: PERPETUAL LICENCE (UPFRONT PAYMENT)
// ============================================================

describe('Model 2: Software Licence', () => {
  describe('Variant 2A: Perpetual Licence (Upfront Payment)', () => {
    const inputs: Variant2AInputs = {
      ...baseInputs,
      variant: '2A',
      upfrontLicenceFee: 500_000,
    };

    it('calculates developer revenue from upfront fee', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(500_000);
      expect(result.developer.revenue.breakdown.licence).toBe(500_000);
      expect(result.developer.revenue.breakdown.royalties).toBe(0);
    });

    it('calculates buyer total cost including implementation', () => {
      const result = calculate(inputs);

      // Total = Licence fee + Implementation costs
      expect(result.buyer.totalCost).toBe(550_000);
    });

    it('capitalises full licence fee and implementation', () => {
      const result = calculate(inputs);

      // Capitalised = Licence + Implementation
      expect(result.buyer.asset.capitalised).toBe(550_000);
      expect(result.buyer.asset.expensed).toBe(0);
    });

    it('calculates annual amortisation over useful life', () => {
      const result = calculate(inputs);

      // Amortisation = 550,000 / 5 years = 110,000
      expect(result.buyer.asset.annualAmortisation).toBe(110_000);
    });

    it('developer retains and recognises intangible asset', () => {
      const result = calculate(inputs);

      expect(result.developer.asset.recognised).toBe(true);
      expect(result.developer.asset.carryingValue).toBe(800_000);
      expect(result.developer.asset.reason).toContain('IAS 38');
    });

    it('uses point-in-time revenue recognition', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.recognitionTiming).toBe('point-in-time');
      expect(result.developer.revenue.recognitionBasis).toContain('point in time');
    });

    it('correctly identifies variant metadata', () => {
      const result = calculate(inputs);

      expect(result.metadata.modelId).toBe('model-2');
      expect(result.metadata.variantId).toBe('2A');
      expect(result.metadata.variantName).toBe('Perpetual Licence (Upfront Payment)');
    });
  });

  // ============================================================
  // VARIANT 2B: TERM LICENCE (ANNUAL/MULTI-YEAR)
  // ============================================================

  describe('Variant 2B: Term Licence (Annual/Multi-Year)', () => {
    const inputs: Variant2BInputs = {
      ...baseInputs,
      variant: '2B',
      licenceType: 'term',
      licenceTerm: 3,
      annualLicenceFee: 200_000,
      renewalExpected: 'yes',
    };

    it('calculates total revenue over licence term', () => {
      const result = calculate(inputs);

      // Total = 200,000 × 3 years = 600,000
      expect(result.developer.revenue.total).toBe(600_000);
    });

    it('capitalises first year fee plus implementation', () => {
      const result = calculate(inputs);

      // Capitalised = Year 1 fee + implementation = 200,000 + 50,000
      expect(result.buyer.asset.capitalised).toBe(250_000);
    });

    it('expenses subsequent licence fees', () => {
      const result = calculate(inputs);

      // Expensed = Years 2-3 = 200,000 × 2 = 400,000
      expect(result.buyer.asset.expensed).toBe(400_000);
    });

    it('uses over-time recognition when renewal not expected', () => {
      const noRenewalInputs: Variant2BInputs = {
        ...inputs,
        renewalExpected: 'no',
      };
      const result = calculate(noRenewalInputs);

      expect(result.developer.revenue.recognitionTiming).toBe('over-time');
      expect(result.developer.revenue.recognitionBasis).toContain('right to access');
    });
  });

  // ============================================================
  // VARIANT 2C: USAGE-BASED ROYALTIES
  // ============================================================

  describe('Variant 2C: Usage-Based Royalties', () => {
    const inputs: Variant2CInputs = {
      ...baseInputs,
      variant: '2C',
      licenceType: 'term',
      licenceTerm: 3,
      royaltyRate: 10,
      usageMetric: 'transactions',
      estimatedAnnualUsage: 100_000,
      usageUnitValue: 10,
    };

    it('calculates annual royalty correctly', () => {
      const result = calculate(inputs);

      // Annual royalty = 100,000 × 10 × 10% = 100,000
      // Total over 3 years = 300,000
      expect(result.developer.revenue.total).toBe(300_000);
      expect(result.developer.revenue.breakdown.royalties).toBe(300_000);
    });

    it('expenses royalties (not capitalised)', () => {
      const result = calculate(inputs);

      // Only implementation is capitalised
      expect(result.buyer.asset.capitalised).toBe(50_000);
      expect(result.buyer.asset.expensed).toBe(300_000);
    });

    it('uses over-time revenue recognition (royalty exception)', () => {
      const result = calculate(inputs);

      expect(result.developer.revenue.recognitionTiming).toBe('over-time');
      expect(result.developer.revenue.recognitionBasis).toContain('royalty exception');
    });

    it('assesses transfer pricing based on royalty rate', () => {
      const result = calculate(inputs);

      expect(result.transferPricing.method).toBe('royalty-rate');
      expect(result.transferPricing.margin).toBe(10);
      expect(result.transferPricing.withinRange).toBe(true);
      expect(result.transferPricing.riskLevel).toBe('low');
    });

    it('flags high royalty rate as medium risk', () => {
      const highRateInputs: Variant2CInputs = {
        ...inputs,
        royaltyRate: 30, // Above 25% high benchmark
      };
      const result = calculate(highRateInputs);

      expect(result.transferPricing.withinRange).toBe(false);
      expect(result.transferPricing.riskLevel).toBe('medium');
    });

    it('flags extreme royalty rate as high risk', () => {
      const extremeRateInputs: Variant2CInputs = {
        ...inputs,
        royaltyRate: 40, // Above 35% extreme high
      };
      const result = calculate(extremeRateInputs);

      expect(result.transferPricing.riskLevel).toBe('high');
    });
  });

  // ============================================================
  // VARIANT 2D: MINIMUM GUARANTEE PLUS ROYALTIES
  // ============================================================

  describe('Variant 2D: Minimum Guarantee Plus Royalties', () => {
    const inputs: Variant2DInputs = {
      ...baseInputs,
      variant: '2D',
      licenceType: 'term',
      licenceTerm: 3,
      minimumAnnualGuarantee: 100_000,
      royaltyRate: 5,
      usageThreshold: 50_000,
      estimatedAnnualUsage: 100_000,
      usageUnitValue: 10,
    };

    it('calculates minimum guarantee + excess royalties', () => {
      const result = calculate(inputs);

      // Excess usage = 100,000 - 50,000 = 50,000
      // Variable royalty = 50,000 × 10 × 5% = 25,000 per year
      // Annual payment = 100,000 + 25,000 = 125,000
      // Total over 3 years = 375,000
      expect(result.developer.revenue.total).toBe(375_000);
    });

    it('handles usage below threshold (minimum only)', () => {
      const lowUsageInputs: Variant2DInputs = {
        ...inputs,
        estimatedAnnualUsage: 40_000, // Below 50,000 threshold
      };
      const result = calculate(lowUsageInputs);

      // No excess, just minimum
      // Total = 100,000 × 3 = 300,000
      expect(result.developer.revenue.total).toBe(300_000);
    });
  });

  // ============================================================
  // VARIANT 2E: REVENUE SHARE / PROFIT SHARE
  // ============================================================

  describe('Variant 2E: Revenue Share / Profit Share', () => {
    const inputs: Variant2EInputs = {
      ...baseInputs,
      variant: '2E',
      licenceType: 'term',
      licenceTerm: 3,
      sharePercentage: 15,
      shareBasis: 'gross-revenue',
      estimatedAnnualBuyerRevenue: 1_000_000,
      buyerGrossMargin: 40,
    };

    it('calculates gross revenue share', () => {
      const result = calculate(inputs);

      // Annual share = 1,000,000 × 15% = 150,000
      // Total over 3 years = 450,000
      expect(result.developer.revenue.total).toBe(450_000);
    });

    it('calculates gross profit share correctly', () => {
      const grossProfitInputs: Variant2EInputs = {
        ...inputs,
        shareBasis: 'gross-profit',
      };
      const result = calculate(grossProfitInputs);

      // Gross profit = 1,000,000 × 40% = 400,000
      // Annual share = 400,000 × 15% = 60,000
      // Total = 60,000 × 3 = 180,000
      expect(result.developer.revenue.total).toBe(180_000);
    });

    it('calculates net profit share correctly', () => {
      const netProfitInputs: Variant2EInputs = {
        ...inputs,
        shareBasis: 'net-profit',
      };
      const result = calculate(netProfitInputs);

      // Net profit proxy = 1,000,000 × 40% × 70% = 280,000
      // Annual share = 280,000 × 15% = 42,000
      // Total = 42,000 × 3 = 126,000
      expect(result.developer.revenue.total).toBe(126_000);
    });

    it('calculates net revenue share correctly', () => {
      const netRevenueInputs: Variant2EInputs = {
        ...inputs,
        shareBasis: 'net-revenue',
      };
      const result = calculate(netRevenueInputs);

      // Net revenue = 1,000,000 × 90% = 900,000
      // Annual share = 900,000 × 15% = 135,000
      // Total = 135,000 × 3 = 405,000
      expect(result.developer.revenue.total).toBe(405_000);
    });
  });

  // ============================================================
  // VARIANT 2F: WHITE-LABEL / RESELLER LICENCE
  // ============================================================

  describe('Variant 2F: White-Label / Reseller Licence', () => {
    const inputs: Variant2FInputs = {
      ...baseInputs,
      variant: '2F',
      licenceType: 'term',
      licenceTerm: 3,
      distributionFee: 100_000,
      perSaleRoyalty: 10,
      estimatedEndCustomerSales: 500,
      endCustomerPricePoint: 2_000,
    };

    it('calculates distribution fee + ongoing royalties', () => {
      const result = calculate(inputs);

      // Annual royalties = 500 × 2,000 × 10% = 100,000
      // Total royalties = 100,000 × 3 = 300,000
      // Total revenue = 100,000 + 300,000 = 400,000
      expect(result.developer.revenue.total).toBe(400_000);
      expect(result.developer.revenue.breakdown.licence).toBe(100_000); // Distribution fee
      expect(result.developer.revenue.breakdown.royalties).toBe(300_000);
    });

    it('capitalises distribution fee and implementation', () => {
      const result = calculate(inputs);

      expect(result.buyer.asset.capitalised).toBe(150_000); // 100k + 50k impl
    });
  });

  // ============================================================
  // VARIANT 2G: EXCLUSIVE VS NON-EXCLUSIVE LICENCE
  // ============================================================

  describe('Variant 2G: Exclusive vs Non-Exclusive Licence', () => {
    const inputs: Variant2GInputs = {
      ...baseInputs,
      variant: '2G',
      baseLicenceFee: 300_000,
      exclusivityPremium: 50,
      estimatedOtherLicensees: 5,
    };

    it('applies exclusivity premium for exclusive licence', () => {
      const exclusiveInputs: Variant2GInputs = {
        ...inputs,
        exclusivity: 'exclusive',
      };
      const result = calculate(exclusiveInputs);

      // Exclusive fee = 300,000 × (1 + 50%) = 450,000
      expect(result.developer.revenue.total).toBe(450_000);
    });

    it('uses base fee for non-exclusive licence', () => {
      const nonExclusiveInputs: Variant2GInputs = {
        ...inputs,
        exclusivity: 'non-exclusive',
      };
      const result = calculate(nonExclusiveInputs);

      expect(result.developer.revenue.total).toBe(300_000);
    });
  });

  // ============================================================
  // VARIANT 2H: SOURCE CODE LICENCE / ESCROW
  // ============================================================

  describe('Variant 2H: Source Code Licence / Escrow', () => {
    const inputs: Variant2HInputs = {
      ...baseInputs,
      variant: '2H',
      baseLicenceFee: 400_000,
      sourceCodeFee: 200_000,
      escrowSetupFee: 10_000,
      escrowAnnualFee: 5_000,
      escrowTriggersDefined: 'yes',
    };

    it('includes source code fee when access is full', () => {
      const fullAccessInputs: Variant2HInputs = {
        ...inputs,
        sourceCodeAccess: 'full',
      };
      const result = calculate(fullAccessInputs);

      // Total = Base + Source code fee = 400,000 + 200,000 = 600,000
      expect(result.developer.revenue.total).toBe(600_000);
    });

    it('includes escrow fees when access is escrow', () => {
      const escrowInputs: Variant2HInputs = {
        ...inputs,
        sourceCodeAccess: 'escrow',
        buyerUsefulLife: 5,
      };
      const result = calculate(escrowInputs);

      // Upfront = Base + Escrow setup = 400,000 + 10,000 = 410,000
      // Annual escrow = 5,000 × 5 years = 25,000
      // Total = 435,000
      expect(result.developer.revenue.total).toBe(435_000);
    });

    it('uses base fee only when no source code access', () => {
      const noAccessInputs: Variant2HInputs = {
        ...inputs,
        sourceCodeAccess: 'none',
      };
      const result = calculate(noAccessInputs);

      expect(result.developer.revenue.total).toBe(400_000);
    });
  });

  // ============================================================
  // TRANSFER PRICING ASSESSMENT
  // ============================================================

  describe('Transfer Pricing Assessment', () => {
    it('uses CUP method for upfront licences', () => {
      const inputs: Variant2AInputs = {
        ...baseInputs,
        variant: '2A',
        upfrontLicenceFee: 500_000,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.method).toBe('CUP');
    });

    it('uses royalty-rate method for usage-based', () => {
      const inputs: Variant2CInputs = {
        ...baseInputs,
        variant: '2C',
        licenceType: 'term',
        licenceTerm: 3,
        royaltyRate: 10,
        usageMetric: 'transactions',
        estimatedAnnualUsage: 100_000,
        usageUnitValue: 10,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.method).toBe('royalty-rate');
    });

    it('classifies licence within implied return range as low risk', () => {
      const inputs: Variant2AInputs = {
        ...baseInputs,
        variant: '2A',
        upfrontLicenceFee: 1_200_000, // 150% of dev cost
      };
      const result = calculate(inputs);

      expect(result.transferPricing.withinRange).toBe(true);
      expect(result.transferPricing.riskLevel).toBe('low');
    });

    it('provides documentation requirements', () => {
      const inputs: Variant2AInputs = {
        ...baseInputs,
        variant: '2A',
        upfrontLicenceFee: 500_000,
      };
      const result = calculate(inputs);

      expect(result.transferPricing.documentation).toContain('Written licence agreement with clear terms');
      expect(result.transferPricing.documentation).toContain('Transfer pricing policy document');
      expect(result.transferPricing.documentation).toContain('Independent software valuation');
    });
  });

  // ============================================================
  // SECTION 11(E) TAX TREATMENT
  // ============================================================

  describe('Section 11(e) Tax Treatment', () => {
    it('applies 2-year write-off for PC software', () => {
      const inputs: Variant2AInputs = {
        ...baseInputs,
        variant: '2A',
        upfrontLicenceFee: 500_000,
        section11eType: 'pc-2yr',
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.section11eYears).toBe(2);
      // Capitalised = 550,000, annual deduction = 550,000 / 2 = 275,000
      expect(result.buyer.tax.section11eDeduction).toBe(275_000);
    });

    it('applies 5-year write-off for mainframe software', () => {
      const inputs: Variant2AInputs = {
        ...baseInputs,
        variant: '2A',
        upfrontLicenceFee: 500_000,
        section11eType: 'mainframe-5yr',
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.section11eYears).toBe(5);
      // Annual deduction = 550,000 / 5 = 110,000
      expect(result.buyer.tax.section11eDeduction).toBe(110_000);
    });

    it('calculates timing difference correctly', () => {
      const inputs: Variant2AInputs = {
        ...baseInputs,
        variant: '2A',
        upfrontLicenceFee: 500_000,
        buyerUsefulLife: 5,
        section11eType: 'pc-2yr',
      };
      const result = calculate(inputs);

      // Accounting amortisation = 550,000 / 5 = 110,000
      // Tax depreciation = 550,000 / 2 = 275,000
      // Timing difference = 110,000 - 275,000 = -165,000
      expect(result.buyer.tax.timingDifference).toBe(-165_000);
    });
  });

  // ============================================================
  // AMORTISATION SCHEDULE
  // ============================================================

  describe('Amortisation Schedule', () => {
    it('generates correct schedule for buyer', () => {
      const inputs: Variant2AInputs = {
        ...baseInputs,
        variant: '2A',
        upfrontLicenceFee: 500_000,
        buyerUsefulLife: 5,
      };
      const result = calculate(inputs);
      const schedule = result.buyer.expenses.schedule;

      expect(schedule).toHaveLength(5);

      // Year 1
      expect(schedule[0].year).toBe(1);
      expect(schedule[0].openingBalance).toBe(550_000);
      expect(schedule[0].amortisation).toBe(110_000);
      expect(schedule[0].closingBalance).toBe(440_000);

      // Year 5
      expect(schedule[4].year).toBe(5);
      expect(schedule[4].closingBalance).toBe(0);
    });
  });

  // ============================================================
  // EDGE CASES
  // ============================================================

  describe('Edge Cases', () => {
    it('handles zero implementation costs', () => {
      const inputs: Variant2AInputs = {
        ...baseInputs,
        variant: '2A',
        upfrontLicenceFee: 500_000,
        implementationCosts: 0,
      };
      const result = calculate(inputs);

      expect(result.buyer.asset.capitalised).toBe(500_000);
      expect(result.buyer.totalCost).toBe(500_000);
    });

    it('handles perpetual licence (uses buyer useful life)', () => {
      const inputs: Variant2AInputs = {
        ...baseInputs,
        variant: '2A',
        licenceType: 'perpetual',
        buyerUsefulLife: 10,
        upfrontLicenceFee: 500_000,
      };
      const result = calculate(inputs);

      // Should use buyerUsefulLife for perpetual licences
      expect(result.buyer.expenses.schedule).toHaveLength(10);
    });

    it('handles term licence shorter than useful life', () => {
      const inputs: Variant2BInputs = {
        ...baseInputs,
        variant: '2B',
        licenceType: 'term',
        licenceTerm: 3,
        buyerUsefulLife: 10,
        annualLicenceFee: 100_000,
        renewalExpected: 'yes',
      };
      const result = calculate(inputs);

      // Term is 3 years, should use min(3, 10) = 3
      expect(result.buyer.asset.usefulLife).toBe(3);
    });

    it('handles zero usage (usage-based royalties)', () => {
      const inputs: Variant2CInputs = {
        ...baseInputs,
        variant: '2C',
        licenceType: 'term',
        licenceTerm: 3,
        royaltyRate: 10,
        usageMetric: 'transactions',
        estimatedAnnualUsage: 0,
        usageUnitValue: 10,
      };
      const result = calculate(inputs);

      expect(result.developer.revenue.total).toBe(0);
    });

    it('handles zero tax rate', () => {
      const inputs: Variant2AInputs = {
        ...baseInputs,
        variant: '2A',
        upfrontLicenceFee: 500_000,
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
      expect(VARIANTS['2A']).toBeDefined();
      expect(VARIANTS['2B']).toBeDefined();
      expect(VARIANTS['2C']).toBeDefined();
      expect(VARIANTS['2D']).toBeDefined();
      expect(VARIANTS['2E']).toBeDefined();
      expect(VARIANTS['2F']).toBeDefined();
      expect(VARIANTS['2G']).toBeDefined();
      expect(VARIANTS['2H']).toBeDefined();
    });

    it('has correct variant names', () => {
      expect(VARIANTS['2A'].name).toBe('Perpetual Licence (Upfront Payment)');
      expect(VARIANTS['2B'].name).toBe('Term Licence (Annual/Multi-Year)');
      expect(VARIANTS['2C'].name).toBe('Usage-Based Royalties');
      expect(VARIANTS['2D'].name).toBe('Minimum Guarantee Plus Royalties');
      expect(VARIANTS['2E'].name).toBe('Revenue Share / Profit Share');
      expect(VARIANTS['2F'].name).toBe('White-Label / Reseller Licence');
      expect(VARIANTS['2G'].name).toBe('Exclusive vs Non-Exclusive Licence');
      expect(VARIANTS['2H'].name).toBe('Source Code Licence / Escrow');
    });
  });

  // ============================================================
  // BENCHMARK RANGE
  // ============================================================

  describe('Benchmark Range', () => {
    it('has correct royalty rate benchmark values', () => {
      expect(BENCHMARK_RANGE.low).toBe(1);
      expect(BENCHMARK_RANGE.median).toBe(10);
      expect(BENCHMARK_RANGE.high).toBe(25);
      expect(BENCHMARK_RANGE.extremeHigh).toBe(35);
    });
  });
});
