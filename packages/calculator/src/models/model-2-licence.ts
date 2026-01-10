/**
 * Model 2: Software Licence with Royalties
 *
 * Developer develops and owns the IP, then grants a licence to the Buyer.
 * Buyer pays upfront fees, ongoing royalties, or both.
 *
 * Key characteristics:
 * - Developer: Retains IP, recognises intangible asset, earns licence/royalty revenue
 * - Buyer: Capitalises licence cost, expenses royalties as incurred
 * - Transfer pricing: Arm's length royalty rates (typically 1-25% depending on industry)
 */

import type {
  Currency,
  Percentage,
  Years,
  Section11eType,
  RevenueRecognitionTiming,
} from '../types/common.js';

import type {
  BenchmarkRange,
  AmortisationScheduleYear,
  CalculationResult,
  DeveloperPerspective,
  BuyerPerspective,
  TransferPricingAssessment,
} from '../types/results.js';

// ============================================================
// INPUT TYPES
// ============================================================

export type LicenceType = 'perpetual' | 'term';
export type Exclusivity = 'exclusive' | 'non-exclusive';
export type Territory = 'south-africa' | 'africa' | 'global';
export type SourceCodeAccess = 'none' | 'escrow' | 'full';
export type UsageMetric = 'transactions' | 'users' | 'revenue' | 'api-calls';
export type ShareBasis = 'gross-revenue' | 'net-revenue' | 'gross-profit' | 'net-profit';

interface LicenceBaseInputs {
  projectName: string;
  developmentCost: Currency;
  researchPhaseCost: Currency;
  developmentPhaseCost: Currency;
  developerUsefulLife: Years;
  licenceType: LicenceType;
  licenceTerm: Years;
  exclusivity: Exclusivity;
  territory: Territory;
  sourceCodeAccess: SourceCodeAccess;
  buyerUsefulLife: Years;
  implementationCosts: Currency;
  section11eType: Section11eType;
  corporateTaxRate: Percentage;
}

// Variant-specific input types
export interface Variant2AInputs extends LicenceBaseInputs {
  variant: '2A';
  upfrontLicenceFee: Currency;
}

export interface Variant2BInputs extends LicenceBaseInputs {
  variant: '2B';
  annualLicenceFee: Currency;
  renewalExpected: 'yes' | 'no';
}

export interface Variant2CInputs extends LicenceBaseInputs {
  variant: '2C';
  royaltyRate: Percentage;
  usageMetric: UsageMetric;
  estimatedAnnualUsage: number;
  usageUnitValue: Currency;
}

export interface Variant2DInputs extends LicenceBaseInputs {
  variant: '2D';
  minimumAnnualGuarantee: Currency;
  royaltyRate: Percentage;
  usageThreshold: number;
  estimatedAnnualUsage: number;
  usageUnitValue: Currency;
}

export interface Variant2EInputs extends LicenceBaseInputs {
  variant: '2E';
  sharePercentage: Percentage;
  shareBasis: ShareBasis;
  estimatedAnnualBuyerRevenue: Currency;
  buyerGrossMargin: Percentage;
}

export interface Variant2FInputs extends LicenceBaseInputs {
  variant: '2F';
  distributionFee: Currency;
  perSaleRoyalty: Percentage;
  estimatedEndCustomerSales: number;
  endCustomerPricePoint: Currency;
}

export interface Variant2GInputs extends LicenceBaseInputs {
  variant: '2G';
  baseLicenceFee: Currency;
  exclusivityPremium: Percentage;
  estimatedOtherLicensees: number;
}

export interface Variant2HInputs extends LicenceBaseInputs {
  variant: '2H';
  baseLicenceFee: Currency;
  sourceCodeFee: Currency;
  escrowSetupFee: Currency;
  escrowAnnualFee: Currency;
  escrowTriggersDefined: 'yes' | 'no';
}

