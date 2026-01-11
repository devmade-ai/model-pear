/**
 * Input field configurations for all transaction models
 *
 * Defines the inputs needed for each model in a data-driven way,
 * enabling dynamic form generation.
 */

export interface InputFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  category?: 'basic' | 'cost' | 'revenue' | 'tax' | 'timing';
}

// Common fields used across multiple models
const commonFields: Record<string, InputFieldConfig> = {
  projectName: {
    id: 'projectName',
    label: 'Project Name',
    type: 'text',
    category: 'basic',
  },
  developmentCost: {
    id: 'developmentCost',
    label: 'Development Cost (R)',
    type: 'number',
    min: 0,
    step: 10000,
    category: 'cost',
  },
  usefulLife: {
    id: 'usefulLife',
    label: 'Useful Life (Years)',
    type: 'number',
    min: 1,
    max: 20,
    step: 1,
    category: 'timing',
  },
  section11eType: {
    id: 'section11eType',
    label: 'Tax Write-Off Period',
    type: 'select',
    options: [
      { value: 'pc-2yr', label: 'Standard Software (2-year)' },
      { value: 'mainframe-5yr', label: 'Complex Systems (5-year)' },
    ],
    category: 'tax',
  },
  corporateTaxRate: {
    id: 'corporateTaxRate',
    label: 'Corporate Tax Rate (%)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    category: 'tax',
  },
};

// Model 1: Cost-Plus input fields
export const model1Fields: InputFieldConfig[] = [
  commonFields.projectName,
  commonFields.developmentCost,
  {
    id: 'markupPercentage',
    label: 'Markup Percentage (%)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    hint: "Arm's length range: 5-15%",
    category: 'revenue',
  },
  commonFields.usefulLife,
  commonFields.section11eType,
  commonFields.corporateTaxRate,
];

// Model 2: Licence input fields
export const model2Fields: InputFieldConfig[] = [
  commonFields.projectName,
  commonFields.developmentCost,
  {
    id: 'upfrontLicenceFee',
    label: 'Upfront Licence Fee (R)',
    type: 'number',
    min: 0,
    step: 10000,
    category: 'revenue',
  },
  {
    id: 'licenceType',
    label: 'Licence Type',
    type: 'select',
    options: [
      { value: 'perpetual', label: 'Perpetual' },
      { value: 'term', label: 'Term-based' },
    ],
    category: 'basic',
  },
  {
    id: 'exclusivity',
    label: 'Exclusivity',
    type: 'select',
    options: [
      { value: 'exclusive', label: 'Exclusive' },
      { value: 'non-exclusive', label: 'Non-Exclusive' },
    ],
    category: 'basic',
  },
  commonFields.usefulLife,
  commonFields.section11eType,
  commonFields.corporateTaxRate,
];

// Model 3: Joint Development input fields
export const model3Fields: InputFieldConfig[] = [
  commonFields.projectName,
  {
    id: 'totalProjectCost',
    label: 'Total Project Cost (R)',
    type: 'number',
    min: 0,
    step: 10000,
    category: 'cost',
  },
  {
    id: 'developerCashContribution',
    label: 'Developer Cash Contribution (R)',
    type: 'number',
    min: 0,
    step: 10000,
    hint: 'Your cash investment',
    category: 'cost',
  },
  {
    id: 'buyerCashContribution',
    label: 'Client Cash Contribution (R)',
    type: 'number',
    min: 0,
    step: 10000,
    hint: 'Client cash investment',
    category: 'cost',
  },
  {
    id: 'valuationMethod',
    label: 'Valuation Method',
    type: 'select',
    options: [
      { value: 'cost-basis', label: 'Cost Basis' },
      { value: 'fair-value', label: 'Fair Value' },
    ],
    category: 'basic',
  },
  commonFields.usefulLife,
  commonFields.section11eType,
  commonFields.corporateTaxRate,
];

// Model 4: BOT input fields
export const model4Fields: InputFieldConfig[] = [
  commonFields.projectName,
  commonFields.developmentCost,
  {
    id: 'operationPeriodYears',
    label: 'Operation Period (Years)',
    type: 'number',
    min: 1,
    max: 10,
    step: 1,
    category: 'timing',
  },
  {
    id: 'annualOperatingFee',
    label: 'Annual Operating Fee (R)',
    type: 'number',
    min: 0,
    step: 10000,
    category: 'revenue',
  },
  {
    id: 'fixedTransferPrice',
    label: 'Transfer Price (R)',
    type: 'number',
    min: 0,
    step: 10000,
    hint: 'Price at which ownership transfers',
    category: 'revenue',
  },
  commonFields.usefulLife,
  commonFields.section11eType,
  commonFields.corporateTaxRate,
];

// Model 5: Software Sale input fields
export const model5Fields: InputFieldConfig[] = [
  commonFields.projectName,
  commonFields.developmentCost,
  {
    id: 'salePrice',
    label: 'Sale Price (R)',
    type: 'number',
    min: 0,
    step: 10000,
    category: 'revenue',
  },
  {
    id: 'annualMaintenanceFee',
    label: 'Annual Maintenance Fee (R)',
    type: 'number',
    min: 0,
    step: 1000,
    category: 'revenue',
  },
  {
    id: 'maintenanceTerm',
    label: 'Maintenance Term (Years)',
    type: 'number',
    min: 1,
    max: 10,
    step: 1,
    category: 'timing',
  },
  commonFields.usefulLife,
  commonFields.section11eType,
  commonFields.corporateTaxRate,
];

// Model 6: SaaS input fields
export const model6Fields: InputFieldConfig[] = [
  commonFields.projectName,
  commonFields.developmentCost,
  {
    id: 'monthlySubscriptionFee',
    label: 'Monthly Subscription Fee (R)',
    type: 'number',
    min: 0,
    step: 1000,
    category: 'revenue',
  },
  {
    id: 'contractLengthMonths',
    label: 'Contract Length (Months)',
    type: 'number',
    min: 1,
    max: 60,
    step: 1,
    category: 'timing',
  },
  {
    id: 'annualHostingCost',
    label: 'Annual Hosting Cost (R)',
    type: 'number',
    min: 0,
    step: 1000,
    category: 'cost',
  },
  {
    id: 'pricingModel',
    label: 'Pricing Model',
    type: 'select',
    options: [
      { value: 'flat-rate', label: 'Flat Rate' },
      { value: 'per-user', label: 'Per User' },
      { value: 'usage-based', label: 'Usage Based' },
    ],
    category: 'basic',
  },
  commonFields.usefulLife,
  commonFields.section11eType,
  commonFields.corporateTaxRate,
];

// Export all field configurations by model ID
export const modelFieldConfigs: Record<string, InputFieldConfig[]> = {
  'model-1': model1Fields,
  'model-2': model2Fields,
  'model-3': model3Fields,
  'model-4': model4Fields,
  'model-5': model5Fields,
  'model-6': model6Fields,
};
