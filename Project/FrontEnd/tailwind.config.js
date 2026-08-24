/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        taru: {
          bg: '#faf8f5',
          sand: '#f4f0e6',
          'sand-light': '#fbf9f5',
          'sand-dark': '#e9e2d3',
          border: '#e4dcce',
          dark: '#1a3328',
          'dark-hover': '#13271e',
          green: '#2d5341',
          'green-light': '#e8f0eb',
          accent: '#b85d19',
          'accent-hover': '#9e4e13',
          amber: '#d97706',
          'amber-light': '#fef3c7',
          terracotta: '#c25e36',
          charcoal: '#1e293b',
          muted: '#64748b',
          light: '#ffffff',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
