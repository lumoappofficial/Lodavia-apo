import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, X, Shield, Zap, Lock, Coins, Palette, Star, Flame, Eye } from 'lucide-react';
import { MascotSkin, SKIN_DEFINITIONS } from './LodaviaMascot';
import { RAY_THEMES } from './Ray3DViewer';

interface RayLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkin: MascotSkin;
  onSelectSkin: (skin: MascotSkin) => void;
  userPoints?: number;
  lang?: string;
  playSynthSound?: (freq: number, type?: any, dur?: number) => void;
}

export default function RayLockerModal({
  isOpen,
  onClose,
  currentSkin,
  onSelectSkin,
  userPoints = 0,
  lang = 'ar',
  playSynthSound
}: RayLockerModalProps) {
  const isRtl = lang === 'ar';
  const [selectedTab, setSelectedTab] = useState<'all' | 'unlocked' | 'premium'>('all');
  const [previewSkin, setPreviewSkin] = useState<MascotSkin>(currentSkin);

  if (!isOpen) return null;

  const handleApplySkin = (skinKey: MascotSkin) => {
    onSelectSkin(skinKey);
    setPreviewSkin(skinKey);
    if (playSynthSound) playSynthSound(800, 'sine', 0.12);
  };

  const skinKeys = Object.keys(SKIN_DEFINITIONS) as MascotSkin[];
  
  const filteredSkins = skinKeys.filter((key) => {
    const skin = SKIN_DEFINITIONS[key];
    if (selectedTab === 'unlocked') return skin.price === 0;
    if (selectedTab === 'premium') return skin.price > 0;
    return true;
  });

  // Prevent background scrolling while open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-xl animate-[fadeIn_0.25s_ease-out]"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 border border-sky-500/30 rounded-3xl p-5 md:p-7 shadow-[0_0_60px_rgba(56,189,248,0.25)] overflow-hidden text-white flex flex-col max-h-[90vh] z-10"
          dir={isRtl ? 'rtl' : 'ltr'}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Cosmic Background Glows */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-black text-white flex items-center gap-2">
                  <span>{isRtl ? 'خزانة تخصيص Ray 3D الكونية 🪐' : 'Ray 3D Cosmic Locker 🪐'}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'اختر المظهر والدروع والهالة الكونية المناسبة لشخصيتك' : 'Customize Ray with unique auras, armors, and cosmic themes'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{userPoints} {isRtl ? 'نقطة' : 'pts'}</span>
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                title={isRtl ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 my-4 shrink-0 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => { setSelectedTab('all'); if (playSynthSound) playSynthSound(500, 'sine', 0.05); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTab === 'all'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-black shadow-sky-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {isRtl ? 'جميع المظاهر (8)' : 'All Themes (8)'}
            </button>
            <button
              onClick={() => { setSelectedTab('unlocked'); if (playSynthSound) playSynthSound(500, 'sine', 0.05); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTab === 'unlocked'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-black shadow-sky-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {isRtl ? 'المجانية والمتاحة' : 'Free & Standard'}
            </button>
            <button
              onClick={() => { setSelectedTab('premium'); if (playSynthSound) playSynthSound(500, 'sine', 0.05); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTab === 'premium'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-black shadow-sky-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {isRtl ? 'المظاهر الخاصة بالنقاط ⭐' : 'Point Specials ⭐'}
            </button>
          </div>

          {/* Skins Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto pr-1 flex-1 no-scrollbar my-1">
            {filteredSkins.map((skKey) => {
              const sk = SKIN_DEFINITIONS[skKey];
              const theme = RAY_THEMES[skKey] || RAY_THEMES.default;
              const isEquipped = currentSkin === skKey;

              return (
                <div
                  key={skKey}
                  onClick={() => handleApplySkin(skKey)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 relative group overflow-hidden ${
                    isEquipped
                      ? 'bg-gradient-to-r from-sky-950/60 to-purple-950/60 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                      : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/[0.08]'
                  }`}
                >
                  {/* Left Color Orb & Identity */}
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 relative shrink-0 overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${sk.headGradient[0]}, ${sk.headGradient[1]})`,
                        border: `1.5px solid ${theme.accent}66`,
                        boxShadow: `0 0 16px ${theme.accent}44`
                      }}
                    >
                      <span className="text-2xl">🪐</span>
                      <span 
                        className="absolute bottom-1 right-1 w-3 h-3 rounded-full shadow-md" 
                        style={{ backgroundColor: theme.accent }} 
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        {isRtl ? sk.nameAr : sk.nameEn}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                        <span>{isRtl ? theme.nameAr : theme.nameEn}</span>
                      </span>
                      <span className="text-[10px] text-sky-400/90 font-medium mt-1">
                        {sk.price === 0 ? (isRtl ? 'مجاني ومتاح دائماً' : 'Free Always') : `${sk.price} ${isRtl ? 'نقطة كسب' : 'Points'}`}
                      </span>
                    </div>
                  </div>

                  {/* Right Equip / Status Button */}
                  <div className="shrink-0 flex items-center">
                    {isEquipped ? (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-400 text-slate-950 font-black text-xs shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{isRtl ? 'مستعمل' : 'Equipped'}</span>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplySkin(skKey);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-sky-500 hover:text-slate-950 border border-white/10 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
                      >
                        {isRtl ? 'استخدام' : 'Equip'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between shrink-0">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>{isRtl ? 'يتم تطبيق المظهر فوراً على مسرح Ray 3D' : 'Applies immediately to Ray 3D stage'}</span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              {isRtl ? 'العودة إلى مسرح Ray ✨' : 'Return to Ray Stage ✨'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
