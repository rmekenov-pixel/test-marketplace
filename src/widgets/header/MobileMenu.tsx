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
      <div className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col justify-between shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
            <span className="text-sm font-bold tracking-tight text-zinc-100 uppercase">
              QazaqMarket
            </span>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-zinc-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col space-y-1 mb-6">
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `text-xs py-2 px-3 rounded transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`
              }
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/catalog"
              onClick={onClose}
              className={({ isActive }) =>
                `text-xs py-2 px-3 rounded transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
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
                  `text-xs py-2 px-3 rounded transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
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
                  `text-xs py-2 px-3 rounded transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
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
                  `text-xs py-2 px-3 rounded transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`
                }
              >
                {t('nav.profile')}
              </NavLink>
            )}
          </nav>
        </div>

        {/* Controls and Footer */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          {/* Controls: Lang and Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 border border-zinc-800 rounded p-0.5 bg-zinc-900">
              <Globe className="w-3.5 h-3.5 ml-1.5 text-zinc-500" />
              {(['ru', 'kk', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-[10px] px-2 py-1 rounded uppercase font-mono font-medium transition-colors ${
                    lang === l
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 border border-zinc-800 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Auth Button */}
          {isAuthenticated && user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-zinc-900 rounded border border-zinc-800">
                <div className="w-7 h-7 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center justify-center text-xs font-mono font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate text-xs">
                  <div className="font-medium text-zinc-100 truncate">{user.name}</div>
                  <div className="text-zinc-500 font-mono text-[10px] truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono text-rose-400 border border-rose-900/60 rounded hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded transition-colors"
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
