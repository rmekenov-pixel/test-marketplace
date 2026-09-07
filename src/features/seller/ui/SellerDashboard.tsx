import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { useSellerStore } from '../../../entities/seller/model/sellerStore';
import { formatKZT, formatDate } from '../../../shared/lib/format';
import { SafeImage } from '../../../shared/ui/SafeImage/SafeImage';

export const SellerDashboard: React.FC = () => {
  const { metrics, orders, products } = useSellerStore();

  const recentOrders = orders.slice(0, 3);
  const topProducts = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Выручка вендора</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatKZT(metrics.totalRevenue)}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Всего заказов</span>
            <ShoppingBag className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {metrics.totalOrders}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Средний чек</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatKZT(metrics.averageCheck)}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Заканчиваются</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {metrics.lowStockCount} <span className="text-xs font-normal text-slate-400">товаров</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Свежие заказы
            </h2>
            <Link
              to="/seller/orders"
              className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Все заказы</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{order.orderNumber}</div>
                  <div className="text-slate-500">{order.customerName} • {formatDate(order.createdAt)}</div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{formatKZT(order.total)}</div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Лидеры продаж
            </h2>
            <Link
              to="/seller/products"
              className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Управление складом</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-slate-200 dark:border-slate-800">
                    <SafeImage src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{p.title}</div>
                    <div className="text-slate-400 text-[11px]">{p.sku} • Продано: {p.salesCount} шт.</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{formatKZT(p.revenue)}</div>
                  <div className="text-[11px] text-slate-400">Остаток: {p.stock} шт.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
