import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useOrderStore, OrderCard } from '../../../entities/order';
import { useAuthStore } from '../../../entities/user';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { ROUTES } from '../../../shared/config/routes';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const orders = useOrderStore((state) => state.orders);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const userOrders = orders.filter(
    (o) => o.userId === (user?.id || 'user-client-1')
  );

  if (userOrders.length === 0) {
    return (
      <EmptyState
        icon={<Clock className="w-6 h-6" />}
        title="Нет оформленных заказов"
        description="История заказов пуста"
        actionText="Перейти в каталог"
        onAction={() => navigate(ROUTES.CLIENT.CATALOG)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-[#30363d]">
        <h1 className="text-xl font-semibold text-[#f0f6fc]">
          История заказов
        </h1>
        <p className="text-xs text-[#8d96a0]">
          Всего заказов: <span className="font-mono font-medium text-[#f0f6fc]">{userOrders.length}</span>
        </p>
      </div>

      <div className="space-y-3">
        {userOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};
