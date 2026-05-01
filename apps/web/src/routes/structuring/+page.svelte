<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import {
    MODEL_1_COST_PLUS,
    MODEL_2_LICENCE,
    MODEL_3_JOINT_DEVELOPMENT,
    MODEL_4_BOT,
    MODEL_5_SOFTWARE_SALE,
    MODEL_6_SAAS,
  } from '@model-pear/calculator';
  import { StructureWizard } from '$lib/components';
  import type { ModelId } from '$lib/config/wizard';

  // View mode: wizard or overview
  type ViewMode = 'wizard' | 'overview';
  let viewMode: ViewMode = 'wizard';

  // Model cards data
  const models = [
    {
      ...MODEL_1_COST_PLUS,
      id: 'model-1',
      bestFor: ['Development services', 'Custom software', 'Time & materials'],
      keyFeatures: ['Cost transparency', 'TP-safe margins', 'Immediate recognition'],
    },
    {
      ...MODEL_2_LICENCE,
      id: 'model-2',
      bestFor: ['Software products', 'IP licensing', 'Recurring revenue'],
      keyFeatures: ['Royalty streams', 'Perpetual or term', 'Usage-based options'],
    },
    {
      ...MODEL_3_JOINT_DEVELOPMENT,
      id: 'model-3',
      bestFor: ['R&D partnerships', 'Cost sharing', 'Joint ventures'],
      keyFeatures: ['Shared ownership', 'No intercompany profit', 'TP compliant'],
    },
    {
      ...MODEL_4_BOT,
      id: 'model-4',
      bestFor: ['IT outsourcing', 'System migrations', 'Asset transfers'],
      keyFeatures: ['Operating period', 'Deferred transfer', 'Performance-linked'],
    },
    {
      ...MODEL_5_SOFTWARE_SALE,
      id: 'model-5',
      bestFor: ['IP sale', 'Exit strategy', 'One-time deal'],
      keyFeatures: ['Full IP transfer', 'Upfront or deferred', 'Earnout options'],
    },
    {
      ...MODEL_6_SAAS,
      id: 'model-6',
      bestFor: ['Cloud services', 'Subscription model', 'Recurring revenue'],
      keyFeatures: ['Monthly billing', 'Per-user pricing', 'Usage-based'],
    },
  ];

  function selectModel(modelId: string) {
    goto(resolve('/structuring/[model]', { model: modelId }));
  }

  function handleWizardSelect(event: CustomEvent<{ modelId: ModelId; variantId?: string }>) {
    const { modelId } = event.detail;
    goto(resolve('/structuring/[model]', { model: modelId }));
  }

  function handleWizardSkip() {
    viewMode = 'overview';
  }
</script>

<svelte:head>
  <title>Transaction Structuring - Model Pear</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Page header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-base-content">Transaction Structuring</h1>
    <p class="text-base-content/70 mt-2">
      {viewMode === 'wizard'
        ? 'Answer a few questions to find the best transaction model for your situation.'
        : 'Choose a transaction model to analyze financial outcomes for both parties.'}
    </p>
  </div>

  <!-- View Mode Toggle — DaisyUI .tabs/.tab.tab-active -->
  <div role="tablist" class="tabs tabs-box justify-center mb-8 w-fit mx-auto">
    <button
      role="tab"
      type="button"
      aria-selected={viewMode === 'wizard'}
      class="tab {viewMode === 'wizard' ? 'tab-active' : ''}"
      on:click={() => (viewMode = 'wizard')}
    >
      <span class="mr-2">🧙</span>
      Guided Wizard
    </button>
    <button
      role="tab"
      type="button"
      aria-selected={viewMode === 'overview'}
      class="tab {viewMode === 'overview' ? 'tab-active' : ''}"
      on:click={() => (viewMode = 'overview')}
    >
      <span class="mr-2">📋</span>
      Browse All Models
    </button>
  </div>

  {#if viewMode === 'wizard'}
    <!-- Structure Wizard -->
    <div class="max-w-3xl mx-auto">
      <StructureWizard on:select={handleWizardSelect} on:skip={handleWizardSkip} />
    </div>
  {:else}
    <!-- Model Overview Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each models as model (model.id)}
        <button
          on:click={() => selectModel(model.id)}
          class="card p-6 text-left hover:border-primary/50 transition-all duration-200 group"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{model.icon}</span>
              <div>
                <h3 class="font-semibold text-base-content group-hover:text-primary transition-colors">
                  {model.shortName}
                </h3>
                <p class="text-xs text-base-content/70">{model.id.toUpperCase()}</p>
              </div>
            </div>
            <span class="badge badge-ghost badge-sm">
              {Object.keys(model.variants).length} variants
            </span>
          </div>

          <!-- Description -->
          <p class="text-sm text-base-content/70 mb-4">
            {model.description}
          </p>

          <!-- Best for -->
          <div class="mb-4">
            <p class="text-xs font-medium text-base-content/70 mb-2">Best for:</p>
            <div class="flex flex-wrap gap-1">
              {#each model.bestFor as tag (tag)}
                <span class="badge badge-primary badge-soft badge-sm">
                  {tag}
                </span>
              {/each}
            </div>
          </div>

          <!-- Key features -->
          <div class="mb-4">
            <p class="text-xs font-medium text-base-content/70 mb-2">Key features:</p>
            <ul class="text-xs text-base-content/70 space-y-1">
              {#each model.keyFeatures as feature (feature)}
                <li class="flex items-center">
                  <span class="text-success mr-2">✓</span>
                  {feature}
                </li>
              {/each}
            </ul>
          </div>

          <!-- CTA -->
          <div class="flex items-center justify-between pt-4 border-t border-base-300">
            <span class="text-xs text-base-content/70">
              {model.accountingSummary.developer.split('.')[0]}.
            </span>
            <span class="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
              Explore →
            </span>
          </div>
        </button>
      {/each}
    </div>

    <!-- Quick comparison table -->
    <div class="mt-12">
      <h2 class="text-xl font-semibold text-base-content mb-4">Quick Comparison</h2>
      <div class="overflow-x-auto">
        <table class="table table-zebra min-w-full">
          <thead>
            <tr>
              <th>Model</th>
              <th>IP Ownership</th>
              <th>Payment Type</th>
              <th>Risk Profile</th>
              <th>Variants</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-medium text-base-content">Cost-Plus</td>
              <td>Buyer</td>
              <td>Project-based</td>
              <td><span class="badge badge-success">Low</span></td>
              <td>6</td>
            </tr>
            <tr>
              <td class="font-medium text-base-content">Licence</td>
              <td>Developer</td>
              <td>Upfront / Royalty</td>
              <td><span class="badge badge-warning">Medium</span></td>
              <td>8</td>
            </tr>
            <tr>
              <td class="font-medium text-base-content">Joint Dev</td>
              <td>Shared</td>
              <td>Cost contribution</td>
              <td><span class="badge badge-success">Low</span></td>
              <td>8</td>
            </tr>
            <tr>
              <td class="font-medium text-base-content">BOT</td>
              <td>Developer → Buyer</td>
              <td>Fees + Transfer</td>
              <td><span class="badge badge-warning">Medium</span></td>
              <td>8</td>
            </tr>
            <tr>
              <td class="font-medium text-base-content">Sale</td>
              <td>Buyer</td>
              <td>Upfront / Earnout</td>
              <td><span class="badge badge-warning">Medium</span></td>
              <td>8</td>
            </tr>
            <tr>
              <td class="font-medium text-base-content">SaaS</td>
              <td>Developer</td>
              <td>Subscription</td>
              <td><span class="badge badge-success">Low</span></td>
              <td>9</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
