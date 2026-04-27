<script lang="ts">
  import BaseChart from './BaseChart.svelte';
  import type { YearlyProjection } from '@model-pear/calculator';
  import { formatCurrency } from '$lib/utils';
  import { themeRev, getThemeColor } from '$lib/theme';

  export let developerData: YearlyProjection[];
  export let buyerData: YearlyProjection[];
  export let title = 'Cumulative Cash Flow';
  export let height: number | string = 350;

  $: years = developerData.map((d) => `Year ${d.year}`);

  // Theme reactivity: see CashFlowChart.svelte for the pattern explanation.
  let themeKey = 0;
  $: themeKey = $themeRev;

  $: options = (themeKey, {
    chart: { type: 'line' as const, toolbar: { show: false } },
    colors: [getThemeColor('--color-primary'), getThemeColor('--color-secondary')],
    stroke: { curve: 'smooth' as const, width: 3 },
    markers: { size: 5, hover: { size: 7 } },
    xaxis: { categories: years },
    yaxis: {
      title: { text: 'Cumulative Cash Flow (ZAR)' },
      labels: { formatter: (val: number) => formatCurrency(val, true) },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    tooltip: { y: { formatter: (val: number) => formatCurrency(val) } },
    legend: { position: 'top' as const, horizontalAlign: 'center' as const },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: getThemeColor('--color-base-content'),
          strokeDashArray: 4,
          label: {
            text: 'Break-even',
            style: {
              color: getThemeColor('--color-base-content'),
              background: getThemeColor('--color-base-300'),
            },
          },
        },
      ],
    },
    series: [
      { name: 'Developer', data: developerData.map((d) => d.cumulativeCashFlow) },
      { name: 'Buyer', data: buyerData.map((d) => d.cumulativeCashFlow) },
    ],
  });
</script>

<div class="card p-4">
  <h3 class="text-lg font-semibold text-base-content mb-2">{title}</h3>
  <p class="text-sm text-base-content/70 mb-4">
    Cumulative cash position over time. The point where lines cross zero indicates payback.
  </p>
  {#if developerData.length > 0}
    <BaseChart {options} {height} />
  {:else}
    <p class="text-base-content/70 text-center py-8">No projection data available</p>
  {/if}
</div>
