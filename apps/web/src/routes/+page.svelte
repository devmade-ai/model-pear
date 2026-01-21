<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Model Pear - Software Transaction Structuring Tool</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- Hero section -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-foreground mb-4">
      Software Transaction Structuring Tool
    </h1>
    <p class="text-xl text-secondary max-w-3xl mx-auto">
      Find the best deal structure for both you and your client.
      Analyse financial impact, tax efficiency, and long-term value across multiple transaction models.
    </p>
  </div>

  <!-- Mode selector -->
  <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    <!-- Mode 1: Pricing Calculator -->
    <a href="{base}/pricing" class="card-hover p-8 group">
      <div class="flex items-center space-x-4 mb-4">
        <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <span class="text-2xl">💰</span>
        </div>
        <h2 class="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
          Pricing Calculator
        </h2>
      </div>
      <p class="text-secondary mb-6">
        Find the price where you hit your margin AND your client sees clear ROI.
        Perfect for SaaS, per-seat, usage-based, and one-time pricing models.
      </p>
      <div class="flex items-center text-primary font-medium">
        Get started
        <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </a>

    <!-- Mode 2: Transaction Structuring -->
    <a href="{base}/structuring" class="card-hover p-8 group">
      <div class="flex items-center space-x-4 mb-4">
        <div class="w-12 h-12 bg-model-2/20 rounded-lg flex items-center justify-center">
          <span class="text-2xl">📊</span>
        </div>
        <h2 class="text-2xl font-semibold text-foreground group-hover:text-model-2 transition-colors">
          Transaction Structuring
        </h2>
      </div>
      <p class="text-secondary mb-6">
        Compare structures to find the best deal for both parties.
        Analyse 6 models across financial, tax, accounting, and compliance dimensions.
      </p>
      <div class="flex items-center text-model-2 font-medium">
        Explore models
        <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </a>
  </div>

  <!-- Features section -->
  <div class="mt-16">
    <h3 class="text-lg font-semibold text-foreground text-center mb-8">
      What the tool analyses
    </h3>
    <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
      <div class="text-center p-4">
        <div class="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <span>💵</span>
        </div>
        <p class="text-sm font-medium text-foreground">Financial Impact</p>
        <p class="text-xs text-secondary">Revenue, costs, profit</p>
      </div>
      <div class="text-center p-4">
        <div class="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <span>🏛️</span>
        </div>
        <p class="text-sm font-medium text-foreground">Tax Efficiency</p>
        <p class="text-xs text-secondary">SA tax optimisation</p>
      </div>
      <div class="text-center p-4">
        <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <span>📖</span>
        </div>
        <p class="text-sm font-medium text-foreground">Accounting</p>
        <p class="text-xs text-secondary">IFRS treatment</p>
      </div>
      <div class="text-center p-4">
        <div class="w-10 h-10 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <span>⚖️</span>
        </div>
        <p class="text-sm font-medium text-foreground">Compliance</p>
        <p class="text-xs text-secondary">Transfer pricing</p>
      </div>
      <div class="text-center p-4">
        <div class="w-10 h-10 bg-model-2/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <span>📈</span>
        </div>
        <p class="text-sm font-medium text-foreground">Long-term Value</p>
        <p class="text-xs text-secondary">NPV, IRR, payback</p>
      </div>
    </div>
  </div>
</div>
