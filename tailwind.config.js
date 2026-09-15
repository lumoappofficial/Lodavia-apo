/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',   // Tablet: 768px – 1023px
      'lg': '1024px',  // Desktop: 1024px+
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Inter', 'Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#0EA5E9',
          hover: '#0284C7',
          dark: '#38BDF8',
        },
        secondary: {
          DEFAULT: '#1D4ED8',
          hover: '#1E40AF',
        },
        accent: {
          DEFAULT: '#2563EB',
          gold: '#D9B968',
        },
        gold: {
          DEFAULT: '#D9B968',
          hover: '#C9A24B',
          light: '#FDE68A',
        },
        // Core branding colors
        'warm-bg': '#F8FAFC',
        surface: '#FFFFFF',
        'border-gray': '#E2E8F0',
        'text-main': '#0F172A',
        'text-sub': '#475569',
        'text-mute': '#64748B',
        'cosmic-blue': '#0EA5E9',
        'electric-blue': '#1D4ED8',
        'aurora-cyan': '#06B6D4',
        'warm-gold': '#D9B968',
        'pure-white': '#FFFFFF',

        // Linear & Vercel-grade Dark Mode Elevation System
        'dark-bg': '#070B14',          // Level 0: Deepest canvas background
        'dark-surface-1': '#0D1527',   // Level 1: Primary cards & base panels
        'dark-surface-2': '#131F37',   // Level 2: Nested cards, popovers, modals
        'dark-surface-3': '#1A2B4C',   // Level 3: Active states & interactive hover surfaces

        // Elevation aliases
        elevation: {
          0: '#070B14',
          1: '#0D1527',
          2: '#131F37',
          3: '#1A2B4C',
        },

        // Backward-compatible core aliases mapped to new refined elevations
        'lodavia-navy': '#070B14',     // Deep canvas background (was #0B1220)
        'lodavia-surface': '#0D1527',  // Level 1 base surface (was #0E172A)
        'lodavia-elevated': '#131F37', // Level 2 modal surface (was #152238)
        'lodavia-active': '#1A2B4C',   // Level 3 active/hover surface
        'lodavia-muted': '#64748B',
        'lodavia-card': '#FFFFFF',

        // Refined Dark Mode Text Contrast Tokens (WCAG AA & AAA compliant)
        'dark-text': {
          primary: '#F8FAFC',          // 98% brightness crisp primary text
          secondary: '#94A3B8',        // Refined legible secondary text (replaces dim grays)
          muted: '#64748B',            // Subdued metadata & timestamps
        },

        // Translucent Glass Border System for Dark Mode
        'dark-border': {
          DEFAULT: 'rgba(255, 255, 255, 0.07)',  // Ultra-subtle translucent glass border
          subtle: 'rgba(255, 255, 255, 0.05)',
          elevated: 'rgba(255, 255, 255, 0.10)',
          hover: 'rgba(255, 255, 255, 0.15)',
          accent: 'rgba(56, 189, 248, 0.35)',   // Electric sky accent border on focus/active
        },
        'lodavia-sky': {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
        'lodavia-cyan': {
          50: '#ECFEFF',
          100: '#CFFAFE',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
        },
      },
      boxShadow: {
        // Soft Glow Shadows strictly for Accent Buttons & Active states
        'accent-glow': '0 2px 14px rgba(14, 165, 233, 0.35), 0 0 24px -4px rgba(56, 189, 248, 0.25)',
        'accent-glow-hover': '0 4px 20px rgba(14, 165, 233, 0.45), 0 0 30px -2px rgba(56, 189, 248, 0.35)',
        'cyan-glow': '0 0 20px -3px rgba(6, 182, 212, 0.35), 0 2px 10px rgba(6, 182, 212, 0.2)',
        'gold-glow': '0 2px 14px rgba(217, 185, 104, 0.35), 0 0 20px -4px rgba(217, 185, 104, 0.25)',

        // Linear/Vercel Depth Elevation Shadows with 1px translucent border highlight
        'dark-elevation-1': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'dark-elevation-2': '0 8px 32px -4px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'dark-elevation-3': '0 16px 48px -6px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.12)',
      },
      backgroundImage: {
        // Subtle Gradients for large dark mode backgrounds and cards
        'dark-canvas': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.07), transparent 100%), linear-gradient(180deg, #0D1527 0%, #070B14 100%)',
        'dark-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.025) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(180deg, #0F182E 0%, #0D1527 100%)',
        'dark-elevated': 'linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(180deg, #162440 0%, #131F37 100%)',
        'dark-active': 'linear-gradient(180deg, #1E3156 0%, #1A2B4C 100%)',
      },
      // Strict Unified Design System Spacing Scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
      spacing: {
        '3xs': '4px',    // 4px
        '2xs': '8px',    // 8px
        'xs': '12px',    // 12px
        'sm': '16px',    // 16px
        'md': '24px',    // 24px
        'lg': '32px',    // 32px
        'xl': '48px',    // 48px
        '2xl': '64px',   // 64px
      },
      // Responsive Fluid Typography Scale
      fontSize: {
        'display': ['clamp(2rem, 5vw, 3.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1': ['clamp(1.75rem, 3.5vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h2': ['clamp(1.35rem, 2.5vw, 1.75rem)', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['clamp(1.125rem, 1.8vw, 1.35rem)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['clamp(1rem, 1.4vw, 1.125rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'overline': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      // Uniform Card Geometry Tokens
      borderRadius: {
        'card': '16px',         // Standard Uniform Card Border Radius (rounded-2xl equivalent)
        'card-sm': '12px',      // Compact/Nested Card Radius (rounded-xl equivalent)
        'card-lg': '20px',      // Featured/Modal Outer Border Radius
      },
    },
  },
  plugins: [],
};

