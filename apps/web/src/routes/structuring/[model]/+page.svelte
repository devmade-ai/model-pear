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
  import { modelFieldConfigs, type InputFieldConfig } from '$lib/config';
  import { comparisonStore, isComparing } from '$lib/stores';

  // Collapsible section states
  let showAdvancedInputs = false;
  let showAdvancedAnalysis = false;
  let showTransferPricing = false;

  // Get model ID from URL
  $: modelId = $page.params.model;

  // Get input field configuration for current model
  $: fieldConfig = modelFieldConfigs[modelId] || [];

  // Split fields into essential and advanced for progressive disclosure
  $: essentialFields = fieldConfig.filter((f: InputFieldConfig) => f.essential !== false);
  $: advancedFields = fieldConfig.filter((f: InputFieldConfig) => f.essential === false);

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
  let saveConfirmation = '';

  // Quick save with auto-generated name
  function quickSave() {
    if (result) {
      const savedCount = $comparisonStore.length;
      const autoName = inputs.projectName as string || `${config?.model.shortName} Option ${savedCount + 1}`;
      comparisonStore.save(
        autoName,
        modelId,
        result.metadata.variantId,
        inputs,
        result
      );
      saveConfirmation = `Saved as "${autoName}"`;
      setTimeout(() => saveConfirmation = '', 2000);
    }
  }

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
      saveConfirmation = `Saved as "${saveName}"`;
      setTimeout(() => saveConfirmation = '', 2000);
    }
  }

  function cancelSave() {
    showSaveModal = false;
    saveName = '';
  }

  // Derived value for saved count
  $: savedCount = $comparisonStore.options.length;
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

          <!-- Essential Inputs -->
          <div class="space-y-4">
            {#each essentialFields as field (field.id)}
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
                benchmark={field.benchmark}
                on:change={handleInputChange}
              />
            {/each}
          </div>

          <!-- Advanced Inputs (Collapsed) -->
          {#if advancedFields.length > 0}
            <div class="mt-6 pt-4 border-t border-gray-200">
              <button
                class="flex items-center justify-between w-full text-sm font-medium text-gray-600 hover:text-gray-900"
                on:click={() => showAdvancedInputs = !showAdvancedInputs}
              >
                <span>Advanced Options ({advancedFields.length})</span>
                <svg
                  class="w-5 h-5 transition-transform {showAdvancedInputs ? 'rotate-180' : ''}"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {#if showAdvancedInputs}
                <div class="space-y-4 mt-4">
                  {#each advancedFields as field (field.id)}
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
                      benchmark={field.benchmark}
                      on:change={handleInputChange}
                    />
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>

      <!-- Results Area -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Action Bar: Save & Compare -->
        <div class="flex flex-wrap items-center gap-3">
          <button class="btn-primary" on:click={quickSave}>
            Save Option
          </button>
          <button class="btn-secondary text-sm" on:click={openSaveModal}>
            Save As...
          </button>
          {#if savedCount > 0}
            <span class="text-sm text-gray-600 border-l border-gray-300 pl-3">
              {savedCount} option{savedCount !== 1 ? 's' : ''} saved
            </span>
          {/if}
          {#if saveConfirmation}
            <span class="text-sm text-green-600 animate-pulse">{saveConfirmation}</span>
          {/if}
        </div>

        <!-- Main Results (Always Visible) -->
        <DeveloperResults developer={result.developer} />
        <BuyerResults buyer={result.buyer} />

        <!-- Transfer Pricing (Collapsed by Default) -->
        <div class="card">
          <button
            class="w-full p-4 flex items-center justify-between text-left"
            on:click={() => showTransferPricing = !showTransferPricing}
          >
            <div class="flex items-center space-x-3">
              <span class="text-xl">⚖️</span>
              <div>
                <h3 class="font-semibold text-gray-900">Transfer Pricing Assessment</h3>
                <p class="text-sm text-gray-500">Related party compliance details</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs px-2 py-1 rounded-full {result.transferPricing.riskLevel === 'low' ? 'bg-green-100 text-green-800' : result.transferPricing.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}">
                {result.transferPricing.riskLevel.toUpperCase()} RISK
              </span>
              <svg
                class="w-5 h-5 text-gray-400 transition-transform {showTransferPricing ? 'rotate-180' : ''}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {#if showTransferPricing}
            <div class="px-4 pb-4">
              <TransferPricingResults transferPricing={result.transferPricing} minimal={true} />
            </div>
          {/if}
        </div>

        <!-- Advanced Analysis (Collapsed by Default) -->
        <div class="card">
          <button
            class="w-full p-4 flex items-center justify-between text-left"
            on:click={() => showAdvancedAnalysis = !showAdvancedAnalysis}
          >
            <div class="flex items-center space-x-3">
              <span class="text-xl">📊</span>
              <div>
                <h3 class="font-semibold text-gray-900">Advanced Analysis</h3>
                <p class="text-sm text-gray-500">Sensitivity, projections, and detailed metrics</p>
              </div>
            </div>
            <svg
              class="w-5 h-5 text-gray-400 transition-transform {showAdvancedAnalysis ? 'rotate-180' : ''}"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {#if showAdvancedAnalysis}
            <div class="p-4 pt-0 space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-3">Sensitivity Analysis</h4>
                <SensitivityPanel
                  {inputs}
                  {result}
                  calculateFn={config.calculate}
                />
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-3">Growth Projections</h4>
                <ProjectionsPanel {result} />
              </div>
            </div>
          {/if}
        </div>

        <!-- Comparison Manager -->
        <ComparisonManager />

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
