import React from 'react';
import type { PopulatedCartItem } from '../model/types';
import { formatKZT } from '../../../shared/lib/format';
import { APP_CONFIG } from '../../../shared/config/constants';

export interface CartItemRowProps {
  item: PopulatedCartItem;
  quantityControlSlot?: React.ReactNode;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  quantityControlSlot,
}) => {
  const { book, subtotal } = item;

  return (
    <div className="bg-gh-subtle rounded-md border border-gh-border p-3 shadow-gh-sm flex items-center gap-3">
      <img
        src={book.coverImage || APP_CONFIG.DEFAULT_BOOK_COVER}
        alt={book.title}
        className="w-12 aspect-[3/4] object-cover rounded border border-gh-border shrink-0"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = APP_CONFIG.DEFAULT_BOOK_COVER;
        }}
      />

      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-mono text-gh-muted uppercase">
          {book.genre}
        </span>
        <h3 className="text-xs font-semibold text-gh-fg truncate">
          {book.title}
        </h3>
        <p className="text-[11px] text-gh-muted truncate">{book.author}</p>
        <div className="text-xs font-bold font-mono text-gh-fg mt-0.5">
          {formatKZT(book.price)}
          {item.quantity > 1 && (
            <span className="text-[11px] font-normal text-gh-muted ml-1.5">
              (итого: {formatKZT(subtotal)})
            </span>
          )}
        </div>
      </div>

      {quantityControlSlot}
    </div>
  );
};
