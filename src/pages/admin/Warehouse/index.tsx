import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useBookStore } from '../../../store/bookStore';
import { formatKZT } from '../../../utils/format';
import { SearchBar } from '../../../components/shared/SearchBar';

export const AdminWarehousePage: React.FC = () => {
  const { books, updateStock } = useBookStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const filteredBooks = books.filter((book) => {
    if (stockFilter === 'low' && book.stock >= 15) return false;
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
  const lowStockCount = books.filter((b) => b.stock > 0 && b.stock < 15).length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#d0d7de]">
        <h1 className="text-xl font-semibold text-[#1f2328]">
          Склад и инвентарь
        </h1>
        <p className="text-xs text-[#656d76]">
          Контроль остатков и учет экземпляров
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm">
          <span className="text-xs text-[#656d76]">Всего единиц</span>
          <div className="text-xl font-bold font-mono text-[#1f2328] mt-1">
            {totalStockItems} экз.
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm">
          <span className="text-xs text-[#656d76]">Оценка склада</span>
          <div className="text-xl font-bold font-mono text-[#1f2328] mt-1">
            {formatKZT(totalStockValuation)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm">
          <span className="text-xs text-[#656d76]">Мало (&lt; 15)</span>
          <div className="text-xl font-bold font-mono text-[#1f2328] mt-1">
            {lowStockCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm">
          <span className="text-xs text-[#656d76]">Закончились</span>
          <div className="text-xl font-bold font-mono text-[#1f2328] mt-1">
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="flex bg-[#f6f8fa] rounded-md p-0.5 border border-[#d0d7de]">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-3 py-1 rounded text-xs font-medium ${
              stockFilter === 'all'
                ? 'bg-white text-[#1f2328] font-semibold shadow-gh-sm'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            Все ({books.length})
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`px-3 py-1 rounded text-xs font-medium ${
              stockFilter === 'low'
                ? 'bg-white text-[#1f2328] font-semibold shadow-gh-sm'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            Мало ({lowStockCount})
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`px-3 py-1 rounded text-xs font-medium ${
              stockFilter === 'out'
                ? 'bg-white text-[#1f2328] font-semibold shadow-gh-sm'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            0 шт. ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-[#d0d7de] shadow-gh-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f8fa] text-[#656d76] font-semibold border-b border-[#d0d7de]">
              <tr>
                <th className="px-4 py-2.5">Товар</th>
                <th className="px-4 py-2.5">ISBN</th>
                <th className="px-4 py-2.5">Цена</th>
                <th className="px-4 py-2.5">Остаток</th>
                <th className="px-4 py-2.5 text-right">Корректировка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d0d7de]">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-[#f6f8fa]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-8 aspect-[3/4] object-cover rounded border border-[#d0d7de] filter grayscale shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-[#1f2328]">
                          {book.title}
                        </div>
                        <div className="text-[11px] text-[#656d76]">
                          {book.author}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-mono text-[#656d76]">
                    {book.isbn}
                  </td>

                  <td className="px-4 py-3 font-mono font-semibold text-[#1f2328]">
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
                      className="w-16 px-2 py-1 bg-[#f6f8fa] border border-[#d0d7de] rounded text-xs font-mono font-bold text-[#1f2328] text-center focus:bg-white focus:outline-none"
                    />
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => updateStock(book.id, book.stock - 5)}
                        disabled={book.stock < 5}
                        className="px-2 py-1 text-[11px] font-mono border border-[#d0d7de] bg-[#f6f8fa] hover:bg-[#ebf0f4] disabled:opacity-30 rounded"
                        title="-5"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => updateStock(book.id, book.stock - 1)}
                        disabled={book.stock < 1}
                        className="p-1 border border-[#d0d7de] bg-[#f6f8fa] hover:bg-[#ebf0f4] disabled:opacity-30 rounded"
                        title="-1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => updateStock(book.id, book.stock + 1)}
                        className="p-1 border border-[#d0d7de] bg-[#f6f8fa] hover:bg-[#ebf0f4] rounded"
                        title="+1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => updateStock(book.id, book.stock + 10)}
                        className="px-2 py-1 text-[11px] font-mono border border-[#d0d7de] bg-[#f6f8fa] hover:bg-[#ebf0f4] rounded"
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
