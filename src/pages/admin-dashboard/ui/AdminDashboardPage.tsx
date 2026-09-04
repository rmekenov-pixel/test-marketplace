import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import { useBookStore } from '../../../entities/book';
import { useOrderStore } from '../../../entities/order';
import { AdminStats } from '../../../widgets/admin-stats';
import { Button } from '../../../shared/ui/Button';
import { formatDate, formatKZT } from '../../../shared/lib/format';
import { ROUTES } from '../../../shared/config/routes';
import { APP_CONFIG } from '../../../shared/config/constants';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const books = useBookStore((state) => state.books);
  const fetchBooks = useBookStore((state) => state.fetchBooks);
  const orders = useOrderStore((state) => state.orders);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  useEffect(() => {
    fetchBooks();
    fetchOrders();
  }, [fetchBooks, fetchOrders]);

  const lowStockBooks = books.filter((b) => b.stock < APP_CONFIG.LOW_STOCK_THRESHOLD);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#30363d]">
        <div>
          <h1 className="text-xl font-semibold text-[#f0f6fc]">
            Сводка магазина
          </h1>
          <p className="text-xs text-[#8d96a0]">
            Показатели продаж и состояние склада
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.ADMIN.WAREHOUSE)}
            leftIcon={<Package className="w-3.5 h-3.5" />}
          >
            Склад
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ADMIN.CATALOG)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Добавить книгу
          </Button>
        </div>
      </div>

      {/* Admin Stats Widget */}
      <AdminStats />

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock */}
        <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4 shadow-gh space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
            <h3 className="font-semibold text-xs text-[#f0f6fc]">
              Заканчивающиеся книги
            </h3>
            <button
              onClick={() => navigate(ROUTES.ADMIN.WAREHOUSE)}
              className="text-xs text-[#58a6ff] hover:underline"
            >
              Склад →
            </button>
          </div>

          <div className="divide-y divide-[#30363d]">
            {lowStockBooks.slice(0, 4).map((book) => (
              <div
                key={book.id}
                className="py-2 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-8 aspect-[3/4] object-cover rounded border border-[#30363d]"
                  />
                  <div>
                    <div className="font-medium text-[#f0f6fc] truncate max-w-xs">
                      {book.title}
                    </div>
                    <div className="text-[11px] text-[#8d96a0]">{book.author}</div>
                  </div>
                </div>

                <span className="font-mono text-[#f0f6fc] border border-[#30363d] bg-[#0d1117] px-1.5 py-0.5 rounded text-[11px]">
                  {book.stock} шт.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4 shadow-gh space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
            <h3 className="font-semibold text-xs text-[#f0f6fc]">
              Недавние заказы
            </h3>
            <span className="text-xs text-[#8d96a0] font-mono">
              {orders.length}
            </span>
          </div>

          <div className="divide-y divide-[#30363d]">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="py-2 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-medium text-[#f0f6fc]">
                    #{order.id}
                  </div>
                  <div className="text-[11px] text-[#8d96a0]">
                    {formatDate(order.createdAt)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-semibold text-[#f0f6fc]">
                    {formatKZT(order.totalPrice)}
                  </div>
                  <span className="text-[10px] text-[#8d96a0]">
                    {order.status === 'delivered' ? 'Выполнен' : 'В работе'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
