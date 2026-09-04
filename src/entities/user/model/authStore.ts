import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from './types';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole, customUser?: Partial<User>) => void;
  logout: () => void;
  updateBalance: (delta: number) => void;
  setRole: (role: UserRole) => void;
}

const DEFAULT_CLIENT: User = {
  id: 'user-client-1',
  name: 'Арыстан Мекен',
  email: 'arystan@kitapall.kz',
  role: 'client',
  balance: 35000,
  phone: '+7 777 123 4567',
};

const DEFAULT_ADMIN: User = {
  id: 'user-admin-1',
  name: 'Администратор Kitap All',
  email: 'admin@kitapall.kz',
  role: 'admin',
  balance: 1500000,
  phone: '+7 700 987 6543',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_CLIENT,
      role: 'client',
      isAuthenticated: true,

      login: (role, customUser) => {
        const baseUser = role === 'admin' ? DEFAULT_ADMIN : DEFAULT_CLIENT;
        const finalUser: User = {
          ...baseUser,
          ...customUser,
          role,
        };
        set({
          user: finalUser,
          role,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          role: 'client',
          isAuthenticated: false,
        });
      },

      updateBalance: (delta) => {
        const { user } = get();
        if (!user) return;
        const newBalance = Math.max(0, user.balance + delta);
        set({
          user: { ...user, balance: newBalance },
        });
      },

      setRole: (role) => {
        get().login(role);
      },
    }),
    {
      name: 'kitap_all_auth_v2',
    }
  )
);
