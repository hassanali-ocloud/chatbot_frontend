import { Bot, User } from 'lucide-react';
import type { Message } from '@/types';
import { cn } from '@/lib/utils';

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = (message.author || message.role) === 'user';
  const isAssistant = (message.author || message.role) === 'assistant';

  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
      isUser && "flex-row-reverse"
    )}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser && "bg-primary text-primary-foreground",
        isAssistant && "bg-accent text-accent-foreground"
      )}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
        isUser && "chat-bubble-user rounded-tr-sm",
        isAssistant && "chat-bubble-assistant rounded-tl-sm"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>
        <p className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-right" : "text-left"
        )}>
          {new Date(message.createdAt || message.created_at || new Date()).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}
