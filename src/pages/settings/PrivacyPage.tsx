import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  EyeOff, 
  Users,
  MessageSquare,
  Activity,
  Shield,
  Check,
  Globe,
  Lock,
  FileText,
  ArrowRight
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function PrivacyPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();

  const isRtl = lang === 'ar';

  // Toggle states (saved in localStorage or component state)
  const [profileVisibility, setProfileVisibility] = useState<'everyone' | 'followers'>(() => {
    return (localStorage.getItem('lodavia_privacy_visibility') as 'everyone' | 'followers') || 'everyone';
  });
  const [messageAllowance, setMessageAllowance] = useState<'everyone' | 'friends' | 'none'>(() => {
    return (localStorage.getItem('lodavia_privacy_messaging') as 'everyone' | 'friends' | 'none') || 'everyone';
  });
  const [showOnlineStatus, setShowOnlineStatus] = useState<boolean>(() => {
    const saved = localStorage.getItem('lodavia_privacy_online');
    return saved !== null ? saved === 'true' : true;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto trigger alerts when state changes to give feedback to user
  const triggerSaveFeedback = (msgEn: string, msgAr: string) => {
    playSynthSound(700, 'sine', 0.08);
    setToastMessage(isRtl ? msgAr : msgEn);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  useEffect(() => {
    localStorage.setItem('lodavia_privacy_visibility', profileVisibility);
  }, [profileVisibility]);

  useEffect(() => {
    localStorage.setItem('lodavia_privacy_messaging', messageAllowance);
  }, [messageAllowance]);

  useEffect(() => {
    localStorage.setItem('lodavia_privacy_online', showOnlineStatus.toString());
  }, [showOnlineStatus]);

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'الخصوصية الكونية 🔐' : 'Cosmic Privacy 🔐'}
        description={isRtl ? 'إدارة تصاريح المراقبة، التراسل الفوري، وحالة مدارك العام' : 'Manage observation clearances, private messaging, and orbit status'}
        icon={EyeOff}
        iconColorClass="text-emerald-600 dark:text-emerald-400"
        iconBgClass="bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6 text-start">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Sync alert banner */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Official Privacy Policy Document Card */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent rounded-2xl p-5 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black text-[#111827] dark:text-white uppercase tracking-wider">
                  {isRtl ? 'وثيقة سياسة الخصوصية الرسمية' : 'Official Privacy Policy Charter'}
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                  {isRtl ? 'معتمدة' : 'Official'}
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-slate-400 mt-1 leading-relaxed">
                {isRtl 
                  ? 'اطلع على البيان الكامل والدقيق لجمع البيانات، التوثيق عبر Firebase، معالجة الذكاء الاصطناعي، وحقوقك الكاملة.' 
                  : 'Review our complete disclosure on personal data collection, Firebase auth, Gemini AI processing, and user rights.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSynthSound(550, 'sine', 0.08);
              navigate('/settings/privacy/policy');
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{isRtl ? 'عرض سياسة الخصوصية الكاملة' : 'View Full Privacy Policy'}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 1. Profile Visibility (Everyone vs Followers) */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-6 border border-[#E2E8F0] dark:border-white/10 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0] dark:border-white/5 text-[#111827] dark:text-slate-300">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h2 className="text-xs font-black uppercase tracking-wider">
              {isRtl ? 'من يمكنه رؤية ملفي الشخصي' : 'Who Can Observe My Profile'}
            </h2>
          </div>

          <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed">
            {isRtl 
              ? 'تحكم في إمكانية تصفح منشوراتك، أوسمتك، ومجتمعاتك من قبل الزوار.' 
              : 'Choose if you want your posts and community presence to be visible globally or kept strictly to approved followers.'}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => {
                setProfileVisibility('everyone');
                triggerSaveFeedback('Profile visibility set to Global', 'تم ضبط رؤية الملف الشخصي للعامة 🌐');
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all cursor-pointer ${
                profileVisibility === 'everyone'
                  ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/[0.03] text-[#111827] dark:text-white font-bold'
                  : 'border-[#E2E8F0] dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] text-[#475569] dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10 hover:text-[#111827] dark:hover:text-slate-200'
              }`}
            >
              <Globe className={`w-5 h-5 ${profileVisibility === 'everyone' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#64748B] dark:text-slate-500'}`} />
              <div className="text-xs font-bold">{isRtl ? 'الجميع (عام)' : 'Everyone (Public)'}</div>
            </button>

            <button
              onClick={() => {
                setProfileVisibility('followers');
                triggerSaveFeedback('Profile restricted to followers only', 'تم قصر الرؤية على المتابعين فقط 🔒');
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all cursor-pointer ${
                profileVisibility === 'followers'
                  ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/[0.03] text-[#111827] dark:text-white font-bold'
                  : 'border-[#E2E8F0] dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] text-[#475569] dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10 hover:text-[#111827] dark:hover:text-slate-200'
              }`}
            >
              <Lock className={`w-5 h-5 ${profileVisibility === 'followers' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#64748B] dark:text-slate-500'}`} />
              <div className="text-xs font-bold">{isRtl ? 'المتابعون فقط' : 'Followers Only'}</div>
            </button>
          </div>
        </div>

        {/* 2. Direct Messaging Permissions */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-6 border border-[#E2E8F0] dark:border-white/10 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0] dark:border-white/5 text-[#111827] dark:text-slate-300">
            <MessageSquare className="w-4 h-4 text-sky-600 dark:text-cyan-400 shrink-0" />
            <h2 className="text-xs font-black uppercase tracking-wider">
              {isRtl ? 'من يمكنه مراسلتي' : 'Who Can Message Me'}
            </h2>
          </div>

          <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed">
            {isRtl 
              ? 'حدد مستويات الاستقبال للرسائل المباشرة في بريدك الكوني.' 
              : 'Restrict direct message arrivals to avoid galactic spam and keep your orbit quiet.'}
          </p>

          <div className="flex flex-col gap-2 mt-2">
            {[
              { id: 'everyone', ar: 'الجميع (متاح للمراسلة العامة)', en: 'Everyone (Open)' },
              { id: 'friends', ar: 'الأصدقاء والمتابعون المتبادلون فقط', en: 'Mutual Friends Only' },
              { id: 'none', ar: 'لا أحد (إيقاف الرسائل الواردة)', en: 'No One (Block Inbound)' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setMessageAllowance(option.id as any);
                  triggerSaveFeedback(`Messaging options updated to: ${option.en}`, `تم تحديث خيارات التراسل: ${option.ar}`);
                }}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-start transition-all cursor-pointer ${
                  messageAllowance === option.id
                    ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/[0.02] text-[#111827] dark:text-white font-bold'
                    : 'border-[#E2E8F0] dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] text-[#475569] dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10 hover:text-[#111827] dark:hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-semibold">{isRtl ? option.ar : option.en}</span>
                {messageAllowance === option.id && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Online Activity Status (Activity Indicator Toggle) */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-6 border border-[#E2E8F0] dark:border-white/10 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-white/5">
            <div className="flex items-center gap-2 text-[#111827] dark:text-slate-300">
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <h2 className="text-xs font-black uppercase tracking-wider">
                {isRtl ? 'إظهار حالة النشاط (متصل الآن)' : 'Active State Indicator'}
              </h2>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlineStatus}
                onChange={(e) => {
                  const val = e.target.checked;
                  setShowOnlineStatus(val);
                  triggerSaveFeedback(
                    `Online status visibility: ${val ? 'Enabled' : 'Disabled'}`,
                    `مؤشر الاتصال المباشر: ${val ? 'مفعّل حالياً 🟢' : 'معطّل حالياً ⚪'}`
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-emerald-600 dark:peer-checked:bg-emerald-500" />
            </label>
          </div>

          <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed">
            {isRtl 
              ? 'عند تفعيل هذا الخيار، سيتمكن الأصدقاء من معرفة متى تكون متصلاً بالشبكة بنقطة خضراء بجانب صورتك الشخصية.' 
              : 'Allow friends and community members to see a glowing green orb on your avatar when you are active on the Lodavia mainframe.'}
          </p>
        </div>

        {/* Security Summary Card */}
        <div className="bg-emerald-50/50 dark:bg-gradient-to-r dark:from-emerald-500/5 dark:to-cyan-500/5 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-500/20 flex gap-3.5 items-start shadow-sm">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#111827] dark:text-white mb-1">
              {isRtl ? 'حماية تشفير كروية كاملة' : 'Stellar Privacy Assured'}
            </h4>
            <p className="text-[10px] text-[#475569] dark:text-slate-400 leading-relaxed">
              {isRtl 
                ? 'خيارات الخصوصية في Lodavia محمية ببروتوكولات تشفير محلية بالكامل. لا نقوم بمشاركة أو نقل بيانات الخصوصية لأي طرف خارجي.' 
                : 'All settings parameters are registered directly into your browser keychain, keeping your digital footprint protected.'}
            </p>
            <button
              onClick={() => {
                playSynthSound(550, 'sine', 0.08);
                navigate('/settings/privacy/policy');
              }}
              className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isRtl ? 'قراءة وثيقة سياسة الخصوصية الرسمية الكاملة' : 'Read official full Privacy Policy documentation'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
