<script lang="ts">
  import BaseChart from './BaseChart.svelte';
  import type { YearlyProjection } from '@model-pear/calculator';
  import { formatCurrency } from '$lib/utils';
  import { themeRev, getThemeColor } from '$lib/theme';

  export let developerData: YearlyProjection[];
  export let buyerData: YearlyProjection[];
  export let title = 'Cash Flow Projections';
  export let height: number | string = 350;

  $: years = developerData.map((d) => `Year ${d.year}`);

  // Theme reactivity: extract `$themeRev` into a plain variable so Svelte's
  // compiler unambiguously tracks the dependency. The data props are passed
  // as explicit args too — Svelte's $: dependency analysis is lexical and
  // only tracks vars read in the call expression, not closures inside the
  // function. Without these args, options would only update on theme flip,
  // not when developerData / buyerData change.
  let themeKey = 0;
  $: themeKey = $themeRev;

  function makeOptions(_rev: number, _devData: unknown, _buyerData: unknown) {
    return {
    chart: {
      type: 'bar' as const,
      stacked: false,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    colors: [getThemeColor('--color-primary'), getThemeColor('--color-secondary')],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: years },
    yaxis: {
      title: { text: 'Cash Flow (ZAR)' },
      labels: { formatter: (val: number) => formatCurrency(val, true) },
    },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val: number) => formatCurrency(val) } },
    legend: { position: 'top' as const, horizontalAlign: 'center' as const },
    series: [
      { name: 'Developer', data: developerData.map((d) => d.cashFlow) },
      { name: 'Buyer', data: buyerData.map((d) => d.cashFlow) },
    ],
  };
  }
  $: options = makeOptions(themeKey, developerData, buyerData);
</script>

<div class="card p-4">
  <h3 class="text-lg font-semibold text-base-content mb-2">{title}</h3>
  <p class="text-sm text-base-content/70 mb-4">
    Annual cash flows for both parties over the projection period.
  </p>
  {#if developerData.length > 0}
    <BaseChart {options} {height} />
  {:else}
    <p class="text-base-content/70 text-center py-8">No projection data available</p>
  {/if}
</div>
