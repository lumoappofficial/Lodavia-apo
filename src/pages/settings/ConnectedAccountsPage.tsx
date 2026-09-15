import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Link2, 
  Check, 
  Sparkles, 
  Chrome, 
  Apple, 
  Phone,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

interface LinkableAccount {
  id: string;
  provider: 'google' | 'apple' | 'phone';
  name: string;
  nameAr: string;
  connected: boolean;
  username: string;
  usernameAr: string;
}

export default function ConnectedAccountsPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  // Interactive linkable accounts list state
  const [accounts, setAccounts] = useState<LinkableAccount[]>([
    {
      id: 'acc-1',
      provider: 'google',
      name: 'Google Workspace',
      nameAr: 'حساب جوجل الموحد',
      connected: true,
      username: 'cosmic.explorer@gmail.com',
      usernameAr: 'cosmic.explorer@gmail.com'
    },
    {
      id: 'acc-2',
      provider: 'apple',
      name: 'Apple iCloud ID',
      nameAr: 'معرف آبل السحابي',
      connected: false,
      username: 'Not connected',
      usernameAr: 'غير متصل'
    },
    {
      id: 'acc-3',
      provider: 'phone',
      name: 'Secure Phone Number',
      nameAr: 'رقم الهاتف الموثق',
      connected: true,
      username: '+966 ••••••789',
      usernameAr: '+٩٦٦ ••••••٧٨٩'
    }
  ]);

  const [toast, setToast] = useState('');

  const handleToggleConnect = (id: string, name: string, currentStatus: boolean) => {
    playSynthSound(600, 'sine', 0.05);
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const nextConnected = !currentStatus;
        return {
          ...acc,
          connected: nextConnected,
          username: nextConnected 
            ? (acc.provider === 'google' ? 'cosmic.explorer@gmail.com' : acc.provider === 'apple' ? 'explorer.lodavia@icloud.com' : '+966 ••••••789')
            : (acc.provider === 'apple' ? 'Not connected' : acc.provider === 'google' ? 'Not connected' : 'Not linked')
        };
      }
      return acc;
    }));

    setToast(
      isRtl
        ? `تم ${currentStatus ? 'فصل' : 'ربط'} الحساب: ${name} بنجاح! ✨`
        : `Successfully ${currentStatus ? 'disconnected' : 'linked'} ${name}! ✨`
    );
    setTimeout(() => setToast(''), 3000);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <Chrome className="w-5 h-5 text-amber-400" />;
      case 'apple':
        return <Apple className="w-5 h-5 text-slate-200" />;
      default:
        return <Phone className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out] text-start">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'الحسابات المرتبطة والمصادقة 🔗' : 'Linked Accounts & Authentication 🔗'}
        description={isRtl ? 'اربط منصاتك الخارجية لتسهيل وتسريع تسجيل الدخول لحسابك الكوني' : 'Manage federated sign-ins and identity channels'}
        icon={Link2}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Linked Accounts List */}
        <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 border border-[#E2E8F0] dark:border-white/5 backdrop-blur-md flex flex-col gap-4 shadow-sm">
          <h3 className="text-xs font-black text-[#111827] dark:text-slate-300 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-[#E2E8F0] dark:border-white/5">
            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{isRtl ? 'قنوات التحقق والهوية الرقمية' : 'Federated Login Channels'}</span>
          </h3>

          <div className="flex flex-col gap-3">
            {accounts.map(acc => (
              <div 
                key={acc.id}
                className="p-4 rounded-2xl border border-[#E2E8F0] dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-slate-300 dark:hover:border-white/10"
              >
                <div className="flex items-center gap-3.5 text-start">
                  <div className="p-2.5 rounded-xl bg-slate-200 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10">
                    {acc.provider === 'apple' ? <Apple className="w-5 h-5 text-[#111827] dark:text-slate-200" /> : getProviderIcon(acc.provider)}
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#111827] dark:text-white block">
                      {isRtl ? acc.nameAr : acc.name}
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-slate-500 block mt-1 font-mono">
                      {isRtl ? acc.usernameAr : acc.username}
                    </span>
                  </div>
                </div>

                {/* Switch Connected Toggle */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${acc.connected ? 'text-sky-600 dark:text-cyan-400' : 'text-[#64748B] dark:text-slate-500'}`}>
                    {acc.connected ? (isRtl ? 'متصل' : 'Connected') : (isRtl ? 'غير متصل' : 'Disconnected')}
                  </span>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acc.connected}
                      onChange={() => handleToggleConnect(acc.id, isRtl ? acc.nameAr : acc.name, acc.connected)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500" />
                  </label>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Action toast feedback */}
        {toast && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2.5 animate-[slideIn_0.3s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-white dark:bg-[#182232] rounded-2xl p-4.5 border border-[#E2E8F0] dark:border-white/5 flex items-start gap-3 shadow-sm">
          <HelpCircle className="w-4 h-4 text-[#64748B] dark:text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed">
            {isRtl 
              ? 'إن ربط هذه الحسابات لا يمنح لودافيا أي صلاحية للوصول لبياناتك الخاصة أو النشر التلقائي، بل يُستخدم فقط لمطابقة الهوية وتسجيل الدخول السلس.' 
              : 'Linking authentication channels strictly handles identity validation and fast passkey handshakes; Lodavia never accesses your cloud data or reads external files.'}
          </p>
        </div>

      </div>

    </div>
  );
}
