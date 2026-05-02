<script lang="ts">
  import {
    calculateNPV,
    calculateIRR,
    calculatePaybackPeriod,
    calculateDiscountedPaybackPeriod,
    assessInvestment,
    generateGrowingCashFlows,
    calculateCumulativeCashFlows,
    DEFAULT_PROJECTION_PARAMS,
    type CalculationResult,
    type ProjectionMetrics,
    type InvestmentAssessment,
    type YearlyProjection,
  } from '@model-pear/calculator';
  import { CashFlowChart, CumulativeCashFlowChart, NPVComparisonChart } from './charts';
  import ProjectionMetricsCard from './ProjectionMetrics.svelte';

  export let result: CalculationResult;

  // Projection parameters — all five surfaced as user inputs in the
  // panel header (years / discount / revenue growth / cost growth /
  // buyer-benefit). Defaults preserve prior behaviour for any saved
  // option that was created when these values were hardcoded.
  let projectionYears = 5;
  let discountRate = 12; // WACC / hurdle rate
  let revenueGrowthRate = 5;
  let costGrowthRate = 3;
  // Annual operational benefit the Buyer realises from the software,
  // expressed as a percentage of the capitalised cost. Default 30%
  // matches the literal `* 0.3` heuristic that preceded this control.
  let buyerBenefitRate = 30;

  // Generate developer cash flows from result
  $: developerInitialCost = result.developer.revenue.total - result.developer.profit.net;
  $: developerAnnualProfit = result.developer.profit.net / (projectionYears || 1);

  // Generate buyer cash flows (total cost, then ongoing benefits from software)
  $: buyerInitialCost = result.buyer.asset.capitalised || result.buyer.totalCost || 0;
  $: buyerAnnualBenefit = buyerInitialCost * (buyerBenefitRate / 100);

  // Generate yearly projections
  $: developerYearlyData = generateYearlyProjections(
    -developerInitialCost,
    developerAnnualProfit,
    revenueGrowthRate,
    costGrowthRate,
    projectionYears,
    discountRate
  );

  $: buyerYearlyData = generateYearlyProjections(
    -buyerInitialCost,
    buyerAnnualBenefit,
    revenueGrowthRate,
    costGrowthRate,
    projectionYears,
    discountRate
  );

  // Calculate metrics
  $: developerCashFlows = developerYearlyData.map((d) => d.cashFlow);
  $: buyerCashFlows = buyerYearlyData.map((d) => d.cashFlow);

  $: developerNPV = calculateNPV(developerCashFlows, discountRate);
  $: buyerNPV = calculateNPV(buyerCashFlows, discountRate);

  $: developerIRR = calculateIRR(developerCashFlows) ?? 0;
  $: buyerIRR = calculateIRR(buyerCashFlows) ?? 0;

  $: developerPayback = calculatePaybackPeriod(developerCashFlows) ?? Infinity;
  $: buyerPayback = calculatePaybackPeriod(buyerCashFlows) ?? Infinity;

  $: developerDiscountedPayback = calculateDiscountedPaybackPeriod(developerCashFlows, discountRate) ?? Infinity;
  $: buyerDiscountedPayback = calculateDiscountedPaybackPeriod(buyerCashFlows, discountRate) ?? Infinity;

  $: developerMetrics = {
    npv: developerNPV,
    irr: developerIRR,
    paybackPeriod: developerPayback,
    discountedPaybackPeriod: developerDiscountedPayback,
    totalRevenue: developerYearlyData.reduce((sum, d) => sum + d.revenue, 0),
    totalProfit: developerYearlyData.reduce((sum, d) => sum + d.netProfit, 0),
  } as ProjectionMetrics;

  $: buyerMetrics = {
    npv: buyerNPV,
    irr: buyerIRR,
    paybackPeriod: buyerPayback,
    discountedPaybackPeriod: buyerDiscountedPayback,
    totalRevenue: buyerYearlyData.reduce((sum, d) => sum + d.revenue, 0),
    totalProfit: buyerYearlyData.reduce((sum, d) => sum + d.netProfit, 0),
  } as ProjectionMetrics;

  $: developerAssessment = assessInvestment(developerNPV, developerIRR, discountRate);
  $: buyerAssessment = assessInvestment(buyerNPV, buyerIRR, discountRate);

  function generateYearlyProjections(
    initialInvestment: number,
    baseAnnualProfit: number,
    revenueGrowth: number,
    costGrowth: number,
    years: number,
    discount: number
  ): YearlyProjection[] {
    const projections: YearlyProjection[] = [];
    let cumulativeCashFlow = 0;

    for (let year = 0; year <= years; year++) {
      const growthFactor = Math.pow(1 + revenueGrowth / 100, year);
      const costFactor = Math.pow(1 + costGrowth / 100, year);
      const discountFactor = 1 / Math.pow(1 + discount / 100, year);

      let revenue: number;
      let costs: number;
      let cashFlow: number;

      if (year === 0) {
        // Year 0 is the initial investment
        revenue = 0;
        costs = Math.abs(initialInvestment);
        cashFlow = initialInvestment;
      } else {
        // Subsequent years are operating cash flows
        const annualRevenue = baseAnnualProfit * 1.5 * growthFactor; // Revenue is ~1.5x profit
        const annualCosts = (baseAnnualProfit * 0.5) * costFactor; // Costs are ~0.5x profit
        revenue = annualRevenue;
        costs = annualCosts;
        cashFlow = revenue - costs;
      }

      const grossProfit = revenue - costs;
      const tax = Math.max(0, grossProfit * 0.27); // 27% corporate tax
      const netProfit = grossProfit - tax;

      cumulativeCashFlow += cashFlow;

      projections.push({
        year,
        revenue,
        costs,
        grossProfit,
        tax,
        netProfit,
        cashFlow,
        cumulativeCashFlow,
        discountFactor,
        presentValue: cashFlow * discountFactor,
      });
    }

    return projections;
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-2">
      <span class="text-2xl">📈</span>
      <h2 class="text-xl font-bold text-base-content">Growth Projections</h2>
    </div>

    <!-- Parameter Controls. Every input drives the reactive
         developerYearlyData / buyerYearlyData / metrics blocks above. -->
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <label class="flex items-center space-x-2">
        <span class="text-base-content/70">Years:</span>
        <select bind:value={projectionYears} class="select select-sm w-16">
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={7}>7</option>
          <option value={10}>10</option>
        </select>
      </label>
      <label class="flex items-center space-x-2">
        <span class="text-base-content/70">Discount:</span>
        <input
          type="number"
          bind:value={discountRate}
          min="0"
          max="50"
          class="input input-sm py-1 px-2 w-16"
        />
        <span class="text-base-content/70">%</span>
      </label>
      <label class="flex items-center space-x-2">
        <span class="text-base-content/70">Revenue growth:</span>
        <input
          type="number"
          bind:value={revenueGrowthRate}
          min="-20"
          max="50"
          step="0.5"
          class="input input-sm py-1 px-2 w-16"
        />
        <span class="text-base-content/70">%</span>
      </label>
      <label class="flex items-center space-x-2">
        <span class="text-base-content/70">Cost growth:</span>
        <input
          type="number"
          bind:value={costGrowthRate}
          min="-20"
          max="50"
          step="0.5"
          class="input input-sm py-1 px-2 w-16"
        />
        <span class="text-base-content/70">%</span>
      </label>
      <label class="flex items-center space-x-2" title="Annual operational benefit the Buyer realises from the software, as % of capitalised cost">
        <span class="text-base-content/70">Buyer benefit:</span>
        <input
          type="number"
          bind:value={buyerBenefitRate}
          min="0"
          max="200"
          step="1"
          class="input input-sm py-1 px-2 w-16"
        />
        <span class="text-base-content/70">%</span>
      </label>
    </div>
  </div>

  <p class="text-base-content/70 text-sm">
    Financial projections over {projectionYears} years at a {discountRate}% discount rate.
    These help evaluate the long-term value of the transaction structure.
  </p>

  <!-- Metrics Cards -->
  <div class="grid md:grid-cols-2 gap-6">
    <ProjectionMetricsCard
      metrics={developerMetrics}
      assessment={developerAssessment}
      partyName="Developer"
      partyColor="blue"
    />
    <ProjectionMetricsCard
      metrics={buyerMetrics}
      assessment={buyerAssessment}
      partyName="Buyer"
      partyColor="green"
    />
  </div>

  <!-- Charts -->
  <div class="grid lg:grid-cols-2 gap-6">
    <CashFlowChart
      developerData={developerYearlyData}
      buyerData={buyerYearlyData}
      title="Annual Cash Flows"
    />
    <CumulativeCashFlowChart
      developerData={developerYearlyData}
      buyerData={buyerYearlyData}
      title="Cumulative Cash Flow (Payback)"
    />
  </div>

  <!-- NPV Comparison -->
  <NPVComparisonChart
    developerNPV={developerNPV}
    buyerNPV={buyerNPV}
    title="Net Present Value Comparison"
    height={250}
  />

  <!-- Summary -->
  <div class="card p-4 bg-base-200">
    <h3 class="text-lg font-semibold text-base-content mb-3">Summary</h3>
    <div class="grid md:grid-cols-2 gap-4 text-sm">
      <div>
        <p class="text-base-content/70 mb-1">
          <strong class="text-base-content">Developer:</strong>
          {developerAssessment.description}
        </p>
        <p class="text-base-content/70">
          {developerPayback === Infinity
            ? 'Payback not achieved within projection period'
            : `Expected payback in ${developerPayback.toFixed(1)} years`}
        </p>
      </div>
      <div>
        <p class="text-base-content/70 mb-1">
          <strong class="text-base-content">Buyer:</strong>
          {buyerAssessment.description}
        </p>
        <p class="text-base-content/70">
          {buyerPayback === Infinity
            ? 'Payback not achieved within projection period'
            : `Expected payback in ${buyerPayback.toFixed(1)} years`}
        </p>
      </div>
    </div>
  </div>
</div>
