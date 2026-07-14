import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  CheckCheck, 
  Image as ImageIcon, 
  Mic, 
  FileText, 
  Video, 
  Sparkles 
} from 'lucide-react';
import { ChatConversation } from '../types';
import { playSynthSound } from '../utils/synth';

// ChatListSkeleton is shown when conversations are loading
export function ChatListSkeleton() {
  return (
    <div className="flex flex-col gap-3 pr-1 animate-pulse" id="chat-list-skeleton">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-3.5 rounded-2xl border border-white/5 bg-white/5 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-slate-800" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3 w-2/3 bg-slate-800 rounded" />
            <div className="h-2 w-1/2 bg-slate-800 rounded" />
          </div>
          <div className="w-8 h-3 bg-slate-800 rounded self-start" />
        </div>
      ))}
    </div>
  );
}

interface ChatListProps {
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  onSelectConversation: (conv: ChatConversation) => void;
  lang: 'ar' | 'en';
  loading?: boolean;
}

export function ChatList({
  conversations,
  activeConversation,
  onSelectConversation,
  lang,
  loading = false
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (conv: ChatConversation) => {
    playSynthSound(587.33, 'sine', 0.05);
    onSelectConversation(conv);
  };

  const filteredConversations = conversations.filter((c) =>
    c.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 h-full w-full" id="chat-list-container">
      {/* Search and Node Info */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'ar' ? 'الرسائل والمحادثات الكونية' : 'Unified Messenger Node'}</span>
        </span>

        {/* Modern Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث في الترددات والجهات...' : 'Search wavelengths...'}
            className="w-full glass-input py-2.5 pl-9 pr-4 rounded-xl text-xs focus:ring-1 focus:ring-cyan-500/30 font-sans"
            aria-label={lang === 'ar' ? 'بحث المحادثات' : 'Search conversations'}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-mono"
            >
              clear
            </button>
          )}
        </div>
      </div>

      {/* Conversations feed */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 h-full max-h-[calc(100vh-220px)]">
        {loading ? (
          <ChatListSkeleton />
        ) : filteredConversations.length === 0 ? (
          <div className="text-center p-8 text-slate-500 border border-dashed border-white/5 rounded-2xl bg-white/2" id="empty-search">
            <span className="text-xs font-mono block">
              {lang === 'ar' ? 'لا توجد قنوات متصلة' : 'No channels detected'}
            </span>
          </div>
        ) : (
          <AnimatePresence>
            {filteredConversations.map((chat) => {
              const messages = chat.messages || [];
              const lastMsg = messages[messages.length - 1];
              const isActive = activeConversation?.id === chat.id;

              // Admin or verified highlight
              const isVerified = chat.isVerified ?? (chat.contactName.includes('سارة') || chat.contactName.includes('يوسف') || chat.contactName.includes('Sarah'));

              return (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={chat.id}
                  onClick={() => handleSelect(chat)}
                  className={`p-3.5 rounded-2xl border transition-all flex justify-between items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}
                  id={`chat-item-${chat.id}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(chat);
                    }
                  }}
                  aria-label={`Chat with ${chat.contactName}, ${chat.isOnline ? 'online' : 'offline'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    {/* Contact Avatar node */}
                    <div className="relative shrink-0">
                      <img
                        src={chat.contactAvatar}
                        alt={chat.contactName}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      {chat.isOnline ? (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#07070a] shadow-[0_0_8px_#10b981]" title="Online" />
                      ) : (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-600 border-2 border-[#07070a]" title="Offline" />
                      )}
                    </div>

                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-200 block truncate font-sans">
                          {chat.contactName}
                        </span>
                        {isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="currentColor" style={{ fillOpacity: 0.15 }} />
                        )}
                      </div>

                      {/* Typing or Last Message preview */}
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 flex items-center gap-1">
                        {chat.isTyping ? (
                          <span className="text-cyan-400 font-bold animate-pulse flex items-center gap-1 font-mono">
                            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                            {lang === 'ar' ? 'يكتب...' : 'typing...'}
                          </span>
                        ) : lastMsg ? (
                          <>
                            {lastMsg.senderId === 'me' && (
                              <span className="text-slate-500 mr-0.5 font-mono">
                                {lang === 'ar' ? 'أنت: ' : 'You: '}
                              </span>
                            )}
                            {lastMsg.type === 'audio' && <Mic className="w-3 h-3 inline text-purple-400" />}
                            {lastMsg.type === 'image' && <ImageIcon className="w-3 h-3 inline text-cyan-400" />}
                            {lastMsg.type === 'file' && <FileText className="w-3 h-3 inline text-amber-400" />}
                            {lastMsg.type === 'video' && <Video className="w-3 h-3 inline text-red-400" />}
                            <span className="truncate">
                              {lastMsg.type === 'audio'
                                ? (lang === 'ar' ? 'تسجيل صوتي 🎤' : 'Voice message 🎤')
                                : lastMsg.type === 'image'
                                ? (lang === 'ar' ? 'صورة 🖼️' : 'Attached image 🖼️')
                                : lastMsg.type === 'file'
                                ? (lang === 'ar' ? `ملف: ${lastMsg.fileName}` : `File: ${lastMsg.fileName}`)
                                : lastMsg.type === 'video'
                                ? (lang === 'ar' ? 'فيديو 📹' : 'Video 📹')
                                : lastMsg.text}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-500 font-mono italic">
                            {lang === 'ar' ? 'بدء البث...' : 'Ready to sync...'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Metadata: timestamp, read-status, unread badge */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0 select-none">
                    <span className="text-[8px] text-slate-500 font-mono">{lastMsg?.timestamp || ''}</span>
                    <div className="flex items-center gap-1">
                      {lastMsg && lastMsg.senderId === 'me' && (
                        lastMsg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                        ) : lastMsg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-slate-600" />
                        )
                      )}
                      {chat.unreadCount > 0 && (
                        <motion.span 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                        >
                          {chat.unreadCount}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
