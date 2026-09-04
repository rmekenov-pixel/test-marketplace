import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Clock,
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
      <div className="bg-gh-subtle rounded-md border border-gh-border p-2 sticky top-18 shadow-gh">
        <div className="px-3 py-2 mb-1 border-b border-gh-border">
          <span className="text-xs font-semibold text-gh-fg">
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
                      ? 'bg-gh-overlay text-gh-fg font-semibold border border-gh-border'
                      : 'text-gh-muted hover:bg-gh-overlay hover:text-gh-fg'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-gh-muted" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className="border border-gh-border bg-gh-overlay text-gh-fg text-[10px] font-mono px-1.5 py-0.2 rounded-full">
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
