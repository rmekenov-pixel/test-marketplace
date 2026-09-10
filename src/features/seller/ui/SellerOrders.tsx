// src/features/seller/ui/SellerOrders.tsx
import React, { useState } from 'react';
import { useSellerStore } from '../../../entities/seller/model/sellerStore';
import { formatKZT, formatDate } from '../../../shared/lib/format';
import { useToastStore } from '../../../shared/lib/toast/useToastStore';
import type { SellerOrderStatus } from '../../../entities/seller/model/types';

const STATUS_LABELS: Record<SellerOrderStatus, { label: string; color: string }> = {
  new: { label: 'Новый заказ', color: 'bg-zinc-900 text-zinc-300 border-zinc-700' },
  packing: { label: 'Комплектация', color: 'bg-zinc-900 text-zinc-300 border-zinc-700' },
  shipped: { label: 'В доставке', color: 'bg-zinc-900 text-zinc-300 border-zinc-700' },
  delivered: { label: 'Доставлен', color: 'bg-zinc-900 text-zinc-100 border-zinc-600' },
  cancelled: { label: 'Отменен', color: 'bg-zinc-900 text-rose-400 border-rose-900/60' },
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
                ? 'bg-white text-zinc-950 font-semibold'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
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
              className="p-5 bg-zinc-950 border border-zinc-800 rounded space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-sm font-bold font-mono text-zinc-100 mr-2">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as SellerOrderStatus)}
                    className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs font-medium text-zinc-300 cursor-pointer"
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
                  <span className="text-zinc-500 block mb-0.5">Получатель:</span>
                  <span className="font-semibold text-zinc-200 block">
                    {order.customerName}
                  </span>
                  <span className="text-zinc-500 font-mono">{order.customerPhone}</span>
                </div>

                <div>
                  <span className="text-zinc-500 block mb-0.5">Адрес доставки:</span>
                  <span className="text-zinc-300">{order.deliveryAddress}</span>
                </div>

                <div className="sm:text-right">
                  <span className="text-zinc-500 block mb-0.5">Сумма заказа ({order.itemsCount} поз.):</span>
                  <span className="text-base font-bold font-mono text-zinc-100">
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
