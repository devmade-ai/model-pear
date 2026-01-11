/**
 * Structure Selector Wizard - Decision Tree Configuration
 *
 * Questions and scoring logic to help users select the optimal
 * software transaction structure (model and variant).
 */

// ============================================================
// TYPES
// ============================================================

export type ModelId = 'model-1' | 'model-2' | 'model-3' | 'model-4' | 'model-5' | 'model-6';

export interface ModelScores {
  'model-1': number;
  'model-2': number;
  'model-3': number;
  'model-4': number;
  'model-5': number;
  'model-6': number;
}

export interface QuestionOption {
  value: string;
  label: string;
  description: string;
  modelScores: ModelScores;
}

export interface Question {
  id: string;
  question: string;
  description: string;
  options: QuestionOption[];
}

export interface MatchLevel {
  label: string;
  color: 'green' | 'blue' | 'yellow' | 'red';
  icon: string;
}

export interface ModelRecommendation {
  modelId: ModelId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  rawScore: number;
  normalizedScore: number;
  matchLevel: MatchLevel;
  strengths: Array<{ factor: string; reason: string; score: number }>;
  weaknesses: Array<{ factor: string; reason: string; score: number }>;
}

export interface VariantOption {
  value: string;
  label: string;
  variants: string[];
  scenario: string;
}

export interface VariantFactors {
  question: string;
  factors: VariantOption[];
}

// ============================================================
// DECISION FACTORS (QUESTIONS)
// ============================================================

