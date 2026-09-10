// src/features/auth/ui/RegisterForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../../entities/user/model/authStore';
import { useToastStore } from '../../../shared/lib/toast/useToastStore';
import { sanitizeInput } from '../../../shared/lib/security';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate registration request
      await new Promise((res) => setTimeout(res, 350));

      const cleanName = sanitizeInput(name);
      const cleanEmail = sanitizeInput(email);

      // Auto-assign 'client' role for new registrations
      login('client', {
        id: `user-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: 'client',
      });

      addToast({
        type: 'success',
        message: t('auth.registerSuccess') || 'Регистрация успешна',
      });

      navigate('/dashboard', { replace: true });
    } catch {
      setError('Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-1.5">
          {t('auth.name') || 'Имя и фамилия'}
        </label>
        <div className="relative">
          <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Арыстан Мекен"
          />
        </div>
      </div>

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
            placeholder="name@example.kz"
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
            placeholder="Минимум 6 символов"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono tracking-wider text-zinc-400 uppercase mb-1.5">
          {t('auth.confirmPassword') || 'Подтверждение пароля'}
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Повторите пароль"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 disabled:opacity-50 text-zinc-950 font-medium text-xs rounded transition-colors"
      >
        {isLoading ? (t('common.loading') || 'Загрузка...') : (t('auth.submitRegister') || 'Зарегистрироваться')}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-xs text-zinc-400 hover:text-zinc-100 hover:underline"
        >
          {t('auth.hasAccount') || 'Уже есть аккаунт?'} {t('auth.submitLogin') || 'Войти'}
        </button>
      </div>
    </form>
  );
};
