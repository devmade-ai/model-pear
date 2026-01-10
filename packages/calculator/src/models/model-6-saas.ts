/**
 * Model 6: SaaS / Subscription Enhancement
 *
 * Developer provides software as a service with ongoing subscription.
 * Buyer pays recurring fees for access, Developer retains ownership.
 *
 * Key characteristics:
 * - Developer: Retains IP, earns recurring subscription revenue
 * - Buyer: Operating expense (no asset), predictable costs
 * - No IP transfer - pure service model
 * - Transfer pricing: Service fee benchmarking
 */

import type { Currency, Percentage, Years, Section11eType } from '../types/common.js';
import type { BenchmarkRange, CalculationResult, DeveloperPerspective, BuyerPerspective, TransferPricingAssessment } from '../types/results.js';

// ============================================================
// INPUT TYPES
// ============================================================

export type PricingModel = 'flat-rate' | 'per-user' | 'usage-based' | 'tiered';
export type ContractLength = 'monthly' | 'annual' | 'multi-year';
export type SupportLevel = 'self-service' | 'standard' | 'premium' | 'dedicated';

interface SaaSBaseInputs {
  projectName: string;
  developmentCost: Currency;
  researchPhaseCost: Currency;
  developmentPhaseCost: Currency;
  monthlySubscriptionFee: Currency;
  contractLengthMonths: number;
  annualHostingCost: Currency;
  annualSupportCost: Currency;
  usefulLife: Years;
  section11eType: Section11eType;
  corporateTaxRate: Percentage;
}

export interface Variant6AInputs extends SaaSBaseInputs {
  variant: '6A';
  pricingModel: 'flat-rate';
}

export interface Variant6BInputs extends SaaSBaseInputs {
  variant: '6B';
  pricingModel: 'per-user';
  userCount: number;
  perUserMonthlyFee: Currency;
}

export interface Variant6CInputs extends SaaSBaseInputs {
  variant: '6C';
  pricingModel: 'usage-based';
  usageMetric: 'transactions' | 'api-calls' | 'storage' | 'compute';
  estimatedMonthlyUsage: number;
  perUnitFee: Currency;
}

export interface Variant6DInputs extends SaaSBaseInputs {
  variant: '6D';
  pricingModel: 'tiered';
  tierName: 'starter' | 'professional' | 'enterprise';
  tierMultiplier: Percentage;
}

export interface Variant6EInputs extends SaaSBaseInputs {
  variant: '6E';
  customizationIncluded: boolean;
  customizationFee: Currency;
  customizationCost: Currency;
}

export interface Variant6FInputs extends SaaSBaseInputs {
  variant: '6F';
  supportLevel: SupportLevel;
  supportPremium: Percentage;
  slaCoverage: Percentage;
}

export interface Variant6GInputs extends SaaSBaseInputs {
  variant: '6G';
  dataResidencyRequired: boolean;
  dataResidencyPremium: Percentage;
  complianceCertifications: string[];
}

export interface Variant6HInputs extends SaaSBaseInputs {
  variant: '6H';
  minimumCommitment: Currency;
  overageRate: Percentage;
  commitmentPeriod: Years;
}

export interface Variant6IInputs extends SaaSBaseInputs {
  variant: '6I';
  whitelabelEnabled: boolean;
  whitelabelFee: Currency;
  resellerMargin: Percentage;
}

export type SaaSInputs = Variant6AInputs | Variant6BInputs | Variant6CInputs | Variant6DInputs | Variant6EInputs | Variant6FInputs | Variant6GInputs | Variant6HInputs | Variant6IInputs;
export type SaaSVariantId = '6A' | '6B' | '6C' | '6D' | '6E' | '6F' | '6G' | '6H' | '6I';

// ============================================================
// VARIANT DEFINITIONS
// ============================================================

