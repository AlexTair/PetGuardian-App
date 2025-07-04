import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/user';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  clearUser: () => void;
  isPremium: () => boolean;
  decrementAiScans: () => void;
  upgradeToPremiun: (expiryDate: string) => void;
}

const DEFAULT_USER: User = {
  id: '1',
  name: 'Pet Owner',
  email: 'pet.owner@example.com',
  isPremium: false,
  aiScansRemaining: 3,
  preferences: {
    notifications: true,
    theme: 'light',
    reminderTime: 30,
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      clearUser: () => set({ user: null }),
      isPremium: () => {
        const user = get().user;
        if (!user) return false;
        if (!user.isPremium) return false;
        if (!user.premiumUntil) return false;
        
        const now = new Date();
        const premiumUntil = new Date(user.premiumUntil);
        return premiumUntil > now;
      },
      decrementAiScans: () => {
        const user = get().user;
        if (!user) return;
        if (get().isPremium()) return; // Premium users have unlimited scans
        
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                aiScansRemaining: Math.max(0, state.user.aiScansRemaining - 1),
              }
            : null,
        }));
      },
      upgradeToPremiun: (expiryDate) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                isPremium: true,
                premiumUntil: expiryDate,
              }
            : null,
        }));
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (!state || !state.user) {
            // Initialize with default user if none exists
            state?.setUser(DEFAULT_USER);
          }
        };
      },
    }
  )
);