export type LicenceInputs =
  | Variant2AInputs
  | Variant2BInputs
  | Variant2CInputs
  | Variant2DInputs
  | Variant2EInputs
  | Variant2FInputs
  | Variant2GInputs
  | Variant2HInputs;

export type LicenceVariantId = '2A' | '2B' | '2C' | '2D' | '2E' | '2F' | '2G' | '2H';

// ============================================================
// VARIANT DEFINITIONS
// ============================================================

export interface VariantDefinition {
  id: LicenceVariantId;
  name: string;
  description: string;
  scenario: string;
}

export const VARIANTS: Record<LicenceVariantId, VariantDefinition> = {
  '2A': {
    id: '2A',
    name: 'Perpetual Licence (Upfront Payment)',
    description: 'One-time payment for indefinite use rights',
    scenario: 'Buyer wants permanent rights without ongoing obligations; Developer needs upfront capital',
  },
  '2B': {
    id: '2B',
    name: 'Term Licence (Annual/Multi-Year)',
    description: 'Fixed period licence with renewal option',
    scenario: 'Buyer uncertain about long-term needs; Developer wants ongoing relationship',
  },
  '2C': {
    id: '2C',
    name: 'Usage-Based Royalties',
    description: 'Pay per transaction/user/metric',
    scenario: 'Usage is variable; align cost with value received',
  },
  '2D': {
    id: '2D',
    name: 'Minimum Guarantee Plus Royalties',
    description: 'Floor payment plus variable upside',
    scenario: 'Developer needs revenue certainty; Buyer expects high usage',
  },
  '2E': {
    id: '2E',
    name: 'Revenue Share / Profit Share',
    description: 'Percentage of Buyer earnings',
    scenario: 'Strong alignment of interests; software directly generates Buyer revenue',
  },
  '2F': {
    id: '2F',
    name: 'White-Label / Reseller Licence',
    description: 'Buyer rebrands and sells to end customers',
    scenario: 'Developer lacks distribution; Buyer has market access',
  },
  '2G': {
    id: '2G',
    name: 'Exclusive vs Non-Exclusive Licence',
    description: 'Compare sole rights versus shared rights',
    scenario: 'Buyer needs competitive protection; willing to pay premium',
  },
  '2H': {
    id: '2H',
    name: 'Source Code Licence / Escrow',
    description: 'Access to source code included',
    scenario: 'Buyer concerned about Developer continuity; may need to self-maintain',
  },
};

// ============================================================
// CONSTANTS
// ============================================================

export const BENCHMARK_RANGE: BenchmarkRange = {
  low: 1,
  median: 10,
  high: 25,
  extremeHigh: 35,
};

// ============================================================
// CALCULATION FUNCTIONS
// ============================================================

interface RevenueAndCosts {
  developerRevenue: Currency;
  buyerCosts: Currency;
  revenueBreakdown: {
    upfront: Currency;
    annual: Currency;
    royalties: Currency;
    other: Currency;
  };
  costBreakdown: {
    capitalised: Currency;
    expensed: Currency;
    royalties: Currency;
    implementation: Currency;
  };
}

