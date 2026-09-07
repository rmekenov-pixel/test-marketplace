import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Sun, Moon, Globe, LogIn, LogOut } from 'lucide-react';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useTheme } from '../../shared/lib/theme/useTheme';
import { useLang, type Language } from '../../shared/lib/i18n/useLang';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, role, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();

  if (!isOpen) return null;

  const isAdmin = (role || '').toString().toLowerCase() === 'admin';

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              QazaqMarket
            </span>
            <button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col space-y-3 mb-6">
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `text-sm py-2 px-3 rounded transition-colors ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`
              }
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/catalog"
              onClick={onClose}
              className={({ isActive }) =>
                `text-sm py-2 px-3 rounded transition-colors ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`
              }
            >
              {t('nav.catalog')}
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                onClick={onClose}
                className={({ isActive }) =>
                  `text-sm py-2 px-3 rounded transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`
                }
              >
                {t('nav.dashboard')}
              </NavLink>
            )}
            {isAuthenticated && isAdmin && (
              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `text-sm py-2 px-3 rounded transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`
                }
              >
                {t('nav.admin')}
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink
                to="/profile"
                onClick={onClose}
                className={({ isActive }) =>
                  `text-sm py-2 px-3 rounded transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`
                }
              >
                {t('nav.profile')}
              </NavLink>
            )}
          </nav>
        </div>

        {/* Controls and Footer */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          {/* Controls: Lang and Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 border border-slate-300 dark:border-slate-700 rounded p-0.5">
              <Globe className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
              {(['ru', 'kk', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-xs px-2 py-1 rounded uppercase font-medium transition-colors ${
                    lang === l
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Auth Button */}
          {isAuthenticated && user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                <div className="w-7 h-7 rounded bg-sky-600 text-white flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate text-xs">
                  <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{user.name}</div>
                  <div className="text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
