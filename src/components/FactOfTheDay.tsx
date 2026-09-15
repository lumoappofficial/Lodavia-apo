import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Lightbulb, 
  Globe, 
  Cpu, 
  Atom, 
  Hourglass, 
  BookOpen, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Search, 
  Filter, 
  Calendar, 
  X, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Send,
  BookMarked
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { factService } from '../services/fact.service';
import { Fact, FactComment } from '../types';
import { sanitizeExternalUrl } from '../utils/urlSecurity';

const categoryConfig: Record<string, { labelAr: string; labelEn: string; color: string; icon: any }> = {
  Space: { labelAr: "الفضاء والكوسموس", labelEn: "Space & Cosmos", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30", icon: Globe },
  Science: { labelAr: "العلوم والطبيعة", labelEn: "Science & Nature", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: Atom },
  Technology: { labelAr: "التكنولوجيا والمستقبل", labelEn: "Technology & Future", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", icon: Cpu },
  History: { labelAr: "التاريخ والحضارات", labelEn: "History & Civilizations", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: Hourglass },
  Geography: { labelAr: "الجغرافيا والأرض", labelEn: "Geography & Earth", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: Globe },
  'Human Body': { labelAr: "جسم الإنسان وعجائبه", labelEn: "Human Body", color: "bg-rose-500/20 text-rose-300 border-rose-500/30", icon: Lightbulb },
  Animals: { labelAr: "الحيوانات والكائنات", labelEn: "Animals & Wildlife", color: "bg-teal-500/20 text-teal-300 border-teal-500/30", icon: Sparkles },
  Inventions: { labelAr: "الاختراعات العبقرية", labelEn: "Inventions & Discoveries", color: "bg-orange-500/20 text-orange-300 border-orange-500/30", icon: Lightbulb },
  'General Culture': { labelAr: "الثقافة والوعي العام", labelEn: "General Culture", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: BookOpen },
  Economics: { labelAr: "الاقتصاد والنظم الماليّة", labelEn: "Economics & Finance", color: "bg-lime-500/20 text-lime-300 border-lime-500/30", icon: TrendingUp }
};

export default function FactOfTheDay() {
  const { currentUser, lang } = useApp();
  const userId = currentUser?.id || 'guest_user';

  const [fact, setFact] = useState<Fact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction local states
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [votedUseful, setVotedUseful] = useState<'useful' | 'notUseful' | undefined>(undefined);
  const [usefulCount, setUsefulCount] = useState(0);
  const [notUsefulCount, setNotUsefulCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  
  // Comments state
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState<FactComment[]>([]);

  // Archive state
  const [showArchive, setShowArchive] = useState(false);
  const [archiveFacts, setArchiveFacts] = useState<Fact[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Interactive UI Feedbacks
  const [copied, setCopied] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [generatingRandom, setGeneratingRandom] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Load daily fact
  useEffect(() => {
    loadDailyFact();
  }, []);

  const loadDailyFact = async () => {
    setLoading(true);
    setError(null);
    try {
      const dailyFact = await factService.getDailyFact(userId, todayStr);
      setFactState(dailyFact);
    } catch (err: any) {
      console.error(err);
      setError(lang === 'ar' ? 'فشل تحميل معلومة اليوم. حاول لاحقاً.' : 'Failed to load fact of the day.');
    } finally {
      setLoading(false);
    }
  };

  const setFactState = (f: Fact) => {
    setFact(f);
    setIsLiked(f.likesBy?.includes(userId) || false);
    setLikesCount(f.likesCount || 0);
    setIsSaved(f.savedBy?.includes(userId) || false);
    setCommentsList(f.comments || []);
    
    // Check votes
    if (f.usefulBy?.includes(userId)) {
      setVotedUseful('useful');
    } else if (f.notUsefulBy?.includes(userId)) {
      setVotedUseful('notUseful');
    } else {
      setVotedUseful(undefined);
    }
    
    setUsefulCount(f.usefulCount || 0);
    setNotUsefulCount(f.notUsefulCount || 0);
  };

  // Like Toggle
  const handleLike = async () => {
    if (!fact) return;
    const previousLiked = isLiked;
    const previousCount = likesCount;

    // Optimistic UI
    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      const newCount = await factService.likeFact(fact.id, userId, previousLiked);
      setLikesCount(newCount);
    } catch (err) {
      // Revert on error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
    }
  };

  // Save Toggle
  const handleSave = async () => {
    if (!fact) return;
    const previousSaved = isSaved;

    // Optimistic UI
    setIsSaved(!previousSaved);

    try {
      await factService.saveFact(fact.id, userId, previousSaved);
    } catch (err) {
      setIsSaved(previousSaved);
    }
  };

  // Vote useful / notUseful
  const handleVote = async (type: 'useful' | 'notUseful') => {
    if (!fact) return;
    
    const isSameVote = votedUseful === type;
    const previousUseful = usefulCount;
    const previousNotUseful = notUsefulCount;
    const previousVote = votedUseful;

    // Optimistic UI
    if (isSameVote) {
      setVotedUseful(undefined);
      if (type === 'useful') setUsefulCount(previousUseful - 1);
      else setNotUsefulCount(previousNotUseful - 1);
    } else {
      setVotedUseful(type);
      if (type === 'useful') {
        setUsefulCount(previousUseful + 1);
        if (previousVote === 'notUseful') setNotUsefulCount(previousNotUseful - 1);
      } else {
        setNotUsefulCount(previousNotUseful + 1);
        if (previousVote === 'useful') setUsefulCount(previousUseful - 1);
      }
    }

    try {
      const counts = await factService.voteUseful(fact.id, userId, type, isSameVote);
      setUsefulCount(counts.usefulCount);
      setNotUsefulCount(counts.notUsefulCount);
    } catch (err) {
      // Revert
      setVotedUseful(previousVote);
      setUsefulCount(previousUseful);
      setNotUsefulCount(previousNotUseful);
    }
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fact || !newComment.trim()) return;

    const commentObj: FactComment = {
      id: `comm-${Date.now()}`,
      userId,
      userName: currentUser?.name || (lang === 'ar' ? 'مستكشف كونى' : 'Cosmic Explorer'),
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80',
      text: newComment.trim(),
      timestamp: new Date().toISOString()
    };

    // Optimistic append
    const previousComments = [...commentsList];
    setCommentsList([...commentsList, commentObj]);
    setNewComment('');

    try {
      await factService.addComment(fact.id, commentObj);
      if (fact) {
        fact.commentsCount = (fact.commentsCount || 0) + 1;
      }
    } catch (err) {
      setCommentsList(previousComments);
    }
  };

  // Share link / copy
  const handleShare = () => {
    if (!fact) return;
    const textToCopy = `💡 ${lang === 'ar' ? 'معلومة اليوم المشوقة من لودافيا' : 'Interesting Fact of the Day from Lodavia'} (${fact.category}):\n\n${lang === 'ar' ? fact.textAr : fact.textEn}\n\n🔗 ${lang === 'ar' ? 'المصدر' : 'Source'}: ${fact.sourceName} (${fact.sourceUrl})\n\n#Lodavia_Daily_Fact`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Load random another fact
  const handleLoadRandom = async () => {
    setGeneratingRandom(true);
    setError(null);
    try {
      const randFact = await factService.getRandomFact(userId);
      setFactState(randFact);
      setShowTranslation(false);
    } catch (err) {
      setError(lang === 'ar' ? 'فشل توليد معلومة جديدة.' : 'Failed to generate another fact.');
    } finally {
      setGeneratingRandom(false);
    }
  };

  // Load Archive
  const handleOpenArchive = async () => {
    setShowArchive(true);
    setArchiveLoading(true);
    try {
      const list = await factService.getArchiveFacts();
      setArchiveFacts(list);
    } catch (err) {
      console.error(err);
    } finally {
      setArchiveLoading(false);
    }
  };

  const selectArchiveFact = (f: Fact) => {
    setFactState(f);
    setShowArchive(false);
    setShowTranslation(false);
    setCommentsOpen(false);
  };

  // Search / Category filter logic for Archive
  const filteredArchive = archiveFacts.filter(f => {
    const matchesSearch = 
      f.textAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.textEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.sourceName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryInfo = fact ? categoryConfig[fact.category] : null;
  const CategoryIcon = categoryInfo ? categoryInfo.icon : Sparkles;

  return (
    <div className="w-full max-w-4xl mx-auto my-6" id="fact-of-the-day-section">
      <div className="relative overflow-hidden bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-colors">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#48B8FF]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Loading State */}
        {loading || generatingRandom ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#48B8FF] border-t-transparent rounded-full mb-4"
            />
            <p className="text-[#6E7685] dark:text-[#94A3B8] font-mono text-sm animate-pulse">
              {generatingRandom 
                ? (lang === 'ar' ? 'جاري استدعاء المعرفة الكونية وتوليد معلومة مذهلة...' : 'Consulting the celestial records for a fresh fact...') 
                : (lang === 'ar' ? 'جاري مزامنة معلومة اليوم...' : 'Syncing daily fact...')}
            </p>
          </div>
        ) : error && !fact ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8" />
            </div>
            <p className="text-rose-500 font-medium">{error}</p>
            <button 
              onClick={loadDailyFact}
              className="mt-4 px-5 py-2 bg-[#48B8FF] hover:bg-[#38A8EF] text-white rounded-xl text-sm transition-all"
            >
              {lang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        ) : fact ? (
          <div>
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E6EAF0] dark:border-[#2A3447] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#48B8FF]/15 text-[#48B8FF] flex items-center justify-center border border-[#48B8FF]/30 shadow-inner">
                  <Lightbulb className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1F2C] dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
                    {lang === 'ar' ? '💡 معلومة اليوم' : '💡 Fact of the Day'}
                    {fact.date === todayStr && (
                      <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-extrabold">
                        {lang === 'ar' ? 'اليوم' : 'Today'}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] font-mono flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {fact.date}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Archive */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handleOpenArchive}
                  className="px-3.5 py-1.5 bg-[#FAF8F5] dark:bg-[#121826] hover:border-[#48B8FF]/50 border border-[#E6EAF0] dark:border-[#2A3447] rounded-xl text-xs text-[#1A1F2C] dark:text-[#F8FAFC] font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <BookMarked className="w-3.5 h-3.5 text-[#48B8FF]" />
                  {lang === 'ar' ? 'أرشيف المعلومات' : 'Facts Archive'}
                </button>
              </div>
            </div>

            {/* Fact Content Card */}
            <div className="relative p-5 md:p-6 bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] rounded-2xl mb-6">
              {/* Category Badge */}
              {categoryInfo && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${categoryInfo.color} mb-4`}>
                  <CategoryIcon className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? categoryInfo.labelAr : categoryInfo.labelEn}</span>
                </div>
              )}

              {/* Translation Toggle */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="absolute top-6 left-6 text-[10px] text-[#48B8FF] hover:underline border border-[#48B8FF]/30 px-2.5 py-1 rounded-lg bg-[#48B8FF]/10 font-bold transition-all cursor-pointer"
              >
                {showTranslation 
                  ? (lang === 'ar' ? 'عرض العربية فقط' : 'Show English only') 
                  : (lang === 'ar' ? 'Show English Translation' : 'عرض الترجمة العربية')}
              </button>

              {/* Main Content Body */}
              <div className="space-y-4">
                <motion.p 
                  key={fact.id + '-ar'}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-base md:text-lg leading-relaxed text-[#1A1F2C] dark:text-[#F8FAFC] font-semibold select-text"
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                >
                  {lang === 'ar' ? fact.textAr : fact.textEn}
                </motion.p>

                {showTranslation && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-3 border-t border-[#E6EAF0] dark:border-[#2A3447] text-sm md:text-base leading-relaxed text-[#6E7685] dark:text-[#94A3B8] italic select-text"
                    dir={lang === 'ar' ? 'ltr' : 'rtl'}
                  >
                    {lang === 'ar' ? fact.textEn : fact.textAr}
                  </motion.p>
                )}
              </div>

              {/* Source verification footer */}
              <div className="mt-5 pt-4 border-t border-[#E6EAF0] dark:border-[#2A3447] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6E7685] dark:text-[#94A3B8]">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#1A1F2C] dark:text-[#F8FAFC]">{lang === 'ar' ? 'المصدر المعتمد:' : 'Verified Source:'}</span>
                  <span className="bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] px-2 py-0.5 rounded text-[#1A1F2C] dark:text-[#F8FAFC] font-bold">{fact.sourceName}</span>
                </div>
                {fact.sourceUrl && (
                  <a
                    href={sanitizeExternalUrl(fact.sourceUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="flex items-center gap-1 text-[#48B8FF] hover:underline font-mono font-bold transition-all group"
                  >
                    {lang === 'ar' ? 'رابط المرجع' : 'Source Link'}
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>

            {/* Interactive Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[#E6EAF0] dark:border-[#2A3447] py-4 mb-6">
              {/* Left Actions: Like, Comment, Save */}
              <div className="flex items-center gap-3">
                {/* Like */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isLiked 
                      ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30' 
                      : 'bg-[#FAF8F5] dark:bg-[#121826] text-[#6E7685] dark:text-[#94A3B8] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-[#48B8FF]/40'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current scale-110' : ''} transition-transform`} />
                  <span>{likesCount}</span>
                </button>

                {/* Comment Toggle */}
                <button
                  onClick={() => setCommentsOpen(!commentsOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    commentsOpen 
                      ? 'bg-[#48B8FF]/15 text-[#48B8FF] border border-[#48B8FF]/30' 
                      : 'bg-[#FAF8F5] dark:bg-[#121826] text-[#6E7685] dark:text-[#94A3B8] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-[#48B8FF]/40'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{commentsList.length}</span>
                </button>

                {/* Bookmark Save */}
                <button
                  onClick={handleSave}
                  className={`flex items-center justify-center p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSaved 
                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' 
                      : 'bg-[#FAF8F5] dark:bg-[#121826] text-[#6E7685] dark:text-[#94A3B8] border border-[#E6EAF0] dark:border-[#2A3447] hover:border-[#48B8FF]/40'
                  }`}
                  title={lang === 'ar' ? 'حفظ في المفضلة' : 'Save to Favorites'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Middle Section: Useful / Not Useful votes */}
              <div className="flex items-center bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] p-1 rounded-2xl gap-1">
                <button
                  onClick={() => handleVote('useful')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    votedUseful === 'useful'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'مفيد' : 'Useful'} ({usefulCount})</span>
                </button>
                <div className="w-[1px] h-4 bg-[#E6EAF0] dark:bg-[#2A3447]"></div>
                <button
                  onClick={() => handleVote('notUseful')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    votedUseful === 'notUseful'
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                      : 'text-[#6E7685] dark:text-[#94A3B8] hover:text-[#1A1F2C] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'مكرر/غير مفيد' : 'Not Useful'} ({notUsefulCount})</span>
                </button>
              </div>

              {/* Right: Share Button */}
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-[#48B8FF] hover:bg-[#38A8EF] text-white rounded-xl text-xs font-extrabold shadow-lg shadow-[#48B8FF]/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'مشاركة' : 'Share'}
                </button>
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-emerald-600 border border-emerald-500/25 text-white text-[11px] font-bold rounded-lg whitespace-nowrap shadow-xl"
                    >
                      {lang === 'ar' ? '✓ تم نسخ نص المعلومة مع الرابط!' : '✓ Fact text copied to clipboard!'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Comment Section Panel */}
            <AnimatePresence>
              {commentsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] rounded-2xl p-4 md:p-5">
                    <h4 className="text-xs font-bold text-[#1A1F2C] dark:text-[#F8FAFC] mb-4 flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#48B8FF]" />
                      {lang === 'ar' ? 'نقاشات وملاحظات المستكشفين' : 'Explorer Discussion & Notes'}
                    </h4>

                    {/* Comments List */}
                    <div className="space-y-4 max-h-60 overflow-y-auto mb-4 pr-2 scrollbar-thin">
                      {commentsList.length === 0 ? (
                        <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] italic text-center py-4">
                          {lang === 'ar' ? 'لا توجد تعليقات بعد. كن أول من يكتب فكرة أو تعليق!' : 'No comments yet. Be the first to share your thoughts!'}
                        </p>
                      ) : (
                        commentsList.map((comm) => (
                          <div key={comm.id} className="flex gap-3 text-xs">
                            <img
                              src={comm.userAvatar}
                              alt={comm.userName}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full border border-[#E6EAF0] dark:border-[#2A3447] flex-shrink-0"
                            />
                            <div className="flex-1 bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] p-3 rounded-xl select-text">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-[#1A1F2C] dark:text-[#F8FAFC]">{comm.userName}</span>
                                <span className="text-[10px] text-[#6E7685] dark:text-[#94A3B8] font-mono">
                                  {new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[#1A1F2C] dark:text-[#F8FAFC] leading-relaxed">{comm.text}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={lang === 'ar' ? 'أضف تعليقاً أو استفساراً علمياً...' : 'Write your comment or question...'}
                        className="flex-1 bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-xl px-4 py-2 text-xs text-[#1A1F2C] dark:text-[#F8FAFC] placeholder-[#9DA5B4] focus:outline-none focus:border-[#48B8FF] transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-[#48B8FF] hover:bg-[#38A8EF] disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Extra Explore Trigger */}
            <div className="flex justify-center border-t border-[#E6EAF0] dark:border-[#2A3447] pt-4">
              <button
                onClick={handleLoadRandom}
                disabled={generatingRandom}
                className="px-5 py-2.5 bg-[#48B8FF] hover:bg-[#38A8EF] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#48B8FF]/20 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                {lang === 'ar' ? 'اكتشف معلومة كونية جديدة الآن' : 'Discover Another Cosmic Fact'}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Archive Modal / Drawer */}
      <AnimatePresence>
        {showArchive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Archive Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {lang === 'ar' ? 'سجل أرشيف المعرفة الكونية' : 'Celestial Knowledge Archive'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === 'ar' ? 'تصفح كنز المعلومات الموثوقة والمدققة علمياً' : 'Browse through credible and scientifically verified facts'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowArchive(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Archive Search and Category Selectors */}
              <div className="p-4 bg-slate-950/30 border-b border-white/5 flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث عن الكلمات المفتاحية أو المصادر...' : 'Search for keywords or sources...'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Category Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap hidden sm:inline">
                    <Filter className="w-3 h-3 inline mr-1" />
                    {lang === 'ar' ? 'التصنيف:' : 'Category:'}
                  </span>
                  
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      selectedCategory === 'All' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {lang === 'ar' ? 'الكل' : 'All'}
                  </button>

                  {Object.keys(categoryConfig).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {lang === 'ar' ? categoryConfig[cat].labelAr : categoryConfig[cat].labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Archive List Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/30 scrollbar-thin scrollbar-thumb-white/10">
                {archiveLoading ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"
                    />
                    <p className="text-xs text-slate-500">{lang === 'ar' ? 'جاري مزامنة الأرشيف...' : 'Loading archive...'}</p>
                  </div>
                ) : filteredArchive.length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-semibold">{lang === 'ar' ? 'لم يتم العثور على أي معلومات تطابق بحثك' : 'No cosmic facts found matching your criteria'}</p>
                    <p className="text-xs text-slate-500 mt-1">{lang === 'ar' ? 'حاول استخدام كلمة مختلفة أو تصفية تصنيف مختلفة' : 'Try searching different terms or clearing filters'}</p>
                  </div>
                ) : (
                  filteredArchive.map((archFact) => {
                    const archCat = categoryConfig[archFact.category];
                    const ArchIcon = archCat ? archCat.icon : Sparkles;

                    return (
                      <motion.div
                        key={archFact.id}
                        onClick={() => selectArchiveFact(archFact)}
                        className="p-4 md:p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-2xl cursor-pointer transition-all group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2.5">
                          {archCat && (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${archCat.color}`}>
                              <ArchIcon className="w-3 h-3" />
                              {lang === 'ar' ? archCat.labelAr : archCat.labelEn}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {archFact.date}
                          </span>
                        </div>

                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-3 line-clamp-3 group-hover:text-white select-none">
                          {lang === 'ar' ? archFact.textAr : archFact.textEn}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-2">
                          <span className="font-semibold text-slate-400">
                            {lang === 'ar' ? 'المصدر:' : 'Source:'} {archFact.sourceName}
                          </span>
                          
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-rose-500/70" />
                              {archFact.likesCount || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-indigo-500/70" />
                              {archFact.commentsCount || 0}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
