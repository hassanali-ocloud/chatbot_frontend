# Frontend Integration Guide

This frontend has been refactored to work with a FastAPI backend. All data operations go through REST APIs instead of directly accessing Firebase/Firestore.

## ✅ Changes Made

### 1. Removed Direct Firebase/Firestore Access
- ❌ Removed all `firebase/firestore` imports
- ❌ Removed all direct Firestore operations (`onSnapshot`, `addDoc`, etc.)
- ✅ Kept only `firebase/auth` for authentication

### 2. Backend API Integration
All data operations now use the backend REST API:

#### API Base URL
Configure via environment variable:
```
VITE_BACKEND_BASE_URL=https://your-backend-domain.com
```
Default: `http://localhost:8000`

The API client automatically appends `/api/v1` to the base URL.

#### Implemented Endpoints

**Chat Management:**
- `POST /api/v1/chats` - Create new chat
- `GET /api/v1/chats` - List all chats
- `DELETE /api/v1/chats/{chat_id}` - Delete chat

**Message Operations:**
- `GET /api/v1/chats/{chat_id}/messages` - Get chat messages
- `POST /api/v1/chats/{chat_id}/messages` - Send message

All requests automatically include the Firebase ID token in the `Authorization` header.

### 3. Authentication
- Firebase Auth is still used for user authentication
- The frontend gets the Firebase ID token and passes it to the backend
- Backend validates the token and handles all data operations

### 4. Data Polling
Since Firestore real-time listeners are removed, the app now uses polling:
- Chats list: polls every 5 seconds
- Messages: polls every 2 seconds when viewing a chat

### 5. New Features
- ✅ Delete chat functionality now works in the sidebar

## 🚀 Setup Instructions

1. **Create `.env` file** (copy from `.env.example`):
```bash
cp .env.example .env
```

2. **Configure environment variables**:
```env
VITE_BACKEND_BASE_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

3. **Install dependencies**:
```bash
npm install
```

4. **Run the development server**:
```bash
npm run dev
```

## 📁 Modified Files

- `src/services/firebase.ts` - Removed Firestore, kept Auth only
- `src/services/api.ts` - Updated to use correct API base URL
- `src/services/chatService.ts` - Complete rewrite with backend API calls
- `src/App.tsx` - Replaced Firestore listeners with API calls
- `src/components/ChatWindow/ChatWindow.tsx` - Uses API for messages
- `src/components/ChatList/ChatList.tsx` - Added delete functionality
- `src/stores/useChatStore.ts` - Added deleteChat action
- `src/types/index.ts` - Updated types to match API responses

## 🔧 API Client

The `src/services/api.ts` file contains the axios client with automatic token injection:

```typescript
// Automatically adds Firebase ID token to all requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📡 Backend Requirements

Your backend must implement these endpoints as documented in `lovable_frontend_instruction.md`:

1. **POST /api/v1/chats** - Create chat
2. **GET /api/v1/chats** - List chats
3. **DELETE /api/v1/chats/{chat_id}** - Delete chat
4. **GET /api/v1/chats/{chat_id}/messages** - Get messages
5. **POST /api/v1/chats/{chat_id}/messages** - Send message

All endpoints must:
- Accept `Authorization: Bearer <Firebase_ID_Token>` header
- Return JSON responses matching the documented format
- Handle Firebase token verification

## 🎯 Demo Mode

The app supports a demo mode for testing without authentication:
- Local-only chat storage (no backend calls)
- Simulated AI responses
- No data persistence

## 🔐 Security

- All API requests include Firebase ID token
- Backend validates tokens before processing
- No sensitive data stored in frontend
- CORS properly configured on backend

## 📝 Notes

- Polling intervals can be adjusted in `src/App.tsx` and `src/components/ChatWindow/ChatWindow.tsx`
- For real-time updates, consider implementing WebSocket support in the backend
- Message types support both snake_case (backend) and camelCase (frontend) for flexibility
