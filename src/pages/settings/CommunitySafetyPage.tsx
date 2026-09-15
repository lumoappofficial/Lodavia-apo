import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Check,
  Shield,
  UserX,
  BookOpen,
  Info,
  Heart,
  MessageSquare,
  Sparkles,
  Zap
} from 'lucide-react';
import SettingsSubpageHeader from '../../components/settings/SettingsSubpageHeader';

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  blockedDateAr: string;
  blockedDateEn: string;
}

export default function CommunitySafetyPage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();

  const isRtl = lang === 'ar';

  // State for simulated blocked users
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: 'block_1',
      name: 'SpammerBot99',
      username: '@spambot_99',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      blockedDateAr: '١٢ يوليو ٢٠٢٦',
      blockedDateEn: '12 July 2026'
    },
    {
      id: 'block_2',
      name: 'TrollKing',
      username: '@trollking_lodavia',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      blockedDateAr: '٠٥ يونيو ٢٠٢٦',
      blockedDateEn: '05 June 2026'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'blocked' | 'guidelines'>('blocked');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerSaveFeedback = (msgEn: string, msgAr: string, tone = 700) => {
    playSynthSound(tone, 'sine', 0.08);
    setToastMessage(isRtl ? msgAr : msgEn);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleUnblock = (id: string, name: string) => {
    playSynthSound(600, 'sine', 0.1);
    setBlockedUsers(prev => prev.filter(u => u.id !== id));
    triggerSaveFeedback(
      `Lifted restriction for ${name}. They can now view your orbit.`,
      `تم إلغاء حظر المستكشف ${name} بنجاح. يمكنه الآن رؤية فضاءك الكوني 🪐`
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 px-2 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Unified Settings Header */}
      <SettingsSubpageHeader
        title={isRtl ? 'أمان المجتمع والإرشادات 🛡️' : 'Community Safety & Guidelines 🛡️'}
        description={isRtl ? 'إدارة المستكشفين المحظورين والاطلاع على ميثاق شرف لودافيا' : 'Audit restricted accounts and study Lodavia civic protocols'}
        icon={Shield}
        iconColorClass="text-purple-600 dark:text-purple-400"
        iconBgClass="bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20"
      />

      <div className="relative z-10 flex flex-col gap-6 text-start">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Feedback Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-bold flex items-center gap-2 animate-[slideDown_0.25s_ease-out]">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border border-[#E2E8F0] dark:border-white/5 p-1 bg-slate-100 dark:bg-white/[0.02] rounded-2xl">
          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setActiveTab('blocked');
            }}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'blocked' 
                ? 'bg-purple-600 text-white dark:bg-purple-600/20 dark:text-purple-300 dark:border dark:border-purple-500/25 shadow-sm' 
                : 'text-[#475569] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white'
            }`}
          >
            <UserX className="w-4 h-4" />
            <span>{isRtl ? 'المستخدمون المحظورون' : 'Blocked Dimensions'}</span>
          </button>

          <button
            onClick={() => {
              playSynthSound(500, 'sine', 0.05);
              setActiveTab('guidelines');
            }}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'guidelines' 
                ? 'bg-purple-600 text-white dark:bg-purple-600/20 dark:text-purple-300 dark:border dark:border-purple-500/25 shadow-sm' 
                : 'text-[#475569] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isRtl ? 'إرشادات المجتمع 📜' : 'Community Guidelines 📜'}</span>
          </button>
        </div>

        {/* Tab 1: Blocked users list */}
        {activeTab === 'blocked' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex items-start gap-3">
              <Info className="w-4 h-4 text-[#64748B] dark:text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-normal">
                {isRtl 
                  ? 'الأشخاص الموجودون في قائمة الحظر الخاصة بك لا يمكنهم العثور على ملفك الشخصي، أو الانضمام إلى غرفك الصوتية، أو التفاعل مع منشوراتك.'
                  : 'Stargazers in your blocklist are permanently blocked from locating your profiles, peering at your streams, or listening to your voice hubs.'}
              </p>
            </div>

            {blockedUsers.length === 0 ? (
              <div className="bg-white dark:bg-[#182232] rounded-2xl p-12 border border-[#E2E8F0] dark:border-white/5 text-center shadow-sm">
                <Shield className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto opacity-40 mb-3" />
                <h3 className="text-xs font-black text-[#111827] dark:text-slate-300">
                  {isRtl ? 'فضاءك آمن ومثالي' : 'Your Orbit is Pristine'}
                </h3>
                <p className="text-[10px] text-[#64748B] dark:text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  {isRtl ? 'لا يوجد مستخدمون محظورون حالياً في هذا النطاق.' : 'No blocked users exist on your celestial coordinate system.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {blockedUsers.map((user) => (
                  <div 
                    key={user.id}
                    className="bg-white dark:bg-[#182232] rounded-2xl p-4.5 border border-[#E2E8F0] dark:border-white/5 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img 
                        src={user.avatar} 
                        alt={isRtl ? `الصورة الشخصية لـ ${user.name}` : `${user.name}'s avatar`} 
                        className="w-10 h-10 rounded-full border border-[#E2E8F0] dark:border-white/10 shrink-0 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-[#111827] dark:text-white truncate">{user.name}</h4>
                        <p className="text-[10px] text-[#64748B] dark:text-slate-500 mt-0.5 truncate">{user.username}</p>
                        <p className="text-[9px] text-[#64748B] dark:text-slate-600 mt-1 font-mono">
                          {isRtl ? `تم الحظر في: ${user.blockedDateAr}` : `Blocked on: ${user.blockedDateEn}`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUnblock(user.id, user.name)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 hover:border-purple-400 text-purple-700 dark:text-purple-400 text-xs font-bold cursor-pointer transition-all shrink-0"
                    >
                      {isRtl ? 'إلغاء الحظر ✓' : 'Lift Block ✓'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Guidelines placeholder content */}
        {activeTab === 'guidelines' && (
          <div className="bg-white dark:bg-[#182232] rounded-2xl p-6 border border-[#E2E8F0] dark:border-white/5 flex flex-col gap-5 leading-normal shadow-sm">
            
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0] dark:border-white/5">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
              <h3 className="text-sm font-black text-[#111827] dark:text-white">
                {isRtl ? 'ميثاق شرف مجتمع لودافيا الكوني 📜' : 'Lodavia Cosmic Charter & Code 📜'}
              </h3>
            </div>

            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              {isRtl 
                ? 'مرحباً بك في لودافيا! نحن نؤمن بأن الحوار والتواصل الإنساني الصادق هو جوهر التطور. من أجل الحفاظ على فضاء آمن وحضاري لكافة المستكشفين، يُرجى الالتزام بالبنود التالية:'
                : 'Welcome to Lodavia orbit! We thrive when dialogue is sincere, warm, and highly respectful. To maintain a safe atmosphere for stargazers, please honor our code:'}
            </p>

            <div className="flex flex-col gap-4 mt-2">
              
              {/* Item 1 */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-slate-100">
                    {isRtl ? '١. الاحترام والتعاطف المتبادل' : '1. Empathy & Safe Speech'}
                  </h4>
                  <p className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1">
                    {isRtl 
                      ? 'يُمنع منعاً باتاً ممارسة التنمر، التحرش، أو خطابات الكراهية بكافة أشكالها اللفظية أو البصرية.'
                      : 'Hate speech, toxicity, physical threats, and cyberbullying are strictly forbidden across all virtual rooms.'}
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3 border-t border-[#E2E8F0] dark:border-white/5 pt-4">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-sky-600 dark:text-cyan-400 shrink-0 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-slate-100">
                    {isRtl ? '٢. أصالة الهوية وصناعة القيمة' : '2. Identity Authenticity'}
                  </h4>
                  <p className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1">
                    {isRtl 
                      ? 'نشجع على مشاركة الأفكار الأصلية، ويمنع انتحال صفة الآخرين أو ترويج الأخبار المضللة بهدف الإساءة.'
                      : 'Share original content, keep debates intellectual, and prevent spamming channels with repetitive advertisements.'}
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3 border-t border-[#E2E8F0] dark:border-white/5 pt-4">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-slate-100">
                    {isRtl ? '٣. حماية البيانات والخصوصية' : '3. Privacy & Intellectual Assets'}
                  </h4>
                  <p className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1">
                    {isRtl 
                      ? 'يُحظر نشر معلومات شخصية للآخرين دون موافقتهم الصريحة والمكتوبة.'
                      : 'Do not publish or leak personal info, telephone logs, or secret documents of other explorers.'}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
