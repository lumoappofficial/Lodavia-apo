import React from 'react';
import { CosmeticItem } from '../../types/cosmicPacks';
import { RARITY_CONFIG } from '../../config/cosmicPacksConfig';

interface CosmeticPreviewProps {
  item: CosmeticItem;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const CosmeticPreview: React.FC<CosmeticPreviewProps> = ({ item, size = 'md', showLabel = true }) => {
  const rarity = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.COMMON;

  const sizeDimensions = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-28 h-28 text-base'
  }[size];

  const avatarSize = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* 1. Avatar Frame Preview */}
      {item.type === 'AVATAR_FRAME' && (
        <div className={`relative flex items-center justify-center rounded-full p-1 transition-transform duration-300 hover:scale-105 ${item.previewCss || rarity.borderColor}`}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
            alt="Avatar Preview"
            className={`${avatarSize} rounded-full object-cover shadow-lg`}
          />
          <div className="absolute -bottom-1 -right-1 bg-void-900/90 text-xs px-1.5 py-0.5 rounded-full border border-white/20">
            {item.icon}
          </div>
        </div>
      )}

      {/* 2. Profile Background Preview */}
      {item.type === 'PROFILE_BACKGROUND' && (
        <div className={`relative w-36 h-20 rounded-xl overflow-hidden border border-white/10 shadow-md ${item.previewCss || 'bg-void-900'} flex flex-col justify-end p-2`}>
          <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium drop-shadow">
            <span>{item.icon}</span>
            <span className="truncate">{item.nameAr}</span>
          </div>
        </div>
      )}

      {/* 3. Name Effect Preview */}
      {item.type === 'NAME_EFFECT' && (
        <div className="px-3 py-1.5 rounded-lg bg-void-950/80 border border-white/10 text-center">
          <span className={`text-base font-extrabold ${item.previewCss || 'text-white'}`}>
            Lodavia Explorer {item.icon}
          </span>
        </div>
      )}

      {/* 4. Title Badge Preview */}
      {item.type === 'TITLE' && (
        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-aurora-500/20 via-purple-500/20 to-cyan-500/20 border border-aurora-500/40 text-aurora-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span>{item.icon}</span>
          <span>{item.nameAr}</span>
        </div>
      )}

      {/* 5. Badge Preview */}
      {(item.type === 'BADGE' || item.type === 'CREATOR_BADGE') && (
        <div className={`w-14 h-14 rounded-2xl ${rarity.bgColor} border ${rarity.borderColor} flex items-center justify-center text-2xl shadow-lg relative`}>
          {item.icon}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-aurora-400 animate-ping" />
        </div>
      )}

      {/* 6. AI Mascot Skin Preview */}
      {item.type === 'CHARACTER_SKIN' && (
        <div className="w-16 h-16 rounded-2xl bg-void-900/90 border border-sky-500/50 flex flex-col items-center justify-center shadow-lg relative overflow-hidden group">
          <div className="text-2xl transition-transform group-hover:scale-110">🪐</div>
          <span className="text-[9px] text-sky-300 font-bold tracking-tight text-center px-1 truncate">
            Ray: {item.mascotSkin || 'Skin'}
          </span>
        </div>
      )}

      {/* Generic fallback */}
      {!['AVATAR_FRAME', 'PROFILE_BACKGROUND', 'NAME_EFFECT', 'TITLE', 'BADGE', 'CREATOR_BADGE', 'CHARACTER_SKIN'].includes(item.type) && (
        <div className={`w-16 h-16 rounded-2xl ${rarity.bgColor} border ${rarity.borderColor} flex items-center justify-center text-3xl shadow-lg`}>
          {item.icon}
        </div>
      )}

      {showLabel && (
        <div className="text-center">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${rarity.badgeBg} font-semibold inline-block`}>
            {rarity.nameAr}
          </span>
        </div>
      )}
    </div>
  );
};
