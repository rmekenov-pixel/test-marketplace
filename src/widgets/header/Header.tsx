// src/widgets/header/Header.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Menu, Heart, Search } from 'lucide-react';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useCartStore } from '../../entities/cart/model/cartStore';
import { useWishlistStore } from '../../entities/wishlist/model/wishlistStore';
import { useUiStore } from '../../shared/lib/ui/useUiStore';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const { getTotalCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSidebar } = useUiStore();

  const cartCount = getTotalCount();
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0c]/95 backdrop-blur-md border-b border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Sidebar Trigger & Brand Wordmark */}
        <div className="flex items-center gap-4">
          <button
            onClick={openSidebar}
            className="p-2 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 rounded transition-colors"
            aria-label="Открыть боковое меню"
            title="Категории и меню"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-zinc-300 transition-colors uppercase">
              QazaqMarket
            </span>
          </Link>
        </div>

        {/* Urgent Primary Routes */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `transition-colors font-medium ${
                isActive
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`
            }
          >
            {t('nav.catalog') || 'Каталог книг'}
          </NavLink>
          <Link
            to="/catalog?search="
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors text-sm font-medium"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Поиск</span>
          </Link>
        </nav>

        {/* Right Actions: Wishlist, Cart & Profile */}
        <div className="flex items-center space-x-3">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 rounded transition-colors"
            aria-label="Избранное"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-zinc-100 text-zinc-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 rounded transition-colors"
            aria-label="Корзина"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-white text-zinc-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Button */}
          {isAuthenticated && user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 py-1.5 px-3 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 rounded text-xs text-zinc-200 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center text-[10px] font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate font-medium hidden sm:inline-block">
                {user.name}
              </span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center text-xs font-semibold py-2 px-3.5 bg-white text-zinc-950 hover:bg-zinc-200 rounded transition-colors shadow-xs"
            >
              {t('nav.login') || 'Войти'}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
