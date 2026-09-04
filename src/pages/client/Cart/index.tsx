import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  Wallet,
  QrCode,
} from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useBookStore } from '../../../store/bookStore';
import { useOrderStore } from '../../../store/orderStore';
import { formatKZT } from '../../../utils/format';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { EmptyState } from '../../../components/shared/EmptyState';

export const ClientCartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { user, updateBalance } = useAuthStore();
  const decreaseStock = useBookStore((state) => state.decreaseStock);
  const createOrder = useOrderStore((state) => state.createOrder);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('г. Алматы, пр. Достык 12, кв. 45');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'kaspi_qr'>('wallet');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const totalPrice = getTotalPrice();
  const userBalance = user?.balance || 0;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (paymentMethod === 'wallet' && userBalance < totalPrice) {
      setErrorMessage(`Недостаточно средств. Баланс: ${formatKZT(userBalance)}. Сумма заказа: ${formatKZT(totalPrice)}`);
      return;
    }

    items.forEach((item) => {
      decreaseStock(item.book.id, item.quantity);
    });

    if (paymentMethod === 'wallet') {
      updateBalance(-totalPrice);
    }

    const newOrder = createOrder({
      userId: user?.id || 'guest-user',
      items: [...items],
      totalPrice,
      deliveryAddress,
      paymentMethod,
    });

    setLastCreatedOrderId(newOrder.id);
    clearCart();
    setIsCheckoutOpen(false);
    setIsSuccessModalOpen(true);
  };

  if (items.length === 0 && !isSuccessModalOpen) {
    return (
      <EmptyState
        icon={<ShoppingBag className="w-6 h-6" />}
        title="Корзина пуста"
        description="В корзине нет выбранных товаров"
        actionText="Перейти в каталог"
        onAction={() => navigate('/client/catalog')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl font-semibold text-[#1f2328]">
            Корзина товаров
          </h1>
          <p className="text-xs text-[#656d76]">
            {items.reduce((s, i) => s + i.quantity, 0)} позиций к оформлению
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#656d76] hover:text-[#cf222e] hover:underline"
        >
          Очистить все
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-2">
          {items.map(({ book, quantity }) => (
            <div
              key={book.id}
              className="bg-white rounded-md border border-[#d0d7de] p-3 shadow-gh-sm flex items-center gap-3"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-12 aspect-[3/4] object-cover rounded border border-[#d0d7de] filter grayscale contrast-[1.05] shrink-0"
              />

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono text-[#656d76] uppercase">
                  {book.genre}
                </span>
                <h3 className="text-xs font-semibold text-[#1f2328] truncate">
                  {book.title}
                </h3>
                <p className="text-[11px] text-[#656d76] truncate">{book.author}</p>
                <div className="text-xs font-bold text-[#1f2328] mt-0.5">
                  {formatKZT(book.price)}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-[#d0d7de] rounded-md bg-[#f6f8fa]">
                  <button
                    onClick={() => updateQuantity(book.id, quantity - 1)}
                    className="p-1 text-[#656d76] hover:text-[#1f2328]"
                    title="Уменьшить"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 text-xs font-mono font-medium text-[#1f2328]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(book.id, quantity + 1)}
                    disabled={quantity >= book.stock}
                    className="p-1 text-[#656d76] hover:text-[#1f2328] disabled:opacity-30"
                    title="Увеличить"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(book.id)}
                  className="p-1.5 text-[#656d76] hover:text-[#cf222e] rounded hover:bg-[#f6f8fa]"
                  title="Удалить"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-3">
          <div className="bg-white rounded-md border border-[#d0d7de] p-4 shadow-gh-sm space-y-3">
            <h3 className="font-semibold text-sm text-[#1f2328]">Итог заказа</h3>

            <div className="space-y-1.5 text-xs text-[#656d76]">
              <div className="flex justify-between">
                <span>Товары ({items.reduce((s, i) => s + i.quantity, 0)} шт.)</span>
                <span className="font-mono text-[#1f2328]">{formatKZT(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kaspi Доставка</span>
                <span className="text-[#1f2328]">Бесплатно</span>
              </div>
            </div>

            <div className="border-t border-[#d0d7de] pt-2.5 flex justify-between items-baseline">
              <span className="text-xs font-semibold text-[#1f2328]">К оплате</span>
              <span className="text-base font-bold text-[#1f2328]">
                {formatKZT(totalPrice)}
              </span>
            </div>

            <Button
              fullWidth
              variant="primary"
              size="lg"
              onClick={() => setIsCheckoutOpen(true)}
            >
              Оформить заказ
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Оформление заказа"
        maxWidth="md"
      >
        <form onSubmit={handleCheckoutSubmit} className="space-y-3">
          <Input
            label="Адрес доставки"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-[#1f2328] mb-1.5">
              Способ оплаты
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-2.5 rounded-md border text-left flex flex-col gap-0.5 ${
                  paymentMethod === 'wallet'
                    ? 'border-[#1f2328] bg-[#f6f8fa]'
                    : 'border-[#d0d7de] bg-white hover:bg-[#f6f8fa]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1f2328]">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Kaspi Кошелек</span>
                </div>
                <span className="text-[11px] text-[#656d76]">
                  {formatKZT(userBalance)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('kaspi_qr')}
                className={`p-2.5 rounded-md border text-left flex flex-col gap-0.5 ${
                  paymentMethod === 'kaspi_qr'
                    ? 'border-[#1f2328] bg-[#f6f8fa]'
                    : 'border-[#d0d7de] bg-white hover:bg-[#f6f8fa]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1f2328]">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Kaspi QR</span>
                </div>
                <span className="text-[11px] text-[#656d76]">
                  Быстрая оплата
                </span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="border border-[#cf222e] bg-[#ffebe9] text-[#cf222e] text-xs p-2.5 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="bg-[#f6f8fa] border border-[#d0d7de] p-2.5 rounded-md text-xs flex justify-between font-semibold text-[#1f2328]">
            <span>Сумма списания:</span>
            <span className="font-mono">{formatKZT(totalPrice)}</span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCheckoutOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              Подтвердить заказ
            </Button>
          </div>
        </form>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/client/orders');
        }}
        title="Заказ оформлен"
        maxWidth="sm"
      >
        <div className="text-center space-y-3 py-2">
          <div className="w-10 h-10 rounded-full border border-[#d0d7de] bg-[#f6f8fa] text-[#1f2328] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1f2328]">
              Заказ #{lastCreatedOrderId}
            </h3>
            <p className="text-xs text-[#656d76] mt-1">
              Заказ принят в обработку и передан в службу доставки.
            </p>
          </div>

          <Button
            fullWidth
            variant="primary"
            onClick={() => {
              setIsSuccessModalOpen(false);
              navigate('/client/orders');
            }}
          >
            Перейти к заказам
          </Button>
        </div>
      </Modal>
    </div>
  );
};
