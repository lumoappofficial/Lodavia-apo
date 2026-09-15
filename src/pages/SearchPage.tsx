import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Search, 
  Sparkles, 
  Users, 
  Mic, 
  BookOpen, 
  Brain, 
  ArrowRight, 
  ArrowLeft,
  User,
  Tv,
  Gamepad2,
  ShoppingBag,
  Globe,
  Filter
} from 'lucide-react';

export default function SearchPage() {
  const { lang, communities, playSynthSound } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'communities' | 'rooms' | 'games' | 'projects'>('all');

  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Mock search dataset
  const people = [
    { id: 'p1', name: 'Dr. Evelyn Carter', role: 'Astrophysicist Node', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
    { id: 'p2', name: 'CosmoCoder', role: 'Fullstack Quantum Dev', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { id: 'p3', name: 'Lara Designer', role: 'UX Architect', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' }
  ];

  const rooms = [
    { id: 'r1', title: isRtl ? 'مناقشة أحدث تقنيات الـ AI والـ Agents' : 'Latest AI & Agents Debate', listeners: 142 },
    { id: 'r2', title: isRtl ? 'صالون لودافيا الموسيقي والكوني' : 'Lodavia Cosmic Ambient Music', listeners: 89 }
  ];

  const games = [
    { id: 'g1', title: isRtl ? 'المدرك الفضائي Astro Run' : 'Astro Run', category: 'Action' },
    { id: 'g2', title: isRtl ? 'اختبار المعرفة الكونيه Quiz' : 'Cosmic Quiz', category: 'Knowledge' }
  ];

  const projects = [
    { id: 'pj1', title: isRtl ? 'منصة تعلّم الحوسبة الكمومية AI Agent' : 'Quantum AI Agent Platform', price: '300 💎' },
    { id: 'pj2', title: isRtl ? 'نظام إدارة المجتمعات الذكي Community OS' : 'Cosmic Community OS', price: '150 💎' }
  ];

  // Filtering
  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPeople = people.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const filteredRooms = rooms.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));
  const filteredGames = games.filter(g => g.title.toLowerCase().includes(query.toLowerCase()));
  const filteredProjects = projects.filter(pj => pj.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 animate-[fadeIn_0.4s_ease-out] flex flex-col gap-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-sky-500" />
          <h1 className="text-lg font-black text-[#111827] dark:text-white">
            {isRtl ? 'البحث الكوني الموحد 🔍' : 'Unified Cosmic Search 🔍'}
          </h1>
        </div>
      </div>

      {/* Search Bar Input */}
      <div className="relative">
        <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-sky-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length % 3 === 0) {
              playSynthSound(700, 'sine', 0.05);
            }
          }}
          placeholder={isRtl ? 'ابحث عن أشخاص، مجتمعات، ألعاب، صالونات، مشاريع...' : 'Search people, spaces, games, lounges, ideas...'}
          className="w-full py-3.5 ps-11 pe-4 rounded-2xl text-xs font-semibold bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 text-[#111827] dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-sm transition-all"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', labelAr: 'الكل ✨', labelEn: 'All ✨' },
          { id: 'people', labelAr: 'الأشخاص 👥', labelEn: 'People 👥' },
          { id: 'communities', labelAr: 'المجتمعات 🪐', labelEn: 'Communities 🪐' },
          { id: 'rooms', labelAr: 'الغرف الصوتية 🎙️', labelEn: 'Voice Rooms 🎙️' },
          { id: 'games', labelAr: 'الألعاب 🎮', labelEn: 'Games 🎮' },
          { id: 'projects', labelAr: 'المشاريع 💡', labelEn: 'Projects 💡' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              playSynthSound(600, 'sine', 0.05);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shrink-0 border ${
              activeTab === tab.id
                ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                : 'bg-white dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white'
            }`}
          >
            {isRtl ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Empty State / Trending */}
      {query.trim() === '' ? (
        <div className="bg-white dark:bg-[#182232] rounded-3xl p-6 border border-[#E2E8F0] dark:border-white/5 flex flex-col gap-4 shadow-sm">
          <h2 className="text-xs font-black text-[#64748B] dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
            <span>{isRtl ? 'الوسوم والمواضيع الأكثر بحثاً' : 'Trending Search Hashtags'}</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {['#العالم_الموازي', '#React19', '#AI_Agents', '#LodaviaGames', '#QuantumDev', '#UX_Design', '#VoiceLounges'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag.replace('#', ''));
                  playSynthSound(600, 'sine', 0.08);
                }}
                className="px-3.5 py-2 rounded-full bg-[#F4F7FA] dark:bg-white/5 hover:bg-sky-50 dark:hover:bg-white/10 border border-[#E2E8F0] dark:border-white/5 text-[11px] font-bold text-[#111827] dark:text-slate-300 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
          
          {/* Communities Results */}
          {(activeTab === 'all' || activeTab === 'communities') && filteredCommunities.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-sky-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{isRtl ? 'المجتمعات المطابقة' : 'Matching Communities'}</span>
              </h3>
              <div className="flex flex-col gap-2">
                {filteredCommunities.map((comm) => (
                  <div 
                    key={comm.id}
                    onClick={() => navigate('/communities')}
                    className="bg-white dark:bg-[#182232] p-4 rounded-2xl border border-[#E2E8F0] dark:border-white/5 hover:border-sky-400 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-[#F4F7FA] dark:bg-slate-900 border border-[#E2E8F0] dark:border-white/5 flex items-center justify-center">
                        {comm.icon}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-[#111827] dark:text-white">{comm.name}</h4>
                        <p className="text-[10px] text-[#475569] dark:text-slate-400 line-clamp-1">{comm.description}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-sky-500/10 text-sky-600 dark:text-cyan-400 px-2.5 py-1 rounded-full font-bold uppercase">
                      {comm.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* People Results */}
          {(activeTab === 'all' || activeTab === 'people') && filteredPeople.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-sky-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>{isRtl ? 'الأشخاص والمستكشفون' : 'Matching Explorers'}</span>
              </h3>
              <div className="flex flex-col gap-2">
                {filteredPeople.map((person) => (
                  <div 
                    key={person.id}
                    onClick={() => navigate('/profile')}
                    className="bg-white dark:bg-[#182232] p-3.5 rounded-2xl border border-[#E2E8F0] dark:border-white/5 hover:border-sky-400 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img src={person.avatar} alt={person.name} className="w-9 h-9 rounded-full object-cover border border-sky-400/30" />
                      <div>
                        <h4 className="text-xs font-black text-[#111827] dark:text-white">{person.name}</h4>
                        <span className="text-[10px] text-[#475569] dark:text-slate-400">{person.role}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-sky-500/15 text-sky-700 dark:text-purple-300 border border-sky-500/30 text-[10px] font-bold">
                      {isRtl ? 'متابعة' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Games Results */}
          {(activeTab === 'all' || activeTab === 'games') && filteredGames.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>{isRtl ? 'الألعاب والتحديات' : 'Matching Games'}</span>
              </h3>
              <div className="flex flex-col gap-2">
                {filteredGames.map((game) => (
                  <div 
                    key={game.id}
                    onClick={() => navigate('/lodavia-games')}
                    className="bg-white dark:bg-[#182232] p-3.5 rounded-2xl border border-[#E2E8F0] dark:border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎮</span>
                      <div>
                        <h4 className="text-xs font-black text-[#111827] dark:text-white">{game.title}</h4>
                        <span className="text-[10px] text-[#475569] dark:text-slate-400">{game.category}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      {isRtl ? 'لعب' : 'Play'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Results */}
          {(activeTab === 'all' || activeTab === 'projects') && filteredProjects.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-amber-600 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isRtl ? 'المشاريع والأفكار' : 'Matching Projects'}</span>
              </h3>
              <div className="flex flex-col gap-2">
                {filteredProjects.map((pj) => (
                  <div 
                    key={pj.id}
                    onClick={() => navigate('/marketplace')}
                    className="bg-white dark:bg-[#182232] p-3.5 rounded-2xl border border-[#E2E8F0] dark:border-white/5 hover:border-amber-500/30 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div>
                      <h4 className="text-xs font-black text-[#111827] dark:text-white">{pj.title}</h4>
                    </div>
                    <span className="text-xs font-black text-amber-600 dark:text-yellow-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                      {pj.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
