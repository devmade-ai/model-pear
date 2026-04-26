<script lang="ts">
  import BaseChart from './BaseChart.svelte';
  import type { InputSensitivity } from '@model-pear/calculator';
  import { formatCurrency } from '$lib/utils';

  export let sensitivities: InputSensitivity[];
  export let baseValue: number;
  export let title = 'Input Sensitivity';
  export let height: number | string = 400;

  // Sort by impact (highest first) and take top 8
  $: sortedData = [...sensitivities]
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 8);

  $: categories = sortedData.map((s) => s.label);

  // Calculate deltas from base value
  $: lowDeltas = sortedData.map((s) => s.lowOutput - baseValue);
  $: highDeltas = sortedData.map((s) => s.highOutput - baseValue);

  $: options = {
    chart: {
      type: 'bar' as const,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        borderRadius: 4,
      },
    },
    colors: ['#ef4444', '#22c55e'], // red for low, green for high
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories,
      labels: {
        formatter: (val: number) => formatCurrency(val, true),
      },
      title: {
        text: 'Impact on Output',
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        maxWidth: 180,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => formatCurrency(val),
      },
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'center' as const,
    },
    annotations: {
      xaxis: [
        {
          x: 0,
          borderColor: '#64748b',
          strokeDashArray: 0,
          label: {
            text: 'Base',
            style: {
              color: '#64748b',
              background: '#f1f5f9',
            },
          },
        },
      ],
    },
    series: [
      {
        name: 'Low Scenario',
        data: lowDeltas,
      },
      {
        name: 'High Scenario',
        data: highDeltas,
      },
    ],
  };
</script>

<div class="card p-4">
  <h3 class="text-lg font-semibold text-base-content mb-2">{title}</h3>
  <p class="text-sm text-base-content/70 mb-4">
    Shows how changes in each input affect the output. Longer bars = higher sensitivity.
  </p>
  {#if sortedData.length > 0}
    <BaseChart {options} {height} />
  {:else}
    <p class="text-base-content/70 text-center py-8">No sensitivity data available</p>
  {/if}
</div>
