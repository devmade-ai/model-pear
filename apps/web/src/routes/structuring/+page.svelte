<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
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
      id: 'model-1',
      ...MODEL_1_COST_PLUS,
      bestFor: ['Development services', 'Custom software', 'Time & materials'],
      keyFeatures: ['Cost transparency', 'TP-safe margins', 'Immediate recognition'],
    },
    {
      id: 'model-2',
      ...MODEL_2_LICENCE,
      bestFor: ['Software products', 'IP licensing', 'Recurring revenue'],
      keyFeatures: ['Royalty streams', 'Perpetual or term', 'Usage-based options'],
    },
    {
      id: 'model-3',
      ...MODEL_3_JOINT_DEVELOPMENT,
      bestFor: ['R&D partnerships', 'Cost sharing', 'Joint ventures'],
      keyFeatures: ['Shared ownership', 'No intercompany profit', 'TP compliant'],
    },
    {
      id: 'model-4',
      ...MODEL_4_BOT,
      bestFor: ['IT outsourcing', 'System migrations', 'Asset transfers'],
      keyFeatures: ['Operating period', 'Deferred transfer', 'Performance-linked'],
    },
    {
      id: 'model-5',
      ...MODEL_5_SOFTWARE_SALE,
      bestFor: ['IP sale', 'Exit strategy', 'One-time deal'],
      keyFeatures: ['Full IP transfer', 'Upfront or deferred', 'Earnout options'],
    },
    {
      id: 'model-6',
      ...MODEL_6_SAAS,
      bestFor: ['Cloud services', 'Subscription model', 'Recurring revenue'],
      keyFeatures: ['Monthly billing', 'Per-user pricing', 'Usage-based'],
    },
  ];

  function selectModel(modelId: string) {
    goto(`${base}/structuring/${modelId}`);
  }

  function handleWizardSelect(event: CustomEvent<{ modelId: ModelId; variantId?: string }>) {
    const { modelId } = event.detail;
    goto(`${base}/structuring/${modelId}`);
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
    <h1 class="text-3xl font-bold text-foreground">Transaction Structuring</h1>
    <p class="text-secondary mt-2">
      {viewMode === 'wizard'
        ? 'Answer a few questions to find the best transaction model for your situation.'
        : 'Choose a transaction model to analyze financial outcomes for both parties.'}
    </p>
  </div>

  <!-- View Mode Toggle -->
  <div class="flex items-center justify-center gap-4 mb-8">
    <button
      class="px-4 py-2 rounded-lg text-sm font-medium transition-colors
             {viewMode === 'wizard'
        ? 'bg-primary/20 text-primary border border-primary/30'
        : 'text-secondary hover:bg-card'}"
      on:click={() => (viewMode = 'wizard')}
    >
      <span class="mr-2">🧙</span>
      Guided Wizard
    </button>
    <button
      class="px-4 py-2 rounded-lg text-sm font-medium transition-colors
             {viewMode === 'overview'
        ? 'bg-primary/20 text-primary border border-primary/30'
        : 'text-secondary hover:bg-card'}"
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
      {#each models as model}
        <button
          on:click={() => selectModel(model.id)}
          class="card p-6 text-left hover:border-primary/50 transition-all duration-200 group"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{model.icon}</span>
              <div>
                <h3 class="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {model.shortName}
                </h3>
                <p class="text-xs text-secondary">{model.id.toUpperCase()}</p>
              </div>
            </div>
            <span class="text-xs px-2 py-1 rounded-full bg-secondary-light text-secondary">
              {Object.keys(model.variants).length} variants
            </span>
          </div>

          <!-- Description -->
          <p class="text-sm text-secondary mb-4">
            {model.description}
          </p>

          <!-- Best for -->
          <div class="mb-4">
            <p class="text-xs font-medium text-secondary mb-2">Best for:</p>
            <div class="flex flex-wrap gap-1">
              {#each model.bestFor as tag}
                <span class="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {tag}
                </span>
              {/each}
            </div>
          </div>

          <!-- Key features -->
          <div class="mb-4">
            <p class="text-xs font-medium text-secondary mb-2">Key features:</p>
            <ul class="text-xs text-secondary space-y-1">
              {#each model.keyFeatures as feature}
                <li class="flex items-center">
                  <span class="text-success mr-2">✓</span>
                  {feature}
                </li>
              {/each}
            </ul>
          </div>

          <!-- CTA -->
          <div class="flex items-center justify-between pt-4 border-t border-border">
            <span class="text-xs text-secondary">
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
      <h2 class="text-xl font-semibold text-foreground mb-4">Quick Comparison</h2>
      <div class="overflow-x-auto">
        <table class="table-dark min-w-full border border-border rounded-lg overflow-hidden">
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
              <td class="font-medium text-foreground">Cost-Plus</td>
              <td>Buyer</td>
              <td>Project-based</td>
              <td><span class="badge-success">Low</span></td>
              <td>6</td>
            </tr>
            <tr>
              <td class="font-medium text-foreground">Licence</td>
              <td>Developer</td>
              <td>Upfront / Royalty</td>
              <td><span class="badge-warning">Medium</span></td>
              <td>8</td>
            </tr>
            <tr>
              <td class="font-medium text-foreground">Joint Dev</td>
              <td>Shared</td>
              <td>Cost contribution</td>
              <td><span class="badge-success">Low</span></td>
              <td>8</td>
            </tr>
            <tr>
              <td class="font-medium text-foreground">BOT</td>
              <td>Developer → Buyer</td>
              <td>Fees + Transfer</td>
              <td><span class="badge-warning">Medium</span></td>
              <td>8</td>
            </tr>
            <tr>
              <td class="font-medium text-foreground">Sale</td>
              <td>Buyer</td>
              <td>Upfront / Earnout</td>
              <td><span class="badge-warning">Medium</span></td>
              <td>8</td>
            </tr>
            <tr>
              <td class="font-medium text-foreground">SaaS</td>
              <td>Developer</td>
              <td>Subscription</td>
              <td><span class="badge-success">Low</span></td>
              <td>9</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
