/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Model colors (matching legacy app)
        'model-1': '#3B82F6', // Blue - Cost-Plus
        'model-2': '#8B5CF6', // Purple - Licence
        'model-3': '#10B981', // Green - Joint Development
        'model-4': '#F59E0B', // Amber - BOT
        'model-5': '#EF4444', // Red - Software Sale
        'model-6': '#06B6D4', // Cyan - SaaS
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