export const DECISION_FACTORS: Record<string, Question> = {
  softwareMaturity: {
    id: 'softwareMaturity',
    question: 'What is the software development stage?',
    description: 'Is this new development or existing software',
    options: [
      {
        value: 'new-development',
        label: 'New software to be developed',
        description: 'Software will be created from scratch',
        modelScores: { 'model-1': 10, 'model-3': 10, 'model-4': 8, 'model-2': 3, 'model-5': 0, 'model-6': 3 },
      },
      {
        value: 'existing-transfer',
        label: 'Existing software to transfer',
        description: 'Completed software changing ownership or being licensed',
        modelScores: { 'model-5': 10, 'model-2': 10, 'model-4': 5, 'model-6': 5, 'model-1': 0, 'model-3': 0 },
      },
      {
        value: 'existing-enhance',
        label: 'Existing software to enhance',
        description: 'Existing software needs further development',
        modelScores: { 'model-3': 8, 'model-1': 7, 'model-4': 7, 'model-2': 5, 'model-6': 5, 'model-5': 3 },
      },
      {
        value: 'saas-service',
        label: 'Delivered as ongoing service',
        description: 'Software provided as a service, not a product',
        modelScores: { 'model-6': 10, 'model-4': 8, 'model-2': 5, 'model-1': 0, 'model-3': 2, 'model-5': 0 },
      },
    ],
  },

  ipOwnership: {
    id: 'ipOwnership',
    question: 'Who should own the intellectual property (IP)?',
    description: 'Determines where the software asset sits on the balance sheet',
    options: [
      {
        value: 'buyer',
        label: 'Client should own IP',
        description: 'Client controls development and owns the resulting asset',
        modelScores: { 'model-1': 10, 'model-3': 5, 'model-4': 3, 'model-5': 8, 'model-2': 0, 'model-6': 0 },
      },
      {
        value: 'developer',
        label: 'Your company should retain IP',
        description: 'You keep IP and grant usage rights to client',
        modelScores: { 'model-1': 0, 'model-2': 10, 'model-6': 10, 'model-4': 5, 'model-3': 3, 'model-5': 0 },
      },
      {
        value: 'shared',
        label: 'Shared/Joint ownership',
        description: 'Both parties have ownership rights based on contribution',
        modelScores: { 'model-3': 10, 'model-4': 3, 'model-1': 0, 'model-2': 2, 'model-5': 0, 'model-6': 2 },
      },
      {
        value: 'transfer-later',
        label: 'Your company initially, transfer to client later',
        description: 'You build and operate, ownership transfers at agreed point',
        modelScores: { 'model-4': 10, 'model-5': 8, 'model-2': 3, 'model-1': 0, 'model-3': 2, 'model-6': 5 },
      },
    ],
  },

  controlPreference: {
    id: 'controlPreference',
    question: 'Who should control the development process?',
    description: 'Who directs how the software is built and makes key decisions',
    options: [
      {
        value: 'buyer-controls',
        label: 'Client controls development',
        description: 'Client specifies requirements and directs development',
        modelScores: { 'model-1': 10, 'model-3': 5, 'model-4': 3, 'model-5': 3, 'model-2': 0, 'model-6': 0 },
      },
      {
        value: 'developer-controls',
        label: 'Your company controls development',
        description: 'You make technical decisions independently',
        modelScores: { 'model-2': 10, 'model-6': 10, 'model-4': 7, 'model-5': 5, 'model-3': 3, 'model-1': 0 },
      },
      {
        value: 'joint-control',
        label: 'Joint control/collaboration',
        description: 'Both parties jointly direct development',
        modelScores: { 'model-3': 10, 'model-4': 5, 'model-1': 3, 'model-2': 3, 'model-5': 2, 'model-6': 2 },
      },
    ],
  },

  cashFlowPreference: {
    id: 'cashFlowPreference',
    question: 'What is the preferred cash flow structure?',
    description: 'How should payments flow between parties over time',
    options: [
      {
        value: 'upfront',
        label: 'Upfront payment (one-time)',
        description: 'Single payment at project completion or asset transfer',
        modelScores: { 'model-5': 10, 'model-1': 8, 'model-2': 5, 'model-3': 3, 'model-4': 2, 'model-6': 0 },
      },
      {
        value: 'milestone',
        label: 'Milestone-based payments',
        description: 'Payments tied to project deliverables and stages',
        modelScores: { 'model-1': 10, 'model-4': 7, 'model-3': 5, 'model-5': 5, 'model-2': 3, 'model-6': 0 },
      },
      {
        value: 'recurring',
        label: 'Recurring payments (subscription/royalty)',
        description: 'Ongoing periodic payments over time',
        modelScores: { 'model-6': 10, 'model-2': 9, 'model-4': 5, 'model-5': 4, 'model-1': 0, 'model-3': 2 },
      },
      {
        value: 'usage-based',
        label: 'Usage/revenue-based payments',
        description: 'Payments linked to actual usage or revenue generated',
        modelScores: { 'model-2': 10, 'model-6': 8, 'model-3': 5, 'model-4': 3, 'model-1': 0, 'model-5': 2 },
      },
      {
        value: 'hybrid',
        label: 'Hybrid (upfront + ongoing)',
        description: 'Initial payment plus recurring or usage-based fees',
        modelScores: { 'model-5': 10, 'model-2': 8, 'model-4': 7, 'model-6': 5, 'model-1': 3, 'model-3': 3 },
      },
    ],
  },

  riskAllocation: {
    id: 'riskAllocation',
    question: 'How should development and commercial risk be allocated?',
    description: 'Who bears the risk if development fails or the software underperforms',
    options: [
      {
        value: 'buyer-bears-all',
        label: 'Client bears all risk',
        description: 'You are paid regardless of outcome; client takes development and commercial risk',
        modelScores: { 'model-1': 10, 'model-6': 7, 'model-5': 3, 'model-2': 2, 'model-3': 0, 'model-4': 2 },
      },
      {
        value: 'developer-bears-dev',
        label: 'Your company bears development risk',
        description: 'You take risk on building; client takes commercial risk',
        modelScores: { 'model-2': 10, 'model-5': 8, 'model-4': 7, 'model-6': 5, 'model-3': 3, 'model-1': 0 },
      },
      {
        value: 'shared-risk',
        label: 'Shared risk (both parties)',
        description: 'Both parties share development and commercial risks',
        modelScores: { 'model-3': 10, 'model-4': 5, 'model-2': 4, 'model-6': 3, 'model-1': 2, 'model-5': 2 },
      },
      {
        value: 'performance-linked',
        label: 'Performance-linked (your skin in game)',
        description: 'Your compensation tied to software performance',
        modelScores: { 'model-2': 10, 'model-3': 8, 'model-4': 5, 'model-6': 5, 'model-1': 3, 'model-5': 2 },
      },
    ],
  },

  assetRecognition: {
    id: 'assetRecognition',
    question: 'What is the priority for asset recognition?',
    description: 'Where the intangible asset should appear for accounting purposes',
    options: [
      {
        value: 'buyer-balance-sheet',
        label: 'Asset on client balance sheet',
        description: 'Client wants to capitalise and show the asset',
        modelScores: { 'model-1': 10, 'model-5': 10, 'model-3': 7, 'model-4': 5, 'model-2': 3, 'model-6': 0 },
      },
      {
        value: 'developer-balance-sheet',
        label: 'Asset on your balance sheet',
        description: 'You want to retain and show the asset',
        modelScores: { 'model-2': 10, 'model-6': 10, 'model-4': 7, 'model-3': 5, 'model-1': 0, 'model-5': 0 },
      },
      {
        value: 'both-balance-sheets',
        label: 'Asset on both balance sheets',
        description: 'Both parties want to capitalise and show an asset',
        modelScores: { 'model-3': 10, 'model-4': 8, 'model-2': 7, 'model-1': 3, 'model-5': 2, 'model-6': 0 },
      },
      {
        value: 'minimize-assets',
        label: 'Minimise balance sheet assets',
        description: 'Prefer operational expense treatment over capitalisation',
        modelScores: { 'model-6': 10, 'model-2': 7, 'model-4': 5, 'model-1': 2, 'model-3': 2, 'model-5': 0 },
      },
      {
        value: 'tax-efficient',
        label: 'Optimise for tax efficiency',
        description: 'Prioritise accelerated tax deductions (Section 11(e))',
        modelScores: { 'model-1': 8, 'model-5': 8, 'model-2': 5, 'model-4': 5, 'model-3': 5, 'model-6': 3 },
      },
    ],
  },
};

