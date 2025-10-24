import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { MessageBubble } from '../MessageBubble';
import { MessageInput } from '../MessageInput/MessageInput';
import { getChatMessages, sendMessage } from '@/services/chatService';
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

    const fetchMessages = async () => {
      try {
        const msgs = await getChatMessages(currentChatId);
        const normalizedMsgs: Message[] = msgs.map(msg => ({
          id: (msg.id || msg._id) as string,
          chatId: currentChatId,
          author: msg.role,
          role: msg.role,
          text: msg.text,
          createdAt: msg.created_at || msg.createdAt || new Date().toISOString()
        }));
        setMessagesForChat(currentChatId, normalizedMsgs);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
    
    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [currentChatId, user, setMessagesForChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = async (text: string) => {
    if (!currentChatId) {
      toast.error('Please select a chat first');
      return;
    }

    setIsLoading(true);
    try {
      // Add user message to local state immediately
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        chatId: currentChatId,
        author: 'user',
        role: 'user',
        text,
        createdAt: new Date().toISOString()
      };
      addMessage(userMessage);

      if (user) {
        // Call backend API
        const response = await sendMessage(currentChatId, text);
        
        // Add assistant response
        const assistantMessage: Message = {
          id: response.assistant.id || `msg-${Date.now()}-assistant`,
          chatId: currentChatId,
          author: 'assistant',
          role: 'assistant',
          text: response.assistant.text,
          createdAt: response.assistant.created_at || response.assistant.createdAt || new Date().toISOString()
        };
        addMessage(assistantMessage);
      } else {
        // Demo mode: simulate AI response
        setTimeout(() => {
          const demoResponse: Message = {
            id: `msg-${Date.now()}-response`,
            chatId: currentChatId,
            author: 'assistant',
            role: 'assistant',
            text: 'This is a demo response. To get real AI responses, please sign in and configure your backend.',
            createdAt: new Date().toISOString()
          };
          addMessage(demoResponse);
          setIsLoading(false);
        }, 1500);
        return;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      if (user) {
        setIsLoading(false);
      }
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