function calculateRevenueAndCosts(inputs: LicenceInputs): RevenueAndCosts {
  const licenceTerm = inputs.licenceType === 'perpetual'
    ? inputs.buyerUsefulLife
    : inputs.licenceTerm;

  const revenueBreakdown = { upfront: 0, annual: 0, royalties: 0, other: 0 };
  const costBreakdown = {
    capitalised: 0,
    expensed: 0,
    royalties: 0,
    implementation: inputs.implementationCosts,
  };

  let developerRevenue = 0;
  let buyerCosts = 0;

  switch (inputs.variant) {
    case '2A': {
      developerRevenue = inputs.upfrontLicenceFee;
      buyerCosts = inputs.upfrontLicenceFee + inputs.implementationCosts;
      revenueBreakdown.upfront = inputs.upfrontLicenceFee;
      costBreakdown.capitalised = inputs.upfrontLicenceFee + inputs.implementationCosts;
      break;
    }

    case '2B': {
      const totalTermFees = inputs.annualLicenceFee * licenceTerm;
      developerRevenue = totalTermFees;
      buyerCosts = totalTermFees + inputs.implementationCosts;
      revenueBreakdown.annual = totalTermFees;
      costBreakdown.capitalised = inputs.annualLicenceFee + inputs.implementationCosts;
      costBreakdown.expensed = (licenceTerm - 1) * inputs.annualLicenceFee;
      break;
    }

    case '2C': {
      const annualRoyalty = inputs.estimatedAnnualUsage * inputs.usageUnitValue * (inputs.royaltyRate / 100);
      const totalRoyalties = annualRoyalty * licenceTerm;
      developerRevenue = totalRoyalties;
      buyerCosts = totalRoyalties + inputs.implementationCosts;
      revenueBreakdown.royalties = totalRoyalties;
      costBreakdown.expensed = totalRoyalties;
      costBreakdown.capitalised = inputs.implementationCosts;
      break;
    }

    case '2D': {
      const excessUsage = Math.max(0, inputs.estimatedAnnualUsage - inputs.usageThreshold);
      const variableRoyalty = excessUsage * inputs.usageUnitValue * (inputs.royaltyRate / 100);
      const annualPayment = inputs.minimumAnnualGuarantee + variableRoyalty;
      const totalPayments = annualPayment * licenceTerm;
      developerRevenue = totalPayments;
      buyerCosts = totalPayments + inputs.implementationCosts;
      revenueBreakdown.upfront = inputs.minimumAnnualGuarantee * licenceTerm;
      revenueBreakdown.royalties = variableRoyalty * licenceTerm;
      costBreakdown.capitalised = inputs.implementationCosts;
      costBreakdown.expensed = totalPayments;
      break;
    }

    case '2E': {
      let shareBasis = inputs.estimatedAnnualBuyerRevenue;
      if (inputs.shareBasis === 'gross-profit') {
        shareBasis = inputs.estimatedAnnualBuyerRevenue * (inputs.buyerGrossMargin / 100);
      } else if (inputs.shareBasis === 'net-profit') {
        shareBasis = inputs.estimatedAnnualBuyerRevenue * (inputs.buyerGrossMargin / 100) * 0.7;
      } else if (inputs.shareBasis === 'net-revenue') {
        shareBasis = inputs.estimatedAnnualBuyerRevenue * 0.9;
      }
      const annualShare = shareBasis * (inputs.sharePercentage / 100);
      const totalShares = annualShare * licenceTerm;
      developerRevenue = totalShares;
      buyerCosts = totalShares + inputs.implementationCosts;
      revenueBreakdown.royalties = totalShares;
      costBreakdown.expensed = totalShares;
      costBreakdown.capitalised = inputs.implementationCosts;
      break;
    }

    case '2F': {
      const annualRoyalties = inputs.estimatedEndCustomerSales * inputs.endCustomerPricePoint * (inputs.perSaleRoyalty / 100);
      const totalRoyalties = annualRoyalties * licenceTerm;
      developerRevenue = inputs.distributionFee + totalRoyalties;
      buyerCosts = inputs.distributionFee + totalRoyalties + inputs.implementationCosts;
      revenueBreakdown.upfront = inputs.distributionFee;
      revenueBreakdown.royalties = totalRoyalties;
      costBreakdown.capitalised = inputs.distributionFee + inputs.implementationCosts;
      costBreakdown.royalties = totalRoyalties;
      break;
    }

    case '2G': {
      const isExclusive = inputs.exclusivity === 'exclusive';
      const actualFee = isExclusive
        ? inputs.baseLicenceFee * (1 + inputs.exclusivityPremium / 100)
        : inputs.baseLicenceFee;
      developerRevenue = actualFee;
      buyerCosts = actualFee + inputs.implementationCosts;
      revenueBreakdown.upfront = actualFee;
      costBreakdown.capitalised = actualFee + inputs.implementationCosts;
      break;
    }

    case '2H': {
      const sourceCodeFee = inputs.sourceCodeAccess === 'full' ? inputs.sourceCodeFee : 0;
      const escrowSetup = inputs.sourceCodeAccess === 'escrow' ? inputs.escrowSetupFee : 0;
      const escrowAnnual = inputs.sourceCodeAccess === 'escrow' ? inputs.escrowAnnualFee * licenceTerm : 0;
      const upfrontTotal = inputs.baseLicenceFee + sourceCodeFee + escrowSetup;
      const totalPayments = upfrontTotal + escrowAnnual;
      developerRevenue = totalPayments;
      buyerCosts = totalPayments + inputs.implementationCosts;
      revenueBreakdown.upfront = upfrontTotal;
      revenueBreakdown.other = escrowAnnual;
      costBreakdown.capitalised = upfrontTotal + inputs.implementationCosts;
      costBreakdown.expensed = escrowAnnual;
      break;
    }
  }

  return { developerRevenue, buyerCosts, revenueBreakdown, costBreakdown };
}

