// src/pages/profile/ProfilePage.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Shield, LogOut, Check } from 'lucide-react';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useToastStore } from '../../shared/lib/toast/useToastStore';
import { sanitizeInput } from '../../shared/lib/security';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, role, login, logout } = useAuthStore();
  const { addToast } = useToastStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    login(role, {
      ...user,
      name: sanitizeInput(name),
      phone: sanitizeInput(phone),
    });

    setIsSaved(true);
    addToast({
      type: 'success',
      message: 'Данные профиля обновлены!',
    });
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRoleToggle = (targetRole: 'client' | 'admin') => {
    login(targetRole);
    addToast({
      type: 'info',
      message: `Роль переключена на: ${targetRole.toUpperCase()}`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-100">
          {t('nav.profile')}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Управление персональной информацией и настройками доступа.
        </p>
      </div>

      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-100 flex items-center justify-center text-lg font-bold font-mono">
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-semibold text-zinc-100 text-sm">
              {user?.name}
            </div>
            <div className="text-xs text-zinc-400 font-mono">{user?.email}</div>
            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-700">
              {role.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              {t('auth.name')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900/50 border border-zinc-800/80 rounded text-zinc-500 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Телефон
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 777 123 4567"
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded transition-colors inline-flex items-center gap-1.5"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isSaved ? 'Сохранено' : t('common.save')}</span>
            </button>
          </div>
        </form>

        {/* Quick RBAC Switcher */}
        <div className="pt-6 border-t border-zinc-800 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-zinc-400" />
            <span>Тестовое переключение роли (RBAC)</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleRoleToggle('client')}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                role.toLowerCase() === 'client'
                  ? 'border-zinc-500 bg-zinc-900 text-zinc-100 font-semibold'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              CLIENT (Покупатель)
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('admin')}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                role.toLowerCase() === 'admin'
                  ? 'border-zinc-500 bg-zinc-900 text-zinc-100 font-semibold'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              ADMIN (Администратор)
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-zinc-800">
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 border border-rose-900/60 text-rose-400 hover:bg-rose-950/30 text-xs font-medium rounded transition-colors inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
