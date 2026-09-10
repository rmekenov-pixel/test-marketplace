import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Package, ShoppingBag, DollarSign, Trash2, RefreshCw } from 'lucide-react';
import { useBookStore } from '../../entities/book/model/bookStore';
import { useOrderStore } from '../../entities/order/model/orderStore';
import { formatKZT } from '../../shared/lib/format';
import { SafeImage } from '../../shared/ui/SafeImage/SafeImage';
import { useToastStore } from '../../shared/lib/toast/useToastStore';

export const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { books, fetchBooks, addBook, deleteBook, updateStock, resetToInitial } = useBookStore();
  const { orders, fetchOrders } = useOrderStore();
  const { addToast } = useToastStore();

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPrice, setNewPrice] = useState(4500);
  const [newStock, setNewStock] = useState(20);
  const [newGenre, setNewGenre] = useState('kazakh_classics');

  useEffect(() => {
    fetchBooks();
    fetchOrders();
  }, [fetchBooks, fetchOrders]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    try {
      await addBook({
        title: newTitle,
        author: newAuthor,
        price: newPrice,
        stock: newStock,
        genre: newGenre,
        language: 'kz',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        description: 'Новое издание в каталоге QazaqMarket.',
        rating: 5.0,
        reviewsCount: 0,
        publicationYear: 2024,
        pages: 320,
        isbn: `978-601-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      setIsAddingProduct(false);
      setNewTitle('');
      setNewAuthor('');
      addToast({
        type: 'success',
        message: 'Товар успешно добавлен в каталог!',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Ошибка при добавлении товара',
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Удалить книгу "${title}"?`)) {
      await deleteBook(id);
      addToast({
        type: 'info',
        message: `Товар "${title}" удален`,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-100">
            {t('dashboard.admin.title')}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Управление каталогом, заказами и пользователями платформы.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => resetToInitial()}
            className="px-3 py-2 border border-zinc-800 text-zinc-300 text-xs font-medium rounded hover:bg-zinc-900 transition-colors inline-flex items-center gap-1.5"
            title="Сбросить к исходным данным"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Сброс</span>
          </button>
          <button
            onClick={() => setIsAddingProduct(!isAddingProduct)}
            className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('dashboard.admin.addProduct')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">{t('dashboard.admin.totalRevenue')}</span>
            <DollarSign className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {formatKZT(totalRevenue)}
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">{t('dashboard.admin.totalOrders')}</span>
            <ShoppingBag className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {orders.length}
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">{t('dashboard.admin.products')}</span>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {books.length}
          </div>
        </div>
      </div>

      {/* Add Product Form Collapse */}
      {isAddingProduct && (
        <form
          onSubmit={handleAddProductSubmit}
          className="p-6 bg-zinc-950 border border-zinc-800 rounded space-y-4"
        >
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300">
            Добавление нового товара
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Название книги</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                placeholder="Абай жолы"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Автор</label>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                required
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                placeholder="Мұхтар Әуезов"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Цена (KZT)</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                required
                min={100}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Остаток на складе (шт)</label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                required
                min={0}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Категория / Жанр</label>
              <select
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
              >
                <option value="kazakh_classics">Қазақ классикасы</option>
                <option value="history">Тарих / История</option>
                <option value="business">Бизнес и финансы</option>
                <option value="psychology">Психология и саморазвитие</option>
                <option value="children">Балалар әдебиеті</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingProduct(false)}
              className="px-4 py-2 border border-zinc-800 text-xs text-zinc-400 rounded hover:bg-zinc-900"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded"
            >
              Сохранить товар
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <section className="p-6 bg-zinc-950 border border-zinc-800 rounded space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Товары в каталоге ({books.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-2.5 px-3">Товар</th>
                <th className="py-2.5 px-3">Автор</th>
                <th className="py-2.5 px-3">Цена</th>
                <th className="py-2.5 px-3">Остаток</th>
                <th className="py-2.5 px-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-zinc-900/40">
                  <td className="py-3 px-3 flex items-center gap-3">
                    <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-zinc-800 bg-zinc-900">
                      <SafeImage src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-zinc-100 truncate max-w-xs">{book.title}</span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{book.author}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-zinc-100">{formatKZT(book.price)}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        defaultValue={book.stock}
                        onBlur={(e) => updateStock(book.id, Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-center text-zinc-100 font-mono"
                      />
                      <span className="text-[11px] text-zinc-500 font-mono">шт</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDelete(book.id, book.title)}
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
      </section>
    </div>
  );
};
