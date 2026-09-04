import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Clock,
  Wallet,
  Package,
  BarChart3,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../../../entities/user';
import { useCartStore } from '../../../entities/cart';
import { ROUTES } from '../../../shared/config/routes';

export interface SidebarProps {
  type?: 'client' | 'admin';
}

interface SidebarLinkItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ type }) => {
  const currentRole = useAuthStore((state) => state.role);
  const effectiveType = type || currentRole;
  const cartCount = useCartStore((state) => state.getTotalCount());

  const clientLinks: SidebarLinkItem[] = [
    { to: ROUTES.CLIENT.DASHBOARD, label: 'Главный кабинет', icon: LayoutDashboard },
    { to: ROUTES.CLIENT.CATALOG, label: 'Каталог книг', icon: BookOpen },
    { to: ROUTES.CLIENT.CART, label: 'Корзина', icon: ShoppingBag, badge: cartCount > 0 ? cartCount : undefined },
    { to: ROUTES.CLIENT.ORDERS, label: 'Мои заказы', icon: Clock },
    { to: ROUTES.CLIENT.WALLET, label: 'Kaspi Кошелек', icon: Wallet },
  ];

  const adminLinks: SidebarLinkItem[] = [
    { to: ROUTES.ADMIN.DASHBOARD, label: 'Сводка и метрики', icon: LayoutDashboard },
    { to: ROUTES.ADMIN.CATALOG, label: 'Управление товарами', icon: Layers },
    { to: ROUTES.ADMIN.WAREHOUSE, label: 'Склад и остатки', icon: Package },
    { to: ROUTES.ADMIN.ANALYTICS, label: 'Аналитика продаж', icon: BarChart3 },
  ];

  const links = effectiveType === 'admin' ? adminLinks : clientLinks;

  return (
    <aside className="w-56 shrink-0 hidden md:block">
      <div className="bg-[#161b22] rounded-md border border-[#30363d] p-2 sticky top-18 shadow-gh">
        <div className="px-3 py-2 mb-1 border-b border-[#30363d]">
          <span className="text-xs font-semibold text-[#f0f6fc]">
            {effectiveType === 'admin' ? 'Администрирование' : 'Меню пользователя'}
          </span>
        </div>

        <nav className="space-y-0.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#21262d] text-[#f0f6fc] font-semibold border border-[#30363d]'
                      : 'text-[#8d96a0] hover:bg-[#21262d] hover:text-[#f0f6fc]'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-[#8d96a0]" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className="border border-[#30363d] bg-[#21262d] text-[#f0f6fc] text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
