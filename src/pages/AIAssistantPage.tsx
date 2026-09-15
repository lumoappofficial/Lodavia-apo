import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import AIAssistant from '../components/AIAssistant';
import PageGlow from '../components/PageGlow';
import ProjectJuryModal from '../components/ProjectJuryModal';
import { themeStyles } from '../styles/theme';
import { AI_FEATURE_CATALOG } from '../types/subscription';
import { normalizeSubscription } from '../services/subscriptionService';
import {
  ArrowLeft, ArrowRight, MessageSquare, FileText, Sparkles, Bot, Calendar,
  Compass, DollarSign, FileEdit, Gamepad2, Handshake, Lightbulb, ShieldCheck,
  ShoppingBag, Target, TrendingUp, Video, Zap, Award, BarChart2, Briefcase,
  Lock, Crown, Scale, ArrowUpRight
} from 'lucide-react';

const ICONS: Record<string, React.ComponentType<any>> = {
  MessageSquare, FileText, Sparkles, Bot, Calendar, Compass, DollarSign,
  FileEdit, Gamepad2, Handshake, Lightbulb, ShieldCheck, ShoppingBag, Target,
  TrendingUp, Video, Zap, Award, BarChart2, Briefcase, Scale
};

const CATEGORY_LABELS: Record<string, { ar: string; en: string; icon: string }> = {
  general: { ar: 'عام', en: 'General', icon: '💬' },
  productivity: { ar: 'الإنتاجية', en: 'Productivity', icon: '⚡' },
  creator: { ar: 'صناعة المحتوى', en: 'Content Creation', icon: '🎬' },
  advanced: { ar: 'ميزات متقدمة', en: 'Advanced', icon: '🚀' },
  universe: { ar: 'استكشاف الكون', en: 'Universe Explorer', icon: '🪐' },
  marketplace: { ar: 'السوق', en: 'Marketplace', icon: '🛍️' },
  projects_business: { ar: 'المشاريع والأعمال', en: 'Projects & Business', icon: '💼' },
  games: { ar: 'الألعاب', en: 'Games', icon: '🎮' },
};

