import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useBookStore } from '../../../entities/book';
import { BookSearchInput } from '../../../features/book/search-books';
import { formatKZT } from '../../../shared/lib/format';
import { APP_CONFIG } from '../../../shared/config/constants';

export const AdminWarehousePage: React.FC = () => {
  const { books, fetchBooks, updateStock } = useBookStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = books.filter((book) => {
    if (stockFilter === 'low' && book.stock >= APP_CONFIG.LOW_STOCK_THRESHOLD) return false;
    if (stockFilter === 'out' && book.stock > 0) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.isbn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalStockItems = books.reduce((acc, b) => acc + b.stock, 0);
  const totalStockValuation = books.reduce((acc, b) => acc + b.stock * b.price, 0);
  const outOfStockCount = books.filter((b) => b.stock === 0).length;
  const lowStockCount = books.filter(
    (b) => b.stock > 0 && b.stock < APP_CONFIG.LOW_STOCK_THRESHOLD
  ).length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#30363d]">
        <h1 className="text-xl font-semibold text-[#f0f6fc]">
          Склад и инвентарь
        </h1>
        <p className="text-xs text-[#8d96a0]">
          Контроль остатков и учет экземпляров
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh">
          <span className="text-xs text-[#8d96a0]">Всего единиц</span>
          <div className="text-xl font-bold font-mono text-[#f0f6fc] mt-1">
            {totalStockItems} экз.
          </div>
        </div>

        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh">
          <span className="text-xs text-[#8d96a0]">Оценка склада</span>
          <div className="text-xl font-bold font-mono text-[#f0f6fc] mt-1">
            {formatKZT(totalStockValuation)}
          </div>
        </div>

        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh">
          <span className="text-xs text-[#8d96a0]">Мало (&lt; 15)</span>
          <div className="text-xl font-bold font-mono text-[#f0f6fc] mt-1">
            {lowStockCount}
          </div>
        </div>

        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh">
          <span className="text-xs text-[#8d96a0]">Закончились</span>
          <div className="text-xl font-bold font-mono text-[#f0f6fc] mt-1">
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <BookSearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="flex bg-[#0d1117] rounded-md p-0.5 border border-[#30363d]">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              stockFilter === 'all'
                ? 'bg-[#21262d] text-[#f0f6fc] font-semibold shadow-sm'
                : 'text-[#8d96a0] hover:text-[#f0f6fc]'
            }`}
          >
            Все ({books.length})
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              stockFilter === 'low'
                ? 'bg-[#21262d] text-[#f0f6fc] font-semibold shadow-sm'
                : 'text-[#8d96a0] hover:text-[#f0f6fc]'
            }`}
          >
            Мало ({lowStockCount})
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              stockFilter === 'out'
                ? 'bg-[#21262d] text-[#f0f6fc] font-semibold shadow-sm'
                : 'text-[#8d96a0] hover:text-[#f0f6fc]'
            }`}
          >
            0 шт. ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161b22] rounded-md border border-[#30363d] shadow-gh overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d1117] text-[#8d96a0] font-semibold border-b border-[#30363d]">
              <tr>
                <th className="px-4 py-2.5">Товар</th>
                <th className="px-4 py-2.5">ISBN</th>
                <th className="px-4 py-2.5">Цена</th>
                <th className="px-4 py-2.5">Остаток</th>
                <th className="px-4 py-2.5 text-right">Корректировка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-[#1c2128]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-8 aspect-[3/4] object-cover rounded border border-[#30363d]"
                      />
                      <div>
                        <div className="font-semibold text-[#f0f6fc]">
                          {book.title}
                        </div>
                        <div className="text-[11px] text-[#8d96a0]">
                          {book.author}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-mono text-[#8d96a0]">
                    {book.isbn}
                  </td>

                  <td className="px-4 py-3 font-mono font-semibold text-[#f0f6fc]">
                    {formatKZT(book.price)}
                  </td>

                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={book.stock}
                      onChange={(e) =>
                        updateStock(book.id, parseInt(e.target.value, 10) || 0)
                      }
                      className="w-16 px-2 py-1 bg-[#0d1117] border border-[#30363d] rounded text-xs font-mono font-bold text-[#f0f6fc] text-center focus:border-[#2f81f7] focus:outline-none"
                    />
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => updateStock(book.id, book.stock - 5)}
                        disabled={book.stock < 5}
                        className="px-2 py-1 text-[11px] font-mono border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] disabled:opacity-30 rounded text-[#f0f6fc]"
                        title="-5"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => updateStock(book.id, book.stock - 1)}
                        disabled={book.stock < 1}
                        className="p-1 border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] disabled:opacity-30 rounded text-[#f0f6fc]"
                        title="-1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => updateStock(book.id, book.stock + 1)}
                        className="p-1 border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] rounded text-[#f0f6fc]"
                        title="+1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => updateStock(book.id, book.stock + 10)}
                        className="px-2 py-1 text-[11px] font-mono border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] rounded text-[#f0f6fc]"
                        title="+10"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
