<script lang="ts">
  import { calculateCostPlus, MODEL_1_COST_PLUS, type Variant1BInputs, type CalculationResult } from '@model-pear/calculator';

  // Default inputs for Model 1B
  let inputs: Variant1BInputs = {
    variant: '1B',
    projectName: 'Software Development Project',
    developmentCost: 1_000_000,
    researchPhaseCost: 200_000,
    developmentPhaseCost: 800_000,
    markupPercentage: 10,
    usefulLife: 5,
    section11eType: 'pc-2yr',
    corporateTaxRate: 27,
  };

  // Reactive calculation - recalculates when inputs change
  $: result = calculateCostPlus(inputs);

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
</script>

<svelte:head>
  <title>Transaction Structuring - Model Pear</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Page header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Transaction Structuring</h1>
    <p class="text-gray-600 mt-2">
      Model 1: {MODEL_1_COST_PLUS.name}
    </p>
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
              bind:value={inputs.projectName}
              class="input"
            />
          </div>

          <!-- Development Cost -->
          <div>
            <label for="developmentCost" class="block text-sm font-medium text-gray-700 mb-1">
              Total Development Cost (R)
            </label>
            <input
              type="number"
              id="developmentCost"
              bind:value={inputs.developmentCost}
              min="0"
              step="10000"
              class="input tabular-nums"
            />
          </div>

          <!-- Research Phase Cost -->
          <div>
            <label for="researchPhaseCost" class="block text-sm font-medium text-gray-700 mb-1">
              Research Phase Cost (R)
            </label>
            <input
              type="number"
              id="researchPhaseCost"
              bind:value={inputs.researchPhaseCost}
              min="0"
              step="10000"
              class="input tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Expensed by Buyer (IAS 38)</p>
          </div>

          <!-- Development Phase Cost -->
          <div>
            <label for="developmentPhaseCost" class="block text-sm font-medium text-gray-700 mb-1">
              Development Phase Cost (R)
            </label>
            <input
              type="number"
              id="developmentPhaseCost"
              bind:value={inputs.developmentPhaseCost}
              min="0"
              step="10000"
              class="input tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Capitalised by Buyer (IAS 38)</p>
          </div>

          <!-- Markup Percentage -->
          <div>
            <label for="markupPercentage" class="block text-sm font-medium text-gray-700 mb-1">
              Cost-Plus Markup (%)
            </label>
            <input
              type="number"
              id="markupPercentage"
              bind:value={inputs.markupPercentage}
              min="0"
              max="50"
              step="1"
              class="input tabular-nums"
            />
            <p class="text-xs text-gray-500 mt-1">Arm's length range: 5-15%</p>
          </div>

          <!-- Useful Life -->
          <div>
            <label for="usefulLife" class="block text-sm font-medium text-gray-700 mb-1">
              Useful Life (Years)
            </label>
            <input
              type="number"
              id="usefulLife"
              bind:value={inputs.usefulLife}
              min="1"
              max="20"
              step="1"
              class="input tabular-nums"
            />
          </div>

          <!-- Section 11(e) Type -->
          <div>
            <label for="section11eType" class="block text-sm font-medium text-gray-700 mb-1">
              Tax Write-Off Period
            </label>
            <select
              id="section11eType"
              bind:value={inputs.section11eType}
              class="input"
            >
              <option value="pc-2yr">Standard Software (2-year)</option>
              <option value="mainframe-5yr">Complex Systems (5-year)</option>
            </select>
          </div>

          <!-- Corporate Tax Rate -->
          <div>
            <label for="corporateTaxRate" class="block text-sm font-medium text-gray-700 mb-1">
              Corporate Tax Rate (%)
            </label>
            <input
              type="number"
              id="corporateTaxRate"
              bind:value={inputs.corporateTaxRate}
              min="0"
              max="50"
              step="1"
              class="input tabular-nums"
            />
          </div>
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
              <span class="result-label">Expensed (Research)</span>
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
            <div class="result-row">
              <span class="result-label">Deferred Tax Liability</span>
              <span class="result-value">{formatCurrency(result.buyer.tax.deferredTaxLiability)}</span>
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
