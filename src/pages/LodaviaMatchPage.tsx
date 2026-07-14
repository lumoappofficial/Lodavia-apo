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

  const navigate = useNavigate();
  const handleSetActiveTab = (tab: string) => {
    navigate(tab === 'home' ? '/' : `/${tab}`);
  };

  return (
    <div className="pb-10 animate-[fadeIn_0.3s_ease-out]">
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
