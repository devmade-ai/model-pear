/**
 * Model 4: Build-Operate-Transfer (BOT)
 *
 * Developer builds and operates software, then transfers to Buyer.
 * Developer earns fees during operation period, Buyer acquires proven asset.
 *
 * Key characteristics:
 * - Developer: Builds, operates, earns fees, then sells
 * - Buyer: Pays fees during operation, acquires asset at transfer
 * - Risk allocation: Developer bears build risk, shares operation risk
 * - Transfer pricing: Transfer price valuation critical
 */

import type { Currency, Percentage, Years, Section11eType } from '../types/common.js';
import type { BenchmarkRange, AmortisationScheduleYear, CalculationResult, DeveloperPerspective, BuyerPerspective, TransferPricingAssessment } from '../types/results.js';

// ============================================================
// INPUT TYPES
// ============================================================

export type TransferMethod = 'fixed' | 'formula' | 'fair-value' | 'cost-recovery';
export type FormulaType = 'cost-plus' | 'revenue-multiple' | 'ebitda-multiple';
export type ValuationMethod = 'income-approach' | 'market-approach' | 'cost-approach';

interface BOTBaseInputs {
  projectName: string;
  developmentCost: Currency;
  researchPhaseCost: Currency;
  developmentPhaseCost: Currency;
  operationPeriodYears: Years;
  annualOperatingFee: Currency;
  annualOperatingCost: Currency;
  estimatedAnnualRevenue: Currency;
  transferYear: Years;
  usefulLife: Years;
  section11eType: Section11eType;
  corporateTaxRate: Percentage;
}

export interface Variant4AInputs extends BOTBaseInputs {
  variant: '4A';
  fixedTransferPrice: Currency;
  inflationAdjustment: Percentage;
}

export interface Variant4BInputs extends BOTBaseInputs {
  variant: '4B';
  formulaType: FormulaType;
  formulaMultiplier: Percentage;
  floorPrice: Currency;
  ceilingPrice: Currency;
}

export interface Variant4CInputs extends BOTBaseInputs {
  variant: '4C';
  valuationMethod: ValuationMethod;
  valuationDate: 'transfer' | 'contract';
  discountRate: Percentage;
}

export interface Variant4DInputs extends BOTBaseInputs {
  variant: '4D';
  costRecoveryMultiple: Percentage;
  profitSharingRate: Percentage;
}

export interface Variant4EInputs extends BOTBaseInputs {
  variant: '4E';
  performanceMetric: 'uptime' | 'users' | 'transactions' | 'revenue';
  performanceThreshold: Percentage;
  performanceBonus: Currency;
  performancePenalty: Currency;
}

export interface Variant4FInputs extends BOTBaseInputs {
  variant: '4F';
  developerStakePercentage: Percentage;
  stakeBuyoutYear: Years;
  stakeBuyoutMultiple: Percentage;
}

export interface Variant4GInputs extends BOTBaseInputs {
  variant: '4G';
  transferGuarantee: 'full' | 'partial' | 'none';
  warrantyPeriod: Years;
  escrowPercentage: Percentage;
}

export interface Variant4HInputs extends BOTBaseInputs {
  variant: '4H';
  ipRegistration: 'developer-jurisdiction' | 'buyer-jurisdiction' | 'both';
  crossBorderWithholding: Percentage;
}

export type BOTInputs = Variant4AInputs | Variant4BInputs | Variant4CInputs | Variant4DInputs | Variant4EInputs | Variant4FInputs | Variant4GInputs | Variant4HInputs;
export type BOTVariantId = '4A' | '4B' | '4C' | '4D' | '4E' | '4F' | '4G' | '4H';

// ============================================================
// VARIANT DEFINITIONS
// ============================================================