// Order of questions in the wizard
export const QUESTION_ORDER = [
  'softwareMaturity',
  'ipOwnership',
  'controlPreference',
  'cashFlowPreference',
  'riskAllocation',
  'assetRecognition',
] as const;

// ============================================================
// MODEL METADATA
// ============================================================

export const MODEL_METADATA: Record<ModelId, { name: string; shortName: string; description: string; icon: string }> = {
  'model-1': {
    name: 'Development Services (Cost-Plus)',
    shortName: 'Cost-Plus',
    description: 'Client pays for development services; receives completed software as an asset',
    icon: '🛠️',
  },
  'model-2': {
    name: 'Software Licence with Royalties',
    shortName: 'Licence',
    description: 'Developer retains IP and grants usage rights to client for fees/royalties',
    icon: '📜',
  },
  'model-3': {
    name: 'Joint Development / Cost-Sharing',
    shortName: 'Joint Dev',
    description: 'Both parties contribute to development and share IP ownership',
    icon: '🤝',
  },
  'model-4': {
    name: 'Build-Operate-Transfer (BOT)',
    shortName: 'BOT',
    description: 'Developer builds and operates software, then transfers to client',
    icon: '🔄',
  },
  'model-5': {
    name: 'Software Sale with Ongoing Support',
    shortName: 'Sale',
    description: 'Outright sale of software with optional maintenance agreement',
    icon: '💰',
  },
  'model-6': {
    name: 'SaaS/Subscription Enhancement',
    shortName: 'SaaS',
    description: 'Ongoing service delivery with subscription pricing',
    icon: '☁️',
  },
};

// ============================================================
// SCORING FUNCTIONS
// ============================================================

export interface ScoreResult {
  rawScores: ModelScores;
  normalizedScores: ModelScores;
  maxPossibleScores: ModelScores;
}

/**
 * Calculate model scores based on user answers
 */
