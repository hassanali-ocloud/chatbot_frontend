# AI Chat Assistant - Lovable Chatbot Frontend

A modern, real-time chat application built with React, TypeScript, Firebase, and Zustand. This project implements a beautiful chatbot interface with Google authentication, real-time message synchronization via Firestore, and a clean, responsive UI.

## 🚀 Features

- **Firebase Authentication** - Secure Google Sign-In integration
- **Real-time Chat** - Live message synchronization via Firestore
- **Multiple Conversations** - Manage multiple chat sessions
- **Modern UI** - Beautiful gradient design with smooth animations
- **TypeScript** - Fully typed for better development experience
- **State Management** - Efficient state handling with Zustand
- **Responsive Design** - Works seamlessly on all devices

## 🛠️ Tech Stack

- **React 18+** - Modern functional components with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Firebase v9+** - Authentication & Firestore database
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatList/          # Sidebar with chat history
│   ├── ChatWindow/        # Main chat interface
│   ├── MessageInput/      # Message input component
│   ├── MessageBubble.tsx  # Individual message display
│   ├── Header.tsx         # App header with user menu
│   └── AuthScreen.tsx     # Login screen
├── services/
│   ├── firebase.ts        # Firebase initialization & auth
│   ├── api.ts             # Axios instance configuration
│   └── chatService.ts     # Chat API service
├── stores/
│   ├── useAuthStore.ts    # Authentication state
│   └── useChatStore.ts    # Chat & messages state
├── types/
│   └── index.ts           # TypeScript type definitions
├── hooks/
│   └── useOnlineStatus.ts # Online/offline detection
└── App.tsx                # Main application component
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ and npm installed
- Firebase project with Firestore and Authentication enabled
- Google OAuth configured in Firebase Console

### 1. Clone and Install

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** → Sign-in method → Google
4. Enable **Firestore Database** in production mode
5. Get your Firebase config from Project Settings

### 3. Environment Variables

Create a `.env` file in the project root (or add to Lovable's environment settings):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Backend API Endpoint (optional - for Cloud Functions)
VITE_BACKEND_BASE_URL=https://your-cloud-function-url.com
```

### 4. Firestore Security Rules

Add these security rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User chats
    match /users/{userId}/chats/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chat messages
    match /chats/{chatId}/messages/{messageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Chat metadata
    match /chats/{chatId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 🔌 Backend Integration

This frontend is designed to work with a Firebase Cloud Function backend. The expected API endpoint:

### POST /api/chat

**Request:**
```json
{
  "chatId": "string",
  "text": "string",
  "userId": "string"
}
```

**Response:**
```json
{
  "status": "ok"
}
```

The Cloud Function should:
1. Receive the user's message
2. Call your LLM provider (OpenAI, Anthropic, etc.)
3. Write the assistant's response to Firestore
4. Frontend will receive updates via real-time listeners

### Example Cloud Function Structure

```typescript
// functions/src/index.ts
export const chat = onRequest(async (req, res) => {
  const { chatId, text, userId } = req.body;
  
  // Call your LLM provider
  const response = await callLLM(text);
  
  // Write to Firestore
  await admin.firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .add({
      author: 'assistant',
      text: response,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  
  res.json({ status: 'ok' });
});
```

## 🎨 Design System

The app uses a custom design system with:
- **Purple gradient theme** for a modern AI aesthetic
- **Smooth animations** for better UX
- **Dark/light mode support** via CSS variables
- **Custom chat bubbles** with user/assistant styling
- **Responsive sidebar** for chat history

## 📝 Usage

1. **Sign In** - Click "Sign in with Google" to authenticate
2. **New Chat** - Click "New Chat" to start a conversation
3. **Send Messages** - Type your message and press Enter (Shift+Enter for new line)
4. **Switch Chats** - Click any chat in the sidebar to switch conversations
5. **Sign Out** - Click your avatar → Sign out

## 🚀 Deployment on Lovable

1. Push your code to the connected repository
2. Add environment variables in Lovable Project Settings
3. Click "Publish" to deploy your app
4. Configure custom domain (optional) in Project Settings

## 🔐 Security Notes

- Firebase API keys in `VITE_` variables are safe for public exposure
- Never expose backend API keys (OpenAI, etc.) to the frontend
- Keep sensitive keys in Cloud Functions environment only
- Enable Firestore security rules before production deployment

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Zustand Guide](https://zustand-demo.pmnd.rs/)
- [Lovable Documentation](https://docs.lovable.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## 🤝 Contributing

This project follows the design scaffold outlined in the design document. When making changes:
1. Maintain the existing architecture
2. Follow TypeScript best practices
3. Keep components small and focused
4. Use the design system tokens
5. Test with Firebase emulators when possible

## 📄 License

This project was built with Lovable and follows the repository's license terms.

---

Built with ❤️ using [Lovable](https://lovable.dev)
