import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import CommunitiesSystem from '../components/CommunitiesSystem';

export default function CommunitiesPage() {
  const {
    currentUser,
    setCurrentUser,
    lang,
    communities,
    setCommunities,
    activeCommunity,
    setActiveCommunity,
    playSynthSound
  } = useApp();

  const navigate = useNavigate();
  const handleSetActiveTab = (tab: string) => {
    navigate(tab === 'home' ? '/' : `/${tab}`);
  };

  return (
    <div className="pb-10 animate-[fadeIn_0.3s_ease-out]">
      <CommunitiesSystem
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        lang={lang}
        communities={communities}
        setCommunities={setCommunities}
        activeCommunity={activeCommunity}
        setActiveCommunity={setActiveCommunity}
        playSynthSound={playSynthSound}
        setActiveTab={handleSetActiveTab}
      />
    </div>
  );
}
