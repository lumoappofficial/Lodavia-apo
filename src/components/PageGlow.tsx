import React from 'react';

const GLOW_COLORS: Record<string, string> = {
  nova: 'from-nova-500/25 via-nova-500/5 to-transparent',
  aurora: 'from-aurora-500/25 via-aurora-500/5 to-transparent',
  ember: 'from-ember-500/25 via-ember-500/5 to-transparent',
  comet: 'from-comet-500/25 via-comet-500/5 to-transparent',
};

export default function PageGlow({ color = 'nova' }: { color?: keyof typeof GLOW_COLORS }) {
  return (
    <div
      className={`pointer-events-none fixed top-0 left-0 right-0 h-64 bg-gradient-to-b ${GLOW_COLORS[color] || GLOW_COLORS.nova} z-0`}
      aria-hidden="true"
    />
  );
}
