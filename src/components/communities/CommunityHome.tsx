import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Search, Plus, Sparkles, Flame, Eye, Compass, Clock } from "lucide-react";
import { AppUser, CommunityItem } from "../../types";

interface CommunityHomeProps {
  currentUser: AppUser;
  lang: string;
  communities: CommunityItem[];
  setCommunities: React.Dispatch<React.SetStateAction<CommunityItem[]>>;
  setActiveCommunity: (comm: CommunityItem | null) => void;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
  setShowCreateWizard: (show: boolean) => void;
}

export default function CommunityHome({
  currentUser,
  lang,
  communities,
  setActiveCommunity,
  playSynthSound,
  setShowCreateWizard
}: CommunityHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recently visited communities from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("lumo_recent_communities");
    if (stored) {
      try {
        setRecentIds(JSON.parse(stored));
      } catch (e) {
        setRecentIds([]);
      }
    }
    
    // Simulate premium skeleton loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleEnterCommunity = (comm: CommunityItem) => {
    playSynthSound(600, "sine", 0.08);
    
    // Add to recently visited
    const updated = [comm.id, ...recentIds.filter(id => id !== comm.id)].slice(0, 6);
    setRecentIds(updated);
    localStorage.setItem("lumo_recent_communities", JSON.stringify(updated));
    
    setActiveCommunity(comm);
  };

  const handleToggleJoin = (e: React.MouseEvent, commId: string, isJoined: boolean) => {
    e.stopPropagation();
    playSynthSound(isJoined ? 450 : 900, "sine", 0.12);
    
    // Local Update
    const updatedJoined = isJoined 
      ? currentUser.joinedCommunities.filter(id => id !== commId)
      : [...currentUser.joinedCommunities, commId];
      
    currentUser.joinedCommunities = updatedJoined; // Modifying in-place or via parent is handled by the page, this triggers visual re-render locally

    // Trigger state sync event visually if needed
    setActiveCommunity(null); // refresh
  };

  // Filter Categories
  const categories = lang === "ar" 
    ? [
        { id: "all", label: "🪐 الكل" },
        { id: "برمجة", label: "💻 البرمجة" },
        { id: "ذكاء اصطناعي", label: "🤖 الذكاء الاصطناعي" },
        { id: "ألعاب", label: "🎮 الألعاب" },
        { id: "كرة القدم", label: "⚽ كرة القدم" },
        { id: "تصوير", label: "📷 التصوير" },
        { id: "موسيقى", label: "🎵 الموسيقى" },
        { id: "سفر", label: "🌍 السفر" }
      ]
    : [
        { id: "all", label: "🪐 All" },
        { id: "برمجة", label: "💻 Coding" },
        { id: "ذكاء اصطناعي", label: "🤖 AI" },
        { id: "ألعاب", label: "🎮 Gaming" },
        { id: "كرة القدم", label: "⚽ Football" },
        { id: "تصوير", label: "📷 Photography" },
        { id: "موسيقى", label: "🎵 Music" },
        { id: "سفر", label: "🌍 Travel" }
      ];

  // Recently Visited items
  const recentVisitedCommunities = communities.filter(c => recentIds.includes(c.id));

  // Featured Communities (high member count or premium tag)
  const featuredCommunities = communities.slice(0, 3); // Pick first 3 as featured

  // Trending (high active simulated member ratio)
  const trendingCommunities = [...communities].sort((a, b) => b.membersCount - a.membersCount).slice(0, 4);

  // Recommended (based on user interests, or high rating)
  const userInterestsLower = currentUser.interests.map(i => i.toLowerCase());
  const recommendedCommunities = communities.filter(c => {
    const inInterests = userInterestsLower.some(interest => 
      c.name.toLowerCase().includes(interest) || 
      c.category.toLowerCase().includes(interest) ||
      c.description.toLowerCase().includes(interest)
    );
    return inInterests && !currentUser.joinedCommunities.includes(c.id);
  });

  const displayRecommended = recommendedCommunities.length > 0 
    ? recommendedCommunities 
    : communities.filter(c => !currentUser.joinedCommunities.includes(c.id)).slice(0, 3);

  // Normal filtered grid list
  const filteredCommunities = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 md:px-0">
      
      {/* 1. HEADER & ACTION BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/5 pointer-events-none" />
        <div className="text-center md:text-start relative z-10">
          <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 tracking-wider">
            {lang === "ar" ? "المجتمعات الكونية التفاعلية 🪐" : "Cosmic Communities Hub 🪐"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "ar" ? "تواصل، تعلم، وشارك الفضاء الرقمي مع آلاف العقول المبدعة" : "Collaborate, learn, and share space with thousands of innovative minds"}
          </p>
        </div>
        
        <button
          onClick={() => {
            playSynthSound(700, "sine", 0.15);
            setShowCreateWizard(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition-all active:scale-95 shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer shrink-0 relative z-10"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === "ar" ? "تأسيس مجتمع كوكبي" : "Establish Community"}</span>
        </button>
      </div>

      {/* 2. RECENTLY VISITED SHORTCUTS */}
      {recentVisitedCommunities.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {lang === "ar" ? "المجتمعات التي زرتها مؤخراً:" : "Recently Visited Spaces:"}
          </span>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {recentVisitedCommunities.map(c => (
              <button
                key={c.id}
                onClick={() => handleEnterCommunity(c)}
                className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/5 py-2 px-3.5 rounded-full text-xs font-bold text-slate-200 transition-all cursor-pointer hover:border-cyan-500/30"
              >
                <span className="text-base leading-none shrink-0">{c.icon}</span>
                <span className="truncate max-w-[120px]">{c.name.replace(/[^a-zA-Z\sأ-ي•]/g, '').trim()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. FEATURED COMMUNITIES CAROUSEL */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 rounded-3xl bg-white/5 animate-pulse border border-white/5 flex flex-col justify-end p-5 gap-3">
              <div className="w-16 h-3 bg-white/10 rounded" />
              <div className="w-3/4 h-5 bg-white/10 rounded" />
              <div className="w-1/2 h-3 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black text-yellow-400 flex items-center gap-1 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            {lang === "ar" ? "المجتمعات المميزة والنشطة كوكبيًا:" : "Featured & Celestial Spaces:"}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCommunities.map(c => (
              <div
                key={c.id}
                onClick={() => handleEnterCommunity(c)}
                className="glass-panel rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-b from-purple-950/20 via-slate-950/90 to-slate-950/85 hover:border-purple-400/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-500/10 p-5 flex flex-col justify-between h-44 relative group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-2xl shadow-md">
                    {c.icon}
                  </div>
                  <span className="text-[8px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    {lang === "ar" ? "مميز ★" : "Featured ★"}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-xs font-black text-white group-hover:text-purple-300 transition-colors leading-tight truncate">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5 text-[10px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    {c.membersCount.toLocaleString()} {lang === "ar" ? "عضو" : "members"}
                  </span>
                  <span className="text-purple-400 group-hover:translate-x-1 transition-transform">{lang === "ar" ? "اكتشف →" : "Explore →"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PERSONALIZED RECOMMENDATIONS & TRENDING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Recommended */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black text-cyan-400 flex items-center gap-1 uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            {lang === "ar" ? "توصيات مخصصة لك (حسب اهتماماتك):" : "Recommended For You:"}
          </span>
          <div className="space-y-3.5">
            {displayRecommended.map(c => (
              <div
                key={c.id}
                onClick={() => handleEnterCommunity(c)}
                className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-cyan-500/30 bg-slate-900/40 flex justify-between items-center gap-4 cursor-pointer transition-all hover:shadow-cyan-500/5"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl shrink-0">{c.icon}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-200 leading-snug">{c.name}</h4>
                    <span className="text-[9px] text-cyan-400 font-bold mt-0.5 block">{lang === "ar" ? "توافق ممتاز مع اهتماماتك" : "Matches your interests"}</span>
                  </div>
                </div>
                <span className="text-[9px] bg-white/5 text-slate-400 py-1 px-2.5 rounded-full font-bold">
                  {c.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black text-orange-400 flex items-center gap-1 uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            {lang === "ar" ? "المجتمعات الأكثر رواجاً ونشاطاً:" : "Trending Communities Right Now:"}
          </span>
          <div className="space-y-3.5">
            {trendingCommunities.map((c, i) => (
              <div
                key={c.id}
                onClick={() => handleEnterCommunity(c)}
                className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-orange-500/30 bg-slate-900/40 flex justify-between items-center gap-4 cursor-pointer transition-all hover:shadow-orange-500/5"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-black text-slate-500 w-4">#{i+1}</span>
                  <span className="text-2xl shrink-0">{c.icon}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-200 leading-snug">{c.name}</h4>
                    <span className="text-[9px] text-slate-500 font-bold mt-0.5 block">{c.membersCount.toLocaleString()} {lang === "ar" ? "عضو متفاعل" : "active pilots"}</span>
                  </div>
                </div>
                <span className="text-[9px] text-orange-400 bg-orange-500/10 border border-orange-500/20 py-1 px-2.5 rounded-full font-bold">
                  HOT 🔥
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. SEARCH & CATEGORIES */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-6 pt-6 border-t border-white/5">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80 flex items-center bg-black/40 border border-white/5 rounded-2xl px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "ابحث بالاسم أو الوصف..." : "Search by title or details..."}
            className="bg-transparent border-none text-xs text-white focus:outline-none focus:ring-0 w-full px-2.5 placeholder-slate-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playSynthSound(500, "sine", 0.05);
                setSelectedCategory(cat.id);
              }}
              className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. GENERAL SEARCH COMMUNITIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        <AnimatePresence mode="popLayout">
          {filteredCommunities.map((comm) => {
            const isJoined = currentUser.joinedCommunities.includes(comm.id);
            return (
              <motion.div
                key={comm.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleEnterCommunity(comm)}
                className="glass-panel rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-lg hover:shadow-purple-500/5 relative h-80"
              >
                {/* Cover Banner with visual blend */}
                <div className="relative aspect-[4/1.5] w-full overflow-hidden">
                  <img src={comm.banner} alt={comm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <span className="absolute bottom-2 start-4 text-[9px] bg-purple-600/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    {comm.category}
                  </span>
                </div>

                {/* Community Avatar & Meta Info */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-3xl shadow-xl -mt-9 relative z-10">
                        {comm.icon}
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors leading-tight truncate max-w-[150px]">
                          {comm.name}
                        </h3>
                        <span className="text-[9px] text-slate-500 block font-bold">Lodavia cosmic channel</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                      {comm.description}
                    </p>
                  </div>

                  {/* Members list count & action buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        {comm.membersCount.toLocaleString()}
                      </span>
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                        {lang === "ar" ? "عضو كوني" : "Cosmic Members"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleJoin(e, comm.id, isJoined);
                        }}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                          isJoined 
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
                            : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                        }`}
                      >
                        {isJoined ? (lang === "ar" ? "مشترك ✓" : "Joined ✓") : (lang === "ar" ? "انضمام" : "Join")}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
