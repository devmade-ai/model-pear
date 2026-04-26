<script lang="ts">
  import type { ProjectionMetrics as Metrics, InvestmentAssessment } from '@model-pear/calculator';
  import { formatCurrency, formatPercent } from '$lib/utils';

  export let metrics: Metrics;
  export let assessment: InvestmentAssessment;
  export let partyName: string;
  export let partyColor: string = 'blue'; // blue or green

  // Dark-theme compatible color classes
  const colorClasses = {
    blue: {
      bg: 'bg-info/10',
      border: 'border-info/30',
      icon: 'text-info',
      badge: 'bg-info/20 text-info',
    },
    green: {
      bg: 'bg-success/10',
      border: 'border-success/30',
      icon: 'text-success',
      badge: 'bg-success/20 text-success',
    },
  };

  $: colors = colorClasses[partyColor as keyof typeof colorClasses] || colorClasses.blue;

  function getAssessmentColor(color: InvestmentAssessment['color']) {
    // Dark-theme compatible assessment colors
    const colorMap = {
      green: 'bg-success/20 text-success',
      blue: 'bg-info/20 text-info',
      yellow: 'bg-warning/20 text-warning',
      red: 'bg-error/20 text-error',
    };
    return colorMap[color] || colorMap.blue;
  }
</script>

<div class="card p-4 {colors.bg} {colors.border}">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-base-content">{partyName}</h3>
    <span class="px-2 py-1 text-xs font-medium rounded-full {getAssessmentColor(assessment.color)}">
      {assessment.rating}
    </span>
  </div>

  <div class="grid grid-cols-2 gap-4">
    <!-- NPV -->
    <div>
      <p class="text-sm text-base-content/70">Net Present Value</p>
      <p class="text-xl font-bold {metrics.npv >= 0 ? 'text-success' : 'text-error'}">
        {formatCurrency(metrics.npv)}
      </p>
    </div>

    <!-- IRR -->
    <div>
      <p class="text-sm text-base-content/70">Internal Rate of Return</p>
      <p class="text-xl font-bold {metrics.irr >= 0 ? 'text-success' : 'text-error'}">
        {formatPercent(metrics.irr)}
      </p>
    </div>

    <!-- Payback Period -->
    <div>
      <p class="text-sm text-base-content/70">Payback Period</p>
      <p class="text-xl font-bold text-base-content">
        {#if metrics.paybackPeriod === Infinity}
          Never
        {:else if metrics.paybackPeriod < 0}
          N/A
        {:else}
          {metrics.paybackPeriod.toFixed(1)} yrs
        {/if}
      </p>
    </div>

    <!-- Discounted Payback -->
    <div>
      <p class="text-sm text-base-content/70">Discounted Payback</p>
      <p class="text-xl font-bold text-base-content">
        {#if metrics.discountedPaybackPeriod === Infinity}
          Never
        {:else if metrics.discountedPaybackPeriod < 0}
          N/A
        {:else}
          {metrics.discountedPaybackPeriod.toFixed(1)} yrs
        {/if}
      </p>
    </div>
  </div>

  <!-- Assessment Description -->
  <div class="mt-4 pt-4 border-t border-base-300">
    <p class="text-sm text-base-content/70">{assessment.description}</p>
  </div>
</div>
