/**
 * Tests for financial projection calculations
 *
 * These tests verify NPV, IRR, payback period, and other
 * financial metrics calculations.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateNPV,
  calculatePresentValue,
  calculateFutureValue,
  calculateIRR,
  calculateMIRR,
  calculatePaybackPeriod,
  calculateDiscountedPaybackPeriod,
  calculateProfitabilityIndex,
  calculateROI,
  calculateAnnualizedROI,
  assessInvestment,
  generateGrowingCashFlows,
  calculateCumulativeCashFlows,
  discountCashFlows,
} from '../../src/projections/calculations.js';

// ============================================================
// NPV CALCULATIONS
// ============================================================

describe('NPV Calculations', () => {
  describe('calculateNPV', () => {
    it('calculates NPV for simple cash flows', () => {
      // Initial investment -1000, followed by 400 per year for 3 years
      const cashFlows = [-1000, 400, 400, 400];
      const discountRate = 10;

      // NPV = -1000 + 400/1.1 + 400/1.21 + 400/1.331
      // = -1000 + 363.64 + 330.58 + 300.53 ≈ -5.25
      const npv = calculateNPV(cashFlows, discountRate);

      expect(npv).toBeCloseTo(-5.26, 0);
    });

    it('returns positive NPV for profitable investment', () => {
      const cashFlows = [-1000, 500, 500, 500];
      const discountRate = 10;

      const npv = calculateNPV(cashFlows, discountRate);

      expect(npv).toBeGreaterThan(0);
    });

    it('returns negative NPV for unprofitable investment', () => {
      const cashFlows = [-1000, 200, 200, 200];
      const discountRate = 10;

      const npv = calculateNPV(cashFlows, discountRate);

      expect(npv).toBeLessThan(0);
    });

    it('handles zero discount rate', () => {
      const cashFlows = [-1000, 400, 400, 400];
      const discountRate = 0;

      // NPV = sum of all cash flows
      const npv = calculateNPV(cashFlows, discountRate);

      expect(npv).toBe(200);
    });

    it('handles single cash flow', () => {
      const cashFlows = [1000];
      const discountRate = 10;

      // Year 0 is not discounted
      const npv = calculateNPV(cashFlows, discountRate);

      expect(npv).toBe(1000);
    });
  });

  describe('calculatePresentValue', () => {
    it('discounts future value to present', () => {
      const futureValue = 1000;
      const discountRate = 10;
      const years = 3;

      // PV = 1000 / (1.1)^3 = 751.31
      const pv = calculatePresentValue(futureValue, discountRate, years);

      expect(pv).toBeCloseTo(751.31, 1);
    });

    it('returns same value for year 0', () => {
      const pv = calculatePresentValue(1000, 10, 0);

      expect(pv).toBe(1000);
    });
  });

  describe('calculateFutureValue', () => {
    it('compounds present value to future', () => {
      const presentValue = 1000;
      const growthRate = 10;
      const years = 3;

      // FV = 1000 × (1.1)^3 = 1331
      const fv = calculateFutureValue(presentValue, growthRate, years);

      expect(fv).toBeCloseTo(1331, 0);
    });

    it('returns same value for year 0', () => {
      const fv = calculateFutureValue(1000, 10, 0);

      expect(fv).toBe(1000);
    });
  });
});

// ============================================================
// IRR CALCULATIONS
// ============================================================

describe('IRR Calculations', () => {
  describe('calculateIRR', () => {
    it('calculates IRR for typical investment', () => {
      // Investment with 20% return
      const cashFlows = [-1000, 300, 300, 300, 300, 300];
      const irr = calculateIRR(cashFlows);

      // Should be approximately 15.2%
      expect(irr).toBeCloseTo(15.2, 0);
    });

    it('returns higher IRR for more profitable investment', () => {
      const cashFlows = [-1000, 600, 600, 600];
      const irr = calculateIRR(cashFlows);

      // Should be around 36%
      expect(irr).toBeCloseTo(36.3, 0);
    });

    it('returns null when no sign change in cash flows', () => {
      const allPositive = [100, 200, 300];
      const allNegative = [-100, -200, -300];

      expect(calculateIRR(allPositive)).toBeNull();
      expect(calculateIRR(allNegative)).toBeNull();
    });

    it('handles break-even investment (IRR ≈ 0)', () => {
      const cashFlows = [-1000, 1000];
      const irr = calculateIRR(cashFlows);

      expect(irr).toBeCloseTo(0, 1);
    });

    it('handles negative IRR', () => {
      const cashFlows = [-1000, 200, 200, 200];
      const irr = calculateIRR(cashFlows);

      // Total return is 600 on 1000 investment over 3 years - negative IRR
      expect(irr).toBeLessThan(0);
    });
  });

  describe('calculateMIRR', () => {
    it('calculates MIRR with reinvestment rate', () => {
      const cashFlows = [-1000, 300, 300, 300, 300, 300];
      const financeRate = 10;
      const reinvestRate = 12;

      const mirr = calculateMIRR(cashFlows, financeRate, reinvestRate);

      // MIRR should be between finance and reinvest rates
      expect(mirr).toBeGreaterThan(0);
      expect(mirr).toBeLessThan(50);
    });
  });
});

// ============================================================
// PAYBACK PERIOD
// ============================================================

describe('Payback Period', () => {
  describe('calculatePaybackPeriod', () => {
    it('calculates simple payback period', () => {
      const cashFlows = [-1000, 400, 400, 400, 400];
      const payback = calculatePaybackPeriod(cashFlows);

      // Cumulative: -1000, -600, -200, 200
      // Payback in year 3: 2 + 200/400 = 2.5 years
      expect(payback).toBeCloseTo(2.5, 1);
    });

    it('returns exact year when cumulative hits zero', () => {
      const cashFlows = [-1000, 500, 500];
      const payback = calculatePaybackPeriod(cashFlows);

      expect(payback).toBe(2);
    });

    it('returns null when payback not achieved', () => {
      const cashFlows = [-1000, 100, 100, 100];
      const payback = calculatePaybackPeriod(cashFlows);

      expect(payback).toBeNull();
    });

    it('handles immediate payback', () => {
      const cashFlows = [-100, 1000];
      const payback = calculatePaybackPeriod(cashFlows);

      // Payback happens in year 1
      expect(payback).toBeLessThan(1);
    });
  });

  describe('calculateDiscountedPaybackPeriod', () => {
    it('calculates discounted payback period', () => {
      const cashFlows = [-1000, 400, 400, 400, 400, 400];
      const discountRate = 10;

      const payback = calculateDiscountedPaybackPeriod(cashFlows, discountRate);

      // Discounted payback is longer than simple payback
      expect(payback).toBeGreaterThan(2.5);
    });

    it('returns null when discounted payback not achieved', () => {
      const cashFlows = [-1000, 200, 200, 200];
      const discountRate = 15;

      const payback = calculateDiscountedPaybackPeriod(cashFlows, discountRate);

      expect(payback).toBeNull();
    });
  });
});

// ============================================================
// PROFITABILITY INDEX
// ============================================================

describe('Profitability Index', () => {
  describe('calculateProfitabilityIndex', () => {
    it('calculates PI for value-creating investment', () => {
      const cashFlows = [-1000, 600, 600, 600];
      const discountRate = 10;

      const pi = calculateProfitabilityIndex(cashFlows, discountRate);

      // PI > 1 indicates value creation
      expect(pi).toBeGreaterThan(1);
    });

    it('calculates PI for value-destroying investment', () => {
      const cashFlows = [-1000, 200, 200, 200];
      const discountRate = 10;

      const pi = calculateProfitabilityIndex(cashFlows, discountRate);

      // PI < 1 indicates value destruction
      expect(pi).toBeLessThan(1);
    });

    it('returns 0 when no initial investment', () => {
      const cashFlows = [0, 100, 100];
      const discountRate = 10;

      const pi = calculateProfitabilityIndex(cashFlows, discountRate);

      expect(pi).toBe(0);
    });
  });
});

// ============================================================
// ROI CALCULATIONS
// ============================================================

describe('ROI Calculations', () => {
  describe('calculateROI', () => {
    it('calculates simple ROI', () => {
      const roi = calculateROI(200, 1000);

      expect(roi).toBe(20);
    });

    it('handles negative ROI', () => {
      const roi = calculateROI(-300, 1000);

      expect(roi).toBe(-30);
    });

    it('returns 0 for zero investment', () => {
      const roi = calculateROI(100, 0);

      expect(roi).toBe(0);
    });
  });

  describe('calculateAnnualizedROI', () => {
    it('calculates annualized ROI', () => {
      // 21% total return over 3 years
      const roi = calculateAnnualizedROI(210, 1000, 3);

      // Annualized ≈ 6.6% per year
      expect(roi).toBeCloseTo(6.6, 0);
    });

    it('returns 0 for zero investment', () => {
      const roi = calculateAnnualizedROI(100, 0, 3);

      expect(roi).toBe(0);
    });

    it('returns 0 for zero years', () => {
      const roi = calculateAnnualizedROI(100, 1000, 0);

      expect(roi).toBe(0);
    });
  });
});

// ============================================================
// INVESTMENT ASSESSMENT
// ============================================================

describe('Investment Assessment', () => {
  describe('assessInvestment', () => {
    it('rates excellent for positive NPV and IRR above hurdle', () => {
      const assessment = assessInvestment(100000, 20, 12);

      expect(assessment.rating).toBe('Excellent');
      expect(assessment.color).toBe('green');
    });

    it('rates good for positive NPV', () => {
      const assessment = assessInvestment(50000, 10, 12);

      expect(assessment.rating).toBe('Good');
      expect(assessment.color).toBe('blue');
    });

    it('rates marginal for near break-even', () => {
      const assessment = assessInvestment(-5000, 5, 12);

      expect(assessment.rating).toBe('Marginal');
      expect(assessment.color).toBe('yellow');
    });

    it('rates poor for negative NPV', () => {
      const assessment = assessInvestment(-50000, -5, 12);

      expect(assessment.rating).toBe('Poor');
      expect(assessment.color).toBe('red');
    });

    it('handles null IRR', () => {
      const assessment = assessInvestment(50000, null, 12);

      expect(assessment.rating).toBe('Good');
    });
  });
});

// ============================================================
// CASH FLOW UTILITIES
// ============================================================

describe('Cash Flow Utilities', () => {
  describe('generateGrowingCashFlows', () => {
    it('generates growing cash flows', () => {
      const cashFlows = generateGrowingCashFlows(1000, 10, 4);

      expect(cashFlows).toHaveLength(4);
      expect(cashFlows[0]).toBe(1000);
      expect(cashFlows[1]).toBeCloseTo(1100, 0);
      expect(cashFlows[2]).toBeCloseTo(1210, 0);
      expect(cashFlows[3]).toBeCloseTo(1331, 0);
    });

    it('handles zero growth', () => {
      const cashFlows = generateGrowingCashFlows(1000, 0, 3);

      expect(cashFlows).toEqual([1000, 1000, 1000]);
    });
  });

  describe('calculateCumulativeCashFlows', () => {
    it('calculates cumulative cash flows', () => {
      const cashFlows = [-1000, 400, 400, 400];
      const cumulative = calculateCumulativeCashFlows(cashFlows);

      expect(cumulative).toEqual([-1000, -600, -200, 200]);
    });
  });

  describe('discountCashFlows', () => {
    it('discounts cash flows to present values', () => {
      const cashFlows = [1000, 1000, 1000];
      const discounted = discountCashFlows(cashFlows, 10);

      expect(discounted[0]).toBe(1000); // Year 0 not discounted
      expect(discounted[1]).toBeCloseTo(909.09, 1); // 1000 / 1.1
      expect(discounted[2]).toBeCloseTo(826.45, 1); // 1000 / 1.21
    });
  });
});
