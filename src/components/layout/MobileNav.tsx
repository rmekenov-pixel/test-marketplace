import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, ShoppingBag, Clock, User as UserIcon, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export const MobileNav: React.FC = () => {
  const role = useAuthStore((state) => state.role);
  const cartCount = useCartStore((state) => state.getTotalCount());

  if (role === 'admin') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#161b22] border-t border-[#30363d] px-2 py-1 flex justify-around">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 text-[11px] ${
              isActive ? 'text-[#58a6ff] font-semibold' : 'text-[#8d96a0]'
            }`
          }
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Сводка</span>
        </NavLink>
        <NavLink
          to="/admin/catalog"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 text-[11px] ${
              isActive ? 'text-[#58a6ff] font-semibold' : 'text-[#8d96a0]'
            }`
          }
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Товары</span>
        </NavLink>
        <NavLink
          to="/admin/warehouse"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 text-[11px] ${
              isActive ? 'text-[#58a6ff] font-semibold' : 'text-[#8d96a0]'
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#161b22] border-t border-[#30363d] px-2 py-1 flex justify-around">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 text-[11px] ${
            isActive ? 'text-[#58a6ff] font-semibold' : 'text-[#8d96a0]'
          }`
        }
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>Главная</span>
      </NavLink>
      <NavLink
        to="/client/catalog"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 text-[11px] ${
            isActive ? 'text-[#58a6ff] font-semibold' : 'text-[#8d96a0]'
          }`
        }
      >
        <BookOpen className="w-4 h-4 mb-0.5" />
        <span>Каталог</span>
      </NavLink>
      <NavLink
        to="/client/cart"
        className={({ isActive }) =>
          `relative flex flex-col items-center py-1 px-2 text-[11px] ${
            isActive ? 'text-[#58a6ff] font-semibold' : 'text-[#8d96a0]'
          }`
        }
      >
        <ShoppingBag className="w-4 h-4 mb-0.5" />
        <span>Корзина</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-2 bg-[#21262d] text-[#f0f6fc] border border-[#30363d] text-[9px] font-mono rounded-full w-3.5 h-3.5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </NavLink>
      <NavLink
        to="/client/orders"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 text-[11px] ${
            isActive ? 'text-[#58a6ff] font-semibold' : 'text-[#8d96a0]'
          }`
        }
      >
        <Clock className="w-4 h-4 mb-0.5" />
        <span>Заказы</span>
      </NavLink>
      <NavLink
        to="/client/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 text-[11px] ${
            isActive ? 'text-[#58a6ff] font-semibold' : 'text-[#8d96a0]'
          }`
        }
      >
        <UserIcon className="w-4 h-4 mb-0.5" />
        <span>Кабинет</span>
      </NavLink>
    </nav>
  );
};
