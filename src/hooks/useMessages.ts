import { useApp } from '../contexts/AppContext';
import { chatService } from '../services/chat.service';
import { ChatMessage, ChatConversation } from '../types';

export function useMessages() {
  const {
    chats,
    setChats,
    activeChat,
    setActiveChat,
    handleSendChat
  } = useApp();

  return {
    chats,
    setChats,
    activeChat,
    setActiveChat,
    sendMessage: handleSendChat,
    updateChatMessages: async (chatId: string, messages: ChatMessage[]) => {
      await chatService.updateChatMessages(chatId, messages);
      // Synchronize state locally too if offline fallback
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages } : c));
      if (activeChat && activeChat.id === chatId) {
        setActiveChat({ ...activeChat, messages });
      }
    },
    setTypingState: async (chatId: string, isTyping: boolean) => {
      await chatService.setTypingState(chatId, isTyping);
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, isTyping } : c));
      if (activeChat && activeChat.id === chatId) {
        setActiveChat({ ...activeChat, isTyping });
      }
    },
    setUnreadCount: async (chatId: string, count: number) => {
      await chatService.setUnreadCount(chatId, count);
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: count } : c));
      if (activeChat && activeChat.id === chatId) {
        setActiveChat({ ...activeChat, unreadCount: count });
      }
    },
    togglePinChat: async (chatId: string) => {
      const isPinned = await chatService.togglePinChat(chatId);
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, isPinned, pinned: isPinned } : c));
      if (activeChat && activeChat.id === chatId) {
        setActiveChat({ ...activeChat, isPinned, pinned: isPinned });
      }
      return isPinned;
    },
    toggleBlockChat: async (chatId: string) => {
      const isBlocked = await chatService.toggleBlockChat(chatId);
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, isBlocked } : c));
      if (activeChat && activeChat.id === chatId) {
        setActiveChat({ ...activeChat, isBlocked });
      }
      return isBlocked;
    },
    setChatBlocked: async (chatId: string, isBlocked: boolean) => {
      await chatService.setChatBlocked(chatId, isBlocked);
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, isBlocked } : c));
      if (activeChat && activeChat.id === chatId) {
        setActiveChat({ ...activeChat, isBlocked });
      }
    },
    createConversation: async (conv: ChatConversation) => {
      await chatService.createConversation(conv);
      setChats(prev => {
        if (prev.some(c => c.id === conv.id)) return prev;
        return [conv, ...prev];
      });
      setActiveChat(conv);
    },
    subscribeConversations: (userId: string) => {
      return chatService.getConversations(userId, (loaded) => {
        setChats(loaded);
        if (activeChat) {
          const updatedActive = loaded.find(c => c.id === activeChat.id);
          if (updatedActive) {
            setActiveChat(updatedActive);
          }
        }
      });
    }
  };
}
