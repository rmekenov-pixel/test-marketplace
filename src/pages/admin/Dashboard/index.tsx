import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  BookOpen,
  AlertTriangle,
  Plus,
  Package,
} from 'lucide-react';
import { useBookStore } from '../../../store/bookStore';
import { useOrderStore } from '../../../store/orderStore';
import { formatKZT, formatDate } from '../../../utils/format';
import { Button } from '../../../components/ui/Button';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const books = useBookStore((state) => state.books);
  const orders = useOrderStore((state) => state.orders);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0) + 1850000;
  const lowStockBooks = books.filter((b) => b.stock < 15);
  const outOfStockBooks = books.filter((b) => b.stock === 0);
  const totalStockCount = books.reduce((sum, b) => sum + b.stock, 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl font-semibold text-[#1f2328]">
            Сводка магазина
          </h1>
          <p className="text-xs text-[#656d76]">
            Показатели продаж и состояние склада
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/warehouse')}
            leftIcon={<Package className="w-3.5 h-3.5" />}
          >
            Склад
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/catalog')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Добавить книгу
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm space-y-1">
          <div className="flex items-center justify-between text-[#656d76]">
            <span className="text-xs">Выручка за месяц</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono text-[#1f2328]">
            {formatKZT(totalRevenue)}
          </div>
          <span className="text-[11px] text-[#656d76] block">
            +18.4% к пред. периоду
          </span>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm space-y-1">
          <div className="flex items-center justify-between text-[#656d76]">
            <span className="text-xs">Всего заказов</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono text-[#1f2328]">
            {orders.length + 142}
          </div>
          <span className="text-[11px] text-[#656d76] block">
            Сегодня: 9 заказов
          </span>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm space-y-1">
          <div className="flex items-center justify-between text-[#656d76]">
            <span className="text-xs">Наименований</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono text-[#1f2328]">
            {books.length}
          </div>
          <span className="text-[11px] text-[#656d76] block">
            Всего на складе: {totalStockCount} шт.
          </span>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm space-y-1">
          <div className="flex items-center justify-between text-[#656d76]">
            <span className="text-xs">Малый остаток</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono text-[#1f2328]">
            {lowStockBooks.length}
          </div>
          <span className="text-[11px] text-[#656d76] block">
            Закончились: {outOfStockBooks.length}
          </span>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock */}
        <div className="bg-white rounded-md border border-[#d0d7de] p-4 shadow-gh-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#d0d7de]">
            <h3 className="font-semibold text-xs text-[#1f2328]">
              Заканчивающиеся книги
            </h3>
            <button
              onClick={() => navigate('/admin/warehouse')}
              className="text-xs text-[#0969da] hover:underline"
            >
              Склад →
            </button>
          </div>

          <div className="divide-y divide-[#d0d7de]">
            {lowStockBooks.slice(0, 4).map((book) => (
              <div
                key={book.id}
                className="py-2 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-8 aspect-[3/4] object-cover rounded border border-[#d0d7de] filter grayscale"
                  />
                  <div>
                    <div className="font-medium text-[#1f2328] truncate max-w-xs">
                      {book.title}
                    </div>
                    <div className="text-[11px] text-[#656d76]">{book.author}</div>
                  </div>
                </div>

                <span className="font-mono text-[#1f2328] border border-[#d0d7de] bg-[#f6f8fa] px-1.5 py-0.5 rounded text-[11px]">
                  {book.stock} шт.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-md border border-[#d0d7de] p-4 shadow-gh-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#d0d7de]">
            <h3 className="font-semibold text-xs text-[#1f2328]">
              Недавние заказы
            </h3>
            <span className="text-xs text-[#656d76] font-mono">
              {orders.length}
            </span>
          </div>

          <div className="divide-y divide-[#d0d7de]">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="py-2 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-medium text-[#1f2328]">
                    #{order.id}
                  </div>
                  <div className="text-[11px] text-[#656d76]">
                    {formatDate(order.createdAt)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-semibold text-[#1f2328]">
                    {formatKZT(order.totalPrice)}
                  </div>
                  <span className="text-[10px] text-[#656d76]">
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
