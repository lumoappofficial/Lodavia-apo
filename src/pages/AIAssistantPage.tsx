import React from 'react';
import { useApp } from '../contexts/AppContext';
import AIAssistant from '../components/AIAssistant';

export default function AIAssistantPage() {
  const {
    currentUser,
    lang,
    communities,
    setCommunities,
    setHomePosts,
    setNewPostText,
    setShowCreateModal,
    playSynthSound
  } = useApp();

  return (
    <div className="pb-10 animate-[fadeIn_0.3s_ease-out]">
      <AIAssistant
        currentUser={currentUser}
        lang={lang}
        activeTab="assistant"
        communities={communities}
        setCommunities={setCommunities}
        setHomePosts={setHomePosts}
        setNewPostText={setNewPostText}
        setShowCreateModal={setShowCreateModal}
        playSynthSound={playSynthSound}
      />
    </div>
  );
}
