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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-zinc-400 fill-zinc-400/20" />
            <span>{t('dashboard.client.favorites')}</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            Книги и товары, которые вы сохранили на будущее ({wishlistBooks.length}).
          </p>
        </div>

        {wishlistBooks.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-rose-400 hover:underline font-mono self-start sm:self-auto"
          >
            Очистить избранное
          </button>
        )}
      </div>

      {wishlistBooks.length === 0 ? (
        <div className="p-16 text-center bg-zinc-950 border border-zinc-800 rounded space-y-4">
          <Heart className="w-10 h-10 text-zinc-700 mx-auto stroke-1" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">
              Список избранного пуст
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Нажмите на сердечко в каталоге, чтобы сохранить понравившиеся книги.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded transition-colors"
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
