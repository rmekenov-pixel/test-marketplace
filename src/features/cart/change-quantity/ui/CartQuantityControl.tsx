import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import type { PopulatedCartItem } from '../../../../entities/cart';
import { useCartStore } from '../../../../entities/cart';

export interface CartQuantityControlProps {
  item: PopulatedCartItem;
}

export const CartQuantityControl: React.FC<CartQuantityControlProps> = ({ item }) => {
  const { book, quantity } = item;
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border border-gh-border rounded-md bg-gh-canvas">
        <button
          onClick={() => updateQuantity(book.id, quantity - 1, book.stock)}
          className="p-1 text-gh-muted hover:text-gh-fg"
          title="Уменьшить"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="px-2 text-xs font-mono font-medium text-gh-fg">
          {quantity}
        </span>
        <button
          onClick={() => updateQuantity(book.id, quantity + 1, book.stock)}
          disabled={quantity >= book.stock}
          className="p-1 text-gh-muted hover:text-gh-fg disabled:opacity-30"
          title="Увеличить"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <button
        onClick={() => removeItem(book.id)}
        className="p-1.5 text-gh-muted hover:text-gh-danger rounded hover:bg-gh-overlay"
        title="Удалить"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
