import React from 'react';
import { X, Eye, Heart, MessageCircle } from 'lucide-react';
import { StoryItem } from '../../types/story';
import { useStories } from '../../contexts/StoriesContext';
import { useApp } from '../../contexts/AppContext';

interface StoryViewersModalProps {
  story: StoryItem;
}

export function StoryViewersModal({ story }: StoryViewersModalProps) {
  const { lang } = useApp();
  const { closeViewersModal } = useStories();

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 animate-[fadeIn_0.2s_ease-out] text-start">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-t-3xl md:rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? `المشاهدات والتفاعلات (${story.viewers.length})` : `Views & Reactions (${story.viewers.length})`}
            </h3>
          </div>
          <button
            onClick={closeViewersModal}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reactions Summary */}
        {story.reactions.length > 0 && (
          <div className="bg-sky-50 dark:bg-cyan-500/10 border border-sky-100 dark:border-cyan-500/20 rounded-2xl p-3 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
              {lang === 'ar' ? 'التفاعلات:' : 'Reactions:'}
            </span>
            <div className="flex items-center gap-1.5">
              {story.reactions.map(react => (
                <span key={react.id} className="inline-flex items-center gap-1 bg-white dark:bg-[#1e293b] px-2 py-1 rounded-xl text-xs shadow-xs border border-slate-200 dark:border-white/10">
                  <span>{react.emoji}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">{react.userName.split(' ')[0]}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Viewers List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {story.viewers.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-sans">
              {lang === 'ar' ? 'لا توجد مشاهدات حتى الآن' : 'No views recorded yet'}
            </div>
          ) : (
            story.viewers.map((viewer, i) => {
              const reaction = story.reactions.find(r => r.userId === viewer.userId);
              const reply = story.replies.find(r => r.userId === viewer.userId);

              return (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <img
                      src={viewer.userAvatar}
                      alt={viewer.userName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block font-sans">
                        {viewer.userName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {viewer.viewedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {reaction && (
                      <span className="text-base animate-bounce">{reaction.emoji}</span>
                    )}
                    {reply && (
                      <span className="text-xs text-sky-600 dark:text-cyan-400 flex items-center gap-1 bg-sky-50 dark:bg-cyan-500/10 px-2 py-1 rounded-lg">
                        <MessageCircle className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{reply.text}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