export const VARIANTS: Record<BOTVariantId, { id: BOTVariantId; name: string; description: string; scenario: string }> = {
  '4A': { id: '4A', name: 'Fixed Transfer Price', description: 'Transfer price agreed upfront', scenario: 'Both parties want certainty; price can be estimated upfront' },
  '4B': { id: '4B', name: 'Formula-Based Transfer Price', description: 'Price determined by formula at transfer', scenario: 'Uncertainty about fair value; price reflects actual performance' },
  '4C': { id: '4C', name: 'Fair Market Value at Transfer', description: 'Independent valuation at transfer date', scenario: 'Transfer pricing defensibility paramount' },
  '4D': { id: '4D', name: 'Cost Recovery Plus', description: 'Recover costs plus agreed profit share', scenario: 'Risk-sharing with guaranteed cost recovery' },
  '4E': { id: '4E', name: 'Performance-Based Transfer', description: 'Price adjusted based on KPIs', scenario: 'Align incentives with operational performance' },
  '4F': { id: '4F', name: 'Retained Stake', description: 'Developer retains equity post-transfer', scenario: 'Ongoing alignment with shared upside' },
  '4G': { id: '4G', name: 'Transfer with Warranty', description: 'Transfer with performance guarantees', scenario: 'Risk mitigation for Buyer' },
  '4H': { id: '4H', name: 'Cross-Border BOT', description: 'International build-operate-transfer', scenario: 'Different jurisdictions with tax considerations' },
};

export const BENCHMARK_RANGE: BenchmarkRange = { low: 100, median: 150, high: 200, extremeHigh: 300 };

// ============================================================
// CALCULATION FUNCTIONS
// ============================================================

function calculateTransferPrice(inputs: BOTInputs): Currency {
  switch (inputs.variant) {
    case '4A': {
      const years = inputs.transferYear;
      return inputs.fixedTransferPrice * Math.pow(1 + inputs.inflationAdjustment / 100, years);
    }
    case '4B': {
      let basePrice = inputs.developmentPhaseCost;
      if (inputs.formulaType === 'revenue-multiple') basePrice = inputs.estimatedAnnualRevenue * (inputs.formulaMultiplier / 100);
      else if (inputs.formulaType === 'cost-plus') basePrice = inputs.developmentPhaseCost * (1 + inputs.formulaMultiplier / 100);
      return Math.max(inputs.floorPrice, Math.min(inputs.ceilingPrice, basePrice));
    }
    case '4C': {
      const cashFlows = inputs.estimatedAnnualRevenue - inputs.annualOperatingCost;
      const remainingYears = inputs.usefulLife - inputs.transferYear;
      let npv = 0;
      for (let y = 1; y <= remainingYears; y++) {
        npv += cashFlows / Math.pow(1 + inputs.discountRate / 100, y);
      }
      return Math.max(0, npv);
    }
    case '4D':
      return inputs.developmentPhaseCost * (inputs.costRecoveryMultiple / 100);
    default:
      return inputs.developmentPhaseCost * 1.25;
  }
}

