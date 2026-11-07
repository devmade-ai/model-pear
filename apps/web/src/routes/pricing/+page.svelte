<script lang="ts">
  import SeoHead from '$lib/SeoHead.svelte';
  import { PAGES } from '$lib/seo';
  import {
    formatCurrency,
    formatPercent,
    formatCurrencySafe,
    formatPercentSafe,
    parseFiniteNumber,
    validatePricingModel,
    chartFiniteProps,
    type PricingModelId,
  } from '$lib/utils';
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

  // Subscription inputs (number | '' preserves clearing/retyping)
  let sub_monthlyPrice: number | '' = 500;
  let sub_customers: number | '' = 100;
  let sub_costToServe: number | '' = 150;
  let sub_desiredMargin: number | '' = 70;
  let sub_buyerValue: number | '' = 5000;

  // Usage-based inputs
  let usage_pricePerUnit: number | '' = 2.0;
  let usage_monthlyUnits: number | '' = 10000;
  let usage_costPerUnit: number | '' = 0.5;
  let usage_desiredMargin: number | '' = 75;
  let usage_buyerValuePerUnit: number | '' = 10.0;

  // Per-seat inputs
  let seat_pricePerSeat: number | '' = 250;
  let seat_seats: number | '' = 25;
  let seat_costPerSeat: number | '' = 70;
  let seat_desiredMargin: number | '' = 72;
  let seat_valuePerSeat: number | '' = 2000;

  // One-time inputs
  let onetime_licensePrice: number | '' = 5000;
  let onetime_maintenanceFee: number | '' = 20;
  let onetime_maintenanceAttach: number | '' = 60;
  let onetime_existingCustomers: number | '' = 30;
  let onetime_costToDeliver: number | '' = 1500;
  let onetime_monthlySupportCost: number | '' = 50;
  let onetime_desiredMargin: number | '' = 70;
  let onetime_buyerValuePerYear: number | '' = 15000;

  // Marketplace inputs
  let market_commissionRate: number | '' = 10;
  let market_avgTransactionValue: number | '' = 500;
  let market_monthlyTransactions: number | '' = 200;
  let market_activeSellers: number | '' = 20;
  let market_costPerTransaction: number | '' = 15;
  let market_desiredMargin: number | '' = 70;
  let market_sellerValuePerTransaction: number | '' = 150;

  // Requirement: Recalculate pricing results reactively when any input changes.
  // Approach: List all reactive dependencies explicitly in the $: declaration
  //   so Svelte's compiler tracks them. The function itself reads from closure
  //   variables, but Svelte needs them in the call expression to trigger reactivity.
  // List every pricing input in the deps so Svelte re-runs validation on edit
  // (same pattern as calculateResults below — closure-only reads are not tracked).
  $: pricingFieldDefs = buildPricingFieldDefs(
    selectedModel as PricingModelId,
    sub_monthlyPrice,
    sub_customers,
    sub_costToServe,
    sub_desiredMargin,
    sub_buyerValue,
    usage_pricePerUnit,
    usage_monthlyUnits,
    usage_costPerUnit,
    usage_desiredMargin,
    usage_buyerValuePerUnit,
    seat_pricePerSeat,
    seat_seats,
    seat_costPerSeat,
    seat_desiredMargin,
    seat_valuePerSeat,
    onetime_licensePrice,
    onetime_maintenanceFee,
    onetime_maintenanceAttach,
    onetime_existingCustomers,
    onetime_costToDeliver,
    onetime_monthlySupportCost,
    onetime_desiredMargin,
    onetime_buyerValuePerYear,
    market_commissionRate,
    market_avgTransactionValue,
    market_monthlyTransactions,
    market_activeSellers,
    market_costPerTransaction,
    market_desiredMargin,
    market_sellerValuePerTransaction
  );
  $: pricingInputIssues = validatePricingModel(selectedModel as PricingModelId, pricingFieldDefs);
  $: pricingInputsValid = pricingInputIssues.length === 0;

  $: currentPriceForChart =
    selectedModel === 'subscription'
      ? num(sub_monthlyPrice)
      : selectedModel === 'usage-based'
        ? num(usage_pricePerUnit)
        : selectedModel === 'per-seat'
          ? num(seat_pricePerSeat)
          : selectedModel === 'one-time'
            ? num(onetime_licensePrice)
            : num(market_commissionRate);

  $: showEquilibriumChart =
    pricingInputsValid &&
    results &&
    chartFiniteProps({
      minimumPrice: results.minimumPrice,
      maximumPrice: results.maximumPrice,
      currentPrice: currentPriceForChart,
      suggestedPrice: results.suggestedPrice,
    });

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

  function num(v: number | ''): number {
    return parseFiniteNumber(v) ?? 0;
  }

  function buildPricingFieldDefs(model: PricingModelId, ..._reactivityDeps: unknown[]) {
    void _reactivityDeps;
    const defs: Record<string, { label: string; value: number | ''; min?: number; max?: number }> = {};
    if (model === 'subscription') {
      defs.sub_monthlyPrice = { label: 'Monthly Price per Customer', value: sub_monthlyPrice, min: 0 };
      defs.sub_customers = { label: 'Number of Customers', value: sub_customers, min: 0 };
      defs.sub_costToServe = { label: 'Cost to Serve per Customer', value: sub_costToServe, min: 0 };
      defs.sub_desiredMargin = { label: 'Desired Gross Margin', value: sub_desiredMargin, min: 0, max: 99 };
      defs.sub_buyerValue = { label: 'Monthly Value to Client', value: sub_buyerValue, min: 0 };
    } else if (model === 'usage-based') {
      defs.usage_pricePerUnit = { label: 'Price per Unit', value: usage_pricePerUnit, min: 0 };
      defs.usage_monthlyUnits = { label: 'Monthly Units', value: usage_monthlyUnits, min: 0 };
      defs.usage_costPerUnit = { label: 'Cost per Unit', value: usage_costPerUnit, min: 0 };
      defs.usage_desiredMargin = { label: 'Desired Gross Margin', value: usage_desiredMargin, min: 0, max: 99 };
      defs.usage_buyerValuePerUnit = { label: 'Value per Unit to Client', value: usage_buyerValuePerUnit, min: 0 };
    } else if (model === 'per-seat') {
      defs.seat_pricePerSeat = { label: 'Price per Seat', value: seat_pricePerSeat, min: 0 };
      defs.seat_seats = { label: 'Number of Seats', value: seat_seats, min: 0 };
      defs.seat_costPerSeat = { label: 'Cost per Seat', value: seat_costPerSeat, min: 0 };
      defs.seat_desiredMargin = { label: 'Desired Gross Margin', value: seat_desiredMargin, min: 0, max: 99 };
      defs.seat_valuePerSeat = { label: 'Monthly Value per Seat to Client', value: seat_valuePerSeat, min: 0 };
    } else if (model === 'one-time') {
      defs.onetime_licensePrice = { label: 'License Price', value: onetime_licensePrice, min: 0 };
      defs.onetime_costToDeliver = { label: 'Cost to Deliver per License', value: onetime_costToDeliver, min: 0 };
      defs.onetime_desiredMargin = { label: 'Desired Gross Margin', value: onetime_desiredMargin, min: 0, max: 99 };
      defs.onetime_buyerValuePerYear = { label: 'Annual Value to Client', value: onetime_buyerValuePerYear, min: 0 };
      defs.onetime_maintenanceFee = { label: 'Annual Maintenance Fee', value: onetime_maintenanceFee, min: 0, max: 100 };
      defs.onetime_maintenanceAttach = { label: 'Maintenance Attach Rate', value: onetime_maintenanceAttach, min: 0, max: 100 };
      defs.onetime_existingCustomers = { label: 'Existing Customers on Maintenance', value: onetime_existingCustomers, min: 0 };
      defs.onetime_monthlySupportCost = { label: 'Monthly Support Cost per Customer', value: onetime_monthlySupportCost, min: 0 };
    } else if (model === 'marketplace') {
      defs.market_commissionRate = { label: 'Commission Rate', value: market_commissionRate, min: 0, max: 100 };
      defs.market_avgTransactionValue = { label: 'Average Transaction Value', value: market_avgTransactionValue, min: 0 };
      defs.market_monthlyTransactions = { label: 'Monthly Transactions', value: market_monthlyTransactions, min: 0 };
      defs.market_costPerTransaction = { label: 'Cost per Transaction', value: market_costPerTransaction, min: 0 };
      defs.market_desiredMargin = { label: 'Desired Gross Margin', value: market_desiredMargin, min: 0, max: 99 };
      defs.market_sellerValuePerTransaction = { label: 'Value per Transaction to Seller', value: market_sellerValuePerTransaction, min: 0 };
      defs.market_activeSellers = { label: 'Active Sellers', value: market_activeSellers, min: 0 };
    }
    return defs;
  }

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
  // Accepts a rest param of dep tokens so the call site at line 62 can
  // list every reactive variable explicitly — Svelte tracks lexical reads
  // on the right-hand side, not closure captures, so without the explicit
  // args this function wouldn't re-run when an input prop changes.
  function calculateResults(..._deps: unknown[]) {
    if (selectedModel === 'subscription') {
      const monthlyPrice = num(sub_monthlyPrice);
      const customers = num(sub_customers);
      const costToServe = num(sub_costToServe);
      const desiredMargin = num(sub_desiredMargin);
      const buyerValue = num(sub_buyerValue);

      const monthlyRevenue = monthlyPrice * customers;
      const monthlyCost = costToServe * customers;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      const minimumPrice =
        desiredMargin >= 100 ? Number.NaN : costToServe / (1 - desiredMargin / 100);
      const sellerMeetsTarget = Number.isFinite(minimumPrice) && monthlyPrice >= minimumPrice;

      const maximumPrice = buyerValue * 0.4;
      const buyerROI = monthlyPrice > 0 ? buyerValue / monthlyPrice : 0;

      const equilibriumExists =
        Number.isFinite(minimumPrice) && Number.isFinite(maximumPrice) && minimumPrice <= maximumPrice;
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
        buyerAnnualSavings: (buyerValue - monthlyPrice) * 12,
        metricLabel: 'per customer/month'
      };
    } else if (selectedModel === 'usage-based') {
      const pricePerUnit = num(usage_pricePerUnit);
      const monthlyUnits = num(usage_monthlyUnits);
      const costPerUnit = num(usage_costPerUnit);
      const desiredMargin = num(usage_desiredMargin);
      const buyerValuePerUnit = num(usage_buyerValuePerUnit);

      const monthlyRevenue = pricePerUnit * monthlyUnits;
      const monthlyCost = costPerUnit * monthlyUnits;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      const minimumPricePerUnit =
        desiredMargin >= 100 ? Number.NaN : costPerUnit / (1 - desiredMargin / 100);
      const sellerMeetsTarget = Number.isFinite(minimumPricePerUnit) && pricePerUnit >= minimumPricePerUnit;

      const maximumPricePerUnit = buyerValuePerUnit * 0.4;
      const buyerROIPerUnit = pricePerUnit > 0 ? buyerValuePerUnit / pricePerUnit : 0;
      const buyerMonthlyValue = buyerValuePerUnit * monthlyUnits;
      const buyerMonthlySavings = buyerMonthlyValue - monthlyRevenue;

      const equilibriumExists =
        Number.isFinite(minimumPricePerUnit) &&
        Number.isFinite(maximumPricePerUnit) &&
        minimumPricePerUnit <= maximumPricePerUnit;
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
      const pricePerSeat = num(seat_pricePerSeat);
      const seats = num(seat_seats);
      const costPerSeat = num(seat_costPerSeat);
      const desiredMargin = num(seat_desiredMargin);
      const valuePerSeat = num(seat_valuePerSeat);

      const monthlyRevenue = pricePerSeat * seats;
      const monthlyCost = costPerSeat * seats;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      const minimumPricePerSeat =
        desiredMargin >= 100 ? Number.NaN : costPerSeat / (1 - desiredMargin / 100);
      const sellerMeetsTarget = Number.isFinite(minimumPricePerSeat) && pricePerSeat >= minimumPricePerSeat;

      const maximumPricePerSeat = valuePerSeat * 0.4;
      const buyerROIPerSeat = pricePerSeat > 0 ? valuePerSeat / pricePerSeat : 0;
      const buyerMonthlyValue = valuePerSeat * seats;
      const buyerMonthlySavings = buyerMonthlyValue - monthlyRevenue;

      const equilibriumExists =
        Number.isFinite(minimumPricePerSeat) &&
        Number.isFinite(maximumPricePerSeat) &&
        minimumPricePerSeat <= maximumPricePerSeat;
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
      const licensePrice = num(onetime_licensePrice);
      const maintenanceFee = num(onetime_maintenanceFee);
      const maintenanceAttach = num(onetime_maintenanceAttach);
      const existingCustomers = num(onetime_existingCustomers);
      const monthlySupportCost = num(onetime_monthlySupportCost);
      const costToDeliver = num(onetime_costToDeliver);
      const desiredMargin = num(onetime_desiredMargin);
      const buyerValuePerYear = num(onetime_buyerValuePerYear);

      const annualMaintenanceFee = licensePrice * (maintenanceFee / 100);
      const monthlyMaintenanceRevenue = (existingCustomers * annualMaintenanceFee) / 12;
      const monthlyRevenue = monthlyMaintenanceRevenue;

      const monthlyCost = existingCustomers * monthlySupportCost;

      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      const minimumLicensePrice =
        desiredMargin >= 100 ? Number.NaN : costToDeliver / (1 - desiredMargin / 100);
      const sellerMeetsTarget = Number.isFinite(minimumLicensePrice) && licensePrice >= minimumLicensePrice;

      const buyerFirstYearCost = licensePrice + annualMaintenanceFee * (maintenanceAttach / 100);
      const buyerROIFirstYear = buyerFirstYearCost > 0 ? buyerValuePerYear / buyerFirstYearCost : 0;
      const buyerPaybackMonths =
        buyerFirstYearCost > 0 && buyerValuePerYear > 0
          ? 12 * (buyerFirstYearCost / buyerValuePerYear)
          : Number.POSITIVE_INFINITY;

      const maximumPriceBuyerWillPay = buyerValuePerYear * 0.5;
      const equilibriumExists =
        Number.isFinite(minimumLicensePrice) &&
        Number.isFinite(maximumPriceBuyerWillPay) &&
        minimumLicensePrice <= maximumPriceBuyerWillPay;
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
        buyerAnnualSavings: buyerValuePerYear - buyerFirstYearCost,
        buyerPaybackMonths,
        metricLabel: 'license price'
      };
    } else if (selectedModel === 'marketplace') {
      const commissionRate = num(market_commissionRate);
      const avgTxn = num(market_avgTransactionValue);
      const monthlyTx = num(market_monthlyTransactions);
      const costPerTxn = num(market_costPerTransaction);
      const desiredMargin = num(market_desiredMargin);
      const sellerValue = num(market_sellerValuePerTransaction);
      const activeSellers = num(market_activeSellers);

      const monthlyGMV = avgTxn * monthlyTx;
      const commissionPerTransaction = avgTxn * (commissionRate / 100);
      const monthlyRevenue = commissionPerTransaction * monthlyTx;

      const monthlyCost = costPerTxn * monthlyTx;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      const actualMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

      const minimumCommissionRate =
        desiredMargin >= 100
          ? Number.NaN
          : avgTxn > 0
            ? (costPerTxn / avgTxn) / (1 - desiredMargin / 100) * 100
            : Number.NaN;
      const sellerMeetsTarget =
        Number.isFinite(minimumCommissionRate) && commissionRate >= minimumCommissionRate;

      const sellerNetProfit = sellerValue - commissionPerTransaction;
      const sellerROI = sellerValue > 0 ? sellerNetProfit / sellerValue : 0;
      const sellerMonthlyProfit = sellerNetProfit * monthlyTx;

      const maximumCommissionRate =
        avgTxn > 0 ? (sellerValue * 0.3) / avgTxn * 100 : 0;
      const equilibriumExists =
        Number.isFinite(minimumCommissionRate) &&
        Number.isFinite(maximumCommissionRate) &&
        minimumCommissionRate <= maximumCommissionRate;
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
        avgTransactionsPerSeller: activeSellers > 0 ? monthlyTx / activeSellers : 0,
        metricLabel: 'commission rate %'
      };
    }

    return null;
  }
