import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  Send, 
  Check, 
  Plus, 
  X, 
  Settings, 
  Lock, 
  Unlock, 
  Languages, 
  Cpu, 
  Layers, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Twitter, 
  CheckSquare, 
  Square, 
  Edit, 
  Save, 
  AlertCircle, 
  Trash2,
  ListChecks
} from 'lucide-react';
import { AppUser } from '../types';

interface AIReplyAssistantProps {
  currentUser: AppUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<AppUser>>;
  lang: string;
  playSynthSound: (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number) => void;
}

interface SimulatedComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  platform: string;
  timestamp: string;
  category: string;
  replies: { professional: string; friendly: string; sales: string } | null;
  status: 'pending' | 'replied';
  chosenReply: string;
  selectedSuggestionType: 'professional' | 'friendly' | 'sales';
  isEditing: boolean;
  editingText: string;
}

export default function AIReplyAssistant({
  currentUser,
  setCurrentUser,
  lang,
  playSynthSound
}: AIReplyAssistantProps) {
  // 1. Pro Status & Limits
  const [isPro, setIsPro] = useState<boolean>(() => {
    return currentUser.purchasedItems.includes('lumo_pro') || localStorage.getItem('lumo_pro_subscribed') === 'true';
  });

  const [usageToday, setUsageToday] = useState<number>(() => {
    const saved = localStorage.getItem('lumo_reply_usage_today');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Track selected tab
  const [activeTab, setActiveTab] = useState<'inbox' | 'integrations' | 'settings'>('inbox');

  // Paywall upgrade modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // 2. Configurations State
  const [brandVoice, setBrandVoice] = useState<string>(() => {
    return localStorage.getItem('lumo_brand_voice_tone') || 'Professional';
  });

  const [customVoice, setCustomVoice] = useState<string>(() => {
    return localStorage.getItem('lumo_custom_brand_voice') || '';
  });

  const [isSavingCustomVoice, setIsSavingCustomVoice] = useState(false);

  const [selectedDialect, setSelectedDialect] = useState<string>(() => {
    return localStorage.getItem('lumo_reply_dialect') || 'none';
  });

  // 3. Platform Connections
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    instagram: true,
    facebook: true,
    twitter: true,
    linkedin: true,
    tiktok: false,
    youtube: false
  });

  // 4. Comments State
  const [comments, setComments] = useState<SimulatedComment[]>([
    {
      id: 'cmt-1',
      author: 'Sarah Al-Mansoori',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: 'بكم سعر هذا المنتج وهل تتوفر خدمة التوصيل للرياض؟',
      platform: 'instagram',
      timestamp: '5m ago',
      category: '',
      replies: null,
      status: 'pending',
      chosenReply: '',
      selectedSuggestionType: 'sales',
      isEditing: false,
      editingText: ''
    },
    {
      id: 'cmt-2',
      author: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      text: 'I ordered the premium bundle yesterday, but I haven\'t received the onboarding email yet. Can someone help?',
      platform: 'linkedin',
      timestamp: '15m ago',
      category: '',
      replies: null,
      status: 'pending',
      chosenReply: '',
      selectedSuggestionType: 'professional',
      isEditing: false,
      editingText: ''
    },
    {
      id: 'cmt-3',
      author: 'أبو فهد العتيبي',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      text: 'يا جماعة التطبيق خيالي وسهل جداً بالاستخدام، أفضل تجربة مريت فيها بالتوفيق 👍',
      platform: 'facebook',
      timestamp: '32m ago',
      category: '',
      replies: null,
      status: 'pending',
      chosenReply: '',
      selectedSuggestionType: 'friendly',
      isEditing: false,
      editingText: ''
    },
    {
      id: 'cmt-4',
      author: 'Youssef Egyptian',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      text: 'هو الخدمة دي بتشتغل في مصر عادي ولا في قيود على المحادثات الصوتية؟ وشكراً',
      platform: 'youtube',
      timestamp: '1h ago',
      category: '',
      replies: null,
      status: 'pending',
      chosenReply: '',
      selectedSuggestionType: 'professional',
      isEditing: false,
      editingText: ''
    },
    {
      id: 'cmt-5',
      author: 'CryptoHype spam-bot',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      text: 'Invest 100$ and get 5000$ in 1 day! Click the link in my bio to start making passive income now fast guaranteed profit!',
      platform: 'twitter',
      timestamp: '2h ago',
      category: '',
      replies: null,
      status: 'pending',
      chosenReply: '',
      selectedSuggestionType: 'friendly',
      isEditing: false,
      editingText: ''
    }
  ]);

  // Multiselect for Batch replies
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  // Loading state for single comment reply generation
  const [generatingCommentId, setGeneratingCommentId] = useState<string | null>(null);

  // Success notify
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom added comment input
  const [customCommentText, setCustomCommentText] = useState('');
  const [customCommentPlatform, setCustomCommentPlatform] = useState('instagram');
  const [customCommentAuthor, setCustomCommentAuthor] = useState('');

  // 5. Upgrade logic
  const handleUpgradeToPro = () => {
    playSynthSound(880, 'sine', 0.15);
    setTimeout(() => playSynthSound(1320, 'sine', 0.3), 100);

    // Give user pro items, sync store
    setCurrentUser(prev => ({
      ...prev,
      purchasedItems: [...prev.purchasedItems, 'lumo_pro']
    }));
    localStorage.setItem('lumo_pro_subscribed', 'true');
    setIsPro(true);
    setShowUpgradeModal(false);
    triggerToast(lang === 'ar' ? 'تهانينا! لقد قمت بالترقية إلى Lodavia Pro الكوني بنجاح 🚀👑' : 'Congrats! Successfully upgraded to Lodavia Pro 🚀👑');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 6. Connect Platform Switcher
  const togglePlatform = (plat: keyof typeof connectedPlatforms) => {
    playSynthSound(600, 'sine', 0.05);
    setConnectedPlatforms(prev => ({
      ...prev,
      [plat]: !prev[plat]
    }));
  };

  // 7. Save Custom Brand Voice
  const handleSaveCustomVoice = () => {
    if (!isPro) {
      playSynthSound(200, 'sawtooth', 0.2);
      setShowUpgradeModal(true);
      return;
    }
    setIsSavingCustomVoice(true);
    playSynthSound(750, 'sine', 0.1);
    setTimeout(() => {
      localStorage.setItem('lumo_custom_brand_voice', customVoice);
      localStorage.setItem('lumo_brand_voice_tone', 'Custom Voice');
      setBrandVoice('Custom Voice');
      setIsSavingCustomVoice(false);
      triggerToast(lang === 'ar' ? 'تم حفظ نبرة الصوت المخصصة لعلامتك التجارية بنجاح! 🧠' : 'Saved custom brand voice parameters successfully! 🧠');
    }, 800);
  };

  // 8. Generate suggestions for a single comment via Backend
  const handleGenerateAISuggestions = async (comment: SimulatedComment) => {
    // Check usage limits for free users
    if (!isPro && usageToday >= 20) {
      playSynthSound(220, 'sawtooth', 0.25);
      setShowUpgradeModal(true);
      return;
    }

    setGeneratingCommentId(comment.id);
    playSynthSound(500, 'sine', 0.05);
    
    try {
      const response = await fetch('/api/ai/reply-assistant/analyze-and-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentText: comment.text,
          platform: comment.platform,
          brandVoice: brandVoice === 'Custom Voice' ? customVoice : brandVoice,
          dialect: selectedDialect,
          lang: lang
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setComments(prev => prev.map(c => {
        if (c.id === comment.id) {
          return {
            ...c,
            category: data.category || 'Positive Feedback',
            replies: data.suggestions || { professional: 'A standard professional reply', friendly: 'Hey! Thanks for the support!', sales: 'Unlock now on our website!' },
            chosenReply: data.suggestions ? data.suggestions[c.selectedSuggestionType] : '',
            editingText: data.suggestions ? data.suggestions[c.selectedSuggestionType] : ''
          };
        }
        return c;
      }));

      // Increment usage count
      const newUsage = usageToday + 1;
      setUsageToday(newUsage);
      localStorage.setItem('lumo_reply_usage_today', newUsage.toString());

      playSynthSound(980, 'sine', 0.15);
      triggerToast(lang === 'ar' ? 'تم توليد الردود الذكية وتصنيف التعليق بنجاح!' : 'Generated suggestions & classified comment successfully!');
    } catch (err: any) {
      console.error(err);
      playSynthSound(220, 'sawtooth', 0.2);
      triggerToast(lang === 'ar' ? 'عذراً، فشل توليد الرد الكوني. حاول مجدداً.' : 'Stellar link timeout. Please try again.');
    } finally {
      setGeneratingCommentId(null);
    }
  };

  // 9. Batch Reply All with AI
  const handleReplyAllWithAI = async () => {
    if (!isPro) {
      playSynthSound(220, 'sawtooth', 0.25);
      setShowUpgradeModal(true);
      return;
    }

    if (selectedCommentIds.length === 0) {
      triggerToast(lang === 'ar' ? 'يرجى تحديد تعليق واحد على الأقل أولاً!' : 'Please select at least one comment to bulk reply!');
      return;
    }

    setIsGeneratingBatch(true);
    playSynthSound(600, 'triangle', 0.1);
    
    try {
      const commentsToReply = comments.filter(c => selectedCommentIds.includes(c.id));
      const payloadComments = commentsToReply.map(c => ({ id: c.id, text: c.text, platform: c.platform }));

      const response = await fetch('/api/ai/reply-assistant/reply-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comments: payloadComments,
          brandVoice: brandVoice === 'Custom Voice' ? customVoice : brandVoice,
          dialect: selectedDialect,
          lang: lang
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Map replies back
      setComments(prev => prev.map(c => {
        const generated = data.replies?.find((r: any) => r.commentId === c.id);
        if (generated) {
          return {
            ...c,
            category: generated.category || 'Positive Feedback',
            replies: {
              professional: generated.reply,
              friendly: generated.reply,
              sales: generated.reply
            },
            chosenReply: generated.reply,
            editingText: generated.reply,
            status: 'pending' // Ready for edit or review
          };
        }
        return c;
      }));

      setSelectedCommentIds([]);
      playSynthSound(1046.5, 'sine', 0.25);
      triggerToast(lang === 'ar' ? `تم توليد ردود ذكية فريدة لـ ${commentsToReply.length} تعليقات دفعة واحدة! 🚀` : `Successfully crafted unique bulk replies for ${commentsToReply.length} comments! 🚀`);
    } catch (err: any) {
      console.error(err);
      playSynthSound(220, 'sawtooth', 0.2);
      triggerToast(lang === 'ar' ? 'فشل إرسال الدفعة الكونية.' : 'Stellar batch connection failed.');
    } finally {
      setIsGeneratingBatch(false);
    }
  };

  // 10. Send individual reply
  const handleSendReply = (commentId: string) => {
    playSynthSound(800, 'sine', 0.1);
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          status: 'replied'
        };
      }
      return c;
    }));
    triggerToast(lang === 'ar' ? 'تم إرسال الرد الذكي إلى المنصة بنجاح! 📡' : 'AI Reply transmitted to social node successfully! 📡');
  };

  // 11. Custom Comment insertion
  const handleAddCustomComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommentText.trim()) return;

    playSynthSound(550, 'sine', 0.08);

    const newCmt: SimulatedComment = {
      id: `cmt-${Date.now()}`,
      author: customCommentAuthor.trim() || (lang === 'ar' ? 'متابع كوني جديد' : 'Stellar Explorer'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      text: customCommentText,
      platform: customCommentPlatform,
      timestamp: 'Just now',
      category: '',
      replies: null,
      status: 'pending',
      chosenReply: '',
      selectedSuggestionType: 'professional',
      isEditing: false,
      editingText: ''
    };

    setComments(prev => [newCmt, ...prev]);
    setCustomCommentText('');
    setCustomCommentAuthor('');
    triggerToast(lang === 'ar' ? 'تم استيراد التعليق الجديد إلى تيار المراجعة!' : 'Imported comment to stream successfully!');
  };

  // Filter comments based on connected platforms
  const filteredComments = comments.filter(c => connectedPlatforms[c.platform as keyof typeof connectedPlatforms]);

  // Color mappings for badged categories
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Purchase Intent':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
      case 'Question':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/20';
      case 'Complaint':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
      case 'Positive Feedback':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/20';
      case 'Negative Comment':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      case 'Spam':
        return 'bg-slate-500/25 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border-white/5';
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto flex flex-col gap-6 text-[#111827] dark:text-slate-100">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-panel border border-sky-400/50 dark:border-cyan-500/30 px-5 py-3 rounded-full text-xs font-bold text-sky-700 dark:text-cyan-300 shadow-2xl flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
          <Sparkles className="w-4 h-4 text-sky-500 dark:text-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#0c0c14] dark:via-slate-900/60 dark:to-purple-950/20 border border-[#E2E8F0] dark:border-white/10 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-60 h-60 bg-sky-600/5 dark:bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-sky-500/15 text-sky-600 dark:text-cyan-400 px-3 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1.5 border border-sky-500/20 dark:border-cyan-500/20">
                <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
                <span>PREMIUM SUITE</span>
              </span>
              
              {isPro ? (
                <span className="text-[10px] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                  👑 PRO ACTIVE
                </span>
              ) : (
                <span className="text-[10px] bg-slate-200 dark:bg-slate-500/20 text-[#475569] dark:text-slate-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  FREE PLAN
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] dark:text-white mt-3 tracking-tight">
              {lang === 'ar' ? 'مساعد لودافيا للرد الذكي بالذكاء الاصطناعي 🚀' : 'Lodavia AI Reply Assistant 🚀'}
            </h1>
            <p className="text-[#475569] dark:text-slate-400 text-xs md:text-sm mt-1.5 max-w-2xl leading-relaxed">
              {lang === 'ar' 
                ? 'حوّل منصة Lodavia إلى عصب تحكم مركزي ذكي لإدارة جميع تعليقات قنوات التواصل الاجتماعي وتوليد ردود شخصية بلمحة بصر وبمختلف اللهجات العربية.' 
                : 'Turn Lodavia into a cosmic operations center to import social comments, run neural analysis, and synthesize perfectly tailored, unique replies with lightning speed.'}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            {/* Pro subscription toggle */}
            {!isPro && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/10 cursor-pointer flex items-center justify-center gap-2 shrink-0 animate-bounce"
              >
                <Sparkles className="w-4 h-4 fill-slate-950 animate-pulse" />
                <span>{lang === 'ar' ? 'الترقية إلى Lodavia Pro الكوني 👑' : 'Upgrade to Lodavia Pro 👑'}</span>
              </button>
            )}

            {/* Daily Usage indicator */}
            <div className="text-center md:text-end">
              <span className="text-xs text-[#475569] dark:text-slate-400">
                {lang === 'ar' ? 'معدل الاستخدام اليومي:' : 'AI Generation Usage Today:'}{' '}
                <strong className={isPro ? 'text-sky-600 dark:text-cyan-400' : 'text-purple-600 dark:text-purple-400'}>
                  {isPro ? '∞' : `${usageToday}/20`}
                </strong>
              </span>
              {!isPro && (
                <div className="w-full md:w-48 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full mt-1 overflow-hidden border border-[#E2E8F0] dark:border-white/5">
                  <div 
                    className="h-full bg-purple-500 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (usageToday / 20) * 100)}%` }} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INNER PAGE NAVIGATION */}
        <div className="flex border-t border-[#E2E8F0] dark:border-white/5 mt-6 pt-4 gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'inbox', labelAr: '📥 صندوق الوارد الكوني', labelEn: '📥 Cosmic Comment Inbox' },
            { id: 'integrations', labelAr: '🔌 بوابة الدمج الاجتماعي', labelEn: '🔌 Platform Integrations' },
            { id: 'settings', labelAr: '🎭 هوية الصوت واللهجات', labelEn: '🎭 Voice & Dialects' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playSynthSound(500, 'sine', 0.05);
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                  : 'bg-[#F4F7FA] dark:bg-white/5 border-[#E2E8F0] dark:border-transparent text-[#475569] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white'
              }`}
            >
              {lang === 'ar' ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* CORE WORKSPACE SUB-SCREENS */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT AREA: COMMENTS STREAM (2 SPAN) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Filter toolbar and Batch Actions */}
            <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <ListChecks className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-300">
                  {lang === 'ar' ? 'الإجراءات الجماعية الذكية:' : 'Smart Batch Operations:'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Select All */}
                <button
                  onClick={() => {
                    playSynthSound(500, 'sine', 0.05);
                    if (selectedCommentIds.length === filteredComments.length) {
                      setSelectedCommentIds([]);
                    } else {
                      setSelectedCommentIds(filteredComments.map(c => c.id));
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold text-slate-300 transition-all cursor-pointer"
                >
                  {selectedCommentIds.length === filteredComments.length 
                    ? (lang === 'ar' ? 'إلغاء التحديد ✖' : 'Deselect All ✖') 
                    : (lang === 'ar' ? 'تحديد الكل ✔' : 'Select All ✔')}
                </button>

                {/* Reply All */}
                <button
                  onClick={handleReplyAllWithAI}
                  disabled={isGeneratingBatch || selectedCommentIds.length === 0}
                  className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-[10px] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-1"
                >
                  {isGeneratingBatch ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{lang === 'ar' ? 'جاري الصياغة...' : 'Crafting...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>{lang === 'ar' ? 'صياغة ردود للكل معاً (Pro) 🚀' : 'Reply All with AI (Pro) 🚀'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulated comments container */}
            <div className="flex flex-col gap-4">
              {filteredComments.length === 0 ? (
                <div className="glass-panel p-10 rounded-3xl border border-white/5 text-center flex flex-col items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-300">
                    {lang === 'ar' ? 'لا توجد تعليقات مستوردة' : 'No Comments Found'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    {lang === 'ar' 
                      ? 'يرجى تفعيل الاتصال بمنصات التواصل من بوابة الدمج أو إضافة تعليق اختبار مخصص من اللوحة الجانبية.'
                      : 'Ensure platforms are toggled connected in the Integrations Hub, or input a custom test comment from the sidebar.'}
                  </p>
                </div>
              ) : (
                filteredComments.map((comment) => {
                  const isSelected = selectedCommentIds.includes(comment.id);
                  return (
                    <div 
                      key={comment.id}
                      className={`glass-panel p-5 rounded-3xl border transition-all duration-300 relative group flex flex-col gap-4 ${
                        comment.status === 'replied' 
                          ? 'border-emerald-500/20 bg-emerald-950/5 opacity-75' 
                          : isSelected 
                            ? 'border-purple-500/40 bg-purple-950/5' 
                            : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      {/* Top metadata row */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3">
                          
                          {/* Selection Checkbox */}
                          {comment.status === 'pending' && (
                            <button
                              onClick={() => {
                                playSynthSound(500, 'sine', 0.05);
                                if (isSelected) {
                                  setSelectedCommentIds(prev => prev.filter(id => id !== comment.id));
                                } else {
                                  setSelectedCommentIds(prev => [...prev, comment.id]);
                                }
                              }}
                              className="text-slate-500 hover:text-purple-400 transition"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-purple-400" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          <img src={comment.avatar} alt={comment.author} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                          
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{comment.author}</span>
                              <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                            </div>

                            {/* Platform badge */}
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                              {comment.platform === 'instagram' && <Instagram className="w-3 h-3 text-pink-400" />}
                              {comment.platform === 'facebook' && <Facebook className="w-3 h-3 text-blue-400" />}
                              {comment.platform === 'linkedin' && <Linkedin className="w-3 h-3 text-sky-400" />}
                              {comment.platform === 'youtube' && <Youtube className="w-3 h-3 text-red-500" />}
                              {comment.platform === 'twitter' && <Twitter className="w-3 h-3 text-slate-300" />}
                              <span>{comment.platform}</span>
                            </span>
                          </div>
                        </div>

                        {/* Smart category classification badge */}
                        {comment.category && (
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryColor(comment.category)}`}>
                            {lang === 'ar' ? (
                              comment.category === 'Purchase Intent' ? 'نية شراء 🛍️' :
                              comment.category === 'Question' ? 'سؤال ❓' :
                              comment.category === 'Complaint' ? 'شكوى ⚠️' :
                              comment.category === 'Positive Feedback' ? 'إيجابي 👍' :
                              comment.category === 'Negative Comment' ? 'سلبي 👎' : 'سبام 🚫'
                            ) : comment.category}
                          </span>
                        )}
                      </div>

                      {/* Comment text body */}
                      <div className="text-xs text-slate-300 leading-relaxed pl-7 italic">
                        "{comment.text}"
                      </div>

                      {/* AI GENERATION CONTROLS / RESULT */}
                      <div className="pl-7 pt-3 border-t border-white/5">
                        
                        {comment.replies === null ? (
                          // Action Button to trigger AI suggestion
                          <button
                            onClick={() => handleGenerateAISuggestions(comment)}
                            disabled={generatingCommentId === comment.id}
                            className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:bg-purple-900/40 text-slate-950 font-black text-[10px] transition-all flex items-center gap-1.5 shadow-md"
                          >
                            {generatingCommentId === comment.id ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
                                <span>{lang === 'ar' ? 'جاري صياغة التوصيات...' : 'Synthesizing Answers...'}</span>
                              </>
                            ) : (
                              <>
                                <Brain className="w-3.5 h-3.5 animate-pulse" />
                                <span>{lang === 'ar' ? 'تحليل وصياغة ردود ذكية 🪄' : 'Analyze & Suggest Replies 🪄'}</span>
                              </>
                            )}
                          </button>
                        ) : (
                          // Generated suggestion tabs & edit container
                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                {lang === 'ar' ? 'مستويات الرد الكونية المقترحة:' : 'Generated reply levels:'}
                              </span>

                              <div className="flex gap-1.5">
                                {[
                                  { type: 'professional', labelAr: 'مهني 👔', labelEn: 'Professional 👔' },
                                  { type: 'friendly', labelAr: 'ودود 😊', labelEn: 'Friendly 😊' },
                                  { type: 'sales', labelAr: 'مبيعات 🛍️', labelEn: 'Sales Expert 🛍>' }
                                ].map((tab) => (
                                  <button
                                    key={tab.type}
                                    onClick={() => {
                                      playSynthSound(440, 'sine', 0.05);
                                      setComments(prev => prev.map(c => {
                                        if (c.id === comment.id && c.replies) {
                                          return {
                                            ...c,
                                            selectedSuggestionType: tab.type as any,
                                            chosenReply: c.replies[tab.type as keyof typeof c.replies],
                                            editingText: c.replies[tab.type as keyof typeof c.replies]
                                          };
                                        }
                                        return c;
                                      }));
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition ${
                                      comment.selectedSuggestionType === tab.type
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'bg-white/5 text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    {lang === 'ar' ? tab.labelAr : tab.labelEn}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Active suggestions editable block */}
                            <div className="glass-panel p-3.5 rounded-2xl border border-white/10 bg-black/30 flex flex-col gap-2">
                              {comment.isEditing ? (
                                <textarea
                                  value={comment.editingText}
                                  onChange={(e) => {
                                    setComments(prev => prev.map(c => {
                                      if (c.id === comment.id) {
                                        return { ...c, editingText: e.target.value };
                                      }
                                      return c;
                                    }));
                                  }}
                                  rows={3}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all font-sans"
                                />
                              ) : (
                                <p className="text-xs text-slate-300 leading-relaxed font-sans select-all whitespace-pre-line">
                                  {comment.chosenReply}
                                </p>
                              )}

                              {/* Footer controls for single reply */}
                              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                <div className="flex gap-2">
                                  {comment.isEditing ? (
                                    <button
                                      onClick={() => {
                                        playSynthSound(750, 'sine', 0.05);
                                        setComments(prev => prev.map(c => {
                                          if (c.id === comment.id) {
                                            return {
                                              ...c,
                                              isEditing: false,
                                              chosenReply: c.editingText
                                            };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded-lg flex items-center gap-1 transition"
                                    >
                                      <Save className="w-3 h-3" />
                                      <span>{lang === 'ar' ? 'حفظ التعديل' : 'Save'}</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        playSynthSound(600, 'sine', 0.05);
                                        setComments(prev => prev.map(c => {
                                          if (c.id === comment.id) {
                                            return { ...c, isEditing: true };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="text-[10px] text-slate-400 font-bold hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg flex items-center gap-1 transition"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>{lang === 'ar' ? 'تعديل الرد' : 'Edit Response'}</span>
                                    </button>
                                  )}
                                </div>

                                {comment.status === 'pending' ? (
                                  <button
                                    onClick={() => handleSendReply(comment.id)}
                                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] transition-all flex items-center gap-1 shadow"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>{lang === 'ar' ? 'إرسال الرد 📡' : 'Transmit Reply 📡'}</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-emerald-400 font-black flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>{lang === 'ar' ? 'تم الرد بنجاح' : 'TRANSMITTED'}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT PANEL: ADD TEST COMMENT / QUICK STATS (1 SPAN) */}
          <div className="flex flex-col gap-6">
            
            {/* Add Custom Social Comment Block */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col gap-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'استيراد تعليق اختبار مخصص' : 'Simulate Custom Import'}</span>
              </h3>

              <form onSubmit={handleAddCustomComment} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'اسم كاتب التعليق' : 'Comment Author'}</label>
                  <input
                    type="text"
                    value={customCommentAuthor}
                    onChange={(e) => setCustomCommentAuthor(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: أحمد الودعاني' : 'e.g. Liam Sterling'}
                    className="glass-input p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'منصة التواصل' : 'Social Network'}</label>
                  <select
                    value={customCommentPlatform}
                    onChange={(e) => setCustomCommentPlatform(e.target.value)}
                    className="glass-input p-2 text-xs bg-slate-950/80 border border-white/10 rounded-xl text-slate-300 focus:outline-none"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'نص التعليق' : 'Comment Text'}</label>
                  <textarea
                    value={customCommentText}
                    onChange={(e) => setCustomCommentText(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب نصاً في الموضة، التقنية، الشكوى، أو المبيعات هنا لتجربة الذكاء الاصطناعي...' : 'Type feedback, questions, purchase intent, or complaint to test neural model...'}
                    rows={3}
                    className="glass-input p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all font-sans"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-950" />
                  <span>{lang === 'ar' ? 'استيراد فوري للتعليق 📥' : 'Import Test Comment 📥'}</span>
                </button>
              </form>
            </div>

            {/* Quick Insights / Analytics */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col gap-4 bg-gradient-to-br from-[#0c0c14] to-purple-950/5">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>{lang === 'ar' ? 'إحصائيات المعالجة الذكية' : 'AI Performance Nodes'}</span>
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 font-bold">{lang === 'ar' ? 'سرعة المعالجة الكونية:' : 'Stellar Inference Latency:'}</span>
                  <span className="text-[10px] text-cyan-400 font-black">0.82s</span>
                </div>

                <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 font-bold">{lang === 'ar' ? 'دقة التصنيف التلقائي:' : 'Categorization Accuracy:'}</span>
                  <span className="text-[10px] text-purple-400 font-black">98.9%</span>
                </div>

                <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 font-bold">{lang === 'ar' ? 'معدل رضا المتابعين:' : 'Social Resonance Rate:'}</span>
                  <span className="text-[10px] text-emerald-400 font-black">+42.6%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-base font-extrabold text-white">
              {lang === 'ar' ? 'بوابة دمج الحسابات الاجتماعية 🔌' : 'Social Platforms Gate 🔌'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar' 
                ? 'قم بربط ومزامنة حسابات صانع المحتوى أو متجرك الخاص لاستيراد التعليقات تلقائياً وتفعيل تيار المعالجة الذكي.'
                : 'Configure hooks & sync permissions to channel active social comments into Lodavia\'s AI Assistant interface.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'instagram', icon: Instagram, color: 'from-pink-500 via-purple-500 to-yellow-500 shadow-pink-500/10', title: 'Instagram Professional', desc: 'Sync comments, direct messages, and story replies.' },
              { id: 'facebook', icon: Facebook, color: 'from-blue-600 to-blue-800 shadow-blue-600/10', title: 'Facebook Pages', desc: 'Import posts feed comments and private inbox chats.' },
              { id: 'twitter', icon: Twitter, color: 'from-slate-800 to-black shadow-slate-400/5', title: 'X / Twitter Node', desc: 'Monitor tweets mentions, replies, and private threads.' },
              { id: 'linkedin', icon: Linkedin, color: 'from-blue-500 to-cyan-600 shadow-blue-500/10', title: 'LinkedIn Enterprise', desc: 'Manage company page articles comments and career requests.' },
              { id: 'youtube', icon: Youtube, color: 'from-red-600 to-red-800 shadow-red-500/10', title: 'YouTube Creators (Pro)', desc: 'Scan and automatically respond to video & shorts comment streams.', isProOnly: true },
              { id: 'tiktok', icon: MessageCircle, color: 'from-slate-900 to-slate-950 shadow-slate-900/10', title: 'TikTok Store (Pro)', desc: 'Integrate instant TikTok videos comment feeds and interactive Q&A.', isProOnly: true }
            ].map((plat) => {
              const isConnected = connectedPlatforms[plat.id as keyof typeof connectedPlatforms];
              const Icon = plat.icon;
              return (
                <div 
                  key={plat.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden ${
                    isConnected ? 'border-cyan-500/30' : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${plat.color} text-white shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-black text-white">{plat.title}</h3>
                        {plat.isProOnly && (
                          <span className="text-[8px] bg-amber-500/15 text-amber-400 font-extrabold px-1.5 py-0.5 rounded-full border border-amber-500/20">
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {plat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/5 relative z-10">
                    <span className="text-[9px] text-slate-500 font-black uppercase">
                      {isConnected ? (lang === 'ar' ? '● نشط ومزامن' : '● SYNCED ACTIVE') : (lang === 'ar' ? '○ مفصول' : '○ DISCONNECTED')}
                    </span>

                    <button
                      onClick={() => {
                        if (plat.isProOnly && !isPro) {
                          playSynthSound(220, 'sawtooth', 0.25);
                          setShowUpgradeModal(true);
                          return;
                        }
                        togglePlatform(plat.id as any);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black transition-all cursor-pointer ${
                        isConnected
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'
                          : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white'
                      }`}
                    >
                      {isConnected ? (lang === 'ar' ? 'فصل الخدمة' : 'Disconnect') : (lang === 'ar' ? 'ربط القناة 🔗' : 'Connect Node 🔗')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.3s_ease-out]">
          
          {/* BRAND VOICE SELECTOR */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
              <span>{lang === 'ar' ? 'نبرة الصوت للعلامة التجارية 🎭' : 'Brand Voice Profile 🎭'}</span>
            </h2>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'اختر النبرة الافتراضية التي يتبناها الذكاء الاصطناعي عند صياغة الردود والمحادثات لتعكس ملامح هويتك بدقة.'
                : 'Select the primary voice paradigm for AI response generation. Each reply will adapt to match this chosen style.'}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { id: 'Professional', labelAr: 'مهني رصين 💼', labelEn: 'Professional 💼', desc: 'Polite, corporate, accurate' },
                { id: 'Friendly', labelAr: 'ودود للغاية 😊', labelEn: 'Friendly 😊', desc: 'Warm, cheerful, welcoming' },
                { id: 'Funny', labelAr: 'إبداعي مرح 🤪', labelEn: 'Funny 🤪', desc: 'Witty, joking, viral' },
                { id: 'Luxury', labelAr: 'فاخر راقي ✨', labelEn: 'Luxury ✨', desc: 'Prestigious, grand, elegant' },
                { id: 'Formal', labelAr: 'رسمي بروتوكولي 🏛️', labelEn: 'Formal 🏛️', desc: 'Respectful, clean, protocol' },
                { id: 'Sales Expert', labelAr: 'خبير مبيعات 🛍️', labelEn: 'Sales Expert 🛍️', desc: 'High conversion call-to-action' }
              ].map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => {
                    playSynthSound(600, 'sine', 0.05);
                    setBrandVoice(voice.id);
                    localStorage.setItem('lumo_brand_voice_tone', voice.id);
                  }}
                  className={`p-3 rounded-xl border text-[11px] text-start font-black transition-all cursor-pointer ${
                    brandVoice === voice.id
                      ? 'border-purple-500 bg-purple-500/10 text-purple-300 shadow'
                      : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span className="block font-black">{lang === 'ar' ? voice.labelAr : voice.labelEn}</span>
                  <span className="block text-[8px] text-slate-500 font-normal mt-0.5">{voice.desc}</span>
                </button>
              ))}
            </div>

            {/* Save Custom Brand Voice Prompt (Lodavia Pro only) */}
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-300 uppercase flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'حفظ نبرة ذكية مخصصة (Pro)' : 'Saved Custom Brand Voice (Pro)'}</span>
                </span>
                
                {brandVoice === 'Custom Voice' && (
                  <span className="text-[8px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    Active
                  </span>
                )}
              </div>

              <textarea
                value={customVoice}
                onChange={(e) => setCustomVoice(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: نحن شركة تقنية كبرى نبيع البرمجيات السحابية، تحدث بأسلوب واثق وذكي، تجنب التكرار واستعمل الرموز التعبيرية بحرص...' : 'Describe your company, key offerings, persona details, and reply instructions to configure custom AI style...'}
                rows={3}
                className="glass-input p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all font-sans"
              />

              <button
                onClick={handleSaveCustomVoice}
                disabled={isSavingCustomVoice || !customVoice.trim()}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                {isSavingCustomVoice ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>{lang === 'ar' ? 'جاري الحفظ والتدريب...' : 'Saving voice...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'حفظ وتفعيل النبرة المخصصة 💾' : 'Save & Activate Custom Voice 💾'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ARABIC DIALECT SELECTOR */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <Languages className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{lang === 'ar' ? 'تخصيص اللهجات العربية واللغة 🌍' : 'Dialects & Linguistics 🌍'}</span>
            </h2>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'ميزة حصرية لـ Lodavia Pro تتيح للذكاء الاصطناعي مواءمة صياغة الردود تلقائياً لتبدو كأنها كُتبت بلهجة محلية تناسب بلد المتابع لرفع حميمية التواصل.'
                : 'Exclusive Pro tuning allowing Lodavia\'s AI model to dynamically translate replies into regional Arabic dialects, ensuring a hyper-localized engagement.'}
            </p>

            <div className="flex flex-col gap-2 mt-2">
              {[
                { id: 'none', labelAr: 'الوضع التلقائي الذكي (عربي فصحى / إنجليزي) 🌐', labelEn: 'Auto / English 🌐', desc: 'Replies in Standard Arabic or English based on source comment' },
                { id: 'Modern Standard Arabic', labelAr: 'اللغة العربية الفصحى الحديثة 🇸🇦', labelEn: 'Modern Standard Arabic 🇸🇦', desc: 'Formal, polite academic Arabic across regions' },
                { id: 'Saudi', labelAr: 'الاللهجة السعودية المحلية 🇸🇦', labelEn: 'Saudi Dialect 🇸🇦', desc: 'Warm, respectful Gulf-centric phrasing' },
                { id: 'Egyptian', labelAr: 'الاللهجة المصرية الدارجة 🇪🇬', labelEn: 'Egyptian Dialect 🇪🇬', desc: 'Humorous, cheerful, and popular phrasing' },
                { id: 'Iraqi', labelAr: 'الاللهجة العراقية الكريمة 🇮🇶', labelEn: 'Iraqi Dialect 🇮🇶', desc: 'Elegantly composed authentic Iraqi dialect' },
                { id: 'Emirati', labelAr: 'الاللهجة الإماراتية الراقية 🇦🇪', labelEn: 'Emirati Dialect 🇦🇪', desc: 'Sophisticated, modern Gulf business phrasing' }
              ].map((dialect) => {
                const isActive = selectedDialect === dialect.id;
                return (
                  <button
                    key={dialect.id}
                    onClick={() => {
                      if (dialect.id !== 'none' && !isPro) {
                        playSynthSound(220, 'sawtooth', 0.25);
                        setShowUpgradeModal(true);
                        return;
                      }
                      playSynthSound(500, 'sine', 0.05);
                      setSelectedDialect(dialect.id);
                      localStorage.setItem('lumo_reply_dialect', dialect.id);
                    }}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex justify-between items-center ${
                      isActive
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow'
                        : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-black">{lang === 'ar' ? dialect.labelAr : dialect.labelEn}</span>
                      <span className="block text-[8px] text-slate-500 font-normal mt-0.5">{dialect.desc}</span>
                    </div>
                    {dialect.id !== 'none' && !isPro && (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ======================= UPGRADE TO PRO PAYWALL MODAL ======================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel rounded-3xl p-6 md:p-8 max-w-lg w-full border border-yellow-500/20 bg-gradient-to-br from-[#0c0c14] via-slate-900 to-yellow-950/15 shadow-2xl flex flex-col gap-5 animate-[scaleIn_0.25s_ease-out] relative">
            <button 
              onClick={() => {
                playSynthSound(440, 'sine', 0.1);
                setShowUpgradeModal(false);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 flex items-center justify-center text-2xl shadow-xl shadow-yellow-500/10 animate-bounce">
                👑
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300">
                {lang === 'ar' ? 'افتح آفاق Lodavia Pro الكونية الكاملة' : 'Unlock Cosmic Lodavia Pro Tier'}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                {lang === 'ar'
                  ? 'انضم إلى رتب المبدعين والرواد في مجرة Lodavia واستمتع بمميزات فريدة غير محدودة لتنمية علامتك التجارية.'
                  : 'Rise into elite social creator tiers of Lodavia and supercharge your audience expansion rate.'}
              </p>
            </div>

            {/* Feature Comparer Grid */}
            <div className="grid grid-cols-2 gap-3.5 my-2">
              <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-black/40 flex flex-col gap-2">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Lodavia Free</span>
                <ul className="text-[10px] text-slate-400 flex flex-col gap-1.5 list-disc pl-3">
                  <li>20 AI Replies / Day</li>
                  <li>Basic Inbox Monitoring</li>
                  <li>No Custom Voice Prompts</li>
                  <li>No Arabic Dialect tuning</li>
                  <li>Manual Bulk Moderation</li>
                </ul>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex flex-col gap-2">
                <span className="text-[9px] font-black uppercase text-yellow-400 tracking-wider">Lodavia Pro 👑</span>
                <ul className="text-[10px] text-yellow-100 flex flex-col gap-1.5 list-disc pl-3">
                  <li className="font-extrabold text-yellow-300">Unlimited AI Generations</li>
                  <li className="font-extrabold text-yellow-300">Reply All with AI</li>
                  <li>Saved Custom Brand Voice</li>
                  <li>Local Dialect adapter</li>
                  <li>Smart Comment Analysis</li>
                  <li>Advanced future platforms</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleUpgradeToPro}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-500/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4 fill-slate-950 animate-pulse" />
                <span>{lang === 'ar' ? 'تفعيل العضوية الذهبية الآن 👑' : 'Unlock Pro Access Credentials 👑'}</span>
              </button>

              <button
                onClick={() => {
                  playSynthSound(440, 'sine', 0.08);
                  setShowUpgradeModal(false);
                }}
                className="w-full py-2 text-slate-500 hover:text-slate-300 text-xs font-bold transition"
              >
                {lang === 'ar' ? 'ربما لاحقاً' : 'Maybe Later'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
