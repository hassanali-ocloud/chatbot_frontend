import { create } from 'zustand';
import type { UserProfile } from '../types';

type AuthState = {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u })
}));