export const VARIANTS: Record<SaaSVariantId, { id: SaaSVariantId; name: string; description: string; scenario: string }> = {
  '6A': { id: '6A', name: 'Flat-Rate Subscription', description: 'Fixed monthly/annual fee', scenario: 'Simple pricing, predictable costs' },
  '6B': { id: '6B', name: 'Per-User Pricing', description: 'Price scales with user count', scenario: 'Usage aligns with headcount' },
  '6C': { id: '6C', name: 'Usage-Based Pricing', description: 'Pay for actual consumption', scenario: 'Variable usage patterns' },
  '6D': { id: '6D', name: 'Tiered Pricing', description: 'Feature tiers with different prices', scenario: 'Different customer segments' },
  '6E': { id: '6E', name: 'SaaS with Customization', description: 'Base subscription plus custom development', scenario: 'Platform needs tailoring' },
  '6F': { id: '6F', name: 'SaaS with Premium Support', description: 'Enhanced support SLA options', scenario: 'Mission-critical deployments' },
  '6G': { id: '6G', name: 'SaaS with Data Residency', description: 'Compliance and data sovereignty', scenario: 'Regulated industries' },
  '6H': { id: '6H', name: 'Committed Use Discount', description: 'Discounts for usage commitments', scenario: 'Enterprise agreements' },
  '6I': { id: '6I', name: 'White-Label SaaS', description: 'Reseller/partner program', scenario: 'Channel distribution' },
};

export const BENCHMARK_RANGE: BenchmarkRange = { low: 60, median: 75, high: 85, extremeHigh: 90 };

// ============================================================
// CALCULATION FUNCTIONS
// ============================================================

function calculateMonthlyRevenue(inputs: SaaSInputs): Currency {
  switch (inputs.variant) {
    case '6A':
      return inputs.monthlySubscriptionFee;
    case '6B':
      return inputs.userCount * inputs.perUserMonthlyFee;
    case '6C':
      return inputs.estimatedMonthlyUsage * inputs.perUnitFee;
    case '6D':
      return inputs.monthlySubscriptionFee * (inputs.tierMultiplier / 100);
    case '6E':
      return inputs.monthlySubscriptionFee;
    case '6F':
      return inputs.monthlySubscriptionFee * (1 + inputs.supportPremium / 100);
    case '6G':
      return inputs.monthlySubscriptionFee * (1 + (inputs.dataResidencyRequired ? inputs.dataResidencyPremium / 100 : 0));
    case '6H':
      return inputs.minimumCommitment / 12;
    case '6I':
      return inputs.monthlySubscriptionFee + inputs.whitelabelFee;
  }
}

