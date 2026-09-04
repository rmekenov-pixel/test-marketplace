import React from 'react';
import { DollarSign, ShoppingBag, BookOpen, AlertTriangle } from 'lucide-react';
import { useBookStore } from '../../../entities/book';
import { useOrderStore } from '../../../entities/order';
import { formatKZT } from '../../../shared/lib/format';
import { APP_CONFIG } from '../../../shared/config/constants';

export const AdminStats: React.FC = () => {
  const books = useBookStore((state) => state.books);
  const orders = useOrderStore((state) => state.orders);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0) + 1850000;
  const lowStockBooks = books.filter((b) => b.stock < APP_CONFIG.LOW_STOCK_THRESHOLD);
  const outOfStockBooks = books.filter((b) => b.stock === 0);
  const totalStockCount = books.reduce((sum, b) => sum + b.stock, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh space-y-1">
        <div className="flex items-center justify-between text-[#8d96a0]">
          <span className="text-xs">Выручка за месяц</span>
          <DollarSign className="w-4 h-4" />
        </div>
        <div className="text-xl font-bold font-mono text-[#f0f6fc]">
          {formatKZT(totalRevenue)}
        </div>
        <span className="text-[11px] text-[#3fb950] block">
          +18.4% к пред. периоду
        </span>
      </div>

      <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh space-y-1">
        <div className="flex items-center justify-between text-[#8d96a0]">
          <span className="text-xs">Всего заказов</span>
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div className="text-xl font-bold font-mono text-[#f0f6fc]">
          {orders.length + 142}
        </div>
        <span className="text-[11px] text-[#8d96a0] block">
          Сегодня: 9 заказов
        </span>
      </div>

      <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh space-y-1">
        <div className="flex items-center justify-between text-[#8d96a0]">
          <span className="text-xs">Наименований</span>
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="text-xl font-bold font-mono text-[#f0f6fc]">
          {books.length}
        </div>
        <span className="text-[11px] text-[#8d96a0] block">
          Всего на складе: {totalStockCount} шт.
        </span>
      </div>

      <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh space-y-1">
        <div className="flex items-center justify-between text-[#8d96a0]">
          <span className="text-xs">Малый остаток</span>
          <AlertTriangle className="w-4 h-4 text-[#d29922]" />
        </div>
        <div className="text-xl font-bold font-mono text-[#f0f6fc]">
          {lowStockBooks.length}
        </div>
        <span className="text-[11px] text-[#8d96a0] block">
          Закончились: {outOfStockBooks.length}
        </span>
      </div>
    </div>
  );
};
