<script lang="ts">
  import { page } from '$app/stores';
  import {
    calculateCostPlus,
    calculateLicence,
    calculateJointDevelopment,
    calculateBOT,
    calculateSoftwareSale,
    calculateSaaS,
    MODEL_1_COST_PLUS,
    MODEL_2_LICENCE,
    MODEL_3_JOINT_DEVELOPMENT,
    MODEL_4_BOT,
    MODEL_5_SOFTWARE_SALE,
    MODEL_6_SAAS,
    type CalculationResult,
    type Variant1BInputs,
    type Variant2AInputs,
    type Variant3BInputs,
    type Variant4AInputs,
    type Variant5AInputs,
    type Variant6AInputs,
  } from '@model-pear/calculator';
  import { DeveloperResults, BuyerResults, TransferPricingResults, InputField } from '$lib/components';

  // Get model ID from URL
  $: modelId = $page.params.model;

  // Model configurations
  const modelConfigs = {
    'model-1': {
      model: MODEL_1_COST_PLUS,
      calculate: calculateCostPlus,
      defaultInputs: {
        variant: '1B',
        projectName: 'Software Development Project',
        developmentCost: 1_000_000,
        researchPhaseCost: 200_000,
        developmentPhaseCost: 800_000,
        markupPercentage: 10,
        usefulLife: 5,
        section11eType: 'pc-2yr',
        corporateTaxRate: 27,
      } as Variant1BInputs,
    },
    'model-2': {
      model: MODEL_2_LICENCE,
      calculate: calculateLicence,
      defaultInputs: {
        variant: '2A',
        projectName: 'Software Licence Agreement',
        developmentCost: 1_000_000,
        researchPhaseCost: 200_000,
        developmentPhaseCost: 800_000,
        developerUsefulLife: 10,
        licenceType: 'perpetual',
        licenceTerm: 5,
        exclusivity: 'non-exclusive',
        territory: 'south-africa',
        sourceCodeAccess: 'none',
        buyerUsefulLife: 5,
        implementationCosts: 50_000,
        section11eType: 'pc-2yr',
        corporateTaxRate: 27,
        upfrontLicenceFee: 500_000,
      } as Variant2AInputs,
    },
    'model-3': {
      model: MODEL_3_JOINT_DEVELOPMENT,
      calculate: calculateJointDevelopment,
      defaultInputs: {
        variant: '3B',
        projectName: 'Joint Development Agreement',
        totalProjectCost: 1_000_000,
        researchPhaseCost: 200_000,
        developmentPhaseCost: 800_000,
        projectDurationMonths: 12,
        developerCashContribution: 200_000,
        developerPersonnelFTEs: 4,
        developerPersonnelCostPerMonth: 20_000,
        developerIPContribution: 100_000,
        developerFacilitiesContribution: 50_000,
        buyerCashContribution: 100_000,
        buyerPersonnelFTEs: 2,
        buyerPersonnelCostPerMonth: 15_000,
        buyerIPContribution: 50_000,
        buyerDomainExpertiseValue: 80_000,
        usefulLife: 5,
        section11eType: 'pc-2yr',
        corporateTaxRate: 27,
        valuationMethod: 'cost-basis',
      } as Variant3BInputs,
    },
    'model-4': {
      model: MODEL_4_BOT,
      calculate: calculateBOT,
      defaultInputs: {
        variant: '4A',
        projectName: 'Build-Operate-Transfer Project',
        developmentCost: 1_000_000,
        researchPhaseCost: 200_000,
        developmentPhaseCost: 800_000,
        operationPeriodYears: 3,
        annualOperatingFee: 200_000,
        annualOperatingCost: 100_000,
        estimatedAnnualRevenue: 500_000,
        transferYear: 3,
        usefulLife: 10,
        section11eType: 'pc-2yr',
        corporateTaxRate: 27,
        fixedTransferPrice: 1_000_000,
        inflationAdjustment: 5,
      } as Variant4AInputs,
    },
    'model-5': {
      model: MODEL_5_SOFTWARE_SALE,
      calculate: calculateSoftwareSale,
      defaultInputs: {
        variant: '5A',
        projectName: 'Software Sale Agreement',
        developmentCost: 1_000_000,
        researchPhaseCost: 200_000,
        developmentPhaseCost: 800_000,
        salePrice: 2_000_000,
        annualMaintenanceFee: 100_000,
        annualMaintenanceCost: 50_000,
        maintenanceTerm: 5,
        usefulLife: 5,
        section11eType: 'pc-2yr',
        corporateTaxRate: 27,
        paymentTerms: 'upfront',
      } as Variant5AInputs,
    },
    'model-6': {
      model: MODEL_6_SAAS,
      calculate: calculateSaaS,
      defaultInputs: {
        variant: '6A',
        projectName: 'SaaS Subscription Agreement',
        developmentCost: 1_000_000,
        researchPhaseCost: 200_000,
        developmentPhaseCost: 800_000,
        monthlySubscriptionFee: 10_000,
        contractLengthMonths: 36,
        annualHostingCost: 50_000,
        annualSupportCost: 30_000,
        usefulLife: 10,
        section11eType: 'pc-2yr',
        corporateTaxRate: 27,
        pricingModel: 'flat-rate',
      } as Variant6AInputs,
    },
  };

  // Get current model config
  $: config = modelConfigs[modelId as keyof typeof modelConfigs];

  // Input state (starts with defaults)
  let inputs: Record<string, unknown> = {};
  $: if (config && Object.keys(inputs).length === 0) {
    inputs = { ...config.defaultInputs };
  }

  // Reactive calculation
  $: result = config ? (config.calculate as (inputs: Record<string, unknown>) => CalculationResult)(inputs) : null;

  // Handle input change from InputField component
  function handleInputChange(event: CustomEvent<{ field: string; value: unknown }>) {
    inputs = { ...inputs, [event.detail.field]: event.detail.value };
  }