export function calculateModelScores(answers: Record<string, string>): ScoreResult {
  const scores: ModelScores = {
    'model-1': 0,
    'model-2': 0,
    'model-3': 0,
    'model-4': 0,
    'model-5': 0,
    'model-6': 0,
  };

  const maxPossibleScores: ModelScores = { ...scores };

  // Calculate scores from each answered factor
  Object.entries(answers).forEach(([factorId, selectedValue]) => {
    const factor = DECISION_FACTORS[factorId];
    if (!factor) return;

    const selectedOption = factor.options.find((opt) => opt.value === selectedValue);
    if (!selectedOption) return;

    (Object.keys(scores) as ModelId[]).forEach((modelId) => {
      scores[modelId] += selectedOption.modelScores[modelId];

      // Track max possible score for normalization
      const maxForFactor = Math.max(...factor.options.map((opt) => opt.modelScores[modelId]));
      maxPossibleScores[modelId] += maxForFactor;
    });
  });

  // Calculate normalized percentages
  const normalizedScores: ModelScores = {
    'model-1': 0,
    'model-2': 0,
    'model-3': 0,
    'model-4': 0,
    'model-5': 0,
    'model-6': 0,
  };

  (Object.keys(scores) as ModelId[]).forEach((modelId) => {
    const maxPossible = maxPossibleScores[modelId] || 1;
    normalizedScores[modelId] = Math.round((scores[modelId] / maxPossible) * 100);
  });

  return {
    rawScores: scores,
    normalizedScores,
    maxPossibleScores,
  };
}

/**
 * Get match level based on normalized score
 */
function getMatchLevel(score: number): MatchLevel {
  if (score >= 80) return { label: 'Excellent Match', color: 'green', icon: '✓✓' };
  if (score >= 60) return { label: 'Good Match', color: 'blue', icon: '✓' };
  if (score >= 40) return { label: 'Moderate Match', color: 'yellow', icon: '~' };
  return { label: 'Poor Match', color: 'red', icon: '✗' };
}

/**
 * Get ranked model recommendations
 */
export function getModelRecommendations(answers: Record<string, string>): ModelRecommendation[] {
  const { rawScores, normalizedScores } = calculateModelScores(answers);

  const recommendations: ModelRecommendation[] = (Object.keys(MODEL_METADATA) as ModelId[]).map((modelId) => {
    const metadata = MODEL_METADATA[modelId];
    const rawScore = rawScores[modelId];
    const normalizedScore = normalizedScores[modelId];

    // Gather reasons why this model scored well/poorly
    const strengths: ModelRecommendation['strengths'] = [];
    const weaknesses: ModelRecommendation['weaknesses'] = [];

    Object.entries(answers).forEach(([factorId, selectedValue]) => {
      const factor = DECISION_FACTORS[factorId];
      if (!factor) return;

      const selectedOption = factor.options.find((opt) => opt.value === selectedValue);
      if (!selectedOption) return;

      const score = selectedOption.modelScores[modelId];

      if (score >= 8) {
        strengths.push({
          factor: factor.question,
          reason: selectedOption.label,
          score,
        });
      } else if (score <= 2) {
        weaknesses.push({
          factor: factor.question,
          reason: selectedOption.label,
          score,
        });
      }
    });

    return {
      modelId,
      name: metadata.name,
      shortName: metadata.shortName,
      description: metadata.description,
      icon: metadata.icon,
      rawScore,
      normalizedScore,
      matchLevel: getMatchLevel(normalizedScore),
      strengths,
      weaknesses,
    };
  });

  // Sort by normalized score descending
  recommendations.sort((a, b) => b.normalizedScore - a.normalizedScore);

  return recommendations;
}

/**
 * Generate human-readable rationale for a model recommendation
 */
export function generateRationale(recommendation: ModelRecommendation): string {
  const { shortName, normalizedScore, strengths, weaknesses } = recommendation;
  const rationale: string[] = [];

  // Opening statement based on match level
  if (normalizedScore >= 80) {
    rationale.push(`${shortName} is highly recommended based on your requirements.`);
  } else if (normalizedScore >= 60) {
    rationale.push(`${shortName} is a good fit for your transaction structure.`);
  } else if (normalizedScore >= 40) {
    rationale.push(`${shortName} could work but may not be optimal for your needs.`);
  } else {
    rationale.push(`${shortName} is not well-suited to your requirements.`);
  }

  // Add key strengths
  if (strengths.length > 0) {
    rationale.push('');
    rationale.push('Key advantages:');
    strengths.slice(0, 3).forEach((s) => {
      rationale.push(`• ${s.reason} aligns well with this model`);
    });
  }

  // Add key concerns
  if (weaknesses.length > 0 && normalizedScore < 80) {
    rationale.push('');
    rationale.push('Considerations:');
    weaknesses.slice(0, 2).forEach((w) => {
      rationale.push(`• ${w.reason} is not typical for this model`);
    });
  }

  return rationale.join('\n');
}

