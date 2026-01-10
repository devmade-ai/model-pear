/**
 * Model 5: Software Sale with Ongoing Support
 *
 * Developer sells completed software to Buyer with ongoing maintenance/support.
 * One-time IP transfer plus recurring service revenue.
 *
 * Key characteristics:
 * - Developer: Sale proceeds + maintenance revenue
 * - Buyer: Capitalise purchase price, expense maintenance
 * - Clear IP transfer - buyer owns outright
 * - Transfer pricing: Sale price and maintenance fee benchmarking
 */

import type { Currency, Percentage, Years, Section11eType } from '../types/common.js';
import type { BenchmarkRange, AmortisationScheduleYear, CalculationResult, DeveloperPerspective, BuyerPerspective, TransferPricingAssessment } from '../types/results.js';

// ============================================================
// INPUT TYPES
// ============================================================

export type MaintenanceLevel = 'basic' | 'standard' | 'premium' | 'enterprise';
export type PaymentTerms = 'upfront' | 'instalments' | 'deferred' | 'milestone';
export type WarrantyType = 'limited' | 'extended' | 'comprehensive';

interface SoftwareSaleBaseInputs {
  projectName: string;
  developmentCost: Currency;
  researchPhaseCost: Currency;
  developmentPhaseCost: Currency;
  salePrice: Currency;
  annualMaintenanceFee: Currency;
  annualMaintenanceCost: Currency;
  maintenanceTerm: Years;
  usefulLife: Years;
  section11eType: Section11eType;
  corporateTaxRate: Percentage;
}

export interface Variant5AInputs extends SoftwareSaleBaseInputs {
  variant: '5A';
  paymentTerms: 'upfront';
}

export interface Variant5BInputs extends SoftwareSaleBaseInputs {
  variant: '5B';
  instalmentPeriod: Years;
  instalmentCount: number;
  interestRate: Percentage;
}

export interface Variant5CInputs extends SoftwareSaleBaseInputs {
  variant: '5C';
  deferralPeriod: Years;
  discountRate: Percentage;
}

export interface Variant5DInputs extends SoftwareSaleBaseInputs {
  variant: '5D';
  maintenanceLevel: MaintenanceLevel;
  slaUptimeTarget: Percentage;
  slaPenaltyRate: Percentage;
}

export interface Variant5EInputs extends SoftwareSaleBaseInputs {
  variant: '5E';
  sourceCodeIncluded: boolean;
  sourceCodePremium: Percentage;
  escrowArrangement: boolean;
}

export interface Variant5FInputs extends SoftwareSaleBaseInputs {
  variant: '5F';
  warrantyType: WarrantyType;
  warrantyPeriod: Years;
  warrantyProvision: Percentage;
}

export interface Variant5GInputs extends SoftwareSaleBaseInputs {
  variant: '5G';
  earnoutPercentage: Percentage;
  earnoutMetric: 'revenue' | 'users' | 'transactions';
  earnoutTarget: Currency;
  earnoutPeriod: Years;
}

export interface Variant5HInputs extends SoftwareSaleBaseInputs {
  variant: '5H';
  transitionSupportPeriod: Years;
  transitionSupportFee: Currency;
  knowledgeTransferIncluded: boolean;
}

export type SoftwareSaleInputs = Variant5AInputs | Variant5BInputs | Variant5CInputs | Variant5DInputs | Variant5EInputs | Variant5FInputs | Variant5GInputs | Variant5HInputs;
export type SoftwareSaleVariantId = '5A' | '5B' | '5C' | '5D' | '5E' | '5F' | '5G' | '5H';

// ============================================================
// VARIANT DEFINITIONS
// ============================================================

