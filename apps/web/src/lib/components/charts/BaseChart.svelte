<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type ApexCharts from 'apexcharts';

  export let options: ApexCharts.ApexOptions;
  export let height: number | string = 350;

  let chartElement: HTMLDivElement;
  let chart: ApexCharts | null = null;

  onMount(async () => {
    // Dynamic import to avoid SSR issues
    const ApexChartsModule = await import('apexcharts');
    const ApexCharts = ApexChartsModule.default;

    chart = new ApexCharts(chartElement, {
      ...options,
      chart: {
        ...options.chart,
        height,
      },
    });
    chart.render();
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });

  // Update chart when options change
  $: if (chart && options) {
    chart.updateOptions(options);
  }
</script>

<div bind:this={chartElement} class="w-full"></div>
