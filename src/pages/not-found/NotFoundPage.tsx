// src/pages/not-found/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500">
        <FileQuestion className="w-12 h-12 stroke-1" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        404 — Страница не найдена
      </h1>

      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md">
        Запрошенная страница не существует или была перемещена по другому адресу.
      </p>

      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('nav.home')}</span>
        </Link>
      </div>
    </div>
  );
};