export const VARIANTS: Record<SoftwareSaleVariantId, { id: SoftwareSaleVariantId; name: string; description: string; scenario: string }> = {
  '5A': { id: '5A', name: 'Outright Sale (Upfront)', description: 'Full payment at closing', scenario: 'Clean transaction with immediate cash' },
  '5B': { id: '5B', name: 'Instalment Sale', description: 'Payment in instalments over time', scenario: 'Buyer cash flow management' },
  '5C': { id: '5C', name: 'Deferred Payment', description: 'Payment deferred to future date', scenario: 'Buyer needs time to generate returns' },
  '5D': { id: '5D', name: 'Sale with SLA-Based Maintenance', description: 'Maintenance tied to service levels', scenario: 'Performance-based ongoing relationship' },
  '5E': { id: '5E', name: 'Source Code Sale', description: 'Includes source code access', scenario: 'Buyer wants full control and independence' },
  '5F': { id: '5F', name: 'Sale with Extended Warranty', description: 'Enhanced warranty provisions', scenario: 'Risk mitigation for buyer' },
  '5G': { id: '5G', name: 'Sale with Earnout', description: 'Price includes performance earnout', scenario: 'Bridge valuation gap with upside sharing' },
  '5H': { id: '5H', name: 'Sale with Transition Support', description: 'Includes knowledge transfer period', scenario: 'Ensure successful handover' },
};

export const BENCHMARK_RANGE: BenchmarkRange = { low: 150, median: 250, high: 400, extremeHigh: 600 };

// ============================================================
// CALCULATION FUNCTIONS
// ============================================================

function calculateEffectiveSalePrice(inputs: SoftwareSaleInputs): { effectivePrice: Currency; npvAdjustment: Currency } {
  switch (inputs.variant) {
    case '5B': {
      const instalment = inputs.salePrice / inputs.instalmentCount;
      let npv = 0;
      for (let i = 1; i <= inputs.instalmentCount; i++) {
        npv += instalment / Math.pow(1 + inputs.interestRate / 100, i / 12 * inputs.instalmentPeriod);
      }
      return { effectivePrice: inputs.salePrice, npvAdjustment: inputs.salePrice - npv };
    }
    case '5C': {
      const npv = inputs.salePrice / Math.pow(1 + inputs.discountRate / 100, inputs.deferralPeriod);
      return { effectivePrice: inputs.salePrice, npvAdjustment: inputs.salePrice - npv };
    }
    case '5E': {
      const premium = inputs.sourceCodeIncluded ? inputs.salePrice * (inputs.sourceCodePremium / 100) : 0;
      return { effectivePrice: inputs.salePrice + premium, npvAdjustment: 0 };
    }
    case '5G': {
      const expectedEarnout = inputs.earnoutTarget * (inputs.earnoutPercentage / 100) * 0.7; // 70% probability
      return { effectivePrice: inputs.salePrice + expectedEarnout, npvAdjustment: 0 };
    }
    default:
      return { effectivePrice: inputs.salePrice, npvAdjustment: 0 };
  }
}

