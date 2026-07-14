import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useMessages } from '../hooks/useMessages';
import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInput } from '../components/ChatInput';
import { ChatMessage, ChatConversation } from '../types';
import { AlertCircle, Wifi, MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  const { lang, playSynthSound, currentUser } = useApp();
  const { 
    chats, 
    activeChat, 
    setActiveChat, 
    updateChatMessages, 
    setTypingState, 
    setUnreadCount,
    subscribeConversations 
  } = useMessages();

  const [isLoading, setIsLoading] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState(false);

  const [replyMessage, setReplyMessage] = useState<ChatMessage | null>(null);
  const [editMessage, setEditMessage] = useState<ChatMessage | null>(null);

  // Subscribe to real-time conversations of current user
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeConversations(currentUser.id);
    const delayTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => {
      unsubscribe();
      clearTimeout(delayTimer);
    };
  }, [currentUser.id]);

  // When activeChat is clicked, reset its unreadCount
  useEffect(() => {
    if (activeChat && activeChat.unreadCount > 0) {
      setUnreadCount(activeChat.id, 0);
    }
  }, [activeChat?.id, activeChat?.unreadCount]);

  // Handle Send Message (integrates text, image, video, file, audio)
  const handleSendMessage = async (
    text: string, 
    type: 'text' | 'image' | 'video' | 'file' | 'audio' = 'text',
    options?: any
  ) => {
    if (!activeChat) return;

    playSynthSound(783.99, 'sine', 0.08);

    const isEditMode = options?.isEdit || !!editMessage;

    if (isEditMode) {
      // Edit mode handler:
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

    // Normal Send Mode:
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

    // Append message to current list
    const currentMessages = activeChat.messages || [];
    const updatedMessages = [...currentMessages, newMsg];

    // Persist list
    await updateChatMessages(activeChat.id, updatedMessages);
    setReplyMessage(null);

    // Simulate sending progress -> delivered -> read receipts
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

    // Simulated cosmic response sequence
    setTimeout(async () => {
      // Trigger typing indicator on companion
      await setTypingState(activeChat.id, true);

      // Sound feedback for typing start
      playSynthSound(300, 'triangle', 0.1);

      setTimeout(async () => {
        // Clear typing indicator
        await setTypingState(activeChat.id, false);
        playSynthSound(587.33, 'sine', 0.1);

        // Simulated highly aesthetic cosmic message
        const replyMsg: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: 'them',
          text: lang === 'ar' 
            ? 'تلقيت رسالتك الكونية الفريدة! موجات الاتصال التفاعلية تعمل بأعلى كفاءة في هذا المجرى 🚀🔮✨' 
            : 'Synchronized with your cosmic wavelength perfectly! The communication streams are performing beautifully in this node 🚀🔮✨',
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
    <div className="flex-1 flex flex-col md:flex-row gap-4 h-[calc(100vh-140px)] min-h-[500px] animate-[fadeIn_0.4s_ease-out] select-none" id="lodavia-messenger-root">
      
      {/* Network Alert Notification banner */}
      {offlineStatus && (
        <div className="absolute top-16 left-4 right-4 z-30 bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-xl flex items-center justify-between text-xs font-mono animate-pulse">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تنبيه: محاكاة الترددات غير مستقرة حالياً.' : 'Quantum wavelength jitter detected.'}</span>
          </div>
          <button onClick={() => setOfflineStatus(false)} className="px-2 py-1 bg-red-500/30 rounded text-[10px] font-bold text-white hover:bg-red-500/50">
            Re-align
          </button>
        </div>
      )}

      {/* Conversations List Deck Column */}
      <div className={`w-full md:w-80 shrink-0 flex flex-col gap-3 h-full ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <ChatList
          conversations={chats}
          activeConversation={activeChat}
          onSelectConversation={(conv) => setActiveChat(conv)}
          lang={lang}
          loading={isLoading}
        />
      </div>

      {/* Main Active Conversation Window Column */}
      <div className={`flex-1 flex flex-col h-full rounded-3xl border border-white/5 bg-slate-950/20 overflow-hidden ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <div className="flex flex-col h-full justify-between relative">
            
            {/* The Main Chat Stream with reactions, bubbles, edits */}
            <ChatWindow
              conversation={activeChat}
              currentUser={currentUser}
              lang={lang}
              onSendMessage={handleSendMessage}
              onUpdateMessages={updateChatMessages}
              onBack={() => {
                playSynthSound(440, 'sine', 0.1);
                setActiveChat(null);
              }}
              playSynthSound={playSynthSound}
              isTyping={activeChat.isTyping}
            />

            {/* The Glassmorphic Input Composer for attachment captures & submissions */}
            <ChatInput
              lang={lang}
              onSendMessage={handleSendMessage}
              isTyping={!!activeChat.isTyping}
              onTypingChange={handleTypingChange}
              replyToText={replyMessage?.text}
              onClearReply={() => setReplyMessage(null)}
              editToText={editMessage?.text}
              onClearEdit={() => setEditMessage(null)}
            />

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-8">
            <div className="w-16 h-16 rounded-full bg-slate-900/50 border border-white/5 flex items-center justify-center mb-4 shadow-lg">
              <MessageSquare className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-300 font-sans mb-1">
              {lang === 'ar' ? 'حدد خط اتصال مشفر' : 'Unified Messenger Node'}
            </h3>
            <p className="text-[10px] text-slate-500 max-w-xs font-mono">
              {lang === 'ar' 
                ? 'الرجاء تحديد قناة محادثة نشطة من القائمة الجانبية لبدء تشفير ومزامنة البيانات الكونية التفاعلية.' 
                : 'Select an active secure communication link from your explorer deck to sync details.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
