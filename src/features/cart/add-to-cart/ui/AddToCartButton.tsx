import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import type { Book } from '../../../../entities/book';
import { useCartStore } from '../../../../entities/cart';
import { Button } from '../../../../shared/ui/Button';

export interface AddToCartButtonProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  book,
  size = 'sm',
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cartItems.find((item) => item.bookId === book.id);
  const isInCart = Boolean(cartItem);
  const isOutOfStock = book.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(book.id, 1, book.stock);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <Button
      size={size}
      variant="secondary"
      disabled={isOutOfStock}
      onClick={handleAddToCart}
      className="shrink-0 text-xs"
    >
      {justAdded ? (
        <Check className="w-3.5 h-3.5 text-gh-success" />
      ) : isInCart ? (
        <span className="text-xs font-medium text-gh-accent">
          В корзине ({cartItem?.quantity})
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>В корзину</span>
        </span>
      )}
    </Button>
  );
};
