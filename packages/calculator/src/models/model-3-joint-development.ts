/**
 * Model 3: Joint Development / Cost-Sharing
 *
 * Both parties contribute resources to jointly develop software.
 * Each party owns rights proportional to their contribution or as agreed.
 *
 * Key characteristics:
 * - IP ownership: Shared/proportional
 * - Cash flow: Each party funds their share of costs
 * - Risk allocation: Shared proportionally
 * - No intercompany profit - key benefit for consolidation
 */

import type { Currency, Percentage, Years, Section11eType } from '../types/common.js';
import type { BenchmarkRange, AmortisationScheduleYear, CalculationResult, DeveloperPerspective, BuyerPerspective, TransferPricingAssessment } from '../types/results.js';

// ============================================================
// INPUT TYPES
// ============================================================

export type OwnershipMethod = 'fixed' | 'contribution' | 'benefit';
export type ValuationMethod = 'fair-value' | 'cost-basis' | 'market-value';

interface JointDevBaseInputs {
  projectName: string;
  totalProjectCost: Currency;
  researchPhaseCost: Currency;
  developmentPhaseCost: Currency;
  projectDurationMonths: number;
  developerCashContribution: Currency;
  developerPersonnelFTEs: number;
  developerPersonnelCostPerMonth: Currency;
  developerIPContribution: Currency;
  developerFacilitiesContribution: Currency;
  buyerCashContribution: Currency;
  buyerPersonnelFTEs: number;
  buyerPersonnelCostPerMonth: Currency;
  buyerIPContribution: Currency;
  buyerDomainExpertiseValue: Currency;
  usefulLife: Years;
  section11eType: Section11eType;
  corporateTaxRate: Percentage;
}

export interface Variant3AInputs extends JointDevBaseInputs {
  variant: '3A';
  ownershipSplit: Percentage; // Developer ownership %
}

export interface Variant3BInputs extends JointDevBaseInputs {
  variant: '3B';
  valuationMethod: ValuationMethod;
}

export interface Variant3CInputs extends JointDevBaseInputs {
  variant: '3C';
  developerAnticipatedBenefit: Currency;
  buyerAnticipatedBenefit: Currency;
}

export interface Variant3DInputs extends JointDevBaseInputs {
  variant: '3D';
  developerUsageRights: Percentage;
  buyerUsageRights: Percentage;
}

export interface Variant3EInputs extends JointDevBaseInputs {
  variant: '3E';
  platformOwnership: 'developer' | 'buyer' | 'joint';
  derivativeWorksSplit: Percentage;
}

export interface Variant3FInputs extends JointDevBaseInputs {
  variant: '3F';
  buyInPayment: Currency;
  buyInTiming: 'upfront' | 'milestone' | 'completion';
}

export interface Variant3GInputs extends JointDevBaseInputs {
  variant: '3G';
  terminationTrigger: 'budget-overrun' | 'schedule-delay' | 'milestone-failure' | 'mutual';
  terminationCompensation: Percentage;
}

export interface Variant3HInputs extends JointDevBaseInputs {
  variant: '3H';
  governingLaw: 'south-africa' | 'delaware' | 'uk' | 'other';
  disputeResolution: 'arbitration' | 'litigation' | 'mediation';
}

export type JointDevInputs =
  | Variant3AInputs
  | Variant3BInputs
  | Variant3CInputs
  | Variant3DInputs
  | Variant3EInputs
  | Variant3FInputs
  | Variant3GInputs
  | Variant3HInputs;

export type JointDevVariantId = '3A' | '3B' | '3C' | '3D' | '3E' | '3F' | '3G' | '3H';

// ============================================================
// VARIANT DEFINITIONS
// ============================================================

