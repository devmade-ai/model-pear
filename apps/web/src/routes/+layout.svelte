<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';
</script>

<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="{base}/" class="flex items-center space-x-2">
            <span class="text-2xl">🍐</span>
            <span class="font-semibold text-xl text-gray-900">Model Pear</span>
          </a>
        </div>
        <div class="flex items-center space-x-4">
          <a href="{base}/structuring" class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
            Transaction Structuring
          </a>
          <a href="{base}/pricing" class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
            Pricing Calculator
          </a>
        </div>
      </div>
    </nav>
  </header>

  <!-- Main content -->
  <main class="flex-1">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex justify-between items-center">
        <p class="text-sm text-gray-500">
          Software Transaction Structuring Tool
        </p>
        <p class="text-sm text-gray-400">
          v2.0.0 - TypeScript + SvelteKit
        </p>
      </div>
    </div>
  </footer>
</div>
