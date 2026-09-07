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
    { to: '/dashboard', label: t('dashboard.client.orders'), icon: ShoppingBag },
    { to: '/profile', label: t('dashboard.client.profile'), icon: UserIcon },
    { to: '/catalog', label: t('nav.catalog'), icon: Package },
  ];

  const adminLinks = [
    { to: '/admin', label: t('dashboard.admin.overview'), icon: LayoutDashboard },
    { to: '/admin', hash: '#products', label: t('dashboard.admin.products'), icon: Package },
    { to: '/admin', hash: '#orders', label: t('dashboard.admin.orders'), icon: ShoppingBag },
    { to: '/admin', hash: '#users', label: t('dashboard.admin.users'), icon: Users },
    { to: '/dashboard', label: t('dashboard.client.title'), icon: ShieldCheck },
  ];

  const links = isAdminPath || isAdmin ? adminLinks : clientLinks;

  return (
    <aside
      className={`w-60 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 min-h-[calc(100vh-4rem)] hidden md:block ${className}`}
    >
      <div className="mb-6 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200/60 dark:border-slate-800">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {isAdminPath ? t('dashboard.admin.title') : t('dashboard.client.title')}
        </div>
        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate mt-0.5">
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
              className={`flex items-center gap-3 px-3 py-2.5 text-xs rounded transition-colors ${
                isActive
                  ? 'border-l-2 border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
