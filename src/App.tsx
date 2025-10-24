import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { useAuthStore } from './stores/useAuthStore';
import { useChatStore } from './stores/useChatStore';
import { Header } from './components/Header';
import { ChatList } from './components/ChatList/ChatList';
import { ChatWindow } from './components/ChatWindow/ChatWindow';
import { AuthScreen } from './components/AuthScreen';
import { Settings } from './pages/Settings';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Chat } from './types';

const queryClient = new QueryClient();

function AppContent() {
  const { user, setUser } = useAuthStore();
  const { setChats, setCurrentChatId, addChat } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName ?? undefined,
          email: firebaseUser.email ?? undefined,
          photoURL: firebaseUser.photoURL ?? undefined
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (!user) return;

    const chatsRef = collection(db, 'users', user.uid, 'chats');
    const q = query(chatsRef, orderBy('lastUpdated', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats: Chat[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        chats.push({
          id: doc.id,
          title: data.title,
          lastUpdated: data.lastUpdated?.toDate().toISOString() || new Date().toISOString(),
          ownerId: user.uid
        });
      });
      setChats(chats);
    }, (error) => {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
    });

    return () => unsubscribe();
  }, [user, setChats]);

  const handleNewChat = async () => {
    try {
      if (user) {
        // Authenticated mode: save to Firestore
        const chatsRef = collection(db, 'users', user.uid, 'chats');
        const newChatRef = await addDoc(chatsRef, {
          title: 'New Chat',
          lastUpdated: serverTimestamp(),
          createdAt: serverTimestamp()
        });

        const chatDocRef = doc(db, 'chats', newChatRef.id);
        await updateDoc(chatDocRef, {
          ownerId: user.uid,
          createdAt: serverTimestamp()
        }).catch(() => {
          // Document might not exist yet, that's okay
        });

        setCurrentChatId(newChatRef.id);
      } else {
        // Demo mode: create local chat
        const newChatId = `demo-chat-${Date.now()}`;
        const newChat: Chat = {
          id: newChatId,
          title: 'Demo Chat',
          lastUpdated: new Date().toISOString(),
          ownerId: 'demo-user'
        };
        addChat(newChat);
        setCurrentChatId(newChatId);
      }
      toast.success('New chat created');
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create new chat');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !demoMode) {
    return <AuthScreen onDemoMode={() => setDemoMode(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <aside className="w-80 border-r border-border flex-shrink-0">
              <ChatList onNewChat={handleNewChat} />
            </aside>
            <main className="flex-1 overflow-hidden">
              <ChatWindow />
            </main>
          </div>
        </div>
      } />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
