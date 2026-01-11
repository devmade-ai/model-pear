/**
 * Core financial projection calculations
 *
 * Provides NPV, IRR, payback period, and other financial metrics
 * for evaluating transaction structures over time.
 */

import type { Currency, Percentage, Years } from '../types/common.js';
import type { CashFlows, InvestmentAssessment } from './types.js';

// ============================================================
// NET PRESENT VALUE (NPV)
// ============================================================

/**
 * Calculate Net Present Value of a series of cash flows
 *
 * NPV = Σ (CFt / (1 + r)^t) for t = 0 to n
 *
 * @param cashFlows - Array of cash flows where index 0 is year 0 (initial investment)
 * @param discountRate - Annual discount rate as percentage (e.g., 12 for 12%)
 * @returns NPV as currency amount
 */
export function calculateNPV(cashFlows: CashFlows, discountRate: Percentage): Currency {
  const rate = discountRate / 100;
  return cashFlows.reduce((npv, cf, year) => {
    return npv + cf / Math.pow(1 + rate, year);
  }, 0);
}

/**
 * Calculate present value of a single future cash flow
 *
 * @param futureValue - Future cash flow amount
 * @param discountRate - Annual discount rate as percentage
 * @param years - Number of years in the future
 * @returns Present value
 */
export function calculatePresentValue(
  futureValue: Currency,
  discountRate: Percentage,
  years: Years
): Currency {
  const rate = discountRate / 100;
  return futureValue / Math.pow(1 + rate, years);
}

/**
 * Calculate future value of a present amount
 *
 * @param presentValue - Present cash flow amount
 * @param growthRate - Annual growth rate as percentage
 * @param years - Number of years
 * @returns Future value
 */
export function calculateFutureValue(
  presentValue: Currency,
  growthRate: Percentage,
  years: Years
): Currency {
  const rate = growthRate / 100;
  return presentValue * Math.pow(1 + rate, years);
}

// ============================================================
// INTERNAL RATE OF RETURN (IRR)
// ============================================================

/**
 * Calculate derivative of NPV with respect to discount rate
 * Used internally for Newton-Raphson IRR calculation
 */
function calculateNPVDerivative(cashFlows: CashFlows, rate: number): number {
  return cashFlows.reduce((derivative, cf, year) => {
    if (year === 0) return derivative;
    return derivative - (year * cf) / Math.pow(1 + rate, year + 1);
  }, 0);
}

/**
 * Calculate Internal Rate of Return using Newton-Raphson method
 *
 * IRR is the discount rate that makes NPV = 0
 *
 * @param cashFlows - Array of cash flows where index 0 is year 0 (initial investment, typically negative)
 * @param maxIterations - Maximum iterations for convergence (default: 100)
 * @param tolerance - Convergence tolerance (default: 0.00001)
 * @returns IRR as percentage (e.g., 15 for 15%), or null if no solution found
 */
export function calculateIRR(
  cashFlows: CashFlows,
  maxIterations = 100,
  tolerance = 0.00001
): Percentage | null {
  // Check if IRR is calculable (need at least one sign change)
  const hasPositive = cashFlows.some((cf) => cf > 0);
  const hasNegative = cashFlows.some((cf) => cf < 0);

  if (!hasPositive || !hasNegative) {
    return null;
  }

  let irr = 0.1; // Initial guess of 10%

  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(cashFlows, irr * 100);
    const derivative = calculateNPVDerivative(cashFlows, irr);

    if (Math.abs(derivative) < tolerance) {
      break;
    }

    const newIRR = irr - npv / derivative;

    if (Math.abs(newIRR - irr) < tolerance) {
      return newIRR * 100; // Return as percentage
    }

    irr = newIRR;

    // Bounds check to prevent divergence
    if (irr < -0.99) irr = -0.99;
    if (irr > 10) irr = 10;
  }

  return irr * 100; // Return as percentage
}

// ============================================================
// PAYBACK PERIOD
// ============================================================

/**
 * Calculate simple payback period (undiscounted)
 *
 * @param cashFlows - Array of cash flows where index 0 is year 0 (initial investment)
 * @returns Payback period in years, or null if payback never achieved
 */
export function calculatePaybackPeriod(cashFlows: CashFlows): Years | null {
  let cumulative = 0;

  for (let year = 0; year < cashFlows.length; year++) {
    cumulative += cashFlows[year];

    if (cumulative >= 0 && year > 0) {
      // Interpolate for fractional year
      const prevCumulative = cumulative - cashFlows[year];
      const fraction = -prevCumulative / cashFlows[year];
      return year - 1 + fraction;
    }
  }

  return null; // Payback not achieved within projection period
}

/**
 * Calculate discounted payback period
 *
 * @param cashFlows - Array of cash flows where index 0 is year 0 (initial investment)
 * @param discountRate - Annual discount rate as percentage
 * @returns Discounted payback period in years, or null if payback never achieved
 */
export function calculateDiscountedPaybackPeriod(
  cashFlows: CashFlows,
  discountRate: Percentage
): Years | null {
  const rate = discountRate / 100;
  let cumulative = 0;

  for (let year = 0; year < cashFlows.length; year++) {
    const discountedCF = cashFlows[year] / Math.pow(1 + rate, year);
    cumulative += discountedCF;

    if (cumulative >= 0 && year > 0) {
      // Interpolate for fractional year
      const prevCumulative = cumulative - discountedCF;
      const fraction = -prevCumulative / discountedCF;
      return year - 1 + fraction;
    }
  }

  return null; // Payback not achieved within projection period
}

// ============================================================
// PROFITABILITY INDEX
// ============================================================

