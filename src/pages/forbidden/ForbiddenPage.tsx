// src/pages/forbidden/ForbiddenPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ForbiddenPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-full text-rose-600 dark:text-rose-400">
        <ShieldAlert className="w-12 h-12 stroke-1" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        403 — Доступ ограничен
      </h1>

      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md">
        У вас нет достаточных прав доступа (роли) для просмотра этой страницы. Переключите роль в профиле или вернитесь на главную.
      </p>

      <div className="pt-4 flex gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('nav.home')}</span>
        </Link>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded transition-colors"
        >
          <span>{t('nav.profile')}</span>
        </Link>
      </div>
    </div>
  );
};