function calculateDeveloperPerspective(
  revenue: Currency,
  revenueBreakdown: RevenueAndCosts['revenueBreakdown'],
  inputs: LicenceInputs,
  variantId: LicenceVariantId
): DeveloperPerspective {
  const taxRate = inputs.corporateTaxRate / 100;
  const developmentCost = inputs.developmentPhaseCost;
  const developerUsefulLife = inputs.developerUsefulLife;
  const annualAmortisation = developmentCost / developerUsefulLife;

  const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
  const taxDepreciation = developmentCost / section11eYears;

  const licenceTerm = inputs.licenceType === 'perpetual' ? inputs.buyerUsefulLife : inputs.licenceTerm;

  let recognitionTiming: RevenueRecognitionTiming = 'point-in-time';
  let recognitionBasis = 'IFRS 15 - point in time (right to use)';

  if (['2C', '2D', '2E', '2F'].includes(variantId)) {
    recognitionTiming = 'over-time';
    recognitionBasis = 'IFRS 15 - over time (sales-based royalty exception)';
  } else if (variantId === '2B' && (inputs as Variant2BInputs).renewalExpected !== 'yes') {
    recognitionTiming = 'over-time';
    recognitionBasis = 'IFRS 15 - over time (right to access)';
  }

  const annualRevenue = revenue / licenceTerm;
  const grossProfit = annualRevenue - annualAmortisation;
  const taxPayable = Math.max(0, grossProfit * taxRate);
  const netProfit = grossProfit - taxPayable;

  const timingDifference = annualAmortisation - taxDepreciation;
  const deferredTax = timingDifference * taxRate;

  return {
    revenue: {
      total: revenue,
      breakdown: {
        development: 0,
        licence: revenueBreakdown.upfront + revenueBreakdown.annual,
        royalties: revenueBreakdown.royalties,
        maintenance: 0,
        services: revenueBreakdown.other,
      },
      recognitionTiming,
      recognitionBasis,
    },
    costs: {
      total: inputs.researchPhaseCost + annualAmortisation * licenceTerm,
      breakdown: {
        personnel: developmentCost * 0.7,
        infrastructure: developmentCost * 0.2,
        other: developmentCost * 0.1,
      },
    },
    profit: {
      gross: grossProfit,
      margin: annualRevenue > 0 ? (grossProfit / annualRevenue) * 100 : 0,
      net: netProfit,
    },
    asset: {
      recognised: true,
      reason: 'Internally developed software - IAS 38 criteria met',
      carryingValue: developmentCost,
    },
    tax: {
      taxableIncome: grossProfit,
      corporateTaxRate: inputs.corporateTaxRate,
      taxPayable,
      effectiveTaxRate: annualRevenue > 0 ? (taxPayable / annualRevenue) * 100 : 0,
      deferredTaxAsset: deferredTax > 0 ? deferredTax : 0,
      deferredTaxLiability: deferredTax < 0 ? Math.abs(deferredTax) : 0,
    },
  };
}

