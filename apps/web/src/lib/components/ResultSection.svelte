<script lang="ts">
  /**
   * ResultSection - A sub-section within a ResultPanel with a heading
   *
   * @prop title - Section heading
   * @prop colspan - Whether to span full width in grid (default: false)
   */
  export let title: string;
  export let colspan: boolean = false;
</script>

<div class={colspan ? 'sm:col-span-2' : ''}>
  <h3 class="text-sm font-medium text-base-content/70 mb-2">{title}</h3>
  <slot />
</div>
