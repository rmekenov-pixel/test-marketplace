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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <span>Кабинет продавца</span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
                B2B Portal
              </span>
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              Вендор: {user?.name || 'Qazaq Books Vendor'}
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на витрину</span>
        </Link>
      </div>

      {/* Tabs / Subnavigation */}
      <nav className="flex space-x-2 border-b border-zinc-800 pb-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
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
