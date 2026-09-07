// src/entities/product/ui/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import type { Book } from '../../book/model/types';
import { SafeImage } from '../../../shared/ui/SafeImage/SafeImage';
import { formatKZT } from '../../../shared/lib/format';
import { useCartStore } from '../../cart/model/cartStore';
import { useWishlistStore } from '../../wishlist/model/wishlistStore';
import { useToastStore } from '../../../shared/lib/toast/useToastStore';

interface ProductCardProps {
  product: Book;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  const isLiked = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleItem(product.id);
    addToast({
      type: 'info',
      message: added
        ? `"${product.title}" добавлено в избранное`
        : `"${product.title}" удалено из избранного`,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return;

    addItem(product.id, 1, product.stock);
    addToast({
      type: 'success',
      message: `${product.title} ${t('product.addedToCart')}`,
    });
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded hover:border-slate-400 dark:hover:border-slate-600 transition-colors duration-200 overflow-hidden relative">
      <Link to={`/catalog/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <SafeImage
          src={product.coverImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <button
          onClick={handleToggleWishlist}
          aria-label="В избранное"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shadow-sm"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-white px-3 py-1 border border-white/30 rounded">
              {t('product.outOfStock')}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="truncate">{product.author}</span>
          <div className="flex items-center gap-1 shrink-0 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <Link to={`/catalog/${product.id}`} className="block mb-3">
          <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatKZT(product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-xs line-through text-slate-400">
                {formatKZT(product.oldPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-sky-600 dark:hover:bg-sky-600 border border-slate-300 dark:border-slate-700 rounded transition-colors disabled:opacity-30 disabled:pointer-events-none"
            aria-label={t('product.addToCart')}
            title={t('product.addToCart')}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
