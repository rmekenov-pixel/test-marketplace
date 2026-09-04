import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import type { CartItem } from '../../../../entities/cart';
import { useCartStore } from '../../../../entities/cart';

export interface CartQuantityControlProps {
  item: CartItem;
}

export const CartQuantityControl: React.FC<CartQuantityControlProps> = ({ item }) => {
  const { book, quantity } = item;
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border border-[#30363d] rounded-md bg-[#0d1117]">
        <button
          onClick={() => updateQuantity(book.id, quantity - 1)}
          className="p-1 text-[#8d96a0] hover:text-[#f0f6fc]"
          title="Уменьшить"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="px-2 text-xs font-mono font-medium text-[#f0f6fc]">
          {quantity}
        </span>
        <button
          onClick={() => updateQuantity(book.id, quantity + 1)}
          disabled={quantity >= book.stock}
          className="p-1 text-[#8d96a0] hover:text-[#f0f6fc] disabled:opacity-30"
          title="Увеличить"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <button
        onClick={() => removeItem(book.id)}
        className="p-1.5 text-[#8d96a0] hover:text-[#f85149] rounded hover:bg-[#21262d]"
        title="Удалить"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
