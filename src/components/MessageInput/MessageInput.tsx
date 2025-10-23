import { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

type MessageInputProps = {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export function MessageInput({ onSendMessage, disabled, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-lg p-4">
      <div className="flex gap-2 max-w-4xl mx-auto">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift + Enter for new line)"
          disabled={disabled}
          className={cn(
            "resize-none min-h-[60px] max-h-[200px]",
            "focus-visible:ring-primary"
          )}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isLoading}
          size="icon"
          className="h-[60px] w-[60px] rounded-xl bg-primary hover:bg-primary/90 transition-all"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
      <p className="text-xs text-center text-muted-foreground mt-2">
        AI can make mistakes. Please verify important information.
      </p>
    </div>
  );
}
