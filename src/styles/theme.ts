// ============================================================================
// Lodavia Design System — single source of truth for reusable class strings.
// Use these instead of inventing new arbitrary bg-[#hex] / opacity values.
// If a screen needs something not listed here, add it HERE first, then use it.
// ============================================================================

export const themeStyles = {
  // ---- Surfaces ----
  // Cards/panels: tinted navy glass, NOT flat black. Base opacity raised so
  // content behind doesn't muddy the accent colors on top.
  glassCard:
    "backdrop-blur-md bg-void-800/70 dark:bg-void-800/70 border border-white/10 rounded-2xl",
  glassCardHover:
    "hover:border-aurora-500/40 hover:shadow-glow-aurora hover:-translate-y-0.5 transition-all duration-300",
  glassInput:
    "bg-void-900/80 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-aurora-500 focus:ring-2 focus:ring-aurora-500/30 outline-none transition-all",

  // ---- Buttons: clear 3-tier hierarchy so every screen looks intentional ----
  // Primary: the ONE action you want taken on a screen. Solid, saturated, glows.
  buttonPrimary:
    "bg-gradient-nova text-white font-semibold shadow-glow-nova hover:brightness-110 active:scale-[0.97] transition-all duration-200 rounded-full",
  // Warm primary variant — for celebratory / monetization CTAs (subscribe, gift, boost)
  buttonPrimaryWarm:
    "bg-gradient-ember text-void-950 font-semibold shadow-glow-ember hover:brightness-110 active:scale-[0.97] transition-all duration-200 rounded-full",
  // Secondary: real but lower priority actions. Visible outline, no fill.
  buttonSecondary:
    "bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-aurora-400/50 active:scale-[0.97] transition-all duration-200 rounded-full",
  // Ghost/tertiary: text-only actions (skip, cancel, "explore as guest")
  buttonGhost:
    "text-white/70 font-medium hover:text-white transition-colors duration-200",

  // ---- Badges / status pills (raise opacity floor so they read at a glance) ----
  badgeNova: "bg-nova-500/25 border border-nova-400/40 text-nova-400",
  badgeAurora: "bg-aurora-500/25 border border-aurora-400/40 text-aurora-400",
  badgeComet: "bg-comet-500/25 border border-comet-400/40 text-comet-400",
  badgeEmber: "bg-ember-500/25 border border-ember-400/40 text-ember-400",

  // ---- Backgrounds ----
  pageBackground: "bg-gradient-void",
} as const;
