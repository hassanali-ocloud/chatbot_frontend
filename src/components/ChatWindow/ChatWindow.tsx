import { useEffect, useRef, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useChatStore } from '@/stores/useChatStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { MessageBubble } from '../MessageBubble';
import { MessageInput } from '../MessageInput/MessageInput';
import { sendMessageToBackend } from '@/services/chatService';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Message } from '@/types';

export function ChatWindow() {
  const { currentChatId, messages, setMessagesForChat, addMessage } = useChatStore();
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];

  useEffect(() => {
    if (!currentChatId || !user) return;

    const messagesRef = collection(db, 'chats', currentChatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          chatId: currentChatId,
          author: data.author,
          text: data.text,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
        });
      });
      setMessagesForChat(currentChatId, msgs);
    }, (error) => {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    });

    return () => unsubscribe();
  }, [currentChatId, user, setMessagesForChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = async (text: string) => {
    if (!currentChatId || !user) {
      toast.error('Please select a chat first');
      return;
    }

    setIsLoading(true);
    try {
      const messagesRef = collection(db, 'chats', currentChatId, 'messages');
      
      await addDoc(messagesRef, {
        author: 'user',
        text,
        createdAt: serverTimestamp(),
        userId: user.uid
      });

      await sendMessageToBackend(currentChatId, text, user.uid);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please check your Firebase configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentChatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="relative inline-block">
            <Sparkles className="w-20 h-20 text-primary animate-pulse" />
            <div className="absolute inset-0 blur-2xl bg-primary/30 rounded-full animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to AI Chat Assistant</h2>
          <p className="text-muted-foreground">
            Select a chat from the sidebar or create a new one to start an intelligent conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-4">
          {currentMessages.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
              <p className="text-muted-foreground">Start a conversation...</p>
            </div>
          ) : (
            currentMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent text-accent-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="chat-bubble-assistant rounded-tl-sm px-4 py-3">
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
