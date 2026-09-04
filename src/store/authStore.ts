import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '../types';

interface AuthState {
  user: User | null;
  role: Role;
  login: (role: Role, name?: string, email?: string) => void;
  logout: () => void;
  updateBalance: (delta: number) => void;
  setBalance: (newBalance: number) => void;
}

const DEFAULT_CLIENT_USER: User = {
  id: 'user-client-1',
  name: 'Арыстан Сериков',
  email: 'aristan@kitap.kz',
  role: 'client',
  balance: 35000,
  phone: '+7 (777) 123-45-67',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
};

const DEFAULT_ADMIN_USER: User = {
  id: 'user-admin-1',
  name: 'Администратор Магазина',
  email: 'admin@kitap.kz',
  role: 'admin',
  balance: 0,
  phone: '+7 (701) 999-88-77',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEFAULT_CLIENT_USER,
      role: 'client',

      login: (role: Role, name?: string, email?: string) => {
        const baseUser = role === 'admin' ? DEFAULT_ADMIN_USER : DEFAULT_CLIENT_USER;
        set({
          role,
          user: {
            ...baseUser,
            name: name || baseUser.name,
            email: email || baseUser.email,
            role,
          },
        });
      },

      logout: () => {
        set({
          user: null,
          role: 'client',
        });
      },

      updateBalance: (delta: number) => {
        set((state) => {
          if (!state.user) return state;
          const updatedBalance = Math.max(0, state.user.balance + delta);
          return {
            user: { ...state.user, balance: updatedBalance },
          };
        });
      },

      setBalance: (newBalance: number) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: { ...state.user, balance: Math.max(0, newBalance) },
          };
        });
      },
    }),
    {
      name: 'kitap_auth_storage',
    }
  )
);
