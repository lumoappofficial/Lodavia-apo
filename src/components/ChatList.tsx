import React, { useState, useMemo } from 'react';
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
  Sparkles,
  Pin,
  PinOff,
  UserPlus,
  Users,
  X,
  Clock,
  MoreVertical,
  CheckCircle2,
  Filter,
  Ban
} from 'lucide-react';
import { ChatConversation, ChatMessage } from '../types';
import { playSynthSound } from '../utils/synth';
import { StoriesBar } from './stories/StoriesBar';

// ChatListSkeleton is shown when conversations are loading
export function ChatListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 pr-1 animate-pulse" id="chat-list-skeleton">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/60 dark:bg-white/5 flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-2.5 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
            <div className="h-2.5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ChatListProps {
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  onSelectConversation: (conv: ChatConversation) => void;
  onTogglePin?: (chatId: string) => void;
  onNewChat?: () => void;
  lang: string;
  loading?: boolean;
}

export function ChatList({
  conversations,
  activeConversation,
  onSelectConversation,
  onTogglePin,
  onNewChat,
  lang,
  loading = false
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'pinned' | 'groups' | 'blocked'>('all');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [quickSearchContact, setQuickSearchContact] = useState('');

  const isRtl = lang === 'ar';

  const handleSelect = (conv: ChatConversation) => {
    try {
      playSynthSound(587.33, 'sine', 0.05);
    } catch {
      // ignore audio error if any
    }
    if (onSelectConversation) {
      onSelectConversation(conv);
    }
  };

  const handlePinToggle = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    playSynthSound(700, 'sine', 0.05);
    if (onTogglePin) {
      onTogglePin(chatId);
    }
  };

  // Compute unread totals
  const totalUnreadCount = useMemo(() => {
    return conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
  }, [conversations]);

  const pinnedCount = useMemo(() => {
    return conversations.filter(c => c.isPinned || c.pinned).length;
  }, [conversations]);

  const groupsCount = useMemo(() => {
    return conversations.filter(c => c.category === 'group' || c.contactName.includes('فريق') || c.contactName.includes('مجموعة') || c.contactName.includes('Team')).length;
  }, [conversations]);

  const blockedCount = useMemo(() => {
    return conversations.filter(c => c.isBlocked).length;
  }, [conversations]);

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      // Text search
      const matchesSearch = 
        c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.messages && c.messages.some(m => m.text?.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchesSearch) return false;

      // Category filters
      if (activeFilter === 'unread') {
        return (c.unreadCount || 0) > 0;
      }
      if (activeFilter === 'pinned') {
        return !!(c.isPinned || c.pinned);
      }
      if (activeFilter === 'groups') {
        return c.category === 'group' || c.contactName.includes('فريق') || c.contactName.includes('مجموعة') || c.contactName.includes('Team');
      }
      if (activeFilter === 'blocked') {
        return !!c.isBlocked;
      }

      return true;
    });
  }, [conversations, searchQuery, activeFilter]);

  // Separate pinned and recent if viewing 'all'
  const pinnedList = useMemo(() => {
    if (activeFilter !== 'all' && activeFilter !== 'pinned') return [];
    return filteredConversations.filter(c => c.isPinned || c.pinned);
  }, [filteredConversations, activeFilter]);

  const otherList = useMemo(() => {
    if (activeFilter === 'pinned') return [];
    if (activeFilter === 'all') {
      return filteredConversations.filter(c => !(c.isPinned || c.pinned));
    }
    return filteredConversations;
  }, [filteredConversations, activeFilter]);

  // Available sample contacts to initiate a new chat
  const newChatSuggestions = [
    { name: 'ريم العبدالله', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', role: 'مصممة UX/UI', online: true },
    { name: 'أحمد التميمي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', role: 'مطور ذكاء اصطناعي', online: true },
    { name: 'فاطمة الشهري', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', role: 'محللة بيانات كوانتم', online: false },
    { name: 'مجموعة رواد الفضاء 🌌', avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100', role: 'مجموعة عامة', isGroup: true, online: true },
  ];

  return (
    <div className="flex flex-col gap-3.5 h-full w-full text-start select-none" id="lodavia-chat-list-root">
      
      {/* Top Stories / Status Horizontal Row */}
      <StoriesBar />

      {/* Modern Messenger Header & Actions */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-slate-900 dark:text-white font-sans tracking-tight">
                {isRtl ? 'الرسائل والمحادثات' : 'Messages & Chats'}
              </h2>
              {totalUnreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-cyan-400 font-mono text-[10px] font-bold border border-sky-500/20">
                  {totalUnreadCount} {isRtl ? 'جديدة' : 'new'}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block">
              {isRtl ? 'اتصال مشفر وآمن بالكامل' : 'End-to-End Encrypted'}
            </span>
          </div>
        </div>

        {/* Action Button: New Chat */}
        <button
          onClick={() => {
            playSynthSound(659.25, 'sine', 0.06);
            if (onNewChat) {
              onNewChat();
            } else {
              setShowNewChatModal(true);
            }
          }}
          className="p-2 rounded-xl bg-sky-50 dark:bg-cyan-500/10 text-sky-600 dark:text-cyan-400 hover:bg-sky-100 dark:hover:bg-cyan-500/20 border border-sky-200/60 dark:border-cyan-500/20 transition-all flex items-center gap-1.5 text-xs font-bold shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
          title={isRtl ? 'محادثة جديدة' : 'New Chat'}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">{isRtl ? 'محادثة جديدة' : 'New'}</span>
        </button>
      </div>

      {/* Modern Search Bar */}
      <div className="relative">
        <Search className={`w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isRtl ? 'بحث في الأسماء، الرسائل، أو المجموعات...' : 'Search names, messages, or groups...'}
          className={`w-full bg-slate-50 dark:bg-[#131d2e] border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white py-2.5 ${isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'} rounded-2xl text-xs focus:ring-2 focus:ring-sky-500/30 dark:focus:ring-cyan-500/30 focus:border-sky-500 dark:focus:border-cyan-400 font-sans shadow-2xs transition-all placeholder:text-slate-400`}
          aria-label={isRtl ? 'بحث المحادثات' : 'Search conversations'}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Filter Chips / Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
        <button
          onClick={() => { playSynthSound(440, 'sine', 0.04); setActiveFilter('all'); }}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'bg-sky-600 dark:bg-cyan-500 text-white shadow-xs shadow-sky-500/20'
              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          <span>{isRtl ? 'الكل' : 'All'}</span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
            {conversations.length}
          </span>
        </button>

        <button
          onClick={() => { playSynthSound(440, 'sine', 0.04); setActiveFilter('unread'); }}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'unread'
              ? 'bg-sky-600 dark:bg-cyan-500 text-white shadow-xs shadow-sky-500/20'
              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          <span>{isRtl ? 'غير مقروءة' : 'Unread'}</span>
          {totalUnreadCount > 0 && (
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${activeFilter === 'unread' ? 'bg-white text-sky-700' : 'bg-sky-500 text-white'}`}>
              {totalUnreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => { playSynthSound(440, 'sine', 0.04); setActiveFilter('pinned'); }}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'pinned'
              ? 'bg-sky-600 dark:bg-cyan-500 text-white shadow-xs shadow-sky-500/20'
              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          <Pin className="w-3 h-3" />
          <span>{isRtl ? 'المثبتة' : 'Pinned'}</span>
          {pinnedCount > 0 && (
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${activeFilter === 'pinned' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
              {pinnedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => { playSynthSound(440, 'sine', 0.04); setActiveFilter('groups'); }}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'groups'
              ? 'bg-sky-600 dark:bg-cyan-500 text-white shadow-xs shadow-sky-500/20'
              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          <Users className="w-3 h-3" />
          <span>{isRtl ? 'المجموعات' : 'Groups'}</span>
          {groupsCount > 0 && (
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${activeFilter === 'groups' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
              {groupsCount}
            </span>
          )}
        </button>

        {blockedCount > 0 && (
          <button
            onClick={() => { playSynthSound(440, 'sine', 0.04); setActiveFilter('blocked'); }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'blocked'
                ? 'bg-rose-600 text-white shadow-xs shadow-rose-500/20'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20'
            }`}
          >
            <Ban className="w-3 h-3" />
            <span>{isRtl ? 'المحظورين' : 'Blocked'}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${activeFilter === 'blocked' ? 'bg-white/20 text-white' : 'bg-rose-200 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'}`}>
              {blockedCount}
            </span>
          </button>
        )}
      </div>

      {/* Conversations Feed */}
      <div className="flex-1 overflow-y-auto pr-0.5 flex flex-col gap-3 h-full max-h-[calc(100vh-250px)] scrollbar-thin">
        {loading ? (
          <ChatListSkeleton />
        ) : filteredConversations.length === 0 ? (
          <div className="text-center p-8 text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-3xl bg-slate-50/50 dark:bg-white/2 flex flex-col items-center gap-2" id="empty-search">
            <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-1" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {isRtl ? 'لا توجد محادثات تطابق بحثك' : 'No conversations found'}
            </span>
            <p className="text-[11px] text-slate-400 max-w-xs">
              {searchQuery 
                ? (isRtl ? 'جرب البحث بكلمات أخرى أو مسح شريط البحث' : 'Try different keywords or clear the search query')
                : (isRtl ? 'ابدأ محادثة جديدة مع أحد الأصدقاء أو الزملاء' : 'Start a new conversation with a friend or colleague')}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 px-3 py-1 bg-sky-50 dark:bg-cyan-500/10 text-sky-600 dark:text-cyan-400 rounded-xl text-xs font-bold hover:bg-sky-100"
              >
                {isRtl ? 'مسح البحث' : 'Clear search'}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* PINNED CONVERSATIONS SECTION */}
            {pinnedList.length > 0 && (
              <div className="flex flex-col gap-1.5 mb-1">
                <div className="flex items-center gap-1.5 px-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                  <Pin className="w-3 h-3 text-sky-500 dark:text-cyan-400 rotate-45" />
                  <span>{isRtl ? 'المحادثات المثبتة' : 'Pinned Conversations'}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {pinnedList.map((chat) => (
                    <ConversationItem
                      key={chat.id}
                      chat={chat}
                      isActive={activeConversation?.id === chat.id}
                      isRtl={isRtl}
                      lang={lang}
                      onSelect={() => handleSelect(chat)}
                      onTogglePin={(e) => handlePinToggle(e, chat.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* OTHER / RECENT CONVERSATIONS SECTION */}
            {otherList.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {pinnedList.length > 0 && (
                  <div className="flex items-center gap-1.5 px-2 pt-1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{isRtl ? 'كافة المحادثات' : 'All Conversations'}</span>
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  {otherList.map((chat) => (
                    <ConversationItem
                      key={chat.id}
                      chat={chat}
                      isActive={activeConversation?.id === chat.id}
                      isRtl={isRtl}
                      lang={lang}
                      onSelect={() => handleSelect(chat)}
                      onTogglePin={(e) => handlePinToggle(e, chat.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 p-5 shadow-2xl flex flex-col gap-4 text-start"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-cyan-400 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {isRtl ? 'بدء محادثة جديدة' : 'Start New Conversation'}
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      {isRtl ? 'اختر شخصاً للتواصل الفوري المباشر' : 'Pick a contact to connect'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions List */}
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {newChatSuggestions.map((user, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      playSynthSound(700, 'sine', 0.05);
                      // Check if already in conversations
                      const existing = conversations.find(c => c.contactName === user.name);
                      if (existing) {
                        handleSelect(existing);
                      } else {
                        const newConv: ChatConversation = {
                          id: `chat_new_${Date.now()}_${idx}`,
                          contactName: user.name,
                          contactAvatar: user.avatar,
                          isOnline: user.online,
                          unreadCount: 0,
                          messages: [
                            {
                              id: `msg_init_${Date.now()}`,
                              senderId: 'them',
                              text: isRtl ? 'مرحباً! يسعدني التواصل معك في منصة لودافيا 🚀' : 'Hello! Glad to connect with you on Lodavia 🚀',
                              type: 'text',
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              status: 'read'
                            }
                          ]
                        };
                        handleSelect(newConv);
                      }
                      setShowNewChatModal(false);
                    }}
                    className="p-2.5 rounded-2xl hover:bg-sky-50 dark:hover:bg-white/5 border border-transparent hover:border-sky-200/50 dark:hover:border-white/10 transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative shrink-0">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10" />
                      {user.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111827]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-cyan-400 truncate">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {user.role}
                      </div>
                    </div>
                    <span className="text-[10px] text-sky-600 dark:text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {isRtl ? 'محادثة' : 'Chat'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

interface ConversationItemProps {
  chat: ChatConversation;
  isActive: boolean;
  isRtl: boolean;
  lang: string;
  onSelect: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
}

function ConversationItem({
  chat,
  isActive,
  isRtl,
  lang,
  onSelect,
  onTogglePin
}: ConversationItemProps) {
  const messages = chat.messages || [];
  const lastMsg = messages[messages.length - 1];
  const isPinned = !!(chat.isPinned || chat.pinned);
  const isVerified = chat.isVerified ?? (chat.contactName.includes('سارة') || chat.contactName.includes('يوسف') || chat.contactName.includes('Sarah'));
  const isGroup = chat.category === 'group' || chat.contactName.includes('فريق') || chat.contactName.includes('مجموعة') || chat.contactName.includes('Team');

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      onClick={onSelect}
      className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 flex justify-between items-center gap-3 cursor-pointer relative group backdrop-blur-md ${
        isActive
          ? 'border-s-4 border-s-cyan-500 dark:border-s-cyan-400 bg-gradient-to-r from-sky-500/15 via-cyan-500/10 to-transparent dark:from-cyan-500/20 dark:via-sky-500/10 dark:to-transparent border-t-cyan-500/20 border-b-cyan-500/20 border-e-transparent dark:border-t-cyan-400/20 dark:border-b-cyan-400/20 dark:border-e-transparent shadow-sm ring-1 ring-cyan-500/25'
          : 'border-slate-200/80 dark:border-white/5 bg-white/65 dark:bg-[#101929]/65 hover:bg-white/90 dark:hover:bg-[#142033]/85 hover:border-slate-300/80 dark:hover:border-white/15 shadow-2xs hover:shadow-xs'
      }`}
      id={`chat-item-${chat.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`Chat with ${chat.contactName}, ${chat.isOnline ? 'online' : 'offline'}`}
    >
      <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
        
        {/* Contact Avatar */}
        <div className="relative shrink-0">
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[1px] ${isPinned ? 'ring-2 ring-cyan-400/60 dark:ring-cyan-400/50' : ''}`}>
            <img
              src={chat.contactAvatar}
              alt={chat.contactName}
              className="w-full h-full rounded-full object-cover border border-slate-200/80 dark:border-white/10 shadow-2xs"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Online Indicator: Pulsing green dot if online */}
          {chat.isOnline ? (
            <span className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 flex h-3.5 w-3.5" title={lang === 'ar' ? 'متصل الآن' : 'Online now'}>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#101929] shadow-[0_0_8px_rgba(16,185,129,0.85)]" />
            </span>
          ) : (
            <span className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-[#101929]" title={lang === 'ar' ? 'غير متصل' : 'Offline'} />
          )}

          {/* Group Icon Badge */}
          {isGroup && (
            <span className="absolute -top-1 -left-1 rtl:-left-auto rtl:-right-1 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center border-2 border-white dark:border-[#101929] text-[8px] shadow-xs">
              <Users className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        {/* Name & Last message */}
        <div className="overflow-hidden flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <div className="flex items-center gap-1.5 truncate">
              <span className={`text-xs sm:text-[13px] font-bold truncate font-sans ${
                isActive ? 'text-sky-950 dark:text-cyan-200 font-black' : 'text-slate-900 dark:text-slate-100'
              }`}>
                {chat.contactName}
              </span>
              {isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400 shrink-0" fill="currentColor" style={{ fillOpacity: 0.15 }} />
              )}
              {chat.isBlocked && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 shrink-0">
                  {lang === 'ar' ? 'محظور' : 'Blocked'}
                </span>
              )}
            </div>
            
            {/* Timestamp */}
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono shrink-0">
              {lastMsg?.timestamp || ''}
            </span>
          </div>

          {/* Typing or Last Message preview */}
          <div className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
            {chat.isTyping ? (
              <span className="text-sky-600 dark:text-cyan-400 font-bold animate-pulse flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-sky-600 dark:text-cyan-400 animate-spin" />
                {lang === 'ar' ? 'يكتب الآن...' : 'typing...'}
              </span>
            ) : lastMsg ? (
              <>
                {lastMsg.senderId === 'me' && (
                  <span className="text-slate-400 dark:text-slate-500 mr-0.5 font-sans font-medium shrink-0">
                    {lang === 'ar' ? 'أنت: ' : 'You: '}
                  </span>
                )}
                {lastMsg.type === 'audio' && <Mic className="w-3.5 h-3.5 inline text-purple-600 dark:text-purple-400 shrink-0" />}
                {lastMsg.type === 'image' && <ImageIcon className="w-3.5 h-3.5 inline text-sky-600 dark:text-cyan-400 shrink-0" />}
                {lastMsg.type === 'file' && <FileText className="w-3.5 h-3.5 inline text-amber-600 dark:text-amber-400 shrink-0" />}
                {lastMsg.type === 'video' && <Video className="w-3.5 h-3.5 inline text-rose-600 dark:text-rose-400 shrink-0" />}
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
              <span className="text-slate-400 italic">
                {lang === 'ar' ? 'انقر لبدء المحادثة...' : 'Tap to start conversation...'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Metadata: Read receipts, Pin, Unread badge */}
      <div className="flex flex-col items-end gap-1.5 shrink-0 select-none">
        <div className="flex items-center gap-1">
          {/* Blocked indicator icon */}
          {chat.isBlocked && (
            <span title={lang === 'ar' ? 'مستخدم محظور' : 'Blocked contact'}>
              <Ban className="w-3.5 h-3.5 text-rose-500" />
            </span>
          )}

          {/* Quick Pin/Unpin Action Button */}
          <button
            onClick={onTogglePin}
            className={`p-1 rounded-md transition-all ${
              isPinned
                ? 'text-sky-600 dark:text-cyan-400 opacity-100'
                : 'text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title={isPinned ? (isRtl ? 'إلغاء التثبيت' : 'Unpin') : (isRtl ? 'تثبيت المحادثة' : 'Pin')}
          >
            <Pin className={`w-3 h-3 ${isPinned ? 'fill-current rotate-45' : ''}`} />
          </button>

          {/* Delivery & Read ticks */}
          {lastMsg && lastMsg.senderId === 'me' && (
            lastMsg.status === 'read' ? (
              <CheckCheck className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400 drop-shadow-[0_0_3px_rgba(6,182,212,0.6)]" />
            ) : lastMsg.status === 'delivered' ? (
              <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <Check className="w-3.5 h-3.5 text-slate-400" />
            )
          )}

          {/* Unread Counter Badge: Glowing in brand color */}
          {chat.unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-black text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.6)] font-mono"
            >
              {chat.unreadCount}
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
