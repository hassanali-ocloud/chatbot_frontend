import api from './api';

export async function sendMessageToBackend(chatId: string, text: string, userId: string) {
  const payload = { chatId, text, userId };
  const res = await api.post('/api/chat', payload);
  return res.data as { status: 'ok' };
}
