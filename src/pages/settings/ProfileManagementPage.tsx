import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  UserCog, 
  Check,
  Image as ImageIcon,
  User,
  Info
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function ProfileManagementPage() {
  const { lang, playSynthSound, currentUser, setCurrentUser } = useApp();

  // Local Form States
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isRtl = lang === 'ar';

  // Preset Avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playSynthSound(880, 'sine', 0.1);
    setTimeout(() => playSynthSound(1320, 'sine', 0.15), 100);

    // Update global app state
    setCurrentUser(prev => ({
      ...prev,
      name: name,
      bio: bio,
      avatar: avatar
    }));

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const selectPresetAvatar = (url: string) => {
    playSynthSound(600, 'sine', 0.05);
    setAvatar(url);
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'إدارة الملف الشخصي 👤' : 'Profile Management 👤'}
        description={isRtl ? 'تحديث وتعديل هويتك البصرية، الاسم، والنبذة الكونية التعريفية' : 'Update your stellar name, cosmic bio, and avatar presentation'}
        icon={UserCog}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20"
      />

      <div className="relative z-10">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          {/* Main profile form card */}
          <div className="bg-white dark:bg-[#182232] rounded-2xl p-6 border border-[#E2E8F0] dark:border-[#2A3447] shadow-sm flex flex-col gap-6 text-start">
            
            {/* Notification alert on success */}
            {savedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                <Check className="w-4 h-4 shrink-0" />
                <span>{isRtl ? 'تم تحديث ملفك الشخصي بنجاح!🪐' : 'Stellar profile successfully synchronized! 🪐'}</span>
              </div>
            )}

            {/* Avatar Preview & File/URL Input */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E2E8F0] dark:border-[#2A3447]">
              <div className="relative group shrink-0">
                <img 
                  src={avatar} 
                  alt={isRtl ? 'معاينة الصورة الشخصية' : 'Avatar Preview'} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-sky-500 shadow-md transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                  }}
                />
              </div>

              <div className="flex-1 w-full text-start">
                <label className="text-[10px] text-[#475569] dark:text-[#94A3B8] font-extrabold uppercase tracking-wider block mb-1.5">
                  {isRtl ? 'الصورة الشخصية' : 'Avatar Image'}
                </label>
                
                <div className="flex gap-2 mb-3">
                  <label className="flex-1 py-2 px-3 rounded-xl bg-sky-50 dark:bg-[#48B8FF]/10 hover:bg-sky-100 dark:hover:bg-[#48B8FF]/20 border border-sky-200 dark:border-[#48B8FF]/30 text-sky-700 dark:text-[#48B8FF] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'رفع من الجهاز' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) setAvatar(ev.target.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full text-xs bg-slate-50 dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#2A3447] rounded-xl p-3 text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:border-sky-500 transition-all font-mono"
                />

                {/* Avatar Presets */}
                <div className="mt-3">
                  <span className="text-[9px] text-[#64748B] dark:text-[#94A3B8] font-bold block mb-1.5">{isRtl ? 'أو اختر من الرموز الجاهزة:' : 'Or choose from presets:'}</span>
                  <div className="flex gap-2">
                    {avatarPresets.map((pUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectPresetAvatar(pUrl)}
                        className={`w-8 h-8 rounded-full overflow-hidden border transition-all hover:scale-110 cursor-pointer ${
                          avatar === pUrl ? 'border-sky-500 scale-105 ring-2 ring-sky-500/30' : 'border-[#E2E8F0] dark:border-[#2A3447]'
                        }`}
                      >
                        <img src={pUrl} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Display Name Input */}
            <div>
              <label className="text-[10px] text-[#475569] dark:text-slate-400 font-extrabold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{isRtl ? 'الاسم المعروض' : 'Display Name'}</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                required
                placeholder={isRtl ? 'أدخل اسمك المعروض' : 'Your galaxy username'}
                className="w-full text-xs bg-slate-50 dark:bg-black/40 border border-[#E2E8F0] dark:border-white/10 rounded-xl p-3 text-[#111827] dark:text-slate-100 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-bold"
              />
            </div>

            {/* Biography Textarea */}
            <div>
              <label className="text-[10px] text-[#475569] dark:text-slate-400 font-extrabold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                <span>{isRtl ? 'النبذة التعريفية (Bio)' : 'Cosmic Bio'}</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={200}
                rows={4}
                placeholder={isRtl ? 'اكتب نبذة مختصرة عن اهتماماتك الكونية...' : 'Describe your interests, mission, or coding journey...'}
                className="w-full text-xs bg-slate-50 dark:bg-black/40 border border-[#E2E8F0] dark:border-white/10 rounded-xl p-3 text-[#111827] dark:text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all leading-relaxed"
              />
              <div className="flex justify-between items-center mt-1.5 px-1">
                <span className="text-[9px] text-[#64748B] dark:text-slate-500">
                  {isRtl ? 'حد أقصى ٢٠٠ حرف' : 'Max 200 characters'}
                </span>
                <span className="text-[9px] text-[#64748B] dark:text-slate-500 font-mono">
                  {bio.length}/200
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-black text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-500/15"
            >
              <Check className="w-4 h-4" />
              <span>{isRtl ? 'حفظ التغييرات الكونية' : 'Save Cosmic Profile'}</span>
            </button>

          </div>

        </form>
      </div>

    </div>
  );
}
