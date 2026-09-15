/**
 * Linear, Vercel & Stripe-Grade Dark Mode Tokens
 */
export const darkThemeTokens = {
  elevation: {
    bg: '#070B14',          // Level 0: Deepest canvas background
    surface1: '#0D1527',    // Level 1: Primary cards & base panels
    surface2: '#131F37',    // Level 2: Nested cards, popovers, modals
    surface3: '#1A2B4C',    // Level 3: Active states & interactive hover surfaces
  },
  borders: {
    subtle: 'rgba(255, 255, 255, 0.07)',   // Ultra-subtle translucent glass border
    elevated: 'rgba(255, 255, 255, 0.10)',  // Modal & popover border
    hover: 'rgba(255, 255, 255, 0.15)',     // Interactive hover border
    accentGlow: 'rgba(56, 189, 248, 0.35)', // Electric sky accent focus border
  },
  typography: {
    primary: '#F8FAFC',    // 98% brightness high-contrast primary text
    secondary: '#94A3B8',  // Refined legible secondary text (WCAG AA compliant)
    muted: '#64748B',      // Subdued metadata & timestamps
  },
  glows: {
    accentButton: '0 2px 14px rgba(14, 165, 233, 0.35), 0 0 24px -4px rgba(56, 189, 248, 0.25)',
    accentButtonHover: '0 4px 20px rgba(14, 165, 233, 0.45), 0 0 30px -2px rgba(56, 189, 248, 0.35)',
    cardElevation1: '0 4px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
    cardElevation2: '0 8px 32px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)',
  },
  gradients: {
    canvas: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.07), transparent 100%), linear-gradient(180deg, #0D1527 0%, #070B14 100%)',
    surface1: 'linear-gradient(180deg, #0F182E 0%, #0D1527 100%)',
    surface2: 'linear-gradient(180deg, #162440 0%, #131F37 100%)',
    surface3: 'linear-gradient(180deg, #1E3156 0%, #1A2B4C 100%)',
  },
} as const;

/**
 * Strict Unified Design System Spacing Scale Tokens
 * Strict values: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
 */
export const spacingScale = {
  '3xs': '4px',    // 4px - Micro gaps, badge paddings
  '2xs': '8px',    // 8px - Icon text spacing, small buttons
  'xs': '12px',    // 12px - Input padding, compact card padding (mobile)
  'sm': '16px',    // 16px - Base mobile card padding, default gap
  'md': '24px',    // 24px - Desktop card padding, layout gaps
  'lg': '32px',    // 32px - Section spacing
  'xl': '48px',    // 48px - Major component gaps
  '2xl': '64px',   // 64px - Page hero & footer spacing
} as const;

/**
 * Unified Responsive Typography Scale
 * Seamlessly fluid between mobile (<768px), tablet (768-1023px) and desktop (1024px+)
 */
export const typographyScale = {
  display: 'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight',
  h1: 'text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight',
  h2: 'text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight',
  h3: 'text-lg sm:text-xl lg:text-2xl font-bold',
  h4: 'text-base sm:text-lg font-semibold',
  bodyLarge: 'text-base sm:text-lg font-normal leading-relaxed',
  body: 'text-sm sm:text-base font-normal leading-relaxed',
  bodySmall: 'text-xs sm:text-sm font-normal leading-normal',
  caption: 'text-xs font-medium text-slate-500 dark:text-slate-400',
  overline: 'text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500',
} as const;

/**
 * Unified Card Geometry & Elevation Tokens
 * Standardizes 16px border-radius and 16px (mobile) -> 24px (desktop) padding
 */
export const cardTokens = {
  radius: 'rounded-2xl',                      // Uniform 16px border radius
  radiusCompact: 'rounded-xl',                // Uniform 12px for nested/compact cards
  padding: 'p-4 sm:p-6',                      // 16px mobile, 24px desktop
  paddingCompact: 'p-3 sm:p-4',               // 12px mobile, 16px desktop
  border: 'border border-[#E2E8F0] dark:border-white/[0.07]',
  borderElevated: 'border border-[#E2E8F0] dark:border-white/[0.10]',
  shadow: 'shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)]',
  shadowElevated: 'shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.08)]',
} as const;

