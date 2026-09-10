// src/entities/product/ui/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star, Heart } from 'lucide-react';
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
      message: `${product.title} ${t('product.addedToCart') || 'добавлено в корзину'}`,
    });
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-600 rounded transition-all duration-200 overflow-hidden relative shadow-xs">
      {/* Cover Image */}
      <Link to={`/catalog/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <SafeImage
          src={product.coverImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="В избранное"
          className="absolute top-2.5 right-2.5 p-1.5 rounded bg-white/80 dark:bg-black/60 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-rose-500 fill-rose-500 dark:text-white dark:fill-white' : ''}`} />
        </button>

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-white px-2.5 py-1 border border-zinc-700 bg-zinc-900 rounded">
              {t('product.outOfStock') || 'Нет в наличии'}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 text-left">
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
          <span className="truncate font-medium">{product.author}</span>
          <div className="flex items-center gap-1 shrink-0 text-zinc-700 dark:text-zinc-300">
            <Star className="w-3 h-3 fill-current text-amber-500 dark:text-zinc-400" />
            <span className="text-[11px] font-mono font-semibold">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <Link to={`/catalog/${product.id}`} className="block mb-3">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Price & Add to Cart */}
        <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight">
              {formatKZT(product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-xs line-through text-zinc-400 dark:text-zinc-500 font-mono">
                {formatKZT(product.oldPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-2 text-zinc-700 hover:text-white hover:bg-zinc-900 border border-zinc-300 hover:border-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-950 dark:hover:bg-white dark:border-zinc-700 dark:hover:border-white rounded transition-all disabled:opacity-20 disabled:pointer-events-none"
            aria-label={t('product.addToCart') || 'В корзину'}
            title={t('product.addToCart') || 'В корзину'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
