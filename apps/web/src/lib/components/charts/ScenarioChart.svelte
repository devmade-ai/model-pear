<script lang="ts">
  import BaseChart from './BaseChart.svelte';
  import { formatCurrency } from '$lib/utils';
  import { themeRev, getThemeColor } from '$lib/theme';

  export let baseValue: number;
  export let bestValue: number;
  export let worstValue: number;
  export let title = 'Scenario Analysis';
  export let height: number | string = 280;

  // Theme reactivity: see CashFlowChart.svelte for the pattern explanation.
  let themeKey = 0;
  $: themeKey = $themeRev;

  function makeOptions(_rev: number) {
    return {
    chart: { type: 'bar' as const, toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 8,
        distributed: true,
      },
    },
    // Worst -> error (red), Base -> neutral (gray), Best -> success (green).
    // The semantic mapping carries meaning that pure brand colors wouldn't.
    colors: [
      getThemeColor('--color-error'),
      getThemeColor('--color-neutral'),
      getThemeColor('--color-success'),
    ],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => formatCurrency(val, true),
      style: { fontSize: '11px', fontWeight: 'bold' },
      offsetY: -20,
    },
    stroke: { show: false },
    xaxis: { categories: ['Worst Case', 'Base Case', 'Best Case'] },
    yaxis: {
      title: { text: 'Developer Profit (ZAR)' },
      labels: { formatter: (val: number) => formatCurrency(val, true) },
    },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val: number) => formatCurrency(val) } },
    legend: { show: false },
    series: [{ name: 'Profit', data: [worstValue, baseValue, bestValue] }],
    };
  }
  $: options = makeOptions(themeKey);

  $: range = bestValue - worstValue;
  $: volatility = baseValue !== 0 ? (range / Math.abs(baseValue)) * 100 : 0;
</script>

<div class="card p-4">
  <h3 class="text-lg font-semibold text-base-content mb-2">{title}</h3>
  <p class="text-sm text-base-content/70 mb-4">
    Best, base, and worst case outcomes based on input ranges.
  </p>
  <BaseChart {options} {height} />

  <!-- Summary Stats -->
  <div class="mt-4 pt-4 border-t border-base-300 grid grid-cols-3 gap-4 text-center">
    <div>
      <p class="text-xs text-base-content/70">Range</p>
      <p class="text-sm font-semibold text-base-content">{formatCurrency(range)}</p>
    </div>
    <div>
      <p class="text-xs text-base-content/70">Volatility</p>
      <p class="text-sm font-semibold text-base-content">{volatility.toFixed(1)}%</p>
    </div>
    <div>
      <p class="text-xs text-base-content/70">Upside</p>
      <p class="text-sm font-semibold text-success">+{formatCurrency(bestValue - baseValue)}</p>
    </div>
  </div>
</div>
