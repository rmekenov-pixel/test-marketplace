import React, { useState } from 'react';
import { QrCode, CreditCard, Banknote } from 'lucide-react';
import { useCartStore, getPopulatedCart } from '../../../../entities/cart';
import { useBookStore } from '../../../../entities/book';
import type { PaymentMethod } from '../../../../entities/order';
import { useCheckout } from '../model/useCheckout';
import { Modal } from '../../../../shared/ui/Modal';
import { Input } from '../../../../shared/ui/Input';
import { Button } from '../../../../shared/ui/Button';
import { formatKZT } from '../../../../shared/lib/format';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const cartItems = useCartStore((state) => state.items);
  const catalogBooks = useBookStore((state) => state.books);
  const { placeOrder, isSubmitting, error, clearError } = useCheckout();

  const [deliveryAddress, setDeliveryAddress] = useState('г. Алматы, пр. Достык 12, кв. 45');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kaspi_qr');

  const { totalPrice } = getPopulatedCart(cartItems, catalogBooks);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const order = await placeOrder({
        deliveryAddress,
        paymentMethod,
      });
      onSuccess(order.id);
    } catch {
      // error is handled in useCheckout
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Оформление заказа"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Адрес доставки"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Город, улица, дом, квартира"
          required
        />

        <div>
          <label className="block text-xs font-semibold text-gh-fg mb-1.5">
            Способ оплаты
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('kaspi_qr')}
              className={`p-2.5 rounded-md border text-left flex flex-col gap-1 transition-colors ${
                paymentMethod === 'kaspi_qr'
                  ? 'border-gh-accent bg-gh-overlay'
                  : 'border-gh-border bg-gh-canvas hover:bg-gh-subtle'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gh-fg">
                <QrCode className="w-3.5 h-3.5" />
                <span>Kaspi QR</span>
              </div>
              <span className="text-[10px] text-gh-muted">
                Быстрая оплата
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-2.5 rounded-md border text-left flex flex-col gap-1 transition-colors ${
                paymentMethod === 'card'
                  ? 'border-gh-accent bg-gh-overlay'
                  : 'border-gh-border bg-gh-canvas hover:bg-gh-subtle'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gh-fg">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Карта</span>
              </div>
              <span className="text-[10px] text-gh-muted">
                Visa / MasterCard
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash_on_delivery')}
              className={`p-2.5 rounded-md border text-left flex flex-col gap-1 transition-colors ${
                paymentMethod === 'cash_on_delivery'
                  ? 'border-gh-accent bg-gh-overlay'
                  : 'border-gh-border bg-gh-canvas hover:bg-gh-subtle'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gh-fg">
                <Banknote className="w-3.5 h-3.5" />
                <span>Наличными</span>
              </div>
              <span className="text-[10px] text-gh-muted">
                Курьеру
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="border border-gh-danger-border bg-gh-danger-bg text-gh-danger text-xs p-2.5 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-gh-canvas border border-gh-border p-2.5 rounded-md text-xs flex justify-between font-semibold text-gh-fg">
          <span>Сумма к оплате:</span>
          <span className="font-mono">{formatKZT(totalPrice)}</span>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Подтвердить заказ
          </Button>
        </div>
      </form>
    </Modal>
  );
};