export function calculate(inputs: SoftwareSaleInputs): CalculationResult {
  const { effectivePrice } = calculateEffectiveSalePrice(inputs);
  const taxRate = inputs.corporateTaxRate / 100;

  const totalMaintenanceRevenue = inputs.annualMaintenanceFee * inputs.maintenanceTerm;
  const totalMaintenanceCost = inputs.annualMaintenanceCost * inputs.maintenanceTerm;
  const maintenanceProfit = totalMaintenanceRevenue - totalMaintenanceCost;

  const developerTotalRevenue = effectivePrice + totalMaintenanceRevenue;
  const saleProfit = effectivePrice - inputs.developmentCost;
  const developerGrossProfit = saleProfit + maintenanceProfit;
  const developerTax = Math.max(0, developerGrossProfit * taxRate);

  const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
  const buyerCapitalised = effectivePrice;
  const buyerAmortisation = buyerCapitalised / inputs.usefulLife;

  const schedule: AmortisationScheduleYear[] = [];
  for (let year = 1; year <= inputs.usefulLife; year++) {
    schedule.push({ year, openingBalance: buyerCapitalised - buyerAmortisation * (year - 1), amortisation: buyerAmortisation, closingBalance: Math.max(0, buyerCapitalised - buyerAmortisation * year) });
  }

  const developer: DeveloperPerspective = {
    revenue: { total: developerTotalRevenue, breakdown: { development: 0, licence: effectivePrice, royalties: 0, maintenance: totalMaintenanceRevenue, services: 0 }, recognitionTiming: 'point-in-time', recognitionBasis: 'IFRS 15 - sale at point in time, maintenance over time' },
    costs: { total: inputs.developmentCost + totalMaintenanceCost, breakdown: { personnel: inputs.developmentCost * 0.7, infrastructure: inputs.developmentCost * 0.2, other: totalMaintenanceCost + inputs.developmentCost * 0.1 } },
    profit: { gross: developerGrossProfit, margin: developerTotalRevenue > 0 ? (developerGrossProfit / developerTotalRevenue) * 100 : 0, net: developerGrossProfit - developerTax },
    asset: { recognised: false, reason: 'IP transferred to Buyer - no asset retained', carryingValue: 0 },
    tax: { taxableIncome: developerGrossProfit, corporateTaxRate: inputs.corporateTaxRate, taxPayable: developerTax, effectiveTaxRate: developerTotalRevenue > 0 ? (developerTax / developerTotalRevenue) * 100 : 0, deferredTaxAsset: 0, deferredTaxLiability: 0 },
  };

  const buyer: BuyerPerspective = {
    asset: { recognised: true, capitalised: buyerCapitalised, expensed: totalMaintenanceRevenue, carryingValue: buyerCapitalised, usefulLife: inputs.usefulLife, amortisationMethod: 'straight-line', annualAmortisation: buyerAmortisation, section11eType: inputs.section11eType, section11eYears },
    expenses: { year1: { researchExpense: 0, amortisation: buyerAmortisation, total: buyerAmortisation + inputs.annualMaintenanceFee }, ongoing: { amortisation: buyerAmortisation, maintenance: inputs.annualMaintenanceFee, total: buyerAmortisation + inputs.annualMaintenanceFee }, schedule },
    tax: { section11eDeduction: buyerCapitalised / section11eYears, accountingAmortisation: buyerAmortisation, timingDifference: buyerAmortisation - buyerCapitalised / section11eYears, deferredTaxAsset: 0, deferredTaxLiability: 0, taxBenefit: (buyerCapitalised / section11eYears) * taxRate },
    totalCost: effectivePrice + totalMaintenanceRevenue,
  };

  const impliedMultiple = inputs.developmentCost > 0 ? (effectivePrice / inputs.developmentCost) * 100 : 0;
  const withinRange = impliedMultiple >= BENCHMARK_RANGE.low && impliedMultiple <= BENCHMARK_RANGE.high;

  const transferPricing: TransferPricingAssessment = {
    method: 'CUP',
    margin: impliedMultiple,
    benchmarkRange: BENCHMARK_RANGE,
    withinRange,
    riskScore: withinRange ? 85 : 55,
    riskLevel: withinRange ? 'low' : 'medium',
    recommendation: withinRange ? 'Sale price within acceptable range' : 'Consider independent valuation',
    documentation: ['Software sale agreement', 'IP assignment documentation', 'Valuation report', 'Maintenance agreement', 'Warranty provisions'],
  };

  return {
    developer, buyer, transferPricing,
    metadata: { modelId: 'model-5', modelName: 'Software Sale with Ongoing Support', variantId: inputs.variant, variantName: VARIANTS[inputs.variant].name, calculatedAt: new Date().toISOString() },
  };
}

export const MODEL_5_SOFTWARE_SALE = {
  id: 'model-5', name: 'Software Sale with Ongoing Support', shortName: 'Software Sale', description: 'Developer sells completed software to Buyer with ongoing maintenance.', category: 'intercompany',
  variants: VARIANTS, defaultVariant: '5A' as SoftwareSaleVariantId, calculate, icon: '💼', color: '#EF4444',
  accountingSummary: { developer: 'Recognise sale at point of transfer (IFRS 15). Derecognise intangible asset.', buyer: 'Capitalise purchase price (IAS 38). Expense maintenance as incurred.' },
} as const;
