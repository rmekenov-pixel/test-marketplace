import React from 'react';
import { useCartStore, getPopulatedCart } from '../../../entities/cart';
import { useBookStore } from '../../../entities/book';
import { formatKZT } from '../../../shared/lib/format';
import { Button } from '../../../shared/ui/Button';

export interface CartSummaryProps {
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const cartItems = useCartStore((state) => state.items);
  const catalogBooks = useBookStore((state) => state.books);

  const { totalPrice, totalCount } = getPopulatedCart(cartItems, catalogBooks);

  return (
    <div className="bg-gh-subtle rounded-md border border-gh-border p-4 shadow-gh space-y-3">
      <h3 className="font-semibold text-sm text-gh-fg">Итог заказа</h3>

      <div className="space-y-1.5 text-xs text-gh-muted">
        <div className="flex justify-between">
          <span>Товары ({totalCount} шт.)</span>
          <span className="font-mono text-gh-fg">{formatKZT(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kaspi Доставка</span>
          <span className="text-gh-success">Бесплатно</span>
        </div>
      </div>

      <div className="border-t border-gh-border pt-2.5 flex justify-between items-baseline">
        <span className="text-xs font-semibold text-gh-fg">К оплате</span>
        <span className="text-base font-bold font-mono text-gh-fg">
          {formatKZT(totalPrice)}
        </span>
      </div>

      <Button
        fullWidth
        variant="primary"
        size="lg"
        onClick={onCheckout}
        disabled={cartItems.length === 0}
      >
        Оформить заказ
      </Button>
    </div>
  );
};
