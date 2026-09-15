import React from 'react';
import { Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { useStories } from '../../contexts/StoriesContext';
import { useApp } from '../../contexts/AppContext';

export function StoriesBar() {
  const { lang, currentUser } = useApp();
  const { storyGroups, openCreator, openViewer } = useStories();

  const myGroupIndex = storyGroups.findIndex(g => g.userId === (currentUser?.id || 'me'));
  const myGroup = myGroupIndex >= 0 ? storyGroups[myGroupIndex] : null;

  return (
    <div className="w-full bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-white/10 rounded-2xl p-3 shadow-xs mb-3 text-start" id="lodavia-stories-bar">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-sans">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
          <span>{lang === 'ar' ? 'القصص الكونية' : 'Cosmic Stories'}</span>
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          24h Expiry
        </span>
      </div>

      {/* Stories Horizontal Scroll Container */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none snap-x select-none">
        {/* First Item: My Story + Button */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 snap-start cursor-pointer group" onClick={openCreator} id="create-story-btn">
          <div className="relative">
            <div className="w-14 h-14 rounded-full p-[2px] border-2 border-dashed border-sky-400 dark:border-cyan-400/60 group-hover:border-sky-500 transition-all flex items-center justify-center">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                alt={lang === 'ar' ? 'قصتك' : 'Your Story'}
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-sky-600 dark:bg-cyan-500 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#111827] shadow-xs group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[64px] text-center font-sans">
            {lang === 'ar' ? 'قصتك +' : 'Your Story +'}
          </span>
        </div>

        {/* User Story Groups */}
        {storyGroups.map((group, idx) => {
          if (group.userId === (currentUser?.id || 'me')) {
            // My existing story circle if I have stories
            if (!group.stories || group.stories.length === 0) return null;
          }

          const hasUnread = group.hasUnread;
          const isMe = group.userId === (currentUser?.id || 'me');

          return (
            <div
              key={group.userId}
              onClick={() => openViewer(idx)}
              className="flex flex-col items-center gap-1.5 shrink-0 snap-start cursor-pointer group"
              id={`story-ring-${group.userId}`}
            >
              <div className="relative">
                {/* Ring Border with Glow */}
                <div
                  className={`w-14 h-14 rounded-full p-[2.5px] transition-all ${
                    hasUnread
                      ? 'bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-400 animate-[pulse_2s_infinite] shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-white dark:bg-[#111827] p-[1.5px] overflow-hidden">
                    <img
                      src={group.userAvatar}
                      alt={group.userName}
                      className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {group.isVerified && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-sky-600 dark:bg-cyan-400 text-white dark:text-slate-950 rounded-full p-0.5 border border-white dark:border-[#111827]">
                    <ShieldCheck className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[64px] text-center font-sans">
                {isMe ? (lang === 'ar' ? 'قصتك' : 'My Story') : group.userName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
