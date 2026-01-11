<script lang="ts">
  /**
   * DeveloperResults - Displays developer perspective results
   *
   * Shows revenue, profit, tax, and asset recognition from the developer's view.
   */
  import type { DeveloperPerspective } from '@model-pear/calculator';
  import ResultPanel from './ResultPanel.svelte';
  import ResultRow from './ResultRow.svelte';
  import ResultSection from './ResultSection.svelte';
  import { formatCurrency, formatPercent, getValueClass } from '$lib/utils/formatters';

  export let developer: DeveloperPerspective;
</script>

<ResultPanel icon="💻" title="Developer Perspective" badge="Your Company">
  <div class="grid sm:grid-cols-2 gap-6">
    <!-- Revenue -->
    <ResultSection title="Revenue">
      <ResultRow label="Total Revenue" value={formatCurrency(developer.revenue.total)} />
      <ResultRow label="Recognition" value={developer.revenue.recognitionTiming} valueClass="text-sm text-gray-600" />
    </ResultSection>

    <!-- Profit -->
    <ResultSection title="Profit">
      <ResultRow
        label="Gross Profit"
        value={formatCurrency(developer.profit.gross)}
        valueClass={getValueClass(developer.profit.gross)}
      />
      <ResultRow label="Margin" value={formatPercent(developer.profit.margin)} />
      <ResultRow
        label="Net Profit"
        value={formatCurrency(developer.profit.net)}
        valueClass={getValueClass(developer.profit.net)}
      />
    </ResultSection>

    <!-- Tax -->
    <ResultSection title="Tax">
      <ResultRow label="Taxable Income" value={formatCurrency(developer.tax.taxableIncome)} />
      <ResultRow
        label="Tax Payable"
        value={formatCurrency(developer.tax.taxPayable)}
        valueClass="result-value-negative"
      />
    </ResultSection>

    <!-- Asset -->
    <ResultSection title="Asset Recognition">
      <ResultRow label="Asset Recognised" value={developer.asset.recognised ? 'Yes' : 'No'} valueClass="text-sm" />
      <p class="text-xs text-gray-500 mt-1">{developer.asset.reason}</p>
    </ResultSection>
  </div>
</ResultPanel>
