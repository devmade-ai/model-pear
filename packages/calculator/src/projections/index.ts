/**
 * Financial Projections Module
 *
 * Provides NPV, IRR, payback period, and other financial metrics
 * for evaluating transaction structures over time.
 */

// Types
export type {
  ProjectionParams,
  CashFlows,
  YearlyProjection,
  BuyerYearlyProjection,
  ProjectionMetrics,
  InvestmentAssessment,
  PartyProjection,
  ProjectionResult,
  ProjectionSummary,
  BreakEvenResult,
  AssetTrajectoryPoint,
  AssetTrajectory,
} from './types.js';

// Constants
export { DEFAULT_PROJECTION_PARAMS } from './types.js';

// Core calculations
export {
  // NPV
  calculateNPV,
  calculatePresentValue,
  calculateFutureValue,
  // IRR
  calculateIRR,
  calculateMIRR,
  // Payback
  calculatePaybackPeriod,
  calculateDiscountedPaybackPeriod,
  // Other metrics
  calculateProfitabilityIndex,
  calculateROI,
  calculateAnnualizedROI,
  // Investment assessment
  assessInvestment,
  // Cash flow utilities
  generateGrowingCashFlows,
  calculateCumulativeCashFlows,
  discountCashFlows,
} from './calculations.js';
