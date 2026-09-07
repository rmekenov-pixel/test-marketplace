// src/pages/wishlist/WishlistPage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../../entities/wishlist/model/wishlistStore';
import { useBookStore } from '../../entities/book/model/bookStore';
import { ProductCard } from '../../entities/product/ui/ProductCard';

export const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const { items: wishlistIds, clearWishlist } = useWishlistStore();
  const { books, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const wishlistBooks = books.filter((b) => wishlistIds.includes(b.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            <span>{t('dashboard.client.favorites')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Книги и товары, которые вы сохранили на будущее ({wishlistBooks.length}).
          </p>
        </div>

        {wishlistBooks.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline self-start sm:self-auto"
          >
            Очистить избранное
          </button>
        )}
      </div>

      {wishlistBooks.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded space-y-4">
          <Heart className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto stroke-1" />
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Список избранного пуст
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Нажмите на сердечко в каталоге, чтобы сохранить понравившиеся книги.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded hover:bg-sky-700 transition-colors"
          >
            <span>Перейти в каталог</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlistBooks.map((book) => (
            <ProductCard key={book.id} product={book} />
          ))}
        </div>
      )}
    </div>
  );
};
