import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../../entities/user';
import { useOrderStore } from '../../../entities/order';
import { useBookStore } from '../../../entities/book';
import { BookCatalog } from '../../../widgets/book-catalog';
import { Button } from '../../../shared/ui/Button';
import { formatKZT, formatDate } from '../../../shared/lib/format';
import { ROUTES } from '../../../shared/config/routes';

export const ClientDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const orders = useOrderStore((state) => state.orders);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const books = useBookStore((state) => state.books);
  const fetchBooks = useBookStore((state) => state.fetchBooks);

  useEffect(() => {
    fetchOrders();
    fetchBooks();
  }, [fetchOrders, fetchBooks]);

  const userOrders = orders.filter((o) => o.userId === (user?.id || 'user-client-1'));
  const recentOrders = userOrders.slice(0, 3);
  const recommendedBooks = books.slice(0, 4);
  const totalSpent = userOrders.reduce((acc, order) => acc + order.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-[#161b22] rounded-md border border-[#30363d] p-5 shadow-gh flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[#f0f6fc]">
            {user?.name || 'Покупатель'}
          </h1>
          <p className="text-xs text-[#8d96a0]">
            {user?.email} • {user?.phone}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.CLIENT.WALLET)}
            leftIcon={<Wallet className="w-3.5 h-3.5" />}
          >
            Пополнить счет
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.CLIENT.CATALOG)}
            leftIcon={<BookOpen className="w-3.5 h-3.5" />}
          >
            Каталог
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh">
          <span className="text-xs text-[#8d96a0] font-medium">Баланс Kaspi</span>
          <div className="text-xl font-bold font-mono text-[#f0f6fc] mt-1">
            {formatKZT(user?.balance || 0)}
          </div>
          <Link
            to={ROUTES.CLIENT.WALLET}
            className="text-xs text-[#58a6ff] hover:underline inline-block mt-2"
          >
            Управление балансом →
          </Link>
        </div>

        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh">
          <span className="text-xs text-[#8d96a0] font-medium">Всего заказов</span>
          <div className="text-xl font-bold font-mono text-[#f0f6fc] mt-1">
            {userOrders.length}
          </div>
          <Link
            to={ROUTES.CLIENT.ORDERS}
            className="text-xs text-[#58a6ff] hover:underline inline-block mt-2"
          >
            История заказов →
          </Link>
        </div>

        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh">
          <span className="text-xs text-[#8d96a0] font-medium">Всего потрачено</span>
          <div className="text-xl font-bold font-mono text-[#f0f6fc] mt-1">
            {formatKZT(totalSpent)}
          </div>
          <span className="text-xs text-[#8d96a0] block mt-2">
            За все время
          </span>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4 shadow-gh space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
          <h2 className="text-sm font-semibold text-[#f0f6fc]">
            Последние заказы
          </h2>
          <Link
            to={ROUTES.CLIENT.ORDERS}
            className="text-xs text-[#58a6ff] hover:underline"
          >
            Все заказы →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-[#30363d]">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-[#f0f6fc]">
                    #{order.id}
                  </div>
                  <div className="text-[11px] text-[#8d96a0]">
                    {formatDate(order.createdAt)} • {order.items.reduce((s, i) => s + i.quantity, 0)} экз.
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-semibold text-[#f0f6fc]">
                    {formatKZT(order.totalPrice)}
                  </div>
                  <span className="text-[11px] text-[#8d96a0] border border-[#30363d] bg-[#0d1117] px-1.5 py-0.2 rounded">
                    {order.status === 'delivered' ? 'Доставлен' : 'В обработке'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8d96a0] py-3 text-center">
            Заказов пока нет
          </p>
        )}
      </div>

      {/* Recommended Books */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
          <h2 className="text-sm font-semibold text-[#f0f6fc]">
            Рекомендуемые книги
          </h2>
          <Link
            to={ROUTES.CLIENT.CATALOG}
            className="text-xs text-[#58a6ff] hover:underline"
          >
            Смотреть все →
          </Link>
        </div>
        <BookCatalog books={recommendedBooks} />
      </div>
    </div>
  );
};
