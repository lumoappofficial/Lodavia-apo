import React from 'react';
import { themeStyles } from '../styles/theme';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'compact';
  interactive?: boolean;
  children: React.ReactNode;
}

/**
 * Standard Unified Design System GlassCard Component
 * Enforces uniform border-radius (16px / rounded-2xl), uniform responsive padding,
 * and standard surface depth across all application modules.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return themeStyles.glassCardElevated;
      case 'compact':
        return themeStyles.glassCardCompact;
      case 'default':
      default:
        return themeStyles.glassCard;
    }
  };

  const interactiveClass = interactive ? ` ${themeStyles.glassCardHover}` : '';

  return (
    <div
      className={`${getCardStyle()}${interactiveClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
