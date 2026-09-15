import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { authService } from '../../services/auth.service';
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldAlert, 
  Info,
  Trash2,
  Edit,
  X,
  Loader2,
  Lock
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function AccountCenterPage() {
  const { lang, playSynthSound, currentUser } = useApp();
  const navigate = useNavigate();
  const [showEditPlaceholder, setShowEditPlaceholder] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isRtl = lang === 'ar';

  const handleEditClick = () => {
    playSynthSound(600, 'sine', 0.08);
    setShowEditPlaceholder(true);
  };

  const handleDeleteClick = () => {
    playSynthSound(150, 'sawtooth', 0.2);
    setDeleteError(null);
    setPasswordConfirm('');
    setShowDeleteConfirm(true);
  };

  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    playSynthSound(100, 'sawtooth', 0.5);

    try {
      await authService.deleteAccount(passwordConfirm || undefined);
      setShowDeleteConfirm(false);
      navigate('/welcome');
    } catch (err: any) {
      setDeleteError(err?.message || (isRtl ? 'فشل حذف الحساب. يرجى المحاولة لاحقاً.' : 'Failed to delete account.'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'مركز الحساب الكوني 🌌' : 'Cosmic Account Center 🌌'}
        description={isRtl ? 'عرض وإدارة بيانات حسابك وهويتك الكونية الأساسية' : 'View and manage your core identity in the Lodavia network'}
        icon={User}
        iconColorClass="text-sky-600 dark:text-cyan-400"
        iconBgClass="bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20"
      />

      <div className="relative flex flex-col gap-6 z-10">
        {/* Account Details Card */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-6 border border-[#E6EAF0] dark:border-[#2A3447] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-[#E6EAF0] dark:border-[#2A3447] pb-5">
            <img 
              src={currentUser.avatar} 
              alt={isRtl ? 'صورة الملف الشخصي' : 'Profile Picture'} 
              className="w-16 h-16 rounded-full object-cover border-2 border-[#48B8FF]/40 shadow-lg shadow-[#48B8FF]/10"
            />
            <div className="text-start">
              <h2 className="text-lg font-bold text-[#1A1F2C] dark:text-[#F8FAFC] flex items-center gap-1.5">
                {currentUser.name}
                <span className="text-[9px] bg-[#48B8FF]/20 text-[#48B8FF] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
              </h2>
              <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1 font-mono uppercase tracking-wider">ID: {currentUser.id}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-start">
            {/* Name field */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447]">
              <User className="w-4 h-4 text-[#48B8FF] shrink-0" />
              <div>
                <span className="text-[10px] text-[#6E7685] dark:text-[#94A3B8] block">{isRtl ? 'الاسم المعروض' : 'Display Name'}</span>
                <span className="text-sm font-semibold text-[#1A1F2C] dark:text-[#F8FAFC]">{currentUser.name}</span>
              </div>
            </div>

            {/* Email field */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447]">
              <Mail className="w-4 h-4 text-purple-500 shrink-0" />
              <div>
                <span className="text-[10px] text-[#6E7685] dark:text-[#94A3B8] block">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</span>
                <span className="text-sm font-semibold text-[#1A1F2C] dark:text-[#F8FAFC]">{currentUser.email || 'user@lodavia.com'}</span>
              </div>
            </div>

            {/* Joining Date field */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447]">
              <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="text-[10px] text-[#6E7685] dark:text-[#94A3B8] block">{isRtl ? 'تاريخ الانضمام' : 'Orbit Joining Date'}</span>
                <span className="text-sm font-semibold text-[#1A1F2C] dark:text-[#F8FAFC]">
                  {isRtl ? 'يناير ٢٠٢٦' : 'January 2026'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleEditClick}
              className="flex-1 py-3 px-4 rounded-xl bg-[#48B8FF] hover:bg-[#38A8EF] text-white font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#48B8FF]/20"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>{isRtl ? 'تعديل معلومات الحساب' : 'Edit Account Details'}</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-[#182232] border-dashed border-red-500/30 rounded-2xl p-6 flex flex-col gap-4 text-start">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E6EAF0] dark:border-[#2A3447] text-red-500 dark:text-red-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <h3 className="text-xs font-black uppercase tracking-wider">{isRtl ? 'منطقة الخطر' : 'Danger Zone'}</h3>
          </div>
          <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] leading-relaxed">
            {isRtl 
              ? 'عند حذف الحساب، سيتم إزالة جميع بياناتك ومشاركاتك ونقاطك بشكل نهائي من السجلات الكونية ولا يمكن التراجع عن هذا الإجراء.' 
              : 'Once you terminate your cosmic presence, all your posts, earned Lodavia points, and settings will be permanently erased.'}
          </p>
          <button
            onClick={handleDeleteClick}
            className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800/40 text-xs font-bold text-red-600 dark:text-red-400 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'حذف الحساب نهائياً' : 'Delete Account Permanently'}</span>
          </button>
        </div>
      </div>

      {/* Edit Placeholder Modal */}
      {showEditPlaceholder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-[#182232] border border-[#E2E8F0] dark:border-white/10 rounded-2xl p-6 w-full max-w-sm text-center relative shadow-2xl animate-[scaleUp_0.25s_ease-out]">
            <button 
              onClick={() => { playSynthSound(500, 'sine', 0.05); setShowEditPlaceholder(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#111827] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mx-auto mb-4 text-sky-600 dark:text-cyan-400">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#111827] dark:text-white mb-2">
              {isRtl ? 'ميزة قيد التطوير 🛠️' : 'Under Development 🛠️'}
            </h3>
            <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed mb-6">
              {isRtl 
                ? 'يتم ربط نموذج تعديل البريد والهاتف بقاعدة بيانات أمان Lodavia حالياً. ستتوفر هذه الميزة بالكامل في التحديث القادم.' 
                : 'Account verification & field updates are currently being connected to Lodavia Core Auth services.'}
            </p>
            <button
              onClick={() => { playSynthSound(500, 'sine', 0.05); setShowEditPlaceholder(false); }}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-[#111827] dark:text-white font-bold text-xs cursor-pointer"
            >
              {isRtl ? 'حسناً' : 'Understood'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-[#182232] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm text-center relative shadow-2xl animate-[scaleUp_0.25s_ease-out]">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="text-base font-bold text-red-600 dark:text-red-400 mb-2">
              {isRtl ? 'هل أنت متأكد تماماً؟' : 'Are you absolutely sure?'}
            </h3>
            <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed mb-4">
              {isRtl 
                ? 'هذا الإجراء سيقوم بحذف حسابك نهائياً وتصفير رصيد نقاطك وحذف كافة بياناتك وسجلاتك من الخادم. لا يمكن التراجع عن هذا الإجراء.' 
                : 'This action will permanently delete your account, wipe all your points, and destroy all server records. This cannot be undone.'}
            </p>

            {currentUser.email && !currentUser.email.endsWith('@lodavia-phone.com') && (
              <div className="mb-4 text-start">
                <label className="text-[11px] font-medium text-[#64748B] dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  {isRtl ? 'كلمة المرور لتأكيد الهوية (اختياري)' : 'Current password to re-authenticate (optional)'}
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#0F172A] dark:text-white outline-none focus:border-red-500"
                />
              </div>
            )}

            {deleteError && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs text-start">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  playSynthSound(500, 'sine', 0.05);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-[#475569] dark:text-slate-300 font-bold text-xs cursor-pointer disabled:opacity-50"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExecuteDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isRtl ? 'جارِ الحذف...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <span>{isRtl ? 'تأكيد الحذف النهائي' : 'Permanently Delete'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
