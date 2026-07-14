import React from 'react';
import { useApp } from '../contexts/AppContext';
import AIReplyAssistant from '../components/AIReplyAssistant';

export default function AIReplyAssistantPage() {
  const {
    currentUser,
    setCurrentUser,
    lang,
    playSynthSound
  } = useApp();

  return (
    <div className="pb-10 animate-[fadeIn_0.3s_ease-out]">
      <AIReplyAssistant
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        lang={lang}
        playSynthSound={playSynthSound}
      />
    </div>
  );
}
