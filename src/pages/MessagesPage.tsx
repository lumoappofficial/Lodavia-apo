import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useMessages } from '../hooks/useMessages';
import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInput } from '../components/ChatInput';
import { ChatMessage, ChatConversation } from '../types';
import { AlertCircle, Wifi, MessageSquare, Sparkles } from 'lucide-react';
import { playMessageReceivedSound, playMessageSentSound } from '../utils/soundEffects';

export default function MessagesPage() {
  const { lang, playSynthSound, currentUser } = useApp();
  const { 
    chats, 
    activeChat, 
    setActiveChat, 
    updateChatMessages, 
    setTypingState, 
    setUnreadCount, 
    togglePinChat,
    toggleBlockChat,
    setChatBlocked,
    createConversation,
    subscribeConversations 
  } = useMessages();

  const [isLoading, setIsLoading] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState(false);

  const [replyMessage, setReplyMessage] = useState<ChatMessage | null>(null);
  const [editMessage, setEditMessage] = useState<ChatMessage | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeConversations(currentUser?.id || 'me');
    const delayTimer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      unsubscribe();
      clearTimeout(delayTimer);
    };
  }, [currentUser?.id]);

  // If activeChat is set, make sure it stays synchronized with the updated chat in chats array
  useEffect(() => {
    if (activeChat && chats && chats.length > 0) {
      const freshChat = chats.find(c => c.id === activeChat.id);
      if (freshChat && freshChat !== activeChat && JSON.stringify(freshChat) !== JSON.stringify(activeChat)) {
        setActiveChat(freshChat);
      }
    }
  }, [chats]);

  // Auto-select first chat on large desktop screens only if no chat is active
  useEffect(() => {
    if (!activeChat && chats && chats.length > 0 && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setActiveChat(chats[0]);
    }
  }, [chats]);

  useEffect(() => {
    if (activeChat && activeChat.unreadCount > 0) {
      setUnreadCount(activeChat.id, 0);
    }
  }, [activeChat?.id, activeChat?.unreadCount]);

  const handleSendMessage = async (
    text: string, 
    type: 'text' | 'image' | 'video' | 'file' | 'audio' = 'text',
    options?: any
  ) => {
    if (!activeChat || activeChat.isBlocked) return;

    playMessageSentSound();

    const isEditMode = options?.isEdit || !!editMessage;

    if (isEditMode) {
      const msgIdToEdit = editMessage?.id || activeChat.messages[activeChat.messages.length - 1]?.id;
      if (!msgIdToEdit) return;

      const updated = (activeChat.messages || []).map(m => {
        if (m.id === msgIdToEdit) {
          return {
            ...m,
            text: text,
            isEdited: true
          };
        }
        return m;
      });

      await updateChatMessages(activeChat.id, updated);
      setEditMessage(null);
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg_new_${Date.now()}`,
      senderId: 'me',
      text: text,
      type: type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullDate: new Date().toLocaleString(),
      status: 'sending',
      replyToId: replyMessage?.id,
      replyToText: replyMessage?.text,
      replyToSenderId: replyMessage?.id ? (replyMessage.senderId === 'me' ? 'me' : 'them') : undefined,
      fileName: options?.fileName,
      duration: options?.duration,
      fileSize: options?.fileSize || (type === 'file' ? '14.2 MB' : undefined),
      mediaUrl: options?.mediaUrl,
      reactions: {}
    };

    const currentMessages = activeChat.messages || [];
    const updatedMessages = [...currentMessages, newMsg];

    await updateChatMessages(activeChat.id, updatedMessages);
    setReplyMessage(null);

    setTimeout(async () => {
      const deliveredMessages = updatedMessages.map(m => 
        m.id === newMsg.id ? { ...m, status: 'delivered' as const } : m
      );
      await updateChatMessages(activeChat.id, deliveredMessages);

      setTimeout(async () => {
        const readMessages = deliveredMessages.map(m => 
          m.id === newMsg.id ? { ...m, status: 'read' as const } : m
        );
        await updateChatMessages(activeChat.id, readMessages);
      }, 1000);

    }, 800);

    setTimeout(async () => {
      await setTypingState(activeChat.id, true);
      playSynthSound(300, 'triangle', 0.1);

      setTimeout(async () => {
        await setTypingState(activeChat.id, false);
        playMessageReceivedSound();

        const replyMsg: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: 'them',
          text: lang === 'ar' 
            ? 'تلقيت رسالتك بنجاح! يسعدني جداً التفاعل والتواصل معاً 🚀✨' 
            : 'Synchronized with your message perfectly! Glad to connect 🚀✨',
          type: 'text',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fullDate: new Date().toLocaleString(),
          status: 'read',
          reactions: {}
        };

        const currentConvs = chats.find(c => c.id === activeChat.id);
        const latestMsgs = currentConvs ? [...(currentConvs.messages || []), replyMsg] : [...updatedMessages, replyMsg];
        
        await updateChatMessages(activeChat.id, latestMsgs);
      }, 2500);

    }, 2000);
  };

  const handleTypingChange = async (isTypingState: boolean) => {
    if (activeChat) {
      await setTypingState(activeChat.id, isTypingState);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-[500px] animate-[fadeIn_0.4s_ease-out] select-none text-start" id="lodavia-messenger-root">
      
      {offlineStatus && (
        <div className="absolute top-16 left-4 right-4 z-30 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 p-3 rounded-xl flex items-center justify-between text-xs font-mono animate-pulse shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>{lang === 'ar' ? 'تنبيه: محاكاة الترددات غير مستقرة حالياً.' : 'Quantum wavelength jitter detected.'}</span>
          </div>
          <button onClick={() => setOfflineStatus(false)} className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-500 transition-all cursor-pointer">
            Re-align
          </button>
        </div>
      )}

      {/* Sidebar Chat List */}
      <div className={`w-full lg:w-84 xl:w-96 shrink-0 flex flex-col gap-3 h-full ${activeChat ? 'hidden lg:flex' : 'flex'}`}>
        <ChatList
          conversations={chats}
          activeConversation={activeChat}
          onSelectConversation={(conv) => {
            setActiveChat(conv);
          }}
          onTogglePin={(chatId) => togglePinChat(chatId)}
          lang={lang}
          loading={isLoading}
        />
      </div>

      {/* Main Conversation Window */}
      <div className={`flex-1 flex flex-col h-full rounded-2xl lg:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0f172a] shadow-xs overflow-hidden ${!activeChat ? 'hidden lg:flex' : 'flex'}`}>
        {activeChat ? (
          <div className="flex flex-col h-full justify-between relative">
            <ChatWindow
              conversation={activeChat}
              currentUser={currentUser}
              lang={lang}
              onSendMessage={handleSendMessage}
              onUpdateMessages={updateChatMessages}
              onBack={() => {
                try {
                  playSynthSound(440, 'sine', 0.1);
                } catch {}
                setActiveChat(null);
              }}
              playSynthSound={playSynthSound}
              isTyping={activeChat.isTyping}
              onToggleBlockUser={(chatId, isBlocked) => setChatBlocked(chatId, isBlocked)}
            />
            <ChatInput
              lang={lang}
              onSendMessage={handleSendMessage}
              isTyping={!!activeChat.isTyping}
              onTypingChange={handleTypingChange}
              replyToText={replyMessage?.text}
              onClearReply={() => setReplyMessage(null)}
              editToText={editMessage?.text}
              onClearEdit={() => setEditMessage(null)}
              isBlocked={activeChat.isBlocked}
              onUnblock={() => setChatBlocked(activeChat.id, false)}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/70 dark:bg-[#0a101d] backdrop-blur-md">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500/20 via-cyan-500/15 to-transparent border border-sky-400/30 dark:border-cyan-400/30 flex items-center justify-center shadow-lg shadow-sky-500/10">
                <MessageSquare className="w-8 h-8 text-sky-600 dark:text-cyan-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-[8px] font-bold items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5" />
                </span>
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 font-sans">
              {lang === 'ar' ? 'محادثات لودافيا الفورية' : 'Lodavia Secure Messaging'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-5 font-sans">
              {lang === 'ar' 
                ? 'حدد محادثة من القائمة لبدء تبادل الرسائل الفورية، إرسال الصور والمقاطع، والتسجيلات الصوتية في بيئة آمنة ومحمية.' 
                : 'Choose a conversation from the list to start real-time chat, exchange media attachments, and send audio notes securely.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/60 dark:bg-white/5 border border-slate-300/70 dark:border-white/10 text-[10px] font-mono text-slate-600 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'ar' ? 'تشفير كامل من طرف إلى طرف' : 'End-to-End Encryption Protocol'}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
