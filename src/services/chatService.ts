import api from './api';
import type { Chat, Message } from '@/types';

export async function createChat(title: string): Promise<Chat> {
  const response = await api.post('/chats', { title });
  return response.data;
}

export async function listChats(): Promise<Chat[]> {
  const response = await api.get('/chats');
  return response.data.chats || [];
}

export async function getChatMessages(chatId: string, limit = 200, order: 'asc' | 'desc' = 'asc'): Promise<Message[]> {
  const response = await api.get(`/chats/${chatId}/messages`, {
    params: { limit, order }
  });
  return response.data.messages || [];
}

export async function sendMessage(chatId: string, text: string): Promise<{ assistant: Message }> {
  const clientMessageId = crypto.randomUUID();
  const response = await api.post(`/chats/${chatId}/messages`, {
    text,
    clientMessageId
  });
  return response.data;
}

export async function deleteChat(chatId: string): Promise<void> {
  await api.delete(`/chats/${chatId}`);
}
