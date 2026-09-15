import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import LodaviaMatch from '../components/LodaviaMatch';

export default function LodaviaMatchPage() {
  const {
    currentUser,
    setCurrentUser,
    lang,
    playSynthSound
  } = useApp();

  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const handleSetActiveTab = (tab: string) => {
    navigate(tab === 'home' ? '/' : `/${tab}`);
  };

  return (
    <div className="pb-10 animate-[fadeIn_0.3s_ease-out] space-y-6">
      {/* EXPLICIT PAGE TITLE BANNER */}
      <div className="glass-panel p-5 md:p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 via-slate-900/85 to-purple-950/60 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <span className="text-2xl animate-pulse">📡</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                {isAr ? 'منظومة لودافيا للربط الكوني' : 'Lodavia Match Network'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-0.5">
              {isAr ? 'المطابقة الذكية والرادار المسطح 📡⚡' : 'Smart Matching & Flat Radar 📡⚡'}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isAr
                ? 'استخدم الرادار المسطح لمسح المدارات المباشرة، أو استعن بالذكاء الاصطناعي للبحث والوصول إلى أفضل شريك للدراسة، البرمجة، الألعاب، وممارسة اللغات.'
                : 'Scan live nodes via the 2D Flat Radar or leverage Lodavia AI to find your ideal study, coding, language, or gaming buddy.'}
            </p>
          </div>
        </div>
      </div>

      <LodaviaMatch
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        lang={lang}
        playSynthSound={playSynthSound}
        setActiveTab={handleSetActiveTab}
      />
    </div>
  );
}
