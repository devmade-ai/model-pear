/**
 * Model 1: Development Services (Cost-Plus)
 *
 * Developer creates software for Buyer as a service.
 * IP ownership goes to Buyer (who controls the development).
 *
 * Key characteristics:
 * - Developer: Recognises service revenue, no asset on books
 * - Buyer: Capitalises development costs as intangible asset
 * - Transfer pricing: Cost-plus margin (arm's length range 5-15%)
 */

import type {
  Currency,
  Percentage,
  Years,
  Section11eType,
  InputFieldConfig,
  InputCategory,
} from '../types/common.js';

import type {
  DeveloperPerspective,
  BuyerPerspective,
  TransferPricingAssessment,
  BenchmarkRange,
  AmortisationScheduleYear,
  CalculationResult,
} from '../types/results.js';

import type { EntityConfig, TaxParams } from '../types/entities.js';

// ============================================================
// INPUT TYPES
// ============================================================

/**
 * Base inputs common to all Cost-Plus variants
 */
export interface CostPlusBaseInputs {
  projectName: string;
  developmentCost: Currency;
  researchPhaseCost: Currency;
  developmentPhaseCost: Currency;
  markupPercentage: Percentage;
  usefulLife: Years;
  section11eType: Section11eType;
  corporateTaxRate: Percentage;
}

/**
 * Variant 1A: Pure Cost Reimbursement (no markup)
 */
export interface Variant1AInputs extends Omit<CostPlusBaseInputs, 'markupPercentage'> {
  variant: '1A';
}

/**
 * Variant 1B: Standard Cost-Plus with fixed margin
 */
export interface Variant1BInputs extends CostPlusBaseInputs {
  variant: '1B';
}

/**
 * Variant 1C: Cost-Plus with Performance Bonus
 */
export interface Variant1CInputs extends CostPlusBaseInputs {
  variant: '1C';
  milestoneBonus: Currency;
  milestoneProbability: Percentage;
}

/**
 * Variant 1D: Fixed Price Development
 */
export interface Variant1DInputs extends Omit<CostPlusBaseInputs, 'markupPercentage'> {
  variant: '1D';
  fixedPrice: Currency;
  estimatedCostVariance: Percentage;
}

/**
 * Variant 1E: Time and Materials
 */
export interface Variant1EInputs extends Omit<CostPlusBaseInputs, 'developmentCost' | 'markupPercentage'> {
  variant: '1E';
  developerHours: number;
  hourlyRate: Currency;
  hourlyMarkup: Percentage;
}

/**
 * Variant 1F: Dedicated Development Team
 */
export interface Variant1FInputs extends Omit<CostPlusBaseInputs, 'developmentCost' | 'researchPhaseCost' | 'developmentPhaseCost' | 'markupPercentage'> {
  variant: '1F';
  monthlyRetainer: Currency;
  contractMonths: number;
  monthlyCost: Currency;
}

/**
 * Union type of all Cost-Plus variant inputs
 */
export type CostPlusInputs =
  | Variant1AInputs
  | Variant1BInputs
  | Variant1CInputs
  | Variant1DInputs
  | Variant1EInputs
  | Variant1FInputs;

/**
 * Variant identifiers
 */
export type CostPlusVariantId = '1A' | '1B' | '1C' | '1D' | '1E' | '1F';

// ============================================================
// VARIANT DEFINITIONS
// ============================================================

export interface VariantDefinition {
  id: CostPlusVariantId;
  name: string;
  description: string;
  scenario: string;
}

export const VARIANTS: Record<CostPlusVariantId, VariantDefinition> = {
  '1A': {
    id: '1A',
    name: 'Pure Cost Reimbursement',
    description: 'No markup - costs passed through at zero margin',
    scenario: 'Use when Developer is providing resources without profit motive, or for initial cost validation',
  },
  '1B': {
    id: '1B',
    name: 'Cost-Plus Fixed Margin',
    description: 'Standard cost-plus with fixed percentage markup',
    scenario: 'Most common arrangement - Developer earns consistent margin on all costs',
  },
  '1C': {
    id: '1C',
    name: 'Cost-Plus with Performance Bonus',
    description: 'Base margin plus milestone-based bonuses',
    scenario: 'Incentivise timely delivery and quality outcomes',
  },
  '1D': {
    id: '1D',
    name: 'Fixed Price Development',
    description: 'Lump sum payment regardless of actual costs',
    scenario: 'When scope is well-defined and Developer accepts delivery risk',
  },
  '1E': {
    id: '1E',
    name: 'Time and Materials',
    description: 'Hourly/daily rates plus material costs',
    scenario: 'When scope is uncertain and flexibility is needed',
  },
  '1F': {
    id: '1F',
    name: 'Dedicated Development Team',
    description: 'Monthly retainer for dedicated resources',
    scenario: 'Long-term arrangement with predictable monthly costs',
  },
};

