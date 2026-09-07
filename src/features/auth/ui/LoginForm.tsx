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
          <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            {t('auth.email') || 'Email'}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="admin@qazaqmarket.kz или ваш email"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            {t('auth.password') || 'Пароль'}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-medium text-sm rounded transition-colors shadow-xs"
        >
          {isLoading ? (t('common.loading') || 'Загрузка...') : (t('auth.submitLogin') || 'Войти')}
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
          >
            {t('auth.noAccount') || 'Еще нет аккаунта?'} {t('auth.submitRegister') || 'Зарегистрироваться'}
          </button>
        </div>
      </form>

      {/* Automated Quick Login Presets */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center mb-2.5">
          Быстрый вход для тестирования
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="flex flex-col items-center justify-center p-2 rounded border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-all text-center group"
          >
            <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400 mb-1" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Админ</span>
            <span className="text-[10px] text-slate-400 font-mono">admin123</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('seller')}
            className="flex flex-col items-center justify-center p-2 rounded border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all text-center group"
          >
            <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Продавец</span>
            <span className="text-[10px] text-slate-400 font-mono">seller123</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('client')}
            className="flex flex-col items-center justify-center p-2 rounded border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all text-center group"
          >
            <UserIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Покупатель</span>
            <span className="text-[10px] text-slate-400 font-mono">user123</span>
          </button>
        </div>
      </div>
    </div>
  );
};
