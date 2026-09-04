import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCartStore, CartItemRow, getPopulatedCart } from '../../../entities/cart';
import { useBookStore } from '../../../entities/book';
import { CartQuantityControl } from '../../../features/cart/change-quantity';
import { CheckoutModal } from '../../../features/order/checkout';
import { CartSummary } from '../../../widgets/cart-summary';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { ROUTES } from '../../../shared/config/routes';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const catalogBooks = useBookStore((state) => state.books);
  const fetchBooks = useBookStore((state) => state.fetchBooks);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const { populatedItems, totalCount } = getPopulatedCart(cartItems, catalogBooks);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  if (cartItems.length === 0 && !isSuccessModalOpen) {
    return (
      <EmptyState
        icon={<ShoppingBag className="w-6 h-6" />}
        title="Корзина пуста"
        description="В корзине нет выбранных товаров"
        actionText="Перейти в каталог"
        onAction={() => navigate(ROUTES.CLIENT.CATALOG)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-gh-border">
        <div>
          <h1 className="text-xl font-semibold text-gh-fg">
            Корзина товаров
          </h1>
          <p className="text-xs text-gh-muted">
            {totalCount} позиций к оформлению
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gh-muted hover:text-gh-danger hover:underline"
        >
          Очистить все
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-2">
          {populatedItems.map((item) => (
            <CartItemRow
              key={item.bookId}
              item={item}
              quantityControlSlot={<CartQuantityControl item={item} />}
            />
          ))}
        </div>

        {/* Summary Widget */}
        <div className="space-y-3">
          <CartSummary onCheckout={() => setIsCheckoutOpen(true)} />
        </div>
      </div>

      {/* Checkout Feature Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={(orderId) => {
          setCreatedOrderId(orderId);
          setIsCheckoutOpen(false);
          setIsSuccessModalOpen(true);
        }}
      />

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate(ROUTES.CLIENT.ORDERS);
        }}
        title="Заказ оформлен"
        maxWidth="sm"
      >
        <div className="text-center space-y-3 py-2">
          <div className="w-10 h-10 rounded-full border border-gh-success-border bg-gh-success-bg text-gh-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gh-fg">
              Заказ #{createdOrderId}
            </h3>
            <p className="text-xs text-gh-muted mt-1">
              Заказ принят в обработку и передан в службу доставки Kaspi.
            </p>
          </div>

          <Button
            fullWidth
            variant="primary"
            onClick={() => {
              setIsSuccessModalOpen(false);
              navigate(ROUTES.CLIENT.ORDERS);
            }}
          >
            Перейти к заказам
          </Button>
        </div>
      </Modal>
    </div>
  );
};
