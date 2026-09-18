/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'monospace'],
      },
      colors: {
        paper: {
          50: '#faf8f5',
          100: '#f5f1eb',
          200: '#ede4d8',
          300: '#decaba',
          400: '#cbb09d',
        },
        ink: {
          950: '#0f1115',
          900: '#171923',
          800: '#232733',
          700: '#343a46',
          600: '#4b5563',
          500: '#6b7280',
        },
        editorial: {
          red: '#b91c1c',
          accent: '#c2410c',
          gold: '#b45309',
        }
      },
      boxShadow: {
        'newspaper': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
