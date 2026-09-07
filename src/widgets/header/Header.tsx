// src/widgets/header/Header.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, ShoppingBag, Menu, Heart, Store } from 'lucide-react';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useCartStore } from '../../entities/cart/model/cartStore';
import { useWishlistStore } from '../../entities/wishlist/model/wishlistStore';
import { useTheme } from '../../shared/lib/theme/useTheme';
import { useLang, type Language } from '../../shared/lib/i18n/useLang';
import { useUiStore } from '../../shared/lib/ui/useUiStore';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, role } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();
  const { getTotalCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSidebar } = useUiStore();

  const cartCount = getTotalCount();
  const wishlistCount = wishlistItems.length;

  const normalizedRole = (role || '').toString().toLowerCase();
  const isAdmin = normalizedRole === 'admin';
  const isSeller = normalizedRole === 'seller' || isAdmin;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between gap-4">
        {/* Left: Sidebar Trigger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={openSidebar}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800 rounded transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Открыть боковое меню"
            title="Меню и категории"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-sky-600 dark:text-sky-400">
              QazaqMarket
            </span>
          </Link>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            {t('nav.catalog')}
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              {t('nav.dashboard')}
            </NavLink>
          )}
          {isAuthenticated && isSeller && (
            <NavLink
              to="/seller"
              className={({ isActive }) =>
                `transition-colors flex items-center gap-1 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Store className="w-3.5 h-3.5" />
              <span>Продавец</span>
            </NavLink>
          )}
          {isAuthenticated && isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              {t('nav.admin')}
            </NavLink>
          )}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-800 rounded p-0.5 text-xs">
            {(['ru', 'kk', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded uppercase font-medium transition-colors ${
                  lang === l
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800 rounded transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800 rounded transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800 rounded transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-sky-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Button */}
          {isAuthenticated && user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 pr-2.5 border border-slate-200 dark:border-slate-800 rounded hover:border-slate-400 dark:hover:border-slate-600 transition-colors text-xs"
              >
                <div className="w-5 h-5 rounded bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[90px] truncate text-slate-800 dark:text-slate-200 font-medium">
                  {user.name}
                </span>
              </Link>
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center text-xs font-medium py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded transition-colors"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
