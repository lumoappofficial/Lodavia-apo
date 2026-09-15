import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Sparkles, 
  Check, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Globe, 
  HardDrive, 
  Download 
} from 'lucide-react';

export default function OfflinePlusUpgrade() {
  const { lang, currentUser, setCurrentUser, playSynthSound } = useApp();
  const isRtl = lang === 'ar';

  const handleUpgradeOfflinePlus = () => {
    playSynthSound(880, 'sine', 0.1);
    setTimeout(() => playSynthSound(1320, 'sine', 0.25), 100);

    setCurrentUser(prev => ({
      ...prev,
      isPremium: true
    }));
  };

  return (
    <div className="flex flex-col gap-6 text-start">
      {/* Hero Banner */}
      <div className="relative overflow-hidden glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-purple-950/20 to-slate-950 flex flex-col gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <Crown className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-widest">
              LODAVIA Offline+
            </span>
            <h2 className="text-xl font-black text-white mt-1">
              {isRtl ? 'تجربة الأوفلاين الفائقة بدون حدود 🚀' : 'Unlimited Offline Power & Space Access 🚀'}
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
          {isRtl 
            ? 'احصل على قدرات التنزيل اللامحدودة لحزم الفضاء ثلاثية الأبعاد، والدورات الكاملة، ومزامنة الألعاب التلقائية بأقصى سرعة.'
            : 'Unlock unlimited storage for 3D space explorer datasets, full video course vaults, and priority sync queue.'}
        </p>

        {currentUser.isPremium ? (
          <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 w-fit">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? 'حسابك مفعل باشتراك LODAVIA Offline+ ⭐' : 'Your LODAVIA Offline+ Plan is Active ⭐'}</span>
          </div>
        ) : (
          <button
            onClick={handleUpgradeOfflinePlus}
            className="w-fit px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRtl ? 'التحديث لـ Offline+ مجاناً الآن' : 'Upgrade to Offline+ Now'}</span>
          </button>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free Plan */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isRtl ? 'الخطة المجانية Standard' : 'Standard Free Plan'}
          </h3>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isRtl ? 'حفظ حتى 50 عنصر في الذاكرة' : 'Save up to 50 offline items'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isRtl ? 'حزم الفضاء الأساسية (الأرض، المريخ، القمر)' : 'Basic space packs (Earth, Mars, Moon)'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isRtl ? 'ألعاب الأوفلاين الكونية' : 'Standard offline cosmic games'}</span>
            </li>
          </ul>
        </div>

        {/* Offline+ Plan */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
              {isRtl ? 'خطة LODAVIA Offline+' : 'LODAVIA Offline+'}
            </h3>
            <span className="text-xs font-mono font-bold text-amber-400">PRO</span>
          </div>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-200">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold">{isRtl ? 'مكتبة تنزيل لا محدودة بالكامل' : 'Unlimited download library'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold">{isRtl ? 'حزم المجموعة الشمسية والسدم السحيقة' : 'Full solar system & deep nebulae packs'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold">{isRtl ? 'أولوية المزامنة مع فحص السيرفر السريع' : 'Priority sync queue with instant verification'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold">{isRtl ? 'مزامنة متعددة الأجهزة فور عودة الشبكة' : 'Multi-device sync upon reconnect'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
