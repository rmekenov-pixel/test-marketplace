import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  BookOpen,
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useOrderStore } from '../../../store/orderStore';
import { useBookStore } from '../../../store/bookStore';
import { formatKZT, formatDate } from '../../../utils/format';
import { Button } from '../../../components/ui/Button';
import { BookCard } from '../../../components/shared/BookCard';

export const ClientDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const orders = useOrderStore((state) => state.orders);
  const books = useBookStore((state) => state.books);

  const userOrders = orders.filter((o) => o.userId === (user?.id || 'user-client-1'));
  const recentOrders = userOrders.slice(0, 3);
  const recommendedBooks = books.slice(0, 4);

  const totalSpent = userOrders.reduce((acc, order) => acc + order.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-md border border-[#d0d7de] p-5 shadow-gh-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[#1f2328]">
            {user?.name || 'Покупатель'}
          </h1>
          <p className="text-xs text-[#656d76]">
            {user?.email} • {user?.phone}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/client/wallet')}
            leftIcon={<Wallet className="w-3.5 h-3.5" />}
          >
            Пополнить счет
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/client/catalog')}
            leftIcon={<BookOpen className="w-3.5 h-3.5" />}
          >
            Каталог
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm">
          <span className="text-xs text-[#656d76] font-medium">Баланс Kaspi</span>
          <div className="text-xl font-bold font-mono text-[#1f2328] mt-1">
            {formatKZT(user?.balance || 0)}
          </div>
          <Link
            to="/client/wallet"
            className="text-xs text-[#0969da] hover:underline inline-block mt-2"
          >
            Управление балансом →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm">
          <span className="text-xs text-[#656d76] font-medium">Всего заказов</span>
          <div className="text-xl font-bold font-mono text-[#1f2328] mt-1">
            {userOrders.length}
          </div>
          <Link
            to="/client/orders"
            className="text-xs text-[#0969da] hover:underline inline-block mt-2"
          >
            История заказов →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm">
          <span className="text-xs text-[#656d76] font-medium">Всего потрачено</span>
          <div className="text-xl font-bold font-mono text-[#1f2328] mt-1">
            {formatKZT(totalSpent)}
          </div>
          <span className="text-xs text-[#656d76] block mt-2">
            За все время
          </span>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-md border border-[#d0d7de] p-4 shadow-gh-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#d0d7de]">
          <h2 className="text-sm font-semibold text-[#1f2328]">
            Последние заказы
          </h2>
          <Link
            to="/client/orders"
            className="text-xs text-[#0969da] hover:underline"
          >
            Все заказы →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-[#d0d7de]">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-[#1f2328]">
                    #{order.id}
                  </div>
                  <div className="text-[11px] text-[#656d76]">
                    {formatDate(order.createdAt)} • {order.items.reduce((s, i) => s + i.quantity, 0)} экз.
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-semibold text-[#1f2328]">
                    {formatKZT(order.totalPrice)}
                  </div>
                  <span className="text-[11px] text-[#656d76] border border-[#d0d7de] px-1.5 py-0.2 rounded">
                    {order.status === 'delivered' ? 'Доставлен' : 'В обработке'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#656d76] py-3 text-center">
            Заказов пока нет
          </p>
        )}
      </div>

      {/* Recommended Books */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#d0d7de]">
          <h2 className="text-sm font-semibold text-[#1f2328]">
            Рекомендуемые книги
          </h2>
          <Link
            to="/client/catalog"
            className="text-xs text-[#0969da] hover:underline"
          >
            Смотреть все →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {recommendedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};
