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
      <div className="py-24 text-center text-xs text-zinc-500">
        {t('common.loading')}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="py-20 text-left space-y-4">
        <h2 className="text-xl font-bold text-zinc-100">
          Товар не найден
        </h2>
        <p className="text-xs text-zinc-500">
          Возможно, книга была удалена или перемещена.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 text-xs font-medium rounded hover:bg-zinc-200 transition-colors"
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
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('product.backToCatalog')}
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Cover Image */}
        <div className="md:col-span-5">
          <div className="sticky top-24 aspect-[3/4] rounded border border-zinc-800 overflow-hidden bg-zinc-950">
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
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              {book.author}
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-100">
              {book.title}
            </h1>

            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
              <div className="flex items-center gap-1 text-zinc-200">
                <Star className="w-4 h-4 fill-zinc-200 text-zinc-200" />
                <span className="font-semibold text-zinc-100 font-mono">
                  {book.rating.toFixed(1)}
                </span>
              </div>
              <span>•</span>
              <span className="font-mono">{book.reviewsCount} {t('product.reviews')}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                {book.stock > 0 ? (
                  <span className="text-emerald-400 font-medium inline-flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {t('product.inStock')} ({book.stock} шт.)
                  </span>
                ) : (
                  <span className="text-rose-400 font-medium inline-flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {t('product.outOfStock')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Add to cart Box */}
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-zinc-100 font-mono">
                {formatKZT(book.price)}
              </span>
              {book.oldPrice && (
                <span className="text-sm line-through text-zinc-500 font-mono">
                  {formatKZT(book.oldPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-zinc-800 rounded bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-mono font-semibold text-zinc-100">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                  disabled={quantity >= book.stock}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={book.stock <= 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 text-zinc-950 text-xs font-semibold rounded transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t('product.addToCart')}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zinc-400" />
                <span>Доставка по Казахстану</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-zinc-400" />
                <span>100% гарантия качества</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              {t('product.description')}
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-light">
              {book.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              {t('product.characteristics')}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs border-t border-zinc-800 pt-3">
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <dt className="text-zinc-500">{t('product.author')}</dt>
                <dd className="font-medium text-zinc-200">{book.author}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <dt className="text-zinc-500">{t('product.genre')}</dt>
                <dd className="font-medium text-zinc-200">{book.genre}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <dt className="text-zinc-500">{t('product.publicationYear')}</dt>
                <dd className="font-medium text-zinc-200 font-mono">{book.publicationYear}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <dt className="text-zinc-500">{t('product.pages')}</dt>
                <dd className="font-medium text-zinc-200 font-mono">{book.pages}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-900">
                <dt className="text-zinc-500">{t('product.isbn')}</dt>
                <dd className="font-medium text-zinc-200 font-mono">{book.isbn}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedBooks.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100">
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
