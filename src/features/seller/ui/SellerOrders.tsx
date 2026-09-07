// src/features/seller/ui/SellerOrders.tsx
import React, { useState } from 'react';
import { useSellerStore } from '../../../entities/seller/model/sellerStore';
import { formatKZT, formatDate } from '../../../shared/lib/format';
import { useToastStore } from '../../../shared/lib/toast/useToastStore';
import type { SellerOrderStatus } from '../../../entities/seller/model/types';

const STATUS_LABELS: Record<SellerOrderStatus, { label: string; color: string }> = {
  new: { label: 'Новый заказ', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-500/20' },
  packing: { label: 'Комплектация', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-500/20' },
  shipped: { label: 'В доставке', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-500/20' },
  delivered: { label: 'Доставлен', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-500/20' },
  cancelled: { label: 'Отменен', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-500/20' },
};

export const SellerOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useSellerStore();
  const { addToast } = useToastStore();
  const [filter, setFilter] = useState<string>('all');

  const filteredOrders = orders.filter((o) => (filter === 'all' ? true : o.status === filter));

  const handleStatusChange = (orderId: string, status: SellerOrderStatus) => {
    updateOrderStatus(orderId, status);
    addToast({
      type: 'success',
      message: `Статус заказа обновлен: ${STATUS_LABELS[status].label}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'new', 'packing', 'shipped', 'delivered', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === st
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {st === 'all' ? 'Все заказы' : STATUS_LABELS[st as SellerOrderStatus]?.label || st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.new;

          return (
            <div
              key={order.id}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mr-2">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider border ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as SellerOrderStatus)}
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-medium cursor-pointer"
                  >
                    <option value="new">Новый</option>
                    <option value="packing">Комплектация</option>
                    <option value="shipped">В доставке</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Получатель:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                    {order.customerName}
                  </span>
                  <span className="text-slate-500">{order.customerPhone}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Адрес доставки:</span>
                  <span className="text-slate-700 dark:text-slate-300">{order.deliveryAddress}</span>
                </div>

                <div className="sm:text-right">
                  <span className="text-slate-400 block mb-0.5">Сумма заказа ({order.itemsCount} поз.):</span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {formatKZT(order.total)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