export default function AIAssistantPage() {
  const {
    currentUser, lang, communities, setCommunities,
    setHomePosts, setNewPostText, setShowCreateModal, playSynthSound
  } = useApp();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';
  const [chatOpen, setChatOpen] = useState(false);
  const [isJuryModalOpen, setIsJuryModalOpen] = useState(false);
  const [juryInitialContext, setJuryInitialContext] = useState<any>(null);

  const sub = normalizeSubscription(currentUser);
  const tierLevels: Record<string, number> = { free: 0, pro: 1, ultra: 2 };
  const usagePct = sub.dailyLimit > 0 ? Math.min(100, (sub.dailyRequestsUsed / sub.dailyLimit) * 100) : 0;

  const grouped = AI_FEATURE_CATALOG.reduce((acc: Record<string, typeof AI_FEATURE_CATALOG>, f) => {
    (acc[f.category] = acc[f.category] || []).push(f);
    return acc;
  }, {});

  const handleFeatureClick = (featureId: string, minTier: string) => {
    playSynthSound(600, 'sine', 0.05);
    const locked = tierLevels[minTier] > tierLevels[sub.tier];
    if (locked) {
      navigate('/ai/subscription');
      return;
    }

    if (featureId === 'project_evaluation') {
      setIsJuryModalOpen(true);
      return;
    }

    // If other features, open chat assistant with prompt
    setChatOpen(true);
  };

  const quickLinks = [
    { icon: MessageSquare, labelAr: 'مساعد الردود الذكي', labelEn: 'Smart Reply Assistant', to: '/ai-reply-assistant' },
    { icon: Calendar, labelAr: 'ملخص لودافيا اليومي', labelEn: 'Daily Lodavia Brief', to: '/ai-daily' },
    { icon: DollarSign, labelAr: 'اقتصاد المبدعين', labelEn: 'Creator Economy', to: '/creator-economy' },
    { icon: Crown, labelAr: 'ترقية الاشتراك', labelEn: 'Upgrade Subscription', to: '/ai-subscription' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gradient-void pb-24 relative text-slate-900 dark:text-white">
      <PageGlow color="nova" />

      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => { playSynthSound(400, 'sine', 0.08); navigate(-1); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white transition-all cursor-pointer"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span className="text-xs font-bold">{isRtl ? 'رجوع' : 'Back'}</span>
        </button>
        <h1 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-sky-500 dark:text-nova-400" />
          {isRtl ? 'الذكاء الاصطناعي في لودافيا' : 'Lodavia AI'}
        </h1>
        <div className="w-16" />
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4 relative z-10">
        <div className={`p-4 ${themeStyles.glassCard}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {isRtl ? 'استخدامك اليومي' : 'Your Daily Usage'}
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-500/10 dark:bg-nova-500/20 text-sky-600 dark:text-nova-400 border border-sky-500/30 dark:border-nova-500/30 uppercase">
              {sub.tier}
            </span>
          </div>
          <div className="flex items-end justify-between mb-1.5">
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {sub.dailyRequestsUsed} / {sub.dailyLimit}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{isRtl ? 'طلب اليوم' : 'requests today'}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-sky-500 dark:bg-gradient-nova transition-all duration-500" style={{ width: `${usagePct}%` }} />
          </div>
          {sub.tier !== 'ultra' && (
            <button
              onClick={() => navigate('/ai-subscription')}
              className="mt-3 text-[10px] font-bold text-amber-600 dark:text-ember-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Crown className="w-3 h-3" />
              {isRtl ? 'ترقية للحصول على طلبات أكثر' : 'Upgrade for more requests'}
            </button>
          )}
        </div>

        <button
          onClick={() => { playSynthSound(600, 'sine', 0.1); setChatOpen(true); }}
          className={`w-full py-4 flex items-center justify-center gap-2 ${themeStyles.buttonPrimary}`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold">{isRtl ? 'افتح المحادثة الذكية الشاملة' : 'Open Full AI Conversation'}</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.to}
              onClick={() => { playSynthSound(450, 'sine', 0.06); navigate(link.to); }}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 hover:border-sky-500/50 dark:hover:border-aurora-500/30 flex flex-col items-start gap-2 text-start transition-all shadow-sm cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:bg-aurora-500/15 dark:text-aurora-400">
                <link.icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                {isRtl ? link.labelAr : link.labelEn}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-2">
          {Object.entries(grouped).map(([category, features]) => {
            const catLabel = CATEGORY_LABELS[category] || { ar: category, en: category, icon: '✨' };
            return (
              <div key={category}>
                <h2 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <span>{catLabel.icon}</span>
                  <span>{isRtl ? catLabel.ar : catLabel.en}</span>
                </h2>
                <div className="flex flex-col gap-2">
                  {features.map((feature) => {
                    const Icon = ICONS[feature.iconName] || Sparkles;
                    const locked = tierLevels[feature.minTier] > tierLevels[sub.tier];
                    const isJury = feature.id === 'project_evaluation';

                    return (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => handleFeatureClick(feature.id, feature.minTier)}
                        className={`w-full text-start p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all cursor-pointer group ${
                          isJury
                            ? 'border-purple-500/40 bg-gradient-to-r from-purple-950/20 via-slate-900/60 to-slate-900/60 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-950/30'
                            : locked 
                            ? 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 opacity-70 hover:opacity-100' 
                            : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-sm hover:border-purple-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl border shrink-0 transition ${
                          isJury
                            ? 'bg-purple-900/40 border-purple-500/40 text-purple-300 group-hover:scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-300 transition">
                              {isRtl ? feature.titleAr : feature.titleEn}
                            </h3>
                            {isJury && (
                              <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                {isRtl ? "⚖️ لجنة AI" : "⚖️ AI Jury"}
                              </span>
                            )}
                            {locked && (
                              <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                                <Lock className="w-2.5 h-2.5" />
                                {feature.minTier}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {isRtl ? feature.descriptionAr : feature.descriptionEn}
                          </p>
                        </div>
                        <div className="shrink-0 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-0.5 transition">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Jury Modal */}
      <ProjectJuryModal
        isOpen={isJuryModalOpen}
        onClose={() => setIsJuryModalOpen(false)}
        lang={lang}
        initialProjectData={juryInitialContext}
        onTriggerTool={(toolId, context) => {
          setChatOpen(true);
        }}
      />

      {chatOpen && (
        <AIAssistant
          currentUser={currentUser}
          lang={lang}
          activeTab="assistant"
          communities={communities}
          setCommunities={setCommunities}
          setHomePosts={setHomePosts}
          setNewPostText={setNewPostText}
          setShowCreateModal={setShowCreateModal}
          playSynthSound={playSynthSound}
          startOpen
        />
      )}
    </div>
  );
}
