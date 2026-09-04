import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, CreditCard } from 'lucide-react';
import { useOrderStore } from '../../../store/orderStore';
import { useAuthStore } from '../../../store/authStore';
import { formatKZT, formatDate } from '../../../utils/format';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/shared/EmptyState';

export const ClientOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const orders = useOrderStore((state) => state.orders);

  const userOrders = orders.filter(
    (o) => o.userId === (user?.id || 'user-client-1')
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge>Доставлен</Badge>;
      case 'processing':
        return <Badge>В доставке</Badge>;
      case 'cancelled':
        return <Badge>Отменен</Badge>;
      default:
        return <Badge>В обработке</Badge>;
    }
  };

  if (userOrders.length === 0) {
    return (
      <EmptyState
        icon={<Clock className="w-6 h-6" />}
        title="Нет оформленных заказов"
        description="История заказов пуста"
        actionText="Перейти в каталог"
        onAction={() => navigate('/client/catalog')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#d0d7de]">
        <h1 className="text-xl font-semibold text-[#1f2328]">
          История заказов
        </h1>
        <p className="text-xs text-[#656d76]">
          Всего заказов: <span className="font-mono font-medium text-[#1f2328]">{userOrders.length}</span>
        </p>
      </div>

      <div className="space-y-3">
        {userOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-md border border-[#d0d7de] p-4 shadow-gh-sm space-y-3"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#d0d7de] gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#1f2328]">
                  Заказ #{order.id}
                </span>
                <span className="text-xs text-[#656d76]">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {order.items.map(({ book, quantity }) => (
                <div key={book.id} className="flex items-center gap-3">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-10 aspect-[3/4] object-cover rounded border border-[#d0d7de] filter grayscale contrast-[1.05] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#1f2328] truncate">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-[#656d76] truncate">{book.author}</p>
                    <div className="text-xs text-[#656d76]">
                      {quantity} шт. × {formatKZT(book.price)}
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#1f2328]">
                    {formatKZT(book.price * quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#d0d7de] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#656d76]">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#656d76]" />
                  <span>{order.deliveryAddress}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#656d76]" />
                  <span>
                    {order.paymentMethod === 'wallet' ? 'Kaspi Кошелек' : 'Kaspi QR'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span>Итого:</span>
                <span className="text-sm font-mono font-bold text-[#1f2328]">
                  {formatKZT(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
