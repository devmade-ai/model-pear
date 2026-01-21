<script lang="ts">
  import {
    createInputRanges,
    calculateInputSensitivity,
    generateBestCaseInputs,
    generateWorstCaseInputs,
    type CalculationResult,
    type InputRange,
  } from '@model-pear/calculator';
  import { TornadoChart, ScenarioChart } from './charts';

  export let inputs: Record<string, unknown>;
  export let result: CalculationResult;
  export let calculateFn: (inputs: Record<string, unknown>) => CalculationResult;

  // Create ranges from current inputs
  $: numericInputs = Object.fromEntries(
    Object.entries(inputs).filter(([, v]) => typeof v === 'number')
  ) as Record<string, number>;

  $: inputRanges = createInputRanges(numericInputs);

  // Calculate sensitivity for each input
  $: sensitivities = calculateInputSensitivity(
    inputRanges,
    (testInputs) => {
      const calcResult = calculateFn({ ...inputs, ...testInputs });
      return calcResult.developer.profit.netProfit;
    }
  );

  // Generate scenario values
  $: bestInputs = generateBestCaseInputs(inputRanges);
  $: worstInputs = generateWorstCaseInputs(inputRanges);

  $: baseProfit = result.developer.profit.netProfit;
  $: bestResult = calculateFn({ ...inputs, ...bestInputs });
  $: worstResult = calculateFn({ ...inputs, ...worstInputs });
  $: bestProfit = bestResult.developer.profit.netProfit;
  $: worstProfit = worstResult.developer.profit.netProfit;
</script>

<div class="space-y-6">
  <div class="flex items-center space-x-2 mb-4">
    <span class="text-2xl">📊</span>
    <h2 class="text-xl font-bold text-foreground">Sensitivity Analysis</h2>
  </div>

  <p class="text-muted-foreground text-sm">
    Understand how changes in your inputs affect the outcome. This helps identify which assumptions
    have the biggest impact on profitability.
  </p>

  <div class="grid lg:grid-cols-2 gap-6">
    <!-- Tornado Chart -->
    <TornadoChart
      sensitivities={sensitivities.sensitivities}
      baseValue={sensitivities.baseOutput}
      title="Input Sensitivity Ranking"
    />

    <!-- Scenario Analysis -->
    <ScenarioChart
      baseValue={baseProfit}
      bestValue={bestProfit}
      worstValue={worstProfit}
      title="Scenario Analysis"
    />
  </div>

  <!-- Top Influencers Summary -->
  {#if sensitivities.topInfluencers.length > 0}
    <div class="card p-4">
      <h3 class="text-lg font-semibold text-foreground mb-3">Key Drivers</h3>
      <div class="space-y-2">
        {#each sensitivities.topInfluencers.slice(0, 5) as influencer}
          <div class="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div class="flex items-center space-x-2">
              <span
                class="w-2 h-2 rounded-full {influencer.direction === 'positive'
                  ? 'bg-green-400'
                  : 'bg-red-400'}"
              ></span>
              <span class="text-sm font-medium text-foreground/80">{influencer.label}</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-xs text-muted-foreground">
                {influencer.lowValue.toLocaleString()} - {influencer.highValue.toLocaleString()}
              </span>
              <span
                class="text-sm font-semibold {influencer.percentChange > 0
                  ? 'text-green-400'
                  : 'text-red-400'}"
              >
                ±{Math.abs(influencer.percentChange).toFixed(1)}%
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
