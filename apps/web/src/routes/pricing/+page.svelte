<script lang="ts">
  import { formatCurrency, formatPercent } from '$lib/utils/formatters';
  import { EquilibriumChart } from '$lib/components/charts';

  const models = [
    { id: 'subscription', name: 'Subscription (SaaS)', icon: '🔄', description: 'Monthly recurring revenue' },
    { id: 'usage-based', name: 'Usage-Based', icon: '📊', description: 'Pay per unit' },
    { id: 'per-seat', name: 'Per-Seat', icon: '👥', description: 'Price per user' },
    { id: 'one-time', name: 'One-Time', icon: '💵', description: 'Perpetual license' },
    { id: 'marketplace', name: 'Marketplace', icon: '🛒', description: 'Commission model' }
  ];

  let selectedModel = 'subscription';

  // Subscription inputs
  let sub_monthlyPrice = 500;
  let sub_customers = 100;
  let sub_costToServe = 150;
  let sub_desiredMargin = 70;
  let sub_buyerValue = 5000;

  // Usage-based inputs
  let usage_pricePerUnit = 2.00;
  let usage_monthlyUnits = 10000;
  let usage_costPerUnit = 0.50;
  let usage_desiredMargin = 75;
  let usage_buyerValuePerUnit = 10.00;

  // Per-seat inputs
  let seat_pricePerSeat = 250;
  let seat_seats = 25;
  let seat_costPerSeat = 70;
  let seat_desiredMargin = 72;
  let seat_valuePerSeat = 2000;

  // One-time inputs
  let onetime_licensePrice = 5000;
  let onetime_maintenanceFee = 20;
  let onetime_maintenanceAttach = 60;
  let onetime_existingCustomers = 30;
  let onetime_costToDeliver = 1500;
  let onetime_monthlySupportCost = 50;
  let onetime_desiredMargin = 70;
  let onetime_buyerValuePerYear = 15000;

  // Marketplace inputs
  let market_commissionRate = 10;
  let market_avgTransactionValue = 500;
  let market_monthlyTransactions = 200;
  let market_activeSellers = 20;
  let market_costPerTransaction = 15;
  let market_desiredMargin = 70;
  let market_sellerValuePerTransaction = 150;

  $: results = calculateResults();

  function calculateResults() {
    if (selectedModel === 'subscription') {
      const monthlyRevenue = sub_monthlyPrice * sub_customers;
      const monthlyCost = sub_costToServe * sub_customers;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      const minimumPrice = sub_desiredMargin >= 100 ? Infinity : sub_costToServe / (1 - sub_desiredMargin / 100);
      const sellerMeetsTarget = sub_monthlyPrice >= minimumPrice;

      const maximumPrice = sub_buyerValue * 0.4;
      const buyerROI = sub_monthlyPrice > 0 ? sub_buyerValue / sub_monthlyPrice : 0;

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
        buyerAnnualSavings: (sub_buyerValue - sub_monthlyPrice) * 12,
        metricLabel: 'per customer/month'
      };
    } else if (selectedModel === 'usage-based') {
      const monthlyRevenue = usage_pricePerUnit * usage_monthlyUnits;
      const monthlyCost = usage_costPerUnit * usage_monthlyUnits;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      const minimumPricePerUnit = usage_desiredMargin >= 100 ? Infinity : usage_costPerUnit / (1 - usage_desiredMargin / 100);
      const sellerMeetsTarget = usage_pricePerUnit >= minimumPricePerUnit;

      const maximumPricePerUnit = usage_buyerValuePerUnit * 0.4;
      const buyerROIPerUnit = usage_pricePerUnit > 0 ? usage_buyerValuePerUnit / usage_pricePerUnit : 0;
      const buyerMonthlyValue = usage_buyerValuePerUnit * usage_monthlyUnits;
      const buyerMonthlySavings = buyerMonthlyValue - monthlyRevenue;

      const equilibriumExists = minimumPricePerUnit <= maximumPricePerUnit;
      const suggestedPrice = equilibriumExists ? (minimumPricePerUnit + maximumPricePerUnit) / 2 : 0;

      return {
        monthlyRevenue,
        monthlyCost,
        monthlyProfit,
        actualMargin,
        annualRevenue: monthlyRevenue * 12,
        annualProfit: monthlyProfit * 12,
        minimumPrice: minimumPricePerUnit,
        maximumPrice: maximumPricePerUnit,
        suggestedPrice,
        equilibriumExists,
        sellerMeetsTarget,
        buyerROI: buyerROIPerUnit,
        buyerAnnualSavings: buyerMonthlySavings * 12,
        metricLabel: 'per unit'
      };
    } else if (selectedModel === 'per-seat') {
      const monthlyRevenue = seat_pricePerSeat * seat_seats;
      const monthlyCost = seat_costPerSeat * seat_seats;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      const minimumPricePerSeat = seat_desiredMargin >= 100 ? Infinity : seat_costPerSeat / (1 - seat_desiredMargin / 100);
      const sellerMeetsTarget = seat_pricePerSeat >= minimumPricePerSeat;

      const maximumPricePerSeat = seat_valuePerSeat * 0.4;
      const buyerROIPerSeat = seat_pricePerSeat > 0 ? seat_valuePerSeat / seat_pricePerSeat : 0;
      const buyerMonthlyValue = seat_valuePerSeat * seat_seats;
      const buyerMonthlySavings = buyerMonthlyValue - monthlyRevenue;

      const equilibriumExists = minimumPricePerSeat <= maximumPricePerSeat;
      const suggestedPrice = equilibriumExists ? (minimumPricePerSeat + maximumPricePerSeat) / 2 : 0;

      return {
        monthlyRevenue,
        monthlyCost,
        monthlyProfit,
        actualMargin,
        annualRevenue: monthlyRevenue * 12,
        annualProfit: monthlyProfit * 12,
        minimumPrice: minimumPricePerSeat,
        maximumPrice: maximumPricePerSeat,
        suggestedPrice,
        equilibriumExists,
        sellerMeetsTarget,
        buyerROI: buyerROIPerSeat,
        buyerAnnualSavings: buyerMonthlySavings * 12,
        metricLabel: 'per seat/month'
      };
    } else if (selectedModel === 'one-time') {
      const annualMaintenanceFee = onetime_licensePrice * (onetime_maintenanceFee / 100);
      const monthlyMaintenanceRevenue = (onetime_existingCustomers * annualMaintenanceFee) / 12;
      const monthlyRevenue = monthlyMaintenanceRevenue;

      const monthlySupportCost = onetime_existingCustomers * onetime_monthlySupportCost;
      const monthlyCost = monthlySupportCost;

      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      const minimumLicensePrice = onetime_desiredMargin >= 100 ? Infinity : onetime_costToDeliver / (1 - onetime_desiredMargin / 100);
      const sellerMeetsTarget = onetime_licensePrice >= minimumLicensePrice;

      const buyerFirstYearCost = onetime_licensePrice + (annualMaintenanceFee * (onetime_maintenanceAttach / 100));
      const buyerROIFirstYear = buyerFirstYearCost > 0 ? onetime_buyerValuePerYear / buyerFirstYearCost : 0;
      const buyerPaybackMonths = buyerFirstYearCost > 0 && onetime_buyerValuePerYear > 0 ? 12 * (buyerFirstYearCost / onetime_buyerValuePerYear) : Infinity;

      const maximumPriceBuyerWillPay = onetime_buyerValuePerYear * 0.5;
      const equilibriumExists = minimumLicensePrice <= maximumPriceBuyerWillPay;
      const suggestedPrice = equilibriumExists ? (minimumLicensePrice + maximumPriceBuyerWillPay) / 2 : 0;

      return {
        monthlyRevenue,
        monthlyCost,
        monthlyProfit,
        actualMargin,
        annualRevenue: monthlyRevenue * 12,
        annualProfit: monthlyProfit * 12,
        minimumPrice: minimumLicensePrice,
        maximumPrice: maximumPriceBuyerWillPay,
        suggestedPrice,
        equilibriumExists,
        sellerMeetsTarget,
        buyerROI: buyerROIFirstYear,
        buyerAnnualSavings: onetime_buyerValuePerYear - buyerFirstYearCost,
        buyerPaybackMonths,
        metricLabel: 'license price'
      };
    } else if (selectedModel === 'marketplace') {
      const monthlyGMV = market_avgTransactionValue * market_monthlyTransactions;
      const commissionPerTransaction = market_avgTransactionValue * (market_commissionRate / 100);
      const monthlyRevenue = commissionPerTransaction * market_monthlyTransactions;

      const monthlyCost = market_costPerTransaction * market_monthlyTransactions;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      const minimumCommissionRate = market_desiredMargin >= 100 ? 100 :
        (market_costPerTransaction / market_avgTransactionValue) / (1 - market_desiredMargin / 100) * 100;
      const sellerMeetsTarget = market_commissionRate >= minimumCommissionRate;

      const sellerNetProfit = market_sellerValuePerTransaction - commissionPerTransaction;
      const sellerROI = market_sellerValuePerTransaction > 0 ? sellerNetProfit / market_sellerValuePerTransaction : 0;
      const sellerMonthlyProfit = sellerNetProfit * market_monthlyTransactions;

      const maximumCommissionRate = market_avgTransactionValue > 0 ?
        (market_sellerValuePerTransaction * 0.3) / market_avgTransactionValue * 100 : 0;
      const equilibriumExists = minimumCommissionRate <= maximumCommissionRate;
      const suggestedPrice = equilibriumExists ? (minimumCommissionRate + maximumCommissionRate) / 2 : 0;

      return {
        monthlyRevenue,
        monthlyCost,
        monthlyProfit,
        actualMargin,
        annualRevenue: monthlyRevenue * 12,
        annualProfit: monthlyProfit * 12,
        monthlyGMV,
        annualGMV: monthlyGMV * 12,
        minimumPrice: minimumCommissionRate,
        maximumPrice: maximumCommissionRate,
        suggestedPrice,
        equilibriumExists,
        sellerMeetsTarget,
        buyerROI: sellerROI,
        buyerAnnualSavings: sellerMonthlyProfit * 12,
        metricLabel: 'commission rate %'
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
    <!-- Mobile: horizontal scroll, Tablet+: grid -->
    <div class="flex gap-3 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-3 md:grid-cols-5 sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
      {#each models as model}
        <button
          class="flex-shrink-0 w-28 sm:w-auto p-3 sm:p-4 border-2 rounded-lg transition-all text-left touch-manipulation {selectedModel === model.id
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'}"
          on:click={() => selectedModel = model.id}
        >
          <div class="text-xl sm:text-2xl mb-1 sm:mb-2">{model.icon}</div>
          <div class="font-medium text-xs sm:text-sm text-gray-900 leading-tight">{model.name}</div>
          <div class="text-xs text-gray-500 mt-1 hidden sm:block">{model.description}</div>
        </button>
      {/each}
    </div>
    <p class="text-xs text-gray-400 mt-2 sm:hidden text-center">Swipe to see all models</p>
  </div>

  <div class="grid lg:grid-cols-2 gap-8">
    <!-- Inputs -->
    <div>
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Inputs</h2>

        {#if selectedModel === 'subscription'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Monthly Price per Customer (R)</label>
                  <input type="number" bind:value={sub_monthlyPrice} min="0" step="10"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Number of Customers</label>
                  <input type="number" bind:value={sub_customers} min="0" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Cost to Serve per Customer (R/month)</label>
                  <input type="number" bind:value={sub_costToServe} min="0" step="10"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">Infrastructure, support costs per customer</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Desired Gross Margin (%)</label>
                  <input type="number" bind:value={sub_desiredMargin} min="0" max="100" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">Target profit margin (typical SaaS: 70-85%)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Client Value</h3>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Monthly Value to Client (R)</label>
                <input type="number" bind:value={sub_buyerValue} min="0" step="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Revenue enabled or cost saved per month</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'usage-based'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Price per Unit (R)</label>
                  <input type="number" bind:value={usage_pricePerUnit} min="0" step="0.10"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">E.g., per 1,000 API calls</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Monthly Units</label>
                  <input type="number" bind:value={usage_monthlyUnits} min="0" step="100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Cost per Unit (R)</label>
                  <input type="number" bind:value={usage_costPerUnit} min="0" step="0.05"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">Infrastructure cost per unit</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Desired Gross Margin (%)</label>
                  <input type="number" bind:value={usage_desiredMargin} min="0" max="100" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">Typical usage-based: 75-90%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Client Value</h3>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Value per Unit to Client (R)</label>
                <input type="number" bind:value={usage_buyerValuePerUnit} min="0" step="0.50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Revenue enabled or cost saved per unit</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'per-seat'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Price per Seat (R/month)</label>
                  <input type="number" bind:value={seat_pricePerSeat} min="0" step="10"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Number of Seats</label>
                  <input type="number" bind:value={seat_seats} min="0" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Cost per Seat (R/month)</label>
                  <input type="number" bind:value={seat_costPerSeat} min="0" step="5"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">Infrastructure and support cost per seat</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Desired Gross Margin (%)</label>
                  <input type="number" bind:value={seat_desiredMargin} min="0" max="100" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">Typical per-seat: 70-80%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Client Value</h3>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Monthly Value per Seat to Client (R)</label>
                <input type="number" bind:value={seat_valuePerSeat} min="0" step="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Productivity gain or cost saved per user per month</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'one-time'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">License Price (R)</label>
                  <input type="number" bind:value={onetime_licensePrice} min="0" step="100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">One-time perpetual license fee</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Annual Maintenance Fee (%)</label>
                  <input type="number" bind:value={onetime_maintenanceFee} min="0" max="100" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">% of license price (typical: 15-25%)</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Maintenance Attach Rate (%)</label>
                  <input type="number" bind:value={onetime_maintenanceAttach} min="0" max="100" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">% of customers buying maintenance</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Existing Customers on Maintenance</label>
                  <input type="number" bind:value={onetime_existingCustomers} min="0" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Cost to Deliver per License (R)</label>
                  <input type="number" bind:value={onetime_costToDeliver} min="0" step="100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">One-time onboarding, implementation cost</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Monthly Support Cost per Customer (R)</label>
                  <input type="number" bind:value={onetime_monthlySupportCost} min="0" step="10"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Desired Gross Margin (%)</label>
                  <input type="number" bind:value={onetime_desiredMargin} min="0" max="100" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">Typical: 70-80%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Client Value</h3>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Annual Value to Client (R)</label>
                <input type="number" bind:value={onetime_buyerValuePerYear} min="0" step="500"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Annual productivity gain or cost saved</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'marketplace'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Commission Rate (%)</label>
                  <input type="number" bind:value={market_commissionRate} min="0" max="100" step="0.5"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">% commission on each transaction</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Average Transaction Value (R)</label>
                  <input type="number" bind:value={market_avgTransactionValue} min="0" step="50"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">Average GMV per transaction</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Monthly Transactions</label>
                  <input type="number" bind:value={market_monthlyTransactions} min="0" step="10"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Active Sellers</label>
                  <input type="number" bind:value={market_activeSellers} min="0" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Cost per Transaction (R)</label>
                  <input type="number" bind:value={market_costPerTransaction} min="0" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">Payment processing, support, fraud prevention</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">Desired Gross Margin (%)</label>
                  <input type="number" bind:value={market_desiredMargin} min="0" max="100" step="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <p class="text-xs text-gray-500 mt-1">Typical: 60-75%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Seller Value</h3>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Value per Transaction to Seller (R)</label>
                <input type="number" bind:value={market_sellerValuePerTransaction} min="0" step="10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Profit seller makes per transaction (before commission)</p>
              </div>
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
                A mutually beneficial price exists between {selectedModel === 'marketplace' ? formatPercent(results.minimumPrice) : formatCurrency(results.minimumPrice)} and {selectedModel === 'marketplace' ? formatPercent(results.maximumPrice) : formatCurrency(results.maximumPrice)}
              </p>
              <div class="mt-3 p-3 bg-white rounded border border-green-300">
                <div class="text-xs text-gray-600 mb-1">Suggested Price</div>
                <div class="text-2xl font-bold text-green-900">
                  {selectedModel === 'marketplace' ? formatPercent(results.suggestedPrice) : formatCurrency(results.suggestedPrice)}
                </div>
                <div class="text-xs text-gray-600 mt-1">{results.metricLabel}</div>
              </div>
            {:else}
              <p class="text-sm text-red-800">
                Your minimum price ({selectedModel === 'marketplace' ? formatPercent(results.minimumPrice) : formatCurrency(results.minimumPrice)}) exceeds the client's maximum ({selectedModel === 'marketplace' ? formatPercent(results.maximumPrice) : formatCurrency(results.maximumPrice)})
              </p>
            {/if}
          </div>

          <!-- Equilibrium Visualization -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Price Range Visualization</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <EquilibriumChart
                minimumPrice={results.minimumPrice}
                maximumPrice={results.maximumPrice}
                currentPrice={selectedModel === 'subscription' ? sub_monthlyPrice :
                              selectedModel === 'usage-based' ? usage_pricePerUnit :
                              selectedModel === 'per-seat' ? seat_pricePerSeat :
                              selectedModel === 'one-time' ? onetime_licensePrice :
                              market_commissionRate}
                suggestedPrice={results.suggestedPrice}
                equilibriumExists={results.equilibriumExists}
                isPercentage={selectedModel === 'marketplace'}
                height={180}
              />
            </div>
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
                <span class="font-semibold">{selectedModel === 'marketplace' ? formatPercent(results.minimumPrice) : formatCurrency(results.minimumPrice)}</span>
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
            <h3 class="text-sm font-medium text-gray-700 mb-3">{selectedModel === 'marketplace' ? 'Seller Position' : 'Client Position'}</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">ROI Multiplier</span>
                <span class="font-semibold text-gray-900">{results.buyerROI.toFixed(2)}x</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">Maximum Price They'll Pay</span>
                <span class="font-semibold">{selectedModel === 'marketplace' ? formatPercent(results.maximumPrice) : formatCurrency(results.maximumPrice)}</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">Annual Savings</span>
                <span class="font-semibold text-gray-900">{formatCurrency(results.buyerAnnualSavings)}</span>
              </div>
              {#if results.buyerPaybackMonths !== undefined}
                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-600">Payback Period</span>
                  <span class="font-semibold text-gray-900">
                    {results.buyerPaybackMonths === Infinity ? '∞' : `${results.buyerPaybackMonths.toFixed(1)} months`}
                  </span>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
