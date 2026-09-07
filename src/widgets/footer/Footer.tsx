import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLang, type Language } from '../../shared/lib/i18n/useLang';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { lang, setLang } = useLang();

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            QazaqMarket
          </span>{' '}
          © {new Date().getFullYear()}. Все права защищены.
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/catalog" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            {t('nav.catalog')}
          </Link>
          <Link to="/profile" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            {t('nav.profile')}
          </Link>
        </div>

        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded p-0.5">
          {(['ru', 'kk', 'en'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-0.5 rounded uppercase font-medium transition-colors ${
                lang === l
                  ? 'bg-sky-600 text-white'
                  : 'hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
