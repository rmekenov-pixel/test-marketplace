// src/widgets/header/Header.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Menu, Heart, Search, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useCartStore } from '../../entities/cart/model/cartStore';
import { useWishlistStore } from '../../entities/wishlist/model/wishlistStore';
import { useUiStore } from '../../shared/lib/ui/useUiStore';
import { useTheme } from '../../shared/lib/theme/useTheme';
import { useLang } from '../../shared/lib/i18n/useLang';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const { getTotalCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSidebar } = useUiStore();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();

  const cartCount = getTotalCount();
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 text-zinc-900 border-zinc-200 dark:bg-[#0a0a0c]/95 dark:text-zinc-100 backdrop-blur-md border-b dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Sidebar Trigger & Brand Wordmark */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={openSidebar}
            className="p-2 text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-300 bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-white dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-900/50 rounded transition-colors"
            aria-label="Боковое меню"
            title="Категории и настройки"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors uppercase">
              QazaqMarket
            </span>
          </Link>
        </div>

        {/* Primary Routes */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `transition-colors font-medium ${
                isActive
                  ? 'text-zinc-950 dark:text-white font-semibold'
                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`
            }
          >
            {t('nav.catalog') || 'Каталог'}
          </NavLink>
          <Link
            to="/catalog?search="
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors text-sm font-medium"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t('catalog.search') ? 'Поиск' : 'Іздеу'}</span>
          </Link>
        </nav>

        {/* Right Actions: Language, Theme, Wishlist, Cart & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-0.5">
            {(['kk', 'ru'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-[11px] font-bold uppercase rounded transition-colors ${
                  lang === l || (l === 'kk' && lang === 'kz')
                    ? 'bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
                aria-label={`Switch language to ${l}`}
              >
                {l === 'kk' ? 'KZ' : 'RU'}
              </button>
            ))}
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-300 bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-white dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-900/50 rounded transition-colors"
            title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            aria-label="Переключить тему"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-300 bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-white dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-900/50 rounded transition-colors"
            aria-label="Избранное"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-300 bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-white dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-900/50 rounded transition-colors"
            aria-label="Корзина"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Button */}
          {isAuthenticated && user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 py-1.5 px-3 border border-zinc-200 hover:border-zinc-300 bg-zinc-100 dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-900/60 rounded text-xs text-zinc-900 dark:text-zinc-200 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center text-[10px] font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate font-medium hidden sm:inline-block">
                {user.name}
              </span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center text-xs font-semibold py-2 px-3 sm:px-3.5 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 rounded transition-colors shadow-xs"
            >
              {t('nav.login') || 'Войти'}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

