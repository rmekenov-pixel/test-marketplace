import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from './types';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  sessionToken: string | null;

  login: (role: UserRole, customUser?: Partial<User>) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  verifySession: () => boolean;
}

const DEFAULT_CLIENT: User = {
  id: 'user-client-1',
  name: 'Арыстан Мекен',
  email: 'arystan@kitapall.kz',
  role: 'client',
  phone: '+7 777 123 4567',
};

const DEFAULT_ADMIN: User = {
  id: 'user-admin-1',
  name: 'Администратор Kitap All',
  email: 'admin@kitapall.kz',
  role: 'admin',
  phone: '+7 700 987 6543',
};

function generateSessionToken(role: UserRole, userId: string): string {
  const payload = `${userId}:${role}:${Date.now()}`;
  return btoa(payload);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_CLIENT,
      role: 'client',
      isAuthenticated: true,
      sessionToken: generateSessionToken('client', DEFAULT_CLIENT.id),

      login: (role, customUser) => {
        const baseUser = role === 'admin' ? DEFAULT_ADMIN : DEFAULT_CLIENT;
        const finalUser: User = {
          ...baseUser,
          ...customUser,
          role,
        };
        const token = generateSessionToken(role, finalUser.id);
        set({
          user: finalUser,
          role,
          isAuthenticated: true,
          sessionToken: token,
        });
      },

      logout: () => {
        set({
          user: null,
          role: 'client',
          isAuthenticated: false,
          sessionToken: null,
        });
      },

      setRole: (role) => {
        get().login(role);
      },

      verifySession: () => {
        const { sessionToken, user, role } = get();
        if (!sessionToken || !user) return false;
        try {
          const decoded = atob(sessionToken);
          const [tokenUserId, tokenRole] = decoded.split(':');
          return tokenUserId === user.id && tokenRole === role;
        } catch {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'kitap_all_auth_v3',
      version: 1,
      migrate: (persistedState: unknown) => {
        return persistedState as AuthState;
      },
    }
  )
);
