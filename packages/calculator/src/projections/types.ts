/**
 * Type definitions for financial projections
 */

import type { Currency, Percentage, Years } from '../types/common.js';

// ============================================================
// PROJECTION PARAMETERS
// ============================================================

export interface ProjectionParams {
  /** Projection period in years (3, 5, 7, or 10) */
  projectionPeriod: Years;
  /** Discount rate / WACC for NPV calculations */
  discountRate: Percentage;
  /** Expected annual inflation rate */
  inflationRate: Percentage;
  /** Expected annual revenue growth rate */
  revenueGrowthRate: Percentage;
  /** Expected annual cost growth rate */
  costGrowthRate: Percentage;
  /** Annual enhancement cost as percentage of base cost */
  enhancementCostPercent: Percentage;
  /** Terminal growth rate for perpetuity calculations */
  terminalGrowthRate: Percentage;
  /** Corporate tax rate */
  taxRate: Percentage;
}

export const DEFAULT_PROJECTION_PARAMS: ProjectionParams = {
  projectionPeriod: 5,
  discountRate: 12,
  inflationRate: 5,
  revenueGrowthRate: 8,
  costGrowthRate: 4,
  enhancementCostPercent: 10,
  terminalGrowthRate: 2,
  taxRate: 27,
};

// ============================================================
// CASH FLOW TYPES
// ============================================================

/** Array of cash flows where index 0 is year 0 (initial investment) */
export type CashFlows = Currency[];

export interface YearlyProjection {
  year: number;
  revenue: Currency;
  costs: Currency;
  grossProfit: Currency;
  tax: Currency;
  netProfit: Currency;
  cashFlow: Currency;
  cumulativeCashFlow: Currency;
  discountFactor: number;
  presentValue: Currency;
}

export interface BuyerYearlyProjection extends YearlyProjection {
  enhancementCost: Currency;
  operatingCosts: Currency;
  amortisation: Currency;
  assetValue: Currency;
}

// ============================================================
// METRICS TYPES
// ============================================================

export interface ProjectionMetrics {
  /** Net Present Value */
  npv: Currency;
  /** Internal Rate of Return (as percentage, e.g., 15 for 15%) */
  irr: Percentage;
  /** Simple payback period in years */
  paybackPeriod: Years;
  /** Discounted payback period in years */
  discountedPaybackPeriod: Years;
  /** Total revenue over projection period */
  totalRevenue: Currency;
  /** Total profit over projection period */
  totalProfit: Currency;
}

export interface InvestmentAssessment {
  rating: 'Excellent' | 'Good' | 'Marginal' | 'Poor';
  color: 'green' | 'blue' | 'yellow' | 'red';
  description: string;
}

// ============================================================
// PROJECTION RESULTS
// ============================================================

export interface PartyProjection {
  partyType: 'developer' | 'buyer';
  yearlyData: YearlyProjection[];
  cashFlows: CashFlows;
  metrics: ProjectionMetrics;
  assessment: InvestmentAssessment;
}

export interface ProjectionResult {
  params: ProjectionParams;
  years: Years;
  developer: PartyProjection;
  buyer: PartyProjection;
  summary: ProjectionSummary;
}

export interface ProjectionSummary {
  developer: {
    npv: Currency;
    irr: Percentage;
    paybackPeriod: Years;
    assessment: InvestmentAssessment;
  };
  buyer: {
    npv: Currency;
    irr: Percentage;
    paybackPeriod: Years;
    roi: Percentage;
    assessment: InvestmentAssessment;
  };
  recommendations: string[];
}

// ============================================================
// BREAK-EVEN ANALYSIS
// ============================================================

export interface BreakEvenResult {
  breakEvenRevenue: Currency;
  initialInvestment: Currency;
  revenueToInvestmentRatio: number;
  description: string;
}

// ============================================================
// ASSET TRAJECTORY
// ============================================================

export interface AssetTrajectoryPoint {
  year: number;
  grossAssetValue: Currency;
  accumulatedAmortisation: Currency;
  netAssetValue: Currency;
  enhancement: Currency;
  totalEnhancements: Currency;
}

export type AssetTrajectory = AssetTrajectoryPoint[];
