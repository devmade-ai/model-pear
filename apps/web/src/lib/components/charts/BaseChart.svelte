<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type ApexCharts from 'apexcharts';

  export let options: ApexCharts.ApexOptions;
  export let height: number | string = 350;

  let chartElement: HTMLDivElement;
  let chart: ApexCharts | null = null;
  let cleanupThemeListener: (() => void) | null = null;

  function isDarkNow(): boolean {
    return typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark');
  }

  onMount(async () => {
    // Dynamic import to avoid SSR issues (apexcharts uses browser-only APIs).
    const ApexChartsModule = await import('apexcharts');
    const ApexCharts = ApexChartsModule.default;

    // Initial theme matches whatever the bootstrap script set in app.html.
    // Subsequent changes flow through the `theme:change` listener below.
    const initialDark = isDarkNow();

    chart = new ApexCharts(chartElement, {
      ...options,
      theme: { mode: initialDark ? 'dark' : 'light' },
      chart: {
        ...options.chart,
        height,
        // Let the page background show through so the chart inherits the
        // active DaisyUI theme's surface (bg-base-100/200) instead of
        // ApexCharts' hardcoded white.
        background: 'transparent',
      },
    });
    chart.render();

    // Theme switching is dispatched from apps/web/src/lib/theme.ts every
    // time applyTheme() runs (toggle, cross-tab storage, OS-pref change).
    // ApexCharts' theme.mode flips foreColor (axis labels), grid borders,
    // and tooltip styling automatically. Series colors (the hex values in
    // each per-chart `colors` array) are intentional brand choices and
    // stay constant across themes.
    // 'theme:change' is typed via WindowEventMap augmentation in app.d.ts.
    const onThemeChange = (e: WindowEventMap['theme:change']) => {
      if (!chart) return;
      chart.updateOptions({ theme: { mode: e.detail.dark ? 'dark' : 'light' } });
    };
    window.addEventListener('theme:change', onThemeChange);
    cleanupThemeListener = () => {
      window.removeEventListener('theme:change', onThemeChange);
    };
  });

  onDestroy(() => {
    if (cleanupThemeListener) cleanupThemeListener();
    if (chart) {
      chart.destroy();
    }
  });

  // Update chart when caller passes new options (data changes, axis tweaks, etc.).
  // updateOptions merges incrementally — it doesn't touch theme.mode unless
  // the new options explicitly include `theme`, so the active theme is preserved.
  $: if (chart && options) {
    chart.updateOptions(options);
  }
</script>

<div bind:this={chartElement} class="w-full"></div>
