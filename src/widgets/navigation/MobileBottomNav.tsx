// src/widgets/navigation/MobileBottomNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../../entities/cart/model/cartStore';
import { useWishlistStore } from '../../entities/wishlist/model/wishlistStore';
import { useAuthStore } from '../../entities/user/model/authStore';

export const MobileBottomNav: React.FC = () => {
  const { getTotalCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const cartCount = getTotalCount();
  const wishlistCount = wishlistItems.length;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around"
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            isActive
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`
        }
      >
        <Home className="w-4 h-4" />
        <span>Главная</span>
      </NavLink>

      <NavLink
        to="/catalog"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            isActive
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`
        }
      >
        <LayoutGrid className="w-4 h-4" />
        <span>Каталог</span>
      </NavLink>

      <NavLink
        to="/wishlist"
        className={({ isActive }) =>
          `relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            isActive
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`
        }
      >
        <Heart className="w-4 h-4" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 right-1 min-w-[14px] h-[14px] px-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
        <span>Избранное</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) =>
          `relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            isActive
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`
        }
      >
        <ShoppingBag className="w-4 h-4" />
        {cartCount > 0 && (
          <span className="absolute -top-1 right-0 min-w-[14px] h-[14px] px-0.5 bg-sky-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <span>Корзина</span>
      </NavLink>

      <NavLink
        to={isAuthenticated ? '/profile' : '/auth'}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            isActive
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`
        }
      >
        <User className="w-4 h-4" />
        <span>{isAuthenticated ? 'Профиль' : 'Войти'}</span>
      </NavLink>
    </nav>
  );
};
