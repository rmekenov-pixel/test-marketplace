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
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t('nav.profile')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Управление персональной информацией и настройками доступа.
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-14 h-14 rounded-full bg-sky-600 text-white flex items-center justify-center text-xl font-bold">
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 text-base">
              {user?.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              {role.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {t('auth.name')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Телефон
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 777 123 4567"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded transition-colors inline-flex items-center gap-1.5"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isSaved ? 'Сохранено' : t('common.save')}</span>
            </button>
          </div>
        </form>

        {/* Quick RBAC Switcher */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-sky-600" />
            <span>Тестовое переключение роли (RBAC)</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleRoleToggle('client')}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                role.toLowerCase() === 'client'
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                  : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              CLIENT (Покупатель)
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('admin')}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                role.toLowerCase() === 'admin'
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                  : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              ADMIN (Администратор)
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium rounded transition-colors inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
