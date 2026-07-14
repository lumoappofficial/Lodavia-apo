import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import VoiceRoomsSystem from '../components/VoiceRoomsSystem';

export default function VoiceRoomsPage() {
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
      <VoiceRoomsSystem
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        lang={lang}
        playSynthSound={playSynthSound}
        setActiveTab={handleSetActiveTab}
      />
    </div>
  );
}