export function calculate(inputs: BOTInputs): CalculationResult {
  const transferPrice = calculateTransferPrice(inputs);
  const taxRate = inputs.corporateTaxRate / 100;
  const operationYears = inputs.operationPeriodYears;
  const totalOperatingFees = inputs.annualOperatingFee * operationYears;
  const totalOperatingCosts = inputs.annualOperatingCost * operationYears;

  const developerTotalRevenue = totalOperatingFees + transferPrice;
  const developerTotalCosts = inputs.developmentCost + totalOperatingCosts;
  const developerGrossProfit = developerTotalRevenue - developerTotalCosts;
  const developerTax = Math.max(0, developerGrossProfit * taxRate);

  const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
  const remainingLife = Math.max(1, inputs.usefulLife - inputs.transferYear);
  const buyerAmortisation = transferPrice / remainingLife;

  const schedule: AmortisationScheduleYear[] = [];
  for (let year = 1; year <= remainingLife; year++) {
    schedule.push({ year, openingBalance: transferPrice - buyerAmortisation * (year - 1), amortisation: buyerAmortisation, closingBalance: Math.max(0, transferPrice - buyerAmortisation * year) });
  }

  const developer: DeveloperPerspective = {
    revenue: { total: developerTotalRevenue, breakdown: { development: 0, licence: 0, royalties: 0, maintenance: totalOperatingFees, services: transferPrice }, recognitionTiming: 'over-time', recognitionBasis: 'IFRS 15 - operating fees over time, transfer at point in time' },
    costs: { total: developerTotalCosts, breakdown: { personnel: inputs.developmentCost * 0.7, infrastructure: inputs.developmentCost * 0.2, other: totalOperatingCosts + inputs.developmentCost * 0.1 } },
    profit: { gross: developerGrossProfit, margin: developerTotalRevenue > 0 ? (developerGrossProfit / developerTotalRevenue) * 100 : 0, net: developerGrossProfit - developerTax },
    asset: { recognised: true, reason: 'BOT asset - Developer retains until transfer', carryingValue: inputs.developmentPhaseCost },
    tax: { taxableIncome: developerGrossProfit, corporateTaxRate: inputs.corporateTaxRate, taxPayable: developerTax, effectiveTaxRate: developerTotalRevenue > 0 ? (developerTax / developerTotalRevenue) * 100 : 0, deferredTaxAsset: 0, deferredTaxLiability: 0 },
  };

  const buyerTotalCost = totalOperatingFees + transferPrice;

  const buyer: BuyerPerspective = {
    asset: { recognised: true, capitalised: transferPrice, expensed: totalOperatingFees, carryingValue: transferPrice, usefulLife: remainingLife, amortisationMethod: 'straight-line', annualAmortisation: buyerAmortisation, section11eType: inputs.section11eType, section11eYears },
    expenses: { year1: { researchExpense: 0, amortisation: buyerAmortisation, total: buyerAmortisation }, ongoing: { amortisation: buyerAmortisation, maintenance: 0, total: buyerAmortisation }, schedule },
    tax: { section11eDeduction: transferPrice / section11eYears, accountingAmortisation: buyerAmortisation, timingDifference: buyerAmortisation - transferPrice / section11eYears, deferredTaxAsset: 0, deferredTaxLiability: 0, taxBenefit: (transferPrice / section11eYears) * taxRate },
    totalCost: buyerTotalCost,
  };

  const impliedReturn = inputs.developmentPhaseCost > 0 ? (transferPrice / inputs.developmentPhaseCost) * 100 : 0;
  const withinRange = impliedReturn >= BENCHMARK_RANGE.low && impliedReturn <= BENCHMARK_RANGE.high;

  const transferPricing: TransferPricingAssessment = {
    method: 'CUP',
    margin: impliedReturn,
    benchmarkRange: BENCHMARK_RANGE,
    withinRange,
    riskScore: withinRange ? 85 : 55,
    riskLevel: withinRange ? 'low' : 'medium',
    recommendation: withinRange ? 'Transfer price within acceptable range' : 'Consider independent valuation to support transfer price',
    documentation: ['BOT agreement with transfer provisions', 'Transfer price methodology', 'Independent valuation (if applicable)', 'Functional analysis', 'Operating performance records'],
  };

  return {
    developer, buyer, transferPricing,
    metadata: { modelId: 'model-4', modelName: 'Build-Operate-Transfer (BOT)', variantId: inputs.variant, variantName: VARIANTS[inputs.variant].name, calculatedAt: new Date().toISOString() },
  };
}

export const MODEL_4_BOT = {
  id: 'model-4', name: 'Build-Operate-Transfer (BOT)', shortName: 'BOT', description: 'Developer builds and operates software, then transfers to Buyer.', category: 'intercompany',
  variants: VARIANTS, defaultVariant: '4A' as BOTVariantId, calculate, icon: '🔄', color: '#F59E0B',
  accountingSummary: { developer: 'Capitalise during build, recognise revenue during operation and at transfer.', buyer: 'Expense operating fees, capitalise transfer price as intangible asset.' },
} as const;
