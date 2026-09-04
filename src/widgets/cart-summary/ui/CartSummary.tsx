import React from 'react';
import { useCartStore } from '../../../entities/cart';
import { formatKZT } from '../../../shared/lib/format';
import { Button } from '../../../shared/ui/Button';

export interface CartSummaryProps {
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalCount = useCartStore((state) => state.getTotalCount());

  const totalPrice = getTotalPrice();

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4 shadow-gh space-y-3">
      <h3 className="font-semibold text-sm text-[#f0f6fc]">Итог заказа</h3>

      <div className="space-y-1.5 text-xs text-[#8d96a0]">
        <div className="flex justify-between">
          <span>Товары ({getTotalCount} шт.)</span>
          <span className="font-mono text-[#f0f6fc]">{formatKZT(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kaspi Доставка</span>
          <span className="text-[#3fb950]">Бесплатно</span>
        </div>
      </div>

      <div className="border-t border-[#30363d] pt-2.5 flex justify-between items-baseline">
        <span className="text-xs font-semibold text-[#f0f6fc]">К оплате</span>
        <span className="text-base font-bold font-mono text-[#f0f6fc]">
          {formatKZT(totalPrice)}
        </span>
      </div>

      <Button
        fullWidth
        variant="primary"
        size="lg"
        onClick={onCheckout}
        disabled={items.length === 0}
      >
        Оформить заказ
      </Button>
    </div>
  );
};
