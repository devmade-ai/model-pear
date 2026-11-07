<script lang="ts">
  import BaseChart from './BaseChart.svelte';
  import { apexAxisFormat, formatCurrency } from '$lib/utils';
  import { themeRev, getThemeColor } from '$lib/theme';

  export let developerNPV: number;
  export let buyerNPV: number;
  export let title = 'NPV Comparison';
  export let height: number | string = 280;

  // Theme reactivity: see CashFlowChart.svelte for the pattern explanation.
  let themeKey = 0;
  $: themeKey = $themeRev;

  function makeOptions(_rev: number, _devNPV: number, _buyerNPV: number) {
    return {
    chart: { type: 'bar' as const, toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 8,
        distributed: true,
      },
    },
    colors: [getThemeColor('--color-primary'), getThemeColor('--color-secondary')],
    dataLabels: {
      enabled: true,
      formatter: (val: string | number) => apexAxisFormat(val, (n) => formatCurrency(n, true)),
      style: { fontSize: '12px', fontWeight: 'bold' },
      offsetY: -20,
    },
    stroke: { show: false },
    xaxis: { categories: ['Developer', 'Buyer'] },
    yaxis: {
      title: { text: 'Net Present Value (ZAR)' },
      labels: {
        showDuplicates: false,
        hideOverlappingLabels: true,
        formatter: (val: string | number) => apexAxisFormat(val, (n) => formatCurrency(n, true)),
      },
    },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val: string | number) => apexAxisFormat(val, (n) => formatCurrency(n)) } },
    legend: { show: false },
    series: [{ name: 'NPV', data: [developerNPV, buyerNPV] }],
  };
  }
  $: options = makeOptions(themeKey, developerNPV, buyerNPV);
</script>

<div class="card p-4">
  <h3 class="text-lg font-semibold text-base-content mb-2">{title}</h3>
  <p class="text-sm text-base-content/70 mb-4">
    Net Present Value for each party, discounted at the specified rate.
  </p>
  <BaseChart {options} {height} />
</div>
