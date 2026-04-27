<script lang="ts">
  /**
   * EquilibriumChart - Visual representation of price equilibrium zone
   *
   * Shows seller minimum, buyer maximum, current price, and equilibrium zone.
   * Uses a horizontal range visualization.
   */
  import BaseChart from './BaseChart.svelte';
  import { themeRev, getThemeColor } from '$lib/theme';

  export let minimumPrice: number;
  export let maximumPrice: number;
  export let currentPrice: number;
  export let suggestedPrice: number;
  export let equilibriumExists: boolean;
  export let isPercentage: boolean = false;
  export let height: number = 200;

  // Format value based on whether it's percentage or currency
  function formatValue(value: number): string {
    if (isPercentage) {
      return `${value.toFixed(1)}%`;
    }
    return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  // Calculate chart bounds - extend 20% beyond min/max for visibility
  $: chartMin = Math.max(0, Math.min(minimumPrice, maximumPrice, currentPrice) * 0.8);
  $: chartMax = Math.max(minimumPrice, maximumPrice, currentPrice) * 1.2;

  // Theme reactivity: see CashFlowChart.svelte for the pattern explanation.
  let themeKey = 0;
  $: themeKey = $themeRev;

  $: options = (themeKey, {
    chart: {
      type: 'rangeBar' as const,
      toolbar: { show: false },
      animations: { enabled: true, speed: 300 },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        rangeBarGroupRows: true,
      },
    },
    // Series colors mapped to DaisyUI semantics:
    //   When equilibrium exists: success (band), primary (your min),
    //     secondary (client max), warning (suggested attention).
    //   When no equilibrium:     error (no zone), primary (your min),
    //     secondary (client max), neutral (current).
    colors: equilibriumExists
      ? [
          getThemeColor('--color-success'),
          getThemeColor('--color-primary'),
          getThemeColor('--color-secondary'),
          getThemeColor('--color-warning'),
        ]
      : [
          getThemeColor('--color-error'),
          getThemeColor('--color-primary'),
          getThemeColor('--color-secondary'),
          getThemeColor('--color-neutral'),
        ],
    series: [
      {
        name: 'Equilibrium Zone',
        data: equilibriumExists
          ? [{ x: 'Price', y: [minimumPrice, maximumPrice] }]
          : [{ x: 'Price', y: [0, 0] }],
      },
      {
        name: 'Your Minimum',
        data: [{ x: 'Price', y: [minimumPrice - (chartMax - chartMin) * 0.01, minimumPrice + (chartMax - chartMin) * 0.01] }],
      },
      {
        name: 'Client Maximum',
        data: [{ x: 'Price', y: [maximumPrice - (chartMax - chartMin) * 0.01, maximumPrice + (chartMax - chartMin) * 0.01] }],
      },
      {
        name: equilibriumExists ? 'Suggested' : 'Current',
        data: equilibriumExists
          ? [{ x: 'Price', y: [suggestedPrice - (chartMax - chartMin) * 0.01, suggestedPrice + (chartMax - chartMin) * 0.01] }]
          : [{ x: 'Price', y: [currentPrice - (chartMax - chartMin) * 0.01, currentPrice + (chartMax - chartMin) * 0.01] }],
      },
    ],
    xaxis: {
      min: chartMin,
      max: chartMax,
      labels: { formatter: (val: number) => formatValue(val) },
    },
    yaxis: { labels: { show: false } },
    legend: {
      show: true,
      position: 'bottom' as const,
      horizontalAlign: 'center' as const,
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }: { seriesIndex: number; dataPointIndex: number; w: { globals: { seriesNames: string[] }; config: { series: { data: { y: number[] }[] }[] } } }) {
        const seriesName = w.globals.seriesNames[seriesIndex];
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        if (seriesIndex === 0 && equilibriumExists) {
          return `<div class="p-2 p-2 bg-base-200 shadow rounded text-sm text-base-content">
            <strong>${seriesName}</strong><br/>
            ${formatValue(data.y[0])} - ${formatValue(data.y[1])}
          </div>`;
        }
        const midpoint = (data.y[0] + data.y[1]) / 2;
        return `<div class="p-2 p-2 bg-base-200 shadow rounded text-sm text-base-content">
          <strong>${seriesName}</strong>: ${formatValue(midpoint)}
        </div>`;
      },
    },
    grid: { padding: { left: 10, right: 10 } },
    annotations: {
      xaxis: [
        {
          x: currentPrice,
          borderColor: getThemeColor('--color-info'),
          strokeDashArray: 4,
          label: {
            text: `Current: ${formatValue(currentPrice)}`,
            style: {
              color: getThemeColor('--color-info-content'),
              background: getThemeColor('--color-info'),
            },
          },
        },
      ],
    },
  });
</script>

<div class="w-full">
  <BaseChart {options} {height} />
  <div class="mt-2 text-center text-sm text-base-content/70">
    {#if equilibriumExists}
      <span class="text-success font-medium">Equilibrium zone:</span>
      {formatValue(minimumPrice)} to {formatValue(maximumPrice)}
    {:else}
      <span class="text-error font-medium">No overlap:</span>
      Your minimum ({formatValue(minimumPrice)}) exceeds client maximum ({formatValue(maximumPrice)})
    {/if}
  </div>
</div>
