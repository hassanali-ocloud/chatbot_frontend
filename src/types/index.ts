export type UID = string;

export type Message = {
  id?: string;
  _id?: string;
  chatId?: string;
  chat_id?: string;
  author?: 'user' | 'assistant' | 'system';
  role: 'user' | 'assistant' | 'system';
  text: string;
  createdAt?: string;
  created_at?: string;
};

export type Chat = {
  id: string;
  title: string;
  lastUpdated?: string;
  last_updated?: string;
  createdAt?: string;
  created_at?: string;
  ownerId?: UID;
};

export type UserProfile = {
  uid: UID;
  displayName?: string;
  photoURL?: string;
  email?: string;
};
