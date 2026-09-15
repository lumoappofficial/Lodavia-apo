import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppUser } from '../../types';
import { ParallelIdentity, PlanetRegion } from '../../types/parallelWorld';
import { PARALLEL_PLANETS, SAMPLE_EXPLORERS } from '../../data/parallelWorldData';

import ParallelWorldHeader from './ParallelWorldHeader';
import CosmicMap from './CosmicMap';
import PlanetDetailModal from './PlanetDetailModal';
import WhatIfSimulator from './WhatIfSimulator';
import PersonalSanctum from './PersonalSanctum';
import IdentityCustomizerModal from './IdentityCustomizerModal';
import ParallelGatesSection from './ParallelGatesSection';
import GlobalEventsBanner from './GlobalEventsBanner';
import ParallelAchievementsSection from './ParallelAchievementsSection';

interface ParallelWorldProps {
  currentUser: AppUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<AppUser>>;
  lang: string;
  playSynthSound: (freq: number, type?: any, duration?: number) => void;
}

export default function ParallelWorld({
  currentUser,
  setCurrentUser,
  lang,
  playSynthSound
}: ParallelWorldProps) {
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  // Persistent Parallel Identity State
  const [identity, setIdentity] = useState<ParallelIdentity>(() => {
    const saved = localStorage.getItem('lodavia_parallel_identity');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      title: isAr ? 'مستكشف الكوانتم الكوني' : 'Cosmic Quantum Explorer',
      level: 12,
      xp: 3450,
      nextLevelXp: 5000,
      outfit: isAr ? 'درع النيون الكوانتمي 🛡️' : 'Quantum Neon Armor 🛡️',
      aura: isAr ? 'توهج السيان السماوي 🩵' : 'Celestial Cyan Glow 🩵',
      auraColor: '#06b6d4',
      vehicle: isAr ? 'مركبة الضوء السريعة 🏎️' : 'Light Speeder 🏎️',
      accessory: isAr ? 'تاج المجرات الذهبي 👑' : 'Golden Galaxy Crown 👑',
      skills: [
        { nameAr: 'استكشاف الأبعاد', nameEn: 'Dimensional Navigation', level: 8, icon: '🌌' },
        { nameAr: 'تنسيق الذكاء الاصطناعي', nameEn: 'AI Orchestration', level: 9, icon: '🤖' },
        { nameAr: 'الابتكار الكوني', nameEn: 'Cosmic Innovation', level: 10, icon: '💡' }
      ]
    };
  });

  // Save Identity on change
  useEffect(() => {
    localStorage.setItem('lodavia_parallel_identity', JSON.stringify(identity));
  }, [identity]);

  const [activeView, setActiveView] = useState<'map' | 'sanctum' | 'what_if' | 'gates' | 'achievements'>('map');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetRegion | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [levelUpAlert, setLevelUpAlert] = useState<string | null>(null);

  // Grant XP & auto level up handler
  const handleGrantXp = (amount: number, reasonAr: string, reasonEn: string) => {
    setIdentity(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newNextXp = prev.nextLevelXp;

      if (newXp >= newNextXp) {
        newLevel += 1;
        newNextXp = Math.round(newNextXp * 1.4);
        playSynthSound(1000, 'triangle', 0.4);
        setLevelUpAlert(isAr ? `تهانينا! ارتقيت إلى المستوى ${newLevel} الكوني! 🎉` : `Congratulations! Leveled up to Cosmic L${newLevel}! 🎉`);
        setTimeout(() => setLevelUpAlert(null), 4000);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newNextXp
      };
    });

    // Also increase global user points
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + Math.round(amount / 5)
    }));
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out] relative">
      
      {/* Level Up Notification Modal */}
      {levelUpAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 p-4 rounded-3xl bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-400 text-slate-950 font-black text-sm shadow-2xl border-2 border-white animate-bounce flex items-center gap-2">
          <span>👑</span>
          <span>{levelUpAlert}</span>
        </div>
      )}

      {/* Parallel World Header & Navigation */}
      <ParallelWorldHeader
        currentUser={currentUser}
        identity={identity}
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        playSynthSound={playSynthSound}
        onOpenCustomizer={() => setShowCustomizer(true)}
        onBackToHome={() => navigate('/home')}
      />

      {/* Global Live World Event Banner */}
      <GlobalEventsBanner
        lang={lang}
        playSynthSound={playSynthSound}
        onGrantXp={handleGrantXp}
      />

      {/* Active View Container */}
      <div className="w-full min-h-[500px]">
        {activeView === 'map' && (
          <CosmicMap
            planets={PARALLEL_PLANETS}
            onSelectPlanet={(planet) => setSelectedPlanet(planet)}
            lang={lang}
            playSynthSound={playSynthSound}
            activeExplorers={SAMPLE_EXPLORERS}
          />
        )}

        {activeView === 'sanctum' && (
          <PersonalSanctum
            currentUser={currentUser}
            lang={lang}
            playSynthSound={playSynthSound}
            onGrantXp={handleGrantXp}
          />
        )}

        {activeView === 'what_if' && (
          <WhatIfSimulator
            lang={lang}
            playSynthSound={playSynthSound}
            onGrantXp={handleGrantXp}
          />
        )}

        {activeView === 'gates' && (
          <ParallelGatesSection
            lang={lang}
            playSynthSound={playSynthSound}
            onSelectGate={(gateId) => {
              if (gateId === 'what_if') setActiveView('what_if');
            }}
            onGrantXp={handleGrantXp}
          />
        )}

        {activeView === 'achievements' && (
          <ParallelAchievementsSection
            lang={lang}
            playSynthSound={playSynthSound}
            onGrantXp={handleGrantXp}
          />
        )}
      </div>

      {/* Planet Details Modal */}
      {selectedPlanet && (
        <PlanetDetailModal
          planet={selectedPlanet}
          onClose={() => setSelectedPlanet(null)}
          lang={lang}
          playSynthSound={playSynthSound}
          onGrantXp={handleGrantXp}
          activeExplorers={SAMPLE_EXPLORERS}
        />
      )}

      {/* Identity Customizer Studio Modal */}
      {showCustomizer && (
        <IdentityCustomizerModal
          currentUser={currentUser}
          identity={identity}
          onSaveIdentity={(updated) => setIdentity(updated)}
          onClose={() => setShowCustomizer(false)}
          lang={lang}
          playSynthSound={playSynthSound}
        />
      )}

    </div>
  );
}
