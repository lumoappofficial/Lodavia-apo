import React from 'react';
import { useApp } from '../contexts/AppContext';
import ParallelWorld from '../components/ParallelWorld/ParallelWorld';

export default function ParallelWorldPage() {
  const {
    currentUser,
    setCurrentUser,
    lang,
    playSynthSound
  } = useApp();

  const isAr = lang === 'ar';

  return (
    <div className="pb-10 animate-[fadeIn_0.3s_ease-out]">
      <ParallelWorld
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        lang={lang}
        playSynthSound={playSynthSound}
      />
    </div>
  );
}
