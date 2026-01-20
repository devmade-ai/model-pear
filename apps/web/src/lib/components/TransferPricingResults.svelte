<script lang="ts">
  /**
   * TransferPricingResults - Displays transfer pricing assessment
   *
   * Shows margin analysis, compliance score, and documentation requirements.
   * Use minimal=true when already inside a card container to avoid nested card styling.
   */
  import type { TransferPricingAssessment } from '@model-pear/calculator';
  import ResultPanel from './ResultPanel.svelte';
  import ResultRow from './ResultRow.svelte';
  import ResultSection from './ResultSection.svelte';
  import { formatPercent, getRiskBadgeClass } from '$lib/utils/formatters';

  export let transferPricing: TransferPricingAssessment;
  /** When true, renders without ResultPanel wrapper (for use inside existing cards) */
  export let minimal: boolean = false;
</script>

{#if minimal}
  <!-- Minimal mode: no outer card wrapper -->
  <div class="grid sm:grid-cols-2 gap-6">
    <ResultSection title="Margin Analysis">
      <ResultRow label="Applied Margin" value={formatPercent(transferPricing.margin)} />
      <ResultRow
        label="Arm's Length Range"
        value="{transferPricing.benchmarkRange.low}% - {transferPricing.benchmarkRange.high}%"
        valueClass="text-sm text-gray-600"
      />
      <ResultRow
        label="Within Range"
        value={transferPricing.withinRange ? '✓ Yes' : '✗ No'}
        valueClass="text-sm"
      />
      <ResultRow label="Compliance Score" value="{transferPricing.riskScore}/100" />
    </ResultSection>

    <ResultSection title="Recommendation">
      <p class="text-sm text-gray-700 mb-4">{transferPricing.recommendation}</p>

      <h3 class="text-sm font-medium text-gray-500 mb-2">Required Documentation</h3>
      <ul class="text-xs text-gray-600 space-y-1">
        {#each transferPricing.documentation as doc}
          <li>• {doc}</li>
        {/each}
      </ul>
    </ResultSection>
  </div>
{:else}
  <!-- Full mode: with ResultPanel wrapper -->
  <ResultPanel
    icon="⚖️"
    title="Transfer Pricing Assessment"
    badge="{transferPricing.riskLevel.toUpperCase()} RISK"
    badgeClass={getRiskBadgeClass(transferPricing.riskLevel)}
  >
    <div class="grid sm:grid-cols-2 gap-6">
      <ResultSection title="Margin Analysis">
        <ResultRow label="Applied Margin" value={formatPercent(transferPricing.margin)} />
        <ResultRow
          label="Arm's Length Range"
          value="{transferPricing.benchmarkRange.low}% - {transferPricing.benchmarkRange.high}%"
          valueClass="text-sm text-gray-600"
        />
        <ResultRow
          label="Within Range"
          value={transferPricing.withinRange ? '✓ Yes' : '✗ No'}
          valueClass="text-sm"
        />
        <ResultRow label="Compliance Score" value="{transferPricing.riskScore}/100" />
      </ResultSection>

      <ResultSection title="Recommendation">
        <p class="text-sm text-gray-700 mb-4">{transferPricing.recommendation}</p>

        <h3 class="text-sm font-medium text-gray-500 mb-2">Required Documentation</h3>
        <ul class="text-xs text-gray-600 space-y-1">
          {#each transferPricing.documentation as doc}
            <li>• {doc}</li>
          {/each}
        </ul>
      </ResultSection>
    </div>
  </ResultPanel>
{/if}
