import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, PackageCheck, CreditCard, Trash2 } from 'lucide-react';
import { useOrderStore } from '../../entities/order/model/orderStore';
import { useCartStore, getPopulatedCart } from '../../entities/cart/model/cartStore';
import { useBookStore } from '../../entities/book/model/bookStore';
import { useAuthStore } from '../../entities/user/model/authStore';
import { formatKZT, formatDate } from '../../shared/lib/format';
import { SafeImage } from '../../shared/ui/SafeImage/SafeImage';
import { useToastStore } from '../../shared/lib/toast/useToastStore';

export const ClientDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { orders, fetchOrders, createOrder } = useOrderStore();
  const { items: cartItems, removeItem, updateQuantity, clearCart } = useCartStore();
  const { books, fetchBooks } = useBookStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    fetchOrders();
    fetchBooks();
  }, [fetchOrders, fetchBooks]);

  const { populatedItems, totalPrice, totalCount } = getPopulatedCart(cartItems, books);

  const handleCheckout = async () => {
    if (populatedItems.length === 0 || !user) return;

    try {
      await createOrder({
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
        deliveryAddress: 'г. Алматы, пр. Абая 150',
        paymentMethod: 'kaspi_qr',
      });

      clearCart();
      addToast({
        type: 'success',
        message: 'Заказ успешно оформлен через Kaspi QR!',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Ошибка при оформлении заказа',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-100">
          {t('dashboard.client.title')}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Добро пожаловать, {user?.name || 'Покупатель'}.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Всего заказов</span>
            <ShoppingBag className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {orders.length}
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Товаров в корзине</span>
            <PackageCheck className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {totalCount}
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Сумма в корзине</span>
            <CreditCard className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {formatKZT(totalPrice)}
          </div>
        </div>
      </div>

      {/* Cart Section if items exist */}
      {populatedItems.length > 0 && (
        <section className="p-6 bg-zinc-950 border border-zinc-800 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Текущая корзина ({totalCount})
            </h2>
            <button
              onClick={clearCart}
              className="text-xs text-rose-400 hover:underline font-mono"
            >
              Очистить корзину
            </button>
          </div>

          <div className="divide-y divide-zinc-900">
            {populatedItems.map((item) => (
              <div key={item.bookId} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-16 shrink-0 rounded overflow-hidden border border-zinc-800 bg-zinc-900">
                    <SafeImage src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <Link to={`/catalog/${item.book.id}`} className="text-xs font-medium text-zinc-200 hover:text-white truncate block">
                      {item.book.title}
                    </Link>
                    <div className="text-[11px] text-zinc-500">{item.book.author}</div>
                    <div className="text-xs font-mono font-semibold text-zinc-200 mt-1">
                      {formatKZT(item.book.price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center border border-zinc-800 rounded bg-zinc-900 text-xs">
                    <button
                      onClick={() => updateQuantity(item.bookId, item.quantity - 1, item.book.stock)}
                      className="px-2 py-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 font-mono font-semibold text-zinc-100">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.bookId, item.quantity + 1, item.book.stock)}
                      className="px-2 py-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.bookId)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-mono font-bold text-zinc-100">
              Итого к оплате: {formatKZT(totalPrice)}
            </div>
            <button
              onClick={handleCheckout}
              className="w-full sm:w-auto px-6 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded transition-colors"
            >
              Оформить заказ (Kaspi QR)
            </button>
          </div>
        </section>
      )}

      {/* Orders History Section */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          {t('dashboard.client.recentOrders')}
        </h2>

        {orders.length === 0 ? (
          <div className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-500">
            {t('dashboard.client.emptyOrders')}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 bg-zinc-950 border border-zinc-800 rounded space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-zinc-100">{order.id}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-500 font-mono">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-700">
                    {order.status}
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.bookId} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 shrink-0 rounded overflow-hidden border border-zinc-800 bg-zinc-900">
                          <SafeImage src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-medium text-zinc-200">{item.title}</span>
                          <span className="text-zinc-500 font-mono ml-2">x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-zinc-100">
                        {formatKZT(item.priceAtOrder * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-900 flex justify-between text-xs">
                  <span className="text-zinc-500">Адрес доставки: {order.deliveryAddress}</span>
                  <span className="font-mono font-bold text-zinc-100">
                    {formatKZT(order.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
