// src/pages/product/ProductPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Star, CheckCircle, AlertCircle, Shield, Truck } from 'lucide-react';
import { useBookStore } from '../../entities/book/model/bookStore';
import { bookApi } from '../../entities/book/api/bookApi';
import type { Book } from '../../entities/book/model/types';
import { SafeImage } from '../../shared/ui/SafeImage/SafeImage';
import { formatKZT } from '../../shared/lib/format';
import { useCartStore } from '../../entities/cart/model/cartStore';
import { useToastStore } from '../../shared/lib/toast/useToastStore';
import { ProductCard } from '../../entities/product/ui/ProductCard';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { books } = useBookStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    bookApi
      .getById(id)
      .then((data) => {
        setBook(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400">
        {t('common.loading')}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Товар не найден
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Возможно, книга была удалена или перемещена.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-xs font-medium rounded hover:bg-sky-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('product.backToCatalog')}
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (book.stock <= 0) return;
    addItem(book.id, quantity, book.stock);
    addToast({
      type: 'success',
      message: `${book.title} (x${quantity}) ${t('product.addedToCart')}`,
    });
  };

  const relatedBooks = books
    .filter((b) => b.id !== book.id && b.genre === book.genre)
    .slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('product.backToCatalog')}
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Cover Image */}
        <div className="md:col-span-5">
          <div className="sticky top-24 aspect-[3/4] rounded border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            <SafeImage
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info and Actions */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
              {book.author}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {book.title}
            </h1>

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {book.rating.toFixed(1)}
                </span>
              </div>
              <span>•</span>
              <span>{book.reviewsCount} {t('product.reviews')}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                {book.stock > 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {t('product.inStock')} ({book.stock} шт.)
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-medium inline-flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {t('product.outOfStock')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Add to cart Box */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                {formatKZT(book.price)}
              </span>
              {book.oldPrice && (
                <span className="text-sm line-through text-slate-400">
                  {formatKZT(book.oldPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  -
                </button>
                <span className="px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                  disabled={quantity >= book.stock}
                  className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={book.stock <= 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-sm font-semibold rounded transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t('product.addToCart')}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600" />
                <span>Доставка по Казахстану</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>100% гарантия подлинности</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {t('product.description')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {t('product.characteristics')}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs border-t border-slate-200 dark:border-slate-800 pt-3">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <dt className="text-slate-500 dark:text-slate-400">{t('product.author')}</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{book.author}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <dt className="text-slate-500 dark:text-slate-400">{t('product.genre')}</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{book.genre}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <dt className="text-slate-500 dark:text-slate-400">{t('product.publicationYear')}</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{book.publicationYear}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <dt className="text-slate-500 dark:text-slate-400">{t('product.pages')}</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{book.pages}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <dt className="text-slate-500 dark:text-slate-400">{t('product.isbn')}</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{book.isbn}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedBooks.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Похожие книги
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <ProductCard key={relBook.id} product={relBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
