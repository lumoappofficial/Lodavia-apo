import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Search, Sparkles, Users, Mic, BookOpen, Brain, ArrowRight } from 'lucide-react';

export default function SearchPage() {
  const { lang, communities, playSynthSound } = useApp();
  const [query, setQuery] = useState('');

  // Filter lists based on query
  const filteredCommunities = query.trim() === '' ? [] : communities.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto w-full pb-12 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-cyan-400" />
        <h1 className="text-lg font-black text-white">
          {lang === 'ar' ? 'البحث الكوني الشامل 🔍' : 'Cosmic Global Search 🔍'}
        </h1>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-cyan-400" />
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
          placeholder={lang === 'ar' ? 'ابحث عن مجتمعات، أصدقاء، غرف صوتية...' : 'Search communities, hosts, study rooms...'}
          className="glass-input w-full py-3 ps-11 pe-4 rounded-2xl text-xs"
        />
      </div>

      {query.trim() === '' ? (
        <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>{lang === 'ar' ? 'مواضيع شائعة الآن' : 'Cosmic Trending Spheres'}</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {['#React19', '#NextJS', '#AI_Agents', '#RustCompiler', '#WebAssembly', '#UI_UX', '#GamingSA'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag.replace('#', ''));
                  playSynthSound(600, 'sine', 0.08);
                }}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-bold text-slate-300 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {lang === 'ar' ? `نتائج البحث عن "${query}"` : `Search results for "${query}"`}
          </h2>

          {filteredCommunities.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <span className="text-sm block">
                {lang === 'ar' ? 'لا توجد مجتمعات متوافقة مع بحثك 🪐' : 'No compatible dimensions found 🪐'}
              </span>
              <span className="text-[10px] text-slate-600 block mt-1">
                {lang === 'ar' ? 'حاول كتابة كلمات مفتاحية أخرى مثل "برمجة" أو "ذكاء"' : 'Try typing other keywords like "React" or "Coding"'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredCommunities.map((comm) => (
                <div 
                  key={comm.id}
                  className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-4 hover:border-cyan-500/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center shadow-md">
                      {comm.icon}
                    </span>
                    <div>
                      <h3 className="text-xs font-black text-white">{comm.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{comm.description}</p>
                    </div>
                  </div>

                  <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full font-black uppercase tracking-wider shrink-0">
                    {comm.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