</script>

<SeoHead page={PAGES.pricing} />

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-base-content mb-2">Pricing Calculator</h1>
    <p class="text-lg text-base-content/70">
      Find the price where you hit your margin AND your client sees clear ROI
    </p>
  </div>

  <!-- Model Selector (interactive — hidden in print) -->
  <div class="mb-8 no-print w-full min-w-0 overflow-x-hidden">
    <p class="block text-sm font-medium text-base-content/70 mb-3">Pricing Model</p>
    <!-- Mobile: horizontal scroll, Tablet+: grid -->
    <div
      data-pricing-model-strip
      class="flex gap-3 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-3 md:grid-cols-5 sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 max-w-full"
    >
      {#each models as model (model.id)}
        <!-- DaisyUI .card is the canonical panel surface; same pattern as
             the structuring/+page.svelte model selector. The conditional
             border / background utilities preserve the radio-style
             "selected" affordance the previous hand-rolled implementation
             had. -->
        <button
          type="button"
          class="card flex-shrink-0 w-28 sm:w-auto p-3 sm:p-4 border-2 transition-all text-left touch-manipulation {selectedModel === model.id
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
    <p class="text-xs text-base-content/60 mt-2 sm:hidden text-center">Swipe to see all models</p>
  </div>

  <!-- Print-only: show selected model name (tab buttons are hidden in print).
       Uses .print-only utility — hidden on screen, visible in print. -->
  {#if selectedModelInfo}
    <div class="print-only mb-6">
      <p class="text-sm text-base-content/70">Pricing Model</p>
      <p class="text-lg font-semibold text-base-content">{selectedModelInfo.icon} {selectedModelInfo.name}</p>
    </div>
  {/if}

  <div class="grid lg:grid-cols-2 gap-8 min-w-0 max-w-full overflow-x-clip">
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
                  <label for="sub_monthlyPrice" class="block text-sm text-base-content/70 mb-1">Monthly Price per Customer (R)</label>
                  <input id="sub_monthlyPrice" type="number" bind:value={sub_monthlyPrice} step="10"
                    class="input">
                </div>
                <div>
                  <label for="sub_customers" class="block text-sm text-base-content/70 mb-1">Number of Customers</label>
                  <input id="sub_customers" type="number" bind:value={sub_customers} step="1"
                    class="input">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label for="sub_costToServe" class="block text-sm text-base-content/70 mb-1">Cost to Serve per Customer (R/month)</label>
                  <input id="sub_costToServe" type="number" bind:value={sub_costToServe} step="10"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">Infrastructure, support costs per customer</p>
                </div>
                <div>
                  <label for="sub_desiredMargin" class="block text-sm text-base-content/70 mb-1">Desired Gross Margin (%)</label>
                  <input id="sub_desiredMargin" type="number" bind:value={sub_desiredMargin} step="1"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">Target profit margin (typical SaaS: 70-85%)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Client Value</h3>
              <div>
                <label for="sub_buyerValue" class="block text-sm text-base-content/70 mb-1">Monthly Value to Client (R)</label>
                <input id="sub_buyerValue" type="number" bind:value={sub_buyerValue} step="100"
                  class="input">
                <p class="text-xs text-base-content/60 mt-1">Revenue enabled or cost saved per month</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'usage-based'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label for="usage_pricePerUnit" class="block text-sm text-base-content/70 mb-1">Price per Unit (R)</label>
                  <input id="usage_pricePerUnit" type="number" bind:value={usage_pricePerUnit} step="0.10"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">E.g., per 1,000 API calls</p>
                </div>
                <div>
                  <label for="usage_monthlyUnits" class="block text-sm text-base-content/70 mb-1">Monthly Units</label>
                  <input id="usage_monthlyUnits" type="number" bind:value={usage_monthlyUnits} step="100"
                    class="input">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label for="usage_costPerUnit" class="block text-sm text-base-content/70 mb-1">Cost per Unit (R)</label>
                  <input id="usage_costPerUnit" type="number" bind:value={usage_costPerUnit} step="0.05"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">Infrastructure cost per unit</p>
                </div>
                <div>
                  <label for="usage_desiredMargin" class="block text-sm text-base-content/70 mb-1">Desired Gross Margin (%)</label>
                  <input id="usage_desiredMargin" type="number" bind:value={usage_desiredMargin} step="1"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">Typical usage-based: 75-90%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Client Value</h3>
              <div>
                <label for="usage_buyerValuePerUnit" class="block text-sm text-base-content/70 mb-1">Value per Unit to Client (R)</label>
                <input id="usage_buyerValuePerUnit" type="number" bind:value={usage_buyerValuePerUnit} step="0.50"
                  class="input">
                <p class="text-xs text-base-content/60 mt-1">Revenue enabled or cost saved per unit</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'per-seat'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label for="seat_pricePerSeat" class="block text-sm text-base-content/70 mb-1">Price per Seat (R/month)</label>
                  <input id="seat_pricePerSeat" type="number" bind:value={seat_pricePerSeat} step="10"
                    class="input">
                </div>
                <div>
                  <label for="seat_seats" class="block text-sm text-base-content/70 mb-1">Number of Seats</label>
                  <input id="seat_seats" type="number" bind:value={seat_seats} step="1"
                    class="input">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label for="seat_costPerSeat" class="block text-sm text-base-content/70 mb-1">Cost per Seat (R/month)</label>
                  <input id="seat_costPerSeat" type="number" bind:value={seat_costPerSeat} step="5"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">Infrastructure and support cost per seat</p>
                </div>
                <div>
                  <label for="seat_desiredMargin" class="block text-sm text-base-content/70 mb-1">Desired Gross Margin (%)</label>
                  <input id="seat_desiredMargin" type="number" bind:value={seat_desiredMargin} step="1"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">Typical per-seat: 70-80%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Client Value</h3>
              <div>
                <label for="seat_valuePerSeat" class="block text-sm text-base-content/70 mb-1">Monthly Value per Seat to Client (R)</label>
                <input id="seat_valuePerSeat" type="number" bind:value={seat_valuePerSeat} step="50"
                  class="input">
                <p class="text-xs text-base-content/60 mt-1">Productivity gain or cost saved per user per month</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'one-time'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label for="onetime_licensePrice" class="block text-sm text-base-content/70 mb-1">License Price (R)</label>
                  <input id="onetime_licensePrice" type="number" bind:value={onetime_licensePrice} step="100"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">One-time perpetual license fee</p>
                </div>
                <div>
                  <label for="onetime_maintenanceFee" class="block text-sm text-base-content/70 mb-1">Annual Maintenance Fee (%)</label>
                  <input id="onetime_maintenanceFee" type="number" bind:value={onetime_maintenanceFee} max="100" step="1"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">% of license price (typical: 15-25%)</p>
                </div>
                <div>
                  <label for="onetime_maintenanceAttach" class="block text-sm text-base-content/70 mb-1">Maintenance Attach Rate (%)</label>
                  <input id="onetime_maintenanceAttach" type="number" bind:value={onetime_maintenanceAttach} max="100" step="1"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">% of customers buying maintenance</p>
                </div>
                <div>
                  <label for="onetime_existingCustomers" class="block text-sm text-base-content/70 mb-1">Existing Customers on Maintenance</label>
                  <input id="onetime_existingCustomers" type="number" bind:value={onetime_existingCustomers} step="1"
                    class="input">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label for="onetime_costToDeliver" class="block text-sm text-base-content/70 mb-1">Cost to Deliver per License (R)</label>
                  <input id="onetime_costToDeliver" type="number" bind:value={onetime_costToDeliver} step="100"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">One-time onboarding, implementation cost</p>
                </div>
                <div>
                  <label for="onetime_monthlySupportCost" class="block text-sm text-base-content/70 mb-1">Monthly Support Cost per Customer (R)</label>
                  <input id="onetime_monthlySupportCost" type="number" bind:value={onetime_monthlySupportCost} step="10"
                    class="input">
                </div>
                <div>
                  <label for="onetime_desiredMargin" class="block text-sm text-base-content/70 mb-1">Desired Gross Margin (%)</label>
                  <input id="onetime_desiredMargin" type="number" bind:value={onetime_desiredMargin} step="1"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">Typical: 70-80%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Client Value</h3>
              <div>
                <label for="onetime_buyerValuePerYear" class="block text-sm text-base-content/70 mb-1">Annual Value to Client (R)</label>
                <input id="onetime_buyerValuePerYear" type="number" bind:value={onetime_buyerValuePerYear} step="500"
                  class="input">
                <p class="text-xs text-base-content/60 mt-1">Annual productivity gain or cost saved</p>
              </div>
            </div>
          </div>
        {:else if selectedModel === 'marketplace'}
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Pricing</h3>
              <div class="space-y-3">
                <div>
                  <label for="market_commissionRate" class="block text-sm text-base-content/70 mb-1">Commission Rate (%)</label>
                  <input id="market_commissionRate" type="number" bind:value={market_commissionRate} max="100" step="0.5"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">% commission on each transaction</p>
                </div>
                <div>
                  <label for="market_avgTransactionValue" class="block text-sm text-base-content/70 mb-1">Average Transaction Value (R)</label>
                  <input id="market_avgTransactionValue" type="number" bind:value={market_avgTransactionValue} step="50"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">Average GMV per transaction</p>
                </div>
                <div>
                  <label for="market_monthlyTransactions" class="block text-sm text-base-content/70 mb-1">Monthly Transactions</label>
                  <input id="market_monthlyTransactions" type="number" bind:value={market_monthlyTransactions} step="10"
                    class="input">
                </div>
                <div>
                  <label for="market_activeSellers" class="block text-sm text-base-content/70 mb-1">Active Sellers</label>
                  <input id="market_activeSellers" type="number" bind:value={market_activeSellers} step="1"
                    class="input">
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Costs</h3>
              <div class="space-y-3">
                <div>
                  <label for="market_costPerTransaction" class="block text-sm text-base-content/70 mb-1">Cost per Transaction (R)</label>
                  <input id="market_costPerTransaction" type="number" bind:value={market_costPerTransaction} step="1"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">Payment processing, support, fraud prevention</p>
                </div>
                <div>
                  <label for="market_desiredMargin" class="block text-sm text-base-content/70 mb-1">Desired Gross Margin (%)</label>
                  <input id="market_desiredMargin" type="number" bind:value={market_desiredMargin} step="1"
                    class="input">
                  <p class="text-xs text-base-content/60 mt-1">Typical: 60-75%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Seller Value</h3>
              <div>
                <label for="market_sellerValuePerTransaction" class="block text-sm text-base-content/70 mb-1">Value per Transaction to Seller (R)</label>
                <input id="market_sellerValuePerTransaction" type="number" bind:value={market_sellerValuePerTransaction} step="10"
                  class="input">
                <p class="text-xs text-base-content/60 mt-1">Profit seller makes per transaction (before commission)</p>
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
          <button class="btn btn-outline text-sm no-print tooltip tooltip-bottom" on:click={() => window.print()} data-tip="Save this page as a PDF using your browser's print dialog">
            Save as PDF
          </button>
        </div>

        {#if pricingInputIssues.length > 0}
          <div class="alert alert-warning mb-6" role="alert">
            <div class="font-medium mb-1">Please fix these inputs</div>
            <ul class="list-disc list-inside text-sm space-y-1">
              {#each pricingInputIssues as issue (issue)}
                <li>{issue}</li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if results && pricingInputsValid}
          <!-- Equilibrium Status -->
          <div class="alert {results.equilibriumExists ? 'alert-success' : 'alert-error'} alert-soft mb-6 flex-col items-start" role="status">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">{results.equilibriumExists ? '✓' : '✗'}</span>
              <h3 class="font-semibold">
                {results.equilibriumExists ? 'Equilibrium Exists' : 'No Viable Price Range'}
              </h3>
            </div>
            {#if results.equilibriumExists}
              <p class="text-sm">
                A mutually beneficial price exists between {selectedModel === 'marketplace' ? formatPercentSafe(results.minimumPrice) : formatCurrencySafe(results.minimumPrice)} and {selectedModel === 'marketplace' ? formatPercentSafe(results.maximumPrice) : formatCurrencySafe(results.maximumPrice)}
              </p>
              <div class="mt-3 p-3 bg-base-200 rounded border border-success/30">
                <div class="text-xs text-base-content/70 mb-1">Suggested Price</div>
                <div class="text-2xl font-bold text-success">
                  {selectedModel === 'marketplace' ? formatPercentSafe(results.suggestedPrice) : formatCurrencySafe(results.suggestedPrice)}
                </div>
                <div class="text-xs text-base-content/70 mt-1">{results.metricLabel}</div>
              </div>
            {:else}
              <p class="text-sm text-error/80">
                Your minimum price ({selectedModel === 'marketplace' ? formatPercentSafe(results.minimumPrice) : formatCurrencySafe(results.minimumPrice)}) exceeds the client's maximum ({selectedModel === 'marketplace' ? formatPercentSafe(results.maximumPrice) : formatCurrencySafe(results.maximumPrice)})
              </p>
            {/if}
          </div>

          <!-- Equilibrium Visualization -->
          {#if showEquilibriumChart}
            <div class="mb-6">
              <h3 class="text-sm font-medium text-base-content/70 mb-3">Price Range Visualization</h3>
              <div class="card p-4 bg-base-300 max-w-full overflow-x-hidden">
                <EquilibriumChart
                  minimumPrice={results.minimumPrice}
                  maximumPrice={results.maximumPrice}
                  currentPrice={currentPriceForChart}
                  suggestedPrice={results.suggestedPrice}
                  equilibriumExists={results.equilibriumExists}
                  isPercentage={selectedModel === 'marketplace'}
                  height={180}
                />
              </div>
            </div>
          {/if}

          <!-- Financial Metrics — DaisyUI .stats/.stat for the
               title-above-value tile pattern. Each tile is its own
               .stats wrapper (single .stat) so they grid to 2x2. -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-base-content/70 mb-3">Financial Performance</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="stats bg-base-300 rounded-box">
                <div class="stat">
                  <div class="stat-title">Monthly Revenue</div>
                  <div class="stat-value text-base">{formatCurrency(results.monthlyRevenue)}</div>
                </div>
              </div>
              <div class="stats bg-base-300 rounded-box">
                <div class="stat">
                  <div class="stat-title">Monthly Profit</div>
                  <div class="stat-value text-base">{formatCurrency(results.monthlyProfit)}</div>
                </div>
              </div>
              <div class="stats bg-base-300 rounded-box">
                <div class="stat">
                  <div class="stat-title">Annual Revenue</div>
                  <div class="stat-value text-base">{formatCurrency(results.annualRevenue)}</div>
                </div>
              </div>
              <div class="stats bg-base-300 rounded-box">
                <div class="stat">
                  <div class="stat-title">Annual Profit</div>
                  <div class="stat-value text-base">{formatCurrency(results.annualProfit)}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Seller Perspective — DaisyUI .table.table-sm for the
               horizontal label/value row pattern. .stat lays content
               vertically (title above value); for label-left/value-
               right rows the table primitive is the correct fit. -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-base-content/70 mb-3">Your Position</h3>
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td class="text-base-content/70">Actual Margin</td>
                  <td class="text-right font-semibold {results.sellerMeetsTarget ? 'text-success' : 'text-error'}">
                    {formatPercent(results.actualMargin)}
                  </td>
                </tr>
                <tr>
                  <td class="text-base-content/70">Minimum Price Needed</td>
                  <td class="text-right font-semibold text-base-content">{selectedModel === 'marketplace' ? formatPercent(results.minimumPrice) : formatCurrency(results.minimumPrice)}</td>
                </tr>
                <tr>
                  <td class="text-base-content/70">Meets Target?</td>
                  <td class="text-right font-semibold {results.sellerMeetsTarget ? 'text-success' : 'text-error'}">
                    {results.sellerMeetsTarget ? 'Yes' : 'No'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Buyer Perspective — same .table.table-sm pattern. -->
          <div>
            <h3 class="text-sm font-medium text-base-content/70 mb-3">{selectedModel === 'marketplace' ? 'Seller Position' : 'Client Position'}</h3>
            <table class="table table-sm">
              <tbody>
                <tr>
                  <td class="text-base-content/70">ROI Multiplier</td>
                  <td class="text-right font-semibold text-base-content">{results.buyerROI.toFixed(2)}x</td>
                </tr>
                <tr>
                  <td class="text-base-content/70">Maximum Price They'll Pay</td>
                  <td class="text-right font-semibold text-base-content">{selectedModel === 'marketplace' ? formatPercent(results.maximumPrice) : formatCurrency(results.maximumPrice)}</td>
                </tr>
                <tr>
                  <td class="text-base-content/70">Annual Savings</td>
                  <td class="text-right font-semibold text-base-content">{formatCurrency(results.buyerAnnualSavings)}</td>
                </tr>
                {#if results.buyerPaybackMonths !== undefined}
                  <tr>
                    <td class="text-base-content/70">Payback Period</td>
                    <td class="text-right font-semibold text-base-content">
                      {results.buyerPaybackMonths === Infinity ? '∞' : `${results.buyerPaybackMonths.toFixed(1)} months`}
                    </td>
                  </tr>
                {/if}
                {#if results.avgTransactionsPerSeller !== undefined}
                  <tr>
                    <td class="text-base-content/70">Avg Transactions per Seller</td>
                    <td class="text-right font-semibold text-base-content">{results.avgTransactionsPerSeller.toFixed(1)}</td>
                  </tr>
                {/if}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
