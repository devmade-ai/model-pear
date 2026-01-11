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
    <h1 class="text-3xl font-bold text-gray-900">Transaction Structuring</h1>
    <p class="text-gray-600 mt-2">
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
        ? 'bg-blue-100 text-blue-700 border border-blue-200'
        : 'text-gray-600 hover:bg-gray-100'}"
      on:click={() => (viewMode = 'wizard')}
    >
      <span class="mr-2">🧙</span>
      Guided Wizard
    </button>
    <button
      class="px-4 py-2 rounded-lg text-sm font-medium transition-colors
             {viewMode === 'overview'
        ? 'bg-blue-100 text-blue-700 border border-blue-200'
        : 'text-gray-600 hover:bg-gray-100'}"
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
          class="card p-6 text-left hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{model.icon}</span>
              <div>
                <h3 class="font-semibold text-gray-900 group-hover:text-blue-600">
                  {model.shortName}
                </h3>
                <p class="text-xs text-gray-500">{model.id.toUpperCase()}</p>
              </div>
            </div>
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {Object.keys(model.variants).length} variants
            </span>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4">
            {model.description}
          </p>

          <!-- Best for -->
          <div class="mb-4">
            <p class="text-xs font-medium text-gray-500 mb-2">Best for:</p>
            <div class="flex flex-wrap gap-1">
              {#each model.bestFor as tag}
                <span class="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {tag}
                </span>
              {/each}
            </div>
          </div>

          <!-- Key features -->
          <div class="mb-4">
            <p class="text-xs font-medium text-gray-500 mb-2">Key features:</p>
            <ul class="text-xs text-gray-600 space-y-1">
              {#each model.keyFeatures as feature}
                <li class="flex items-center">
                  <span class="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              {/each}
            </ul>
          </div>

          <!-- CTA -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <span class="text-xs text-gray-500">
              {model.accountingSummary.developer.split('.')[0]}.
            </span>
            <span class="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Explore →
            </span>
          </div>
        </button>
      {/each}
    </div>

    <!-- Quick comparison table -->
    <div class="mt-12">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Comparison</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Ownership</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Profile</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">Cost-Plus</td>
              <td class="px-4 py-3 text-sm text-gray-600">Buyer</td>
              <td class="px-4 py-3 text-sm text-gray-600">Project-based</td>
              <td class="px-4 py-3"><span class="badge-green">Low</span></td>
              <td class="px-4 py-3 text-sm text-gray-600">6</td>
            </tr>
            <tr>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">Licence</td>
              <td class="px-4 py-3 text-sm text-gray-600">Developer</td>
              <td class="px-4 py-3 text-sm text-gray-600">Upfront / Royalty</td>
              <td class="px-4 py-3"><span class="badge-amber">Medium</span></td>
              <td class="px-4 py-3 text-sm text-gray-600">8</td>
            </tr>
            <tr>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">Joint Dev</td>
              <td class="px-4 py-3 text-sm text-gray-600">Shared</td>
              <td class="px-4 py-3 text-sm text-gray-600">Cost contribution</td>
              <td class="px-4 py-3"><span class="badge-green">Low</span></td>
              <td class="px-4 py-3 text-sm text-gray-600">8</td>
            </tr>
            <tr>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">BOT</td>
              <td class="px-4 py-3 text-sm text-gray-600">Developer → Buyer</td>
              <td class="px-4 py-3 text-sm text-gray-600">Fees + Transfer</td>
              <td class="px-4 py-3"><span class="badge-amber">Medium</span></td>
              <td class="px-4 py-3 text-sm text-gray-600">8</td>
            </tr>
            <tr>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">Sale</td>
              <td class="px-4 py-3 text-sm text-gray-600">Buyer</td>
              <td class="px-4 py-3 text-sm text-gray-600">Upfront / Earnout</td>
              <td class="px-4 py-3"><span class="badge-amber">Medium</span></td>
              <td class="px-4 py-3 text-sm text-gray-600">8</td>
            </tr>
            <tr>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">SaaS</td>
              <td class="px-4 py-3 text-sm text-gray-600">Developer</td>
              <td class="px-4 py-3 text-sm text-gray-600">Subscription</td>
              <td class="px-4 py-3"><span class="badge-green">Low</span></td>
              <td class="px-4 py-3 text-sm text-gray-600">9</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
