<script lang="ts">
  import { onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { resolve } from '$app/paths';
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

  // Get model ID from URL. SvelteKit types `params.model` as
  // `string | undefined` because route matching can fail on edge cases
  // (e.g. SSR reload during navigation), so coerce to '' for indexing
  // — the fallback `|| []` then yields the empty fieldConfig and the
  // "Model Not Found" branch in the template fires.
  $: modelId = $page.params.model ?? '';

  // Get input field configuration for current model
  $: fieldConfig = modelFieldConfigs[modelId] || [];

  // Requirement: Show only essential inputs by default, reveal advanced inputs on demand.
  // Approach: Progressive disclosure — split fields by their `essential` flag.
  //   Essential fields (the minimum needed for a basic calculation) show immediately.
  //   Advanced fields (fine-tuning options) are hidden behind an expandable section.
  // Why: Non-technical users (per CLAUDE.md UX rules) should not be overwhelmed
  //   with 15+ inputs on first load. Essential-first reduces cognitive load.
  $: essentialFields = fieldConfig.filter((f: InputFieldConfig) => f.essential !== false);
  $: advancedFields = fieldConfig.filter((f: InputFieldConfig) => f.essential === false);

  // Requirement: Map each model route to its calculator function and sensible defaults.
  // Approach: Static config object keyed by model ID from the URL parameter.
  //   Each entry provides: the model metadata, the calculate function, and default
  //   inputs with the most commonly used variant pre-selected (e.g., 1B for cost-plus,
  //   2A for licence). Default values use representative South African software
  //   transaction amounts to give users a realistic starting point.
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
  // The `config.calculate` union (one signature per model) doesn't sufficiently
  // overlap with `(inputs: Record<string, unknown>) => CalculationResult` for
  // ts to allow a direct cast. Going through `unknown` is the documented escape
  // hatch — the runtime contract is "the calculate fn for the active model
  // accepts the inputs we pass" which only the route URL guarantees.
  $: result = config ? (config.calculate as unknown as (inputs: Record<string, unknown>) => CalculationResult)(inputs) : null;

  // Handle input change from InputField component
  function handleInputChange(event: CustomEvent<{ field: string; value: unknown }>) {
    inputs = { ...inputs, [event.detail.field]: event.detail.value };
  }

  // Coerce the unknown-typed input value into the string|number InputField
  // expects. Inline `as string | number | undefined` casts inside Svelte's
  // template-expression parser produce "Unexpected token" — this helper
  // moves the cast into the script block where it parses cleanly.
  function fieldValue(id: string): string | number {
    const v = inputs[id];
    return typeof v === 'string' || typeof v === 'number' ? v : '';
  }

  // Erased calculate signature for SensitivityPanel. Same parser issue as
  // fieldValue — the `as unknown as` chain doesn't survive inline-expression
  // parsing in the template.
  $: erasedCalculate = config?.calculate as unknown as (inputs: Record<string, unknown>) => CalculationResult;

  // Save current calculation as an option
  let showSaveModal = false;
  let saveDialog: HTMLDialogElement;
  let saveName = '';
  let saveConfirmation = '';
  let saveConfirmationTimer: ReturnType<typeof setTimeout> | null = null;

  // Sync the synthetic showSaveModal flag with <dialog>'s native
  // open/close state. Reactive block fires whenever showSaveModal
  // toggles AND on initial mount (once saveDialog is bound).
  $: if (saveDialog) {
    if (showSaveModal && !saveDialog.open) saveDialog.showModal();
    else if (!showSaveModal && saveDialog.open) saveDialog.close();
  }

  // Clear the 2s save-confirmation timeout if the user navigates away
  // before it fires — prevents a setState onto the destroyed component.
  onDestroy(() => {
    if (saveConfirmationTimer) clearTimeout(saveConfirmationTimer);
  });

  function scheduleConfirmationClear() {
    if (saveConfirmationTimer) clearTimeout(saveConfirmationTimer);
    saveConfirmationTimer = setTimeout(() => saveConfirmation = '', 2000);
  }

  // Quick save with auto-generated name
  function quickSave() {
    if (result) {
      const savedCount = $comparisonStore.options.length;
      const autoName = inputs.projectName as string || `${config?.model.shortName} Option ${savedCount + 1}`;
      comparisonStore.save(
        autoName,
        modelId,
        result.metadata.variantId,
        inputs,
        result
      );
      saveConfirmation = `Saved as "${autoName}"`;
      scheduleConfirmationClear();
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
      scheduleConfirmationClear();
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
        <a href={resolve('/structuring')} class="text-primary hover:text-primary/80 text-sm">
          ← All Models
        </a>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-3xl">{config.model.icon}</span>
        <div>
          <h1 class="text-3xl font-bold text-base-content">{config.model.name}</h1>
          <p class="text-base-content/70 mt-1">{config.model.description}</p>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Input Form -->
      <div class="lg:col-span-1">
        <div class="card p-6 sticky top-4">
          <h2 class="text-lg font-semibold text-base-content mb-4">Inputs</h2>

          <!-- Essential Inputs -->
          <div class="space-y-4">
            {#each essentialFields as field (field.id)}
              <InputField
                id={field.id}
                label={field.label}
                type={field.type}
                value={fieldValue(field.id)}
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
            <div class="mt-6 pt-4 border-t border-base-300">
              <button
                class="flex items-center justify-between w-full text-sm font-medium text-base-content/70 hover:text-base-content"
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
                      value={fieldValue(field.id)}
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
          <button class="btn btn-primary" on:click={quickSave}>
            Save Option
          </button>
          <button class="btn btn-outline text-sm" on:click={openSaveModal}>
            Save As...
          </button>
          <!-- Requirement: Let users save results as PDF via the browser's native print dialog.
               Approach: window.print() — zero dependencies, leverages existing @media print CSS in app.css.
               Alternative considered: pdf-lib — rejected because content is text/tables (not canvas),
               so the browser print engine handles it well without extra bundle size. -->
          <button class="btn btn-outline text-sm no-print" on:click={() => window.print()} title="Save this page as a PDF using your browser's print dialog">
            Save as PDF
          </button>
          {#if savedCount > 0}
            <span class="text-sm text-base-content/70 border-l border-base-300 pl-3">
              {savedCount} option{savedCount !== 1 ? 's' : ''} saved
            </span>
          {/if}
          {#if saveConfirmation}
            <span class="text-sm text-success animate-pulse">{saveConfirmation}</span>
          {/if}
        </div>

        <!-- Main Results (Always Visible) -->
        <DeveloperResults developer={result.developer} />
        <BuyerResults buyer={result.buyer} />

        <!-- Transfer Pricing (Collapsed by Default)
             Print behavior: hidden when collapsed (empty card), visible with heading when expanded.
             class:no-print hides the empty shell; print-include keeps the heading visible. -->
        <div class="card" class:no-print={!showTransferPricing}>
          <button
            class="w-full p-4 flex items-center justify-between text-left print-include"
            on:click={() => showTransferPricing = !showTransferPricing}
          >
            <div class="flex items-center space-x-3">
              <span class="text-xl">⚖️</span>
              <div>
                <h3 class="font-semibold text-base-content">Transfer Pricing Assessment</h3>
                <p class="text-sm text-base-content/70">Related party compliance details</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="badge badge-soft badge-sm {result.transferPricing.riskLevel === 'low' ? 'badge-success' : result.transferPricing.riskLevel === 'medium' ? 'badge-warning' : 'badge-error'}">
                {result.transferPricing.riskLevel.toUpperCase()} RISK
              </span>
              <svg
                class="w-5 h-5 text-base-content/70 transition-transform {showTransferPricing ? 'rotate-180' : ''}"
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

        <!-- Advanced Analysis (Collapsed by Default)
             Print behavior: hidden when collapsed (empty card), visible with heading when expanded.
             class:no-print hides the empty shell; print-include keeps the heading visible. -->
        <div class="card" class:no-print={!showAdvancedAnalysis}>
          <button
            class="w-full p-4 flex items-center justify-between text-left print-include"
            on:click={() => showAdvancedAnalysis = !showAdvancedAnalysis}
          >
            <div class="flex items-center space-x-3">
              <span class="text-xl">📊</span>
              <div>
                <h3 class="font-semibold text-base-content">Advanced Analysis</h3>
                <p class="text-sm text-base-content/70">Sensitivity, projections, and detailed metrics</p>
              </div>
            </div>
            <svg
              class="w-5 h-5 text-base-content/70 transition-transform {showAdvancedAnalysis ? 'rotate-180' : ''}"
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
                <h4 class="text-sm font-medium text-base-content/70 mb-3">Sensitivity Analysis</h4>
                <SensitivityPanel
                  {inputs}
                  {result}
                  calculateFn={erasedCalculate}
                />
              </div>
              <div>
                <h4 class="text-sm font-medium text-base-content/70 mb-3">Growth Projections</h4>
                <ProjectionsPanel {result} />
              </div>
            </div>
          {/if}
        </div>

        <!-- Comparison Manager (interactive-only — hidden in print) -->
        <div class="no-print">
          <ComparisonManager />
        </div>

        <!-- Metadata -->
        <div class="text-xs text-base-content/60 text-right">
          Model: {result.metadata.modelName} ({result.metadata.variantId}: {result.metadata.variantName})
        </div>
      </div>
    </div>
  </div>

  <!-- Save Modal — DaisyUI <dialog class="modal"> with native top-layer rendering -->
  <dialog
    bind:this={saveDialog}
    class="modal"
    on:close={() => (showSaveModal = false)}
  >
    <div class="modal-box">
      <h3 class="text-lg font-semibold text-base-content mb-4">Save Option</h3>
      <div class="mb-4">
        <label for="saveName" class="block text-sm font-medium text-base-content/70 mb-1">
          Option Name
        </label>
        <input
          type="text"
          id="saveName"
          bind:value={saveName}
          class="input w-full"
          placeholder="Enter a name for this option"
          on:keydown={(e) => e.key === 'Enter' && saveOption()}
        />
      </div>
      <div class="modal-action">
        <button class="btn btn-outline" on:click={cancelSave}>Cancel</button>
        <button class="btn btn-primary" on:click={saveOption} disabled={!saveName.trim()}>
          Save
        </button>
      </div>
    </div>
    <!-- Backdrop click closes the dialog via native form-method-dialog -->
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <!-- Comparison View -->
  {#if $isComparing}
    <ComparisonView />
  {/if}
{:else}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-base-content mb-4">Model Not Found</h1>
      <p class="text-base-content/70 mb-4">The requested model "{modelId}" was not found.</p>
      <a href={resolve('/structuring')} class="text-primary hover:text-primary/80">
        ← Back to Model Selection
      </a>
    </div>
  </div>
{/if}
