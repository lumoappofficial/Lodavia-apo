import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { authService } from '../../services/auth.service';
import { isFirebaseConfigured } from '../../firebase/config';
import { 
  KeyRound, 
  Check,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function PasswordAuthPage() {
  const { lang, playSynthSound } = useApp();

  const isRtl = lang === 'ar';

  // Form Fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status indicators
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      playSynthSound(250, 'sawtooth', 0.15);
      setErrorMessage(isRtl ? 'يرجى ملء جميع الحقول المطلوبة!' : 'Please fill in all password fields!');
      return;
    }

    if (newPassword.length < 6) {
      playSynthSound(250, 'sawtooth', 0.15);
      setErrorMessage(isRtl ? 'يجب أن تتكون كلمة المرور الجديدة من ٦ أحرف على الأقل!' : 'New password must be at least 6 characters!');
      return;
    }

    if (newPassword !== confirmPassword) {
      playSynthSound(250, 'sawtooth', 0.15);
      setErrorMessage(isRtl ? 'كلمة المرور الجديدة غير مطابقة لتأكيد كلمة المرور!' : 'New passwords do not match!');
      return;
    }

    setIsLoading(true);
    playSynthSound(600, 'sine', 0.08);

    try {
      if (isFirebaseConfigured) {
        // Enforce secure reauthentication and password update
        await authService.changePassword(currentPassword, newPassword);
        playSynthSound(880, 'sine', 0.1);
        setTimeout(() => playSynthSound(1320, 'sine', 0.15), 100);
        setSuccessMessage(isRtl ? 'تم تحديث كلمة المرور بنجاح! 🪐' : 'Password updated successfully! 🪐');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        // Local simulation fallback
        setTimeout(() => {
          playSynthSound(880, 'sine', 0.1);
          setTimeout(() => playSynthSound(1320, 'sine', 0.15), 100);
          setSuccessMessage(isRtl ? 'محاكاة: تم تحديث كلمة المرور الكونية بنجاح! 🪐' : 'Simulation: Stellar password updated successfully! 🪐');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setIsLoading(false);
        }, 1200);
        return;
      }
    } catch (err: any) {
      playSynthSound(200, 'sawtooth', 0.2);
      setErrorMessage(err.message || (isRtl ? 'فشل تحديث كلمة المرور. قد تحتاج إلى تأكيد كلمة المرور الحالية.' : 'Failed to update password. Please check your current password.'));
    } finally {
      if (isFirebaseConfigured) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'تحديث كلمة المرور 🔐' : 'Update Credentials 🔐'}
        description={isRtl ? 'تعديل وتشفير مفتاح الوصول الكوني الخاص بحسابك' : 'Encrypt and revise your secure cosmic entrance key'}
        icon={KeyRound}
        iconColorClass="text-indigo-600 dark:text-indigo-400"
        iconBgClass="bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20"
        backTo="/settings/security"
      />

      <div className="relative z-10 text-start">
        
        {/* Ambient Blur */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="bg-white dark:bg-[#182232] rounded-2xl p-6 border border-[#E2E8F0] dark:border-white/10 shadow-sm">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Success Banner */}
            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-xs font-bold flex items-center gap-2 animate-[shake_0.3s_ease-out]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Current Password Field */}
            <div>
              <label className="text-[10px] text-[#475569] dark:text-slate-400 font-extrabold uppercase tracking-wider block mb-2">
                {isRtl ? 'كلمة المرور الحالية' : 'Current Access Key'}
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs bg-slate-50 dark:bg-black/40 border border-[#E2E8F0] dark:border-white/10 rounded-xl p-3.5 pe-12 text-[#111827] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => { playSynthSound(600, 'sine', 0.03); setShowCurrent(!showCurrent); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-slate-500 hover:text-[#111827] dark:hover:text-slate-300 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label className="text-[10px] text-[#475569] dark:text-slate-400 font-extrabold uppercase tracking-wider block mb-2">
                {isRtl ? 'كلمة المرور الجديدة' : 'New Access Key'}
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs bg-slate-50 dark:bg-black/40 border border-[#E2E8F0] dark:border-white/10 rounded-xl p-3.5 pe-12 text-[#111827] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => { playSynthSound(600, 'sine', 0.03); setShowNew(!showNew); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-slate-500 hover:text-[#111827] dark:hover:text-slate-300 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[9px] text-[#64748B] dark:text-slate-500 block mt-1.5 px-1">
                {isRtl ? 'يجب ألا تقل عن ٦ خانات، ويفضل دمج رموز وحروف كبيرة.' : 'Must be at least 6 characters. Mixing symbols is highly advised.'}
              </span>
            </div>

            {/* Confirm New Password Field */}
            <div>
              <label className="text-[10px] text-[#475569] dark:text-slate-400 font-extrabold uppercase tracking-wider block mb-2">
                {isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Access Key'}
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs bg-slate-50 dark:bg-black/40 border border-[#E2E8F0] dark:border-white/10 rounded-xl p-3.5 pe-12 text-[#111827] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => { playSynthSound(600, 'sine', 0.03); setShowConfirm(!showConfirm); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-slate-500 hover:text-[#111827] dark:hover:text-slate-300 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-3 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 text-white font-black text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/15 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>
                {isLoading 
                  ? (isRtl ? 'جاري التشفير والتحديث...' : 'Encrypting & Synchronizing...') 
                  : (isRtl ? 'حفظ كلمة المرور الكونية' : 'Save Cosmic Access Key')}
              </span>
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
