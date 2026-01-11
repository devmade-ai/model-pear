<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Pricing Calculator - Model Pear</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- Back button -->
  <div class="mb-8">
    <a href="{base}/" class="inline-flex items-center text-gray-600 hover:text-gray-900">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to home
    </a>
  </div>

  <!-- Header -->
  <div class="text-center mb-12">
    <div class="flex items-center justify-center space-x-4 mb-4">
      <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
        <span class="text-3xl">💰</span>
      </div>
      <h1 class="text-4xl font-bold text-gray-900">
        Pricing Calculator
      </h1>
    </div>
    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
      Find the price where you hit your margin AND your client sees clear ROI.
      Perfect for SaaS, per-seat, usage-based, and one-time pricing models.
    </p>
  </div>

  <!-- Coming Soon Notice -->
  <div class="max-w-2xl mx-auto bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
    <h2 class="text-2xl font-semibold text-blue-900 mb-4">
      Pricing Calculator Coming Soon
    </h2>
    <p class="text-blue-800 mb-6">
      We're currently migrating the pricing calculator from the legacy version to the new SvelteKit application.
      In the meantime, you can explore our Transaction Structuring Tool.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="{base}/structuring"
        class="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
      >
        <span class="text-xl mr-2">📊</span>
        Explore Transaction Structuring
      </a>
      <a
        href="{base}/legacy/index.html"
        class="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        <span class="text-xl mr-2">🔙</span>
        Use Legacy Version
      </a>
    </div>
  </div>

  <!-- Planned Features -->
  <div class="mt-16">
    <h3 class="text-lg font-semibold text-gray-900 text-center mb-8">
      Planned Pricing Models
    </h3>
    <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
      <div class="text-center p-6 bg-white rounded-lg border border-gray-200">
        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-xl">🔄</span>
        </div>
        <p class="text-sm font-medium text-gray-900 mb-1">Subscription (SaaS)</p>
        <p class="text-xs text-gray-500">Monthly recurring revenue per customer</p>
      </div>
      <div class="text-center p-6 bg-white rounded-lg border border-gray-200">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-xl">📊</span>
        </div>
        <p class="text-sm font-medium text-gray-900 mb-1">Usage-Based</p>
        <p class="text-xs text-gray-500">Pay per unit (API calls, transactions)</p>
      </div>
      <div class="text-center p-6 bg-white rounded-lg border border-gray-200">
        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-xl">👥</span>
        </div>
        <p class="text-sm font-medium text-gray-900 mb-1">Per-Seat</p>
        <p class="text-xs text-gray-500">Price per active user/seat</p>
      </div>
      <div class="text-center p-6 bg-white rounded-lg border border-gray-200">
        <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-xl">💵</span>
        </div>
        <p class="text-sm font-medium text-gray-900 mb-1">One-Time Purchase</p>
        <p class="text-xs text-gray-500">Upfront license + optional maintenance</p>
      </div>
      <div class="text-center p-6 bg-white rounded-lg border border-gray-200">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-xl">🛒</span>
        </div>
        <p class="text-sm font-medium text-gray-900 mb-1">Marketplace</p>
        <p class="text-xs text-gray-500">Commission on transactions</p>
      </div>
    </div>
  </div>
</div>
