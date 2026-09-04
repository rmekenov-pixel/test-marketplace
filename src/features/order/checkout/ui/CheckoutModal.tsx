import React, { useState } from 'react';
import { Wallet, QrCode } from 'lucide-react';
import { useCartStore } from '../../../../entities/cart';
import { useAuthStore } from '../../../../entities/user';
import { useBookStore } from '../../../../entities/book';
import { useOrderStore } from '../../../../entities/order';
import type { PaymentMethod } from '../../../../entities/order';
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
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user, updateBalance } = useAuthStore();
  const decreaseStock = useBookStore((state) => state.decreaseStock);
  const createOrder = useOrderStore((state) => state.createOrder);

  const [deliveryAddress, setDeliveryAddress] = useState('г. Алматы, пр. Достык 12, кв. 45');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = getTotalPrice();
  const userBalance = user?.balance || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (paymentMethod === 'wallet' && userBalance < totalPrice) {
      setErrorMessage(
        `Недостаточно средств. Баланс: ${formatKZT(userBalance)}. Сумма заказа: ${formatKZT(totalPrice)}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      for (const item of items) {
        await decreaseStock(item.book.id, item.quantity);
      }

      if (paymentMethod === 'wallet') {
        updateBalance(-totalPrice);
      }

      const newOrder = await createOrder({
        userId: user?.id || 'guest-user',
        items: [...items],
        totalPrice,
        deliveryAddress,
        paymentMethod,
      });

      clearCart();
      onSuccess(newOrder.id);
    } catch {
      setErrorMessage('Не удалось оформить заказ. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Оформление заказа"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Адрес доставки"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-[#f0f6fc] mb-1.5">
            Способ оплаты
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('wallet')}
              className={`p-2.5 rounded-md border text-left flex flex-col gap-0.5 transition-colors ${
                paymentMethod === 'wallet'
                  ? 'border-[#388bfd] bg-[#21262d]'
                  : 'border-[#30363d] bg-[#0d1117] hover:bg-[#161b22]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f0f6fc]">
                <Wallet className="w-3.5 h-3.5" />
                <span>Kaspi Кошелек</span>
              </div>
              <span className="text-[11px] text-[#8d96a0]">
                {formatKZT(userBalance)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('kaspi_qr')}
              className={`p-2.5 rounded-md border text-left flex flex-col gap-0.5 transition-colors ${
                paymentMethod === 'kaspi_qr'
                  ? 'border-[#388bfd] bg-[#21262d]'
                  : 'border-[#30363d] bg-[#0d1117] hover:bg-[#161b22]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f0f6fc]">
                <QrCode className="w-3.5 h-3.5" />
                <span>Kaspi QR</span>
              </div>
              <span className="text-[11px] text-[#8d96a0]">
                Быстрая оплата
              </span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="border border-[#da3633] bg-[#da3633]/15 text-[#f85149] text-xs p-2.5 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="bg-[#0d1117] border border-[#30363d] p-2.5 rounded-md text-xs flex justify-between font-semibold text-[#f0f6fc]">
          <span>Сумма списания:</span>
          <span className="font-mono">{formatKZT(totalPrice)}</span>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
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
