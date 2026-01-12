<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';

  let mobileMenuOpen = false;

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="{base}/" class="flex items-center space-x-2" on:click={closeMobileMenu}>
            <span class="text-2xl">🍐</span>
            <span class="font-semibold text-xl text-gray-900">Model Pear</span>
          </a>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden sm:flex items-center space-x-4">
          <a href="{base}/structuring" class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
            Transaction Structuring
          </a>
          <a href="{base}/pricing" class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
            Pricing Calculator
          </a>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={mobileMenuOpen}
            on:click={toggleMobileMenu}
          >
            <span class="sr-only">Open main menu</span>
            {#if mobileMenuOpen}
              <!-- Close icon -->
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            {:else}
              <!-- Hamburger icon -->
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <!-- Mobile navigation menu -->
      {#if mobileMenuOpen}
        <div class="sm:hidden border-t border-gray-200">
          <div class="py-2 space-y-1">
            <a
              href="{base}/structuring"
              class="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              on:click={closeMobileMenu}
            >
              Transaction Structuring
            </a>
            <a
              href="{base}/pricing"
              class="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              on:click={closeMobileMenu}
            >
              Pricing Calculator
            </a>
          </div>
        </div>
      {/if}
    </nav>
  </header>

  <!-- Main content -->
  <main class="flex-1">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-2">
        <p class="text-sm text-gray-500 text-center sm:text-left">
          Software Transaction Structuring Tool
        </p>
        <p class="text-sm text-gray-400">
          v2.0.0 - TypeScript + SvelteKit
        </p>
      </div>
    </div>
  </footer>
</div>
