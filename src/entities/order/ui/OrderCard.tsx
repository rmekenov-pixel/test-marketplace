import React from 'react';
import { MapPin, CreditCard } from 'lucide-react';
import type { Order } from '../model/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatKZT, formatDate } from '../../../shared/lib/format';

export interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4 shadow-gh-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#30363d] gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#f0f6fc]">
            Заказ #{order.id}
          </span>
          <span className="text-xs text-[#8d96a0]">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {order.items.map(({ book, quantity }) => (
          <div key={book.id} className="flex items-center gap-3">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-10 aspect-[3/4] object-cover rounded border border-[#30363d] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-[#f0f6fc] truncate">
                {book.title}
              </h4>
              <p className="text-[11px] text-[#8d96a0] truncate">{book.author}</p>
              <div className="text-xs text-[#8d96a0]">
                {quantity} шт. × {formatKZT(book.price)}
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-[#f0f6fc]">
              {formatKZT(book.price * quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#30363d] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#8d96a0]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#8d96a0]" />
            <span>{order.deliveryAddress}</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-[#8d96a0]" />
            <span>
              {order.paymentMethod === 'wallet'
                ? 'Kaspi Кошелек'
                : 'Kaspi QR'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>Итого:</span>
          <span className="text-sm font-mono font-bold text-[#f0f6fc]">
            {formatKZT(order.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
