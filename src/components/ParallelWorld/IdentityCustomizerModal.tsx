import React, { useState } from 'react';
import { 
  X, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Zap, 
  Palette, 
  Tv 
} from 'lucide-react';
import { ParallelIdentity } from '../../types/parallelWorld';
import { CUSTOMIZATION_OPTIONS } from '../../data/parallelWorldData';
import { AppUser } from '../../types';

interface IdentityCustomizerModalProps {
  currentUser: AppUser;
  identity: ParallelIdentity;
  onSaveIdentity: (updated: ParallelIdentity) => void;
  onClose: () => void;
  lang: string;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
}

export default function IdentityCustomizerModal({
  currentUser,
  identity,
  onSaveIdentity,
  onClose,
  lang,
  playSynthSound
}: IdentityCustomizerModalProps) {
  const isAr = lang === 'ar';

  const [title, setTitle] = useState(identity.title);
  const [outfit, setOutfit] = useState(identity.outfit);
  const [aura, setAura] = useState(identity.aura);
  const [auraColor, setAuraColor] = useState(identity.auraColor);
  const [vehicle, setVehicle] = useState(identity.vehicle);
  const [accessory, setAccessory] = useState(identity.accessory);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    playSynthSound(900, 'sine', 0.25);
    onSaveIdentity({
      ...identity,
      title,
      outfit,
      aura,
      auraColor,
      vehicle,
      accessory
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="glass-panel rounded-3xl p-6 max-w-lg w-full border border-white/15 shadow-2xl flex flex-col gap-4 animate-[scaleIn_0.25s_ease-out] max-h-[85vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-black text-white">
                {isAr ? 'استوديو الهوية الموازية الكونية 👤' : 'Parallel Identity Studio 👤'}
              </h3>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                {isAr ? 'تخصيص المظهر والدروع والآليات والهالات الضوئية' : 'Customize outfits, auras, vehicles & accessories'}
              </span>
            </div>
          </div>

          <button 
            onClick={() => {
              playSynthSound(440, 'sine', 0.1);
              onClose();
            }}
            className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Avatar Preview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-white/10 flex items-center gap-4">
          <div className="relative">
            <div 
              className="absolute -inset-2 rounded-full blur-md animate-pulse" 
              style={{ backgroundColor: auraColor }}
            />
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="relative w-16 h-16 rounded-full object-cover border-2 border-white/30" 
            />
          </div>

          <div>
            <h4 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>{currentUser.name}</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                {title}
              </span>
            </h4>
            <div className="text-[11px] text-slate-300 mt-1 flex flex-wrap gap-x-3 gap-y-1">
              <span>🥼 {outfit}</span>
              <span>🛸 {vehicle}</span>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'تم حفظ الهوية الموازية بنجاح! ✨' : 'Parallel identity saved successfully! ✨'}</span>
          </div>
        )}

        {/* Customization Controls */}
        <div className="flex flex-col gap-4">
          
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">{isAr ? 'اللقب الكوني' : 'Cosmic Title'}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-input w-full py-2 px-3 rounded-xl text-xs"
            />
          </div>

          {/* Outfits */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">{isAr ? 'الملابس والدروع الكونية' : 'Cosmic Outfit'}</label>
            <div className="grid grid-cols-2 gap-2">
              {CUSTOMIZATION_OPTIONS.outfits.map((o) => {
                const name = isAr ? o.nameAr : o.nameEn;
                const isSelected = outfit === name;
                return (
                  <button
                    key={o.id}
                    onClick={() => setOutfit(name)}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold text-start transition cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auras */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">{isAr ? 'الهالة الضوئية' : 'Light Aura'}</label>
            <div className="grid grid-cols-2 gap-2">
              {CUSTOMIZATION_OPTIONS.auras.map((a) => {
                const name = isAr ? a.nameAr : a.nameEn;
                const isSelected = aura === name;
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      setAura(name);
                      setAuraColor(a.color);
                    }}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold text-start transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-600/30 border-cyan-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{name}</span>
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicles */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">{isAr ? 'المركبة الفضائية' : 'Space Vehicle'}</label>
            <div className="grid grid-cols-2 gap-2">
              {CUSTOMIZATION_OPTIONS.vehicles.map((v) => {
                const name = isAr ? v.nameAr : v.nameEn;
                const isSelected = vehicle === name;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVehicle(name)}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold text-start transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accessories */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">{isAr ? 'الإكسسوارات العلوية' : 'Accessories'}</label>
            <div className="grid grid-cols-2 gap-2">
              {CUSTOMIZATION_OPTIONS.accessories.map((ac) => {
                const name = isAr ? ac.nameAr : ac.nameEn;
                const isSelected = accessory === name;
                return (
                  <button
                    key={ac.id}
                    onClick={() => setAccessory(name)}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold text-start transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600/30 border-amber-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs transition active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            {isAr ? 'حفظ وتأكيد الهوية الكونية ✨' : 'Save Cosmic Identity ✨'}
          </button>
        </div>

      </div>
    </div>
  );
}
