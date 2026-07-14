/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Cairo', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        'cosmic-blue': '#071A3D',
        'aurora-cyan': '#27D3FF',
        'sunrise-orange': '#FF9E45',
        'warm-gold': '#FFD76A',
        'pure-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
};
