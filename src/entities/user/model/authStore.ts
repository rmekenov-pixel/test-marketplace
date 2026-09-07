import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from './types';
import { sanitizeInput, sanitizeId } from '../../../shared/lib/security';

export interface DemoAccount {
  email: string;
  name: string;
  role: UserRole;
  passwordHint: string;
  description: string;
}

export const DEMO_ACCOUNTS: Record<string, DemoAccount> = {
  admin: {
    email: 'admin@qazaqmarket.kz',
    name: 'Администратор QazaqMarket',
    role: 'admin',
    passwordHint: 'admin123',
    description: 'Полный доступ к каталогу, заказам и аналитике',
  },
  seller: {
    email: 'seller@qazaqmarket.kz',
    name: 'Книжный Дом (Продавец)',
    role: 'seller',
    passwordHint: 'seller123',
    description: 'Управление собственными товарами и заказами',
  },
  client: {
    email: 'user@qazaqmarket.kz',
    name: 'Арыстан Мекен',
    role: 'client',
    passwordHint: 'user123',
    description: 'Покупка книг, избранное и история заказов',
  },
};

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

export const DEFAULT_CLIENT: User = {
  id: 'user-client-1',
  name: 'Арыстан Мекен',
  email: 'user@qazaqmarket.kz',
  role: 'client',
  phone: '+7 777 123 4567',
};

export const DEFAULT_ADMIN: User = {
  id: 'user-admin-1',
  name: 'Администратор QazaqMarket',
  email: 'admin@qazaqmarket.kz',
  role: 'admin',
  phone: '+7 700 987 6543',
};

export const DEFAULT_SELLER: User = {
  id: 'user-seller-1',
  name: 'Книжный Дом (Продавец)',
  email: 'seller@qazaqmarket.kz',
  role: 'seller',
  phone: '+7 701 555 7788',
};

function generateSessionToken(role: UserRole, userId: string): string {
  const payload = `${userId}:${role}:${Date.now()}`;
  return btoa(payload);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: 'client',
      isAuthenticated: false,
      sessionToken: null,

      login: (role, customUser) => {
        const normRole = (role || 'client').toString().toLowerCase();
        let baseUser = DEFAULT_CLIENT;
        if (normRole === 'admin') {
          baseUser = DEFAULT_ADMIN;
        } else if (normRole === 'seller') {
          baseUser = DEFAULT_SELLER;
        }

        const finalUser: User = {
          ...baseUser,
          ...(customUser ? {
            ...(customUser.id && { id: sanitizeId(customUser.id) }),
            ...(customUser.name && { name: sanitizeInput(customUser.name) }),
            ...(customUser.email && { email: sanitizeInput(customUser.email) }),
            ...(customUser.phone && { phone: sanitizeInput(customUser.phone) }),
          } : {}),
          role: normRole as UserRole,
        };
        const token = generateSessionToken(normRole as UserRole, finalUser.id);
        set({
          user: finalUser,
          role: normRole as UserRole,
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
          const normRole = (role || '').toString().toLowerCase();
          return tokenUserId === user.id && tokenRole.toLowerCase() === normRole;
        } catch {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'qazaqmarket_auth_v4',
      version: 1,
      migrate: (persistedState: unknown) => {
        return persistedState as AuthState;
      },
    }
  )
);
