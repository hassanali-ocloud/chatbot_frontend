import { create } from 'zustand';
import type { Chat, Message } from '../types';

type ChatState = {
  chats: Chat[];
  messages: Record<string, Message[]>;
  currentChatId: string | null;
  setChats: (c: Chat[]) => void;
  addMessage: (msg: Message) => void;
  setMessagesForChat: (chatId: string, msgs: Message[]) => void;
  setCurrentChatId: (id: string | null) => void;
  addChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  messages: {},
  currentChatId: null,
  setChats: (c) => set({ chats: c }),
  addMessage: (msg) => set((s) => {
    const chatId = msg.chatId || msg.chat_id || '';
    return {
      messages: { 
        ...s.messages, 
        [chatId]: [...(s.messages[chatId] || []), msg] 
      }
    };
  }),
  setMessagesForChat: (chatId, msgs) => set((s) => ({ 
    messages: { 
      ...s.messages, 
      [chatId]: msgs 
    } 
  })),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  addChat: (chat) => set((s) => ({ chats: [chat, ...s.chats] })),
  deleteChat: (chatId) => set((s) => ({
    chats: s.chats.filter(c => c.id !== chatId),
    messages: Object.fromEntries(
      Object.entries(s.messages).filter(([id]) => id !== chatId)
    ),
    currentChatId: s.currentChatId === chatId ? null : s.currentChatId
  }))
}));
