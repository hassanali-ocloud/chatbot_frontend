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
};

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  messages: {},
  currentChatId: null,
  setChats: (c) => set({ chats: c }),
  addMessage: (msg) => set((s) => ({ 
    messages: { 
      ...s.messages, 
      [msg.chatId]: [...(s.messages[msg.chatId] || []), msg] 
    } 
  })),
  setMessagesForChat: (chatId, msgs) => set((s) => ({ 
    messages: { 
      ...s.messages, 
      [chatId]: msgs 
    } 
  })),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  addChat: (chat) => set((s) => ({ chats: [chat, ...s.chats] }))
}));