function calculateBuyerPerspective(
  totalCost: Currency,
  costBreakdown: RevenueAndCosts['costBreakdown'],
  inputs: LicenceInputs
): BuyerPerspective {
  const taxRate = inputs.corporateTaxRate / 100;
  const capitalisedAmount = costBreakdown.capitalised;
  const expensedAmount = costBreakdown.expensed;

  const licenceTerm = inputs.licenceType === 'perpetual'
    ? inputs.buyerUsefulLife
    : Math.min(inputs.licenceTerm, inputs.buyerUsefulLife);

  const annualAmortisation = capitalisedAmount > 0 ? capitalisedAmount / licenceTerm : 0;
  const annualRoyaltyExpense = expensedAmount / licenceTerm;

  const section11eYears = inputs.section11eType === 'mainframe-5yr' ? 5 : 2;
  const taxDepreciation = capitalisedAmount / section11eYears;

  const timingDifference = annualAmortisation - taxDepreciation;
  const deferredTax = timingDifference * taxRate;
  const taxBenefit = (taxDepreciation + annualRoyaltyExpense) * taxRate;

  const schedule: AmortisationScheduleYear[] = [];
  for (let year = 1; year <= licenceTerm; year++) {
    schedule.push({
      year,
      openingBalance: capitalisedAmount - annualAmortisation * (year - 1),
      amortisation: annualAmortisation,
      closingBalance: Math.max(0, capitalisedAmount - annualAmortisation * year),
    });
  }

  return {
    asset: {
      recognised: capitalisedAmount > 0,
      capitalised: capitalisedAmount,
      expensed: expensedAmount,
      carryingValue: capitalisedAmount,
      usefulLife: licenceTerm,
      amortisationMethod: 'straight-line',
      annualAmortisation,
      section11eType: inputs.section11eType,
      section11eYears,
    },
    expenses: {
      year1: {
        researchExpense: 0,
        amortisation: annualAmortisation,
        total: annualAmortisation + annualRoyaltyExpense,
      },
      ongoing: {
        amortisation: annualAmortisation,
        maintenance: annualRoyaltyExpense,
        total: annualAmortisation + annualRoyaltyExpense,
      },
      schedule,
    },
    tax: {
      section11eDeduction: taxDepreciation,
      accountingAmortisation: annualAmortisation,
      timingDifference,
      deferredTaxAsset: deferredTax > 0 ? deferredTax : 0,
      deferredTaxLiability: deferredTax < 0 ? Math.abs(deferredTax) : 0,
      taxBenefit,
    },
    totalCost,
  };
}

function getDocumentationRequirements(variantId: LicenceVariantId): string[] {
  const base = [
    'Written licence agreement with clear terms',
    'Transfer pricing policy document',
    'Functional analysis documenting value drivers',
  ];

  const specific: Record<LicenceVariantId, string[]> = {
    '2A': ['Independent software valuation', 'Comparable licence transaction analysis'],
    '2B': ['Right to use vs access assessment', 'Renewal probability documentation'],
    '2C': ['Usage tracking methodology', 'Royalty rate benchmarking study'],
    '2D': ['Minimum guarantee justification', 'Usage projection basis'],
    '2E': ['Profit attribution methodology', 'Revenue/profit share benchmarks'],
    '2F': ['Distribution rights valuation', 'End-market comparable analysis'],
    '2G': ['Exclusivity premium justification', 'Market exclusion value analysis'],
    '2H': ['Source code valuation', 'Escrow arrangement justification'],
  };

  return [...base, ...specific[variantId]];
}