/**
 * Calculate profitability index (PI)
 *
 * PI = (NPV + Initial Investment) / Initial Investment
 *    = PV of future cash flows / Initial Investment
 *
 * PI > 1 indicates a value-creating investment
 *
 * @param cashFlows - Array of cash flows where index 0 is the initial investment
 * @param discountRate - Annual discount rate as percentage
 * @returns Profitability index
 */
export function calculateProfitabilityIndex(
  cashFlows: CashFlows,
  discountRate: Percentage
): number {
  const initialInvestment = Math.abs(cashFlows[0]);
  if (initialInvestment === 0) return 0;

  const npv = calculateNPV(cashFlows, discountRate);
  return (npv + initialInvestment) / initialInvestment;
}

// ============================================================
// MODIFIED IRR (MIRR)
// ============================================================

/**
 * Calculate Modified Internal Rate of Return
 *
 * MIRR addresses some limitations of IRR by assuming reinvestment
 * at a different rate than the project returns.
 *
 * @param cashFlows - Array of cash flows
 * @param financeRate - Rate used to discount negative cash flows (as percentage)
 * @param reinvestRate - Rate used to compound positive cash flows (as percentage)
 * @returns MIRR as percentage
 */
export function calculateMIRR(
  cashFlows: CashFlows,
  financeRate: Percentage,
  reinvestRate: Percentage
): Percentage {
  const n = cashFlows.length - 1;
  const finRate = financeRate / 100;
  const reinRate = reinvestRate / 100;

  // Calculate present value of negative cash flows (costs)
  let pvNegative = 0;
  // Calculate future value of positive cash flows (benefits)
  let fvPositive = 0;

  cashFlows.forEach((cf, year) => {
    if (cf < 0) {
      pvNegative += cf / Math.pow(1 + finRate, year);
    } else {
      fvPositive += cf * Math.pow(1 + reinRate, n - year);
    }
  });

  if (pvNegative >= 0 || fvPositive === 0) {
    return 0;
  }

  // MIRR = (FV of positives / PV of negatives)^(1/n) - 1
  const mirr = Math.pow(fvPositive / Math.abs(pvNegative), 1 / n) - 1;
  return mirr * 100;
}

// ============================================================
// RETURN ON INVESTMENT (ROI)
// ============================================================

/**
 * Calculate simple Return on Investment
 *
 * @param totalProfit - Total profit over investment period
 * @param initialInvestment - Initial investment amount
 * @returns ROI as percentage
 */
export function calculateROI(totalProfit: Currency, initialInvestment: Currency): Percentage {
  if (initialInvestment === 0) return 0;
  return (totalProfit / initialInvestment) * 100;
}

/**
 * Calculate annualized ROI
 *
 * @param totalProfit - Total profit over investment period
 * @param initialInvestment - Initial investment amount
 * @param years - Investment period in years
 * @returns Annualized ROI as percentage
 */
export function calculateAnnualizedROI(
  totalProfit: Currency,
  initialInvestment: Currency,
  years: Years
): Percentage {
  if (initialInvestment === 0 || years === 0) return 0;
  const totalReturn = (initialInvestment + totalProfit) / initialInvestment;
  return (Math.pow(totalReturn, 1 / years) - 1) * 100;
}

// ============================================================
// INVESTMENT ASSESSMENT
// ============================================================

/**
 * Assess investment quality based on NPV and IRR
 *
 * @param npv - Net Present Value
 * @param irr - Internal Rate of Return (as percentage)
 * @param hurdleRate - Required rate of return / WACC (as percentage)
 * @returns Investment assessment with rating and description
 */
export function assessInvestment(
  npv: Currency,
  irr: Percentage | null,
  hurdleRate: Percentage
): InvestmentAssessment {
  if (npv > 0 && irr !== null && irr > hurdleRate) {
    return {
      rating: 'Excellent',
      color: 'green',
      description: 'Strong value creation, exceeds hurdle rate',
    };
  } else if (npv > 0) {
    return {
      rating: 'Good',
      color: 'blue',
      description: 'Positive NPV, acceptable returns',
    };
  } else if (npv > -10000) {
    return {
      rating: 'Marginal',
      color: 'yellow',
      description: 'Near break-even, review assumptions',
    };
  } else {
    return {
      rating: 'Poor',
      color: 'red',
      description: 'Negative NPV, value destruction likely',
    };
  }
}

// ============================================================
// CASH FLOW UTILITIES
// ============================================================

/**
 * Generate a series of growing cash flows
 *
 * @param baseCashFlow - Initial cash flow amount
 * @param growthRate - Annual growth rate as percentage
 * @param years - Number of years to project
 * @returns Array of cash flows
 */
export function generateGrowingCashFlows(
  baseCashFlow: Currency,
  growthRate: Percentage,
  years: Years
): CashFlows {
  const rate = growthRate / 100;
  const cashFlows: CashFlows = [];

  for (let year = 0; year < years; year++) {
    cashFlows.push(baseCashFlow * Math.pow(1 + rate, year));
  }

  return cashFlows;
}

/**
 * Calculate cumulative cash flows from a series
 *
 * @param cashFlows - Array of cash flows
 * @returns Array of cumulative cash flows
 */
export function calculateCumulativeCashFlows(cashFlows: CashFlows): CashFlows {
  let cumulative = 0;
  return cashFlows.map((cf) => {
    cumulative += cf;
    return cumulative;
  });
}

/**
 * Discount a series of cash flows to present values
 *
 * @param cashFlows - Array of cash flows
 * @param discountRate - Annual discount rate as percentage
 * @returns Array of present values
 */
export function discountCashFlows(cashFlows: CashFlows, discountRate: Percentage): CashFlows {
  const rate = discountRate / 100;
  return cashFlows.map((cf, year) => cf / Math.pow(1 + rate, year));
}
