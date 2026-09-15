import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Laptop, 
  Smartphone, 
  Tv, 
  Globe, 
  X, 
  LogOut, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

interface DeviceSession {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'tv';
  location: string;
  locationAr: string;
  lastActive: string;
  lastActiveAr: string;
  isCurrent: boolean;
}

export default function DevicesSessionsPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  // State with list of interactive logged in devices
  const [devices, setDevices] = useState<DeviceSession[]>([
    {
      id: 'dev-1',
      name: 'MacBook Pro 16" (macOS)',
      type: 'desktop',
      location: 'Riyadh, Saudi Arabia',
      locationAr: 'الرياض، المملكة العربية السعودية',
      lastActive: 'Active Now',
      lastActiveAr: 'نشط الآن',
      isCurrent: true
    },
    {
      id: 'dev-2',
      name: 'iPhone 15 Pro Max',
      type: 'mobile',
      location: 'Jeddah, Saudi Arabia',
      locationAr: 'جدة، المملكة العربية السعودية',
      lastActive: '2 hours ago',
      lastActiveAr: 'منذ ساعتين',
      isCurrent: false
    },
    {
      id: 'dev-3',
      name: 'Linux Desktop (Ubuntu)',
      type: 'desktop',
      location: 'Dubai, UAE',
      locationAr: 'دبي، الإمارات العربية المتحدة',
      lastActive: '3 days ago',
      lastActiveAr: 'منذ 3 أيام',
      isCurrent: false
    },
    {
      id: 'dev-4',
      name: 'Samsung Smart TV QLED',
      type: 'tv',
      location: 'Riyadh, Saudi Arabia',
      locationAr: 'الرياض، المملكة العربية السعودية',
      lastActive: '1 week ago',
      lastActiveAr: 'منذ أسبوع',
      isCurrent: false
    }
  ]);

  const [statusMessage, setStatusMessage] = useState('');

  // End a single session
  const handleTerminateSession = (id: string, name: string) => {
    playSynthSound(300, 'sawtooth', 0.15);
    setDevices(prev => prev.filter(d => d.id !== id));
    
    setStatusMessage(
      isRtl 
        ? `تم إنهاء الجلسة بنجاح على الجهاز: ${name} 🔒` 
        : `Successfully terminated session on device: ${name} 🔒`
    );
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Terminate all other sessions
  const handleLogoutAllOthers = () => {
    playSynthSound(150, 'sawtooth', 0.3);
    setDevices(prev => prev.filter(d => d.isCurrent));
    
    setStatusMessage(
      isRtl 
        ? 'تم تسجيل الخروج بنجاح من كافة الأجهزة الأخرى! 🛡️' 
        : 'Successfully logged out from all other devices! 🛡️'
    );
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Laptop className="w-5 h-5 text-cyan-400" />;
      case 'tv': return <Tv className="w-5 h-5 text-purple-400" />;
      default: return <Smartphone className="w-5 h-5 text-pink-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out] text-start">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'الأجهزة والقمم النشطة 🛡️' : 'Devices & Quantum Sessions 🛡️'}
        description={isRtl ? 'راقب الجلسات المسجلة حالياً على حسابك وقم بإدارتها وتأمينها' : 'Monitor and revoke active logins on your Lodavia account'}
        icon={Laptop}
        iconColorClass="text-sky-600 dark:text-cyan-400"
        iconBgClass="bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Global Action Banner */}
        {devices.length > 1 && (
          <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-500/[0.02] border border-red-200 dark:border-red-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-start">
              <span className="text-xs font-black text-[#111827] dark:text-white block">
                {isRtl ? 'هل تشك بنشاط مريب؟' : 'Suspect suspicious activity?'}
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-0.5 leading-normal max-w-sm">
                {isRtl ? 'يمكنك إنهاء الجلسات على جميع الأجهزة الأخرى المسجل الدخول منها بضغطة زر واحدة لحماية أمانك.' : 'You can terminate all active sessions except your current device instantly to safeguard your keys.'}
              </span>
            </div>

            <button
              onClick={handleLogoutAllOthers}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-sm border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>{isRtl ? 'تسجيل الخروج من كل الأجهزة الأخرى' : 'Log out from all other devices'}</span>
            </button>
          </div>
        )}

        {/* Devices list container */}
        <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 border border-[#E2E8F0] dark:border-white/5 backdrop-blur-md flex flex-col gap-4 shadow-sm">
          <h3 className="text-xs font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-[#E2E8F0] dark:border-white/5">
            <Globe className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
            <span>{isRtl ? 'الأجهزة المسجل منها الدخول حالياً' : 'Currently Registered Sessions'}</span>
          </h3>

          <div className="flex flex-col gap-3">
            {devices.map(device => (
              <div 
                key={device.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                  device.isCurrent
                    ? 'border-sky-300 dark:border-cyan-500/30 bg-sky-50/50 dark:bg-cyan-500/[0.02]'
                    : 'border-[#E2E8F0] dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${
                    device.isCurrent ? 'bg-sky-100 dark:bg-cyan-500/10 border-sky-200 dark:border-cyan-500/20 text-sky-700 dark:text-cyan-400' : 'bg-slate-200 dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#64748B] dark:text-slate-400'
                  }`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-[#111827] dark:text-white">{device.name}</span>
                      {device.isCurrent && (
                        <span className="text-[9px] font-black tracking-wider uppercase bg-sky-100 dark:bg-cyan-500/15 border border-sky-200 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-400 px-2 py-0.5 rounded-full">
                          {isRtl ? 'هذا الجهاز' : 'THIS DEVICE'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-1">
                      {isRtl ? device.locationAr : device.location} • {isRtl ? device.lastActiveAr : device.lastActive}
                    </span>
                  </div>
                </div>

                {!device.isCurrent && (
                  <button
                    onClick={() => handleTerminateSession(device.id, device.name)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-[#E2E8F0] dark:border-white/10 hover:border-rose-200 dark:hover:border-rose-500/20 text-[#64748B] dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-[10px] transition-all cursor-pointer select-none active:scale-95"
                  >
                    {isRtl ? 'إنهاء الجلسة' : 'End session'}
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Action feedback */}
        {statusMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2.5 animate-[slideIn_0.3s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-4.5 border border-[#E2E8F0] dark:border-white/5 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed">
            {isRtl 
              ? 'إذا لاحظت أي جهاز غير معروف، نوصيك بتغيير كلمة المرور الكونية الخاصة بك فوراً وتفعيل المصادقة الثنائية.' 
              : 'If you spot any session you do not recognize, click End Session immediately, reset your passkey, and synchronize two-factor credentials.'}
          </p>
        </div>

      </div>

    </div>
  );
}
