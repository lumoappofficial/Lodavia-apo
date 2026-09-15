import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import UniverseExplorer3D from '../components/UniverseExplorer3D';
import { 
  Globe, 
  Users, 
  Mic, 
  Gamepad2, 
  ShoppingBag, 
  BookOpen, 
  Brain, 
  UserCheck, 
  Sparkles, 
  Compass, 
  ArrowLeft, 
  ArrowRight, 
  Flame, 
  Plus, 
  Search,
  Radio,
  Star,
  Award,
  Zap
} from 'lucide-react';

export default function ExplorePage() {
  const { lang, communities, playSynthSound } = useApp();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const categories = [
    { id: 'all', labelAr: 'الكل ✨', labelEn: 'All ✨' },
    { id: 'space', labelAr: 'استكشاف الفضاء 🪐', labelEn: 'Explore Space 🪐' },
    { id: 'parallel', labelAr: 'العالم الموازي 🌌', labelEn: 'Parallel World 🌌' },
    { id: 'communities', labelAr: 'المجتمعات 🪐', labelEn: 'Communities 🪐' },
    { id: 'voice', labelAr: 'الغرف الصوتية 🎙️', labelEn: 'Voice Rooms 🎙️' },
    { id: 'games', labelAr: 'الألعاب 🎮', labelEn: 'Games 🎮' },
    { id: 'projects', labelAr: 'المشاريع والأفكار 💡', labelEn: 'Ideas & Projects 💡' },
    { id: 'journey', labelAr: 'المعرفة والتعلم 🧠', labelEn: 'Knowledge 🧠' },
    { id: 'ai', labelAr: 'الذكاء الاصطناعي 🤖', labelEn: 'AI & Brief 🤖' }
  ];

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 animate-[fadeIn_0.4s_ease-out] flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/20 p-6 md:p-8 bg-gradient-to-r from-purple-950/40 via-slate-950/60 to-cyan-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 animate-spin" />
                {isRtl ? 'مركز الاستكشاف الكوني' : 'Cosmic Discovery Center'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {isRtl ? 'استكشف أبعاد Lodavia الكونية 🌌' : 'Explore Lodavia Dimensions 🌌'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              {isRtl 
                ? 'اكتشف العوالم الموازية، انضم للمجتمعات، شارك في الصالونات الصوتية، العب، وتطوّر مع مجتمعنا العالمي.' 
                : 'Discover parallel realms, join vibrant spaces, hop into voice lounges, play cosmic games, and evolve.'}
            </p>
          </div>

          <button
            onClick={() => {
              playSynthSound(800, 'sine', 0.1);
              navigate('/parallel-world');
            }}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-xs shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2 shrink-0 border border-cyan-400/30"
          >
            <Globe className="w-4 h-4 animate-pulse" />
            <span>{isRtl ? 'دخول العالم الموازي 🌌' : 'Enter Parallel World 🌌'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search Input */}
        <div className="mt-6 relative z-10 max-w-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث عن كواكب، أفكار، ألعاب، غرف أو مجتمعات...' : 'Search planets, ideas, games, lounges or spaces...'}
              className="w-full glass-input ps-11 pe-4 py-3 rounded-2xl text-xs"
            />
          </div>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              playSynthSound(600, 'sine', 0.05);
            }}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer shrink-0 border ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white border-cyan-400/50 shadow-md'
                : 'bg-slate-100 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {isRtl ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* SECTION: 3D SPACE EXPLORER EXPERIENCE */}
      {(selectedCategory === 'all' || selectedCategory === 'space') && (
        <section className="flex flex-col gap-3">
          <UniverseExplorer3D
            lang={lang}
            playSynthSound={playSynthSound}
          />
        </section>
      )}

      {/* SECTION 1: PARALLEL WORLD FEATURED BANNER */}
      {(selectedCategory === 'all' || selectedCategory === 'parallel') && (
        <section className="p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/30 via-slate-900/80 to-cyan-900/30 relative overflow-hidden shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-400 p-[2px] shrink-0 shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#070710] rounded-2xl flex items-center justify-center">
                  <Globe className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider block">
                  {isRtl ? 'تجربة رقمية جديدة متكاملة' : 'Next-Gen Immersive World'}
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  {isRtl ? '🌌 العالم الموازي — Parallel World' : '🌌 Parallel World'}
                </h3>
                <p className="text-xs text-slate-200 mt-1 max-w-md leading-relaxed">
                  {isRtl 
                    ? 'عالم بصري تفاعلي يحتوي على 8 كواكب (الأفكار، الألعاب، المعرفة، المبدعين، المشاريع، المجتمع، الذكاء الاصطناعي، وبوابة المستقبل ماذا لو؟).' 
                    : 'An interactive cosmic world featuring 8 planets (Ideas, Games, Knowledge, Creators, Projects, Community, AI Lab, Future Gate "What If?").'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSynthSound(800, 'sine', 0.1);
                navigate('/parallel-world');
              }}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isRtl ? 'استكشف العالم الموازي' : 'Explore Parallel World'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* SECTION 2: COMMUNITIES */}
      {(selectedCategory === 'all' || selectedCategory === 'communities') && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-500" />
              <span>{isRtl ? 'المجتمعات الموصى بها 🪐' : 'Recommended Spaces 🪐'}</span>
            </h2>
            <button
              onClick={() => navigate('/communities')}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isRtl ? 'عرض الكل' : 'View All'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communities.slice(0, 3).map((comm) => (
              <div 
                key={comm.id}
                className="bg-white dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all flex flex-col justify-between gap-4 group cursor-pointer shadow-sm"
                onClick={() => navigate('/communities')}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    {comm.icon}
                  </span>
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-full font-extrabold uppercase">
                    {comm.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">{comm.name}</h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{comm.description}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>👥 {comm.membersCount} {isRtl ? 'عضو' : 'members'}</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold group-hover:underline flex items-center gap-1">
                    {isRtl ? 'انضمام' : 'Join'} &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: VOICE ROOMS */}
      {(selectedCategory === 'all' || selectedCategory === 'voice') && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-purple-500 animate-pulse" />
              <span>{isRtl ? 'الصالونات الصوتية المباشرة 🎙️' : 'Live Audio Lounges 🎙️'}</span>
            </h2>
            <button
              onClick={() => navigate('/voice-rooms')}
              className="text-xs font-bold text-sky-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isRtl ? 'دخول الغرف' : 'Enter Rooms'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'v1',
                title: isRtl ? 'حوار كوني حول مستقبليات الذكاء الاصطناعي 🧠' : 'Cosmic AI Futures Discussion 🧠',
                host: 'Dr. Evelyn',
                listeners: 142,
                speakers: 4,
                tags: ['#AI', '#Future']
              },
              {
                id: 'v2',
                title: isRtl ? 'جلسة تطوير ألعاب لودافيا وتصميم العوالم 🎮' : 'Lodavia Game Dev & World Building 🎮',
                host: 'AstroDev',
                listeners: 89,
                speakers: 3,
                tags: ['#GameDev', '#Design']
              }
            ].map((room) => (
              <div
                key={room.id}
                onClick={() => navigate('/voice-rooms')}
                className="bg-white dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">
                      {isRtl ? 'مباشر الآن' : 'LIVE'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 font-bold bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                    <span>🎙️ {room.speakers}</span>
                    <span>•</span>
                    <span>🎧 {room.listeners}</span>
                  </div>
                </div>

                <h3 className="text-xs font-black text-slate-900 dark:text-white">{room.title}</h3>

                <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
                  <span>{isRtl ? `المستضيف: ${room.host}` : `Host: ${room.host}`}</span>
                  <div className="flex gap-1">
                    {room.tags.map(t => (
                      <span key={t} className="text-[9px] bg-sky-50 dark:bg-purple-500/10 text-sky-700 dark:text-purple-300 border border-sky-200 dark:border-purple-500/20 px-2 py-0.5 rounded font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: GAMES & CHALLENGES */}
      {(selectedCategory === 'all' || selectedCategory === 'games') && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-emerald-500" />
              <span>{isRtl ? 'ألعاب وتحديات لودافيا 🎮' : 'Lodavia Games & Quests 🎮'}</span>
            </h2>
            <button
              onClick={() => navigate('/lodavia-games')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isRtl ? 'منطقة الألعاب' : 'Play Arcade'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'g1', title: isRtl ? 'المدرك الفضائي Astro Run' : 'Astro Run 🏃‍♂️', icon: '🚀', xp: '+100 XP' },
              { id: 'g2', title: isRtl ? 'اختبار المعرفة الكونيه Quiz' : 'Cosmic Quiz 🧠', icon: '🪐', xp: '+150 XP' },
              { id: 'g3', title: isRtl ? 'شطرنج الكون Space Chess' : 'Space Chess ♟️', icon: '🌌', xp: '+200 XP' },
              { id: 'g4', title: isRtl ? 'لغز الكم Quantum Riddle' : 'Quantum Riddle 🧩', icon: '🔮', xp: '+250 XP' },
            ].map((game) => (
              <div
                key={game.id}
                onClick={() => navigate('/lodavia-games')}
                className="bg-white dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col items-center text-center gap-2 group shadow-sm"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{game.icon}</span>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">{game.title}</h3>
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {game.xp}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 5: IDEAS & PROJECTS MARKETPLACE */}
      {(selectedCategory === 'all' || selectedCategory === 'projects') && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cyan-500" />
              <span>{isRtl ? 'سوق المشاريع والأفكار 💡' : 'Ideas & Project Hub 💡'}</span>
            </h2>
            <button
              onClick={() => navigate('/marketplace')}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isRtl ? 'تصفح السوق' : 'Marketplace'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'm1',
                title: isRtl ? 'منصة تعلم الحوسبة الكمومية AI Agent' : 'Quantum AI Agent Platform',
                creator: 'Sami Tech',
                price: '300 💎',
                category: isRtl ? 'ذكاء اصطناعي' : 'AI Agent'
              },
              {
                id: 'm2',
                title: isRtl ? 'نظام إدارة المجتمعات الذكي Community OS' : 'Cosmic Community OS',
                creator: 'Lara UI',
                price: '150 💎',
                category: isRtl ? 'برمجيات' : 'Software'
              }
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/marketplace')}
                className="bg-white dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer flex justify-between items-center gap-4 shadow-sm"
              >
                <div>
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded font-extrabold uppercase">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white mt-1">{item.title}</h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {isRtl ? `بواسطة ${item.creator}` : `By ${item.creator}`}
                  </span>
                </div>

                <div className="text-end shrink-0">
                  <span className="text-xs font-black text-amber-600 dark:text-yellow-400 bg-amber-500/10 dark:bg-yellow-500/10 border border-amber-500/20 dark:border-yellow-500/20 px-3 py-1.5 rounded-xl block">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 6: KNOWLEDGE & DAILY AI BRIEF */}
      {(selectedCategory === 'all' || selectedCategory === 'journey' || selectedCategory === 'ai') && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => navigate('/journey')}
            className="bg-white dark:bg-slate-900/70 p-6 rounded-3xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {isRtl ? 'رحلة التعلم الكونية 🧠' : 'Cosmic Learning Journey 🧠'}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {isRtl ? 'طور مهاراتك واحصل على شارات معتمدة' : 'Master skills & earn certified badges'}
                </span>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
              <span>{isRtl ? 'متابعة التعلم' : 'Continue Learning'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div 
            onClick={() => navigate('/ai-daily')}
            className="bg-white dark:bg-slate-900/70 p-6 rounded-3xl border border-slate-200 dark:border-purple-500/30 hover:border-sky-400 dark:hover:border-purple-500/50 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-purple-500/10 text-sky-600 dark:text-purple-400 border border-sky-100 dark:border-purple-500/20">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {isRtl ? 'ملخص لودافيا اليومي 📰' : 'Lodavia Daily AI Brief 📰'}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {isRtl ? 'أبرز الأخبار التقنية والمعرفة بذكاء' : 'AI synthesized tech news & insights'}
                </span>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-sky-700 dark:text-purple-400 border border-sky-200 dark:border-purple-500/30 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
              <span>{isRtl ? 'قراءة ملخص اليوم' : 'Read Today\'s Brief'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

    </div>
  );
}
