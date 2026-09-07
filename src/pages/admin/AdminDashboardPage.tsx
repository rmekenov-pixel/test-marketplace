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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t('dashboard.admin.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Управление каталогом, заказами и пользователями платформы.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => resetToInitial()}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
            title="Сбросить к исходным данным"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Сброс</span>
          </button>
          <button
            onClick={() => setIsAddingProduct(!isAddingProduct)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('dashboard.admin.addProduct')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('dashboard.admin.totalRevenue')}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatKZT(totalRevenue)}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('dashboard.admin.totalOrders')}</span>
            <ShoppingBag className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {orders.length}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('dashboard.admin.products')}</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {books.length}
          </div>
        </div>
      </div>

      {/* Add Product Form Collapse */}
      {isAddingProduct && (
        <form
          onSubmit={handleAddProductSubmit}
          className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded space-y-4"
        >
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Добавление нового товара
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Название книги</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                placeholder="Абай жолы"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Автор</label>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                placeholder="Мұхтар Әуезов"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Цена (KZT)</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                required
                min={100}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Остаток на складе (шт)</label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                required
                min={0}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Категория / Жанр</label>
              <select
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
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
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded"
            >
              Сохранить товар
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          Товары в каталоге ({books.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Товар</th>
                <th className="py-2.5 px-3">Автор</th>
                <th className="py-2.5 px-3">Цена</th>
                <th className="py-2.5 px-3">Остаток</th>
                <th className="py-2.5 px-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3 flex items-center gap-3">
                    <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-slate-200 dark:border-slate-800">
                      <SafeImage src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-xs">{book.title}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{book.author}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">{formatKZT(book.price)}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        defaultValue={book.stock}
                        onBlur={(e) => updateStock(book.id, Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-center"
                      />
                      <span className="text-[11px] text-slate-400">шт</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDelete(book.id, book.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
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
