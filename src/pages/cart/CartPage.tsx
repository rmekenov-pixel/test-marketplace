import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CreditCard, QrCode } from 'lucide-react';
import { useCartStore, getPopulatedCart } from '../../entities/cart/model/cartStore';
import { useBookStore } from '../../entities/book/model/bookStore';
import { useOrderStore } from '../../entities/order/model/orderStore';
import { useAuthStore } from '../../entities/user/model/authStore';
import { formatKZT } from '../../shared/lib/format';
import { SafeImage } from '../../shared/ui/SafeImage/SafeImage';
import { useToastStore } from '../../shared/lib/toast/useToastStore';
import type { PaymentMethod } from '../../entities/order/model/types';

export const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items: cartItems, removeItem, updateQuantity, clearCart } = useCartStore();
  const { books, fetchBooks } = useBookStore();
  const { createOrder } = useOrderStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const [address, setAddress] = useState('г. Алматы, пр. Абая 150');
  const [phone, setPhone] = useState(user?.phone || '+7 777 123 4567');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kaspi_qr');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const { populatedItems, totalPrice, totalCount } = getPopulatedCart(cartItems, books);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (populatedItems.length === 0) return;

    if (!isAuthenticated || !user) {
      addToast({
        type: 'info',
        message: 'Для оформления заказа войдите в систему',
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        userId: user.id,
        items: populatedItems.map((item) => ({
          bookId: item.book.id,
          title: item.book.title,
          author: item.book.author,
          coverImage: item.book.coverImage,
          priceAtOrder: item.book.price,
          quantity: item.quantity,
        })),
        totalPrice,
        deliveryAddress: address,
        paymentMethod,
      });

      clearCart();
      addToast({
        type: 'success',
        message: 'Заказ успешно создан!',
      });
      navigate('/checkout/success', { state: { order } });
    } catch {
      addToast({
        type: 'error',
        message: 'Ошибка оформления заказа',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-100 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-zinc-400" />
          <span>{t('nav.cart')}</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1 font-mono">
          {totalCount > 0 ? `В корзине ${totalCount} товаров` : 'Ваша корзина пуста'}
        </p>
      </div>

      {populatedItems.length === 0 ? (
        <div className="p-16 text-center bg-zinc-950 border border-zinc-800 rounded space-y-4">
          <ShoppingBag className="w-10 h-10 text-zinc-700 mx-auto stroke-1" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">
              В вашей корзине пока ничего нет
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Выберите интересные книги в каталоге и добавьте их сюда.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 text-xs font-semibold rounded hover:bg-zinc-200 transition-colors"
          >
            <span>Перейти к покупкам</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Список товаров
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-400 hover:underline font-mono"
                >
                  Очистить всё
                </button>
              </div>

              <div className="divide-y divide-zinc-900">
                {populatedItems.map((item) => (
                  <div key={item.bookId} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-20 shrink-0 rounded overflow-hidden border border-zinc-800 bg-zinc-900">
                        <SafeImage src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <Link
                          to={`/catalog/${item.book.id}`}
                          className="text-sm font-medium text-zinc-100 hover:text-zinc-300 truncate block"
                        >
                          {item.book.title}
                        </Link>
                        <div className="text-xs text-zinc-500">{item.book.author}</div>
                        <div className="text-xs font-mono font-semibold text-zinc-200 mt-1">
                          {formatKZT(item.book.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center border border-zinc-800 rounded bg-zinc-900 text-xs">
                        <button
                          onClick={() => updateQuantity(item.bookId, item.quantity - 1, item.book.stock)}
                          className="px-2.5 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 font-mono font-bold text-zinc-100">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.bookId, item.quantity + 1, item.book.stock)}
                          className="px-2.5 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <span className="text-xs font-mono font-bold text-zinc-100">
                          {formatKZT(item.subtotal)}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.bookId)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                        aria-label="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-4">
            <form
              onSubmit={handleCheckout}
              className="sticky top-24 p-6 bg-zinc-950 border border-zinc-800 rounded space-y-4"
            >
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3">
                Оформление заказа
              </h2>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Адрес доставки
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="г. Алматы, ул. Абая 150"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Телефон
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+7 777 123 4567"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Способ оплаты
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kaspi_qr')}
                    className={`p-2.5 rounded border text-xs font-medium flex flex-col items-center gap-1.5 transition-colors ${
                      paymentMethod === 'kaspi_qr'
                        ? 'border-zinc-500 bg-zinc-900 text-zinc-100 font-semibold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>Kaspi QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded border text-xs font-medium flex flex-col items-center gap-1.5 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-zinc-500 bg-zinc-900 text-zinc-100 font-semibold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Карта</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Товары ({totalCount} шт.)</span>
                  <span className="font-mono">{formatKZT(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Доставка</span>
                  <span className="text-zinc-200 font-mono">Бесплатно</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                  <span>Итого</span>
                  <span className="font-mono">{formatKZT(totalPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-50 text-zinc-950 font-semibold text-xs rounded transition-colors"
              >
                {isSubmitting ? 'Создание заказа...' : 'Оплатить и оформить'}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 pt-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>Безопасный платежный шлюз РК</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
