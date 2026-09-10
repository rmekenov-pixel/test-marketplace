import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  ShoppingBag,
  User as UserIcon,
  Package,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../entities/user/model/authStore';

export interface SidebarProps {
  className?: string;
  type?: 'client' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', type }) => {
  const { t } = useTranslation();
  const { role, user } = useAuthStore();
  const location = useLocation();

  const isAdmin = type === 'admin' || (!type && (role || '').toString().toLowerCase() === 'admin');
  const isAdminPath = location.pathname.startsWith('/admin') || type === 'admin';

  const clientLinks = [
    { to: '/dashboard', label: t('dashboard.client.orders') || 'Мои заказы', icon: ShoppingBag },
    { to: '/profile', label: t('dashboard.client.profile') || 'Профиль', icon: UserIcon },
    { to: '/catalog', label: t('nav.catalog') || 'Каталог книг', icon: Package },
  ];

  const adminLinks = [
    { to: '/admin', label: t('dashboard.admin.overview') || 'Сводка и метрики', icon: LayoutDashboard },
    { to: '/admin', hash: '#products', label: t('dashboard.admin.products') || 'Товары', icon: Package },
    { to: '/admin', hash: '#orders', label: t('dashboard.admin.orders') || 'Заказы', icon: ShoppingBag },
    { to: '/admin', hash: '#users', label: t('dashboard.admin.users') || 'Пользователи', icon: Users },
    { to: '/dashboard', label: t('dashboard.client.title') || 'Кабинет клиента', icon: ShieldCheck },
  ];

  const links = isAdminPath || isAdmin ? adminLinks : clientLinks;

  return (
    <aside
      className={`w-60 shrink-0 bg-white text-zinc-900 border-r border-zinc-200 dark:bg-[#0a0a0c] dark:text-zinc-100 dark:border-zinc-800 p-4 min-h-[calc(100vh-4rem)] hidden md:block ${className}`}
    >
      <div className="mb-6 px-3 py-2 bg-zinc-100 dark:bg-zinc-900/60 rounded border border-zinc-200 dark:border-zinc-800">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {isAdminPath ? (t('dashboard.admin.title') || 'Администрирование') : (t('dashboard.client.title') || 'Меню пользователя')}
        </div>
        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
          {user?.name || 'Пользователь'}
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;

          return (
            <NavLink
              key={link.label}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2 text-xs rounded transition-colors ${
                isActive
                  ? 'border-l-2 border-zinc-950 bg-zinc-100 text-zinc-950 dark:border-white dark:bg-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
