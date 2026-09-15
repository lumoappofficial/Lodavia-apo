import React from 'react';
import { motion } from 'motion/react';
import { 
  Radio, 
  Users, 
  Mic, 
  Calendar, 
  Share2, 
  Plus, 
  Search, 
  TrendingUp, 
  Bell, 
  Clock, 
  Sparkles, 
  Flame, 
  Compass, 
  Lock
} from 'lucide-react';
import { VoiceRoomItem, ScheduledRoom } from '../types/voice';

interface VoiceRoomsHomeProps {
  lang: string;
  playSynthSound: (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number) => void;
  rooms: VoiceRoomItem[];
  scheduledRooms: ScheduledRoom[];
  categories: Array<{ id: string; label: string; labelAr: string }>;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleJoinRoom: (room: VoiceRoomItem) => void;
  setShowRoomCreator: (show: boolean) => void;
  setShowScheduleModal: (show: boolean) => void;
  setScheduledRooms: React.Dispatch<React.SetStateAction<ScheduledRoom[]>>;
  friendsSpeaking: Array<{
    id: string;
    name: string;
    nameEn: string;
    avatar: string;
    roomTitle: string;
    roomTitleAr: string;
    roomId: string;
    isSpeaking: boolean;
  }>;
}

export function VoiceRoomsHome({
  lang,
  playSynthSound,
  rooms,
  scheduledRooms,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  handleJoinRoom,
  setShowRoomCreator,
  setShowScheduleModal,
  setScheduledRooms,
  friendsSpeaking
}: VoiceRoomsHomeProps) {

  // Category statistics mapping
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return rooms.length;
    return rooms.filter(r => r.category === catId).length;
  };

  // Filter rooms based on selection & search
  const filteredRooms = rooms.filter(room => {
    const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;
    const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.titleAr.includes(searchQuery) ||
                          room.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured Room (Take first featured, or fallback to first room)
  const featuredRoom = rooms.find(r => r.isFeatured) || rooms[0];

  // Trending Rooms (Rooms designated trending or highest listener count)
  const trendingRooms = rooms.filter(r => r.isTrending || r.listenersCount >= 200);

  // Recommended Rooms (Curated for the user)
  const recommendedRooms = rooms.filter(r => r.isRecommended || r.category === 'ai');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col gap-8 pb-12"
      id="voice-rooms-home-hub"
    >
      {/* Header Banner - Premium Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900/80 to-cyan-950/30 border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 flex items-start gap-4 flex-1">
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 text-slate-950 shadow-lg relative group">
            <Radio className="w-6 h-6 animate-pulse text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-slate-900 animate-ping" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'المنصة الصوتية الفائقة 🎙️' : 'Premium Stage Audio 🎙️'}</span>
              <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse uppercase tracking-widest">LIVE</span>
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-xl">
              {lang === 'ar' 
                ? 'استمتع ببث صوتي فائق الدقة. صالونات ومسارح اجتماعية تفاعلية تحاكي Discord و Spaces مع تحليلات ذكية بالذكاء الاصطناعي.'
                : 'Experience high-fidelity spatial audio. Interactive social stages inspired by Discord and Clubhouse with real-time AI companions.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 w-full md:w-auto z-10 shrink-0">
          <button
            onClick={() => {
              playSynthSound(750, 'sine', 0.1);
              setShowRoomCreator(true);
            }}
            className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 transition-all active:scale-95 text-center cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>{lang === 'ar' ? 'ابدأ صالوناً الآن' : 'Start Stage Salon'}</span>
          </button>

          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.1);
              setShowScheduleModal(true);
            }}
            className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-slate-200 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'جدولة 📅' : 'Schedule 📅'}</span>
          </button>
        </div>
      </div>

      {/* Friends speaking in Orbit 📡 */}
      {friendsSpeaking && friendsSpeaking.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span>{lang === 'ar' ? 'أصدقاء يتحدثون الآن في المدار 📡' : 'Friends Live in Orbit 📡'}</span>
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {friendsSpeaking.map((friend) => (
              <div 
                key={friend.id}
                onClick={() => {
                  const targetRoom = rooms.find(r => r.id === friend.roomId);
                  if (targetRoom) handleJoinRoom(targetRoom);
                }}
                className="flex items-center gap-3 bg-slate-950/40 hover:bg-slate-950/70 border border-white/5 hover:border-cyan-500/20 px-4 py-3 rounded-2xl cursor-pointer transition-all shrink-0 min-w-[260px] group relative overflow-hidden"
              >
                {/* Micro Soundwave background animation */}
                {friend.isSpeaking && (
                  <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
                )}
                
                <div className="relative shrink-0">
                  {friend.isSpeaking && (
                    <div className="absolute inset-0 rounded-full bg-cyan-400 animate-pulse-ring opacity-60 scale-110" />
                  )}
                  <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover border border-white/15 relative z-10" />
                  {friend.isSpeaking && (
                    <span className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 w-4 h-4 rounded-full border border-slate-950 text-[8px] flex items-center justify-center font-bold z-20 animate-bounce">
                      🎙️
                    </span>
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-white">{lang === 'ar' ? friend.name : friend.nameEn}</span>
                    {friend.isSpeaking && (
                      <span className="text-[8px] text-cyan-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        {lang === 'ar' ? 'يتحدث' : 'Speaking'}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 block truncate mt-0.5 group-hover:text-cyan-300 transition-colors">
                    {lang === 'ar' ? friend.roomTitleAr : friend.roomTitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Stage Spotlight */}
      {featuredRoom && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>{lang === 'ar' ? 'صالون النخبة المتميز 🪐' : 'Featured Premium Stage 🪐'}</span>
          </h2>
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#100b1a]/95 via-[#06060c] to-[#0a0a14] p-6 md:p-8 shadow-[0_0_30px_rgba(147,51,234,0.15)] flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            {/* Ambient visual overlay */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-5 items-start md:items-center flex-1">
              <img src={featuredRoom.coverImage} alt={featuredRoom.title} className="w-full md:w-44 aspect-[16/10] md:aspect-square object-cover rounded-2xl border border-white/10 shadow-lg shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                    STAGE SHOWCASE
                  </span>
                  <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-bold uppercase tracking-wider">
                    {lang === 'ar' ? featuredRoom.categoryAr : featuredRoom.category}
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-black text-white leading-relaxed">
                  {lang === 'ar' ? featuredRoom.titleAr : featuredRoom.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <img src={featuredRoom.hostAvatar} alt={featuredRoom.hostName} className="w-6 h-6 rounded-full object-cover border border-white/20" />
                  <span className="text-xs text-slate-300 font-medium">By {featuredRoom.hostName}</span>
                </div>
                
                {/* Featured speaker panel indicators */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {featuredRoom.participants.filter(p => p.isSpeaker).slice(0, 4).map((p, i) => (
                      <img key={i} src={p.avatar} alt={p.name} className="w-5 h-5 rounded-full object-cover border border-slate-900" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {featuredRoom.speakersCount} speaking • {featuredRoom.listenersCount} listening
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleJoinRoom(featuredRoom)}
              className="relative z-10 w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs transition-all active:scale-95 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]"
            >
              <span>{lang === 'ar' ? 'دخول صالون النخبة 🚀' : 'Join Elite Stage 🚀'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Categories Horizontal Scroll & Search Row */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400 animate-pulse" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">
              {lang === 'ar' ? 'تصفح الصالونات الصوتية النشطة' : 'Explore Active Stages'}
            </h3>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-3.5 py-2 w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'البحث عن صالونات، مضيف...' : 'Search rooms, hosts, tags...'}
              className="bg-transparent border-none text-xs text-white focus:outline-none focus:ring-0 w-full px-2 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playSynthSound(440, 'sine', 0.05);
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 py-2.5 rounded-full border text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white font-black shadow-lg shadow-purple-500/10' 
                    : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{lang === 'ar' ? cat.labelAr : cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Sections Grid (Trending and Recommended Side-by-Side if desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (2 span) - Main Room List (including Trending) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {lang === 'ar' ? 'الصالونات النشطة والشائعة 🔥' : 'Active & Trending Stages 🔥'}
            </h3>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-500 rounded-3xl text-xs border border-white/5">
              {lang === 'ar' ? 'لا توجد صالونات صوتية تطابق بحثك حالياً.' : 'No active spaces match your parameters.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRooms.map((room) => {
                const isTrending = room.isTrending || room.listenersCount > 200;
                return (
                  <div 
                    key={room.id}
                    className="glass-panel rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0d0d14] to-black/90 hover:border-cyan-500/25 transition-all duration-300 flex flex-col justify-between group shadow-xl relative"
                  >
                    {/* Cover Header */}
                    <div className="relative aspect-[16/7] w-full overflow-hidden">
                      <img src={room.coverImage} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/30 to-black/60" />
                      
                      {/* Top badging */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                        {isTrending ? (
                          <span className="text-[8px] bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-md">
                            <Flame className="w-3 h-3" />
                            <span>TRENDING</span>
                          </span>
                        ) : (
                          <span className="text-[8px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span>LIVE</span>
                          </span>
                        )}

                        <span className="text-[9px] bg-slate-900/90 border border-white/10 text-cyan-400 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                          {lang === 'ar' ? room.categoryAr : room.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Locked State badge */}
                      {room.isLocked && (
                        <div className="absolute top-11 right-3 text-[9px] bg-red-950/80 border border-red-500/30 text-red-400 px-2 py-0.5 rounded font-black flex items-center gap-1">
                          <Lock className="w-3 h-3 text-red-400" />
                          <span>PRIVATE</span>
                        </div>
                      )}

                      {/* Community Tag */}
                      <span className="absolute bottom-2 left-3 text-[10px] bg-purple-500/20 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded font-black">
                        🪐 {lang === 'ar' ? room.communityNameAr : room.communityName}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <h3 className="text-xs md:text-sm font-black text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-relaxed">
                          {lang === 'ar' ? room.titleAr : room.title}
                        </h3>

                        {/* Host profile */}
                        <div className="flex items-center gap-2.5 mt-3">
                          <img src={room.hostAvatar} alt={room.hostName} className="w-7 h-7 rounded-full object-cover border border-white/25 shadow-sm" />
                          <div>
                            <span className="text-[10px] font-black text-slate-300 block leading-tight">{room.hostName}</span>
                            <span className="text-[9px] text-slate-500 block">{lang === 'ar' ? 'المضيف الرئيسي' : 'Room Host'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer specs */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2.5 text-[9px] text-slate-400 font-bold font-mono">
                          <span className="flex items-center gap-0.5">
                            <Users className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{room.listenersCount}</span>
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Mic className="w-3.5 h-3.5 text-purple-400" />
                            <span>{room.speakersCount}</span>
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/5">
                            {lang === 'ar' ? room.languageAr : room.language}
                          </span>
                        </div>

                        <button
                          onClick={() => handleJoinRoom(room)}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-[10px] font-black transition-all active:scale-95 cursor-pointer shadow-md"
                        >
                          {lang === 'ar' ? 'انضم للمسرح' : 'Tune In'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (1 span) - Curated / Recommended Sidebar & Schedule */}
        <div className="flex flex-col gap-6">
          
          {/* Section: Recommended Spaces */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-[#08080c]/50 flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'توصيات ذكية لك 🌌' : 'Recommended for You 🌌'}</span>
            </h3>

            <div className="flex flex-col gap-3.5">
              {recommendedRooms.slice(0, 3).map((recRoom) => (
                <div 
                  key={recRoom.id}
                  onClick={() => handleJoinRoom(recRoom)}
                  className="p-3 bg-white/5 border border-white/5 hover:border-cyan-500/25 rounded-2xl cursor-pointer transition-all flex items-start gap-3 group"
                >
                  <img src={recRoom.coverImage} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-[11px] font-black text-white group-hover:text-cyan-300 transition-colors leading-relaxed truncate">
                      {lang === 'ar' ? recRoom.titleAr : recRoom.title}
                    </h4>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">By {recRoom.hostName}</span>
                    <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold text-slate-500 mt-1">
                      <span>👤 {recRoom.listenersCount}</span>
                      <span>•</span>
                      <span className="text-purple-400 uppercase">{recRoom.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Upcoming scheduled items */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-[#08080c]/50 flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{lang === 'ar' ? 'الصالونات المجدولة القادمة' : 'Upcoming Scheduled Stages'}</span>
            </h3>

            <div className="flex flex-col gap-3">
              {scheduledRooms.map((sched) => (
                <div 
                  key={sched.id}
                  className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-3 relative overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    <img src={sched.hostAvatar} alt="" className="w-7 h-7 rounded-full object-cover border border-white/10" />
                    <div className="flex-1 overflow-hidden">
                      <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.2 rounded font-black tracking-widest uppercase">
                        {lang === 'ar' ? sched.categoryAr : sched.category}
                      </span>
                      <h4 className="text-[11px] font-black text-white leading-normal mt-1 line-clamp-2">
                        {lang === 'ar' ? sched.titleAr : sched.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 mt-1 block font-mono">
                        {lang === 'ar' ? sched.timeAr : sched.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={() => {
                        playSynthSound(900, 'sine', 0.1);
                        setScheduledRooms(prev => prev.map(s => {
                          if (s.id === sched.id) return { ...s, reminded: !s.reminded };
                          return s;
                        }));
                        alert(sched.reminded 
                          ? (lang === 'ar' ? 'تم إلغاء التنبيه.' : 'Reminder cancelled.')
                          : (lang === 'ar' ? 'سوف نقوم بتنبيهك فور بدئها مباشرة! 🪐' : 'Reminder registered! We will ping you live. 🪐')
                        );
                      }}
                      className={`p-2 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        sched.reminded 
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <Bell className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        playSynthSound(600, 'sine', 0.05);
                        alert(`Invitation copied: https://lodavia.app/voice/${sched.id} 🔗`);
                      }}
                      className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
export default VoiceRoomsHome;
