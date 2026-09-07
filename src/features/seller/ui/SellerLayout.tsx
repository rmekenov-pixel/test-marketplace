import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  ShoppingBag,
  TrendingUp,
  ArrowLeft,
  Store,
} from 'lucide-react';
import { useAuthStore } from '../../../entities/user/model/authStore';

export const SellerLayout: React.FC = () => {
  const { user } = useAuthStore();

  const links = [
    { to: '/seller', end: true, label: 'Обзор', icon: LayoutDashboard },
    { to: '/seller/products', label: 'Товары', icon: Boxes },
    { to: '/seller/orders', label: 'Заказы', icon: ShoppingBag },
    { to: '/seller/analytics', label: 'Аналитика', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Seller Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Кабинет продавца</span>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                B2B Portal
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Вендор: {user?.name || 'Qazaq Books Vendor'}
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на витрину</span>
        </Link>
      </div>

      {/* Tabs / Subnavigation */}
      <nav className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3.5 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Main Outlet */}
      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  );
};
