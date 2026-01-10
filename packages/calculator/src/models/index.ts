/**
 * Model exports for @model-pear/calculator
 *
 * All transaction structuring models are exported from this module.
 */

// Model 1: Cost-Plus
export {
  calculate as calculateCostPlus,
  MODEL_1_COST_PLUS,
  VARIANTS as COST_PLUS_VARIANTS,
  BENCHMARK_RANGE as COST_PLUS_BENCHMARK_RANGE,
  INPUT_CATEGORIES as COST_PLUS_INPUT_CATEGORIES,
  BASE_INPUT_FIELDS as COST_PLUS_INPUT_FIELDS,
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

// Future models will be added here:
// export { calculateLicence, MODEL_2_LICENCE } from './model-2-licence.js';
// export { calculateJointDevelopment, MODEL_3_JOINT_DEVELOPMENT } from './model-3-joint-development.js';
// export { calculateBOT, MODEL_4_BOT } from './model-4-bot.js';
// export { calculateSoftwareSale, MODEL_5_SOFTWARE_SALE } from './model-5-software-sale.js';
// export { calculateSaaS, MODEL_6_SAAS } from './model-6-saas.js';
