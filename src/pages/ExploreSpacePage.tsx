import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import UniverseExplorer3D from '../components/UniverseExplorer3D';
import { Compass, Sparkles, Navigation, Info } from 'lucide-react';

export default function ExploreSpacePage() {
  const { lang, playSynthSound } = useApp();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  return (
    <div className="max-w-7xl mx-auto w-full pb-20 px-4 sm:px-6 space-y-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Clear Introductory Page Banner */}
      <div className="p-5 md:p-6 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 shadow-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 animate-spin" />
              {isAr ? 'مستكشف الفضاء ثلاثي الأبعاد 3D' : '3D Cosmic Space Explorer'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {isAr ? 'محاكي الجاذبية المباشر' : 'Live Gravity Physics'}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {isAr ? 'رحلة استكشاف الكون والنظام الشمسي 🪐' : 'Journey Through Cosmos & Solar System 🪐'}
          </h1>

          <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
            {isAr
              ? 'استكشف كواكب المجموعة الشمسية بتفاصيل 3D دقيقة، واختبر قوانين الفيزياء والجاذبية، والضغط الجوي، وسرعة الهروب عبر مركبة الاستكشاف التفاعلية.'
              : 'Explore planets in rich 3D detail, test real physics equations for gravity, atmospheric drag, temperature, and escape velocity using the interactive probe launcher.'}
          </p>
        </div>

        {/* Quick Instructions Tooltip Badge */}
        <div className="bg-black/60 p-3.5 rounded-2xl border border-cyan-500/30 text-xs text-slate-200 space-y-1 shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300 text-[11px] uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>{isAr ? 'تعليمات التحكم' : 'Interaction Guide'}</span>
          </div>
          <p className="text-[11px] text-slate-200">
            • {isAr ? 'السحب بالماوس / اللمس للتدوير' : 'Drag to rotate 3D view'}
          </p>
          <p className="text-[11px] text-slate-200">
            • {isAr ? 'عجلة الماوس للتكبير والتصغير' : 'Pinch / Scroll wheel to zoom'}
          </p>
          <p className="text-[11px] text-slate-200">
            • {isAr ? 'انقر على أي كوكب للانتقال واستكشافه' : 'Click any planet to inspect & launch probe'}
          </p>
        </div>
      </div>

      {/* 3D WebGL Canvas Component */}
      <UniverseExplorer3D
        lang={lang}
        playSynthSound={playSynthSound}
        onBackToEarth={() => {
          playSynthSound(450, 'sine', 0.08);
          navigate('/explore');
        }}
      />
    </div>
  );
}

