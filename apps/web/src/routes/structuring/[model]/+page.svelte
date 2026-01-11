<script lang="ts">
  import { page } from '$app/stores';
  import { base } from '$app/paths';
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
  import {
    DeveloperResults,
    BuyerResults,
    TransferPricingResults,
    InputField,
    ComparisonManager,
    ComparisonView,
    SensitivityPanel,
    ProjectionsPanel,
  } from '$lib/components';
  import { modelFieldConfigs } from '$lib/config';
  import { comparisonStore, isComparing } from '$lib/stores';

  // Active tab for analysis sections
  type Tab = 'results' | 'sensitivity' | 'projections';
  let activeTab: Tab = 'results';

  // Get model ID from URL
  $: modelId = $page.params.model;

  // Get input field configuration for current model
  $: fieldConfig = modelFieldConfigs[modelId] || [];

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

  // Save current calculation as an option
  let showSaveModal = false;
  let saveName = '';

  function openSaveModal() {
    saveName = inputs.projectName as string || `${config?.model.name} Option`;
    showSaveModal = true;
  }

  function saveOption() {
    if (result && saveName.trim()) {
      comparisonStore.save(
        saveName.trim(),
        modelId,
        result.metadata.variantId,
        inputs,
        result
      );
      showSaveModal = false;
      saveName = '';
    }
  }

  function cancelSave() {
    showSaveModal = false;
    saveName = '';
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
        <a href="{base}/structuring" class="text-blue-600 hover:text-blue-800 text-sm">
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
            {#each fieldConfig as field (field.id)}
              <InputField
                id={field.id}
                label={field.label}
                type={field.type}
                value={inputs[field.id] ?? ''}
                options={field.options}
                min={field.min}
                max={field.max}
                step={field.step}
                hint={field.hint}
                on:change={handleInputChange}
              />
            {/each}
          </div>
        </div>
      </div>

      <!-- Results Area -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Header with Save button and Tabs -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Tabs -->
          <div class="flex border-b border-gray-200">
            <button
              class="px-4 py-2 text-sm font-medium border-b-2 transition-colors {activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              on:click={() => (activeTab = 'results')}
            >
              Results
            </button>
            <button
              class="px-4 py-2 text-sm font-medium border-b-2 transition-colors {activeTab === 'sensitivity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              on:click={() => (activeTab = 'sensitivity')}
            >
              Sensitivity
            </button>
            <button
              class="px-4 py-2 text-sm font-medium border-b-2 transition-colors {activeTab === 'projections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              on:click={() => (activeTab = 'projections')}
            >
              Projections
            </button>
          </div>

          <!-- Save button -->
          <button class="btn-primary" on:click={openSaveModal}>
            Save Option
          </button>
        </div>

        <!-- Tab Content -->
        {#if activeTab === 'results'}
          <DeveloperResults developer={result.developer} />
          <BuyerResults buyer={result.buyer} />
          <TransferPricingResults transferPricing={result.transferPricing} />

          <!-- Comparison Manager -->
          <ComparisonManager />
        {:else if activeTab === 'sensitivity'}
          <SensitivityPanel
            {inputs}
            {result}
            calculateFn={config.calculate}
          />
        {:else if activeTab === 'projections'}
          <ProjectionsPanel {result} />
        {/if}

        <!-- Metadata -->
        <div class="text-xs text-gray-400 text-right">
          Model: {result.metadata.modelName} ({result.metadata.variantId}: {result.metadata.variantName})
        </div>
      </div>
    </div>
  </div>

  <!-- Save Modal -->
  {#if showSaveModal}
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Save Option</h3>
        <div class="mb-4">
          <label for="saveName" class="block text-sm font-medium text-gray-700 mb-1">
            Option Name
          </label>
          <input
            type="text"
            id="saveName"
            bind:value={saveName}
            class="input"
            placeholder="Enter a name for this option"
            on:keydown={(e) => e.key === 'Enter' && saveOption()}
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button class="btn-secondary" on:click={cancelSave}>Cancel</button>
          <button class="btn-primary" on:click={saveOption} disabled={!saveName.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Comparison View -->
  {#if $isComparing}
    <ComparisonView />
  {/if}
{:else}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Model Not Found</h1>
      <p class="text-gray-600 mb-4">The requested model "{modelId}" was not found.</p>
      <a href="{base}/structuring" class="text-blue-600 hover:text-blue-800">
        ← Back to Model Selection
      </a>
    </div>
  </div>
{/if}
