<script lang="ts">
  /**
   * ComparisonView - Side-by-side comparison of saved options
   *
   * Shows 2-4 options in columns with difference highlighting.
   * Supports print and CSV export.
   */
  import { selectedOptions, comparisonStore } from '$lib/stores';
  import type { SavedOption } from '$lib/stores';
  import { formatCurrency, formatPercent } from '$lib/utils/formatters';

  // Export to CSV
  function exportToCSV() {
    const headers = ['Metric', ...$selectedOptions.map((o) => o.name)];
    const rows: string[][] = [];

    // Add each section and its rows
    Object.entries(sections).forEach(([sectionName, sectionRows]) => {
      rows.push([sectionName, ...Array($selectedOptions.length).fill('')]);
      sectionRows.forEach((row) => {
        rows.push([row.label, ...$selectedOptions.map((o) => row.format(row.getValue(o)))]);
      });
    });

    // Add risk assessment
    rows.push(['Risk Assessment', ...Array($selectedOptions.length).fill('')]);
    rows.push(['Risk Level', ...$selectedOptions.map((o) => o.result.transferPricing.riskLevel.toUpperCase())]);
    rows.push(['Within Range', ...$selectedOptions.map((o) => (o.result.transferPricing.withinRange ? 'Yes' : 'No'))]);

    // Build CSV content
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comparison-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

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
      return { arrow: '▲', class: 'text-success' };
    }
    if (value === min) {
      return { arrow: '▼', class: 'text-error' };
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

  // Group rows by section. comparisonRows is const, so this only needs to
  // run once at module load — not a reactive statement.
  const sections = comparisonRows.reduce(
    (acc, row) => {
      if (!acc[row.section]) acc[row.section] = [];
      acc[row.section].push(row);
      return acc;
    },
    {} as Record<string, CompRow[]>
  );

  // Generate summary insights for each option
  interface OptionSummary {
    name: string;
    wins: string[];
  }

  $: optionSummaries = $selectedOptions.map((option, i) => {
    const wins: string[] = [];

    // Check each metric with higherIsBetter defined
    comparisonRows.forEach((row) => {
      if (row.higherIsBetter === undefined) return;

      const values = $selectedOptions.map((o) => row.getValue(o));
      const optionValue = values[i];

      if (row.higherIsBetter && optionValue === Math.max(...values) && values.filter(v => v === optionValue).length === 1) {
        wins.push(row.label.toLowerCase());
      } else if (!row.higherIsBetter && optionValue === Math.min(...values) && values.filter(v => v === optionValue).length === 1) {
        wins.push(row.label.toLowerCase());
      }
    });

    // Add risk level win
    const riskLevels = $selectedOptions.map((o) => o.result.transferPricing.riskLevel);
    const optionRisk = option.result.transferPricing.riskLevel;
    if (optionRisk === 'low' && riskLevels.some(r => r !== 'low')) {
      wins.push('lower TP risk');
    }

    return { name: option.name, wins };
  }) as OptionSummary[];

  // Generate summary text for an option
  function getSummaryText(summary: OptionSummary): string {
    if (summary.wins.length === 0) return '';
    if (summary.wins.length === 1) return `Best for ${summary.wins[0]}`;
    if (summary.wins.length === 2) return `Best for ${summary.wins[0]} and ${summary.wins[1]}`;
    return `Best for ${summary.wins.slice(0, -1).join(', ')}, and ${summary.wins[summary.wins.length - 1]}`;
  }
</script>

<!-- Backdrop (z-40) and modal (z-60) are adjacent per glow-props Z_INDEX_SCALE -->
<div class="fixed inset-0 bg-base-100/80 z-40"></div>
<div class="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
  <div class="bg-base-200 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-base-300 pointer-events-auto">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-base-300">
      <div class="flex items-center space-x-2">
        <span class="text-xl">📊</span>
        <h2 class="text-xl font-bold text-base-content">Comparison View</h2>
        <span class="text-sm text-base-content/70">({$selectedOptions.length} options)</span>
      </div>
      <button class="btn btn-ghost btn-sm btn-square" on:click={close} title="Close" aria-label="Close"> ✕ </button>
    </div>

    <!-- Summary Section -->
    {#if optionSummaries.some(s => s.wins.length > 0)}
      <div class="p-4 bg-primary/10 border-b border-base-300">
        <h3 class="text-sm font-semibold text-primary mb-2">Quick Summary</h3>
        <div class="grid gap-2 {$selectedOptions.length === 2 ? 'grid-cols-2' : $selectedOptions.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}">
          {#each optionSummaries as summary, i (i)}
            <div class="card p-3 bg-base-200 shadow-sm border border-base-300/50">
              <div class="font-medium text-base-content text-sm">{summary.name}</div>
              {#if summary.wins.length > 0}
                <div class="text-xs text-success mt-1">
                  {getSummaryText(summary)}
                </div>
              {:else}
                <div class="text-xs text-base-content/70 mt-1">No clear advantages</div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Content -->
    <div class="overflow-auto max-h-[calc(90vh-8rem)]">
      <table class="w-full">
        <!-- Column headers -->
        <thead class="sticky top-0 bg-base-200 z-10">
          <tr>
            <th class="text-left p-3 bg-base-200 font-medium text-base-content/80 w-40">Metric</th>
            {#each $selectedOptions as option (option.id)}
              <th class="p-3 bg-base-200 text-center min-w-[160px]">
                <div class="font-semibold text-base-content">{option.name}</div>
                <div class="text-xs text-base-content/70 mt-1">
                  {getModelLabel(option.modelId)} ({option.variantId})
                </div>
              </th>
            {/each}
          </tr>
        </thead>

        <tbody>
          {#each Object.entries(sections) as [sectionName, rows] (sectionName)}
            <!-- Section header -->
            <tr class="bg-base-200">
              <td colspan={$selectedOptions.length + 1} class="p-2 font-semibold text-base-content/80">
                {sectionName}
              </td>
            </tr>

            <!-- Section rows -->
            {#each rows as row (row.label)}
              {@const values = $selectedOptions.map((o) => row.getValue(o))}
              <tr class="border-b border-base-300/50 hover:bg-base-200/50">
                <td class="p-3 text-sm text-base-content/70">{row.label}</td>
                {#each $selectedOptions as option, i (option.id)}
                  {@const diff = getDiff(values, i)}
                  {@const isBest =
                    row.higherIsBetter !== undefined &&
                    ((row.higherIsBetter && values[i] === Math.max(...values)) ||
                      (!row.higherIsBetter && values[i] === Math.min(...values))) &&
                    values.filter(v => v === values[i]).length === 1}
                  <td
                    class="p-3 text-center tabular-nums {isBest
                      ? 'bg-success/10 font-semibold text-success'
                      : 'text-base-content'}"
                  >
                    {#if isBest}
                      <span class="inline-flex items-center">
                        <span class="text-success mr-1">★</span>
                        {row.format(row.getValue(option))}
                      </span>
                    {:else}
                      <span class={diff.class}>
                        {row.format(row.getValue(option))}
                        {#if diff.arrow}
                          <span class="ml-1">{diff.arrow}</span>
                        {/if}
                      </span>
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          {/each}

          <!-- Risk Level row -->
          <tr class="bg-base-200">
            <td colspan={$selectedOptions.length + 1} class="p-2 font-semibold text-base-content/80">
              Risk Assessment
            </td>
          </tr>
          <tr class="border-b border-base-300/50">
            <td class="p-3 text-sm text-base-content/70">Risk Level</td>
            {#each $selectedOptions as option (option.id)}
              {@const level = option.result.transferPricing.riskLevel}
              <td class="p-3 text-center">
                <span
                  class="px-2 py-1 rounded text-xs font-medium {level === 'low'
                    ? 'bg-success/20 text-success'
                    : level === 'medium'
                      ? 'bg-warning/20 text-warning'
                      : 'bg-error/20 text-error'}"
                >
                  {level.toUpperCase()}
                </span>
              </td>
            {/each}
          </tr>
          <tr class="border-b border-base-300/50">
            <td class="p-3 text-sm text-base-content/70">Within Range</td>
            {#each $selectedOptions as option (option.id)}
              <td class="p-3 text-center text-base-content">
                {option.result.transferPricing.withinRange ? '✓ Yes' : '✗ No'}
              </td>
            {/each}
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-base-300 bg-base-200 flex justify-between">
      <div class="flex space-x-2">
        <button class="btn btn-outline no-print" on:click={exportToCSV} title="Export as CSV">
          Export CSV
        </button>
        <button class="btn btn-outline no-print" on:click={() => window.print()} title="Print or save as PDF">
          Print / PDF
        </button>
      </div>
      <button class="btn btn-primary no-print" on:click={close}> Close </button>
    </div>
  </div>
</div>
