/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'coffee-bean': {
          50: '#f5f0f0', 100: '#ebe2e0', 200: '#d6c4c2', 300: '#c2a7a3',
          400: '#ad8985', 500: '#996c66', 600: '#7a5652', 700: '#5c413d',
          800: '#3d2b29', 900: '#1f1614', 950: '#150f0e'
        },
        'night-bordeaux': {
          50: '#f9ebeb', 100: '#f3d8d8', 200: '#e8b0b0', 300: '#dc8989',
          400: '#d06262', 500: '#c43b3b', 600: '#9d2f2f', 700: '#762323',
          800: '#4f1717', 900: '#270c0c', 950: '#1b0808'
        },
        'ink-black': {
          50: '#f0f1f5', 100: '#e1e3ea', 200: '#c2c8d6', 300: '#a4acc1',
          400: '#8691ac', 500: '#677598', 600: '#535e79', 700: '#3e465b',
          800: '#292f3d', 900: '#15171e', 950: '#0e1015'
        },
        'pitch-black': {
          50: '#f4f1f1', 100: '#e9e4e2', 200: '#d3c8c5', 300: '#bcada9',
          400: '#a6918c', 500: '#90766f', 600: '#735e59', 700: '#564743',
          800: '#3a2f2c', 900: '#1d1816', 950: '#141010'
        },
        'terracotta-clay': {
          50: '#f6eeef', 100: '#eddedf', 200: '#dbbdbe', 300: '#c99c9e',
          400: '#b87a7d', 500: '#a6595d', 600: '#85474a', 700: '#633638',
          800: '#422425', 900: '#211213', 950: '#170c0d'
        },
        soc: {
          bg: '#0a0e1a',
          panel: '#111827',
          border: '#1f2937',
          ink: '#e5e7eb',
          muted: '#6b7280',
          red: '#ef4444',
          blue: '#3b82f6',
          purple: '#a855f7',
          green: '#22c55e',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      }
    }
  },
  plugins: []
}
