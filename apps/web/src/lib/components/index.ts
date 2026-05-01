/**
 * Component library for Model Pear
 */

// Base components
//
// ResultPanel/ResultRow/ResultSection are intentionally NOT barrel-exported:
// only neighbouring components in this folder consume them, and they import
// the .svelte files directly. Re-exporting via the barrel widened the public
// surface for no caller — removed during the `clean` sweep.
export { default as InputField } from './InputField.svelte';

// Perspective result components
export { default as DeveloperResults } from './DeveloperResults.svelte';
export { default as BuyerResults } from './BuyerResults.svelte';
export { default as TransferPricingResults } from './TransferPricingResults.svelte';

// Comparison components
export { default as ComparisonManager } from './ComparisonManager.svelte';
export { default as ComparisonView } from './ComparisonView.svelte';

// Analysis components
//
// ProjectionMetrics is consumed only by ProjectionsPanel via a direct
// `./ProjectionMetrics.svelte` import — not surfaced through the barrel.
export { default as SensitivityPanel } from './SensitivityPanel.svelte';
export { default as ProjectionsPanel } from './ProjectionsPanel.svelte';

// Wizard components
export { default as StructureWizard } from './StructureWizard.svelte';

// Chart components (re-export from charts folder)
export * from './charts';
