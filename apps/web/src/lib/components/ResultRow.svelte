<script lang="ts">
  /**
   * ResultRow - A label-value pair for displaying results
   *
   * @prop label - The label text
   * @prop value - The value (can be string or number)
   * @prop format - Optional format type: 'currency' | 'percent' | 'text'
   * @prop valueClass - Optional CSS class for the value
   */
  import { formatCurrency, formatPercent } from '$lib/utils/formatters';

  export let label: string;
  export let value: string | number;
  export let format: 'currency' | 'percent' | 'text' = 'text';
  export let valueClass: string = 'font-medium text-base-content';

  function formatValue(val: string | number, fmt: string): string {
    if (typeof val === 'string') return val;
    switch (fmt) {
      case 'currency':
        return formatCurrency(val);
      case 'percent':
        return formatPercent(val);
      default:
        return String(val);
    }
  }
</script>

<div class="flex justify-between items-center py-1.5 px-2 rounded hover:bg-base-content/5">
  <span class="text-sm text-base-content/70">{label}</span>
  <span class={valueClass}>{formatValue(value, format)}</span>
</div>
