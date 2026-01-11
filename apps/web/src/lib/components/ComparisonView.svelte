<script lang="ts">
  /**
   * ComparisonView - Side-by-side comparison of saved options
   *
   * Shows 2-4 options in columns with difference highlighting.
   */
  import { selectedOptions, comparisonStore } from '$lib/stores';
  import type { SavedOption } from '$lib/stores';
  import { formatCurrency, formatPercent } from '$lib/utils/formatters';

  // Close comparison view
  function close() {
    comparisonStore.closeComparison();
  }

  // Get difference indicator
  function getDiff(values: number[], index: number): { arrow: string; class: string } {
    const value = values[index];
    const max = Math.max(...values);
    const min = Math.min(...values);

    if (values.every((v) => v === value)) {
      return { arrow: '', class: '' };
    }

    if (value === max) {
      return { arrow: '▲', class: 'text-green-600' };
    }
    if (value === min) {
      return { arrow: '▼', class: 'text-red-600' };
    }
    return { arrow: '', class: '' };
  }

  // Get model label
  function getModelLabel(modelId: string): string {
    const labels: Record<string, string> = {
      'model-1': 'Cost-Plus',
      'model-2': 'Licence',
      'model-3': 'Joint Dev',
      'model-4': 'BOT',
      'model-5': 'Sale',
      'model-6': 'SaaS',
    };
    return labels[modelId] || modelId;
  }

  // Comparison rows
  interface CompRow {
    label: string;
    section: string;
    getValue: (opt: SavedOption) => number;
    format: (v: number) => string;
    higherIsBetter?: boolean;
  }

  const comparisonRows: CompRow[] = [
    // Developer section
    {
      label: 'Total Revenue',
      section: 'Developer',
      getValue: (o) => o.result.developer.revenue.total,
      format: formatCurrency,
      higherIsBetter: true,
    },
    {
      label: 'Gross Profit',
      section: 'Developer',
      getValue: (o) => o.result.developer.profit.gross,
      format: formatCurrency,
      higherIsBetter: true,
    },
    {
      label: 'Margin',
      section: 'Developer',
      getValue: (o) => o.result.developer.profit.margin,
      format: (v) => formatPercent(v),
      higherIsBetter: true,
    },
    {
      label: 'Net Profit',
      section: 'Developer',
      getValue: (o) => o.result.developer.profit.net,
      format: formatCurrency,
      higherIsBetter: true,
    },
    {
      label: 'Tax Payable',
      section: 'Developer',
      getValue: (o) => o.result.developer.tax.taxPayable,
      format: formatCurrency,
      higherIsBetter: false,
    },
    // Buyer section
    {
      label: 'Capitalised Asset',
      section: 'Buyer',
      getValue: (o) => o.result.buyer.asset.capitalised,
      format: formatCurrency,
    },
    {
      label: 'Annual Amortisation',
      section: 'Buyer',
      getValue: (o) => o.result.buyer.asset.annualAmortisation,
      format: formatCurrency,
    },
    {
      label: 'Tax Benefit (Y1)',
      section: 'Buyer',
      getValue: (o) => o.result.buyer.tax.taxBenefit,
      format: formatCurrency,
      higherIsBetter: true,
    },
    {
      label: 'Total Cost',
      section: 'Buyer',
      getValue: (o) => o.result.buyer.totalCost,
      format: formatCurrency,
      higherIsBetter: false,
    },
    // Transfer Pricing
    {
      label: 'Applied Margin',
      section: 'TP Risk',
      getValue: (o) => o.result.transferPricing.margin,
      format: (v) => formatPercent(v),
    },
    {
      label: 'Risk Score',
      section: 'TP Risk',
      getValue: (o) => o.result.transferPricing.riskScore,
      format: (v) => `${v}/100`,
      higherIsBetter: true,
    },
  ];

  // Group rows by section
  $: sections = comparisonRows.reduce(
    (acc, row) => {
      if (!acc[row.section]) acc[row.section] = [];
      acc[row.section].push(row);
      return acc;
    },
    {} as Record<string, CompRow[]>
  );
</script>

<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center space-x-2">
        <span class="text-xl">📊</span>
        <h2 class="text-xl font-bold text-gray-900">Comparison View</h2>
        <span class="text-sm text-gray-500">({$selectedOptions.length} options)</span>
      </div>
      <button class="p-2 hover:bg-gray-100 rounded-lg" on:click={close} title="Close"> ✕ </button>
    </div>

    <!-- Content -->
    <div class="overflow-auto max-h-[calc(90vh-8rem)]">
      <table class="w-full">
        <!-- Column headers -->
        <thead class="sticky top-0 bg-white z-10">
          <tr>
            <th class="text-left p-3 bg-gray-50 font-medium text-gray-700 w-40">Metric</th>
            {#each $selectedOptions as option}
              <th class="p-3 bg-gray-50 text-center min-w-[160px]">
                <div class="font-semibold text-gray-900">{option.name}</div>
                <div class="text-xs text-gray-500 mt-1">
                  {getModelLabel(option.modelId)} ({option.variantId})
                </div>
              </th>
            {/each}
          </tr>
        </thead>

        <tbody>
          {#each Object.entries(sections) as [sectionName, rows]}
            <!-- Section header -->
            <tr class="bg-gray-100">
              <td colspan={$selectedOptions.length + 1} class="p-2 font-semibold text-gray-700">
                {sectionName}
              </td>
            </tr>

            <!-- Section rows -->
            {#each rows as row}
              {@const values = $selectedOptions.map((o) => row.getValue(o))}
              <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="p-3 text-sm text-gray-600">{row.label}</td>
                {#each $selectedOptions as option, i}
                  {@const diff = getDiff(values, i)}
                  {@const isBest =
                    row.higherIsBetter !== undefined &&
                    ((row.higherIsBetter && values[i] === Math.max(...values)) ||
                      (!row.higherIsBetter && values[i] === Math.min(...values)))}
                  <td
                    class="p-3 text-center tabular-nums {isBest
                      ? 'bg-green-50 font-semibold'
                      : ''}"
                  >
                    <span class={diff.class}>
                      {row.format(row.getValue(option))}
                      {#if diff.arrow}
                        <span class="ml-1">{diff.arrow}</span>
                      {/if}
                    </span>
                  </td>
                {/each}
              </tr>
            {/each}
          {/each}

          <!-- Risk Level row -->
          <tr class="bg-gray-100">
            <td colspan={$selectedOptions.length + 1} class="p-2 font-semibold text-gray-700">
              Risk Assessment
            </td>
          </tr>
          <tr class="border-b border-gray-100">
            <td class="p-3 text-sm text-gray-600">Risk Level</td>
            {#each $selectedOptions as option}
              {@const level = option.result.transferPricing.riskLevel}
              <td class="p-3 text-center">
                <span
                  class="px-2 py-1 rounded text-xs font-medium {level === 'low'
                    ? 'bg-green-100 text-green-800'
                    : level === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'}"
                >
                  {level.toUpperCase()}
                </span>
              </td>
            {/each}
          </tr>
          <tr class="border-b border-gray-100">
            <td class="p-3 text-sm text-gray-600">Within Range</td>
            {#each $selectedOptions as option}
              <td class="p-3 text-center">
                {option.result.transferPricing.withinRange ? '✓ Yes' : '✗ No'}
              </td>
            {/each}
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t bg-gray-50 flex justify-end space-x-3">
      <button class="btn-secondary" on:click={() => window.print()}> Print </button>
      <button class="btn-primary" on:click={close}> Close </button>
    </div>
  </div>
</div>
