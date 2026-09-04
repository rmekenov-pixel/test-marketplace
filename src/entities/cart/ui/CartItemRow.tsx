import React from 'react';
import type { CartItem } from '../model/types';
import { formatKZT } from '../../../shared/lib/format';

export interface CartItemRowProps {
  item: CartItem;
  quantityControlSlot?: React.ReactNode;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  quantityControlSlot,
}) => {
  const { book } = item;

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-3 shadow-gh-sm flex items-center gap-3">
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-12 aspect-[3/4] object-cover rounded border border-[#30363d] shrink-0"
      />

      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-mono text-[#8d96a0] uppercase">
          {book.genre}
        </span>
        <h3 className="text-xs font-semibold text-[#f0f6fc] truncate">
          {book.title}
        </h3>
        <p className="text-[11px] text-[#8d96a0] truncate">{book.author}</p>
        <div className="text-xs font-bold font-mono text-[#f0f6fc] mt-0.5">
          {formatKZT(book.price)}
        </div>
      </div>

      {quantityControlSlot}
    </div>
  );
};
