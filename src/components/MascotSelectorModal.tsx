import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, X, Shield, Zap, UserCheck } from 'lucide-react';
import { MascotGender, MascotSkin } from './LodaviaMascot';
import Ray3DViewer from './Ray3DViewer';

interface MascotSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGender: MascotGender;
  currentSkin: MascotSkin;
  onSelect: (gender: MascotGender, skin: MascotSkin) => void;
  lang: string;
}

export default function MascotSelectorModal({
  isOpen,
  onClose,
  currentGender,
  currentSkin,
  onSelect,
  lang
}: MascotSelectorModalProps) {
  const [selectedGender, setSelectedGender] = useState<MascotGender>(currentGender || 'male');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelect(selectedGender, currentSkin || 'default');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-purple-950/80 to-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(147,51,234,0.3)] overflow-hidden text-white"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Ambient Glow backing */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 md:top-5 md:left-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/15 transition-all z-20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col items-center text-center mt-1 mb-4">
            <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
              <span>{lang === 'ar' ? 'المساعد الكوني الأصلي Ray 3D 🪐' : 'Original Ray 3D Companion 🪐'}</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-sm">
              {lang === 'ar'
                ? 'نموذج Ray 3D التفاعلي بالألوان الكاملة والفيزياء الحركية.'
                : 'Interactive full-color Ray 3D model with orbital motion and physics.'}
            </p>
          </div>

          {/* 3D Ray Display */}
          <div className="mb-5 rounded-2xl overflow-hidden border border-sky-500/30 shadow-inner">
            <Ray3DViewer
              currentSkin={currentSkin}
              lang={lang as 'ar' | 'en'}
              height={260}
              showControls={true}
              autoRotateDefault={true}
              interactive={true}
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-indigo-600 text-white font-bold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تأكيد وحفظ المظهر الكوني' : 'Confirm & Save Cosmic Companion'}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