export function calculate(inputs: SaaSInputs): CalculationResult {
  const monthlyRevenue = calculateMonthlyRevenue(inputs);
  const taxRate = inputs.corporateTaxRate / 100;
  const contractMonths = inputs.contractLengthMonths;
  const contractYears = contractMonths / 12;

  const totalSubscriptionRevenue = monthlyRevenue * contractMonths;
  const annualOperatingCost = inputs.annualHostingCost + inputs.annualSupportCost;
  const totalOperatingCost = annualOperatingCost * contractYears;

  // Add customization revenue/cost for variant 6E
  let customizationRevenue = 0;
  let customizationCost = 0;
  if (inputs.variant === '6E' && inputs.customizationIncluded) {
    customizationRevenue = inputs.customizationFee;
    customizationCost = inputs.customizationCost;
  }

  const developerTotalRevenue = totalSubscriptionRevenue + customizationRevenue;
  const developerTotalCosts = totalOperatingCost + customizationCost;
  const developerGrossProfit = developerTotalRevenue - developerTotalCosts;
  const developerTax = Math.max(0, developerGrossProfit * taxRate);

  // Developer amortises development costs
  const developerAmortisation = inputs.developmentPhaseCost / inputs.usefulLife;

  const developer: DeveloperPerspective = {
    revenue: { total: developerTotalRevenue, breakdown: { development: 0, licence: 0, royalties: 0, maintenance: totalSubscriptionRevenue, services: customizationRevenue }, recognitionTiming: 'over-time', recognitionBasis: 'IFRS 15 - subscription revenue recognised over service period' },
    costs: { total: developerTotalCosts + developerAmortisation * contractYears, breakdown: { personnel: inputs.developmentCost * 0.5, infrastructure: inputs.annualHostingCost * contractYears, other: inputs.annualSupportCost * contractYears + customizationCost } },
    profit: { gross: developerGrossProfit - developerAmortisation * contractYears, margin: developerTotalRevenue > 0 ? ((developerGrossProfit - developerAmortisation * contractYears) / developerTotalRevenue) * 100 : 0, net: developerGrossProfit - developerAmortisation * contractYears - developerTax },
    asset: { recognised: true, reason: 'SaaS platform - Developer retains IP ownership', carryingValue: inputs.developmentPhaseCost },
    tax: { taxableIncome: developerGrossProfit - developerAmortisation * contractYears, corporateTaxRate: inputs.corporateTaxRate, taxPayable: developerTax, effectiveTaxRate: developerTotalRevenue > 0 ? (developerTax / developerTotalRevenue) * 100 : 0, deferredTaxAsset: 0, deferredTaxLiability: 0 },
  };

  // Buyer has no asset - pure operating expense
  const annualSubscriptionCost = (monthlyRevenue * 12) + (customizationRevenue / contractYears);

  const buyer: BuyerPerspective = {
    asset: { recognised: false, capitalised: 0, expensed: developerTotalRevenue, carryingValue: 0, usefulLife: 0, amortisationMethod: 'straight-line', annualAmortisation: 0, section11eType: inputs.section11eType, section11eYears: 0 },
    expenses: { year1: { researchExpense: 0, amortisation: 0, total: annualSubscriptionCost }, ongoing: { amortisation: 0, maintenance: annualSubscriptionCost, total: annualSubscriptionCost }, schedule: [] },
    tax: { section11eDeduction: annualSubscriptionCost, accountingAmortisation: 0, timingDifference: 0, deferredTaxAsset: 0, deferredTaxLiability: 0, taxBenefit: annualSubscriptionCost * taxRate },
    totalCost: developerTotalRevenue,
  };

  // Calculate gross margin for TP assessment
  const grossMargin = developerTotalRevenue > 0 ? (developerGrossProfit / developerTotalRevenue) * 100 : 0;
  const withinRange = grossMargin >= BENCHMARK_RANGE.low && grossMargin <= BENCHMARK_RANGE.high;

  const transferPricing: TransferPricingAssessment = {
    method: 'TNMM',
    margin: grossMargin,
    benchmarkRange: BENCHMARK_RANGE,
    withinRange,
    riskScore: withinRange ? 85 : 60,
    riskLevel: withinRange ? 'low' : 'medium',
    recommendation: withinRange ? 'SaaS margins within industry benchmarks' : 'Consider margin analysis and pricing review',
    documentation: ['SaaS subscription agreement', 'Service level agreement', 'Pricing methodology', 'Cost allocation documentation', 'Benchmark study'],
  };

  return {
    developer, buyer, transferPricing,
    metadata: { modelId: 'model-6', modelName: 'SaaS / Subscription Enhancement', variantId: inputs.variant, variantName: VARIANTS[inputs.variant].name, calculatedAt: new Date().toISOString() },
  };
}

export const MODEL_6_SAAS = {
  id: 'model-6', name: 'SaaS / Subscription Enhancement', shortName: 'SaaS', description: 'Developer provides software as a service with recurring subscription fees.', category: 'intercompany',
  variants: VARIANTS, defaultVariant: '6A' as SaaSVariantId, calculate, icon: '☁️', color: '#6366F1',
  accountingSummary: { developer: 'Capitalise development (IAS 38). Recognise subscription revenue over time (IFRS 15).', buyer: 'Expense subscription fees as incurred. No intangible asset recognised.' },
} as const;
