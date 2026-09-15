import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Check,
  Camera,
  Mic,
  MapPin,
  Users,
  Bell,
  ShieldAlert,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

interface SystemPermission {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  granted: boolean;
  icon: React.ReactNode;
}

export default function PermissionsPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();

  const isRtl = lang === 'ar';

  const [permissions, setPermissions] = useState<SystemPermission[]>([
    {
      id: 'camera',
      titleAr: 'صلاحية الكاميرا 📷',
      titleEn: 'Camera Access 📷',
      descAr: 'لمشاركة مقاطع الفيديو الحية والتقاط وتخصيص صورتك الشخصية الكونية.',
      descEn: 'Required for live video broadcasting and taking high-res cosmic profile avatars.',
      granted: true,
      icon: <Camera className="w-4.5 h-4.5" />
    },
    {
      id: 'mic',
      titleAr: 'صلاحية الميكروفون 🎤',
      titleEn: 'Microphone Access 🎤',
      descAr: 'للمشاركة في الغرف الصوتية والمحادثات الصوتية المباشرة مع المستكشفين.',
      descEn: 'Needed to speak in Voice Rooms and record clean voice messages in chat channels.',
      granted: true,
      icon: <Mic className="w-4.5 h-4.5" />
    },
    {
      id: 'location',
      titleAr: 'صلاحية الموقع الجغرافي 📍',
      titleEn: 'Location & Orbit Tracking 📍',
      descAr: 'لعرض غرف البث القريبة واللقاءات الفلكية للمستخدمين في نفس منطقتك.',
      descEn: 'Find near-orbit stargazers, local events, and nearby digital nodes.',
      granted: false,
      icon: <MapPin className="w-4.5 h-4.5" />
    },
    {
      id: 'contacts',
      titleAr: 'جهات الاتصال 👥',
      titleEn: 'Contacts Syncing 👥',
      descAr: 'للبحث السريع عن أصدقائك الذين انضموا بالفعل لشبكة Lodavia الكونية.',
      descEn: 'Match phone numbers to instantly follow friends who are already on Lodavia.',
      granted: false,
      icon: <Users className="w-4.5 h-4.5" />
    },
    {
      id: 'notifications',
      titleAr: 'نظام الإشعارات الفورية 🔔',
      titleEn: 'Instant Notifications 🔔',
      descAr: 'لتلقي التنبيهات حول الغرف الصوتية النشطة والرسائل المباشرة فوراً.',
      descEn: 'Receive immediate pings when rooms go live or friends send hyper-spatial messages.',
      granted: true,
      icon: <Bell className="w-4.5 h-4.5" />
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerSaveFeedback = (msgEn: string, msgAr: string, tone = 700) => {
    playSynthSound(tone, 'sine', 0.08);
    setToastMessage(isRtl ? msgAr : msgEn);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleTogglePermission = (id: string) => {
    playSynthSound(600, 'sine', 0.06);
    setPermissions(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.granted;
        if (nextState) {
          triggerSaveFeedback(
            `Access granted for ${p.id} services`,
            `تم تفعيل الصلاحية لـ ${p.titleAr.split(' ')[1]} بنجاح ✅`,
            750
          );
        } else {
          triggerSaveFeedback(
            `Access restricted for ${p.id} services`,
            `تم حظر أو تقييد صلاحية ${p.titleAr.split(' ')[1]} ⚠️`,
            400
          );
        }
        return { ...p, granted: nextState };
      }
      return p;
    }));
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'صلاحيات وأذونات النظام 🛡️' : 'System & Frame Permissions 🛡️'}
        description={isRtl ? 'التحكم في الميزات التي يمكن للتطبيق استخدامها على جهازك' : 'Review and toggle frame capabilities granted to Lodavia'}
        icon={Sliders}
        iconColorClass="text-sky-600 dark:text-cyan-400"
        iconBgClass="bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6 text-start">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Feedback Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Privacy statement */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-5 border border-[#E2E8F0] dark:border-white/5 flex items-start gap-4 shadow-sm">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#111827] dark:text-white">
              {isRtl ? 'سياسة الخصوصية الصارمة والأمان الكوني' : 'Absolute Cryptographic Privacy'}
            </h3>
            <p className="text-[11px] text-[#475569] dark:text-slate-400 mt-1 leading-relaxed">
              {isRtl 
                ? 'لا يتم حفظ أو بث أي بيانات صوتية أو مرئية أو جغرافية خارج إطار جلستك المباشرة المشفرة. خصوصيتك مأمنة بنظام تشفير لودافيا التام.'
                : 'Zero logs of your voice waveforms or geolocation telemetry are stored on servers. All hardware streams operate fully peer-to-peer under high encryption.'}
            </p>
          </div>
        </div>

        {/* Permissions list */}
        <div className="flex flex-col gap-3.5">
          {permissions.map((perm) => {
            return (
              <div 
                key={perm.id}
                className={`bg-white dark:bg-[#182232] rounded-2xl p-5 border flex items-center justify-between gap-5 transition-all duration-300 shadow-sm ${
                  perm.granted 
                    ? 'border-sky-200 dark:border-cyan-500/25 bg-sky-50/30 dark:bg-cyan-500/[0.01]' 
                    : 'border-[#E2E8F0] dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`p-3 rounded-xl border shrink-0 mt-0.5 ${
                    perm.granted 
                      ? 'bg-sky-100 dark:bg-cyan-500/15 border-sky-200 dark:border-cyan-500/20 text-sky-600 dark:text-cyan-400' 
                      : 'bg-slate-200 dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#64748B] dark:text-slate-500'
                  }`}>
                    {perm.icon}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-[#111827] dark:text-white">
                      {isRtl ? perm.titleAr : perm.titleEn}
                    </h3>
                    <p className="text-[10px] text-[#475569] dark:text-slate-400 mt-1 leading-normal">
                      {isRtl ? perm.descAr : perm.descEn}
                    </p>
                  </div>
                </div>

                {/* Switch widget */}
                <div className="shrink-0 flex items-center gap-3">
                  <span className={`text-[10px] font-bold ${
                    perm.granted ? 'text-sky-600 dark:text-cyan-400' : 'text-[#64748B] dark:text-slate-500'
                  }`}>
                    {perm.granted 
                      ? (isRtl ? 'مسموح' : 'Allowed') 
                      : (isRtl ? 'مرفوض' : 'Blocked')
                    }
                  </span>

                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={perm.granted}
                      onChange={() => handleTogglePermission(perm.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600 dark:peer-checked:bg-cyan-500" />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
