import React from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { useApp } from '../../contexts/AppContext';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Sparkles, 
  CloudRain, 
  Zap, 
  Trees, 
  Waves, 
  Flame, 
  Wind, 
  Moon, 
  Coffee, 
  Train, 
  BookOpen, 
  Radio, 
  Headphones, 
  Check 
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  CloudRain,
  Zap,
  Trees,
  Waves,
  Flame,
  Wind,
  Moon,
  Coffee,
  Train,
  BookOpen,
  Radio,
  Headphones,
  Sparkles
};

export default function AmbientMixerModal() {
  const {
    ambientChannels,
    toggleAmbientChannel,
    setAmbientChannelVolume,
    isAmbientMixerOpen,
    setIsAmbientMixerOpen
  } = useAudio();

  const { lang, playSynthSound } = useApp();

  if (!isAmbientMixerOpen) return null;

  const activeCount = ambientChannels.filter(c => c.isActive).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#182232] border border-[#E6EAF0] dark:border-[#2A3447] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E6EAF0] dark:border-[#2A3447] flex items-center justify-between gap-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#48B8FF] text-white shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="text-start">
              <h3 className="text-base font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                {lang === 'ar' ? 'مولد وميكسر الأصوات المحيطية 🌧️' : 'Ambient Sound Generator & Mixer 🌧️'}
              </h3>
              <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-0.5">
                {lang === 'ar' 
                  ? `قم بدمج الأصوات الطبيعية والضوضاء البيضاء (${activeCount} أصوات نشطة حالياً)` 
                  : `Combine multi-channel nature sounds & white noise (${activeCount} channels active)`}
              </p>
            </div>
          </div>

          <button
            onClick={() => { playSynthSound(300, 'sine', 0.05); setIsAmbientMixerOpen(false); }}
            className="p-2 rounded-full hover:bg-[#FAF8F5] dark:hover:bg-[#202B3D] text-[#6E7685] dark:text-[#94A3B8] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {ambientChannels.map((channel) => {
            const IconComp = ICON_MAP[channel.icon] || Sparkles;
            return (
              <div 
                key={channel.id}
                className={`p-4 rounded-2xl border transition-all ${
                  channel.isActive 
                    ? 'bg-[#48B8FF]/10 border-[#48B8FF]/50 shadow-md' 
                    : 'bg-[#FAF8F5] dark:bg-[#121826] border-[#E6EAF0] dark:border-[#2A3447] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="p-2 rounded-xl text-white shadow-xs"
                      style={{ backgroundColor: channel.color }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC]">
                      {lang === 'ar' ? channel.nameAr : channel.name}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      playSynthSound(channel.isActive ? 400 : 800, 'sine', 0.05);
                      toggleAmbientChannel(channel.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      channel.isActive 
                        ? 'bg-[#48B8FF] text-white shadow-xs' 
                        : 'bg-[#E6EAF0] dark:bg-[#202B3D] text-[#6E7685] dark:text-[#94A3B8]'
                    }`}
                  >
                    {channel.isActive ? (lang === 'ar' ? 'تشغيل ✓' : 'Active ✓') : (lang === 'ar' ? 'تشغيل' : 'Turn On')}
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-2.5">
                  <VolumeX className="w-3.5 h-3.5 text-[#6E7685] dark:text-[#94A3B8]" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={channel.isActive ? channel.volume : 0}
                    disabled={!channel.isActive}
                    onChange={(e) => setAmbientChannelVolume(channel.id, Number(e.target.value))}
                    className="flex-1 h-2 bg-[#E6EAF0] dark:bg-[#202B3D] rounded-lg appearance-none cursor-pointer accent-[#48B8FF]"
                  />
                  <Volume2 className="w-3.5 h-3.5 text-[#48B8FF]" />
                  <span className="text-[10px] font-mono font-bold w-7 text-end text-[#6E7685] dark:text-[#94A3B8]">
                    {channel.isActive ? `${channel.volume}%` : '0%'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E6EAF0] dark:border-[#2A3447] flex items-center justify-between bg-[#FAF8F5] dark:bg-[#121826]">
          <span className="text-xs text-[#6E7685] dark:text-[#94A3B8] font-bold">
            {lang === 'ar' ? '💡 يمكنك تشغيل مولد الأصوات في الخلفية أثناء الاستماع' : '💡 Sound generator layers dynamically over music'}
          </span>
          <button
            onClick={() => { playSynthSound(880, 'sine', 0.05); setIsAmbientMixerOpen(false); }}
            className="px-5 py-2 rounded-xl bg-[#48B8FF] text-white text-xs font-black shadow-md hover:bg-[#38A8EF] transition-all cursor-pointer"
          >
            {lang === 'ar' ? 'تم وحفظ الميكسر ✨' : 'Done & Apply ✨'}
          </button>
        </div>

      </div>
    </div>
  );
}
