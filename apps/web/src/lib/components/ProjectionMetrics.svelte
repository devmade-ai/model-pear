<script lang="ts">
  import type { ProjectionMetrics as Metrics, InvestmentAssessment } from '@model-pear/calculator';
  import { formatCurrency, formatPercent } from '$lib/utils';

  export let metrics: Metrics;
  export let assessment: InvestmentAssessment;
  export let partyName: string;
  export let partyColor: string = 'blue'; // blue or green

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      badge: 'bg-green-100 text-green-800',
    },
  };

  $: colors = colorClasses[partyColor as keyof typeof colorClasses] || colorClasses.blue;

  function getAssessmentColor(color: InvestmentAssessment['color']) {
    const colorMap = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
    };
    return colorMap[color] || colorMap.blue;
  }
</script>

<div class="card p-4 {colors.bg} {colors.border}">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-900">{partyName}</h3>
    <span class="px-2 py-1 text-xs font-medium rounded-full {getAssessmentColor(assessment.color)}">
      {assessment.rating}
    </span>
  </div>

  <div class="grid grid-cols-2 gap-4">
    <!-- NPV -->
    <div>
      <p class="text-sm text-gray-500">Net Present Value</p>
      <p class="text-xl font-bold {metrics.npv >= 0 ? 'text-green-600' : 'text-red-600'}">
        {formatCurrency(metrics.npv)}
      </p>
    </div>

    <!-- IRR -->
    <div>
      <p class="text-sm text-gray-500">Internal Rate of Return</p>
      <p class="text-xl font-bold {metrics.irr >= 0 ? 'text-green-600' : 'text-red-600'}">
        {formatPercent(metrics.irr)}
      </p>
    </div>

    <!-- Payback Period -->
    <div>
      <p class="text-sm text-gray-500">Payback Period</p>
      <p class="text-xl font-bold text-gray-900">
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
      <p class="text-sm text-gray-500">Discounted Payback</p>
      <p class="text-xl font-bold text-gray-900">
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
  <div class="mt-4 pt-4 border-t border-gray-200">
    <p class="text-sm text-gray-600">{assessment.description}</p>
  </div>
</div>
