<script lang="ts">
  /**
   * InputField - Reusable form input component
   *
   * @prop id - Field ID (also used as name)
   * @prop label - Label text
   * @prop value - Current value (bind this)
   * @prop type - Input type: 'text' | 'number' | 'select'
   * @prop options - For select type, array of {value, label}
   * @prop min - For number type, minimum value
   * @prop max - For number type, maximum value
   * @prop step - For number type, step value
   * @prop hint - Optional hint text below input
   * @prop benchmark - Industry standard label (displayed as badge)
   */
  import { createEventDispatcher } from 'svelte';

  export let id: string;
  export let label: string;
  export let value: string | number;
  export let type: 'text' | 'number' | 'select' = 'text';
  export let options: Array<{ value: string; label: string }> = [];
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let step: number | undefined = undefined;
  export let hint: string = '';
  export let benchmark: string = '';

  const dispatch = createEventDispatcher<{ change: { field: string; value: string | number } }>();

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const newValue = type === 'number' ? Number(target.value) : target.value;
    dispatch('change', { field: id, value: newValue });
  }
</script>

<div>
  <div class="flex items-center justify-between mb-1">
    <label for={id} class="block text-sm font-medium text-base-content/80">
      {label}
    </label>
    {#if benchmark}
      <span class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
        {benchmark}
      </span>
    {/if}
  </div>

  {#if type === 'select'}
    <select {id} {value} on:change={handleInput} class="input">
      {#each options as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  {:else if type === 'number'}
    <input
      {id}
      type="number"
      {value}
      {min}
      {max}
      {step}
      on:input={handleInput}
      class="input tabular-nums"
    />
  {:else}
    <input {id} type="text" {value} on:input={handleInput} class="input" />
  {/if}

  {#if hint}
    <p class="text-xs text-base-content/70 mt-1">{hint}</p>
  {/if}
</div>
