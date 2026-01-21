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
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: 'text-blue-400',
      badge: 'bg-blue-500/20 text-blue-400',
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: 'text-green-400',
      badge: 'bg-green-500/20 text-green-400',
    },
  };

  $: colors = colorClasses[partyColor as keyof typeof colorClasses] || colorClasses.blue;

  function getAssessmentColor(color: InvestmentAssessment['color']) {
    // Dark-theme compatible assessment colors
    const colorMap = {
      green: 'bg-green-500/20 text-green-400',
      blue: 'bg-blue-500/20 text-blue-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
      red: 'bg-red-500/20 text-red-400',
    };
    return colorMap[color] || colorMap.blue;
  }
</script>

<div class="card p-4 {colors.bg} {colors.border}">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-foreground">{partyName}</h3>
    <span class="px-2 py-1 text-xs font-medium rounded-full {getAssessmentColor(assessment.color)}">
      {assessment.rating}
    </span>
  </div>

  <div class="grid grid-cols-2 gap-4">
    <!-- NPV -->
    <div>
      <p class="text-sm text-muted-foreground">Net Present Value</p>
      <p class="text-xl font-bold {metrics.npv >= 0 ? 'text-green-400' : 'text-red-400'}">
        {formatCurrency(metrics.npv)}
      </p>
    </div>

    <!-- IRR -->
    <div>
      <p class="text-sm text-muted-foreground">Internal Rate of Return</p>
      <p class="text-xl font-bold {metrics.irr >= 0 ? 'text-green-400' : 'text-red-400'}">
        {formatPercent(metrics.irr)}
      </p>
    </div>

    <!-- Payback Period -->
    <div>
      <p class="text-sm text-muted-foreground">Payback Period</p>
      <p class="text-xl font-bold text-foreground">
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
      <p class="text-sm text-muted-foreground">Discounted Payback</p>
      <p class="text-xl font-bold text-foreground">
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
  <div class="mt-4 pt-4 border-t border-border">
    <p class="text-sm text-muted-foreground">{assessment.description}</p>
  </div>
</div>
