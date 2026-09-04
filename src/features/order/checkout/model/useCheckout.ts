import { useState } from 'react';
import { useCartStore, getPopulatedCart } from '../../../../entities/cart';
import { useAuthStore } from '../../../../entities/user';
import { useBookStore } from '../../../../entities/book';
import { useOrderStore } from '../../../../entities/order';
import type { Order, OrderItem, PaymentMethod } from '../../../../entities/order';
import { formatKZT } from '../../../../shared/lib/format';

export interface CheckoutParams {
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}

export interface UseCheckoutReturn {
  isSubmitting: boolean;
  error: string | null;
  placeOrder: (params: CheckoutParams) => Promise<Order>;
  clearError: () => void;
}

export function useCheckout(): UseCheckoutReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const catalogBooks = useBookStore((state) => state.books);
  const decreaseStock = useBookStore((state) => state.decreaseStock);
  const user = useAuthStore((state) => state.user);
  const updateBalance = useAuthStore((state) => state.updateBalance);
  const createOrder = useOrderStore((state) => state.createOrder);

  const placeOrder = async ({ deliveryAddress, paymentMethod }: CheckoutParams): Promise<Order> => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (!deliveryAddress.trim()) {
        throw new Error('Укажите адрес доставки');
      }

      const { populatedItems, totalPrice } = getPopulatedCart(cartItems, catalogBooks);

      if (populatedItems.length === 0) {
        throw new Error('Корзина пуста');
      }

      // 1. Validate stock availability for each item
      for (const item of populatedItems) {
        if (item.book.stock < item.quantity) {
          throw new Error(
            `Недостаточно товара «${item.book.title}» на складе. Доступно: ${item.book.stock} шт.`
          );
        }
      }

      // 2. Validate wallet balance if paying via Kaspi Wallet
      const userBalance = user?.balance || 0;
      if (paymentMethod === 'wallet' && userBalance < totalPrice) {
        throw new Error(
          `Недостаточно средств на кошельке. Баланс: ${formatKZT(userBalance)}, сумма заказа: ${formatKZT(totalPrice)}`
        );
      }

      // 3. Prepare immutable historical snapshot of ordered items
      const snapshotItems: OrderItem[] = populatedItems.map(({ book, quantity }) => ({
        bookId: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        priceAtOrder: book.price,
        quantity,
      }));

      // 4. Atomically decrease stock
      for (const item of populatedItems) {
        await decreaseStock(item.book.id, item.quantity);
      }

      // 5. Deduct payment if wallet
      if (paymentMethod === 'wallet') {
        updateBalance(-totalPrice);
      }

      // 6. Record order in order repository
      const createdOrder = await createOrder({
        userId: user?.id || 'guest-user',
        items: snapshotItems,
        totalPrice,
        deliveryAddress,
        paymentMethod,
      });

      // 7. Clear cart
      clearCart();

      return createdOrder;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Произошла ошибка при оформлении заказа';
      setError(message);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    placeOrder,
    clearError: () => setError(null),
  };
}
