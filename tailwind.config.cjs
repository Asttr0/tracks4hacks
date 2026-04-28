/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
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
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      }
    }
  },
  plugins: []
}
