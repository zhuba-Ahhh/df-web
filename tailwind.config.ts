/** @type {import('tailwindcss').Config} */

import type { Config } from 'tailwindcss';
const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        '--bgColor': '#F6F8FA',
        '--modBgColor': '#ffffff',
      },
    },
  },
  darkMode: 'class',
  plugins: [require('daisyui')],
} satisfies Config;

export default config;