// ============================================================
// CONSTANTS
// ============================================================

/**
 * Arm's length benchmark range for development services (OECD guidelines)
 */
export const BENCHMARK_RANGE: BenchmarkRange = {
  low: 5,
  median: 10,
  high: 15,
  extremeHigh: 20,
};

/**
 * Default cost breakdown percentages (typical software development)
 */
const COST_BREAKDOWN = {
  personnel: 0.7,
  infrastructure: 0.2,
  other: 0.1,
};

// ============================================================
// CALCULATION FUNCTIONS
// ============================================================

/**
 * Internal type for revenue/cost calculation result
 */
interface RevenueAndCosts {
  revenue: Currency;
  costs: Currency;
  margin: Percentage;
}

/**
 * Calculate revenue and costs based on variant type
 */
function calculateRevenueAndCosts(inputs: CostPlusInputs): RevenueAndCosts {
  switch (inputs.variant) {
    case '1A': {
      // Pure cost reimbursement - no markup
      const costs = inputs.developmentCost;
      return { revenue: costs, costs, margin: 0 };
    }

    case '1B': {
      // Standard cost-plus
      const costs = inputs.developmentCost;
      const margin = inputs.markupPercentage;
      const revenue = costs * (1 + margin / 100);
      return { revenue, costs, margin };
    }

    case '1C': {
      // Cost-plus with performance bonus
      const costs = inputs.developmentCost;
      const margin = inputs.markupPercentage;
      let revenue = costs * (1 + margin / 100);
      // Add expected bonus based on probability
      const expectedBonus = inputs.milestoneBonus * (inputs.milestoneProbability / 100);
      revenue += expectedBonus;
      return { revenue, costs, margin };
    }

    case '1D': {
      // Fixed price - margin derived from difference
      const costs = inputs.developmentCost * (1 + inputs.estimatedCostVariance / 100);
      const revenue = inputs.fixedPrice;
      const margin = costs > 0 ? ((revenue - costs) / costs) * 100 : 0;
      return { revenue, costs, margin };
    }

    case '1E': {
      // Time and materials
      const baseCost = inputs.developerHours * (inputs.hourlyRate / (1 + inputs.hourlyMarkup / 100));
      const costs = baseCost;
      const margin = inputs.hourlyMarkup;
      const revenue = inputs.developerHours * inputs.hourlyRate;
      return { revenue, costs, margin };
    }

    case '1F': {
      // Dedicated team
      const costs = inputs.monthlyCost * inputs.contractMonths;
      const revenue = inputs.monthlyRetainer * inputs.contractMonths;
      const margin = costs > 0 ? ((revenue - costs) / costs) * 100 : 0;
      return { revenue, costs, margin };
    }
  }
}

/**
 * Calculate developer perspective: Revenue recognition, no asset
 */
function calculateDeveloperPerspective(
  revenue: Currency,
  costs: Currency,
  margin: Percentage,
  taxRate: Percentage
): DeveloperPerspective {
  const profit = revenue - costs;
  const taxPayable = profit * (taxRate / 100);
  const netProfit = profit - taxPayable;

  return {
    revenue: {
      total: revenue,
      breakdown: {
        development: revenue,
        licence: 0,
        royalties: 0,
        maintenance: 0,
        services: 0,
      },
      recognitionTiming: 'over-time',
      recognitionBasis: 'IFRS 15 - over time as services rendered',
    },
    costs: {
      total: costs,
      breakdown: {
        personnel: costs * COST_BREAKDOWN.personnel,
        infrastructure: costs * COST_BREAKDOWN.infrastructure,
        other: costs * COST_BREAKDOWN.other,
      },
    },
    profit: {
      gross: profit,
      margin: margin,
      net: netProfit,
    },
    asset: {
      recognised: false,
      reason: 'Development services - IP controlled by Buyer',
      carryingValue: 0,
    },
    tax: {
      taxableIncome: profit,
      corporateTaxRate: taxRate,
      taxPayable: taxPayable,
      effectiveTaxRate: revenue > 0 ? (taxPayable / revenue) * 100 : 0,
      deferredTaxAsset: 0,
      deferredTaxLiability: 0,
    },
  };
}

/**
 * Generate year-by-year amortisation schedule
 */
function generateAmortisationSchedule(
  capitalisedAmount: Currency,
  usefulLife: Years
): AmortisationScheduleYear[] {
  const annualAmortisation = capitalisedAmount / usefulLife;
  const schedule: AmortisationScheduleYear[] = [];

  for (let year = 1; year <= usefulLife; year++) {
    schedule.push({
      year,
      openingBalance: capitalisedAmount - annualAmortisation * (year - 1),
      amortisation: annualAmortisation,
      closingBalance: capitalisedAmount - annualAmortisation * year,
    });
  }

  return schedule;
}

