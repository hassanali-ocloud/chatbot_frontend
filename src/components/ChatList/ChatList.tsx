import { Plus, MessageSquare, Trash2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/stores/useChatStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

type ChatListProps = {
  onNewChat: () => void;
};

export function ChatList({ onNewChat }: ChatListProps) {
  const navigate = useNavigate();
  const { chats, currentChatId, setCurrentChatId } = useChatStore();
  const { user } = useAuthStore();

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

      <div className="p-4 border-t border-[hsl(var(--sidebar-border))]">
        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.photoURL} alt={user?.displayName || 'User'} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.displayName?.[0]?.toUpperCase() || 'D'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{user?.displayName || 'Demo User'}</p>
            <p className="text-xs text-muted-foreground">View Settings</p>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