export const VARIANTS: Record<JointDevVariantId, { id: JointDevVariantId; name: string; description: string; scenario: string }> = {
  '3A': { id: '3A', name: 'Proportional Cost Sharing (Equal)', description: '50/50 ownership split regardless of actual contribution', scenario: 'Simple, equal ownership regardless of varying contributions' },
  '3B': { id: '3B', name: 'Contribution-Based Sharing', description: 'Ownership matches contribution value', scenario: 'Ownership reflects actual contributions from each party' },
  '3C': { id: '3C', name: 'Benefit-Based Sharing', description: 'Costs allocated by anticipated benefits', scenario: 'Benefits differ significantly from contributions (TP compliant)' },
  '3D': { id: '3D', name: 'Usage Rights Split', description: 'Different usage rights regardless of ownership', scenario: 'Parties have different commercial exploitation needs' },
  '3E': { id: '3E', name: 'Platform + Derivatives', description: 'Base platform vs derivative works split', scenario: 'Creating a platform with customizable modules' },
  '3F': { id: '3F', name: 'Buy-In Arrangement', description: 'One party joins existing project', scenario: 'New party joining ongoing development project' },
  '3G': { id: '3G', name: 'Termination Provisions', description: 'Handling incomplete or terminated project', scenario: 'Need clear exit strategy and IP treatment on termination' },
  '3H': { id: '3H', name: 'Cross-Border Joint Development', description: 'International cost-sharing arrangement', scenario: 'Parties in different jurisdictions with tax treaty implications' },
};

export const BENCHMARK_RANGE: BenchmarkRange = { low: -5, median: 0, high: 5, extremeHigh: 10 };

// ============================================================
// CALCULATION FUNCTIONS
// ============================================================

function calculateContributions(inputs: JointDevInputs) {
  const developerPersonnel = inputs.developerPersonnelFTEs * inputs.developerPersonnelCostPerMonth * inputs.projectDurationMonths;
  const buyerPersonnel = inputs.buyerPersonnelFTEs * inputs.buyerPersonnelCostPerMonth * inputs.projectDurationMonths;

  const developerTotal = inputs.developerCashContribution + developerPersonnel + inputs.developerIPContribution + inputs.developerFacilitiesContribution;
  const buyerTotal = inputs.buyerCashContribution + buyerPersonnel + inputs.buyerIPContribution + inputs.buyerDomainExpertiseValue;
  const totalContribution = developerTotal + buyerTotal;

  return { developerTotal, buyerTotal, totalContribution, developerPersonnel, buyerPersonnel };
}

function calculateOwnershipSplit(inputs: JointDevInputs, contributions: ReturnType<typeof calculateContributions>): { developerShare: Percentage; buyerShare: Percentage } {
  switch (inputs.variant) {
    case '3A':
      return { developerShare: inputs.ownershipSplit, buyerShare: 100 - inputs.ownershipSplit };
    case '3B':
      const devShare = contributions.totalContribution > 0 ? (contributions.developerTotal / contributions.totalContribution) * 100 : 50;
      return { developerShare: devShare, buyerShare: 100 - devShare };
    case '3C':
      const totalBenefit = inputs.developerAnticipatedBenefit + inputs.buyerAnticipatedBenefit;
      const benefitShare = totalBenefit > 0 ? (inputs.developerAnticipatedBenefit / totalBenefit) * 100 : 50;
      return { developerShare: benefitShare, buyerShare: 100 - benefitShare };
    default:
      const contributionShare = contributions.totalContribution > 0 ? (contributions.developerTotal / contributions.totalContribution) * 100 : 50;
      return { developerShare: contributionShare, buyerShare: 100 - contributionShare };
  }
}

