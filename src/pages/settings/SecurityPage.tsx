import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Shield, 
  KeyRound,
  Smartphone,
  Check,
  AlertTriangle,
  Monitor,
  SmartphoneIcon,
  Globe
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

export default function SecurityPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();

  const isRtl = lang === 'ar';

  // Toggle States
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToggleFeedback = (titleEn: string, titleAr: string) => {
    playSynthSound(700, 'sine', 0.08);
    setToastMessage(isRtl ? titleAr : titleEn);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const activeDevices = [
    {
      id: 'dev_1',
      device: 'Apple MacBook Pro 14"',
      location: 'Riyadh, KSA',
      ip: '192.168.1.45',
      current: true,
      icon: Monitor,
      lastActiveAr: 'نشط الآن',
      lastActiveEn: 'Active Now'
    },
    {
      id: 'dev_2',
      device: 'iPhone 15 Pro Max',
      location: 'Jeddah, KSA',
      ip: '102.13.4.120',
      current: false,
      icon: SmartphoneIcon,
      lastActiveAr: 'منذ ساعتين',
      lastActiveEn: '2 hours ago'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'الأمان والحماية الكونية 🛡️' : 'Stellar Security & Protection 🛡️'}
        description={isRtl ? 'إدارة مستوى حماية حسابك، الجلسات النشطة، والمصادقة' : 'Manage your defensive parameters, session tokens, and active shield levels'}
        icon={Shield}
        iconColorClass="text-blue-600 dark:text-blue-400"
        iconBgClass="bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6 text-start">
        
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Feedback Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Toggles Panel */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-6 border border-[#E2E8F0] dark:border-white/10 flex flex-col gap-5 shadow-sm">
          
          {/* Two-Factor Toggle */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-white/5">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-[#111827] dark:text-white font-bold text-sm">
                <Smartphone className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                <span>{isRtl ? 'المصادقة الثنائية (2FA)' : 'Two-Factor Authentication (2FA)'}</span>
              </div>
              <p className="text-xs text-[#475569] dark:text-slate-400 mt-1 leading-relaxed">
                {isRtl 
                  ? 'أضف طبقة حماية إضافية عن طريق طلب رمز أمان مرسل لهاتفك عند كل تسجيل دخول.' 
                  : 'Establish a secondary defensive perimeter by requesting an authentication code on login attempts.'}
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => {
                  const val = e.target.checked;
                  setTwoFactor(val);
                  triggerToggleFeedback(
                    `Two-Factor Shield: ${val ? 'Activated' : 'Deactivated'}`,
                    `درع المصادقة الثنائية: ${val ? 'مفعّل الآن 🔒' : 'تم تعطيله ⚪'}`
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500" />
            </label>
          </div>

          {/* Login Alerts Toggle */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-[#111827] dark:text-white font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{isRtl ? 'تنبيه عند تسجيل الدخول من جهاز جديد' : 'New Login Device Alerts'}</span>
              </div>
              <p className="text-xs text-[#475569] dark:text-slate-400 mt-1 leading-relaxed">
                {isRtl 
                  ? 'احصل على إشعارات فورية ورسالة بريدية عند التعرف على دخول من متصفح أو جهاز غير مألوف.' 
                  : 'Receive instant alerts and electronic mail if entry is logged from an unfamiliar terminal.'}
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={loginAlerts}
                onChange={(e) => {
                  const val = e.target.checked;
                  setLoginAlerts(val);
                  triggerToggleFeedback(
                    `New login warnings: ${val ? 'Enabled' : 'Disabled'}`,
                    `تنبيهات الدخول الجديد: ${val ? 'مفعّلة حالياً 🔔' : 'تم تعطيلها ⚪'}`
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500" />
            </label>
          </div>

        </div>

        {/* Change Password Card */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-6 border border-[#E2E8F0] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3 flex-1">
            <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">{isRtl ? 'تغيير كلمة المرور' : 'Modify Account Password'}</h3>
              <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5 leading-relaxed">
                {isRtl 
                  ? 'حدّث كلمة مرورك دورياً لحماية حسابك ببروتوكولات تشفير Lodavia القوية.' 
                  : 'Revise your secret access phrase regularly to safeguard your account against intrusion.'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.08);
              navigate('/settings/password');
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-[#111827] dark:text-white font-bold text-xs cursor-pointer text-center shrink-0 transition-all active:scale-95"
          >
            {isRtl ? 'تحديث كلمة المرور' : 'Update Password'}
          </button>
        </div>

        {/* Active Sessions Panel */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-6 border border-[#E2E8F0] dark:border-white/10 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0] dark:border-white/5 text-[#111827] dark:text-slate-300">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <h2 className="text-xs font-black uppercase tracking-wider">
              {isRtl ? 'الأجهزة النشطة حالياً' : 'Current Active Sessions'}
            </h2>
          </div>

          <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed mb-1">
            {isRtl 
              ? 'تتم حالياً مراقبة الجلسات الكونية التي تستخدم بيانات دخولك. يمكنك تسجيل الخروج من أي جهاز.' 
              : 'These digital terminals are currently authorized to access your cosmic profile.'}
          </p>

          <div className="flex flex-col gap-3">
            {activeDevices.map((dev) => {
              const DeviceIcon = dev.icon;
              return (
                <div key={dev.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-[#E2E8F0] dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-200 dark:bg-white/5 text-[#475569] dark:text-slate-300 shrink-0">
                      <DeviceIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-start">
                      <div className="text-xs font-bold text-[#111827] dark:text-slate-100 flex items-center gap-1.5">
                        <span>{dev.device}</span>
                        {dev.current && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 uppercase font-black tracking-wider">
                            {isRtl ? 'الجهاز الحالي' : 'Current'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#475569] dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono">
                        <span>IP: {dev.ip}</span>
                        <span className="text-slate-400 dark:text-slate-600">•</span>
                        <span>{dev.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-[#64748B] dark:text-slate-400">
                    {isRtl ? dev.lastActiveAr : dev.lastActiveEn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
