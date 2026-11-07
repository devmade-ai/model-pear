<script lang="ts">
  /**
   * EquilibriumChart - Visual representation of price equilibrium zone
   */
  import BaseChart from './BaseChart.svelte';
  import { themeRev, getThemeColor } from '$lib/theme';
  import { finiteOrNull, formatPercent } from '$lib/utils';

  export let minimumPrice: number;
  export let maximumPrice: number;
  export let currentPrice: number;
  export let suggestedPrice: number;
  export let equilibriumExists: boolean;
  export let isPercentage: boolean = false;
  export let height: number = 200;

  function formatValue(value: number): string {
    if (!Number.isFinite(value)) return '—';
    if (isPercentage) return formatPercent(value, 1);
    return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  $: minF = finiteOrNull(minimumPrice);
  $: maxF = finiteOrNull(maximumPrice);
  $: curF = finiteOrNull(currentPrice);
  $: sugF = finiteOrNull(suggestedPrice);

  $: chartReady =
    minF !== null && maxF !== null && curF !== null && sugF !== null;

  $: chartMin =
    chartReady && minF !== null && maxF !== null && curF !== null
      ? Math.max(0, Math.min(minF, maxF, curF) * 0.8)
      : 0;
  $: chartMax =
    chartReady && minF !== null && maxF !== null && curF !== null
      ? Math.max(minF, maxF, curF, 1) * 1.2
      : 1;

  let themeKey = 0;
  $: themeKey = $themeRev;

  function makeOptions(_rev: number, ready: boolean): ApexCharts.ApexOptions | null {
    if (!ready || minF === null || maxF === null || curF === null || sugF === null) return null;
    const span = chartMax - chartMin;
    const pad = span * 0.01;
    return ({
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
            ? [{ x: 'Price', y: [minF, maxF] }]
            : [{ x: 'Price', y: [0, 0] }],
        },
        {
          name: 'Your Minimum',
          data: [{ x: 'Price', y: [minF - pad, minF + pad] }],
        },
        {
          name: 'Client Maximum',
          data: [{ x: 'Price', y: [maxF - pad, maxF + pad] }],
        },
        {
          name: equilibriumExists ? 'Suggested' : 'Current',
          data: equilibriumExists
            ? [{ x: 'Price', y: [sugF - pad, sugF + pad] }]
            : [{ x: 'Price', y: [curF - pad, curF + pad] }],
        },
      ],
      xaxis: {
        min: chartMin,
        max: chartMax,
        tickAmount: 5,
        // Readable scale lives in the HTML <dl> below; Apex x-axis SVG labels
        // duplicate/widen the document on narrow viewports.
        labels: { show: false },
      },
      yaxis: { labels: { show: false } },
      legend: { show: false },
      tooltip: {
        custom: function ({
          seriesIndex,
          dataPointIndex,
          w,
        }: {
          seriesIndex: number;
          dataPointIndex: number;
          w: {
            globals: { seriesNames: string[] };
            config: { series: { data: { y: number[] }[] }[] };
          };
        }) {
          const seriesName = w.globals.seriesNames[seriesIndex];
          const data = w.config.series[seriesIndex].data[dataPointIndex];
          if (seriesIndex === 0 && equilibriumExists) {
            return `<div class="p-2 bg-base-200 shadow-sm rounded text-sm text-base-content">
            <strong>${seriesName}</strong><br/>
            ${formatValue(data.y[0])} - ${formatValue(data.y[1])}
          </div>`;
          }
          const midpoint = (data.y[0] + data.y[1]) / 2;
          return `<div class="p-2 bg-base-200 shadow-sm rounded text-sm text-base-content">
          <strong>${seriesName}</strong>: ${formatValue(midpoint)}
        </div>`;
        },
      },
      grid: { padding: { left: 4, right: 4 } },
      // Current price is shown in the HTML price scale below — SVG annotations widen narrow viewports.
      annotations: { xaxis: [], yaxis: [] },
    } as unknown as ApexCharts.ApexOptions);
  }

  $: options = makeOptions(themeKey, chartReady);
</script>

<div class="w-full max-w-full overflow-x-hidden">
  {#if options}
    <BaseChart {options} {height} />
    <dl class="mt-3 grid grid-cols-3 gap-2 text-center text-xs tabular-nums" aria-label="Price scale">
      <div>
        <dt class="text-base-content/60">Scale low</dt>
        <dd class="font-medium text-base-content">{formatValue(chartMin)}</dd>
      </div>
      <div>
        <dt class="text-base-content/60">Your price</dt>
        <dd class="font-medium text-base-content">{formatValue(currentPrice)}</dd>
      </div>
      <div>
        <dt class="text-base-content/60">Scale high</dt>
        <dd class="font-medium text-base-content">{formatValue(chartMax)}</dd>
      </div>
    </dl>
  {:else}
    <p class="text-sm text-base-content/70 text-center py-8">Enter valid prices to see the chart.</p>
  {/if}
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
