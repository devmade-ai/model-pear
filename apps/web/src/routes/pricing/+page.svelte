<script lang="ts">
  import { formatCurrency, formatPercent } from '$lib/utils/formatters';

  const models = [
    { id: 'subscription', name: 'Subscription (SaaS)', icon: '🔄', description: 'Monthly recurring revenue' },
    { id: 'usage-based', name: 'Usage-Based', icon: '📊', description: 'Pay per unit' },
    { id: 'per-seat', name: 'Per-Seat', icon: '👥', description: 'Price per user' },
    { id: 'one-time', name: 'One-Time', icon: '💵', description: 'Upfront license' },
    { id: 'marketplace', name: 'Marketplace', icon: '🛒', description: 'Commission model' }
  ];

  let selectedModel = 'subscription';

  // Subscription inputs
  let monthlyPrice = 500;
  let customers = 100;
  let costToServe = 150;
  let desiredMargin = 70;
  let buyerValue = 5000;

  $: results = calculateResults();

  function calculateResults() {
    if (selectedModel === 'subscription') {
      const monthlyRevenue = monthlyPrice * customers;
      const monthlyCost = costToServe * customers;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      // Seller minimum price
      const minimumPrice = desiredMargin >= 100 ? Infinity : costToServe / (1 - desiredMargin / 100);
      const sellerMeetsTarget = monthlyPrice >= minimumPrice;

      // Buyer maximum price (40% of value = 2.5x ROI threshold)
      const maximumPrice = buyerValue * 0.4;
      const buyerROI = monthlyPrice > 0 ? buyerValue / monthlyPrice : 0;

      // Equilibrium
      const equilibriumExists = minimumPrice <= maximumPrice;
      const suggestedPrice = equilibriumExists ? (minimumPrice + maximumPrice) / 2 : 0;

      return {
        monthlyRevenue,
        monthlyCost,
        monthlyProfit,
        actualMargin,
        annualRevenue: monthlyRevenue * 12,
        annualProfit: monthlyProfit * 12,
        minimumPrice,
        maximumPrice,
        suggestedPrice,
        equilibriumExists,
        sellerMeetsTarget,
        buyerROI,
        buyerAnnualSavings: (buyerValue - monthlyPrice) * 12
      };
    }

    return null;
  }
</script>

<svelte:head>
  <title>Pricing Calculator - Model Pear</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Pricing Calculator</h1>
    <p class="text-lg text-gray-600">
      Find the price where you hit your margin AND your client sees clear ROI
    </p>
  </div>

  <!-- Model Selector -->
  <div class="mb-8">
    <label class="block text-sm font-medium text-gray-700 mb-3">Pricing Model</label>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
      {#each models as model}
        <button
          class="p-4 border-2 rounded-lg transition-all text-left {selectedModel === model.id
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'}"
          on:click={() => selectedModel = model.id}
        >
          <div class="text-2xl mb-2">{model.icon}</div>
          <div class="font-medium text-sm text-gray-900">{model.name}</div>
          <div class="text-xs text-gray-500 mt-1">{model.description}</div>
        </button>
      {/each}
    </div>
  </div>

  <div class="grid lg:grid-cols-2 gap-8">
    <!-- Inputs -->
    <div>
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Inputs</h2>

        {#if selectedModel === 'subscription'}
          <!-- Pricing Section -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Pricing</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Monthly Price per Customer (R)</label>
                <input type="number" bind:value={monthlyPrice} min="0" step="10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Number of Customers</label>
                <input type="number" bind:value={customers} min="0" step="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
            </div>
          </div>

          <!-- Seller Costs Section -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Your Costs</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Cost to Serve per Customer (R/month)</label>
                <input type="number" bind:value={costToServe} min="0" step="10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Infrastructure, support, customer success costs</p>
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Desired Gross Margin (%)</label>
                <input type="number" bind:value={desiredMargin} min="0" max="100" step="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Target profit margin (typical SaaS: 70-85%)</p>
              </div>
            </div>
          </div>

          <!-- Buyer Value Section -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Client Value</h3>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Monthly Value to Client (R)</label>
              <input type="number" bind:value={buyerValue} min="0" step="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <p class="text-xs text-gray-500 mt-1">Revenue enabled or cost saved per month</p>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Results -->
    <div>
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Results</h2>

        {#if results}
          <!-- Equilibrium Status -->
          <div class="mb-6 p-4 rounded-lg {results.equilibriumExists ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">{results.equilibriumExists ? '✓' : '✗'}</span>
              <h3 class="font-semibold {results.equilibriumExists ? 'text-green-900' : 'text-red-900'}">
                {results.equilibriumExists ? 'Equilibrium Exists' : 'No Viable Price Range'}
              </h3>
            </div>
            {#if results.equilibriumExists}
              <p class="text-sm text-green-800">
                A mutually beneficial price exists between {formatCurrency(results.minimumPrice)} and {formatCurrency(results.maximumPrice)}
              </p>
              <div class="mt-3 p-3 bg-white rounded border border-green-300">
                <div class="text-xs text-gray-600 mb-1">Suggested Price</div>
                <div class="text-2xl font-bold text-green-900">{formatCurrency(results.suggestedPrice)}</div>
                <div class="text-xs text-gray-600 mt-1">per customer/month</div>
              </div>
            {:else}
              <p class="text-sm text-red-800">
                Your minimum price ({formatCurrency(results.minimumPrice)}) exceeds the client's maximum ({formatCurrency(results.maximumPrice)})
              </p>
            {/if}
          </div>

          <!-- Financial Metrics -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Financial Performance</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-gray-50 rounded">
                <div class="text-xs text-gray-600">Monthly Revenue</div>
                <div class="font-semibold text-gray-900">{formatCurrency(results.monthlyRevenue)}</div>
              </div>
              <div class="p-3 bg-gray-50 rounded">
                <div class="text-xs text-gray-600">Monthly Profit</div>
                <div class="font-semibold text-gray-900">{formatCurrency(results.monthlyProfit)}</div>
              </div>
              <div class="p-3 bg-gray-50 rounded">
                <div class="text-xs text-gray-600">Annual Revenue</div>
                <div class="font-semibold text-gray-900">{formatCurrency(results.annualRevenue)}</div>
              </div>
              <div class="p-3 bg-gray-50 rounded">
                <div class="text-xs text-gray-600">Annual Profit</div>
                <div class="font-semibold text-gray-900">{formatCurrency(results.annualProfit)}</div>
              </div>
            </div>
          </div>

          <!-- Seller Perspective -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Your Position</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">Actual Margin</span>
                <span class="font-semibold {results.sellerMeetsTarget ? 'text-green-700' : 'text-red-700'}">
                  {formatPercent(results.actualMargin)}
                </span>
              </div>
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">Minimum Price Needed</span>
                <span class="font-semibold">{formatCurrency(results.minimumPrice)}</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">Meets Target?</span>
                <span class="font-semibold {results.sellerMeetsTarget ? 'text-green-700' : 'text-red-700'}">
                  {results.sellerMeetsTarget ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <!-- Buyer Perspective -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Client Position</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">ROI Multiplier</span>
                <span class="font-semibold text-gray-900">{results.buyerROI.toFixed(2)}x</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">Maximum Price They'll Pay</span>
                <span class="font-semibold">{formatCurrency(results.maximumPrice)}</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">Annual Savings</span>
                <span class="font-semibold text-gray-900">{formatCurrency(results.buyerAnnualSavings)}</span>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
