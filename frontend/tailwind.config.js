/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6fc',
          100: '#dcebf7',
          200: '#c0dbf0',
          300: '#94c3e4',
          400: '#61a4d4',
          500: '#3d88c1',
          600: '#2c6da3',
          700: '#265984',
          800: '#244c6e',
          900: '#22415c',
          950: '#172a3d',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(16 24 40 / 0.05), 0 1px 3px 0 rgb(16 24 40 / 0.06)',
      },
    },
  },
  plugins: [],
}
