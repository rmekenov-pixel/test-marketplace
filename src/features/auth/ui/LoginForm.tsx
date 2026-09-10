// src/features/auth/ui/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, Shield, Store, User as UserIcon } from 'lucide-react';
import { useAuthStore, DEMO_ACCOUNTS } from '../../../entities/user/model/authStore';
import { useToastStore } from '../../../shared/lib/toast/useToastStore';
import type { UserRole } from '../../../entities/user/model/types';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect role from email / credentials
  const determineRole = (userEmail: string): { role: UserRole; name: string } => {
    const lower = userEmail.trim().toLowerCase();
    if (lower.includes('admin')) {
      return { role: 'admin', name: DEMO_ACCOUNTS.admin.name };
    }
    if (lower.includes('seller')) {
      return { role: 'seller', name: DEMO_ACCOUNTS.seller.name };
    }
    const username = userEmail.split('@')[0] || 'Пользователь';
    return {
      role: 'client',
      name: username.charAt(0).toUpperCase() + username.slice(1),
    };
  };

  const handleQuickLogin = (key: 'admin' | 'seller' | 'client') => {
    const demo = DEMO_ACCOUNTS[key];
    setEmail(demo.email);
    setPassword(demo.passwordHint);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError(t('auth.invalidCredentials') || 'Введите email и пароль');
      return;
    }

    if (cleanPassword.length < 4) {
      setError('Пароль слишком короткий (минимум 4 символа)');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate authentication request
      await new Promise((res) => setTimeout(res, 350));

      const { role: detectedRole, name: detectedName } = determineRole(cleanEmail);

      login(detectedRole, {
        name: detectedName,
        email: cleanEmail,
        role: detectedRole,
      });

      addToast({
        type: 'success',
        message: t('auth.loginSuccess') || 'Вы успешно вошли в систему',
      });

      const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      let target = fromLocation;
      if (!target) {
        if (detectedRole === 'admin') target = '/admin';
        else if (detectedRole === 'seller') target = '/seller';
        else target = '/dashboard';
      }

      navigate(target, { replace: true });
    } catch {
      setError(t('auth.invalidCredentials') || 'Неверные данные для входа');
      addToast({
        type: 'error',
        message: t('auth.invalidCredentials') || 'Ошибка входа',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-1.5">
            {t('auth.email') || 'Email'}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="admin@qazaqmarket.kz или ваш email"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-1.5">
            {t('auth.password') || 'Пароль'}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 disabled:opacity-50 text-zinc-950 font-medium text-xs rounded transition-colors"
        >
          {isLoading ? (t('common.loading') || 'Загрузка...') : (t('auth.submitLogin') || 'Войти')}
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-xs text-zinc-400 hover:text-zinc-100 hover:underline"
          >
            {t('auth.noAccount') || 'Еще нет аккаунта?'} {t('auth.submitRegister') || 'Зарегистрироваться'}
          </button>
        </div>
      </form>

      {/* Automated Quick Login Presets */}
      <div className="pt-4 border-t border-zinc-800">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 text-center mb-2.5">
          Быстрый вход для тестирования
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="flex flex-col items-center justify-center p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 hover:bg-zinc-800/60 transition-all text-center group"
          >
            <Shield className="w-4 h-4 text-zinc-300 mb-1" />
            <span className="text-xs font-medium text-zinc-200">Админ</span>
            <span className="text-[10px] text-zinc-500 font-mono">admin123</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('seller')}
            className="flex flex-col items-center justify-center p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 hover:bg-zinc-800/60 transition-all text-center group"
          >
            <Store className="w-4 h-4 text-zinc-300 mb-1" />
            <span className="text-xs font-medium text-zinc-200">Продавец</span>
            <span className="text-[10px] text-zinc-500 font-mono">seller123</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('client')}
            className="flex flex-col items-center justify-center p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 hover:bg-zinc-800/60 transition-all text-center group"
          >
            <UserIcon className="w-4 h-4 text-zinc-300 mb-1" />
            <span className="text-xs font-medium text-zinc-200">Покупатель</span>
            <span className="text-[10px] text-zinc-500 font-mono">user123</span>
          </button>
        </div>
      </div>
    </div>
  );
};