export const themeStyles = {
  // Level 1 Elevation: Base Cards with uniform 16px border-radius, uniform padding (16px mobile, 24px desktop)
  glassCard: "bg-white dark:bg-gradient-to-b dark:from-[#0F182E] dark:to-[#0D1527] border border-[#E2E8F0] dark:border-white/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] rounded-2xl p-4 sm:p-6 text-[#0F172A] dark:text-slate-50",
  
  // Level 3 Elevation Transition: Hover state elevates seamlessly
  glassCardHover: "hover:bg-[#F8FAFC] dark:hover:bg-[#1A2B4C]/75 hover:border-sky-500/40 dark:hover:border-sky-400/35 hover:shadow-[0_6px_20px_rgba(14,165,233,0.15)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.65),0_0_24px_rgba(14,165,233,0.12)] transition-all duration-200 cursor-pointer",
  
  // Level 2 Elevation: Modals, Popovers & Nested Containers with uniform geometry
  glassCardElevated: "bg-white dark:bg-gradient-to-b dark:from-[#162440] dark:to-[#131F37] border border-[#E2E8F0] dark:border-white/[0.10] shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.08)] rounded-2xl p-4 sm:p-6 text-[#0F172A] dark:text-slate-50",

  // Compact Card: For dense feeds, stats & chips
  glassCardCompact: "bg-white dark:bg-gradient-to-b dark:from-[#0F182E] dark:to-[#0D1527] border border-[#E2E8F0] dark:border-white/[0.07] shadow-xs rounded-xl p-3 sm:p-4 text-[#0F172A] dark:text-slate-50",

  // Level 0 Recessed Input: Placed into canvas with crisp contrast text & focus glow
  glassInput: "bg-white dark:bg-[#070B14] border border-[#CBD5E1] dark:border-white/[0.08] rounded-xl text-[#0F172A] dark:text-slate-50 focus:border-sky-500 dark:focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/20 dark:focus:ring-sky-400/20 outline-none placeholder:text-[#64748B] dark:placeholder:text-slate-400 transition-all duration-200",
  
  // Electric Sky Accent Button: Equipped with soft ambient glow/shadow
  buttonPrimary: "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_2px_14px_rgba(14,165,233,0.35),0_0_24px_-4px_rgba(56,189,248,0.25)] hover:shadow-[0_4px_20px_rgba(14,165,233,0.45),0_0_30px_-2px_rgba(56,189,248,0.35)] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-sky-400/30",
  
  buttonPurple: "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_2px_14px_rgba(14,165,233,0.35),0_0_24px_-4px_rgba(56,189,248,0.25)] hover:shadow-[0_4px_20px_rgba(14,165,233,0.45),0_0_30px_-2px_rgba(56,189,248,0.35)] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-sky-400/30",
  
  // Secondary Button: Level 1 to Level 3 interactive surface
  buttonSecondary: "bg-white dark:bg-[#0D1527] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2B4C] border border-[#E2E8F0] dark:border-white/[0.08] dark:hover:border-white/[0.16] text-[#0F172A] dark:text-slate-100 font-bold rounded-xl active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)]",
  
  // Solid Coral/Sky Accent Button with soft glow
  buttonCoral: "bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-[0_2px_14px_rgba(14,165,233,0.35),0_0_20px_-3px_rgba(56,189,248,0.25)] hover:shadow-[0_4px_20px_rgba(14,165,233,0.45),0_0_28px_-2px_rgba(56,189,248,0.35)] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-sky-400/30",
  
  // Warm Gold Button with soft ambient glow
  buttonPrimaryWarm: "bg-[#D9B968] hover:bg-[#C9A24B] text-slate-950 font-black rounded-xl shadow-[0_2px_14px_rgba(217,185,104,0.35),0_0_20px_-4px_rgba(217,185,104,0.25)] hover:shadow-[0_4px_20px_rgba(217,185,104,0.45),0_0_26px_-2px_rgba(217,185,104,0.35)] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-amber-300/40",
  
  // Ghost Button with subtle translucent hover
  buttonGhost: "bg-transparent hover:bg-slate-100 dark:hover:bg-white/[0.06] text-[#0F172A] dark:text-slate-200 hover:text-sky-600 dark:hover:text-white font-bold rounded-xl active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2",
  
  buttonSuccess: "bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-[0_2px_12px_rgba(16,185,129,0.3),0_0_18px_-3px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_16px_rgba(16,185,129,0.4)] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/30",
  
  buttonDanger: "bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-[0_2px_12px_rgba(244,63,94,0.3),0_0_18px_-3px_rgba(244,63,94,0.2)] hover:shadow-[0_4px_16px_rgba(244,63,94,0.4)] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-rose-400/30",
} as const;



