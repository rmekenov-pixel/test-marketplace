/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284c7', // Sky-600
          hover: '#0369a1',
          dark: '#38bdf8',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a',
          elevatedLight: '#f8fafc',
          elevatedDark: '#1e293b',
        },
        border: {
          light: '#e2e8f0',
          dark: '#334155',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
