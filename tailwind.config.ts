import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        palm: {
          50: '#faf8f3',
          100: '#f5e6d3',
          200: '#e8d4b8',
          300: '#d9ba94',
          400: '#c89960',
          500: '#b8873f',
          600: '#a0722d',
          700: '#7f5620',
          800: '#66461a',
          900: '#4d3513',
        },
      },
    },
  },
  plugins: [],
}
export default config
