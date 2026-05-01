<script lang="ts">
  /**
   * BuyerResults - Displays buyer perspective results
   *
   * Shows asset capitalisation, amortisation, tax treatment, and total cost.
   */
  import type { BuyerPerspective } from '@model-pear/calculator';
  import ResultPanel from './ResultPanel.svelte';
  import ResultRow from './ResultRow.svelte';
  import ResultSection from './ResultSection.svelte';
  import { formatCurrency } from '$lib/utils/formatters';

  export let buyer: BuyerPerspective;
</script>

<ResultPanel icon="🏢" title="Buyer Perspective" badge="Client">
  <div class="grid sm:grid-cols-2 gap-6">
    <!-- Asset -->
    <ResultSection title="Asset Recognition">
      <ResultRow label="Capitalised" value={formatCurrency(buyer.asset.capitalised)} />
      <ResultRow label="Expensed" value={formatCurrency(buyer.asset.expensed)} />
      <ResultRow label="Annual Amortisation" value={formatCurrency(buyer.asset.annualAmortisation)} />
    </ResultSection>

    <!-- Tax -->
    <ResultSection title="Tax Treatment">
      <ResultRow label="Section 11(e) Deduction" value={formatCurrency(buyer.tax.section11eDeduction)} />
      <ResultRow
        label="Tax Benefit (Year 1)"
        value={formatCurrency(buyer.tax.taxBenefit)}
        valueClass="font-medium text-success"
      />
    </ResultSection>

    <!-- Total Cost -->
    <ResultSection title="Total Cost of Ownership" colspan>
      <ResultRow
        label="Total Transaction Value"
        value={formatCurrency(buyer.totalCost)}
        valueClass="font-medium text-base-content text-lg"
      />
    </ResultSection>
  </div>
</ResultPanel>