/**
 * Calculate buyer perspective: Asset capitalisation and amortisation
 */
function calculateBuyerPerspective(
  transactionValue: Currency,
  inputs: CostPlusInputs,
  taxRate: Percentage
): BuyerPerspective {
  // Get research/development phase costs (default to 0 if not in variant)
  const researchCost = 'researchPhaseCost' in inputs ? inputs.researchPhaseCost : 0;
  const developmentPhaseCost =
    'developmentPhaseCost' in inputs ? inputs.developmentPhaseCost : transactionValue - researchCost;

  // Only development phase is capitalised per IAS 38
  const capitalisedAmount = developmentPhaseCost;
  const expensedAmount = researchCost;

  const usefulLife = inputs.usefulLife;
  const annualAmortisation = capitalisedAmount / usefulLife;

  // Section 11(e) tax depreciation
  const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
  const taxDepreciation = capitalisedAmount / section11eYears;

  // Deferred tax: timing difference between accounting and tax treatment
  const timingDifference = annualAmortisation - taxDepreciation;
  const deferredTax = timingDifference * (taxRate / 100);

  return {
    asset: {
      recognised: true,
      capitalised: capitalisedAmount,
      expensed: expensedAmount,
      carryingValue: capitalisedAmount,
      usefulLife,
      amortisationMethod: 'straight-line',
      annualAmortisation,
      section11eType: inputs.section11eType,
      section11eYears,
    },
    expenses: {
      year1: {
        researchExpense: expensedAmount,
        amortisation: annualAmortisation,
        total: expensedAmount + annualAmortisation,
      },
      ongoing: {
        amortisation: annualAmortisation,
        maintenance: 0,
        total: annualAmortisation,
      },
      schedule: generateAmortisationSchedule(capitalisedAmount, usefulLife),
    },
    tax: {
      section11eDeduction: taxDepreciation,
      accountingAmortisation: annualAmortisation,
      timingDifference,
      deferredTaxAsset: deferredTax > 0 ? deferredTax : 0,
      deferredTaxLiability: deferredTax < 0 ? Math.abs(deferredTax) : 0,
      taxBenefit: taxDepreciation * (taxRate / 100),
    },
    totalCost: transactionValue,
  };
}

/**
 * Assess transfer pricing risk
 */
function assessTransferPricing(margin: Percentage): TransferPricingAssessment {
  const withinRange = margin >= BENCHMARK_RANGE.low && margin <= BENCHMARK_RANGE.high;
  const withinExtendedRange = margin >= 0 && margin <= BENCHMARK_RANGE.extremeHigh;

  let riskScore: number;
  let riskLevel: 'low' | 'medium' | 'high';

  if (withinRange) {
    riskScore = 90;
    riskLevel = 'low';
  } else if (withinExtendedRange) {
    riskScore = 70;
    riskLevel = 'medium';
  } else {
    riskScore = 40;
    riskLevel = 'high';
  }

  return {
    method: 'cost-plus',
    margin,
    benchmarkRange: BENCHMARK_RANGE,
    withinRange,
    riskScore,
    riskLevel,
    recommendation: withinRange
      ? "Margin is within arm's length range"
      : `Consider adjusting margin to ${BENCHMARK_RANGE.median}% (median benchmark)`,
    documentation: [
      'Written development agreement required',
      'Time tracking and cost allocation records',
      'Transfer pricing policy document',
      'Benchmark study or comparables analysis',
    ],
  };
}

// ============================================================
// MAIN CALCULATION FUNCTION
// ============================================================

/**
 * Calculate three-perspective results for Model 1: Cost-Plus
 *
 * @param inputs - Variant-specific inputs
 * @param entityConfig - Optional entity configuration (uses defaults if not provided)
 * @param taxParams - Optional tax parameter overrides
 * @returns Complete calculation result with developer, buyer, and TP perspectives
 *
 * @example
 * ```typescript
 * const inputs: Variant1BInputs = {
 *   variant: '1B',
 *   projectName: 'CRM Development',
 *   developmentCost: 1_000_000,
 *   researchPhaseCost: 200_000,
 *   developmentPhaseCost: 800_000,
 *   markupPercentage: 10,
 *   usefulLife: 5,
 *   section11eType: 'pc-2yr',
 *   corporateTaxRate: 27,
 * };
 *
 * const result = calculate(inputs);
 * console.log(result.developer.revenue.total); // 1,100,000
 * console.log(result.developer.profit.gross);  // 100,000
 * ```
 */
