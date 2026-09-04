/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gh: {
          'canvas-default': '#0d1117',
          'canvas-subtle': '#161b22',
          'canvas-overlay': '#161b22',
          'canvas-inset': '#010409',
          'border-default': '#30363d',
          'border-muted': '#21262d',
          'fg-default': '#f0f6fc',
          'fg-muted': '#8d96a0',
          'fg-subtle': '#6e7681',
          'accent-fg': '#2f81f7',
          'accent-hover': '#58a6ff',
          'btn-primary-bg': '#238636',
          'btn-primary-hover': '#2ea043',
          'btn-primary-border': '#2ea043',
          'btn-secondary-bg': '#21262d',
          'btn-secondary-hover': '#30363d',
          'btn-secondary-border': '#30363d',
        },
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '6px',
        xl: '6px',
        '2xl': '6px',
        '3xl': '6px',
        full: '9999px',
      },
      boxShadow: {
        'gh': '0 1px 3px rgba(0, 0, 0, 0.4)',
        'gh-sm': '0 1px 0 rgba(240, 246, 252, 0.04)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'SF Mono',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}
