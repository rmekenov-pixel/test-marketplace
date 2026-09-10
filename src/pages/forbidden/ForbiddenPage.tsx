// src/pages/forbidden/ForbiddenPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ForbiddenPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-24 flex flex-col items-start justify-start text-left space-y-4">
      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
        <ShieldAlert className="w-8 h-8 stroke-1" />
      </div>

      <h1 className="text-2xl font-bold text-zinc-100">
        403 — Доступ ограничен
      </h1>

      <p className="text-xs md:text-sm text-zinc-500 max-w-md">
        У вас нет достаточных прав доступа (роли) для просмотра этой страницы. Переключите роль в профиле или вернитесь на главную.
      </p>

      <div className="pt-4 flex gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('nav.home')}</span>
        </Link>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-semibold rounded transition-colors"
        >
          <span>{t('nav.profile')}</span>
        </Link>
      </div>
    </div>
  );
};
