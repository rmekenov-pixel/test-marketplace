// src/pages/not-found/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-24 flex flex-col items-start justify-start text-left space-y-4">
      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
        <FileQuestion className="w-8 h-8 stroke-1" />
      </div>

      <h1 className="text-2xl font-bold text-zinc-100">
        404 — Страница не найдена
      </h1>

      <p className="text-xs md:text-sm text-zinc-500 max-w-md">
        Запрошенная страница не существует или была перемещена по другому адресу.
      </p>

      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('nav.home')}</span>
        </Link>
      </div>
    </div>
  );
};
