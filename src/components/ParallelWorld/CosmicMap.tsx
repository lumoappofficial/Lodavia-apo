import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  Globe, 
  ChevronRight, 
  Eye, 
  Compass, 
  Users 
} from 'lucide-react';
import { PlanetRegion, ExplorerUser } from '../../types/parallelWorld';

interface CosmicMapProps {
  planets: PlanetRegion[];
  onSelectPlanet: (planet: PlanetRegion) => void;
  lang: string;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
  activeExplorers: ExplorerUser[];
}

export default function CosmicMap({
  planets,
  onSelectPlanet,
  lang,
  playSynthSound,
  activeExplorers
}: CosmicMapProps) {
  const isAr = lang === 'ar';

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetRegion | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Rotate planets gently over time for living dynamic orbit animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.15) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleZoomIn = () => {
    playSynthSound(600, 'sine', 0.05);
    setZoom(prev => Math.min(prev + 0.2, 1.8));
  };

  const handleZoomOut = () => {
    playSynthSound(500, 'sine', 0.05);
    setZoom(prev => Math.max(prev - 0.2, 0.6));
  };

  const handleReset = () => {
    playSynthSound(400, 'sine', 0.05);
    setZoom(1);
  };

  return (
    <div className="w-full relative glass-panel bg-slate-950/95 text-slate-100 rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl p-4 md:p-8 min-h-[580px] flex flex-col justify-between select-none">
      
      {/* Background Starfield Canvas atmosphere inside map */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#040614] via-[#080d28] to-[#03040c] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-purple-950/20 to-transparent pointer-events-none z-0" />

      {/* Floating Map Legend & Info Bar */}
      <div className="relative z-20 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10">
          <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div>
            <h3 className="text-xs font-black text-white">
              {isAr ? 'خريطة العالم الموازي الكونية 🌌' : 'Parallel World Cosmic Map 🌌'}
            </h3>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              {isAr ? 'انقر على أي كوكب للاستكشاف والقيام بالمهمات' : 'Click any planet to explore activities & missions'}
            </span>
          </div>
        </div>

        {/* Live Active Explorers Count Pill */}
        <div className="flex items-center gap-2 bg-purple-900/30 border border-purple-500/30 px-3.5 py-2 rounded-2xl">
          <Users className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-purple-200">
            {activeExplorers.length + 310} {isAr ? 'مستكشف كوني نشط الآن' : 'Explorers Online Now'}
          </span>
        </div>
      </div>

      {/* Main 2.5D Cosmic Orbit Canvas Container */}
      <div 
        ref={mapContainerRef}
        className="relative z-10 my-auto w-full max-w-3xl mx-auto aspect-square max-h-[520px] flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoom})` }}
      >

        {/* Orbit Rings Lines */}
        <div className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full border border-cyan-500/15 pointer-events-none animate-pulse" />
        <div className="absolute w-[380px] h-[380px] md:w-[440px] md:h-[440px] rounded-full border border-purple-500/15 pointer-events-none" />
        <div className="absolute w-[480px] h-[480px] md:w-[540px] md:h-[540px] rounded-full border border-amber-500/10 pointer-events-none" />

        {/* Central Nexus: "عالم Lodavia" Core */}
        <div className="relative z-20 flex flex-col items-center justify-center cursor-pointer group">
          {/* Outer glowing pulsing halo */}
          <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 blur-xl opacity-40 group-hover:opacity-80 transition duration-500 animate-pulse" />
          
          {/* Rotating Ring Ornament */}
          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-cyan-400/40 animate-[spin_20s_linear_infinite]" />

          {/* Core Orb */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-700 p-1 shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center">
            <div className="w-full h-full bg-[#070b1e] rounded-full flex flex-col items-center justify-center p-2 text-center border border-white/30">
              <Sparkles className="w-6 h-6 text-cyan-300 animate-bounce mb-0.5" />
              <span className="text-[10px] md:text-xs font-black text-white tracking-wider uppercase">
                {isAr ? 'عالم' : 'WORLD'}
              </span>
              <span className="text-[9px] md:text-[10px] font-extrabold text-cyan-300 -mt-1">
                LODAVIA
              </span>
            </div>
          </div>

          <span className="mt-2 text-[11px] font-black text-slate-200 bg-black/60 px-3 py-1 rounded-full border border-white/10 shadow-lg">
            🌍 {isAr ? 'النواة الكونية الكبرى' : 'Central Cosmic Core'}
          </span>
        </div>

        {/* Orbiting Planets */}
        {planets.map((planet, index) => {
          // Calculate angle for 360 degree distribution plus dynamic continuous rotation offset
          const angleDeg = (index * (360 / planets.length) + rotation) % 360;
          const angleRad = (angleDeg * Math.PI) / 180;
          
          // Distance radius scaled for responsive container
          const radius = 150 + (index % 2 === 0 ? 30 : -10);
          
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius * 0.75; // 0.75 ratio creates isometric depth!

          const isHovered = hoveredPlanet?.id === planet.id;

          return (
            <div
              key={planet.id}
              onClick={() => {
                playSynthSound(700, 'sine', 0.12);
                onSelectPlanet(planet);
              }}
              onMouseEnter={() => setHoveredPlanet(planet)}
              onMouseLeave={() => setHoveredPlanet(null)}
              className="absolute z-20 cursor-pointer group transition-transform duration-200 hover:scale-125"
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
            >
              {/* Glow Aura */}
              <div 
                className="absolute -inset-3 rounded-full blur-md opacity-60 group-hover:opacity-100 transition"
                style={{ backgroundColor: planet.color }}
              />

              {/* Planet Orb */}
              <div 
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-full p-0.5 flex items-center justify-center shadow-2xl border border-white/40 transition-transform duration-300"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${planet.color}, #090d21)`
                }}
              >
                <span className="text-xl md:text-2xl drop-shadow-md select-none animate-pulse">
                  {planet.icon}
                </span>

                {/* Subtle Orbital ring around specific planets */}
                {index % 3 === 0 && (
                  <div 
                    className="absolute -inset-2 rounded-full border border-white/30 rotate-45 pointer-events-none"
                  />
                )}
              </div>

              {/* Planet Label Tag */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap pointer-events-none">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all border shadow-lg flex items-center gap-1 ${
                  isHovered 
                    ? 'bg-cyan-500 text-slate-950 border-white scale-110' 
                    : 'bg-black/75 text-slate-200 border-white/10'
                }`}>
                  <span>{isAr ? planet.nameAr : planet.nameEn}</span>
                </span>
              </div>
            </div>
          );
        })}

      </div>

      {/* Bottom Map Controls Bar */}
      <div className="relative z-20 flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-white/5">
        
        {/* Hovered Planet Quick Preview */}
        <div className="flex items-center gap-2">
          {hoveredPlanet ? (
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-2xl animate-[fadeIn_0.2s_ease-out]">
              <span className="text-lg">{hoveredPlanet.icon}</span>
              <div>
                <span className="text-xs font-black text-white block">
                  {isAr ? hoveredPlanet.nameAr : hoveredPlanet.nameEn}
                </span>
                <span className="text-[10px] text-cyan-300 font-medium">
                  {isAr ? hoveredPlanet.stats.labelAr : hoveredPlanet.stats.labelEn}: {hoveredPlanet.stats.value}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'مرر الماوس أو انقر على كوكب لعرض تفاصيله' : 'Hover or tap any planet to inspect details'}</span>
            </span>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title={isAr ? 'تكبير' : 'Zoom In'}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title={isAr ? 'تصغير' : 'Zoom Out'}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title={isAr ? 'إعادة ضبط' : 'Reset View'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