export function calculate(
  inputs: CostPlusInputs,
  _entityConfig?: EntityConfig,
  taxParams?: TaxParams
): CalculationResult {
  const variant = VARIANTS[inputs.variant];

  // Get effective tax rate (input > taxParams > default)
  const taxRate = taxParams?.corporateTaxRate ?? inputs.corporateTaxRate;

  // Calculate revenue and costs based on variant
  const { revenue, costs, margin } = calculateRevenueAndCosts(inputs);

  // Calculate perspectives
  const developer = calculateDeveloperPerspective(revenue, costs, margin, taxRate);
  const buyer = calculateBuyerPerspective(revenue, inputs, taxRate);
  const transferPricing = assessTransferPricing(margin);

  return {
    developer,
    buyer,
    transferPricing,
    metadata: {
      modelId: 'model-1',
      modelName: 'Development Services (Cost-Plus)',
      variantId: inputs.variant,
      variantName: variant.name,
      calculatedAt: new Date().toISOString(),
    },
  };
}

// ============================================================
// INPUT CONFIGURATION (for UI form generation)
// ============================================================

export const INPUT_CATEGORIES: Record<string, InputCategory> = {
  transaction: {
    name: 'Transaction Details',
    description: 'Core transaction structure and values',
    icon: '📋',
  },
  developer: {
    name: 'Developer Inputs',
    description: 'Developer entity costs and requirements',
    icon: '💻',
  },
  buyer: {
    name: 'Buyer Inputs',
    description: 'Buyer entity asset treatment',
    icon: '🏢',
  },
  tax: {
    name: 'Tax Parameters',
    description: 'South African tax settings',
    icon: '📊',
  },
};

export const BASE_INPUT_FIELDS: InputFieldConfig[] = [
  {
    name: 'projectName',
    label: 'Project Name',
    type: 'text',
    default: 'Software Development Project',
    category: 'transaction',
    hint: 'Name of the development project',
  },
  {
    name: 'developmentCost',
    label: 'Total Development Cost (R)',
    type: 'currency',
    default: 1000000,
    min: 0,
    step: 10000,
    category: 'developer',
    hint: 'Total cost incurred by Developer (salaries, infrastructure, etc.)',
  },
  {
    name: 'researchPhaseCost',
    label: 'Research Phase Cost (R)',
    type: 'currency',
    default: 200000,
    min: 0,
    step: 10000,
    category: 'developer',
    hint: 'Costs before IAS 38 capitalisation criteria met (expensed by Buyer)',
  },
  {
    name: 'developmentPhaseCost',
    label: 'Development Phase Cost (R)',
    type: 'currency',
    default: 800000,
    min: 0,
    step: 10000,
    category: 'developer',
    hint: 'Costs after IAS 38 criteria met (capitalised by Buyer)',
  },
  {
    name: 'markupPercentage',
    label: 'Cost-Plus Markup (%)',
    type: 'percent',
    default: 10,
    min: 0,
    max: 50,
    step: 1,
    category: 'developer',
    hint: "Arm's length range for development services: 5-15%",
  },
  {
    name: 'usefulLife',
    label: 'Useful Life (Years)',
    type: 'number',
    default: 5,
    min: 1,
    max: 20,
    step: 1,
    category: 'buyer',
    hint: 'Expected useful life for amortisation purposes',
  },
  {
    name: 'section11eType',
    label: 'Tax Write-Off Period',
    type: 'select',
    default: 'pc-2yr',
    options: [
      { value: 'pc-2yr', label: 'Standard Software (2-year write-off)' },
      { value: 'mainframe-5yr', label: 'Complex Systems (5-year write-off)' },
    ],
    category: 'tax',
    hint: 'Section 11(e) tax depreciation. Most software qualifies for 2-year treatment.',
  },
  {
    name: 'corporateTaxRate',
    label: 'Corporate Tax Rate (%)',
    type: 'percent',
    default: 27,
    min: 0,
    max: 50,
    step: 1,
    category: 'tax',
    hint: 'South African corporate income tax rate (currently 27%)',
  },
];

// ============================================================
// MODEL EXPORT
// ============================================================

/**
 * Complete Model 1 definition for registry
 */
export const MODEL_1_COST_PLUS = {
  id: 'model-1',
  name: 'Development Services (Cost-Plus)',
  shortName: 'Cost-Plus',
  description: 'Developer creates software for Buyer as a service. IP ownership goes to Buyer.',
  category: 'intercompany',

  inputCategories: INPUT_CATEGORIES,
  baseInputFields: BASE_INPUT_FIELDS,
  variants: VARIANTS,
  defaultVariant: '1B' as CostPlusVariantId,

  calculate,

  // UI hints
  icon: '💻',
  color: '#3B82F6', // Blue

  // Accounting summary
  accountingSummary: {
    developer: 'Revenue recognition over time (IFRS 15). No intangible asset recognised.',
    buyer: 'Capitalise development costs as intangible asset (IAS 38). Expense research costs.',
  },
} as const;
