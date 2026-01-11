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

  const dispatch = createEventDispatcher();

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const newValue = type === 'number' ? Number(target.value) : target.value;
    dispatch('change', { field: id, value: newValue });
  }
</script>

<div>
  <label for={id} class="block text-sm font-medium text-gray-700 mb-1">
    {label}
  </label>

  {#if type === 'select'}
    <select {id} {value} on:change={handleInput} class="input">
      {#each options as opt}
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
    <p class="text-xs text-gray-500 mt-1">{hint}</p>
  {/if}
</div>
