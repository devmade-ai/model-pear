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
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: { categories: ['Developer', 'Buyer'] },
    yaxis: { title: { text: undefined }, labels: { show: false } },
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
  <div class="grid grid-cols-2 gap-2 text-xs text-center tabular-nums mb-2">
    <div>
      <p class="text-base-content/60">Developer NPV</p>
      <p class="font-medium text-base-content">{formatCurrency(developerNPV, true)}</p>
    </div>
    <div>
      <p class="text-base-content/60">Buyer NPV</p>
      <p class="font-medium text-base-content">{formatCurrency(buyerNPV, true)}</p>
    </div>
  </div>
  <BaseChart {options} {height} />
</div>
