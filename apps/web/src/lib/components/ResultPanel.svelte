<script lang="ts">
  /**
   * ResultPanel - Container for a section of calculation results
   *
   * @prop icon - Emoji or icon to display
   * @prop title - Section title
   * @prop badge - Optional badge text
   * @prop badgeClass - Optional badge class (default: badge-primary)
   */
  export let icon: string = '';
  export let title: string;
  export let badge: string = '';
  export let badgeClass: string = 'badge-primary';
</script>

<div class="card bg-base-200 border border-base-300 p-6 space-y-4">
  <div class="flex items-center space-x-2 mb-4">
    {#if icon}
      <span class="text-xl">{icon}</span>
    {/if}
    <h2 class="text-lg font-semibold text-base-content">{title}</h2>
    {#if badge}
      <span class={badgeClass}>{badge}</span>
    {/if}
  </div>

  <slot />
</div>
