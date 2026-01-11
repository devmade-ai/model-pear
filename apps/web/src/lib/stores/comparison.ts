/**
 * Comparison store for saving and comparing calculation options
 *
 * Uses Svelte stores with localStorage persistence.
 */

import { writable, derived, get } from 'svelte/store';
import type { CalculationResult } from '@model-pear/calculator';
import {
  type SavedOption,
  type ComparisonState,
  STORAGE_KEY,
  MAX_OPTIONS,
  MAX_COMPARISON,
  MIN_COMPARISON,
} from './comparison.types';

// Generate unique ID
function generateId(): string {
  return `opt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Load from localStorage
function loadFromStorage(): ComparisonState {
  if (typeof window === 'undefined') {
    return { options: [], selectedIds: [], isComparing: false };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        options: parsed.options || [],
        selectedIds: [],
        isComparing: false,
      };
    }
  } catch (e) {
    console.warn('Failed to load saved options:', e);
  }

  return { options: [], selectedIds: [], isComparing: false };
}

// Save to localStorage
function saveToStorage(options: SavedOption[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ options, version: 1 }));
  } catch (e) {
    console.warn('Failed to save options:', e);
  }
}

// Create the store
function createComparisonStore() {
  const { subscribe, set, update } = writable<ComparisonState>(loadFromStorage());

  return {
    subscribe,

    /**
     * Save a new option
     */
    save(
      name: string,
      modelId: string,
      variantId: string,
      inputs: Record<string, unknown>,
      result: CalculationResult,
      notes?: string
    ): string {
      const id = generateId();
      const option: SavedOption = {
        id,
        name,
        modelId,
        variantId,
        inputs,
        result,
        savedAt: new Date().toISOString(),
        notes,
      };

      update((state) => {
        // Enforce max limit
        let newOptions = [...state.options, option];
        if (newOptions.length > MAX_OPTIONS) {
          newOptions = newOptions.slice(-MAX_OPTIONS);
        }

        saveToStorage(newOptions);
        return { ...state, options: newOptions };
      });

      return id;
    },

    /**
     * Delete an option by ID
     */
    delete(id: string): void {
      update((state) => {
        const newOptions = state.options.filter((o) => o.id !== id);
        const newSelectedIds = state.selectedIds.filter((sid) => sid !== id);
        saveToStorage(newOptions);
        return { ...state, options: newOptions, selectedIds: newSelectedIds };
      });
    },

    /**
     * Rename an option
     */
    rename(id: string, newName: string): void {
      update((state) => {
        const newOptions = state.options.map((o) => (o.id === id ? { ...o, name: newName } : o));
        saveToStorage(newOptions);
        return { ...state, options: newOptions };
      });
    },

    /**
     * Update notes for an option
     */
    updateNotes(id: string, notes: string): void {
      update((state) => {
        const newOptions = state.options.map((o) => (o.id === id ? { ...o, notes } : o));
        saveToStorage(newOptions);
        return { ...state, options: newOptions };
      });
    },

    /**
     * Toggle selection for comparison
     */
    toggleSelection(id: string): void {
      update((state) => {
        const isSelected = state.selectedIds.includes(id);
        let newSelectedIds: string[];

        if (isSelected) {
          newSelectedIds = state.selectedIds.filter((sid) => sid !== id);
        } else if (state.selectedIds.length < MAX_COMPARISON) {
          newSelectedIds = [...state.selectedIds, id];
        } else {
          // At max, don't add
          return state;
        }

        return { ...state, selectedIds: newSelectedIds };
      });
    },

    /**
     * Clear all selections
     */
    clearSelection(): void {
      update((state) => ({ ...state, selectedIds: [], isComparing: false }));
    },

    /**
     * Open comparison view
     */
    openComparison(): void {
      update((state) => {
        if (state.selectedIds.length >= MIN_COMPARISON) {
          return { ...state, isComparing: true };
        }
        return state;
      });
    },

    /**
     * Close comparison view
     */
    closeComparison(): void {
      update((state) => ({ ...state, isComparing: false }));
    },

    /**
     * Get option by ID
     */
    getOption(id: string): SavedOption | undefined {
      return get({ subscribe }).options.find((o) => o.id === id);
    },

    /**
     * Export options as JSON
     */
    exportJSON(): string {
      const state = get({ subscribe });
      return JSON.stringify(state.options, null, 2);
    },

    /**
     * Import options from JSON
     */
    importJSON(json: string): number {
      try {
        const imported = JSON.parse(json) as SavedOption[];
        if (!Array.isArray(imported)) throw new Error('Invalid format');

        let count = 0;
        update((state) => {
          const existingIds = new Set(state.options.map((o) => o.id));
          const newOptions = [...state.options];

          for (const opt of imported) {
            if (opt.id && opt.name && opt.modelId && opt.result) {
              // Generate new ID if exists
              const newOpt = { ...opt, id: existingIds.has(opt.id) ? generateId() : opt.id };
              newOptions.push(newOpt);
              count++;
            }
          }

          // Enforce limit
          const trimmed = newOptions.slice(-MAX_OPTIONS);
          saveToStorage(trimmed);
          return { ...state, options: trimmed };
        });

        return count;
      } catch (e) {
        console.error('Failed to import:', e);
        return 0;
      }
    },

    /**
     * Clear all saved options
     */
    clearAll(): void {
      update((state) => {
        saveToStorage([]);
        return { options: [], selectedIds: [], isComparing: false };
      });
    },
  };
}

export const comparisonStore = createComparisonStore();

// Derived stores for convenience
export const savedOptions = derived(comparisonStore, ($store) => $store.options);
export const selectedOptions = derived(comparisonStore, ($store) =>
  $store.options.filter((o) => $store.selectedIds.includes(o.id))
);
export const selectedCount = derived(comparisonStore, ($store) => $store.selectedIds.length);
export const isComparing = derived(comparisonStore, ($store) => $store.isComparing);
export const canCompare = derived(
  comparisonStore,
  ($store) => $store.selectedIds.length >= MIN_COMPARISON
);
