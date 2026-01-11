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

  // Currency formatter
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Percentage formatter
  const formatPercent = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // Risk level badge color
  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'low': return 'badge-green';
      case 'medium': return 'badge-amber';
      case 'high': return 'badge-red';
      default: return 'badge-blue';
    }
  };

  // Handle input change
  function handleInput(field: string, value: unknown) {
    inputs = { ...inputs, [field]: value };
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
        <!-- Developer Perspective -->
        <div class="result-panel">
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-xl">💻</span>
            <h2 class="text-lg font-semibold text-gray-900">Developer Perspective</h2>
            <span class="badge-blue">Your Company</span>
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            <!-- Revenue -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Revenue</h3>
              <div class="result-row">
                <span class="result-label">Total Revenue</span>
                <span class="result-value">{formatCurrency(result.developer.revenue.total)}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Recognition</span>
                <span class="text-sm text-gray-600">{result.developer.revenue.recognitionTiming}</span>
              </div>
            </div>

            <!-- Profit -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Profit</h3>
              <div class="result-row">
                <span class="result-label">Gross Profit</span>
                <span class="{result.developer.profit.gross >= 0 ? 'result-value-positive' : 'result-value-negative'}">
                  {formatCurrency(result.developer.profit.gross)}
                </span>
              </div>
              <div class="result-row">
                <span class="result-label">Margin</span>
                <span class="result-value">{formatPercent(result.developer.profit.margin)}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Net Profit</span>
                <span class="{result.developer.profit.net >= 0 ? 'result-value-positive' : 'result-value-negative'}">
                  {formatCurrency(result.developer.profit.net)}
                </span>
              </div>
            </div>

            <!-- Tax -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Tax</h3>
              <div class="result-row">
                <span class="result-label">Taxable Income</span>
                <span class="result-value">{formatCurrency(result.developer.tax.taxableIncome)}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Tax Payable</span>
                <span class="result-value-negative">{formatCurrency(result.developer.tax.taxPayable)}</span>
              </div>
            </div>

            <!-- Asset -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Asset Recognition</h3>
              <div class="result-row">
                <span class="result-label">Asset Recognised</span>
                <span class="text-sm">{result.developer.asset.recognised ? 'Yes' : 'No'}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">{result.developer.asset.reason}</p>
            </div>
          </div>
        </div>

        <!-- Buyer Perspective -->
        <div class="result-panel">
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-xl">🏢</span>
            <h2 class="text-lg font-semibold text-gray-900">Buyer Perspective</h2>
            <span class="badge-blue">Client</span>
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            <!-- Asset -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Asset Recognition</h3>
              <div class="result-row">
                <span class="result-label">Capitalised</span>
                <span class="result-value">{formatCurrency(result.buyer.asset.capitalised)}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Expensed</span>
                <span class="result-value">{formatCurrency(result.buyer.asset.expensed)}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Annual Amortisation</span>
                <span class="result-value">{formatCurrency(result.buyer.asset.annualAmortisation)}</span>
              </div>
            </div>

            <!-- Tax -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Tax Treatment</h3>
              <div class="result-row">
                <span class="result-label">Section 11(e) Deduction</span>
                <span class="result-value">{formatCurrency(result.buyer.tax.section11eDeduction)}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Tax Benefit (Year 1)</span>
                <span class="result-value-positive">{formatCurrency(result.buyer.tax.taxBenefit)}</span>
              </div>
            </div>

            <!-- Total Cost -->
            <div class="sm:col-span-2">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Total Cost of Ownership</h3>
              <div class="result-row">
                <span class="result-label">Total Transaction Value</span>
                <span class="result-value text-lg">{formatCurrency(result.buyer.totalCost)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Transfer Pricing -->
        <div class="result-panel">
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-xl">⚖️</span>
            <h2 class="text-lg font-semibold text-gray-900">Transfer Pricing Assessment</h2>
            <span class={getRiskColor(result.transferPricing.riskLevel)}>
              {result.transferPricing.riskLevel.toUpperCase()} RISK
            </span>
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Margin Analysis</h3>
              <div class="result-row">
                <span class="result-label">Applied Margin</span>
                <span class="result-value">{formatPercent(result.transferPricing.margin)}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Arm's Length Range</span>
                <span class="text-sm text-gray-600">
                  {result.transferPricing.benchmarkRange.low}% - {result.transferPricing.benchmarkRange.high}%
                </span>
              </div>
              <div class="result-row">
                <span class="result-label">Within Range</span>
                <span class="text-sm">
                  {result.transferPricing.withinRange ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div class="result-row">
                <span class="result-label">Compliance Score</span>
                <span class="result-value">{result.transferPricing.riskScore}/100</span>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Recommendation</h3>
              <p class="text-sm text-gray-700 mb-4">{result.transferPricing.recommendation}</p>

              <h3 class="text-sm font-medium text-gray-500 mb-2">Required Documentation</h3>
              <ul class="text-xs text-gray-600 space-y-1">
                {#each result.transferPricing.documentation as doc}
                  <li>• {doc}</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>

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
