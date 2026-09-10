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
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Выручка вендора</span>
            <DollarSign className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {formatKZT(metrics.totalRevenue)}
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Всего заказов</span>
            <ShoppingBag className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {metrics.totalOrders}
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Средний чек</span>
            <TrendingUp className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {formatKZT(metrics.averageCheck)}
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Заканчиваются</span>
            <AlertTriangle className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {metrics.lowStockCount} <span className="text-xs font-normal text-zinc-500 font-sans">товаров</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Свежие заказы
            </h2>
            <Link
              to="/seller/orders"
              className="text-xs font-mono text-zinc-400 hover:text-zinc-100 hover:underline inline-flex items-center gap-1"
            >
              <span>Все заказы</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-900">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-zinc-100 font-mono">{order.orderNumber}</div>
                  <div className="text-zinc-400">{order.customerName} • <span className="font-mono text-zinc-500">{formatDate(order.createdAt)}</span></div>
                </div>

                <div className="text-right">
                  <div className="font-bold font-mono text-zinc-100">{formatKZT(order.total)}</div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-zinc-900 text-zinc-300 border border-zinc-800">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Лидеры продаж
            </h2>
            <Link
              to="/seller/products"
              className="text-xs font-mono text-zinc-400 hover:text-zinc-100 hover:underline inline-flex items-center gap-1"
            >
              <span>Управление складом</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-900">
            {topProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-zinc-800 bg-zinc-900">
                    <SafeImage src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <div className="font-medium text-zinc-100 truncate">{p.title}</div>
                    <div className="text-zinc-500 text-[11px] font-mono">{p.sku} • Продано: {p.salesCount} шт.</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-semibold font-mono text-zinc-100">{formatKZT(p.revenue)}</div>
                  <div className="text-[11px] font-mono text-zinc-500">Остаток: {p.stock} шт.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
