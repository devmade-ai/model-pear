<script lang="ts">
  /**
   * ComparisonManager - Panel for managing saved calculation options
   *
   * Shows list of saved options, allows selection for comparison,
   * rename, delete, and export/import functionality.
   */
  import {
    comparisonStore,
    savedOptions,
    selectedCount,
    canCompare,
    type SavedOption,
  } from '$lib/stores';
  import { formatCurrency } from '$lib/utils/formatters';

  export let onCompare: () => void = () => {};

  let isExpanded = true;
  let editingId: string | null = null;
  let editName = '';

  function startEdit(option: SavedOption) {
    editingId = option.id;
    editName = option.name;
  }

  function saveEdit() {
    if (editingId && editName.trim()) {
      comparisonStore.rename(editingId, editName.trim());
    }
    editingId = null;
    editName = '';
  }

  function cancelEdit() {
    editingId = null;
    editName = '';
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  function handleCompare() {
    comparisonStore.openComparison();
    onCompare();
  }

  function exportOptions() {
    const json = comparisonStore.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-pear-options-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importOptions() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const count = comparisonStore.importJSON(text);
        if (count > 0) {
          alert(`Imported ${count} option(s)`);
        } else {
          alert('No valid options found in file');
        }
      }
    };
    input.click();
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

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
</script>

<div class="card">
  <button
    class="w-full p-4 flex items-center justify-between text-left"
    on:click={() => (isExpanded = !isExpanded)}
  >
    <div class="flex items-center space-x-2">
      <span class="text-lg">📊</span>
      <h2 class="text-lg font-semibold text-base-content">Saved Options</h2>
      <span class="badge badge-primary">{$savedOptions.length}</span>
    </div>
    <span class="text-base-content/70">{isExpanded ? '▼' : '▶'}</span>
  </button>

  {#if isExpanded}
    <div class="border-t border-base-300 p-4">
      {#if $savedOptions.length === 0}
        <p class="text-sm text-base-content/70 text-center py-4">
          No saved options yet. Calculate a model and click "Save Option" to start comparing.
        </p>
      {:else}
        <!-- Selection info -->
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-base-content/70">
            {#if $selectedCount > 0}
              {$selectedCount} selected for comparison
            {:else}
              Select 2-4 options to compare
            {/if}
          </p>
          <div class="flex space-x-2">
            {#if $selectedCount > 0}
              <button
                class="btn btn-ghost btn-sm"
                on:click={() => comparisonStore.clearSelection()}
              >
                Clear
              </button>
            {/if}
            <button
              class="btn btn-primary text-sm py-1 px-3"
              disabled={!$canCompare}
              on:click={handleCompare}
            >
              Compare
            </button>
          </div>
        </div>

        <!-- Options list -->
        <div class="space-y-2 max-h-80 overflow-y-auto">
          {#each $savedOptions as option (option.id)}
            {@const isSelected = $comparisonStore.selectedIds.includes(option.id)}
            <div
              class="flex items-center p-3 rounded-lg border transition-colors {isSelected
                ? 'border-primary/50 bg-primary/10'
                : 'border-base-300 hover:border-base-300/80'}"
            >
              <!-- Checkbox -->
              <input
                type="checkbox"
                checked={isSelected}
                on:change={() => comparisonStore.toggleSelection(option.id)}
                class="checkbox checkbox-primary checkbox-sm mr-3"
              />

              <!-- Content -->
              <div class="flex-1 min-w-0">
                {#if editingId === option.id}
                  <input
                    type="text"
                    bind:value={editName}
                    on:keydown={handleKeydown}
                    on:blur={saveEdit}
                    class="input input-sm"
                  />
                {:else}
                  <button
                    class="font-medium text-base-content truncate block text-left w-full tooltip"
                    on:dblclick={() => startEdit(option)}
                    data-tip="Double-click to rename"
                  >
                    {option.name}
                  </button>
                {/if}
                <div class="flex items-center space-x-2 text-xs text-base-content/70 mt-0.5">
                  <span class="badge badge-primary badge-sm">{getModelLabel(option.modelId)}</span>
                  <span>{option.variantId}</span>
                  <span>•</span>
                  <span>{formatCurrency(option.result.developer.revenue.total)}</span>
                  <span>•</span>
                  <span>{formatDate(option.savedAt)}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-1 ml-2">
                <button
                  class="btn btn-ghost btn-sm btn-square tooltip"
                  data-tip="Rename"
                  aria-label="Rename"
                  on:click={() => startEdit(option)}
                >
                  ✏️
                </button>
                <button
                  class="btn btn-ghost btn-sm btn-square hover:text-error tooltip"
                  data-tip="Delete"
                  aria-label="Delete"
                  on:click={() => comparisonStore.delete(option.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          {/each}
        </div>

        <!-- Footer actions -->
        <div class="flex justify-between mt-4 pt-4 border-t border-base-300">
          <div class="flex space-x-2">
            <button class="btn btn-ghost btn-sm" on:click={exportOptions}>
              Export
            </button>
            <button class="btn btn-ghost btn-sm" on:click={importOptions}>
              Import
            </button>
          </div>
          <button
            class="btn btn-ghost btn-sm text-error hover:text-error"
            on:click={() => {
              if (confirm('Delete all saved options?')) {
                comparisonStore.clearAll();
              }
            }}
          >
            Clear All
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>
