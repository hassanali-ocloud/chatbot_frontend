import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

type ChatListProps = {
  onNewChat: () => void;
};

export function ChatList({ onNewChat }: ChatListProps) {
  const { chats, currentChatId, setCurrentChatId } = useChatStore();

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]">
      <div className="p-4 border-b border-[hsl(var(--sidebar-border))]">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {chats.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">No chats yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start a new conversation
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors group relative",
                  "hover:bg-[hsl(var(--sidebar-accent))]",
                  currentChatId === chat.id && "bg-[hsl(var(--sidebar-accent))]"
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(chat.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement delete
                  }}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