</script>

<svelte:head>
  <title>{config?.model.name || 'Calculator'} - Model Pear</title>
</svelte:head>

{#if config && result}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page header -->
    <div class="mb-8">
      <div class="flex items-center space-x-2 mb-2">
        <a href="/structuring" class="text-blue-600 hover:text-blue-800 text-sm">
          ← All Models
        </a>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-3xl">{config.model.icon}</span>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{config.model.name}</h1>
          <p class="text-gray-600 mt-1">{config.model.description}</p>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Input Form -->
      <div class="lg:col-span-1">
        <div class="card p-6 sticky top-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Inputs</h2>

          <div class="space-y-4">
            <!-- Project Name -->
            <div>
              <label for="projectName" class="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={inputs.projectName}
                on:input={(e) => handleInput('projectName', e.currentTarget.value)}
                class="input"
              />
            </div>

            {#if 'developmentCost' in inputs}
              <div>
                <label for="developmentCost" class="block text-sm font-medium text-gray-700 mb-1">
                  Development Cost (R)
                </label>
                <input
                  type="number"
                  id="developmentCost"
                  value={inputs.developmentCost}
                  on:input={(e) => handleInput('developmentCost', Number(e.currentTarget.value))}
                  min="0"
                  step="10000"
                  class="input tabular-nums"
                />
              </div>
            {/if}

            {#if 'markupPercentage' in inputs}
              <div>
                <label for="markupPercentage" class="block text-sm font-medium text-gray-700 mb-1">
                  Markup Percentage (%)
                </label>
                <input
                  type="number"
                  id="markupPercentage"
                  value={inputs.markupPercentage}
                  on:input={(e) => handleInput('markupPercentage', Number(e.currentTarget.value))}
                  min="0"
                  max="50"
                  step="1"
                  class="input tabular-nums"
                />
                <p class="text-xs text-gray-500 mt-1">Arm's length range: 5-15%</p>
              </div>
            {/if}

            {#if 'upfrontLicenceFee' in inputs}
              <div>
                <label for="upfrontLicenceFee" class="block text-sm font-medium text-gray-700 mb-1">
                  Upfront Licence Fee (R)
                </label>
                <input
                  type="number"
                  id="upfrontLicenceFee"
                  value={inputs.upfrontLicenceFee}
                  on:input={(e) => handleInput('upfrontLicenceFee', Number(e.currentTarget.value))}
                  min="0"
                  step="10000"
                  class="input tabular-nums"
                />
              </div>
            {/if}

            {#if 'salePrice' in inputs}
              <div>
                <label for="salePrice" class="block text-sm font-medium text-gray-700 mb-1">
                  Sale Price (R)
                </label>
                <input
                  type="number"
                  id="salePrice"
                  value={inputs.salePrice}
                  on:input={(e) => handleInput('salePrice', Number(e.currentTarget.value))}
                  min="0"
                  step="10000"
                  class="input tabular-nums"
                />
              </div>
            {/if}

            {#if 'monthlySubscriptionFee' in inputs}
              <div>
                <label for="monthlySubscriptionFee" class="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Subscription Fee (R)
                </label>
                <input
                  type="number"
                  id="monthlySubscriptionFee"
                  value={inputs.monthlySubscriptionFee}
                  on:input={(e) => handleInput('monthlySubscriptionFee', Number(e.currentTarget.value))}
                  min="0"
                  step="1000"
                  class="input tabular-nums"
                />
              </div>
            {/if}

            {#if 'fixedTransferPrice' in inputs}
              <div>
                <label for="fixedTransferPrice" class="block text-sm font-medium text-gray-700 mb-1">
                  Transfer Price (R)
                </label>
                <input
                  type="number"
                  id="fixedTransferPrice"
                  value={inputs.fixedTransferPrice}
                  on:input={(e) => handleInput('fixedTransferPrice', Number(e.currentTarget.value))}
                  min="0"
                  step="10000"
                  class="input tabular-nums"
                />
              </div>
            {/if}

            {#if 'usefulLife' in inputs}
              <div>
                <label for="usefulLife" class="block text-sm font-medium text-gray-700 mb-1">
                  Useful Life (Years)
                </label>
                <input
                  type="number"
                  id="usefulLife"
                  value={inputs.usefulLife}
                  on:input={(e) => handleInput('usefulLife', Number(e.currentTarget.value))}
                  min="1"
                  max="20"
                  step="1"
                  class="input tabular-nums"
                />
              </div>
            {/if}

            {#if 'section11eType' in inputs}
              <div>
                <label for="section11eType" class="block text-sm font-medium text-gray-700 mb-1">
                  Tax Write-Off Period
                </label>
                <select
                  id="section11eType"
                  value={inputs.section11eType}
                  on:change={(e) => handleInput('section11eType', e.currentTarget.value)}
                  class="input"
                >
                  <option value="pc-2yr">Standard Software (2-year)</option>
                  <option value="mainframe-5yr">Complex Systems (5-year)</option>
                </select>
              </div>
            {/if}

            {#if 'corporateTaxRate' in inputs}
              <div>
                <label for="corporateTaxRate" class="block text-sm font-medium text-gray-700 mb-1">
                  Corporate Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="corporateTaxRate"
                  value={inputs.corporateTaxRate}
                  on:input={(e) => handleInput('corporateTaxRate', Number(e.currentTarget.value))}
                  min="0"
                  max="50"
                  step="1"
                  class="input tabular-nums"
                />
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="lg:col-span-2 space-y-6">
        <DeveloperResults developer={result.developer} />
        <BuyerResults buyer={result.buyer} />
        <TransferPricingResults transferPricing={result.transferPricing} />

        <!-- Metadata -->
        <div class="text-xs text-gray-400 text-right">
          Model: {result.metadata.modelName} ({result.metadata.variantId}: {result.metadata.variantName})
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Model Not Found</h1>
      <p class="text-gray-600 mb-4">The requested model "{modelId}" was not found.</p>
      <a href="/structuring" class="text-blue-600 hover:text-blue-800">
        ← Back to Model Selection
      </a>
    </div>
  </div>
{/if}
