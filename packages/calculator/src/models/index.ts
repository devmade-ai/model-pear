/**
 * Model exports for @model-pear/calculator
 *
 * All transaction structuring models are exported from this module.
 */

// ============================================================
// MODEL 1: COST-PLUS
// ============================================================

export {
  calculate as calculateCostPlus,
  MODEL_1_COST_PLUS,
  VARIANTS as COST_PLUS_VARIANTS,
  BENCHMARK_RANGE as COST_PLUS_BENCHMARK_RANGE,
} from './model-1-cost-plus.js';

export type {
  CostPlusInputs,
  CostPlusVariantId,
  CostPlusBaseInputs,
  Variant1AInputs,
  Variant1BInputs,
  Variant1CInputs,
  Variant1DInputs,
  Variant1EInputs,
  Variant1FInputs,
  VariantDefinition,
} from './model-1-cost-plus.js';

// ============================================================
// MODEL 2: LICENCE / ROYALTIES
// ============================================================

export {
  calculate as calculateLicence,
  MODEL_2_LICENCE,
  VARIANTS as LICENCE_VARIANTS,
  BENCHMARK_RANGE as LICENCE_BENCHMARK_RANGE,
} from './model-2-licence.js';

export type {
  LicenceInputs,
  LicenceVariantId,
  Variant2AInputs,
  Variant2BInputs,
  Variant2CInputs,
  Variant2DInputs,
  Variant2EInputs,
  Variant2FInputs,
  Variant2GInputs,
  Variant2HInputs,
  LicenceType,
  Exclusivity,
  Territory,
  SourceCodeAccess,
} from './model-2-licence.js';

// ============================================================
// MODEL 3: JOINT DEVELOPMENT
// ============================================================

export {
  calculate as calculateJointDevelopment,
  MODEL_3_JOINT_DEVELOPMENT,
  VARIANTS as JOINT_DEV_VARIANTS,
  BENCHMARK_RANGE as JOINT_DEV_BENCHMARK_RANGE,
} from './model-3-joint-development.js';

export type {
  JointDevInputs,
  JointDevVariantId,
  Variant3AInputs,
  Variant3BInputs,
  Variant3CInputs,
  Variant3DInputs,
  Variant3EInputs,
  Variant3FInputs,
  Variant3GInputs,
  Variant3HInputs,
  OwnershipMethod,
  ValuationMethod,
} from './model-3-joint-development.js';

// ============================================================
// MODEL 4: BUILD-OPERATE-TRANSFER (BOT)
// ============================================================

export {
  calculate as calculateBOT,
  MODEL_4_BOT,
  VARIANTS as BOT_VARIANTS,
  BENCHMARK_RANGE as BOT_BENCHMARK_RANGE,
} from './model-4-bot.js';

export type {
  BOTInputs,
  BOTVariantId,
  Variant4AInputs,
  Variant4BInputs,
  Variant4CInputs,
  Variant4DInputs,
  Variant4EInputs,
  Variant4FInputs,
  Variant4GInputs,
  Variant4HInputs,
  TransferMethod,
  FormulaType,
} from './model-4-bot.js';

// ============================================================
// MODEL 5: SOFTWARE SALE
// ============================================================

export {
  calculate as calculateSoftwareSale,
  MODEL_5_SOFTWARE_SALE,
  VARIANTS as SOFTWARE_SALE_VARIANTS,
  BENCHMARK_RANGE as SOFTWARE_SALE_BENCHMARK_RANGE,
} from './model-5-software-sale.js';

export type {
  SoftwareSaleInputs,
  SoftwareSaleVariantId,
  Variant5AInputs,
  Variant5BInputs,
  Variant5CInputs,
  Variant5DInputs,
  Variant5EInputs,
  Variant5FInputs,
  Variant5GInputs,
  Variant5HInputs,
  MaintenanceLevel,
  PaymentTerms,
  WarrantyType,
} from './model-5-software-sale.js';

// ============================================================
// MODEL 6: SAAS / SUBSCRIPTION
// ============================================================

export {
  calculate as calculateSaaS,
  MODEL_6_SAAS,
  VARIANTS as SAAS_VARIANTS,
  BENCHMARK_RANGE as SAAS_BENCHMARK_RANGE,
} from './model-6-saas.js';

export type {
  SaaSInputs,
  SaaSVariantId,
  Variant6AInputs,
  Variant6BInputs,
  Variant6CInputs,
  Variant6DInputs,
  Variant6EInputs,
  Variant6FInputs,
  Variant6GInputs,
  Variant6HInputs,
  Variant6IInputs,
  PricingModel,
  ContractLength,
  SupportLevel,
} from './model-6-saas.js';

// ============================================================
// MODEL REGISTRY
// ============================================================

export const ALL_MODELS = {
  'model-1': MODEL_1_COST_PLUS,
  'model-2': MODEL_2_LICENCE,
  'model-3': MODEL_3_JOINT_DEVELOPMENT,
  'model-4': MODEL_4_BOT,
  'model-5': MODEL_5_SOFTWARE_SALE,
  'model-6': MODEL_6_SAAS,
} as const;

export type ModelId = keyof typeof ALL_MODELS;

import { MODEL_1_COST_PLUS } from './model-1-cost-plus.js';
import { MODEL_2_LICENCE } from './model-2-licence.js';
import { MODEL_3_JOINT_DEVELOPMENT } from './model-3-joint-development.js';
import { MODEL_4_BOT } from './model-4-bot.js';
import { MODEL_5_SOFTWARE_SALE } from './model-5-software-sale.js';
import { MODEL_6_SAAS } from './model-6-saas.js';