// ============================================================
// VARIANT FACTORS
// ============================================================

export const VARIANT_FACTORS: Record<ModelId, VariantFactors> = {
  'model-1': {
    question: 'What pricing approach is preferred for the development services?',
    factors: [
      { value: 'zero-margin', label: 'Zero margin / pure cost recovery', variants: ['1A'], scenario: 'Internal group service or cost validation phase' },
      { value: 'fixed-margin', label: 'Fixed percentage markup on all costs', variants: ['1B'], scenario: "Standard arm's length arrangement" },
      { value: 'performance-bonus', label: 'Base margin plus milestone bonuses', variants: ['1C'], scenario: 'Incentivise quality and timely delivery' },
      { value: 'fixed-price', label: 'Fixed total price (lump sum)', variants: ['1D'], scenario: 'Budget certainty for Buyer, risk on Developer' },
      { value: 'time-materials', label: 'Time and materials billing', variants: ['1E'], scenario: 'Flexible scope, ongoing development' },
      { value: 'dedicated-team', label: 'Dedicated team with monthly fee', variants: ['1F'], scenario: 'Long-term resource commitment' },
    ],
  },
  'model-2': {
    question: 'What type of licence arrangement is needed?',
    factors: [
      { value: 'perpetual-upfront', label: 'Perpetual licence with upfront payment', variants: ['2A'], scenario: 'One-time acquisition, Buyer owns indefinitely' },
      { value: 'term-licence', label: 'Term/subscription licence (annual)', variants: ['2B'], scenario: 'Renewable licence, lower initial cost' },
      { value: 'usage-royalty', label: 'Usage-based or per-transaction royalties', variants: ['2C'], scenario: 'Payment linked to actual use/value generated' },
      { value: 'minimum-guarantee', label: 'Minimum guarantee plus royalties', variants: ['2D'], scenario: 'Developer guaranteed minimum, plus upside' },
      { value: 'revenue-share', label: 'Revenue or profit share', variants: ['2E'], scenario: 'Align interests, share commercial success' },
      { value: 'white-label', label: 'White-label / reseller licence', variants: ['2F'], scenario: 'Buyer rebrands and resells the software' },
      { value: 'exclusive', label: 'Exclusive vs non-exclusive comparison', variants: ['2G'], scenario: 'Evaluate exclusivity implications' },
      { value: 'source-code', label: 'Source code licence or escrow', variants: ['2H'], scenario: 'Buyer needs access to source code' },
    ],
  },
  'model-3': {
    question: 'How should the joint development be structured?',
    factors: [
      { value: 'equal-split', label: 'Equal 50/50 cost sharing', variants: ['3A'], scenario: 'Simple equal partnership' },
      { value: 'contribution-based', label: 'Based on actual contributions', variants: ['3B'], scenario: 'Ownership reflects what each party puts in' },
      { value: 'benefit-based', label: 'Based on expected benefits', variants: ['3C'], scenario: 'Ownership reflects anticipated value extraction' },
      { value: 'platform-app', label: 'Platform + application split', variants: ['3D'], scenario: 'One party builds platform, other builds apps' },
      { value: 'dev-commercialise', label: 'Development + commercialisation split', variants: ['3E'], scenario: 'One party develops, other commercialises' },
      { value: 'joint-venture', label: 'Joint venture entity (JV)', variants: ['3F'], scenario: 'Create separate legal entity to hold IP' },
      { value: 'consortium', label: 'Consortium / multi-party arrangement', variants: ['3G'], scenario: 'More than two parties involved' },
      { value: 'pre-competitive', label: 'Pre-competitive joint development', variants: ['3H'], scenario: 'Industry collaboration on shared technology' },
    ],
  },
  'model-4': {
    question: 'How should the Build-Operate-Transfer be structured?',
    factors: [
      { value: 'fixed-transfer', label: 'Fixed transfer price agreed upfront', variants: ['4A'], scenario: 'Certainty on transfer value from start' },
      { value: 'formula-transfer', label: 'Formula-based transfer price', variants: ['4B'], scenario: 'Price adjusts based on agreed metrics' },
      { value: 'fmv-transfer', label: 'Fair market value at transfer', variants: ['4C'], scenario: 'Valuation at time of transfer' },
      { value: 'purchase-option', label: 'BOT with purchase option', variants: ['4D'], scenario: 'Buyer has option but not obligation to acquire' },
      { value: 'no-transfer', label: 'Build-Operate-Own (no transfer)', variants: ['4E'], scenario: 'Developer retains ownership permanently' },
      { value: 'transfer-first', label: 'Build-Transfer-Operate (transfer first)', variants: ['4F'], scenario: 'Transfer immediately, then operate as service' },
      { value: 'lease', label: 'Build-Lease-Transfer (IFRS 16)', variants: ['4G'], scenario: 'Lease accounting treatment' },
      { value: 'phased', label: 'Phased transfer over time', variants: ['4H'], scenario: 'Gradual transition of ownership' },
    ],
  },
  'model-5': {
    question: 'What type of software sale structure is needed?',
    factors: [
      { value: 'clean-sale', label: 'Clean sale (no ongoing obligations)', variants: ['5A'], scenario: 'Simple outright sale, complete exit' },
      { value: 'sale-maintenance', label: 'Sale plus maintenance agreement', variants: ['5B'], scenario: 'Ongoing support and bug fixes' },
      { value: 'sale-support-updates', label: 'Sale plus support and updates', variants: ['5C'], scenario: 'Include enhancement and version updates' },
      { value: 'sale-warranty', label: 'Sale with warranty period', variants: ['5D'], scenario: 'Developer guarantees quality for period' },
      { value: 'sale-buyback', label: 'Sale with buyback commitment', variants: ['5E'], scenario: 'Developer may repurchase under conditions' },
      { value: 'sale-retained-improvements', label: 'Sale with retained improvement rights', variants: ['5F'], scenario: 'Developer keeps rights to improvements made' },
      { value: 'asset-vs-share', label: 'Asset sale vs share sale comparison', variants: ['5G'], scenario: 'Evaluate different legal structures' },
      { value: 'sale-licence-back', label: 'Sale with licence-back to Developer', variants: ['5H'], scenario: 'Buyer owns, Developer licensed to continue using' },
    ],
  },
  'model-6': {
    question: 'What type of SaaS/subscription model is appropriate?',
    factors: [
      { value: 'pure-saas', label: 'Pure SaaS (multi-tenant)', variants: ['6A'], scenario: 'Standard cloud service, shared infrastructure' },
      { value: 'dedicated-instance', label: 'Dedicated instance (single-tenant)', variants: ['6B'], scenario: 'Isolated environment for each customer' },
      { value: 'customisation', label: 'Subscription with customisation', variants: ['6C'], scenario: 'Standard platform plus customer-specific features' },
      { value: 'hybrid', label: 'Hybrid (cloud + on-premise)', variants: ['6D'], scenario: 'Part cloud, part local installation' },
      { value: 'freemium', label: 'Freemium / tiered pricing', variants: ['6E'], scenario: 'Free tier with paid upgrades' },
      { value: 'consumption', label: 'Consumption-based pricing', variants: ['6F'], scenario: 'Pay per use, API calls, transactions' },
      { value: 'enterprise', label: 'Enterprise agreement (committed spend)', variants: ['6G'], scenario: 'Large committed contract with volume discounts' },
      { value: 'private-label', label: 'Private label SaaS', variants: ['6H'], scenario: 'White-labelled SaaS for resale' },
      { value: 'transition', label: 'Managed service with transition rights', variants: ['6I'], scenario: 'Option to move to perpetual licence later' },
    ],
  },
};

/**
 * Get variant recommendation for a specific model
 */
export function getVariantRecommendation(
  modelId: ModelId,
  preferenceValue: string
): { selectedPreference: VariantOption; variants: string[]; scenario: string } | null {
  const modelFactors = VARIANT_FACTORS[modelId];
  if (!modelFactors) return null;

  const preference = modelFactors.factors.find((f) => f.value === preferenceValue);
  if (!preference) return null;

  return {
    selectedPreference: preference,
    variants: preference.variants,
    scenario: preference.scenario,
  };
}
