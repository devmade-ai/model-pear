/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CSS variable based colors for dark theme
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          dark: '#121213',
          light: '#2a2a2a',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          dark: '#333333',
          light: '#222222',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        // Semantic colors
        success: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
        },
        error: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#EAB308',
          foreground: '#000000',
        },
        // Model colors (for transaction model identification)
        'model-1': '#3B82F6', // Blue - Cost-Plus
        'model-2': '#8B5CF6', // Purple - Licence
        'model-3': '#10B981', // Green - Joint Development
        'model-4': '#F59E0B', // Amber - BOT
        'model-5': '#EF4444', // Red - Software Sale
        'model-6': '#06B6D4', // Cyan - SaaS
      },
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontSize: {
        // Custom typography scale
        'h1': ['60px', { lineHeight: '72px', letterSpacing: '2.5px', fontWeight: '500' }],
        'h2': ['48px', { lineHeight: '64px', letterSpacing: '2.5px', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '32px', letterSpacing: '2.5px', fontWeight: '500' }],
        'h4': ['20px', { lineHeight: '32px', letterSpacing: '1.5px', fontWeight: '600' }],
        'h5': ['28px', { lineHeight: '40px', letterSpacing: '1px', fontWeight: '500' }],
        'h6': ['14px', { lineHeight: '24px', fontWeight: '600' }],
      },
      spacing: {
        // Ensure 8px base unit spacing is available
        '18': '4.5rem', // 72px for XL icons
      },
      // Z-index scale (glow-props standard): 0-10 base, 20 sticky, 30 sheets,
      // 40 backdrop, 50 menu, 60 modal, 70 toast, 80 debug.
      // Tailwind defaults cover 0-50; extend for 60+ to avoid arbitrary values.
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
      },
    },
  },
  plugins: [],
};
