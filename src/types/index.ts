export type UID = string;

export type Message = {
  id: string;
  chatId: string;
  author: 'user' | 'assistant' | 'system';
  text: string;
  createdAt: string; // ISO
};

export type Chat = {
  id: string;
  title: string;
  lastUpdated: string; // ISO
  ownerId: UID;
};

export type UserProfile = {
  uid: UID;
  displayName?: string;
  photoURL?: string;
  email?: string;
};