function assessTransferPricing(
  inputs: LicenceInputs,
  variantId: LicenceVariantId,
  developerRevenue: Currency
): TransferPricingAssessment {
  const developmentCost = inputs.developmentPhaseCost;
  const impliedReturn = developmentCost > 0 ? (developerRevenue / developmentCost) * 100 : 0;

  // For royalty-based variants, check actual royalty rate
  if (['2C', '2D'].includes(variantId)) {
    const actualRate = (inputs as Variant2CInputs | Variant2DInputs).royaltyRate;
    const withinRange = actualRate >= BENCHMARK_RANGE.low && actualRate <= BENCHMARK_RANGE.high;

    let riskScore: number;
    let riskLevel: 'low' | 'medium' | 'high';

    if (withinRange) {
      riskScore = 85;
      riskLevel = 'low';
    } else if (actualRate <= BENCHMARK_RANGE.extremeHigh) {
      riskScore = 60;
      riskLevel = 'medium';
    } else {
      riskScore = 35;
      riskLevel = 'high';
    }

    return {
      method: 'royalty-rate',
      margin: actualRate,
      benchmarkRange: BENCHMARK_RANGE,
      withinRange,
      riskScore,
      riskLevel,
      recommendation: withinRange
        ? "Royalty rate is within arm's length range"
        : `Consider adjusting rate toward ${BENCHMARK_RANGE.median}% (median benchmark)`,
      documentation: getDocumentationRequirements(variantId),
    };
  }

  // For other variants, assess based on implied return on IP
  const withinRange = impliedReturn >= 50 && impliedReturn <= 300;
  const withinExtendedRange = impliedReturn >= 25 && impliedReturn <= 500;

  let riskScore: number;
  let riskLevel: 'low' | 'medium' | 'high';

  if (withinRange) {
    riskScore = 85;
    riskLevel = 'low';
  } else if (withinExtendedRange) {
    riskScore = 65;
    riskLevel = 'medium';
  } else {
    riskScore = 40;
    riskLevel = 'high';
  }

  return {
    method: 'CUP',
    margin: impliedReturn,
    benchmarkRange: { low: 50, median: 150, high: 300, extremeHigh: 500 },
    withinRange,
    riskScore,
    riskLevel,
    recommendation: withinRange
      ? "Licence pricing appears arm's length based on return on IP"
      : 'Consider obtaining independent valuation or comparable transaction analysis',
    documentation: getDocumentationRequirements(variantId),
  };
}

// ============================================================
// MAIN CALCULATION FUNCTION
// ============================================================

export function calculate(inputs: LicenceInputs): CalculationResult {
  const variant = VARIANTS[inputs.variant];
  const { developerRevenue, buyerCosts, revenueBreakdown, costBreakdown } = calculateRevenueAndCosts(inputs);

  const developer = calculateDeveloperPerspective(developerRevenue, revenueBreakdown, inputs, inputs.variant);
  const buyer = calculateBuyerPerspective(buyerCosts, costBreakdown, inputs);
  const transferPricing = assessTransferPricing(inputs, inputs.variant, developerRevenue);

  return {
    developer,
    buyer,
    transferPricing,
    metadata: {
      modelId: 'model-2',
      modelName: 'Software Licence with Royalties',
      variantId: inputs.variant,
      variantName: variant.name,
      calculatedAt: new Date().toISOString(),
    },
  };
}

// ============================================================
// MODEL EXPORT
// ============================================================

export const MODEL_2_LICENCE = {
  id: 'model-2',
  name: 'Software Licence with Royalties',
  shortName: 'Licence/Royalties',
  description: 'Developer owns IP and grants licence to Buyer. Buyer pays upfront fees, royalties, or both.',
  category: 'intercompany',
  variants: VARIANTS,
  defaultVariant: '2A' as LicenceVariantId,
  calculate,
  icon: '📜',
  color: '#8B5CF6',
  accountingSummary: {
    developer: 'Capitalise development costs (IAS 38). Recognise licence revenue per IFRS 15.',
    buyer: 'Capitalise licence fees (IAS 38). Expense royalties as incurred.',
  },
} as const;
