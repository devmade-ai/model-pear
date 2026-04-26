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

  // Derived: selected model metadata for print heading
  $: selectedModelInfo = models.find(m => m.id === selectedModel);

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

  // Requirement: Recalculate pricing results reactively when any input changes.
  // Approach: List all reactive dependencies explicitly in the $: declaration
  //   so Svelte's compiler tracks them. The function itself reads from closure
  //   variables, but Svelte needs them in the call expression to trigger reactivity.
  $: results = calculateResults(
    selectedModel,
    sub_monthlyPrice, sub_customers, sub_costToServe, sub_desiredMargin, sub_buyerValue,
    usage_pricePerUnit, usage_monthlyUnits, usage_costPerUnit, usage_desiredMargin, usage_buyerValuePerUnit,
    seat_pricePerSeat, seat_seats, seat_costPerSeat, seat_desiredMargin, seat_valuePerSeat,
    onetime_licensePrice, onetime_maintenanceFee, onetime_maintenanceAttach, onetime_existingCustomers,
    onetime_costToDeliver, onetime_monthlySupportCost, onetime_desiredMargin, onetime_buyerValuePerYear,
    market_commissionRate, market_avgTransactionValue, market_monthlyTransactions, market_activeSellers,
    market_costPerTransaction, market_desiredMargin, market_sellerValuePerTransaction
  );

  // Requirement: Find the price range where seller hits margin AND buyer sees ROI.
  // Approach: For each pricing model, calculate three key values:
  //   1. minimumPrice (seller floor): cost / (1 - desiredMargin%) — the price
  //      where seller exactly hits their target margin.
  //   2. maximumPrice (buyer ceiling): buyerValue × 0.4 — the most a buyer would
  //      pay, set at 40% of total value received. This reflects the principle that
  //      buyers typically expect to retain at least 60% of the value as their ROI.
  //   3. suggestedPrice (equilibrium): midpoint of floor and ceiling — a balanced
  //      starting point for negotiation.
  // Alternatives considered:
  //   - Buyer ceiling at 50% of value: Rejected — too aggressive, leaves
  //     insufficient ROI cushion for buyers to feel they're getting a good deal.
  //   - Dynamic ceiling based on market: Rejected — requires external data we
  //     don't have. The 40% heuristic is a reasonable starting point.
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
        avgTransactionsPerSeller: market_activeSellers > 0 ? market_monthlyTransactions / market_activeSellers : 0,
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
    <h1 class="text-3xl font-bold text-base-content mb-2">Pricing Calculator</h1>
    <p class="text-lg text-base-content/70">
      Find the price where you hit your margin AND your client sees clear ROI
    </p>
  </div>

  <!-- Model Selector (interactive — hidden in print) -->
  <div class="mb-8 no-print">
    <label class="block text-sm font-medium text-base-content/70 mb-3">Pricing Model</label>
    <!-- Mobile: horizontal scroll, Tablet+: grid -->
    <div class="flex gap-3 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-3 md:grid-cols-5 sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
      {#each models as model}
        <button
          class="flex-shrink-0 w-28 sm:w-auto p-3 sm:p-4 border-2 rounded-lg transition-all text-left touch-manipulation {selectedModel === model.id
            ? 'border-primary bg-primary/10'
            : 'border-base-300 hover:border-secondary active:bg-base-200'}"
          on:click={() => selectedModel = model.id}
        >
          <div class="text-xl sm:text-2xl mb-1 sm:mb-2">{model.icon}</div>
          <div class="font-medium text-xs sm:text-sm text-base-content leading-tight">{model.name}</div>
          <div class="text-xs text-base-content/70 mt-1 hidden sm:block">{model.description}</div>
        </button>
      {/each}
    </div>
    <p class="text-xs text-base-content/70/60 mt-2 sm:hidden text-center">Swipe to see all models</p>
  </div>

  <!-- Print-only: show selected model name (tab buttons are hidden in print).
       Uses .print-only utility — hidden on screen, visible in print. -->
  {#if selectedModelInfo}
    <div class="print-only mb-6">
      <p class="text-sm text-base-content/70">Pricing Model</p>
      <p class="text-lg font-semibold text-base-content">{selectedModelInfo.icon} {selectedModelInfo.name}</p>
    </div>
  {/if}

  <div class="grid lg:grid-cols-2 gap-8">
    <!-- Inputs -->
    <div>
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-base-content mb-4">Inputs</h2>

        {#if selectedModel === 'subscription'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Monthly Price per Customer (R)</label>
                  <input type="number" bind:value={sub_monthlyPrice} min="0" step="10"
                    class="input">
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Number of Customers</label>
                  <input type="number" bind:value={sub_customers} min="0" step="1"
                    class="input">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Cost to Serve per Customer (R/month)</label>
                  <input type="number" bind:value={sub_costToServe} min="0" step="10"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">Infrastructure, support costs per customer</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Desired Gross Margin (%)</label>
                  <input type="number" bind:value={sub_desiredMargin} min="0" max="100" step="1"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">Target profit margin (typical SaaS: 70-85%)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Client Value</h3>
              <div>
                <label class="block text-sm text-base-content/70 mb-1">Monthly Value to Client (R)</label>
                <input type="number" bind:value={sub_buyerValue} min="0" step="100"
                  class="input">
                <p class="text-xs text-base-content/70/60 mt-1">Revenue enabled or cost saved per month</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'usage-based'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Price per Unit (R)</label>
                  <input type="number" bind:value={usage_pricePerUnit} min="0" step="0.10"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">E.g., per 1,000 API calls</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Monthly Units</label>
                  <input type="number" bind:value={usage_monthlyUnits} min="0" step="100"
                    class="input">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Cost per Unit (R)</label>
                  <input type="number" bind:value={usage_costPerUnit} min="0" step="0.05"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">Infrastructure cost per unit</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Desired Gross Margin (%)</label>
                  <input type="number" bind:value={usage_desiredMargin} min="0" max="100" step="1"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">Typical usage-based: 75-90%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Client Value</h3>
              <div>
                <label class="block text-sm text-base-content/70 mb-1">Value per Unit to Client (R)</label>
                <input type="number" bind:value={usage_buyerValuePerUnit} min="0" step="0.50"
                  class="input">
                <p class="text-xs text-base-content/70/60 mt-1">Revenue enabled or cost saved per unit</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'per-seat'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Price per Seat (R/month)</label>
                  <input type="number" bind:value={seat_pricePerSeat} min="0" step="10"
                    class="input">
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Number of Seats</label>
                  <input type="number" bind:value={seat_seats} min="0" step="1"
                    class="input">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Cost per Seat (R/month)</label>
                  <input type="number" bind:value={seat_costPerSeat} min="0" step="5"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">Infrastructure and support cost per seat</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Desired Gross Margin (%)</label>
                  <input type="number" bind:value={seat_desiredMargin} min="0" max="100" step="1"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">Typical per-seat: 70-80%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Client Value</h3>
              <div>
                <label class="block text-sm text-base-content/70 mb-1">Monthly Value per Seat to Client (R)</label>
                <input type="number" bind:value={seat_valuePerSeat} min="0" step="50"
                  class="input">
                <p class="text-xs text-base-content/70/60 mt-1">Productivity gain or cost saved per user per month</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'one-time'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">License Price (R)</label>
                  <input type="number" bind:value={onetime_licensePrice} min="0" step="100"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">One-time perpetual license fee</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Annual Maintenance Fee (%)</label>
                  <input type="number" bind:value={onetime_maintenanceFee} min="0" max="100" step="1"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">% of license price (typical: 15-25%)</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Maintenance Attach Rate (%)</label>
                  <input type="number" bind:value={onetime_maintenanceAttach} min="0" max="100" step="1"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">% of customers buying maintenance</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Existing Customers on Maintenance</label>
                  <input type="number" bind:value={onetime_existingCustomers} min="0" step="1"
                    class="input">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Cost to Deliver per License (R)</label>
                  <input type="number" bind:value={onetime_costToDeliver} min="0" step="100"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">One-time onboarding, implementation cost</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Monthly Support Cost per Customer (R)</label>
                  <input type="number" bind:value={onetime_monthlySupportCost} min="0" step="10"
                    class="input">
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Desired Gross Margin (%)</label>
                  <input type="number" bind:value={onetime_desiredMargin} min="0" max="100" step="1"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">Typical: 70-80%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Client Value</h3>
              <div>
                <label class="block text-sm text-base-content/70 mb-1">Annual Value to Client (R)</label>
                <input type="number" bind:value={onetime_buyerValuePerYear} min="0" step="500"
                  class="input">
                <p class="text-xs text-base-content/70/60 mt-1">Annual productivity gain or cost saved</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'marketplace'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Commission Rate (%)</label>
                  <input type="number" bind:value={market_commissionRate} min="0" max="100" step="0.5"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">% commission on each transaction</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Average Transaction Value (R)</label>
                  <input type="number" bind:value={market_avgTransactionValue} min="0" step="50"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">Average GMV per transaction</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Monthly Transactions</label>
                  <input type="number" bind:value={market_monthlyTransactions} min="0" step="10"
                    class="input">
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Active Sellers</label>
                  <input type="number" bind:value={market_activeSellers} min="0" step="1"
                    class="input">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Cost per Transaction (R)</label>
                  <input type="number" bind:value={market_costPerTransaction} min="0" step="1"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">Payment processing, support, fraud prevention</p>
                </div>
                <div>
                  <label class="block text-sm text-base-content/70 mb-1">Desired Gross Margin (%)</label>
                  <input type="number" bind:value={market_desiredMargin} min="0" max="100" step="1"
                    class="input">
                  <p class="text-xs text-base-content/70/60 mt-1">Typical: 60-75%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Seller Value</h3>
              <div>
                <label class="block text-sm text-base-content/70 mb-1">Value per Transaction to Seller (R)</label>
                <input type="number" bind:value={market_sellerValuePerTransaction} min="0" step="10"
                  class="input">
                <p class="text-xs text-base-content/70/60 mt-1">Profit seller makes per transaction (before commission)</p>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Results -->
    <div>
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">Results</h2>
          <!-- Requirement: Let users save pricing results as PDF via the browser's native print dialog.
               Approach: window.print() — zero dependencies, leverages existing @media print CSS in app.css.
               Alternative considered: pdf-lib — rejected because content is text/tables (not canvas),
               so the browser print engine handles it well without extra bundle size. -->
          <button class="btn-outline text-sm no-print" on:click={() => window.print()} title="Save this page as a PDF using your browser's print dialog">
            Save as PDF
          </button>
        </div>

        {#if results}
          <!-- Equilibrium Status -->
          <div class="mb-6 p-4 rounded-lg {results.equilibriumExists ? 'bg-success/10 border border-success/30' : 'bg-error/10 border border-error/30'}">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">{results.equilibriumExists ? '✓' : '✗'}</span>
              <h3 class="font-semibold {results.equilibriumExists ? 'text-success' : 'text-error'}">
                {results.equilibriumExists ? 'Equilibrium Exists' : 'No Viable Price Range'}
              </h3>
            </div>
            {#if results.equilibriumExists}
              <p class="text-sm text-success/80">
                A mutually beneficial price exists between {selectedModel === 'marketplace' ? formatPercent(results.minimumPrice) : formatCurrency(results.minimumPrice)} and {selectedModel === 'marketplace' ? formatPercent(results.maximumPrice) : formatCurrency(results.maximumPrice)}
              </p>
              <div class="mt-3 p-3 bg-base-200 rounded border border-success/30">
                <div class="text-xs text-base-content/70 mb-1">Suggested Price</div>
                <div class="text-2xl font-bold text-success">
                  {selectedModel === 'marketplace' ? formatPercent(results.suggestedPrice) : formatCurrency(results.suggestedPrice)}
                </div>
                <div class="text-xs text-base-content/70 mt-1">{results.metricLabel}</div>
              </div>
            {:else}
              <p class="text-sm text-error/80">
                Your minimum price ({selectedModel === 'marketplace' ? formatPercent(results.minimumPrice) : formatCurrency(results.minimumPrice)}) exceeds the client's maximum ({selectedModel === 'marketplace' ? formatPercent(results.maximumPrice) : formatCurrency(results.maximumPrice)})
              </p>
            {/if}
          </div>

          <!-- Equilibrium Visualization -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-base-content/70 mb-3">Price Range Visualization</h3>
            <div class="bg-base-300 rounded-lg p-4">
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
            <h3 class="text-sm font-medium text-base-content/70 mb-3">Financial Performance</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-base-300 rounded">
                <div class="text-xs text-base-content/70">Monthly Revenue</div>
                <div class="font-semibold text-base-content">{formatCurrency(results.monthlyRevenue)}</div>
              </div>
              <div class="p-3 bg-base-300 rounded">
                <div class="text-xs text-base-content/70">Monthly Profit</div>
                <div class="font-semibold text-base-content">{formatCurrency(results.monthlyProfit)}</div>
              </div>
              <div class="p-3 bg-base-300 rounded">
                <div class="text-xs text-base-content/70">Annual Revenue</div>
                <div class="font-semibold text-base-content">{formatCurrency(results.annualRevenue)}</div>
              </div>
              <div class="p-3 bg-base-300 rounded">
                <div class="text-xs text-base-content/70">Annual Profit</div>
                <div class="font-semibold text-base-content">{formatCurrency(results.annualProfit)}</div>
              </div>
            </div>
          </div>

          <!-- Seller Perspective -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Position</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center p-2 bg-base-300 rounded">
                <span class="text-sm text-base-content/70">Actual Margin</span>
                <span class="font-semibold {results.sellerMeetsTarget ? 'text-success' : 'text-error'}">
                  {formatPercent(results.actualMargin)}
                </span>
              </div>
              <div class="flex justify-between items-center p-2 bg-base-300 rounded">
                <span class="text-sm text-base-content/70">Minimum Price Needed</span>
                <span class="font-semibold text-base-content">{selectedModel === 'marketplace' ? formatPercent(results.minimumPrice) : formatCurrency(results.minimumPrice)}</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-base-300 rounded">
                <span class="text-sm text-base-content/70">Meets Target?</span>
                <span class="font-semibold {results.sellerMeetsTarget ? 'text-success' : 'text-error'}">
                  {results.sellerMeetsTarget ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <!-- Buyer Perspective -->
          <div>
            <h3 class="text-sm font-medium text-base-content/70 mb-3">{selectedModel === 'marketplace' ? 'Seller Position' : 'Client Position'}</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center p-2 bg-base-300 rounded">
                <span class="text-sm text-base-content/70">ROI Multiplier</span>
                <span class="font-semibold text-base-content">{results.buyerROI.toFixed(2)}x</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-base-300 rounded">
                <span class="text-sm text-base-content/70">Maximum Price They'll Pay</span>
                <span class="font-semibold text-base-content">{selectedModel === 'marketplace' ? formatPercent(results.maximumPrice) : formatCurrency(results.maximumPrice)}</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-base-300 rounded">
                <span class="text-sm text-base-content/70">Annual Savings</span>
                <span class="font-semibold text-base-content">{formatCurrency(results.buyerAnnualSavings)}</span>
              </div>
              {#if results.buyerPaybackMonths !== undefined}
                <div class="flex justify-between items-center p-2 bg-base-300 rounded">
                  <span class="text-sm text-base-content/70">Payback Period</span>
                  <span class="font-semibold text-base-content">
                    {results.buyerPaybackMonths === Infinity ? '∞' : `${results.buyerPaybackMonths.toFixed(1)} months`}
                  </span>
                </div>
              {/if}
              {#if results.avgTransactionsPerSeller !== undefined}
                <div class="flex justify-between items-center p-2 bg-base-300 rounded">
                  <span class="text-sm text-base-content/70">Avg Transactions per Seller</span>
                  <span class="font-semibold text-base-content">{results.avgTransactionsPerSeller.toFixed(1)}</span>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
