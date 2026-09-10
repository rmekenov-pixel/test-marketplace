import React, { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { useSellerStore } from '../../../entities/seller/model/sellerStore';
import { formatKZT } from '../../../shared/lib/format';
import { SafeImage } from '../../../shared/ui/SafeImage/SafeImage';
import { useToastStore } from '../../../shared/lib/toast/useToastStore';
import type { ProductStatus } from '../../../entities/seller/model/types';

export const SellerProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateProductStock } = useSellerStore();
  const { addToast } = useToastStore();

  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState(4800);
  const [stock, setStock] = useState(25);
  const [sku, setSku] = useState('');
  const [genre, setGenre] = useState('kazakh_classics');

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    addProduct({
      title,
      author,
      price,
      stock,
      sku: sku || `SKU-${Date.now()}`,
      genre,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      status: 'active',
    });

    setIsAdding(false);
    setTitle('');
    setAuthor('');
    setSku('');
    addToast({
      type: 'success',
      message: 'Товар успешно добавлен на витрину вендора!',
    });
  };

  const handleDelete = (id: string, productTitle: string) => {
    if (confirm(`Удалить товар "${productTitle}"?`)) {
      deleteProduct(id);
      addToast({
        type: 'info',
        message: `Товар "${productTitle}" удален со склада`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск по названию, автору или SKU..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить товар на склад</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="p-6 bg-zinc-950 border border-zinc-800 rounded space-y-4"
        >
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300">
            Карточка нового товара вендора
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Название</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                placeholder="Қара сөздер"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Автор</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                placeholder="Абай Құнанбайұлы"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Цена продажи (KZT)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                min={100}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Остаток на складе (шт)</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
                min={0}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Артикул (SKU)</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="KZ-BK-999"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Категория</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
              >
                <option value="kazakh_classics">Қазақ классикасы</option>
                <option value="history">Тарих / История</option>
                <option value="business">Бизнес и финансы</option>
                <option value="psychology">Психология</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-zinc-800 text-xs text-zinc-400 rounded hover:bg-zinc-900"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded"
            >
              Сохранить
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-2.5 px-3">Товар / Артикул</th>
                <th className="py-2.5 px-3">Цена</th>
                <th className="py-2.5 px-3">Остаток</th>
                <th className="py-2.5 px-3">Статус</th>
                <th className="py-2.5 px-3">Продажи</th>
                <th className="py-2.5 px-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-900/40">
                  <td className="py-3 px-3 flex items-center gap-3">
                    <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-zinc-800 bg-zinc-900">
                      <SafeImage src={product.coverImage} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-zinc-100">{product.title}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">{product.author} • SKU: {product.sku}</div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono font-semibold text-zinc-100">
                    {formatKZT(product.price)}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        defaultValue={product.stock}
                        onBlur={(e) => updateProductStock(product.id, Number(e.target.value))}
                        className={`w-16 px-2 py-1 bg-zinc-900 border rounded text-center text-xs font-mono text-zinc-100 ${
                          product.stock <= 5
                            ? 'border-amber-500/80 text-amber-400 font-semibold'
                            : 'border-zinc-800'
                        }`}
                      />
                      <span className="text-[11px] text-zinc-500 font-mono">шт</span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <select
                      value={product.status}
                      onChange={(e) => updateProduct(product.id, { status: e.target.value as ProductStatus })}
                      className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-medium text-zinc-300"
                    >
                      <option value="active">Активен</option>
                      <option value="draft">Черновик</option>
                      <option value="archived">В архиве</option>
                    </select>
                  </td>

                  <td className="py-3 px-3 text-zinc-400">
                    <div className="font-mono">{product.salesCount} шт</div>
                    <div className="text-[11px] text-zinc-300 font-mono font-medium">{formatKZT(product.revenue)}</div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDelete(product.id, product.title)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
