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
        // --- Brand core (unchanged, kept for backward compatibility) ---
        'cosmic-blue': '#071A3D',
        'aurora-cyan': '#27D3FF',
        'sunrise-orange': '#FF9E45',
        'warm-gold': '#FFD76A',
        'pure-white': '#FFFFFF',

        // --- Void scale: tinted near-blacks (navy/violet tint, never neutral gray) ---
        // Use these INSTEAD of slate-950 / bg-[#0a0a0f] / bg-[#07070a] etc.
        'void-950': '#080A16',
        'void-900': '#0D1026',
        'void-800': '#141936',
        'void-700': '#1C2247',
        'void-600': '#2A3160',

        // --- Nova: primary vivid accent (electric violet) ---
        'nova-400': '#B084FF',
        'nova-500': '#9350FF',
        'nova-600': '#7C2CF0',

        // --- Aurora: secondary accent (electric cyan) ---
        'aurora-400': '#5CE6FF',
        'aurora-500': '#27D3FF',
        'aurora-600': '#00AEEA',

        // --- Comet: tertiary accent (hot pink, sparingly for live/highlights) ---
        'comet-400': '#FF66B8',
        'comet-500': '#FF3D9A',
        'comet-600': '#E8177A',

        // --- Ember: warm CTA accent (matches existing brand) ---
        'ember-400': '#FFB25E',
        'ember-500': '#FF9E45',
        'ember-600': '#FFD76A',
      },
      backgroundImage: {
        'gradient-nova': 'linear-gradient(135deg, #9350FF 0%, #27D3FF 100%)',
        'gradient-ember': 'linear-gradient(135deg, #FF9E45 0%, #FFD76A 100%)',
        'gradient-comet': 'linear-gradient(135deg, #FF3D9A 0%, #9350FF 100%)',
        'gradient-void': 'radial-gradient(circle at 50% 0%, #1C2247 0%, #0D1026 55%, #080A16 100%)',
      },
      boxShadow: {
        'glow-nova': '0 0 24px rgba(147,80,255,0.45)',
        'glow-aurora': '0 0 24px rgba(39,211,255,0.45)',
        'glow-comet': '0 0 24px rgba(255,61,154,0.4)',
        'glow-ember': '0 0 24px rgba(255,158,69,0.4)',
      },
    },
  },
  plugins: [],
};