export function calculate(inputs: JointDevInputs): CalculationResult {
  const contributions = calculateContributions(inputs);
  const ownership = calculateOwnershipSplit(inputs, contributions);
  const taxRate = inputs.corporateTaxRate / 100;

  const developerCapitalised = inputs.developmentPhaseCost * (ownership.developerShare / 100);
  const buyerCapitalised = inputs.developmentPhaseCost * (ownership.buyerShare / 100);

  const usefulLife = inputs.usefulLife;
  const developerAmortisation = developerCapitalised / usefulLife;
  const buyerAmortisation = buyerCapitalised / usefulLife;

  const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;

  const developer: DeveloperPerspective = {
    revenue: { total: 0, breakdown: { development: 0, licence: 0, royalties: 0, maintenance: 0, services: 0 }, recognitionTiming: 'point-in-time', recognitionBasis: 'Joint development - no revenue recognition' },
    costs: { total: contributions.developerTotal, breakdown: { personnel: contributions.developerPersonnel, infrastructure: inputs.developerFacilitiesContribution, other: inputs.developerCashContribution + inputs.developerIPContribution } },
    profit: { gross: -developerAmortisation, margin: 0, net: -developerAmortisation * (1 - taxRate) },
    asset: { recognised: true, reason: 'Joint development - proportional ownership per IAS 38', carryingValue: developerCapitalised },
    tax: { taxableIncome: -developerAmortisation, corporateTaxRate: inputs.corporateTaxRate, taxPayable: 0, effectiveTaxRate: 0, deferredTaxAsset: 0, deferredTaxLiability: 0 },
  };

  const schedule: AmortisationScheduleYear[] = [];
  for (let year = 1; year <= usefulLife; year++) {
    schedule.push({ year, openingBalance: buyerCapitalised - buyerAmortisation * (year - 1), amortisation: buyerAmortisation, closingBalance: Math.max(0, buyerCapitalised - buyerAmortisation * year) });
  }

  const buyer: BuyerPerspective = {
    asset: { recognised: true, capitalised: buyerCapitalised, expensed: inputs.researchPhaseCost * (ownership.buyerShare / 100), carryingValue: buyerCapitalised, usefulLife, amortisationMethod: 'straight-line', annualAmortisation: buyerAmortisation, section11eType: inputs.section11eType, section11eYears },
    expenses: { year1: { researchExpense: inputs.researchPhaseCost * (ownership.buyerShare / 100), amortisation: buyerAmortisation, total: buyerAmortisation }, ongoing: { amortisation: buyerAmortisation, maintenance: 0, total: buyerAmortisation }, schedule },
    tax: { section11eDeduction: buyerCapitalised / section11eYears, accountingAmortisation: buyerAmortisation, timingDifference: buyerAmortisation - buyerCapitalised / section11eYears, deferredTaxAsset: 0, deferredTaxLiability: 0, taxBenefit: (buyerCapitalised / section11eYears) * taxRate },
    totalCost: contributions.buyerTotal,
  };

  const transferPricing: TransferPricingAssessment = {
    method: 'cost-contribution',
    margin: 0,
    benchmarkRange: BENCHMARK_RANGE,
    withinRange: true,
    riskScore: 90,
    riskLevel: 'low',
    recommendation: 'Cost-sharing arrangements at cost have inherently low TP risk',
    documentation: ['Cost contribution arrangement (CCA) agreement', 'Contribution valuation documentation', 'Anticipated benefits analysis', 'Buy-in/buy-out provisions', 'Functional analysis'],
  };

  return {
    developer, buyer, transferPricing,
    metadata: { modelId: 'model-3', modelName: 'Joint Development / Cost-Sharing', variantId: inputs.variant, variantName: VARIANTS[inputs.variant].name, calculatedAt: new Date().toISOString() },
  };
}

export const MODEL_3_JOINT_DEVELOPMENT = {
  id: 'model-3', name: 'Joint Development / Cost-Sharing', shortName: 'Joint Dev', description: 'Both parties contribute to jointly develop software with shared ownership.', category: 'intercompany',
  variants: VARIANTS, defaultVariant: '3B' as JointDevVariantId, calculate, icon: '🤝', color: '#10B981',
  accountingSummary: { developer: 'Capitalise proportional share (IAS 38). No intercompany profit.', buyer: 'Capitalise proportional share (IAS 38). No intercompany profit.' },
} as const;
