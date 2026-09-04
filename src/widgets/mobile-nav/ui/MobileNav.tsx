import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, ShoppingBag, Clock, User as UserIcon, Shield } from 'lucide-react';
import { useAuthStore } from '../../../entities/user';
import { useCartStore } from '../../../entities/cart';
import { ROUTES } from '../../../shared/config/routes';

export const MobileNav: React.FC = () => {
  const role = useAuthStore((state) => state.role);
  const cartCount = useCartStore((state) => state.getTotalCount());

  if (role === 'admin') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gh-subtle border-t border-gh-border px-2 py-1 flex justify-around">
        <NavLink
          to={ROUTES.ADMIN.DASHBOARD}
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 text-[11px] ${
              isActive ? 'text-gh-accent font-semibold' : 'text-gh-muted'
            }`
          }
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Сводка</span>
        </NavLink>
        <NavLink
          to={ROUTES.ADMIN.CATALOG}
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 text-[11px] ${
              isActive ? 'text-gh-accent font-semibold' : 'text-gh-muted'
            }`
          }
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Товары</span>
        </NavLink>
        <NavLink
          to={ROUTES.ADMIN.WAREHOUSE}
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 text-[11px] ${
              isActive ? 'text-gh-accent font-semibold' : 'text-gh-muted'
            }`
          }
        >
          <Shield className="w-4 h-4 mb-0.5" />
          <span>Склад</span>
        </NavLink>
      </nav>
    );
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gh-subtle border-t border-gh-border px-2 py-1 flex justify-around">
      <NavLink
        to={ROUTES.HOME}
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 text-[11px] ${
            isActive ? 'text-gh-accent font-semibold' : 'text-gh-muted'
          }`
        }
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>Главная</span>
      </NavLink>
      <NavLink
        to={ROUTES.CLIENT.CATALOG}
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 text-[11px] ${
            isActive ? 'text-gh-accent font-semibold' : 'text-gh-muted'
          }`
        }
      >
        <BookOpen className="w-4 h-4 mb-0.5" />
        <span>Каталог</span>
      </NavLink>
      <NavLink
        to={ROUTES.CLIENT.CART}
        className={({ isActive }) =>
          `relative flex flex-col items-center py-1 px-2 text-[11px] ${
            isActive ? 'text-gh-accent font-semibold' : 'text-gh-muted'
          }`
        }
      >
        <ShoppingBag className="w-4 h-4 mb-0.5" />
        <span>Корзина</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-2 bg-gh-overlay text-gh-fg border border-gh-border text-[9px] font-mono rounded-full w-3.5 h-3.5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </NavLink>
      <NavLink
        to={ROUTES.CLIENT.ORDERS}
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 text-[11px] ${
            isActive ? 'text-gh-accent font-semibold' : 'text-gh-muted'
          }`
        }
      >
        <Clock className="w-4 h-4 mb-0.5" />
        <span>Заказы</span>
      </NavLink>
      <NavLink
        to={ROUTES.CLIENT.DASHBOARD}
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 text-[11px] ${
            isActive ? 'text-gh-accent font-semibold' : 'text-gh-muted'
          }`
        }
      >
        <UserIcon className="w-4 h-4 mb-0.5" />
        <span>Кабинет</span>
      </NavLink>
    </nav>
  );
};
