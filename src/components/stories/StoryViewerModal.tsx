import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Eye, Heart, Send, Music, ShieldCheck, Trash2, Lock, Pause, Play, ChevronLeft, ChevronRight, Share2, Sparkles 
} from 'lucide-react';
import { useStories } from '../../contexts/StoriesContext';
import { useApp } from '../../contexts/AppContext';
import { useMessages } from '../../hooks/useMessages';
import { StoryViewersModal } from './StoryViewersModal';

export function StoryViewerModal() {
  const { lang, currentUser, playSynthSound } = useApp();
  const { 
    storyGroups, activeGroupIndex, activeStoryIndex, closeViewer, 
    nextStory, prevStory, deleteStory, reactToStory, replyToStory,
    isViewersModalOpen, openViewersModal
  } = useStories();

  const { chats, updateChatMessages } = useMessages();

  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyInput, setReplyInput] = useState('');
  const [showShareToast, setShowShareToast] = useState(false);

  // Audio Ref for Story Music
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Current Active Group and Story
  const currentGroup = activeGroupIndex !== null ? storyGroups[activeGroupIndex] : undefined;
  const currentStory = (currentGroup && activeStoryIndex !== null) ? currentGroup.stories?.[activeStoryIndex] : undefined;

  // Safely close modal via useEffect if group/story is missing, NEVER during render
  useEffect(() => {
    if (activeGroupIndex !== null && (!currentGroup || !currentStory || activeStoryIndex === null)) {
      closeViewer();
    }
  }, [activeGroupIndex, activeStoryIndex, currentGroup, currentStory, closeViewer]);

  // Story Progress Timer (5 Seconds for Image/Text)
  useEffect(() => {
    if (!currentStory) return;

    setProgress(0);
    setIsPaused(false);

    // Audio Playback setup for story music
    if (currentStory.musicTrack?.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = currentStory.musicTrack.audioUrl;
      audioRef.current.play().catch(() => {});
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    const durationMs = 5000;
    const intervalTime = 50;
    const step = (intervalTime / durationMs) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return Math.min(prev + step, 100);
        });
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeGroupIndex, activeStoryIndex, isPaused, currentStory]);

  // Trigger next story when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      nextStory();
    }
  }, [progress, nextStory]);

  if (activeGroupIndex === null || activeStoryIndex === null || !currentGroup || !currentStory) {
    return null;
  }

  const isOwner = currentStory.ownerId === (currentUser?.id || 'me');

  const handleHoldStart = () => {
    setIsPaused(true);
    if (audioRef.current) audioRef.current.pause();
  };

  const handleHoldEnd = () => {
    setIsPaused(false);
    if (audioRef.current && currentStory.musicTrack) audioRef.current.play().catch(() => {});
  };

  const handleSendReply = async () => {
    if (!replyInput.trim()) return;

    const replyText = replyInput;
    setReplyInput('');

    // 1. Record reply in Story State
    replyToStory(currentStory.id, replyText);

    // 2. Also send reply into Messages chat with story owner!
    if (!isOwner) {
      const targetChat = chats.find(c => c.contactName.includes(currentGroup.userName.split(' ')[0]) || c.id.includes(currentStory.ownerId));
      if (targetChat) {
        const newMsg = {
          id: `msg_story_reply_${Date.now()}`,
          senderId: 'me',
          text: `[قصة 📖] ${replyText}`,
          type: 'text' as const,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fullDate: new Date().toLocaleString(),
          status: 'delivered' as const,
          reactions: {}
        };
        await updateChatMessages(targetChat.id, [...(targetChat.messages || []), newMsg]);
      }
    }

    playSynthSound(900, 'sine', 0.1);
  };

  const handleShareStory = () => {
    setShowShareToast(true);
    playSynthSound(800, 'triangle', 0.08);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center select-none text-start">
      
      {/* STORY CONTAINER CARD */}
      <div 
        className="w-full max-w-md h-full md:h-[90vh] md:max-h-[850px] relative flex flex-col bg-[#080d1a] md:rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
      >
        
        {/* TOP PROGRESS BARS */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex gap-1.5">
          {currentGroup.stories.map((story, i) => {
            let barFill = 0;
            if (i < activeStoryIndex) barFill = 100;
            else if (i === activeStoryIndex) barFill = progress;

            return (
              <div key={story.id} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 transition-all duration-75 ease-linear" 
                  style={{ width: `${barFill}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* TOP HEADER DETAILS */}
        <div className="absolute top-5 inset-x-0 z-30 px-4 pt-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.ownerAvatar}
              alt={currentStory.ownerName}
              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400/80 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white font-sans">{currentStory.ownerName}</span>
                {currentStory.ownerIsVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-slate-300 font-mono block">
                {lang === 'ar' ? 'منذ ساعتين' : '2h ago'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Delete button if story owner */}
            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteStory(currentStory.id);
                }}
                className="p-1.5 rounded-full bg-black/40 hover:bg-rose-600/80 text-white transition-all cursor-pointer"
                title={lang === 'ar' ? 'حذف القصة' : 'Delete Story'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                closeViewer();
              }}
              className="p-1.5 rounded-full bg-black/40 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAP NAVIGATION ZONES (LEFT / RIGHT) */}
        <div 
          onClick={prevStory}
          className="absolute left-0 top-20 bottom-24 w-1/3 z-20 cursor-pointer"
        />
        <div 
          onClick={nextStory}
          className="absolute right-0 top-20 bottom-24 w-1/3 z-20 cursor-pointer"
        />

        {/* MAIN STORY CONTENT DISPLAY */}
        <div 
          className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden"
          style={{
            background: currentStory.mediaType === 'text' ? (currentStory.bgColor || 'linear-gradient(135deg, #0f172a 0%, #0284c7 100%)') : '#000000',
            filter: currentStory.filter || 'none'
          }}
        >
          {currentStory.mediaType === 'image' && currentStory.mediaUrl && (
            <img 
              src={currentStory.mediaUrl} 
              alt="Story Content" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}

          {currentStory.mediaType === 'video' && currentStory.mediaUrl && (
            <video 
              src={currentStory.mediaUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover" 
            />
          )}

          {/* Text Overlay */}
          {currentStory.textContent && (
            <div className="absolute inset-x-6 text-center z-10 px-4 py-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <p className="text-base font-extrabold font-sans leading-relaxed" style={{ color: currentStory.textColor || '#FFFFFF' }}>
                {currentStory.textContent}
              </p>
            </div>
          )}

          {/* Drawing Canvas Overlay */}
          {currentStory.drawingDataUrl && (
            <img 
              src={currentStory.drawingDataUrl} 
              alt="Drawing Overlay" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-15" 
            />
          )}

          {/* Stickers Overlay */}
          {currentStory.stickers?.map(st => (
            <div 
              key={st.id} 
              className="absolute text-4xl select-none pointer-events-none z-15 animate-pulse"
              style={{ left: `${st.x}%`, top: `${st.y}%` }}
            >
              {st.emojiOrIcon}
            </div>
          ))}

          {/* Music Track Badge */}
          {currentStory.musicTrack && (
            <div className="absolute top-20 left-4 z-20 bg-black/60 backdrop-blur-md border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono shadow-lg">
              <Music className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>{currentStory.musicTrack.title}</span>
            </div>
          )}
        </div>

        {/* BOTTOM INTERACTION BAR */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-3">
          
          {/* Share Toast */}
          {showShareToast && (
            <div className="self-center bg-cyan-500 text-slate-950 px-3 py-1.5 rounded-full text-xs font-bold font-sans shadow-lg animate-bounce">
              {lang === 'ar' ? 'تم نسخ رابط القصة! 🔗' : 'Story link copied! 🔗'}
            </div>
          )}

          {isOwner ? (
            /* OWNER CONTROLS: VIEWERS COUNT BUTTON */
            <div className="flex items-center justify-between">
              <button
                onClick={openViewersModal}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2.5 rounded-2xl text-xs font-bold font-sans shadow-lg cursor-pointer transition-all"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>
                  {lang === 'ar' ? `المشاهدات (${currentStory.viewers.length})` : `Views (${currentStory.viewers.length})`}
                </span>
              </button>

              <button
                onClick={handleShareStory}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* VIEWER CONTROLS: REACTIONS + REPLY INPUT */
            <div className="flex flex-col gap-2">
              
              {/* Quick Reactions */}
              <div className="flex items-center justify-around bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-2xl">
                {['❤️', '😂', '🔥', '😍', '👏'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => reactToStory(currentStory.id, emoji)}
                    className="text-xl hover:scale-130 transition-transform active:scale-95 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Reply Input Box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendReply();
                  }}
                  placeholder={lang === 'ar' ? `رد على ${currentStory.ownerName.split(' ')[0]}...` : `Reply to ${currentStory.ownerName.split(' ')[0]}...`}
                  className="flex-1 bg-black/50 border border-white/20 text-white py-2.5 px-4 rounded-2xl text-xs focus:ring-2 focus:ring-cyan-400 font-sans"
                />
                <button
                  onClick={handleSendReply}
                  className="p-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* VIEWERS LIST MODAL OVERLAY */}
      {isViewersModalOpen && (
        <StoryViewersModal story={currentStory} />
      )}

    </div>
  );
}
