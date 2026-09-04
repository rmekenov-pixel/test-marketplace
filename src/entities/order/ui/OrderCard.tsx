import React from 'react';
import { MapPin, CreditCard } from 'lucide-react';
import type { Order } from '../model/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatKZT, formatDate } from '../../../shared/lib/format';
import { APP_CONFIG } from '../../../shared/config/constants';

export interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getPaymentLabel = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'kaspi_qr':
        return 'Kaspi QR';
      case 'card':
        return 'Банковская карта';
      case 'cash_on_delivery':
        return 'При получении';
      default:
        return 'Kaspi Pay';
    }
  };

  return (
    <div className="bg-gh-subtle rounded-md border border-gh-border p-4 shadow-gh-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gh-border gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gh-fg">
            Заказ #{order.id}
          </span>
          <span className="text-xs text-gh-muted">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.bookId} className="flex items-center gap-3">
            <img
              src={item.coverImage || APP_CONFIG.DEFAULT_BOOK_COVER}
              alt={item.title}
              className="w-10 aspect-[3/4] object-cover rounded border border-gh-border shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = APP_CONFIG.DEFAULT_BOOK_COVER;
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-gh-fg truncate">
                {item.title}
              </h4>
              <p className="text-[11px] text-gh-muted truncate">{item.author}</p>
              <div className="text-xs text-gh-muted">
                {item.quantity} шт. × {formatKZT(item.priceAtOrder)}
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-gh-fg">
              {formatKZT(item.priceAtOrder * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gh-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gh-muted">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gh-muted" />
            <span>{order.deliveryAddress}</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-gh-muted" />
            <span>{getPaymentLabel(order.paymentMethod)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>Итого:</span>
          <span className="text-sm font-mono font-bold text-gh-fg">
            {formatKZT(order.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
